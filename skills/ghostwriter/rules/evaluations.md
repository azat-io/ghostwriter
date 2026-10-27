# Evaluations

Words pass, filler group: judgments, positive or negative, that tell the reader
what to conclude instead of giving the facts to conclude from. Default: replace
each judgment with verified facts, or support it with them; if there are none,
delete it. The deletion test in [filler.md](filler.md) protects the keep cases
below.

## Detection

When you scan for this group, test every adjective and adverb, not only the
triggers below:

- An adjective or adverb that judges, by praising, blaming, ranking, or
  intensifying, and names nothing the reader can check, such as a size, a
  version, a behavior, or a result, is an evaluation. Hedges, vague amounts, and
  numbered ranks, such as "usually", "several", "large", "big", or "top 10", are
  not: apply the deletion test, and keep a vague claim until a source gives the
  number ([vague words](vague-words.md)). A loud size word ("huge", "massive")
  is an evaluation: give the size or delete it, never a plain size word in its
  place. A plain word for a behavior no source measures, such as "slow" in a
  report of bad news, is a vague word: keep it until a source gives the number.
- A sentence that would fit a competing tool, another release, or any other PR
  unchanged says nothing about this one. Replace it with facts specific to this
  one: "This PR significantly improves the robustness and performance of the
  sync job." → "This PR makes the sync job retry on HTTP 503 and fetch pages in
  parallel: a full sync takes 4 minutes instead of 11." (the diff, CI logs)
- In your own draft, each evaluation marks a fact you have not looked up.
- A judgment of a person, such as "reckless", takes the
  [Criticism](euphemisms.md#criticism) fix: what they did and its effect, never
  the trait, even beside facts.

## Adjectives

Triggers: "fast", "lightweight", "simple", "easy", "intuitive", "user-friendly",
"clean", "elegant", "modern", "powerful", "flexible", "robust", "reliable",
"stable", "secure", "scalable", "efficient", "performant", "seamless",
"comprehensive", "production-ready", "battle-tested", "cutting-edge",
"state-of-the-art", "best-in-class", "innovative", "unique", "great",
"excellent", "important", "significant", "essential", "crucial", "vital",
"pivotal", "key". Negative: "slow", "bloated", "clunky", "hacky", "messy",
"ugly", "fragile", "confusing", "painful", "terrible", "huge", "critical".
Comparative, in changelogs and PRs: "improved", "better", "enhanced",
"optimized", "faster", "cleaner".

Replace the adjective with the property it stands for. For a comparative, say
what changed; for an importance word, such as "crucial" or "key", state the
consequence that makes it matter.

- Changelog: "Improved Windows support." → "`include` patterns now accept
  Windows paths with backslashes." (the PR)
- "It's crucial to run the migration before deploying." → "Run the migration
  before deploying: the new code reads the `users.email_verified` column that
  the migration adds." (migration file, the diff)
- Issue: "The error message is confusing." → "The error message shows a stack
  trace but not the path of the missing file." (the issue)

## Adverbs and Stock Phrases

Triggers: "seamlessly", "effortlessly", "easily", "simply", "quickly",
"instantly", "smoothly", "efficiently", "elegantly", "gracefully", "perfectly",
"flawlessly", "with ease", "in no time", "a breeze", "just works", "works like a
charm", "rock-solid", "bulletproof", "best practices", "supercharge", "unlock",
"empower".

Evaluations of an action or an abstract thing. Replace them with what happens:
the steps, the conditions, the result. Delete a word that only claims ease, such
as "simply": the steps let the reader judge the effort.

- "The script handles network errors gracefully." → "On a network error, the
  script retries 3 times, then prints the URL it could not reach and exits with
  code 1." (the code)
- "Simply run `make` and everything just works." → "Run `make`: it installs the
  dependencies, builds `dist/`, and runs the tests." (`Makefile`)

## Loaded Nouns

Triggers: "hack", "kludge", "band-aid", "cruft", "bloat", "mess", "spaghetti
code", "magic", "nightmare", "disaster", "silver bullet", "killer feature".

A noun can carry the judgment. Use the neutral noun if there is one, and state
the fact the loaded one hinted at: for "not a silver bullet", name the problems
it leaves unsolved.

- "This PR removes the ugly hack in `retry.ts`." → "This PR removes the
  workaround in `retry.ts` that slept 1 second before each retry." (the diff)
- "The config loader is a nightmare." → "The config loader reads four files and
  three environment variables, and their precedence is undocumented." (the code,
  the docs)

