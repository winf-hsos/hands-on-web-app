---
title: AI support in empirical research
summary: >-
  Which kinds of AI there are for academic work, in which phases of a study
  they can take on work, from advice to the whole step, what of that works
  according to current studies, and how to document what you used them for.
objectives:
  intro: "In this lesson you learn how to use AI sensibly in an empirical study, and afterwards you can:"
  goals:
    - "tell chatbots, specialized research tools and AI agents apart and name examples of each"
    - "name the nine phases of an empirical study according to Döring"
    - "describe three levels of AI use for a phase, from advice to the whole step"
    - "explain with studies why convincing answers can be wrong and why made-up references still occur"
    - "record in a table what you used AI for and how you checked the result"
translation_of: de
based_on: 2026-11-17
---

![Slides: AI as a copilot in empirical research](item:ai-research-support-slides)

In an aircraft cockpit the copilot is fully qualified and flies large parts
of the route, while the captain decides where the plane goes and answers for
the landing. That is the role an AI can take in your study: it can do a lot,
often fast and well, but you set the course and you answer for what ends up
in the paper. This lesson first shows what is possible today and then asks
what of it works and makes sense.

## Three kinds of AI

In academic work, "AI" means three rather different things.

| Kind | What it does | Examples | Works with |
|---|---|---|---|
| **Chatbots** | answer in a chat, on almost any topic | ChatGPT, Claude, Gemini, Chat AI (GWDG), HAWKI (Osnabrück University of Applied Sciences) | what you type or upload |
| **Research tools** | do one job in research and do it well | Consensus, Elicit, SciSpace, Litmaps, Research Rabbit, NotebookLM | a database of papers and your PDFs |
| **Agents** | act on their own, on almost any task | OpenCode, Claude Code, Codex | your files, programs and the web |

Chatbots are the all-rounders: they explain, phrase and write code, but they
only know what you give them, and what they cite from memory may be made up.
Research tools search real literature databases and point to real papers, but
they usually cover only one part of the work, such as finding studies or
reading a PDF. Agents go one step further: they read your files, run code,
control a browser and keep working until the goal is reached (see the lesson
"What is an AI agent").

The following overview shows which tools suit which kind of work. It follows
the list of the university library of Duisburg-Essen and the tools used for
each phase of academic work in the block week "AI as a copilot" at Osnabrück
University of Applied Sciences.

| What for | Tools |
|---|---|
| finding a topic and getting oriented | ChatGPT (Deep Research), Claude, Gemini, Perplexity, Consensus |
| finding and checking literature | Elicit, Consensus, Semantic Scholar, scienceOS, Scite, Research Rabbit, Litmaps |
| understanding papers and organizing knowledge | NotebookLM, SciSpace, Explainpaper |
| analyzing and visualizing data | ChatGPT, Gemini, Julius AI, agents such as Claude Code or OpenCode |
| writing and revising | ChatGPT Canvas, Claude, DeepL Write, Paperpal |

