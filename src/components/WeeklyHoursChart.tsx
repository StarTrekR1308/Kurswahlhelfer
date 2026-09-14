import React, { useState } from 'react';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle2, Info, ChevronDown, ChevronUp } from 'lucide-react';

interface WeeklyHoursChartProps {
  wochenstunden: [number, number, number, number]; // [J1.1, J1.2, J2.1, J2.2]
  durchschnitt: number;
}

export const WeeklyHoursChart: React.FC<WeeklyHoursChartProps> = ({
  wochenstunden,
  durchschnitt,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  // Benchmarks for Baden-Württemberg AGVO
  const MIN_HOURS = 32.0; // Pflicht-Mindestschnitt laut AGVO
  const RECOMMENDED_MIN = 32.0;
  const RECOMMENDED_MAX = 36.0;
  const MAX_CAP = 38.0; // Richtwert-Obergrenze für erträgliche Kurslast
  const CHART_MAX_SCALE = 42.0; // Visuelle Skala für das Balkendiagramm

  const semesterLabels = [
    { key: 'J1.1', label: '1. Halbjahr (J1.1)', short: 'J1.1', hours: wochenstunden[0] },
    { key: 'J1.2', label: '2. Halbjahr (J1.2)', short: 'J1.2', hours: wochenstunden[1] },
    { key: 'J2.1', label: '3. Halbjahr (J2.1)', short: 'J2.1', hours: wochenstunden[2] },
    { key: 'J2.2', label: '4. Halbjahr (J2.2)', short: 'J2.2', hours: wochenstunden[3] },
  ];

  // Helper for status styling & evaluation
  const getStatus = (hours: number) => {
    if (hours === 0) {
      return {
        label: 'Nicht belegt',
        color: 'bg-slate-200 text-slate-500',
        barColor: 'bg-slate-200',
        textColor: 'text-slate-400',
        diff: 0,
        icon: Info,
      };
    }
    if (hours < MIN_HOURS) {
      const diff = MIN_HOURS - hours;
      return {
        label: `Unter Minimum (-${diff}h)`,
        color: 'bg-amber-100 text-amber-800 border-amber-200',
        barColor: 'bg-gradient-to-t from-amber-500 to-amber-400',
        textColor: 'text-amber-700 font-bold',
        diff: -diff,
        icon: AlertTriangle,
      };
    }
    if (hours <= RECOMMENDED_MAX) {
      return {
        label: 'Optimal (32-36h)',
        color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        barColor: 'bg-gradient-to-t from-emerald-600 to-emerald-400',
        textColor: 'text-emerald-700 font-bold',
        diff: hours - MIN_HOURS,
        icon: CheckCircle2,
      };
    }
    if (hours <= MAX_CAP) {
      return {
        label: `Erhöhte Last (${hours}h)`,
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        barColor: 'bg-gradient-to-t from-blue-600 to-indigo-500',
        textColor: 'text-blue-700 font-bold',
        diff: hours - MIN_HOURS,
        icon: Info,
      };
    }
    const overCap = hours - MAX_CAP;
    return {
      label: `Sehr hohe Last (+${overCap}h)`,
      color: 'bg-rose-100 text-rose-800 border-rose-200',
      barColor: 'bg-gradient-to-t from-rose-600 to-rose-400',
      textColor: 'text-rose-700 font-bold',
      diff: hours - MIN_HOURS,
      icon: AlertTriangle,
    };
  };

  const avgStatus = getStatus(durchschnitt);

  return (
    <div
      id="weekly-hours-chart"
      className="mt-4 pt-4 border-t border-slate-200/80"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>Wochenstunden-Balkendiagramm & Kurslast</span>
              <span className="text-[11px] font-normal text-slate-500 hidden md:inline">
                (Soll: mind. 32 Std. / Richtwert max. 38 Std.)
              </span>
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${avgStatus.color}`}
          >
            <TrendingUp className="w-3 h-3" />
            <span>Ø {durchschnitt.toFixed(1)} Std.</span>
            <span className="font-normal opacity-80">
              {durchschnitt >= MIN_HOURS ? '✓ Soll erfüllt' : `(noch -${(MIN_HOURS - durchschnitt).toFixed(1)}h)`}
            </span>
          </span>

          <button
            onClick={() => setShowDetails((prev) => !prev)}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 inline-flex items-center gap-0.5 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <span>{showDetails ? 'Kompakt' : 'Details'}</span>
            {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Bar Chart Container */}
      <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4">
        {/* Chart Graphic Area with Benchmark Lines */}
        <div className="relative h-44 w-full flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 px-2 sm:px-6">
          {/* Reference Line: 32 Hours (Minimum) */}
          <div
            className="absolute left-0 right-0 border-b border-dashed border-emerald-500/70 pointer-events-none z-10 flex items-center justify-between px-2"
            style={{ bottom: `${(MIN_HOURS / CHART_MAX_SCALE) * 100}%` }}
          >
            <span className="text-[10px] font-bold text-emerald-700 bg-white/90 px-1 rounded shadow-2xs">
              32h Mindest-Soll
            </span>
            <span className="text-[9px] text-emerald-600 hidden sm:inline bg-white/80 px-1 rounded">
              AGVO Minimum
            </span>
          </div>

          {/* Reference Line: 38 Hours (Maximum Guideline) */}
          <div
            className="absolute left-0 right-0 border-b border-dashed border-rose-400/60 pointer-events-none z-10 flex items-center justify-between px-2"
            style={{ bottom: `${(MAX_CAP / CHART_MAX_SCALE) * 100}%` }}
          >
            <span className="text-[10px] font-bold text-rose-600 bg-white/90 px-1 rounded shadow-2xs">
              38h Richtwert-Grenze
            </span>
            <span className="text-[9px] text-rose-500 hidden sm:inline bg-white/80 px-1 rounded">
              Hohe Belastung
            </span>
          </div>

          {/* Semester Bars (J1.1, J1.2, J2.1, J2.2) */}
          {semesterLabels.map((sem, idx) => {
            const status = getStatus(sem.hours);
            const heightPercent = Math.min(100, Math.max(6, (sem.hours / CHART_MAX_SCALE) * 100));

            return (
              <div
                key={sem.key}
                className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer"
              >
                {/* Value Pill on top of bar */}
                <div className="mb-1 text-center transition-transform group-hover:-translate-y-1">
                  <span className={`text-xs sm:text-sm font-extrabold ${status.textColor}`}>
                    {sem.hours}
                  </span>
                  <span className="text-[10px] text-slate-400 block sm:inline sm:ml-0.5">h</span>
                </div>

                {/* Animated Vertical Bar */}
                <div className="w-full max-w-[48px] bg-slate-200/80 rounded-t-xl h-full flex items-end overflow-hidden shadow-2xs">
                  <div
                    className={`w-full rounded-t-xl transition-all duration-300 ${status.barColor}`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>

                {/* Semester Label under bar */}
                <div className="mt-2 text-center">
                  <span className="text-xs font-bold text-slate-700 block">
                    {sem.short}
                  </span>
                  <span className="text-[10px] text-slate-400 hidden sm:block">
                    Sem. {idx + 1}
                  </span>
                </div>

                {/* Hover Tooltip */}
                <div className="absolute -top-16 bg-slate-900 text-white text-[11px] rounded-xl py-1.5 px-3 shadow-xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-30 flex flex-col items-center">
                  <span className="font-bold">{sem.label}</span>
                  <span className="text-slate-300">
                    {sem.hours} Std./Woche • {status.label}
                  </span>
                  <div className="w-2 h-2 bg-slate-900 rotate-45 -mb-1 mt-0.5" />
                </div>
              </div>
            );
          })}

          {/* Comparison Bar: Average (Ø Gesamt) */}
          <div className="flex-1 flex flex-col items-center h-full justify-end relative group border-l border-slate-200 pl-2 cursor-pointer">
            <div className="mb-1 text-center transition-transform group-hover:-translate-y-1">
              <span className={`text-xs sm:text-sm font-black ${avgStatus.textColor}`}>
                {durchschnitt.toFixed(1)}
              </span>
              <span className="text-[10px] text-slate-400 block sm:inline sm:ml-0.5">h</span>
            </div>

            <div className="w-full max-w-[48px] bg-slate-200/80 rounded-t-xl h-full flex items-end overflow-hidden shadow-2xs">
              <div
                className={`w-full rounded-t-xl transition-all duration-300 ${
                  durchschnitt >= MIN_HOURS
                    ? 'bg-gradient-to-t from-blue-700 to-indigo-500'
                    : 'bg-gradient-to-t from-amber-500 to-amber-300'
                }`}
                style={{
                  height: `${Math.min(100, Math.max(6, (durchschnitt / CHART_MAX_SCALE) * 100))}%`,
                }}
              />
            </div>

            <div className="mt-2 text-center">
              <span className="text-xs font-extrabold text-blue-900 block">
                Ø Gesamt
              </span>
              <span className="text-[10px] text-slate-400 hidden sm:block">
                4 Semester
              </span>
            </div>

            {/* Hover Tooltip for Average */}
            <div className="absolute -top-16 bg-slate-900 text-white text-[11px] rounded-xl py-1.5 px-3 shadow-xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-30 flex flex-col items-center">
              <span className="font-bold">Durchschnittliche Kurslast</span>
              <span className="text-slate-300">
                {durchschnitt.toFixed(1)} Wochenstunden im Schnitt (Soll: ≥ 32.0)
              </span>
              <div className="w-2 h-2 bg-slate-900 rotate-45 -mb-1 mt-0.5" />
            </div>
          </div>
        </div>

        {/* Legend / Info Strip */}
        <div className="mt-3 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span>Optimal (32–36h)</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span>Unter Minimum (&lt;32h)</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              <span>Hohe Belastung (&gt;38h)</span>
            </span>
          </div>

          <div className="font-medium text-slate-600">
            {wochenstunden[0] === wochenstunden[2] && wochenstunden[1] === wochenstunden[3] ? (
              <span className="text-emerald-700">✓ Gleichmäßige Semesterverteilung</span>
            ) : Math.abs(wochenstunden[0] - wochenstunden[2]) > 2 ? (
              <span className="text-amber-700">
                ⚠️ Ungleichgewicht zwischen J1 ({wochenstunden[0]}h) und J2 ({wochenstunden[2]}h)
              </span>
            ) : (
              <span>Geringe Semesterdifferenz (±{Math.abs(wochenstunden[0] - wochenstunden[2])}h)</span>
            )}
          </div>
        </div>

        {/* Extended Details Drawer */}
        {showDetails && (
          <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs animate-in fade-in duration-150">
            {semesterLabels.map((sem) => {
              const diffMin = sem.hours - MIN_HOURS;
              const diffMax = MAX_CAP - sem.hours;
              return (
                <div
                  key={`detail-${sem.key}`}
                  className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1"
                >
                  <div className="font-bold text-slate-800 flex items-center justify-between">
                    <span>{sem.label}</span>
                    <span className="text-blue-700 font-extrabold">{sem.hours} Std.</span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Abweichung Minimum (32h):</span>
                    <span
                      className={`font-semibold ${
                        diffMin >= 0 ? 'text-emerald-700' : 'text-amber-600'
                      }`}
                    >
                      {diffMin >= 0 ? `+${diffMin}h` : `${diffMin}h`}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Puffer zur Höchstgrenze (38h):</span>
                    <span
                      className={`font-semibold ${
                        diffMax >= 0 ? 'text-slate-700' : 'text-rose-600 font-bold'
                      }`}
                    >
                      {diffMax >= 0 ? `${diffMax}h Reserve` : `${Math.abs(diffMax)}h Überschreitung`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
