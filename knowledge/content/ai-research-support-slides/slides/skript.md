# AI as a copilot in empirical research

Script to the deck `ai-as-a-copilot-in-empirical-research.html`, in the order
of the slides. Frame numbers count every build-up step, as in the PDF.

The message of this input fits into one sentence: AI can take on work in
every phase of a study, from advice to the whole step, and what works and
makes sense you decide and check yourself.

## Opening (frames 1–3)

In a cockpit the copilot is fully qualified and flies large parts of the
route, while the captain decides where the plane goes and answers for the
landing. That is the role an AI can take in an empirical study: it can do a
lot, often fast and well, but you set the course and you answer for what ends
up in the paper.

## Part 1: kinds of AI (frames 4–7)

**Three kinds of AI (frames 5–7).** "AI" means three rather different things,
which the slide adds one column at a time, each with a small drawing of how
it works and its tools as links. Chatbots such as ChatGPT, Claude, Gemini,
Chat AI of the GWDG or HAWKI of Osnabrück University of Applied Sciences
answer in a chat on almost any topic and work with what you type or upload:
a question, an answer, a follow-up. Research tools such as Consensus, Elicit,
SciSpace, Research Rabbit, Litmaps or NotebookLM do one job in research and
do it well, because they search a database of papers or your own PDFs and
return real studies. Agents such as OpenCode, Claude Code or Codex act on
their own on almost any task: they open your files, run programs and use the
web in a loop until the goal is reached. The selection follows the overview
of AI tools by the university library of Duisburg-Essen and the tools that a
block week on AI as a copilot at Osnabrück University of Applied Sciences
used in each phase of academic work. Chat AI of the GWDG is free for members
of many German universities and processes data in line with the GDPR, as
long as you choose one of its own models.

## Part 2: the research process (frames 8–10)

**Nine phases of a study (frames 9–10).** Döring (2023, section 1.3.1)
describes the quantitative research process in nine phases and gives each of
them a chapter: research topic, state of research and theoretical background,
study design, operationalization, sampling, data collection, data
preparation, data analysis and presentation of results. The slide groups them
into three rows: plan, collect data, analyze and report. Qualitative studies
run through similar phases, but at least in part in a circle, because the
analysis can send you back to collect more data. In the second build-up step
the middle row turns gray: in a secondary analysis of a survey, the people
who ran the survey did these three phases, and your study begins with the
codebook.

## Part 3: what is possible (frames 11–35)

**Three levels of AI use (frames 12–15).** The figure shows three levels as
timelines, one row each, with time running from left to right. White bars
are your work, blue bars the work of the AI, gray bars the tools an agent
uses, and a green bar with a person is the moment you check a result. Each
click plays one level. On level 1 you do the work, ask the AI in between and
go on with its advice. On level 2 you give the AI a task, it makes a draft,
and you review it. On level 3 you give an agent a goal; it plans, uses its
tools, acts again and stays in its loop until the goal is reached, and then
reports back, and you check the result. The levels describe what is possible
today, not what is advisable; that question comes in part 4.

The five slides that follow play the same three levels for one phase each,
with four frames per slide.

**Research question (frames 16–19).** On level 1 you draft a question, the
AI names the columns of the codebook that fit, and you sharpen the question.
On level 2 you hand over the data, the AI suggests five questions, and you
pick one. On level 3 you give a topic, and an agent reads the codebook,
drafts a question, tests it on the data and reports.

**Literature (frames 20–23).** On level 1 you search the library, the AI
suggests search terms, and you read the studies. On level 2 a research tool
finds and summarizes studies on your topic, and you read the best ones. On
level 3 an agent searches databases in the browser, reads the PDFs and writes
the state of research.

**Analysis (frames 24–27).** On level 1 you write the R code, the AI explains
errors, and you run it. On level 2 the AI writes the R code from your task,
and you run it and check the numbers. On level 3 an agent writes the code,
runs into an error (the red bar), fixes it, runs R again and reports the
results.

**Figures (frames 28–31).** On level 1 you draw the chart, and the AI
suggests what to improve. On level 2 the AI writes the ggplot2 code from your
sketch, and you fix the labels. On level 3 an agent plans the charts, draws
them with the data and R and inserts them into the paper.

**Writing (frames 32–35).** On level 1 you write a section, the AI gives
feedback, and you revise it. On level 2 the AI drafts the section from your
notes, and you rewrite it. On level 3 an agent outlines, writes and revises
the paper from your sources and data.

## Part 4: what works (frames 36–42)

