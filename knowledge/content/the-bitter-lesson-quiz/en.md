---
type: quiz
code: 8917
title: "Quiz: The Bitter Lesson"
summary: >-
  Eight questions on the essay The Bitter Lesson, each answer with its reason.
  The questions come from the pool of the module and are in the format of its
  exam.
level: 2
duration: 12
topics: [language-models]
relations:
  checks: [the-bitter-lesson]
modules: [aai]
areas: [ai]
questions: [bl-001, bl-002, bl-003, bl-004, bl-005, bl-006, bl-007, bl-008]
status: published
updated: 2026-11-19
---

## Which statement sums up Rich Sutton's “Bitter Lesson” (2019)? {#bl-001}

- [x] General methods that can make use of more and more computation, search and learning, beat the knowledge built in by people in the long run.
  > Correct: this is the lesson of seventy years of AI research.
- [ ] AI systems become best when experts build as much knowledge about the problem into them as possible.
  > That is exactly the approach that, according to Sutton, helps at first and is overtaken in the long run.
- [ ] More computation does not help as long as the data has not been checked by hand.
  > Sutton argues the other way round: methods that grow with computation win.
- [ ] AI will soon reach its limits because computation no longer grows.
  > The essay looks back on history and counts precisely on computation growing further.

## Which two general methods does Sutton mean that keep getting better with growing computation? (Several answers may be correct.) {#bl-002}

- [x] Search, which tries out far more possibilities than a person could.
  > Correct: this is how Deep Blue beat Kasparov in 1997.
- [x] Learning, which finds the patterns in data by itself.
  > Correct: this is how a program won at Go twenty years later, through games against itself.
- [ ] Rules written by experts for every single case.
  > Hand-written rules are the built-in knowledge that, according to Sutton, loses in the long run.
- [ ] Hand-designed features, such as edges in an image.
  > In computer vision, such features gave way to neural networks that learn their own.

## Why does Sutton call the lesson “bitter”? {#bl-003}

- [ ] Because AI research gets more expensive and laborious every year.
  > The lesson is not about costs; what is bitter is what it says about the researchers' knowledge.
- [x] Because the researchers' knowledge matters less in the long run than computation.
  > Correct: the knowledge researchers are proud of feels good and helps at first, but is overtaken by the computation that can be thrown at a problem.
- [ ] Because AI systems take people's jobs away.
  > That is a different debate; the essay is about research methods.
- [ ] Because the big breakthroughs of AI all failed.
  > On the contrary: chess, Go, speech recognition and computer vision are successes, only with other methods than expected.

## How did Deep Blue beat the world chess champion Garry Kasparov in 1997, and why does this fit the bitter lesson? {#bl-004}

- [ ] With a model of how grandmasters think, refined by researchers for years.
  > Exactly these researchers were dismayed: it was not their model of human understanding that won.
- [ ] With a neural network that had learned from millions of games against itself.
  > That describes the success at Go twenty years later rather; Deep Blue relied on search.
- [x] With massive search through a great many moves, made possible by computation rather than by a model of human understanding of the game.
  > Correct: search is one of the two methods that grow with computation.
- [ ] With a database in which all possible chess games were stored.
  > All games cannot be stored, there are far too many; Deep Blue searched anew in every position.

## What happened in computer vision, according to Sutton? {#bl-005}

- [ ] Hand-designed features such as edges won against neural networks.
  > It was the other way round; the hand-made features were replaced.
- [ ] Computer vision still works without learning today, because the rules are known.
  > Today's computer vision rests almost entirely on learned neural networks.
- [ ] Images are now translated into words and then processed by language models.
  > That is not Sutton's example; he describes the switch from hand-made to learned features.
- [x] Hand-designed features such as edges gave way to neural networks that learn their own features.
  > Correct: learning from data beat the built-in knowledge of what an image is made of.

## Two teams build a language model. Team A writes many rules about grammar and meaning into it, team B trains a simpler method with far more data and computation. What does the bitter lesson predict? {#bl-006}

- [x] Team A may be ahead at first, but in the long run team B catches up and overtakes it.
  > Correct: methods that grow with data and computation win, as with today's language models.
- [ ] Team A wins for good, because its model really understands language.
  > According to Sutton, built-in knowledge helps at first but is overtaken by methods that scale.
- [ ] Both teams get equally far, because the data is the same.
  > Team B uses far more data and computation, and according to Sutton that is exactly what matters.
- [ ] Neither team gets far, because language cannot be computed.
  > Today's language models show the opposite; the only question is which way goes further.

## What follows from the bitter lesson for AI agents whose workflow is steered by many hand-written rules and step-by-step instructions? {#bl-007}

- [ ] Hand-written rules are the only way to make agents reliable for good.
  > That is exactly the attitude that, according to Sutton, is overtaken by methods that scale in the long run.
- [x] They may work today, but a model trained on good results is likely to catch up with them.
  > Correct: whether this holds everywhere, for instance where nobody can say what a good result is, is an open question.
- [ ] The bitter lesson says nothing about agents, because it is only about chess.
  > Chess is only one of several examples; the lesson concerns every method that builds in knowledge.
- [ ] Agents should work without a language model so that they use no computation.
  > The lesson relies precisely on methods that make use of computation.

## How is the experiment “Word distributions” related to the bitter lesson? {#bl-008}

- [ ] The table of counts is an example of a method that keeps getting better with more text.
  > The table stays almost empty, however much text you put into it; that is exactly why it does not scale.
- [ ] The experiment disproves the bitter lesson, because counting needs no neural network.
  > Counting shows precisely its limits: an empty table, hallucinations, copying.
- [ ] Both are about building grammar rules into a model by hand.
  > Neither the counting model nor Sutton's methods contain grammar rules; both learn from data.
- [x] A table of counts does not scale; only neural networks that learn make use of more data and computation.
  > Correct: learning is one of the two methods that, according to Sutton, grow with computation.
