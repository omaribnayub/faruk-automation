import { useEffect, useMemo, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import App from "./App";
import { defaultContent } from "./content/defaultContent";
import {
  deleteLead,
  getLeads,
  getSiteContent,
  resetSiteContent,
  saveSiteContent
} from "./content/cmsService";
import { auth, isFirebaseConfigured } from "./lib/firebase";

function StringArrayEditor({ label, values, onChange }) {
  const [draft, setDraft] = useState("");
  const [editIndex, setEditIndex] = useState(-1);

  const handleSubmit = () => {
    if (!draft.trim()) {
      return;
    }
    const next = [...values];
    if (editIndex >= 0) {
      next[editIndex] = draft.trim();
    } else {
      next.push(draft.trim());
    }
    onChange(next);
    setDraft("");
    setEditIndex(-1);
  };

  return (
    <div className="admin-panel">
      <h3>{label}</h3>
      <div className="admin-inline-form">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={`Add ${label.toLowerCase()} item`}
        />
        <button type="button" className="btn btn-primary" onClick={handleSubmit}>
          {editIndex >= 0 ? "Update" : "Add"}
        </button>
      </div>
      <ul className="admin-list">
        {values.map((item, index) => (
          <li key={`${item}-${index}`}>
            <span>{item}</span>
            <div>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setDraft(item);
                  setEditIndex(index);
                }}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => onChange(values.filter((_, i) => i !== index))}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ObjectArrayEditor({ label, values, fields, onChange }) {
  const [draft, setDraft] = useState(() =>
    fields.reduce((acc, field) => ({ ...acc, [field.key]: "" }), {})
  );
  const [editIndex, setEditIndex] = useState(-1);

  const setFieldValue = (key, value) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const resetDraft = () => {
    setDraft(fields.reduce((acc, field) => ({ ...acc, [field.key]: "" }), {}));
    setEditIndex(-1);
  };

  const handleSubmit = () => {
    const isValid = fields.every((field) => String(draft[field.key] || "").trim());
    if (!isValid) {
      return;
    }
    const next = [...values];
    if (editIndex >= 0) {
      next[editIndex] = { ...draft };
    } else {
      next.push({ ...draft });
    }
    onChange(next);
    resetDraft();
  };

  return (
    <div className="admin-panel">
      <h3>{label}</h3>
      <div className="admin-grid-form">
        {fields.map((field) => (
          <div key={field.key}>
            <label>{field.label}</label>
            {field.type === "textarea" ? (
              <textarea
                value={draft[field.key]}
                onChange={(e) => setFieldValue(field.key, e.target.value)}
              />
            ) : (
              <input
                type="text"
                value={draft[field.key]}
                onChange={(e) => setFieldValue(field.key, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
      <div className="admin-actions">
        <button type="button" className="btn btn-primary" onClick={handleSubmit}>
          {editIndex >= 0 ? "Update" : "Add"} {label}
        </button>
        <button type="button" className="btn btn-secondary" onClick={resetDraft}>
          Clear
        </button>
      </div>
      <ul className="admin-list">
        {values.map((item, index) => (
          <li key={`${item.title || item.name}-${index}`}>
            <span>{item.title || item.name}</span>
            <div>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setDraft(item);
                  setEditIndex(index);
                }}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => onChange(values.filter((_, i) => i !== index))}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AdminPage() {
  const [content, setContent] = useState(defaultContent);
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(!isFirebaseConfigured);
  const [authLoading, setAuthLoading] = useState(isFirebaseConfigured);
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setAuthLoading(false);
      setIsAuthenticated(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(Boolean(user));
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    async function loadData() {
      try {
        const [savedContent, savedLeads] = await Promise.all([getSiteContent(), getLeads()]);
        setContent(savedContent);
        setLeads(savedLeads);
      } catch {
        setError("Failed to load admin data.");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [isAuthenticated]);

  const sectionStats = useMemo(() => {
    return [
      { name: "Services", value: content.services.length },
      { name: "Projects", value: content.projects.length },
      { name: "Packages", value: content.packages.length },
      { name: "Leads", value: leads.length }
    ];
  }, [content, leads]);

  const maxStat = useMemo(() => {
    return Math.max(...sectionStats.map((item) => item.value), 1);
  }, [sectionStats]);

  const dashboardCards = useMemo(() => {
    return [
      { label: "Total Services", value: content.services.length },
      { label: "Total Projects", value: content.projects.length },
      { label: "Packages", value: content.packages.length },
      { label: "Leads Inbox", value: leads.length }
    ];
  }, [content, leads]);

  const previewContent = useMemo(() => content, [content]);

  const updateContent = (updates) => {
    setContent((current) => ({ ...current, ...updates }));
    setMessage("");
    setError("");
  };

  const handleSave = async () => {
    try {
      await saveSiteContent(content);
      setMessage("Content saved successfully.");
      setError("");
    } catch {
      setError("Failed to save content.");
      setMessage("");
    }
  };

  const handleReset = async () => {
    try {
      const reset = await resetSiteContent();
      setContent(reset);
      setMessage("Content reset to defaults.");
      setError("");
    } catch {
      setError("Reset failed.");
      setMessage("");
    }
  };

  const handleDeleteLead = async (leadId) => {
    try {
      await deleteLead(leadId);
      const latest = await getLeads();
      setLeads(latest);
    } catch {
      setError("Unable to delete lead.");
    }
  };

  const handleAdminLogin = async (event) => {
    event.preventDefault();
    if (!auth) {
      return;
    }
    setAuthError("");
    try {
      await signInWithEmailAndPassword(auth, authForm.email, authForm.password);
      setAuthForm({ email: "", password: "" });
    } catch (loginError) {
      const errorCode =
        typeof loginError === "object" && loginError !== null && "code" in loginError
          ? String(loginError.code)
          : "";
      const readableCode = errorCode.replace("auth/", "").replaceAll("-", " ");
      setAuthError(
        readableCode
          ? `Login failed: ${readableCode}.`
          : "Login failed. Check admin email and password."
      );
    }
  };

  const handleAdminLogout = async () => {
    if (!auth) {
      return;
    }
    await signOut(auth);
  };

  if (authLoading) {
    return <div className="admin-layout">Checking admin access...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-layout">
        <section className="admin-auth-card">
          <h1>Admin Login</h1>
          <p>Sign in with your Firebase admin account to access this dashboard.</p>
          <form className="admin-auth-form" onSubmit={handleAdminLogin}>
            <div>
              <label htmlFor="admin-email">Email</label>
              <input
                id="admin-email"
                type="email"
                value={authForm.email}
                onChange={(e) => setAuthForm((current) => ({ ...current, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <label htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                type="password"
                value={authForm.password}
                onChange={(e) =>
                  setAuthForm((current) => ({ ...current, password: e.target.value }))
                }
                required
              />
            </div>
            <button className="btn btn-primary" type="submit">
              Sign In
            </button>
            {authError ? <p className="admin-message error">{authError}</p> : null}
          </form>
        </section>
      </div>
    );
  }

  if (isLoading) {
    return <div className="admin-layout">Loading dashboard...</div>;
  }

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <h1>Portfolio SaaS Admin Dashboard</h1>
        <p>
          Manage your portfolio content, leads, and sections from one dashboard.
        </p>
        <p className="admin-mode-tag">
          Data mode: {isFirebaseConfigured ? "Firebase (Cloud)" : "Local (Browser Storage)"}
        </p>
        {isFirebaseConfigured ? (
          <button className="btn btn-secondary" type="button" onClick={handleAdminLogout}>
            Logout
          </button>
        ) : null}
      </header>

      <section className="admin-dashboard-grid">
        {dashboardCards.map((card) => (
          <article key={card.label} className="admin-kpi-card">
            <p>{card.label}</p>
            <h3>{card.value}</h3>
          </article>
        ))}
      </section>

      <section className="admin-panel">
        <h3>Section Activity Chart</h3>
        <div className="admin-chart">
          {sectionStats.map((stat) => (
            <div key={stat.name} className="admin-chart-row">
              <span>{stat.name}</span>
              <div className="admin-chart-track">
                <div
                  className="admin-chart-fill"
                  style={{ width: `${(stat.value / maxStat) * 100}%` }}
                />
              </div>
              <strong>{stat.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <div className="admin-actions">
        <button className="btn btn-primary" type="button" onClick={handleSave}>
          Save All Changes
        </button>
        <button className="btn btn-secondary" type="button" onClick={handleReset}>
          Reset to Default
        </button>
      </div>

      {message ? <p className="admin-message success">{message}</p> : null}
      {error ? <p className="admin-message error">{error}</p> : null}

      <section className="admin-panel">
        <h3>Hero & Contact Settings</h3>
        <div className="admin-grid-form">
          <div>
            <label>Hero Headline</label>
            <input
              value={content.hero.headline}
              onChange={(e) =>
                updateContent({ hero: { ...content.hero, headline: e.target.value } })
              }
            />
          </div>
          <div>
            <label>Hero Subheadline</label>
            <textarea
              value={content.hero.subheadline}
              onChange={(e) =>
                updateContent({
                  hero: { ...content.hero, subheadline: e.target.value }
                })
              }
            />
          </div>
          <div>
            <label>Contact Email</label>
            <input
              value={content.contact.email}
              onChange={(e) =>
                updateContent({
                  contact: { ...content.contact, email: e.target.value }
                })
              }
            />
          </div>
          <div>
            <label>Contact Phone</label>
            <input
              value={content.contact.phone}
              onChange={(e) =>
                updateContent({
                  contact: { ...content.contact, phone: e.target.value }
                })
              }
            />
          </div>
        </div>
      </section>

      <ObjectArrayEditor
        label="Services"
        values={content.services}
        fields={[
          { key: "title", label: "Title" },
          { key: "description", label: "Description", type: "textarea" }
        ]}
        onChange={(next) => updateContent({ services: next })}
      />

      <ObjectArrayEditor
        label="Projects"
        values={content.projects}
        fields={[
          { key: "title", label: "Project Title" },
          { key: "problem", label: "Problem", type: "textarea" },
          { key: "solution", label: "Solution", type: "textarea" },
          { key: "result", label: "Result", type: "textarea" }
        ]}
        onChange={(next) => updateContent({ projects: next })}
      />

      <ObjectArrayEditor
        label="Packages"
        values={content.packages}
        fields={[
          { key: "name", label: "Package Name" },
          { key: "price", label: "Price" },
          { key: "period", label: "Period" },
          { key: "cta", label: "CTA Text" },
          { key: "features", label: "Features (comma separated)" }
        ]}
        onChange={(next) =>
          updateContent({
            packages: next.map((item) => ({
              ...item,
              features: Array.isArray(item.features)
                ? item.features
                : String(item.features)
                    .split(",")
                    .map((feature) => feature.trim())
                    .filter(Boolean)
            }))
          })
        }
      />

      <StringArrayEditor
        label="Industries"
        values={content.industries}
        onChange={(next) => updateContent({ industries: next })}
      />
      <StringArrayEditor
        label="Technologies"
        values={content.technologies}
        onChange={(next) => updateContent({ technologies: next })}
      />
      <StringArrayEditor
        label="Why Choose Us Items"
        values={content.whyItems}
        onChange={(next) => updateContent({ whyItems: next })}
      />
      <StringArrayEditor
        label="About Paragraphs"
        values={content.aboutParagraphs}
        onChange={(next) => updateContent({ aboutParagraphs: next })}
      />

      <section className="admin-panel">
        <h3>Leads Inbox</h3>
        {leads.length === 0 ? <p>No leads submitted yet.</p> : null}
        <ul className="admin-list">
          {leads.map((lead) => (
            <li key={lead.id}>
              <span>
                {lead.name} - {lead.email} - {lead.projectType || "General Inquiry"}
              </span>
              <div>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => handleDeleteLead(lead.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <details className="admin-preview-wrap">
        <summary>Live Preview</summary>
        <div className="admin-preview">
          <App content={previewContent} />
        </div>
      </details>
    </div>
  );
}

export default AdminPage;