**The jagged frontier (frame 37).** In a field experiment at the Boston
Consulting Group, 758 consultants worked on realistic tasks with or without
GPT-4 (Dell'Acqua, Mollick et al., 2023). On tasks inside the frontier of what
the model handles well, the group with AI finished 12.2 percent more tasks,
was 25.1 percent faster and delivered work of more than 40 percent higher
quality. On a similar-looking task just outside the frontier, the group with
AI was 19 percentage points less likely to reach the correct answer. Drawn as
a closed shape, the frontier has an inside and an outside, and the yellow dot
in a notch is a task that looks like those inside but lies outside. The image
of the jagged frontier comes from this study; Ethan Mollick used it in
Co-Intelligence (2024) and carries it on in Co-Existence (2026). From the
inside you cannot see where the frontier runs, so what looks possible still
has to be checked.

**The frontier moves (frames 38–40).** A simplified picture of the idea, not
a measurement. In three steps, labeled 2023, 2025 and 2026, the frontier
grows and takes in tasks that were outside before: polishing a text and
explaining an error first, then writing R code and summarizing a paper, then
running a whole analysis and searching the literature. What has just come
inside turns yellow. The shape stays jagged, though, and two tasks remain in
its notches however far it grows: citing only sources that really exist and
judging what matters in a study. The frontier keeps moving out, but it stays
jagged, so a task can lie outside however easy it looks.

**References that do not exist (frame 41).** Walters and Wilder (2023) had
GPT-3.5 and GPT-4 write short literature reviews on 42 topics and checked all
636 references. With GPT-3.5, 55 percent did not exist at all, with GPT-4 it
was 18 percent, and many of the real ones had wrong authors, years or pages
(43 and 24 percent).

**Made-up references in 2026 (frame 42).** The problem has not gone away with
newer models. Topaz et al. (2026) checked the references of 2.5 million
biomedical papers: in 2023 one paper in 2,828 cited at least one reference
that does not exist, in 2025 one in 458, and in the first seven weeks of 2026
one in 277. Rao, Wong and Callison-Burch (2026) checked 221,000 links that AI
systems gave as sources: of the links from deep research agents, 10.7 percent
had never existed, of those from models with web search 4.8 percent. Studies
with figures for the newest models are not yet available; the most recent
models in this study are GPT-5.1 and Claude Sonnet 4.5, and between 4 and 10
percent of the links they gave did not resolve. Made-up references still turn
up, in AI answers and in published papers, so you open every one you cite.

## Part 5: you stay the author (frames 43–48)

**Three rules (frames 44–46).** You answer for every sentence, also for what
an AI wrote. You write down what you used AI for and how you checked it. And
you watch for bias: an AI learned from texts in which some groups, languages
and views are frequent and others rare, and it repeats that picture, so a
summary of studies, a coding of free-text answers or a description of a group
can be skewed. You ask whom a result might leave out and compare it with your
data. Fairness is one of the core requirements in the European Commission's
ethics guidelines for trustworthy AI.

**Write down how you used AI (frame 47).** A table with one row per use
records the tool and model, what it was used for, in which section, and how
the result was checked. The last column is highlighted because it shows that
you stayed the author; filled in as you go, it costs a minute per row and
fits in an appendix.

**Closing (frame 48).** AI can take on work in every phase of a study, from
advice to the whole step, and what works and makes sense you decide and check
yourself.

## Sources

- Universitätsbibliothek Duisburg-Essen (2026). KI-Tools.
  https://www.uni-due.de/ub/ki-tools.php
- HAWKI, Hochschule Osnabrück. https://hawki.hs-osnabrueck.de
- Döring, N. (2023). Forschungsmethoden und Evaluation in den Sozial- und
  Humanwissenschaften (6th ed.). Springer.
  https://doi.org/10.1007/978-3-662-64762-2
- Dell'Acqua, F., McFowland, E., Mollick, E. R. et al. (2023). Navigating the
  jagged technological frontier: Field experimental evidence of the effects
  of AI on knowledge worker productivity and quality. Harvard Business School
  Working Paper 24-013.
  https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4573321
- Mollick, E. (2024). Co-Intelligence: Living and working with AI. Portfolio.
- Mollick, E. (2026). Co-Existence: The next phase of AI. Penguin Random
  House.
- Walters, W. H. & Wilder, E. I. (2023). Fabrication and errors in the
  bibliographic citations generated by ChatGPT. Scientific Reports 13, 14045.
  https://doi.org/10.1038/s41598-023-41032-5
- Topaz, M. et al. (2026). Fabricated citations: an audit across 2.5 million
  biomedical papers. The Lancet 407 (10541), 1779–1781.
  https://doi.org/10.1016/S0140-6736(26)00603-3
- Rao, D., Wong, E. & Callison-Burch, C. (2026). Detecting and correcting
  reference hallucinations in commercial LLMs and deep research agents.
  arXiv 2604.03173. https://doi.org/10.48550/arXiv.2604.03173
- European Commission, High-Level Expert Group on AI (2019). Ethics
  guidelines for trustworthy AI.
  https://digital-strategy.ec.europa.eu/en/library/ethics-guidelines-trustworthy-ai
