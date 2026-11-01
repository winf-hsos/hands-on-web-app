---
title: "Exercise: Grade overview"
summary: >-
  The points of an exam are in a list. A function of your own turns points
  into a grade, and a loop prints every exam, counts the passes and works out
  the average.
objectives:
  intro: "In this exercise you make the grade overview of an exam, and afterwards you can:"
  goals:
    - "write a function that works out a grade from points with `if`, `elif` and `else` and returns it with `return`"
    - "print every exam numbered, with its points and grade, using `for` and `enumerate()`"
    - "count in the same loop with an accumulator how many exams have passed"
    - "work out the average with `sum()` and `len()` and print it with one decimal place using `:.1f`"
translation_of: de
based_on: 2026-11-01
---

## Task

Ten exams have been marked, and their points from 0 to 100 are already in
the program. First write a function `grade(points)` that returns the grade
for the points: from 90 points a 1, from 75 a 2, from 60 a 3, from 50 a 4
and below that a 5. The main program `main` then prints every exam with its
number, its points and its grade. At the end it writes how many exams have
passed, that is have a 4 or better, and how many points there were on
average, with one decimal place.

## What it should look like

```text
Exam 1: 95 points, grade 1
Exam 2: 72 points, grade 3
Exam 3: 48 points, grade 5
Exam 4: 88 points, grade 2
Exam 5: 61 points, grade 3
Exam 6: 50 points, grade 4
Exam 7: 30 points, grade 5
Exam 8: 79 points, grade 2
Exam 9: 90 points, grade 1
Exam 10: 66 points, grade 3
8 of 10 passed
Average: 67.9 points
```

## Your program

```python
def main():
    exams = [95, 72, 48, 88, 61, 50, 30, 79, 90, 66]
    passed = 0

    # Print every exam with number, points and grade
    # and count on the way how many have passed.

    # Print the number of passes and the average.


def grade(points):
    # Return the grade 1 to 5 for the points.
    return 5


main()
```

Because `grade` returns its result, you can check it on its own before you
write the loop. To do so, replace the last line for the time being with
`print(grade(90), grade(89), grade(50), grade(49))`; the result should be
`1 2 4 5`.

> [!HINT]
> In `grade` the order matters: check `points >= 90` first, then the
> condition `points >= 75` with `elif` and so on downwards, and whatever is
> left ends up in the `else`. Python takes the first branch whose condition
> holds, so 95 points get only the 1, even though 95 is also greater than 75.

> [!HINT]
> `for number, points in enumerate(exams, start=1):` gives the number and the
> points of an exam in every round. In the body, call `grade(points)`, keep
> the grade in a variable and count `passed` up by one if the grade is 4 or
> smaller.

> [!SOLUTION]
> ```python
> def main():
>     exams = [95, 72, 48, 88, 61, 50, 30, 79, 90, 66]
>     passed = 0
>
>     for number, points in enumerate(exams, start=1):
>         mark = grade(points)
>         print(f"Exam {number}: {points} points, grade {mark}")
>         if mark <= 4:
>             passed += 1
>
>     average = sum(exams) / len(exams)
>     print(f"{passed} of {len(exams)} passed")
>     print(f"Average: {average:.1f} points")
>
>
> def grade(points):
>     if points >= 90:
>         return 1
>     elif points >= 75:
>         return 2
>     elif points >= 60:
>         return 3
>     elif points >= 50:
>         return 4
>     else:
>         return 5
>
>
> main()
> ```
>
> A single loop prints every line and counts the passes along the way, while
> `sum()` and `len()` give the average without any loop. In `main` the grade
> is called `mark` and not `grade`, because that name already belongs to the
> function: a variable `grade` in `main` would hide the function there, and
> Python would report an error at the call.

## For the quick ones

Also print how often each grade occurs, such as `Grade 1: 2 times`. For this,
create a list `counts = [0, 0, 0, 0, 0]` before the loop, whose first place
counts the ones, the second the twos and so on, and in the loop increase the
right place with `counts[mark - 1] += 1`. A second loop with
`enumerate(counts, start=1)` then prints the five lines.
