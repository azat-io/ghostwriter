# Syntax

Sentences pass: word order and how clauses and phrases attach. The targets are
spots where a first-time reader must go back, keep words in mind until a later
one resolves them, or search for the sentence's claim. Default: fix these spots
and check each rewrite in context; build a sentence that reports an action on
its actor and verb, and keep a state verb where nothing happens.

## Detection

Test every sentence, in your draft as in text you edit: where would a first-time
reader go back, or hold words until a later one resolves them? Mark every spot
before rewriting; [idea load](idea-load.md#counting-new-ideas) is a separate
check.

| Spot                                                                                                                       | Fix                                                                                                                                                                                                                                                |
| -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A long subject before its verb: "The number of retries before the client gives up is 3."                                   | Shorten the subject: where the sentence reports an action, the actor and verb first ("The client retries 3 times before it gives up."); otherwise move the subject's modifiers after the verb or into their own sentence                           |
| A clause inside another clause, before that clause's verb, so its subject waits for the verb                               | The inner clause in its own sentence or after the main verb                                                                                                                                                                                        |
| "Said that", long "not only … but also", stacked clauses, comma splices, run-ons                                           | [Complex sentences](complex-sentences.md#detection)                                                                                                                                                                                                |
| An aside or a participle phrase between a subject and its verb                                                             | Move it out or delete it ([Parentheses](introductory-words.md#parentheses), [Participles](verbs.md#participles))                                                                                                                                   |
| A stack of nouns: "token refresh failure handling"                                                                         | The relations as a verb or prepositions: "how a failed token refresh is handled"                                                                                                                                                                   |
| A long condition before the main clause                                                                                    | The main clause first, or the condition in its own sentence; in an instruction, keep every condition before the action it limits: a clear "If …," as is, one that is [hard to follow](idea-load.md#limits-by-reader) as its own sentence before it |
| Parts that don't match: mixed forms in a series, a verb that fits only some objects, a pronoun with two possible referents | Match them: "It adds a `--json` flag, a `--quiet` flag, and fixes two crashes." → "It adds `--json` and `--quiet` flags and fixes two crashes."; for a pronoun, name what it refers to                                                             |
| The same word or root twice within a few words: "the check checks"                                                         | Rebuild so it appears once; never swap a term for a near-synonym ([Check](../SKILL.md#check))                                                                                                                                                      |
| A lost point: you can't state the sentence's claim in a few words, or it comes after the details                           | The point as the main clause                                                                                                                                                                                                                       |
| Words that add nothing; a sentence whose new ideas obscure its point or relations                                          | The [deletion test](filler.md#method); use the [dependency check](idea-load.md#limits-by-reader) to find the burden, then rephrase or [split](idea-load.md#splitting) at a clause boundary, keeping every relation                                 |
| A fragment: read alone, it says nothing complete ("Which means …", "The catch?")                                           | Join it to its neighbor, keeping the relation, or add a subject and verb, with an actor only a source names ([Actor and Verb](#actor-and-verb)): "Tests run in parallel. Except on Windows." → "Tests run in parallel except on Windows."          |

## Rewrite Rounds

1. Rewrite every marked spot; each rewrite passes the
   [Check](../SKILL.md#check).
2. Check the logic: once the syntax is plain, look for claims that contradict
   each other or a source. Correct the false one from a source
   ([False Claims](unfounded-claims.md#false-claims)); with no source to tell
   which is false, leave both out of your draft, or in text you edit keep both
   and name the clash in your reply.
3. Reread each rewritten sentence with the sentences around it, since a rewrite
   can create a new problem; after a full edit, read the whole text. Repeat only
   where you can name a remaining or new problem. Test each rewrite: would you
   say it this way, aloud, to a colleague, in complete sentences and the text's
   register? If not, it is stilted, as a mechanical [actor](#naming-the-actor)
   or [action verb](#descriptions) often is; so is a row of prose sentences
   built alike, such as each opening with the same subject: merge them or
   reorder their parts, and never vary a term or name with a near-synonym
   ([Check](../SKILL.md#check)); list items, steps, and parallel sections keep
   one pattern ([Parallel Sections](structure.md#parallel-sections)). Redraft a
   stilted rewrite, or restore the clearer original, keeping every fact, term,
   condition, relation, and real doubt. Keep cases need no rewrite; name a
   missing fact in your reply. Stop when the passage is clear and natural in its
   context; don't rewrite it just to avoid a trigger. Return only the final
   text.

- Release notes: "Settings migration is performed on first launch of version 3,
  with custom themes requiring manual re-import, so no user action is needed." →
  round 1: "Version 3 migrates your settings when it first starts. Re-import
  custom themes by hand. You don't need to do anything." The last sentence now
  contradicts the one before → "Version 3 migrates your settings when it first
  starts, so you only need to re-import custom themes by hand." (the migration
  code)
- README, stilted though each sentence passes every rule: "Acme Sync reads
  `sync.toml`. Acme Sync compares each file with its copy in the bucket. Acme
  Sync uploads each file that differs." → "Acme Sync reads `sync.toml` and
  uploads each file that differs from its copy in the bucket." (the code)

## Drafting

Draft as you'd explain it to a colleague in chat, in short spoken sentences;
then add only the precision the reader needs, from a source, checking the
[idea load](idea-load.md#limits-by-reader); then test subjects and verbs
([Actor and Verb](#actor-and-verb)), keeping a state verb where nothing happens
([Descriptions](#descriptions)). In your own draft, a sentence broken by
parentheses, dashes, or chained "which" clauses marks a passage to redraft that
way. Check a plain draft in context too; it may need no rewrite.

## Actor and Verb

Triggers: an abstraction or a noun made from a verb as the subject ("this
approach", "the removal of"), or "there is"; a verb of cause, having, evidence,
or being, such as "results in", "leads to", "involves", "has", "indicates",
"suggests", "seems", "is", "serves as".

First decide whether something happens: an event someone or something does,
which you could picture or a log could record ("`npm ci` exits with an error").
If the trigger verb only links a thing to what it is, has, or where it is, or
the sentence defines a term, code, or status, it is a description: keep it
([Descriptions](#descriptions)). Where something happens:

- **Subject.** Can it do what the verb says? "This approach caches responses"
  fails; "The proxy caches responses" passes if the code shows the proxy does
  it. Use the actor a source names, the reader in an instruction, or a thing
  that does the action in the reader's terms, such as a flag, a command, or a
  job ("This flag skips the tests"); a noun made from a verb takes
  [its fix](verbs.md#nouns-made-from-verbs).
- **Verb.** The verb of that event, in place of the trigger verb.

Keep what the old verb carried: a cause stays a cause or a condition ("so",
"because", "if"); the doubt in "seems", "suggests", or "may indicate" stays
("probably", "may"); the evidence behind "indicates" stays named ("The logs show
that ..."). With no source for the actor or the action, keep the sentence; never
invent either.

- "A mismatch between `package.json` and the lockfile causes `npm ci` to error."
  → "`npm ci` exits with an error if the dependencies in the lockfile don't
  match `package.json`." (npm docs)

## Descriptions

A sentence that says what something is, has, or where it is reports no action:
keep its state verb, or no verb where a label reads clearly ("Default: 30
seconds"). A forced action verb reads mechanical, and often adds an actor and an
event no source shows. Change a description's subject or verb only where it
hides an action; one that reads plainly as drafted ([Drafting](#drafting)) keeps
its state verb.

- README, kept: "The repository has two top-level directories: `server/` and
  `web/`.", not "We split the code into `server/` and `web/`."

## Naming the Actor

Triggers: "it is necessary to", "it is possible to", "one should"; "it has been
decided" takes the [Impersonal Authority](officialese.md#impersonal-authority)
fix, a passive the [Passive Voice](verbs.md#passive-voice) one. Such wording
hides who acts. Use the first row that fits:

| Finding                                                                                                        | Fix                                                                                                                                                                                                                                                                                      |
| -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bad news or a mistake: who caused it                                                                           | The [euphemisms](euphemisms.md#bad-news) fix: the team or change a source names, a person only as that fix allows, the first person only if a source shows the author did it; such an actor is never background; with no source, keep the wording                                        |
| The reader acts                                                                                                | An instruction: "It is necessary to restart the server." → "Restart the server."; a recommendation stays one ("we recommend")                                                                                                                                                            |
| The actor is obvious, and naming it changes nothing the reader does, expects, or asks whom; if unsure, name it | Leave it out: "Version 2.0 was released on March 3.", not "The maintainers released ..."; a passive keeps no "by" phrase                                                                                                                                                                 |
| A source, or a passive's "by" phrase, names the actor                                                          | Make it the subject, named as the source does (a team stays a team), above all where the reader's next step depends on who acts: "It is possible to restore a deleted branch." → "An admin can restore a deleted branch." (the docs)                                                     |
| No source names the actor, or only a stand-in fits, such as "the system"                                       | Keep the wording, or make a thing the sentence names the subject if it does the action itself ("the job runs nightly"), never a stand-in, and not if it is acted on ("the cache invalidates" says it invalidates something); if the reader needs the actor, ask the user or name the gap |

Treat a reaction, such as confusion, as something its cause does to people: make
the cause the subject where a source shows one, or use a plain adjective, not a
noun for the reaction: "Confusion arose among test participants over the two
Save buttons." → "The two Save buttons confused test participants." (usability
test notes from the user)

## Property Lists

Reorder test: could the sentences of a paragraph go in any order without losing
a cause, a sequence, or a contrast, each stating a property of one thing? Then
the paragraph is a list written as prose. Make it a bulleted list under a line
naming the thing, in the [Presentation](../SKILL.md#5-presentation) pass: "Acme
Cache is written in Go. It has no dependencies. It runs on Linux." → "Acme
Cache:" and a bullet per property. Where a property takes more than one
sentence, give each a paragraph with a bold run-in label instead, as in a
reference entry's **Default.** and **Limit.**

If its sentences report actions through nouns or "provides", it is no property
list: name who acts and how, from a source, as [Action](verbs.md#action) says.

## Keep Cases

- A long sentence that passes Detection and the
  [idea-load](idea-load.md#limits-by-reader) test, as in reference docs for
  experts.
- State verbs in descriptions and definitions: "The 429 status code indicates
  that the user has sent too many requests in a given amount of time" (RFC
  6585).
- Impersonal wording or the passive where the actor is unknown, a stand-in, or
  obvious and of no use to the reader, and a plain phrase for a reaction a
  source reports ("participants found it unclear which button saves"); the
  writer's own "confusing" still takes the [evaluations](evaluations.md) fix.
- A noun stack that is a term or a name: "HTTP request header".
- A fragment outside running prose, such as a heading, list item, table cell, UI
  string, one-line field (a commit subject, a package description), or run-in
  label ("**Limit.**", "Default: 30 seconds"). In text you edit, a rare
  deliberate fragment at an emotional moment the reader surely shares, as in an
  informal team post, with complete sentences around it; in your own draft,
  none.
- A term repeated on purpose, and verbatim text, such as a quoted error message.
