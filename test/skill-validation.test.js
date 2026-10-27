import { writeFile, readFile, mkdtemp, mkdir, rm } from 'node:fs/promises'
import { onTestFinished, describe, expect, it, vi } from 'vitest'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

import { validateSkill } from '../scripts/lib/skill-validation.js'

vi.mock(import('node:fs/promises'), async importOriginal => {
  let actual = await importOriginal()
  return { ...actual, readFile: vi.fn(actual.readFile) }
})

let frontmatter =
  '---\nname: example\ndescription: Edits technical text.\n---\n'

async function fixture(files = {}) {
  let directory = await mkdtemp(join(tmpdir(), 'skill-validation-'))
  let skill = join(directory, 'example')
  onTestFinished(() => rm(directory, { recursive: true, force: true }))
  let entries = Object.entries({
    'SKILL.md': `${frontmatter}# Example\n[Rule](rules/example.md)\n`,
    'rules/example.md': '# Rule\n[Home](../SKILL.md#example)\n',
    ...files,
  })
  await Promise.all(
    entries.map(async ([name, content]) => {
      let path = join(skill, name)
      await mkdir(join(path, '..'), { recursive: true })
      await writeFile(path, content)
    }),
  )
  return skill
}

function messages(result) {
  return result.errors.map(error => error.message).join('\n')
}

