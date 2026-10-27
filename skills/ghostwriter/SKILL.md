---
name: ghostwriter
description:
  Writes and edits technical text so it is simple, precise, and easy to scan.
  Use when drafting, editing, reviewing, or simplifying docs, READMEs, guides,
  tutorials, changelogs, release notes, PR descriptions, technical articles,
  landing pages, about pages and bios, cover letters, resumes, recruiter
  replies, interview answers, job postings, talk and grant proposals, notices
  and announcements, incident reports and status updates, error messages, or
  work messages such as issue replies, review requests, and code review
  comments, or when text reads as wordy, convoluted, or hard to follow
license: MIT
---

# Ghostwriter

Give every idea the simplest wording that keeps its full meaning, however expert
or senior the reader. Keep the complex ideas, technical terms, and new concepts
the reader needs; simplify the text around them. Judge each wording by how well
it helps the reader understand and act: replace wording meant to impress with
the facts it stands for, or cut it, and never talk down to the reader. Where a
text lacks facts, cases, or examples its reader needs, add them from a source
within the user's scope, or name the gap.

## Reading the Rules

Before composing the result, use a file-reading tool to read the required files
below. Reuse full contents already read for this task. The summaries are an
index; they do not replace the files' checks, exceptions, examples, and reasons.
Resolve `rules/` from the directory containing this `SKILL.md`.

For general writing, editing, or review, read these ten core files in full, even
for a short text or a single paragraph: [goal](rules/goal.md),
[filler](rules/filler.md), [verbs](rules/verbs.md), [syntax](rules/syntax.md),
[complex sentences](rules/complex-sentences.md),
[idea load](rules/idea-load.md), [redundancy](rules/redundancy.md),
[abstractions](rules/abstractions.md), [facts](rules/facts.md), and
[paragraphs](rules/paragraphs.md). Also read the genre rules in the table.

Read fewer files only when the user restricts the kinds of changes, such as
"only cut filler" or "only fix headings": read the core and genre files linked
by the relevant passes, each flagged group's file, and any file the Check links
for an edit you make. A limit on the text span, word count, order, or reply
format does not by itself reduce the required reading. Keep every edit within
those limits.

In a full Words pass, use every group's detection on your draft, the text you
edit, and any text it replaces. Read the rule file of every group whose scan
finds a candidate, listed trigger or not, even one you expect to keep. Follow
links that govern that case, not every link in the file. Examples illustrate
fixes; their facts are not sources for your text, and their structure is no
template.

