// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { getLiveJobs } from '../firebaseService';
import JobCard from '../components/JobCard';
import Icon from '../components/icons';
import heroImage from '../assets/hero-image.png';

// Fallback seed data if not found in parent context
const SEED_TESTIMONIALS = [
  { id: 1, initials: "AM", name: "Amadou Moussa", role: "Mason, Maroua", text: "Through BuildConnect, I found a steady job on a hotel construction site in Yaoundé. The application process was short and everything they promised on WhatsApp was correct." },
  { id: 2, initials: "ET", name: "Emmanuel Tchakounté", role: "Crane Operator, Douala", text: "No registration fees or long lines. I applied on Tuesday and got connected directly with the foreman on Thursday. Highly recommended for workers." },
  { id: 3, initials: "FO", name: "Florence Oben", role: "Site Supervisor, Limbe", text: "Great platform for finding verified projects. It bridges the gap between project managers and qualified site technicians perfectly." }
];

export default function HomePage({ setPage, setSelectedJob }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync up featured slots with active cloud collection records on component mount
  useEffect(() => {
    async function fetchFeaturedJobs() {
      try {
        const allCloudJobs = await getLiveJobs();
        const activeFeatured = (allCloudJobs || [])
          .filter(j => j.status === "active")
          .slice(0, 4);
        setJobs(activeFeatured);
      } catch (error) {
        console.error("Failed to sync featured home board listings:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchFeaturedJobs();
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="hero-inner">
          <p style={{ color: "#F97316", fontWeight: 700, fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 12 }}>
            #1 Construction Recruitment in Cameroon
          </p>
          <h1>Find Construction<br />Jobs <span>Faster</span></h1>
          <p>Connecting skilled builders and masons with trusted construction opportunities across the country.</p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => setPage("jobs")}>Browse Jobs</button>
            <button className="btn-outline" onClick={() => setPage("jobs")}>Apply Now</button>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><div className="hero-stat-num">120+</div><div className="hero-stat-label">Workers Placed</div></div>
            <div className="hero-stat"><div className="hero-stat-num">45+</div><div className="hero-stat-label">Active Projects</div></div>
            <div className="hero-stat"><div className="hero-stat-num">8</div><div className="hero-stat-label">Regions Covered</div></div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section">
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div className="section-title">How It Works</div>
          <p className="section-sub" style={{ margin: "0 auto" }}>Three simple steps to start earning</p>
        </div>
        <div className="grid-3" style={{ maxWidth: 860, margin: "0 auto" }}>
          {[
            { icon: "search", title: "Browse Jobs", desc: "View all available construction positions filtered by location and skill type." },
            { icon: "briefcase", title: "Apply Online", desc: "Fill out a simple application form in minutes. No registration required." },
            { icon: "whatsapp", title: "Get Contacted", desc: "If selected, our team will reach you directly through WhatsApp within 48 hours." },
          ].map((step, i) => (
            <div key={i} className="card" style={{ textAlign: "center", alignItems: "center", display: "flex", flexDirection: "column" }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: i === 2 ? "#25D366" : "#1E3A8A", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Icon name={step.icon} size={28} color="white" />
              </div>
              <div style={{ background: "#F97316", color: "white", borderRadius: "50%", width: 24, height: 24, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>{i + 1}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, color: "#1E3A8A" }}>{step.title}</h3>
              <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="section section-alt">
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 48, alignItems: "center" }}>
          <div>
            <div style={{ background: "#F97316", color: "white", borderRadius: 8, padding: "5px 14px", display: "inline-block", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 16 }}>Who We Are</div>
            <h2 className="section-title">Connecting Workers With the Best Projects</h2>
            <p style={{ color: "#475569", lineHeight: 1.7, marginBottom: 20 }}>
              BuildConnect is a dedicated construction recruitment agency operating across Cameroon. We partner directly with project managers and construction companies to bring verified, well-paying jobs to skilled workers — no middlemen, no fees.
            </p>
            <p style={{ color: "#475569", lineHeight: 1.7 }}>
              Whether you're an experienced mason, a concrete finisher, or a site foreman, we match your skills to the right project and support you through the entire hiring process.
            </p>
          </div>
          <div className="grid-2">
            {[
              { icon: "check", title: "Verified Opportunities", desc: "Every job listing is from a vetted construction company." },
              { icon: "clock", title: "Fast Process", desc: "Most applicants hear back within 24–48 hours." },
              { icon: "users", title: "Professional Support", desc: "Our team is available to assist with your application." },
              { icon: "hard_hat", title: "Multiple Projects", desc: "Ongoing projects in 8+ regions across Cameroon." },
            ].map((b, i) => (
              <div key={i} className="card benefit-card">
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "#1E3A8A", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  <Icon name={b.icon} size={18} color="white" />
                </div>
                <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, color: "#1E3A8A" }}>{b.title}</h4>
                <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.5 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED JOBS */}
      <section className="section">
        <div className="section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div className="section-title">Featured Jobs</div>
            <p className="section-sub" style={{ marginBottom: 0 }}>Currently available positions</p>
          </div>
          <button className="btn-blue" onClick={() => setPage("jobs")}>View All Jobs →</button>
        </div>
        
        {loading ? (
          <p style={{ textAlign: "center", color: "#475569", padding: "40px 0" }}>Loading live openings...</p>
        ) : jobs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#94A3B8" }}>
            <p style={{ fontSize: 16 }}>No featured positions open right now.</p>
          </div>
        ) : (
          <div className="grid-2">
            {jobs.map(job => (
              <JobCard key={job.id} job={job} setPage={setPage} setSelectedJob={setSelectedJob} />
            ))}
          </div>
        )}
      </section>

      {/* TESTIMONIALS */}
      <section className="section section-alt">
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div className="section-title">What Workers Say</div>
        </div>
        <div className="grid-3" style={{ maxWidth: 960, margin: "0 auto" }}>
          {SEED_TESTIMONIALS.map(t => (
            <div key={t.id} className="testimonial-card">
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
                <div className="avatar" style={{ background: "#1E3A8A", color: "white", width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700" }}>{t.initials}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#1E3A8A" }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: "#94A3B8" }}>{t.role}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 2, marginBottom: 12 }}>
                {[1,2,3,4,5].map(s => <Icon key={s} name="star" size={14} color="#F97316" />)}
              </div>
              <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.7, fontStyle: "italic" }}>"{t.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section className="section" style={{ background: "#1E3A8A" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ color: "white", fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Ready to Find Your Next Job?</h2>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 16, marginBottom: 40 }}>Contact us directly or browse available positions</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", marginBottom: 40 }}>
            {[
              { icon: "phone", label: "+237 650 000 000" },
              { icon: "whatsapp", label: "+237 650 000 001" },
              { icon: "mail", label: "jobs@buildconnect.cm" },
              { icon: "location", label: "Yaoundé, Centre, Cameroon" },
            ].map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, color: "white", fontSize: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={c.icon} size={16} color="white" />
                </div>
                {c.label}
              </div>
            ))}
          </div>
          <button className="btn-primary" style={{ fontSize: 16, padding: "14px 36px" }} onClick={() => setPage("jobs")}>
            Browse All Jobs
          </button>
        </div>
      </section>
    </>
  );
}