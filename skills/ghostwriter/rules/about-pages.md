# About Pages and Profiles

Order pass: what a text about a person, a team, or a company says, and in what
order; Words pass: the labels it gives itself. Such texts include an "about"
page, a consultancy's, freelancer's, or developer's site, a portfolio, a profile
README, a sponsor profile, a speaker or author bio, and an internal team page.
Readers judge a person or company by what they would get from them. Default: who
it is, then what readers get, then how the work is done, each from the user or a
source, in your draft as in text you edit. They also follow
[promotion](promotion.md), above all for past work and users' words; a text
whose subject is a product follows promotion alone; a pitch, proposal, or
sponsor page whose subject is a person, team, or company follows both.

## Parts of a Longer Page

Any such text, even a one-line bio, opens with who it is
([rules](#opening-with-the-role)); one longer than a line next says what readers
get ([rules](#what-readers-get)). A longer page adds only the parts this reader
needs and the sources fill, ordered by the questions readers bring
([Questions Readers Bring](facts.md#questions-readers-bring)); name in your
reply each needed part no source fills. The parts below are options, never slots
to fill:

- past work and clients, and what it achieved, with links
  ([rules](promotion.md#past-work-and-users))
- how the work is done, with lessons from real projects
  ([rules](#methods-and-tools)), and the hard cases it meets
  ([rules](#proof-of-skill))
- the user's goal behind the work, in their words ([rules](#the-authors-voice))
- rates and how to start working together
- the tasks clients typically bring, such as a stalled migration
  ([rules](#when-to-call))
- a distinctive touch, only from the user
  ([The Author's Voice](#the-authors-voice))
- the kinds of requests the user doesn't take on ([rules](#when-to-call))
- the topics the person or team pursues, in the user's words
  ([rules](#the-authors-voice))

A user with little to show yet gets a short, true page, never padding
([Past Work and Users](promotion.md#past-work-and-users)).

**Whole-page check.** On a page longer than a short bio, if the whole text,
yours or one you edit, fails the [swap test](cliches.md#self-description), as a
template filled with stock words does, rebuild it in a draft or a restructure
from the user's hard cases, limits, and the cases readers bring, asking for any
the sources lack. An edit keeps the sections ([modes](../SKILL.md#when-to-use)):
replace the stock sentences in place, and say in your reply that the page needs
a rebuild and why. Then check that each part this reader needs is there, in
readers' terms, and, on a longer page, under a plain heading or run-in label,
divided by case where groups come with different ones
([Choosing a Division](structure.md#choosing-a-division)); in an edit, name a
missing part or heading in your reply instead of adding a section.

## Opening with the Role

Triggers: a greeting, slogan, or life story before any role; a coined label
("code ninja", "data wizard"); a first paragraph with no role or field.

Test: from the title and first sentence alone, even of a one-line bio, can a
reader say what this person, team, or company does, and in what field, in words
they'd use with a colleague? If not, open with who, from the user: a role or
kind of business and its field ("an independent security consultant for payment
startups"), by its common name even where the work is broader, with no detail
only insiders know, such as a team's codename. A category word ("a digital
solutions partner") takes [Grounding](abstractions.md#grounding); a profile
README's title, [Where a Title Goes](headings.md#where-a-title-goes).

**Coined labels.** Readers can't search for or compare a made-up label, and
peers take it as a joke. Never coin one; put one the user keeps after the plain
role and what readers get, never as the opening label. Keep a real job title
readers may not know ("Member of Technical Staff") with the plain role beside
it. Stock phrases ("passionate problem solver") take the
[Self-Description](cliches.md#self-description) fix.

- Team page: "Platform Team: guardians of the pipeline." → "The platform team
  runs the CI pipelines that every product team deploys through and the
  Kubernetes clusters they deploy to." (team charter from the user)

## What Readers Get

Triggers: a second sentence that lists tasks ("I write Terraform modules"); a
gain that fits anyone ("we help teams ship better software").

Right after who, say what readers get: the result they would hire or sponsor
for, such as a working integration or a problem solved; on a hobby site, what
visitors take away, such as working configs for a home lab; in a speaker or
author bio, the work the talk or text draws on, from the user. Then, if it
helps, say what is done to deliver it. Test each sentence about the work:

- **Gain.** Does it say what the reader ends up with, not only what the writer
  does? A list of tasks may come first only where readers hire for that exact
  task and manage the rest, as a team may hire just for its Terraform modules;
  then add, from the user, what doing it well gives them.
- **Swap.** Run the [swap test](cliches.md#self-description) against the nearest
  neighbor, such as a backend agency for a frontend one; if the gain still fits,
  narrow it.
- **Source.** Take the gain from the user or the person's real work, never from
  the role alone: what they specialize in and whom they serve change it.

- Consultant's site: "I help businesses unlock the power of their data." → "I
  fix slow Postgres databases for SaaS teams that have no database specialist."
  (past engagements from the user)

## When to Call

Triggers: a services list with no situation to call about and nothing out of
scope; a refusal that faults clients ("not for teams that won't write tests").

- Give, from the user's real engagements or requests, the situations in which
  readers should come, each worded as a reader in it, or one who may be, would
  describe it; lead with one whose facts also teach, such as that a problem has
  a known fix or costs less caught early. Never invent one or describe one
  readers couldn't meet; with none from the user, ask for them, keep the
  services list as it stands meanwhile, and name the gap in your reply.
- State plainly what isn't taken on, from the user, as the person's own limit or
  way of working, never as a fault of such clients, so readers who fit see the
  page is for them; where it leaves readers stuck, add what the person can still
  do or whom to ask, as the user gives it
  ([Before Readers Adopt](promotion.md#before-readers-adopt)); with no limit
  from the user, ask; never infer one from what the page leaves out.

- Consultancy site: "Accessibility done right, for teams that actually care
  about users." → "Teams call us when an audit lists hundreds of accessibility
  issues before a launch: most trace back to a few shared components, and a fix
  in one reaches every page that uses it. We audit only web content, not native
  screens; in a native app, we can still audit the screens it loads in a web
  view." (past engagements and limit from the user)

## Methods and Tools

This part of a page is for readers who can judge the method, such as a peer or a
client hiring for one specific task: name the methods in the field's own terms,
from the user, without explaining them, since the opening already told everyone
else who and the gain. Give methods in place of a claim of skill: experts can
check them. Test each detail:

- **Correct.** Each term in its exact meaning, confirmed in its docs
  ([Confirming Terms First](abstruse-wording.md#confirming-terms-first)): a
  misused one tells experts the writer doesn't know the field.
- **Specific.** A tool, standard, version, or scale, not a category ("full-stack
  development").
- **To the point.** It bears on the gain; cut one added to sound expert.

- Consultant's site: "I leverage cutting-edge observability to supercharge
  database performance." → "I find the slowest queries in `pg_stat_statements`,
  read their plans with `EXPLAIN (ANALYZE, BUFFERS)`, and change the indexes or
  the queries." (service notes from the user; PostgreSQL docs)

## Proof of Skill

Triggers: a count of projects as proof; enthusiasm ("we live and breathe code");
degrees, certificates, awards, or memberships.

Test each claim of skill: does it name a hard case of this work, such as a
failure readers may not foresee, and what the person does about it? A count
shows volume, enthusiasm shows nothing readers can check, and a credential shows
study or honors. Give, from the user, such cases and how the person handles
each, in readers' terms, so they see what the work takes; with none in the
sources, ask the user for them. Then, for each credential:

- **Unidentified** ("several certifications"): ask the user which and what each
  tests; meanwhile leave it out of your draft, or keep it in text you edit,
  after the hard cases, and name the gap.
- **Off topic,** bearing on nothing this reader decides here, such as whether to
  hire, invite, or attend ([Personal Facts](#personal-facts)): cut it, named in
  your reply.
- **On topic,** such as a cloud certification a client requires: after the hard
  cases, with what it means for readers, from the user or its issuer: for a
  membership or committee role, what it lets the person do for readers, even
  where nothing is for sale, such as flag changes to a standard they help write,
  since a bare one can read to practitioners as time away from the work; for an
  award, however well known, what was judged and by whom.

In a bio of a line or two, or one a length limit fixes, keep an on-topic
credential under its exact name and add no hard case; ask for one only where the
text has room for it.

Enthusiasm takes [Self-Description](cliches.md#self-description); a count,
[Questions Readers Bring](facts.md#questions-readers-bring).

- Freelancer's site: "A certified, passionate payments developer." → "I'm a
  payments developer. A provider may deliver a webhook event more than once, so
  a handler that acts on each delivery can fulfill an order twice; my handlers
  record each order they fulfill and skip any order already fulfilled, whatever
  event or delivery triggers them. I also hold a payments certification." Reply:
  "Which certification is it, and what does it test?" (service notes from the
  user; the payment provider's webhook docs)

## Personal Facts

Triggers: the writer's life story, such as how the author took up programming;
character praise ("hardworking", "dedicated"); tenure such as "since 2009"; a
team's offsite photos.

Test each: would a reader decide differently knowing it, such as whether to
hire, sponsor, or invite? If not, cut or move it, naming each cut in your reply
([Using the Goal](goal.md#using-the-goal)); keep one readers act on, such as a
hobby that is the site's subject, or one from the user that the work's trust
rests on, such as a background check for access to production data. Praise takes
the [evaluations](evaluations.md) fix, counts of effort such as commits or
projects [Questions Readers Bring](facts.md#questions-readers-bring), and a
team's size as proof
[Ranks and Size as Proof](vague-words.md#ranks-and-size-as-proof). Drafts drift
back to the writer's story: rerun the test on each.

- Speaker bio: "Dana wrote her first program at nine and has run three
  marathons." → cut, named in the reply; the bio now reads: "Dana Reyes is a
  data engineer at Example Corp. Her team moved the company's nightly batch
  loads to streaming." (bio notes from the user)

## Checking Each Claim

Take every skill, role, title, credential, client, project, number, and result
from the user or a source, such as their repositories or talks, never from what
the role usually involves, and never inflate one, such as "led" for "contributed
to". Correct a claim a source contradicts
([False Claims](unfounded-claims.md#false-claims)); one none supports follows
[No Source](unfounded-claims.md#no-source). Where a source states the opposite
of the user's word, write what the source shows and ask the user which record is
current. A source that only leaves a claim out, such as a list of maintainers
that lacks the user, doesn't disprove it: keep the claim and ask whether the
source is kept up to date, or records the role elsewhere or under another name.
Where a source you open may not be the one the user means, as a pull request
number that leads to another author's change, leave the claim out and ask the
user for the link. Past work, sample projects, and users' words follow
[Past Work and Users](promotion.md#past-work-and-users), screenshots and demos
[Tables, Diagrams, and Output](explaining.md#tables-diagrams-and-output); never
invent one.

- Portfolio, kept: "Reviewer for the Foo CLI." Reply: "Foo's `CODEOWNERS` file
  doesn't list you. Is it current, or was the role earlier? If earlier, tell me
  the years and I'll add them." (the user's bio; Foo's `CODEOWNERS`)

## The Author's Voice

Keep the voice the person or team writes in, such as a casual first person or
dry humor, from their own texts, and keep edits within it; never invent a
persona, greeting, catchphrase, or joke. Their own greeting, as their other
texts show, stays, with who in the same sentence; a stock one ("Welcome to my
corner of the web") takes [Openings](cliches.md#openings); stock lines beside
it, such as "thanks for stopping by", take
[Politeness for Show](introductory-words.md#politeness-for-show). A request for
another tone, such as a lighter one, follows
[Requests to Soften](requests-to-soften.md#requests): change wording and order,
keep every fact and the plain who first, and add nothing a source doesn't show.

A distinctive touch, such as Sam's second sentence below, is optional and only
from the user: on the page's topic, never an aside unrelated to the work, and
after what readers need. A dry page first gets the
[parts](#parts-of-a-longer-page) it lacks, from the user's facts; never write a
touch yourself. Asked to add a touch, a mission or goal, a joke, or humor, ask
the user for their own words or a real habit of their work and write nothing of
that kind until they give it; meanwhile change only wording and order, and say
in your reply what you need.

Topics the person pursues, a goal behind the work, or help they seek, such as
co-maintainers, draw readers who share them or can give that help: only in the
user's words, as they hold them now; with none, leave them out, even where a
template has a slot, and say so in your reply. A stock goal ("empowering
developers") takes [Self-Description](cliches.md#self-description).

- Profile README, kept: "Hi, I'm Sam Ortiz, a Go developer. I write up every
  outage I cause, so you don't repeat it." (the user's README)

## Keep Cases

- A resume, cover letter, or other job application follows
  [job applications](job-applications.md) for its parts, order, and cuts. From
  this file and [promotion](promotion.md), it uses only the sections job
  applications links to by section anchor, such as
  [Checking Each Claim](#checking-each-claim). Its credentials and dates stay in
  the resume's sections, under their exact names. A job posting the user writes
  follows this file and promotion, adding the parts listed in
  [Keep Cases](job-applications.md#keep-cases).
- Legal company details, such as a registered number: exact, from the source.
- A mission statement or tagline the user keeps verbatim: keep its wording,
  placed as for [coined labels](#opening-with-the-role); where the site's layout
  fixes it as the top line, the first sentence under it says who.
- A title the site's navigation fixes, such as "About": the first sentence under
  it says who.
