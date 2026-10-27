# Redundancy

Meaning pass: series of words that say one thing, and points made twice. Readers
must work out what each member adds, so a near-synonym makes them work for no
new meaning. Default: keep the most precise member and any whose difference this
reader needs.

## Detection

Mark every series, in your own draft as in text you edit: two or more
adjectives, nouns, verbs, or phrases in one slot, joined by commas, "and", "or",
or a slash. Test each pair:

- **Difference.** Say in one line what one names here that the other doesn't,
  from the text or a source. If you can't, they are near-synonyms; first rule
  out a term you don't know ([Define](abstruse-wording.md#detection)).
- **Reader.** Would this [reader](../SKILL.md#when-to-use) act or conclude
  differently without one? Would they meet, type, or search for it, as with a
  label the UI or logs show? Answer from what this reader knows
  ([Reader Level](idea-load.md#reader-level),
  [Expert Blind Spots](idea-load.md#expert-blind-spots)).

In your own draft, a series often marks a word you haven't chosen or a fact you
haven't looked up.

## Near-Synonyms

For members that fail the Difference test, or that differ only in ways this
reader neither acts on nor meets, types, or searches for
([Check](../SKILL.md#check)), use the first row that fits. A list of distinct
items, such as supported platforms or an option's values, is no series of
near-synonyms: keep it whole ([Splitting](idea-load.md#splitting)).

| Finding                                             | Keep                                                                                                                                                                   |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| They mean the same here                             | The most precise one a source shows is true: the name the code, UI, or docs use, else the one that rules out the most; never a looser one ([Check](../SKILL.md#check)) |
| They differ, but the point needs only one           | That one                                                                                                                                                               |
| The point needs them all, but not their differences | One word that covers them all and nothing more: a member that does, or a word for their kind                                                                           |

Then, where the point needs them, add the facts behind the kept word, from a
source ([Fill](filler.md#method)). If the result loses a fact, condition, or
difference the reader needs, restore the member as
[distinct](#distinct-members).

- PR description: "This PR cleans up, refactors, and restructures the config
  loader." → "This PR refactors the config loader: it splits `load()` into
  `readFiles()` and `merge()`." (the diff)
- Runbook: "If the worker freezes or hangs, restart it." → "If the worker hangs,
  restart it: the `WorkerStuck` alert fires when it finishes no job for 5
  minutes while jobs are waiting." (alert rule)

## Empty Passages

If little is left after the cuts, the series hid that the passage said little.
Rebuild it on facts, such as what was done, found, or decided, as
[Little content](abstruse-wording.md#after-the-rewrite) says; tell a story or
case only from the user or a source, never an invented one.

- Status report: "The team investigated, analyzed, and looked into the latency
  issues and problems." → "The team investigated the latency problems." → "The
  `/search` latency spikes come from a query on `orders.customer_id`, which has
  no index; the team plans to add one next sprint." (profiling notes and plan
  from the user)

## Distinct Members

For members that pass both tests, use the first row that fits:

| Finding                                                       | Do                                                                                                                                                                                                                                                 |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Each needs its own facts, such as a condition or a result     | Its own sentence with those facts, from a source ([Splitting](idea-load.md#splitting)); for several, a list under a line that says what they are for                                                                                               |
| The reader needs them together, such as terms they tell apart | Keep the series, with an example from a source where it shows what a member means or why the series matters; for a reader new to the terms, write each as [Words with a Nuance](abstruse-wording.md#words-with-a-nuance) says, one item per member |

- API reference: "The endpoint rejects malformed or invalid requests." → "If the
  body isn't valid JSON, the endpoint returns `400 Bad Request`. If it parses
  but lacks a required field, it returns `422 Unprocessable Content`." (the
  code; RFC 9110)
- Kept for developers, who get `401` without valid credentials and `403` when
  credentials don't grant access (RFC 9110): "The gateway authenticates and
  authorizes each request." For new users: "Acme checks who you are, then what
  your role lets you do: a Viewer can open a dashboard but not edit it." (the
  docs)
- Runbook: "The on-call engineer acknowledges, triages, and escalates alerts." →
  not "handles alerts", which drops what each duty requires, but "To get each
  alert to someone who can fix it, the on-call engineer:" with the bullets
  "acknowledges each alert within 5 minutes", "sets its severity from the
  Severity Levels table", and "pages the service owner for SEV1 and SEV2".
  (on-call policy from the user)

## Repeated Ideas

A sentence that adds no fact, condition, or relation the text hasn't stated
repeats a point, even far from the first: keep the clearer statement where the
reader needs it, move into it any fact only the other has, and delete the other.
In a text whose sections are read alone, replace the repeat with a link by name
to the section that states it, or keep a fact the section needs to be read alone
([Self-Contained Sections](structure.md#self-contained-sections)).

- Release notes: "`acme sync` now retries failed uploads. Uploads that fail are
  now retried automatically, up to 3 times." → "`acme sync` now retries a failed
  upload up to 3 times."

## Overlaps

- A series of judgments ("fast, lean, and efficient"): the
  [evaluations](evaluations.md) fix for each member, in the Words pass; keeping
  one is no fix.
- A set pair ("each and every"; "null and void" outside legal text):
  [One-Word Meaning](cliches.md#one-word-meaning).
- A rewording after "in other words" or "or rather", and a term beside the words
  that explain it: [Self-Correction](introductory-words.md#self-correction).

## Keep Cases

- Terms that look alike but differ for this reader
  ([Distinct Members](#distinct-members)).
- A lead or summary the text expands, a closing checklist or rule drawn from the
  sections ([Ending a Long Text](structure.md#ending-a-long-text)), and a fact
  repeated where the reader acts on it, such as a warning beside its step.
- A fact a section read alone needs, even if another section states it
  ([Repeated Ideas](#repeated-ideas)).
- Verbatim and legal text, such as a quoted error message or "null and void" in
  a contract ([When to Use](../SKILL.md#when-to-use)).