Chat AI of the GWDG is free for members of many German universities and
processes data in line with the GDPR, as long as you choose one of its own
models. At Osnabrück University of Applied Sciences,
[HAWKI](https://hawki.hs-osnabrueck.de) offers such access.

## Nine phases of a study

![The textbook on the research process](item:doering-research-methods)

Döring (2023, section 1.3.1) describes the research process of a quantitative
study in nine phases and gives each of them a chapter of its own. Grouped,
they form three parts:

| Part | Phases |
|---|---|
| plan | 1 research topic · 2 state of research and theoretical background · 3 study design |
| collect data | 4 operationalization · 5 sampling · 6 data collection |
| analyze and report | 7 data preparation · 8 data analysis · 9 presentation of results |

Qualitative studies run through similar phases, but at least in part in a
circle, because the analysis can lead back to data collection. In a secondary
analysis, such as of a survey that someone else has run, others have done
phases 4 to 6, and your study begins with the codebook.

In which of these phases could an AI take on the most work? The question has
no correct answer, because today an AI can take on a lot in every phase. The
real question is how much you want to hand over.

## What is possible: three levels

How much an AI takes on can be described in three levels. The slides show
each level as a timeline on which you, the AI and, on level 3, its tools work
in turn. On level 1 you do
the work, and the AI explains, suggests and gives feedback. On level 2 the AI
makes a draft, and you review, change and decide. On level 3 you give an agent
a goal; it plans, uses its tools and stays in its loop until the goal is
reached, and you check the result. For five phases of a secondary
analysis it looks like this:

| Phase | 1 AI advises | 2 AI drafts, you review | 3 AI does it, you check |
|---|---|---|---|
| research question | you write the question, the AI says which columns of the codebook fit | the AI suggests five questions for the data, you pick one and sharpen it | an agent reads codebook and data, picks a question and checks that the data answer it |
| literature | the AI suggests search terms, you search the library and read | a research tool finds and summarizes studies, you read the best ones | an agent searches databases in the browser, reads the papers and writes the state of research |
| analysis | you write the R code, the AI explains errors and functions | the AI writes the R code, you run it and check the numbers | an agent writes, runs and fixes the code and reports the results |
| figures | you draw the chart, the AI suggests what to improve | the AI writes the ggplot2 code, you adjust labels and order | an agent draws all charts and puts them into the paper |
| writing | you write, the AI gives feedback on structure and language | the AI drafts a section from your notes, you rewrite it | an agent writes the whole paper from data and sources |

Everything in this table is technically possible today. Whether it also works
and whether it makes sense is a different question: how far would you go with
AI for the analysis in your paper?

## What works

**The jagged frontier.** In a field experiment at the Boston Consulting
Group, 758 consultants worked on realistic tasks, some with GPT-4 and some
without (Dell'Acqua, Mollick et al., 2023). On tasks the model handles well,
that is inside the frontier, the group with AI finished 12.2 % more tasks,
was 25.1 % faster and delivered work of more than 40 % higher quality. On a
similar-looking task just outside the frontier, it was 19 percentage points
less likely to reach the correct answer than the group without AI. Ethan
Mollick made the image of the jagged frontier from this study known in
*Co-Intelligence* (2024) and carries it on in *Co-Existence* (2026). The
frontier is jagged, so tasks that look alike lie on different sides of it,
and from the inside you cannot see which side you are on. What looks possible
therefore still has to be checked.

**The frontier moves.** With every generation of models the frontier moves
out and takes in tasks that were outside before: first polishing a text or
explaining an error message, then writing R code and summarizing a paper,
then running a whole analysis or searching the literature as an agent. The
shape stays jagged, though, and some tasks remain in a notch however far the
frontier grows, such as citing only sources that really exist or judging
what matters in a study. This is a simplified picture of the idea, not a
measurement, but it explains why the question is never only whether AI can
do a task in general, but whether this very task lies inside the frontier of
the model you are using.

**References that do not exist.** Walters and Wilder (2023) had GPT-3.5 and
GPT-4 write short literature reviews on 42 topics and checked all 636
references. With GPT-3.5, 55 % of the sources did not exist at all, with
GPT-4 it was 18 %. Of the sources that did exist, 43 % and 24 % had wrong
details on authors, year or pages.

**Made-up references in 2026.** The problem has not gone away with newer
models. Topaz et al. (2026) checked the references of 2.5 million biomedical
papers: in 2023 one paper in 2,828 cited at least one reference that does
not exist, in 2025 one in 458, and in the first seven weeks of 2026 one in
277. Rao, Wong and Callison-Burch (2026) checked 221,000 links that AI
systems gave as sources: of the links from deep research agents, 10.7 % had
never existed, of those from models with web search 4.8 %. Figures for the
newest models are not yet available; the most recent in this study are
GPT-5.1 and Claude Sonnet 4.5, and between 4 and 10 % of their links did not
resolve.

If an AI names a study that fits perfectly, with a DOI, open it through the
DOI and read it. A DOI can be made up too or lead to a different article, and
asking the AI whether the study is real does not help, because it answers
with the same confidence either way.

## You stay the author

Three rules apply, whatever tool and level you work with:

1. You answer for every sentence, also for the one an AI wrote.
2. You record what you used AI for and how you checked the result.
3. You watch for bias: an AI repeats what is frequent in its data, not what
   is true for the people you study. A summary of studies, a coding of
   free-text answers or a description of a group can therefore be skewed;
   ask whom a result leaves out and compare it with your data. Fairness is
   one of the core requirements of the European Commission's ethics
   guidelines for trustworthy AI.

For the second rule, a table in the appendix of your paper is enough, with
one row per use:

| Tool and model | What for | Section | How checked |
|---|---|---|---|
| agent (model) | R code for figure 2 | results | ran it, counted n by hand |
| chatbot (model) | search terms | introduction | searched the library |
| research tool | finding studies | introduction | read every study cited |
| agent (model) | feedback on structure | methods | took 2 of 5 points |

The last column matters most, because it shows that you stayed the author.
Filled in as you go, each row costs a minute.

## Key takeaways

- Chatbots can do almost anything but only know what you give them; research
  tools work on real literature but cover only one part of the work; agents
  do whole steps on their own.
- In each of the nine phases of a study an AI can take on work, from advice
  to the whole step.
- What is possible does not work equally well everywhere, and from the inside
  you cannot see the frontier, so you check every result.
- Made-up references still occur, in AI answers and in published papers;
  cite only what you have opened and read.
- Record in a table what you used AI for and how you checked it.

## Sources

- Universitätsbibliothek Duisburg-Essen (2026). *KI-Tools.*
  [uni-due.de/ub/ki-tools.php](https://www.uni-due.de/ub/ki-tools.php)
- Döring, N. (2023). *Forschungsmethoden und Evaluation in den Sozial- und
  Humanwissenschaften* (6th ed.). Springer.
  [doi:10.1007/978-3-662-64762-2](https://doi.org/10.1007/978-3-662-64762-2)
- Dell'Acqua, F., McFowland, E., Mollick, E. R. et al. (2023). *Navigating
  the jagged technological frontier: Field experimental evidence of the
  effects of AI on knowledge worker productivity and quality.* Harvard
  Business School Working Paper 24-013.
  [SSRN 4573321](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4573321)
- Mollick, E. (2024). *Co-Intelligence: Living and working with AI.*
  Portfolio.
- Mollick, E. (2026). *Co-Existence: The next phase of AI.* Penguin Random
  House.
- Walters, W. H. & Wilder, E. I. (2023). Fabrication and errors in the
  bibliographic citations generated by ChatGPT. *Scientific Reports* 13,
  14045. [doi:10.1038/s41598-023-41032-5](https://doi.org/10.1038/s41598-023-41032-5)
- Topaz, M. et al. (2026). Fabricated citations: an audit across 2.5 million
  biomedical papers. *The Lancet* 407 (10541), 1779–1781.
  [doi:10.1016/S0140-6736(26)00603-3](https://doi.org/10.1016/S0140-6736(26)00603-3)
- Rao, D., Wong, E. & Callison-Burch, C. (2026). *Detecting and correcting
  reference hallucinations in commercial LLMs and deep research agents.*
  arXiv 2604.03173.
  [doi:10.48550/arXiv.2604.03173](https://doi.org/10.48550/arXiv.2604.03173)
- European Commission, High-Level Expert Group on AI (2019). *Ethics
  guidelines for trustworthy AI.*
  [digital-strategy.ec.europa.eu](https://digital-strategy.ec.europa.eu/en/library/ethics-guidelines-trustworthy-ai)
