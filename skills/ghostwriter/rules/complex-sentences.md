# Complex Sentences

Sentences pass: clauses a reader must hold open until another closes them, or
clauses whose links the reader can't tell. Default: fix each sentence that fails
a test below by the first fitting row of its section, which may fold, join, or
rephrase it; where a row says split, or none fits, split it into
[complete sentences](idea-load.md#splitting), then shorten or rephrase each part
that still fails.

## Detection

Match the triggers below, then run both tests on every sentence, in your draft
as in text you edit: a sentence can be too long without a knot, or knotted while
short, so passing one test doesn't clear it:

- **Joints.** Check commas, semicolons, and dashes that join clauses, not list
  items, for the knots below; [idea load](idea-load.md#counting-new-ideas) is a
  separate check.
- **Relations.** For each clause, name what it adds to the clause it hangs on: a
  cause, condition, contrast, time, which thing, or a further fact about the
  same thing. If you can't name it, can name it only after reading to the end,
  or the clause is about something else, the clause is a knot.

## Editing a Knotted Passage

1. Before changing anything, mark every knot and any other spot a first-time
   reader would stumble on; delete what the [deletion test](filler.md#method)
   confirms as filler.
2. Rework the marked knots a sentence or two at a time, each with the fix its
   section gives. Add no content beyond what a fix here requires from a source,
   such as a request's reason and deadline ([That-Clauses](#that-clauses)); any
   other fact the reader lacks waits for the [Order](../SKILL.md#4-order) pass
   and a source. Never add dialogue, a scene, a quote, or an example no source
   gives, even to liven the text.
3. Then run [Rewrite Rounds](syntax.md#rewrite-rounds) on the whole passage.

## That-Clauses

Triggers: a clause or an infinitive after a verb of perceiving, planning,
wanting, or saying: "we see that", "decided that", "would like X to be", "said
that", "we need you to". "I suppose", "I feel", and "I think" take the
[Opinion](introductory-words.md#opinion) fix; an impersonal "it has been decided
that" takes the [Impersonal Authority](officialese.md#impersonal-authority) fix.
Use the first row that fits:

| Finding                                                      | Fix                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The author's wish for the reader, or expectation of them     | A direct request of the same force: a wish stays a request ("we'd like you to review" → "please review"), an expectation or requirement becomes an instruction with its reason; then follow [Politeness for Show](introductory-words.md#politeness-for-show)                                                                                                                                      |
| The author's observation or forecast                         | The content, or the verb with a noun phrase ("we expect a fix in 2.4"), keeping the evidence the reader needs ("the logs show"), real doubt ("probably"), and a forecast as a forecast                                                                                                                                                                                                            |
| Someone else's statement, request, advice, decision, or plan | The verb of the act, no stronger than the source shows ("recommended", "asked us to", "rejected"; "said" or "wrote" for a plain statement, "confirmed" or "warned" only where the source does); keep who acted, or, for a claim whose source you can't trace, a [hearsay](introductory-words.md#trigger-list) marker; keep the force (an order stays an order, a request a request) and the doubt |

- Deprecation notice: "We need all integrations to be moved to the v2
  endpoints." → "Move your integration to the v2 endpoints before June 1: from
  then on, the v1 endpoints return HTTP 410 Gone." (deprecation plan from the
  user)
- Status update: "Sam said that he would like the migration to be moved into its
  own PR." → "Sam asked us to move the migration into its own PR." (the review
  thread)

## Correlative Pairs

Triggers: "either … or", "whether … or", "not only … but also", "both … and".

Test: if either part holds a clause or a comma, can a first-time reader still
match the two parts? If not, rephrase by the first row that fits; otherwise keep
the pair:

| The parts are                                      | Fix                                                                                                                                                                                                                                    |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Items of one kind, such as options, changes, steps | A noun for their kind and, for a full list, the count, then the items ([Grouping](idea-load.md#grouping)); a list if long ([Presentation](../SKILL.md#5-presentation))                                                                 |
| Claims                                             | Separate sentences that keep the pair's meaning, such as "also" for "not only … but also", "but" for a contrast, and, for "either … or", wording that keeps the claims alternatives ("One of two things happened: …"), never two facts |

For "if … then", delete "then" where the [deletion test](filler.md#method)
confirms it; never split a condition from its result; a long condition takes
syntax's long-condition row in [Detection](syntax.md#detection).

A pair inside a pair, or "respectively": read it as someone who hasn't seen your
outline. If you can't match each clause to its part, give each part its own
sentence or list item.

- PR description: "This PR not only moves the retry logic, which was duplicated
  in three methods of `client.ts`, into `retry.ts`, but also adds jitter to the
  backoff." → "This PR makes two changes:" with the bullets "Moves the
  duplicated retry logic from three methods in `client.ts` into `retry.ts`." and
  "Adds jitter to the backoff." (the diff)

## Stacked Dependent Clauses

Triggers: a "which", "that", "when", "because", "if", or "so that" clause
hanging on another dependent clause; "the way you", "the fact that", "the reason
… is that".

Test: for each dependent clause, find the word it hangs on; if that word sits
inside another dependent clause, the clauses are stacked. Mark a knot only if
the reader must reread to match them or hold one open across unrelated details.
A clause between a subject and its verb takes syntax's clause-inside-a-clause
row in [Detection](syntax.md#detection) instead, a participle clause the
[verbs](verbs.md#participle-clauses) fix.

1. Rephrase or split a knot until its links are clear, each split part a
   [complete](syntax.md#detection) sentence that keeps its relation and a word
   for it ("because", "so", "when"); never leave "Because …" alone. Keep short
   nested clauses whose links are clear, such as "Keep the setting that controls
   when the job runs."
2. Rephrase any dependent clause, stacked or not, where a noun phrase that names
   a thing, or a direct statement, says the same: "The reason the build fails is
   that the lockfile is outdated." → "The build fails because the lockfile is
   outdated."

- Postmortem: "Logins failed because the gateway used a cached public key, which
  went stale when the auth service rotated its keys." → "Logins failed because
  the gateway used a cached public key. That key went stale when the auth
  service rotated its keys."

## Joined Clauses

Triggers: clauses that could each stand as a sentence, joined by a comma (a
comma splice), a semicolon, a dash, or nothing (a run-on). Use the first row
that fits:

| Finding                                                                                                                                                                                        | Fix                                                                                                                                                                     |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| One part matters less to this reader and fits into the other as a phrase                                                                                                                       | Fold it into the other as a phrase, keeping every fact, as "reported in #482" below; drop it only as [Lightening a Sentence](idea-load.md#lightening-a-sentence) allows |
| Both parts share a subject or object, as `git stash` and `git stash pop` share your changes, and the joined sentence passes the Relations and [idea-load](idea-load.md#limits-by-reader) tests | One sentence joined by a conjunction, a colon, or a semicolon; never by a bare comma                                                                                    |
| Otherwise, above all parts about different things                                                                                                                                              | Separate sentences, or list items for parallel changes                                                                                                                  |

Keep each relation the joint carried; add none, such as "so", that a source
doesn't show.

- README: "Acme Sync mirrors S3 buckets, version 2 requires Node.js 20." → "Acme
  Sync mirrors S3 buckets. Version 2 requires Node.js 20."
- PR description: "This PR fixes the redirect loop on sign-in, it was reported
  in #482." → "This PR fixes the sign-in redirect loop reported in #482."

## Keep Cases

- A long sentence that passes Detection and the
  [idea-load](idea-load.md#limits-by-reader) test, as in reference docs for
  experts ([Keep Cases](filler.md#keep-cases)).
- Two clauses about one thing, joined by a conjunction or a semicolon:
  "`git stash` saves your local modifications; `git stash pop` applies them
  again." (`git stash` docs)
- A correlative pair with short parts: "either `--json` or `--yaml`".
- A that-clause no shorter wording replaces without losing its attribution,
  force, or doubt: "The vendor says 2.3 fixes the leak", until a source without
  a stake, such as your own test run, confirms it
  ([Sources](unfounded-claims.md#sources)).
- Verbatim text: quotations, quoted messages, and legal text.
