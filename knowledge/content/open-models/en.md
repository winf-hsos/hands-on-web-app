---
type: lesson
code: 2596
title: Open models
summary: >-
  A language model is a file full of numbers, and some of these files you can
  download: what is inside, why its size decides how good, fast and hungry it
  is, and when it is worth running one yourself.
objectives:
  intro: "This lesson shows you what a language model is as a file on your disk, and afterwards you can:"
  goals:
    - "explain that a language model is a file of parameters and why it is so big"
    - "work out the size of a model from its number of parameters and the bits per parameter, and explain what quantization trades for a smaller file"
    - "describe what happens on your computer when a local model answers, and why a bigger model is slower"
    - "tell open from closed models and open weights from open source"
    - "weigh when it is worth running a model yourself instead of using one in the cloud"
level: 1
duration: 20
topics: [language-models]
relations:
  see_also: [next-token-prediction, ai-agents]
modules: [aai]
areas: [ai]
status: draft
updated: 2026-11-04
---

![Slides: Open models](item:open-models-slides)

The model behind a chatbot is not a program with rules and not a database of texts, but a file with billions of numbers. Some providers publish these files, and with a free program such as LM Studio they run on an ordinary laptop, even without the internet. How big the file is decides how good the model is, how fast it answers and how much memory it needs. This page answers:

- What is inside a language model, and why is it so big?
- What happens on your computer when a local model answers?
- What is the difference between an open and a closed model?
- When is it worth running a model yourself instead of using one in the cloud?

You meet this concept in the experiment here, where you switch off the internet and compare a small and a larger version of the same model.

![Experiment: An AI on your laptop](item:an-ai-on-your-laptop)

## A file full of numbers

A language model consists of a very long list of numbers called **parameters** or **weights**. Gemma 3 4B has about four billion of them, and the largest open models have well over a thousand billion. The numbers are the result of training: they encode, in a form no human can read directly, what the model has picked up about language and the world. Everything the model can do lies in these numbers, and nothing else is needed to run it.

## Why the file has the size it has

Each number needs some bits of storage, and the number of bits decides how many different values a number can take: one bit allows two values, four bits sixteen, sixteen bits 65,536. With 16 bits per number, four billion parameters take 8 GB. To make models fit into the memory of a laptop, the numbers are rounded to fewer allowed values and stored with fewer bits, often around four. This is called **quantization**.

Take a weight of 0.8710. With 16 bits it is stored almost exactly. With 4 bits, and in a simplified picture with 16 evenly spaced values between −1 and +1, it becomes 0.867, close enough that the model behaves almost as before. The file does not store 0.867 itself but only which of the 16 values it is, a number from 0 to 15 that fits into four bits; real files also store a scale factor for every small block of weights, which stretches the 16 values to fit that block and is why they need about 4.5 bits per weight on average. With only three values, −1, 0 and +1, it becomes 1, and a weight of 0.3302 becomes 0. The coarser the rounding, the smaller the file and the further the model drifts from what it learned. Gemma 3 4B with about four bits per number shrinks from 8 GB to about 2.4 GB. The name of a model file usually says how strongly it was rounded, for example `Q4` for about four bits per number.

Surprisingly, rounding costs much less than shrinking. Measurements with LLaMA show that going from 16 to 8 bits changes practically nothing, and that a 13-billion-parameter model rounded to 4 bits (7.6 GB) is better than a 7-billion-parameter model stored with 16 bits (13 GB). For the same amount of memory, a larger model with 4 bits is almost always the better choice.

## What happens when you press enter

Running a model is called **inference**, as opposed to training it, and how the model produces an answer token by token is explained in [[next-token-prediction]]. The program loads the file once into memory, into the RAM or into the memory of the graphics card. Then it produces the answer token by token, and every new token requires one pass through all the parameters. That is why a bigger model is slower: every token passes through more numbers. How many tokens per second you get depends on the size of the model and on your hardware, and a graphics card or a recent Apple chip makes a large difference.

## Open and closed

An **open model** is one whose weights you can download, run and change, such as Gemma, Qwen, Llama, Mistral, DeepSeek or gpt-oss. A **closed model** such as GPT, Claude or Gemini can only be used as a service over the internet; its weights stay with the provider, and so does its size. Open weights are not the same as open source: the training data and the code used for training usually stay secret, and only a few fully open models, such as Olmo, publish them as well. Open models also come with licences that differ in what they allow, for example for commercial use.

## When local makes sense

A model on your own computer keeps your data with you, works offline and costs nothing per token. In return, it is much smaller than the top models in the cloud, it is slower on ordinary hardware, and you have to keep hardware and model up to date yourself. Running a model locally is therefore worth it when the data must not leave the building, when there is no reliable connection, or when a model is used so often that the cost of a service adds up. Small models even run on a phone: Google's app [AI Edge Gallery](https://github.com/google-ai-edge/gallery) runs small Gemma models offline on Android and iOS. The same agent can work with either, because the harness sends its context to whichever model it is connected to ([[ai-agents]]).

![Quiz: Open models](item:open-models-quiz)

## Further reading

- [LM Studio](https://lmstudio.ai): the free program used in the experiment, with a catalogue of open models and their sizes.
- Google: [Gemma 3](https://lmstudio.ai/models/gemma-3) in the LM Studio catalogue, with all sizes from 270 million to 27 billion parameters.
- Tim Dettmers and Luke Zettlemoyer: [The case for 4-bit precision: k-bit Inference Scaling Laws](https://arxiv.org/abs/2212.09720), ICML 2023.
- Rich Sutton: [The Bitter Lesson](http://www.incompleteideas.net/IncIdeas/BitterLesson.html), 2019, on why models keep growing.
