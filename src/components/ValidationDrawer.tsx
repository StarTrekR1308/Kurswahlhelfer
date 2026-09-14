import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Award,
  Layers,
  Sparkles,
} from 'lucide-react';
import { ValidierungsErgebnis, ValidierungsRegel } from '../types';

interface ValidationDrawerProps {
  validation: ValidierungsErgebnis;
  onClose?: () => void;
}

export const ValidationDrawer: React.FC<ValidationDrawerProps> = ({
  validation,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'unfulfilled' | 'fulfilled'>('all');

  const { regeln, gueltig, abiturFaecher, fehlendeAufgabenfelder } = validation;

  const filteredRegeln = regeln.filter((r) => {
    if (activeFilter === 'unfulfilled') return !r.erfuellt;
    if (activeFilter === 'fulfilled') return r.erfuellt;
    return true;
  });

  const unfulfilledCount = regeln.filter((r) => !r.erfuellt).length;

  return (
    <div
      id="validation-drawer"
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              AGVO-Regelprüfung für das Abitur (Baden-Württemberg)
            </h2>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                gueltig
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {gueltig ? 'Kurswahl Gültig' : `${unfulfilledCount} Regeln offen`}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Automatische Prüfung aller Bestimmungen der gymnasialen Oberstufenverordnung (AGVO).
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Alle ({regeln.length})
          </button>
          <button
            onClick={() => setActiveFilter('unfulfilled')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeFilter === 'unfulfilled'
                ? 'bg-amber-500 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Offen ({unfulfilledCount})
          </button>
          <button
            onClick={() => setActiveFilter('fulfilled')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeFilter === 'fulfilled'
                ? 'bg-emerald-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Erfüllt ({regeln.length - unfulfilledCount})
          </button>
        </div>
      </div>

      {/* Abitur Prüfung Summary Card */}
      <div className="mt-4 p-4 rounded-xl bg-blue-50/60 border border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <Award className="w-4 h-4 text-blue-700" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-blue-900">
            Deine 5 Abiturprüfungsfächer
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Schriftliche LF */}
          <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-xs">
            <div className="flex items-center gap-1 text-xs font-bold text-slate-700 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>3 Schriftliche Leistungsfächer (5-stündig):</span>
            </div>
            {abiturFaecher.schriftlich.length === 0 ? (
              <span className="text-xs text-slate-400 italic">Noch keine gewählt</span>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {abiturFaecher.schriftlich.map((f) => (
                  <span
                    key={f.fachId}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-600 text-white shadow-xs"
                  >
                    <span>{f.name}</span>
                    <span className="text-[10px] bg-blue-700 px-1 py-0.2 rounded">
                      Feld {f.aufgabenfeld}
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Mündliche Prüfungen */}
          <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-xs">
            <div className="flex items-center gap-1 text-xs font-bold text-slate-700 mb-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>2 Mündliche Prüfungsfächer:</span>
            </div>
            {abiturFaecher.muendlich.length === 0 ? (
              <span className="text-xs text-slate-400 italic">Noch keine gewählt</span>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {abiturFaecher.muendlich.map((f) => (
                  <span
                    key={f.fachId}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-600 text-white shadow-xs"
                  >
                    <span>{f.name}</span>
                    <span className="text-[10px] bg-indigo-700 px-1 py-0.2 rounded">
                      Feld {f.aufgabenfeld}
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {fehlendeAufgabenfelder.length > 0 && (
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-blue-200/80 text-xs text-amber-800 font-medium">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Achtung: Aufgabenfeld {fehlendeAufgabenfelder.join(', ')} ist noch nicht in der
              Abiturprüfung abgedeckt!
            </span>
          </div>
        )}
      </div>

      {/* Rules List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {filteredRegeln.map((regel) => (
          <div
            key={regel.id}
            className={`p-3.5 rounded-xl border transition-all ${
              regel.erfuellt
                ? 'bg-emerald-50/40 border-emerald-200'
                : 'bg-amber-50/50 border-amber-200'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 shrink-0">
                {regel.erfuellt ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-amber-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold text-slate-900">
                    {regel.titel}
                  </h4>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                      regel.erfuellt
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {regel.erfuellt ? 'Erfüllt' : 'Prüfen'}
                  </span>
                </div>

                <p className="text-xs text-slate-700 font-medium mt-1">
                  {regel.statusText}
                </p>

                <p className="text-[11px] text-slate-500 mt-1">
                  {regel.beschreibung}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
