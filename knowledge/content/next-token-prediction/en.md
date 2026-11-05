---
type: lesson
code: 5317
title: Next-token prediction
summary: >-
  A language model writes one token at a time, and every token it writes
  becomes part of what it reads next: tokens, sampling, the context and its
  limits, and the transformer from far away.
objectives:
  intro: "This lesson shows you the one thing a language model does over and over, and afterwards you can:"
  goals:
    - "explain what a token is and why a model has a fixed vocabulary of them"
    - "describe how a model turns probabilities for the next token into a whole answer, and why a token once written is never revised"
    - "explain why the same question gets different answers and what temperature, top k and top p change"
    - "explain what the context is, why it is limited, and what happens when a conversation grows beyond it"
    - "describe the basic idea of a transformer and of attention"
level: 2
duration: 25
topics: [language-models, representing-meaning]
relations:
  requires: [open-models]
modules: [aai]
areas: [ai]
status: published
updated: 2026-11-05
---

![Slides: Next-token prediction](item:next-token-prediction-slides)

However long and clever the answer of a chatbot is, the model behind it does only one thing over and over: it looks at the text so far and computes, for every possible next piece of text, how likely it is to come next. One piece is chosen and appended, and the whole process starts again with the slightly longer text. These pieces are called **tokens**, the text the model looks at is its **context**, and the architecture that lets it take the whole context into account is the **transformer**. This page answers:

- What is a token, and how many of them does a model know?
- How does a model turn probabilities for the next token into a whole answer?
- Why does the same question get different answers, and what do temperature, top k and top p change?
- What is the context, and why is it limited?
- What is the basic idea of a transformer?

You meet this concept in the experiment [[an-ai-on-your-laptop]], where you change the settings of a local model in LM Studio and watch how its answers change.

## Tokens

A language model does not read letters or words but **tokens**: frequent words, parts of words, single characters and punctuation. Short and common English words are usually one token, while a long or rare word is split into several pieces, so that a word like *unbelievable* may become *un*, *believ* and *able*. In English, a token is on average about three quarters of a word; German and most other languages need more tokens for the same content, because the token lists are dominated by English text.

Every model has a fixed list of tokens, its **vocabulary**. The vocabulary of Gemma 4 E2B, the model used on the slides, has about 262,000 entries, and so does that of Gemma 3. Before the model sees a text, a program called the tokenizer cuts it into tokens and replaces each one by its number in the list, so that the model receives a sequence of numbers. How these numbers come to carry meaning is a concept of its own.

## One token at a time

From the sequence of tokens, the model computes a probability for every token in its vocabulary: how likely it is that this token comes next. After *The farmer drove the tractor into the*, the token *field* might get 41 per cent, *barn* 22 per cent, *yard* 9 per cent, and each of the remaining hundreds of thousands of tokens a tiny share. The numbers in this example are made up, but every real model produces exactly such a list, and this list is all it produces.

To write an answer, the program around the model picks one token from the list, appends it to the text and asks the model again. The model now sees its own token as part of the input and computes the next list. This is called **autoregressive** generation: every output is fed back as input. The loop ends when the model picks a special end token, or when the maximum number of tokens is reached. Each step is one pass through all parameters, which is why the speed of a model is measured in tokens per second.

Two things follow from this. A token, once written, is never revised; the model can only continue, and if it took a wrong turn early, it builds on it. And the model is trained to write the most likely continuation, not the true one. As long as the true continuation is also the most likely, that does no harm, but where it is not, the model writes something fluent and wrong with the same confidence. This is where hallucinations come from.

## Choosing the next token

Which token is taken from the list is not decided by the model but by a few settings, the **sampling parameters**:

- **Temperature** sharpens or flattens the list. At 0, the most likely token is always chosen, and the same question gets the same answer every time. Around 1, the probabilities are used as the model computed them, so the answer varies. Far above 1, unlikely tokens get a real chance, and the text drifts into nonsense.
- **Top k** keeps only the k most likely tokens and draws from them; with top k = 1, the model always takes the first one.
- **Top p** keeps the most likely tokens until their probabilities add up to p, for example 0.95, so that the number of candidates adapts to how sure the model is.
- **Maximum length** stops the loop after a set number of tokens, even in the middle of a sentence.

