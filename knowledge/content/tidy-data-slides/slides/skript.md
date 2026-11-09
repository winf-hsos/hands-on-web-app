# Tidy data with tidyr

The text to the slides, in their order. Frame numbers count every build-up
step, as in the PDF.

**A workshop wall (frame 3).** On a workshop wall every tool hangs in its
painted outline, while in the corner stands a crate into which tools have been
thrown. Every tool can be found in the crate as well, but each time it has to
be searched for, whereas at the wall the hand simply reaches for it. Tables
behave the same way: messy data contain everything, but every question starts
with searching and rebuilding. This input shows what a tidy table looks like
and which four moves bring a table into that shape.

## Part 1: what tidy means

**One answer, four tables (frames 5 to 9).** Three respondents of the survey
said which price for a litre of milk they find fair, for three brands:
Weihenstephan, Gut & Günstig and alpro. Their real answers are written down
four times, and a gray caption on each card says how its table is built. The
table on the left has one row per answer, with the columns respondent, brand
and price, and because respondent identifies the person, it repeats once for
every brand that person judged. The second has one column per brand and one row
per person, the third holds all prices of a person in one cell, and the fourth
has one column per person and the brands as rows. None of the four is
wrong, and people find the second one the easiest to read. Whoever wants the
median per brand, however, gets it from the first table without any rebuilding,
with `group_by(brand)` and `summarize()`, while the second would need three
calculations and the third would first have to cut text apart.

**Three rules (frames 10 to 13).** The three rules of tidy data, as Hadley
Wickham put them, who also wrote dplyr and tidyr, are shown on the first
table. Every variable has its own column, and a variable is something that is
measured or asked, such as the brand or the price. Every observation has its
own row, and an observation is everything measured about one unit, here one
person judging one brand, for example respondent 16 on alpro. Every value has
its own cell, which means a single statement such as 1.49.

**What is one observation? (frames 14 to 16).** Two tables show the same three
people. For the question how old the people are who answered, the unit is the
person, so one row per person is exactly right and the wide table is tidy. For
the question which brand people think should be cheapest, the unit is one
person judging one brand, three rows belong to every person, and the long
table is the tidy one. Whether a table is tidy cannot be decided without the
question.

**Why it pays off (frame 17).** The three medians are computed once from each
table. In the wide table every brand needs its own line, so thirty brands
would mean thirty lines and thirty chances to mistype a name, while in the long
table one `group_by()` and one `summarize()` cover every brand, however many
there are. ggplot2 works the same way, because it can only colour by brand
when the brand is a column.

**Quick quiz (frames 18 to 20).** Respondents gave a price for each of three
brands, one column per brand: is this table tidy? The intended answer is that
values sit in the column names, because weihen, gut and alpro are
values of the variable brand. Strictly speaking the last answer is right as
well, which leads back to the observations: for every question that compares
brands the brands hide in the column names, while for a question about each
person the table is fine as it is.

**Four ways to be messy (frame 21).** The rest of the input follows a map of
four ways in which a table can be messy, each shown on a small piece of the
deck's own data with the messy part in yellow and the verb that repairs it
underneath. When the brands stand in the column names, `pivot_longer()`
repairs it; when one column called measure holds both the price and the
certainty, `pivot_wider()`; when a cell holds a range such as 1.30 to 1.50,
`separate_wider_delim()`; and when a cell holds a list of shops,
`separate_longer_delim()`. All four come from the
package tidyr, which `library(tidyverse)` loads together with dplyr.

## Part 2: wide to long

**The raw survey (frame 23).** From here on we work with the raw version of the
survey on milk and chocolate, as it came out of the survey tool, with 2,811
rows, one per respondent, and 606 columns. `read_csv()` loads it straight from
the site. Since the file has no column that tells the respondents apart,
`mutate()` with `row_number()` numbers the rows in a new column `respondent`,
and `.before = 1` puts it first. Everything that follows builds on `raw`, so this is the moment to
copy the block and run it.

**The price question, as the survey stores it (frame 24).** The question which
price for a litre is fair, asked for three brands, is stored in the three
columns `u013pzahl_1weihen`, `u013pzahl_2gut` and `u013pzahl_3alpro`. The
first row holds the answers we have already seen, rows 2 and 3 are empty, and
further down respondents 16 and 36 answered again, while in all 2,580 of the
2,811 rows are empty, because only 231 people were asked this question. The brand
is a variable, but here it hides in three column names.

**pivot_longer(): columns become rows (frames 25 to 29).** The three
respondents appear again with simple column names. The three brand columns are
the ones to turn into rows, while respondent stays as it is. The first row
unfolds: its respondent number is copied three times, the three column names travel as values into a
new column brand and the three prices into a column price, so that three rows
stand on the right. The other two respondents follow, and the long table has
nine rows. Finally the wide table goes, and above the long one appear the two
arguments that name the new columns, `names_to` for the column that takes the
names and `values_to` for the one that takes the values.

