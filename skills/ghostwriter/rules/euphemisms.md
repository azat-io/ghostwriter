# Euphemisms

Words pass, filler group: soft words that hide a plain fact, usually bad news or
criticism, often in [officialese](officialese.md). Readers cannot plan around a
problem the text hides. Default: state the plain fact, however bad, and no
harsher than the sources. The deletion test in [filler.md](filler.md) protects
the keep cases below.

## Detection

Look hardest where the news is bad or someone erred: incidents, security
advisories, breaking changes and removals, the end of support, price and limit
changes, status reports, and reviews. Test every soft, abstract, or
[abstruse](abstruse-wording.md) phrase there, not only the triggers, in your own
drafts as in text you edit:

- **Questions.** What happened, to what and whom, since or until when, and what
  must the reader do? If a source answers one that the text blurs, the wording
  hides a fact.
- **Swap.** Try the plain word, such as "outage", "removed", "lost", or "price
  increase". If it sounds worse but stays true, use it, unless the original is a
  keep case below. If it turns false or harsher than the sources, say what
  happened in other plain words ("uploads are slow", not "an outage"). If you
  can't tell what the wording means, ask the user or state only the facts a
  source shows. With no source, keep the claim as written, in plainer words only
  where they add no fact, such as "fix" for "remediation", and ask the user or
  name the gap. Never delete the news on your own; if the user asks you to, see
  [When Readers Would Be Misled](requests-to-soften.md#when-readers-would-be-misled).
- **Effect.** Would a reader of this text alone act as the facts warrant? If
  not, it misleads, however true each sentence and kind the motive, such as
  politeness ([Check](../SKILL.md#check)). To calm readers and keep their trust,
  add facts from a source that limit the damage, such as what still works, never
  an unchecked reassurance ([unfounded claim](unfounded-claims.md#no-source)) or
  softer words.

## Bad News

Soft bad news reads as normal wording: scan for it on purpose. Triggers:

| Soft                                                                                                       | Plain, if a source shows it fits                                          |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| "a service disruption"                                                                                     | "an outage", or what fails                                                |
| "elevated error rates", "unexpected behavior", "some users may experience issues" when the facts are known | What happens, how often, since when: "crashes", "returns the wrong total" |
| "a pricing update"                                                                                         | "a price increase", from what to what                                     |
| "we're streamlining the API", "we will sunset"                                                             | "we're removing" or "shutting down": what, when                           |
| "we'll keep it in mind" when closing a request                                                             | "We don't plan to do this", with the reason                               |

State what happened and what it means for the reader: what fails, what they lose
or pay, since or until when, and what they must do. In an incident update or
another account of bad news, add what you did
([Unnamed action](officialese.md#plain-words)) and what happens next, such as
the fix or the next update, each from a source; a notice orders them as
[Notices](officialese.md#notices) says. Name the actor a source names ("our
config change broke uploads"): the team or its change; a person only where a
source names them as the one who acted and the readers need the name, as in an
internal report, never on a public status page; keep the passive where the actor
is unknown ([Passive Voice](verbs.md#passive-voice)).

- Status page: "We are investigating elevated error rates on uploads." → "Since
  14:05 UTC, 30% of uploads fail with HTTP 503. Downloads work. We've paused
  deploys and are investigating; next update by 15:00 UTC." (error dashboard and
  incident notes from the user)
- Release notes: "This release improves the consistency of the `parse()` API." →
  "Breaking change: `parse()` now throws `ParseError` on empty input instead of
  returning `null`. Update code that checks for `null`." (the diff)

## Coined Euphemisms

Triggers: "a durability event" for lost data, "an unplanned availability event"
for an outage, "a billing discrepancy" for double charges, "a capacity
adjustment" for a lowered rate limit, "manual intervention" for routine hand
edits to production data.

A coined name, for a fact or for a practice that keeps recurring, makes readers
judge it milder than it is, even when each word is true. Use the plain name the
facts support and, for a practice, how often it happens, from a source; another
soft name is no fix.

- Incident report: "Some objects experienced a durability event during the
  migration." → "The migration lost 1,204 objects uploaded on May 3; they can't
  be restored." (incident timeline)

## Problems and Mistakes

Triggers: "on track, with some risks" when a date is at risk; "mistakes were
made" or "a regression was introduced" from whoever caused the problem.

Raise a problem at the top of the first report after a source shows it, even
before the cause is known and even in the author's own work, while plans can
still change: what's wrong, what it threatens, and the help needed, such as a
decision, a person, or ideas, each from a source.

When the author caused it, state calmly, in the first person ("I" for a person,
"we" for a team or a company page), their part and how it caused the problem,
what they did since, and a proposal, each from a source; if one is missing, ask
the user or name the gap. A stock apology becomes one plain one
([Politeness for Show](introductory-words.md#politeness-for-show));
self-reproach goes. Admit only the part the sources show, blame no one beyond
them, and keep their doubt.

- Weekly report: "Search migration: on track, with some performance risks." →
  "Search migration: we'll miss the June 30 switchover unless peak p99 latency
  drops from 2.1 s to 300 ms; we don't know why it's high. By Friday, we need a
  database engineer or a new date." (load test and plan from the user)
- Team channel: "Due to an oversight, some customers may have experienced
  checkout issues. We apologize for any inconvenience." → "I deployed the
  checkout change without its migration, so checkout failed from 14:02 until my
  rollback at 14:21. Sorry for the outage. I propose a deploy check for pending
  migrations." (logs and proposal from the user)

## Criticism

Triggers: a required change worded as optional ("you might want to", "nit:" on a
bug), a question whose answer the reviewer knows ("did you test this?"), a jab
worded as courtesy ("interesting choice"), a hinted consequence ("this may
affect the release").

Soft criticism spares the reviewer, not the author, who can't tell what is wrong
or whether to act. Test each comment: could the author fix the problem from it
alone? Give the defect with its evidence, such as a failing test, and what it
causes; what must change; whether it blocks, as a plain verdict
([evaluations](evaluations.md#keep-cases)); and any consequence, such as a
release cutoff, each from the comment, the code, or the user. If no source shows
a defect, keep the question. With no source for the exact fix, state the change
the defect itself requires ("the handler must close the file on every error
path") and ask the user for the intended behavior. Keep a hinted consequence no
source confirms as written, and ask the user what it is. In someone else's
comment, keep the weight its author gave: if you delete a hedge or label that
marked it optional ("I think", "you might want to", "nit:"), state that weight
plainly ("Optional:"); if the label contradicts the defect, such as "nit:" on a
crash, ask the user; never make a comment blocking or optional without a source.

About a person, write only actions a source records and their effect on users,
the team, or you: "reckless" → "merged #512 with a failing check, which broke
`main`" (CI history). Delete traits, motives, and skill levels, harsh or polite,
even beside facts and even where a source states them: the author can act on
actions, not on traits.

- Review: "Have you considered handling empty input? This may affect the
  release." → "Blocking: `parse('')` raises `IndexError` on line 18, and
  `upload()` passes `''` for an empty file. Return `[]` and add a test. The 2.4
  branch is cut Friday; without the fix, this PR moves to 2.5." (the diff;
  release schedule, which lists 2.5 as the next release; fix and verdict from
  the reviewer)

## Disability Words

Triggers: "special needs", "users with different abilities".

In a text that helps disabled people or asks others to remove a barrier, name
who is blocked and by what ("blind users", "screen reader users"), from a source
such as an audit or the code. A vaguer group name makes the barrier look
smaller; "disability" is the plain, neutral word, as in the Americans with
Disabilities Act. Use the term the user, the project's style guide, or the
people described, through a source, prefer, such as "disabled people" or "people
with disabilities"; with none stated, keep whichever of these the text uses; a
vaguer group name, such as the triggers above, is never one to keep. Never aim a
disability or diagnosis word at a person as a jibe ("are you blind?", "OCD" for
a careful reviewer): delete it and state any point it made
([Criticism](#criticism)).

- Accessibility issue: "Users with different abilities may find the charts less
  convenient." → "Blind users can't read the usage charts: they are `<canvas>`
  drawings with no text alternative." (audit from the user; MDN `<canvas>`)

## Plain Facts

- Use the word the facts support, no softer and no harsher: "exposed" if the
  data was public, "stolen" only if a source shows someone took it, "breach" or
  another legal label only if a source uses it.
- Never guess an impact figure ([Check](../SKILL.md#check)).
- Keep real doubt; say what is still unknown: "We don't know yet whether anyone
  downloaded the files."

## Overlaps

- A soft judgment ("minor", "suboptimal") or a positive word for a loss
  ("optimized", "simplified"): the [evaluations](evaluations.md) fix; a judgment
  of a person: [Criticism](#criticism).
- A vague amount ("a subset of users"): the number from a source; with none,
  "some users" ([vague words](vague-words.md)). An unchecked reassurance ("no
  customer data was affected"): an
  [unfounded claim](unfounded-claims.md#no-source).
- Courtesy formulas, "I think", and other hedges in criticism:
  [introductory words](introductory-words.md) and the hedge test in
  [filler.md](filler.md#method), keeping the comment's weight
  ([Criticism](#criticism)).
- A request to soften or cut bad news:
  [Requests to Soften](requests-to-soften.md).

## Keep Cases

- Exact terms that sound soft: "deprecated" (still works, may be removed), "end
  of life" (no more updates, not even security fixes), "known issue" (a bug the
  release notes list as unfixed). If the facts outgrow the term, use the word
  that fits: once a release takes an API out, it is "removed", not "deprecated".
- A status label a tool defines, such as "Degraded performance" on a status
  page: keep it, and state what is slow or fails, and by how much, from a
  source.
- Verbatim text, such as a quoted message or legal wording the user says is
  required: keep it, and state the plain fact beside it, from a source.
- A label that states a comment's real weight, such as "nitpick:" (Conventional
  Comments) or "nit:" on an optional change, and a real question.
- A blameless postmortem's convention: name the change, step, or role that acted
  ("the 14:02 deploy skipped the migration"), with people's names or "I" only
  where the postmortem's convention uses them, and judge no one; it is no reason
  to keep a passive that hides what happened.
