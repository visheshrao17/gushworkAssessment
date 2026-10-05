import React, { useEffect, useState, useCallback } from "react";
import {
  BarChart3, Sparkles, Loader2, DollarSign, Briefcase, CheckCircle2,
  AlertTriangle, PhoneOff, Clock
} from "lucide-react";
import { toast } from "sonner";
import { getDashboard } from "../api";

const EQUIP_LABELS = {
  "walk-in-cooler": "Walk-in Cooler",
  "freezer": "Freezer",
  "ice-machine": "Ice Machine",
  "other": "Other",
};

const SOURCE_LABELS = {
  phone: "Phone",
  website: "Website",
  email: "Email",
  text: "Text",
  referral: "Referral",
  other: "Other",
};

function StatCard({ icon: Icon, label, value, color = "bg-white", textClass = "text-zinc-900" }) {
  return (
    <div className={`${color} border border-zinc-200 rounded-xl shadow-sm p-4 flex flex-col gap-3 transition-shadow hover:shadow-md`}>
      <div className="flex items-center gap-2">
        <Icon size={16} strokeWidth={2.5} className="text-zinc-500" />
        <p className="font-sans text-xs font-semibold uppercase tracking-wider text-zinc-500">
          {label}
        </p>
      </div>
      <div>
        <p className={`font-heading text-3xl font-bold leading-none ${textClass}`}>{value}</p>
      </div>
    </div>
  );
}

function BreakdownBar({ items, labels, colors }) {
  const total = Object.values(items).reduce((a, b) => a + b, 0);
  if (total === 0) return null;
  return (
    <div className="space-y-3">
      {Object.entries(items)
        .sort((a, b) => b[1] - a[1])
        .map(([key, count]) => {
          const pct = Math.round((count / total) * 100);
          return (
            <div key={key} className="flex items-center gap-3">
              <span className="font-sans text-xs font-medium w-28 text-right text-zinc-600 truncate">
                {labels[key] || key}
              </span>
              <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${colors?.[key] || "bg-zinc-800"} rounded-full transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="font-sans text-xs font-semibold w-8 text-zinc-700">{count}</span>
            </div>
          );
        })}
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setData(await getDashboard());
    } catch {
      toast.error("Could not load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-zinc-400 gap-3">
        <Loader2 className="animate-spin" size={32} />
        <p className="font-sans text-sm font-medium">Loading dashboard & AI insights…</p>
      </div>
    );
  }

  if (!data) return null;

  const { stats, insight_text } = data;

  return (
    <div className="space-y-6 md:space-y-8 max-w-5xl mx-auto pb-12" data-testid="dashboard-view">
      {/* Header */}
      <header className="flex items-center gap-3 mb-6 md:mb-8">
        <div className="bg-white border border-zinc-200 rounded-lg p-2 shadow-sm text-zinc-700">
          <BarChart3 size={24} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-black uppercase tracking-tight leading-none text-zinc-900">
            Trackers
          </h1>
          <p className="font-sans text-sm text-zinc-500 mt-1">
            Overview & AI insights
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* Left Column: Insights & Breakdown */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {/* AI Insight */}
          <section className="bg-zinc-900 text-white rounded-xl shadow-md p-6 md:p-8 space-y-4">
            <div className="flex items-center gap-2 text-blue-400">
              <Sparkles size={20} strokeWidth={2.5} />
              <h2 className="font-heading font-semibold text-lg tracking-tight">
                AI Priority Insights
              </h2>
            </div>
            <div className="text-sm leading-relaxed text-zinc-300 whitespace-pre-line font-sans">
              {insight_text}
            </div>
          </section>

          {/* Breakdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Stage Breakdown */}
            <section>
              <h2 className="font-sans font-semibold text-sm text-zinc-500 uppercase tracking-wider mb-3">
                By Stage
              </h2>
              <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-5">
                <BreakdownBar
                  items={Object.fromEntries(
                    Object.entries(stats.by_stage).filter(([, v]) => v > 0)
                  )}
                  labels={Object.fromEntries(
                    Object.keys(stats.by_stage).map((k) => [k, k])
                  )}
                />
              </div>
            </section>

            {/* Source Breakdown */}
            <section>
              <h2 className="font-sans font-semibold text-sm text-zinc-500 uppercase tracking-wider mb-3">
                By Source
              </h2>
              <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-5">
                <BreakdownBar items={stats.by_source} labels={SOURCE_LABELS} />
              </div>
            </section>

            {/* Equipment Breakdown */}
            <section className="md:col-span-2">
              <h2 className="font-sans font-semibold text-sm text-zinc-500 uppercase tracking-wider mb-3">
                By Equipment
              </h2>
              <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-5">
                <BreakdownBar items={stats.by_equipment} labels={EQUIP_LABELS} />
              </div>
            </section>
          </div>
        </div>

        {/* Right Column: Stats Grid */}
        <div className="space-y-6">
          <section>
            <h2 className="font-sans font-semibold text-sm text-zinc-500 uppercase tracking-wider mb-3">
              Overview
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              <StatCard icon={Briefcase} label="Total Jobs" value={stats.total_jobs} />
              <StatCard icon={Clock} label="Open" value={stats.open_jobs} color="bg-blue-50/50" textClass="text-blue-700" />
              <StatCard icon={CheckCircle2} label="Completed" value={stats.completed_jobs} color="bg-emerald-50/50" textClass="text-emerald-700" />
              <StatCard icon={PhoneOff} label="Gone Quiet" value={stats.quiet_jobs} color="bg-red-50/50" textClass="text-red-700" />
              <StatCard icon={AlertTriangle} label="Lost" value={stats.lost_jobs} color="bg-zinc-50" textClass="text-zinc-500" />
              
              <div className="col-span-2 lg:col-span-1 border border-zinc-200 bg-white rounded-xl shadow-sm p-5 flex flex-col gap-1 mt-2">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign size={18} strokeWidth={2} className="text-zinc-500" />
                  <p className="font-sans text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Revenue
                  </p>
                </div>
                <p className="font-heading text-4xl font-bold text-zinc-900 leading-none">
                  ${stats.total_revenue.toLocaleString()}
                </p>
                
                {stats.pending_revenue > 0 && (
                  <div className="mt-4 pt-4 border-t border-zinc-100 flex justify-between items-end">
                    <div>
                      <p className="font-sans text-[10px] font-semibold uppercase tracking-wider text-amber-600 mb-1">
                        Pipeline
                      </p>
                      <p className="font-heading text-xl font-bold text-amber-700 leading-none">
                        ${stats.pending_revenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
