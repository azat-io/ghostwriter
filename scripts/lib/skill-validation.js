import {
  basename,
  relative,
  dirname,
  extname,
  resolve,
  join,
  sep,
} from 'node:path'
import { readFile, readdir, stat } from 'node:fs/promises'
import { decodeHTMLStrict } from 'entities'
import GithubSlugger from 'github-slugger'
import { parseDocument } from 'yaml'
import { marked } from 'marked'

/**
 * Validate the installable skill directory without writing or running its
 * files.
 *
 * @param {string} directory - Directory containing SKILL.md.
 * @returns {Promise<object>} Errors and counts of checked Markdown files and
 *   rules.
 */
export async function validateSkill(directory) {
  let root = resolve(directory)
  let skillFile = join(root, 'SKILL.md')
  let errors = []
  function report(file, message) {
    errors.push({ message, file })
  }
  let documents = new Map()
  let result = { filesChecked: 0, ruleCount: 0, errors }
  let files
  try {
    files = await markdownFiles(root)
  } catch (error) {
    report(root, `Cannot read skill directory: ${error.message}`)
    return result
  }
  await Promise.all(
    files.map(async file => {
      try {
        let content = normalizeNewlines(await readFile(file, 'utf8'))
        if (file === skillFile) {
          validateFrontmatter(content, file, report)
          let lineCount =
            content.split('\n').length - Number(content.endsWith('\n'))
          if (lineCount >= 500) {
            report(
              file,
              `SKILL.md must have fewer than 500 lines; found ${lineCount}.`,
            )
          }
        }
        documents.set(file, parseMarkdown(content))
      } catch (error) {
        report(file, `Cannot read Markdown: ${error.message}`)
      }
    }),
  )
  result.filesChecked = documents.size
  if (!documents.has(skillFile)) {
    report(skillFile, 'Missing readable SKILL.md.')
  }

  // Cache linked documents outside the skill for anchor lookup, without expanding
  // this check into unrelated repository files.
  let targets = new Map(documents)
  await Promise.all(
    [...documents].map(async ([file, document]) => {
      await Promise.all(
        document.links.map(async ({ href, type }) => {
          let target
          try {
            target = localTarget(href, file)
          } catch {
            report(file, `Invalid URL encoding in link "${href}".`)
            return
          }
          if (!target) {
            return
          }
          try {
            await stat(target.path)
          } catch {
            report(
              file,
              `Link "${href}" points to a missing or unreadable path.`,
            )
            return
          }
          if (type === 'link') {
            document.targets.add(target.path)
          }
          if (target.anchor && extname(target.path).toLowerCase() === '.md') {
            try {
              if (!targets.has(target.path)) {
                targets.set(
                  target.path,
                  parseMarkdown(
                    normalizeNewlines(await readFile(target.path, 'utf8')),
                  ),
                )
              }
              if (!targets.get(target.path).anchors.has(target.anchor)) {
                report(
                  file,
                  `Missing anchor "${target.anchor}" in link "${href}".`,
                )
              }
            } catch (error) {
              report(
                file,
                `Cannot read link target "${href}": ${error.message}`,
              )
            }
          }
        }),
      )
    }),
  )

  let reachable = new Set()
  let queue = [skillFile]
  while (queue.length > 0) {
    let file = queue.pop()
    if (reachable.has(file)) {
      continue
    }
    reachable.add(file)
    let linked = documents.get(file)?.targets
    if (linked) {
      queue.push(...linked)
    }
  }
  let rulesRoot = join(root, 'rules')
  for (let file of files) {
    let path = relative(rulesRoot, file)
    if (path === '..' || path.startsWith(`..${sep}`)) {
      continue
    }
    result.ruleCount++
    if (!reachable.has(file)) {
      report(
        file,
        'Rule is not reachable from SKILL.md through Markdown links.',
      )
    }
  }
  result.errors = errors.toSorted(
    (left, right) =>
      left.file.localeCompare(right.file) ||
      left.message.localeCompare(right.message),
  )
  return result
}

