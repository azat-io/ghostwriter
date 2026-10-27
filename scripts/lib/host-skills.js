import { realpath, readdir, stat } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { homedir } from 'node:os'

/**
 * Find installed skill paths without reading skill, configuration, or auth
 * files. Both discovered aliases and resolved paths are returned so a runtime
 * can match either form when applying skills.config entries.
 *
 * @param {object} options - Optional explicit skill roots.
 * @returns {Promise<string[]>} Sorted, unique absolute file paths.
 */
export async function discoverHostSkills({ roots } = {}) {
  let skillRoots =
    roots === undefined ?
      [
        join(process.env.CODEX_HOME || join(homedir(), '.codex'), 'skills'),
        join(homedir(), '.agents', 'skills'),
      ]
    : roots
  if (!Array.isArray(skillRoots)) {
    throw new TypeError('Skill roots must be an array.')
  }
  let directories = await Promise.all(
    skillRoots.map(async root => {
      if (typeof root !== 'string' || !root.trim()) {
        throw new TypeError('Each skill root must be a nonempty path.')
      }
      let alias = resolve(root)
      let resolved
      try {
        resolved = await realpath(alias)
      } catch (error) {
        if (error.code === 'ENOENT') {
          return null
        }
        throw error
      }
      if (!(await stat(resolved)).isDirectory()) {
        throw new Error(`Skill root must be a directory: ${alias}`)
      }
      return { resolved, alias }
    }),
  )

  // Scan each physical directory once. Alias paths are expanded afterward, with
  // a separate ancestor set so multiple aliases survive but cycles terminate.
  let visited = new Map()
  async function scan(directory) {
    if (visited.has(directory)) {
      return
    }
    let node = { children: [], skill: null }
    visited.set(directory, node)
    let entries = await readdir(directory, { withFileTypes: true })
    let children = await Promise.all(
      entries.map(async entry => {
        let filename = join(directory, entry.name)
        let info = entry.isSymbolicLink() ? await stat(filename) : entry
        if (info.isDirectory()) {
          let resolved = await realpath(filename)
          await scan(resolved)
          return { name: entry.name, resolved }
        }
        if (entry.name === 'SKILL.md' && info.isFile()) {
          node.skill = await realpath(filename)
        }
        return null
      }),
    )
    node.children = children.filter(Boolean)
  }
  let existing = directories.filter(Boolean)
  await Promise.all(existing.map(directory => scan(directory.resolved)))

  let paths = new Set()
  function collect(directory, alias, ancestors) {
    if (ancestors.has(directory)) {
      return
    }
    ancestors.add(directory)
    let node = visited.get(directory)
    if (node.skill) {
      paths.add(join(alias, 'SKILL.md'))
      paths.add(node.skill)
    }
    for (let child of node.children) {
      collect(child.resolved, join(alias, child.name), ancestors)
    }
    ancestors.delete(directory)
  }
  for (let directory of existing) {
    collect(directory.resolved, directory.alias, new Set())
  }
  return [...paths].toSorted()
}
