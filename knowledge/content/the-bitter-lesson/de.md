---
title: The Bitter Lesson
summary: >-
  Rich Sutton blickt auf siebzig Jahre KI-Forschung zurück und zieht einen
  Schluss: Allgemeine Verfahren, die immer mehr Rechenleistung nutzen, Suche
  und Lernen, haben das von Hand eingebaute Wissen der Forschenden noch jedes
  Mal geschlagen.
objectives:
  intro: "Aus diesem kurzen Essay nimmst du mit, warum KI eher durch Größe als durch Raffinesse besser wird, und kannst danach:"
  goals:
    - "die bittere Lektion in einem Satz wiedergeben und die beiden allgemeinen Verfahren nennen, die Sutton meint, Suche und Lernen"
    - "an Schach, Go, Spracherkennung oder Bilderkennung erklären, warum eingebautes menschliches Wissen zuerst geholfen und den Fortschritt später gebremst hat"
    - "sagen, was aus der Lektion für Sprachmodelle und Agenten folgt und wo sie an Grenzen stoßen könnte"
translation_of: en
based_on: 2026-11-04
---

Rich Sutton, einer der Begründer des Reinforcement Learning und Träger des
Turing Award 2024, hat diesen Essay im März 2019 auf seiner eigenen
Webseite veröffentlicht. Er ist kaum zwei Seiten lang und gehört zu den
meistzitierten Texten über KI, weil er in wenigen Absätzen erklärt, warum
sich das Fach so entwickelt, wie es sich entwickelt.

## Das Argument

Sutton geht von einer Beobachtung aus, die sich durch die ganze Geschichte
der KI zieht. Forschende versuchen immer wieder, ihr Wissen über ein
Problem in ihre Systeme einzubauen: wie ein Schachmeister denkt, wie Wörter
aus Lauten bestehen, aus welchen Kanten und Formen ein Gegenstand auf einem
Bild besteht. Das hilft zunächst und ist für die Forschenden befriedigend,
aber früher oder später überholt es ein Verfahren, das viel weniger weiß,
weil es die wachsende Leistung der Rechner nutzen kann. Zwei Arten von
Verfahren wachsen auf diese Weise mit: die Suche, die weit mehr
Möglichkeiten ausprobiert, als ein Mensch könnte, und das Lernen, das die
Muster in Daten selbst findet.

Seine Beispiele sind die bekannten Meilensteine:

- **Schach:** Deep Blue schlug Garri Kasparow 1997 mit gewaltiger Suche, zum
  Verdruss der Forschenden, die das menschliche Verständnis des Spiels
  nachgebildet hatten.
- **Go:** Zwanzig Jahre später geschah dasselbe im Go, diesmal durch Lernen
  aus Partien gegen sich selbst.
- **Spracherkennung:** Statistische Verfahren setzten sich gegen Systeme
  durch, die auf menschlichem Wissen über Wörter und Laute beruhten, und
  später gewann Deep Learning mit noch weniger davon.
- **Bilderkennung:** Von Hand entworfene Merkmale wie Kanten wichen
  neuronalen Netzen, die ihre Merkmale selbst lernen.

Bitter ist die Lektion, weil sie bedeutet, dass das Wissen, auf das
Forschende stolz sind, auf lange Sicht weniger zählt als die Rechenleistung,
die sie für ein Problem aufbringen können. Suttons Schluss lautet, Verfahren
zu bauen, die die Komplexität der Welt selbst entdecken, statt unser eigenes
Bild von ihr einzubauen.

## Warum es hierher passt

Der Essay erklärt, warum Sprachmodelle immer größer werden und warum ein
Modell, das einfach mit mehr Daten und mehr Rechenleistung trainiert wurde,
oft ein raffinierter entworfenes schlägt. Er hilft auch bei Agenten: Ein
Rahmen voller handgeschriebener Regeln und Schritt-für-Schritt-Anweisungen
mag heute funktionieren, während die bittere Lektion vorhersagt, dass ein
Modell, das auf gute Ergebnisse trainiert wurde, ihn einholt. Ob die
Lektion überall gilt, etwa in unordentlichen Organisationen, in denen
niemand sagen kann, was ein gutes Ergebnis ist, ist eine offene Frage.

## Ethan Mollicks Musikvideo

Ethan Mollick erklärt die bittere Lektion auf ungewöhnliche Weise in seinem
Beitrag [The Dot and the Swarm](https://www.oneusefulthing.org/p/the-dot-and-the-swarm)
in seinem Blog *One Useful Thing*: Er ließ KI-Modelle daraus ein Musikvideo
machen, Text und Musik von einer KI erzeugt und das Video in Code
zusammengesetzt, ganz ohne Bildgenerator. Das Video steht im Beitrag und
auch auf [YouTube](https://youtu.be/OAwat51S_Sk). Dass eine Maschine ein
solches Video heute aus einer einzigen Anweisung macht, ist selbst ein
kleines Beispiel für die Lektion.

In einem früheren Beitrag, [The Bitter Lesson versus The Garbage
Can](https://www.oneusefulthing.org/p/the-bitter-lesson-versus-the-garbage),
fragt Mollick, was die Lektion für Unternehmen bedeutet, deren Abläufe alles
andere als aufgeräumt sind.