function validateFrontmatter(content, file, report) {
  let parts = splitFrontmatter(content)
  if (!parts) {
    report(file, 'SKILL.md must start with YAML frontmatter between --- lines.')
    return
  }
  let data
  try {
    let document = parseDocument(parts.yaml)
    if (document.errors.length > 0) {
      throw document.errors[0]
    }
    data = document.toJS()
  } catch (error) {
    report(file, `Invalid YAML: ${error.message.split('\n', 1)[0]}`)
    return
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    report(file, 'YAML frontmatter must be a mapping.')
    return
  }
  let { description, name } = data
  if (typeof name === 'string' && name.trim()) {
    if (
      [...name].length > 64 ||
      name !== name.toLowerCase() ||
      !/^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u.test(name)
    ) {
      report(
        file,
        'Frontmatter name must be 1–64 lowercase letters or digits, separated by single hyphens.',
      )
    }
    if (name !== basename(dirname(file))) {
      report(
        file,
        `Frontmatter name must match directory name "${basename(dirname(file))}".`,
      )
    }
  } else {
    report(file, 'Frontmatter name must be a nonempty string.')
  }
  if (typeof description !== 'string' || !description.trim()) {
    report(file, 'Frontmatter description must be a nonempty string.')
  } else if ([...description].length > 1024) {
    report(file, 'Frontmatter description must not exceed 1024 characters.')
  }
}

function localTarget(rawHref, from) {
  let href = decodeHTMLStrict(rawHref)
  // Absolute URLs and web-root paths are outside this filesystem check.
  if (/^[a-z][\d+\-.a-z]*:/iu.test(href) || href.startsWith('/')) {
    return null
  }
  let hash = href.indexOf('#')
  let address = hash === -1 ? href : href.slice(0, hash)
  let pathname = decodeURIComponent(address.split('?', 1)[0])
  let anchor = hash === -1 ? '' : decodeURIComponent(href.slice(hash + 1))
  return { path: pathname ? resolve(dirname(from), pathname) : from, anchor }
}

function parseMarkdown(content) {
  let body = splitFrontmatter(content)?.body ?? content
  let tokens = marked.lexer(body)
  let slugger = new GithubSlugger()
  let anchors = new Set()
  let links = []
  marked.walkTokens(tokens, token => {
    if (token.type === 'heading') {
      anchors.add(slugger.slug(headingText(token.tokens)))
    } else if (token.type === 'link' || token.type === 'image') {
      links.push({ href: token.href, type: token.type })
    }
  })
  return { targets: new Set(), anchors, links }
}

async function markdownFiles(directory) {
  let entries = await readdir(directory, { withFileTypes: true })
  let files = await Promise.all(
    entries.map(entry => {
      let path = join(directory, entry.name)
      if (entry.isDirectory()) {
        return markdownFiles(path)
      }
      if (entry.isFile() && extname(path).toLowerCase() === '.md') {
        return [path]
      }
      return []
    }),
  )
  return files.flat().toSorted()
}

// Use inline tokens so code and link labels contribute text, not Markdown syntax.
function headingText(tokens) {
  return tokens
    .map(token => {
      if (token.tokens) {
        return headingText(token.tokens)
      }
      if (token.type === 'html' || token.type === 'br') {
        return ''
      }
      return token.type === 'codespan' || token.type === 'escape' ?
          token.text
        : decodeHTMLStrict(token.text)
    })
    .join('')
}

function splitFrontmatter(content) {
  let lines = content.split('\n')
  if (lines[0] !== '---') {
    return null
  }
  let closing = lines.findIndex((line, index) => index > 0 && line === '---')
  if (closing === -1) {
    return null
  }
  return {
    body: lines.slice(closing + 1).join('\n'),
    yaml: lines.slice(1, closing).join('\n'),
  }
}

function normalizeNewlines(content) {
  let text = content.codePointAt(0) === 0xfeff ? content.slice(1) : content
  return text.replaceAll(/\r\n?/gu, '\n')
}
