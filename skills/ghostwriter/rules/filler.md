# Filler

Words pass. **Filler** is a word or phrase you can delete without losing
meaning. Deleting it removes noise but adds no information; later passes may
simplify further:

- "In order to be able to run the end-to-end tests, you will need to make sure
  that Docker is installed." → "To run the end-to-end tests, make sure Docker is
  installed." → later passes: "The end-to-end tests require Docker."

## Method

1. **Know** the groups in [Words](../SKILL.md#1-words) and why each is filler:
   the reason points to the fix. An evaluation asserts what a fact should prove,
   so the fix is that fact: not "fast" but the measured time, not "lightweight"
   but the install size.
2. **Detect** candidates in the text the user asks you to edit.
   - Scan group by group, not by feel: each group's summary in
     [Words](../SKILL.md#1-words) says what its scan checks, such as every
     adjective and adverb for evaluations, and its rule file, read once the scan
     flags something, adds triggers.
   - Triggers are samples: they flag candidates, not verdicts. **Deletion
     test:** remove the candidate and reread. It is filler only if every fact,
     term, condition, relation, and real doubt survives; relations include
     cause, contrast, and order. A claim no source supports counts as a fact
     here only if it is specific; delete a stock or weasel one as
     [No Source](unfounded-claims.md#no-source) says. Limit words such as "only"
     and "at least" are rarely filler. Keep a hedge such as "may", "usually", or
     "probably" unless a source, such as the code, confirms the claim without
     it; in your own draft, add one only for a doubt you can name.
3. **Delete** every confirmed hit; shrink inflated phrasing ("due to the fact
   that" → "because").
4. **Fill** each gap a cut exposes with what the reader needs there, such as a
   number, name, term, condition, reason, source, use case, or the full list. A
   cut word that asserted nothing, like "basically", leaves no gap. Use only
   verified facts (see [Check](../SKILL.md#check)), within the user's scope.
   "Only cut filler" includes these fills unless the user forbids additions;
   then name the gap in your reply. Add no unrelated facts or sections as a
   fill; other missing information belongs to Order when that pass is in scope.

Fill examples, each as before → filler deleted → filled (fact source):

- Terms: "The library comes with a business-friendly license." → "The library
  comes with a license." → "The library is MIT-licensed: you can use it in
  closed-source commercial products if you keep its copyright and license
  notice." (`LICENSE`)
- Use case and benefit: "Git makes it really easy to work on several branches at
  the same time." → "Git lets you work on several branches at once." →
  "`git worktree add ../hotfix hotfix` checks out `hotfix` in a second
  directory, so you can fix a bug there without stashing your changes."
  (`git worktree` docs)
- Reason: "You absolutely must commit `package-lock.json`." → "Commit
  `package-lock.json`." → "Commit `package-lock.json`: `npm ci` installs the
  exact versions the lockfile records and fails without one." (npm docs)

## Worked Example

A Restructure task permits new sourced facts and a new layout. This example
shows the five passes separately; they need not run in this order.

Original:

> It is worth noting that the `.gitignore` file essentially serves as a
> mechanism that is used in order to prevent the accidental addition of build
> artifacts and other generated files to the repository. As a result, you do not
> commit generated files by accident.

1. **Words.** Delete "It is worth noting that" and "essentially"; "in order to"
   → "to"; "the accidental addition of" → "accidentally adding".
2. **Sentences.** "serves as a mechanism that is used to prevent accidentally
   adding" → "prevents you from accidentally adding".
3. **Meaning.** Delete the second sentence: it repeats the first. "build
   artifacts and other generated files" → "generated files". Result: "The
   `.gitignore` file prevents you from accidentally adding generated files to
   the repository."
4. **Order.** Lead with the task and its solution; add the build directory
   (`dist/`, from the codebase) and facts about format, effect, and limits, each
   confirmed in the Git docs.
5. **Presentation.** Move the task into a heading; add bold run-in labels.

Final text:

```md
## Keep generated files out of the repository

List generated paths, such as `dist/`, in `.gitignore`.

**Format.** `.gitignore` is a text file with one pattern per line.

**Effect.** Git ignores untracked files that match a pattern: `git status` does
not show them, and `git add .` does not stage them.

**Limit.** `.gitignore` does not affect files that Git already tracks. To stop
tracking one, run `git rm -r --cached <path>`.
```

## Keep Cases

- No word is banned. Remove one only where the deletion test confirms it is
  filler.
- Grammatical forms work the same way. Use passive voice, participles,
  multi-clause sentences, and long enumerations because the idea needs them, not
  because the language has them. Keep the passive where the actor is unknown
  rather than invent one. In the Sentences pass, rewrite a form where it hinders
  understanding ([syntax](syntax.md#detection),
  [complex sentences](complex-sentences.md)); for the passive and participles,
  see [verbs](verbs.md).
