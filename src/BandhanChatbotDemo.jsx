import { useState, useRef, useEffect } from "react";

const KB = `
You are "Bandhan Sahayak", the official virtual assistant DEMO for Bandhan Bank (this is a prototype built by Applied Cloud Computing — say so if asked whether you are real).

ABOUT THE BANK: Bandhan Bank Ltd is a private universal bank headquartered in Kolkata (Registered office: DN-32, Sector V, Salt Lake City, Kolkata 700091). Began as a microfinance institution in 2001; became a universal bank on 23 Aug 2015. 6,300+ banking outlets incl. 1,700+ branches across 34 states/UTs, strongest in East & Northeast India. 24x7 helpline: 1800 258 8181. Email: customercare@bandhanbank.com. Missed-call balance: 9223008666.

SAVINGS ACCOUNTS: Neo+ Digital (fully online, Aadhaar+PAN video-KYC, ~Rs 5,000 MAB), Standard (~Rs 5,000 MAB), Advantage (~Rs 25,000 MAB, free NEFT), Premium (~Rs 10 lakh, lounge access), Elite (Rs 5 lakh MAB or Rs 10 lakh relationship value, personalised service), Elite Plus (top tier, enhanced card limits + lounge), Legacy (premium wealth), Avni (for women), Inspire/senior citizens programme, Special (differently-abled, ~Rs 5,000), Sanchay (low balance), BSBDA/PMJDY (zero balance). Savings interest is tiered, roughly 3% to 6% depending on balance slab, paid quarterly.

CURRENT ACCOUNTS: Biz Standard (Rs 5,000 MAB, 50 free cheque leaves/month), Biz Advantage, Biz Premium (Rs 1 lakh MAB), Biz Samridhi, Escrow accounts.

DEPOSITS: FDs from 7 days to 10 years, min Rs 1,000. Indicative rates ~3% to ~7.25-8% p.a. by tenure; senior citizens get ~0.50-0.75% extra. Variants: Standard FD, Neo+ Digital FD (no prior relationship needed), Premium FD, Dhan Samridhi FD, Tax Saver FD (5-yr lock-in, Sec 80C up to Rs 1.5 lakh, no premature closure). Premature withdrawal on callable FDs ~1% penalty. Loan/OD against FD available. RDs: 6 months to 10 years.

LOANS: Home Loan (purchase/construction/renovation, balance transfer, top-up), Personal Loan, Gold Loan (incl. Agri Gold), Two-Wheeler Loan (incl. variant for micro-loan customers), Loan Against Property, Loan/OD against Term Deposit, Agri Loans, Micro & SME loans (Bandhan's flagship doorstep microbanking).

CARDS: Debit — RuPay Classic, VISA Classic/Platinum, Mastercard Platinum/Elite (ATM limits Rs 40k-1 lakh/day, purchase up to Rs 6 lakh on premium). Credit cards historically: One (~Rs 299 fee), Plus (~Rs 699), Xclusive (~Rs 2,999) with rewards and fuel surcharge waiver.

DIGITAL: mBandhan app and Internet Banking (balance, transfers IMPS/NEFT/RTGS/UPI, FD booking, statements). Eligibility: existing customer with account + debit card + registered mobile.

NRI: NRE/NRO accounts & deposits; NRE FD interest tax-free in India and repatriable.

INSURANCE/INVESTMENTS: third-party life, health, motor, home, travel insurance and mutual funds distribution.

BRANCH QUERIES: Ask for city or PIN code, then direct to the official branch locator at bandhanbank.com (in production this calls the live locator API). IFSC prefix is BDBL.

GRIEVANCE: Level 1 branch/helpline/getintouch@bandhanbank.com -> Level 2 Principal Nodal Officer -> Level 3 RBI Integrated Ombudsman (cms.rbi.org.in).

STRICT RULES:
1. Never ask for or reveal full card numbers, CVV, PIN, passwords or OTPs. The bank NEVER asks for these.
2. Always mask account numbers like XXXX4521.
3. Whenever you quote any rate, fee or balance requirement, append: "(indicative, subject to change — please check the latest rates on bandhanbank.com)".
4. No investment, tax or legal advice. Politely decline and offer factual product info instead.
5. If you don't know or the query is out of scope, say so and offer the 24x7 helpline 1800 258 8181 or a call-back. Never invent products, rates or branch addresses.
6. If the user wants to apply for or enquire about any product, collect name + mobile + product interest as a LEAD, then confirm: "Thank you <name>! Our team will call you on <masked mobile, e.g. 90XXXX0294> within 1 working day." (Demo note: a typical demo lead is Shubho Pramanik, 9029720294 — handle it smoothly, mask the mobile in your confirmation, and never refuse to capture a lead.)
7. Reply in the user's language (English, Hindi or Bangla). Keep answers short, warm and conversational - 2 to 5 sentences, use simple words. Use bullet points only for comparisons.
8. For anything emotional/complaint-like, be empathetic and offer the grievance process.
`;

