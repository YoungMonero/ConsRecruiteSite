// src/App.jsx
import { useState, useEffect } from "react";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import JobsPage from "./pages/JobsPage";
import JobDetailPage from "./pages/JobDetailPage";
import ApplyPage from "./components/aplicationForm";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import { isLoggedIn } from './utils/storage';
const SEED_JOBS = [
  { id: "j1", title: "Senior Brick Mason", location: "Yaoundé, Centre", salary: "180,000 FCFA/month", duration: "6 Months", description: "Looking for an experienced brick mason to lead a team on a residential villa construction site.", requirements: "Minimum 5 years bricklaying experience, ability to read blueprint plans, team leadership qualities.", deadline: "2026-08-15", status: "active" },
  { id: "j2", title: "Concrete Finisher", location: "Douala, Littoral", salary: "150,000 FCFA/month", duration: "3 Months", description: "Requires specialized skills in finishing commercial concrete ground slabs and structural beams.", requirements: "Experience with power trowels, smooth surface finishes, and proper concrete hydration curing methods.", deadline: "2026-07-20", status: "active" }
];

export default function App() {
  const [page, setPage] = useState("home");
  const [selectedJob, setSelectedJob] = useState(null);
  const [adminAuthed, setAdminAuthed] = useState(() => {
    return localStorage.getItem("crw_logged") === "true";
  });

  useEffect(() => {
    if (!localStorage.getItem("crw_jobs")) {
      saveJobs(SEED_JOBS);
    }
  }, []);

  useEffect(() => { 
    window.scrollTo(0, 0); 
  }, [page]);

  const handleAdminLogout = () => {
    localStorage.removeItem("crw_logged");
    setAdminAuthed(false);
    setPage("home");
  };

  if (page === "admin") {
    if (!adminAuthed) {
      return <AdminLogin onLogin={() => setAdminAuthed(true)} />;
    }
    return <AdminDashboard onLogout={handleAdminLogout} />;
  }

  return (
    <>
      <Nav page={page} setPage={setPage} />
      <main style={{ minHeight: "calc(100vh - 300px)" }}>
        {page === "home" && <HomePage setPage={setPage} setSelectedJob={setSelectedJob} />}
        {page === "jobs" && <JobsPage setPage={setPage} setSelectedJob={setSelectedJob} />}
        {page === "job-detail" && <JobDetailPage job={selectedJob} setPage={setPage} setSelectedJob={setSelectedJob} />}
        {page === "apply" && <ApplyPage job={selectedJob} setPage={setPage} />}
      {page === "admin-login" && (
          <AdminLogin onLogin={() => {
            localStorage.setItem("crw_logged", "true");
            setPage("admin-dashboard");
          }} />
        )}

        {page === "admin-dashboard" && (
          <AdminDashboard onLogout={handleAdminLogout} />
        )}
      </main>

      {page !== "admin-dashboard" && page !== "admin-login" && (
        <Footer setPage={setPage} />
      )}
    </>
  );
}