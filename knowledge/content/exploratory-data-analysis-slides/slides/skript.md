# Exploratory data analysis

The text to the slides, in their order. Frame numbers count every build-up
step, as in the PDF.

**An expedition with a map (frame 3).** Explorers in the past did not know
what they would find. They walked, drew what they saw and marked what they
did not understand yet. Exploring data works the same way: you start without
knowing what is in the table, you draw a first picture, and the picture tells
you where to look next. What you bring home is a better map and a list of good
questions, not yet the answers. The sentence to take home says exactly that:
exploring finds questions worth asking, it does not answer them.

## Part 1: where exploring fits

**The workflow of a data analysis (frames 5 to 9).** Every analysis loads data
and brings it into a tidy shape, which is preparation. Understanding happens
in a loop: you transform the data, look at it in a picture, perhaps fit a
simple model, and every picture sends you back with a new idea. Only at the
end do you communicate, and programming holds it all together so that every
step can be repeated. Exploring data is a loop, not a step. The figure follows the introduction of *R for Data
Science* ([r4ds.hadley.nz/intro.html](https://r4ds.hadley.nz/intro.html)).

**A state of mind (frame 10).** There is no checklist that makes an
exploration complete. *R for Data Science* describes a cycle of three moves:
generate questions about your data, search for answers by transforming and
visualising, and use what you learn to refine the questions or ask new ones.
The quality of an exploration therefore depends on the questions you bring
into it.

**Two kinds of questions (frame 11).** When you face a new table and do not
know where to begin, two questions help. What variation occurs within one
variable, that is, which values occur, which are common and which are rare?
And what covariation occurs between variables, that is, do two columns tend to
vary together? Almost every exploratory question is one of these two, and the
third part asks both of the milk survey.

## Part 2: what is the question?

**The wrong question, answered correctly (frame 13).** Many analyses that are
criticised later did not compute anything wrong; they answered a different
question than the one people read into them. A pattern found while exploring
is reported as if it held for everyone, or a good prediction is read as an
explanation. Jeffery Leek and Roger Peng describe this in a two-page paper
([doi.org/10.1126/science.aaa6146](https://doi.org/10.1126/science.aaa6146))
and suggest deciding which type of question you are asking before you start.

**Six yes-or-no questions (frames 14 to 21).** Their decision tree, redrawn
here, starts at the top and asks until it reaches a type. If you did not
summarise the data, for example because you only show single rows, it is not
yet a data analysis. A summary reported without interpretation is
descriptive. If you do not check whether your discoveries would hold in a new
sample, the analysis is exploratory, which is the type of this deck. If you do
check it, the next question is whether you want to know how changing one
measurement changes another. If not, you either predict values for
individuals, which is predictive and the field of machine learning, or you
test whether a pattern in the sample is more than chance, so that it holds for
everyone the sample stands for, which is inferential. If you do, an effect on
average is causal, found best with experiments and the methods of causal
inference, and an effect that occurs in exactly this way in every single case
is mechanistic. Two of the six questions matter most: whether a pattern is
meant to hold for more people than those you asked, and whether you are asking
for a cause.
The tree is strict on purpose, because it names what you are entitled to
claim at the end.

**Six types, asked of one survey (frame 22).** The same six types, each with a
question to the survey on milk and chocolate. That 1,452 of the 2,387 people
asked drink milk every day answers the descriptive question. The causal
question can actually be answered with this survey, because the price of
alpro oat drink was an experiment: chance decided whether a respondent saw it
ten cents cheaper, at its normal price, or ten or thirty cents dearer, and
everyone said how surely they would buy it. Inferential, in the table, means
testing a pattern against chance. The mechanistic question cannot be answered by any survey; it belongs to physics.

**Quick quiz: organic share (frames 23 to 25).** "What share of the
respondents buys (almost) only organic food?" is descriptive: it counts and
summarises without interpreting. The answer is 111 of 2,793 people, about 4
percent. It would turn inferential the moment we claimed that 4 percent of all
Germans buy (almost) only organic food.

**The step people skip (frames 26 to 28).** The most common mistake is not a
wrong calculation but a silent promotion. The first sentence, "in our survey,
younger respondents are more open to oat milk", is exploratory and honest. The
second claims the same for all young people in Germany; that is inferential
and needs a significance test on these data, which checks whether a difference
of this size could be chance in a sample of this size, and nobody ran it. The third says that
being young causes it; that is causal and would need an experiment. The data
stay the same in all three sentences, while the claim grows, and with it what
you would have to show.

**Quick quiz: vegetarians (frames 29 to 31).** "Vegetarians in Germany buy
more organic food than others" is inferential, because the sentence speaks of
all vegetarians in Germany and not of the 134 in the survey. As an exploratory
finding about the survey it is fine; as a statement about Germany it needs a
significance test on these data, which checks whether the difference could
have come about by chance alone.

**Search long enough, and you will find something (frame 32).** With 606
columns there are 183,315 pairs of columns. To see what chance alone produces,
shuffle every column on its own, so that no column has anything to do with any
other, and test every pair that can be tested. About 7,000 pairs still pass a
test at the 5 percent level, with correlations of up to about 0.5. That is no
reason not to explore, but it is the reason why an exploratory finding is a
question for the next study and not its result.

**The sentence of the deck (frame 33).** Exploring finds questions worth
asking, it does not answer them. Everything you find while exploring deserves
a name that says what it is: a pattern in these data, worth checking.

## Part 3: exploring the survey

The survey on milk and chocolate asked 2,811 people who shop for their
household, and it has 606 columns. The columns used here carry readable names
instead of the codes of the questionnaire; loading the data, renaming and
selecting the columns and saving the result is an exercise of its own.

**Half of the table is empty (frame 35).** The picture shows the whole table,
one pixel per cell, answered cells light and empty ones dark. Almost exactly
half of all cells are empty, and hardly any of them because someone refused to
answer: many questions went only to a part of the respondents, the chocolate
questions to 275 people and the milk questions to 234, and those two groups
sit at the top of the picture. Remove every row with a missing value, and
nobody is left, because every single row has gaps. Remove them for one
question, and you are talking about a different group than you think.

**Variation: age (frame 36).** The histogram is the first tool for variation.
All 2,811 people gave their age, from 18 to 80, with a median of 50. The shape
is no accident, because the panel provider filled quotas for age, gender and
federal state, and that matters whenever a result is meant to hold for
Germany as a whole.

**Unusual values: when is milk too expensive? (frames 37 to 39).** 612 people
said from which price on a litre of milk is too expensive for them. The first
histogram is useless, a single bar, because a few answers up to 999 stretch
the axis to a thousand euros. Zoomed in with `coord_cartesian()`, the real
distribution appears, with its middle at 1.99 euros. Then look at the extreme
values themselves: 16 answers lie above 20 euros. A 160 is almost certainly
1.60 typed without the point, a 344 perhaps 3.44, and 999 is a common code for
"don't know". One strange value can hide a whole distribution, so look at the
extremes before you look at the average.

**Mean or median? (frame 40).** With all 612 answers the mean is 8.11 euros, a
price at which nobody in the survey would really stop buying milk; the 16
extreme answers pull it up. Set only those answers to `NA`, which keeps
everything else these people said, and the mean drops to 2.17 euros. The median stays at 1.99 euros in both cases, because it depends only
on the middle of the sorted values. When a distribution has extreme values,
report the median, and say which values you set to `NA` and why, because the
threshold is a judgement.

**Covariation: organic food and diet (frame 41).** For a categorical and a
numerical variable the boxplot is the standard picture. The median share of
organic food rises from 2 for omnivores to 3 for flexitarians, vegetarians and
pescetarians and to 4 for vegans. Read the group sizes before the boxes: 1,816
omnivores, but only 36 vegans. The groups differ, and the smallest group
differs most, which is exactly where chance plays the biggest part; a striking
box built on a handful of people is a reason for a closer look, not for a
headline.

**Covariation: oat milk and age (frame 42).** This is the exploratory question
from the table of types. The yellow bars show the share of people who would
buy oat milk at all: 68 percent of the youngest group and 38 percent of those
over 60. The picture suggests an answer, but it rests on 234 people from a
quota sample, and the youngest group holds only 34 of them. To say something
about everyone in Germany, the question becomes inferential, and a
significance test on these data would have to show that the difference is more
than chance.

**Quick quiz: the alpro price (frames 43 to 45).** "Respondents saw alpro oat
drink at a price chosen by chance and said how surely they would buy it. Which
type of question can this answer?" Causal: on a shelf next to Weihenstephan at
1.79 euros and Gut & Günstig at 1.09, alpro cost 1.69, 1.79, 1.89 or 2.09
euros, and chance decided which of the four a respondent saw. For each of the
three milks they said how surely they would buy it, from −4 for certainly not
to +4 for certainly. Because chance decided who saw which price, the groups
differ only in the price, and a difference in how surely they would buy alpro
can be put down to it.
That is the idea of an experiment, and it is the strongest way to answer a
causal question.

**From exploring to the next question (frame 46).** Three findings of this
exploration and the questions they raise. That younger respondents are more
open to oat milk raises the inferential question whether it holds for all of
Germany. That vegans and vegetarians buy more organic food raises a causal
one: is it the diet, or something behind both, such as income? And the 16
price answers above 20 euros raise a question for the design of the next
survey: how should it ask for a price so that typing errors and "don't know"
do not end up as numbers? The result of an exploration is a list of better
questions.

**Take the map with you (frame 47).** Draw what you see, mark what you do not
understand, and keep the question marks. Exploring is the start of every
analysis, and the honest name for its findings is "worth checking". To read
on: Leek and Peng, "What is the question?"
([doi.org/10.1126/science.aaa6146](https://doi.org/10.1126/science.aaa6146)),
and the chapter "Exploratory data analysis" of *R for Data Science*
([r4ds.hadley.nz/EDA.html](https://r4ds.hadley.nz/EDA.html)).
