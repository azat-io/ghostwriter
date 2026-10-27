# Cliches

Words pass, filler group: widely used set phrases that stand in for one word or
leave their meaning unclear. Readers skim familiar phrases, so padding can hide
the point. Default: replace each with the plainer word it stands for or the fact
it hints at; otherwise delete it. The deletion test in [filler.md](filler.md)
protects the keep cases below.

## Detection

Cliches read as ordinary wording, so check every set phrase, not only the
triggers. A phrase is a cliche if a plainer word says the same ("rare" for "few
and far between") or if its meaning stays unclear, as when the sentence would
fit another product, team, or release unchanged. Judge by familiarity, not
vividness: wording made for this text is not a cliche. In your own draft,
suspect any phrase chosen to sound expert.

Most cliches carry a borrowed tone. Any tone, listed or not, shows where to
look; the definition decides. Triggers by tone:

- **Advertising and corporate** (landing page, press release): "to the next
  level", "a game-changer", "out of the box", and
  [self-description](#self-description)
- **Officialese** (form letter, policy): "please be advised that", "please find
  attached", "in the event that"; see [officialese](officialese.md)
- **Journalese** (news, release post): "a double-edged sword", "under the hood",
  "we're thrilled to announce", "in today's fast-paced world"
  ([Present-Day Markers](#present-day-markers))
- **Essay and AI-written text** (generated summary): "plays a crucial role in",
  "a testament to", "in the realm of", "navigate the complexities of"; single
  words in this tone, such as "leverage" or "underscore", are
  [abstruse wording](abstruse-wording.md)
- **Meeting talk** (status update): "touch base", "move the needle"

Everyday idioms carry no tone: only the full scan finds them
([One-Word Meaning](#one-word-meaning)).

## Overlaps

Fixes for phrases another group also flags:

- Asides ("at the end of the day") and courtesy formulas ("do not hesitate to
  reach out" or "to contact us"): delete, as for
  [introductory words](introductory-words.md); if the reader may need help, say
  where to ask
  ([Politeness for Show](introductory-words.md#politeness-for-show)).
- Judgments ("works like a charm"): as for [evaluations](evaluations.md), give
  facts or delete; a plain judgment ("works well") is no fix. If a keep case
  there lets a verdict stay, word it plainly.
- A vague plain word ("soon"; "many" for "a whole host of"): name the time,
  amount, or items from a source, as for [vague words](vague-words.md); with
  none, keep the plain word.
- A claim no source supports, stock ("loved by developers everywhere") or
  specific ("500 companies use it", "the first open-source APM"), even about the
  team's own work: [No Source](unfounded-claims.md#no-source).
- A present-day marker set off by a comma ("Nowadays,"): see
  [Present-Day Markers](#present-day-markers), keep cases included.
- A series of near-synonyms the writer put together, not a set phrase ("bugs,
  errors, and issues"): [redundancy](redundancy.md).

## One-Word Meaning

Use the plainer word, or delete the phrase if the sentence already says it; an
evaluation or a vague word, such as "quickly" for "in no time", follows
[Overlaps](#overlaps). Add any fact the reader needs that the word leaves out,
from a verified source.

The table gives the word for each phrase's usual sense. Check it against the
sentence: if it changes what the sentence claims, such as its doubt, certainty,
timing, action, or result, choose a word that keeps the claim, or state the
fact. Triggers:

| Set phrase                               | Use                        |
| ---------------------------------------- | -------------------------- |
| "each and every"; "the vast majority of" | "every"; "most"            |
| "more often than not"; "all of a sudden" | "usually"; "suddenly"      |
| "delve into"; "shed light on"            | "examine"; "explain"       |
| "reach out to"; "circle back on"         | "contact"; "discuss again" |

- "This section sheds light on how `git pull` works under the hood." → "This
  section explains how `git pull` works."

## Unclear Meaning

Triggers: worn images, such as "low-hanging fruit", "the tip of the iceberg", "a
moving target".

The phrase hints at a fact: state it from a source the
[Check](../SKILL.md#check) allows, never invented; for an image, state what it
stands for, such as both sides of "a double-edged sword". Choose facts that
carry its point, and keep any that would change the reader's conclusion. With no
source, keep the image's plain claim, such as "the schema keeps changing" for "a
moving target"; delete a phrase that makes none, or whose plain claim is a
judgment, such as "faster" for "to the next level" ([Overlaps](#overlaps)); if
the reader needs the fact, ask the user or name the gap. Another stock phrase is
no fix: "a game-changer" → "a paradigm shift".

- "Vite supports TypeScript out of the box." → "Vite converts `.ts` files to
  JavaScript without a plugin, but it doesn't type-check them." (Vite docs)

## Self-Description

Triggers: the table below, and similar phrases wherever a person, company,
product, team, or project describes itself; a whole bio or "about" page also
follows [about pages](about-pages.md).

Anyone can say these: a self-description fails if the reader can't then say what
this one does, or if, read unchanged, it would be just as true of a neighbor,
such as another product or company in the same field; a plain role or kind, such
as "a Go developer" or "a CSV library", is no self-description. Replace it with
facts from the sources, which even a small project has: what it does, what the
reader gets ([The Reader's Gain](promotion.md#the-readers-gain), or for a
person, team, or company, [What Readers Get](about-pages.md#what-readers-get)),
results stated plainly, supported versions, what it leaves out, chosen by the
reader's questions
([Questions Readers Bring](facts.md#questions-readers-bring)). Add "the only",
"the first", or "the largest" only if a source says so; one the text already
makes is a [specific claim](unfounded-claims.md#no-source). Promise only what
the sources back; state the limits they name that would change the reader's
decision and, where a source gives one, what to do instead. If a source gives a
limit's reason, state it: it shows readers whom the product suits. With no
source, delete a stock phrase; a vague word or a specific claim follows
[Overlaps](#overlaps). On a whole text about a person, team, or company longer
than a short bio, such as an about or services page but not a job application,
which takes
[Tailoring to the Employer](job-applications.md#tailoring-to-the-employer), run
the same test on the whole, with a neighbor's name in place of every name in it,
including those of what it offers: if most of it still holds, apply the
whole-page check in
[Parts of a Longer Page](about-pages.md#parts-of-a-longer-page), which rebuilds
the text in a draft or a restructure and, in an edit, names the needed rebuild
in your reply.

| Cliche                                 | Write instead                                                                                                                                                                                   |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "all-in-one"                           | What's included and what the reader ends up with                                                                                                                                                |
| "integrates with everything"           | The supported list, or for a long one, the main cases and a link to it                                                                                                                          |
| "for any use case"                     | The kinds of projects it is built for                                                                                                                                                           |
| "tailored to your needs"               | Real cases and what was done in each; contrast with a default approach only from a source                                                                                                       |
| "built by developers, for developers"  | The problem in the maintainers' own work that led to the project                                                                                                                                |
| "industry veterans"                    | Work the reader can check, such as packages maintained                                                                                                                                          |
| "a new kind of database"               | What the reader gets; how new it is only beside results                                                                                                                                         |
| "available worldwide"                  | Supported regions and platforms, not growth                                                                                                                                                     |
| "no hidden fees"                       | What is public, such as prices and rate limits, and what it lets the reader plan                                                                                                                |
| "built to last", "on time, every time" | Practices the reader wouldn't assume, such as a week on staging per release or a release every six weeks; nothing if they are standard, such as code review                                     |
| "loved by top teams"                   | Their names, from a source such as `ADOPTERS.md` ([Users](evaluations.md#fill-with-facts)); for a client list, the projects behind it ([Past Work and Users](promotion.md#past-work-and-users)) |

- Small library: "A friendly CSV toolkit for all your data needs." → "Reads and
  writes RFC 4180 CSV files. It loads the whole file into memory: for files that
  don't fit, stream them with Python's `csv` module." (README, from the user)

## Present-Day Markers

Triggers: "nowadays", "currently", "at this point in time", "recently", "in
recent years", "in today's fast-paced world", "now more than ever"; "last month"
or "last year" in the user's facts.

Words, usually opening a sentence, that point to the present or the recent past
to make a topic look current or urgent, as in a proposal's case for a budget or
a hire. They are common in journalese and in [officialese](officialese.md),
where they are the easiest first cut before rewriting the rest. A statement with
no time already reads as present. Unless the keep paragraph after these bullets
applies, replace or delete the marker:

- If the time matters, replace the marker with the version, date, or period; if
  no source has one, keep the marker. A relative time counts from when it was
  written, "last year" as the calendar year: from today's date only if the user
  says it in the conversation, not in notes or text they paste. Otherwise
  convert one only if you know when it was written or a dated source, such as
  the user's facts, dates the same event; take a missing year ("in September")
  only from such a source, never from today's date; else keep it and name it in
  your reply. In a text read later, write the date or period it stands for and
  state each conversion in your reply; if a dated source disagrees, use the
  source and ask the user. A deadline in the user's facts that may have passed,
  even one with no year ("we'll email by October 16"), or a status they give as
  ongoing ("we're still checking"): keep it, ask the user whether it still
  holds, and never assume its year.
- Back an urgency or trend claim with data and its source
  ([unfounded claims](unfounded-claims.md#weasel-claims)); for an importance
  word ("more important than ever"), state the consequence that makes it matter
  ([evaluations](evaluations.md#adjectives)).
- Narrow a sweeping claim about people ("nobody reads docs") to what a source
  supports, or tell a real case, which is easier to believe and doesn't lecture;
  take it from the user or the project's records, never invent one
  ([unfounded claims](unfounded-claims.md)).
- With neither data nor a case: [No Source](unfounded-claims.md#no-source).

Keep a marker that dates an event ("the deploy is today") or contrasts times, as
"now" does in a changelog: it shows which time each statement describes. A vague
one dating a single change, as in the first example, gets the version or date
from a source; with none, it stays. A trend or urgency claim compares times too
but is no keep case. A kept "at this point in time" becomes "now".

- "Recently, Python dictionaries started to keep insertion order." → "Since
  Python 3.7, dictionaries are guaranteed to keep insertion order." (Python
  docs)
- Proposal: "In recent years, flaky tests have become a growing problem." →
  "Flaky tests failed 12% of CI runs on `main` in September, up from 3% in
  June." (CI dashboard)
- "These days, nobody reads error messages." → "Last week I lost an hour on a
  failed deploy before reading its error message, which named the missing
  environment variable." (the author's story, from the user)
- Kept: "In npm 3 to 6, `npm install` didn't install peer dependencies; now it
  installs them by default." Without "now", the second clause would also
  describe npm 3 to 6. (npm docs)

## Openings

Triggers: "in the world of", "when it comes to", "in this article, we will
explore", "have you ever wondered".

A stock preamble delays the point and signals padding. Delete the stock phrases
and, in the Order pass, open with the substance, usually stated further down; a
text with one point opens with it, and a long text's introduction follows
[Orienting the Reader](structure.md#orienting-the-reader). A text meant to
engage, such as an opinion piece or a blog post, may first draw readers in with
a hook from the user or a source ([Hooks](paragraphs.md#hooks)). A plain line
listing a long text's parts ("This guide covers installing, configuring, and
upgrading the agent.") can stay: it helps readers decide whether to read on.

- "In today's fast-paced world, performance matters more than ever. In this
  post, we'll delve into how we made our dashboard faster." → "We cut the
  dashboard's load time from 4.1 to 1.3 seconds by loading each chart only when
  it scrolls into view." (measurements in the PR)

## Opinion Texts

In reviews, opinion posts, and RFC comments, state the author's position and
reasons plainly, even for a hard argument: fancy wording only hides it. Take
both from the author's text or the user; facts from docs can back a reason the
author gave, never replace a missing one. A verdict the reader needs stays,
worded plainly ([Overlaps](#overlaps)). With no position under the cliches,
delete the passage; if the text needs a view or reasons the author didn't give,
ask the user.

- Review: "Postgres is the Swiss Army knife of databases." → "Postgres has
  `jsonb` columns for JSON documents and built-in full-text search, so a small
  team may not need a separate document store or search engine." (the reviewer's
  argument; Postgres docs)

## Keep Cases

- Terms and plain phrases no plainer word replaces: "race condition", "by
  default", "make sure". Many terms began as images ("memory leak"); the same
  words can be either: "first-class functions" is a term, "first-class
  TypeScript support" a cliche.
- Literal use: "A hard disk has moving parts; an SSD has none." As an image
  ("the new design has fewer moving parts"), the phrase is a cliche.
- Wording made for the subject, even an image, if deleting it loses meaning: "A
  Git branch works like a bookmark that moves to each new commit you make on
  it."
- A present-day marker that dates an event or contrasts times: see
  [Present-Day Markers](#present-day-markers).
- Verbatim text, such as an error message, a UI label, a name, or a quotation:
  in "If the page shows `Something went wrong`, check the server log.", the
  reader matches the message on screen.
