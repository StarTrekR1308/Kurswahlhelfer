import { BelegtesFach, Kursart } from '../types';
import { FACH_LISTE, WF_MUENDLICH_MOEGLICH, WF_ZWEI_KURSIG } from '../data/subjects';

const BS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz_-+;'.split('');

export function binarystring2Int(bs: string): number {
  let zahl = 0;
  let dummy = bs;
  let multiplikator = 1;
  while (dummy.length > 0) {
    if (dummy[dummy.length - 1] === '1') {
      zahl += multiplikator;
    }
    dummy = dummy.slice(0, -1);
    multiplikator *= 2;
  }
  return zahl;
}

export function int2Binarystring(val: number, length: number): string {
  const binary = val.toString(2);
  return binary.padStart(length, '0');
}

export function cut(str: string, number: number): string[] {
  const length = str.length;
  const remainder = length % number;
  const normalized = remainder === 0 ? str : '0'.repeat(number - remainder) + str;
  const result: string[] = [];
  for (let i = 0; i < normalized.length; i += number) {
    result.push(normalized.substring(i, i + number));
  }
  return result;
}

export function binarystring2Characterstring(input: string): string {
  if (!input) return '';
  const chunks = cut(input, 6);
  let ergebnis = '';
  for (const chunk of chunks) {
    ergebnis += BS[binarystring2Int(chunk)];
  }
  return ergebnis;
}

export function characterstring2Binarystring(input: string): string {
  if (!input) return '';
  let ergebnis = '';
  for (const char of input) {
    const idx = BS.indexOf(char);
    if (idx !== -1) {
      ergebnis += int2Binarystring(idx, 6);
    }
  }
  // Drop leading zeros
  const firstOne = ergebnis.indexOf('1');
  return firstOne === -1 ? '' : ergebnis.substring(firstOne);
}

export function serializeBelegung(belegung: BelegtesFach[]): string {
  let kodierung = '';
  for (const f of belegung) {
    const idBin = int2Binarystring(f.fachId, 6);
    let typBin = '10'; // default BF
    if (f.typ === 'LF') {
      typBin = '00';
    } else if (f.typ === 'BF') {
      typBin = f.muendlich ? '01' : '10';
    } else if (f.typ === 'WF') {
      typBin = f.muendlich ? '11' : '10';
    }
    const altBin = f.alternativStunden ? '1' : '0';
    kodierung += idBin + typBin + altBin;
  }
  return binarystring2Characterstring('1' + kodierung);
}

export function serializeExcludedList(excluded: number[]): string {
  if (!excluded || excluded.length === 0) return '';
  let str = '';
  for (const id of excluded) {
    str += int2Binarystring(id, 6);
  }
  return binarystring2Characterstring(str);
}

export function deserializeExcludedList(input: string): number[] {
  if (!input) return [];
  const bin = characterstring2Binarystring(input);
  if (!bin) return [];
  const chunks = cut(bin, 6);
  return chunks.map((c) => binarystring2Int(c));
}

export function deserializeBelegung(input: string): BelegtesFach[] {
  if (!input) return [];
  const bin = characterstring2Binarystring(input);
  if (!bin || bin.length <= 1) return [];
  const payload = bin.substring(1); // drop the leading '1'

  const result: BelegtesFach[] = [];
  const chunks: string[] = [];
  for (let i = 0; i < payload.length; i += 9) {
    if (i + 9 <= payload.length) {
      chunks.push(payload.substring(i, i + 9));
    }
  }

  for (const chunk of chunks) {
    const id = binarystring2Int(chunk.substring(0, 6));
    const typCode = chunk.substring(6, 8);
    const alt = chunk[8] === '1';

    const def = FACH_LISTE.find((f) => f.id === id);
    if (!def) continue;

    let typ: Kursart = 'BF';
    let muendlich = false;

    if (id < 32) {
      if (typCode === '00') {
        typ = 'LF';
      } else if (typCode === '01') {
        typ = 'BF';
        muendlich = true;
      } else {
        typ = 'BF';
      }
    } else {
      typ = 'WF';
      if (typCode === '11') {
        muendlich = true;
      }
    }

    const stunden = calculateSubjectHours(def, typ, alt);

    result.push({
      fachId: def.id,
      name: def.name,
      typ,
      aufgabenfeld: def.aufgabenfeld,
      muendlich,
      alternativStunden: alt,
      stunden,
      attribute: [...def.attribute],
    });
  }

  return result;
}

export function calculateSubjectHours(
  def: (typeof FACH_LISTE)[0],
  typ: Kursart,
  alternativ: boolean
): [number, number, number, number] {
  if (typ === 'LF') {
    return [5, 5, 5, 5];
  }

  if (typ === 'BF') {
    if (def.attribute.includes('Seminarfach')) {
      return [3, 3, 0, 0];
    }
    if (def.attribute.includes('Geo')) {
      // Default: J1 (J1.1 & J1.2). Alternativ: alle 4 Halbjahre (z.B. bilingual oder Abitur)
      return alternativ ? [2, 2, 2, 2] : [2, 2, 0, 0];
    }
    if (def.attribute.includes('Gk')) {
      // Default: J2 (J2.1 & J2.2). Alternativ: alle 4 Halbjahre
      return alternativ ? [2, 2, 2, 2] : [0, 0, 2, 2];
    }
    if (def.attribute.includes('spaetbeginnend') && alternativ) {
      return [4, 4, 4, 4];
    }
    const h = def.stunden[1] > 0 ? def.stunden[1] : 3;
    return [h, h, h, h];
  }

  // Wahlfach (WF)
  if (WF_ZWEI_KURSIG.has(def.name)) {
    return [2, 2, 0, 0];
  }
  if (WF_MUENDLICH_MOEGLICH.has(def.name) && alternativ) {
    return [2, 2, 0, 0];
  }
  return [2, 2, 2, 2];
}
