# Promotional Texts

Order pass: what a text that promotes a product, a service, or its author tells
readers they get; Words pass: its promises and tone; Presentation pass: what
shows the product working. Such texts include landing, product, and pricing
pages, README introductions, launch posts, sponsorship pitches, and proposals to
clients or sponsors; a text about a person, team, or company also follows
[about pages](about-pages.md); an RFC or design proposal informs
([Planning the Moves](goal.md#planning-the-moves)). Use only the sections a text
needs. Default: state what the reader gets or avoids, from sources, and promise
only what the product does.

## The Reader's Gain

Triggers: features, specs, or the team's history with no word on what the reader
gets. Self-praise ("powerful", "all-in-one") first takes the
[evaluations](evaluations.md) or [Self-Description](cliches.md#self-description)
fix.

Test each feature or spec: what does this reader get or avoid because of it? The
gain may be practical, such as time or money saved, or not, such as confidence
before a release or a calmer on-call; state the second kind through the fact
that brings it, never as a promised feeling. Take each gain from a source, such
as the docs or a benchmark, and put it beside the feature that brings it. With
none, keep the feature as a fact and name the gap in your reply. Never invent a
gain, number, or user; a marked hypothetical may show how a feature works, never
how much it saves ([No Source](unfounded-claims.md#no-source)). A feature
already grounded in what the reader gets
([Grounding](abstractions.md#grounding)) or shown in a [use case](#use-cases)
needs no second gain sentence.

- Landing page: "Acme CI: powerful pipelines for modern teams." → "Acme CI runs
  only the jobs your change affects: in our benchmark on a 40-minute pipeline,
  the median change got its result in 11 minutes, and a one-line fix in 4."
  (docs; benchmark from the user)
- Product page: "Peace of mind for your on-call team." → "Acme Uptime pages
  on-call only when a check fails from at least two regions, so a network
  problem that fails checks from only one region pages nobody." (alerting docs)

## Tool and Outcome

Triggers: an outcome that also takes the reader's own work, promised as the
product's: "ship bug-free code", "pass your SOC 2 audit".

Name the outcome as the reader's goal, then say what the product does toward it
and what the reader still does, each from a source. A step the facts show is
left to the reader, such as merging the pull requests the product opens, counts
as sourced; with none, name the gap in your reply. A promise no source supports
is an [unfounded claim](unfounded-claims.md#no-source); a vague benefit ("helps
you ship faster") takes the [evaluations](evaluations.md) fix.

- "Ship bug-free code with Acme Test." → "Catch regressions before they merge:
  Acme Test runs your suite on every push and blocks the merge if a test fails.
  It catches only what your tests check." (the docs)

## Use Cases

Triggers: a feature list with no situation, advice, or limit.

For each main feature, give, from the user, the docs, issues, or support
tickets, the situation where this reader needs it, from their side, then what to
do and the fine points and limits only use teaches
([Scenario](evaluations.md#fill-with-facts)): they show know-how no claim of
expertise can. Give use cases on a page readers learn the product from, such as
a product page or a docs overview; a pricing table, a changelog, or a short
README feature list keeps one line per feature, with use cases linked or named
in your reply.

- "Works offline." → "Without a connection, as on a flight, `acme up` starts
  your environment from cached images. It can't start an image you haven't
  pulled, so run `acme pull` before you go offline." (the docs)

## Before Readers Adopt

Triggers: no word on whom the product suits or doesn't suit, or on what readers
would learn only after adopting.

State, from a source, whom it suits, whom it doesn't, and, only where a source
names one, what to use instead
([Self-Description](cliches.md#self-description)). For a person, team, or
company, word each limit as [When to Call](about-pages.md#when-to-call) says.
Before readers sign up, install, or migrate, tell them, from a source, what is
hard to undo, what it collects by default and how to turn that off, which
accounts it requires, and announced price or plan changes; never cut one on your
own to make the page sell ([Check](../SKILL.md#check)).

## Product and Feature Names

Triggers: a product, plan, or feature named with a coined or fashionable word.

Which words are plain depends on the page's reader
([Words with a Nuance](abstruse-wording.md#words-with-a-nuance),
[Reader Level](idea-load.md#reader-level)). Test each name: can this reader tell
from it alone what kind of thing it is? If not, keep a name the product, its
code, or the user's text uses verbatim, with the common name of its kind at
least at first use, and suggest a plainer one in your reply: renaming is the
user's call. A name only your own draft introduces becomes the common name of
its kind; coin one only on request, short and in words this reader knows.

- Pricing page: "Velocity unlocks AcmeFlow Engine." → "The Velocity plan adds
  AcmeFlow Engine, a remote build cache." Reply: "'Remote build cache' would
  need no explanation, and neither would a plan name that says whom the plan is
  for." (the user's pricing page and docs)

## Claims Readers Can Check

Triggers: a claimed property with nothing behind it ("secure by default"); a
product page, README introduction, or launch post with nothing that shows the
product working.

Back each claimed property or gain with the fact that shows it, such as a
benchmark, a test it passes, or what it is built on
([Fill with Facts](evaluations.md#fill-with-facts)). Before drafting such a
text, list from the sources what could show it working; lead with the first row
that fits:

| Readers can                           | Show                                                                                                |
| ------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Run it in minutes                     | A playground or a one-command quickstart                                                            |
| See it work, as in a UI or terminal   | A screenshot, recording, or video of real use: what readers get, such as a report, not its settings |
| Neither, as with a background service | An architecture or data-flow diagram                                                                |

- An image can imply what no sentence on the page would claim, so it passes the
  same [Check](../SKILL.md#check): the real product, in the version described,
  doing what the page says and implying nothing the sources don't show; sample
  data and edited recordings labeled as such; a mockup only from the user,
  labeled as one, never one you make; a screenshot or recording you capture
  yourself only from a run [Examples](explaining.md#examples) allows, never from
  the user's real data or accounts; real use over polish.
- A failed first run is hard to win back: run each quickstart you point to as
  written, in a sandbox, as [Examples](explaining.md#examples) allows, and name
  in your reply each failure and any step you couldn't run.
- Caption each with what readers should notice, not "Acme Review in action" but
  "Acme Review flags the missing `null` check on line 42" (the screenshot).
  Never fake one: ask the user for it, or name in your reply what it should
  show, or that none is possible
  ([Tables, Diagrams, and Output](explaining.md#tables-diagrams-and-output)).

## Past Work and Users

Triggers: a services page, portfolio, or sponsorship pitch with no past work, or
past work with no result; client names or logos as proof ("trusted by top SaaS
brands"); a user's story or quote; self-praise where users' words could stand.

Give each past project, from the user or a source: for whom it was, named as the
client agreed; the problem that made it hard; what was done to solve it; and the
result with how it was measured, such as downtime during a migration, with
details only this project would have
([Self-Description](cliches.md#self-description)), so readers learn what they
can ask for and what to ask of such work. A list of client names or logos,
however famous, shows neither what was done nor whether it fits the reader's
case, even in the same industry: tell the projects behind it, from the user, and
name the gap in your reply until they do. Meanwhile, in text you edit, keep the
names already on the page as plain facts and ask the user to confirm each client
agreed; in your draft, add a client's name only once the user says they agreed.
On a page for readers with small projects, lead with the projects closest to
theirs.

With no result from the user or a source, give what was done and name the gap in
your reply; never estimate one. If you don't know the client agreed, ask the
user; until then, in your draft, describe the client by the kind and size the
user gives, never by a stock phrase
([Requests](requests-to-soften.md#requests)). Never invent a client, project,
testimonial, or result; present sample and personal projects as such, never as
client work, and with no past work, suggest in your reply a project the user
could build. Ask for an adopters list and cases or quotes the user has
permission to use, verbatim and attributed as agreed
([Users](evaluations.md#fill-with-facts),
[Sources](unfounded-claims.md#sources)); never write or polish a quote. Tell a
user's case, such as what changed in their release process after adopting the
product, only from facts the user or a published source gives, naming the user
only as they agreed. Name an adopter only from a list they joined, such as
`ADOPTERS.md`, or one the user says they may name; never infer one from issues,
stars, or dependents.

- Consultancy site: "We deliver world-class CI transformations." → "For Example
  Corp, we split a 2-hour nightly test run into parallel jobs on each pull
  request; by their CI logs, the median wait for results fell from 14 hours to
  25 minutes." (case study the client approved, from the user)
- Freelancer's site for startups: "Trusted by the biggest names in retail." →
  "For a three-person startup, a new Content Security Policy blocked the payment
  form, which loads in an iframe, and sign-ups stopped. I added the payment
  provider's origin to `frame-src`; by the startup's analytics, sign-ups resumed
  the same day, and an end-to-end test now fails if the form doesn't load."
  Reply: "I left out the retail clients: tell me which ones agreed to be named
  and what you did for each." (case, client description, and analytics from the
  user)

## Copywriting Devices

Run the passes within the requested scope, and keep a device only where it gives
readers a fact to decide with. Write to peers who judge the facts and may say
no, arguing from what they decide on ([By Reader](abstractions.md#by-reader)),
never with pressure. In your draft as in text you edit, fix each device you find
by the first row that fits it:

| Device                                                                                                                                                | Do                                                                                                                                                                                                                        |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pressure: a countdown, "Only 3 beta invites left", a "limited-time" discount that never ends, a guilt appeal ("without you, this project dies")       | Only a deadline, limit, discount, or consequence a source sets, with its terms; else delete it, also when asked to add urgency, and say why in your reply ([Clickbait Devices](headings.md#clickbait-devices) in a title) |
| Slang put on to sound like the readers' group, or a servile voice: "Hey, 10x engineers!", "It would be our honor to serve your esteemed organization" | Delete it; address readers as equals, in plain words; a greeting in the user's own voice, as their other texts show, stays ([The Author's Voice](about-pages.md#the-authors-voice))                                       |
| A limit worded away to avoid negative words: "best on macOS" for "no Windows build"                                                                   | The limit, plainly ([Bad News](euphemisms.md#bad-news))                                                                                                                                                                   |
| A decline option that shames: "No thanks, I like slow builds"                                                                                         | "No thanks"                                                                                                                                                                                                               |
| No word on whom it suits, or only whom it suits and its advantages, with no limits                                                                    | Whom a source shows it suits and doesn't, and the costs and limits it names ([Before Readers Adopt](#before-readers-adopt))                                                                                               |
| Wording picked for its sound, not its meaning, or any you'd never say to a colleague                                                                  | Plain wording ([Rewrite Rounds](syntax.md#rewrite-rounds))                                                                                                                                                                |
| A product page or launch post title with no gain, a title with a gain the text doesn't deliver, or a slogan in place of the topic                     | The main gain the text delivers, beside the name or topic that [Where a Title Goes](headings.md#where-a-title-goes) sets ([What a Title Says](headings.md#what-a-title-says))                                             |

## Requests to Make a Page Sell

Triggers: "make this page convert", "this copy doesn't sell", "why does nobody
sign up?".

Improve the copy, then name once in your reply other factors the sources show
that may matter to this reader, such as:

- install steps and time to a first result
- price, plan limits, and the license
- supported platforms and versions
- docs, examples, and a demo or screenshots
- who uses it and when it last shipped
- a migration path from the tool readers use now
- how users and past clients hear of updates, such as a changelog

Say what you saw and where. If issues or other sources show the product misses
what the page promises, correct the page as
[False Claims](unfounded-claims.md#false-claims) says and name the change in
your reply. Never predict a result ("this will lift sign-ups"), imply the copy
alone decides whether readers adopt, or inflate it to make up for the rest
([Requests to Soften](requests-to-soften.md)). Put facts readers need, such as
the price, on the page ([Order](../SKILL.md#4-order)); changing the product, its
setup, or the rest of the site is the user's call.

- Reply after editing a sign-up page: "I added the plan prices from
  `pricing.md`, which the page lacked. The quick start needs a Kubernetes
  cluster; issues #88 and #97 ask for a Docker Compose setup instead."
  (`pricing.md`, README, issues)

## Keep Cases

- An outcome the product delivers alone, such as a backup service's restore to
  any point in the last 7 days: state it as the product's, with the conditions a
  source gives.
- A feature whose gain this reader certainly knows: no gain sentence
  ([Reader Level](idea-load.md#reader-level)).
- The user's own voice, such as a casual README
  ([The Author's Voice](about-pages.md#the-authors-voice)).
- Wording the user keeps after you named what readers would take from it, as
  [When Readers Would Be Misled](requests-to-soften.md#when-readers-would-be-misled)
  allows.
- A job application or a job posting the user writes: as
  [about pages](about-pages.md#keep-cases) says.