## Scare Quotes

Triggers: quoted common words that quote no one, such as a "fix", "temporary",
"tests", or "documentation".

Quotes that mock or doubt a word judge it, and the reader can't tell mockery
from a quotation or a term. Delete them and state the fact behind the doubt; to
keep the irony, put the claim next to what happened. Keep quotes around literal
text, such as a string, an error message, or a UI label, and around a quotation
or a word discussed as a word.

- "We have 'tests' for the parser." → "The parser's tests check only valid
  input." (test files)
- "This 'temporary' workaround is still here." → "This workaround was added as
  temporary in 2.0 and is still in 4.1." (`git log`)

## Intensifiers

Triggers: "very", "really", "extremely", "highly", "incredibly", "super",
"absolutely", "completely", "totally", "entirely", "fully", "deeply", "vastly",
"significantly", "dramatically", "remarkably", "particularly", "insanely",
"quite", "pretty", "much", "by far", "definitely", "literally", "just", "only",
"merely", "most", "the best", "blazing-fast", "lightning-fast".

A judgment of degree stacked on another word. Delete it, then check the word it
modified: a fact stays; an evaluation gets facts that let the reader conclude
"very" or "the most" without the words. Keep a word that limits or orders, or
that is part of a term: "only on Linux", "just the first line", "the most recent
tag", "highly available".

- "`--token` is absolutely required." → "`--token` is required."
- "This is a very serious vulnerability." → "An unauthenticated user can read
  any file the server process can read through the `path` parameter." (the
  advisory)
- "The library is only 2 kB!" → "The library is 2 kB minified and gzipped."
  (build output)

## "Real", "True", "Genuine"

Triggers: "real", "true", "truly", "genuine", "genuinely", "actual", "proper",
"full-fledged", "real-world".

Praise as authentic, such as "a real fix" or "proper error handling", adds no
property to the thing. Delete the label and give the facts it hints at: what
this thing does that the alternative does not. Keep the word where it contrasts
with something the text names: "a real database, not a mock", "actual" against
"expected" in test output, "real-world data" against synthetic data.

- Review: "This needs a real fix." → "This needs a fix in the parser: it drops
  the last chunk, and the retry only hides that." (the code)
- Review: "Add proper error handling." → "Catch `ENOENT` and print the missing
  path instead of a stack trace." (the code)
- "Python 3.13 brings true multithreading." → "Python 3.13 adds an experimental
  free-threaded build: with the global interpreter lock disabled, threads run in
  parallel on the available CPU cores." (What's New in Python 3.13)

## Keep Cases

A word can judge in one phrase and name a term in another; only the judging use
is filler:

| Judgment                    | Term                                                                                           |
| --------------------------- | ---------------------------------------------------------------------------------------------- |
| "a lightweight framework"   | "a lightweight tag": a Git tag that is only a ref, with no tag object                          |
| "a stable library"          | "a stable sort": equal elements keep their order                                               |
| "clean code"                | "a clean working tree": `git status` reports nothing to commit                                 |
| "handles errors gracefully" | "graceful shutdown": the server stops accepting connections and lets active ones finish        |
| "a critical step"           | `logging.CRITICAL`: the highest of Python's standard log levels                                |
| "a fully featured client"   | "a fully qualified domain name": a host's full name, such as `ci.example.com` rather than `ci` |
| "a real fix"                | "the real user ID": the ID of the user who invoked the program                                 |
| "the magic in the loader"   | "a magic number": a numeric literal with no name that explains it                              |

