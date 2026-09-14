import React from 'react';
import {
  Sparkles,
  Mic,
  Sliders,
  Check,
} from 'lucide-react';
import { FachDefinition, BelegtesFach, Kursart } from '../types';
import { WF_MUENDLICH_MOEGLICH } from '../data/subjects';

interface SubjectCardProps {
  definition: FachDefinition;
  belegung?: BelegtesFach;
  onSelectType: (fach: FachDefinition, typ: Kursart | null) => void;
  onToggleMuendlich: (fachId: number) => void;
  onToggleAlternativ: (fachId: number) => void;
  canSelectLF: boolean;
  canSelectMuendlich: boolean;
  anrechnungSemesters?: [number, number, number, number];
}

export const SubjectCard: React.FC<SubjectCardProps> = ({
  definition,
  belegung,
  onSelectType,
  onToggleMuendlich,
  onToggleAlternativ,
  canSelectLF,
  canSelectMuendlich,
  anrechnungSemesters,
}) => {
  const currentType = belegung?.typ ?? null;
  const isMuendlich = belegung?.muendlich ?? false;
  const isAlternativ = belegung?.alternativStunden ?? false;

  const hasLF = definition.stunden[0] > 0;
  const hasBF = definition.stunden[1] > 0;
  const hasWF = definition.stunden[2] > 0;

  // Oral exam is allowed for BF, or specific WFs
  const canBeOral =
    (currentType === 'BF') ||
    (currentType === 'WF' && WF_MUENDLICH_MOEGLICH.has(definition.name));

  // Alternative hours available?
  const hasAlternativOption =
    (definition.attribute.includes('Geo') || definition.attribute.includes('Gk')) && currentType === 'BF'
      ? '4 Halbjahre (durchgehend)'
      : definition.attribute.includes('spaetbeginnend') && currentType === 'BF'
      ? 'Spätbeginnend (4h)'
      : WF_MUENDLICH_MOEGLICH.has(definition.name) && currentType === 'WF'
      ? 'Nur 2 Halbjahre'
      : null;

  // Colors based on Aufgabenfeld
  const aufgabenfeldBadge = {
    I: { label: 'Feld I • Sprachl./Künstl.', bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
    II: { label: 'Feld II • Gesellschaft', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
    III: { label: 'Feld III • MINT', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    Sport: { label: 'Sport', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
    Seminarfach: { label: 'Seminarfach', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  }[definition.aufgabenfeld];

  return (
    <div
      id={`subject-card-${definition.id}`}
      className={`group relative rounded-2xl border transition-all duration-200 p-4 ${
        currentType === 'LF'
          ? 'bg-blue-50/60 border-blue-300 shadow-sm ring-1 ring-blue-400/30'
          : currentType === 'BF'
          ? 'bg-white border-slate-300 shadow-xs hover:border-slate-400'
          : currentType === 'WF'
          ? 'bg-purple-50/40 border-purple-200 shadow-xs'
          : 'bg-slate-50/70 border-slate-200 hover:bg-white hover:border-slate-300'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        {/* Left: Subject Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span
              className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-medium border ${aufgabenfeldBadge.bg} ${aufgabenfeldBadge.text} ${aufgabenfeldBadge.border}`}
            >
              {aufgabenfeldBadge.label}
            </span>

            {['Deutsch', 'Mathematik', 'Geschichte', 'Geographie', 'Gemeinschaftskunde', 'Sport'].includes(definition.name) ? (
              <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-100/90 text-amber-900 border border-amber-300/70">
                Pflichtfach
              </span>
            ) : definition.attribute.includes('Fremdsprache') ? (
              <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                Wahlpflicht (mind. 1 FS)
              </span>
            ) : definition.attribute.includes('Naturwissenschaft') ? (
              <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                Wahlpflicht (mind. 1 NW)
              </span>
            ) : definition.attribute.includes('MuKu') ? (
              <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                Wahlpflicht (BK / Musik)
              </span>
            ) : definition.attribute.includes('ReliEthik') ? (
              <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                Wahlpflicht (Rel. / Ethik)
              </span>
            ) : null}

            {currentType === 'LF' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-600 text-white">
                <Sparkles className="w-3 h-3" />
                Schriftl. Abitur (LF)
              </span>
            )}

            {isMuendlich && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-indigo-600 text-white">
                <Mic className="w-3 h-3" />
                Mündl. Abiturprüfung
              </span>
            )}
          </div>

          <h3 className="text-base font-semibold text-slate-900 leading-snug">
            {definition.name}
          </h3>

          {definition.description && (
            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
              {definition.description}
            </p>
          )}

          {/* Semester Hours Preview Pill */}
          {belegung && (
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-200/70 text-xs">
              <span className="text-slate-500 font-medium">Stunden (J1/J2):</span>
              <div className="flex items-center gap-1">
                {belegung.stunden.map((std, idx) => {
                  const isAngerechnet = anrechnungSemesters && anrechnungSemesters[idx] > 0;
                  return (
                    <span
                      key={idx}
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-md font-bold text-xs ${
                        std === 0
                          ? 'bg-slate-100 text-slate-300'
                          : isAngerechnet
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                      title={`${['J1.1', 'J1.2', 'J2.1', 'J2.2'][idx]}: ${std} Wochenstunden ${
                        isAngerechnet ? '(im Abitur-Block I angerechnet)' : ''
                      }`}
                    >
                      {std}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right: Controls & Segmented Button */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          {/* Segmented Button (M3 Segmented Control) */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 shadow-inner">
            {/* Abwählen / Kein */}
            <button
              id={`btn-deselect-${definition.id}`}
              onClick={() => onSelectType(definition, null)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                currentType === null
                  ? 'bg-white text-slate-700 shadow-xs font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Kein
            </button>

            {/* Leistungsfach (LF) */}
            {hasLF && (
              <button
                id={`btn-lf-${definition.id}`}
                disabled={!canSelectLF && currentType !== 'LF'}
                onClick={() => onSelectType(definition, 'LF')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  currentType === 'LF'
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : !canSelectLF
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'text-slate-700 hover:text-blue-700 hover:bg-slate-200/60'
                }`}
                title={
                  !canSelectLF && currentType !== 'LF'
                    ? 'Bereits 3 Leistungsfächer gewählt'
                    : 'Als 5-stündiges Leistungsfach wählen'
                }
              >
                LF <span className="text-[10px] opacity-80">(5h)</span>
              </button>
            )}

            {/* Basisfach (BF) */}
            {hasBF && (
              <button
                id={`btn-bf-${definition.id}`}
                onClick={() => onSelectType(definition, 'BF')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  currentType === 'BF'
                    ? 'bg-slate-800 text-white shadow-xs font-bold'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
                title="Als Basisfach wählen"
              >
                BF <span className="text-[10px] opacity-80">({definition.stunden[1]}h)</span>
              </button>
            )}

            {/* Wahlfach (WF) */}
            {hasWF && (
              <button
                id={`btn-wf-${definition.id}`}
                onClick={() => onSelectType(definition, 'WF')}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  currentType === 'WF'
                    ? 'bg-purple-600 text-white shadow-xs font-bold'
                    : 'text-slate-700 hover:text-purple-700 hover:bg-slate-200/60'
                }`}
                title="Als 2-stündiges Wahlfach wählen"
              >
                WF <span className="text-[10px] opacity-80">(2h)</span>
              </button>
            )}
          </div>

          {/* Sub-controls: Mündliche Prüfung & Alternative Stunden */}
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {/* Oral Exam Toggle */}
            {canBeOral && (
              <button
                id={`btn-oral-${definition.id}`}
                disabled={!canSelectMuendlich && !isMuendlich}
                onClick={() => onToggleMuendlich(definition.id)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                  isMuendlich
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : !canSelectMuendlich
                    ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300'
                }`}
                title={
                  !canSelectMuendlich && !isMuendlich
                    ? 'Bereits 2 mündliche Prüfungen gewählt'
                    : 'Für mündliche Abiturprüfung auswählen'
                }
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Mündl. Prüfung</span>
                {isMuendlich && <Check className="w-3 h-3 ml-0.5" />}
              </button>
            )}

            {/* Alternative Hours Toggle */}
            {hasAlternativOption && (
              <button
                id={`btn-alt-${definition.id}`}
                onClick={() => onToggleAlternativ(definition.id)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                  isAlternativ
                    ? 'bg-blue-100 text-blue-800 border-blue-300 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
                title="Stundenzahl / Belegungsdauer anpassen"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{hasAlternativOption}</span>
                {isAlternativ && <Check className="w-3 h-3 ml-0.5" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
