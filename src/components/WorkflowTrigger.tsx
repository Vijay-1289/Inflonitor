import React, { useState } from "react";

const N8N_WEBHOOK_URL = "https://svijay.app.n8n.cloud/workflow/RQHqB88TLCne2hZY";

export const WorkflowTrigger = () => {
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runWorkflow = async () => {
    setLoading(true);
    setStatus("running");
    setResult(null);
    setError(null);
    try {
      const res = await fetch(N8N_WEBHOOK_URL, { method: "POST" });
      let data: any = {};
      try {
        data = await res.json();
      } catch {
        data = { message: await res.text() };
      }
      setStatus("success");
      setResult(typeof data.message === 'string' ? data.message : JSON.stringify(data, null, 2) || "Workflow completed!");
    } catch (err: any) {
      setStatus("error");
      setError(err.message || "Error running workflow.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-6 p-4 bg-card rounded-xl shadow max-w-xl mx-auto">
      <div className="flex flex-col md:flex-row gap-3 mb-2">
        <button
          className="px-6 py-2 bg-primary text-white rounded-lg font-bold hover:bg-primary/80 transition disabled:opacity-60"
          onClick={runWorkflow}
          disabled={loading || status === "running"}
        >
          {loading && status === "running" ? "Running..." : "Run Workflow"}
        </button>
      </div>
      <div className="mt-2 text-sm">
        <strong>Status:</strong> <span className="font-mono">{status}</span>
        {error && <div className="mt-1 text-destructive">{error}</div>}
        {result && (
          <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto max-h-60">{result}</pre>
        )}
      </div>
    </div>
  );
}; 