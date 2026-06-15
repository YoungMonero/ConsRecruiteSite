// src/pages/AdminLogin.jsx
import { useState } from "react";
import Icon from "../components/icons";
import { loginAdmin } from "../firebaseService"; // Import live auth module

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState(""); // Firebase requires an email along with password
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email || !pw) {
      setErr("Please enter both your email and password.");
      return;
    }
    setLoading(true);
    setErr("");
    try {
      // Connects directly to Firebase Authentication using your state records
      await loginAdmin(email, pw);
      onLogin(); 
    } catch (error) {
      setErr("Invalid administrator credentials. Please try again.");
      setPw(""); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div className="card" style={{ width: "100%", maxWidth: 400, padding: 36, background: "#FFFFFF" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "#1E3A8A", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Icon name="hard_hat" size={26} color="white" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1E3A8A" }}>Admin Dashboard</h1>
          <p style={{ fontSize: 14, color: "#475569", marginTop: 4 }}>BuildConnect Recruitment</p>
        </div>
        
        {err && (
          <div style={{ padding: "10px 12px", background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 8, color: "#DC2626", fontSize: 13, marginBottom: 16 }}>
            {err}
          </div>
        )}

        <div className="form-group" style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 5 }}>Admin Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)}
            placeholder="admin@buildconnect.com"
          />
        </div>

        <div className="form-group" style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 5 }}>Password</label>
          <input 
            type="password" 
            value={pw} 
            onChange={e => setPw(e.target.value)}
            placeholder="Enter admin password"
            onKeyDown={e => e.key === "Enter" && submit()} 
          />
        </div>

        <button 
          className="btn-primary" 
          style={{ width: "100%", marginTop: 8 }} 
          onClick={submit}
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </div>
    </div>
  );
}