describe('validateSkill', () => {
  it('validates a skill and its nested rules', async () => {
    let skill = await fixture({
      'rules/nested/more.md': '# Details\n[Home](../../SKILL.md#example)\n',
      'rules/example.md': '# Rule\n[More](nested/more.md#details)\n',
    })
    let result = await validateSkill(skill)
    expect(result.errors).toStrictEqual([])
    expect(result.filesChecked).toBe(3)
    expect(result.ruleCount).toBe(2)
  })

  it('rejects malformed YAML and duplicate keys', async () => {
    await Promise.all(
      ['name: [broken', 'name: example\nname: duplicate'].map(async content => {
        let skill = await fixture({
          'SKILL.md': `---\n${content}\ndescription: Edits text.\n---\n`,
        })
        expect(messages(await validateSkill(skill))).toMatch(/Invalid YAML/u)
      }),
    )
  })

  it('requires a frontmatter mapping and nonempty string fields', async () => {
    let cases = [
      '- example',
      'name: example\ndescription: 42',
      'name: example\ndescription: " "',
    ]
    await Promise.all(
      cases.map(async content => {
        let skill = await fixture({
          'SKILL.md': `---\n${content}\n---\n`,
        })
        expect((await validateSkill(skill)).errors).not.toHaveLength(0)
      }),
    )
    let skill = await fixture({ 'SKILL.md': '# Example\n' })
    expect(messages(await validateSkill(skill))).toMatch(/frontmatter/u)
  })

  it('enforces name syntax, length, and agreement with its directory', async () => {
    let names = [
      'wrong',
      'Example',
      '-example',
      'example-',
      'ex--ample',
      'ex_ample',
      'a'.repeat(65),
    ]
    await Promise.all(
      names.map(async name => {
        let skill = await fixture({
          'SKILL.md': `---\nname: ${name}\ndescription: Edits text.\n---\n`,
        })
        expect(messages(await validateSkill(skill))).toMatch(/name/u)
      }),
    )
  })

  it('accepts 1024 description characters and rejects 1025', async () => {
    await Promise.all(
      [
        [1024, 0],
        [1025, 1],
      ].map(async ([length, errors]) => {
        let skill = await fixture({
          'SKILL.md': `---\nname: example\ndescription: ${'a'.repeat(length)}\n---\n[Rule](rules/example.md)\n# Example\n`,
        })
        let result = await validateSkill(skill)
        expect(result.errors).toHaveLength(errors)
      }),
    )
  })

  it('counts physical lines and requires SKILL.md to have fewer than 500', async () => {
    let base = `${frontmatter}# Example\n[Rule](rules/example.md)\n`
    await Promise.all(
      [499, 500].map(async count => {
        let skill = await fixture({
          'SKILL.md': base + '\n'.repeat(count - 6),
        })
        expect(/500 lines/u.test(messages(await validateSkill(skill)))).toBe(
          count === 500,
        )
      }),
    )
  })

  it('uses rendered heading text and GitHub duplicate-heading anchors', async () => {
    let skill = await fixture({
      'rules/example.md': [
        '# `git reset` and [the **index**](../SKILL.md)',
        '# Repeat',
        '# Repeat',
        '# Repeat-1',
        '# Repeat',
        'Underlined title',
        '------------',
        '[Code](#git-reset-and-the-index)',
        '[Second](#repeat-1)',
        '[Collision](#repeat-1-1)',
        '[Third](#repeat-2)',
        '[Underlined](#underlined-title)',
      ].join('\n'),
    })
    expect((await validateSkill(skill)).errors).toStrictEqual([])
  })

  it('ignores fenced and inline code while checking real Markdown links', async () => {
    let skill = await fixture({
      'rules/example.md': [
        '# Rule',
        '```md',
        '# Not a heading',
        '[Missing](missing.md)',
        '```',
        '~~~md',
        '[Missing](also-missing.md)',
        '~~~',
        '`[Missing](inline.md)`',
        '[Home](../SKILL.md#example)',
      ].join('\n'),
    })
    expect((await validateSkill(skill)).errors).toStrictEqual([])
  })

  it('does not create heading anchors from fenced examples', async () => {
    let skill = await fixture({
      'rules/example.md': '```md\n# Hidden\n```\n[Wrong](#hidden)\n',
    })
    expect(messages(await validateSkill(skill))).toMatch(/anchor.*hidden/u)
  })

  it('resolves reference links, encoded paths, fragments, and spaces', async () => {
    let skill = await fixture({
      'rules/example.md': [
        '[Encoded][target]',
        '[Spaces](<nested/other rule.md#greek-\u{3B1}\u{3B2}>)',
        '[With query](nested/other%20rule.md?raw=1#greek-\u{3B1}\u{3B2})',
        '[target]: nested/other%20rule.md#greek-%CE%B1%CE%B2',
      ].join('\n'),
      'rules/nested/other rule.md': '# Greek \u{3B1}\u{3B2}\n',
    })
    expect((await validateSkill(skill)).errors).toStrictEqual([])
  })

  it('reports missing files, broken anchors, malformed escapes, and orphan rules', async () => {
    let skill = await fixture({
      'rules/example.md':
        '[Gone](missing.md)\n[Anchor](../SKILL.md#missing)\n[Escape](bad%GG.md)\n',
      'rules/orphan.md': '# Orphan\n',
    })
    let result = messages(await validateSkill(skill))
    expect(result).toMatch(/missing\.md/u)
    expect(result).toMatch(/anchor.*missing/u)
    expect(result).toMatch(/URL encoding/u)
    expect(result).toMatch(/reachable from SKILL\.md/u)
  })

  it('checks Markdown in disconnected files and ignores external URLs', async () => {
    let skill = await fixture({
      'rules/example.md':
        '[Web](https://example.invalid/#missing)\n[Mail](mailto:team@example.invalid)\n',
      'notes.md': '[Gone](missing.md)\n',
    })
    let result = await validateSkill(skill)
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0].file).toMatch(/notes\.md$/u)
  })

  it('an image reference does not make a rule reachable', async () => {
    let skill = await fixture({
      'SKILL.md': `${frontmatter}# Example\n![Rule](rules/example.md)\n`,
    })
    expect(messages(await validateSkill(skill))).toMatch(
      /reachable from SKILL\.md/u,
    )
  })

  it('decodes HTML entities in prose headings and links, preserving code and escapes', async () => {
    let skill = await fixture({
      'rules/example.md': [
        '# A &amp; B',
        '# Numeric &#65;',
        '# `&amp;`',
        String.raw`# \&amp;`,
        '[Prose](#a--b)',
        '[Numeric](#numeric-a)',
        '[Code](#amp)',
        '[Escape](#amp-1)',
        '[File](other&amp;file.md#details)',
      ].join('\n'),
      'rules/other&file.md': '# Details\n',
    })
    expect((await validateSkill(skill)).errors).toStrictEqual([])
  })

  it('reports a skill directory that cannot be read', async () => {
    let missing = join(await fixture(), 'missing')
    await expect(validateSkill(missing)).resolves.toStrictEqual({
      errors: [
        {
          message: expect.stringMatching(
            /^Cannot read skill directory: ENOENT/u,
          ),
          file: missing,
        },
      ],
      filesChecked: 0,
      ruleCount: 0,
    })
  })

  it('requires SKILL.md at the skill root', async () => {
    let skill = await fixture()
    await rm(join(skill, 'SKILL.md'))
    let rule = join(skill, 'rules/example.md')
    await expect(validateSkill(skill)).resolves.toStrictEqual({
      errors: [
        {
          message:
            'Link "../SKILL.md#example" points to a missing or unreadable path.',
          file: rule,
        },
        {
          message:
            'Rule is not reachable from SKILL.md through Markdown links.',
          file: rule,
        },
        {
          message: 'Missing readable SKILL.md.',
          file: join(skill, 'SKILL.md'),
        },
      ],
      filesChecked: 1,
      ruleCount: 1,
    })
  })

  it('reports Markdown files that cannot be read', async () => {
    let skill = await fixture()
    let skillFile = join(skill, 'SKILL.md')
    onTestFinished(() => vi.mocked(readFile).mockReset())
    vi.mocked(readFile).mockRejectedValueOnce(
      new Error('EACCES: permission denied'),
    )
    await expect(validateSkill(skill)).resolves.toStrictEqual({
      errors: [
        {
          message:
            'Rule is not reachable from SKILL.md through Markdown links.',
          file: join(skill, 'rules/example.md'),
        },
        {
          message: 'Cannot read Markdown: EACCES: permission denied',
          file: skillFile,
        },
        { message: 'Missing readable SKILL.md.', file: skillFile },
      ],
      filesChecked: 1,
      ruleCount: 1,
    })
  })

  it('checks anchors in linked Markdown outside the skill without validating it', async () => {
    let skill = await fixture({
      'rules/example.md': [
        '# Rule',
        '[Home](../SKILL.md#example)',
        '[Shared](../../shared.md#shared-notes)',
        '[Gone](../../shared.md#gone)',
      ].join('\n'),
    })
    await writeFile(
      join(skill, '../shared.md'),
      '# Shared notes\n[Not checked](missing.md)\n',
    )
    await expect(validateSkill(skill)).resolves.toStrictEqual({
      errors: [
        {
          message: 'Missing anchor "gone" in link "../../shared.md#gone".',
          file: join(skill, 'rules/example.md'),
        },
      ],
      filesChecked: 2,
      ruleCount: 1,
    })
  })

  it('reports anchored links to Markdown targets that cannot be read', async () => {
    let skill = await fixture({
      'rules/example.md':
        '# Rule\n[Home](../SKILL.md#example)\n[Folder](folder.md#top)\n',
    })
    await mkdir(join(skill, 'rules/folder.md'))
    expect((await validateSkill(skill)).errors).toStrictEqual([
      {
        message: expect.stringMatching(
          /^Cannot read link target "folder\.md#top": EISDIR/u,
        ),
        file: join(skill, 'rules/example.md'),
      },
    ])
  })

  it('checks only Markdown files and matches the extension in any case', async () => {
    let skill = await fixture({
      'rules/example.md':
        '# Rule\n[Upper](upper.MD#upper)\n[Gone](upper.MD#gone)\n',
      'rules/upper.MD': '# Upper\n[Home](../SKILL.md#example)\n',
      'scripts/tool.py': 'print("[Gone](missing.md)")\n',
      'rules/notes.txt': '[Gone](missing.md)\n',
    })
    await expect(validateSkill(skill)).resolves.toStrictEqual({
      errors: [
        {
          message: 'Missing anchor "gone" in link "upper.MD#gone".',
          file: join(skill, 'rules/example.md'),
        },
      ],
      filesChecked: 3,
      ruleCount: 2,
    })
  })

  it.each([
    { yaml: 'description: Edits text.', name: 'a missing name' },
    { yaml: 'name: 42\ndescription: Edits text.', name: 'a numeric name' },
    { yaml: 'name: " "\ndescription: Edits text.', name: 'a blank name' },
  ])('rejects $name in frontmatter', async ({ yaml }) => {
    let skill = await fixture({
      'SKILL.md': `---\n${yaml}\n---\n# Example\n[Rule](rules/example.md)\n`,
    })
    expect((await validateSkill(skill)).errors).toStrictEqual([
      {
        message: 'Frontmatter name must be a nonempty string.',
        file: join(skill, 'SKILL.md'),
      },
    ])
  })

  it('requires a closing frontmatter delimiter', async () => {
    let skill = await fixture({
      'SKILL.md':
        '---\nname: example\ndescription: Edits text.\n\n# Example\n[Rule](rules/example.md)\n',
    })
    expect((await validateSkill(skill)).errors).toStrictEqual([
      {
        message: 'SKILL.md must start with YAML frontmatter between --- lines.',
        file: join(skill, 'SKILL.md'),
      },
    ])
  })

  it('accepts a byte order mark and Windows line endings', async () => {
    let bom = String.fromCodePoint(0xfe_ff)
    let skill = await fixture({
      'SKILL.md':
        `${bom}${frontmatter}# Example\n[Rule](rules/example.md)\n`.replaceAll(
          '\n',
          '\r\n',
        ),
      'rules/example.md': `${bom}# Rule\r\n[Home](../SKILL.md#example)\r\n`,
    })
    expect((await validateSkill(skill)).errors).toStrictEqual([])
  })

  it('drops inline HTML tags from heading anchors and keeps their text', async () => {
    let skill = await fixture({
      'rules/example.md': [
        '# Press <kbd>Ctrl</kbd> twice',
        '[Shortcut](#press-ctrl-twice)',
        '[Home](../SKILL.md#example)',
      ].join('\n'),
    })
    expect((await validateSkill(skill)).errors).toStrictEqual([])
  })
})
