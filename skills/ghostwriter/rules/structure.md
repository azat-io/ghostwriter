# Structure

Order pass: what follows what in a long text, and where one topic ends and the
next begins; Presentation pass: the sections and run-in labels that show it,
under headings worded as [headings](headings.md) says. A long text is one
readers skim or enter midway, such as a docs page, a guide, a design doc, or a
README. Readers use headings to choose what to read, but headings can make
disordered content look ordered. Default: divide by the reader's
[goal](goal.md), one topic per section, each readable alone.

## Choosing a Division

The same material divides several ways, and readers with other goals may need
another text from it. Choose by what this text's readers come to do; use the
first row that fits:

| Readers                                                                                                                                                                                                        | Divide by                                                                                                                                                                                          |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Look up one item, as in an API, CLI, or config reference                                                                                                                                                       | The item, such as a command, an endpoint, or an option                                                                                                                                             |
| Arrive with a problem, as in troubleshooting docs or runbooks                                                                                                                                                  | Symptom, alert, or error message, in the words they see                                                                                                                                            |
| Choose whom to hire or what to buy, each group with its own case, as on a services or about page for several kinds of clients (not groups doing one task in different settings, as in the install guide below) | The case each group brings, each section in that group's terms with the same parts ([parallel](#parallel-sections)): who brings that case, what they get and by what means, and what isn't covered |
| Decide, as in a design doc or an RFC                                                                                                                                                                           | The questions they must answer, such as the problem, the options, and their costs                                                                                                                  |
| Follow events, as in a postmortem timeline                                                                                                                                                                     | Time, where the order of events carries the point                                                                                                                                                  |
| Otherwise, as in a guide or a tutorial                                                                                                                                                                         | Their tasks, in the order they do them, not the system's parts or the order the work was done                                                                                                      |

