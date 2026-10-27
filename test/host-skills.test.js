import {
  writeFile,
  realpath,
  mkdtemp,
  symlink,
  mkdir,
  rm,
} from 'node:fs/promises'
import { onTestFinished, describe, expect, it, vi } from 'vitest'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

import { discoverHostSkills } from '../scripts/lib/host-skills.js'

async function skill(directory) {
  await mkdir(directory, { recursive: true })
  let filename = join(directory, 'SKILL.md')
  await writeFile(filename, 'This content is not parsed as skill metadata.')
  return filename
}

async function fixture() {
  let directory = await mkdtemp(join(tmpdir(), 'host-skills-test-'))
  onTestFinished(() => rm(directory, { recursive: true, force: true }))
  return realpath(directory)
}

describe('discoverHostSkills', () => {
  it('finds nested skills in explicit roots without scanning nearby directories', async () => {
    let directory = await fixture()
    let root = join(directory, 'selected')
    let first = await skill(join(root, 'plain'))
    let nested = await skill(join(root, '.system', 'nested'))
    await skill(join(directory, 'outside'))
    await writeFile(join(root, 'README.md'), 'Not a skill.')
    await expect(discoverHostSkills({ roots: [root] })).resolves.toStrictEqual(
      [first, nested].toSorted(),
    )
  })

  it('missing roots and an explicit empty root list produce no skills', async () => {
    let directory = await fixture()
    await expect(
      discoverHostSkills({ roots: [join(directory, 'missing')] }),
    ).resolves.toStrictEqual([])
    await expect(discoverHostSkills({ roots: [] })).resolves.toStrictEqual([])
  })

  it('returns both alias and resolved paths for linked skill directories', async () => {
    let directory = await fixture()
    let root = join(directory, 'root')
    await mkdir(root)
    let source = join(directory, 'shared')
    let resolved = await skill(join(source, 'nested'))
    await symlink(source, join(root, 'linked'))
    await expect(discoverHostSkills({ roots: [root] })).resolves.toStrictEqual(
      [join(root, 'linked', 'nested', 'SKILL.md'), resolved].toSorted(),
    )
  })

  it('preserves every alias while deduplicating resolved paths and roots', async () => {
    let directory = await fixture()
    let root = join(directory, 'root')
    await mkdir(root)
    let source = join(directory, 'shared')
    let resolved = await skill(source)
    await symlink(source, join(root, 'first'))
    await symlink(source, join(root, 'second'))
    await expect(
      discoverHostSkills({ roots: [root, root, source] }),
    ).resolves.toStrictEqual(
      [
        join(root, 'first', 'SKILL.md'),
        join(root, 'second', 'SKILL.md'),
        resolved,
      ].toSorted(),
    )
  })

  it('directory cycles terminate without inventing repeated paths', async () => {
    let directory = await fixture()
    let root = join(directory, 'root')
    let first = await skill(root)
    let nested = await skill(join(root, 'child'))
    await symlink(root, join(root, 'child', 'back'))
    await symlink(root, join(root, 'self'))
    await expect(discoverHostSkills({ roots: [root] })).resolves.toStrictEqual(
      [first, nested].toSorted(),
    )
  })

  it('a linked root and a linked SKILL.md keep their usable paths', async () => {
    let directory = await fixture()
    let source = join(directory, 'source')
    await mkdir(source)
    let target = join(directory, 'skill-text.md')
    await writeFile(target, 'Not read by discovery.')
    await symlink(target, join(source, 'SKILL.md'))
    let alias = join(directory, 'alias')
    await symlink(source, alias)
    await expect(discoverHostSkills({ roots: [alias] })).resolves.toStrictEqual(
      [join(alias, 'SKILL.md'), target].toSorted(),
    )
  })

  it('invalid roots and broken links fail rather than hide discovery errors', async () => {
    let directory = await fixture()
    let file = join(directory, 'file')
    await writeFile(file, 'Not a directory.')
    await expect(discoverHostSkills({ roots: [file] })).rejects.toThrow(
      /directory/u,
    )
    await expect(discoverHostSkills({ roots: 'wrong' })).rejects.toThrow(
      /array/u,
    )
    await expect(discoverHostSkills({ roots: null })).rejects.toThrow(/array/u)
    await expect(discoverHostSkills({ roots: [''] })).rejects.toThrow(
      /nonempty/u,
    )
    let root = join(directory, 'root')
    await mkdir(root)
    await symlink(join(directory, 'missing'), join(root, 'broken'))
    await expect(discoverHostSkills({ roots: [root] })).rejects.toMatchObject({
      code: 'ENOENT',
    })
  })

  it('scans CODEX_HOME and the home agents directory by default', async () => {
    let directory = await fixture()
    let home = join(directory, 'home')
    let codexHome = join(directory, 'codex')
    let codex = await skill(join(codexHome, 'skills', 'codex-skill'))
    let agents = await skill(join(home, '.agents', 'skills', 'agents-skill'))
    await skill(join(home, '.codex', 'skills', 'replaced'))
    onTestFinished(() => vi.unstubAllEnvs())
    vi.stubEnv('CODEX_HOME', codexHome)
    vi.stubEnv('HOME', home)
    await expect(discoverHostSkills()).resolves.toStrictEqual(
      [codex, agents].toSorted(),
    )
  })

  it.each([
    { value: undefined, name: 'unset' },
    { name: 'empty', value: '' },
  ])(
    'falls back to the home codex directory when CODEX_HOME is $name',
    async ({ value }) => {
      let directory = await fixture()
      let home = join(directory, 'home')
      let codex = await skill(join(home, '.codex', 'skills', 'codex-skill'))
      onTestFinished(() => vi.unstubAllEnvs())
      vi.stubEnv('CODEX_HOME', value)
      vi.stubEnv('HOME', home)
      await expect(discoverHostSkills({})).resolves.toStrictEqual([codex])
    },
  )

  it('a root below a regular file fails with the filesystem error', async () => {
    let directory = await fixture()
    let file = join(directory, 'file')
    await writeFile(file, 'Not a directory.')
    await expect(
      discoverHostSkills({ roots: [join(file, 'skills')] }),
    ).rejects.toMatchObject({ code: 'ENOTDIR' })
  })
})
