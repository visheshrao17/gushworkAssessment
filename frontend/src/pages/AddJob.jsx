import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Loader2, Plus, ClipboardPaste } from "lucide-react";
import { toast } from "sonner";
import { SOURCES, EQUIPMENT_TYPES, createJob, parseMessage } from "../api";

const SOURCE_LABELS = { phone: "Phone", website: "Website", email: "Email", text: "Text", referral: "Referral", other: "Other" };
const EQUIP_LABELS = { "walk-in-cooler": "Walk-in Cooler", "freezer": "Freezer", "ice-machine": "Ice Machine", other: "Other" };

export default function AddJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    email: "",
    address: "",
    problem: "",
    equipment_type: "",
    preferred_contact: "phone",
    customer_remarks: "",
    source: "phone",
    note: "",
  });
  const [raw, setRaw] = useState("");
  const [parsing, setParsing] = useState(false);
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const doExtract = async (text) => {
    if (!text.trim()) return;
    setParsing(true);
    try {
      const res = await parseMessage(text);
      setForm((f) => ({
        ...f,
        customer_name: res.customer_name || f.customer_name,
        phone: res.phone || f.phone,
        email: res.email || f.email,
        address: res.address || f.address,
        problem: res.problem || f.problem,
        equipment_type: res.equipment_type || f.equipment_type,
        customer_remarks: res.customer_remarks || f.customer_remarks,
      }));
      toast.success("Auto-filled from transcript!");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Couldn't read that message");
    } finally {
      setParsing(false);
    }
  };

  const handlePaste = async (e) => {
    const text = e.clipboardData.getData("Text");
    if (text.trim()) {
      setRaw(text);
      await doExtract(text);
    }
  };

  const handleExtractClick = () => doExtract(raw);

  const handleSave = async () => {
    if (!form.customer_name.trim()) {
      toast.error("Customer name is required");
      return;
    }
    setSaving(true);
    try {
      const job = await createJob(form);
      toast.success(`Added ${form.customer_name}`);
      navigate(`/jobs/${job.id}`);
    } catch {
      toast.error("Could not save the job");
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full rounded-md border border-zinc-300 bg-white px-3 py-2.5 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all";
  const labelCls = "font-sans text-xs font-semibold text-zinc-700 mb-1.5 block";
  const pillBtnCls = "flex-1 min-h-[40px] rounded-md border text-[13px] font-sans font-medium transition-colors";

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12" data-testid="add-job-view">
      <header className="mb-6 md:mb-8">
        <h1 className="font-heading text-2xl md:text-3xl font-black uppercase tracking-tight leading-none text-zinc-900">
          Add a Job
        </h1>
        <p className="font-sans text-sm text-zinc-500 mt-1">Capture a new request in seconds</p>
      </header>

      {/* Paste-to-capture */}
      <section className="bg-blue-50/50 border border-blue-200 rounded-xl shadow-sm p-5 md:p-6 space-y-4 relative">
        <div className="flex items-center gap-2 text-blue-800">
          <Sparkles size={18} strokeWidth={2} />
          <h2 className="font-heading font-semibold text-base tracking-tight">
            Auto-fill from Transcript
          </h2>
        </div>
        <p className="text-sm text-blue-900/70 -mt-2">
          Paste a call transcript, email, or message — AI will extract the details into the form below.
        </p>
        <div className="relative mt-2">
          <textarea
            data-testid="paste-textarea"
            rows={4}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            onPaste={handlePaste}
            placeholder={"Paste transcript here...\n\ne.g. Customer: Hi, our walk-in cooler stopped cooling...\nTechnician: I'll check the compressor..."}
            className="w-full rounded-lg border border-blue-200 bg-white px-4 py-3 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 transition-all placeholder:text-zinc-400"
            disabled={parsing}
          />
          {parsing && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] rounded-lg flex flex-col items-center justify-center gap-3">
              <Loader2 className="animate-spin text-blue-600" size={24} />
              <span className="font-sans text-sm font-semibold text-blue-800">Extracting details...</span>
            </div>
          )}
        </div>
        <button
          data-testid="extract-button"
          disabled={!raw.trim() || parsing}
          onClick={handleExtractClick}
          className="min-h-[44px] w-full rounded-md bg-blue-600 hover:bg-blue-700 text-white font-sans font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50 disabled:hover:bg-blue-600"
        >
          {!parsing && <ClipboardPaste size={16} strokeWidth={2} />}
          {parsing ? "Extracting..." : "Extract Details"}
        </button>
      </section>

      {/* Manual form */}
      <section className="bg-white border border-zinc-200 rounded-xl shadow-sm p-5 md:p-6 space-y-5">
        <div>
          <label className={labelCls}>Customer Name *</label>
          <input
            data-testid="input-customer-name"
            className={inputCls}
            value={form.customer_name}
            onChange={(e) => set("customer_name", e.target.value)}
            placeholder="Mario's Trattoria"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
            <label className={labelCls}>Phone</label>
            <input
                data-testid="input-phone"
                className={inputCls}
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="(503) 555-0100"
            />
            </div>
            <div>
            <label className={labelCls}>Email (optional)</label>
            <input
                data-testid="input-email"
                className={inputCls}
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="tom@email.com"
            />
            </div>
        </div>
        <div>
          <label className={labelCls}>Service/Job Address</label>
          <input
            data-testid="input-address"
            className={inputCls}
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
            placeholder="123 Main St, Portland"
          />
        </div>
        <div>
          <label className={labelCls}>Problem / Service Required</label>
          <textarea
            data-testid="input-problem"
            rows={2}
            className={inputCls}
            value={form.problem}
            onChange={(e) => set("problem", e.target.value)}
            placeholder="Walk-in freezer not holding temp"
          />
        </div>
        <div>
          <label className={labelCls}>Customer Remarks</label>
          <input
            data-testid="input-remarks"
            className={inputCls}
            value={form.customer_remarks}
            onChange={(e) => set("customer_remarks", e.target.value)}
            placeholder="Needs it fixed before Friday"
          />
        </div>

        <div className="pt-2 border-t border-zinc-100">
          <label className={labelCls}>Equipment Type</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {EQUIPMENT_TYPES.map((s) => (
              <button
                key={s}
                data-testid={`equip-${s}`}
                onClick={() => set("equipment_type", s)}
                className={`${pillBtnCls} ${
                  form.equipment_type === s 
                    ? "bg-zinc-900 border-zinc-900 text-white" 
                    : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                {EQUIP_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={labelCls}>Preferred Contact</label>
          <div className="flex gap-2">
            {["phone", "email", "text"].map((s) => (
              <button
                key={s}
                onClick={() => set("preferred_contact", s)}
                className={`${pillBtnCls} capitalize ${
                  form.preferred_contact === s 
                    ? "bg-zinc-900 border-zinc-900 text-white" 
                    : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={labelCls}>Source</label>
          <div className="grid grid-cols-3 gap-2">
            {SOURCES.map((s) => (
              <button
                key={s}
                onClick={() => set("source", s)}
                className={`${pillBtnCls} ${
                  form.source === s 
                    ? "bg-zinc-900 border-zinc-900 text-white" 
                    : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                }`}
              >
                {SOURCE_LABELS[s]}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className={labelCls}>Internal Note</label>
          <input
            data-testid="input-note"
            className={inputCls}
            value={form.note}
            onChange={(e) => set("note", e.target.value)}
            placeholder="Optional reminder to self"
          />
        </div>

        <button
          data-testid="save-job-button"
          disabled={saving}
          onClick={handleSave}
          className="mt-8 min-h-[48px] w-full rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-sans font-semibold text-base flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-70"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Plus size={20} strokeWidth={2} />}
          Save Job
        </button>
      </section>
    </div>
  );
}
