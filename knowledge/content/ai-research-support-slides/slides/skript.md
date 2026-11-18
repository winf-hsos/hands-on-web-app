# AI as a copilot in empirical research

Script to the deck `ai-as-a-copilot-in-empirical-research.html`, in the order
of the slides. Frame numbers count every build-up step, as in the PDF.

The message of this input fits into one sentence: you only learn what works
by working with AI yourself, because all of us are exploring the jagged
frontier and pushing it out.

## Opening (frames 1–3)

In a cockpit the copilot is fully qualified and flies large parts of the
route, while the captain decides where the plane goes and answers for the
landing. That is the role an AI can take in an empirical study: it can do a
lot, often fast and well, but you set the course and you answer for what ends
up in the paper.

## Part 1: kinds of AI (frames 4–8)

**Three kinds of AI (frames 5–7).** "AI" means three rather different things,
which the slide adds one column at a time, each with a drawing of how it
works. Chatbots answer your questions in a chat window: a question goes in,
an answer comes out, and everything happens in the browser, apart from your
own files. Specialized tools use AI for one specific job and often do it
better than a chatbot: they find studies, read your PDFs with you, draw a
diagram from a text or build slides from an outline. Agents are different in
kind: you give them a goal, not the way, and they reach it on their own. They
plan, act and check what came out, in a loop until the goal is reached, and
to act they use tools, above all your files, programs and the web.

**Tools to try (frame 8).** The same three columns with concrete tools, each
name a link. Chatbots: ChatGPT, Claude, Gemini, Chat AI of the GWDG and HAWKI
of Osnabrück University of Applied Sciences. Specialized tools: Consensus and
Elicit search scientific papers and summarize them, Research Rabbit maps
papers that cite each other, NotebookLM answers questions about your PDFs,
Napkin turns a text into a diagram and Gamma turns an outline into slides.
Agents: Claude Code, Codex, Antigravity by Google (as app, IDE and command
line), OpenCode and Bionic by LM Studio, which runs open models, also on your
own computer. The selection follows
the overview of AI tools by the university library of Duisburg-Essen. Chat AI
of the GWDG is free for members of many German universities and processes
data in line with the GDPR, as long as you choose one of its own models.

## Part 2: the research process (frames 9–10)

**Nine phases of a study (frame 10).** Döring (2023, section 1.3.1)
describes the quantitative research process in nine phases and gives each of
them a chapter: research topic, state of research and theoretical background,
study design, operationalization, sampling, data collection, data
preparation, data analysis and presentation of results. The slide groups them
into three rows: plan, collect data, analyze and report. The middle row only
matters when you collect your own data; in a secondary analysis of a survey,
the people who ran the survey did it for you.

## Part 3: what is possible (frames 11–17)

**Four levels of AI use (frames 12–15).** Each click adds one row, and each
level adds something to the one above it. Every row shows the same places:
your work, a folder; you; and on the right the chat or what comes out. On
level 1 the AI answers questions, as the first chatbots did: you ask in the
chat, get an answer and carry it into your work by hand. On level 2 the AI
also writes documents: from a prompt in the chat it makes a draft of your
methods section, a summary or a table, so it now makes content, but still in
the chat and apart from your work, and you still copy it over. On level 3 the
AI also acts in your files: an agent works inside your folder with your files
and programs. You give it a goal and not the way, it shows you results, you
give feedback, and that goes round in a loop until the result fits. On level 4
the AI also works on its own: the agent runs its own loop, you no longer
appear in the row, and the result goes out without anybody checking it,
perhaps because nobody could follow it any more. In mathematics this has
started: in November 2026 a committee chaired by the physicist David Gross
reviewed an AI proof of the existence half of the Yang-Mills problem, which a
computer had checked in the proof language Lean, and wrote that they did not
claim to fully understand the proof yet. All four levels are possible today;
whether they work and make sense is the question of part 4.

**The four levels at a glance (frame 16).** The same levels as a table: where
the AI works, what your part is, and what each level adds. On levels 1 and 2
the AI works in the chat, and you ask or prompt and carry the answer or the
document over. On level 3 it works in your folder with tools, and your part is
to set the goal and give feedback. On level 4 it works there too, and nobody
checks the result. Level 2 adds documents, level 3 adds tools, your files and
a loop, and level 4 takes the human out of the loop. With every level you hand
over more of the work and see less of it.

**Phases and levels (frame 17).** The nine phases come back, with the four
levels as a legend, and the task is to say which level fits which phase and
which you have used yourself. Some ideas for the discussion: for the research
question, a chatbot can say which columns of the codebook fit, and an agent
can test whether a question can be answered at all, but the more the AI
picks, the more likely the question becomes the one that is easiest to
answer. For the state of research, a specialized tool such as Consensus or
Elicit finds and summarizes studies, but only what you have opened and read
goes into your paper. For the analysis, an agent writes, runs and fixes R
code, and since wrong code often runs without an error, you check what it
filters and count one group by hand. For the presentation, an agent can draw
all charts and even write the paper, and that is where the question of what
makes sense is most pressing, because you answer for every sentence.

