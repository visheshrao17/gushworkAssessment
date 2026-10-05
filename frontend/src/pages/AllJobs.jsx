import React, { useEffect, useState, useCallback } from "react";
import { Loader2, Layers } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { JobCard } from "../components/JobCard";
import { STAGES, getJobs, getCounts } from "../api";

const FILTERS = ["All", ...STAGES];

export default function AllJobs() {
  const [filter, setFilter] = useState("All");
  const [jobs, setJobs] = useState(null);
  const [counts, setCounts] = useState(null);

  const load = useCallback(async () => {
    try {
      const [j, c] = await Promise.all([
        getJobs(filter === "All" ? null : filter),
        getCounts(),
      ]);
      setJobs(j);
      setCounts(c);
    } catch (e) {
      toast.error("Could not load jobs");
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCardClick = (e, jobId) => {
    if (e.target.closest('a') || e.target.closest('button')) return;
    navigate(`/jobs/${jobId}`);
  };

  return (
    <div className="space-y-6" data-testid="all-jobs-view">
      <header className="mb-6 md:mb-8">
        <h1 className="font-heading text-2xl md:text-3xl font-black uppercase tracking-tight leading-none text-zinc-900">
          All Jobs
        </h1>
        <p className="font-sans text-sm text-zinc-500 mt-1">The full picture, any time</p>
      </header>

      {/* Count summary */}
      {counts && (
        <div className="grid grid-cols-3 gap-3 md:gap-4" data-testid="counts-summary">
          <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-4 text-center">
            <div className="font-heading text-3xl font-bold text-zinc-900">{counts.open}</div>
            <div className="font-sans text-xs font-semibold text-zinc-500 uppercase tracking-wider mt-1">Open</div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg shadow-sm p-4 text-center">
            <div className="font-heading text-3xl font-bold text-amber-700">
              {(counts.by_stage["Quote Draft"] || 0) + (counts.by_stage["Quote Sent"] || 0)}
            </div>
            <div className="font-sans text-xs font-semibold text-amber-600 uppercase tracking-wider mt-1">Quoted</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg shadow-sm p-4 text-center">
            <div className="font-heading text-3xl font-bold text-red-700">{counts.quiet}</div>
            <div className="font-sans text-xs font-semibold text-red-600 uppercase tracking-wider mt-1">Quiet</div>
          </div>
        </div>
      )}

      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
        {FILTERS.map((f) => (
          <button
            key={f}
            data-testid={`filter-${f}`}
            onClick={() => {
              setJobs(null); // Show loading
              setFilter(f);
            }}
            className={`shrink-0 border px-4 py-2 rounded-full font-sans text-[13px] font-medium transition-colors ${
              filter === f 
                ? "bg-zinc-900 border-zinc-900 text-white" 
                : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            {f}
            {f !== "All" && counts && counts.by_stage[f] !== undefined ? ` (${counts.by_stage[f]})` : ""}
          </button>
        ))}
      </div>

      {!jobs ? (
        <div className="flex justify-center py-16 text-zinc-400">
          <Loader2 className="animate-spin" size={32} />
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm p-12 text-center max-w-md mx-auto">
          <Layers className="mx-auto mb-3 text-zinc-300" size={40} strokeWidth={2} />
          <p className="font-heading font-semibold text-xl text-zinc-800">No jobs here</p>
          <p className="text-sm text-zinc-500 mt-1">
            {filter === "All" ? "You have no jobs." : `No jobs in stage ${filter}.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="block group cursor-pointer"
              onClick={(e) => handleCardClick(e, job.id)}
            >
              <div className="transition-all duration-200 hover:-translate-y-1 h-full">
                <JobCard job={job} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
