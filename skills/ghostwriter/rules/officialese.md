# Officialese

Words pass, [cliches](cliches.md) group: officialese, the stiff, wordy style of
forms, policies, and official notices. It also turns up in READMEs, error
messages, and team announcements, where plain wording says the same in fewer
words. Default: use the plain wording; in a notice or a team's rule or policy,
replace ceremony with facts the reader can act on. The deletion test in
[filler.md](filler.md) protects the keep cases below.

## Detection

Long use makes much officialese read as normal English, so writers stop noticing
it: scan for it on purpose. Match the triggers below, which are samples, and
other phrases of their kinds; most span several words. Look hardest at notices,
team policies, form letters, signatures, and error messages you write or are
asked to edit. Change legal text, such as terms of service, only as
[Keep Cases](#keep-cases) allow; a message quoted from a program stays verbatim.

## Plain Words

| Kind                   | Officialese                                                                                                            | Plain                                                                                                                            |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Empty verb with a noun | "perform an upgrade"; "conduct a review"; "execution of the tests is carried out"; "is in receipt of"                  | "upgrade"; "review"; "the tests run"; "has received"                                                                             |
| Unnamed action         | "take appropriate action", "steps have been taken", "remediation efforts"                                              | The actions, from a source; with none, keep the claim and ask the user or name the gap                                           |
| Long connector         | "in order to"; "in the event that"; "until such time as"; "with the exception of"; "prior to"; "in the absence of"     | "to"; "if"; "until"; "except"; "before"; "without"                                                                               |
| Long connector         | "for the purpose of"; "by means of"; "in excess of"; "with regard to"                                                  | "to" or "for"; "with" or "by"; "more than"; "about"                                                                              |
| Long connector         | "in connection with"; "in accordance with", "pursuant to"; "as per"                                                    | "about", or "with" for things used together; "under" a rule, license, or contract, or "as … says"; "as … says" or "as you asked" |
| Pointer                | "the said", "the aforementioned"; "herein"; "thereof"                                                                  | "the" or "this"; "here"; "its"                                                                                                   |
| Formal word            | "commence"; "utilize"; "ascertain"; "endeavor to"; "facilitate"                                                        | "start"; "use"; "find out"; "try to"; "help"                                                                                     |
| Modal phrase           | "has the ability to", "is able to"; "is required to"                                                                   | "can"; "must"                                                                                                                    |
| Time and manner        | "on a daily basis", "on a weekly basis"; "in a timely manner"; "effective immediately"; "at your earliest convenience" | "daily", "weekly"; "promptly"; "now" or the date; "as soon as you can" or the deadline                                           |
| Framing                | "please be advised that", "kindly note that", "please find attached", "hereby"                                         | Delete it and state the fact: "The build log is attached."                                                                       |

Check the plain wording against the sentence: if it changes the claim, such as
its doubt, certainty, condition, timing, action, relation, or result, choose
wording that keeps it. Name an actor only if a source does; otherwise keep the
passive, or make the thing the subject if it does the action itself ("the tests
run").

- "A review of the said pull request will be performed in a timely manner." →
  "The pull request will be reviewed promptly." → "Ana will review the pull
  request by Friday." (reviewer and deadline from the user)
- Postmortem: "We have implemented measures to prevent a recurrence." → "We
  added an alert on replication lag and a check that blocks deploys while a
  migration runs." (postmortem notes from the user)

## Overlaps

Fixes for phrases another group also flags:

- An empty verb with a noun is also a
  [noun made from a verb](verbs.md#nouns-made-from-verbs), and a formal word is
  also [abstruse wording](abstruse-wording.md): same fix.
- A vague word left by the rewrite ("promptly") gets the time from a source or
  stays ([vague words](vague-words.md)).
- Present-day markers ("at this point in time"):
  [Present-Day Markers](cliches.md#present-day-markers).
- Courtesy formulas ("thank you for your patience", "do not hesitate to contact
  us"): delete, and if the reader may need help, say where to ask
  ([Politeness for Show](introductory-words.md#politeness-for-show)); a stock
  apology for your own disruption becomes one plain one ([Notices](#notices)).
- Bad news behind officialese ("a service disruption"):
  [euphemisms](euphemisms.md).

## Notices

Triggers: a notice of maintenance, an outage, or a change; a formal salutation;
"IMPORTANT NOTICE"; "we regret any disruption this may cause"; a signature such
as "The Infrastructure Team".

Cut the ceremony. Replace a stock apology for your own disruption with one
short, plain apology that names it.

In the Order pass, check these parts:

1. **Impact and timing.** For a disruption, open with what changes for readers,
   in their terms, from when and until when if it ends. Give what to use
   meanwhile and its cost, such as extra steps or a wait.
2. **Response and next step.** In an incident update, what you did and what
   happens next; while the incident or investigation remains open, when readers
   will hear again.
3. **Cause.** After those practical parts. If your action needs the cause to
   make sense, first say it in readers' terms ("we undid the change at 14:20"),
   then explain it here.
4. **Help and follow-up.** If readers need help or follow-up, who is responsible
   and how to reach them. Cut a ceremonial signature, never a needed name or
   contact; take both as [Impersonal Authority](#impersonal-authority) says.
5. **Other useful facts.** What keeps the disruption short and what the work
   improves for readers, with specifics such as numbers.

Take every part from a source. If a needed part has no source, ask the user or
name the missing fact in your reply, including in a review; don't silently skip
it. Never invent it. A deadline or ongoing status in the user's facts follows
[Present-Day Markers](cliches.md#present-day-markers).

- "Please be advised that CI maintenance will be performed on June 3,
  01:00–03:00 UTC. We regret any disruption this may cause. — The Infrastructure
  Team" → "**CI won't run on June 3, 01:00–03:00 UTC.** Commits pushed in that
  window build after 03:00; to test sooner, run `make test` locally. Sorry for
  the pause. Questions: Dana Lee, dana@example.com. The pause moves CI to new
  runners, which cut the peak-hour wait for a build from 12 minutes to 3 in a
  trial." (migration plan and contact from the user, `Makefile`)

Rewrite rules and requests the same way: give the reason, such as who is harmed
or what breaks, and an alternative that gets readers what they need without the
harm. Take both from a source; if none has one, ask the user or name the gap;
never invent a reason or a workaround. Drop pressure, such as capitals,
"strictly", or threats; state a real consequence as a plain fact. A request also
follows [Politeness for Show](introductory-words.md#politeness-for-show).

- Generated-file header, changed in the generator's template: "THIS FILE IS
  AUTO-GENERATED. MANUAL MODIFICATIONS ARE STRICTLY PROHIBITED." → "Generated by
  `make api` from `schema.graphql`. Don't edit this file: `make api` overwrites
  it. Edit `schema.graphql` and rerun `make api`." (`Makefile`)

## Impersonal Authority

Triggers: "it has been decided", "per company policy", "the Company reserves the
right to", "is not responsible for", a signature such as "The Team".

This wording hides who decided and whom to ask. Give the person responsible, or
the team if no source names a person, and a contact; for a decision, who made
it. Rewrite a disclaimer as help: say plainly what you can't do, how readers
avoid the problem, and whom they contact. Take each of these from a source; a
name or contact only from one that names that person or channel as responsible
for this matter or as its contact, such as the user, the docs, or, for a
security issue, `SECURITY.md`; a commit author is not a contact. If no source
has one, keep the claim in plain words and ask the user or name the gap. For
legal text, see [Keep Cases](#keep-cases).

- README: "The developers accept no responsibility for any consequences of using
  this script." → "`notify.py --all` emails every customer, and we can't recall
  a sent email: test it first with `--to` and your own address. Questions: Sam
  Ortiz, sam@example.com." (the code; contact from the user)

## Formalism

Triggers: "where applicable", "as appropriate", "subject to limitations",
"certain features", "including but not limited to", "results are not
guaranteed".

Formalism is wording made complete or noncommittal to satisfy a rule or a
lawyer, not to inform. It can be true yet useless: the reader can't tell what
applies to them. Work out why each formal detail is there; use the first row
that fits:

| Finding                                                                                                                   | Fix                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Neither the text nor a source shows the cases, the fact, what it means for the reader, or that the claim holds without it | Keep it in plain words ("certain features" → "some features"); if the reader needs more, ask the user or name the gap |
| It covers cases that differ for the reader                                                                                | State each case with its own fact                                                                                     |
| It hides a fact the reader needs, such as an exception or a limit                                                         | State the fact                                                                                                        |
| The reader needs it but can't tell why                                                                                    | Say what it means for them, from the text or a source                                                                 |
| The text or a source shows the claim stays true without it, and no reader needs it                                        | Delete it; never add a detail just for completeness                                                                   |

Legal cover is no reason to leave a limit unstated: readers can plan only around
a limit they know, and a limit stated before they hit it protects the author
too. For legal text, see [Keep Cases](#keep-cases).

- What it leaves out: "Exports include project data, subject to technical
  limitations." → "Exports include issues, comments, and labels, but not
  attachments: download those from each issue." (export docs)
- Each case, in a docs page: "Data is retained for the applicable retention
  period." → "We keep build logs for 30 days, artifacts for 90 days, and audit
  logs for a year." (retention policy)

## Keep Cases

- Terms that look formal: "terminate" an EC2 instance (delete it; a stopped one
  can start again), "provision" a server, and status terms such as "deprecated"
  ([euphemisms](euphemisms.md#keep-cases)).
- Wording a standard or tool defines, capitals included: the RFC 2119 key words,
  such as "MUST", "SHALL", and "REQUIRED", in text that cites RFC 2119 or RFC
  8174, including docs that pass on a spec's rule; and the Go generated-file
  line matching `^// Code generated .* DO NOT EDIT\.$`; give the reason on
  another line. Change a generated file's header where the generator gets it,
  such as its template, not in the generated file.
- A statement of what an API, a spec, or a tool promises or leaves to the
  caller, such as "the iteration order is not guaranteed" or "the caller is
  responsible for closing the stream": it states a limit, not formalism, if it
  names exactly what isn't promised or what the caller must do. One that leaves
  unclear what may fail, or only refuses blame, is formalism or a disclaimer.
  Keep a contract statement's meaning, and add what to do only from a source.
- Verbatim text: a quoted message or UI label and a status label a tool defines.
- Legal text sets legal rights or duties, such as a license, terms of service,
  or a privacy policy; a team's working rule, such as a code review policy, is
  not legal text. A license and wording the user says is legally required stay
  verbatim; keep other legal text unchanged unless the user asks for or approves
  a rewrite of it; listing it among texts to edit is no such request: leave it,
  ask, and give the plain facts beside it or in your reply. Put the plain facts
  outside the legal wording, such as in a plain summary next to it or in the
  docs, never inside a license file; if the whole text is legal, propose the
  facts in your reply. A disclaimer outside legal text, such as a README's "use
  at your own risk", gets the [Impersonal Authority](#impersonal-authority) fix;
  say in your reply that you replaced it.
- The passive where the actor is unknown
  ([Passive Voice](verbs.md#passive-voice)), as in "The token was revoked."
