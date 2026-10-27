# Introductory Words

Words pass, filler group: asides that comment on a statement instead of adding
to it. Rarely informative: delete by default. The deletion test in
[filler.md](filler.md) protects the keep cases below.

## Detection

Run three scans:

- **Triggers.** Match the triggers under each subtype and in the Trigger List
  below, and other words of their kind.
- **Punctuation.** A pair of commas, dashes, or parentheses likely sets off an
  aside; so does a comma or dash after a sentence's first few words. Apply the
  deletion test to the aside: such marks also enclose facts, conditions, and
  contrasts.
- **Reading aloud.** Flag sentences a speaker would stumble over: one too long
  to say in a single breath, such as clause after clause before the period; two
  or more asides, nested asides, or asides between a subject and its verb break
  the intonation. Such a sentence likely holds introductory words: delete them;
  if it is still hard to say, fix it in the Sentences pass
  ([syntax](syntax.md#detection)).

After a cut, reread the sentence: it may simplify further, and a vague claim may
become precise. Take the missing fact only from a source the
[Check](../SKILL.md#check) allows; never invent it. If none has it, keep a vague
claim or delete an evaluation; if the reader needs the fact, ask the user or
name the gap.

- Opening comma: "Importantly, version 3 drops support for older Node.js
  versions." → "Version 3 drops support for older Node.js versions." → "Version
  3 drops support for Node.js versions before 18." (`engines` in `package.json`)
- Kept: "`git clean`, by default, leaves ignored files in place." The commas
  enclose a condition: with `-x`, `git clean` removes ignored files too.
- Hard to say aloud: "As you probably know, the test suite, which, to be honest,
  nobody has cleaned up in years, now takes — and this is no exaggeration — 40
  minutes to run." → Words pass: "The test suite, which nobody has cleaned up in
  years, now takes 40 minutes to run." → Sentences pass: "Nobody has cleaned up
  the test suite in years. It now takes 40 minutes to run."

## Common Knowledge

Triggers: "as everyone knows", "it's no secret that", "obviously", "of course".

If the reader certainly knows the fact, delete the whole statement, but keep a
teaching text's known ground ([Opening](explaining.md#opening)) and delete only
the marker. Otherwise calling it known is false: drop the phrase, and explain
any claim the reader could doubt or cite its source
([unfounded claims](unfounded-claims.md)). To refute a belief, first show where
it comes from.

- Known: "As you know, `npm install` installs the packages listed in
  `package.json`." → deleted in a guide for JavaScript developers.
- Sourced: "Everyone knows `git push --force` is dangerous." → "The `git push`
  manual warns that `--force` can make the remote repository lose commits."
- Refuted: "As everyone knows, Git stores commits as diffs. Actually, it
  doesn't." → "`git show` displays a commit as a diff, which suggests that Git
  stores commits as diffs. It doesn't: a commit records a snapshot of the whole
  tree." (Git docs)

## Opinion

Triggers: "I suppose", "in my opinion", "I feel", "I think", "I believe"; for
"said that" or "we expect that you", see
[That-Clauses](complex-sentences.md#that-clauses).

Delete: an unattributed statement already reads as the author's view, and the
phrase only weakens it. Keep it to contrast with another view. If it marks doubt
about a fact, state the doubt plainly. A first-person statement of what the
author does or has seen ("I skim long diffs") is not this marker
([Opinion and Experience](unfounded-claims.md#opinion-and-experience)).

- Doubt: "I think this also fixes the upload timeout." → "This probably also
  fixes the upload timeout."
- Kept: "The RFC proposes a new config format; in my opinion, we should extend
  the current one." Unchanged: it contrasts two views.

## Honesty

Triggers: "honestly", "frankly", "to be honest".

Delete: it implies the rest is less honest. If it introduced a contrast, state
the contrast.

- "The tests pass. Honestly, though, I'm not sure about the retry logic." → "The
  tests pass, but I'm not sure about the retry logic."

## Self-Correction

Triggers: "or rather", "more precisely", "in other words".

State only the precise version. Keep both where the first wording must stay
verbatim, such as an error message or a term, and the second explains it.

- "In Python 3, `map()` returns a list, or rather an iterator." → "In Python 3,
  `map()` returns an iterator."
- Both kept: "`read()` fails with `ECONNRESET`, in other words, the peer reset
  the connection." → "`read()` fails with `ECONNRESET`: the peer reset the
  connection."

## Verbal Numbering

Triggers: "firstly", "secondly", "finally"; signposts to the next part, such as
"moving on" or "let's turn to".

Delete; give each idea its own paragraph, opening with its point
([Point First](paragraphs.md#point-first)), or each short parallel item its own
bullet: the break is signal enough. Number list items only for ordered steps or
items cited later, with a numeral at the start of the line. Steps are ordered if
a source states the order or its facts entail it, as when one step handles what
another leaves undone; number them. If neither shows the order, bullet the steps
and name the gap in your reply.

- A design doc's "Firstly, the queue decouples the services. Secondly, it
  absorbs traffic spikes." becomes two paragraphs, each opening with its point.
- A PR description's "Firstly, it adds a `--json` flag. Secondly, it fixes the
  exit code on errors." becomes two bullets: the changes have no order, and
  nothing cites them by number. Setup steps stay numbered: clone the repository,
  run `npm install`, run `npm test`.
- Upgrade notes: "`npm audit fix` installs compatible updates; some
  vulnerabilities need manual fixes." → "1. Run `npm audit fix`. 2. Fix by hand
  the vulnerabilities it couldn't fix." (npm docs)

## Example Markers

Triggers: "for example", "for instance", "e.g.".

Delete wherever the text still reads as an example: a colon or the example
itself does the job. Mark an anecdote with "once". Where a partial list would
read as complete, give the full list if a verified source has it; otherwise keep
the marker.

- "Commit messages follow Conventional Commits. For example:
  `fix(parser): handle empty input`." → "Commit messages follow Conventional
  Commits: `fix(parser): handle empty input`."
- "Pin dependency versions. For example, we had a patch release break our
  build." → "Pin dependency versions. A patch release once broke our build."
- "Git stores several object types, for example blobs." → "Git stores four
  object types: blobs, trees, commits, and tags." (Git docs)

## Hypotheticals

A made-up scenario that casts the reader ("suppose you"). It is not filler;
check it: exactly one marker, such as "say", "suppose", "if", or "for example",
must show it is made up. Give an unpleasant or offensive role, even a
hypothetical one, to a third person. A conditional instruction for a reader who
is really in that situation is not a hypothetical: "If you committed a secret,
rotate it."

- "For example, let's say your API serves 500 requests per second." → "Say your
  API serves 500 requests per second."
- "Suppose you commit an AWS secret access key to a public repository." →
  "Suppose a developer commits an AWS secret access key to a public repository."

## Politeness for Show

Triggers: "please" more than once, "kindly", "sorry to bother you", "I was
wondering if you could", "just wanted to", "I hope this finds you well", "thanks
in advance", "do not hesitate to reach out", "great question", "I hope this
helps".

Formal or servile courtesy formulas don't make the reader's task easier: delete
them. A plain greeting, such as "Hi!", is not one of them, nor is thanks for
something the reader did for you, such as "Thanks for the report."; thanks for
an attitude you assume, such as patience, understanding, or trust, is. One plain
apology that names the author's own disruption, such as "Sorry for the wait.",
is not a formula either ([Notices](officialese.md#notices)); rewrite a hedged
one, such as "we apologize for any inconvenience this may cause", in that form.
A disruption is the author's own if they or their team caused or scheduled it,
or if it hits a service they run, whatever its cause. In a request, make the
task easier instead: give the reason for the request and its deadline, if any,
and everything the reader needs to act, such as a link, a file, or where to
look. Take each from the text, the code, the docs, or the user; if one the
reader needs is missing, ask the user or name the gap; never invent one. Once
the request has these, one plain "please" can stay. In any text, if the reader
may need help, replace a stock offer, such as "let me know if you have any
questions", with where to ask, taken from the same sources; if none names a
place, delete the offer and name the gap.

- Request: "Hi! I hope this finds you well. I just wanted to ask if you could
  look into an upload problem when you have a moment." → "Hi! Please look into
  this regression: since 4.2.0, uploads over 2 GB fail; 4.1.3 accepts them.
  Steps to reproduce and the server log are below. I can test a fix on our
  staging server." (facts from the user)
- Reply: "Great question! `git commit --amend` replaces the last commit with a
  new one. I hope this helps!" → "`git commit --amend` replaces the last commit
  with a new one."

## By the Way

Triggers: "by the way", "BTW", "incidentally", "as a side note", "on a related
note", "speaking of which", "fun fact".

The marker doesn't change whether a remark fits: delete it. It often attaches an
unrelated point. Work a remark the reader needs into the text, as the main point
if it matters most; delete the rest.

- Worked in: "This PR moves the config loader to `src/config/`. By the way, it
  also fixes the flaky `upload` test." → "This PR moves the config loader to
  `src/config/` and fixes the flaky `upload` test."
- Main point: "To find the commit that introduced a bug, check out older commits
  one by one and run the tests. By the way, `git bisect` can do this for you." →
  "To find the commit that introduced a bug, use `git bisect`: it picks each
  commit to test by binary search." (`git bisect` docs)
- Deleted: "Run `git log -p` to see each commit with its diff. By the way, Git
  was first released in 2005." → "Run `git log -p` to see each commit with its
  diff." (`git log` docs)

## Parentheses

Triggers: parentheses in prose, not in code or link syntax.

Parentheses mark their content as skippable. Delete content the deletion test
confirms as filler. Work the rest into the sentence or a sentence of its own: a
condition, a requirement, or the items a vague word stands for must not look
skippable. Keep parentheses a convention requires: an abbreviation at first use,
"Content Security Policy (CSP)"; a reference, "Fix a crash on empty input
(#123)"; a parameter's type in a reference entry, "`retries` (integer)". A
source or setting cited for the claim before it, such as "(per the last 200 CI
runs)" or "(`timeout: 30`)", may stay in parentheses. In a task limited to
cutting filler, keep other parentheses as they are and name them in your reply.
For "(e.g., …)", see Example Markers; for "(i.e., …)", see Self-Correction.

- Worked in: "`git stash` saves your changes (untracked files only with `-u`)."
  → "`git stash` saves changes to tracked files; with `-u`, it also saves
  untracked files."
- Deleted: "The CLI now prints JSON (finally!)." → "The CLI now prints JSON."

## Trigger List

Triggers not listed under a subtype, by kind. Delete each confirmed hit; if a
marker carries a contrast or a cause, state it with "but" or "so".

- Certainty: "clearly", "certainly", "undoubtedly", "needless to say", "it goes
  without saying". See Common Knowledge.
- Doubt and hearsay: "apparently", "it seems", "presumably", "hopefully",
  "reportedly", "supposedly". Verify the claim or name its source, and drop the
  marker; otherwise state the doubt plainly: "probably", "may". Keep the marker
  on hearsay you cannot trace. An unnamed authority offered as proof ("studies
  show") is a [weasel claim](unfounded-claims.md#weasel-claims).
- Emotion: "unfortunately", "sadly", "fortunately", "interestingly",
  "surprisingly".
- Attention: "note that", "keep in mind that", "it's worth noting that", "it's
  important to note that", "importantly", "notably", "the thing is".
- Emphasis: "basically", "essentially", "actually", "in fact", "indeed", "it
  turns out".
- Openers: "well", "okay", and a "so" that links to nothing before it, at the
  start of a sentence. Keep a "so" that marks a consequence.
- Addition: "additionally", "furthermore", "moreover". Delete, or use "also".
- Concession: "that said", "having said that", "admittedly", "to be fair".
- Summary: "in short", "in summary", "to sum up", "overall", "ultimately", "at
  the end of the day".
- Cross-reference: "as mentioned above", "as noted earlier", "as you can see",
  "as shown below". Keep a link or section name the reader needs.
- Order: "first of all", "to begin with", "lastly", "last but not least". See
  Verbal Numbering.
- Rewording: "that is", "i.e.", "simply put", "to be precise". See
  Self-Correction.
- Opinion and candor: "personally", "arguably", "IMO", "if you ask me", "TBH".
  See Opinion and Honesty. "Arguably" before a rank or a trend ("arguably the
  fastest") is part of a [weasel claim](unfounded-claims.md#weasel-claims):
  never delete it alone.
- Present day: "nowadays", "these days", "currently". Delete unless the marker
  dates an event or contrasts times; see
  [present-day markers](cliches.md#present-day-markers) for the fills.
