// src/pages/JobsPage.jsx
import { useState, useEffect } from 'react';
import { getLiveJobs } from '../firebaseService';
import JobCard from '../components/JobCard';
import Icon from '../components/icons';

export default function JobsPage({ setPage, setSelectedJob }) {
  const [search, setSearch] = useState("");
  const [locFilter, setLocFilter] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch live cloud data on mount
  useEffect(() => {
    async function fetchCloudJobs() {
      try {
        const liveJobs = await getLiveJobs();
        setJobs(liveJobs || []);
      } catch (error) {
        console.error("Failed to load jobs from Firebase:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCloudJobs();
  }, []);
  
  const filtered = jobs.filter(j => {
    const q = search.toLowerCase();
    return (
      (j.title?.toLowerCase().includes(q) || j.description?.toLowerCase().includes(q)) &&
      (locFilter === "" || j.location?.toLowerCase().includes(locFilter.toLowerCase()))
    );
  });
  
  const locations = [...new Set(jobs.map(j => j.location).filter(Boolean))];

  if (loading) {
    return <div style={{ padding: "80px 5%", textAlign: "center", color: "#1E3A8A", fontWeight: 600 }}>Loading active job positions...</div>;
  }

  return (
    <>
      <div className="page-header">
        <h1>Available Jobs</h1>
        <p>{jobs.filter(j => j.status === "active").length} positions currently open</p>
      </div>
      <div style={{ padding: "32px 5%", background: "#F8FAFC" }}>
        <div className="search-bar" style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 2, minWidth: 200 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center" }}>
              <Icon name="search" size={16} color="#94A3B8" />
            </span>
            <input 
              type="text" 
              placeholder="Search by job title or keyword…"
              value={search} 
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 38, width: "100%" }} 
            />
          </div>
          <select value={locFilter} onChange={e => setLocFilter(e.target.value)} style={{ flex: 1, minWidth: 160 }}>
            <option value="">All Locations</option>
            {locations.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <button className="btn-blue" onClick={() => { setSearch(""); setLocFilter(""); }}>Clear</button>
        </div>
      </div>
      <div style={{ padding: "32px 5%" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, color: "#475569" }}>
            <Icon name="search" size={40} color="#94A3B8" />
            <p style={{ marginTop: 16, fontSize: 16 }}>No jobs found matching your search.</p>
          </div>
        ) : (
          <div className="grid-2">
            {filtered.map(job => (
              <JobCard key={job.id} job={job} setPage={setPage} setSelectedJob={setSelectedJob} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}