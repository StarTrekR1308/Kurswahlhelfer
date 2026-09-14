# Oberstufen-Kurswahlrechner Baden-Württemberg (BW AGVO)

Interaktiver Kurswahlrechner für die gymnasiale Oberstufe in Baden-Württemberg (Abiturverordnung Gymnasien der Normalform – AGVO, Abiturjahrgänge ab 2021).

---

## 🎨 UI, Konzeption & Autorenschaft

- **UI & Konzeption:** **Rufus Gerlinger** mit Unterstützung moderner KI
- **KI-Score:** **5 / 10** *(Ausdrücklich kein „pure AI slop“ – die Architektur, das AGVO-Regelwerk, die didaktische Benutzerführung, die Fachdatenlogik und die Workflows wurden maßgeblich von Hand konzipiert, strukturiert und mitprogrammiert).*

---

## 📜 Lizenz- und Nutzungsbedingungen (Attribution & Share-Alike / Free-to-Use)

Für dieses Projekt und alle darin enthaltenen Bestandteile, Konzepte und Designs gelten folgende verbindliche Bedingungen:

1. **Namensnennung (Attribution):**  
   Wann immer dieses Projekt, Teile davon, der Quellcode oder davon inspirierte/abgeleitete Software genutzt, weiterentwickelt, verändert oder als Vorlage verwendet wird, **muss Rufus Gerlinger stets und unübersehbar namentlich als Urheber / Schöpfer genannt werden**.

2. **Freie Zugänglichkeit & Kostenfreiheit (Share-Alike / Copyleft):**  
   Jede Person, Schule, Organisation oder Entwicklergruppe, die auf diesem Werk aufbaut oder davon abgeleitete Software erstellt, **muss das resultierende Projekt dauerhaft kostenfrei, öffentlich und frei zur Verfügung stellen**. Eine kommerzielle Verwertung hinter Bezahlschranken (Paywalls), der Verkauf oder die proprietäre Schließung des Quellcodes ist untersagt.

---

## 🚀 Wichtigste Funktionen

- **Echtes AGVO-Regelwerk Baden-Württemberg**:
  - Genau **3 Leistungsfächer (LF)** à 5 Wochenstunden.
  - Mindestens zwei LF aus Deutsch, Mathematik, einer Fremdsprache oder einer Naturwissenschaft.
  - Genau **2 mündliche Abiturprüfungsfächer** aus den belegten Basisfächern.
  - Vollständige Abdeckung aller drei Aufgabenfelder (I: Sprachen/Kunst, II: Gesellschaft, III: MINT) über die 5 Prüfungsfächer.
  - Mindestens **42 belegte Kurse** und genaue Ermittlung der 40 anrechnungspflichtigen Kurse für Block I.
- **NEU: Interaktives Wochenstunden-Balkendiagramm**:
  - Visualisiert die Semester-Wochenstunden für alle vier Halbjahre (**J1.1, J1.2, J2.1, J2.2**) sowie den Gesamtschnitt (**Ø**).
  - Gegenüberstellung mit dem **gesetzlichen Mindest-Soll (≥ 32.0 Std.)** und der **Richtwert-Obergrenze (38.0 Std.)**.
  - Farbliche Zustandskennzeichnung (Optimal, Unterdeckung, Hohe Last) zur Vermeidung von Überlastung und Semester-Ungleichgewichten.
- **NEU: 'Schritt-für-Schritt'-Tour-Guide**:
  - Interaktiver Onboarding-Walkthrough für neue Nutzer beim ersten Öffnen der Seite.
  - Erläutert in 5 klaren Schritten: Leistungsfächer, Basisfächer/Pflichtbereiche, mündliche Prüfungen, Kurslast-Diagramm sowie Regelprüfung und Export.
  - Jederzeit über den Button **„Tour“** in der Menüleiste oder über das Hilfemenü erneut startbar.
