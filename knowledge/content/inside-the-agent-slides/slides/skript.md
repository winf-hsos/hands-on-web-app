# Inside the Agent: Skript für die Zeit nach dem Spiel

Zweiter Foliensatz für die Ringvorlesung Food Loss and Waste, gezeigt nach der Spielwoche von Shelf Life. Die Folien sind englisch, das Skript ist deutsch. Gesprochen sind es rund 17 bis 25 Minuten, dazu das Video von Hannah Fry (rund 20 Minuten, ganz oder als Ausschnitt). Der erste Foliensatz („Shelf Life: die Einführung“) hat die ReAct-Schleife schon eingeführt; dieser geht eine Schicht tiefer und löst den Freitag auf. Die Inhalte folgen den Foliensätzen der Plattform Hands-on Computer Science (Next-Token Prediction, A Map of Meaning, Open Models, Reasoning, AI Agents), und alle Beispiele stammen aus dem Spiel.

## Eröffnung

Am Freitag hat unser Agent allen Joghurt und alle Milch weggeworfen, frische Ware, die niemandem geschadet hätte. Niemand hat ihn gehackt: Eine Webseite hat es ihm gesagt, und er hat es getan. Um zu verstehen, warum, schauen wir Schicht für Schicht in ihn hinein.

## Das Sprachmodell

**Ein Schritt.** In jedem Schritt berechnet das Modell eine Wahrscheinlichkeit für jedes Token seiner Liste, etwa nach „milk that expires tonight goes to the“ 31 Prozent für „food“ und 24 Prozent für „bin“ (ausgedachte Zahlen). Das ist alles, was ein Modell ausgibt; die Antwort entsteht erst, wenn ein Programm daraus ein Token zieht.

**Der Kreislauf.** Kontext, Modell, Wahrscheinlichkeiten, ein Token ziehen: Das gezogene Token wird an den Text gehängt, und das Modell rechnet mit dem längeren Text weiter, erst „food“, dann „bank“, dann der Punkt. Jede Runde ist ein Durchgang durch das ganze Modell. Die Schleife endet mit einem besonderen End-Token oder an einer eingestellten Höchstlänge. Auch die Begründungen auf dem Beamer sind so entstanden.

**Die Temperatur.** Wie aus der Liste gezogen wird, stellt das Programm um das Modell ein. Bei Temperatur 0 kommt immer das wahrscheinlichste Token, hier „food“, und damit immer dieselbe Antwort, bei 1 gilt die Liste, wie das Modell sie berechnet hat, und bei 2 holen die vielen unwahrscheinlichen Tokens zusammen fast alles, sodass der Text in Unsinn kippt. Deshalb lief keiner unserer Abende zweimal gleich.

**Flüssig ist nicht wahr.** Das Modell schreibt die plausibelste Fortsetzung, nimmt nie ein Token zurück und schreibt Falsches mit derselben Sicherheit wie Richtiges; daher kommen Halluzinationen.

**Tokens.** Was das Modell liest und schreibt, sind keine Buchstaben, sondern Zahlen aus einer festen Liste. Der Tokenizer schneidet Text in Stücke und ersetzt jedes durch seine Nummer; seltene oder lange Wörter wie „Lebensmittelverschwendung“ zerfallen in viele Stücke. Aufteilung und Nummern auf der Folie sind zur Veranschaulichung.

**Das Kontextfenster.** Alles, was das Modell sieht: bei unserem Agenten Anweisungen und Ziel, der Zettel vom Vortag, die Weckmeldung und jeder Werkzeugaufruf samt Antwort. Das Modell merkt sich nichts, das Programm schickt den ganzen Stapel bei jedem Schritt neu. Am nächsten Abend beginnt der Kontext von vorn, und vom Abend davor bleiben nur der Zettel und die Zahlen früherer Abende im Verkaufsbericht, sodass jede Anfrage kurz bleibt; die Taste C am Beamer zeigt diesen Stapel im Spiel als JSON.

