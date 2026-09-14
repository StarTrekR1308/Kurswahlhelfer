import React from 'react';
import { HelpCircle, X, CheckCircle2, AlertTriangle, BookOpen, ShieldCheck } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="help-modal"
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Hilfe & Leitfaden zur Kurswahl (AGVO BW)
              </h3>
              <p className="text-xs text-slate-500">
                Wichtige Bestimmungen für die gymnasiale Oberstufe in Baden-Württemberg
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
        <div className="p-5 overflow-y-auto space-y-4 text-sm text-slate-700 flex-1">
          {/* Section 1: Overview */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200">
            <h4 className="font-bold text-blue-950 flex items-center gap-2 mb-1.5">
              <BookOpen className="w-4 h-4 text-blue-700" />
              1. Grundstruktur der Oberstufe
            </h4>
            <p className="text-xs text-blue-900 leading-relaxed">
              Die Kursstufe umfasst die vier Halbjahre der Jahrgangsstufen 1 und 2 (J1.1, J1.2, J2.1,
              J2.2). Die Kurswahl entscheidet über deine belegten Fächer und die spätere
              Abiturprüfung.
            </p>
          </div>

          {/* Section 2: LF and BF */}
          <div>
            <h4 className="font-bold text-slate-900 mb-2">2. Die Kursarten</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                <span className="font-bold text-blue-800 block text-sm mb-1">
                  LF (Leistungsfach)
                </span>
                <p className="text-slate-600 leading-relaxed">
                  5 Wochenstunden. Genau 3 Fächer. Werden im Abitur <strong>schriftlich</strong>{' '}
                  geprüft. Mindestens 2 LF müssen Kernfächer (D, M, FS, NW) sein.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 block text-sm mb-1">
                  BF (Basisfach)
                </span>
                <p className="text-slate-600 leading-relaxed">
                  Meist 3-stündig (D, M, FS, NW) oder 2-stündig (Geschichte, Kunst, Sport etc.). Zwei
                  Basisfächer werden für die <strong>mündliche Prüfung</strong> gewählt.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
                <span className="font-bold text-purple-800 block text-sm mb-1">
                  WF (Wahlfach)
                </span>
                <p className="text-slate-600 leading-relaxed">
                  2 Wochenstunden zur Vertiefung (z.B. VK Mathe, Astronomie, Philosophie). Einige WF
                  können als mündliches Prüfungsfach gewählt werden.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Abitur Exam Rules */}
          <div>
            <h4 className="font-bold text-slate-900 mb-2">3. Die 5 Abiturprüfungsfächer</h4>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 leading-relaxed">
              <li>
                <strong>3 schriftliche Prüfungen</strong>: Deine 3 gewählten Leistungsfächer (LF).
              </li>
              <li>
                <strong>2 mündliche Prüfungen</strong>: Werden aus den Basisfächern oder
                zugelassenen Wahlfächern gewählt.
              </li>
              <li>
                <strong>Deutsch und Mathematik</strong> müssen zwingend Prüfungsfächer sein (entweder
                schriftlich als LF oder mündlich).
              </li>
              <li>
                <strong>Aufgabenfelder I, II und III</strong>: Die 5 Prüfungsfächer müssen alle drei
                Felder abdecken (mindestens 1 sprachliches, 1 gesellschaftswissenschaftliches und 1
                MINT-Fach).
              </li>
            </ul>
          </div>

          {/* Section 4: Mindestbelegungen */}
          <div>
            <h4 className="font-bold text-slate-900 mb-2">4. Belegung & Mindeststunden</h4>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 leading-relaxed">
              <li>
                <strong>Mindestens 42 Kurse</strong>: Über die 4 Halbjahre hinweg müssen mindestens
                42 Halbjahreskurse belegt werden.
              </li>
              <li>
                <strong>Mindestens 32 Wochenstunden im Schnitt</strong>: Im Durchschnitt muss man
                mindestens 32 Wochenstunden pro Semester belegen (insgesamt mind. 128
                Wochenstunden).
              </li>
              <li>
                <strong>Block I Anrechnung</strong>: Im Abitur werden genau 40 Kurse für die
                Gesamtqualifikation angerechnet.
              </li>
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <strong>Wichtiger Hinweis:</strong> Diese Anwendung prüft die allgemeinen Vorgaben der
              AGVO Baden-Württemberg. Besondere schulinterne Regelungen, Kooperationen oder
              Nichtzustandekommen von Kursen aufgrund der Teilnehmerzahl müssen immer mit dem
              zuständigen Oberstufenberater deiner Schule abgestimmt werden!
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Verstanden
          </button>
        </div>
      </div>
    </div>
  );
};
