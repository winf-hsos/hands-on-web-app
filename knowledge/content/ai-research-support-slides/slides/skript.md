# AI as a copilot in empirical research

Script to the deck `ai-as-a-copilot-in-empirical-research.html`, in the order
of the slides. Frame numbers count every build-up step, as in the PDF.

The message of this input fits into one sentence: an AI can do much of the
work in almost every step of a study, as long as you decide what is done and
check what comes back.

## Opening (frames 1–5)

In a cockpit the copilot is fully qualified and flies large parts of the
route, while the captain keeps the command and signs for the flight. That is
the role an AI can take in an empirical study: it can do a lot, often fast and
well, but you set the course and you answer for what ends up in the paper.

An anonymous poll asks what the audience has used AI for so far: not at all,
explaining a topic, writing and polishing, or code and analysis. Most will
have used a chat app to explain or to polish text, fewer have let it write
code, and the code part is where checking matters most.

## Part 1: where AI can help (frames 6–9)

**Seven steps of a study (frames 7–9).** A study with data that someone else
has already collected, such as a secondary analysis of a survey, runs through
seven steps in two rows. The first row plans the study: research question,
literature, and the data with their codebook. The second row works with the
data: analysis, figures, writing and presentation. In the last build-up step
the colours show the division of labour. In the blue steps (literature,
analysis, figures, writing) an AI can do much of the work, such as searching,
writing R code, drawing a chart or polishing a paragraph, and your job is to
check it. In the white steps (question, data, presentation) you decide, and
an AI is at best a sparring partner. Alongside all of this runs housekeeping,
such as references, file names and formatting, where an AI saves a lot of
time.

## Part 2: step by step (frames 10–15)

Each of the five slides shows one request as you could type it, on a survey
about milk, and on the right the checks that turn an answer into something
you can use. The requests are written so that the AI helps without taking the
decision away from you.

**Research question (frame 11).** The AI knows the codebook only if you give
it to it, and then it is good at matching a question to columns. The request
asks it to look, not to rewrite, and its last sentence keeps the question
yours. You check that the columns exist, that the question fits data that are
already collected, and that it still asks what you wanted to know rather than
what is easiest to answer.

**Literature (frame 12).** Ask for search terms in English and German and for
journals where such studies appear, not for finished references. Then search
the library catalogue and a scholarly database yourself, open every study and
cite only what you have read.

**Analysis (frame 13).** Writing R code is where AI helps most and where a
mistake is easiest to miss, because wrong code often runs without an error.
Run the code yourself, check what it filters and how it treats missing
values, and count one group by hand to compare.

**Figures (frame 14).** An AI is good at the craft of a chart: sorting,
labelling, colours. The request says what to change and that the data stay as
they are. You check that the chart still answers your question, that bars
start at zero and that the labels are in your words.

**Writing (frame 15).** Ask for feedback rather than for text. A list of what
is missing in your methods section can be checked point by point, accepted or
rejected. If you let an AI rewrite, every sentence must stay yours, and no
claim may appear without a source.

## Part 3: where it goes wrong (frames 16–21)

**The jagged frontier (frame 17).** In a field experiment at the Boston
Consulting Group, 758 consultants worked on realistic tasks with or without
GPT-4 (Dell'Acqua et al., 2023). On tasks inside the frontier of what the
model handles well, the group with AI finished 12.2 percent more tasks, was
25.1 percent faster and delivered work of more than 40 percent higher
quality. On a similar-looking task just outside the frontier, the group with
AI was 19 percentage points less likely to reach the correct answer. Because
tasks that look alike can lie on different sides of the frontier, you check
every answer, the convincing ones too.

**References that do not exist (frame 18).** Walters and Wilder (2023) had
GPT-3.5 and GPT-4 write short literature reviews on 42 topics and checked all
636 references. With GPT-3.5, 55 percent did not exist at all, with GPT-4 it
was 18 percent, and many of the real ones had wrong authors, years or pages
(43 and 24 percent). Newer models and agents that search the web make fewer
such mistakes, but a reference that looks real is still not a reference you
have read.

**Quiz (frames 19–21).** An AI names a study that fits perfectly, with a DOI.
The right answer is to open it and read it: a DOI can be made up or lead to a
different paper, asking the AI whether the study is real tells you nothing,
and leaving it out wastes a possibly good source.

## Part 4: you stay the author (frames 22–27)

**Three rules (frames 23–25).** You answer for every sentence, including what
an AI wrote. You write down what you used AI for and how you checked it. And
nothing personal goes into a chat: no names of respondents and no free-text
answers with personal details, because what you type leaves your computer.

**Write down how you used AI (frame 26).** A table with one row per use
records the tool and model, what it was used for, in which section, and how
the result was checked. The last column shows that you stayed the author;
filled in as you go, it costs a minute per row and fits in an appendix.

**Closing (frame 27).** An AI can do much of the work in almost every step of
a study, as long as you decide what is done and check what comes back.

## Sources

- Dell'Acqua, F. et al. (2023). Navigating the jagged technological frontier:
  Field experimental evidence of the effects of AI on knowledge worker
  productivity and quality. Harvard Business School Working Paper 24-013.
  https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4573321
- Walters, W. H. & Wilder, E. I. (2023). Fabrication and errors in the
  bibliographic citations generated by ChatGPT. Scientific Reports 13, 14045.
  https://doi.org/10.1038/s41598-023-41032-5
