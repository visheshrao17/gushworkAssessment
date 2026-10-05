import "@/App.css";
import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import { Sun, Plus, Layers, BarChart3, Calendar } from "lucide-react";
import { Toaster } from "sonner";
import CallToday from "@/pages/CallToday";
import AddJob from "@/pages/AddJob";
import AllJobs from "@/pages/AllJobs";
import JobDetail from "@/pages/JobDetail";
import Dashboard from "@/pages/Dashboard";
import TodayJobs from "@/pages/TodayJobs";

const NAV = [
  { to: "/", label: "Dashboard", icon: BarChart3, testid: "nav-dashboard", end: true },
  { to: "/today", label: "Today's Jobs", icon: Calendar, testid: "nav-today-jobs" },
  { to: "/kanban", label: "Kanban", icon: Sun, testid: "nav-today" },
  { to: "/add", label: "Add Job", icon: Plus, testid: "nav-add" },
  { to: "/jobs", label: "All Jobs", icon: Layers, testid: "nav-jobs" },
];

function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 flex-col bg-white border-r border-zinc-200 h-screen sticky top-0 z-20">
      <div className="p-6 border-b border-zinc-200">
        <h1 className="font-heading text-2xl font-black tracking-tight text-zinc-900">
          Call Tracker
          
        </h1>
        <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest mt-1">
          Service OS
        </p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            data-testid={n.testid}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 ${
                isActive
                  ? "bg-zinc-100 text-zinc-950 font-bold"
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <n.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="font-sans text-sm">{n.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 flex z-30 pb-safe">
      {NAV.map((n) => (
        <NavLink
          key={n.to}
          to={n.to}
          end={n.end}
          data-testid={n.testid}
          className={({ isActive }) =>
            `flex-1 h-16 flex flex-col items-center justify-center gap-1 transition-colors ${
              isActive ? "text-zinc-950" : "text-zinc-400"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <n.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="font-sans text-[10px] font-medium">{n.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

function App() {
  return (
    <div className="App flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      <BrowserRouter>
        <Toaster position="top-center" richColors toastOptions={{ className: "font-sans" }} />
        <Sidebar />
        <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden relative pb-20 md:pb-0">
          <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/today" element={<TodayJobs />} />
              <Route path="/kanban" element={<CallToday />} />
              <Route path="/add" element={<AddJob />} />
              <Route path="/jobs" element={<AllJobs />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <BottomNav />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
