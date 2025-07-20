import React, { useState } from "react";
import { API_BASE } from "@/lib/apiConfig";

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
      const res = await fetch(`${API_BASE}/api/run-workflow`, { method: "POST" });
      const data = await res.json();
      setStatus("success");
      setResult(data.message || "Workflow completed!");
    } catch (err: any) {
      setStatus("error");
      setError(err.message || "Error running workflow.");
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/status`);
      const data = await res.json();
      setStatus(data.status);
    } catch (err: any) {
      setError(err.message || "Error checking status.");
    } finally {
      setLoading(false);
    }
  };

  const getResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/results`);
      const data = await res.json();
      setResult(typeof data === 'string' ? data : JSON.stringify(data, null, 2));
    } catch (err: any) {
      setError(err.message || "Error fetching results.");
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
        <button
          className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition"
          onClick={checkStatus}
          disabled={loading}
        >
          Check Status
        </button>
        <button
          className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition"
          onClick={getResults}
          disabled={loading}
        >
          View Last Result
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