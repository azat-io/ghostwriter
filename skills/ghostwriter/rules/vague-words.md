# Vague Words

Words pass, filler group: words that stand for things, cases, a time, an amount,
a price, or a rank without naming them. Readers can't picture or check a claim
whose things or quantities stay unnamed. Default: name what the word stands for,
from a source; with none, keep the word. The deletion test in
[filler.md](filler.md) protects the keep cases below.

## Detection

Ask of each claim: which thing, in which cases, when, at what price, how many,
what place in whose ranking? A word that leaves the answer open is vague: find
the answer in a source the [Check](../SKILL.md#check) allows, never in memory.
In your own draft, each vague word marks a fact you haven't looked up: find it,
or claim no more than a source supports
([unfounded claims](unfounded-claims.md)). A user fact that answers the word's
question for the same claim is its source: replace the word with it. If the fact
may cover another scope, keep the word, give the fact beside it with the scope
the fact states, never as an amount added to the word's, and name the doubt in
your reply.

## Indefinite Words

Triggers: "etc.", "and more", "various", "in some cases", "soon", "some",
"someone", "something", "a certain", "different".

Added for effect, they hide a name, a list, or facts the writer could give. Use
the first row that fits:

| The word stands for                                                                     | Fix, from a source                                                                                                                                                                                 |
| --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A thing or person a source names ("a certain popular linter", "some kind of LRU cache") | The name; if the text names it already, delete the word: "an LRU cache"                                                                                                                            |
| Facts or reasons ("for various reasons", "raised some concerns")                        | The facts; delete the phrase if the reader needs none                                                                                                                                              |
| A list ("supports various databases", "etc.")                                           | The list: "supports PostgreSQL, MySQL, and SQLite" (CI matrix); for a long one, the main items marked as partial ([Example Markers](introductory-words.md#example-markers)) and a link to the rest |
| A count, case, or time ("some users", "in some cases", "soon")                          | The count, the condition, or the date or version                                                                                                                                                   |
| A failure, in an error message you write or edit ("Something went wrong")               | What failed and what the reader can do, from the code; a quoted message stays verbatim                                                                                                             |

- Blog post: "A certain popular linter flags `await` inside loops." → "ESLint's
  `no-await-in-loop` rule flags `await` inside loops." (ESLint docs)
- CLI: "Something went wrong." → "Can't read `acme.toml`: the file doesn't
  exist. Run `acme init` to create it." (the code)

## Hedged and Overprecise Figures

Triggers: a qualified number ("up to", "at least", "10k+", "about", "nearly",
"more than"); a count with no number ("several", "a number of", "thousands of");
more digits than the reader needs, often copied from a dashboard ("1,284,377,912
requests").

Qualifiers such as "more than" don't say how far off a figure is, so readers
take in only the figure. Use the first row that fits:

| The figure                                                                                                                                                                                                                                                                         | Fix                                                                                                                                             |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| No source gives a figure                                                                                                                                                                                                                                                           | Keep the wording: never drop "more than" or "at least", or sharpen "nearly 2×" into "2×"                                                        |
| A source's own estimate: "about", a range, a margin of error                                                                                                                                                                                                                       | As the source gives it                                                                                                                          |
| A value the reader computes with, checks, pays, or types: a version, a requirement or limit ("at least 8 GB of RAM", "up to 3 retries"), a default, size, timeout, price, error code, benchmark result, count they check, or count of harm, such as lost records or affected users | Exact, as the source gives it                                                                                                                   |
| An impression of size, such as stars, downloads, or requests served, whose exact value the reader doesn't use                                                                                                                                                                      | The source's number, rounded down to the precision the reader needs (4,870 → 4,800, never 5,000), without the qualifier; its date if it changes |
| A count with no number, or a small number behind a qualifier                                                                                                                                                                                                                       | The number, or the items where the reader needs them, as in a changelog: "more than 10 languages" → "12 languages" (`locales/`)                 |

If unsure whether the reader uses the exact value, give it; in your own draft,
choose each figure's precision instead of copying every digit. Round only where
it helps the reader take in the figure: a long number, or a count that changes
daily, such as stars (4,870 → 4,800); a short one that holds until its next
dated count, such as 1,284 paying customers on October 1, stays exact. Give each
figure its own date. Say what the source counts: a download count isn't a count
of users.

- Status update: "The API now serves more than a billion requests a month." →
  "The API served 1.28 billion requests in September 2026." (traffic dashboard:
  1,284,377,912)
- Benchmark write-up: "Cold builds are nearly 2× faster." → "A cold build takes
  52 s instead of 97 s." (benchmark results from the user)
- Kept: "A PostgreSQL `integer` holds values up to 2,147,483,647." Readers check
  whether their values fit. (PostgreSQL docs)

## Ranks and Size as Proof

Triggers: "ranked 3rd", "one of the top 10 frameworks", and a size offered as
proof ("a team of 200 engineers").

"Top 10" hides the place and the ranking, and even an exact rank rarely tells
readers whether the product fits their case. Ask whether the reader would decide
differently knowing the rank or size; in your own draft, write one only if so.
Use the first row that fits:

| Finding                                                                                      | Fix                                                                                                   |
| -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| No source has the place, the ranking, or the facts behind them                               | Keep the rank as written and name it in your reply ([unfounded claim](unfounded-claims.md#no-source)) |
| The reader wouldn't decide differently, and a source shows what the place or size gives them | That fact instead, such as the measurement behind the rank                                            |
| Otherwise                                                                                    | For a rank, the place, out of how many, in whose ranking, and when                                    |

- Landing page: "Acme is one of the top 10 web frameworks." → "Acme placed 7th
  of 40 in the 2026 JSON benchmark by Example Labs." → "In Example Labs' 2026
  JSON benchmark, Acme served 210,000 JSON responses per second on one 8-core
  server." (benchmark report from the user)

## Starting Prices and Best Cases

Triggers: "from $10/month", "plans starting at", "as low as"; a best-case
benefit ("up to 10× faster", "save up to 40%").

A "from" price shows only the cheapest option, usually the one with the least in
it, and readers who know that trust the page less. Give each option with what it
includes and its exact price, from the pricing source, so readers can choose,
know what they get, and see before signing up if none fits. For readers who
compare only prices, name the cheapest option and its price, without "from". A
best-case benefit works the same way: give the typical result and the conditions
of the best case, from a source. If a source measures the benefit but shows no
such best case, give its result, with its conditions and who measured it, in
place of the claim, and name the dropped figure in your reply; with no
measurement, keep the claim as written and name it in your reply
([No Source](unfounded-claims.md#no-source)). "Up to 3 retries" is a limit, not
a benefit ([Hedged and Overprecise Figures](#hedged-and-overprecise-figures)).

- Pricing page: "Plans from $10/month." → "Hobby: $10 per month for 1 user and 3
  projects. Team: $25 per user per month, with unlimited projects and SSO."
  (price list from the user)

## Overlaps

- "Approximately", "in excess of", "a whole host of": first the plain word
  ([abstruse wording](abstruse-wording.md#plain-words),
  [officialese](officialese.md#plain-words),
  [cliches](cliches.md#one-word-meaning)), then this file; "certain features":
  [Formalism](officialese.md#formalism).
- Praise by rank, size, or speed with no number ("best-in-class", "the go-to
  choice", "huge", "fast"): [evaluations](evaluations.md); in a
  self-description, [Self-Description](cliches.md#self-description); "the first"
  or "the only": a [specific claim](unfounded-claims.md#no-source).
- A count of users or adopters with no number ("used by thousands of companies")
  stays a count: the number from a source; if it counts only part of the group,
  such as paying customers, that number, saying what it counts; with none, keep
  it, except where it reads as the product's own result, as on a product or
  landing page, where you delete it
  ([No Source](unfounded-claims.md#no-source)); either way, name it in your
  reply. A vague group whose view or trend is the proof ("many developers
  agree", "more and more teams") is a
  [weasel claim](unfounded-claims.md#weasel-claims).
- Bad news ("a subset of users", "some users may experience issues"): the count
  here, with none "some users"; the rest, such as naming a "someone" who caused
  it: [Bad News](euphemisms.md#bad-news).
- "Recently", "currently":
  [Present-Day Markers](cliches.md#present-day-markers).
- A figure this reader can't place, more numbers than the goal needs, numbers
  side by side that suggest a false result, and digits no measurement could
  give: [facts](facts.md).
- Hedges ("usually", "sometimes"): a rate or condition from a source; otherwise,
  the hedge test in [filler.md](filler.md#method).

## Keep Cases

- A vague word no source resolves; if the reader needs the fact, ask the user or
  name the gap.
- A bound that states a requirement, limit, or condition ("Node.js 18 or later",
  "merged more than 30 days ago"), and "from" in a range ("from 2 to 5
  seconds").
- A vague word the next words resolve ("Some commands need network access: those
  that contact the registry.") and "different" meaning "not the same" ("a
  different port for each worker").
- Vagueness that is the point: any one fits ("if someone else has pushed to the
  branch"), or the text can't know who, and gives what it knows: "Someone signed
  in from a new device: Firefox on Linux."
- A name left out on purpose, such as a customer under NDA: ask the user before
  adding it.
- Verbatim text: a quoted error message, a UI label, a plan name, a quotation.