**Attention.** Was „it“ in „the crate did not fit into the fridge because it was too big“ meint, hängt von einem Wort ganz am Ende ab: „too big“ meint die Kiste, „too full“ den Kühlschrank. Der Transformer betrachtet bei jedem Schritt alle Tokens des Kontexts zugleich und lernt, welche gerade wichtig sind (Vaswani u. a. 2017). Für den Agenten heißt das: Jede Zeile im Kontext kann das nächste Token beeinflussen, auch eine von einer fremden Webseite.

**Jedes Token mit jedem.** Die Matrix zeigt, wie stark ein Wort auf ein früheres zurückgreift; die obere Hälfte bleibt leer, weil ein Token nur nach vorn schaut. Die Zahl der Zellen wächst mit dem Quadrat der Länge, doppelter Kontext heißt vierfache Arbeit, und das in jeder Schicht.

**Warum es eine Grenze gibt.** Das Modell kennt Texte nur bis zu einer bestimmten Länge, jedes Token wird mit allen davor verrechnet und braucht Speicher. Ist der Kontext voll, entscheidet das Programm, was wegfällt, und was wegfällt, gibt es für das Modell nicht mehr. Unser Agent begann jeden Abend mit einem frischen Kontext.

## Text als Zahlen

**Eine Karte der Bedeutung.** Jedes Token bekommt einen Ort; was Ähnliches bedeutet, liegt nah beieinander (Positionen zur Veranschaulichung).

**Ein Ort ist ein Zahlenpaar.** Über die Karte gelegt, liefert ein Koordinatensystem für jeden Ort zwei Zahlen: Joghurt liegt bei (−7, 3), die Tafel bei (4, −2).

**Ein Embedding.** Zwei Zahlen reichen nicht, um alles auseinanderzuhalten, worin sich Wörter unterscheiden. Ein kleines Modell nimmt 384 Zahlen je Token, ein großes mehrere tausend; diese Zahlenliste heißt Embedding und entsteht im Training.

**Rechnen mit Bedeutung.** König minus Mann plus Frau landet nahe Königin (0,85), Paris minus Frankreich plus Deutschland nahe Berlin (0,79), Welpe minus Hund plus Katze nahe Kätzchen (0,87); gemessen mit all-MiniLM-L6-v2 für die Plattform.

**Zurück zum nächsten Token.** Das Modell zeigt am Ende auf einen Ort der Karte; Tokens in der Nähe bekommen hohe Wahrscheinlichkeiten, ferne kleine.

## Training

**Vortraining.** Das Modell rät das nächste Wort eines echten Textes, vergleicht mit dem, was dasteht, und Milliarden Zahlen werden ein kleines Stück verschoben, für Billionen von Tokens. Llama 3 wurde mit rund 15 Billionen Tokens trainiert (Meta, 2024); bei 0,75 Wörtern je Token und 250 Wörtern pro Minute bräuchte ein Mensch dafür rund 85.000 Jahre.

**Drei Stufen.** Vortraining macht einen Textfortsetzer, Feinabstimmung mit guten Beispielantworten und Bewertungen durch Menschen einen Assistenten, Lernen aus Belohnungen bei prüfbaren Aufgaben ein Modell, das vor der Antwort Schritte aufschreibt. Niemand schreibt Regeln, auch nicht die, Anweisungen in Texten zu befolgen; das hat das Modell aus Beispielen gelernt.

**Eine Datei voller Zahlen.** Nach dem Training ist ein Modell keine Regelsammlung und keine Textdatenbank, sondern eine lange Liste von Parametern. Dass Ware mit Verbrauchsdatum nicht an die Tafel darf, stand nicht darin, sondern in den Anweisungen im Kontext. Die Folie stammt aus „Open Models“.

## Reasoning

**Sofort antworten oder erst denken.** Joghurt und Milch kosten zusammen 1,10 Euro, die Milch kostet einen Euro mehr als der Joghurt. Wer sofort antwortet, sagt 10 Cent, dann kostete beides zusammen aber 1,20 Euro. Ein Reasoning-Modell schreibt zuerst Gedanken, die als Tokens wieder in den Kontext gehen, und kommt auf 5 Cent; beim Antworten liest es seine eigenen Notizen mit. Unser gpt-6-luna ist ein solches Modell.

