import React from "react";
import { Phone, Clock, Globe, MessageSquare, Users, PhoneCall } from "lucide-react";
import { StatusPill } from "./StatusPill";
import { waitLabel } from "../api";

const SOURCE_ICON = {
  phone: PhoneCall,
  website: Globe,
  text: MessageSquare,
  referral: Users,
};

export const JobCard = ({ job, children, showStage = true }) => {
  const SrcIcon = SOURCE_ICON[job.source] || PhoneCall;
  const variant = job.is_quiet ? "quiet" : job.stage;

  return (
    <div
      data-testid="job-card"
      className="bg-white border border-zinc-200 shadow-sm hover:shadow-md transition-shadow rounded-lg p-4 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-heading font-semibold text-base md:text-lg leading-tight text-zinc-900">
          {job.customer_name}
        </h3>
        {showStage && (
          <StatusPill
            label={job.is_quiet ? "Gone Quiet" : job.stage}
            variant={variant}
            data-testid="job-stage-pill"
          />
        )}
      </div>

      <p className="text-sm text-zinc-600 leading-snug">{job.problem || "—"}</p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-sans text-[11px] text-zinc-500">
        {job.phone && (
          <a
            href={`tel:${job.phone}`}
            className="flex items-center gap-1.5 text-zinc-700 font-medium hover:text-zinc-950 transition-colors"
            data-testid="job-phone-link"
          >
            <Phone size={12} strokeWidth={2} /> {job.phone}
          </a>
        )}
        <span className="flex items-center gap-1.5 capitalize font-medium">
          <SrcIcon size={12} strokeWidth={2} /> {job.source}
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <Clock size={12} strokeWidth={2} />
          {job.is_quiet
            ? `quiet ${waitLabel(job.days_since_contact)}`
            : `waiting ${waitLabel(job.days_waiting)}`}
        </span>
      </div>

      {job.note && (
        <p className="text-xs text-zinc-500 border-l-2 border-zinc-200 pl-2 italic mt-1">
          {job.note}
        </p>
      )}

      {children && <div className="flex flex-col gap-2 pt-2 border-t border-zinc-100 mt-1">{children}</div>}
    </div>
  );
};
