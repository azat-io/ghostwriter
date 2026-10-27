# Unfounded Claims

Words pass, filler group: claims that are false or that nothing supports. A
**false claim** states a fact a source contradicts. A **weasel claim**, its
vague cousin, names no fact a source could check, as in "studies show", and
stands in for proof the writer lacks. Readers act on both as facts. Default:
replace each with facts or a real case from a source; correct what a source
contradicts. The deletion test in [filler.md](filler.md) protects the keep cases
below.

## Detection

Test every claim the reader could doubt, such as a trend, a consensus, a study's
finding, a rank, or a promise of safety; check its facts against the code, docs,
or data, not the text's word:

- **Fact.** What fact would make it true: a number, name, date, event, or
  measurement? One that names none, or an abstract stand-in such as "traction"
  for a count, is a weasel claim or a judgment ([Overlaps](#overlaps)).
- **Source.** Who measured or said it, and when? Before you call a fact missing,
  search the sources the [Check](../SKILL.md#check) allows; ask the user only if
  the fact would change the main point or what readers do.
- **Swap.** Put in another topic, or the opposite trend ("moving to monorepos" →
  "leaving monorepos"). If it reads as just as plausible, it carries no fact.
- **Count.** How many cases stand behind it? For one, see
  [One Case Told as a Trend](#one-case-told-as-a-trend).

In your own draft, such a claim marks a fact you haven't found.

## False Claims

Never write a claim a source contradicts. In text you edit, correct it from that
source, no further than the source goes, or delete it if the corrected claim
serves no reader; name the change in your reply. Never blur it: a vaguer version
still claims what the sources don't show. A fact that undercuts the text's point
stays ([Check](../SKILL.md#check)).

- Upgrade guide: "Upgrades cause zero downtime." → not "minimal downtime", but
  "During an upgrade, the cluster can't process writes for about 30 seconds
  while it elects a new leader." (upgrade docs)

## Weasel Claims

Each is a vague version of a checkable claim. Triggers:

| Kind                | Triggers                                            | Write instead, from a source                                                                |
| ------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Trend               | "more and more teams", "is taking over"             | Counts at two dates, with who counted, or the adopters by name                              |
| Consensus           | "it is widely accepted", "many developers agree"    | A survey: who ran it, its sample, and its date                                              |
| Anonymous authority | "studies show", "experts recommend"                 | The study or expert: who, when, and what they measured or said                              |
| Hedged rank         | "arguably the fastest", "probably the most popular" | The comparison: what was measured, against which rivals, by whom                            |
| Rhetorical question | "where else can you get", "why would anyone still"  | The fact it implies; about the team itself, [Self-Description](cliches.md#self-description) |

Never keep one for its sound. Never delete only the hedge from a hedged rank:
the rest reads as more certain than its source ([Check](../SKILL.md#check)).
Likewise, never drop only an unnamed source ("studies show", "benchmarks show")
from a claim with a figure. If the facts contradict the impression, such as
falling downloads behind "is taking over", it is a [false claim](#false-claims).

- Status report: "The v2 API is gaining traction." → "Calls to the v2 API rose
  from 1.2 million in July to 3.4 million in September." (API dashboard)

## One Case Told as a Trend

Triggers: one event, then "increasingly", "more and more", or "is becoming the
norm".

The trend adds importance, not facts: the same sentence would follow any other
case. Tell the case with its facts and leave conclusions to the reader; never
infer the trend ([Check](../SKILL.md#check)). If the trend matters, give counts
over time from a source, keeping data that weakens it.

- Design doc: "Users increasingly run the CLI on Windows, as last week's bug
  report shows." → "Issue #431 reports that `init` fails on Windows." (the
  issue)

## No Source

When no source confirms or contradicts a claim (the text that makes it is no
source for it), follow the table below. Two kinds of claim don't follow it. For
one a source shows is still open, such as "no customer data was exposed" while
an access-log check runs, give what is known and what isn't
([Plain Facts](euphemisms.md#plain-facts)). For a reassurance about loss,
exposure, safety, or recovery that no source confirms and the text doesn't
support nearby ([Keep Cases](#keep-cases)), such as "no data was lost" alone,
ask the user what check shows it; until they answer, leave it out and say so in
your reply.

| Case                                                                                                                                                                                     | Do                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Your own draft                                                                                                                                                                           | Leave it out; never hedge it ("arguably") to make it safe; a reassurance follows the rule above this table. If an opening or argument rests on it, cut the passage or build it on the reader's task, a real case, or the author's experience from the user                                                                                                                                                                                                                   |
| Text you edit: a stock or weasel claim, which names nothing a source could check, or a hedged rank ("arguably the fastest"), whose hedge concedes that nothing settles it                | Delete it whole, hedge included; if a point rests on it, rebuild the point on the reader's task, a real case, or the author's experience from the user, or keep it and ask the user; if the reader needs the fact, ask the user or name the gap                                                                                                                                                                                                                              |
| Text you edit: a specific claim, which names a number, name, rank, or event, such as "the API serves 10,000 requests a second", even after an unnamed source ("studies show a 15% drop") | Keep it, with any source it cites, in plain words, and name it in your reply with the fact that would settle it, such as which study. Leave it where it stood, or beside the same topic if other passes reorder the text; never move it into a lead or beside a claim it would seem to support; if any place would make it read as a claim no source shows, such as a general figure on a product page read as the product's own result, delete it and name it in your reply |

Never fill the gap with an invented case, number, source, or experience. A step
or conclusion you derive needs a source for every premise it rests on, not only
for its first fact: "The Free plan allows 3 projects" supports "upgrade to add
more" only if a source shows a paid plan allows more; with a premise missing,
name the gap in your reply instead of adding the step. A hypothetical marked as
made up can show how something works; never use one, or its numbers, to suggest
how common a problem is or how much a fix saves.

- Guide you edit, with no data on build times: "Most teams lose hours to slow
  Docker builds." → "This guide orders your Dockerfile so that editing source
  files doesn't make Docker reinstall your dependencies." (Docker build cache
  docs)

## Sources

Name who measured or said a claim and when, as precisely as a doubting reader
needs ("in our load test on May 3"): a named source lets readers judge the
claim, even if it is wrong.

| Source                                                  | Rule                                                                                                                                             |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Data, such as a dashboard, survey, or benchmark         | Who measured what, how, and when; keep its doubt, such as "about" or a small sample                                                              |
| A source with a stake, such as a vendor's own benchmark | Name the stake ("in Acme's own benchmark"): a stake can skew the method or the result                                                            |
| A figure quoted second-hand                             | Check it in the primary source, such as the report or dataset, for the same period, and cite that; if you can't open it, cite where you found it |
| A figure the author disputes                            | Keep it exact, with its source, beside the author's own check and its method, from the user                                                      |
| A private conversation, chat, or email                  | Only if the user says the other person agreed to be quoted, attributed as agreed                                                                 |
| An article, book, study, or talk                        | Only one you opened or the user names as where they learned the fact; never from memory                                                          |

## Opinion and Experience

Triggers: "no serious team would", "everyone hates", "the industry has moved on
from".

In an opinion text, a claim about what everyone thinks or does often stands in
for the author's view. With no source for it, drop the universal, state the view
plainly ([Opinion](introductory-words.md#opinion)), and add, in the first
person, the experience it rests on, with its limits ("I haven't measured this"):
stated as the author's own, the statement is true, and readers can weigh it.
Take the view from the text and its basis from the text or the user, or ask the
user; never invent it: a view or experience you supply would not be the
author's.

- Blog post: "No one enjoys reviewing 2,000-line pull requests." → "Past about
  400 lines of diff, I start skimming, so I ask for smaller pull requests. I
  don't know how common that is." (the author's habit and its limits, from the
  user)

## Overlaps

- A hearsay marker that lowers certainty ("reportedly", "apparently"):
  [introductory words](introductory-words.md#trigger-list), which keep it on
  hearsay you can't trace; an unnamed authority offered as proof ("studies
  show", "experts recommend") is a weasel claim.
- Common-knowledge markers ("as everyone knows"):
  [introductory words](introductory-words.md#common-knowledge); the claim left
  gets the tests above.
- A judgment, hedged or not ("the best", "faster"), and a vague benefit ("helps
  prevent outages"): the [evaluations](evaluations.md) fix, hedge and all. A
  rank the facts could settle ("the fastest", "the first") is a specific claim.
- A vague amount or rank a source can make exact ("some users can't sign in",
  "one of the top 10"): [vague words](vague-words.md).
- A precise-looking figure nothing could measure ("2,317,904 bugs prevented") or
  a share of a whole population with no survey named:
  [Figures with No Measurement](facts.md#figures-with-no-measurement).
- Self-description ("loved by top teams"):
  [Self-Description](cliches.md#self-description).
- An unchecked reassurance ("no customer data was affected"), which
  [euphemisms](euphemisms.md#detection) route here, follows the reassurance rule
  in [No Source](#no-source).

## Keep Cases

- A claim the text supports nearby or cites a source for that checks out, and a
  fact the reader certainly knows.
- A belief reported to refute it
  ([Common Knowledge](introductory-words.md#common-knowledge)), and a
  hypothetical marked as made up
  ([Hypotheticals](introductory-words.md#hypotheticals)).
- A view stated as the author's own, real doubt stated plainly ("we don't know
  yet whether…"), and an estimate a source gives with its "about".
- Quotations and verbatim text ([Check](../SKILL.md#check)).
