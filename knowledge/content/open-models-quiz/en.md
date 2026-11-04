---
type: quiz
code: 2148
title: "Quiz: Open models"
summary: >-
  Six questions on the lesson Open models, each answer with its reason. The
  questions come from the pool of the module and are in the format of its
  exam.
level: 1
duration: 12
topics: [language-models]
relations:
  checks: [open-models]
modules: [aai]
areas: [ai]
status: published
updated: 2026-11-04
---

## You turn off wi-fi, and the model in LM Studio still answers. What follows from this? {#om-001}

- [x] The whole model is stored on the laptop as a file and is computed by its processor or graphics card.
  > Correct: everything the model can do lies in the file with its parameters; nothing else is needed to answer.
- [ ] LM Studio caches earlier answers from the internet and replays them while offline.
  > The model generates every answer anew, token by token; it also answers questions offline that were never asked before.
- [ ] The model answers from a small database of texts that was installed with LM Studio.
  > A language model holds no texts to look up, but numbers from which it generates new text.
- [ ] The model sends the questions once the connection is back and shows provisional answers until then.
  > A local model sends nothing anywhere; the answer it gives offline is already the final one.

## A model has 8 billion parameters, each stored with 4 bits. About how big is the file? {#om-002}

- [x] 4 GB
  > Correct: 8 billion times 4 bits is 32 billion bits, which is 4 billion bytes.
- [ ] 8 GB
  > That would be 8 bits, one byte per parameter. With 4 bits each parameter needs only half a byte.
- [ ] 32 GB
  > This confuses bits and bytes: 32 billion bits are 4 billion bytes, not 32.
- [ ] 16 GB
  > That corresponds to 16 bits per parameter, the unrounded storage; quantized to 4 bits it is a quarter of that.

## On the same laptop, Gemma 3 4B answers noticeably more slowly than Gemma 3 1B. Why? {#om-003}

- [x] Every token passes through all parameters, and the 4B model has four times as many.
  > Correct: more numbers per token mean more computation per token and therefore fewer tokens per second.
- [ ] The larger model searches a larger database of texts for every answer.
  > A model does not search stored texts; it computes every token from its parameters.
- [ ] The larger model writes longer answers because it knows more.
  > Longer answers take longer in total but do not change the tokens per second, and those are lower for the larger model.
- [ ] The larger model checks every answer on the internet before showing it.
  > Both models run offline; neither checks anything on the internet.

## Which statements about open models are correct? {#om-004}

- [x] Their weights can be downloaded and run on your own hardware.
  > Correct: this is exactly what makes a model open.
- [ ] Their training data is always published along with the weights.
  > Open weights are not open source; the training data usually stays secret, and only a few models such as Olmo publish it.
- [x] They can be adapted, for example fine-tuned on your own data.
  > Correct: whoever has the weights can change them further.
- [x] They may come with licences that restrict some uses.
  > Correct: open does not mean without conditions; some licences limit commercial use, for example.
- [ ] They cannot be used inside an agent.
  > A harness can talk to any model, including a local open one.

## In which situation is a local open model the most sensible choice? {#om-005}

- [x] A veterinary practice wants to summarise treatment notes that must not leave the practice.
  > Correct: when the data must not leave the building, a local model is often the only way.
- [ ] A student wants the best possible answer to a difficult research question on a slow laptop.
  > A model that runs on a slow laptop is small; for the best possible answer a large model in the cloud does better.
- [ ] A start-up wants to try out many different models quickly without buying hardware.
  > Without hardware of its own there is nothing to run models on locally; cloud services are simpler here.
- [ ] A marketing team needs current competitor prices from the web.
  > A local model only knows what lies in its parameters; current prices need a web search.

## What does it mean to quantize a model? {#om-006}

- [x] Storing the parameters with fewer bits, which makes the file smaller and costs a little quality.
  > Correct: the numbers are rounded so that the model fits into memory.
- [ ] Removing rarely used words from the vocabulary so that the model gets faster.
  > The vocabulary stays the same; it is the numbers that are quantized, not the words.
- [ ] Splitting the model into parts that run on several computers.
  > That would be distributing the model; the number of bits per parameter would stay the same.
- [ ] Training the model a second time on less data.
  > Quantization changes a finished model without training it again.
