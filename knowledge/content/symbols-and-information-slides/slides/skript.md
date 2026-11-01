# Script: what light means

These notes accompany the stagekit deck "what light means". They explain the contents of the slides for reading afterwards. Build-up steps and the segments of an animation count as frames of their own in the player and in the export; the references therefore refer to frames.

The core message is: distinguishable states become symbols only through an agreement, and once they are symbols, the information they carry can be counted. Together, the two explain why the size of your own alphabet is a decision with consequences.

The running example is a link that transmits data with light, where an LED sends colours and a sensor tells them apart.

## 1. Agreement

### What makes light mean something? (Frame 4)

In the North Atlantic of 1942 the ships keep radio silence, because every radio message draws the enemy, and still two ships talk to each other, with a lamp and a shutter in front of it that forms short and long flashes. The light itself knows nothing. It means something only because both sides carry the same table in their heads.

### A symbol is an agreed, distinguishable state (Frames 5 to 7)

Both words carry weight, and the raised thumb on the slide shows both. **Distinguishable** is a question for physics and for your sensor: can the receiver tell this state apart from all the others? Nobody mistakes a thumbs-up for a fist or an open hand. **Agreed** is a question for sender and receiver: did both give the same state the same meaning, and did they do so beforehand? The thumb itself holds no meaning: in much of Europe it says "good", in parts of West Africa and the Middle East it is an insult, and a German who counts on their fingers raises the thumb for "one", where an American raises the index finger. No measurement can answer this second question.

### Perfect reception, perfect nonsense (Frames 8 and 9)

The sender spells "team" with four colours: red for t, green for e, blue for a, yellow for m. All four colours arrive without a single error. The receiver's table, however, swaps red and yellow, and so the receiver reads "meat".

There was no transmission error, no interference and no bad measurement, and the message is wrong all the same, because the agreement was missing. Every colour arrived correctly, and still the message did not. That is why "agreed" stands in the definition on equal footing with "distinguishable".

In a lecture this can run live: two volunteers secretly get mapping tables that differ, one shows colour cards, the other writes down what they mean, and the room sees only the colours.

### The agreement, written down (Frame 10)

In code, the agreement is a dictionary:

```python
ALPHABET = {
    "red":    "00",
    "green":  "01",
    "blue":   "10",
    "yellow": "11",
}
print(ALPHABET["blue"])
```

This table is never transmitted. Both sides need it beforehand, which makes it a promise rather than data. Whoever changes it without telling the partner rebuilds the previous slide.

## 2. Counting information

### The guessing game, measured (Frames 12 to 14)

One of 32 cards is wanted, and only yes-or-no questions are allowed. Above, the slide counts the possibilities left; below, it shows the 32 cards. The first question, for example "is it red?", rules out half of them, and 16 are left. The four further questions halve again and again, 8, 4, 2, 1, until one card is left.

Halving finds one card out of 32 in exactly five questions, and not only when you are lucky. This number of necessary halvings is the measure this part is about. In a lecture the game runs live with a deck of 32 cards: one card is drawn face down, the room asks, and afterwards everyone counts the questions.

### Not every answer is worth one bit (Frame 15)

The counter-check: "is it the ace of spades?" can settle everything at once, but it does so in only one of 32 cases, and in the other 31 almost everything is still left. The halving question, on the other hand, always delivers the same result, exactly one halving, whatever the answer. You cannot choose which answer you get, and that is why what counts is not the best case but the average.

### What a question is worth on average (Frame 16)

| question | answer | chance | you learn | on average |
| --- | --- | --- | --- | --- |
| "is it red?" | yes | 1/2 | 1 bit | 1 bit |
| | no | 1/2 | 1 bit | |
| "is it the ace of spades?" | yes | 1/32 | 5 bit | 0.2 bit |
| | no | 31/32 | 0.05 bit | |

A rare answer tells you a lot, while an expected answer tells you little. Because the rare answer is rare, on average the question whose outcome is open wins. The lopsided question only pays off right at the end, when just two possibilities are left.

### And in general (Frames 17 and 18)

The same calculation without the concrete numbers. Every possible answer contributes how likely it is, multiplied by what it would be worth. Added up over all answers, that is the **expected value** of a question:

`E = Σ pᵢ · log₂(1/pᵢ)`

Here `pᵢ` is the probability of an answer and `log₂(1/pᵢ)` is what that answer would be worth in bits: the less likely it is, the more it carries. For a yes-or-no question that is two terms, for a question with more outcomes correspondingly more.

With the numbers from before: `0.5 · 1 + 0.5 · 1 = 1` bit for the halving question, `0.03 · 5 + 0.97 · 0.05 = 0.2` bits for the lopsided one. A fair split is the only way to get a whole bit, and every lopsided split costs, regardless of how the game turns out this time.

### One bit, and two formulas (Frames 19 and 20)

A **bit** is the amount of information in a decision between two equally likely possibilities. A light switch holds one bit, and it needs no computer for that.

With that, both quantities can be written down, in this order:

**Uncertainty:** `H = log₂(N)` for N equally likely possibilities. It measures how many halvings are still missing.

**Information:** `I = H₁ − H₂`, the uncertainty before minus the uncertainty after. It measures what an answer has actually removed.

32 cards mean an uncertainty of 5 bits, and each halving question removes 1 bit. The 32 is the space of possibilities, while the uncertainty is the 5.

### What a bigger alphabet buys (Frames 21 to 23)

The same tool, now applied to an alphabet of colours. A symbol from N equally likely possibilities carries `log₂(N)` bits: two colours one bit, four colours two, eight colours three, sixteen colours four.

Because the same file then needs fewer symbols, it gets through sooner. The bars show the time for the same file at the same symbol rate: with four colours it needs half the time it needs with two, with eight a third and with sixteen a quarter. The file and the symbol rate stay the same, and only the alphabet changes.

### Two symbols are enough for anything (Frame 24)

What a big alphabet does per symbol, two symbols do in a group. Five flashes with two possibilities each make `2⁵ = 32` combinations, room for a whole alphabet. That is why every computer gets by with nought and one, and why a small alphabet is not a dead end but merely slower.

### When symbols are not equally likely (Frame 25)

So far all symbols counted as equally likely. In real text they are not, and Morse code exploits that: the most common letter, the "e", gets the shortest code, a single dot, while rare letters like the "q" are long. Rare symbols may cost more, as long as the common ones stay short, because that makes the average message shorter. Every compression scheme rests on this observation.

## 3. Your alphabet

### The catch (Frame 27)

On the left, the payoff: more bits per symbol, so the same file needs fewer symbols and arrives sooner. On the right, the price: the colours move closer together, the noise reaches across the gap, and symbols are read wrong. No formula tells you where the limit lies, so the size of your alphabet is not a matter of taste but the result of a measurement. Challenge 1 of the LiFi project asks exactly this: how many states your link tells apart over 50 attempts without a single error.

### Four steps to your alphabet (Frame 28)

1. agree on your alphabet and write it down
2. measure a profile for every symbol
3. fill `send_symbol()` and `receive_symbol()`
4. send 50 symbols and count the errors

The first step is the one everyone wants to skip. Whoever keeps the agreement only in their head rebuilds the nonsense slide as soon as two people work in parallel.

### To close (Frames 29 and 30)

Light means nothing until you agree what it means, and how much it means, you can count.
