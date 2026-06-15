// src/components/JobCard.jsx
import React from "react";
import Icon from "./icons";

export default function JobCard({ job, setPage, setSelectedJob }) {
  return (
    <div className="card job-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div className="job-card-title">{job.title}</div>
        <span className={`badge ${job.status === "active" ? "badge-active" : "badge-closed"}`}>
          {job.status === "active" ? "Hiring" : "Closed"}
        </span>
      </div>
      <div className="job-meta" style={{ display: "flex", gap: "12px", margin: "8px 0" }}>
        <span className="job-meta-item" style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "#475569" }}>
          <Icon name="location" size={14} color="#94A3B8" /> {job.location}
        </span>
        <span className="job-meta-item" style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "#475569" }}>
          <Icon name="clock" size={14} color="#94A3B8" /> {job.duration || "Contract"}
        </span>
      </div>
      <div className="job-salary" style={{ fontSize: "15px", fontWeight: "700", color: "#16A34A", marginBottom: "8px" }}>{job.salary}</div>
      <p className="job-desc" style={{ fontSize: "14px", color: "#475569", lineHeight: "1.6" }}>{job.description?.slice(0, 100)}…</p>
      
      {job.status === "active" && (
        <button 
          className="btn-primary" 
          onClick={() => { setSelectedJob(job); setPage("apply"); }}
          style={{ marginTop: "12px", width: "100%" }}
        >
          Apply Now
        </button>
      )}
      <button 
        onClick={() => { setSelectedJob(job); setPage("job-detail"); }}
        style={{ background: "none", border: "none", color: "#1E3A8A", fontSize: 13, fontWeight: 600, padding: 0, textDecoration: "underline", marginTop: "8px", textAlign: "left", cursor: "pointer" }}
      >
        View Details →
      </button>
    </div>
  );
}