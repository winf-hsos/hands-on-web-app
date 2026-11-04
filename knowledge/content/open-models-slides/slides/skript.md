# Open Models

Script for the deck *Open Models*, which guides through the experiment “An AI
on Your Laptop”, in the order of the slides. Before the session, everyone has
installed LM Studio and downloaded Gemma 3 1B and Gemma 3 4B; the instructions,
the notes sheet and the concept page are on the course website.

## Opening

So far, every model we used ran somewhere in a data centre. This time we bring
one onto our own laptops and look at what it actually is. No internet, and it
still answers.

## What do you think?

Two questions to see what we expect. **Where does the model run when you chat
with ChatGPT?** In a data centre; the app is only the window. **How big is a
language model that runs on a laptop?** We vote, but the answer waits until
everyone has found the file on their own computer.

## Offline

**Step 1, switch it off.** Turn off wi-fi, load Gemma 3 1B in LM Studio and ask
it what nitrogen fertiliser does for a wheat plant, in two sentences. It
answers without the internet, and the fan starts to run, because the laptop is
now doing the work itself.

**Step 2, find the file.** In LM Studio, “my models” shows the folder. The file
is the whole model: about 0.75 GB for Gemma 3 1B and 2.4 GB for Gemma 3 4B. Its
name already tells us the model, its size, the format and how strongly it was
rounded.

**Step 3, three questions, two models.** The same three questions go to the
small and then to the larger model: a calculation (4.5 ha at 140 kg of nitrogen
per hectare, which is 630 kg), a question of knowledge (the capital of Lower
Saxony) and a translation. Below each answer, LM Studio shows the tokens per
second; we collect them in a poll, and the spread shows how much the experience
depends on the hardware.

**1B or 4B?** Together we fill in the comparison: the smaller model is faster,
and it is more likely to miscalculate or to invent something with confidence,
while both usually manage the translation.

**If a model like GPT-6.1 Sol lay on your laptop, how big would the file be?**
Several terabytes. The provider does not publish the size, so the answer is an
estimate from open models of the same class: DeepSeek V4 Pro has about 1.6
trillion parameters, which is about 1.6 TB at 8 bits per number and more than
3 TB at 16 bits; even at 4 bits it would still be about 0.8 TB. Such a model
would fit on no laptop, neither on the disk nor in the memory.

## What a model is

**A file full of numbers.** A language model is neither a program with rules nor
a database of texts, but a very long list of numbers, about four billion for
Gemma 3 4B. They are called parameters or weights; how they come about is the
topic of neural networks and of training.

**How many values fit into a few bits?** One bit can hold two values, two bits
four, four bits sixteen, and sixteen bits 65,536. Every extra bit doubles the
number of values a weight can take.

**Rounding one weight.** Take a weight of 0.8710. With 16 bits, the nearest value
the file can store lies practically on top of it. With 4 bits there are only 16
allowed values between −1 and +1, and the weight becomes 0.867. With only three
values, −1, 0 and +1, it becomes 1; such models exist and are trained this way
from the start. With a single bit, only the sign is left.

**Four weights, rounded.** The left column shows what 16 bits store of four
learned weights. With 4 bits, the weights stay close to the original
and the model behaves almost as before. The values look precise, but they
are only the 16 points of a fixed grid between −1 and +1, spaced 2/15 apart,
which the number line above the table shows. The file does not store 0.067
but only the number of the point, here 1000; the decimal is what this number
stands for. With three values, two of the four
weights become zero. Binary, with a single bit, only the sign is left: 0.0213
and 0.8710 both become 1, and the difference between almost nothing and a lot
is gone. The coarser the rounding, the smaller the file, and the
further the model drifts from what it learned.

**Why 2.4 GB?** Four billion numbers at 16 bits each would be 8 GB. Stored with
about 4.5 bits per number, they need only 2.4 GB. Rounding the numbers like this
is called quantization; it costs a little quality and saves a lot of space.

**Rounding costs less than shrinking.** Measurements from llama.cpp on LLaMA 7B
and 13B show the error of the model (perplexity, lower is better) against the
size of the file. Going from 16 to 8 bits changes practically nothing, and only
at 4 bits does the error rise a little. The 13B model at 4 bits needs 7.6 GB,
less than the 7B model at 16 bits with 13 GB, and it is still the better model.
Dettmers and Zettlemoyer measured this systematically for many models: for the
same memory, 4 bits is almost always the best choice. It is better to round a
large model coarsely than to store a small one finely.

**What happens when you press enter.** The file is loaded once into memory, the
RAM or the memory of the graphics card. Every new token then passes through all
the numbers once, and again for the next one. That is why bigger models are
slower: every token passes through more numbers.

**How big is big?** On a logarithmic scale: Gemma 3 1B and 4B on the laptop,
Gemma 3 27B, and DeepSeek V4 Pro with about 1,600 billion parameters. The
providers of the closed top models behind GPT, Claude and Gemini do not publish
the size.

**Local and cloud.** The same harness can talk to a model on your laptop: an
agent can use a local model instead of one in the cloud, with all consequences
for quality and speed (see also: the harness).

## Open or closed

**Open weights, closed weights.** An open model can be downloaded, run and
changed: Gemma, Qwen, Llama, Mistral, DeepSeek or gpt-oss. A closed model can
only be used as a service: GPT, Claude, Gemini. Open weights is not the same as
open source, because the training data usually stays secret; fully open models
such as Olmo publish data and training code as well.

**Would you paste a farm's customer list into a cloud chatbot?** There is no
right answer; the distribution opens the conversation about personal data,
contracts and when a local model is worth it.

**When local makes sense.** Your data must not leave the building, you need it
offline in a barn, on a tractor or on your phone, or you use it so much that tokens get
expensive. On a phone, Google's app AI Edge Gallery runs small Gemma models
offline on Android and iOS. In return, you accept a smaller, slower model, and you have to keep
the hardware and the model up to date yourself.

## Key takeaway and discussion

A language model is a file full of numbers that runs on your own laptop without
the internet; its size decides how good, how fast and how hungry it is.

Discuss: What surprised you about the size, speed or quality of the local
model? Which data would you trust a local model with, but not a cloud service?
When should a farm or a food company run its own model instead of renting one?
Everyone writes first, then the group talks.
