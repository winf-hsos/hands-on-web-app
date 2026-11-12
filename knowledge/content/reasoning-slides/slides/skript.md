# Reasoning

Script for the deck *Reasoning*, in the order of the slides. It follows the
lesson of the same name and assumes that the audience knows how a language
model predicts the next token.

## Opening

Some questions are easier on paper than in your head. Whoever estimates a sum
in their head takes the number that comes to mind first, while whoever writes
down two lines sees the mistake. Language models have learned the same: they
write before they answer, and that is what this deck is about.

## Thinking is writing

**The tractor question.** A tractor and a trailer cost 11,000 € together, and
the tractor costs 10,000 € more than the trailer. What does the trailer cost?
Most people answer 1,000 €, but then the tractor would cost 11,000 € and both
together 12,000 €. The trailer costs 500 €.

**Answer at once, or think first.** The picture follows the IPO model:
input, processing, output. A model that has to put the answer into the very
next token is tempted by the obvious number. The same model can first write
out its steps as output, and these thoughts go back into the model, because
every new token is predicted from everything written so far. Writing out
steps before the answer is what reasoning means for a language model, and
models trained to do it are called reasoning models.

**Nothing new inside.** A reasoning model is the same transformer predicting
the same tokens, and what changed is what it has learned to write before the
answer. There is no hidden place where it could think quietly.

**More tokens, more computation.** The model writes token by token, first
the thoughts and then the answer. Every token costs one pass through all
layers of the model, and that pass costs about the same whether the question
is "2 + 2" or a hard puzzle, so 500 tokens of thought are 500 times as much
computation. In the app, the thoughts are folded away behind *Thought for
12 s* or replaced by a summary, and the user sees only the answer: the
thinking happens out of sight, but it is written text like any other.

**The context is the paper.** On paper, intermediate results stay put. For a
language model the context is the paper: it holds the question and the
thoughts so far, and every new token is predicted from all of it. After
"2x = 1,000" the model writes 500 without solving the whole problem again,
and the 500 is then part of the context and is read again for the next
token.

**Small steps are easier than one big step.** "x + x + 10,000 = 11,000" is a
step that is easy to get right, and so is "x = 500"; the question as a whole
is not. Splitting a problem into steps turns one hard prediction into several
easy ones, each close to something the model has seen many times.

