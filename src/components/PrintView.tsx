import React, { useState } from 'react';
import { Printer, X, Download } from 'lucide-react';
import { BelegtesFach, ValidierungsErgebnis } from '../types';

interface PrintViewProps {
  isOpen: boolean;
  onClose: () => void;
  belegung: BelegtesFach[];
  validation: ValidierungsErgebnis;
}

export const PrintView: React.FC<PrintViewProps> = ({
  isOpen,
  onClose,
  belegung,
  validation,
}) => {
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('Klasse 10 / Kursstufe 1');
  const [schoolName, setSchoolName] = useState('Gymnasium');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const sortedBelegung = [...belegung].sort((a, b) => {
    const order = { LF: 0, BF: 1, WF: 2 };
    if (order[a.typ] !== order[b.typ]) {
      return order[a.typ] - order[b.typ];
    }
    return a.name.localeCompare(b.name, 'de');
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div
        id="print-modal-container"
        className="bg-white rounded-3xl border border-slate-300 shadow-2xl max-w-4xl w-full my-auto flex flex-col max-h-[96vh] overflow-hidden"
      >
        {/* Top Control Bar (Hidden during print) */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50 print:hidden shrink-0">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Druckansicht: Offizieller Kurswahlbogen (AGVO BW)
            </h3>
            <p className="text-xs text-slate-500">
              Passe deine Schülerdaten an und drucke den Bogen oder speichere ihn als PDF.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Drucken / Als PDF speichern</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Inputs (Hidden during print) */}
        <div className="p-4 bg-blue-50/60 border-b border-blue-200 grid grid-cols-1 sm:grid-cols-3 gap-3 print:hidden shrink-0 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Name, Vorname der Schülerin / des Schülers:
            </label>
            <input
              type="text"
              placeholder="z.B. Mustermann, Max"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Aktuelle Klasse / Jahrgangsstufe:
            </label>
            <input
              type="text"
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Schule / Gymnasium:
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800"
            />
          </div>
        </div>

        {/* Printable Document Area */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-white text-slate-900 print:p-0 print:m-0">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-3 mb-4 flex items-start justify-between">
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 uppercase">
                Kurswahlbogen Gymnasiale Oberstufe
              </h1>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">
                Verordnung des Kultusministeriums über die Jahrgangsstufen und die Abiturprüfung an
                Gymnasien (AGVO Baden-Württemberg)
              </p>
            </div>
            <div className="text-right text-xs">
              <span className="font-bold text-slate-800 block">{schoolName}</span>
              <span className="text-slate-500">Abiturjahrgang ab 2021/2025</span>
            </div>
          </div>

          {/* Student Info Box */}
          <div className="grid grid-cols-2 gap-4 p-3 rounded-lg border border-slate-300 mb-4 text-xs bg-slate-50/50">
            <div>
              <span className="text-slate-500 font-medium">Name, Vorname:</span>
              <p className="font-bold text-sm text-slate-900">
                {studentName || '_________________________________'}
              </p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Klasse / Jahrgangsstufe:</span>
              <p className="font-bold text-sm text-slate-900">{studentClass}</p>
            </div>
          </div>

          {/* Abitur Prüfung Summary Box */}
          <div className="border border-slate-300 rounded-lg p-3 mb-4 text-xs bg-slate-50">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5">
              Festlegung der 5 Abiturprüfungsfächer:
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="font-semibold text-slate-700">3 Schriftliche Prüfungen (LF):</span>
                <p className="font-bold text-blue-900 text-sm mt-0.5">
                  {validation.abiturFaecher.schriftlich.map((f) => `${f.name} (5h)`).join(', ') ||
                    'Noch nicht vollständig'}
                </p>
              </div>
              <div>
                <span className="font-semibold text-slate-700">2 Mündliche Prüfungen:</span>
                <p className="font-bold text-indigo-900 text-sm mt-0.5">
                  {validation.abiturFaecher.muendlich.map((f) => f.name).join(', ') ||
                    'Noch nicht vollständig'}
                </p>
              </div>
            </div>
          </div>

          {/* Subject Matrix Table */}
          <table className="w-full text-xs text-left border-collapse border border-slate-300 mb-4">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <th className="py-1.5 px-2 border-r border-slate-300">Fach</th>
                <th className="py-1.5 px-2 border-r border-slate-300">Feld</th>
                <th className="py-1.5 px-2 border-r border-slate-300">Kursart</th>
                <th className="py-1.5 px-2 border-r border-slate-300">Abiturprüfung</th>
                <th className="py-1.5 px-2 text-center border-r border-slate-300">J1.1</th>
                <th className="py-1.5 px-2 text-center border-r border-slate-300">J1.2</th>
                <th className="py-1.5 px-2 text-center border-r border-slate-300">J2.1</th>
                <th className="py-1.5 px-2 text-center border-r border-slate-300">J2.2</th>
                <th className="py-1.5 px-2 text-right">Kurse</th>
              </tr>
            </thead>
            <tbody>
              {sortedBelegung.map((fach) => {
                const count = fach.stunden.filter((h) => h > 0).length;
                return (
                  <tr key={fach.fachId} className="border-b border-slate-200">
                    <td className="py-1.5 px-2 font-medium border-r border-slate-200">
                      {fach.name}
                    </td>
                    <td className="py-1.5 px-2 border-r border-slate-200">
                      {fach.aufgabenfeld}
                    </td>
                    <td className="py-1.5 px-2 font-bold border-r border-slate-200">
                      {fach.typ}
                    </td>
                    <td className="py-1.5 px-2 border-r border-slate-200 font-medium">
                      {fach.typ === 'LF'
                        ? 'Schriftlich (LF)'
                        : fach.muendlich
                        ? 'Mündlich'
                        : '—'}
                    </td>
                    <td className="py-1.5 px-2 text-center border-r border-slate-200 font-mono">
                      {fach.stunden[0] || '—'}
                    </td>
                    <td className="py-1.5 px-2 text-center border-r border-slate-200 font-mono">
                      {fach.stunden[1] || '—'}
                    </td>
                    <td className="py-1.5 px-2 text-center border-r border-slate-200 font-mono">
                      {fach.stunden[2] || '—'}
                    </td>
                    <td className="py-1.5 px-2 text-center border-r border-slate-200 font-mono">
                      {fach.stunden[3] || '—'}
                    </td>
                    <td className="py-1.5 px-2 text-right font-bold">{count}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-extrabold border-t border-slate-300 text-slate-900">
                <td colSpan={4} className="py-2 px-2 border-r border-slate-300">
                  Summe Wochenstunden (Ø {validation.durchschnittWochenstunden.toFixed(1)} Std.)
                </td>
                <td className="py-2 px-2 text-center border-r border-slate-300">
                  {validation.wochenstunden[0]}
                </td>
                <td className="py-2 px-2 text-center border-r border-slate-300">
                  {validation.wochenstunden[1]}
                </td>
                <td className="py-2 px-2 text-center border-r border-slate-300">
                  {validation.wochenstunden[2]}
                </td>
                <td className="py-2 px-2 text-center border-r border-slate-300">
                  {validation.wochenstunden[3]}
                </td>
                <td className="py-2 px-2 text-right text-blue-800 font-extrabold">
                  {validation.anzahlKurseGesamt}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Validation Status Notice */}
          <div className="mb-6 text-[11px] text-slate-600">
            <strong>Gültigkeitsprüfung: </strong>
            {validation.gueltig ? (
              <span className="text-emerald-700 font-bold">
                ✓ Die Wahl erfüllt alle formalen Bestimmungen der AGVO Baden-Württemberg.
              </span>
            ) : (
              <span className="text-amber-700 font-bold">
                ⚠ Die Wahl enthält noch offene Kriterien und muss vor Abgabe korrigiert werden.
              </span>
            )}
          </div>

          {/* Signature Fields */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-300 text-xs">
            <div>
              <div className="h-10 border-b border-slate-400"></div>
              <p className="mt-1 text-slate-500 font-medium">
                Datum, Unterschrift Schülerin/Schüler
              </p>
            </div>
            <div>
              <div className="h-10 border-b border-slate-400"></div>
              <p className="mt-1 text-slate-500 font-medium">
                Datum, Unterschrift Erziehungsberechtigte
              </p>
            </div>
            <div>
              <div className="h-10 border-b border-slate-400"></div>
              <p className="mt-1 text-slate-500 font-medium">
                Geprüft: Oberstufenberater / Schule
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
