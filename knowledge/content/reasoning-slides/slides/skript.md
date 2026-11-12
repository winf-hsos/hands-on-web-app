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

**Answer at once, or think first.** A model that has to put the answer into
the very next token is tempted by the obvious number. The same model, when it
first writes out its steps, reads its own notes while it answers, because they
are now part of its context. Writing out steps before the answer is what
reasoning means for a language model, and models trained to do it are called
reasoning models.

**Nothing new inside.** A reasoning model is the same transformer predicting
the same tokens, and what changed is what it has learned to write before the
answer. There is no hidden place where it could think quietly; what an app
folds away behind *Thinking…* is text like any other, and LM Studio shows it
in a box above the answer.

**More tokens, more computation.** Every token costs one pass through all
layers of the model, and that pass costs about the same whether the question
is "2 + 2" or a hard puzzle. A model that must answer in one token has this
one pass for the question. Every token of thought is another pass, so 500
tokens before the answer are 500 times as much computation.

**The context is the paper.** 37 × 48 is hard in your head and easy on paper,
because on paper the intermediate results stay put: 37 × 40 = 1,480,
37 × 8 = 296, together 1,776. For a language model the context is the paper:
what it has written down, it reads again for every later token.

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

**Asking for steps already helped.** In 2021, researchers from MIT and Google
showed that models calculate better with a scratchpad for intermediate
results. In January 2022, a team at Google put eight worked examples in front
of a question and called it chain-of-thought prompting: PaLM, with 540 billion
parameters, then solved 57% instead of 18% of a set of grade-school maths word
problems. Four months later, one sentence was enough: with *Let's think step
by step*, a model from OpenAI solved 79% instead of 18% of a set of
arithmetic word problems. The model reasoned only when asked, and in the way
the examples showed.

**Trained to think before every answer.** In September 2024, OpenAI released
o1, the first model trained with reinforcement learning on a large scale to
think before every answer. On AIME, a maths competition for strong
high-school students, GPT-4o had solved 12% of the problems; o1 solved 74%
with a single attempt. OpenAI did not say how, and it shows only a summary of
the thoughts. In January 2025, DeepSeek published R1 with open weights and the
recipe.

**Milestones.** On the left, the time of the trick, when a model reasoned
because the prompt asked for it: scratchpads, chain of thought,
self-consistency, "let's think step by step" and ReAct, which joined thoughts
with actions such as a search and became the loop of agents. On the right,
the models trained to reason: o1, o3 and Gemini 2.0 Flash Thinking,
DeepSeek-R1, Claude 3.7 Sonnet as one model with and without extended
thinking, gold-medal standard at the International Mathematical Olympiad for
models of OpenAI and Google DeepMind, and GPT-5, which decides itself whether
to think, together with gpt-oss as open reasoning models. The gap between 2022
and 2024 is the difference between a trick and a skill.

## Learning from rewards

**Three stages, and only the last is new.** A reasoning model starts as an
ordinary language model. In pretraining it predicts the next token on books,
code and the internet and sees many worked solutions along the way. Optionally,
it is fine-tuned on a few thousand worked answers so that it gets used to
thinking before answering. New is the third stage: learning from attempts
whose answer a program can check.

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
without any examples of thinking. Its thoughts grew longer by themselves, it
began to check its own steps, and in the paper it interrupts itself with
*Wait, wait. Wait. That's an aha moment I can flag here.* On AIME it improved
from 16% to 71% in the course of this training.

**Why maths and code came first.** A program can check their answers quickly
and millions of times: compare with the known result, or run the tests. Where
the reward has a loophole, the model finds it: if a test only checks that a
program runs, a model may learn to write programs that run and do nothing
useful. This is called reward hacking.

**From a large model to your laptop.** A small model fine-tuned on the
thoughts and answers of a large reasoning model learns to reason much better
than on its own. This is distillation: DeepSeek passed R1's skill on to six
smaller models from 1.5 to 70 billion parameters, and even the smallest beat
GPT-4o on AIME. That is why there are reasoning models that run on a laptop.

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
keep scaling with computation, as Rich Sutton wrote, and a reasoning model
uses both: learning from rewards in training, and trying and checking at the
moment it answers.

**Thinking is not free.** On ARC-AGI, puzzles that are easy for people,
OpenAI's o3 reached 76% at about 26 dollars per puzzle; with 172 times as much
computation it reached 88% at several thousand dollars per puzzle. Thinking
tokens are billed like answer tokens, and early reasoning models thought at
length even about 2 + 3. That is why apps and programming interfaces let you
set how much a model may think, often as low, medium and high, and why newer
models decide for each question how much thought it deserves.

**Low or high.** Change the numbers of the tractor question, so that the model
cannot remember the solution, and ask a reasoning model such as gpt-oss-20b in
LM Studio once with reasoning set to low and once with high. Compare the time,
the number of tokens and the thoughts: where does the model notice a mistake,
and does it really read the changed numbers?

## What it is not

**The thoughts are not always the reason.** Anthropic gave reasoning models a
hint to the answer and checked whether their thoughts mentioned it when they
used it. Claude 3.7 Sonnet did in 25% of the cases, DeepSeek-R1 in 39%; in the
others, the thoughts gave a plausible justification without the actual
reason. The written thoughts help the model to its answer, but they are not a
window into its workings. Being able to read them is still an opportunity for
safety, and researchers from several labs have asked developers not to train
this readability away.

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

**How long an agent can work.** The research group METR measures how long the
software tasks that a model solves in half of the cases would take a skilled
person. This length has doubled about every seven months since 2019, and
faster since 2024: about an hour for Claude 3.7 Sonnet from February 2025, and
over five hours for Claude Opus 4.5 from November 2025.

**Key takeaway.** An agent that works for hours is a model that thinks before
it acts, many thousands of times in a row.
