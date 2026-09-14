import React, { useState } from 'react';
import { Share2, Copy, Check, MessageSquare, Mail, FileText, X } from 'lucide-react';
import { BelegtesFach, ValidierungsErgebnis } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  belegung: BelegtesFach[];
  validation: ValidierungsErgebnis;
  shareUrl: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  belegung,
  validation,
  shareUrl,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // ignore
    }
  };

  // Generate text summary
  const lfText = validation.abiturFaecher.schriftlich.map((f) => f.name).join(', ') || 'Keine';
  const muendlText = validation.abiturFaecher.muendlich.map((f) => f.name).join(', ') || 'Keine';
  const statusStr = validation.gueltig ? 'GÜLTIG (AGVO BW)' : 'OFFEN / UNVOLLSTÄNDIG';

  const textSummary = `--- Meine Kurswahl für die gymnasiale Oberstufe (Baden-Württemberg) ---
Status: ${statusStr}
3 Leistungsfächer (LF): ${lfText}
2 Mündliche Prüfungsfächer: ${muendlText}
Belegte Kurse insgesamt: ${validation.anzahlKurseGesamt} (mind. 42)
Durchschnittliche Wochenstunden: ${validation.durchschnittWochenstunden.toFixed(1)} Std. (mind. 32.0)
Anrechnungspflichtige Kurse (Block I): ${validation.anrechnungspflichtigCount} / 40 Kurse

Direkter Link zum Öffnen & Bearbeiten:
${shareUrl}`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(textSummary);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } catch {
      // ignore
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `Meine Kurswahl Oberstufe BW:\n${shareUrl}`
  )}`;

  const mailtoUrl = `mailto:?subject=${encodeURIComponent(
    'Kurswahl Oberstufe Baden-Württemberg'
  )}&body=${encodeURIComponent(textSummary)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="share-modal"
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Kurswahl teilen oder speichern
              </h3>
              <p className="text-xs text-slate-500">
                Die Kurswahl ist verschlüsselt im Link gespeichert und kann jederzeit geladen werden.
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
        <div className="p-5 space-y-4">
          {/* Link Box */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Direktlink zu deiner Kurswahl:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shrink-0 shadow-xs cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Kopiert!' : 'Kopieren'}</span>
              </button>
            </div>
          </div>

          {/* Social / App buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Per WhatsApp</span>
            </a>

            <a
              href={mailtoUrl}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-colors"
            >
              <Mail className="w-4 h-4 text-slate-600" />
              <span>Per E-Mail</span>
            </a>
          </div>

          {/* Text summary */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={handleCopyText}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
            >
              {copiedText ? <Check className="w-4 h-4 text-emerald-600" /> : <FileText className="w-4 h-4 text-blue-600" />}
              <span>{copiedText ? 'Textzusammenfassung kopiert!' : 'Text für Oberstufenberater kopieren'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-200/80 transition-colors cursor-pointer"
          >
            Fertig
          </button>
        </div>
      </div>
    </div>
  );
};
