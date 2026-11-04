# Next-Token Prediction

Script for the deck *Next-Token Prediction*, in the order of the slides. It
fits best right after the experiment “An AI on Your Laptop”, while LM Studio
is still open on every laptop; the concept page on the course website explains
the same ideas in more detail.

## Opening

Every answer of a language model is written one token at a time. In the
experiment you measured how many tokens per second your laptop manages; this
deck looks at what a token is and at what happens in each of these steps.

## Tokens

**A token is a piece of text.** The model does not see letters but numbers
from a fixed list. A program called the tokenizer cuts the text into pieces
and replaces each piece by its number. Frequent words are a single token,
often together with the space in front of them. The split and the numbers on
the slide are for illustration.

**Rare words fall apart.** A rare word is split into several pieces, and
German technical terms are split into particularly many. In English, a token
is on average about three quarters of a word; German needs more tokens for the
same content, because the list was built mainly from English text. Tiktokenizer
(tiktokenizer.vercel.app, set to gpt-3.5-turbo) shows how a real tokenizer
cuts a sentence, with every token coloured and numbered.

**The vocabulary.** Gemma 4 E2B knows about 262,000 tokens, and everything the
model writes is put together from them. How these numbers come to carry
meaning is a topic of its own.

## One at a time

**Quick quiz:** in one step, what does the model compute? Not the next word
and not the whole answer, but a probability for every token in its
vocabulary.

**The field, the barn or the yard?** After *the farmer drove the tractor into
the*, the token *field* might get 41 per cent, *barn* 22 per cent, and every
other token in the vocabulary a small share. The numbers are made up, but this list is
all a model produces; the answer only comes about when a program draws a token
from it. The next-token prediction demo at
alonsosilva-nexttokenprediction.hf.space shows the real list of a small model
for any beginning of a sentence you type.

**The loop.** The drawn token is appended to the context, and the model
computes the next list from the slightly longer text. This is called
autoregressive generation: every output becomes input. When does it stop? The
slide leaves the question open; the loop ends when the model picks a special
end token, or when the maximum length is reached, even in the middle of a
sentence. Every round is one
pass through all parameters, which is why speed is measured in tokens per
second.

**Fluent is not the same as true.** The model writes the most likely
continuation, which is not always the true one; strictly speaking, it only
always takes the most likely token at temperature 0, otherwise a token is
drawn, as the next part shows. A token, once written, is
never taken back, so a wrong turn early on is built upon. Where the truth is
also the most plausible continuation, this does no harm; where it is not, the
model writes something fluent and wrong with the same confidence, and this is
where hallucinations come from.

## Choosing

**Quick quiz:** why do you get two different answers to the same question?
The model does not change between two questions, and it learns nothing in the
chat. The next token is drawn from the list, and every drawn token changes
everything that follows.

**Temperature** makes the list sharper or flatter. At 0, the most likely
token is always taken, so the answer is always the same. At 1, the list is
used as the model computed it. At 2, the many unlikely tokens together take
almost everything, and the text drifts into nonsense. The slide calculates
this with a thousand remaining tokens; with 262,000, the effect would be even
stronger. The Transformer Explainer in the browser shows this live
for a small real model, with a slider for the temperature.

**Top k and top p** cut off the tail of the list before a token is drawn. Top
k keeps the k most likely tokens; top p keeps as many as needed until their
probabilities add up to p, here *field* and *barn* with 63 per cent. When the
model is sure, few candidates remain, and when it is unsure, many. The
Transformer Explainer lets you set top k and top p and shows which candidates
remain.

**Turn the dial.** In LM Studio, switch to developer mode to see all settings.
Ask the same question three times at temperature 0 and three times at
temperature 1. Then switch off the filters with top k = 0, top p = 1 and
min p = 0, because by default they cut off the tail of the list and keep
the answer sensible even at a high temperature, and raise the temperature step
by step until the answer falls apart. The model stays the same throughout; only the way a token is drawn
from the list changes.

## The context

**Everything it sees.** The context is everything the model sees when it
computes the next token: the system prompt, the conversation so far, any
document you added and the answer so far. The stack of cards in “Be the
Agent” was exactly this. A chat feels like talking to someone with a memory,
but the model remembers nothing between two calls; the program sends the
whole conversation again with every message.

**Quick quiz:** how many tokens fit into the context of Gemma 4 E2B? 131,072,
which model cards write as 128K, because the K stands for 1,024 here; the
same holds for Gemma 3 4B, while Gemma 3 1B manages 32K, that is 32,768, and large models in the cloud reach a million and
more.

**Why there is a limit.** The model was trained on texts up to a certain
length, every new token is related to every token before it, and every token
in the context needs memory. More context therefore means more computation
and more RAM, which LM Studio shows when a model is loaded. When the context
is full, something has to go.

**When the context is full**, the program around the model decides what is
dropped, not the model itself. It can stop the answer when the window is full
(stop at limit), drop the oldest messages (rolling window), cut out the middle
so that the beginning and the latest messages stay (truncate middle), or replace the old part by a short
summary, as agents like Claude Code do. Whatever is dropped no longer exists
for the model. In LM Studio, the setting is called Context Overflow and offers Rolling
Window, Truncate Middle and Stop at Limit: load Gemma
4 E2B with a very short context length, paste a long text, ask about its first
paragraph, then switch the strategy and ask again.

## The transformer

**The tractor or the gate?** In *the tractor did not fit through the gate
because it was too wide*, *it* means the tractor; if the sentence ends with
*too narrow*, it means the gate. Earlier models read word by word and carried
along a summary that grew blurred towards the beginning. A transformer, the
architecture published by Vaswani and colleagues in 2017, looks at all tokens
of the context at once in every step and learns which of them matter right
now. This is called attention, and how it computes is a topic of its own.

**Every token with every token.** A matrix with one row and one column per
word, words standing in for tokens, shows how strongly each word draws on each
other one; what the connection means is left open, and the strengths are for
illustration. The row of *it* draws most strongly on *tractor*. The upper half
stays empty, because a token only looks at the tokens before it, but the grid
is still n × n: 13 tokens give 169 cells, 1,000 tokens a million, and 131,072
tokens over 17 billion, in every layer of the model. Twice the context means
four times the cells, which is why long contexts are so expensive.

**Key takeaway:** a language model writes one token at a time, and the whole
context flows into the prediction of every single one.
