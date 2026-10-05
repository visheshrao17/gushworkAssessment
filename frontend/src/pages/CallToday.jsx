import React, { useEffect, useState, useCallback } from "react";
import { Sun, PhoneCall, CheckCircle2, ArrowRight, Loader2, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { JobCard } from "../components/JobCard";
import { QuickLog } from "../components/QuickLog";
import { getCallToday } from "../api";

const BUCKETS = [
  {
    key: "new_requests",
    title: "New requests",
    sub: "Reach out to them now",
    bar: "bg-status-new",
    primary: { label: "View & Quote", next: "Quote Draft", icon: ArrowRight },
  },
  {
    key: "pending_quotes",
    title: "Pending Quotes",
    sub: "Waiting for their approval",
    bar: "bg-status-quote",
    primary: { label: "Follow Up", icon: PhoneCall },
  },
  {
    key: "needs_scheduling",
    title: "Needs scheduling",
    sub: "Quote accepted, book a tech",
    bar: "bg-status-sched",
    primary: { label: "Schedule Visit", next: "Visit Scheduled", icon: Calendar },
  },
  {
    key: "todays_visits",
    title: "Today's visits",
    sub: "Tech is heading there today",
    bar: "bg-status-sched",
  },
  {
    key: "gone_quiet",
    title: "Gone quiet",
    sub: "No contact in 2+ days — chase them",
    bar: "bg-status-quiet",
  },
];

export default function CallToday() {
  const [data, setData] = useState(null);
  const [busy, setBusy] = useState(null);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    try {
      setData(await getCallToday());
    } catch {
      toast.error("Could not load today's list");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleLogged = async (job, t) => {
    toast.success(`${t.label} — ${job.customer_name}`);
    await load();
  };

  const handleCardClick = (e, jobId) => {
    if (e.target.closest('a') || e.target.closest('button')) return;
    navigate(`/jobs/${jobId}`);
  };

  if (!data) {
    return (
      <div className="flex justify-center py-20 text-zinc-500">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" data-testid="call-today-view">
      <header className="flex items-center gap-3 mb-6 md:mb-8">
        <div className="bg-white border border-zinc-200 rounded-lg p-2 shadow-sm text-zinc-700">
          <Sun size={24} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-black uppercase tracking-tight leading-none text-zinc-900">
            Kanban Board
          </h1>
          <p className="font-sans text-sm text-zinc-500 mt-1" data-testid="call-today-count">
            {data.total} {data.total === 1 ? "job requires" : "jobs require"} attention today
          </p>
        </div>
      </header>

      {data.total === 0 && (
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-8 text-center max-w-md mx-auto mt-8">
          <CheckCircle2 className="mx-auto mb-3 text-emerald-500" size={40} strokeWidth={2} />
          <p className="font-heading font-bold text-xl text-zinc-900">All caught up!</p>
          <p className="text-sm text-zinc-500 mt-1">Nobody's waiting on you right now.</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-start md:overflow-x-auto gap-6 md:gap-4 md:pb-8 flex-1 w-full">
        {BUCKETS.map((b) => {
          const jobs = data[b.key] || [];
          if (jobs.length === 0) return null;
          return (
            <section key={b.key} data-testid={`bucket-${b.key}`} className="flex-shrink-0 md:w-80 flex flex-col bg-zinc-50 md:bg-zinc-100/50 md:border md:border-zinc-200 md:rounded-xl md:p-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className={`${b.bar} w-3 h-3 rounded-full shadow-sm`} />
                  <h2 className="font-heading font-semibold text-lg text-zinc-800">
                    {b.title}
                  </h2>
                </div>
                <span className="font-mono text-xs font-semibold bg-white border border-zinc-200 text-zinc-600 px-2 py-0.5 rounded-full shadow-sm">
                  {jobs.length}
                </span>
              </div>
              <p className="text-xs text-zinc-500 mb-4">{b.sub}</p>
              
              <div className="space-y-3 flex-1">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="block group cursor-pointer"
                    onClick={(e) => handleCardClick(e, job.id)}
                  >
                    <div className="transition-all duration-200 hover:-translate-y-1">
                      <JobCard job={job}>
                        {b.key === "gone_quiet" || b.key === "pending_quotes" ? (
                          <QuickLog job={job} onLogged={(t) => handleLogged(job, t)}>
                            <button
                              data-testid={`primary-action-${job.id}`}
                              disabled={busy === job.id}
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                              className="mt-2 w-full bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 rounded-md py-2 font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-50"
                            >
                              <PhoneCall size={16} strokeWidth={2} />
                              Log a chase
                            </button>
                          </QuickLog>
                        ) : b.primary && b.primary.label ? (
                          <div
                            data-testid={`primary-action-${job.id}`}
                            className="mt-2 w-full bg-white border border-zinc-200 text-zinc-700 group-hover:bg-zinc-50 group-hover:text-zinc-900 rounded-md py-2 font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
                          >
                            <b.primary.icon size={16} strokeWidth={2} />
                            {b.primary.label}
                          </div>
                        ) : null}
                      </JobCard>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
