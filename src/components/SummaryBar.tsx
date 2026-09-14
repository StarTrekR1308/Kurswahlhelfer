import React from 'react';
import {
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
} from 'lucide-react';
import { ValidierungsErgebnis } from '../types';

interface SummaryBarProps {
  validation: ValidierungsErgebnis;
}

export const SummaryBar: React.FC<SummaryBarProps> = ({
  validation,
}) => {
  const {
    gueltig,
    anzahlLF,
    anzahlMuendlich,
    anzahlKurseGesamt,
    durchschnittWochenstunden,
    wochenstunden,
    anrechnungspflichtigCount,
    abiturFaecher,
    abgedeckteAufgabenfelder,
  } = validation;

  return (
    <div
      id="summary-banner"
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 transition-all mb-6"
    >
      {gueltig && (
        <div className="flex items-center gap-2.5 mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Deine gewählte Fächerkombination erfüllt alle Vorgaben der Prüfungsordnung (AGVO).</span>
        </div>
      )}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Leistungsfächer */}
        <div
          className={`p-3 rounded-xl border ${
            anzahlLF === 3
              ? 'bg-emerald-50/70 border-emerald-200'
              : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium">Leistungsfächer</span>
            <Award className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span
              className={`text-xl font-bold ${
                anzahlLF === 3 ? 'text-emerald-700' : 'text-slate-800'
              }`}
            >
              {anzahlLF}
            </span>
            <span className="text-xs text-slate-400">/ 3 nötig</span>
          </div>
          <p className="text-[11px] text-slate-500 truncate mt-0.5">
            {abiturFaecher.schriftlich.map((f) => f.name).join(', ') || 'Keine gewählt'}
          </p>
        </div>

        {/* Mündliche Prüfungen */}
        <div
          className={`p-3 rounded-xl border ${
            anzahlMuendlich === 2
              ? 'bg-emerald-50/70 border-emerald-200'
              : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium">Mündl. Prüfung</span>
            <Award className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span
              className={`text-xl font-bold ${
                anzahlMuendlich === 2 ? 'text-emerald-700' : 'text-slate-800'
              }`}
            >
              {anzahlMuendlich}
            </span>
            <span className="text-xs text-slate-400">/ 2 nötig</span>
          </div>
          <p className="text-[11px] text-slate-500 truncate mt-0.5">
            {abiturFaecher.muendlich.map((f) => f.name).join(', ') || 'Keine gewählt'}
          </p>
        </div>

        {/* Aufgabenfelder Abitur */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium">Abitur-Felder</span>
            <BookOpen className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div className="flex items-center gap-1 mt-1">
            {(['I', 'II', 'III'] as const).map((feld) => {
              const covered = abgedeckteAufgabenfelder.includes(feld);
              return (
                <span
                  key={feld}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    covered
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                  title={`Aufgabenfeld ${feld}: ${covered ? 'Abgedeckt' : 'Noch nicht vertreten'}`}
                >
                  {feld}
                </span>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {abgedeckteAufgabenfelder.length >= 3
              ? 'Alle 3 abgedeckt'
              : 'Feld I, II, III nötig'}
          </p>
        </div>

        {/* Kurse Gesamt */}
        <div
          className={`p-3 rounded-xl border ${
            anzahlKurseGesamt >= 42
              ? 'bg-emerald-50/70 border-emerald-200'
              : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium">Belegte Kurse</span>
            <BookOpen className="w-3.5 h-3.5 text-teal-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span
              className={`text-xl font-bold ${
                anzahlKurseGesamt >= 42 ? 'text-emerald-700' : 'text-slate-800'
              }`}
            >
              {anzahlKurseGesamt}
            </span>
            <span className="text-xs text-slate-400">/ 42 min</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {anzahlKurseGesamt >= 42
              ? 'Mindestzahl erfüllt'
              : `Noch ${42 - anzahlKurseGesamt} Kurse`}
          </p>
        </div>

        {/* Wochenstunden Schnitt */}
        <div
          className={`p-3 rounded-xl border ${
            durchschnittWochenstunden >= 32.0
              ? 'bg-emerald-50/70 border-emerald-200'
              : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium">Ø Wochenstd.</span>
            <Clock className="w-3.5 h-3.5 text-orange-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span
              className={`text-xl font-bold ${
                durchschnittWochenstunden >= 32.0
                  ? 'text-emerald-700'
                  : 'text-slate-800'
              }`}
            >
              {durchschnittWochenstunden.toFixed(1)}
            </span>
            <span className="text-xs text-slate-400">/ 32.0 min</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {wochenstunden[0]}/{wochenstunden[1]}/{wochenstunden[2]}/{wochenstunden[3]} Std.
          </p>
        </div>

        {/* Anrechnung Block I */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium">Anrechnung</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-slate-800">
              {anrechnungspflichtigCount}
            </span>
            <span className="text-xs text-slate-400">/ 40 Kurse</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {40 - anrechnungspflichtigCount >= 0
              ? `${40 - anrechnungspflichtigCount} frei wählbar`
              : 'Zu viele Pflichtkurse'}
          </p>
        </div>
      </div>
    </div>
  );
};
