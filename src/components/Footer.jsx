// src/components/Footer.jsx
import React from "react";

export default function Footer({ setPage }) {
  return (
    <footer className="footer">
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="footer-grid">
          <div>
            <div className="footer-brand">Build<span>Connect</span></div>
            <p style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 260 }}>
              Connecting skilled construction workers with trusted opportunities across Cameroon.
            </p>
          </div>
          <div>
            <div className="footer-heading">Quick Links</div>
            <span className="footer-link" onClick={() => setPage("home")}>Home</span>
            <span className="footer-link" onClick={() => setPage("jobs")}>Browse Jobs</span>
            <span className="footer-link" onClick={() => setPage("jobs")}>Apply Now</span>
            <span className="footer-link" onClick={() => setPage("admin")}>Admin Login</span>
          </div>
          <div>
            <div className="footer-heading">Contact</div>
            <p className="footer-link">📞 +237 650 000 000</p>
            <p className="footer-link">💬 +237 650 000 001 (WhatsApp)</p>
            <p className="footer-link">✉️ jobs@buildconnect.cm</p>
            <p className="footer-link">📍 Yaoundé, Centre, Cameroon</p>
          </div>
          <div>
            <div className="footer-heading">For Workers</div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
              No registration needed. Browse jobs, apply online, and get contacted via WhatsApp when selected.
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 BuildConnect. All rights reserved.</span>
          <span>Serving workers across Cameroon</span>
        </div>
      </div>
    </footer>
  );
}