import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, PhoneCall, Plus, Calendar, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { StatusPill } from "../components/StatusPill";
import { QuickLog } from "../components/QuickLog";
import {
  getJob,
  setStage,
  createQuote,
  sendQuote,
  acceptQuote,
  rejectQuote,
  createVisit,
  startJob,
  completeJob,
  deleteJob
} from "../api";

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [busy, setBusy] = useState(false);
  
  // Forms
  const [quoteForm, setQuoteForm] = useState({ amount: "", description: "" });
  const [visitForm, setVisitForm] = useState({ date: "", time: "", technician: "Denise" });
  const [completionForm, setCompletionForm] = useState({ work_performed: "", final_amount: "", technician: "Denise" });

  const load = useCallback(async () => {
    try {
      setJob(await getJob(id));
    } catch {
      toast.error("Could not load job");
      navigate("/");
    }
  }, [id, navigate]);

  useEffect(() => {
    load();
  }, [load]);

  const act = async (actionFn, successMsg) => {
    setBusy(true);
    try {
      await actionFn();
      toast.success(successMsg);
      await load();
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  if (!job) {
    return (
      <div className="flex justify-center py-20 text-zinc-500">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  const handleCreateQuote = () => {
    act(() => createQuote(id, { amount: parseFloat(quoteForm.amount), description: quoteForm.description }), "Quote created");
  };

  const handleCreateVisit = () => {
    act(() => createVisit(id, visitForm), "Visit scheduled");
  };

  const handleCompleteJob = () => {
    act(() => completeJob(id, { 
      work_performed: completionForm.work_performed, 
      final_amount: parseFloat(completionForm.final_amount), 
      technician: completionForm.technician 
    }), "Job completed!");
  };

  const btnCls = "min-h-[44px] rounded-md font-sans font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 px-4";
  const inputCls = "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all";
  const labelCls = "font-sans text-xs font-semibold text-zinc-700 mb-1 block";

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto" data-testid="job-detail-view">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 border border-zinc-200 rounded-md shadow-sm bg-white hover:bg-zinc-50 transition-colors">
          <ArrowLeft size={18} strokeWidth={2} className="text-zinc-700" />
        </button>
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-black uppercase tracking-tight leading-none text-zinc-900">
            {job.customer_name}
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <StatusPill label={job.stage} variant={job.stage} />
          </div>
        </div>
      </header>

      {/* Basic Info */}
      <section className="bg-white border border-zinc-200 rounded-xl shadow-sm p-5 md:p-6 space-y-4">
        {job.phone && (
          <div className="flex justify-between items-center border-b border-zinc-100 pb-4">
            <div>
              <p className={labelCls}>Phone</p>
              <p className="font-mono text-sm">
                <a href={`tel:${job.phone}`} className="hover:underline text-blue-600">{job.phone}</a>
              </p>
            </div>
            <QuickLog job={job} onLogged={(t) => act(() => Promise.resolve(), `${t.label} logged`)}>
              <button disabled={busy} className="p-2.5 bg-zinc-900 hover:bg-zinc-800 transition-colors text-white rounded-md shadow-sm">
                <PhoneCall size={16} />
              </button>
            </QuickLog>
          </div>
        )}
        
        {job.address && (
          <div className="border-b border-zinc-100 pb-4">
            <p className={labelCls}>Address</p>
            <p className="text-sm font-medium text-zinc-800">{job.address}</p>
          </div>
        )}
        
        <div>
          <p className={labelCls}>Problem / Equipment</p>
          <p className="text-sm text-zinc-700 leading-relaxed">{job.problem || "No problem described"}</p>
          {job.equipment_type && (
            <span className="inline-block mt-3 bg-zinc-100 text-zinc-700 px-2.5 py-1 text-xs font-mono rounded-md border border-zinc-200">
              {job.equipment_type.replace(/-/g, " ")}
            </span>
          )}
        </div>
      </section>

      {/* Quote Section */}
      <section className="bg-amber-50/50 border border-amber-200 rounded-xl shadow-sm p-5 md:p-6 space-y-5">
        <h2 className="font-heading font-bold text-lg text-amber-900 flex items-center gap-2">
          <span className="w-2 h-2 bg-amber-500 rounded-full inline-block" /> Quote
        </h2>
        
        {!job.quote ? (
          <div className="space-y-4 bg-white p-4 rounded-lg border border-amber-100 shadow-sm">
            <div>
              <label className={labelCls}>Amount ($)</label>
              <input type="number" className={inputCls} value={quoteForm.amount} onChange={e => setQuoteForm({...quoteForm, amount: e.target.value})} placeholder="e.g. 500" />
            </div>
            <div>
              <label className={labelCls}>Description</label>
              <input type="text" className={inputCls} value={quoteForm.description} onChange={e => setQuoteForm({...quoteForm, description: e.target.value})} placeholder="e.g. Compressor replacement" />
            </div>
            <button onClick={handleCreateQuote} disabled={busy || !quoteForm.amount} className={`${btnCls} w-full bg-amber-400 hover:bg-amber-500 text-amber-950`}>
              <Plus size={18} /> Add Quote
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white border border-amber-200 rounded-lg p-4 flex justify-between items-center shadow-sm">
              <div>
                <p className="text-xs text-zinc-500 font-sans font-medium mb-1">Amount</p>
                <p className="font-bold text-xl text-zinc-900">${job.quote.amount.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-zinc-500 font-sans font-medium mb-1">Status</p>
                <p className="font-bold text-zinc-900">{job.stage.startsWith("Quote") ? job.stage : "Approved"}</p>
              </div>
            </div>
            <p className="text-sm italic text-zinc-600 px-1">{job.quote.description}</p>
            
            {job.stage === "Quote Draft" && (
              <button onClick={() => act(() => sendQuote(id), "Quote Sent")} disabled={busy} className={`${btnCls} w-full bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm`}>
                Mark Quote Sent
              </button>
            )}
            {job.stage === "Quote Sent" && (
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => act(() => acceptQuote(id), "Quote Accepted")} disabled={busy} className={`${btnCls} flex-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300`}>
                  Customer Accepted
                </button>
                <button onClick={() => act(() => rejectQuote(id), "Quote Rejected")} disabled={busy} className={`${btnCls} flex-1 bg-red-100 hover:bg-red-200 text-red-800 border border-red-300`}>
                  Customer Rejected
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Visit Section */}
      {(job.stage === "Quote Accepted" || job.visit) && (
        <section className="bg-emerald-50/50 border border-emerald-200 rounded-xl shadow-sm p-5 md:p-6 space-y-5">
          <h2 className="font-heading font-bold text-lg text-emerald-900 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block" /> Visit / Schedule
          </h2>
          
          {!job.visit ? (
            <div className="space-y-4 bg-white p-4 rounded-lg border border-emerald-100 shadow-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Date</label>
                  <input type="date" className={inputCls} value={visitForm.date} onChange={e => setVisitForm({...visitForm, date: e.target.value})} />
                </div>
                <div>
                  <label className={labelCls}>Time</label>
                  <input type="time" className={inputCls} value={visitForm.time} onChange={e => setVisitForm({...visitForm, time: e.target.value})} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Technician</label>
                <input type="text" className={inputCls} value={visitForm.technician} onChange={e => setVisitForm({...visitForm, technician: e.target.value})} />
              </div>
              <button onClick={handleCreateVisit} disabled={busy || !visitForm.date} className={`${btnCls} w-full bg-emerald-500 hover:bg-emerald-600 text-white`}>
                <Calendar size={18} /> Schedule Visit
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white border border-emerald-200 rounded-lg p-4 shadow-sm">
                <p className="font-sans font-bold flex items-center gap-2 text-emerald-900">
                  <Calendar size={18} className="text-emerald-600" /> {job.visit.date} at {job.visit.time}
                </p>
                <p className="text-sm mt-2 text-zinc-600">Tech: <span className="font-medium text-zinc-900">{job.visit.technician}</span></p>
              </div>
              {job.stage === "Visit Scheduled" && (
                <button onClick={() => act(() => startJob(id), "Job started")} disabled={busy} className={`${btnCls} w-full bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm`}>
                  Start Job (In Progress)
                </button>
              )}
            </div>
          )}
        </section>
      )}

      {/* Completion Section */}
      {(job.stage === "In Progress" || job.completion) && (
        <section className="bg-zinc-50 border border-zinc-200 rounded-xl shadow-sm p-5 md:p-6 space-y-5">
          <h2 className="font-heading font-bold text-lg text-zinc-800 flex items-center gap-2">
            <CheckCircle size={18} className="text-zinc-500" /> Completion
          </h2>
          
          {!job.completion ? (
            <div className="space-y-4 bg-white p-4 rounded-lg border border-zinc-200 shadow-sm">
              <div>
                <label className={labelCls}>Final Amount ($)</label>
                <input type="number" className={inputCls} value={completionForm.final_amount} onChange={e => setCompletionForm({...completionForm, final_amount: e.target.value})} />
              </div>
              <div>
                <label className={labelCls}>Work Performed</label>
                <textarea rows={3} className={inputCls} value={completionForm.work_performed} onChange={e => setCompletionForm({...completionForm, work_performed: e.target.value})} />
              </div>
              <button onClick={handleCompleteJob} disabled={busy || !completionForm.final_amount} className={`${btnCls} w-full bg-zinc-900 hover:bg-zinc-800 text-white shadow-sm`}>
                <CheckCircle size={18} /> Mark Completed
              </button>
            </div>
          ) : (
            <div className="bg-white border border-zinc-200 rounded-lg p-5 space-y-4 shadow-sm">
              <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                <p className="text-xs text-zinc-500 font-sans font-medium">Final Amount</p>
                <p className="font-bold text-xl text-zinc-900">${job.completion.final_amount?.toFixed(2) || job.quote?.amount?.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-sans font-medium mb-1">Work Performed</p>
                <p className="text-sm text-zinc-800">{job.completion.work_performed || "N/A"}</p>
              </div>
            </div>
          )}
        </section>
      )}

      <div className="pt-4 border-t border-zinc-200">
        <button onClick={() => act(() => setStage(id, "Lost"), "Job marked lost")} disabled={busy} className="text-sm font-sans font-medium text-red-600 hover:text-red-700 hover:underline block text-center w-full p-2">
          Mark as Lost
        </button>
      </div>

    </div>
  );
}
