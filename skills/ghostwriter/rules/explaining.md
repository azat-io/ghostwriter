# Explaining

Order pass, with visuals in the Presentation pass: texts that teach something
new so readers can apply it, such as tutorials, getting-started guides, concept
pages, onboarding docs, explanatory posts, and a design doc's background.
Experts often start where newcomers can't follow, as with a list of kinds
([Expert Blind Spots](idea-load.md#expert-blind-spots)). Default, in your draft
as in text you edit: before readers need anything new, give them what it is, the
errors they may hit, and an example, each from a source.

## Sections and Cheat Sheets

Split a long teaching text into short sections that pass
[Self-Contained Sections](structure.md#self-contained-sections), Last paragraph
test included, though a tutorial's steps may build on earlier ones
([Keep Cases](structure.md#keep-cases)); end it as
[Ending a Long Text](structure.md#ending-a-long-text) says.

For its closing checklist, or a cheat sheet, give readers who skipped sections
one item per rule, in the order they apply them, so they see how the rules fit
together. Word each as a terse instruction that is easy to remember, with the
command, setting, or condition it depends on; it keeps every condition of its
section, adds no rule, and holds no evaluation ("is key").

- Tutorial cheat sheet: "It's important to remember that jobs should be designed
  so that running them more than once doesn't cause problems." → "Make every job
  safe to rerun: Acme Queue redelivers a job if its worker crashes." (the
  tutorial's section 5)

## Chains of New Terms

Triggers: a definition or step that leans on two or more terms this reader
hasn't met, each explained only through the others.

Mark each term new to this reader
([Counting New Ideas](idea-load.md#counting-new-ideas)); by the [goal](goal.md),
use the first row that fits:

| Readers                                             | Do                                                                                                                              |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Need the term, or will meet, type, or search for it | A chain from a concept they know ([Building Up a Term](idea-load.md#building-up-a-term))                                        |
| Need what it names, not the term                    | What it means for them, in words they know ([Lightening a Sentence](idea-load.md#lightening-a-sentence))                        |
| Need neither                                        | Cut the thing it names, with every sentence about it, and name the cut in your reply ([Using the Goal](goal.md#using-the-goal)) |

- Guide to a first deploy, for readers who know containers: "A Deployment
  manages ReplicaSets, which maintain a stable set of replica Pods." → "A Pod is
  one or more containers that Kubernetes runs together on one machine. A
  Deployment tells Kubernetes which Pods to run and how many." No step uses
  ReplicaSets: cut. (Kubernetes docs, the guide)

## New Subjects

Triggers: a step that relies on a tool, concept, or file readers haven't met.

Introduce each subject new to readers before the first step or paragraph that
relies on it, right after the line saying what they'll do with it
([Point First](paragraphs.md#point-first)). Answer from a source:

- Where they meet it, such as a file or a screen
- What it is, and what it does for them
- If it helps, a comparison with something they know, true wherever the text
  relies on it
- What it needs to work, such as a key

Err toward more detail on a new subject: a heading and a first sentence that
name each part let a reader who knows it move on. Keep a basic fact unless this
reader certainly knows it ([Reader Level](idea-load.md#reader-level)); add inner
workings only for readers who configure or debug it. For a subject readers know,
introduce the parts new to them first.

- Beginner's guide: "Add a `pre-commit` hook that runs the linter." + "A Git
  hook is a program Git runs at a set point. By default, `git commit` first runs
  `.git/hooks/pre-commit`, if that file is executable, and makes no commit if it
  exits with a non-zero status." (githooks docs)

## Pitfalls

Triggers: steps that cover only the case where everything works.

For each step, find the errors and dead ends readers hit, in issues, CI logs,
support tickets, the user's notes, or your own run in a clean setup, as
[Examples](#examples) allows; never invent one or its frequency. Give each its
symptom, verbatim, the cause if a source shows it, and the fix: in its step or,
for many, in a troubleshooting section by symptom
([Choosing a Division](structure.md#choosing-a-division)). Add obstacles a
source names that aren't technical, such as an approval that takes days, with
what to do meanwhile.

- Onboarding guide: "On a server with no browser, `acme login` fails with
  `Error: no browser found`: run `acme login --device`." (issue #212) "Request
  production access before step 1: approval takes up to two working days."
  (onboarding notes from the user)

## Examples

- Give each concept, rule, or option an example from a task this reader does,
  saying what it changes for them; state the rule an example shows.
- Build each from the code, tests, docs, or the user's project. Run each code
  sample you write in a scratch directory or sandbox, never against the user's
  real data, accounts, or production, and run none that deletes, deploys,
  publishes, sends messages, or spends money without the user's approval; name
  in your reply any you couldn't run.
- In a long tutorial, let one running example carry every case, such as a sample
  app or a fictional team, marked as made up at first use and again in any
  section readers may enter alone
  ([Self-Contained Sections](structure.md#self-contained-sections)); later
  mentions need no marker.
- Take a case from experience only from the user or a source
  ([Opinion and Experience](unfounded-claims.md#opinion-and-experience)); mark a
  made-up one ([Hypotheticals](introductory-words.md#hypotheticals)), never as
  proof of how common a problem is ([No Source](unfounded-claims.md#no-source)).

- Concept page: "Environment variables override `acme.toml`." + "Suppose one CI
  job needs debug logs: set `ACME_LOG_LEVEL=debug` in that job, and leave
  `acme.toml` as it is." (the config loader's code)

## Tables, Diagrams, and Output

A visual can replace paragraphs that do what a row names; use the first row that
fits:

| The prose                                         | Use                                                        |
| ------------------------------------------------- | ---------------------------------------------------------- |
| Compares items on the same properties             | A table: a row per item, the same columns                  |
| Traces a flow, such as a request through services | A diagram, such as a `mermaid` block, which GitHub renders |
| Says what a command prints                        | The command and its output                                 |
| Points to a place on a screen                     | A screenshot                                               |

- Take every row, box, arrow, and output line from the code, docs, the user, or
  a run you did as [Examples](#examples) allows. Give output verbatim, marking
  any lines you cut. With no source or run for an output, keep the prose that
  describes it and name the gap in your reply; for an image you can't make, such
  as a screenshot, name in your reply what it should show; never fake either.
  Use a `mermaid` block only where the destination renders it.
- For a table that compares items, the caption or the next sentence compares
  them on the same criteria, with values from a source, and, unless a column
  already does, says when to use each.
- Draw comparable visuals to one scale and from one view, such as one axis range
  or one window size, so any difference readers see is in the items, and each
  looks as it will on their screen.

- Beginner's guide: a paragraph on how `git reset --soft`, `--mixed`, and
  `--hard` differ → a row per mode; columns "Moves the branch to the commit you
  name", "Resets the staging area", "Resets the working tree", and "Use it to"
  ("redo the last commit: `git reset --soft HEAD~1`", "undo `git add`:
  `git reset`, which names no commit, so the branch stays", "discard the last
  commit and uncommitted changes to tracked files: `git reset --hard HEAD~1`,
  which also deletes untracked files in the way of tracked ones"); caption:
  "Each mode changes one more place than the one above." (`git reset` docs)

## Opening

Triggers: an opening with definitions or a list of kinds; a stock line
([Openings](cliches.md#openings)); a threat as the motive.

Write the [introduction](structure.md#orienting-the-reader) last, in a few
sentences, each from a source:

1. **Known ground**, first, after any [hook](paragraphs.md#hooks): a fact this
   reader certainly knows that the topic builds on, never a claim about their
   experience ([No Source](unfounded-claims.md#no-source)); in a later part of a
   series, what the earlier part covered, linked. State it in a sentence at
   most, as the start of the new topic, not as an explanation of it; it is no
   common-knowledge statement or needless detail to delete.
2. **Motive**: the reader's task or a problem the topic solves for them, as in
   the move table; a threat or stock warning is pressure, not a move
   ([Planning the Moves](goal.md#planning-the-moves)); a consequence is a move
   only as a fact from a source, with what readers do about it.
3. **Result**: what readers can do at the end, as results they can check, such
   as a passing test, not topics ("learn about migrations"). A plain line
   listing the parts may follow it ([Openings](cliches.md#openings)).

This order holds for the introduction only; from the next paragraph on,
[Point First](paragraphs.md#point-first) and the First paragraph test
([Self-Contained Sections](structure.md#self-contained-sections)) apply. Test:
from the introduction alone, can readers say what it builds on and what they'll
have at the end?

- Tutorial, part 2: "Migrations are essential: without them, your deploys will
  break." → "Part 1 created the `users` table with `schema.sql`, which changed
  only your local database. Now you'll add a column with `acme migrate` and
  apply it to staging with one command.", with a link to Part 1. (Part 1, the
  tutorial's code)

## Keep Cases

- A reference page, release notes, a changelog, or an incident update: no
  teaching opening, running example, or cheat sheet.
- A short text, such as an issue or chat reply, a review comment, a PR
  description, a commit message, or an error message: no teaching opening,
  sections, or cheat sheet ([Keep Cases](structure.md#keep-cases)). A docs page
  on a single task: no teaching opening or cheat sheet; it keeps the sections
  its task needs. In both, introduce a new subject, and give an example or a
  pitfall, only where the reader can't act without it.
- Readers who know the subject, as in a deep dive for experts: introduce only
  the parts new to them.
- Verbatim text, such as an error message or command output.
