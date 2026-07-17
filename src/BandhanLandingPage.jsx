import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot, faPhone, faComments, faXmark, faArrowRight, faRightToBracket,
  faChevronLeft, faChevronRight, faChevronDown, faPlus, faMinus,
  faPiggyBank, faHouse, faMedal, faBriefcase, faBuilding, faGlobe,
  faPlane, faMoneyBillTransfer,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF, faXTwitter, faYoutube, faLinkedinIn, faInstagram,
  faWhatsapp, faApple, faGooglePlay,
} from "@fortawesome/free-brands-svg-icons";
import BandhanChatbotDemo from "./BandhanChatbotDemo";
import BandhanLogo from "./BandhanLogo";

// ---- Brand theme (Bandhan Bank site) --------------------------------------
const RED = "#D91F2C";
const RED_DK = "#B71622";
const NAVY = "#092E4F";
const NAVY2 = "#214260";
const GREY = "#F5F7FA";
const BODY = "#5A6B7B";
const LINE = "#E4E9EF";

// Hero carousel slides
const SLIDES = [
  { eyebrow: "SAVINGS ACCOUNT", title: "Open a Savings Account", big: "6.50%", unit: "interest p.a.", sub: "Zero-hassle digital opening with video KYC. Start earning more on every rupee.", cta: "Open an account", grad: `linear-gradient(115deg, ${NAVY} 0%, ${NAVY2} 55%, ${RED} 140%)` },
  { eyebrow: "FIXED DEPOSIT", title: "Grow your savings, guaranteed", big: "7.75%", unit: "p.a. for senior citizens", sub: "Attractive fixed deposit rates across tenures. Book instantly from your account.", cta: "Book an FD", grad: `linear-gradient(115deg, ${RED} 0%, ${RED_DK} 60%, ${NAVY} 150%)` },
  { eyebrow: "mBANDHAN 2.0", title: "Bank when you want, the way you want", big: "24×7", unit: "banking in your pocket", sub: "Faster, smarter, more secure mobile banking. Transfers, deposits and more.", cta: "Explore the app", grad: `linear-gradient(115deg, ${NAVY2} 0%, ${NAVY} 50%, ${RED_DK} 160%)` },
];

// Product sections
const SECTIONS = [
  {
    eyebrow: "Personal Banking", heading: ["Bank when you want,", "the way you want"],
    sub: "Everyday accounts, deposits and loans designed around your life.",
    cards: [
      { icon: faPiggyBank, title: "Savings Accounts", desc: "Earn up to 6.50% p.a. with zero-hassle digital account opening.", cta: "Open an account" },
      { icon: faHouse, title: "Home Loans", desc: "Competitive rates, quick processing and doorstep service.", cta: "Apply now" },
      { icon: faMedal, title: "Gold Loans", desc: "Instant liquidity against your gold at attractive rates.", cta: "Apply now" },
    ],
  },
  {
    eyebrow: "Business Banking", heading: ["Solutions that grow", "with your business"],
    sub: "From current accounts to trade finance for enterprises of every size.",
    cards: [
      { icon: faBriefcase, title: "Aspiring Business Loan", desc: "Tailored finance for small and growing businesses.", cta: "Apply now" },
      { icon: faBuilding, title: "Current Accounts", desc: "High transaction limits with free NEFT/RTGS for businesses.", cta: "Open an account" },
      { icon: faGlobe, title: "Trade Finance", desc: "Letters of credit, bank guarantees and forex services.", cta: "Learn more" },
    ],
  },
  {
    eyebrow: "NRI Banking", heading: ["Your money, connected", "to home"],
    sub: "Manage your finances in India from anywhere in the world.",
    cards: [
      { icon: faPlane, title: "NRE / NRO Accounts", desc: "Tax-free interest on NRE deposits with easy repatriation.", cta: "Open an account" },
      { icon: faGlobe, title: "FCNR Deposits", desc: "Foreign-currency deposits, fully repatriable.", cta: "Apply now" },
      { icon: faMoneyBillTransfer, title: "Remittance", desc: "Fast, secure money transfer to India.", cta: "Learn more" },
    ],
  },
];

