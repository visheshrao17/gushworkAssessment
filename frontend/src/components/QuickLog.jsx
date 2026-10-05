import React, { useState } from "react";
import { PhoneCall, Voicemail, MessageSquare, Mail, Loader2 } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "./ui/drawer";
import { logContact } from "../api";

const TEMPLATES = [
  { kind: "call", label: "Called", icon: PhoneCall, bg: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" },
  { kind: "voicemail", label: "Left voicemail", icon: Voicemail, bg: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100" },
  { kind: "text", label: "Texted", icon: MessageSquare, bg: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" },
  { kind: "email", label: "Emailed", icon: Mail, bg: "bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100" },
];

export const QuickLog = ({ job, onLogged, children }) => {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(null);

  const log = async (t) => {
    setBusy(t.kind);
    try {
      await logContact(job.id, t.kind, t.label);
      setOpen(false);
      onLogged?.(t);
    } finally {
      setBusy(null);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent
        data-testid="quick-log-sheet"
        className="max-w-md mx-auto border-t border-zinc-200 rounded-t-2xl bg-white shadow-xl"
      >
        <DrawerHeader className="text-left px-5 pt-6 pb-2">
          <DrawerTitle className="font-heading font-bold tracking-tight text-xl text-zinc-900">
            Log contact
          </DrawerTitle>
          <p className="font-sans text-sm text-zinc-500">{job.customer_name}</p>
        </DrawerHeader>
        <div className="grid grid-cols-2 gap-3 p-5 pb-8">
          {TEMPLATES.map((t) => (
            <button
              key={t.kind}
              data-testid={`quicklog-${t.kind}`}
              disabled={busy}
              onClick={() => log(t)}
              className={`${t.bg} min-h-[80px] rounded-xl border font-sans font-semibold text-sm flex flex-col items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:hover:scale-100`}
            >
              {busy === t.kind ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <t.icon size={24} strokeWidth={2} />
              )}
              {t.label}
            </button>
          ))}
        </div>
        <DrawerClose asChild>
          <button
            data-testid="quicklog-cancel"
            className="mx-5 mb-8 min-h-[44px] rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 font-sans text-sm font-semibold text-zinc-600 transition-colors"
          >
            Cancel
          </button>
        </DrawerClose>
      </DrawerContent>
    </Drawer>
  );
};
