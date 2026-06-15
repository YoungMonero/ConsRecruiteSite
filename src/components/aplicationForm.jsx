// src/components/aplicationForm.jsx
import { useState } from "react";
import Icon from "./icons";
import { submitLiveApplication } from "../firebaseService";

// Move the Field subcomponent outside the main component to maintain input focus!
const Field = ({ id, label, required, children, hint, errors }) => (
  <div className="form-group">
    <label htmlFor={id} style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 5 }}>
      {label}{required && <span style={{ color: "#F97316" }}> *</span>}
    </label>
    {hint && <p style={{ fontSize: 12, color: "#94A3B8", marginBottom: 5 }}>{hint}</p>}
    {children}
    {errors[id] && <p style={{ fontSize: 12, color: "#DC2626", marginTop: 4 }}>{errors[id]}</p>}
  </div>
);

export default function ApplyPage({ job, setPage }) {
  const [form, setForm] = useState({
    fullName: "", phone: "", whatsapp: "", location: "",
    experience: "", previousWork: "", availability: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!form.phone.trim()) e.phone = "Required";
    if (!form.whatsapp.trim()) e.whatsapp = "Required";
    if (!form.location.trim()) e.location = "Required";
    if (!form.experience) e.experience = "Required";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    
    setLoading(true);
    try {
      await submitLiveApplication({
        ...form,
        jobId: job?.id || "",
        jobTitle: job?.title || "General Application"
      });
      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch (err) {
      alert("Could not submit application to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const set = (k) => (e) => { 
    setForm(f => ({ ...f, [k]: e.target.value })); 
    setErrors(er => ({ ...er, [k]: "" })); 
  };

  if (submitted) {
    return (
      <div style={{ padding: "60px 5%", maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <Icon name="check" size={32} color="#16A34A" />
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: "#1E3A8A", marginBottom: 12 }}>Application Submitted!</h2>
        <div className="alert-success" style={{ textAlign: "left", marginBottom: 28 }}>
          <strong>Thank you, {form.fullName}!</strong><br />
          Your application has been submitted successfully. We will contact you through WhatsApp if selected. Please keep your phone nearby.
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn-primary" onClick={() => setPage("jobs")}>Browse More Jobs</button>
          <button className="btn-blue" onClick={() => setPage("home")}>Return Home</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <h1>Apply: {job?.title || "Construction Job"}</h1>
        <p>Fill out the form below. No account required.</p>
      </div>
      <div style={{ padding: "40px 5%", maxWidth: 720, margin: "0 auto" }}>
        {job && (
          <div className="card" style={{ marginBottom: 28, background: "#EFF6FF", border: `1px solid #BFDBFE` }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: "#1E3A8A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name="briefcase" size={20} color="white" />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: "#1E3A8A" }}>{job.title}</div>
                <div style={{ fontSize: 13, color: "#475569" }}>{job.location} · {job.salary}</div>
              </div>
            </div>
          </div>
        )}

        <div className="card">
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1E3A8A", marginBottom: 20 }}>Personal Information</h3>
          <div className="grid-2">
            <Field id="fullName" label="Full Name" required errors={errors}>
              <input id="fullName" type="text" placeholder="e.g. Jean-Baptiste Nkouaya" value={form.fullName} onChange={set("fullName")} />
            </Field>
            <Field id="phone" label="Phone Number" required errors={errors}>
              <input id="phone" type="tel" placeholder="+237 6XX XXX XXX" value={form.phone} onChange={set("phone")} />
            </Field>
            <Field id="whatsapp" label="WhatsApp Number" required hint="We will contact you through this number" errors={errors}>
              <input id="whatsapp" type="tel" placeholder="+237 6XX XXX XXX" value={form.whatsapp} onChange={set("whatsapp")} />
            </Field>
            <Field id="location" label="Your Location" required errors={errors}>
              <input id="location" type="text" placeholder="City, Region" value={form.location} onChange={set("location")} />
            </Field>
          </div>

          <hr className="divider" />
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1E3A8A", marginBottom: 20 }}>Work Information</h3>

          <Field id="experience" label="Years of Experience" required errors={errors}>
            <select id="experience" value={form.experience} onChange={set("experience")}>
              <option value="">Select years of experience</option>
              <option value="less-than-1">Less than 1 year</option>
              <option value="1-2">1–2 years</option>
              <option value="3-5">3–5 years</option>
              <option value="5-10">5–10 years</option>
              <option value="10+">10+ years</option>
            </select>
          </Field>

          <Field id="previousWork" label="Describe Your Previous Work" errors={errors}>
            <textarea id="previousWork" placeholder="Describe past projects, skills, and what type of construction work you have done…" value={form.previousWork} onChange={set("previousWork")} />
          </Field>

          <Field id="availability" label="Availability" errors={errors}>
            <select id="availability" value={form.availability} onChange={set("availability")}>
              <option value="">When can you start?</option>
              <option value="immediately">Immediately</option>
              <option value="1-week">Within 1 week</option>
              <option value="2-weeks">Within 2 weeks</option>
              <option value="1-month">Within 1 month</option>
            </select>
          </Field>

          <hr className="divider" />
          <div style={{ background: "#F8FAFC", borderRadius: 10, padding: 16, marginBottom: 20 }}>
            <p style={{ fontSize: 13, color: "#475569", fontWeight: 600, marginBottom: 6 }}>📎 Optional Documents</p>
            <p style={{ fontSize: 12, color: "#94A3B8", lineHeight: 1.6 }}>
              Document uploads can be sent directly to our WhatsApp after submitting this form. We will provide our WhatsApp number in the confirmation message.
            </p>
          </div>

          <button 
            className="btn-primary" 
            style={{ width: "100%", fontSize: 16, padding: 15 }} 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
          <p style={{ textAlign: "center", fontSize: 12, color: "#94A3B8", marginTop: 12 }}>
            By submitting, you agree to be contacted by our recruitment team via WhatsApp or phone.
          </p>
        </div>
      </div>
    </>
  );
}