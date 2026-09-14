export type Aufgabenfeld = 'I' | 'II' | 'III' | 'Sport' | 'Seminarfach';

export type Kursart = 'LF' | 'BF' | 'WF';

export type Fachattribut =
  | 'Naturwissenschaft'
  | 'NawiFe'
  | 'Deutsch'
  | 'Fremdsprache'
  | 'Mathematik'
  | 'kannNawiErsetzen'
  | 'Seminarfach'
  | 'GeGe'
  | 'Geschichte'
  | 'MuKu'
  | 'muendlichePruefung'
  | 'spaetbeginnend'
  | 'Orchidee'
  | 'Geo'
  | 'Gk'
  | 'ReliEthik'
  | 'Sport';

export interface FachDefinition {
  id: number;
  name: string;
  aufgabenfeld: Aufgabenfeld;
  stunden: [number, number, number]; // [LF, BF, WF]
  attribute: Fachattribut[];
  pflicht: boolean;
  description?: string;
  category?: 'Hauptfach' | 'Sprache' | 'Kunst/Musik' | 'Gesellschaft' | 'MINT' | 'Sport' | 'Wahlfach' | 'Seminarfach';
}

export interface BelegtesFach {
  fachId: number;
  name: string;
  typ: Kursart;
  aufgabenfeld: Aufgabenfeld;
  muendlich: boolean;
  alternativStunden: boolean;
  stunden: [number, number, number, number]; // 4 Halbjahre (J1.1, J1.2, J2.1, J2.2)
  attribute: Fachattribut[];
}

export type KommentarTyp = 'GUT' | 'SCHLECHT' | 'NEUTRAL' | 'HINWEIS';

export interface ValidierungsRegel {
  id: string;
  titel: string;
  beschreibung: string;
  erfuellt: boolean;
  statusText: string;
  kategorie: 'leistungsfaecher' | 'abitur' | 'belegung' | 'stunden' | 'anrechnung';
  typ: KommentarTyp;
}

export interface ValidierungsErgebnis {
  gueltig: boolean;
  regeln: ValidierungsRegel[];
  anzahlLF: number;
  anzahlMuendlich: number;
  anzahlKurseGesamt: number;
  wochenstunden: [number, number, number, number];
  durchschnittWochenstunden: number;
  anrechnungspflichtigCount: number;
  anrechnungMap: Record<number, [number, number, number, number]>;
  abiturFaecher: {
    schriftlich: BelegtesFach[];
    muendlich: BelegtesFach[];
  };
  abgedeckteAufgabenfelder: Aufgabenfeld[];
  fehlendeAufgabenfelder: ('I' | 'II' | 'III')[];
}

export interface ProfilPreset {
  id: string;
  name: string;
  untertitel: string;
  beschreibung: string;
  badge: string;
  faecher: {
    name: string;
    typ: Kursart;
    muendlich?: boolean;
    alternativ?: boolean;
  }[];
}