| Task or text                                                                                           | Rules                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| Text with a title or sections                                                                          | [Structure](rules/structure.md) and [headings](rules/headings.md)                                                                     |
| Teach a new subject                                                                                    | [Explaining](rules/explaining.md)                                                                                                     |
| Report bad news, an incident, or a mistake; edit a review comment                                      | [Euphemisms](rules/euphemisms.md); for a notice or incident update, also [Notices](rules/officialese.md#notices)                      |
| Landing, product, pricing, or services page; README introduction; launch post; client or sponsor pitch | [Promotion](rules/promotion.md)                                                                                                       |
| Bio or page about a person, team, or company                                                           | [About pages](rules/about-pages.md) and [promotion](rules/promotion.md)                                                               |
| Job application; talk or grant proposal answering stated criteria                                      | [Job applications](rules/job-applications.md) and only the sections it links                                                          |
| Job posting the user writes                                                                            | [About pages](rules/about-pages.md), [promotion](rules/promotion.md), and [the posting's parts](rules/job-applications.md#keep-cases) |
| Error message                                                                                          | [Vague words](rules/vague-words.md); for a status label, [States](rules/verbs.md#states)                                              |

## When to Use

Choose the mode from the request; no need to announce it or ask for
confirmation. Use the narrowest scope that meets the request. An ordinary
request to edit, simplify, or polish an existing text uses Edit unless the user
asks to change its structure or purpose.

| Mode        | Do                                                                                                                                                         |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Point edit  | Change only the named span or feature, such as a title or filler                                                                                           |
| Edit        | Improve wording and local order; keep the voice, sections, and overall structure. In a short text, move the main fact first when its genre calls for it    |
| Restructure | Rebuild sections or the order of a long text around the reader's task; move, combine, cut, or add parts within the user's scope                            |
| Draft       | Set the [goal](rules/goal.md), then write from the supplied facts and sources in the requested form and voice                                              |
| Review      | Report each problem with its quote (or location for order or a missing part) and a fix; a fix may reword its quote, but never join fixes into a full draft |

User limits govern every pass and rule, including fills and redrafts. An
explicit request to preserve order overrides a genre's preferred opening. For
"only cut the filler", run Words with the fills its fixes require, changing no
other wording except to make those fixes read correctly. If the user forbids
additions, name a gap instead of filling it. Mention a material problem outside
the scope in your reply; don't use it to widen the edit.

- Keep wording that already serves the reader. Before changing it, identify the
  problem the change fixes; a rule's trigger alone is no reason to edit
- Preserve the author's tone, rhythm, point of view, and deliberate emphasis
  where they stay clear and true. Use the text or supplied samples, never an
  invented persona, experience, opinion, or joke; a requested change of tone
  still keeps the facts
- Asked to cut or soften facts, make a text sound more impressive, liven it up,
  or pick a word: find the reason or the facts
  ([rules](rules/requests-to-soften.md))
- In your reply, follow the same rules: state gaps, doubts, and your own errors
  plainly, in the first person ("I couldn't find the default, so I left it out")
- For text in another language, keep its language; apply each rule's tests and
  keep cases, and read the English trigger lists as examples of kinds, not words
  to match

Several rules depend on the reader: identify the reader from the user or the
text, such as PR reviewers; if unsure whether they know a fact or need a detail,
keep it. Ask the user only if the answer would change the main point or what
readers do; otherwise write, naming the gap or your assumption in your reply.

Leave verbatim text unchanged: a license, wording the user says is legally
required, a changelog section name, a heading that links or a template depend
on; skip the skill if the whole text is verbatim. Keep other legal text
([details](rules/officialese.md#keep-cases)), such as terms of service,
unchanged unless the user asks for or approves a rewrite, and give the plain
facts beside it or in your reply. On a published page, such as docs, a public
README, or an internal wiki or runbook, links may target a section heading's
anchor: suggest a better heading in your reply, and change it only if the user
approves or asks you to fix the headings, naming the anchors that change; edit a
page's title or top line with the text unless the URL is built from it or a link
you find targets its anchor.

## Passes

Use these five passes as checks, not a fixed sequence. For a draft or
restructure, settle the goal and order before polishing wording. For a local
edit, start with the problem named. In a full edit or review, check all five
within the chosen mode; a pass may need no changes. Revisit a pass when a change
creates a new problem, not to produce another version.

| Pass            | Fixes                                                |
| --------------- | ---------------------------------------------------- |
| 1. Words        | Filler                                               |
| 2. Sentences    | Tangled syntax, overloaded sentences                 |
| 3. Meaning      | Repetition, redundancy, abstraction, needless detail |
| 4. Order        | Digressions, illogical sequence, missing information |
| 5. Presentation | Hard-to-skim layout                                  |

Show intermediate versions only when asked. Check wording you add as your own
draft, then do the [Check](#check)'s final read.

### 1. Words

Delete filler: words and phrases whose removal loses nothing. Rules:
[filler](rules/filler.md).

- Use each group's detection on the text in scope before changing its candidates
- Delete a candidate only if every fact, term, condition, relation, and real
  doubt survives without it
- Fill each gap a cut exposes with a verified fact the reader needs, within the
  task's limits (see Check)
- No word is banned: keep one wherever the idea needs it

#### Introductory Words

Delete asides that comment on a statement, and courtesy formulas, found by
triggers ("note that", "I think", "firstly", "I hope this helps"), paired
commas, dashes, or parentheses, and a comma or dash after a sentence's first
words ([rules](rules/introductory-words.md)).

- Keep real doubt as "probably" or "may", a contrast or cause as "but" or "so",
  an opinion marker that contrasts two views, the marker on hearsay you can't
  trace, the example marker where a partial list would read as complete (or the
  full list from a source), parentheses a convention requires ("Content Security
  Policy (CSP)" at first use, "(#123)"), thanks for something the reader did,
  one plain apology for your own disruption in place of a hedged one, and one
  marker that shows a hypothetical is made up
- Delete a stock offer of help ("let me know if you have any questions"); where
  the reader may need help, give where to ask instead, from a source, or name
  the gap; give a request its reason, any deadline, and what the reader needs to
  act

#### Abstruse Wording

Test every formal, rare, or borrowed word: use the most familiar word that keeps
the full meaning ([rules](rules/abstruse-wording.md)).

- Keep a term the reader needs in its exact meaning ("idempotent" in an HTTP
  spec), with plain words around it; never call a word you don't know misused:
  check the docs or code, or ask the user; on a topic new to you, confirm each
  term you use the same way, writing only what they confirm and naming any gap
- A term from another field used as a fancier word ("exponentially faster" for a
  constant speedup): state what happens or how much, from a source; keep one in
  its field or in a meaning software defines ("triage")
- If the plain version reveals bad news, state it as for euphemisms; if it says
  little, add verified facts, never the abstruse words back

#### Vague Words

Name what a vague word stands for, from a source; with none, keep the word
([rules](rules/vague-words.md)).

- Detection: ask which, when, how many, in which cases, and what place; in your
  own draft, each vague word marks a fact you haven't looked up
- Figures: exact where the reader uses the value, rounded only as the Check
  allows; keep limits ("at least 8 GB of RAM"); a best case ("up to 10× faster")
  is no limit: give the typical result and the best case's conditions
- An error message you write or edit ("Something went wrong"): what failed and
  what the reader can do, from the code

#### Evaluations

Test every adjective, adverb, loaded noun ("hack", "nightmare"), and
scare-quoted word (a "fix"): replace a judgment with verified facts or support
it with them; with none, delete it, but keep a verdict the reader needs, such as
a review decision, and name the gap ([rules](rules/evaluations.md)).

- Keep terms ("stable sort", "highly available") and words that limit or order
  ("only on Linux"); an evaluation may stay beside the facts that prove it, but
  not an intensifier or a judgment of a person ("reckless"); in your own draft,
  each evaluation marks a fact you haven't looked up

#### Euphemisms

State the plain fact a soft word hides, however bad, and no harsher than the
sources ([rules](rules/euphemisms.md)).

- Detection: where news is bad or someone erred, as in incidents, breaking
  changes, price increases, and reviews, ask of each soft phrase what happened,
  to whom, since when, and what the reader must do; with no source, keep it and
  name the gap; never drop the news on your own
- Keep real doubt, exact terms ("deprecated", "end of life"), and the passive
  where the actor is unknown; name a person as the one who acted only where a
  source names them as that actor and readers need the name, never on a public
  status page, and in a blameless postmortem only as its convention does; a
  contact follows [Officialese](#officialese)
- In criticism, keep the weight the author of someone else's comment gave it,
  stated plainly if you delete its hedge; about a person, name actions and their
  effects, never a trait or motive

#### Unfounded Claims

Back each claim with facts or a real case from a source; correct what a source
contradicts ([rules](rules/unfounded-claims.md)).

- Detection: ask what fact would make a claim true, who measured it, and when
- No source: leave the claim out of your draft; in text you edit, delete a stock
  or weasel claim ("studies show") whole and keep a specific one, named in your
  reply; in either, leave out a reassurance ("no data was lost") that no source
  confirms and the text doesn't support nearby, and ask what check shows it; for
  a claim a source shows still open, say what is known and what isn't
- Never drop only a hedge ("arguably the fastest") or blur a false claim; tell
  one case without inferring a trend
- An outcome that also takes the reader's work ("ship bug-free code"): what the
  product does and what the reader still does
  ([rules](rules/promotion.md#tool-and-outcome))

#### Cliches

Check every set phrase: replace it with the plainer word it stands for or the
fact it hints at; otherwise delete it ([rules](rules/cliches.md)).

- A stock claim fits any product or person ("passionate problem solver"): state
  what this one does, from a source, or delete it; a specific claim no source
  supports ("the first open-source APM") takes the unfounded-claims fix
- Keep terms and plain set phrases no plainer word replaces ("race condition",
  "make sure"), literal uses, and a marker that dates an event or contrasts
  times, such as a changelog's "now"
- For relative times in notes ("last month"), or a deadline or ongoing status
  that may have changed, read
  [Present-Day Markers](rules/cliches.md#present-day-markers); never infer a
  missing year from today's date

#### Officialese

Use the plain wording ("in the event that" → "if"); in a notice or a team's rule
or policy, replace ceremony with facts the reader can act on
([rules](rules/officialese.md)).

- Detection: it reads as normal, so scan on purpose for long connectors ("prior
  to", "in order to"), formal words ("utilize"), empty verbs with a noun
  ("perform an upgrade"), and framing ("please be advised that"), hardest in
  notices, team policies, form letters, signatures, and error messages
- Keep terms that look formal ("terminate" an EC2 instance, RFC 2119 key words
  where RFC 2119 is cited), statements of what an API promises or leaves to the
  caller, and legal text as [When to Use](#when-to-use) says
- Take a name or contact only from a source that names them as responsible for
  this matter or as its contact

#### Nouns Made from Verbs

Ask of each sentence who does what; replace a noun that names an action and its
helper verb ("perform validation") with the verb it hides
([rules](rules/verbs.md#nouns-made-from-verbs)).

- Keep a promise the helper adds ("ensure"); the verb's subject is an actor a
  source names or the reader in an instruction, else keep the passive
- A soft name for bad news ("a capacity adjustment") takes the euphemisms fix
- Keep a noun that names a thing, a term, or an event the text counts or times
  ("the migration" as a file, a Kubernetes Deployment, "two deploys failed")

### 2. Sentences

Simplify how the words in each sentence connect. Rules:
[syntax](rules/syntax.md); verb forms: [verbs](rules/verbs.md). The passive,
participles, long sentences, and long lists stay where ideas need them
([details](rules/filler.md#keep-cases)).

- Syntax: mark where a reader would go back, hold words, or lose the point, such
  as a long subject before its verb or a noun stack that is no term; fix it and
  reread in context, keeping a rewrite only if it reads more clearly; correct
  from a source any contradiction a rewrite shows; with none, leave both out of
  your draft, or, in text you edit, keep both and name the clash in your reply
- Fragments ("The catch?"): join each to its neighbor, keeping the relation, or
  add a subject and verb; keep those outside running prose, such as headings
- Complex sentences: rephrase or split dependent clauses whose links are hard to
  follow; fold a minor clause joined by a comma, a dash, or nothing in as a
  phrase, join two about one thing with a conjunction or a semicolon, else
  split, keeping every relation; make "said that" the act's verb and "we'd like
  you to" a direct request, keeping who acted, the force, and doubt; list or
  split a long "not only … but also" ([rules](rules/complex-sentences.md))
- Actor and verb: where a sentence reports an action, make its subject the actor
  a source names and its verb that action, not "is" or "indicates" ("The purpose
  of this flag is to skip the tests" → "This flag skips the tests"), keeping any
  cause or doubt; keep a state verb in a description or a definition
- Participles ("Having installed the CLI, run ..."): delete a clause the context
  states; give an action its own verb and a relation the connector a source
  shows ("after", "so"), else keep the clause; rewrite a dangling one around the
  actor a source names, or give it a subject; keep a term ("a blocking call"); a
  claimed benefit (", improving performance") takes the evaluations fix
- Passive and impersonal wording ("it is necessary to"), first that fits: keep a
  state ("Saved", "Build failed") where the actor would read as a cause it isn't
  or tell the reader nothing, even in bad news; give a passive that hides who
  caused bad news or a mistake the euphemisms fix; write an instruction where
  the reader acts; omit an obvious actor only if naming it changes nothing the
  reader does (if unsure, name it); use the active where "by" or a source names
  the actor; else keep it, naming the gap if the reader needs the actor
- A passage where nobody acts, as in a launch post: name the actors, give each
  action a verb and its details, and in the Order pass add what the reader does
  and gets, all from a source
- Idea load ([rules](rules/idea-load.md)): count each sentence's new things and
  claims, even when it reads easily to you. More than two for general readers,
  or more than three for experts, triggers a check of dependencies, never an
  automatic split; use the general threshold if unsure. Split or rephrase only
  if the reader must hold one new idea unresolved to understand another; a clear
  definition may stay with its use. Keep every relation; before a term the
  reader needs, explain each concept it rests on that they may not know; before
  a list of new things, put a noun for their kind and, for a full list, their
  count

### 3. Meaning

- Say each thing once ([redundancy](rules/redundancy.md)): test each pair in a
  series for a difference this reader would act on; keep the most precise of
  near-synonyms, or merge overlapping items into one term that covers them all
  and nothing more; give a member with its own facts its own sentence or list
  item; rebuild a passage the cuts leave thin from a source, or name the gap
- Delete details the reader does not need, such as how a feature works for one
  who only uses it ([idea load](rules/idea-load.md#expert-blind-spots))
- Ground each abstract statement in what this reader would see, do, or get, from
  a source; keep a summary or lead beside its details
  ([rules](rules/abstractions.md))
- Facts ([rules](rules/facts.md)): delete figures nothing could measure; for a
  population share, ask for the survey, and with none, delete it and name the
  cut; name in your reply other figures no source has; beside a figure this
  reader can't place, add what it means for them; check what numbers side by
  side suggest; pick facts by readers' questions and numbers by the goal, giving
  a count that matters only against its total as a share; keep every value in a
  reference table or spec

### 4. Order

- Apply the [goal](rules/goal.md): within the chosen mode, cut or move what
  doesn't serve it, never a fact readers need, and name each cut and where it
  fits
- Sequence ([structure](rules/structure.md)): often the reader's task and its
  solution, then what the thing is, then how it works; in a long text, one topic
  per section, each readable alone unless read in order, as a tutorial is. Open
  a long text by orienting the reader, but a reference or single-task docs page
  with its point; end one readers act on with what to do or remember, not a
  recap; a reference page, release notes, an incident update, or a README needs
  no ending
- Teaching texts ([rules](rules/explaining.md)): open with what readers know,
  the problem the topic solves, and what they'll be able to do; introduce each
  new thing before it is used, with examples and the errors readers hit, from a
  source; no teaching opening in a reference page, release notes, a changelog,
  an incident update, or a short text
- Paragraphs ([rules](rules/paragraphs.md)): the point first, every sentence on
  its topic (an opinion piece or blog post may open the text or a section with a
  hook, never an invented story or fact); in a complex text, end a paragraph
  readers act on with what to do, unless its first sentence says it; check the
  sequence by first sentences alone
- Lead a disruption notice with what changes for the reader and when
  ([Notices](rules/officialese.md#notices))
- Add, from verified facts (see Check), what the reader still lacks, such as a
  prerequisite, a step, or a section; in promotional text, what readers gain,
  promising only what the product does, and a fact or a real demo behind each
  claim; state, from a source, whom it suits and doesn't and what readers learn
  only after adopting; never invent a client, quote, result, screenshot, or
  urgency, cut a limit to make it sell, or change a name the sources use
  ([rules](rules/promotion.md))
- Bios and about pages: who it is, then what readers get, hard cases before
  credentials, from the user or a source ([rules](rules/about-pages.md)); a job
  application follows the posting's steps and answers each need it states or
  implies, never stretching a fact ([rules](rules/job-applications.md)); a job
  posting the user writes follows about pages, with the parts
  [job applications](rules/job-applications.md#keep-cases) lists
- Never place a statement where it implies a relation no source shows, such as a
  cause or a requirement

### 5. Presentation

Lay out the text so readers can skim it, find what they need, remember the key
points, and pass a part on, as with a title that reads alone and a section a
link can point to. Start a new paragraph where the topic changes. Number steps
whose order a source states or its facts entail, and items cited later; bullet
other lists and any paragraph of properties that could go in any order
([rules](rules/syntax.md#property-lists)). Other tools: a heading that names the
reader's task, bold run-in labels, a table or diagram in place of paragraphs
([rules](rules/explaining.md#tables-diagrams-and-output)), and, in promotional
text, what shows the product working
([rules](rules/promotion.md#claims-readers-can-check)). Title a text read on its
own, except a short message, by its topic in readers' words and, where readers
decide by it, its main point; in a feed or newsletter, by what it gives them;
never clickbait or a claim the text lacks, and wordplay only on request; word
section headings as readers search, a problem by its symptom or exact error, and
siblings to one pattern ([headings](rules/headings.md)); give sections of one
kind one shape ([rules](rules/structure.md#parallel-sections)).

## Check

Keep an edit only if:

- No idea the reader needs is lost, unless the user, told what readers would
  lose, still asks to cut it and
  [Requests to Soften](rules/requests-to-soften.md#when-readers-would-be-misled)
  allows the cut
- Every term keeps its exact meaning; none is swapped for a looser everyday
  word, unless the reader doesn't need it, won't meet, type, or search for it,
  and a more general word stays true
- Code, commands, identifiers, quoted output, and quotations stay exact, except
  code or a command you correct from a source and UI text the user asks you to
  edit, such as an error message; check each quotation against its source, and
  never quote a paraphrase
- Numbers stay exact, except a source's figure that gives an impression of size,
  whose exact value the reader doesn't use: round it down, dated if it changes;
  keep a source's "about", and drop "more than" only with that number; a number
  you derive, even one that gives an impression of size, follows
  [What a Figure Means](rules/facts.md#what-a-figure-means): rounded to the
  nearest value, or, as a bound, outward, never to a tighter value
- Real doubt stays: no edit makes a claim read as more certain than its source
- Nothing false is added. Take new facts only from the given text, the user, or
  sources you open: the code and its history, the project's docs, issues, PRs,
  and CI logs, `--help` output and man pages, official docs, and, beyond the
  project, published sources ([Sources](rules/unfounded-claims.md#sources)). A
  conclusion, such as advice or a number you derive, counts only if it follows
  from these sources' facts alone, every premise included, such as who does a
  step; with one missing, name the gap in your reply instead of adding it. Never
  add versions, defaults, flags, limits, or numbers from memory; if a fact the
  reader needs is missing, ask the user or name the gap; never invent it. A
  marked [hypothetical](rules/introductory-words.md#hypotheticals) may make up a
  setting and its numbers; every command, output, and product behavior or figure
  in it still comes from these sources or a run you did
- The text doesn't mislead by selection: keep, or add from your sources, every
  fact that would change what the reader concludes, such as a breaking change, a
  known limitation, or data from other periods that weakens a trend; such a fact
  is never a needless detail

Keep a change only if it fixes a problem without making the text harder to read
or changing its voice beyond the request. Reread changed passages in context,
and a full edit or draft as a whole ([test](rules/syntax.md#rewrite-rounds)):
would you say this to a colleague in the author's register? Restore wording that
was clearer. If the original already works, return it unchanged or report no
issue. If the text still misses its goal, redraft only in Draft or Restructure
mode, from the goal and sourced facts; in Edit or Review, name the need and why.
Check any new wording, and name what still fails.

## Example

The [worked example](rules/filler.md#worked-example) follows a `.gitignore`
paragraph through all five passes. It adds sourced facts and changes the layout
as a Restructure task permits; a point edit stops within its requested scope.

## Common Mistakes

| Mistake                                                              | Fix                                                                       |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Stopping once the filler is gone in a full edit                      | Check the other passes within the chosen mode                             |
| Leaving gaps bare after cutting filler, or filling them with guesses | Fill each gap with a verified fact; if there is none, ask or name the gap |
| Swapping an evaluation for a synonym: "robust" → "resilient"         | Replace it with facts, or delete it                                       |
| Applying rules mechanically, so text reads stilted or loses a point  | Reread in context ([Check](#check)); keep only changes that help          |