- A property or rank the facts settle is a claim, not an evaluation, even when
  unproven: "thread-safe", "has no dependencies", "the fastest", "the first". If
  nothing supports it, handle it as an [unfounded claim](unfounded-claims.md). A
  word that only sums up such facts, such as "battle-tested", stays an
  evaluation.
- A severity a standard or tool defines, such as "Critical" in CVSS, is a term;
  so is a loud word inside a term, such as "catastrophic backtracking"
  ([abstruse wording](abstruse-wording.md#keep-cases)).
- In text you edit, an obvious joke the tone allows
  ([abstruse wording](abstruse-wording.md#keep-cases)).
- Names, code, and quoted text: "Prettier", "Secure Shell", `gzip --fast`, an
  error message, a UI label.
- A verdict the reader needs, such as a review decision, the benefit a proposal
  gives as its reason, or a choice between options: keep it and add the facts
  that force it; if no source has them, keep the verdict and ask the user for
  the facts or name the gap. "Option B is better." → "Option B is better for us:
  it reuses the existing database, while option A needs a new message queue."
  (design doc)
- An evaluation that tells the reader what a technical fact means can stay
  beside the fact; the fact alone also works. Kept: "`list.insert(0, x)` is
  O(n): slow on long lists." Unchanged: "slow" tells readers who don't think in
  complexity classes what O(n) means. (Python `collections` docs)

## Fill with Facts

An evaluation makes a draft look finished while it says nothing: one word stands
in for facts nobody looked up. Finding them takes most of the work: ask what the
word measures and against what, then search the code, tests, benchmarks, CI
logs, `git log`, issues, PRs, and docs ([Check](../SKILL.md#check)); ask the
user, who can ask the maintainers, only if the fact would change the main point
or what readers do.

- Never invent a number, benchmark, user, or behavior, and never sharpen a
  judgment into a claim no source makes, such as "fast" into "2× faster".
- No source has the fact: delete the evaluation; if the reader needs the fact,
  ask the user for it or name the gap in your reply. "A blazing-fast static site
  generator." with no benchmark in the repository → "A static site generator.",
  and in the reply: "To claim speed, add a benchmark result."
- Reviewing: quote the evaluation and name the fact that would replace it, such
  as a benchmark result, a version range, or a list of users.
- A synonym is not a fix: "robust" → "resilient" keeps the evaluation. Nor is
  keeping one judgment from a series: "fast, lean, and efficient" → "efficient"
  ([redundancy](redundancy.md#overlaps)).

Give the reader material to judge by:

- Reference point: a fact helps only if the reader can place it. Add one they
  know, such as the previous value, a limit, or the total, or choose a fact that
  has one ([What a Figure Means](facts.md#what-a-figure-means)). "The new parser
  is much faster: it handles the test fixture in 80 ms." → "The new parser
  parses the 50 MB test fixture in 80 ms; the old one took 600 ms." (benchmark
  in the PR)
- Explanation: explain a term or unit the reader may not know. For product
  managers: "API latency is excellent now: p99 is 120 ms." → "p99 latency is the
  time within which 99% of API requests finish. It is 120 ms, down from 400 ms
  in March." (dashboard numbers from the user)
- Scenario: instead of praising a feature, describe a situation where it helps,
  with details the reader can picture. "`git bisect` is an incredibly powerful
  debugging tool." → "If a test passed in the last release and fails now, 1,000
  commits later, `git bisect` finds the commit that broke it in about 10 test
  runs." (`git bisect` docs)
- Code sample: show the code and let the reader judge it. "`requests` makes HTTP
  calls easy." → "With `requests`, one line fetches a URL and parses its JSON
  body: `requests.get(url).json()`." (`requests` docs)
- Users: state who uses or recommends the thing as plain facts, without
  pressure. "Join thousands of happy developers who trust our SDK!" → "The 30
  companies listed in `ADOPTERS.md` use the SDK in production." (`ADOPTERS.md`)
- Use: name the use the facts suit instead of the evaluation. "Shallow clones
  make CI super fast." → "A shallow clone made with `git clone --depth 1`
  downloads only the latest commit: use it in CI jobs that don't read the
  history." (`git clone` docs)