**The code (frame 30).** In R the small table is written row by row with
`tribble()`, so the block runs as it is and can be copied into an R box or into
Positron. `pivot_longer()` needs three answers: which columns, in `cols`; where
their names go, in `names_to`; and where their values go, in `values_to`. The
two new names stand in quotes, because these columns do not exist yet.

**With the real survey (frames 31 to 32).** The same move works on the raw
survey with the real names. `select()` keeps respondent, the age, renamed from
`Q002alter` to `age`, and the three price columns, which `starts_with()` finds
by the start of their names. The result has 8,433 rows, three for each of the
2,811 respondents. It works, but 7,740 of the rows are empty, from people who
were never asked, and the brands still carry the clumsy names of the columns.

**Cleaning up on the way (frames 33 to 34).** Two more arguments clean up while
pivoting. `names_pattern` takes from each column name only the part inside the
brackets, where `\\d` stands for the digit before it and `(.*)` for everything
after it, so `u013pzahl_1weihen` becomes weihen. `values_drop_na = TRUE` drops
the empty rows. What remains are 693 rows, three for each of the 231
respondents, kept under the name `prices_long`. Whoever does not like regular
expressions writes `names_prefix = "u013pzahl_"` instead and keeps the digit,
as in 1weihen, and `names_sep`, which splits a name at a character, comes up
again in part 3.

**Now one line answers it (frames 35 to 36).** With the long table, the
question which price people find fair for each brand is one short pipeline.
`filter(price <= 10)` first drops 18 answers above ten euros, from 15 people
and up to 189 euros for a litre, most of which were probably typed in cents.
The medians are 1.60 for alpro, 1.09 for Gut & Günstig and 1.49 for
Weihenstephan, from about 225 answers each. Since another question of the
survey showed alpro and Weihenstephan both at 1.79, respondents grant alpro a
higher price than Weihenstephan at the same price on the shelf. Why that is
would be a question for an exploratory analysis; what counts here is that the
answer now costs one line of code per step.

**Nine columns of zeros and ones (frame 37).** Where people shop for groceries
was a question with several answers allowed, from discounter and supermarket to
online shop. The survey tool stores such a question as nine columns, one per
shop, with 1 for ticked and 0 for not ticked, and the slide shows the first
four of them as R prints them. Survey tools almost always store multiple
choice like this, but where someone shops is one variable, however many
columns it fills.

**Counting the shops (frames 38 to 39).** Made long and filtered to the ones,
every row holds one person and one shop where they buy. `names_prefix` cuts the
common start off the column names, so shop reads 1discount, 2super and so on,
the abbreviations of the survey tool, and `count()` counts the people per
shop. 2,134 people shop at the supermarket and 2,065 at the discounter, while
173 buy their groceries online, and together the 2,811 respondents ticked
7,800 shops.

## Part 3: long to wide

**Two variables in one column (frame 41).** This small long table is made up
for the example: two respondents, two brands, and in the column measure two
different things, the price someone finds fair and how sure they are to buy
the brand, on a scale from -4 to 4. Data from a database or a measuring device
often look like this. At first sight the table looks tidy, with one value per
row, but the mean of value would be nonsense, because it mixes euros and
points on a scale. Price and certainty are two variables, so they need two
columns, and `pivot_wider()` gives them those.

**pivot_wider(): rows become columns (frames 42 to 45).** In the table from
before, measure and value are the columns that turn into new columns. The two
rows of respondent 1 on weihen travel together into one row, where price and
sure rise up as the names of two new columns and their values move beneath
them, while the rows that are done turn gray. All other pairs follow, and on
the right stand respondent, brand, price and sure, one row per person and brand.

**The code (frame 46).** In R the small table is again written with
`tribble()`, so that the block runs as it is. `pivot_wider()` needs two
answers: `names_from`, the column that supplies the names of the new columns,
and `values_from`, the column that fills them. Both are bare column names
without quotes, because they name columns that already exist, while
`names_to` and `values_to` in `pivot_longer()` name columns that do not exist
yet.

**Quick quiz (frames 47 to 49).** A long table has 3 people, 3 brands and 2
measures in rows: how many rows does it have? The quiz repeats what the code
just did with two people and two brands, now with three of each. Every
combination of person, brand and measure is one row, so 3 times 3 times 2 makes
18, and made wide with `pivot_wider()` the same table has 9 rows, one per
person and brand, just as the 8 rows of answers became 4.

