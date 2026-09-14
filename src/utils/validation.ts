import { BelegtesFach, ValidierungsErgebnis, ValidierungsRegel, Aufgabenfeld } from '../types';

export function validateKurswahl(belegung: BelegtesFach[]): ValidierungsErgebnis {
  const regeln: ValidierungsRegel[] = [];

  // Helper counts
  const leistungsfaecher = belegung.filter((f) => f.typ === 'LF');
  const muendlicheFaecher = belegung.filter((f) => f.muendlich);
  const pruefungsfaecher = [...leistungsfaecher, ...muendlicheFaecher];

  // 1. Leistungsfächer Anzahl (genau 3)
  const lfCount = leistungsfaecher.length;
  const lfAnzahlOk = lfCount === 3;
  regeln.push({
    id: 'lf-anzahl',
    titel: '3 Leistungsfächer (LF, 5-stündig)',
    beschreibung: 'In der Kursstufe müssen genau drei 5-stündige Leistungsfächer gewählt werden.',
    erfuellt: lfAnzahlOk,
    statusText:
      lfCount === 3
        ? 'Genau 3 Leistungsfächer gewählt.'
        : lfCount < 3
        ? `Noch ${3 - lfCount} Leistungsfach/-fächer wählen.`
        : `${lfCount} Leistungsfächer gewählt (erlaubt sind genau 3).`,
    kategorie: 'leistungsfaecher',
    typ: lfAnzahlOk ? 'GUT' : 'SCHLECHT',
  });

  // 2. LF Kernfachkombination (mind. 2 aus D, M, FS, NW)
  const lfCoreSubjects = leistungsfaecher.filter((f) =>
    f.attribute.includes('Deutsch') ||
    f.attribute.includes('Mathematik') ||
    f.attribute.includes('Fremdsprache') ||
    f.attribute.includes('Naturwissenschaft')
  );
  const lfCoreOk = lfCount === 3 && lfCoreSubjects.length >= 2;
  regeln.push({
    id: 'lf-kombination',
    titel: '2 LF-Kernfächer (D, M, FS, NW)',
    beschreibung:
      'Mindestens zwei der drei Leistungsfächer müssen aus den Kernbereichen Deutsch, Fremdsprache, Mathematik oder klassische Naturwissenschaft (Bio, Chemie, Physik) stammen.',
    erfuellt: lfCoreOk,
    statusText: lfCoreOk
      ? `${lfCoreSubjects.length} von 3 Leistungsfächern sind Kernfächer (${lfCoreSubjects.map((f) => f.name).join(', ')}).`
      : lfCount === 3
      ? 'Ungültig: Mindestens zwei Leistungsfächer müssen Deutsch, Fremdsprache, Mathematik oder Naturwissenschaft sein.'
      : 'Wird bei 3 Leistungsfächern geprüft.',
    kategorie: 'leistungsfaecher',
    typ: lfCoreOk ? 'GUT' : 'SCHLECHT',
  });

  // 3. Mündliche Prüfungsfächer (genau 2)
  const muendlichCount = muendlicheFaecher.length;
  const muendlichOk = muendlichCount === 2;
  regeln.push({
    id: 'abitur-muendlich-anzahl',
    titel: '2 mündliche Prüfungsfächer',
    beschreibung:
      'Für die Abiturprüfung müssen neben den 3 schriftlichen Leistungsfächern genau zwei weitere Fächer (Basisfächer oder zugelassene Wahlfächer) für die mündliche Prüfung festgelegt werden.',
    erfuellt: muendlichOk,
    statusText:
      muendlichCount === 2
        ? `2 mündliche Prüfungsfächer gewählt (${muendlicheFaecher.map((f) => f.name).join(', ')}).`
        : muendlichCount < 2
        ? `Noch ${2 - muendlichCount} mündliche(s) Prüfungsfach/-fächer auswählen.`
        : `${muendlichCount} mündliche Prüfungen gewählt (nur 2 erlaubt).`,
    kategorie: 'abitur',
    typ: muendlichOk ? 'GUT' : 'SCHLECHT',
  });

  // 4. Deutsch & Mathematik als Prüfungsfächer
  const pruefungsNamen = pruefungsfaecher.map((f) => f.name);
  const hatDeutschPruefung = pruefungsNamen.includes('Deutsch');
  const hatMathePruefung = pruefungsNamen.includes('Mathematik');
  const deutschMatheOk = hatDeutschPruefung && hatMathePruefung;
  regeln.push({
    id: 'abitur-deutsch-mathe',
    titel: 'Deutsch & Mathematik in der Abiturprüfung',
    beschreibung:
      'Sowohl Deutsch als auch Mathematik müssen zwingend Abiturprüfungsfächer sein (entweder schriftlich als LF oder mündlich).',
    erfuellt: deutschMatheOk,
    statusText: deutschMatheOk
      ? 'Deutsch und Mathematik sind in den Abiturprüfungsfächern enthalten.'
      : !hatDeutschPruefung && !hatMathePruefung
      ? 'Weder Deutsch noch Mathematik sind als Prüfungsfach gewählt!'
      : !hatDeutschPruefung
      ? 'Deutsch fehlt noch als Abiturprüfungsfach (LF oder mündlich)!'
      : 'Mathematik fehlt noch als Abiturprüfungsfach (LF oder mündlich)!',
    kategorie: 'abitur',
    typ: deutschMatheOk ? 'GUT' : 'SCHLECHT',
  });

  // 5. Aufgabenfelder in den 5 Prüfungsfächern abdecken
  const pruefungsFelder = new Set(pruefungsfaecher.map((f) => f.aufgabenfeld));
  const alleDreiFelder = ['I', 'II', 'III'] as const;
  const fehlendeFelder = alleDreiFelder.filter((feld) => !pruefungsFelder.has(feld));
  const felderOk = fehlendeFelder.length === 0 && pruefungsfaecher.length === 5;
  regeln.push({
    id: 'abitur-aufgabenfelder',
    titel: 'Alle drei Aufgabenfelder im Abitur (I, II, III)',
    beschreibung:
      'Die fünf Abiturprüfungsfächer müssen alle drei Aufgabenfelder (I: Sprachlich-künstlerisch, II: Gesellschaftswissenschaftlich, III: MINT) abdecken.',
    erfuellt: felderOk,
    statusText: felderOk
      ? 'Alle drei Aufgabenfelder (I, II, III) sind in der Abiturprüfung vertreten.'
      : fehlendeFelder.length > 0
      ? `Fehlende Aufgabenfelder in der Abiturprüfung: Feld ${fehlendeFelder.join(', ')}.`
      : 'Prüfungsfächer noch unvollständig (3 LF + 2 mündlich erforderlich).',
    kategorie: 'abitur',
    typ: felderOk ? 'GUT' : 'SCHLECHT',
  });

  // 6. Sprachen & Naturwissenschaften Schwerpunkt
  const sprachen = belegung.filter((f) => f.attribute.includes('Fremdsprache'));
  const naturwissenschaften = belegung.filter(
    (f) => f.attribute.includes('Naturwissenschaft') || f.attribute.includes('kannNawiErsetzen')
  );
  const klassischeNawi = belegung.filter((f) => f.attribute.includes('Naturwissenschaft'));
  const nawiErsatz = belegung.filter((f) => f.attribute.includes('kannNawiErsetzen'));

  let sprachenNawiOk = false;
  let sprachenNawiText = '';
  if (sprachen.length === 0) {
    sprachenNawiText = 'Es wurde noch keine Fremdsprache gewählt.';
  } else if (naturwissenschaften.length === 0) {
    sprachenNawiText = 'Es wurde noch keine Naturwissenschaft gewählt.';
  } else if (sprachen.length < 2 && naturwissenschaften.length < 2) {
    sprachenNawiText =
      'Es müssen entweder mindestens 2 Fremdsprachen und 1 Naturwissenschaft belegt werden oder 1 Fremdsprache und 2 Naturwissenschaften.';
  } else if (klassischeNawi.length === 0) {
    sprachenNawiText =
      'Es muss mindestens eine klassische Naturwissenschaft (Biologie, Chemie, Physik) belegt werden.';
  } else {
    sprachenNawiOk = true;
    sprachenNawiText = `${sprachen.length} Fremdsprache(n) und ${naturwissenschaften.length} Naturwissenschaft(en) belegt.`;
  }

  regeln.push({
    id: 'belegung-sprachen-nawi',
    titel: 'Schwerpunkt Fremdsprachen / Naturwissenschaften',
    beschreibung:
      'Mindestens 2 Fremdsprachen + 1 Naturwissenschaft oder 1 Fremdsprache + 2 Naturwissenschaften (mind. 1 klassische NW: Bio/Chemie/Physik).',
    erfuellt: sprachenNawiOk,
    statusText: sprachenNawiText,
    kategorie: 'belegung',
    typ: sprachenNawiOk ? 'GUT' : 'SCHLECHT',
  });

  // 7. Pflichtfächer Belegung
  const hatGeschichte = belegung.some((f) => f.name === 'Geschichte');
  const hatGeo = belegung.some((f) => f.attribute.includes('Geo') || f.attribute.includes('GeGe'));
  const hatGk = belegung.some((f) => f.attribute.includes('Gk') || f.attribute.includes('GeGe'));
  const hatReliEthik = belegung.some((f) => f.attribute.includes('ReliEthik'));
  const hatMuKu = belegung.some((f) => f.attribute.includes('MuKu'));
  const hatSport = belegung.some((f) => f.attribute.includes('Sport'));

  const fehlendePflicht: string[] = [];
  if (!hatGeschichte) fehlendePflicht.push('Geschichte');
  if (!hatGeo) fehlendePflicht.push('Geographie');
  if (!hatGk) fehlendePflicht.push('Gemeinschaftskunde');
  if (!hatReliEthik) fehlendePflicht.push('Religion oder Ethik');
  if (!hatMuKu) fehlendePflicht.push('Bildende Kunst oder Musik');
  if (!hatSport) fehlendePflicht.push('Sport');

  const pflichtOk = fehlendePflicht.length === 0;
  regeln.push({
    id: 'belegung-pflichtfaecher',
    titel: 'Pflichtbelegung der Fächer',
    beschreibung:
      'Geschichte, Geographie, Gemeinschaftskunde, Religion/Ethik, Kunst/Musik sowie Sport müssen durchgehend bzw. nach Stundentafel belegt werden.',
    erfuellt: pflichtOk,
    statusText: pflichtOk
      ? 'Alle gesellschaftswissenschaftlichen und musisch-sportlichen Pflichtfächer sind belegt.'
      : `Fehlende Pflichtfächer: ${fehlendePflicht.join(', ')}.`,
    kategorie: 'belegung',
    typ: pflichtOk ? 'GUT' : 'SCHLECHT',
  });

  // 8. Mindestens 42 Kurse (Halbjahre)
  let anzahlKurseGesamt = 0;
  for (const f of belegung) {
    anzahlKurseGesamt += f.stunden.filter((h) => h > 0).length;
  }
  const min42Ok = anzahlKurseGesamt >= 42;
  regeln.push({
    id: 'kurse-anzahl',
    titel: 'Mindestens 42 belegte Halbjahreskurse',
    beschreibung:
      'In den vier Halbjahren der Kursstufe müssen insgesamt mindestens 42 Kurse (Halbjahresbelegungen) erfolgreich belegt werden.',
    erfuellt: min42Ok,
    statusText: min42Ok
      ? `Mit ${anzahlKurseGesamt} belegten Kursen ist die Mindestanzahl von 42 Kursen erfüllt.`
      : `Aktuell nur ${anzahlKurseGesamt} Kurse belegt. Es fehlen noch ${42 - anzahlKurseGesamt} Kurse.`,
    kategorie: 'stunden',
    typ: min42Ok ? 'GUT' : 'SCHLECHT',
  });

  // 9. Wochenstundendurchschnitt (mind. 32 h/Woche)
  const stundensumme: [number, number, number, number] = [0, 0, 0, 0];
  for (const f of belegung) {
    for (let i = 0; i < 4; i++) {
      stundensumme[i] += f.stunden[i];
    }
  }
  const gesamtStunden = stundensumme[0] + stundensumme[1] + stundensumme[2] + stundensumme[3];
  const durchschnittWochenstunden = Math.round((gesamtStunden / 4.0) * 10) / 10;
  const min32StdOk = durchschnittWochenstunden >= 32.0;

  regeln.push({
    id: 'stunden-durchschnitt',
    titel: 'Durchschnittlich mind. 32 Wochenstunden',
    beschreibung:
      'Der Unterrichtsumfang muss im Durchschnitt der vier Halbjahre mindestens 32 Wochenstunden betragen (mind. 128 Wochenstunden insgesamt).',
    erfuellt: min32StdOk,
    statusText: min32StdOk
      ? `Durchschnittlich ${durchschnittWochenstunden} Wochenstunden pro Halbjahr (J1.1: ${stundensumme[0]}h, J1.2: ${stundensumme[1]}h, J2.1: ${stundensumme[2]}h, J2.2: ${stundensumme[3]}h).`
      : `Durchschnittlich nur ${durchschnittWochenstunden} Wochenstunden pro Halbjahr. Es fehlen noch ${(32.0 - durchschnittWochenstunden) * 4} Wochenstunden.`,
    kategorie: 'stunden',
    typ: min32StdOk ? 'GUT' : 'SCHLECHT',
  });

  // 10. Anrechnungspflichtige Kurse (Block I: maximal 40 Kurse anrechnen)
  const anrechnungMap: Record<number, [number, number, number, number]> = {};
  let anrechnungCount = 0;

  let nawiSprZaehler = 0;
  let nawiZaehler = 0;
  let fsZaehler = 0;
  let reliZaehler = 0;
  let mukuSchonGeprueft = false;

  // Check if MuKu is LF or oral
  if (belegung.some((f) => f.attribute.includes('MuKu') && f.typ === 'LF')) {
    mukuSchonGeprueft = true;
  }
  if (belegung.some((f) => f.attribute.includes('MuKu') && f.muendlich)) {
    mukuSchonGeprueft = true;
  }

  // LF first
  for (const f of belegung) {
    if (f.typ === 'LF') {
      anrechnungMap[f.fachId] = [1, 1, 1, 1];
      anrechnungCount += 4;
      if (f.attribute.includes('Naturwissenschaft') || f.attribute.includes('kannNawiErsetzen')) {
        nawiSprZaehler++;
        nawiZaehler++;
      }
      if (f.attribute.includes('Fremdsprache')) {
        nawiSprZaehler++;
        fsZaehler++;
      }
    }
  }

  // Basisfächer
  for (const f of belegung) {
    if (f.typ === 'BF') {
      const belegteSem = f.stunden.filter((h) => h > 0).length;

      if (f.name === 'Deutsch') {
        anrechnungMap[f.fachId] = [1, 1, 1, 1];
        anrechnungCount += 4;
      } else if (f.name === 'Mathematik') {
        anrechnungMap[f.fachId] = [1, 1, 1, 1];
        anrechnungCount += 4;
      } else if (f.attribute.includes('Geschichte')) {
        anrechnungMap[f.fachId] = [1, 1, 1, 1];
        anrechnungCount += 4;
      } else if (f.attribute.includes('ReliEthik')) {
        const lfReli = belegung.some((b) => b.attribute.includes('ReliEthik') && b.typ === 'LF');
        if (!lfReli && reliZaehler === 0) {
          anrechnungMap[f.fachId] = [1, 1, 1, 1];
          anrechnungCount += 4;
          reliZaehler++;
        }
      } else if (f.attribute.includes('MuKu') && !mukuSchonGeprueft) {
        anrechnungMap[f.fachId] = [1, 1, 0, 0];
        anrechnungCount += 2;
        mukuSchonGeprueft = true;
      } else if (f.attribute.includes('Naturwissenschaft') || f.attribute.includes('kannNawiErsetzen')) {
        if (nawiSprZaehler < 3 && nawiZaehler < 2 && fsZaehler <= 2) {
          anrechnungMap[f.fachId] = [1, 1, 1, 1];
          anrechnungCount += 4;
          nawiSprZaehler++;
          nawiZaehler++;
        }
      } else if (f.attribute.includes('Fremdsprache')) {
        if (f.alternativStunden) {
          anrechnungMap[f.fachId] = [1, 1, 0, 0];
          anrechnungCount += 2;
        } else if (nawiSprZaehler < 3 && nawiZaehler <= 2 && fsZaehler < 2) {
          anrechnungMap[f.fachId] = [1, 1, 1, 1];
          anrechnungCount += 4;
          nawiSprZaehler++;
          fsZaehler++;
        }
      } else if (f.attribute.includes('Gk') || f.attribute.includes('Geo')) {
        const isGkInJ2 = f.attribute.includes('Gk') && f.stunden[0] === 0 && f.stunden[2] > 0;
        if (belegteSem === 1) {
          anrechnungMap[f.fachId] = isGkInJ2 ? [0, 0, 1, 0] : [1, 0, 0, 0];
          anrechnungCount += 1;
        } else if (belegteSem === 2) {
          anrechnungMap[f.fachId] = isGkInJ2 ? [0, 0, 1, 1] : [1, 1, 0, 0];
          anrechnungCount += 2;
        } else if (belegteSem === 3) {
          if (f.muendlich) {
            anrechnungMap[f.fachId] = [1, 0, 1, 1];
            anrechnungCount += 3;
          } else {
            anrechnungMap[f.fachId] = isGkInJ2 ? [0, 0, 1, 0] : [1, 0, 0, 0];
            anrechnungCount += 1;
          }
        } else if (belegteSem === 4) {
          if (f.muendlich) {
            anrechnungMap[f.fachId] = [1, 1, 1, 1];
            anrechnungCount += 4;
          } else {
            anrechnungMap[f.fachId] = [1, 1, 0, 0];
            anrechnungCount += 2;
          }
        }
      } else if (f.muendlich) {
        anrechnungMap[f.fachId] = [1, 1, 1, 1];
        anrechnungCount += 4;
      }
    } else if (f.typ === 'WF' && f.muendlich) {
      anrechnungMap[f.fachId] = [1, 1, 1, 1];
      anrechnungCount += 4;
    }
  }

  const anrechnungOk = anrechnungCount <= 40;
  regeln.push({
    id: 'anrechnung-kurse',
    titel: 'Anrechnungspflichtige Kurse (Block I, max. 40)',
    beschreibung:
      'Im Abitur-Block I werden genau 40 Kurse angerechnet. Die Pflichtbelegungen müssen abgedeckt sein (maximal 40 anrechnungspflichtige Kurse).',
    erfuellt: anrechnungOk,
    statusText:
      anrechnungCount === 40
        ? 'Genau 40 anrechnungspflichtige Kurse in der Belegung vorhanden.'
        : anrechnungCount < 40
        ? `Aktuell ${anrechnungCount} anrechnungspflichtige Kurse ermittelt. Weitere ${40 - anrechnungCount} Kurse können frei zur Notenoptimierung eingebracht werden.`
        : `Zu viele anrechnungspflichtige Kurse (${anrechnungCount} von maximal 40).`,
    kategorie: 'anrechnung',
    typ: anrechnungOk ? 'GUT' : 'SCHLECHT',
  });

  // Overall validity
  const gueltig = regeln.every((r) => r.erfuellt);

  return {
    gueltig,
    regeln,
    anzahlLF: lfCount,
    anzahlMuendlich: muendlichCount,
    anzahlKurseGesamt,
    wochenstunden: stundensumme,
    durchschnittWochenstunden,
    anrechnungspflichtigCount: anrechnungCount,
    anrechnungMap,
    abiturFaecher: {
      schriftlich: leistungsfaecher,
      muendlich: muendlicheFaecher,
    },
    abgedeckteAufgabenfelder: Array.from(pruefungsFelder),
    fehlendeAufgabenfelder: fehlendeFelder,
  };
}
