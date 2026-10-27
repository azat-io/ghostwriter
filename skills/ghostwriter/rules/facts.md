# Facts and Figures

Meaning pass: figures no measurement backs, figures this reader can't place,
numbers that mislead by their placement or count, and facts they don't need.
Readers judge a figure against values they know from their own work, which may
not be the writer's. Default: keep the facts this reader needs, each figure with
what it means for them, from a source.

## Figures with No Measurement

Triggers: a precise count of something nobody counts, such as bugs prevented; a
share of a whole population ("of developers") with no survey named; more digits
than a measurement of the kind could give.

Name the measurement behind each figure: who counted what, in which group, and
when. A figure with none claims a precision nobody had: readers can neither
check nor place it, and they start to doubt the text's other numbers and its
author. Never write one in your draft. Use the first row that fits:

| Finding                                                                              | Do                                                                                                                                                                                                                                          |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A source has the measurement                                                         | Give it, scoped to what was measured ("4 of the 6 teams we interviewed"), with its [source](unfounded-claims.md#sources)                                                                                                                    |
| Nothing could measure it                                                             | Delete it whole and rebuild any point resting on it, as for a [weasel claim](unfounded-claims.md#no-source)                                                                                                                                 |
| A share of a whole population or of everyone ("of developers"), with no survey named | Ask the user for the survey; with none, delete it whole as a [weasel claim](unfounded-claims.md#no-source), rebuild the point, and name the cut in your reply                                                                               |
| Another figure no source has, such as the author's own benchmark or user count       | A [specific claim](unfounded-claims.md#no-source): keep it where it stood and name it in your reply with the doubt it casts; delete it where its place makes it read as a claim no source shows, such as a general figure on a product page |

- Landing page: "Acme has kept 3,481,920 bugs out of production." → deleted; the
  point rebuilt: "In September, Acme blocked 4,210 merges whose tests failed."
  (usage dashboard)

## What a Figure Means

Triggers: a spec or limit for readers outside its field; a large count; a unit
the reader doesn't plan by.

Test each figure, in your draft as in text you edit: could this
[reader](../SKILL.md#when-to-use) tell from it alone whether it is enough, a
lot, or a problem for them? If not, keep the figure, exact where they use the
value ([Check](../SKILL.md#check)), and add beside it what a source gives:

| The source gives                                     | Add                                                                                                                   |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| What happens at or past the value, such as a timeout | What it lets the reader do or stops, and what to do then: "a slower response fails, so do slow work after responding" |
| A value the reader knows, such as the old limit      | The comparison: "twice the old limit"                                                                                 |
| Inputs, such as the reader's usage                   | The figure in the reader's terms, such as a count of files                                                            |

Recompute each derived number from its inputs, in one unit (a GB is not a GiB).
Where an input is measured, averaged, or rounded, round only the final result,
to the nearest value, with "about": a sum or difference to the place of the
least precise input's last digit (3.6 million rows plus 230,000 new ones is
about 3.8 million), a product or quotient to at most the fewest significant
digits any such input has, and fewer where the reader needs less. Carry a bound
a source gives into the result as a bound, checking which way it points (100
requests in under 2 seconds is over 50 a second), and round it outward, never to
a tighter value. A result of exact inputs, such as a price times a seat count,
stays exact, except a quotient that doesn't come out even, such as a share of
exact counts, which is rounded to the nearest value at the digits the reader
needs; a share above 0% never rounds to 0%, nor one below 100% to 100% ("under
0.1%", not "0.0%"). Never present a derived number as measured, compare only as
a source or your arithmetic supports, and state its inputs and formula in your
reply.

- Internal report: "The Team plan includes 50 GB of storage." + "At our average
  file size of 2.5 MB, that is about 20,000 files." (plan docs; usage dashboard)

## Implied Arithmetic

Triggers: two numbers side by side, such as a per-seat price and a flat fee, or
a rate and a size.

Readers work out a total, a rate, or a duration from numbers that stand
together, and take it as stated. Do that arithmetic, check it against the
sources, and use the first row that fits:

| The result                                                                                    | Do                                                              |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| False, such as a per-seat total that adds in a flat fee, or a duration that leaves out a step | State the true relation, from a source, or separate the numbers |
| Unknown: no source shows it                                                                   | Separate the numbers, and name the gap in your reply            |
| True                                                                                          | Leave it; where the reader needs it, state it, checked          |

Never place numbers so that readers infer a result you couldn't state as true
([Order](../SKILL.md#4-order)).

- Pricing page: "Team: $20 a seat per month, plus $50 for SSO." reads as $70 a
  seat → "Team: $20 a seat per month. SSO adds $50 a month for the whole
  organization, whatever its size." (price list from the user)
- Runbook: "The import loads 1,000 rows per second; the table has 3.6 million
  rows." suggests the import takes an hour → "The import loads the 3.6 million
  rows in about an hour, then rebuilds indexes, which took 2 hours in the last
  run: plan for about 3 hours." (the last run's log)

## Selecting Numbers

Triggers: three or more numbers in a sentence; raw counts beside their totals.

Each number is one more thing to hold ([idea load](idea-load.md)). Decide by the
[goal](goal.md#planning-the-moves) which ones the reader needs here:

- Keep those that answer a reader's question or make a move; drop the rest,
  naming each cut in your reply, or move them to a table. Never drop one that
  would change what the reader concludes ([Check](../SKILL.md#check)); if
  unsure, move it.
- Give a count that means something only against its total as the share; keep
  the count where the reader uses it, such as records to restore.

- Incident summary for leadership: "From 14:02 to 14:49 UTC, the API returned
  18,342 errors out of 873,400 requests, and p99 latency reached 4,812 ms." →
  "For 47 minutes, from 14:02 to 14:49 UTC, 2.1% of API requests failed." The
  other figures move to the timeline. (incident timeline)

## Questions Readers Bring

Triggers: counts of the writer's effort, such as commits or months of work; a
fact kept because it is fun.

List the questions this reader brings at this stage, from the
[goal](goal.md#setting-the-goal), and answer each with facts from sources: a
developer evaluating a tool asks what it costs, what support it has, whether it
does their task on their stack, and who runs it with what result; one upgrading,
what breaks, what they gain, and what to do.

- Where the answer depends on the case, such as a migration time that depends on
  data size, say so and, from a source, how readers find out theirs; with no
  source, name the gap in your reply.
- Cut a fact that answers none, or move it where it serves, such as a closing
  thanks, as [Using the Goal](goal.md#using-the-goal) says; keep one the reader
  needs that no question asks for ([Check](../SKILL.md#check)). A size as proof
  takes [Ranks and Size as Proof](vague-words.md#ranks-and-size-as-proof), a
  stock phrase [Self-Description](cliches.md#self-description).

- Release post: "Version 5 is out: 214 merged pull requests from 38 contributors
  over 9 months." → "Version 5 requires Node.js 20 and renames `--out` to
  `--out-dir`; `acme migrate` updates your config." The counts move to the
  closing thanks. (release notes)

## Overlaps

Rounding and qualifiers such as "more than":
[Hedged and Overprecise Figures](vague-words.md#hedged-and-overprecise-figures);
"from" prices and best cases:
[Starting Prices and Best Cases](vague-words.md#starting-prices-and-best-cases);
a judgment beside a figure ("excellent p99"):
[Fill with Facts](evaluations.md#fill-with-facts), then this file; a relative
time in the user's facts ("last year", "for 8 months"):
[Present-Day Markers](cliches.md#present-day-markers).

## Keep Cases

- Reference tables, specs, and benchmarks whose readers use every value: keep
  each value, with what it means beside it, never in its place.
- A figure in a unit this reader works with, such as milliseconds for backend
  developers; a derived figure a source states; verbatim text.
