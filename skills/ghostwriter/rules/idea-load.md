# Idea Load

Sentences pass: splitting a sentence with too many new ideas for its reader;
Meaning pass: removing an idea the reader doesn't need. Plain, verified facts
can still overload a sentence. Default: split or rephrase only where the reader
must hold one new idea unresolved to understand another; keep a clear sentence
intact.

## Counting New Ideas

Look especially at a sentence you just filled with facts; a product's one-line
description; a term defined mid-sentence; stacked "which" or "so" clauses left
after
[Stacked Dependent Clauses](complex-sentences.md#stacked-dependent-clauses). In
the Sentences pass, count the new ideas in every sentence in scope, in your
draft as in text you edit, even when its point and relations seem clear to you:

1. Mark each **new thing** this [reader](../SKILL.md#when-to-use) meets, with
   what it is, and each **new clause** about known things: an action, a
   property, a requirement, a cause, or a result. The words that make a clause
   exact belong to it: its object, place, time, means, condition, or values
   ("stores jobs in Postgres", "fetches each page when you reach it"). Known
   means introduced earlier or certainly known to this reader; if unsure, new.
2. Count each mark as one idea: each verb in a series counts, while similar
   nouns in one slot, such as the formats a tool reads, count as one if their
   kind is known or named ([Grouping](#grouping)); a new thing's further
   property ("self-hosted") counts apart. Compare with the
   [check thresholds](#limits-by-reader); use the marks to find what this reader
   must hold or work out, not to enforce a count.
3. A definition followed by a use may need separating if the reader must first
   learn what the thing is. Keep them together when the sentence is clear. In "A
   lockfile is a file that records the exact version of every installed
   dependency" (npm docs), "a file" alone doesn't say what a lockfile is, so the
   sentence needs no split. A clause that only says which one ("the commit that
   added the cache") introduces nothing.

- README for readers new to job queues: "Acme Queue is a self-hosted job queue
  that stores jobs in Postgres, so you need no separate broker." Four ideas:
  what Acme Queue is, that it is self-hosted, where it stores jobs, and what
  that saves you. One way to separate its definition from its explanation →
  "Acme Queue is a self-hosted job queue. It stores jobs in Postgres, so you
  need no separate broker."

## Limits by Reader

These are thresholds for checking dependencies, not limits on idea count or
automatic reasons to split:

| Reader                                                   | Check dependencies when the sentence has |
| -------------------------------------------------------- | ---------------------------------------- |
| General: end users, beginners, readers outside the field | More than two new ideas                  |
| Experts in the text's field, as in an API reference      | More than three new ideas                |
| Unsure, or mixed                                         | More than two new ideas                  |

For each new idea, name what the reader must understand first. Split or rephrase
only if the reader must hold one new idea unresolved to understand another.
Closely linked ideas, such as an action and its condition or result, may read
more clearly together; a definition and its use may stay together too. Keep
every relation. A sentence below the threshold still takes the
[syntax](syntax.md) and [complex-sentence](complex-sentences.md) checks.

- API reference, kept, three ideas, one per verb: "`listAll()` returns an async
  iterator over every page, fetches each page when you reach it, and stops at an
  empty `next_cursor`."

## Reader Level

Give an expert the term and the instruction; give a beginner the situation
first, what happens and why it matters, then what to do. Explain only what this
reader may not know: explaining what they certainly know talks down to them
([Common Knowledge](introductory-words.md#common-knowledge)). Experts need no
[build-up](#building-up-a-term) in their field; give them the specifics they act
on, such as limits, formats, and compatibility, from a source, and none they
won't use ([Expert Blind Spots](#expert-blind-spots)).

- Security checklist: "Rotate any API key pushed to a public repository."
  Getting-started guide: "Anyone can copy what you push to a public repository,
  and deleting it later doesn't delete the copies. If you push an API key, turn
  it off and create a new one." (GitHub docs)

## Splitting

- Introduce first: explain a new thing before relying on it; use a separate
  sentence if combining the definition and use makes either hard to follow
  ([Words with a Nuance](abstruse-wording.md#words-with-a-nuance)); for several
  of one kind, [group](#grouping) them.
- Keep each new sentence [complete](syntax.md#detection) and clear to its
  reader, even if the text grows, and keep every fact, doubt, and relation, such
  as a cause, condition, or order; imply no relation a source doesn't show
  ([Order](../SKILL.md#4-order)). Where the user fixes the number of sentences,
  as in a three-sentence bio, lighten a sentence instead of splitting it
  ([Lightening a Sentence](#lightening-a-sentence)); if every idea is one the
  reader needs, keep the sentence and name the overload in your reply.
- Keep a list of similar items whole: cutting items loses facts, not load. Merge
  only overlapping items ([redundancy](redundancy.md#near-synonyms)); the
  Presentation pass may bullet a long list.
- In a one-line field, such as a commit subject, a package description, or a
  line of CLI help, keep the main idea and move the rest to the body or the
  docs.

- Onboarding doc: "If your change uses up over half the error budget, the share
  of requests a service may fail each month, releases pause." → "Each service
  may fail only a fixed share of its requests each month: its error budget. If
  your change uses up over half of it, releases pause."

## Grouping

Triggers: a list of names this reader hasn't met, or of clauses such as causes
or risks, above all a long one. Put a noun for their kind before the list,
bulleted or not, and, for a source's full list, their count: the reader then
knows what kind each item is, even an unknown name.

- Test the noun on each item ("X is a Y"), from a source; move one that fails to
  its own sentence or to where the text covers it.
- A count claims the list is full: give one only for a source's full list,
  recounted after each edit; otherwise mark the list as partial
  ([Example Markers](introductory-words.md#example-markers)).
- Each item then counts as introduced; explain one before a sentence that
  depends on what it does.

- Guide: "A Service can be ClusterIP, NodePort, LoadBalancer, ExternalName, or
  headless." → "Kubernetes has four Service types: ClusterIP, NodePort,
  LoadBalancer, and ExternalName. A headless Service is a ClusterIP Service with
  `clusterIP: None`." (Kubernetes docs)

## Building Up a Term

Triggers: a definition made of terms this reader may not know, for a term they
need here ([Words with a Nuance](abstruse-wording.md#words-with-a-nuance)); a
term they don't need takes [Lightening a Sentence](#lightening-a-sentence); a
passage dense with such terms,
[Chains of New Terms](explaining.md#chains-of-new-terms).

1. Explain each concept the term rests on that they may not know, with separate
   sentences where needed. Put each before the explanation that depends on it.
   Start from what they know, and use only words they know or have just read.
   Take every step from a source; add no step or comparison it doesn't support,
   and stop at concepts this reader knows.
2. Then explain the term with them.

- Beginner's guide: "`^1.2.3` allows changes that don't modify the leftmost
  non-zero part of the version." → "A version such as 1.2.3 has three parts:
  major, minor, and patch. From 1.0.0 on, a new major version may break your
  code; minor and patch versions shouldn't. `^1.2.3` allows 1.2.3 and later
  minor and patch versions, but not 2.0.0. Below 1.0.0, any release may break
  your code, so `^0.2.3` allows only 0.2.3 and later 0.2 patch versions."
  (semver.org, npm docs)

## Lightening a Sentence

For a dense sentence or one with an idea the reader doesn't need; this changes
what the text says, so apply the [Check](../SKILL.md#check).

- **A less important idea**, or the part of one the point doesn't need: drop it;
  the text's heading, its [goal](goal.md), or the user shows what matters most;
  for numbers, see [Selecting Numbers](facts.md#selecting-numbers).
- **A term the reader doesn't need now**: a more general word they know, or what
  the term means for them, from a source, if it stays true, no softer or
  harsher, and hides no fact they need. If they will meet it again, as in the
  UI, or must type or search for it, introduce it.
- Never drop a fact the reader needs; if unsure, split instead.

- Release notes for end users: "Uploads now resume through the tus protocol
  after a dropped connection." → "If your connection drops, an upload now
  continues where it stopped." (the PR)

## Expert Blind Spots

Terms and mechanisms read easily to you, so a dense sentence may not feel dense:
in [Counting](#counting-new-ideas), mark each term this reader may not know as
new, then check how the ideas connect. Experts also add details the reader won't
use:

- How a feature works or what it's made of, for a reader who only uses it: say
  what it does, unless they configure or debug it. A reader who reviews or
  decides on the design, such as a product manager reading a design doc, doesn't
  only use it: keep the terms the text or the user's facts use there, as
  [Words with a Nuance](abstruse-wording.md#words-with-a-nuance) says.
- Near-synonyms and distinctions the reader doesn't draw, such as "faults,
  errors, and failures" in a user guide: one word that covers them all
  ([Near-Synonyms](redundancy.md#near-synonyms)).

- README: "`acme deploy` compares each file's SHA-256 hash with the one saved at
  the last deploy and uploads only files whose hash differs." → "`acme deploy`
  uploads only the files that changed since the last deploy." (the code)

## Keep Cases

- Clear sentences, including those with several linked ideas in reference docs.
- A definition the reader needs, alone or with its use where both stay clear.
- Verbatim text ([When to Use](../SKILL.md#when-to-use)), such as a quoted error
  message or legal text: never split or trim it.
