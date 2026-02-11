import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const HealthCheck = () => {
  const [dbStatus, setDbStatus] = useState<string>("Testing...");
  const [authStatus, setAuthStatus] = useState<string>("Testing...");
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    // Test DB
    supabase.from("profiles").select("id").limit(1).then(({ error }) => {
      setDbStatus(error ? `❌ ${error.message}` : "✅ OK");
    });

    // Test Auth
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        setAuthStatus(`❌ ${error.message}`);
      } else if (data.session) {
        setAuthStatus("✅ Logged in");
        setUser(data.session.user.email || data.session.user.id);
      } else {
        setAuthStatus("⚠️ Not logged in");
      }
    });
  }, []);

  return (
    <div style={{ fontFamily: "system-ui", padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>🏥 Health Check</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          {[
            ["Database", dbStatus],
            ["Auth", authStatus],
            ["User", user || "—"],
            ["Time", new Date().toLocaleString("en-US")],
          ].map(([label, value]) => (
            <tr key={label} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "0.5rem", fontWeight: 600 }}>{label}</td>
              <td style={{ padding: "0.5rem" }}>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ marginTop: "1rem", fontSize: "0.875rem", color: "#888" }}>
        <a href="/admin" style={{ color: "#3b82f6" }}>→ Admin</a> | <a href="/app" style={{ color: "#3b82f6" }}>→ App</a> | <a href="/" style={{ color: "#3b82f6" }}>→ Landing</a>
      </p>
    </div>
  );
};

export default HealthCheck;