This is why the same question gets a different answer each time: not because the model changes, but because the next token is drawn, and every drawn token changes everything that follows.

## The context

The **context** is everything the model sees when it computes the next token: the system prompt, the whole conversation so far, any documents you added, and the part of its own answer it has already written. A chat looks like a conversation with a partner who remembers, but the model remembers nothing between two calls. With every new message, the program sends the entire conversation again, written into one long text with special tokens that mark who said what.

## Why the context is limited

The context has a maximum length, the **context window**, counted in tokens: 128K for Gemma 4 E2B and Gemma 3 4B, and 32K for Gemma 3 1B. The K stands for 1,024 here, so 128K are exactly 131,072 tokens, the maximum LM Studio offers when it loads such a model. There are three reasons for the limit. The model has been trained on texts up to a certain length and handles longer ones poorly. Each new token is related to every token before it, so that n tokens make a grid of n × n pairs, and the computing effort grows with the square of the length: twice the context means four times the work. And the program keeps intermediate results for every token in memory, which is why LM Studio needs more RAM when you set a longer context. When a conversation grows beyond the window, the program around the model has to decide what goes: it can stop the answer (*Stop at Limit* in LM Studio), drop the oldest messages (*Rolling Window*), cut out the middle so that the beginning and the latest messages stay (*Truncate Middle*), or replace the old part by a short summary, as agents do. Whatever is dropped no longer exists for the model.

## The transformer, from far away

Almost every language model today is a **transformer**, an architecture published by researchers at Google in 2017. Earlier models read a text word by word and carried along a summary that became blurred the further back a word was. A transformer, by contrast, looks at all tokens of the context at once when it computes the next one, and it learns how much each of them matters for the current step. This mechanism is called **attention**.

An example shows why this matters. In *The tractor did not fit through the gate because it was too wide*, the word *it* means the tractor; if the sentence ends with *too narrow*, it means the gate. To continue such a text correctly, the model has to connect *it* with a word several tokens back, and which word that is depends on a third word. Attention makes such connections possible over thousands of tokens. How it works inside is a topic for later; for now it is enough to know that the whole context flows into the prediction of every single token.

## Try it in LM Studio

All of this can be observed in LM Studio. First switch on the developer mode under Settings → Developer, as shown in [[lm-studio|the page on LM Studio]]: without it, the panel on the right shows neither the temperature nor top k and top p. Then:

- ask the same question three times with temperature 0, and three times with temperature 1;
- set top k to 0, top p to 1 and min p to 0, so that nothing is cut off, and raise the temperature step by step until the answer falls apart;
- tick *Limit Response Length*, set it to 20 tokens and watch where the answer stops;
- load a model with a very short context, paste a long text, ask about its beginning, and repeat this with each strategy under *Context Overflow*: *Rolling Window*, *Truncate Middle* and *Stop at Limit*.

## Further reading

- Ashish Vaswani et al.: [Attention Is All You Need](https://arxiv.org/abs/1706.03762), NeurIPS 2017, the paper that introduced the transformer.
- [Transformer Explainer](https://poloclub.github.io/transformer-explainer/): a small language model in the browser that shows the probabilities for the next token and lets you change the temperature.
- [Next-Token Prediction demo](https://alonsosilva-nexttokenprediction.hf.space/): type the beginning of a sentence and see the probabilities a small language model gives each possible next token.
- [Tiktokenizer](https://tiktokenizer.vercel.app/?model=gpt-3.5-turbo): shows how the tokenizer of gpt-3.5-turbo cuts a text into tokens, with every token coloured and numbered.
- Google DeepMind: [Gemma 4 model card](https://ai.google.dev/gemma/docs/core/model_card_4), with the context length and the vocabulary of Gemma 4 E2B.
- Gemma Team, Google DeepMind: [Gemma 3 Technical Report](https://arxiv.org/abs/2503.19786), 2025, with the context lengths and the vocabulary of the models used in the experiment.
