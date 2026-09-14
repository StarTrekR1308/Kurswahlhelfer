import React, { useState, useEffect, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import { FACH_LISTE } from './data/subjects';
import { BelegtesFach, FachDefinition, Kursart, ProfilPreset } from './types';
import {
  serializeBelegung,
  deserializeBelegung,
  serializeExcludedList,
  deserializeExcludedList,
  calculateSubjectHours,
} from './utils/serialization';
import { validateKurswahl } from './utils/validation';
import { PROFIL_PRESETS } from './utils/presets';
import { TopAppBar } from './components/TopAppBar';
import { SummaryBar } from './components/SummaryBar';
import { SubjectCard } from './components/SubjectCard';
import { ValidationDrawer } from './components/ValidationDrawer';
import { SemesterTable } from './components/SemesterTable';
import { SchoolFilterModal } from './components/SchoolFilterModal';
import { PresetsModal } from './components/PresetsModal';
import { ShareModal } from './components/ShareModal';
import { HelpModal } from './components/HelpModal';
import { PrintView } from './components/PrintView';
import { Search, Filter, Sparkles, AlertTriangle, CheckCircle2, ChevronRight, RotateCcw } from 'lucide-react';

export function App() {
  // State
  const [belegung, setBelegung] = useState<BelegtesFach[]>([]);
  const [excludedIds, setExcludedIds] = useState<number[]>([]);
  const [isValidationOpen, setIsValidationOpen] = useState(false);
  const [isSemesterViewOpen, setIsSemesterViewOpen] = useState(false);

  // Modals
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [isSchoolFilterOpen, setIsSchoolFilterOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'I' | 'II' | 'III' | 'OTHER' | 'SELECTED'>('ALL');

  // Track previous validity to trigger confetti only on transition to valid
  const prevValidRef = useRef(false);

  // Load from URL Hash on mount
  useEffect(() => {
    const hash = window.location.hash.substring(1);

    if (hash) {
      const params = new URLSearchParams(hash);
      const idParam = params.get('id');
      const exParam = params.get('ex');

      if (exParam) {
        const excluded = deserializeExcludedList(exParam);
        if (excluded.length > 0) {
          setExcludedIds(excluded);
        }
      }

      if (idParam) {
        const loaded = deserializeBelegung(idParam);
        if (loaded && loaded.length > 0) {
          setBelegung(loaded);
        }
      }
    }
  }, []);

  // Update URL Hash on state changes
  useEffect(() => {
    if (belegung.length === 0) {
      const currentHash = window.location.hash.substring(1);
      if (currentHash && currentHash.includes('id=')) {
        const params = new URLSearchParams(currentHash);
        params.delete('id');
        const newHash = params.toString();
        window.history.replaceState(null, '', newHash ? `#${newHash}` : window.location.pathname);
      }
      return;
    }
    const idParam = serializeBelegung(belegung);
    const exParam = excludedIds.length > 0 ? serializeExcludedList(excludedIds) : '';

    const params = new URLSearchParams();
    if (idParam) params.set('id', idParam);
    if (exParam) params.set('ex', exParam);

    const newHash = params.toString();
    if (window.location.hash.substring(1) !== newHash) {
      window.history.replaceState(null, '', `#${newHash}`);
    }
  }, [belegung, excludedIds]);

  // Validation calculation
  const validation = useMemo(() => validateKurswahl(belegung), [belegung]);

  // Confetti on becoming valid!
  useEffect(() => {
    if (validation.gueltig && !prevValidRef.current) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2563eb', '#10b981', '#6366f1', '#f59e0b'],
        });
      } catch {
        // ignore
      }
    }
    prevValidRef.current = validation.gueltig;
  }, [validation.gueltig]);

  // Handler: Select Type (Kein, LF, BF, WF)
  const handleSelectType = (fachDef: FachDefinition, typ: Kursart | null) => {
    setBelegung((prev) => {
      // If deselecting
      if (typ === null) {
        return prev.filter((f) => f.fachId !== fachDef.id);
      }

      const existingIndex = prev.findIndex((f) => f.fachId === fachDef.id);
      const defaultAlt = false;
      const hours = calculateSubjectHours(fachDef, typ, defaultAlt);

      // If switching type, check oral exam validity
      let muendlich = false;
      if (existingIndex !== -1) {
        muendlich = prev[existingIndex].muendlich;
      }
      if (typ === 'LF') {
        muendlich = false; // LF is written exam, not oral
      }

      const updatedFach: BelegtesFach = {
        fachId: fachDef.id,
        name: fachDef.name,
        typ,
        aufgabenfeld: fachDef.aufgabenfeld,
        muendlich,
        alternativStunden: defaultAlt,
        stunden: hours,
        attribute: [...fachDef.attribute],
      };

      if (existingIndex !== -1) {
        const clone = [...prev];
        clone[existingIndex] = updatedFach;
        return clone;
      } else {
        return [...prev, updatedFach];
      }
    });
  };

  // Handler: Toggle Oral Exam
  const handleToggleMuendlich = (fachId: number) => {
    setBelegung((prev) =>
      prev.map((f) => {
        if (f.fachId === fachId) {
          const newMuendlich = !f.muendlich;
          let newAlt = f.alternativStunden;
          let newHours = f.stunden;

          // In BW: Oral exam in Geo or Gk requires taking all 4 semesters
          if (newMuendlich && (f.attribute.includes('Geo') || f.attribute.includes('Gk')) && !newAlt) {
            newAlt = true;
            const def = FACH_LISTE.find((x) => x.id === fachId);
            if (def) {
              newHours = calculateSubjectHours(def, f.typ, true);
            }
          }

          return {
            ...f,
            muendlich: newMuendlich,
            alternativStunden: newAlt,
            stunden: newHours,
          };
        }
        return f;
      })
    );
  };

  // Handler: Toggle Alternative Hours
  const handleToggleAlternativ = (fachId: number) => {
    setBelegung((prev) =>
      prev.map((f) => {
        if (f.fachId === fachId) {
          const newAlt = !f.alternativStunden;
          const def = FACH_LISTE.find((x) => x.id === fachId);
          if (!def) return f;
          const newHours = calculateSubjectHours(def, f.typ, newAlt);
          return {
            ...f,
            alternativStunden: newAlt,
            stunden: newHours,
          };
        }
        return f;
      })
    );
  };

  // Handler: Apply Preset
  const applyPreset = (preset: ProfilPreset, triggerNotify = true) => {
    const newBelegung: BelegtesFach[] = [];

    for (const item of preset.faecher) {
      const def = FACH_LISTE.find((f) => f.name === item.name);
      if (!def) continue;

      const alt = item.alternativ ?? false;
      const hours = calculateSubjectHours(def, item.typ, alt);

      newBelegung.push({
        fachId: def.id,
        name: def.name,
        typ: item.typ,
        aufgabenfeld: def.aufgabenfeld,
        muendlich: item.muendlich ?? false,
        alternativStunden: alt,
        stunden: hours,
        attribute: [...def.attribute],
      });
    }

    setBelegung(newBelegung);
  };

  // Helper: Vorwahl der 10 Pflichtfächer als Basisfach (optionaler Schnellstart)
  const handlePrefillMandatory = () => {
    const mandatoryList: { name: string; typ: Kursart }[] = [
      { name: 'Deutsch', typ: 'BF' },
      { name: 'Mathematik', typ: 'BF' },
      { name: 'Englisch', typ: 'BF' },
      { name: 'Biologie', typ: 'BF' },
      { name: 'Geschichte', typ: 'BF' },
      { name: 'Geographie', typ: 'BF' },
      { name: 'Gemeinschaftskunde', typ: 'BF' },
      { name: 'Religionslehre', typ: 'BF' },
      { name: 'Bildende Kunst', typ: 'BF' },
      { name: 'Sport', typ: 'BF' },
    ];

    const newBelegung: BelegtesFach[] = [];
    for (const item of mandatoryList) {
      const def = FACH_LISTE.find((f) => f.name === item.name);
      if (!def) continue;
      const hours = calculateSubjectHours(def, item.typ, false);
      newBelegung.push({
        fachId: def.id,
        name: def.name,
        typ: item.typ,
        aufgabenfeld: def.aufgabenfeld,
        muendlich: false,
        alternativStunden: false,
        stunden: hours,
        attribute: [...def.attribute],
      });
    }
    setBelegung(newBelegung);
  };

  // Handler: Open Reset confirmation
  const handleReset = () => {
    if (belegung.length === 0) return;
    setIsResetConfirmOpen(true);
  };

  const handleConfirmReset = () => {
    setBelegung([]);
    window.history.replaceState(null, '', window.location.pathname);
    setIsResetConfirmOpen(false);
  };

  // Filtered Subject List
  const visibleSubjects = useMemo(() => {
    return FACH_LISTE.filter((fach) => {
      // Check if excluded by school
      if (excludedIds.includes(fach.id)) return false;

      // Text search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = fach.name.toLowerCase().includes(query);
        const matchesField = fach.aufgabenfeld.toLowerCase().includes(query);
        const matchesAttr = fach.attribute.some((a) => a.toLowerCase().includes(query));
        if (!matchesName && !matchesField && !matchesAttr) return false;
      }

      // Category filter
      if (categoryFilter === 'SELECTED') {
        return belegung.some((b) => b.fachId === fach.id);
      }
      if (categoryFilter === 'I') return fach.aufgabenfeld === 'I';
      if (categoryFilter === 'II') return fach.aufgabenfeld === 'II';
      if (categoryFilter === 'III') return fach.aufgabenfeld === 'III';
      if (categoryFilter === 'OTHER') {
        return fach.aufgabenfeld === 'Sport' || fach.aufgabenfeld === 'Seminarfach';
      }

      return true;
    });
  }, [excludedIds, searchQuery, categoryFilter, belegung]);

  // Current Share URL
  const currentShareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Top App Bar */}
      <TopAppBar
        onOpenPresets={() => setIsPresetsOpen(true)}
        onOpenSchoolFilter={() => setIsSchoolFilterOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        onOpenPrint={() => setIsPrintOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onReset={handleReset}
        isValid={validation.gueltig}
        excludedCount={excludedIds.length}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Summary & Metrics Bar */}
        <SummaryBar
          validation={validation}
          isValidationOpen={isValidationOpen}
          onToggleValidation={() => setIsValidationOpen((prev) => !prev)}
          isSemesterViewOpen={isSemesterViewOpen}
          onToggleSemesterView={() => setIsSemesterViewOpen((prev) => !prev)}
          belegungCount={belegung.length}
          onPrefillMandatory={handlePrefillMandatory}
        />

        {/* Validation Details Drawer (Expandable) */}
        {isValidationOpen && (
          <ValidationDrawer
            validation={validation}
            onClose={() => setIsValidationOpen(false)}
          />
        )}

        {/* Semester Stundenplan Table (Collapsible) */}
        {isSemesterViewOpen && (
          <SemesterTable
            belegung={belegung}
            validation={validation}
          />
        )}

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-3.5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="subject-search-input"
              type="text"
              placeholder="Fach suchen (z.B. Physik, Englisch)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'ALL', label: 'Alle Fächer' },
              { id: 'I', label: 'Feld I (Sprachen/Kunst)' },
              { id: 'II', label: 'Feld II (Gesellschaft)' },
              { id: 'III', label: 'Feld III (MINT)' },
              { id: 'OTHER', label: 'Sport & Sonstige' },
              { id: 'SELECTED', label: `Gewählt (${belegung.length})` },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  categoryFilter === cat.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Fächerliste ({visibleSubjects.length} Fächer)
            </h2>
            <span className="text-xs text-slate-400">
              Klicke auf LF (5h), BF oder WF zur Belegung
            </span>
          </div>

          {visibleSubjects.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <p className="text-sm font-medium text-slate-600">
                Keine Fächer gefunden für deine aktuelle Suche oder Filterung.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('ALL');
                }}
                className="mt-3 inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
              >
                Filter zurücksetzen
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {visibleSubjects.map((fachDef) => {
                const currentBelegung = belegung.find((b) => b.fachId === fachDef.id);
                const anrechnung = validation.anrechnungMap[fachDef.id];

                return (
                  <SubjectCard
                    key={fachDef.id}
                    definition={fachDef}
                    belegung={currentBelegung}
                    onSelectType={handleSelectType}
                    onToggleMuendlich={handleToggleMuendlich}
                    onToggleAlternativ={handleToggleAlternativ}
                    canSelectLF={validation.anzahlLF < 3}
                    canSelectMuendlich={validation.anzahlMuendlich < 2}
                    anrechnungSemesters={anrechnung}
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-1">
          <p className="font-medium text-slate-700">
            Kurswahl-Assistent für die gymnasiale Oberstufe in Baden-Württemberg (AGVO)
          </p>
          <p>
            Reimplementierung & Modernisierung des AGVO-Prüfungsmodells mit modernem Material Design.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <PresetsModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        onApplyPreset={(p) => applyPreset(p)}
      />

      <SchoolFilterModal
        isOpen={isSchoolFilterOpen}
        onClose={() => setIsSchoolFilterOpen(false)}
        excludedIds={excludedIds}
        onSaveExcluded={setExcludedIds}
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        belegung={belegung}
        validation={validation}
        shareUrl={currentShareUrl}
      />

      <PrintView
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
        belegung={belegung}
        validation={validation}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div
            id="reset-confirm-dialog"
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Kurswahl wirklich zurücksetzen?
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Alle aktuell gewählten Leistungs-, Basis- und Wahlfächer werden entfernt, damit du komplett frisch von vorne rechnen und wählen kannst.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-600 space-y-1">
              <div className="font-semibold text-slate-700">Aktueller Stand:</div>
              <div>• {belegung.length} Fächer belegt ({validation.anzahlKurseGesamt} Kurse)</div>
              <div>• {validation.anzahlLF} von 3 Leistungsfächern</div>
              <div>• {validation.anzahlMuendlich} von 2 mündlichen Prüfungsfächern</div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                id="btn-cancel-reset"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
              >
                Abbrechen
              </button>
              <button
                id="btn-confirm-reset"
                onClick={handleConfirmReset}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-xs cursor-pointer"
              >
                Ja, alles leeren & frisch starten
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