Outline first or draft first: both work. Keep a division that helps readers find
and use the material. Try another when sections repeat the same content and
differ only in a detail, as in the install guide below, or hide what readers
look for, such as fixes in the order the team found them. Change the division
only when restructuring is in scope; otherwise name the problem in your reply.
Sections on different items of one kind that share labeled parts are
[parallel](#parallel-sections), not repetition. When you move a part, keep every
fact, condition, and relation, and imply none a source doesn't show
([Order](../SKILL.md#4-order)).

- Draft install guide: Linux, macOS, and Windows sections repeat five steps and
  differ only in the install command → one section per step, with each system's
  command in the install step. (the guide)

## Self-Contained Sections

Each heading starts a section. Run these tests on each, in your outline or draft
as in text you edit:

| Test                                                                                                                                                                   | If it fails                                                                                                                                                                                                                                                                                                            |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Alone.** Can a reader who arrives from a search follow the section and act on it without the sections around it?                                                     | Add what it lacks, from a source, or link by name to what it builds on                                                                                                                                                                                                                                                 |
| **Last paragraph.** Where readers act on the section, does it close with the rule or next step they take from it, rather than with its first paragraph again?          | Add it from the section's own facts or a source ([Closing Sentences](paragraphs.md#closing-sentences)); with none, name in your reply the step readers would need. Numbered steps pass, since their last step is the next step, and may end with a note, from a source, on why they are safe or what they leave undone |
| **First paragraph.** After at most a [hook](paragraphs.md#hooks), does it give the section's point in the heading's terms, and does every later part serve that point? | Move the point up; add a one-line overview only where the section has parts readers choose among, worded plainly ([Openings](cliches.md#openings)); move a part that serves another point to the section on its topic, or cut it ([Using the Goal](goal.md#using-the-goal))                                            |
| **Scope.** Is everything here on the topic its heading names, and everything on that topic here?                                                                       | Split it, or fix the heading ([headings](headings.md)); gather the rest here, and link to it from elsewhere                                                                                                                                                                                                            |

Paragraphs inside a section follow [paragraphs](paragraphs.md).

- Docs section "Caching": "Rate limits apply per API key. Set `cache.ttl` to
  change how long responses are cached." → "Acme caches each GET response for 60
  seconds. To change that, set `cache.ttl`, in seconds." The rate-limit sentence
  moves to "Rate Limits". (the code)

## Parallel Sections

Triggers: sections about things of one kind, such as commands, endpoints, or
plugins.

- Give each the same internal order and the same labels, so readers find the
  same part in each, under headings of one pattern
  ([Section Headings](headings.md#section-headings)). Take the labels from a
  convention or tool where one sets them, such as a docstring format's sections;
  else use bold run-in labels.
- Give a section of another kind, such as setup in a reference, its own shape.

- CLI reference: the `acme build`, `acme deploy`, and `acme rollback` sections
  each order usage, options, and exit codes differently → each gives **Usage.**,
  **Options.**, and **Exit codes.**, in that order; installation stays a
  numbered list in its own section. (`acme --help`)

## Orienting the Reader

A long text with several sections needs an introduction that ties them to the
reader's goal, so readers see how the sections fit together before they start.
Write it last, once the goal and sections are set, and recheck it after any
restructure: it promises only what the sections cover. If you write only part of
a text, write the introduction from your outline, promise only what the outline
covers, and give the outline in your reply. Use at least one move, each from a
source, and add another only if readers need it:

| Move                                                                                        | Suits                           |
| ------------------------------------------------------------------------------------------- | ------------------------------- |
| The reader's task or problem, in their terms                                                | Guides, how-tos, tutorials      |
| Why it matters to the reader: a consequence, a number, or a real case                       | Blog posts, announcements, RFCs |
| Why to trust the text: what it rests on, such as the team's experience or how they measured | Engineering blog posts          |
| What the reader must know or have first, in a line or a link                                | Tutorials, deep dives           |

It may first draw the reader in, only as [Hooks](paragraphs.md#hooks) allows.
Never invent a case, number, or experience
([No Source](unfounded-claims.md#no-source)); delete stock preambles
([Openings](cliches.md#openings)). A reference page, a docs page on a single
task, or a short text whose title orients the reader opens with its point, with
no introduction; a guide or tutorial with several sections gets an introduction
with the moves the table suits to it, and one that teaches something new also
takes those in [Opening](explaining.md#opening).

- Tutorial: "In this tutorial, we'll explore the world of webhooks." → "This
  tutorial builds a server that receives Acme webhooks and rejects any request
  with a bad signature. You need Node.js 20 or later and an Acme API key." (the
  tutorial's code and `package.json`)

## Ending a Long Text

Triggers: a closing "Happy coding!" or "Now go build something!"; a last
paragraph that retells every section ("In summary" itself takes the
[introductory words](introductory-words.md#trigger-list) fix, "I hope this
helps" the [Politeness for Show](introductory-words.md#politeness-for-show)
one).

Many readers stop before the end. Those who reach it use the last part to fit
the sections together and decide what to apply, so give them that, not a
retelling. End a long text that readers act on with one of these, from the text
and its sources; use the first row that fits:

| The text gave                                | End with                                               |
| -------------------------------------------- | ------------------------------------------------------ |
| A change for the reader, such as a migration | What is different for them from now on                 |
| Many tips, checks, or settings               | A checklist of them, in the order readers apply them   |
| One rule or decision                         | That rule or decision, in a sentence readers can apply |
| Steps toward a larger task                   | What to do next, with links                            |
| A caution that holds for every part          | That caution                                           |

Never end with a sign-off, filler about the topic, a claim no section supports,
or a recap of every section. A reference page, release notes, an incident
update, a README, a text whose last section a convention fixes, such as License,
or one whose last section says what to do needs no conclusion.

- Hardening guide, eight sections of tips, ending "Stay safe out there!" → a
  checklist, one line per tip, in the order readers apply them. (the guide's own
  sections)

## Keep Cases

- Sections a template or convention fixes, such as Keep a Changelog's types of
  changes or a PR or RFC template: keep them in order, apply these rules inside
  each, and suggest other changes in your reply.
- Headings that links depend on, as [When to Use](../SKILL.md#when-to-use) says.
- Sections meant to be read in order, such as a tutorial's steps: each may build
  on the ones before.
- A short text, such as a commit message, an error message, an issue or chat
  reply, or a PR description of a few paragraphs, even on several topics: no
  sections beyond those a template fixes, and no introduction or conclusion;
  give each topic its own paragraph or bullet
  ([Division](paragraphs.md#division)).
- A section or text that reads clearly in another shape, such as a story told in
  order: the tests find problems; they are not a template.
