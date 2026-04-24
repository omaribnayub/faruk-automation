import { useMemo, useState } from "react";
import App from "./App";
import { defaultContent } from "./content/defaultContent";
import { getContent, resetContent, saveContent } from "./content/cmsStorage";

function AdminPage() {
  const [rawJson, setRawJson] = useState(
    JSON.stringify(getContent(), null, 2)
  );
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const previewContent = useMemo(() => {
    try {
      return JSON.parse(rawJson);
    } catch {
      return defaultContent;
    }
  }, [rawJson]);

  const handleSave = () => {
    try {
      const parsed = JSON.parse(rawJson);
      saveContent(parsed);
      setMessage("Content saved successfully.");
      setError("");
    } catch {
      setError("Invalid JSON. Fix formatting before saving.");
      setMessage("");
    }
  };

  const handleReset = () => {
    resetContent();
    const resetJson = JSON.stringify(defaultContent, null, 2);
    setRawJson(resetJson);
    setMessage("Content reset to defaults.");
    setError("");
  };

  const handleExport = () => {
    try {
      const parsed = JSON.parse(rawJson);
      const blob = new Blob([JSON.stringify(parsed, null, 2)], {
        type: "application/json"
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "website-content.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("Cannot export while JSON is invalid.");
      setMessage("");
    }
  };

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <h1>Website Content Admin</h1>
        <p>
          Update content safely via JSON without changing layout code. Open `/`
          to view the live site.
        </p>
      </header>

      <div className="admin-actions">
        <button className="btn btn-primary" type="button" onClick={handleSave}>
          Save Content
        </button>
        <button className="btn btn-secondary" type="button" onClick={handleReset}>
          Reset to Default
        </button>
        <button className="btn btn-secondary" type="button" onClick={handleExport}>
          Export JSON
        </button>
      </div>

      {message ? <p className="admin-message success">{message}</p> : null}
      {error ? <p className="admin-message error">{error}</p> : null}

      <label className="admin-label" htmlFor="cms-json-editor">
        Content JSON
      </label>
      <textarea
        id="cms-json-editor"
        className="admin-editor"
        value={rawJson}
        onChange={(event) => {
          setRawJson(event.target.value);
          setMessage("");
          setError("");
        }}
      />

      <details className="admin-preview-wrap">
        <summary>Live Preview (from current editor content)</summary>
        <div className="admin-preview">
          <App content={previewContent} />
        </div>
      </details>
    </div>
  );
}

export default AdminPage;