## Part 4: what works (frames 18–25)

**The jagged frontier (frame 19).** In a field experiment at the Boston
Consulting Group, 758 consultants worked on realistic tasks with or without
GPT-4 (Dell'Acqua, Mollick et al., 2023). On tasks inside the frontier of what
the model handles well, the group with AI finished 12.2 percent more tasks,
was 25.1 percent faster and delivered work of more than 40 percent higher
quality. On a similar-looking task just outside the frontier, the group with
AI was 19 percentage points less likely to reach the correct answer. The
frontier is the blue shape in the middle and everything around it is outside;
the yellow dot in a notch is a task that looks like those inside but lies
outside. The image of the jagged frontier comes from this study; Ethan
Mollick used it in Co-Intelligence (2024) and carries it on in Co-Existence
(2026). From the inside you cannot see where the frontier runs, so what looks
possible still has to be checked.

**The frontier moves (frames 20–23).** A simplified picture of the idea, not
a measurement. The slide starts with the same frontier, and around it are
tasks from a study. In 2023 polishing a text and explaining an error were
inside. With each step, labeled 2025, 2026 and 2027, the frontier grows, but
it does not simply get bigger: it changes its shape, some corners move far
out, others shift sideways, and the notches move with them. In 2025 writing R
code and summarizing a paper come inside, in 2026 running a whole analysis
and searching the literature; what has just come inside turns yellow. Judging
what matters and citing only real sources are still outside in 2026. The
last step is a hypothesis: some, such as the authors of the scenario AI 2027
or Dario Amodei, the head of Anthropic, expect that around 2027 AI can do
everything humans can, and better. Whether or not that comes true, the
frontier grows and changes its shape, so with every new model you test again
what lies inside.

**References that do not exist (frame 24).** Walters and Wilder (2023) had
GPT-3.5 and GPT-4 write short literature reviews on 42 topics and checked all
636 references. With GPT-3.5, 55 percent did not exist at all, with GPT-4 it
was 18 percent, and many of the real ones had wrong authors, years or pages
(43 and 24 percent).

**Made-up references in 2026 (frame 25).** The problem has not gone away with
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

## Part 5: you stay the author (frames 26–31)

**Three rules (frames 27–29).** You answer for every sentence, also for what
an AI wrote. You write down what you used AI for and how you checked it. And
you watch for bias: an AI learned from texts in which some groups, languages
and views are frequent and others rare, and it repeats that picture, so a
summary of studies, a coding of free-text answers or a description of a group
can be skewed. You ask whom a result might leave out and compare it with your
data. The key term of each rule is highlighted. Fairness is one of the core
requirements in the European Commission's ethics guidelines for trustworthy
AI.

**Write down how you used AI (frame 30).** A table with one row per use
records the tool and model, what it was used for, in which section, and how
the result was checked. The last column is highlighted because it shows that
you stayed the author; filled in as you go, it costs a minute per row and
fits in an appendix.

**Closing (frame 31).** You only learn what works by working with AI yourself,
because all of us are exploring the jagged frontier and pushing it out. The
picture shows an old map with a jagged coastline, and a pen draws it a little
further into the blank paper. No study can tell you where the frontier runs
for your task with your tool; you find out by using AI, checking what comes
out and keeping what works.

## Sources

- Universitätsbibliothek Duisburg-Essen (2026). KI-Tools.
  https://www.uni-due.de/ub/ki-tools.php
- HAWKI, Hochschule Osnabrück. https://hawki.hs-osnabrueck.de
- Napkin. https://www.napkin.ai · Gamma. https://gamma.app
- Google Antigravity. https://antigravity.google · LM Studio Bionic.
  https://lmstudio.ai/bionic
- Döring, N. (2023). Forschungsmethoden und Evaluation in den Sozial- und
  Humanwissenschaften (6th ed.). Springer.
  https://doi.org/10.1007/978-3-662-64762-2
- Science (2026). AI rivals tackle one of physics' deepest mathematical
  challenges. Report on the review of OpenAI's Lean proof of Yang-Mills
  existence; the committee chaired by David Gross: "We do not claim to fully
  understand the proof yet."
  https://www.science.org/content/article/ai-rivals-tackle-one-physics-deepest-mathematical-challenges
- Dell'Acqua, F., McFowland, E., Mollick, E. R. et al. (2023). Navigating the
  jagged technological frontier: Field experimental evidence of the effects
  of AI on knowledge worker productivity and quality. Harvard Business School
  Working Paper 24-013.
  https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4573321
- Mollick, E. (2024). Co-Intelligence: Living and working with AI. Portfolio.
- Mollick, E. (2026). Co-Existence: The next phase of AI. Penguin Random
  House.
- Kokotajlo, D., Alexander, S., Larsen, T., Lifland, E. & Dean, R. (2025).
  AI 2027. https://ai-2027.com
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
