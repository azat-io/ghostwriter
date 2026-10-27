# Ghostwriter

<img
  src="https://raw.githubusercontent.com/azat-io/ghostwriter/main/assets/logo.svg"
  alt="Ghostwriter Logo"
  align="right"
  width="160"
/>

[![Code Coverage](https://img.shields.io/codecov/c/github/azat-io/ghostwriter.svg?color=7b6cf0&labelColor=17171c)](https://codecov.io/gh/azat-io/ghostwriter)
[![GitHub License](https://img.shields.io/badge/license-MIT-232428.svg?color=7b6cf0&labelColor=17171c)](https://github.com/azat-io/ghostwriter/blob/main/license.md)

An agent skill for writing and editing technical text.

Ghostwriter gives your agent rules for work texts such as docs, READMEs, PR
descriptions, incident updates, and cover letters. The agent cuts filler,
replaces judgments such as "fast" with facts, and keeps the author's voice. It
takes facts from your text, your notes, or sources such as code and Git history,
and names what's missing instead of inventing it.

## Example

You ask the agent to edit a README intro:

> Acme is a blazing-fast, next-generation CLI that makes deployments really
> easy. It is worth noting that it supports multiple cloud providers.

You add two facts: "`acme deploy` ships our sample app in 40 seconds on CI; it
deploys to AWS, GCP, and Azure." It returns:

> Acme is a CLI that deploys apps to AWS, GCP, and Azure. On CI, `acme deploy`
> takes 40 seconds for our sample app.

The reply lists cuts and gaps: no benchmark to compare the 40 seconds with, and
no confirmation that the cloud list is complete. Without the timing, the skill
tells the agent to remove "blazing-fast" and flag the missing benchmark.

The output is from one run in Claude Code with Claude Opus 5.5.

## Limits

- The rules and examples are in English. Regression tasks cover only English
  text.
- It won't make claims bigger than their facts. With few facts to work from, it
  may shorten the draft and list what's missing.
- Context use is large. A full writing, editing, or review task loads `SKILL.md`
  and ten core rule files, more than 17,000 words, before any genre rules, even
  for one paragraph.
- Static checks and test cases alone do not establish writing quality across
  agents and models; see [Evaluation](#evaluation).

## Installation

```sh
npx skills add azat-io/ghostwriter --skill ghostwriter
```

[Skills](https://github.com/vercel-labs/skills) installs it for the agents you
choose, in the current project by default; add `-g` to install it for all your
projects. For manual installation in Claude Code, copy `skills/ghostwriter` to
`~/.claude/skills/`. To share it with a project, copy it to the repository's
`.claude/skills/` directory and commit it.

To list skills before installing:

```sh
npx skills add azat-io/ghostwriter --list
```

Use `npx skills check` to check installed skills for updates and
`npx skills update` to install them.

## Usage

A compatible agent can load Ghostwriter for writing, editing, reviewing, or
simplifying text. You can also name it in your request. State the audience and
supply the facts:

- "Edit `README.md` for office staff. Keep its structure and voice."
- "Review this incident update before I post it. Don't rewrite it."
- "Only cut the filler from this PR description."
- "Write a cover letter for this posting from my notes."

An ordinary edit can move the main fact to the front of a short text. Ask for a
restructure to reorganize sections of a long text. A request limited to a title,
paragraph, type of edit, or preserved order stays within that scope. Clear
passages can stay unchanged.

You get the text with notes on unconfirmed facts, assumptions, and omissions. A
review lists problems with quotes and fixes. The agent asks before writing only
if the answer would change the main point or what readers do; otherwise it
writes and names the gap in its reply.

## How It Works

The agent checks five areas. Drafting and restructuring start with the goal and
order; local edits start with the requested change:

| Pass            | Fixes                                                      |
| --------------- | ---------------------------------------------------------- |
| 1. Words        | Filler, vague wording, unsupported claims, hidden bad news |
| 2. Sentences    | Tangled syntax, overloaded sentences                       |
| 3. Meaning      | Repetition, abstract claims, needless detail               |
| 4. Order        | Digressions, illogical sequence, missing information       |
| 5. Presentation | Hard-to-skim layout                                        |

A [final check](skills/ghostwriter/SKILL.md#check) rejects edits that lose
needed ideas, loosen technical terms, add unsupported facts, or overstate
certainty. It also governs verbatim text and when numbers may be rounded.

`SKILL.md` holds the method and rule index. The 25 files in
[`skills/ghostwriter/rules/`](https://github.com/azat-io/ghostwriter/tree/main/skills/ghostwriter/rules)
contain instructions, examples, and exceptions. For a full writing, editing, or
review task, the agent reads ten core files plus the rules its genre and
problems need, even for a single paragraph. An edit limited to a kind of change,
such as removing filler, loads the rules for its relevant passes.

## What It Won't Do

- Invent facts, numbers, quotes, clients, results, or experience; made-up
  examples must be labeled
- Strengthen a claim beyond its source or drop a condition or doubt
- Change code, commands, identifiers, or quotations, including quoted output.
  Exceptions: sourced corrections to code or commands, and UI text you ask it to
  edit
- Hide a change, cost, risk, or loss when asked to soften the tone. It explains
  what readers would miss and keeps those facts in the version it offers
- Change a license or wording you say is legally required
- Rename a published section heading without your approval: links may target it

## Evaluation

Clone the repository and install its development dependencies
([prerequisites](contributing.md#prerequisites)), then run static checks and
list evaluation cases:

```sh
git clone https://github.com/azat-io/ghostwriter.git
cd ghostwriter
pnpm install
pnpm test
pnpm eval --list
```

To compare one case with and without the skill, choose a writer and grader
available to your Codex CLI:

```sh
pnpm eval --case readme-for-office-staff \
  --model "<writer>" --grade --grader-model "<grader>"
```

Model runs use your Codex access and are separate from `pnpm test`. Results go
to `.eval-results/`; without `--grade`, outputs remain ungraded. The skill is
portable; this runner currently supports Codex. See
[Regression Tasks](contributing.md#regression-tasks) for version comparisons,
holdout cases, trigger checks, and runner limits.

## See Also

- [@azat-io/ai-config](https://github.com/azat-io/ai-config)

## Contributing

See the [Contributing Guide](contributing.md).

## License

MIT &copy; [Azat S.](https://azat.io)