- **NEU: Schnellfilter & 'X'-Löschtaste**:
  - Schnelle Filter-Chips: *Alle Fächer*, *Pflichtfächer*, *Leistungsfächer (LF)*, *Mündl. Prüfung*, *Belegt*, *Feld I*, *Feld II*, *Feld III*, *Sport & Sonstige*.
  - Komfortabler **'X'-Button** direkt im Suchfeld zum sofortigen Leeren und Weitersuchen.
  - Trefferzähler und Ein-Klick-Zurücksetzen aktiver Filter.
- **Echter Fresh Start**:
  - Die Anwendung startet sauber und leer mit 0 vorausgewählten Dummy-Fächern.
  - Optionaler Schnellhelfer *„⚡ Pflichtfächer vorwählen“* zur bequemen Vorbelegung der 10 Kernfächer.
  - Bestätigungsdialog vor dem Zurücksetzen, um versehentliches Löschen zu verhindern.
- **Schulangebot anpassbar**:
  - Fächer, die an der eigenen Schule nicht angeboten werden (z. B. spezielle spätbeginnende Sprachen oder Orchideenfächer), können ausgeblendet werden.
- **Teilen & Drucken**:
  - Live-Serialisierung in den URL-Hash (kein Server oder Login erforderlich).
  - Druck- und PDF-Exportansicht des ausgefüllten Wahlbogens.

---

## 📋 Versionsverlauf (Changelog)

### Version 1.3.0 (Aktuell)
- **Feature (Balkendiagramm)**: Neues visuelles Balkendiagramm im Bereich der `SummaryBar` mit Semester-Wochenstunden (J1.1 bis J2.2 und Ø Gesamt) im direkten Vergleich zur Mindeststundenzahl (32h) und Höchstlastgrenze (38h).
- **Feature (Tour-Guide)**: Interaktiver Schritt-für-Schritt-Guide für Erstnutzer und Nachschlagende mit Erklärung der Leistungsfächer, Basisfächer, Abiturkriterien und Kurslastkontrolle.
- **Feature (Suche & Filter)**:
  - Ein-Klick-'X'-Löschbutton in der Suchleiste zum sofortigen Leeren des Textfeldes.
  - Erweiterte Filterleiste (Pflichtfächer, gewählte LF, mündliche Prüfungen, Aufgabenfelder, belegte Fächer) mit Zählern und Status-Badges.
- **Dokumentation & Lizenz**: Ausführliche README mit Versionsverlauf, Autorenhinweis (*Rufus Gerlinger*), KI-Score (5/10) sowie Attribution- und Copyleft-Lizenz.

### Version 1.2.0
- **Feature (Fresh Start)**: Vollständiger Start ohne Dummy-Vorauswahl mit leerem Wahlbogen.
- **Feature (Sicherheitsabfrage)**: Bestätigungs-Dialog vor dem Zurücksetzen der Kurswahl.
- **Feature (Schnellvorwahl)**: Optionaler Button *„⚡ Pflichtfächer vorwählen“* für schnellen Start mit den 10 BW-Pflichtfächern.
- **Verbesserung (Semesterstunden)**: Präzise baden-württembergische Stundenverteilung (Geographie in J1.1/J1.2, Gemeinschaftskunde in J2.1/J2.2; automatische 4-Halbjahres-Belegung bei Wahl als mündliches Prüfungsfach).

### Version 1.1.0
- **Feature (Stundenplan-Tabelle)**: Halbjahres-Matrixansicht zur Stundenverteilung der 4 Semester.
- **Feature (Block I Rechner)**: Automatische Ermittlung der 40 anrechnungspflichtigen Abiturkurse.
- **Feature (Schulfilter)**: Deaktivieren nicht angebotener Fächer für die eigene Schule.
- **Feature (URL-Sharing)**: Vollständige Serialisierung des Kurswahlstands im URL-Hash zum Speichern und Teilen ohne Backend.
- **Feature (Druckansicht)**: Formular-Layout für den offiziellen Schul-Wahlbogen.

### Version 1.0.0
- Erstveröffentlichung mit AGVO-Regelwerk für Baden-Württemberg.
- Prüfung der 3 Leistungsfächer (LF) und 2 mündlichen Prüfungsfächer.
- Aufgabenfeld-Prüfung (I, II, III).
- Belegungskontrolle von mindestens 42 Kursen.
