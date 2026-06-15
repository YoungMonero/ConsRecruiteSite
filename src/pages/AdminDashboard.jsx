// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { 
  getLiveJobs, 
  getLiveApplications, 
  addLiveJob, 
  deleteLiveJob 
} from '../firebaseService';
import Icon from '../components/icons';

export default function AdminDashboard({ onLogout }) {
  const [section, setSection] = useState("overview");
  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [editJob, setEditJob] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load live cloud database records on initialization
  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => { 
    setLoading(true);
    try {
      const [cloudJobs, cloudApps] = await Promise.all([
        getLiveJobs(),
        getLiveApplications()
      ]);
      setJobs(cloudJobs);
      setApps(cloudApps);
    } catch (error) {
      console.error("Failed to fetch cloud records:", error);
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: "chart" },
    { id: "jobs", label: "Job Listings", icon: "briefcase" },
    { id: "applications", label: "Applications", icon: "users" },
  ];

  if (loading) {
    return <div style={{ padding: "80px 5%", textAlign: "center", color: "#1E3A8A", fontWeight: 600 }}>Syncing with cloud database...</div>;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div className="admin-sidebar">
        <div className="admin-logo">Build<span>Connect</span><br />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 400 }}>Admin Panel</span>
        </div>
        <nav className="admin-nav">
          {navItems.map(n => (
            <div key={n.id} className={`admin-nav-item ${section === n.id ? "active" : ""}`} onClick={() => setSection(n.id)}>
              <Icon name={n.icon} size={17} color="currentColor" />
              {n.label}
            </div>
          ))}
          <hr style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.1)", margin: "12px 0" }} />
          <div className="admin-nav-item" onClick={onLogout}>
            <Icon name="logout" size={17} color="currentColor" />
            Sign Out
          </div>
        </nav>
      </div>

      <div className="admin-content">
        {section === "overview" && <AdminOverview jobs={jobs} apps={apps} setSection={setSection} />}
        {section === "jobs" && (
          <AdminJobs jobs={jobs} refresh={refresh}
            editJob={editJob} setEditJob={setEditJob}
            showJobModal={showJobModal} setShowJobModal={setShowJobModal} />
        )}
        {section === "applications" && (
          <AdminApplications apps={apps} jobs={jobs} selectedApp={selectedApp} setSelectedApp={setSelectedApp} />
        )}
      </div>
    </div>
  );
}

