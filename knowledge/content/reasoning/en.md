---
type: lesson
code: 6271
title: Reasoning
summary: >-
  A reasoning model writes down its thoughts before it answers: what that
  means for a machine that only predicts the next token, why it helps, how a
  model learns it from rewards, how far it scales, and why it made AI agents
  possible.
objectives:
  intro: "This lesson explains what happens when a language model thinks before it answers, and afterwards you can:"
  goals:
    - "explain what reasoning means for a language model and why it is still next-token prediction"
    - "give four reasons why writing out intermediate steps leads to better answers"
    - "describe how a model learns to reason from rewards for answers that a program can check, and why maths and code came first"
    - "put the milestones from chain-of-thought prompting in 2022 via o1 in 2024 to DeepSeek-R1 in 2025 in order"
    - "tell thinking longer from thinking more often, and weigh better answers against time and cost"
    - "explain why the written thoughts are not always the real reason for an answer, and why reasoning was a precondition for agents"
level: 2
duration: 30
topics: [language-models, ai-agents]
relations:
  requires: [next-token-prediction]
  see_also: [ai-agents, the-bitter-lesson]
modules: [aai]
areas: [ai]
status: draft
updated: 2026-11-12
---

Try this question on yourself before you read on: *A tractor and a trailer cost 11,000 € together, and the tractor costs 10,000 € more than the trailer. What does the trailer cost?* Most people answer 1,000 € at once, and they are wrong, because then the tractor would cost 11,000 € and both together 12,000 €. The trailer costs 500 €. Whoever writes down two lines of algebra before answering gets it right, and language models are no different: a model that has to put the answer into the very next token is tempted by the obvious number, while a model that first writes out its steps can work it out. Writing out steps before the answer is what **reasoning** means for a language model, and models trained to do it are called **reasoning models**. This page answers:

- What does it mean for a language model to think, if all it does is predict the next token?
- Why does writing out the steps lead to better answers?
- Where did the idea come from, and which model was the first reasoning model?
- How does a model learn to reason?
- How can you get more out of reasoning, and what does it cost?
- What is reasoning not, and why did it make AI agents possible?

## Thinking is writing

A language model has no hidden place where it could think quietly. As the lesson [[next-token-prediction]] shows, it does one thing over and over: it reads the context and computes the next token. So when a reasoning model "thinks", it writes. Before the answer it produces a stretch of text, often hidden in the app behind a line such as *Thinking…* or *Thought for 12 seconds*, in which it restates the question, tries a way to solve it, checks the result and corrects itself. Only then does it write the answer, and while writing the answer it reads its own notes, because they are now part of its context.

![Two rows. In the upper row, a box question leads through a long arrow labelled answers right away to the answer 1,000 €, framed in red with a cross. In the lower row, the same question leads into a blue box labelled thinks in writing first, with four lines: trailer: x, tractor: x + 10,000, x + x + 10,000 = 11,000, and x = 500. From there an arrow leads to the answer 500 €, framed in green with a tick.](figure:answer-or-think "The same model, once answering at once and once after writing out its steps.")

Nothing in the way the model works changes when it reasons. It is the same transformer predicting the same kind of tokens; the difference lies in what it has learned to write before the answer. You can see these thoughts in many apps and in LM Studio, where reasoning models show them in a fold-out box above the answer, and the section *Reasoning* in the panel on the right sets whether and how much the model thinks.

## Why writing it down helps

That a few lines of notes make such a difference has four reasons, and they reinforce each other.

**More tokens, more computation.** To produce one token, the model runs through all its layers once, and that takes roughly the same amount of computation whether the token answers "2 + 2" or a hard puzzle. A model that must answer a hard question in the next token has only this one pass for it. Every token of thought is another pass, so a model that writes 500 tokens before its answer has spent 500 times as much computation on the question.

**The notes are working memory.** You cannot multiply 37 by 48 in your head as easily as on paper, because on paper the intermediate results stay put. For a language model the context is the paper: an intermediate result it has written down can be read again for every later token instead of having to be worked out anew.

**Small steps are easier than one big step.** "x + x + 10,000 = 11,000" is a step that is easy to get right, and so is "x = 500". The question as a whole is not. Splitting a problem into steps turns one hard prediction into several easy ones, each of which is close to something the model has seen many times.

**A step on paper can be checked.** A token, once written, is never revised. A reasoning model cannot erase a wrong step either, but it can read it, notice that something does not add up and write *wait, that is wrong* followed by a new attempt. The correction does not delete the mistake; it simply comes later in the text, and the answer is based on everything that came before.

