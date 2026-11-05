"""The corpora of the experiment a-language-model-by-counting.

Writes into knowledge/media/datasets/:

- farm_corpus.csv          one sentence per row (sentence_id, sentence), the
                           table `corpus` of the R boxes and the corpus of the
                           next-word demonstrator
- farm_corpus_tokens.csv   one token per row (sentence_id, position, word),
                           the table `tokens`; every sentence begins with <s>
                           at position 0 and ends with </s>
- alice_in_wonderland.txt  Lewis Carroll's book (1865, public domain), one
                           sentence per line, the large corpus of the
                           demonstrator

and the printable word cards (knowledge/content/a-language-model-by-counting/
media/word-cards.pdf) with Typst: one card for every pair of words, sorted
into one bag per word.

    python scripts/counting-corpus.py <pg11.txt from Project Gutenberg>

The book comes from https://www.gutenberg.org/cache/epub/11/pg11.txt; only
the text of the story is kept, without the Project Gutenberg header and
licence, chapter headings or the asterisks between parts.
"""

import collections
import csv
import pathlib
import re
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATASETS = ROOT / 'knowledge' / 'media' / 'datasets'
ITEM_MEDIA = ROOT / 'knowledge' / 'content' / 'a-language-model-by-counting' / 'media'

# Words followed by different words (gives milk / wool, in the barn / field /
# nest / hive), so that a model with one word of context writes sentences
# that sound right and are false ("the sheep gives milk").
FARM = """the cow gives milk
the sheep gives wool
the hen lays eggs
the bee makes honey
the cow eats grass
the sheep eats grass
the hen eats grain
the cow sleeps in the barn
the sheep sleeps in the field
the hen lays eggs in the nest
the bee makes honey in the hive
the bee lives in the hive
the farmer milks the cow
the farmer feeds the hen
the farmer sells the milk
the farmer sells the eggs
the milk is white
the honey is sweet
the grass is green
the wool is soft
the cow is big
the bee is small""".split('\n')


def write_farm():
    with open(DATASETS / 'farm_corpus.csv', 'w', newline='', encoding='utf-8') as f:
        out = csv.writer(f, lineterminator='\n')
        out.writerow(['sentence_id', 'sentence'])
        for i, sentence in enumerate(FARM, 1):
            out.writerow([i, sentence])
    with open(DATASETS / 'farm_corpus_tokens.csv', 'w', newline='', encoding='utf-8') as f:
        out = csv.writer(f, lineterminator='\n')
        out.writerow(['sentence_id', 'position', 'word'])
        for i, sentence in enumerate(FARM, 1):
            for position, word in enumerate(['<s>', *sentence.split(), '</s>']):
                out.writerow([i, position, word])


def alice_sentences(source):
    text = pathlib.Path(source).read_text(encoding='utf-8')
    start = text.index('\nCHAPTER I.\n') + 1  # the table of contents has the title on the same line
    text = text[start:text.index('THE END')]
    lines = text.split('\n')
    kept = []
    skip = 0
    for line in lines:
        if re.match(r'^CHAPTER [IVXLC]+\.', line.strip()):
            skip = 1  # the chapter title follows on the next line
            continue
        if skip and line.strip():
            skip = 0
            continue
        if re.fullmatch(r'[\s*]*', line) and '*' in line:
            continue
        kept.append(line.strip())
    text = ' '.join(kept)
    text = re.sub(r'(?<=\w)[’\'](?=\w)', "'", text)  # apostrophes inside words stay
    text = re.sub(r'[“”‘’"_]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    parts = re.split(r'(?<=[.!?])\)?\s+(?=[A-Z(])', text)
    return [p.strip() for p in parts if len(p.split()) >= 2]


def write_alice(source):
    sentences = alice_sentences(source)
    (DATASETS / 'alice_in_wonderland.txt').write_text('\n'.join(sentences) + '\n', encoding='utf-8', newline='\n')
    words = [w for s in sentences for w in re.sub(r"[^\w'\s]", ' ', s.lower()).split()]
    print(f'alice: {len(sentences)} sentences, {len(words)} tokens, {len(set(words))} words')


def write_cards():
    bags = collections.defaultdict(list)
    for sentence in FARM:
        words = sentence.split() + ['</s>']
        for word, following in zip(words, words[1:]):
            bags[word].append(following)
    order = sorted(bags, key=lambda w: (-len(bags[w]), w))
    cards = [(bag, word) for bag in order for word in sorted(bags[bag])]
    entries = ',\n'.join(f'  ("{bag}", "{word}")' for bag, word in cards)
    bag_list = ',\n'.join(f'  ("{bag}", {len(bags[bag])})' for bag in order)
    source = TEMPLATE.replace('%CARDS%', entries).replace('%BAGS%', bag_list).replace('%TOTAL%', str(len(cards)))
    ITEM_MEDIA.mkdir(parents=True, exist_ok=True)
    typ = ITEM_MEDIA.parent / 'word-cards.typ'
    typ.write_text(source, encoding='utf-8', newline='\n')
    subprocess.run(['typst', 'compile', str(typ), str(ITEM_MEDIA / 'word-cards.pdf')], check=True)
    typ.unlink()
    print(f'cards: {len(cards)} in {len(bags)} bags')


# A4, cards of 4 × 6 per page to cut apart; each card names its bag in small
# type, so that cut cards can be sorted back. The first page lists the bags.
TEMPLATE = r"""
#set page(paper: "a4", margin: 10mm)
#set text(font: ("Segoe UI", "Arial"), size: 10pt)

#let cards = (
%CARDS%
)
#let bags = (
%BAGS%
)

#let shown(w) = if w == "</s>" { text(size: 13pt)[end of sentence] } else { w }

= Word cards: predicting the next word by counting

One bag per word. A bag holds one card for every time a word follows that
word in the 22 sentences of the farm corpus, so the bag "gives" holds one card
"milk" and one card "wool". To let the model write, start with "the", draw a
card from the bag "the", write its word down, put the card back and draw from
the bag of the word you just wrote, until you draw "end of sentence".

Cut along the grey lines: %TOTAL% cards on the following pages. The small line
on each card says which bag it belongs in.

#v(4mm)
#table(
  columns: (1fr, auto, 1fr, auto, 1fr, auto),
  stroke: none,
  inset: (x: 4pt, y: 3pt),
  ..bags.map(((bag, n)) => (text(font: "Consolas", bag), if n == 1 [1 card] else [#n cards])).flatten()
)

#pagebreak()
#let card((bag, word)) = box(
  width: 100%, height: 100%, stroke: 0.4pt + luma(170), inset: 6pt,
  {
    text(size: 7.5pt, fill: luma(110))[bag: #text(font: "Consolas", bag)]
    place(center + horizon, text(font: "Consolas", size: 20pt, weight: "bold", shown(word)))
  },
)
#for (i, page) in cards.chunks(24).enumerate() {
  if i > 0 { pagebreak() }
  grid(
    columns: (1fr,) * 4,
    rows: (1fr,) * 6,
    ..page.map(card)
  )
}
"""

if __name__ == '__main__':
    write_farm()
    if len(sys.argv) > 1:
        write_alice(sys.argv[1])
    write_cards()
