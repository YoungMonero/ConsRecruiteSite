// src/pages/JobDetailPage.jsx
import React from 'react';
import Icon from '../components/icons';

export default function JobDetailPage({ job, setPage, setSelectedJob }) {
  if (!job) return <div style={{ padding: 40, textAlign: "center", color: "#475569" }}>Job not found.</div>;
  
  const isExpired = job.deadline && new Date(job.deadline) < new Date();
  
  return (
    <>
      <div className="page-header">
        <h1>{job.title}</h1>
        <p>{job.location} · {job.duration || "Contract"}</p>
      </div>
      <div style={{ padding: "40px 5%", maxWidth: 840, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
          <span className={`badge ${job.status === "active" ? "badge-active" : "badge-closed"}`} style={{ fontSize: 13, padding: "5px 14px" }}>
            {job.status === "active" ? "Actively Hiring" : "Position Closed"}
          </span>
          {job.deadline && <span className="tag" style={{ background: "#EDF2F7", padding: "4px 12px", borderRadius: "6px", fontSize: "13px" }}>Deadline: {job.deadline}</span>}
          {isExpired && <span className="badge badge-closed">Expired</span>}
        </div>

        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1E3A8A", marginBottom: 12 }}>Job Overview</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
            {[
              { icon: "location", label: "Location", value: job.location },
              { icon: "cash", label: "Salary", value: job.salary },
              { icon: "clock", label: "Duration", value: job.duration || "Contract" },
              { icon: "briefcase", label: "Status", value: job.status === "active" ? "Open" : "Closed" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: "#F8FAFC", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={item.icon} size={16} color="#1E3A8A" />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, textTransform: "uppercase" }}>{item.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#1F2937" }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1E3A8A", marginBottom: 12 }}>Job Description</h3>
          <p style={{ lineHeight: 1.7, color: "#475569", whiteSpace: "pre-line" }}>{job.description}</p>
        </div>

        <div className="card" style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1E3A8A", marginBottom: 12 }}>Requirements</h3>
          <p style={{ lineHeight: 1.7, color: "#475569", whiteSpace: "pre-line" }}>{job.requirements}</p>
        </div>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {job.status === "active" && !isExpired && (
            <button className="btn-primary" style={{ fontSize: 16, padding: "14px 36px" }}
              onClick={() => { setSelectedJob(job); setPage("apply"); }}>
              Apply Now
            </button>
          )}
          <button className="btn-blue" onClick={() => setPage("jobs")} style={{ padding: "14px 28px" }}>← Back to Jobs</button>
        </div>
      </div>
    </>
  );
}