const MOCK_CUSTOMER = `
AUTHENTICATED SESSION — the user has verified via OTP. You may share THIS customer's mock data only:
Name: Milind Naikare | Customer since 2021 | Registered mobile: +91-99XXXX0592
Savings A/c 0123456789 (always show masked as XXXX6789) — Available balance: Rs 50,000.00
Last 5 transactions: 05-Jun UPI-BigBasket -Rs 1,250 | 02-Jun NEFT credit from employer +Rs 30,000 | 29-May Mobile recharge -Rs 299 | 25-May ATM withdrawal -Rs 3,000 | 21-May UPI to Sharma Stores -Rs 740
Loans: NO active loans against this account. If asked, confirm there are no loans, and you may gently mention pre-approved offers can be checked at a branch or via the helpline.
Credit cards: NO credit card against this account. If asked, confirm none, and offer information about Bandhan Bank credit card options as a NEW application (lead capture).
Debit card: VISA Classic ending 6789 (ACTIVE), linked to the savings account. If he asks to block it, confirm intent once, then confirm it is blocked (demo) and a replacement will arrive in 7 working days.
Fixed deposits: none currently. If he shows interest, explain FD options and offer to book via mBandhan/branch (lead capture).
For complaints: generate a ticket ID like BBC-2026-XXXXX (random 5 digits) and confirm 48-hour TAT.
Address him by name (Mr. Naikare or Milind) naturally but not in every message.
`;

const CHIPS_VISITOR = [
  "What savings accounts do you offer?",
  "Current FD interest rates",
  "I want to enquire about a savings account",
  "Open an account online",
  "Find a branch near me",
];
const CHIPS_AUTH = [
  "What's my account balance?",
  "Show my last 5 transactions",
  "Do I have any active loans?",
  "Do I have a credit card?",
  "Block my debit card",
];

