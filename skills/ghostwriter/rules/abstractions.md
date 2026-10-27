# Abstract Statements

Meaning pass: statements built on abstract nouns, such as "solution",
"platform", "management", "experience", or "ecosystem", which name ideas, not
anything the reader has seen or done. Readers must translate an abstract claim
into their own work before they can picture or judge it. Default: tie each
abstract word to what this reader would see, do, or get, from a source.

## Detection

Test every statement, in your draft as in text you edit, hardest in taglines and
one-line descriptions: if it is true, what would this
[reader](../SKILL.md#when-to-use) see, do, or get, such as a command, a screen,
an error, or a number? If neither it nor the sentences beside it say, mark its
abstract words; in your draft, each marks facts you haven't gathered. Words
other files own take their fix first ([Overlaps](#overlaps)).

## Grounding

For each marked word, use the first row that fits, from a source:

| Abstract word                                  | Ground it with                                                        |
| ---------------------------------------------- | --------------------------------------------------------------------- |
| A result: "visibility", "insights"             | What the reader sees or gets: "a page of failed jobs with their logs" |
| A kind of customer or project: "growing teams" | Named kinds and a size: "monorepos with over 500 packages"            |
| A category: "solution", "platform"             | The reader's word for its kind: "a CLI", "a GitHub app"               |
| A group, where who matters: "users"            | The roles or people: "on-call engineers"                              |
| A general action: "repository management"      | The actions: "creates, renames, and archives repositories"            |

- Stop once each abstract word has a detail behind it that this reader can
  picture; more detail than that is not the aim. Keep an abstraction that sums
  up details just given or leads into them: the details carry it.
- Count the sentence's new ideas after adding details, then check dependencies
  at its reader's [threshold](idea-load.md#limits-by-reader); rephrase or split
  only where needed. A description keeps its state verb
  ([Descriptions](syntax.md#descriptions)).
- Never invent a detail: with no source, leave the statement out of your draft;
  in text you edit, keep it and name the gap, unless it would fit another
  company's product unchanged: then it is a stock self-description, deleted as
  [Self-Description](cliches.md#self-description) says.

- Landing page: "Acme is a release management solution." → "Acme is a GitHub
  app. On each merge to `main`, it adds the pull request's title to
  `CHANGELOG.md`, bumps the version, and publishes the package to npm." (product
  docs from the user)
- Postmortem, kept: "The deploy dropped the `users.email` column while the old
  version still read it, so sign-ups failed for 12 minutes. The cause was a
  schema change that wasn't backward compatible." (incident timeline)

## By Reader

What counts as concrete depends on what this reader works with
([Reader Level](idea-load.md#reader-level)): ground each statement, from a
source, in what they act or decide on.

| Reader                                         | Concrete for them                                                            |
| ---------------------------------------------- | ---------------------------------------------------------------------------- |
| Deciding whether to adopt, such as a team lead | What their team would do with it day to day, and the result                  |
| Integrating or running it, such as a developer | What it runs on, what it connects to and how, its data model and permissions |

- "Acme Cache is a build acceleration platform." → for a team lead: "Your builds
  download what CI or a teammate already built from the same code. In your
  trial, CI runs on `main` took 6 minutes instead of 18." (Acme docs; trial
  report from the user); for a developer: "Acme Cache is a remote cache for
  Bazel and Gradle. It runs as one container, stores outputs in your S3 bucket,
  and accepts GitHub Actions OIDC tokens in place of stored secrets." (Acme
  docs)

## Overlaps

- Which one, when, or how many: [vague words](vague-words.md); a fancy word
  ("functionality"): [abstruse wording](abstruse-wording.md#plain-words); a
  judgment ("seamless"): [evaluations](evaluations.md); a self-description that
  fits any product, deletion included:
  [Self-Description](cliches.md#self-description); a stand-in for a count
  ("traction"): [weasel claims](unfounded-claims.md#weasel-claims); soft words
  for bad news: [euphemisms](euphemisms.md).
- A noun made from a verb after a helper ("provides management of"):
  [its fix](verbs.md#nouns-made-from-verbs); an abstraction as the subject of an
  action: [Actor and Verb](syntax.md#actor-and-verb); a passage where nobody
  acts: [Action](verbs.md#action).

## Keep Cases

- A term with an exact meaning ("eventual consistency"), a definition, and a
  summary or lead whose details stand beside it.
- A reference whose readers know the referents, such as "the client" in an SDK
  reference that defines it; names and verbatim text.