export default function BandhanLandingPage() {
  const [chatOpen, setChatOpen] = useState(false);
  const [slide, setSlide] = useState(0);
  const [fontScale, setFontScale] = useState(1);
  const [payOpen, setPayOpen] = useState(false);

  // Auto-advance the hero carousel
  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 5500);
    return () => clearInterval(id);
  }, []);

  const go = (dir) => setSlide((s) => (s + dir + SLIDES.length) % SLIDES.length);

  return (
    <div style={{ fontFamily: "'Open Sans','Lato',sans-serif", background: "#fff", color: NAVY, zoom: fontScale }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&family=Open+Sans:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; cursor: default; pointer-events: none; }
        @keyframes chatPulse { 0%{box-shadow:0 0 0 0 rgba(217,31,44,.5)} 70%{box-shadow:0 0 0 16px rgba(217,31,44,0)} 100%{box-shadow:0 0 0 0 rgba(217,31,44,0)} }
        .chat-fab { animation: chatPulse 2s infinite; }
        .chat-fab:hover { transform: scale(1.08); animation: none; box-shadow: 0 8px 32px rgba(217,31,44,.4); }
        .chat-popup { position: fixed; bottom: 100px; right: 24px; width: 440px; height: 82vh; max-height: 800px; background: #fff; border-radius: 20px; box-shadow: 0 20px 60px rgba(9,46,79,.28); overflow: hidden; z-index: 1000; display: flex; flex-direction: column; transition: all .3s cubic-bezier(.34,1.56,.64,1); }
        .chat-popup.closed { transform: scale(.8) translateY(40px); opacity: 0; pointer-events: none; }
        .chat-popup.open { transform: scale(1) translateY(0); opacity: 1; }
        .pcard { transition: box-shadow .2s, transform .2s; }
        .pcard:hover { box-shadow: 0 14px 34px rgba(9,46,79,.14); transform: translateY(-3px); }
        .navtab:hover { color: ${RED} !important; }
        .dot { transition: all .25s; }
      `}</style>

      {/* ACCESSIBILITY BAR */}
      <div style={{ background: NAVY, color: "#cddae6", fontSize: 12, padding: "4px 40px", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 12 }}>
        <span style={{ opacity: .8 }}>Text size</span>
        <button onClick={() => setFontScale(0.9)} title="Smaller text" style={aBtn(fontScale === 0.9)}><FontAwesomeIcon icon={faMinus} style={{ fontSize: 9 }} /> A</button>
        <button onClick={() => setFontScale(1)} title="Default text" style={aBtn(fontScale === 1)}>A</button>
        <button onClick={() => setFontScale(1.12)} title="Larger text" style={aBtn(fontScale === 1.12)}><FontAwesomeIcon icon={faPlus} style={{ fontSize: 9 }} /> A</button>
      </div>

      {/* STICKY HEADER */}
      <header style={{ background: "#fff", borderBottom: `1px solid ${LINE}`, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px rgba(9,46,79,.06)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 40px", maxWidth: 1364, margin: "0 auto" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <BandhanLogo size={44} id="bbHeader" />
            <div>
              <div style={{ fontFamily: "'Lato',sans-serif", fontSize: 19, fontWeight: 900, color: NAVY, lineHeight: 1 }}>Bandhan Bank</div>
              <div style={{ fontSize: 9.5, color: RED, letterSpacing: 1.5, fontWeight: 700, marginTop: 3 }}>AAPKA BHALA, SABKI BHALAI</div>
            </div>
          </div>
          {/* Primary nav */}
          <nav style={{ display: "flex", gap: 30, fontSize: 15, fontWeight: 700 }}>
            {["Home", "Personal", "Business", "NRI", "Rewards"].map((n) => (
              <span key={n} className="navtab" style={{ cursor: "default", padding: "6px 0", borderBottom: n === "Home" ? `3px solid ${RED}` : "3px solid transparent", color: n === "Home" ? RED : NAVY }}>{n}</span>
            ))}
          </nav>
          {/* Utility strip */}
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <span title="Branch / ATM locator" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: NAVY2, fontWeight: 600 }}>
              <FontAwesomeIcon icon={faLocationDot} style={{ color: RED }} />
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: NAVY2, fontWeight: 600 }}>
              <FontAwesomeIcon icon={faPhone} style={{ color: RED }} /> Reach us
            </span>
            <div style={{ position: "relative" }}>
              <button onClick={() => setPayOpen((o) => !o)} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: NAVY, fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                Pay <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: 10 }} />
              </button>
              {payOpen && (
                <div style={{ position: "absolute", top: "160%", right: 0, background: "#fff", border: `1px solid ${LINE}`, borderRadius: 10, boxShadow: "0 10px 30px rgba(9,46,79,.15)", padding: 8, width: 180, zIndex: 120 }}>
                  {["Pay bills", "Fund transfer", "UPI / QR", "Recharge"].map((p) => (
                    <div key={p} style={{ padding: "9px 12px", fontSize: 13.5, color: NAVY2, borderRadius: 7, fontWeight: 600 }}>{p}</div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ background: RED, color: "#fff", borderRadius: 7, padding: "10px 22px", fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 12px rgba(217,31,44,.3)" }}>
              <FontAwesomeIcon icon={faRightToBracket} /> Login
            </div>
          </div>
        </div>
      </header>

      {/* HERO CAROUSEL */}
      <section style={{ background: GREY, padding: "0 0 8px" }}>
        <div style={{ position: "relative", maxWidth: 1364, margin: "0 auto", overflow: "hidden", borderRadius: 0 }}>
          <div style={{ display: "flex", transform: `translateX(-${slide * 100}%)`, transition: "transform .6s cubic-bezier(.4,0,.2,1)" }}>
            {SLIDES.map((s, i) => (
              <div key={i} style={{ minWidth: "100%", position: "relative", background: s.grad, aspectRatio: "1364 / 599", display: "flex", alignItems: "center" }}>
                <div style={{ position: "absolute", inset: 0, opacity: .1, backgroundImage: "radial-gradient(circle at 18% 40%, #fff 1.5px, transparent 1.5px), radial-gradient(circle at 82% 70%, #fff 1.5px, transparent 1.5px)", backgroundSize: "46px 46px" }} />
                <div style={{ padding: "0 clamp(28px,6vw,84px)", zIndex: 1, maxWidth: 640 }}>
                  <div style={{ display: "inline-block", background: "rgba(255,255,255,.16)", color: "#fff", borderRadius: 5, padding: "5px 12px", fontSize: "clamp(10px,1vw,12px)", fontWeight: 800, letterSpacing: 1.5, marginBottom: "clamp(10px,1.5vw,18px)" }}>{s.eyebrow}</div>
                  <h1 style={{ fontFamily: "'Lato',sans-serif", fontSize: "clamp(24px,3.6vw,48px)", fontWeight: 900, color: "#fff", lineHeight: 1.12, marginBottom: "clamp(8px,1.4vw,16px)" }}>{s.title}</h1>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: "clamp(8px,1.2vw,14px)" }}>
                    <span style={{ fontFamily: "'Lato',sans-serif", fontSize: "clamp(30px,5vw,66px)", fontWeight: 900, color: "#fff" }}>{s.big}</span>
                    <span style={{ color: "rgba(255,255,255,.9)", fontSize: "clamp(12px,1.3vw,17px)", fontWeight: 600 }}>{s.unit}</span>
                  </div>
                  <p style={{ color: "rgba(255,255,255,.85)", fontSize: "clamp(12px,1.25vw,16px)", lineHeight: 1.55, marginBottom: "clamp(14px,2vw,26px)", maxWidth: 440 }}>{s.sub}</p>
                  <div style={{ background: "#fff", color: RED, borderRadius: 7, padding: "clamp(9px,1.2vw,13px) clamp(18px,2.4vw,30px)", fontWeight: 800, fontSize: "clamp(12px,1.2vw,15px)", display: "inline-flex", alignItems: "center", gap: 9 }}>
                    {s.cta} <FontAwesomeIcon icon={faArrowRight} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Arrows */}
          <button onClick={() => go(-1)} aria-label="Previous slide" style={arrowBtn("left")}><FontAwesomeIcon icon={faChevronLeft} /></button>
          <button onClick={() => go(1)} aria-label="Next slide" style={arrowBtn("right")}><FontAwesomeIcon icon={faChevronRight} /></button>
          {/* Dots */}
          <div style={{ position: "absolute", bottom: 18, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 9, zIndex: 2 }}>
            {SLIDES.map((_, i) => (
              <button key={i} className="dot" onClick={() => setSlide(i)} aria-label={`Slide ${i + 1}`}
                style={{ width: i === slide ? 26 : 9, height: 9, borderRadius: 9, border: "none", background: i === slide ? "#fff" : "rgba(255,255,255,.5)", cursor: "pointer" }} />
            ))}
          </div>
        </div>
      </section>

      {/* STICKY RIGHT-EDGE RIBBON */}
      <button
        onClick={() => setChatOpen(true)}
        style={{
          position: "fixed", right: 0, top: "42%", transform: "translateY(-50%)", zIndex: 900,
          background: RED, color: "#fff", border: "none", cursor: "pointer",
          padding: "18px 11px", borderRadius: "10px 0 0 10px", fontWeight: 800, fontSize: 13,
          letterSpacing: .5, writingMode: "vertical-rl", boxShadow: "-4px 4px 16px rgba(9,46,79,.25)",
        }}
        title="Be our customer!"
      >
        Be our customer!
      </button>

      {/* PRODUCT SECTIONS */}
      {SECTIONS.map((sec, si) => (
        <section key={sec.eyebrow} style={{ background: si % 2 === 0 ? "#fff" : GREY, padding: "64px 40px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ fontStyle: "italic", color: RED, fontWeight: 700, fontSize: 16, marginBottom: 8, fontFamily: "'Lato',sans-serif" }}>{sec.eyebrow}</div>
            <h2 style={{ fontFamily: "'Lato',sans-serif", fontSize: "clamp(26px,3.2vw,40px)", fontWeight: 900, color: NAVY, lineHeight: 1.15, marginBottom: 12 }}>
              {sec.heading[0]}<br />{sec.heading[1]}
            </h2>
            <p style={{ color: BODY, fontSize: 16, marginBottom: 36, maxWidth: 620 }}>{sec.sub}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
              {sec.cards.map((card) => (
                <div key={card.title} className="pcard" style={{ background: "#fff", border: `1px solid ${LINE}`, borderRadius: 16, padding: "30px 26px", boxShadow: "0 6px 20px rgba(9,46,79,.06)", display: "flex", flexDirection: "column" }}>
                  <div style={{ width: 58, height: 58, borderRadius: 14, background: GREY, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
                    <FontAwesomeIcon icon={card.icon} style={{ fontSize: 25, color: RED }} />
                  </div>
                  <div style={{ fontFamily: "'Lato',sans-serif", fontSize: 19, fontWeight: 800, color: NAVY, marginBottom: 9 }}>{card.title}</div>
                  <div style={{ fontSize: 14.5, color: BODY, lineHeight: 1.6, marginBottom: 22, flex: 1 }}>{card.desc}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                    <div style={{ background: RED, color: "#fff", borderRadius: 7, padding: "10px 20px", fontWeight: 800, fontSize: 13.5 }}>{card.cta}</div>
                    <span style={{ color: NAVY, fontWeight: 700, fontSize: 13.5, display: "inline-flex", alignItems: "center", gap: 7 }}>
                      Learn more <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: 11, color: RED }} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* FOOTER */}
      <footer style={{ background: NAVY, color: "#b6c6d6", padding: "52px 40px 0", fontFamily: "'Open Sans',sans-serif" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr 1fr", gap: 34, paddingBottom: 40 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <BandhanLogo size={40} id="bbFooter" />
                <div style={{ fontFamily: "'Lato',sans-serif", fontSize: 17, fontWeight: 900, color: "#fff" }}>Bandhan Bank</div>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.7, color: "#8ea4b8", marginBottom: 18 }}>DN-32, Sector V, Salt Lake City,<br />Kolkata – 700091, West Bengal, India</p>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
                <FontAwesomeIcon icon={faWhatsapp} style={{ color: "#25D366", fontSize: 18 }} />
                <span style={{ fontSize: 13.5, color: "#fff", fontWeight: 700 }}>WhatsApp Banking · 90510 90000</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <FontAwesomeIcon icon={faPhone} style={{ color: RED, fontSize: 15 }} />
                <span style={{ fontSize: 13.5, color: "#fff", fontWeight: 700 }}>1800 258 8181 · 24×7 Toll-Free</span>
              </div>
              <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
                {[faFacebookF, faXTwitter, faYoutube, faLinkedinIn, faInstagram].map((icon, i) => (
                  <div key={i} style={{ width: 33, height: 33, borderRadius: "50%", background: NAVY2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <FontAwesomeIcon icon={icon} style={{ fontSize: 13, color: "#cddae6" }} />
                  </div>
                ))}
              </div>
            </div>
            {[
              { heading: "About", links: ["Our Story", "Leadership", "Philosophy", "Awards", "CSR"] },
              { heading: "Investors", links: ["Annual Reports", "Financial Results", "Governance", "Shareholding", "Ratings"] },
              { heading: "Media", links: ["Press Releases", "News", "Photo Gallery", "Videos", "Blog"] },
              { heading: "Reach Us", links: ["Branch Locator", "Contact", "Grievance", "FAQs", "Feedback"] },
            ].map((col) => (
              <div key={col.heading}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "#fff", fontWeight: 800, fontSize: 14, marginBottom: 15, fontFamily: "'Lato',sans-serif" }}>
                  {col.heading}<FontAwesomeIcon icon={faChevronDown} style={{ fontSize: 10, opacity: .5 }} />
                </div>
                {col.links.map((l) => <div key={l} style={{ fontSize: 13, color: "#8ea4b8", marginBottom: 10, lineHeight: 1.4 }}>{l}</div>)}
              </div>
            ))}
          </div>
          {/* App badges */}
          <div style={{ display: "flex", gap: 12, alignItems: "center", paddingBottom: 26, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: "#8ea4b8", fontWeight: 600 }}>Get the mBandhan app:</span>
            {[[faApple, "App Store"], [faGooglePlay, "Google Play"]].map(([icon, label]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 9, background: "#000", border: "1px solid #2c4257", borderRadius: 8, padding: "7px 16px" }}>
                <FontAwesomeIcon icon={icon} style={{ fontSize: 20, color: "#fff" }} />
                <span style={{ fontSize: 13, color: "#fff", fontWeight: 700 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Dark legal strip */}
        <div style={{ background: "#061F36", margin: "0 -40px", padding: "18px 40px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div style={{ fontSize: 12, color: "#6f8598" }}>© 2026 Bandhan Bank Limited. All rights reserved. DICGC Member Bank.</div>
            <div style={{ display: "flex", gap: 20, fontSize: 12, color: "#6f8598" }}>
              <span>Privacy Policy</span><span>Terms of Use</span><span>Accessibility</span><span>Sitemap</span>
            </div>
          </div>
        </div>
      </footer>

      {/* FLOATING CHAT BUTTON */}
      <button
        className="chat-fab"
        onClick={() => setChatOpen((o) => !o)}
        style={{ position: "fixed", bottom: 28, right: 28, width: 64, height: 64, borderRadius: "50%", background: RED, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, transition: "transform .2s, box-shadow .2s" }}
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

// ---- small style helpers ----
const aBtn = (active) => ({
  display: "inline-flex", alignItems: "center", gap: 2, background: active ? RED : "transparent",
  color: "#fff", border: `1px solid ${active ? RED : "rgba(255,255,255,.3)"}`, borderRadius: 5,
  padding: "2px 8px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", lineHeight: 1.4,
});
const arrowBtn = (side) => ({
  position: "absolute", top: "50%", [side]: 16, transform: "translateY(-50%)",
  width: 40, height: 40, borderRadius: "50%", border: "none", background: "rgba(255,255,255,.85)",
  color: NAVY, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: 15, zIndex: 2, boxShadow: "0 3px 12px rgba(9,46,79,.2)",
});
