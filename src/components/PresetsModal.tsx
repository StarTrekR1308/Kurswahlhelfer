import React from 'react';
import { PROFIL_PRESETS } from '../utils/presets';
import { ProfilPreset } from '../types';
import { Sparkles, X, Check, ArrowRight } from 'lucide-react';

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPreset: (preset: ProfilPreset) => void;
}

export const PresetsModal: React.FC<PresetsModalProps> = ({
  isOpen,
  onClose,
  onApplyPreset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="presets-modal"
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Profil-Vorlagen & Muster-Kurswahlen
              </h3>
              <p className="text-xs text-slate-500">
                Wähle eine vorgefertigte, AGVO-konforme Fächerkombination als Startpunkt.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Presets */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {PROFIL_PRESETS.map((preset) => {
            const lfFaecher = preset.faecher.filter((f) => f.typ === 'LF');
            const muendlFaecher = preset.faecher.filter((f) => f.muendlich);

            return (
              <div
                key={preset.id}
                onClick={() => {
                  onApplyPreset(preset);
                  onClose();
                }}
                className="group p-4 rounded-2xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-all cursor-pointer shadow-xs hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                        {preset.badge}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {preset.name}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-600 font-medium mt-1">
                      {preset.untertitel}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      {preset.beschreibung}
                    </p>

                    {/* LF and Oral preview */}
                    <div className="flex flex-wrap items-center gap-2 mt-3 pt-2 border-t border-slate-100 text-xs">
                      <span className="font-semibold text-slate-700">Leistungsfächer:</span>
                      <div className="flex gap-1 flex-wrap">
                        {lfFaecher.map((f) => (
                          <span
                            key={f.name}
                            className="px-2 py-0.5 rounded bg-blue-600 text-white font-medium text-[11px]"
                          >
                            {f.name} (5h)
                          </span>
                        ))}
                      </div>

                      <span className="text-slate-300 ml-1">•</span>

                      <span className="font-semibold text-slate-700">Mündl.:</span>
                      <div className="flex gap-1 flex-wrap">
                        {muendlFaecher.map((f) => (
                          <span
                            key={f.name}
                            className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-medium text-[11px]"
                          >
                            {f.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 pt-1">
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-700 bg-white border border-blue-200 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xs">
                      <span>Laden</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-200/80 transition-colors cursor-pointer"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};
