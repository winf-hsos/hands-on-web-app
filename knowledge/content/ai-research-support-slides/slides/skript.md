# AI as a copilot in empirical research

Script to the deck `ai-as-a-copilot-in-empirical-research.html`, in the order
of the slides. Frame numbers count every build-up step, as in the PDF.

The message of this input fits into one sentence: AI can take on work in
every phase of a study, from advice to the whole step, and what works and
makes sense you decide and check yourself.

## Opening (frames 1–5)

In a cockpit the copilot is fully qualified and flies large parts of the
route, while the captain decides where the plane goes and answers for the
landing. That is the role an AI can take in an empirical study: it can do a
lot, often fast and well, but you set the course and you answer for what ends
up in the paper.

An anonymous poll asks what the audience has used AI for so far: not at all,
explaining a topic, writing and polishing, or code and analysis. Most will
have used a chat app to explain or to polish text, fewer have let it write
code.

## Part 1: kinds of AI (frames 6–9)

**Three kinds of AI (frames 7–9).** "AI" means three rather different things,
which the slide adds one column at a time. Chatbots such as ChatGPT, Claude,
Gemini or Chat AI of the GWDG answer in a chat on almost any topic and work
with what you type or upload. Research tools such as Consensus, Elicit,
SciSpace, Litmaps, Research Rabbit or NotebookLM do one job in research and do
it well, because they work on a database of papers or on your own PDFs. Agents
such as OpenCode, Claude Code or Codex act on their own on almost any task:
they open your files, run programs and use the web until the goal is reached.
The selection follows the overview of AI tools by the university library of
Duisburg-Essen and the tools that a block week on AI as a copilot at
Osnabrück University of Applied Sciences used in each phase of academic
work. Chat AI of the GWDG is free for members of many German universities and
processes data in line with the GDPR, as long as you choose one of its own
models.

## Part 2: the research process (frames 10–14)

**Nine phases of a study (frames 11–12).** Döring (2023, section 1.3.1)
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

**Poll (frames 13–14).** Where could AI take on the most work: finding a
question, the state of research, data analysis or writing the paper? The poll
has no correct answer. It opens the next part, which shows that AI can take
on work in each of these phases, so the question becomes how much of it you
want to hand over.

## Part 3: what is possible (frames 15–35)

**Three levels of AI use (frames 16–18).** The staircase shows three levels,
and the blue bar in each step shows the share of the work done by AI. On the
first level you do the work, and AI explains, suggests and gives feedback. On
the second level AI makes a draft, and you review, change and decide. On the
third level an agent does the whole step, and you check the result. The
levels describe what is possible today, not what is advisable; that question
comes in part 4.

The five slides that follow apply the same staircase to one phase each, with
three build-up steps per slide.

**Research question (frames 19–21).** On level 1 you write the question, and
AI says which columns of the codebook fit. On level 2 AI suggests five
questions for the data, and you pick one and sharpen it. On level 3 an agent
reads codebook and data, picks a question and checks that the data answer it.

**Literature (frames 22–24).** On level 1 AI suggests search terms, and you
search the library and read. On level 2 a research tool such as Elicit or
Consensus finds and summarizes studies, and you read the best ones. On level
3 an agent searches databases in the browser, reads the papers and writes the
state of research.

**Analysis (frames 25–27).** On level 1 you write the R code, and AI explains
errors and functions. On level 2 AI writes the R code, and you run it and
check the numbers. On level 3 an agent writes, runs and fixes the code and
reports the results.

**Figures (frames 28–30).** On level 1 you draw the chart, and AI suggests
what to improve. On level 2 AI writes the ggplot2 code, and you adjust labels
and order. On level 3 an agent draws all charts and puts them into the paper.

**Writing (frames 31–33).** On level 1 you write, and AI gives feedback on
structure and language. On level 2 AI drafts a section from your notes, and
you rewrite it. On level 3 an agent writes the whole paper from data and
sources.

**Poll (frames 34–35).** How far would you go with AI for the analysis in
your paper: no AI, AI advises, AI drafts and I review, or AI does it and I
check? The answers will differ, and that is the point: what is possible is
not yet what works or what makes sense, which is the question of the next
part.

## Part 4: what works (frames 36–42)

**The jagged frontier (frame 37).** In a field experiment at the Boston
Consulting Group, 758 consultants worked on realistic tasks with or without
GPT-4 (Dell'Acqua, Mollick et al., 2023). On tasks inside the frontier of what
the model handles well, the group with AI finished 12.2 percent more tasks,
was 25.1 percent faster and delivered work of more than 40 percent higher
quality. On a similar-looking task just outside the frontier, the group with
AI was 19 percentage points less likely to reach the correct answer. The
image of the jagged frontier comes from this study; Ethan Mollick used it in
Co-Intelligence (2024) and carries it on in Co-Existence (2026). From the
inside you cannot see where the frontier runs, so what looks possible still
has to be checked.

**References that do not exist (frame 38).** Walters and Wilder (2023) had
GPT-3.5 and GPT-4 write short literature reviews on 42 topics and checked all
636 references. With GPT-3.5, 55 percent did not exist at all, with GPT-4 it
was 18 percent, and many of the real ones had wrong authors, years or pages
(43 and 24 percent).

**Made-up references in 2026 (frame 39).** The problem has not gone away with
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

**Quiz (frames 40–42).** An AI names a study that fits perfectly, with a DOI.
The right answer is to open it and read it: a DOI can be made up or lead to a
different paper, asking the AI whether the study is real tells you nothing,
and leaving it out wastes a possibly good source.

## Part 5: you stay the author (frames 43–48)

**Three rules (frames 44–46).** You answer for every sentence, also for what
an AI wrote. You write down what you used AI for and how you checked it. And
nothing personal goes into the chat: no names of respondents and no free-text
answers with personal details, because what you type leaves your computer.

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
- Döring, N. (2023). Forschungsmethoden und Evaluation in den Sozial- und
  Humanwissenschaften (6th ed.). Springer.
  https://doi.org/10.1007/978-3-662-64762-2
- Dell'Acqua, F., McFowland, E., Mollick, E. R. et al. (2023). Navigating the
  jagged technological frontier: Field experimental evidence of the effects
  of AI on knowledge worker productivity and quality. Harvard Business School
  Working Paper 24-013.
  https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4573321
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
