import React, { useState } from 'react';
import { FACH_LISTE } from '../data/subjects';
import { School, X, CheckSquare, Square, Share2, Copy, Check } from 'lucide-react';
import { serializeExcludedList } from '../utils/serialization';

interface SchoolFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  excludedIds: number[];
  onSaveExcluded: (excluded: number[]) => void;
}

export const SchoolFilterModal: React.FC<SchoolFilterModalProps> = ({
  isOpen,
  onClose,
  excludedIds,
  onSaveExcluded,
}) => {
  const [selectedExcluded, setSelectedExcluded] = useState<number[]>(excludedIds);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Only non-mandatory subjects can be excluded by a school
  const optionalSubjects = FACH_LISTE.filter((f) => !f.pflicht);

  const toggleSubject = (id: number) => {
    if (selectedExcluded.includes(id)) {
      setSelectedExcluded(selectedExcluded.filter((x) => x !== id));
    } else {
      setSelectedExcluded([...selectedExcluded, id]);
    }
  };

  const handleSelectAll = () => {
    // Exclude all optional
    setSelectedExcluded(optionalSubjects.map((s) => s.id));
  };

  const handleDeselectAll = () => {
    // Offer all
    setSelectedExcluded([]);
  };

  const handleApply = () => {
    onSaveExcluded(selectedExcluded);
    onClose();
  };

  // Generate shareable school link
  const exCode = serializeExcludedList(selectedExcluded);
  const currentUrl = window.location.origin + window.location.pathname;
  const schoolLink = exCode ? `${currentUrl}#ex=${exCode}` : currentUrl;

  const copySchoolLink = async () => {
    try {
      await navigator.clipboard.writeText(schoolLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="school-filter-modal"
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <School className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Fächerangebot der Schule anpassen
              </h3>
              <p className="text-xs text-slate-500">
                Wähle ab, welche Wahlfächer deine Schule nicht anbietet.
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

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900">
            <p className="font-semibold mb-1">Hinweis für Oberstufenberater & Schulen:</p>
            <p>
              Hier deaktivierte Fächer werden Schülerinnen und Schülern in der Auswahlliste
              ausgeblendet. Pflichtfächer (wie Deutsch, Mathematik, Geschichte etc.) sind immer
              aktiv. Du kannst den erzeugten Link direkt an den Jahrgang verteilen!
            </p>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="font-semibold text-slate-700">
              Nicht angebotene Fächer ({selectedExcluded.length} von {optionalSubjects.length} abgewählt)
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDeselectAll}
                className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
              >
                Alle anbieten
              </button>
              <span className="text-slate-300">•</span>
              <button
                onClick={handleSelectAll}
                className="text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Alle optionalen abwählen
              </button>
            </div>
          </div>

          {/* Grid of optional subjects */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {optionalSubjects.map((fach) => {
              const isExcluded = selectedExcluded.includes(fach.id);
              return (
                <div
                  key={fach.id}
                  onClick={() => toggleSubject(fach.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                    isExcluded
                      ? 'bg-rose-50/50 border-rose-200 text-slate-400'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800 shadow-xs'
                  }`}
                >
                  <div className="shrink-0">
                    {isExcluded ? (
                      <Square className="w-4 h-4 text-rose-400" />
                    ) : (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-sm font-medium truncate ${isExcluded ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {fach.name}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        Feld {fach.aufgabenfeld}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* School Share Link Preview */}
          <div className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-blue-600" />
                Schul-Link zum Verteilen an Schüler:
              </span>
              <button
                onClick={copySchoolLink}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Kopiert!' : 'Link kopieren'}</span>
              </button>
            </div>
            <p className="text-[11px] font-mono text-slate-500 truncate bg-white p-2 rounded-lg border border-slate-200">
              {schoolLink}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-200/80 transition-colors cursor-pointer"
          >
            Abbrechen
          </button>
          <button
            onClick={handleApply}
            className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors cursor-pointer"
          >
            Fächerfilter anwenden
          </button>
        </div>
      </div>
    </div>
  );
};
