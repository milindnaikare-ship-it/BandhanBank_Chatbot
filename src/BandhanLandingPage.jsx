import { useState } from "react";
import BandhanChatbotDemo from "./BandhanChatbotDemo";

export default function BandhanLandingPage() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div style={{ fontFamily: "'Karla', sans-serif", background: "#fff", color: "#1a1a1a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Karla:wght@400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; cursor: default; pointer-events: none; }
        button.nav-btn { cursor: default; }
        @keyframes chatPulse {
          0% { box-shadow: 0 0 0 0 rgba(185,18,48,0.5); }
          70% { box-shadow: 0 0 0 16px rgba(185,18,48,0); }
          100% { box-shadow: 0 0 0 0 rgba(185,18,48,0); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .chat-fab { animation: chatPulse 2s infinite; }
        .chat-fab:hover { transform: scale(1.08); animation: none; box-shadow: 0 8px 32px rgba(185,18,48,0.4); }
        .chat-popup {
          position: fixed; bottom: 100px; right: 24px; width: 440px; height: 82vh; max-height: 800px;
          background: white; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.25);
          overflow: hidden; z-index: 1000; display: flex; flex-direction: column;
          transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        .chat-popup.closed { transform: scale(0.8) translateY(40px); opacity: 0; pointer-events: none; }
        .chat-popup.open { transform: scale(1) translateY(0); opacity: 1; }
      `}</style>

      {/* HEADER */}
      <header style={{ background: "#fff", borderBottom: "1px solid #e8e8e8", position: "sticky", top: 0, zIndex: 100 }}>
        {/* Top utility bar */}
        <div style={{ background: "#7A0C1E", color: "#fff", fontSize: 12, padding: "6px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 20 }}>
            <span>About Us</span><span>Media Room</span><span>Careers</span><span>Investors</span>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span>🏢 Banking Outlet Locator</span>
            <span>📞 Reach Us</span>
            <span>f</span><span>𝕏</span><span>▶</span><span>in</span><span>📷</span>
          </div>
        </div>
        {/* Main nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 40px" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: 8, background: "#7A0C1E", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 700 }}>৳</div>
            <div>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: "#7A0C1E" }}>Bandhan Bank</div>
              <div style={{ fontSize: 10, color: "#888", letterSpacing: 1 }}>APNA BANK, APNA MAAN</div>
            </div>
          </div>
          {/* Nav items */}
          <nav style={{ display: "flex", gap: 32, fontSize: 15, fontWeight: 700, color: "#222" }}>
            {["Home", "Personal", "Business", "NRI", "Rewards"].map(n => (
              <span key={n} style={{ cursor: "default", padding: "4px 0", borderBottom: n === "Home" ? "2px solid #B91230" : "none", color: n === "Home" ? "#B91230" : "#222" }}>{n}</span>
            ))}
          </nav>
          {/* Login button */}
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ background: "#B91230", color: "#fff", borderRadius: 8, padding: "9px 22px", fontWeight: 700, fontSize: 14 }}>Internet Banking</div>
            <div style={{ border: "2px solid #B91230", color: "#B91230", borderRadius: 8, padding: "9px 22px", fontWeight: 700, fontSize: 14 }}>mBandhan App</div>
          </div>
        </div>
      </header>

      {/* HERO BANNER */}
      <section style={{ position: "relative", background: "linear-gradient(135deg, #7A0C1E 0%, #B91230 50%, #e85d04 100%)", minHeight: 480, display: "flex", alignItems: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.08, backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div style={{ padding: "60px 40px", zIndex: 1, maxWidth: 600 }}>
          <div style={{ background: "rgba(255,255,255,0.15)", color: "#fff", borderRadius: 6, padding: "6px 14px", fontSize: 13, fontWeight: 700, display: "inline-block", marginBottom: 16, letterSpacing: 1 }}>TRUSTED BY OVER 3 CRORE CUSTOMERS</div>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 52, fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 20 }}>Banking That<br/>Believes in You</h1>
          <p style={{ color: "rgba(255,255,255,0.88)", fontSize: 18, lineHeight: 1.6, marginBottom: 32 }}>From microfinance roots to a full-service universal bank — Bandhan Bank is here for every Indian's financial journey.</p>
          <div style={{ display: "flex", gap: 14 }}>
            <div style={{ background: "#fff", color: "#B91230", borderRadius: 10, padding: "13px 28px", fontWeight: 700, fontSize: 15 }}>Open an Account</div>
            <div style={{ border: "2px solid rgba(255,255,255,0.7)", color: "#fff", borderRadius: 10, padding: "13px 28px", fontWeight: 700, fontSize: 15 }}>Explore Products</div>
          </div>
        </div>
        {/* Sticky rate card */}
        <div style={{ position: "absolute", right: 40, top: "50%", transform: "translateY(-50%)", background: "#fff", borderRadius: 16, padding: "24px 28px", boxShadow: "0 8px 32px rgba(0,0,0,0.2)", minWidth: 220 }}>
          <div style={{ fontSize: 12, color: "#888", fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>SAVINGS ACCOUNT</div>
          <div style={{ fontFamily: "'Fraunces',serif", fontSize: 36, fontWeight: 700, color: "#B91230" }}>6.50%</div>
          <div style={{ fontSize: 13, color: "#555", marginBottom: 16 }}>interest p.a.</div>
          <div style={{ background: "#B91230", color: "#fff", borderRadius: 8, padding: "10px 0", textAlign: "center", fontWeight: 700, fontSize: 14 }}>Open Account</div>
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #eee" }}>
            <div style={{ fontSize: 12, color: "#888", fontWeight: 700, marginBottom: 4 }}>FIXED DEPOSIT</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#B91230", fontFamily: "'Fraunces',serif" }}>7.75%</div>
            <div style={{ fontSize: 12, color: "#555" }}>Senior citizens p.a.</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#333", fontFamily: "'Fraunces',serif", marginTop: 4 }}>7.25%</div>
            <div style={{ fontSize: 12, color: "#555" }}>General public p.a.</div>
          </div>
        </div>
      </section>

      {/* TRUSTED BY ALL section */}
      <section style={{ padding: "60px 40px", textAlign: "center", background: "#fff" }}>
        <div style={{ fontSize: 13, color: "#B91230", fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>OUR SERVICES</div>
        <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 38, fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>Trusted by all, banking for all</h2>
        <p style={{ color: "#666", fontSize: 16, maxWidth: 560, margin: "0 auto 48px" }}>From everyday savings to large business solutions — we have a product for every need.</p>

        {/* Tab-like cards for Personal / Business / NRI */}
        {[
          {
            label: "Personal Banking",
            cards: [
              { title: "Savings Accounts", desc: "Earn up to 6.50% p.a. with zero-hassle digital account opening.", icon: "🏦" },
              { title: "Home Loans", desc: "Competitive rates, quick processing and doorstep service.", icon: "🏠" },
              { title: "Gold Loans", desc: "Instant liquidity against your gold at attractive rates.", icon: "🥇" },
            ]
          },
          {
            label: "Business Banking",
            cards: [
              { title: "Aspiring Business Loan", desc: "Tailored finance for small and growing businesses.", icon: "📈" },
              { title: "Current Accounts", desc: "High transaction limits and free NEFT/RTGS for businesses.", icon: "💼" },
              { title: "Trade Finance", desc: "Letters of credit, bank guarantees and forex services.", icon: "🌐" },
            ]
          },
          {
            label: "NRI Banking",
            cards: [
              { title: "NRE/NRO Accounts", desc: "Tax-free interest on NRE deposits, easy repatriation.", icon: "✈️" },
              { title: "FCNR Deposits", desc: "Foreign currency deposits fully repatriable.", icon: "💱" },
              { title: "Remittance", desc: "Fast, secure money transfer to India.", icon: "💸" },
            ]
          }
        ].map(section => (
          <div key={section.label} style={{ marginBottom: 48, textAlign: "left" }}>
            <h3 style={{ fontFamily: "'Fraunces',serif", fontSize: 24, fontWeight: 700, color: "#7A0C1E", marginBottom: 20, paddingLeft: 16, borderLeft: "4px solid #B91230" }}>{section.label}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {section.cards.map(card => (
                <div key={card.title} style={{ background: "#FFF8F0", border: "1.5px solid #EDD5C0", borderRadius: 16, padding: "28px 24px", transition: "all .2s" }}>
                  <div style={{ fontSize: 36, marginBottom: 14 }}>{card.icon}</div>
                  <div style={{ fontFamily: "'Fraunces',serif", fontSize: 18, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>{card.title}</div>
                  <div style={{ fontSize: 14, color: "#666", lineHeight: 1.6, marginBottom: 16 }}>{card.desc}</div>
                  <div style={{ color: "#B91230", fontWeight: 700, fontSize: 13 }}>View details →</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* PROMOTIONAL BANNERS */}
      <section style={{ background: "#FFF8F0", padding: "48px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {[
            { title: "File Your ITR with Ease", sub: "Link your Bandhan Bank account for seamless tax filing", color: "#1d3557", accent: "#e63946" },
            { title: "NPS Vatsalya Account", sub: "Secure your child's future with National Pension Scheme", color: "#2d6a4f", accent: "#52b788" },
            { title: "mBandhan 2.0 is Here", sub: "Faster, smarter, more secure mobile banking experience", color: "#6d4c41", accent: "#ff8f00" },
            { title: "Cybersecurity Awareness", sub: "Stay safe: Bandhan Bank never asks for OTP or PIN", color: "#4a148c", accent: "#ce93d8" },
          ].map(b => (
            <div key={b.title} style={{ background: b.color, borderRadius: 16, padding: "32px 28px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", right: -20, bottom: -20, width: 120, height: 120, borderRadius: "50%", background: b.accent, opacity: 0.15 }} />
              <div style={{ fontSize: 11, color: b.accent, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>BANDHAN BANK</div>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{b.title}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.5, marginBottom: 20 }}>{b.sub}</div>
              <div style={{ background: b.accent, color: "#fff", borderRadius: 8, padding: "8px 18px", display: "inline-block", fontWeight: 700, fontSize: 13 }}>Know More</div>
            </div>
          ))}
        </div>
      </section>

      {/* BEYOND BANKING — CSR */}
      <section style={{ padding: "60px 40px", background: "#fff" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 13, color: "#B91230", fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>CORPORATE SOCIAL RESPONSIBILITY</div>
          <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 36, fontWeight: 700, color: "#1a1a1a" }}>Beyond Banking</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
          {[
            { icon: "🎯", title: "Targeting the Hardcore Poor", desc: "Supporting the most vulnerable communities" },
            { icon: "📚", title: "Education Programme", desc: "Building the next generation through learning" },
            { icon: "🏥", title: "Health Programme", desc: "Healthcare access for underserved populations" },
            { icon: "💪", title: "Employing the Unemployed", desc: "Livelihood creation and skill development" },
            { icon: "💡", title: "Financial Literacy", desc: "Empowering through financial awareness" },
          ].map(c => (
            <div key={c.title} style={{ textAlign: "center", background: "#FFF8F0", borderRadius: 14, padding: "24px 16px", border: "1px solid #EDD5C0" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{c.icon}</div>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>{c.title}</div>
              <div style={{ fontSize: 12, color: "#777", lineHeight: 1.5, marginBottom: 12 }}>{c.desc}</div>
              <span style={{ color: "#B91230", fontSize: 12, fontWeight: 700 }}>Read more →</span>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#1a0509", color: "#ccc", padding: "48px 40px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 32, marginBottom: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 38, height: 38, borderRadius: 8, background: "#B91230", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 700 }}>৳</div>
              <div style={{ fontFamily: "'Fraunces',serif", fontSize: 16, fontWeight: 700, color: "#fff" }}>Bandhan Bank</div>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: "#999", marginBottom: 16 }}>DN-32, Sector V, Salt Lake City,<br />Kolkata – 700091, West Bengal, India</p>
            <div style={{ fontSize: 13, color: "#B91230", fontWeight: 700, marginBottom: 4 }}>📞 1800 258 8181</div>
            <div style={{ fontSize: 12, color: "#777" }}>24x7 Toll-Free Helpline</div>
            <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
              {["f", "𝕏", "▶", "in", "📷"].map(s => (
                <div key={s} style={{ width: 32, height: 32, borderRadius: "50%", background: "#2d1015", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#999" }}>{s}</div>
              ))}
            </div>
          </div>
          {[
            { heading: "About Bandhan", links: ["Our Story", "Leadership Team", "Philosophy", "Awards & Recognition", "CSR"] },
            { heading: "Products", links: ["Savings Accounts", "Fixed Deposits", "Home Loans", "Gold Loans", "Credit Cards"] },
            { heading: "Resources", links: ["EMI Calculator", "FD Calculator", "Forms & Downloads", "FAQs", "Grievance Redressal"] },
            { heading: "Investors", links: ["Annual Reports", "Financial Results", "Corporate Governance", "Shareholding", "Credit Ratings"] },
          ].map(col => (
            <div key={col.heading}>
              <div style={{ fontFamily: "'Fraunces',serif", color: "#fff", fontWeight: 700, fontSize: 14, marginBottom: 14 }}>{col.heading}</div>
              {col.links.map(l => <div key={l} style={{ fontSize: 13, color: "#888", marginBottom: 8, lineHeight: 1.4 }}>{l}</div>)}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid #2d1015", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ fontSize: 12, color: "#666" }}>© 2026 Bandhan Bank Limited. All rights reserved. DICGC Member Bank.</div>
          <div style={{ display: "flex", gap: 20, fontSize: 12, color: "#666" }}>
            <span>Privacy Policy</span><span>Terms of Use</span><span>Accessibility</span><span>Sitemap</span>
          </div>
        </div>
      </footer>

      {/* FLOATING CHAT BUTTON */}
      <button
        className="chat-fab"
        onClick={() => setChatOpen(o => !o)}
        style={{
          position: "fixed", bottom: 28, right: 28, width: 64, height: 64,
          borderRadius: "50%", background: "#B91230", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 999, transition: "transform 0.2s, box-shadow 0.2s",
        }}
        title="Chat with Bandhan Sahayak"
      >
        {chatOpen
          ? <span style={{ fontSize: 26, color: "#fff" }}>✕</span>
          : <span style={{ fontSize: 30 }}>💬</span>
        }
      </button>

      {/* CHATBOT POPUP */}
      <div className={`chat-popup ${chatOpen ? "open" : "closed"}`}>
        <BandhanChatbotDemo embedded />
      </div>
    </div>
  );
}