Nobody built these four effects in by hand. They follow from how a language model works, which is why simply asking a model to write out its steps already helped, long before there were reasoning models.

## From a trick in the prompt to a trained skill

The idea came in two stages: first people discovered that a model answers better when it is asked to write out its steps, then labs trained models to do it on their own.

In 2021, researchers from MIT and Google showed that models get much better at long additions and at predicting what a program outputs when they write out intermediate results on a **scratchpad**. In January 2022, Jason Wei and colleagues at Google put eight worked examples, question, steps and answer, in front of a question and called the result **chain-of-thought prompting**. On GSM8K, a collection of grade-school maths word problems, Google's model PaLM with 540 billion parameters solved 18% of the problems without the examples and 57% with them. Four months later, a team from Tokyo found that one sentence was enough: with *Let's think step by step* added to the question, one of OpenAI's models solved 79% instead of 18% of a set of arithmetic word problems. In the same year, Google showed that it helps to let the model reason several times and take the answer that comes up most often.

All of this was a trick: the model reasoned when someone asked it to, and it reasoned the way the examples showed. On 12 September 2024, OpenAI released **o1**, the first model that had been trained to think before every answer, with reinforcement learning on a large scale. On AIME, an American maths competition for strong high-school students, GPT-4o had solved 12% of the problems; o1 solved 74% with a single attempt. OpenAI did not say how exactly it was done and shows only a summary of o1's thoughts. In January 2025, the Chinese lab DeepSeek published **DeepSeek-R1** with open weights and a paper that described the recipe, and within weeks every large lab offered a model that could think.

