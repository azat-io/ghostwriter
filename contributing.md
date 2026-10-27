# Contributing

Thank you for your interest in contributing to Ghostwriter! This guide explains
how to report a problem, suggest a rule, and write, test, and send a rule
change.

## How to Contribute

### Reporting Issues

Before creating an issue, check existing issues to avoid duplicates. For an edit
the skill got wrong, include:

1. The agent and model you used
2. Your prompt and the facts you gave
3. The original text
4. The agent's text and reply
5. What you expected, and the rule that should have applied, if you know it

If the agent didn't load the skill, give the agent, the model, and your prompt.
Replace names, links, and numbers you can't share with made-up ones that still
reproduce the problem.

### Suggesting Rules

1. Check whether a file in `skills/ghostwriter/rules/` already covers the case
2. Show a real text the rule would fix, before and after
3. Name the cases where the rule must not apply

### Pull Requests

1. **Fork & Clone**

   ```bash
   git clone https://github.com/your-username/ghostwriter.git
   cd ghostwriter
   ```

2. **Install Dependencies**

   ```bash
   pnpm install
   ```

3. **Create Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make Changes**
   - Follow [Writing Rules](#writing-rules)
   - Add or update a [regression task](#regression-tasks) for the behavior you
     change

5. **Run Checks**

   ```bash
   pnpm test
   ```

   Then run the model evaluations your change affects, as
   [Regression Tasks](#regression-tasks) says, and list each case, model,
   variant, and result in the pull request. Model runs are separate from
   `pnpm test`.

6. **Commit Changes**

   ```bash
   git commit -m "feat: add rule for passive voice in error messages"
   ```

   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` New rule or behavior
   - `fix:` Rule that misleads agents or contradicts another
   - `docs:` README and contributing guide changes
   - `style:` Formatting changes
   - `refactor:` Rule moved or merged without a change in behavior
   - `test:` Regression task changes
   - `chore:` Tooling and dependency changes

7. **Push & Create PR**

   ```bash
   git push origin feature/your-feature-name
   ```

   Write the pull request title in the same format, with a lowercase subject
   after the type, such as `feat: add rule for passive voice`. CI checks it.

## Development Setup

### Prerequisites

- Node.js ^22.22.3, ^24.16.0, or >=26.3.0
- pnpm 12
- Git
- For `pnpm eval`: a Codex CLI with configured model access that supports the
  isolation flags the runner uses. Static checks need no model access.
- For manual checks in another runtime: an agent that supports Agent Skills

### Project Structure

```
ghostwriter/
├── assets/                        # Logo
├── scripts/                       # CLI entry points (.js, ESM)
│   └── lib/                       # Checks and evaluation runner
├── skills/
│   └── ghostwriter/
│       ├── SKILL.md               # Method and rule index
│       └── rules/                 # Details, examples, keep cases
└── test/
    ├── *.test.js                  # Vitest tests for the tooling
    ├── rubric.md                  # Model grading criteria
    └── fixtures/
        ├── regression-tasks.json  # Writing and editing cases
        └── triggers.json          # Skill-selection cases
```

### Available Scripts

```bash
pnpm test           # Runs all test:* scripts
pnpm test:format    # Prettier formatting check
pnpm test:spelling  # Spell check (cspell)
pnpm test:packages  # Dependency dedupe check
pnpm test:skill     # YAML metadata, size, links, anchors, and reachable rules
pnpm test:fixtures  # Evaluation data and input paths; no model calls
pnpm test:js        # JavaScript lint check
pnpm test:unit      # Vitest tests; 100% coverage of scripts/lib
pnpm eval --list    # Lists model evaluation cases without calling a model
```

All scripts in `scripts/` use JavaScript ESM (`.js`). Keep logic in
`scripts/lib/`, where tests measure coverage; an entry script only passes its
arguments and sets the exit code. Keep model runs under `pnpm eval`, never a
`test:*` script: `pnpm test` runs every matching script.

## Writing Rules

The readers of `SKILL.md` and the rule files are AI agents. Write for them:

- Write in English, as instructions: what to detect, what to do, and, under
  **Keep Cases**, when not to.
- Give each rule a test an agent can run on a text, not a goal such as "be
  clear".
- Explain briefly why the rule matters, so the agent can judge cases its
  examples do not cover. A numerical threshold may trigger a check without
  requiring a rewrite.
- Take examples from software development. Each one must be technically true and
  show the text before and after, or, for a kept example, the text and why it
  stays. End each with the source of the facts it adds, such as `(git log docs)`
  or `(notes from the user)`; the text after adds no fact its source doesn't
  give.
- Never write a rule that leads an agent to invent facts, predict outcomes, use
  pressure, or drop a fact, condition, or doubt.
- Give each rule one home file. `SKILL.md` sums it up and links to that file,
  and other files may sum it up too. When you change a rule, update every
  summary of it.
- Link to sections by anchor, such as
  `[No Source](unfounded-claims.md#no-source)`, and check that each link
  resolves with `pnpm test:skill`. It also checks that every rule is reachable
  from `SKILL.md` through links.
- Keep `SKILL.md` under 500 lines, as the
  [Agent Skills specification](https://agentskills.io/specification) recommends,
  and its `description` at 1,024 characters or fewer, the limit it sets.
- Write every rule and example yourself; don't paste text from other sources.
- If cspell rejects a word, rephrase instead of adding it to the dictionary.

## Regression Tasks

`test/fixtures/regression-tasks.json` holds tasks in the
[skill-creator](https://github.com/anthropics/skills/tree/main/skills/skill-creator)
format. Each has a prompt, a description of a good result, and expectations a
grader can check. The scenarios, people, products, and numbers in them are made
up; real tools and services, such as Kubernetes or S3, keep their names.

Put supplied files under `test/fixtures/inputs/` and list their paths relative
to `test/fixtures/`, such as `inputs/readme.md`. Suite files and grading data
cannot be used as task inputs. Prettier, ESLint, and the unit tests skip
`inputs/` (see `test/fixtures/.prettierignore`), so inputs keep the formatting
the task needs.

Cases also have `dev` or `holdout` splits and topic tags. Use development cases
while changing a rule. Reserve holdout cases for a later check, rather than
tuning the rule to their answers. For a bug you fix, add a task that would have
caught it; where it fits, add a good text the skill should leave alone. Once a
holdout result guides a rule change, move that case to `dev` and add a fresh
holdout case.

### Running Cases

List cases or inspect a planned run without calling a model or creating results:

```sh
pnpm eval --list
pnpm eval --case readme-for-office-staff --dry-run
```

Choose models available to your Codex CLI. A real run requires `--model` and
either `--case` or `--all`. Grading also requires an explicit `--grader-model`;
`pnpm eval` alone shows help. Start with cases affected by the change:

```sh
pnpm eval --case readme-for-office-staff \
  --model "<writer>" --grade --grader-model "<grader>"
```

`--case` accepts an ID, a name, or a comma-separated list of either. Use
repeated runs to check variation, and `--all` to select the full development
suite:

```sh
pnpm eval --all --model "<writer>" --grade --grader-model "<grader>" --runs 3 --jobs 4
pnpm eval --all --split holdout --model "<writer>" --grade --grader-model "<grader>" --runs 3 --jobs 4
```

The default suite is `regression`, and the default split is `dev`. `--runs`
defaults to one repetition. `--timeout` sets a limit in seconds per model call
(default: 180); `--effort` sets reasoning effort (default: `medium`, supported
values depend on the model). `--grader-effort` sets the grader's effort
separately, also defaulting to `medium`. Prefer a different grader model and
inspect its evidence; a different model can still make grading mistakes. An
explicitly selected identical model is allowed and recorded in the manifest.

`--jobs` sets the maximum number of concurrent trials (default: 1). Each trial
runs its writer and then its grader, so active model calls cannot exceed that
limit. Every trial has its own workspace and output files. A failed quality
check does not stop the queue. Parallelism does not reduce the number of model
calls.

A model call that fails, times out, or returns an invalid grade is retried once;
`--retries` sets the number of extra attempts (0–10, default: 1). Each failed
attempt moves to `run-N.failed-K/` or `grading.failed-K/` beside the new one,
the result lists it under `failedAttempts`, and the summary counts these
attempts. Retries add model calls. A trial that still fails stops the queue and
cancels active trials; their results are saved, and trials that have not started
are reported as skipped.

To finish a stopped or interrupted run, pass its results directory:

```sh
pnpm eval --resume .eval-results/<run> --dry-run
pnpm eval --resume .eval-results/<run> --jobs 4
```

`--resume` reuses the run's saved cases, rubric, skill snapshots, models,
effort, and timeout; only `--jobs`, `--retries`, and `--dry-run` may be given
with it. It refuses to continue if the suite file or a snapshot has changed.
Input files are copied from `test/fixtures/` when each trial runs, so leave them
unchanged until the run is finished. Completed trials are kept. A trial whose
writer finished is graded again from its saved response; any other unfinished
trial runs again, and its earlier attempt moves to `run-N.failed-K/`. The
manifest records each resume, including the Codex CLI version, which may differ
from the first session.

Use `--dry-run` before a large batch to see the selected cases, variants, and
planned model calls. `--output` names a new result directory; by default,
results go into a timestamped directory under `.eval-results/`.

### Comparing Versions

`--variant current` loads the working skill; `none` gives the model no
Ghostwriter instructions; `previous` loads a saved skill directory. The default,
`all`, compares current and none, adding previous when `--baseline` is supplied.
Use `--variant current,previous` to compare only the two skill versions. Keep
the cases, writer, grader, effort settings, run count, and concurrency the same
for each condition.

Before editing the skill, save a copy outside `skills/`, such as in
`.eval-baselines/`. This directory is ignored by Git; preserve the snapshots
with your evaluation artifacts when sharing a comparison. Point `--baseline` at
a snapshot containing `SKILL.md` and `rules/`:

```sh
pnpm eval --all --variant current,previous \
  --baseline /path/to/old/ghostwriter \
  --model "<writer>" --grade --grader-model "<grader>" --runs 3 --jobs 4
```

The runner copies the selected skill versions into the results and records their
hashes and the run configuration in a manifest. Each generation uses a fresh
scratch workspace with the case's prompt, supplied files, and selected skill. It
does not receive `expected_output` or grading expectations. The no-skill
condition starts without Ghostwriter instructions.

With `--grade`, the grader checks facts and task scope separately from writing
quality. Besides the answer, it receives the commands the writer ran with their
exit codes, so it can check a claimed test run or search. Outputs and commands
that mention the skill are left out, so the record looks the same for every
variant. A smoother result cannot compensate for invented facts or a scope
failure. Inspect the saved outputs and grades; a model's grade is evidence to
review, not a guarantee. Without `--grade`, the report marks outputs ungraded.
The presence of cases or passing static checks is not a measured quality result.

`summary.json` separates batch progress in `execution` from scores under
`variants`. Skipped trials are counted in `execution.skipped` and listed with
their case, variant, and repeat in `skipped.json`. For each variant, compare:

- Expectations passed out of the planned total, with failed, unassessed, and
  missing checks separate. For example, 13 of 14 differs from 0 of 14 even
  though neither passes every check.
- Responses that fail factual integrity or task scope, counted separately. These
  count affected responses, not individual errors within a response.
- Mean clarity, order, economy, and voice scores, each with its sample count.
- Infrastructure and grading errors and ungraded results.
- Writer and grader token use and duration, reported separately. Missing usage
  remains unknown.

The strict all-checks pass rate remains an additional measure. Read it with the
expectation counts and coverage: a run with a missing grade is not evidence of
either good or bad writing. Readability scores cannot offset factual or scope
failures. Inspect per-case evidence before changing a rule or choosing a
version.

### Trigger Checks and Runtime Limits

`test/fixtures/triggers.json` contains requests that should and should not
select Ghostwriter. Run this suite separately:

```sh
pnpm eval --suite triggers --all --model "<model>" --runs 3
```

Trigger checks use the selected skill version's description in a controlled
skill catalog. They detect a skill read from recognized successful commands
whose output contains its name and heading, without a model grader or `--grade`.
An ambiguous read is not a pass. Inspect traces when no read is reported:
another reading method may be missed. These checks measure selection from that
catalog, not discovery or activation after a native `npx skills` installation.
Check installation and loading separately in each target agent with both
relevant and unrelated requests.

The automated runner targets Codex and requires its isolation flags. It disables
plugins, apps, memories, and discovered skills under the Codex skill directory
and `~/.agents/skills/`, saving their paths in the manifest. These controls
reduce extra context; they do not make a filesystem boundary around the scratch
directory. Inspect the runtime's supplied instructions before a comparison.
These settings are specific to Codex; confirm equivalent isolation before
comparing another runtime. The skill itself uses portable Markdown instructions.
For a manual comparison in another agent, use a fresh session per case and
variant, and hide variant names from the grader.

Results under `.eval-results/` are ignored by Git. In a pull request, report the
cases, split, variants, model and run count, factual or scope failures, and
writing-quality differences. Preserve the manifests and outputs so another
maintainer can inspect the comparison.

## Security

If a rule lets the text under edit make the agent leak data or run commands,
report it privately as the [security policy](.github/security.md) describes. Do
not open a public issue, and allow time for a fix before disclosure.

## Tips

- `pnpm test` runs every `test:*` script with a regex run, `pnpm run /^test:/`,
  which needs a pnpm version that supports it, such as pnpm 12.
