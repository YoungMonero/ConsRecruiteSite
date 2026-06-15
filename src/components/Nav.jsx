// src/components/Nav.jsx
import React from "react";

export default function Nav({ page, setPage }) {
  return (
    <nav className="nav">
      <div className="nav-brand" onClick={() => setPage("home")} style={{ cursor: "pointer" }}>
        Build<span>Connect</span>
      </div>
      <div className="nav-links">
        <span className={`nav-link ${page === "home" ? "active" : ""}`} onClick={() => setPage("home")}>Home</span>
        <span className={`nav-link ${page === "jobs" ? "active" : ""}`} onClick={() => setPage("jobs")}>Jobs</span>
        <button className="btn-primary btn-sm nav-cta" onClick={() => setPage("jobs")}>Apply Now</button>
      </div>
    </nav>
  );
}