import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  BookOpen,
  Award,
  ChevronDown,
  ChevronUp,
  TableProperties,
  BarChart2,
} from 'lucide-react';
import { ValidierungsErgebnis } from '../types';
import { WeeklyHoursChart } from './WeeklyHoursChart';

interface SummaryBarProps {
  validation: ValidierungsErgebnis;
  isValidationOpen: boolean;
  onToggleValidation: () => void;
  isSemesterViewOpen: boolean;
  onToggleSemesterView: () => void;
  belegungCount?: number;
  onPrefillMandatory?: () => void;
}

export const SummaryBar: React.FC<SummaryBarProps> = ({
  validation,
  isValidationOpen,
  onToggleValidation,
  isSemesterViewOpen,
  onToggleSemesterView,
  belegungCount = 0,
  onPrefillMandatory,
}) => {
  const [isChartVisible, setIsChartVisible] = useState(true);
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
    regeln,
  } = validation;

  const unerfuellteRegeln = regeln.filter((r) => !r.erfuellt);
  const isFresh = belegungCount === 0;

  return (
    <div
      id="summary-banner"
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 transition-all mb-6"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Status Pill & Message */}
        <div className="flex items-start sm:items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
              gueltig
                ? 'bg-emerald-100 text-emerald-700'
                : isFresh
                ? 'bg-blue-100 text-blue-700'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            {gueltig ? (
              <CheckCircle2 className="w-7 h-7" />
            ) : isFresh ? (
              <BookOpen className="w-7 h-7" />
            ) : (
              <AlertCircle className="w-7 h-7" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${
                  gueltig
                    ? 'bg-emerald-600 text-white'
                    : isFresh
                    ? 'bg-blue-600 text-white'
                    : 'bg-amber-500 text-white'
                }`}
              >
                {gueltig
                  ? 'Kurswahl Gültig'
                  : isFresh
                  ? 'Bereit zur Kurswahl'
                  : 'Auswahl Unvollständig'}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {gueltig
                  ? 'Alle AGVO-Bedingungen erfüllt'
                  : isFresh
                  ? 'Frischer Start ohne Vorgaben'
                  : `${unerfuellteRegeln.length} Kriterium/-en zu prüfen`}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-800 mt-1">
              {gueltig
                ? 'Deine gewählte Fächerkombination erfüllt alle Vorgaben der Prüfungsordnung.'
                : isFresh
                ? 'Wähle unten deine 3 Leistungsfächer (LF, 5-stündig) und Basisfächer (BF) aus der Fächerliste.'
                : unerfuellteRegeln[0]?.statusText ||
                  'Wähle 3 Leistungsfächer und 2 mündliche Prüfungsfächer.'}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 self-start lg:self-center flex-wrap">
          {isFresh && onPrefillMandatory && (
            <button
              id="btn-prefill-mandatory"
              onClick={onPrefillMandatory}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-blue-50 text-blue-800 hover:bg-blue-100 transition-colors border border-blue-200 cursor-pointer shadow-xs"
              title="Alle 10 baden-württembergischen Pflichtfächer als Basisfach vorwählen"
            >
              <span>⚡ Pflichtfächer vorwählen</span>
            </button>
          )}

          <button
            id="btn-toggle-hours-chart"
            onClick={() => setIsChartVisible((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer border ${
              isChartVisible
                ? 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
            title="Balkendiagramm der Wochenstunden pro Halbjahr ein-/ausblenden"
          >
            <BarChart2 className="w-4 h-4 text-blue-600" />
            <span>{isChartVisible ? 'Diagramm' : 'Kurslast-Diagramm'}</span>
          </button>

          <button
            id="btn-toggle-semester-table"
            onClick={onToggleSemesterView}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer border ${
              isSemesterViewOpen
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <TableProperties className="w-4 h-4" />
            <span>Stundenplan & Semester</span>
          </button>

          <button
            id="btn-toggle-validation-drawer"
            onClick={onToggleValidation}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer border ${
              isValidationOpen
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <span>{isValidationOpen ? 'Prüfung verbergen' : 'Regelprüfung Details'}</span>
            {isValidationOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4 pt-4 border-t border-slate-100">
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

      {/* Visual Weekly Hours Bar Chart */}
      {isChartVisible && (
        <WeeklyHoursChart
          wochenstunden={wochenstunden}
          durchschnitt={durchschnittWochenstunden}
        />
      )}
    </div>
  );
};
