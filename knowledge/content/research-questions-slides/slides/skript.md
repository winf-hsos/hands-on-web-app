# What is a research question?

The text to the slides, in their order. Frame numbers count every build-up
step, as in the PDF.

**A dark archive (frame 3).** The survey on milk and chocolate has 606
columns and holds answers to hundreds of questions, but none of them is yours
yet. Whoever looks into it without a question finds patterns that are there by
chance and cannot say in the end what the work has found out. A data set
answers nothing by itself, until a question tells you which shelf to light up.
The sentence to take home is that a good research question can be answered
with evidence, says something about how the world works, and fits the data you
actually have.

## Part 1: from topic to question

**Topic, problem, question (frames 5 to 7).** A topic only names a subject,
such as plant-based milk. The research problem says which insight you want to
gain about which aspect of it, for example how the price affects whether
people choose oat milk over cow's milk. The question turns this into something
that data can answer: how does purchase certainty for alpro oat drink change
when its price rises from 1.79 to 2.09 euros? The most common mistake of
beginners is to stop at the topic, because a topic sounds like a plan but
tells you nothing about what to compute. The steps follow Döring,
*Forschungsmethoden und Evaluation* (2023), p. 148.

**Two conditions (frames 8 to 10).** Huntington-Klein (*The Effect*, chapter
2) asks two things of a research question: there must be evidence that can
answer it, and the answer must tell us something about how the world works.
"Which milk ad is the best?" fails the first condition, because nothing says
what "best" means, so no evidence can decide it. "How many respondents live in
Lower Saxony?" passes the first and fails the second: the column `q003land`
answers it, but the number teaches us nothing about behaviour. "Do
respondents who care about the environment buy a larger share of organic
food?" meets both, and the survey has a column for each part
(`p030green_5umweltbewusst`, `v032bioanteil`). A useful test is whether an
unexpected result would change your mind; if it would not, the question is not
yet a research question.

**Quick poll: which of these is a research question? (frames 11 to 13).**
Only "do vegans buy more organic?" is a question that evidence can answer: it
names a group, an outcome and a comparison, and the survey holds both the diet
(`V041nofleischf`) and the share of organic food (`v032bioanteil`).
"Sustainability and milk" is a topic, "milk is too cheap" is a judgement, and
"analyse the milk survey" is a task.

**Question or hypothesis (frame 14).** A research question is open: it asks,
often with a w-word such as how, which or who, and it fits a field in which
there is not yet enough prior knowledge for a firm expectation, for example
"which shops do vegans use for their food?". A hypothesis is a claim with a
direction, such as "respondents over 60 buy a larger share of organic food
than respondents under 30", and it is not a hunch: it has to rest on theory or
on earlier findings, which you cite. For the analysis of a survey that is
already collected, the open question is the normal case (after Döring 2023,
pp. 149–152).

## Part 2: what makes a good one

**Three kinds of questions (frames 16 to 19).** What you may claim at the end
depends on the kind of question. A descriptive question counts and
summarises: what share of the respondents shops at a discounter? In the
survey, 73 percent name the discounter (`v008ort_1discount`). A relational
question compares groups or asks whether two things go together: do people in
big cities shop online more often? Of those in big cities 9 percent shop for
food online, of those in villages 1 percent (`d044stadt`,
`v008ort_9online`). A causal question asks what happens when one thing
changes, for example whether a higher price lowers purchase certainty for
alpro oat drink, and it needs a design that separates the cause from
everything that goes along with it. Describing and comparing works with any
survey, while a cause can only be claimed where the data allow it; in this
survey the price experiment is such a place (`ad015p1reaktion4`,
`U015p1reaktion4_3alpro`).

**A checklist (frames 20 to 24).** Huntington-Klein (*The Effect*, 2.4) gives
five questions to ask of your own question before you start to compute. Would
every possible answer teach you something, or only the one you hope for? Do
the data contain what you need? Can you answer it in the time you have? Can
these data separate what you want to separate? And is it one question, not
three?

**Too broad, just right (frame 25).** "What drives organic food purchases?"
sounds more important, but it is a whole research programme. "Do vegetarians
buy a larger share of organic food than people who eat meat without
restrictions?" can be answered in a few weeks, and afterwards you know
something. A narrow question names one variation (the diet in
`V041nofleischf`), one outcome (the share of organic food in `v032bioanteil`)
and one comparison (vegetarians against people without restrictions).

