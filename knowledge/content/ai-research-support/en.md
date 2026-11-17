---
title: AI support in empirical research
summary: >-
  Where AI can take on much of the work in the seven steps of a study and
  where you decide, how to ask so that the decision stays with you, what
  studies found about its mistakes, and how to document what you used it
  for.
objectives:
  intro: "In this lesson you learn how to use AI sensibly in an empirical study, and afterwards you can:"
  goals:
    - "say for each step of a study whether an AI can take on much of the work there or whether you decide"
    - "phrase a request to an AI so that it helps without taking the decision away from you"
    - "name for every answer of an AI what you check before you use it"
    - "explain with two studies why convincing answers can be wrong too"
    - "record in a table what you used AI for and how you checked the result"
translation_of: de
based_on: 2026-11-17
---

![Slides: AI as a copilot in empirical research](item:ai-research-support-slides)

In an aircraft cockpit the copilot is fully qualified and flies large parts
of the route, while the captain keeps the command and signs for the flight.
That is the role an AI can take in your study: it can do a lot, often fast
and well, but you set the course and you answer for what ends up in the
paper. This lesson shows where that applies in a study, how to ask and what
to check.

## Seven steps of a study

A study with data that someone has already collected, such as a secondary
analysis of a survey, runs through seven steps. The first three plan it: you
find a **research question**, read what is known about it (**literature**)
and check which **data and columns of the codebook** can answer it. The
other four work with the data: **analysis**, **figures**, **writing** and
**presentation**.

| Step | Who carries the work |
|---|---|
| Research question | you decide, the AI is a sparring partner |
| Literature | the AI takes on much, you check |
| Data and codebook | you decide, the AI is a sparring partner |
| Analysis | the AI takes on much, you check |
| Figures | the AI takes on much, you check |
| Writing | the AI takes on much, you check |
| Presentation | you decide, the AI is a sparring partner |

Where the AI takes on much, such as searching, writing R code, drawing a
chart or polishing a paragraph, your job is checking. Where you decide, on
the question, the choice of data and what you say in front of an audience,
it helps you think at most. Alongside runs housekeeping such as references,
file names and formatting, where an AI saves a lot of time.

## Asking without giving away the decision

How you ask decides whether the AI helps you or decides for you. The five
requests below refer to a survey on milk. Each comes with what you check in
the answer.

**Research question.** The AI knows the codebook only if you give it to it,
and then it is good at matching a question to columns. Ask it to look rather
than to rewrite:

```
here is our research question and the codebook of the survey. which columns
would answer it, and can the data answer it at all? don't change the
question, just tell us what you see.
```

Then check that the columns it names exist in the codebook, that the
question fits data that have already been collected, and that it still asks
what you wanted to know rather than what is easiest to answer.

**Literature.** Ask for search terms and places, not for finished
references:

```
suggest search terms in english and german for studies on the willingness
to pay for organic milk, and name three journals where they appear.
```

With these terms you search the library catalogue and a scholarly database
yourself, open every study and cite only what you have read.

**Analysis.** Writing R code is where an AI helps most:

```
write r code that compares the price from which milk is too expensive
between vegetarians and omnivores, with the median and the number of
respondents in each group.
```

It is also where a mistake is easiest to miss, because wrong code often runs
without an error. Run the code yourself, look at what it filters and how it
treats missing values, and count one group by hand, for example with
`count()`. If the numbers match, you can trust the rest a little more.

**Figures.** An AI masters the craft of a chart: sorting, labelling, colours.
Say in the request what should change and that the data stay as they are:

```
make this bar chart readable: bars sorted by size, labels for people, the
number of respondents in the caption. keep the data as they are.
```

Then check that the chart still answers your question, that bars start at
zero and that the labels say what you mean in your own words.

**Writing.** Ask for feedback rather than for text:

```
read our methods section and list what someone would need to repeat the
analysis. don't rewrite it, only name what is missing.
```

A list of what is missing can be checked point by point, accepted or
rejected. If you do let it rewrite, read every sentence as if you had
written it yourself and watch for claims that appeared without a source.

## Where it goes wrong

Why so much checking? Two studies show that AI goes wrong precisely where its
answers look convincing.

**The jagged frontier.** In a field experiment at the Boston Consulting
Group, 758 consultants worked on realistic tasks, some with GPT-4 and some
without (Dell'Acqua et al., 2023). On tasks the model handles well, inside
the frontier, the group with AI finished 12.2 % more tasks, was 25.1 % faster
and delivered work of more than 40 % higher quality. On a similar-looking
task just outside the frontier, it was 19 percentage points less likely to
reach the correct answer than the group without AI. The frontier is jagged:
tasks that look alike lie on different sides of it, and from the inside you
cannot see on which side you are.

**References that do not exist.** Walters and Wilder (2023) had GPT-3.5 and
GPT-4 write short literature reviews on 42 topics and checked all 636
references. With GPT-3.5, 55 % of the references did not exist at all, with
GPT-4 it was 18 %. Of those that did exist, 43 % and 24 % had wrong details
on authors, year or pages. Newer models and agents that search the web make
such mistakes less often, but the problem has not gone away.

If an AI names a study that fits perfectly, complete with a DOI, open it via
the DOI and read it. A DOI can be made up too or lead to a different
article, and asking the AI whether the study is real does not help, because
it answers just as confidently either way.

## You stay the author

Three rules hold whatever tool you use:

1. You answer for every sentence, including those an AI wrote.
2. You record what you used AI for and how you checked the result.
3. Nothing personal goes into the chat: no names of respondents and no
   free-text answers with personal details, because what you type or upload
   leaves your computer.

For the second rule a table in the appendix of your paper is enough, with
one row per use:

| Tool and model | What for | Section | How checked |
|---|---|---|---|
| agent (model) | R code for figure 2 | results | ran it, counted n by hand |
| chat app (model) | search terms | introduction | searched the library |
| agent (model) | feedback on structure | methods | took 2 of 5 points |

The last column matters most, because it shows that you stayed the author.
If you fill it in as you go, each row takes a minute.

## Takeaways

- In literature, analysis, figures and writing an AI can take on much of the
  work and your job is checking; question, data and presentation are your
  decisions.
- Ask for feedback, search terms or code, and say what the AI should not
  change.
- Convincing answers can be wrong too, so you check every one.
- A reference that looks real is not yet a reference you have read.
- Record in a table what you used AI for and how you checked it.

## Sources

- Dell'Acqua, F. et al. (2023). *Navigating the jagged technological
  frontier: Field experimental evidence of the effects of AI on knowledge
  worker productivity and quality.* Harvard Business School Working Paper
  24-013. [SSRN 4573321](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4573321)
- Walters, W. H. & Wilder, E. I. (2023). Fabrication and errors in the
  bibliographic citations generated by ChatGPT. *Scientific Reports* 13,
  14045. [doi:10.1038/s41598-023-41032-5](https://doi.org/10.1038/s41598-023-41032-5)
