import React from 'react';
import {
  GraduationCap,
  Sparkles,
  School,
  Share2,
  Printer,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { ProfilPreset } from '../types';

interface TopAppBarProps {
  onOpenPresets: () => void;
  onOpenSchoolFilter: () => void;
  onOpenShare: () => void;
  onOpenPrint: () => void;
  onOpenHelp: () => void;
  onReset: () => void;
  isValid: boolean;
  excludedCount: number;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  onOpenPresets,
  onOpenSchoolFilter,
  onOpenShare,
  onOpenPrint,
  onOpenHelp,
  onReset,
  isValid,
  excludedCount,
}) => {
  return (
    <header
      id="top-app-bar"
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-slate-900 tracking-tight">
                  Kurswahl Oberstufe
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                  BW AGVO
                </span>
                {isValid ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Gültig
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Prüfung offen
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Gymnasiale Oberstufe Baden-Württemberg • Abiturjahrgang ab 2021/2025
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Presets */}
            <button
              id="btn-open-presets"
              onClick={onOpenPresets}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer border border-blue-200/80"
              title="Profile & Vorlagen laden"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="hidden md:inline">Profile</span>
            </button>

            {/* School Offer Filter */}
            <button
              id="btn-open-school-filter"
              onClick={onOpenSchoolFilter}
              className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors cursor-pointer"
              title="Fächerangebot der Schule anpassen"
            >
              <School className="w-4 h-4 text-slate-600" />
              <span className="hidden md:inline">Schulangebot</span>
              {excludedCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-600 text-white">
                  -{excludedCount}
                </span>
              )}
            </button>

            {/* Share / URL */}
            <button
              id="btn-open-share"
              onClick={onOpenShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors cursor-pointer"
              title="Kurswahl teilen oder Link kopieren"
            >
              <Share2 className="w-4 h-4 text-slate-600" />
              <span className="hidden md:inline">Teilen</span>
            </button>

            {/* Print / PDF */}
            <button
              id="btn-open-print"
              onClick={onOpenPrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors cursor-pointer"
              title="Wahlbogen drucken oder als PDF speichern"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span className="hidden md:inline">Drucken</span>
            </button>

            {/* Help */}
            <button
              id="btn-open-help"
              onClick={onOpenHelp}
              className="inline-flex items-center justify-center p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Hilfe & AGVO-Erklärungen"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* Reset */}
            <button
              id="btn-reset-selection"
              onClick={onReset}
              className="inline-flex items-center justify-center p-2 rounded-full text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              title="Auswahl zurücksetzen"
            >
              <RotateCcw className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
