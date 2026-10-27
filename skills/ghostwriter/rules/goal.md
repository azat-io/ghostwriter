# Goal

Order pass, settled before you draft or restructure: what the text should change
for its reader. Without a goal, a text can collect related material readers
don't need and miss what they do. Default: set the goal and the moves that reach
it, then keep, cut, move, or add each part by them.

## Setting the Goal

Settle it from the user or the text, with the [reader](../SKILL.md#when-to-use),
also before you act on a [request to soften](requests-to-soften.md). Ask only
what neither answers and what would change the main point or what readers do
([When to Use](../SKILL.md#when-to-use)); otherwise decide, and state your
assumption in your reply:

- **Start.** Who reads it, and what do they know, believe, or do now?
- **End.** What should each kind of reader know, believe, or be able to do after
  it?
- **Need.** Does anyone need the text, and what happens if nobody writes it?
  What would a reader do wrong if it were wrong or vague?

The answers show what readers need, usually facts, not boilerplate, or that a
text or part of it isn't needed: say so once in your reply, and write what the
user still asks for, without filler. Form the goal in one sentence and test it;
use the first row that fits:

| The goal                                                                              | Fix                                                                                                      |
| ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Names a topic or the writer's act: "describe the new cache"                           | What the reader can do or decide after it: "decide whether to turn on the cache"                         |
| Leaves readers only alarmed or helpless: "warn that old Acme agents can be exploited" | What they can check and do, from a source: "find out whether they run an affected version, then upgrade" |
| Depends on the reader's will: "convince the team to adopt Rust"                       | What the text controls: "give the team the costs, risks, and pilot plan it needs to decide"              |
| One the text can reach that helps the reader act or decide                            | Keep                                                                                                     |

## Planning the Moves

Moves are the parts, each a section or a paragraph, that take this reader from
the start to the end point. For a long draft or restructure, outline them before
writing; in an edit, use them to check what each part does within the chosen
[mode](../SKILL.md#when-to-use). No need to show this plan unless asked. If you
can't say how a part brings the reader closer, check whether it is a digression.

Make moves that inform, each from a source: facts, reasons, costs, limits, and a
fair answer to each objection, difficulty, or other view a careful reader would
raise; where no source settles one, say it is open. Pressure, such as alarm,
urgency, or one claim repeated in new words, is no move. Turn the moves into
sections ([structure](structure.md)) and the topic into a title
([headings](headings.md)).

- RFC, goal: reviewers can decide whether to replace the cron jobs with a job
  queue. Moves: what fails now; the proposal; the options considered and why
  each lost; the cost and the rollout; open questions. (design discussion from
  the user)

## Using the Goal

Triggers: the project's history, a tangent on a related tool.

Test every section, paragraph, and sentence, in your draft as in text you edit:
which move does it make? Use the first row that fits:

| Finding                                                                                 | Do                                                                                                                                                                                                                                                        |
| --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A fact readers need that makes no move, such as a breaking change or a known limitation | Keep it ([Check](../SKILL.md#check)): add a move for it, or widen the goal                                                                                                                                                                                |
| It makes a move                                                                         | Keep it where its move comes ([structure](structure.md))                                                                                                                                                                                                  |
| It makes none, however interesting, or serves only readers this text isn't for          | Cut it, or move it within this text where it serves; if unsure whether readers need it, keep it. Name each cut in your reply, with where it could go, such as another page, so the user can restore or place it; edit another file only if the user asked |
| A move has no part                                                                      | Add it from a source ([Check](../SKILL.md#check)); with none, ask the user or name the gap                                                                                                                                                                |

- README, goal: a new user installs `acme` and runs a first scan. Cut, and named
  in the reply as belonging in the docs: why the project was rewritten in Rust.
  Added: the operating systems CI tests on, which Install lacked. (README and CI
  matrix from the user)

## Keep Cases

- A full record, such as an API reference or a changelog: every entry serves its
  goal, however rarely used.
- A short text with one point, such as a commit message or a chat reply: the
  point is the goal; it needs no list of moves.
- Parts a template or convention requires
  ([Structure](structure.md#keep-cases)).
- A part the user keeps after you named it: what to publish is their call
  ([Requests to Soften](requests-to-soften.md#keep-cases)).
