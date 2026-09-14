import React from 'react';
import { BelegtesFach, ValidierungsErgebnis } from '../types';
import { TableProperties, Check } from 'lucide-react';

interface SemesterTableProps {
  belegung: BelegtesFach[];
  validation: ValidierungsErgebnis;
}

export const SemesterTable: React.FC<SemesterTableProps> = ({
  belegung,
  validation,
}) => {
  const { wochenstunden, durchschnittWochenstunden, anrechnungMap, anrechnungspflichtigCount } =
    validation;

  // Sort subjects: LF first, then BF, then WF
  const sortedBelegung = [...belegung].sort((a, b) => {
    const order = { LF: 0, BF: 1, WF: 2 };
    if (order[a.typ] !== order[b.typ]) {
      return order[a.typ] - order[b.typ];
    }
    return a.name.localeCompare(b.name, 'de');
  });

  return (
    <div
      id="semester-table-card"
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6 overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <TableProperties className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">
              Semesterübersicht & Anrechnung in Block I
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Wochenstunden je Halbjahr (J1.1 bis J2.2). Blau markierte Kurse gehen in die 40 anzurechnenden Kurse ein.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 font-semibold border border-blue-200">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            {anrechnungspflichtigCount} / 40 Kurse angerechnet
          </span>
        </div>
      </div>

      <div className="overflow-x-auto -mx-5 px-5">
        <table className="w-full text-left text-sm border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-xs text-slate-600 font-semibold">
              <th className="py-2.5 px-3 rounded-l-lg">Fach</th>
              <th className="py-2.5 px-3">Kursart</th>
              <th className="py-2.5 px-3">Prüfung</th>
              <th className="py-2.5 px-3 text-center">J1.1</th>
              <th className="py-2.5 px-3 text-center">J1.2</th>
              <th className="py-2.5 px-3 text-center">J2.1</th>
              <th className="py-2.5 px-3 text-center">J2.2</th>
              <th className="py-2.5 px-3 text-right rounded-r-lg">Kurse</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedBelegung.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400 italic">
                  Noch keine Fächer belegt. Wähle unten Fächer aus.
                </td>
              </tr>
            ) : (
              sortedBelegung.map((fach) => {
                const anrechnung = anrechnungMap[fach.fachId] || [0, 0, 0, 0];
                const activeSemestersCount = fach.stunden.filter((h) => h > 0).length;

                return (
                  <tr key={fach.fachId} className="hover:bg-slate-50/60 transition-colors">
                    {/* Name */}
                    <td className="py-2.5 px-3 font-medium text-slate-900">
                      {fach.name}
                      <span className="ml-1.5 text-[10px] text-slate-400">
                        (Feld {fach.aufgabenfeld})
                      </span>
                    </td>

                    {/* Typ */}
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                          fach.typ === 'LF'
                            ? 'bg-blue-100 text-blue-800'
                            : fach.typ === 'BF'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {fach.typ}
                      </span>
                    </td>

                    {/* Prüfung */}
                    <td className="py-2.5 px-3">
                      {fach.typ === 'LF' ? (
                        <span className="text-xs font-semibold text-blue-700">
                          Schriftlich
                        </span>
                      ) : fach.muendlich ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700">
                          <Check className="w-3.5 h-3.5" /> Mündlich
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>

                    {/* Semester J1.1, J1.2, J2.1, J2.2 */}
                    {fach.stunden.map((std, idx) => {
                      const isAngerechnet = anrechnung[idx] === 1;
                      return (
                        <td key={idx} className="py-2.5 px-3 text-center">
                          {std === 0 ? (
                            <span className="text-slate-300 font-mono text-xs">-</span>
                          ) : (
                            <span
                              className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                                isAngerechnet
                                  ? 'bg-blue-600 text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                              title={
                                isAngerechnet
                                  ? `${std} Std. (wird in Block I angerechnet)`
                                  : `${std} Std. (Belegung)`
                              }
                            >
                              {std}
                            </span>
                          )}
                        </td>
                      );
                    })}

                    {/* Kurse Count */}
                    <td className="py-2.5 px-3 text-right font-semibold text-slate-700">
                      {activeSemestersCount}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-slate-300 bg-slate-50 font-bold text-slate-900">
              <td className="py-3 px-3">Summe Wochenstunden</td>
              <td colSpan={2} className="py-3 px-3 text-xs text-slate-500 font-normal">
                Ø {durchschnittWochenstunden.toFixed(1)} Std./Woche (mind. 32.0)
              </td>
              <td className="py-3 px-3 text-center text-blue-700 font-extrabold text-sm">
                {wochenstunden[0]}
              </td>
              <td className="py-3 px-3 text-center text-blue-700 font-extrabold text-sm">
                {wochenstunden[1]}
              </td>
              <td className="py-3 px-3 text-center text-blue-700 font-extrabold text-sm">
                {wochenstunden[2]}
              </td>
              <td className="py-3 px-3 text-center text-blue-700 font-extrabold text-sm">
                {wochenstunden[3]}
              </td>
              <td className="py-3 px-3 text-right text-emerald-700 font-extrabold text-sm">
                {validation.anzahlKurseGesamt}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
