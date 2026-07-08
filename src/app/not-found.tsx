import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "system-ui" }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>Page Not Found</h2>
      <p style={{ color: "#666", marginBottom: "1.5rem" }}>The page you are looking for does not exist.</p>
      <Link href="/" style={{ padding: "0.5rem 1rem", borderRadius: "0.5rem", background: "#2563eb", color: "white", textDecoration: "none" }}>
        Go Home
      </Link>
    </div>
  );
}
