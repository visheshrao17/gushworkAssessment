import React, { useEffect, useState, useCallback } from "react";
import { Sun, CheckCircle2, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { JobCard } from "../components/JobCard";
import { getJobs, setStage } from "../api";

const KANBAN_COLUMNS = [
  "New",
  "Quote Sent",
  "Quote Accepted",
  "Visit Scheduled",
  "In Progress",
  "Completed",
  "Done"
];

// We need to map old or hidden stages so they aren't lost.
const STAGE_MAPPING = {
  "Quote Draft": "New",
  "Quote Rejected": "Done",
  "Lost": "Done",
};

export default function KanbanBoard() {
  const [jobs, setJobs] = useState(null);
  const navigate = useNavigate();

  const load = useCallback(async () => {
    try {
      const data = await getJobs();
      setJobs(data);
    } catch {
      toast.error("Could not load jobs for Kanban");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCardClick = (e, jobId) => {
    if (e.target.closest('a') || e.target.closest('button')) return;
    navigate(`/jobs/${jobId}`);
  };

  const moveStage = async (e, job, newStage) => {
    e.stopPropagation();
    try {
      await setStage(job.id, newStage);
      toast.success(`Moved to ${newStage}`);
      load();
    } catch {
      toast.error("Failed to change stage");
    }
  };

  if (!jobs) {
    return (
      <div className="flex justify-center py-20 text-zinc-500">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  // Group by Kanban columns
  const columns = KANBAN_COLUMNS.map(col => ({ title: col, jobs: [] }));
  
  jobs.forEach(job => {
    let stage = job.stage;
    if (STAGE_MAPPING[stage]) {
      stage = STAGE_MAPPING[stage];
    }
    
    // Find the column index
    const colIndex = KANBAN_COLUMNS.indexOf(stage);
    if (colIndex !== -1) {
      columns[colIndex].jobs.push(job);
    } else {
      // Fallback
      columns[0].jobs.push(job);
    }
  });

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-8rem)]" data-testid="kanban-board-view">
      <header className="flex items-center gap-3 mb-6 md:mb-8 shrink-0">
        <div className="bg-white border border-zinc-200 rounded-lg p-2 shadow-sm text-zinc-700">
          <Sun size={24} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-black uppercase tracking-tight leading-none text-zinc-900">
            Kanban Board
          </h1>
          <p className="font-sans text-sm text-zinc-500 mt-1">
            Track workflow progress across all stages
          </p>
        </div>
      </header>

      <div className="flex flex-col md:flex-row md:items-start md:overflow-x-auto gap-4 md:pb-8 flex-1 w-full scrollbar-thin">
        {columns.map((col, index) => {
          const nextStage = KANBAN_COLUMNS[index + 1];
          return (
            <section key={col.title} className="flex-shrink-0 md:w-[320px] flex flex-col bg-zinc-50 md:bg-zinc-100/50 md:border md:border-zinc-200 md:rounded-xl md:p-3 max-h-full h-full">
              <div className="flex items-center justify-between mb-4 sticky top-0 bg-inherit z-10 py-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 shadow-sm" />
                  <h2 className="font-heading font-semibold text-base text-zinc-800 uppercase tracking-wide">
                    {col.title}
                  </h2>
                </div>
                <span className="font-mono text-xs font-semibold bg-white border border-zinc-200 text-zinc-600 px-2 py-0.5 rounded-full shadow-sm">
                  {col.jobs.length}
                </span>
              </div>
              
              <div className="space-y-3 flex-1 overflow-y-auto min-h-[100px] scrollbar-hide pb-4">
                {col.jobs.length === 0 ? (
                  <div className="text-center py-6 border-2 border-dashed border-zinc-200 rounded-lg text-zinc-400 text-sm font-medium">
                    No jobs
                  </div>
                ) : (
                  col.jobs.map((job) => (
                    <div
                      key={job.id}
                      className="block group cursor-pointer"
                      onClick={(e) => handleCardClick(e, job.id)}
                    >
                      <div className="transition-all duration-200 hover:-translate-y-1">
                        <JobCard job={job}>
                          {nextStage && (
                            <button
                              onClick={(e) => moveStage(e, job, nextStage)}
                              className="mt-2 w-full bg-white border border-zinc-200 text-zinc-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 rounded-md py-2 font-medium text-xs flex items-center justify-center gap-1 transition-colors shadow-sm"
                            >
                              Move to {nextStage}
                            </button>
                          )}
                        </JobCard>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
