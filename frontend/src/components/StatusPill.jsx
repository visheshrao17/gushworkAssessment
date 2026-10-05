import React from "react";

const STAGE_STYLES = {
  "New": "bg-blue-100 text-blue-800 border-blue-200",
  "Quote Draft": "bg-amber-100 text-amber-800 border-amber-200",
  "Quote Sent": "bg-amber-100 text-amber-800 border-amber-200",
  "Quote Accepted": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Quote Rejected": "bg-red-100 text-red-800 border-red-200",
  "Visit Scheduled": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "In Progress": "bg-purple-100 text-purple-800 border-purple-200",
  "Completed": "bg-zinc-100 text-zinc-600 border-zinc-200",
  "Lost": "bg-zinc-100 text-zinc-500 border-zinc-200 line-through opacity-70",
  "quiet": "bg-red-100 text-red-800 border-red-200",
};

export const StatusPill = ({ label, variant, className = "", ...props }) => {
  const style = STAGE_STYLES[variant] || STAGE_STYLES["Completed"];
  return (
    <span
      className={`inline-flex items-center border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider font-sans rounded-full ${style} ${className}`}
      {...props}
    >
      {label}
    </span>
  );
};