function AdminOverview({ jobs, apps, setSection }) {
  const activeJobs = jobs.filter(j => j.status === "active").length;
  // Use dateApplied from cloud instance safely falling back to local property
  const recent = [...apps].sort((a, b) => (b.dateApplied || b.appliedAt || "").localeCompare(a.dateApplied || a.appliedAt || "")).slice(0, 5);
  
  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1E3A8A", marginBottom: 6 }}>Dashboard Overview</h1>
      <p style={{ color: "#475569", marginBottom: 28 }}>Welcome back. Here's a summary of activity.</p>

      <div className="grid-4" style={{ marginBottom: 36 }}>
        {[
          { icon: "briefcase", num: jobs.length, label: "Total Jobs", color: "#1E3A8A" },
          { icon: "chart", num: activeJobs, label: "Active Jobs", color: "#16A34A" },
          { icon: "users", num: apps.length, label: "Applications", color: "#F97316" },
          { icon: "clock", num: recent.length, label: "Recent This Week", color: "#7C3AED" },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div style={{ width: 40, height: 40, borderRadius: 10, background: s.color + "20", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <Icon name={s.icon} size={20} color={s.color} />
            </div>
            <div className="stat-card-num" style={{ color: s.color }}>{s.num}</div>
            <div className="stat-card-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontWeight: 700, color: "#1E3A8A" }}>Recent Applications</h3>
          <button className="btn-blue btn-sm" onClick={() => setSection("applications")}>View All</button>
        </div>
        {recent.length === 0 ? (
          <p style={{ color: "#94A3B8", textAlign: "center", padding: 24 }}>No applications yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Applicant</th><th>Job</th><th>Location</th><th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recent.map(a => (
                <tr key={a.id}>
                  <td><strong>{a.fullName}</strong></td>
                  <td>{a.jobTitle}</td>
                  <td>{a.location}</td>
                  <td style={{ color: "#94A3B8" }}>{a.dateApplied ? a.dateApplied.split("T")[0] : a.appliedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function AdminJobs({ jobs, refresh, editJob, setEditJob, showJobModal, setShowJobModal }) {
  const empty = { title: "", description: "", salary: "", location: "", duration: "", requirements: "", deadline: "", status: "active" };
  const [form, setForm] = useState(empty);

  const openNew = () => { setForm(empty); setEditJob(null); setShowJobModal(true); };
  const openEdit = (job) => { setForm({ ...job }); setEditJob(job); setShowJobModal(true); };
  const close = () => { setShowJobModal(false); setEditJob(null); };

  const save = async () => {
    try {
      if (editJob) {
        // Updates require overwriting fields via standard addLiveJob wrapper logic 
        // or expanding service layer tracking to merge collections
        await addLiveJob({ 
          ...form, 
          id: editJob.id, 
          createdAt: editJob.createdAt || new Date().toISOString().split("T")[0] 
        });
        if (editJob.id) await deleteLiveJob(editJob.id);
      } else {
        await addLiveJob({ 
          ...form, 
          createdAt: new Date().toISOString().split("T")[0] 
        });
      }
      close();
      refresh();
    } catch (err) {
      alert("Failed to synchronize job mutation onto the cloud service.");
    }
  };

  const del = async (id) => {
    if (!confirm("Delete this job Listing permanently?")) return;
    try {
      await deleteLiveJob(id);
      refresh();
    } catch (err) {
      alert("Could not remove record from the backend collection layer.");
    }
  };

  const toggle = async (id) => {
    const jobToToggle = jobs.find(j => j.id === id);
    if (!jobToToggle) return;
    try {
      const updatedStatus = jobToToggle.status === "active" ? "closed" : "active";
      await addLiveJob({ ...jobToToggle, status: updatedStatus });
      await deleteLiveJob(id);
      refresh();
    } catch (err) {
      alert("Failed to modify job visibility status.");
    }
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1E3A8A" }}>Job Listings</h1>
          <p style={{ color: "#475569", fontSize: 14 }}>{jobs.length} total jobs</p>
        </div>
        <button className="btn-primary" onClick={openNew} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Icon name="plus" size={16} color="white" /> New Job
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table>
          <thead>
            <tr><th>Title</th><th>Location</th><th>Salary</th><th>Deadline</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr key={job.id}>
                <td><strong>{job.title}</strong></td>
                <td>{job.location}</td>
                <td style={{ fontSize: 13 }}>{job.salary}</td>
                <td style={{ fontSize: 13, color: "#94A3B8" }}>{job.deadline || "—"}</td>
                <td>
                  <span className={`badge ${job.status === "active" ? "badge-active" : "badge-closed"}`}>
                    {job.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button title="Edit" onClick={() => openEdit(job)} style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 6, padding: "5px 8px" }}>
                      <Icon name="edit" size={14} color="#1E3A8A" />
                    </button>
                    <button title={job.status === "active" ? "Close" : "Reopen"} onClick={() => toggle(job.id)} style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 6, padding: "5px 8px" }}>
                      <Icon name="eye" size={14} color="#475569" />
                    </button>
                    <button title="Delete" onClick={() => del(job.id)} style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 6, padding: "5px 8px" }}>
                      <Icon name="trash" size={14} color="#DC2626" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showJobModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && close()}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">{editJob ? "Edit Job" : "Create New Job"}</div>
              <button className="close-btn" onClick={close}>×</button>
            </div>
            <div className="grid-2">
              <div className="form-group"><label>Job Title *</label><input type="text" value={form.title} onChange={set("title")} placeholder="e.g. Senior Mason" /></div>
              <div className="form-group"><label>Location *</label><input type="text" value={form.location} onChange={set("location")} placeholder="City, Region" /></div>
              <div className="form-group"><label>Salary Range</label><input type="text" value={form.salary} onChange={set("salary")} placeholder="e.g. 150,000 – 200,000 FCFA/month" /></div>
              <div className="form-group"><label>Duration</label><input type="text" value={form.duration} onChange={set("duration")} placeholder="e.g. 3 months" /></div>
              <div className="form-group"><label>Application Deadline</label><input type="text" value={form.deadline} onChange={set("deadline")} placeholder="YYYY-MM-DD" /></div>
              <div className="form-group"><label>Status</label>
                <select value={form.status} onChange={set("status")}>
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
            <div className="form-group"><label>Job Description</label><textarea value={form.description} onChange={set("description")} placeholder="Describe the role, responsibilities, and project…" style={{ minHeight: 100 }} /></div>
            <div className="form-group"><label>Requirements</label><textarea value={form.requirements} onChange={set("requirements")} placeholder="List skills, experience, and qualifications required…" /></div>
            <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <button className="btn-blue btn-sm" onClick={close}>Cancel</button>
              <button className="btn-primary btn-sm" onClick={save}>{editJob ? "Save Changes" : "Create Job"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminApplications({ apps, jobs, selectedApp, setSelectedApp }) {
  const [filter, setFilter] = useState("");
  const filtered = apps.filter(a =>
    a.fullName?.toLowerCase().includes(filter.toLowerCase()) ||
    a.jobTitle?.toLowerCase().includes(filter.toLowerCase())
  );

  const openWA = (num) => {
    if (!num) return;
    const cleaned = num.replace(/\D/g, "");
    window.open(`https://wa.me/${cleaned}?text=Hello%20${encodeURIComponent(selectedApp?.fullName || "")}%2C%20we%20have%20reviewed%20your%20application%20for%20the%20construction%20position%20and%20would%20like%20to%20discuss%20it%20with%20you.`, "_blank");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1E3A8A" }}>Applications</h1>
          <p style={{ color: "#475569", fontSize: 14 }}>{apps.length} total received</p>
        </div>
        <input type="text" placeholder="Search applicants…" value={filter} onChange={e => setFilter(e.target.value)} style={{ width: 220 }} />
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 48 }}>
          <p style={{ color: "#94A3B8" }}>No applications found.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <table>
            <thead>
              <tr><th>Name</th><th>WhatsApp</th><th>Location</th><th>Experience</th><th>Job Applied</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id}>
                  <td><strong>{a.fullName}</strong></td>
                  <td style={{ fontSize: 13 }}>{a.whatsapp}</td>
                  <td style={{ fontSize: 13 }}>{a.location}</td>
                  <td><span className="tag">{a.experience || "—"}</span></td>
                  <td style={{ fontSize: 13, maxWidth: 140 }}>{a.jobTitle}</td>
                  <td style={{ fontSize: 12, color: "#94A3B8" }}>{a.dateApplied ? a.dateApplied.split("T")[0] : a.appliedAt}</td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button title="View details" onClick={() => setSelectedApp(a)} style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 6, padding: "5px 8px" }}>
                        <Icon name="eye" size={14} color="#1E3A8A" />
                      </button>
                      <button title="Contact via WhatsApp" onClick={() => { setSelectedApp(a); setTimeout(() => openWA(a.whatsapp), 50); }} style={{ background: "#F0FFF4", border: "1px solid #BBF7D0", borderRadius: 6, padding: "5px 8px" }}>
                        <Icon name="whatsapp" size={14} color="#16A34A" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedApp && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setSelectedApp(null)}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">Application Details</div>
              <button className="close-btn" onClick={() => setSelectedApp(null)}>×</button>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20, padding: "12px 16px", background: "#F8FAFC", borderRadius: 10 }}>
              <div className="avatar" style={{ width: 48, height: 48, background: "#1E3A8A", color: "#FFFFFF" }}>{selectedApp.fullName?.slice(0, 2).toUpperCase()}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: "#1E3A8A" }}>{selectedApp.fullName}</div>
                <div style={{ fontSize: 13, color: "#475569" }}>Applied for: <strong>{selectedApp.jobTitle}</strong></div>
              </div>
            </div>
            {[
              ["Phone", selectedApp.phone], ["WhatsApp", selectedApp.whatsapp],
              ["Location", selectedApp.location], ["Experience", selectedApp.experience],
              ["Availability", selectedApp.availability || "—"], ["Date Applied", selectedApp.dateApplied ? selectedApp.dateApplied.split("T")[0] : selectedApp.appliedAt],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F1F5F9", fontSize: 14 }}>
                <span style={{ color: "#475569", fontWeight: 600 }}>{k}</span>
                <span style={{ color: "#1F2937", textAlign: "right", maxWidth: "60%" }}>{v}</span>
              </div>
            ))}
            {selectedApp.previousWork && (
              <div style={{ marginTop: 16 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 6 }}>Previous Work</p>
                <p style={{ fontSize: 14, color: "#1F2937", lineHeight: 1.6, background: "#F8FAFC", padding: 12, borderRadius: 8 }}>{selectedApp.previousWork}</p>
              </div>
            )}
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button className="btn-primary" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                onClick={() => openWA(selectedApp.whatsapp)}>
                <Icon name="whatsapp" size={16} color="white" /> Contact on WhatsApp
              </button>
              <button className="btn-blue btn-sm" onClick={() => setSelectedApp(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}