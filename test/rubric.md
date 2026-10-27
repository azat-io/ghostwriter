# Output Rubric

Judge the requested result against the task's facts, constraints, and audience.
The writer receives the task prompt and its files, not the expectations or this
rubric. The grader receives those materials, the result, the commands the writer
ran with their exit codes, `expected_output`, and `expectations`. A reference
describes acceptable behavior; it is not wording to copy or a single correct
answer.

## Evidence First

For each expectation, report pass or fail with a short quote from the result and
the source fact or instruction it satisfies or violates. For an omission, name
the missing fact and where the task requires it. For arithmetic, show the
inputs, calculation, unit, scope, and rounding. If the available material cannot
settle a point, mark it not assessed and say what is missing; do not guess.

Read the result as a whole. Keeping a qualifier in a footnote does not rescue a
headline that makes the opposite claim. A required phrase appearing somewhere
does not prove that its meaning survived. Quoted source wording in an editorial
note is not the writer adopting that claim.

## Required Checks

A result fails the factual checks if it:

- Invents or strengthens a fact, number, cause, result, source, client,
  credential, personal detail, quote, or commitment.
- Drops or blurs a material condition, doubt, exception, harm, or measurement
  scope; changes a plan into a promise or a past result into a future guarantee.
- Misstates technical behavior, arithmetic, a unit, a rate window, or a bound.
- Changes text the task requires verbatim, such as a quoted message, identifier,
  legal sentence, or explicitly protected wording.

A result fails the scope checks if it:

- Does a different task, such as rewriting when asked only to review, expanding
  a point edit, or adding unsupported actions to a writing task.
- Ignores the requested audience, deliverables, format, or explicit length
  limit.
- Stops for a fact that is not needed to deliver a valid result, or silently
  guesses a fact needed for one. A missing optional fact can be named beside a
  usable draft; a required fact may need a question.

These failures cannot be offset by better style. Report factual and scope
results separately from readability, even when a single expectation covers both.
A required check that was not assessed is not a pass.

## Readability and Voice

After the required checks, assess these dimensions separately:

- Clarity: can the intended reader understand the point and each condition or
  relation without guessing or rereading?
- Order and usefulness: can the reader find the information needed for the task,
  including bad news and limits?
- Economy: does each part serve the task, without filler or repetition that
  burdens the reader?
- Voice: does the result preserve the author's supported point of view, tone,
  rhythm, and emphasis where the task does not ask to change them?

For each dimension use `0` (material problem), `1` (usable with a local
problem), or `2` (clear for this task), with evidence. Do not reward shortness
by itself, require a percentage reduction, impose a sentence or idea quota, or
penalize a necessary explanation for making the text longer. Count words or
sentences only when the user sets a limit. A no-op can receive full marks when
the input works.

Do not grade file-read counts, a mandatory sequence of passes, or use of named
rules. Those are diagnostics, not proof of a better result. Do not demand an
unavailable tool run or infer a check happened; if the result claims a command,
test, or search ran, verify that claim from the supplied command record. The
record omits outputs, so a claimed result that needs them is not assessed.

## Comparing Runs

Keep the task, runtime, writer, grader, effort settings, and concurrency the
same when comparing no skill, previous skill, and current skill. Select the
grader explicitly; prefer a different model from the writer and record when they
match. A different model does not remove the need to check its evidence. Record
those settings and the skill snapshot. Repeat runs to distinguish a recurring
failure from variation.

Report passed expectations out of the total, factual and scope failures
separately, and the mean of each readability dimension with its sample count.
Show unassessed and missing checks, ungraded responses, skipped trials, and
infrastructure errors separately. The strict all-checks pass rate is an
additional measure; it must not hide the difference between 13 of 14 checks and
0 of 14. Show per-case results and denominators alongside aggregate scores.

For a blind comparison, label outputs A and B, randomize their order, and hide
which skill produced them. Judge each against the required checks before
comparing readability. Allow a tie and record why one is preferable. A polished
output that changes a fact loses to one that preserves it.

The original cases 1–36 are `dev`: they have been inspected during development.
Cases 37–40 are fresh `holdout` cases added for this revision, not evidence of
historically untouched data. Keep them out of tuning runs; after using their
results to change the skill, move them to `dev` and add fresh cases. Do not tune
on a holdout result and keep calling that case held out.

## Trigger Checks

`triggers.json` tests whether a runtime selects the skill from its description,
without explicitly loading its body. Compare the observed selection with
`should_trigger`, report false activations and missed activations separately,
and keep those results apart from output quality. A runner that always injects
SKILL.md cannot measure selection; report trigger checks as unsupported there.
