import React, { useState, useEffect } from 'react';
import {
  Compass,
  Award,
  BookOpen,
  CheckCircle2,
  BarChart3,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  RotateCcw,
} from 'lucide-react';

interface TourGuideProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToStep?: (stepIndex: number) => void;
}

interface TourStep {
  title: string;
  badge: string;
  icon: React.ElementType;
  description: string;
  tip?: string;
  actionText?: string;
  highlightId?: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    title: 'Willkommen zu deiner Oberstufen-Kurswahl!',
    badge: 'Überblick',
    icon: Compass,
    description:
      'Dieser interaktive Rechner begleitet dich rechtssicher durch die gymnasiale Oberstufe in Baden-Württemberg (Abiturverordnung AGVO). Er berechnet in Echtzeit alle Semester-Wochenstunden, prüft Pflichtauflagen und hilft dir, die perfekte Fächerkombination zu finden.',
    tip: 'Tipp: Deine Auswahl wird fortlaufend in der URL-Adresse gesichert – kein Login oder Server nötig!',
    highlightId: 'summary-banner',
  },
  {
    title: 'Schritt 1: Genau 3 Leistungsfächer (LF) wählen',
    badge: '3 Leistungsfächer',
    icon: Award,
    description:
      'Wähle genau drei 5-stündige Leistungsfächer. Gesetzliche Vorgabe in BW: Mindestens zwei deiner Leistungsfächer müssen aus Deutsch, Mathematik, einer Fremdsprache oder einer Naturwissenschaft (Bio, Ch, Ph) gewählt werden.',
    tip: 'Klicke in der Fächerliste bei deinen 3 Wunschfächern einfach auf den blauen Button [LF (5h)].',
    highlightId: 'subject-search-input',
  },
  {
    title: 'Schritt 2: Basisfächer & Pflichtbereiche belegen',
    badge: 'Basisfächer & Pflicht',
    icon: BookOpen,
    description:
      'Belege deine restlichen Fächer als Basisfach [BF]. Die farbigen Marken kennzeichnen Pflichtfächer (Deutsch, Mathe, Geschichte, Geographie/Gemeinschaftskunde, Sport) und Wahlpflichtbereiche (mind. 1 Fremdsprache, mind. 1 Naturwissenschaft, BK/Musik, Religion/Ethik).',
    tip: 'Tipp: Über den Button „⚡ Pflichtfächer vorwählen“ im oberen Banner kannst du die 10 Kernfächer mit einem Klick vorwählen.',
    highlightId: 'btn-prefill-mandatory',
  },
  {
    title: 'Schritt 3: Die 2 mündlichen Abiturprüfungen bestimmen',
    badge: 'Abiturprüfungen',
    icon: CheckCircle2,
    description:
      'Neben den 3 schriftlichen Prüfungen (deine 3 Leistungsfächer) wählst du 2 mündliche Prüfungen aus deinen Basisfächern. Aktiviere dafür einfach den Schalter [Mündl. Prüfung] beim jeweiligen Fach.',
    tip: 'Prüfe oben im Banner: Über alle 5 Prüfungsfächer müssen alle drei Aufgabenfelder (I: Sprachen/Kunst, II: Gesellschaftswissenschaften, III: MINT) vertreten sein!',
    highlightId: 'summary-banner',
  },
  {
    title: 'Schritt 4: Kurslast & Semester-Diagramm kontrollieren',
    badge: 'Wochenstunden & Last',
    icon: BarChart3,
    description:
      'Über die vier Halbjahre (J1.1 bis J2.2) musst du im Schnitt mindestens 32 Wochenstunden belegen. Unser neues Balkendiagramm vergleicht deine Semesterstunden direkt mit dem Mindest-Soll (32h) und der Richtwert-Obergrenze (38h).',
    tip: 'Achte auf eine gleichmäßige Verteilung zwischen J1 und J2, um Semester mit zu hoher Belastung zu vermeiden.',
    highlightId: 'weekly-hours-chart',
  },
  {
    title: 'Schritt 5: Regelprüfung, Teilen & Drucken',
    badge: 'Abschluss & Export',
    icon: Sparkles,
    description:
      'Klicke auf „Regelprüfung Details“, um jeden Paragrafen der Prüfungsordnung einzusehen. Wenn alles grün leuchtet, kannst du deinen offiziellen Wahlbogen ausdrucken, als PDF speichern oder per Link mit Eltern, Lehrern oder Mitschülern teilen!',
    tip: 'Du kannst diesen Tour-Guide jederzeit oben rechts über das Fragezeichen oder „Tour starten“ erneut aufrufen.',
    highlightId: 'top-app-bar',
  },
];

const STORAGE_KEY = 'bw_kurswahl_tour_v1_completed';

export const TourGuide: React.FC<TourGuideProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const step = TOUR_STEPS[currentStep];
  const IconComponent = step.icon;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      handleComplete();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    if (dontShowAgain) {
      try {
        localStorage.setItem(STORAGE_KEY, 'true');
      } catch (e) {
        console.warn('localStorage not available');
      }
    }
    onClose();
  };

  const handleSkip = () => {
    handleComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="tour-guide-modal"
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Tour-Guide • Schritt {currentStep + 1} von {TOUR_STEPS.length}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {step.badge}
            </span>
          </div>

          <button
            onClick={handleSkip}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            title="Tour beenden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20">
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>

          {/* Helpful Callout Tip */}
          {step.tip && (
            <div className="p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-2xl text-xs text-blue-900 leading-relaxed font-medium">
              {step.tip}
            </div>
          )}

          {/* Progress Indicator Dots */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            {TOUR_STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentStep
                    ? 'w-7 bg-blue-600'
                    : idx < currentStep
                    ? 'w-2 bg-blue-300'
                    : 'w-2 bg-slate-200'
                }`}
                title={`Zu Schritt ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <span className="text-xs text-slate-500">
              Nicht mehr automatisch beim Start anzeigen
            </span>
          </label>

          <div className="flex items-center gap-2 justify-end">
            {!isFirstStep && (
              <button
                id="tour-btn-prev"
                onClick={handlePrev}
                className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Zurück</span>
              </button>
            )}

            <button
              id="tour-btn-next"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
            >
              <span>{isLastStep ? 'Tour abschließen' : 'Weiter'}</span>
              {!isLastStep && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
