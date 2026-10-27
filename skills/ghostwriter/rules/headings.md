# Headings

Presentation pass: the title of a whole text and the headings of its sections;
Order pass: the scope a title sets. Readers may see the title alone and decide
from it whether the text concerns them. Default: if readers meet a text outside
a titled thread or page, title it by its topic, in their words, unless it is a
short message or string.

## Where a Title Goes

Where readers meet a text decides whether it takes a title and which kind. Give
it a title in your draft, and add one to a text you edit only if it needs one
and lacks it; an excerpt of a page or thread needs none. Use the first row that
fits:

| Text                                                                                                                          | Title                                                                                     |
| ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| A reply in a thread, a review comment                                                                                         | None                                                                                      |
| An issue, a PR, a commit, an email, an in-app notice                                                                          | Its title field or subject line                                                           |
| A profile README ([about pages](about-pages.md#opening-with-the-role))                                                        | The owner's name, then a line on who they are, or the owner's own greeting that says both |
| A README                                                                                                                      | The project's name, then a line on what the project does                                  |
| An announcement, an incident update, or another post of several paragraphs in a chat channel                                  | A bold first line                                                                         |
| A short message or string, such as an error message, a UI or CLI string, a code comment, a docstring, or a short chat message | None                                                                                      |
| Any other text, such as a docs page, a blog post, or a design doc                                                             | A top-level heading                                                                       |

## What a Title Says

A title often appears without its text, as in search results or a list of pages.
Name the topic in the words readers know or would search for and, where readers
decide by it, the main point, from the text. Test: from the title alone, at
first glance, can a reader tell what the text covers and whether it is for them?
Rewrite one that fails, on a published page only as [Keep Cases](#keep-cases)
allow:

- A label that fits any text: PR "Fix bug" → "Fix crash when `config.toml` is
  empty" (the diff); incident update "Update" → "Uploads failing since 14:05
  UTC" (incident notes)
- A topic without the point readers decide by: release notes "Node.js support" →
  "Acme 4 drops Node.js 18" (release notes)
- A topic for other readers: "Scaling Postgres to millions of users" on a guide
  to a local development database → "Run Postgres locally for development" (the
  guide)
- Wordplay, a rhyme, or a joke, in any text, promotional or personal too: blog
  post "Cache Flow" → "Caching session tokens in Redis" (the post)

## The Title Read Alone

Read each title alone, yours or one you edit, as a reader who sees or shares it
without opening the text: does it say or imply what the text doesn't, such as
who is to blame, how many are affected, how bad it is, or what a quote refers
to? Rewrite it, on a published page only as [Keep Cases](#keep-cases) allow,
with the context that keeps it true, no softer or harsher than the text
([euphemisms](euphemisms.md)): a quote stays verbatim, with what it refers to,
or becomes an unquoted paraphrase. Name a person in a title only where
[Bad News](euphemisms.md#bad-news) lets the text name them and readers need the
name there; otherwise name the change, system, team, or vendor a source shows as
the cause.

- Interview post: "Acme maintainer: 'Avoid Acme 2'" → "Acme maintainer advises
  against Acme 2 on Windows" (the interview)
- Postmortem: "New hire wipes customer data" → "Cleanup job deleted 40 drafts in
  12 workspaces" (the postmortem)

## Clickbait Devices

Each device below wins a click the text doesn't earn. In your draft, use none
beyond what a fix keeps; in text you edit, fix each, on a published page only as
[Keep Cases](#keep-cases) allow, by the first row that fits:

| Device                                                                                                                                                                                   | Fix                                                                                                                                                                                  |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A teaser that holds back the topic or point: "We replaced our queue with …", "It wasn't DNS this time"                                                                                   | What it holds back, from the text                                                                                                                                                    |
| Hype or shock: "mind-blowing", "insane"                                                                                                                                                  | The fact behind it ([Loud Words](abstruse-wording.md#loud-words))                                                                                                                    |
| A count title that cuts a complex topic into a list: "7 facts about Kubernetes networking"; a list title over a text that isn't a list: "5 reasons builds fail" over a post on one cause | The topic and point the text covers; in your draft, cover a complex topic in sections, not one-line items; in text you edit, name in your reply the items that need more than a line |
| A label that promises more: "Complete guide", "Deep dive", "with benchmarks"                                                                                                             | Keep one the text delivers; else the topic                                                                                                                                           |
| Urgency: "Just in:", "Act now", capitals                                                                                                                                                 | A fresh event's time, a real deadline, or the reason to act, from the text; else delete it                                                                                           |

- Release post: "Acme 5's mind-blowing build times" → "Acme 5 cuts cold builds
  from 90 to 40 seconds" (release benchmark)

## Titles in Feeds and Inboxes

Readers of a newsletter, a feed, a blog index, or an announcement email weren't
looking for the text; they open it if the title shows what it gives them. Name
those readers first ([goal](goal.md#setting-the-goal)), even for a niche
technical text, and title it for them, not a wider group. Then state, from the
text, what it gives them: a result, an answer to something they'd wonder about,
or news that affects them; a plain title on a topic they care about already
does. Add the audience ("for monorepos") or a number only to bring out a benefit
the text has and the plain topic hides. If you can't name what the text gives
them, say so in your reply rather than dress up the title. A work item's title,
such as an issue, a PR, a commit, or a review request, takes no feed treatment:
it follows [What a Title Says](#what-a-title-says),
[The Title Read Alone](#the-title-read-alone), and
[Clickbait Devices](#clickbait-devices).

- Engineering blog index: "Our CI journey" → "Remote caching cut our CI runs
  from 40 to 12 minutes" (the post)

## Requests About Titles

- A catchier or more creative title: write it, and offer the plain one beside
  it, saying in one line that readers find and choose a text by its title. Use
  any device that leaves no false picture, such as wordplay, a teaser, or, once
  you named what readers would take from it, hype; never a list title, label,
  urgency, or claim the text doesn't deliver
  ([When Readers Would Be Misled](requests-to-soften.md#when-readers-would-be-misled)).
- Which title will do best: offer two or three that pass these tests, such as
  one adding the audience, a narrower audience, or the price, each from the
  text, and suggest an A/B test; never predict a winner without the user's test
  results.

## Title as Scope

The title sets what the text covers and for whom. Test each outline item against
it before you draft, then each section and paragraph, in your draft as in text
you edit: content on another topic or for other readers is either not needed, so
cut or move it, or needed, so the title is too narrow and changes, on a
published page only as [Keep Cases](#keep-cases) allow. Decide by the
[goal](goal.md#using-the-goal), within the chosen
[mode](../SKILL.md#when-to-use), and name each cut, move, or new title in your
reply; never cut a fact readers need to fit a title. Propose what doesn't fit as
a text with its own title and outline, or, for several questions readers ask, a
series, one text per question.

- Outline of docs page "Configure logging" with an item on exporting metrics →
  cut the item and propose in the reply a page of its own, "Export metrics",
  linked from this one, or, if readers set up both together, retitle the page
  "Configure logging and metrics". (the docs)

## Section Headings

A section heading names its section's topic, as a title names the text's, so the
[Scope](structure.md#self-contained-sections) test checks both. Word the title
first, then the headings of sibling sections to one pattern that fits it, such
as each command's name or each task as a verb phrase; read them in a row to
check. A section of another kind, such as setup in a reference, takes a heading
of its own kind ([Parallel Sections](structure.md#parallel-sections)).

- Draft CLI reference: headings "`acme build`", "Deploying", "How do I roll
  back?" → "`acme build`", "`acme deploy`", "`acme rollback`". (`acme --help`)

## Finding a Section

Readers of docs, guides, runbooks, and FAQs search or scan headings for one
part. Divide the text as [Choosing a Division](structure.md#choosing-a-division)
says, then word each heading as they'd search for its part: the task, the item's
name, their question, or, for a problem, the symptom they see or the error
message, verbatim. Test: does it hold the key words a reader with that need
would search or paste?

- Contributor guide, troubleshooting: "Merge problems", "Sync issues" →
  "`git merge` fails with `fatal: refusing to merge unrelated histories`",
  "`acme sync` hangs at 99%". (Git's output; support tickets from the user)

## Keep Cases

- A section heading on a published page, or a heading that links or a template
  depend on: suggest a better one in your reply, and change it only as
  [When to Use](../SKILL.md#when-to-use) says. Before you rename, merge, move,
  or remove a heading in text you edit, search the repository and docs for links
  to it.
- A page's title, such as a landing page's top line: links target the page's
  URL, rarely the title's anchor, so edit it with the text, unless the page's
  URL is built from it or a link you find targets its anchor.
- A title a convention or template fixes, such as Keep a Changelog's version
  headings, a Conventional Commits type, or a subject line a job posting sets:
  name the topic in the part you may change, such as the description after
  `fix: `.
- Verbatim text in a title, such as a quoted error message.
- A question title that names what the text answers: "Why does `npm ci` delete
  `node_modules`?" (npm docs)