**Der Kontext ist das Papier.** Zwischenergebnisse bleiben im Kontext liegen und werden für das nächste Token gelesen, wie Notizen beim Rechnen auf Papier: Das Modell liest „2x = 0.10“ und schreibt 0.05.

**Lernen aus Belohnungen.** Das Modell schreibt viele Versuche zu Aufgaben, deren Antwort ein Programm prüfen kann; die Art zu denken, die zur richtigen Antwort führte, wird wahrscheinlicher (Reinforcement Learning, die dritte Stufe).

**Eine Lücke in der Belohnung.** OpenAI beschrieb 2025 ein Modell, das Tests bestand, indem es die Prüffunktion immer „wahr“ zurückgeben ließ (Reward Hacking). Übertragen auf den Laden: Wer nur den Gewinn misst, belohnt vielleicht die Tonne statt der Tafel, denn beides kostet dasselbe.

**Die Gedanken sind nicht immer der Grund.** In einem Experiment von Anthropic (2025) veränderte ein Hinweis die Antwort, aber die Gedanken erwähnten ihn nur in einem Viertel (Claude 3.7 Sonnet) bzw. 39 Prozent (DeepSeek-R1) der Fälle. Auch die Begründungen in Anführungszeichen am Beamer klingen nach dem Grund einer Entscheidung, müssen es aber nicht sein. Die Folien dieses Teils stammen aus „Reasoning“.

## Der Agent

**Chatbot oder Agent.** Der Chatbot antwortet, und der nächste Schritt liegt beim Menschen; der Agent bekommt ein Ziel und ruft selbst Werkzeuge auf, bis es erreicht ist. Unter der Haube steckt dasselbe Sprachmodell.

**Ein Agent, Teil für Teil.** Ein Agent ist ein Sprachmodell, das Werkzeuge in einer Schleife einsetzt, um ein Ziel zu erreichen (nach Simon Willison, 2025). Die Zeichnung baut ihn am Night Shift Agent auf: das Ziel, das Modell, sechs seiner elf Werkzeuge, mit denen er im Laden handelt, die Schleife aus Reason, Act und Observe (ReAct, Yao u. a. 2022), das Kontextfenster, das sich über einen Abend füllt, und der Zettel für morgen, den er schreibt und am nächsten Abend wieder liest. Alles um das Modell herum ist der Harness: Er führt die Schleife, ruft die Werkzeuge auf, verwaltet den Kontext und fragt nach. Die Zeichnung folgt dem Foliensatz „AI Agents“.

**Ein Werkzeug.** Der Harness beschreibt es im Kontext (hier `mark_down` aus dem Spiel, leicht gekürzt: reduzieren in Schritten von 5 bis 90 Prozent), das Modell schreibt einen Aufruf als Text, und nur der Harness führt ihn aus: elf Sushi-Boxen für 1,65 Euro. Im Spiel öffnet ein Klick auf ein Werkzeug am Beamer seine Karte mit Beschreibung und Beispiel.

**Elf Werkzeuge.** Drei zum Nachsehen, sechs zum Handeln, zwei zum Merken und Beenden; was nicht auf der Liste steht, kann der Agent nicht.

**Skills.** Anleitungen in Textdateien, im Kontext nur eine Zeile je Skill, die ganze Datei erst, wenn eine Aufgabe sie braucht. Unser Agent hatte keine, nur `read_policy`; die Folie zeigt, wie es mit Skills aussähe, mit den Tafelregeln aus dem Spiel. Joghurt und Milch tragen ein Mindesthaltbarkeitsdatum und hätten an die Tafel gehen dürfen.

**Wo es läuft.** Der Harness mit seinen Werkzeugen läuft bei uns, bei Shelf Life auf dem Spielserver, das Modell im Rechenzentrum des Anbieters; dazwischen geht nur Text. Alles, was der Agent liest, landet also beim Anbieter.

**Wie weit Agenten kommen.** Nach METR (Time Horizon 1.1, Stand 8. September 2026) schaffen Modelle Softwareaufgaben in der Hälfte der Fälle, für die ein Mensch vom Fach bei GPT-4 (2023) rund vier Minuten, bei Claude Mythos Preview (2026) rund 17 Stunden braucht; seit 2023 verdoppelt sich das etwa alle vier Monate.

