import React, { useEffect, useState, useCallback } from "react";
import { Calendar, Loader2, Clock, MapPin, User, ArrowRight, AlertCircle, PhoneCall } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { getCallToday } from "../api";
import { QuickLog } from "../components/QuickLog";

export default function TodayJobs() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getCallToday();
      setData(res);
    } catch {
      toast.error("Could not load today's jobs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleLogged = async (job, t) => {
    toast.success(`${t.label} — ${job.customer_name}`);
    await load();
  };

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-400 gap-3">
        <Loader2 className="animate-spin" size={32} />
        <p className="font-sans text-sm font-medium">Loading today's jobs…</p>
      </div>
    );
  }

  if (!data) return null;

  const visits = data.todays_visits || [];
  const actionPending = data.gone_quiet || []; // rename this conceptually

  return (
    <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto pb-12" data-testid="today-jobs-view">
      
      {/* ACTION PENDING SECTION */}
      {actionPending.length > 0 && (
        <div className="mb-10">
          <header className="flex items-center gap-3 mb-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-2 shadow-sm text-red-600">
              <AlertCircle size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-heading text-xl md:text-2xl font-black uppercase tracking-tight leading-none text-zinc-900">
                Action Pending
              </h1>
              <p className="font-sans text-sm text-red-600 mt-1 font-medium">
                {actionPending.length} job{actionPending.length === 1 ? '' : 's'} untouched for 1+ days. Action required.
              </p>
            </div>
          </header>
          
          <div className="grid gap-4">
            {actionPending.map((job) => (
              <div 
                key={job.id}
                onClick={() => navigate(`/jobs/${job.id}`)}
                className="group bg-white border border-red-200 hover:border-red-300 rounded-xl shadow-sm hover:shadow-md p-5 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex-1 space-y-2">
                  <h3 className="font-heading font-bold text-lg text-zinc-900">
                    {job.customer_name}
                  </h3>
                  <p className="text-sm font-medium text-zinc-700">
                    {job.problem}
                  </p>
                  <p className="text-xs text-zinc-500">Current Stage: {job.stage}</p>
                </div>
                
                <div className="flex-shrink-0" onClick={e => e.stopPropagation()}>
                  <QuickLog job={job} onLogged={(t) => handleLogged(job, t)}>
                    <button
                      disabled={busy === job.id}
                      className="bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 rounded-md px-4 py-2 font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50"
                    >
                      <PhoneCall size={16} strokeWidth={2} />
                      Log Contact
                    </button>
                  </QuickLog>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TODAY'S VISITS SECTION */}
      <header className="flex items-center gap-3 mb-6 md:mb-8">
        <div className="bg-white border border-zinc-200 rounded-lg p-2 shadow-sm text-blue-600">
          <Calendar size={24} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-black uppercase tracking-tight leading-none text-zinc-900">
            Today's Visits
          </h1>
          <p className="font-sans text-sm text-zinc-500 mt-1">
            {visits.length === 0 
              ? "No visits scheduled for today." 
              : `${visits.length} visit${visits.length === 1 ? '' : 's'} scheduled for today.`}
          </p>
        </div>
      </header>

      {visits.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-12 text-center mt-8">
          <Calendar className="mx-auto mb-4 text-zinc-300" size={48} strokeWidth={1.5} />
          <p className="font-heading font-bold text-xl text-zinc-800">Your schedule is clear</p>
          <p className="text-sm text-zinc-500 mt-2 font-sans">There are no visits scheduled for today.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {visits.map((job) => (
            <div 
              key={job.id}
              onClick={() => navigate(`/jobs/${job.id}`)}
              className="group bg-white border border-zinc-200 hover:border-blue-300 rounded-xl shadow-sm hover:shadow-md p-5 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between md:justify-start gap-4">
                  <h3 className="font-heading font-bold text-lg text-zinc-900 group-hover:text-blue-700 transition-colors">
                    {job.customer_name}
                  </h3>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-blue-700 font-sans text-xs font-semibold">
                    <Clock size={14} />
                    {job.visit?.time || "Time TBD"}
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-3 md:gap-6 text-sm text-zinc-600 font-sans">
                  {job.visit?.technician && (
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-zinc-400" />
                      <span>Tech: <span className="font-medium text-zinc-800">{job.visit.technician}</span></span>
                    </div>
                  )}
                  {job.address && (
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-zinc-400" />
                      <span>{job.address}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                  <p className="text-sm font-medium text-zinc-700 truncate max-w-[80%]">
                    {job.problem}
                  </p>
                  <ArrowRight size={18} className="text-zinc-300 group-hover:text-blue-500 transition-colors transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
