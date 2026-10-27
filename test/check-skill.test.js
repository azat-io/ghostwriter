import { writeFile, realpath, mkdtemp, mkdir, rm } from 'node:fs/promises'
import { onTestFinished, describe, expect, it, vi } from 'vitest'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

import { checkSkill } from '../scripts/lib/check-skill.js'

let skillFiles = {
  'SKILL.md':
    '---\nname: ghostwriter\ndescription: Edits technical text.\n---\n# Ghostwriter\n[Rule](rules/example.md)\n',
  'rules/example.md': '# Rule\n[Home](../SKILL.md#ghostwriter)\n',
}

async function workspace(files = {}) {
  let directory = await realpath(
    await mkdtemp(join(tmpdir(), 'check-skill-test-')),
  )
  onTestFinished(() => rm(directory, { recursive: true, force: true }))
  let entries = Object.entries({ ...skillFiles, ...files })
  await Promise.all(
    entries.map(async ([name, content]) => {
      let path = join(directory, 'skills/ghostwriter', name)
      await mkdir(join(path, '..'), { recursive: true })
      await writeFile(path, content)
    }),
  )
  let previous = process.cwd()
  process.chdir(directory)
  onTestFinished(() => process.chdir(previous))
  return directory
}

function consoleSpies() {
  let error = vi.spyOn(console, 'error').mockImplementation(() => {})
  let info = vi.spyOn(console, 'info').mockImplementation(() => {})
  onTestFinished(() => {
    error.mockRestore()
    info.mockRestore()
  })
  return { error, info }
}

let brokenRule = { 'rules/example.md': '[Missing](missing.md)\n' }

describe('checkSkill', () => {
  it('prints usage and fails when given more than one directory', async () => {
    let output = consoleSpies()
    await expect(checkSkill(['first', 'second'])).resolves.toBe(1)
    expect(output.error.mock.calls).toStrictEqual([
      ['Usage: node scripts/check-skill.js [skill-directory]'],
    ])
    expect(output.info).not.toHaveBeenCalled()
  })

  it('prints each error relative to the working directory and fails', async () => {
    await workspace(brokenRule)
    let output = consoleSpies()
    await expect(checkSkill(['skills/ghostwriter'])).resolves.toBe(1)
    expect(output.error.mock.calls).toStrictEqual([
      [
        'skills/ghostwriter/rules/example.md: Link "missing.md" points to a missing or unreadable path.',
      ],
      ['Skill validation failed: 1 error(s).'],
    ])
    expect(output.info).not.toHaveBeenCalled()
  })

  it('checks skills/ghostwriter by default and reports counts on success', async () => {
    await workspace()
    let output = consoleSpies()
    await expect(checkSkill([])).resolves.toBe(0)
    expect(output.info.mock.calls).toStrictEqual([
      ['Skill validation passed: 2 Markdown files, 1 rules.'],
    ])
    expect(output.error).not.toHaveBeenCalled()
  })

  it(
    'cli entry passes its arguments and exits 0 on valid skills and 1 on invalid ones',
    { timeout: 30_000 },
    async () => {
      let directory = await workspace()
      let script = fileURLToPath(
        new URL('../scripts/check-skill.js', import.meta.url),
      )
      function run() {
        return spawnSync(process.execPath, [script, 'skills/ghostwriter'], {
          encoding: 'utf8',
          cwd: directory,
        })
      }
      let success = run()
      expect(success.status).toBe(0)
      expect(success.stderr).toBe('')
      expect(success.stdout).toBe(
        'Skill validation passed: 2 Markdown files, 1 rules.\n',
      )
      await writeFile(
        join(directory, 'skills/ghostwriter/rules/example.md'),
        brokenRule['rules/example.md'],
      )
      let result = run()
      expect(result.status).toBe(1)
      expect(result.stdout).toBe('')
      expect(result.stderr).toBe(
        'skills/ghostwriter/rules/example.md: Link "missing.md" points to a missing or unreadable path.\nSkill validation failed: 1 error(s).\n',
      )
    },
  )
})