**The sentence of the second part (frame 26).** A question you can answer well
is worth more than an important one you can only talk about.

## Part 3: questions without an answer

**Four traps (frames 28 to 31).** Some questions sound like research questions
and still cannot be answered with these data. A normative question such as
"should oat milk cost as much as cow's milk?" asks what should be, while data
describe what is. A vague question such as "what do Germans think about
food?" has no object and no measure. A causal question without a design, such
as "does a higher income make people buy organic?", asks for a cause where the
survey can only show that things go together, because income goes with
education, place and values. And "has organic buying grown since 2020?" needs
more than one point in time, while this survey was asked once, in November
2025. The normative question can be turned into how many respondents hold a
view, the causal one into a question about a relation, and the vague one can
be narrowed down.

**Rescue the question (frame 32).** "Does income make people buy organic?"
becomes "is household income related to the share of organic food people
buy?", which the columns `d049einkommen` and `v032bioanteil` can answer.
"Makes" becomes "is related to", and the report says honestly why it cannot
claim more.

**Quick quiz: which question can the milk survey answer? (frames 33 to
35).** Only "do vegans use farm shops?", which compares the diet in
`V041nofleischf` with the shop column `v008ort_6hof`; only 36 respondents are
vegan, so the answer rests on few people. "Is milk too cheap?" is normative,
the survey cannot show a change since 2020, and nothing in it varies
advertising.

## Part 4: sharpening a question

**From idea to question (frames 37 to 43).** The idea "prices and oat milk"
becomes a question once six fields are filled. Who: people who bought and
drank milk or milk alternatives in the last 12 months. Where: an online panel
across Germany. When: November 2025. Variation: the price of alpro oat drink at
1.69, 1.79, 1.89 or 2.09 euros. Outcome: purchase certainty from −4 to +4.
Comparison: each price against the regular 1.79 euros. Whoever can fill all
six fields has a question, and whoever gets stuck at one now knows where it is
still vague.

**The sharpened question (frame 44).** How does purchase certainty for alpro
oat drink change among people who buy and drink milk when its price lies 10
cents below, or 10 or 30 cents above, the regular 1.79 euros? Every word of it
corresponds to a column or a row filter in the data set.

**The price experiment (frame 45).** Every respondent in this test saw the
same shelf with Weihenstephan at 1.79 euros and Gut & Günstig at 1.09 euros,
and alpro at one of four prices; 141, 142, 161 and 157 people saw the four
prices. Because chance decided who saw which price, the groups are alike
except for the price, so a difference in purchase certainty can be put down to
it. Here, and only here, the survey can answer a causal question.

## Part 5: the reality test

**The data came first (frames 47 and 48).** The data are collected, and no
question can create a column afterwards. Question, codebook and variables
lead to one of three outcomes: if every word has a column, the question is
answerable; if a part is missing, you adapt the question and check it again;
and if nothing fits, you drop it. Adapting the question is the normal way of
working, while talking the data into fitting the question is the mistake.

**Check it against the codebook (frame 49).** Every part of the sharpened
question has a column: the people are `v006gekauft_3mi == 3`, the price is
`ad015p1reaktion4` with codes 1 to 4 for 1.69, 1.79, 1.89 and 2.09 euros, the
outcome is `U015p1reaktion4_3alpro` from −4 to +4, and the regular price is
`ad015p1reaktion4 == 2` ("Normal alpro" in `AD015p1reaktion4f`). Time and
place are not columns; they come from the study documentation. The filter
needs a closer look: according to the questionnaire the price test went to
people who bought milk, with or without drinking it, but among the 601
respondents who saw a price only code 3, bought and drank, occurs. Of them 596
rated alpro, between 139 and 161 per price.

**The closing picture (frame 50).** Write your question down before you
compute anything, check every word against the codebook, and change the
question rather than the data.

## Sources

- Döring, N. (2023). *Forschungsmethoden und Evaluation in den Sozial- und
  Humanwissenschaften* (6th ed.), chapter 5, pp. 147–159. Springer.
  [doi.org/10.1007/978-3-662-64762-2](https://doi.org/10.1007/978-3-662-64762-2)
- Huntington-Klein, N. *The Effect: An Introduction to Research Design and
  Causality*, chapter 2, "Research Questions".
  [theeffectbook.net](https://theeffectbook.net)
