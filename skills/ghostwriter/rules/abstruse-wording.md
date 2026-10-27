# Abstruse Wording

Words pass, filler group: formal, borrowed, or pseudo-scientific words used
where a plainer word says the same, usually to sound expert. Readers who know a
word notice when it is used loosely; others may lose the sentence. Default: use
the most familiar word that keeps the full meaning; keep a term used in its
exact meaning. The deletion test in [filler.md](filler.md) protects the keep
cases below.

## Detection

Test every formal, rare, or borrowed word, not only the triggers below:

- **Swap.** Put in the word this [reader](../SKILL.md#when-to-use) knows best.
  If every fact, term, condition, relation, and real doubt survives, keep the
  swap, then turn a noun made from a verb into the verb
  ([nouns made from verbs](verbs.md#nouns-made-from-verbs)).
- **Define.** Say in one line what the word means here. If you can't, first rule
  out a term you don't know: in someone else's text, such as one using the
  project's own terms, check the docs and code, or ask the user. A word you
  still can't define, or whose exact meaning doesn't fit, is empty or misused:
  write what the sentence claims, from a source. A term from another field, such
  as math or medicine, must fit that field's meaning or one software gave it
  ([Borrowed Terms](#borrowed-terms)).
- **Density.** Several such words in one passage often hide a problem or missing
  facts ([After the Rewrite](#after-the-rewrite)).

Scan your own draft as hard as text you edit: AI-written text overuses fancy
words, such as "leverage", "utilize", "facilitate", "robust", "seamless",
"delve", "multifaceted", "holistic", "paradigm", "underscore", "foster", and
"pivotal". In your own draft, keep one only if you can say in one line what it
means here, a source shows that this meaning is true of what you describe, and
no plainer word keeps it (Swap). A fancy word where a fact belongs in your draft
("a holistic approach to monitoring") marks a fact you haven't looked up: find
it or cut the claim; in text you edit, see
[After the Rewrite](#after-the-rewrite). Words other groups own take their fix
([Overlaps](#overlaps)).

## Plain Words

English often has a word from Latin or French beside a native one, such as
"numerous" and "many" or "sufficient" and "enough": use the one the reader knows
best. Familiarity decides, not origin: "foster" is native, and "use" came from
French. Triggers:

| Abstruse                               | Plain                                                                                                                                |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| "leverage", "employ"                   | "use"; "build on" or "reuse" if that is the sense                                                                                    |
| "underscore" (the verb); "demonstrate" | "stress" for a point someone makes, "show" for what a fact makes clear; "show"                                                       |
| "foster"                               | "encourage", or the action that does it                                                                                              |
| "holistic", "multifaceted"             | The parts it covers, from a source; with none, delete it or use a plain phrase, such as "of the whole system" or "with many aspects" |
| "paradigm"; "methodology"              | "approach" or "model"; "method"                                                                                                      |
| "functionality"                        | "features", or what it does                                                                                                          |
| "additional"; "subsequent"             | "more" or "extra" ("another" for one); "later" ("next" only for the one right after)                                                 |
| "approximately"; "retain"              | "about"; "keep"                                                                                                                      |
| "ensure"; "frequently"                 | "make sure"; "often"                                                                                                                 |

- PR description: "This PR leverages Redis for the caching of session data." →
  "This PR caches session data in Redis."

## Borrowed Terms

Triggers: another field's term used as a fancier plain word, such as
"exponential" for "big" or "fast", or "bandwidth" for time; terms of psychology
and medicine in a text about neither, such as "cognitive dissonance",
"gaslighting", "OCD", "amnesia", or "surgical".

A reader from that field reads the exact meaning, which doesn't fit; other
readers get no clear meaning. State what happens or how much, in plain words and
from a source. With no source, use the plain word the term stands in for ("time"
for "bandwidth"), and give a judgment, such as "exponentially faster", the
[evaluations](evaluations.md) fix. Keep the term in a text in its field and in a
meaning software docs or tools define, such as "triage" (a GitHub repository
role), a "postmortem", or a "canary" release; a figure of speech, such as "a
surgical fix", is not one.

- PR: "The new tokenizer is exponentially faster." → "The new tokenizer handles
  the test fixture in 40 ms instead of 120 ms." (benchmark in the PR) One 3×
  gain on one input shows no exponential growth.
- Review: "This naming causes cognitive dissonance." → "`get_user()` also
  creates a missing user, though its name says it only reads." (the code)

## Words with a Nuance

A word may stay if no plain word keeps its distinction. Reread the passage as a
reader who doesn't know the word: what depends on it is lost. Strip the abstruse
wording around it, then write for the reader:

| Reader                                                                                                                                                                                                                                                  | Write                                                                                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Knows the term                                                                                                                                                                                                                                          | Its standard form; a jargon form made from it, such as a verb coined from a noun, becomes a plain phrase with the term                                      |
| May not know it and needs it or will meet it, because the project's glossary, UI, or logs use it or the people who build the thing use it with this reader, as in a design doc or its review, where the text you edit already uses it; or you're unsure | What it involves here, from a source; then the term's name. With no source, keep the term, and ask the user or name the gap                                 |
| May not know it, doesn't need it now, and won't meet, type, or search for it                                                                                                                                                                            | A more general word they know, or what it means for them, from a source, if either stays true ([Lightening a Sentence](idea-load.md#lightening-a-sentence)) |

If saying what a term involves takes other terms this reader may not know,
explain those first ([Building Up a Term](idea-load.md#building-up-a-term)).

- Launch plan: "We'll feature-flag the new checkout to holistically decouple
  deployment from release." → for engineers: "We'll put the new checkout behind
  a feature flag, so deploying it doesn't turn it on." → for support staff: "The
  new checkout ships turned off. We'll turn it on for 5% of users first. We can
  turn it off in the admin panel, without a deploy. This switch is called a
  feature flag." (rollout plan from the user)

## Loud Words

Triggers: "revolutionary", "groundbreaking", "unprecedented", "massive",
"monumental", "staggering", "catastrophic", "dramatic";
[evaluations](evaluations.md) already lists "critical" and "dramatically".

Loud words are evaluations that sound scientific or epic: they announce a scale
and leave the reader nothing to judge it by. Use the evaluations fix: give the
facts, or delete; a plain size word in its place ("big" for "massive") is no
fix. Keep a loud word inside a term, such as "catastrophic backtracking", and an
obvious joke ([Keep Cases](#keep-cases)).

- Status report: "Q3 brought a revolutionary transformation of our deploy
  process." → "In Q3, we replaced the weekly manual release with an automatic
  deploy of every merge to `main`." (deploy log)

## After the Rewrite

**A problem.** If the plain version reveals bad news, state what happened and
what the reader must do, as for [bad news](euphemisms.md#bad-news); never drop
the news on your own.

- Status report: "Data heterogeneity across legacy tenancy constructs
  necessitates remediation prior to go-live." → "The new database rejects 3,112
  old accounts with no owner, so we can't switch yet. Account managers: assign
  owners in `orphans.csv` by June 10." (migration log, plan from the user)

**Little content.** If the plain version says little, the abstruse words hid
that. Add the facts the reader needs, such as context, numbers, or events, in
plain words and from a source the [Check](../SKILL.md#check) allows
([Fill](filler.md#method)); add whole parts in the [Order](../SKILL.md#4-order)
pass. With no source, keep the plain version unless it is a judgment
([evaluations](evaluations.md)), and, if the reader needs more, ask the user or
name the gap. Never restore the abstruse words to make the text look deeper.

- README: "The service leverages a holistic, multifaceted methodology to
  facilitate data consistency." → "The service helps keep data consistent." →
  "Every 10 minutes, the service compares the `invoices` table with the payment
  provider's records and flags each mismatch." (the code)

## Confirming Terms First

On a topic new to you, such as another team's service or a tool you haven't
used, apply the [Define](#detection) test to every term you use, not only fancy
ones, even one that looks familiar: confirm in the docs or code what it means
there before you use it, since a term used loosely misleads readers who know it.
To test your grasp of a point, state it in plain words; if you can't, read
further before you write it. If you can't confirm a term, don't build your text
on it: write in plain words only what the sources confirm, and name the gap.
Never add a term to sound expert.

- Rebase guide: "In a conflict, `git checkout --ours <path>` keeps your
  changes." → "During a rebase, `--ours` is the branch you're rebasing onto and
  `--theirs` is your own work: to take your version of the whole file, run
  `git checkout --theirs <path>`." (`git checkout` docs)

## Overlaps

Fixes for words another group also flags:

- Judgments ("robust", "seamless", "pivotal") and loud words:
  [evaluations](evaluations.md).
- Formal words ("utilize", "facilitate", "commence"): the Formal word row in
  [officialese](officialese.md#plain-words).
- Set phrases ("delve into", "a paradigm shift"): [cliches](cliches.md); a lone
  "paradigm" stays here.
- A helper verb before a noun made from a verb ("ensure the cleanup of"): one
  verb, as in [nouns made from verbs](verbs.md#nouns-made-from-verbs).
- A psychology or medical term aimed at a person ("you're gaslighting me", "OCD"
  for a careful reviewer): [Criticism](euphemisms.md#criticism).

## Keep Cases

The same word can show off in one sentence and be a term in another; only the
showy use is filler:

| Showing off                       | Term                                                                                                                                     |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| "a new paradigm for config files" | "a multi-paradigm language": it supports several approaches, such as procedural and functional (Python docs)                             |
| "an exponentially better UI"      | "exponential backoff": TCP doubles its retransmission timeout each time it expires, up to an optional maximum (RFC 6298)                 |
| "a catastrophic deploy"           | "catastrophic backtracking": on some patterns, a backtracking regex engine's run time can grow exponentially with input length (V8 blog) |

- Terms in their exact meaning, however fancy, such as "idempotent" in an HTTP
  spec. Never swap one the reader needs for a looser word
  ([Check](../SKILL.md#check)): "safe" is no substitute, since RFC 9110 calls
  `PUT` and `DELETE` idempotent but not safe.
- Even there, make the words around the term plain: "PUT exhibits idempotent
  characteristics, facilitating request re-issuance upon connection failure." →
  "PUT is idempotent: if the connection closes before a response arrives, the
  client can send the request again." (RFC 9110)
- Latinate words that software uses as terms: an "instance" of a class, a
  "mutable" object, "recursion", "serialization"; a plainer word would be looser
  or name something else.
- A text in a field that uses the word as its own term: "entropy" in a guide to
  generating keys (the information-theory sense), a psychology term in a UX
  research report.
- Names, code, quotations, and verbatim text.
- In text you edit, deliberate, obvious wordplay or a joke where the tone allows
  it, as in a team blog post's body, not an error message or a title
  ([What a Title Says](headings.md#what-a-title-says)); the evaluations fix
  skips it too. If you can't tell it is a joke, treat it as a loud word.