| When | What | Who | Source |
|---|---|---|---|
| 2021 | Scratchpads: write out intermediate results | MIT, Google | [paper](https://arxiv.org/abs/2112.00114) |
| January 2022 | Chain-of-thought prompting: worked examples in the prompt | Google | [paper](https://arxiv.org/abs/2201.11903) |
| March 2022 | Self-consistency: several attempts, majority vote | Google | [paper](https://arxiv.org/abs/2203.11171) |
| May 2022 | "Let's think step by step" | University of Tokyo, Google | [paper](https://arxiv.org/abs/2205.11916) |
| October 2022 | ReAct: thoughts alternate with actions such as a search | Princeton, Google | [paper](https://arxiv.org/abs/2210.03629) |
| September 2024 | o1, the first model trained to reason | OpenAI | [announcement](https://openai.com/index/learning-to-reason-with-llms/) |
| December 2024 | o3 and Gemini 2.0 Flash Thinking | OpenAI, Google | [o3](https://openai.com/12-days/), [Gemini](https://ai.google.dev/gemini-api/docs/changelog#12-19-2024) |
| January 2025 | DeepSeek-R1, open weights and the recipe | DeepSeek | [paper](https://arxiv.org/abs/2501.12948) |
| February 2025 | Claude 3.7 Sonnet, one model with and without extended thinking | Anthropic | [announcement](https://www.anthropic.com/news/claude-3-7-sonnet) |
| July 2025 | Gold-medal standard at the International Mathematical Olympiad | OpenAI, Google DeepMind | [OpenAI](https://github.com/aw31/openai-imo-2025-proofs), [Google DeepMind](https://deepmind.google/discover/blog/advanced-version-of-gemini-with-deep-think-officially-achieves-gold-medal-standard-at-the-international-mathematical-olympiad/) |
| August 2025 | GPT-5 decides itself whether to think; gpt-oss, open reasoning models | OpenAI | [GPT-5](https://openai.com/index/introducing-gpt-5/), [gpt-oss](https://openai.com/index/introducing-gpt-oss/) |

## How a model learns to reason

A reasoning model starts as an ordinary language model and goes through up to three stages, of which only the last is new.

1. **Pretraining.** The model learns to predict the next token on a large part of the internet, books and code. Along the way it sees many worked solutions in textbooks, forums and lecture notes, so it already knows what reasoning looks like on paper.
2. **Examples of thinking.** Optionally, it is fine-tuned on a few thousand texts in which a question is followed by careful thoughts and a correct answer, so that it gets used to thinking before answering.
3. **Learning from rewards.** The model gets problems whose answer a program can check, such as a maths problem with a known result or a programming task with tests. For each problem it writes many attempts, thoughts and answer, and a program checks only the answers. Attempts with the correct answer get a reward, the others none, and the model is adjusted so that the kind of thinking that led to a reward becomes more likely. This is **reinforcement learning**, and it is repeated over many thousands of problems.

![On the left a box problem with a known answer, an arrow to a box model, and from there four arrows to four attempts: attempt 1 ending in 500 €, attempt 2 in 1,000 €, attempt 3 in 400 € and attempt 4 in 500 €. Next to them a tick and reward 1 for attempts 1 and 4, and a cross and reward 0 for attempts 2 and 3. A blue line leads from the attempts back into the model, labelled the thinking that led to ✓ becomes more likely.](figure:learning-from-rewards "One round of learning from rewards: only the answers are checked, and the thinking behind correct answers is strengthened.")

The remarkable thing about the third stage is that nobody writes the thoughts. The program judges only whether the answer is right, and the model finds out by trial which ways of thinking get there more often. DeepSeek showed this most clearly with **R1-Zero**, a model trained with rewards alone and without any examples of thinking. During training its thoughts grew longer by themselves, and it began to check and question its own steps. In the paper, the researchers quote a passage in which the model interrupts itself with the words *Wait, wait. Wait. That's an aha moment I can flag here* and then starts over. On AIME, R1-Zero improved from 16% to 71% in the course of this training.

Maths and code came first because their answers can be checked by a program, quickly and millions of times, without a person who has to judge every attempt. Where the reward has a loophole, the model finds it: if a test only checks that a program runs without an error, a model may learn to write programs that run but do nothing useful. Developers call this **reward hacking**, and it is one reason why rewards that a program checks are preferred to rewards that another model estimates.

A large reasoning model can also pass on its skill: a small model that is fine-tuned on the thoughts and answers of a large one learns to reason much better than it would on its own. This **distillation** is one reason why there are reasoning models small enough for your laptop: DeepSeek passed R1's skill on to six smaller models, the smallest with 1.5 billion parameters, and even that one beat GPT-4o on AIME.

## Thinking longer, thinking more often

OpenAI's announcement of o1 showed two curves. The first showed that o1 gets better the more computation goes into learning from rewards; the second showed that it gets better the longer it may think before answering. Both rose steadily on a logarithmic axis, so that every tenfold increase in computation brought a similar gain. This second curve was new: until then, a model got better mainly through more training, while from now on the time it spends on a single question also counts.

There are two ways to spend more time on a question, and they can be combined.

![Two halves. On the left, under think longer, a single blue box with six lines: step 1, step 2, wait, step 2 is wrong (shaded), step 2, again, step 3, and answer: 500 €. On the right, under think more often, five narrow boxes of short lines, with the answers 500, 500, 1,000, 500 and 400 below them, and arrows from all five to a blue box majority: 500 €.](figure:longer-or-more-often "Thinking longer means one long chain of thought; thinking more often means several attempts and a vote.")

**Thinking longer** means one chain of thought with more steps, more checks and more corrections. A team at Stanford showed in 2025 how simple this can be: when their model wanted to stop thinking, they appended the word *Wait*, and the model checked its work once more and often corrected a mistake. **Thinking more often** means several independent attempts and a decision between them, either by majority vote or by a second model that judges the attempts. With 64 attempts and a majority vote, o1 solved 83% of the AIME problems instead of 74%. A study by Google DeepMind and Berkeley found that a small model that may think well can beat a model 14 times its size on problems that the small model can sometimes solve.

This is the bitter lesson again, which Rich Sutton described in [[the-bitter-lesson]]: the methods that win are the ones that use more and more computation, and Sutton names two, learning and search. A reasoning model uses both, learning from rewards during training and something like search, trying and checking, at the moment it answers.

Thinking is not free. Every token of thought costs time, and with paid models it costs money, because thinking tokens are billed like answer tokens. When OpenAI's o3 took on ARC-AGI, a test of puzzles that are easy for people, the usual setting cost about 26 dollars per puzzle and reached 76%; with 172 times as much computation it reached 88% and cost several thousand dollars per puzzle. Reasoning models also tend to **overthink**: early ones wrote long thoughts before answering what 2 + 3 is. That is why apps and programming interfaces let you set how much a model may think, often as *low*, *medium* and *high*, and why newer models such as GPT-5 or Claude Opus 4.6 decide for each question how much thought it deserves.

## What reasoning is not

The thoughts look like a person thinking aloud, which makes it tempting to read them as an honest report of how the model arrived at its answer. They are not always one. In 2025, Anthropic gave reasoning models a hint to the answer in the question and checked whether the thoughts mentioned the hint when the model used it. Claude 3.7 Sonnet mentioned it in 25% of the cases, DeepSeek-R1 in 39%; in the other cases the thoughts gave a plausible justification that left out the actual reason. The written thoughts are text that helps the model to its answer, not a window into its workings.

Whether reasoning models "really" reason is disputed. In June 2025, researchers at Apple gave them puzzles of growing difficulty, such as the Tower of Hanoi with more and more discs, and found that their accuracy collapsed completely beyond a certain size. Others replied that some of these puzzles were no longer solvable at all or that the answers would have exceeded the length the models were allowed to write. For practical work, the conclusion is simpler than the debate: a reasoning model makes fewer mistakes on tasks with many steps, but it still makes them, and an answer that comes with long, convincing thoughts still has to be checked.

Being able to read the thoughts is also an opportunity for safety. In July 2025, more than forty researchers from several labs wrote together that the thoughts of a model may reveal when it intends to do something it should not, and that developers should take care not to train this readability away.

## Why reasoning made agents possible

An AI agent, as the lesson [[ai-agents]] describes it, works in a loop: it thinks, calls a tool, reads the result and decides what to do next, until the goal is reached. The idea of this loop, called ReAct, dates from 2022, but agents built on the models of that time rarely got far, because every step of a long task is a chance to go wrong and they did not notice when it happened. Reasoning supplies exactly what the loop needs: a plan before the first step, a check after each result, and the *wait, that failed* that leads to another way instead of carrying on with an error.

Since 2025, models also think between their tool calls: OpenAI's o3, released in April 2025, was trained with rewards to decide within its thoughts when to search, run code or look at an image, and since Claude 4, Anthropic's models can think between two tool calls. The effect can be measured. The research group METR gives AI models tasks from software development and measures how long the tasks they solve in half of the cases would take a skilled person. This length has doubled roughly every seven months since 2019 and faster since 2024: in early 2026, METR measured about an hour for Claude 3.7 Sonnet from February 2025 and over five hours for Claude Opus 4.5 from November 2025. An agent that works on its own for hours instead of minutes is what this lesson's tractor question looks like at a larger scale: it is the result of thinking before acting, many thousands of times in a row.

## Try it yourself

- Choose a question with an obvious but wrong answer, best one that is not famous, so that the model cannot remember the solution: change the numbers of the tractor question, or change a well-known riddle so that its usual solution no longer fits.
- Ask a model once with thinking switched off or set to *low* and once with thinking set to *high*, in a chat app or in LM Studio with a reasoning model such as gpt-oss-20b.
- Compare the answers, the time to the answer and the number of tokens, and read the thoughts: where does the model notice a mistake, and does it really read your changed question?

## Further reading

- Jason Wei et al.: [Chain-of-Thought Prompting Elicits Reasoning in Large Language Models](https://arxiv.org/abs/2201.11903), 2022, the paper that made reasoning by prompt known.
- Takeshi Kojima et al.: [Large Language Models are Zero-Shot Reasoners](https://arxiv.org/abs/2205.11916), 2022, the paper behind "Let's think step by step".
- Xuezhi Wang et al.: [Self-Consistency Improves Chain of Thought Reasoning in Language Models](https://arxiv.org/abs/2203.11171), 2022, several attempts and a majority vote.
- OpenAI: [Learning to Reason with LLMs](https://openai.com/index/learning-to-reason-with-llms/), 12 September 2024, the announcement of o1 with both scaling curves.
- DeepSeek-AI: [DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning](https://arxiv.org/abs/2501.12948), 2025, with R1-Zero, the "aha moment" and distillation.
- Niklas Muennighoff et al.: [s1: Simple test-time scaling](https://arxiv.org/abs/2501.19393), 2025, a thousand examples and the word "Wait".
- Charlie Snell et al.: [Scaling LLM Test-Time Compute Optimally can be More Effective than Scaling Model Parameters](https://arxiv.org/abs/2408.03314), 2024.
- ARC Prize: [OpenAI o3 Breakthrough High Score on ARC-AGI-Pub](https://arcprize.org/blog/oai-o3-pub-breakthrough), December 2024, with the cost per puzzle.
- Anthropic: [Reasoning models don't always say what they think](https://www.anthropic.com/research/reasoning-models-dont-say-think), April 2025.
- Parshin Shojaee et al.: [The Illusion of Thinking](https://arxiv.org/abs/2506.06941), Apple, 2025, and the reply [The Illusion of the Illusion of Thinking](https://arxiv.org/abs/2506.09250).
- Tomek Korbak et al.: [Chain of Thought Monitorability: A New and Fragile Opportunity for AI Safety](https://arxiv.org/abs/2507.11473), 2025.
- METR: [Measuring AI Ability to Complete Long Tasks](https://arxiv.org/abs/2503.14499), 2025, and the update [Time Horizon 1.1](https://metr.org/blog/2026-01-29-time-horizon-1-1/), January 2026.