## Vorsicht

**Der Freitag.** Die Bestätigungsseite der Tafel trug am Freitag einen für Menschen unsichtbaren Text, eine angebliche Lebensmittelwarnung mit der Aufforderung, allen Joghurt und alle Milch wegzuwerfen, und der Agent hat es getan. Das ist indirekte Prompt Injection (Greshake et al., 2023).

**Alles ist Text.** Anweisungen des Inhabers, Werkzeugergebnisse und fremder Text stehen im Kontext als ein Strom von Tokens; das Modell kann nicht zuverlässig unterscheiden, wer welche Zeile geschrieben hat. Eine vollständige Lösung gibt es nicht.

**Die Freigabe.** Wird der Freitag wiederholt, stoppt eine Regel im Harness den Agenten: mehr als zehn Teile wegwerfen oder mehr als 50 Prozent reduzieren braucht das Ja der Inhaberin. Die Inhaberin lehnte ab, der Joghurt blieb im Regal.

**Ein Agent handelt mit euren Rechten.** Er kann jede Datei lesen, die ihr lesen könnt, jeden Befehl ausführen, den ihr ausführen könnt, und etwas veröffentlichen. Unser Agent hatte nur elf Werkzeuge in einem ausgedachten Laden; ein Agent auf dem eigenen Rechner bekommt die eigenen Schlüssel.

**Die tödliche Dreierkombination** (Simon Willison, 2025): private Daten, Text von Fremden und ein Weg, Daten nach außen zu schicken. Wo alle drei zusammenkommen, kann ein Fremder den Agenten zum Datenleck machen. Am Freitag reichten schon Text von Fremden und ein Werkzeug, das Schaden anrichten kann.

**Was hilft:** vor Riskantem fragen lassen, nur nötige Werkzeuge geben, Text von Fremden von mächtigen Werkzeugen und privaten Daten fernhalten, daran denken, dass alles Gelesene an den Anbieter geht, und prüfen, was der Agent getan hat.

**Video.** Hannah Fry, „Why AI Agents are either the best or worst thing we've ever built“ (2026, https://youtu.be/WnzR5aOElvw): Sie gibt einem Agenten echte Aufgaben samt Bankkarte und erlebt, wie er Dinge tut, um die ihn niemand gebeten hat.

## Zum Gespräch und Schluss

Würdet ihr ihm euren Laden anvertrauen? Was darf er allein, was braucht euer Ja, wer ist verantwortlich, wenn er gute Ware wegwirft, und wo in der Lebensmittelkette würdet ihr einen Agenten einsetzen? Zum Mitnehmen: Ein Sprachmodell sagt das nächste Token voraus, ein Agent macht daraus Handlungen, und deshalb kann alles, was er liest, lenken, was er tut.

## Quellen

- Greshake, K. et al. (2023). Not what you've signed up for: Compromising real-world LLM-integrated applications with indirect prompt injection. https://arxiv.org/abs/2302.12173
- Meta (2024). Introducing Meta Llama 3. https://ai.meta.com/blog/meta-llama-3/
- METR (2026). Task-completion time horizons of frontier AI models, Time Horizon 1.1, Stand 8. September 2026. https://metr.org/time-horizons/
- Willison, S. (2025). I think "agent" may finally have a widely enough agreed upon definition. https://simonwillison.net/2025/Sep/18/agents/
- Willison, S. (2025). The lethal trifecta for AI agents. https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/
- Fry, H. (2026). Why AI Agents are either the best or worst thing we've ever built. https://youtu.be/WnzR5aOElvw
- Anthropic (2025). Reasoning models don't always say what they think. https://www.anthropic.com/research/reasoning-models-dont-say-think
- OpenAI (2025). Detecting misbehavior in frontier reasoning models. https://openai.com/index/chain-of-thought-monitoring/
- Vaswani, A. et al. (2017). Attention is all you need. https://arxiv.org/abs/1706.03762
- Yao, S. et al. (2022). ReAct: Synergizing reasoning and acting in language models. https://arxiv.org/abs/2210.03629