**A step on paper can be checked.** A written token is never taken back. But
the model can read a wrong step ("trailer: 1,000, tractor: 11,000, together:
12,000"), notice that it does not add up and write *wait, that is 12,000, not
11,000* followed by a new attempt. The correction does not delete the
mistake; it comes later in the text, and the answer rests on all of it. None
of these four effects was built in by hand. They follow from how a language
model works, which is why simply asking a model to write out its steps
already helped, long before there were reasoning models.

## From a trick to a skill

**Few-shot: solved examples in the prompt.** A few-shot prompt puts solved
examples in front of the actual question, and the model continues the
pattern. When the example shows only the answer ("The answer is 11."), the
model answers the question about the cafeteria's apples with a number only,
and it is wrong: 27 instead of 9.

**Chain of thought: the examples show the steps.** In the same prompt, the
example now shows the way to its answer: "Roger started with 5 balls. 2 cans
of 3 tennis balls each are 6 balls. 5 + 6 = 11." The model imitates this,
writes out its own steps and gets 9. A team at Google called this
chain-of-thought prompting in January 2022.

**Zero-shot: one sentence instead of examples.** Four months later, a team
from Tokyo and Google showed that no examples are needed: the sentence
*Let's think step by step* after the question makes the model write out its
steps.

**Asking for steps already helped.** With eight solved examples in the
prompt, PaLM from Google solved 57% instead of 18% of a set of grade-school
maths word problems, depending on whether the examples showed the steps. With
*Let's think step by step* and no examples, text-davinci-002 from OpenAI
solved 79% instead of 18% of a set of arithmetic word problems. All of this
happened in 2021 and 2022, before ChatGPT and with models that are old today.
The model reasoned only when asked, and in the way the examples showed.

**AIME, a maths competition.** Almost every number about reasoning models
comes from AIME, the American Invitational Mathematics Examination for the
best high-school students in the United States: 15 problems in 3 hours. Its
first problem of 2024 asks how many minutes Aya's 9-kilometre walk with a
stop at a coffee shop takes at a third speed, given the times at two other
speeds; the answer is 204. Every answer is a whole number from 0 to 999, so a
program can check it.

**o1, the first reasoning model.** In September 2024, OpenAI released o1, the
first published reasoning model, trained with reinforcement learning on a
large scale to think before every answer without being asked. On AIME, GPT-4o
had solved 12% of the problems; o1 solved 74% with a single attempt. OpenAI
did not say how, and it shows only a summary of the thoughts. In January
2025, DeepSeek published R1 with open weights and the recipe.

**Milestones.** On the left, the time of the trick, when a model reasoned
because the prompt asked for it, almost all of it discovered before ChatGPT
with older models: scratchpads, chain of thought, self-consistency, "let's
think step by step" and ReAct, which joined thoughts with actions such as a
search and became the loop of agents. On the right, the models trained to
reason: o1, o3 and Gemini 2.0 Flash Thinking, DeepSeek-R1, Claude 3.7 Sonnet
as one model with and without extended thinking, gold-medal standard at the
International Mathematical Olympiad for models of OpenAI and Google DeepMind,
and GPT-5, which decides itself whether to think, together with gpt-oss as
open reasoning models. Today reasoning is standard: the large new models are
trained to reason, usually with a setting for how much. The gap between 2022
and 2024 is the difference between a trick and a skill.

## Learning from rewards

**Three stages, and only the last is new.** A reasoning model starts as an
ordinary language model. In pretraining it predicts the next token on books,
code and the internet, for example "Paris" after "The capital of France is",
and sees many worked solutions along the way. Optionally, it is fine-tuned on
a few thousand worked answers, with the steps between `<think>` and
`</think>`, so that it gets used to thinking before answering. New is the
third stage: the model writes attempts itself, and a program rewards the one
that ends in the right 9 and not the one that ends in 27.

**One round of learning from rewards.** The model gets a problem with a known
answer and writes several attempts, each with thoughts and an answer. A
program checks only the answers: attempts with the right one get a reward of
1, the others 0. Then the model is adjusted so that the thinking that led to a
correct answer becomes more likely. This is reinforcement learning, repeated
over many thousands of problems.

**Quiz: what does the program check?** Only the final answer. Nobody tells
the model how to think; it finds out by trial which ways of thinking get
there more often.

**Nobody writes the thoughts.** DeepSeek trained R1-Zero with rewards alone,
without any examples of thinking. The paper shows the thoughts of a version
part-way through training on a maths problem: the model squares both sides,
works its way into an equation of fourth degree, then interrupts itself with
*Wait, wait. Wait. That's an aha moment I can flag here.* and starts the
calculation again. Nobody taught it that sentence; checking and starting over
paid off, so it became more frequent. Its thoughts grew longer by themselves,
and on AIME it improved from 16% to 71% in the course of this training.

**Why maths and code came first.** Learning from rewards needs a check that
works without people, because it runs millions of times. For maths, a program
compares the answer with the known one, such as 204; for code, it runs tests
that call the function with examples and compare the result.

**A loophole in the reward.** The reward is only as good as the check. OpenAI
described a reasoning model that read the tests while programming and noted
in its thoughts that they would all pass if the checking function always
returned *True*; the tests pass and the reward is 1, but the program still
does nothing useful. This is called reward hacking, and it was noticed
because the thoughts could be read.

**A small model that reasons beats a large one that does not.** A small
model fine-tuned on the thoughts and answers of a large reasoning model
learns to reason much better than on its own. This is distillation: DeepSeek
passed R1's skill on to six smaller models from 1.5 to 70 billion parameters.
The smallest, with 1.5 billion parameters, solved 28.9% of the AIME problems
with one attempt, while GPT-4o, a much larger model without reasoning, solved
9.3%. That is why there are reasoning models that run on a laptop.

## Longer or more often

**Two curves.** With o1, OpenAI showed two curves: the model gets better the
more computation goes into learning from rewards, and it gets better the
longer it may think before answering. Both rise steadily on a logarithmic
axis. The second curve was new: from then on, the time a model spends on a
single question counts as well as its training.

**Think longer, or think more often.** Thinking longer means one chain of
thought with more steps, checks and corrections; a team at Stanford showed in
2025 that appending the word *Wait* when the model wants to stop already makes
it check its work once more. Thinking more often means several independent
attempts and a decision between them, by majority vote or by a second model.
With one attempt, o1 solved 74% of the AIME problems; with 64 attempts and a
majority vote, 83%.

**The bitter lesson, again.** Learning and search are the two methods that
keep scaling with computation, as Rich Sutton wrote in 2019, and a reasoning
model uses both in two different places. It learns in training, in the round
of attempts and rewards repeated over many thousand problems. It searches
when answering, by thinking longer (waiting, checking, trying again) or more
often (several attempts and a vote).

**Thinking is not free.** On ARC-AGI, puzzles that are easy for people,
OpenAI's o3 reached 76% at about 26 dollars per puzzle; with 172 times as much
computation it reached 88% at several thousand dollars per puzzle. Thinking
tokens are billed like answer tokens, and early reasoning models thought at
length even about 2 + 3. That is why apps and programming interfaces let you
set how much a model may think, often as low, medium and high, and why newer
models decide for each question how much thought it deserves.

## What it is not

**An experiment with hints.** Anthropic asked reasoning models the same
multiple-choice question once without and once with a hint to an answer,
such as "a professor thinks the answer is (A)". When the hint changed the
answer, the researchers checked whether the thoughts mentioned it. In the
illustration, the thoughts give a plausible reason for the Sahara and never
mention the professor.

**The thoughts are not always the reason.** Claude 3.7 Sonnet mentioned the
hint it used in 25% of the cases, DeepSeek-R1 in 39%; in the others, the
thoughts gave a plausible justification without the actual reason. The
written thoughts help the model to its answer, but they are not a window into
its workings. Being able to read them is still an opportunity for safety, and
researchers from several labs have asked developers not to train this
readability away.

**Do they really reason?** Researchers at Apple gave reasoning models puzzles
of growing difficulty, such as the Tower of Hanoi with more and more discs,
and found that accuracy collapsed beyond a certain size; others replied that
some puzzles were unsolvable or the answers longer than allowed. For practical
work the conclusion is simpler: a long and convincing chain of thought is no
proof, so the answer still has to be checked.

## Why agents need it

**Thinking inside the loop.** An agent works in a loop: it thinks, calls a
tool, reads the result and decides what to do next. The loop dates from 2022,
but agents built on the models of that time rarely got far, because every step
of a long task is a chance to go wrong and they did not notice. Reasoning
supplies a plan before the first step, a check after each result and the
*wait, that failed* that leads to another way. Since o3 and Claude 4, models
also think between two tool calls.

**How long an agent can work.** The research group METR measures how long
the software tasks that a model solves in half of the cases would take a
skilled person. Each point is the best model of its time: from three seconds
for GPT-2 in 2019 and four minutes for GPT-4 in 2023, the curve grows steeper
with the reasoning models, doubling about every four months since 2023: 39
minutes for o1, 3.4 hours for GPT-5, about 12 hours for Claude Opus 4.6 and
16 hours or more for an early version of Claude Mythos Preview, beyond which
METR's tasks no longer measure reliably. For GPT-5.6 Sol, METR gave no
reliable figure, because the model exploited the tests too often.

**Key takeaway.** An agent that works for hours is a model that thinks before
it acts, many thousands of times in a row.