**Wide is for people (frames 50 to 51).** Wide is not wrong, because it is the
shape people read best. The pipeline computes the medians of the fair prices by
decade of age and brand in the long shape, with one row per decade and brand,
and `pivot_wider()` turns the result into a cross table with one column per
brand. From the twenties on, Gut & Günstig stays close to 1.10, while alpro and
Weihenstephan vary more; the first row is a single person in their teens and
says little. A table like this belongs in a report, but for the next
calculation the long version is the better one.

**Two directions (frame 52).** The two verbs undo each other, since
`pivot_longer()` turns columns into rows and `pivot_wider()` turns rows back
into columns. Whoever is unsure which direction they need asks what one row
should be: one person, or one person and one brand.

**Two variables across two brands (frames 53 to 55).** In a harder case two
variables, price and sure, are each spread over the brands, in four columns.
Every column name splits at the underscore into two parts, the first, in
yellow, naming a variable and the second a brand. The yellow parts become the
names of columns, the other parts become values in a column brand, and the
result is the tidy table with respondent, brand, price and sure, the same as after
`pivot_wider()`.

**names_to with ".value" (frame 56).** `cols = -respondent` takes every column
except respondent, `names_sep = "_"` splits every column name at the underscore, and
`names_to` gets two names for the two parts. The special name `".value"` says
that this part of the name stays a column name, while the second part goes
into a new column brand. So a single `pivot_longer()` turns the wide table into
the tidy one, without a `pivot_wider()` afterwards.

## Part 4: one cell, many things

**Two values in one cell (frames 58 to 60).** This small table, made up for the
example, stores a price range as text, the way a questionnaire offers it to
choose from. In every cell the separator " to " lights up, and then the cell
splits there, so that the parts on its left and right move into two columns of
their own, from and to.

**separate_wider_delim() (frame 61).** `separate_wider_delim()` takes the
column to split, the separator in `delim` and the names of the new columns in
`names`. What is cut out of a text stays text, so `as.numeric()` turns from and
to into numbers. The opposite, which joins two columns into one, is called
`unite()`.

**A list in one cell (frames 62 to 64).** Here three respondents' shops are
written as a list in one cell, the way some survey tools and many spreadsheets
store it; they are the real answers of respondents 12, 24 and 48, translated
into English. The commas light up, then every cell falls apart at its commas,
the parts slide below each other and the respondent number is copied for every new row, so
that seven rows stand on the right, one per person and shop.

**separate_longer_delim() (frames 65 to 66).** `separate_longer_delim()` splits
at the comma and the space after it and puts every part into a row of its own,
after which `count()` works as on any tidy column. All three people shop at the
supermarket, and every other shop is named once. A price range has a fixed
number of parts and becomes columns, while a list has as many parts as someone
ticked and becomes rows, and the question decides which one is needed.

**One question, three shapes (frames 67 to 68).** The same answers of
respondents 12, 24 and 48 appear in three labelled shapes. Top left they stand
as a list in one cell, and `separate_longer_delim()` turns that into the tidy
table on the right, with one row per person and shop. Then the shape in which
the survey really stores them joins in: one column per shop with 1 for ticked,
here five of the nine shops by name, and `pivot_longer()` followed by a
`filter()` for the ones leads to the very same tidy table.

**Quick quiz (frames 69 to 71).** A cell holds "vegan, organic, regional", and
the task is to count how often each label occurs. A cell with several labels
separated by commas is a list, and counting labels needs one row per label, so
it takes `separate_longer_delim()` with `delim = ", "` and then `count()`.

## Part 5: the map

**Spreadsheet habits (frame 73).** In spreadsheets a group is often named only
in the first row of its block: the brand stands at the top, and the rows below
are left empty because a reader fills them in without thinking. For R the empty
cells are missing values, which `read_csv()` and `read_excel()` read as NA, and
a filter on alpro would find only one of the three rows.

**fill() (frames 74 to 75).** In R the same table has NA in the empty cells.
`fill()` writes the last known value downward into the missing cells, so the
gaps fill block by block. Related is `drop_na()`, which removes rows with
missing values, but it belongs only where it is clear why they are missing.

**From symptom to verb (frame 76).** The map of this input pairs what you see in
a table with the verb that repairs it: values in column names call for
`pivot_longer()`, two variables in one column for `pivot_wider()`, two values
in one cell for `separate_wider_delim()`, a list in one cell for
`separate_longer_delim()`, and a group named only once for `fill()`.

**The workshop wall again (frame 77).** The same wall appears without the
crate, and the last tool is going back into its outline. In real projects
tidying often takes more time than the analysis itself, but once every value
has its place, every new question costs only a few lines of code. To practise,
copy the code from the slides into an R box on the site or into Positron and
change it, for example to another brand or another question of the survey.
