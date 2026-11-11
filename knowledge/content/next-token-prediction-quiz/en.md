---
type: quiz
code: 7461
title: "Quiz: Next-token prediction"
summary: >-
  Ten questions on the lesson Next-token prediction, each answer with its
  reason. The questions come from the pool of the module and are in the format
  of its exam.
level: 2
duration: 15
topics: [language-models]
relations:
  checks: [next-token-prediction]
modules: [aai]
areas: [ai]
questions: [np-001, np-002, np-003, np-004, np-005, np-006, np-007, np-008, np-009, np-010]
status: published
updated: 2026-11-11
---

## What does a language model compute in a single step? {#np-001}

- [ ] The next word, which it planned for the whole answer before writing.
  > The model plans no whole answer in advance; in every step it only sees the text so far.
- [x] A probability for every token in its vocabulary that it comes next.
  > Correct: these probabilities are all the model produces in one step; which token is taken is decided by the program around it.
- [ ] The whole next sentence at once, which is then shown word by word.
  > The answer really is made token by token; every new token needs a pass of its own through the model.
- [ ] Only the single most likely token, without values for the others.
  > The model computes a value for every token; only because of this can temperature, top k and top p make a choice at all.

## Why does a German text usually need more tokens than an English one with the same content? {#np-002}

- [ ] Every umlaut and every ß is always counted as a token of its own.
  > Words with an umlaut can be a single token too; what matters is how frequent a word was in the texts the vocabulary was built from.
- [ ] For German, the model has to send the grammar along as extra tokens.
  > Grammar is not sent along as tokens; the tokens are only the pieces of the text itself.
- [x] The model's vocabulary was built mainly from English text, so German words fall apart into several pieces more often.
  > Correct: frequent words are a single token, and whatever was rare in the texts used for the vocabulary is cut into pieces.
- [ ] A token always stands for exactly one syllable, and German words have more syllables.
  > Tokens do not follow syllables: a frequent word with three syllables can be a single token.

## The program has drawn the next token according to the probabilities of the model. What happens next? {#np-003}

- [x] The token is appended to the context, and the model computes new probabilities from the longer text.
  > Correct: every output becomes input; this is called autoregressive.
- [ ] The model checks the answer so far and replaces earlier tokens that no longer fit.
  > A token once written is never taken back; the model can only continue.
- [ ] The model learns from the drawn token and adjusts its parameters.
  > The parameters do not change while answering; the model only learns during training.
- [ ] The program keeps drawing with the same probabilities until the answer is complete.
  > For every new token the model computes new probabilities, because the context has grown by one token.

## A language model writes something wrong, fluently and confidently. Which explanation follows from next-token prediction? {#np-004}

- [ ] It looked up a wrong source in its database.
  > A language model looks nothing up; it computes probabilities for the next token.
- [ ] It invents something on purpose to appear creative.
  > The model has no intention; tokens are drawn according to the probabilities it computes.
- [ ] The tokenizer cut the question up wrongly, and the model answered a different question.
  > The tokenizer cuts every text in a fixed way; hallucinations arise while the answer is written.
- [x] It writes the most likely continuation, and that is not always the true one.
  > Correct: where the true continuation is also the most plausible, no harm is done; where it is not, a hallucination comes out with the same confidence.

## You ask a chatbot the same question twice and get two different answers. Why? {#np-005}

- [ ] The provider answers every question with a different model.
  > Even a single model on your laptop answers differently as long as the temperature is above 0.
- [x] The next token is drawn at random according to the model's probabilities.
  > Correct: the model and its probabilities stay the same; only which token is drawn differs, and every token changes everything that follows.
- [ ] The model learned from the first answer and answers better the second time.
  > The model learns nothing in the chat; its parameters do not change between two questions.
- [ ] The question is reworded at random before it is sent.
  > The question arrives unchanged; chance lies in drawing the tokens of the answer.

## What does a temperature of 0 do? {#np-006}

- [ ] All tokens become equally likely, and the answer becomes random.
  > That is the direction of high temperatures; at 0 the most likely token always wins.
- [ ] The model does not answer, because no token may be drawn.
  > At 0 the model still writes, only without chance.
- [x] The most likely token is always taken, and the same question gets the same answer every time.
  > Correct: the probabilities become so sharp that the most likely token gets everything.
- [ ] The model writes more creatively, because it prefers rare tokens.
  > At 0 rare tokens get no chance at all; more variety comes from a higher temperature.

## For the next token, the model computes field 41%, barn 22%, yard 9%, shed 6% and less for all others. Which tokens remain with top p = 0.6? {#np-007}

- [ ] only field
  > field alone has 41% and does not yet reach 0.6; a second token is needed.
- [x] field and barn
  > Correct: top p keeps as many of the most likely tokens as needed to reach 0.6 together; 41% and 22% make 63%.
- [ ] field, barn and yard
  > Keeping three tokens is what top k = 3 does; for top p = 0.6, field and barn are already enough.
- [ ] 60% of the tokens
  > p is a share of the probability, not of the tokens; most tokens have almost no probability.

## A chat feels like a conversation with a memory. What actually happens with every new message? {#np-008}

- [ ] The model stores every conversation in its parameters and remembers it.
  > The parameters do not change while answering; a conversation leaves no trace in the model.
- [ ] Only the new message is sent, and the model fills in the rest from its memory.
  > The model has no memory of earlier calls; what is not in the context does not exist for the model.
- [x] The program sends the whole conversation so far to the model again, because it remembers nothing between two calls.
  > Correct: this is why the context grows with every message.
- [ ] The program only sends along the model's last answer, not your own questions.
  > It sends everything: the system prompt, all questions and all answers, marked with tokens for who said what.

## The context is full, and LM Studio is set to Rolling Window. What happens? {#np-009}

- [ ] The model decides itself which messages are unimportant and forgets only those.
  > It is not the model that decides but the program around it, and Rolling Window simply drops the oldest.
- [ ] The answer stops as soon as the window is full.
  > That is the setting Stop at Limit.
- [x] The oldest messages are dropped and no longer exist for the model.
  > Correct: what is dropped is decided by the program around the model, and the model knows nothing about it.
- [ ] The beginning and the latest messages stay, and the middle is cut out.
  > That is the setting Truncate Middle.

## In attention, every token is related to every token before it. The context becomes twice as long. How does the number of cells in the grid change? {#np-010}

- [ ] It stays the same.
  > The grid depends on the length of the context: more tokens mean more rows and more columns.
- [ ] It grows by a quarter.
  > The number of cells grows with the square of the length, so far faster than the length itself.
- [ ] It doubles.
  > That would hold if every token were compared with a fixed number of other tokens; here it is every token before it.
- [x] It becomes four times as large.
  > Correct: the grid has n times n cells, so twice the length gives four times the cells; this is why long contexts are so expensive.
