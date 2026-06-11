import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuilding, faPhone, faBriefcase, faUsers, faNewspaper, faChartLine,
  faLocationDot, faComments, faXmark, faUniversity, faHouse, faMedal,
  faArrowTrendUp, faGlobe, faPiggyBank, faPlane, faMoneyBillTransfer,
  faFileInvoiceDollar, faChildReaching, faMobileScreen, faShieldHalved,
  faGraduationCap, faHeartPulse, faHandshake, faLightbulb, faArrowRight,
  faLock, faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook, faXTwitter, faYoutube, faLinkedin, faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import BandhanChatbotDemo from "./BandhanChatbotDemo";

export default function BandhanLandingPage() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div style={{ fontFamily: "'Roboto', sans-serif", background: "#fff", color: "#1a1a1a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@600;700&family=Roboto:wght@400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; cursor: default; pointer-events: none; }
        @keyframes chatPulse {
          0% { box-shadow: 0 0 0 0 rgba(185,18,48,0.5); }
          70% { box-shadow: 0 0 0 16px rgba(185,18,48,0); }
          100% { box-shadow: 0 0 0 0 rgba(185,18,48,0); }
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
        .service-card:hover { box-shadow: 0 8px 24px rgba(122,12,30,.12); transform: translateY(-2px); }
        .service-card { transition: all .2s; }
      `}</style>

      {/* HEADER */}
      <header style={{ background: "#fff", borderBottom: "1px solid #e8e8e8", position: "sticky", top: 0, zIndex: 100 }}>
        {/* Top utility bar */}
        <div style={{ background: "#7A0C1E", color: "#fff", fontSize: 12, padding: "6px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 24 }}>
            {[["About Us", faUsers], ["Media Room", faNewspaper], ["Careers", faBriefcase], ["Investors", faChartLine]].map(([label, icon]) => (
              <span key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <FontAwesomeIcon icon={icon} style={{ fontSize: 11 }} />{label}
              </span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <FontAwesomeIcon icon={faLocationDot} style={{ fontSize: 11 }} /> Banking Outlet Locator
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <FontAwesomeIcon icon={faPhone} style={{ fontSize: 11 }} /> Reach Us
            </span>
            <span style={{ width: 1, height: 14, background: "rgba(255,255,255,0.3)", display: "inline-block" }} />
            {[faFacebook, faXTwitter, faYoutube, faLinkedin, faInstagram].map((icon, i) => (
              <FontAwesomeIcon key={i} icon={icon} style={{ fontSize: 13, opacity: 0.85 }} />
            ))}
          </div>
        </div>

        {/* Main nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 8, background: "#7A0C1E", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "'Roboto Slab', serif", fontSize: 22, fontWeight: 700 }}>৳</div>
            <div>
              <div style={{ fontFamily: "'Roboto Slab', serif", fontSize: 18, fontWeight: 700, color: "#7A0C1E" }}>Bandhan Bank</div>
              <div style={{ fontSize: 10, color: "#888", letterSpacing: 1, fontWeight: 500 }}>APNA BANK, APNA MAAN</div>
            </div>
          </div>
          <nav style={{ display: "flex", gap: 32, fontSize: 15, fontWeight: 700 }}>
            {["Home", "Personal", "Business", "NRI", "Rewards"].map(n => (
              <span key={n} style={{ cursor: "default", padding: "4px 0", borderBottom: n === "Home" ? "2px solid #B91230" : "none", color: n === "Home" ? "#B91230" : "#222" }}>{n}</span>
            ))}
          </nav>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ background: "#B91230", color: "#fff", borderRadius: 8, padding: "9px 20px", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <FontAwesomeIcon icon={faRightToBracket} /> Internet Banking
            </div>
            <div style={{ border: "2px solid #B91230", color: "#B91230", borderRadius: 8, padding: "9px 20px", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
              <FontAwesomeIcon icon={faMobileScreen} /> mBandhan App
            </div>
          </div>
        </div>
      </header>

      {/* HERO BANNER */}
      <section style={{ position: "relative", background: "linear-gradient(135deg, #7A0C1E 0%, #B91230 50%, #e85d04 100%)", minHeight: 480, display: "flex", alignItems: "center", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.08, backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div style={{ padding: "60px 40px", zIndex: 1, maxWidth: 600 }}>
          <div style={{ background: "rgba(255,255,255,0.15)", color: "#fff", borderRadius: 6, padding: "6px 14px", fontSize: 13, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 16, letterSpacing: 1 }}>
            <FontAwesomeIcon icon={faUsers} /> TRUSTED BY OVER 3 CRORE CUSTOMERS
          </div>
          <h1 style={{ fontFamily: "'Roboto Slab', serif", fontSize: 52, fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: 20 }}>Banking That<br />Believes in You</h1>
          <p style={{ color: "rgba(255,255,255,0.88)", fontSize: 18, lineHeight: 1.6, marginBottom: 32, fontWeight: 400 }}>From microfinance roots to a full-service universal bank — Bandhan Bank is here for every Indian's financial journey.</p>
          <div style={{ display: "flex", gap: 14 }}>
            <div style={{ background: "#fff", color: "#B91230", borderRadius: 10, padding: "13px 28px", fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
              <FontAwesomeIcon icon={faUniversity} /> Open an Account
            </div>
            <div style={{ border: "2px solid rgba(255,255,255,0.7)", color: "#fff", borderRadius: 10, padding: "13px 28px", fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
              <FontAwesomeIcon icon={faArrowRight} /> Explore Products
            </div>
          </div>
        </div>
        {/* Rate card */}
        <div style={{ position: "absolute", right: 40, top: "50%", transform: "translateY(-50%)", background: "#fff", borderRadius: 16, padding: "24px 28px", boxShadow: "0 8px 32px rgba(0,0,0,0.2)", minWidth: 220 }}>
          <div style={{ fontSize: 11, color: "#888", fontWeight: 700, marginBottom: 8, letterSpacing: 1, display: "flex", alignItems: "center", gap: 6 }}>
            <FontAwesomeIcon icon={faPiggyBank} style={{ color: "#B91230" }} /> SAVINGS ACCOUNT
          </div>
          <div style={{ fontFamily: "'Roboto Slab', serif", fontSize: 36, fontWeight: 700, color: "#B91230" }}>6.50%</div>
          <div style={{ fontSize: 13, color: "#555", marginBottom: 16 }}>interest p.a.</div>
          <div style={{ background: "#B91230", color: "#fff", borderRadius: 8, padding: "10px 0", textAlign: "center", fontWeight: 700, fontSize: 14 }}>Open Account</div>
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #eee" }}>
            <div style={{ fontSize: 11, color: "#888", fontWeight: 700, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
              <FontAwesomeIcon icon={faLock} style={{ color: "#B91230" }} /> FIXED DEPOSIT
            </div>
            <div style={{ fontFamily: "'Roboto Slab', serif", fontSize: 22, fontWeight: 700, color: "#B91230" }}>7.75%</div>
            <div style={{ fontSize: 12, color: "#555" }}>Senior citizens p.a.</div>
            <div style={{ fontFamily: "'Roboto Slab', serif", fontSize: 20, fontWeight: 700, color: "#333", marginTop: 4 }}>7.25%</div>
            <div style={{ fontSize: 12, color: "#555" }}>General public p.a.</div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section style={{ padding: "60px 40px", textAlign: "center", background: "#fff" }}>
        <div style={{ fontSize: 12, color: "#B91230", fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>OUR SERVICES</div>
        <h2 style={{ fontFamily: "'Roboto Slab', serif", fontSize: 38, fontWeight: 700, color: "#1a1a1a", marginBottom: 12 }}>Trusted by all, banking for all</h2>
        <p style={{ color: "#666", fontSize: 16, maxWidth: 560, margin: "0 auto 48px" }}>From everyday savings to large business solutions — we have a product for every need.</p>

        {[
          {
            label: "Personal Banking",
            icon: faUsers,
            cards: [
              { title: "Savings Accounts", desc: "Earn up to 6.50% p.a. with zero-hassle digital account opening.", icon: faPiggyBank },
              { title: "Home Loans", desc: "Competitive rates, quick processing and doorstep service.", icon: faHouse },
              { title: "Gold Loans", desc: "Instant liquidity against your gold at attractive rates.", icon: faMedal },
            ]
          },
          {
            label: "Business Banking",
            icon: faBriefcase,
            cards: [
              { title: "Aspiring Business Loan", desc: "Tailored finance for small and growing businesses.", icon: faArrowTrendUp },
              { title: "Current Accounts", desc: "High transaction limits and free NEFT/RTGS for businesses.", icon: faBuilding },
              { title: "Trade Finance", desc: "Letters of credit, bank guarantees and forex services.", icon: faGlobe },
            ]
          },
          {
            label: "NRI Banking",
            icon: faPlane,
            cards: [
              { title: "NRE/NRO Accounts", desc: "Tax-free interest on NRE deposits, easy repatriation.", icon: faPlane },
              { title: "FCNR Deposits", desc: "Foreign currency deposits fully repatriable.", icon: faGlobe },
              { title: "Remittance", desc: "Fast, secure money transfer to India.", icon: faMoneyBillTransfer },
            ]
          }
        ].map(section => (
          <div key={section.label} style={{ marginBottom: 48, textAlign: "left" }}>
            <h3 style={{ fontFamily: "'Roboto Slab', serif", fontSize: 22, fontWeight: 700, color: "#7A0C1E", marginBottom: 20, paddingLeft: 16, borderLeft: "4px solid #B91230", display: "flex", alignItems: "center", gap: 10 }}>
              <FontAwesomeIcon icon={section.icon} /> {section.label}
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {section.cards.map(card => (
                <div key={card.title} className="service-card" style={{ background: "#FFF8F0", border: "1.5px solid #EDD5C0", borderRadius: 16, padding: "28px 24px" }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: "#7A0C1E", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                    <FontAwesomeIcon icon={card.icon} style={{ fontSize: 22, color: "#fff" }} />
                  </div>
                  <div style={{ fontFamily: "'Roboto Slab', serif", fontSize: 17, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>{card.title}</div>
                  <div style={{ fontSize: 14, color: "#666", lineHeight: 1.6, marginBottom: 16 }}>{card.desc}</div>
                  <div style={{ color: "#B91230", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                    View details <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: 11 }} />
                  </div>
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
            { title: "File Your ITR with Ease", sub: "Link your Bandhan Bank account for seamless tax filing", color: "#1d3557", accent: "#e63946", icon: faFileInvoiceDollar },
            { title: "NPS Vatsalya Account", sub: "Secure your child's future with National Pension Scheme", color: "#2d6a4f", accent: "#52b788", icon: faChildReaching },
            { title: "mBandhan 2.0 is Here", sub: "Faster, smarter, more secure mobile banking experience", color: "#6d4c41", accent: "#ff8f00", icon: faMobileScreen },
            { title: "Cybersecurity Awareness", sub: "Stay safe: Bandhan Bank never asks for OTP or PIN", color: "#4a148c", accent: "#ce93d8", icon: faShieldHalved },
          ].map(b => (
            <div key={b.title} style={{ background: b.color, borderRadius: 16, padding: "32px 28px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", right: -20, bottom: -20, width: 120, height: 120, borderRadius: "50%", background: b.accent, opacity: 0.15 }} />
              <FontAwesomeIcon icon={b.icon} style={{ fontSize: 28, color: b.accent, marginBottom: 12, display: "block" }} />
              <div style={{ fontFamily: "'Roboto Slab', serif", fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{b.title}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.5, marginBottom: 20 }}>{b.sub}</div>
              <div style={{ background: b.accent, color: "#fff", borderRadius: 8, padding: "8px 18px", display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 13 }}>
                Know More <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: 11 }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BEYOND BANKING — CSR */}
      <section style={{ padding: "60px 40px", background: "#fff" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 12, color: "#B91230", fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>CORPORATE SOCIAL RESPONSIBILITY</div>
          <h2 style={{ fontFamily: "'Roboto Slab', serif", fontSize: 36, fontWeight: 700, color: "#1a1a1a" }}>Beyond Banking</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
          {[
            { icon: faHandshake, title: "Targeting the Hardcore Poor", desc: "Supporting the most vulnerable communities" },
            { icon: faGraduationCap, title: "Education Programme", desc: "Building the next generation through learning" },
            { icon: faHeartPulse, title: "Health Programme", desc: "Healthcare access for underserved populations" },
            { icon: faArrowTrendUp, title: "Employing the Unemployed", desc: "Livelihood creation and skill development" },
            { icon: faLightbulb, title: "Financial Literacy", desc: "Empowering through financial awareness" },
          ].map(c => (
            <div key={c.title} style={{ textAlign: "center", background: "#FFF8F0", borderRadius: 14, padding: "28px 16px", border: "1px solid #EDD5C0" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#7A0C1E", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                <FontAwesomeIcon icon={c.icon} style={{ fontSize: 22, color: "#fff" }} />
              </div>
              <div style={{ fontFamily: "'Roboto Slab', serif", fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>{c.title}</div>
              <div style={{ fontSize: 12, color: "#777", lineHeight: 1.5, marginBottom: 12 }}>{c.desc}</div>
              <span style={{ color: "#B91230", fontSize: 12, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 5 }}>
                Read more <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: 10 }} />
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#1a0509", color: "#ccc", padding: "48px 40px 24px", fontFamily: "'Roboto', sans-serif" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 32, marginBottom: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 38, height: 38, borderRadius: 8, background: "#B91230", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "'Roboto Slab',serif", fontSize: 20, fontWeight: 700 }}>৳</div>
              <div style={{ fontFamily: "'Roboto Slab', serif", fontSize: 16, fontWeight: 700, color: "#fff" }}>Bandhan Bank</div>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: "#999", marginBottom: 16 }}>DN-32, Sector V, Salt Lake City,<br />Kolkata – 700091, West Bengal, India</p>
            <div style={{ fontSize: 13, color: "#B91230", fontWeight: 700, marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
              <FontAwesomeIcon icon={faPhone} /> 1800 258 8181
            </div>
            <div style={{ fontSize: 12, color: "#777" }}>24x7 Toll-Free Helpline</div>
            <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
              {[faFacebook, faXTwitter, faYoutube, faLinkedin, faInstagram].map((icon, i) => (
                <div key={i} style={{ width: 32, height: 32, borderRadius: "50%", background: "#2d1015", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FontAwesomeIcon icon={icon} style={{ fontSize: 13, color: "#999" }} />
                </div>
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
              <div style={{ fontFamily: "'Roboto Slab', serif", color: "#fff", fontWeight: 700, fontSize: 14, marginBottom: 14 }}>{col.heading}</div>
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
        <FontAwesomeIcon icon={chatOpen ? faXmark : faComments} style={{ fontSize: 26, color: "#fff" }} />
      </button>

      {/* CHATBOT POPUP */}
      <div className={`chat-popup ${chatOpen ? "open" : "closed"}`}>
        <BandhanChatbotDemo embedded />
      </div>
    </div>
  );
}
