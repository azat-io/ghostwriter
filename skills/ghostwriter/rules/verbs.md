# Verbs

Words pass, filler group: nouns made from verbs. Sentences pass: participles,
participle clauses, and the passive. Each can hide who does what and lengthen
the sentence. Readers can picture an action more easily when the text shows who
does it. Default: write each action as a verb whose subject is its actor; keep a
form that names a thing, a state, or a term, and the passive where the actor is
unknown, or obvious and of no use to the reader. The deletion test in
[filler.md](filler.md) protects the keep cases below.

## Detection

Ask of each sentence who does what. If its subject and main verb don't say, a
form below likely hides the answer; triggers are samples. A subject that can't
act or a verb such as "is" or "indicates" that hides an action takes the
[Actor and Verb](syntax.md#actor-and-verb) fix; a sentence where nothing happens
keeps its state verb ([Descriptions](syntax.md#descriptions)).

Scan your own draft as hard as text you edit: text from AI chat models has more
participle clauses than human writing, such as ", allowing you to", and more
nouns such as "validation". A passive with no actor often marks an actor you
haven't looked up, and a helper verb with a noun an action: find it in a source
the [Check](../SKILL.md#check) allows; with none, keep the passive, and turn a
helper verb with a noun into the plain verb it hides ("provides validation of" →
"validates"); never invent an actor or a more specific action.

## Nouns Made from Verbs

A noun naming an action, usually after a helper verb that adds nothing.
Triggers: "perform validation of", "provide support for", "carry out the cleanup
of", "take a backup of".

1. Replace the noun and its helper verb with one verb. Its subject is the actor
   a source names, or the reader in an instruction; with neither, keep the
   passive, or make the thing the subject if it does the action itself
   ([Passive Voice](#passive-voice)).
2. Prefer the most specific verb a source supports: "handle", "process", and
   "manage" often stand for a more specific action.
3. Add what the verb calls for, such as what, where, when, or how much, from a
   source ([Fill](filler.md#method)).

- "The job carries out the cleanup of stale branches." → "The job cleans up
  stale branches." → "The job deletes branches merged into `main` more than 30
  days ago." (`cleanup.yml`)

Keep any meaning the helper adds: "ensure" can promise that the action happens
even on error, or mean only a check.

- "The `with` statement ensures the closing of the file." → "The `with`
  statement closes the file, even if an exception is raised." (Python tutorial)

Formal helpers ("conduct a review") are also
[officialese](officialese.md#plain-words), and fancy nouns ("utilization") are
also [abstruse wording](abstruse-wording.md): same fix. A soft name for bad news
("a capacity adjustment") takes the
[euphemisms](euphemisms.md#coined-euphemisms) fix. A noun that names a thing, a
topic, or a term hides no verb:

| Hidden verb: use the verb                                      | Thing or term: keep                  |
| -------------------------------------------------------------- | ------------------------------------ |
| "carry out the migration of the schema" → "migrate the schema" | "the migration `0042_add_index.sql`" |
| "CI performs the deployment of `main`" → "CI deploys `main`"   | a Kubernetes Deployment              |
| "provides authentication of users" → "authenticates users"     | "Authentication" as a heading        |

## Participles

A verb's "-ing" form or past participle ("cached", "built") that describes a
noun by what it does or what was done to it; in "a staging server", "staging"
names a purpose and is not one. Triggers: such a phrase between commas or
between a subject and its verb; "located in", "containing"; "make a cached copy
of"; "the engineers maintaining the pipeline".

Between a subject and its verb, such a phrase makes the reader wait, often past
a pair of commas, and the action inside it reads as mere description. Decide by
what it does:

| It                                                            | Fix                                                                                                                                                                                |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Reports an action                                             | A verb of its own, beside the main verb or in a new sentence                                                                                                                       |
| Only says which things ("files located in `dist/`")           | A shorter wording that says the same ("files in `dist/`"); otherwise, and for a term, keep it                                                                                      |
| Forms one action with a helper verb ("make a cached copy of") | One verb: "cache"                                                                                                                                                                  |
| Describes people the reader must contact                      | The person or team a source names as responsible for this matter, and a contact ([Impersonal Authority](officialese.md#impersonal-authority)); with none, keep it and name the gap |

- Design doc: "The scheduler, receiving jobs from the API and assigning each to
  an idle worker, retries failed jobs." → "The scheduler receives jobs from the
  API, assigns each to an idle worker, and retries failed jobs."

## Participle Clauses

A clause built on an "-ing" form or a past participle, with no subject of its
own, that says how, when, or why the main action happens, what it leads to, or a
second action. Triggers: "Having installed the CLI", "Using this option", "Being
stateless", "Once installed", and a trailing ", ensuring that" or ", allowing
you to".

Try deleting the clause: the context often says it already. In step 2 of a
guide, "Having installed the CLI, run `acme init`." → "Run `acme init`.", since
step 1 installs the CLI. If the deletion test keeps the clause, state what it
adds:

| It adds              | Fix                                                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Means or a condition | A preposition or "if": "Using `--dry-run`, ..." → "With `--dry-run`, ..."                                                             |
| Order                | "After" or "when": "Having merged the PR, delete the branch." → "After you merge the PR, delete the branch."                          |
| A cause              | "Because" or "so": "Being stateless, the handler can run on any replica." → "The handler is stateless, so it can run on any replica." |
| A second action      | A second verb: "creates the branch, switching to it" → "creates the branch and switches to it" (`git switch -c` docs)                 |

Always rewrite a dangling clause, whose actor isn't the main clause's subject:
make the actor a source names, or the reader in an instruction, the main
clause's subject; with neither, give the clause a subject of its own ("After the
tests run, ..."); never invent one:

- CLI docs: "Using `-L`, redirects are followed." → "With `-L`, curl follows
  redirects." (curl manual)

A clause that claims a benefit (", improving performance") takes the
[evaluations](evaluations.md) fix.

## Passive Voice

"Be" or "get" with a past participle. Triggers: "is validated", "was rolled back
by", "will be retried", "got deleted", "mistakes were made".

It adds words, and the reader meets the actor at the end of the sentence or not
at all. Ask "by whom?". Where the passive reports a state, and the true actor
would read as a cause it isn't or tell the reader nothing, even in bad news
("Access denied"), use a state wording ([States](#states)). Otherwise use the
first row of [Naming the Actor](syntax.md#naming-the-actor) that fits: "mistakes
were made" takes its bad-news row, "the cache must be cleared first" its reader
row ("Clear the cache first."); where that row keeps the wording, keep the
passive.

- "Requests are validated by the gateway, and those failing validation are
  rejected by it with status 400." → "The gateway validates requests and rejects
  invalid ones with status 400."
- API docs: "Requests that fail with HTTP 503 are retried." → "The client
  retries requests that fail with HTTP 503." (`client.ts`) If the code leaves
  retries to the caller: "The client doesn't retry requests that fail with HTTP
  503." Advice on when to retry needs its own source, such as the API docs.

## States

Some passives report what is now true of a thing, not what someone did, such as
"The PR is merged". Try the active with the true actor; keep a state wording if
that actor would read as a cause it isn't, or if the reader gains nothing from
knowing it, and shorten it where you can: a past participle ("Saved", "Merged"),
an adjective ("Ready"), or the thing as the subject ("Build failed", "Token
expired").

- UI string: "Your changes have been saved." → "Changes saved.", not "The app
  saved your changes."
- CI status: "The CI runner failed your build." → "Build failed." As the
  subject, the runner reads as the cause of the failure.

## Action

Triggers: passages where nobody does anything, often in product pages and launch
posts: "provides", "enables", "allows for", nouns made from verbs, the passive.
A paragraph that only lists properties is different:
[Property Lists](syntax.md#property-lists).

Such text shows nothing happening, so the reader can't picture using it. Rewrite
it with facts from a source:

1. Name the actors and give each action a verb.
2. Add the details each verb calls for.
3. In the [Order](../SKILL.md#4-order) pass, add what the reader does and gets,
   as in a [scenario](evaluations.md#fill-with-facts), once per feature
   ([The Reader's Gain](promotion.md#the-readers-gain)).

Abstract nouns the rewrite leaves, such as "a platform" or "teams", take
[Grounding](abstractions.md#grounding).

- README: "Monitoring of bundle size regressions is provided, with reporting of
  results in pull requests." → "Open a pull request, and the bot builds it,
  compares each bundle's size with `main`, and comments with the change, such as
  `app.js +4.2 kB`." (the bot's code and tests)

## Keep Cases

- Nouns that name a thing, a topic, a term, or an event the text counts or
  times: "Two deploys failed this week."
- Participles that are terms or the shortest label: "a blocking call", "the
  failing test", "a running container", "lines matching the pattern".
- The passive where the actor is unknown, or obvious and of no use to the reader
  ([Naming the Actor](syntax.md#naming-the-actor)), and a state wording
  ([States](#states)).
- A participle clause that hinders nothing, where every rewrite would add a
  relation no source states, such as when a wait happens: keep the source's
  wording ([Keep Cases](filler.md#keep-cases)).
- Verbatim text: a quoted message, a UI label, or a status a tool defines.
