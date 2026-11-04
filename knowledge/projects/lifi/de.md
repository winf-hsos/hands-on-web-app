---
kind: project
code: 4577
title: Das LiFi-Projekt
summary: >-
  Ihr baut aus einer farbigen LED und einem Farbsensor eine Funkstrecke aus
  Licht und bringt sie in fünf Challenges, eine ganze Datei fehlerfrei zu
  übertragen.
level: 1
modules: [dup]
phases:
  - id: start
    challenge: lifi-challenge-0
    items: [lifi-equipment, first-light, problem-decomposition, input-processing-output, algorithms-and-programs]
  - id: alphabet
    challenge: lifi-challenge-1
    items:
      - measurement-and-experiments
      - analog-and-digital
      - symbols-and-information
      - signal-and-noise
      - measuring-your-noise
      - believed-and-measured
      - place-value-systems
      - why-two-states
  - id: word
    challenge: lifi-challenge-2
    items: [morse-code]
  - id: protocol
    challenge: lifi-challenge-3
    items: [morse-code]
  - id: packet
    challenge: lifi-challenge-4
    items: [byte, hexadecimal, binary-prefixes, logic-gates]
status: published
updated: 2026-11-04
---

Jede Person im Team bekommt ein kleines Gerät mit einer RGB-LED und einem
Farbsensor. Stellt ihr zwei Geräte gegenüber, leuchtet die LED des einen in den
Sensor des anderen, und über diese kurze Strecke durch die Luft sollen Daten
fließen. Am Anfang unterscheidet ihr ein paar Farben, am Ende überträgt eure
Strecke eine unbekannte Datei Byte für Byte.

Das Gerät ist dabei nur der Anlass. Worum es eigentlich geht, ist, wie
Information digital dargestellt wird, wie man ein großes Problem in Stücke
zerlegt, die sich einzeln testen lassen, und wie man mit einem KI-Assistenten
programmiert, ohne ihm blind zu glauben. Licht eignet sich dafür, weil es
langsam und sichtbar ist: Was sonst unsichtbar im Rechner passiert, kann man
hier zusehen. Und weil kein Sprachmodell euren Aufbau kennt, müsst ihr das
Entscheidende messen, statt es zu erfragen.

## Phase 0: Das Gerät zum Leben erwecken {#start}

## Phase 1: Wie viele Farben kann der Sensor unterscheiden? {#alphabet}

## Phase 2: Aus Farben werden Buchstaben {#word}

## Phase 3: Ein Protokoll, das andere verstehen {#protocol}

## Phase 4: Eine ganze Datei {#packet}
