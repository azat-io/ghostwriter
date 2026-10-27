# Paragraphs

Order pass: each paragraph's topic and the order of sentences and paragraphs;
Presentation pass: where paragraphs break. Readers skim paragraph openings to
decide what to read, skip, or return to. Default: give each topic its own
paragraph, and open it with its point.

## Detection

On every paragraph of prose, in your draft as in text you edit, mark each
failure before changing anything:

- **Topic.** Name the topic the first sentence sets, or the second if the first
  only draws the reader in ([Hooks](#hooks)); mark each sentence about something
  else ([Division](#division)).
- **Skim.** Read only the first sentences, in order: does each state its
  paragraph's point, and do they together tell the text's argument or procedure?
  Mark one that says nothing, repeats another, or jumps
  ([Point First](#point-first)).
- **Links.** Name what each sentence adds to the topic, such as a reason or a
  step; one tied to the sentence before only by something it mentioned marks an
  [association chain](#association-chains).

## Division

Each extra topic is one more thing readers must hold. Use the first row that
fits:

| Finding                                            | Fix                                                                                                                                                                                            |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A sentence readers don't need, however vivid       | Cut it as [Using the Goal](goal.md#using-the-goal) says; if unsure, treat it as needed and use the rows below                                                                                  |
| Two or more topics                                 | Split it: a paragraph for each, opening with its point                                                                                                                                         |
| A sentence on a topic another paragraph covers     | Move it there                                                                                                                                                                                  |
| A sentence readers need, on a topic nothing covers | Its own paragraph                                                                                                                                                                              |
| A minor point gets more facts than the key one     | Trim the minor one ([Meaning](../SKILL.md#3-meaning)); give the key one its facts and, in a complex text, a [closing sentence](#closing-sentences), from a source ([Check](../SKILL.md#check)) |

Keep every fact, condition, and relation. A moved sentence implies no relation a
source doesn't show ([Order](../SKILL.md#4-order)), and a specific claim no
source supports never moves into a first sentence
([No Source](unfounded-claims.md#no-source)). A phrase that only announces the
next part ("secondly", "moving on") takes the
[Verbal Numbering](introductory-words.md#verbal-numbering) fix.

- Design doc: "The importer reads each CSV file in 10 MB chunks, so its memory
  use doesn't grow with file size. Who owns the importer after the reorg is
  still open. It validates each chunk before writing its rows." → the second
  sentence moves to Open Questions. (design doc from the user)

## Point First

In a text that explains, reports, or argues, such as docs, a status report, or a
proposal, open each paragraph with its main point, such as a claim, a result, a
decision, or a request; background and history follow, and a disruption notice
opens as [Notices](officialese.md#notices) says. In an instruction or advice,
open with what the reader does and gets, in words they know
([Reader Level](idea-load.md#reader-level)), not with a statement that is
correct but gives them nothing to act on. Word the opening point in words this
reader knows; if it needs a new term, state the point without it, then build up
the term.

- Beginner's tutorial: "A branch is a line of development." → "To commit an
  experiment without changing `main`, create a branch and switch to it:
  `git switch -c experiment`.", then what a branch is. (`git switch` docs, Git
  glossary)
- Skim test, an upgrade guide's first sentences: "The config file is now TOML.",
  "Logs look different too.", "Before any of this, back up `data/`." → the
  backup paragraph moves first, and each opens with its step: "Back up `data/`
  before you upgrade: version 3 converts it, and version 2 can't read it
  afterward." (each paragraph's body)

## Hooks

A text meant to engage as well as inform, such as an opinion piece, a review of
a tool or library (not a code review comment), or an engineering blog post, may
open with a real story, a striking fact, a question the text answers, or a
direct address:

- Only at the start of the text
  ([introduction](structure.md#orienting-the-reader)) or of a section; the next
  sentence states the topic or, in a teaching text's introduction, the known
  ground it builds on ([Opening](explaining.md#opening)); other paragraphs open
  with their points.
- A story or case only from the user or a source, never invented
  ([Opinion and Experience](unfounded-claims.md#opinion-and-experience)); it is
  the hook to try first, and with none, open with the point.
- A striking fact from a source, in plain words, never a
  [loud word](abstruse-wording.md#loud-words); a stock question ("Have you ever
  wondered") takes the [Openings](cliches.md#openings) fix.
- A question asks only what the text answers, and neither it nor a direct
  address claims anything about the reader's experience that no source shows
  ("You've probably lost hours to flaky tests";
  [No Source](unfounded-claims.md#no-source)).
- None in docs, runbooks, release notes, PR descriptions, or incident updates.
- A real case or consequence used as an
  [introduction](structure.md#orienting-the-reader) move, as in an RFC, is no
  hook: that section governs it.

- Blog post: "In this post, we describe how we moved our job queue." → "On March
  3, a failover lost 1,900 queued jobs, and nobody noticed for six hours.", then
  the topic: moving the queue into Postgres. (incident report and draft from the
  user)

## Closing Sentences

In a text on a complex topic, such as a design doc or a tutorial on a concept,
end a paragraph that readers act on, and that opens with a fact or claim, with
what they should do with it: a rule, advice, a decision, or a generalization no
wider than the paragraph's facts
([One Case Told as a Trend](unfounded-claims.md#one-case-told-as-a-trend)).
Test: if readers kept only the last sentence, would they know how to act on the
paragraph? Derive it only from the paragraph's facts or a source
([Check](../SKILL.md#check)); with none, end with the last fact and name in your
reply the decision or step readers would need. If the paragraph's main point is
advice, open with it ([Point First](#point-first)). If the first sentence
already gives that rule, advice, decision, or generalization, add none: end with
the last fact. A paragraph that only describes ends with its last fact too. Skip
it in reference entries and release notes.

- Tutorial: "`git rebase main` reapplies your branch's commits on top of `main`
  as new commits. Anyone who built work on the old ones must then fix their
  history by hand." + "So rebase only branches nobody else has built work on."
  (`git rebase` docs)

## Association Chains

Triggers: each sentence starts from something the one before mentioned ("That
flag also…", "That's also why…"), and the point comes last or not at all, so
readers must work out for themselves how each sentence bears on it. Put the
point first, then the facts that support it, and handle the rest as
[Division](#division) says.

- PR description: "While fixing the login timeout, I noticed the session code
  still read the `LEGACY_CACHE` flag. That flag is now removed, and that's also
  why the fixtures changed. The timeout itself came from a missing `await`." →
  "This PR fixes the login timeout, caused by a missing `await`.", then a
  paragraph: "It also removes the `LEGACY_CACHE` flag from the session code, so
  the fixtures change." (the diff)

## Keep Cases

- A one-sentence paragraph, such as a warning, and a short text on one topic,
  such as a commit body.
- Lists, tables, and code blocks; ordered steps stay numbered, and a paragraph
  of properties becomes a list ([Property Lists](syntax.md#property-lists)).
- A reference entry that opens with what the item does, returns, or means.
- Verbatim text ([When to Use](../SKILL.md#when-to-use)).