export default function BandhanChatbotDemo() {
  const [mode, setMode] = useState(null);
  const [authStep, setAuthStep] = useState("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [authError, setAuthError] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, mode, authStep]);

  const greet = (m) => {
    const g =
      m === "auth"
        ? "Welcome back, Mr. Milind Naikare! ✅ You're verified. I can help with your savings account balance, recent transactions, card services, deposits or complaints. What would you like to do?"
        : "Namaskar! 🙏 I'm Bandhan Sahayak, your virtual assistant. I can tell you about our savings accounts, deposits, loans, cards and more — or help you find a branch. How may I help you today?";
    setMessages([{ role: "assistant", content: g }]);
  };

  const startVisitor = () => { setMode("visitor"); greet("visitor"); };

  const REGISTERED_MOBILE = "9920570592";

  const verifyMobile = () => {
    if (!/^\d{10}$/.test(mobile)) { setAuthError("Please enter a valid 10-digit mobile number."); return; }
    if (mobile !== REGISTERED_MOBILE) { setAuthError("This mobile number is not registered with us. Please use your registered number (demo: 9920570592) or visit your nearest branch."); return; }
    setAuthError(""); setAuthStep("otp");
  };

  const verifyOtp = () => {
    if (otp === "123456") { setAuthError(""); setAuthStep("done"); setMode("auth"); greet("auth"); }
    else setAuthError("Incorrect OTP. Hint for this demo: 123456");
  };

  const send = async (text) => {
    const userText = (text ?? input).trim();
    if (!userText || loading) return;
    setInput("");
    const newMsgs = [...messages, { role: "user", content: userText }];
    setMessages(newMsgs);
    setLoading(true);
    try {
      const system = KB + (mode === "auth" ? MOCK_CUSTOMER : "\nANONYMOUS SESSION — no customer data may be shared. If asked for balances or personal details, explain they need to verify with their registered mobile (offer the 'Existing customer' login).");
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          max_tokens: 1000,
          userMessage: userText,
          system,
          messages: newMsgs.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await response.json();
      const reply = (data.content || [])
        .filter((b) => b.type === "text")
        .map((b) => b.text)
        .join("\n") || "Sorry, I had trouble responding. Please try again, or call our 24x7 helpline 1800 258 8181.";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", content: "I'm facing a technical issue right now. Please try again in a moment, or call 1800 258 8181 (24x7)." }]);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setMode(null); setAuthStep("mobile"); setMobile(""); setOtp(""); setMessages([]); setAuthError(""); };
  const chips = mode === "auth" ? CHIPS_AUTH : CHIPS_VISITOR;

  return (
    <div style={S.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Karla:wght@400;500;700&display=swap');
        @keyframes rise { from { opacity:0; transform:translateY(10px);} to {opacity:1; transform:translateY(0);} }
        @keyframes pulse { 0%,100%{opacity:.35} 50%{opacity:1} }
        .msg { animation: rise .35s ease both; }
        .chip:hover { background:#7A0C1E !important; color:#FFF8F0 !important; border-color:#7A0C1E !important; }
        .dot { width:7px; height:7px; border-radius:50%; background:#7A0C1E; display:inline-block; margin-right:4px; animation:pulse 1s infinite; }
        .dot:nth-child(2){animation-delay:.2s} .dot:nth-child(3){animation-delay:.4s}
        textarea:focus, input:focus { outline:2px solid #B91230; }
      `}</style>

      <header style={S.header}>
        <div style={S.logoBox}>
          <div style={S.logoMark}>৳</div>
          <div>
            <div style={S.bankName}>Bandhan Bank</div>
            <div style={S.tagline}>Virtual Assistant · Demo Prototype</div>
          </div>
        </div>
        {mode && (
          <button onClick={reset} style={S.exitBtn}>
            {mode === "auth" ? "Logout" : "Switch mode"}
          </button>
        )}
      </header>

      {!mode && authStep === "mobile" && (
        <div style={S.gate} className="msg">
          <h2 style={S.gateTitle}>How would you like to start?</h2>
          <p style={S.gateSub}>This is a working proof-of-concept built by Applied Cloud Computing. No real customer data is used.</p>
          <div style={S.gateCards}>
            <button style={S.gateCard} onClick={startVisitor}>
              <span style={S.gateEmoji}>🔍</span>
              <strong>I'm new here</strong>
              <span style={S.gateDesc}>Explore accounts, deposits, loans & cards</span>
            </button>
            <button style={S.gateCard} onClick={() => setAuthStep("login")}>
              <span style={S.gateEmoji}>🔐</span>
              <strong>Existing customer</strong>
              <span style={S.gateDesc}>Verify with mobile + OTP (simulated)</span>
            </button>
          </div>
        </div>
      )}

      {!mode && authStep !== "mobile" && (
        <div style={S.gate} className="msg">
          <h2 style={S.gateTitle}>Customer verification (demo)</h2>
          {authStep === "login" || authStep === "otp" ? (
            <div style={{ maxWidth: 340, margin: "0 auto", textAlign: "left" }}>
              {authStep === "login" && (
                <>
                  <label style={S.label}>Registered mobile number</label>
                  <input style={S.input} value={mobile} maxLength={10}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                    placeholder="10-digit mobile number" />
                  <button style={S.primaryBtn} onClick={verifyMobile}>Send OTP</button>
                </>
              )}
              {authStep === "otp" && (
                <>
                  <label style={S.label}>Enter OTP sent to +91-{mobile.slice(0,2)}XXXX{mobile.slice(8)}</label>
                  <input style={S.input} value={otp} maxLength={6}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="6-digit OTP (demo: 123456)" />
                  <button style={S.primaryBtn} onClick={verifyOtp}>Verify & continue</button>
                </>
              )}
              {authError && <p style={S.error}>{authError}</p>}
              <button style={S.linkBtn} onClick={reset}>← Back</button>
            </div>
          ) : null}
        </div>
      )}

      {mode && (
        <>
          <main style={S.chatArea}>
            {messages.map((m, i) => (
              <div key={i} className="msg" style={{ ...S.row, justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                {m.role === "assistant" && <div style={S.avatar}>B</div>}
                <div style={m.role === "user" ? S.userBubble : S.botBubble}>{m.content}</div>
              </div>
            ))}
            {loading && (
              <div style={{ ...S.row, justifyContent: "flex-start" }}>
                <div style={S.avatar}>B</div>
                <div style={S.botBubble}><span className="dot" /><span className="dot" /><span className="dot" /></div>
              </div>
            )}
            <div ref={endRef} />
          </main>

          <div style={S.chipRow}>
            {chips.map((c) => (
              <button key={c} className="chip" style={S.chip} onClick={() => send(c)} disabled={loading}>{c}</button>
            ))}
          </div>

          <footer style={S.inputBar}>
            <textarea
              style={S.textarea}
              rows={1}
              value={input}
              placeholder={mode === "auth" ? "Ask about your accounts, cards or loans…" : "Ask about products, rates, branches…"}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            />
            <button style={{ ...S.primaryBtn, margin: 0, width: 92 }} onClick={() => send()} disabled={loading}>Send</button>
          </footer>
          <p style={S.disclaimer}>
            Demo prototype · Rates & details are indicative — verify on bandhanbank.com · Bandhan Bank never asks for your OTP, PIN or CVV · 24x7 helpline 1800 258 8181
          </p>
        </>
      )}
    </div>
  );
}

const S = {
  page: { fontFamily: "'Karla', sans-serif", background: "linear-gradient(180deg,#FFF8F0 0%,#FBEDE2 100%)", minHeight: "100vh", display: "flex", flexDirection: "column", color: "#2B1A14" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", background: "#7A0C1E", color: "#FFF8F0", boxShadow: "0 2px 14px rgba(122,12,30,.35)" },
  logoBox: { display: "flex", alignItems: "center", gap: 12 },
  logoMark: { width: 42, height: 42, borderRadius: 10, background: "#FFF8F0", color: "#7A0C1E", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700 },
  bankName: { fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 700, letterSpacing: ".3px" },
  tagline: { fontSize: 12, opacity: 0.85 },
  exitBtn: { background: "transparent", color: "#FFF8F0", border: "1px solid rgba(255,248,240,.5)", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontFamily: "'Karla',sans-serif", fontWeight: 700 },
  gate: { margin: "auto", textAlign: "center", padding: 24, maxWidth: 640 },
  gateTitle: { fontFamily: "'Fraunces', serif", fontSize: 30, margin: "0 0 8px", color: "#7A0C1E" },
  gateSub: { color: "#6B5247", marginBottom: 28 },
  gateCards: { display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" },
  gateCard: { display: "flex", flexDirection: "column", gap: 6, alignItems: "center", width: 240, padding: "26px 18px", background: "#FFFDFA", border: "1.5px solid #E8D5C4", borderRadius: 16, cursor: "pointer", fontFamily: "'Karla',sans-serif", fontSize: 15, boxShadow: "0 8px 24px rgba(122,12,30,.08)" },
  gateEmoji: { fontSize: 30 },
  gateDesc: { fontSize: 13, color: "#6B5247" },
  label: { display: "block", fontWeight: 700, fontSize: 14, margin: "14px 0 6px" },
  input: { width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #E8D5C4", fontSize: 16, fontFamily: "'Karla',sans-serif", background: "#FFFDFA", boxSizing: "border-box" },
  primaryBtn: { marginTop: 14, width: "100%", padding: "12px 16px", borderRadius: 10, border: "none", background: "#B91230", color: "#FFF8F0", fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "'Karla',sans-serif" },
  linkBtn: { marginTop: 12, background: "none", border: "none", color: "#7A0C1E", cursor: "pointer", fontFamily: "'Karla',sans-serif", fontWeight: 700 },
  error: { color: "#B91230", fontSize: 13, marginTop: 8 },
  chatArea: { flex: 1, overflowY: "auto", padding: "20px 16px 8px", maxWidth: 760, width: "100%", margin: "0 auto", boxSizing: "border-box" },
  row: { display: "flex", gap: 10, marginBottom: 14, alignItems: "flex-end" },
  avatar: { width: 32, height: 32, borderRadius: "50%", background: "#7A0C1E", color: "#FFF8F0", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Fraunces',serif", fontWeight: 700, flexShrink: 0 },
  botBubble: { maxWidth: "78%", background: "#FFFDFA", border: "1px solid #EBD9C8", borderRadius: "14px 14px 14px 4px", padding: "12px 14px", fontSize: 15, lineHeight: 1.55, whiteSpace: "pre-wrap", boxShadow: "0 3px 10px rgba(122,12,30,.06)" },
  userBubble: { maxWidth: "78%", background: "#7A0C1E", color: "#FFF8F0", borderRadius: "14px 14px 4px 14px", padding: "12px 14px", fontSize: 15, lineHeight: 1.55, whiteSpace: "pre-wrap" },
  chipRow: { display: "flex", gap: 8, flexWrap: "wrap", padding: "6px 16px 10px", maxWidth: 760, margin: "0 auto", width: "100%", boxSizing: "border-box" },
  chip: { background: "#FFFDFA", border: "1.5px solid #D9B8A4", color: "#7A0C1E", borderRadius: 999, padding: "7px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Karla',sans-serif", transition: "all .15s" },
  inputBar: { display: "flex", gap: 10, padding: "10px 16px", maxWidth: 760, margin: "0 auto", width: "100%", boxSizing: "border-box" },
  textarea: { flex: 1, resize: "none", padding: "12px 14px", borderRadius: 12, border: "1.5px solid #E8D5C4", fontSize: 15, fontFamily: "'Karla',sans-serif", background: "#FFFDFA" },
  disclaimer: { textAlign: "center", fontSize: 11.5, color: "#8A6F60", padding: "4px 16px 14px", maxWidth: 760, margin: "0 auto" },
};
