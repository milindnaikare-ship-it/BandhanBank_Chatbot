import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft, faXmark, faCircleCheck, faTriangleExclamation, faLock,
  faCreditCard, faUserShield, faUsers, faMoneyBillTransfer, faPiggyBank, faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import {
  DEMO_OTP, MAX_OTP_ATTEMPTS, CHAT_TXN_LIMIT, BENEFICIARY_COOLING_MS, MAX_BENEFICIARIES,
  CUSTOMER, RELATIONSHIPS, TRANSFER_MODES,
  initialAccounts, initialCards, initialNominee, initialBeneficiaries,
  pennyDropName, FD_RATE_CARD, RD_RATE_CARD, SENIOR_EXTRA, FD_MIN, FD_MAX, RD_MIN, RD_MAX,
  maskAcct, maskCard, inr, isMinor, isSenior, refNo, validIfsc, ifscLookup,
  validatePin, suggestMode, fdMaturity, fdPayout, rdMaturity, addMonths, fmtDate,
} from "./mockBank";

// ===========================================================================
// Shared UI primitives
// ===========================================================================
const C = { maroon: "#7A0C1E", accent: "#B91230", cream: "#FFF8F0", card: "#FFFDFA", border: "#E8D5C4", line: "#EBD9C8", text: "#2B1A14", muted: "#6B5247", ok: "#1B7A3D", warn: "#B26A00" };

const bs = {
  overlay: { position: "absolute", inset: 0, background: "rgba(43,26,20,.45)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 40 },
  sheet: { background: C.cream, width: "100%", maxWidth: 560, maxHeight: "92%", borderTopLeftRadius: 18, borderTopRightRadius: 18, display: "flex", flexDirection: "column", boxShadow: "0 -8px 30px rgba(122,12,30,.25)", overflow: "hidden" },
  head: { display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", background: C.maroon, color: C.cream },
  headTitle: { fontWeight: 700, fontSize: 16, flex: 1 },
  iconBtn: { background: "transparent", border: "none", color: C.cream, cursor: "pointer", fontSize: 18, padding: 4 },
  body: { padding: 16, overflowY: "auto" },
  menuGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  menuCard: { display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start", padding: "16px 14px", background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 14, cursor: "pointer", textAlign: "left", boxShadow: "0 6px 16px rgba(122,12,30,.06)" },
  menuEmoji: { width: 38, height: 38, borderRadius: 10, background: "#FBEDE2", color: C.maroon, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 },
  menuTitle: { fontWeight: 700, fontSize: 14.5, color: C.text },
  menuDesc: { fontSize: 12, color: C.muted, lineHeight: 1.4 },
  label: { display: "block", fontSize: 12.5, fontWeight: 600, color: C.muted, margin: "12px 0 5px" },
  input: { width: "100%", boxSizing: "border-box", padding: "10px 12px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, background: "#fff", color: C.text },
  select: { width: "100%", boxSizing: "border-box", padding: "10px 12px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 14, background: "#fff", color: C.text },
  primary: { width: "100%", marginTop: 16, padding: "12px", background: C.maroon, color: C.cream, border: "none", borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: "pointer" },
  ghost: { width: "100%", marginTop: 8, padding: "11px", background: "transparent", color: C.maroon, border: `1.5px solid ${C.maroon}`, borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: "pointer" },
  rowBtn: { width: "100%", textAlign: "left", padding: "12px 14px", background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 12, cursor: "pointer", marginBottom: 10, display: "flex", alignItems: "center", gap: 12 },
  err: { color: C.accent, fontSize: 12.5, marginTop: 6 },
  notice: { display: "flex", gap: 8, padding: "10px 12px", borderRadius: 10, fontSize: 13, lineHeight: 1.45, marginTop: 12 },
  sumCard: { background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "6px 14px", marginTop: 12 },
  sumRow: { display: "flex", justifyContent: "space-between", gap: 12, padding: "9px 0", borderBottom: `1px solid ${C.line}`, fontSize: 13.5 },
  sumKey: { color: C.muted },
  sumVal: { color: C.text, fontWeight: 600, textAlign: "right" },
  pill: (bg, fg) => ({ display: "inline-block", padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: bg, color: fg }),
  secure: { width: "100%", boxSizing: "border-box", padding: "12px", border: `1.5px solid ${C.border}`, borderRadius: 10, fontSize: 22, letterSpacing: 8, textAlign: "center", background: "#fff" },
  checkRow: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 },
  chk: (on) => ({ padding: "7px 12px", borderRadius: 20, border: `1.5px solid ${on ? C.maroon : C.border}`, background: on ? C.maroon : "#fff", color: on ? C.cream : C.text, cursor: "pointer", fontSize: 13, fontWeight: 600 }),
};

const Notice = ({ kind = "info", children }) => {
  const map = { info: ["#EEF6FF", "#1E4E8C"], warn: ["#FFF6E8", C.warn], ok: ["#EAF7EF", C.ok], err: ["#FDEEF0", C.accent] };
  const [bg, fg] = map[kind] || map.info;
  const icon = kind === "ok" ? faCircleCheck : kind === "err" ? faTriangleExclamation : faTriangleExclamation;
  return <div style={{ ...bs.notice, background: bg, color: fg }}><FontAwesomeIcon icon={icon} style={{ marginTop: 2 }} /><div>{children}</div></div>;
};

const SummaryCard = ({ rows }) => (
  <div style={bs.sumCard}>
    {rows.filter(Boolean).map(([k, v], i) => (
      <div key={i} style={{ ...bs.sumRow, ...(i === rows.filter(Boolean).length - 1 ? { borderBottom: "none" } : {}) }}>
        <span style={bs.sumKey}>{k}</span><span style={bs.sumVal}>{v}</span>
      </div>
    ))}
  </div>
);

const Field = ({ label, error, children }) => (
  <div>
    <label style={bs.label}>{label}</label>
    {children}
    {error && <div style={bs.err}>{error}</div>}
  </div>
);

// Secure masked entry for PIN/OTP — value lives only here, never logged or
// passed up to the chat transcript.
const SecureInput = ({ len, value, onChange, autoFocus }) => (
  <input
    type="password" inputMode="numeric" autoComplete="one-time-code"
    maxLength={len} value={value} autoFocus={autoFocus}
    onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, len))}
    style={bs.secure}
  />
);

// Reusable OTP step: enforces max attempts then locks (brief §2 step-up auth).
const OtpGate = ({ purpose, onVerified, onCancel }) => {
  const [otp, setOtp] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState("");
  const [locked, setLocked] = useState(false);

  if (locked) {
    return (
      <div style={{ textAlign: "center", padding: "10px 0" }}>
        <FontAwesomeIcon icon={faLock} style={{ fontSize: 34, color: C.accent }} />
        <p style={{ fontWeight: 700, marginTop: 12 }}>Flow locked for your security</p>
        <p style={{ color: C.muted, fontSize: 13 }}>Too many incorrect OTP attempts. Please try again later or call our 24x7 helpline <strong>1800 258 8181</strong>.</p>
        <button style={bs.primary} onClick={onCancel}>Close</button>
      </div>
    );
  }
  const submit = () => {
    if (otp.length !== 6) { setError("Enter the 6-digit OTP."); return; }
    if (otp === DEMO_OTP) { onVerified(); return; }
    const n = attempts + 1;
    setAttempts(n); setOtp("");
    if (n >= MAX_OTP_ATTEMPTS) setLocked(true);
    else setError(`Incorrect OTP. ${MAX_OTP_ATTEMPTS - n} attempt(s) left. (Demo OTP: 123456)`);
  };
  return (
    <div>
      <Notice kind="info">A one-time password has been sent to your registered mobile {CUSTOMER.mobileMasked} to authorise <strong>{purpose}</strong>. <em>(Demo OTP: 123456)</em></Notice>
      <label style={bs.label}>Enter OTP</label>
      <SecureInput len={6} value={otp} onChange={setOtp} autoFocus />
      {error && <div style={bs.err}>{error}</div>}
      <button style={bs.primary} onClick={submit}>Verify &amp; proceed</button>
      <button style={bs.ghost} onClick={onCancel}>Cancel</button>
    </div>
  );
};

const Success = ({ title, refId: reference, rows, note, onDone }) => (
  <div>
    <div style={{ textAlign: "center", padding: "6px 0 2px" }}>
      <FontAwesomeIcon icon={faCircleCheck} style={{ fontSize: 44, color: C.ok }} />
      <p style={{ fontWeight: 700, fontSize: 17, marginTop: 10 }}>{title}</p>
      {reference && <p style={{ color: C.muted, fontSize: 13 }}>Reference: <strong style={{ color: C.text }}>{reference}</strong></p>}
    </div>
    {rows && <SummaryCard rows={rows} />}
    {note && <Notice kind="warn">{note}</Notice>}
    <button style={bs.primary} onClick={onDone}>Done</button>
  </div>
);

const FlowHeader = ({ title, onBack, onClose }) => (
  <div style={bs.head}>
    {onBack && <button style={bs.iconBtn} onClick={onBack} aria-label="Back"><FontAwesomeIcon icon={faArrowLeft} /></button>}
    <span style={bs.headTitle}>{title}</span>
    <button style={bs.iconBtn} onClick={onClose} aria-label="Close"><FontAwesomeIcon icon={faXmark} /></button>
  </div>
);

// A live clock so beneficiary cooling status updates without a manual refresh.
// Date.now() in a render body is impure; snapshot it once and tick via interval.
const useNow = (ms = 20000) => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), ms);
    return () => clearInterval(id);
  }, [ms]);
  return now;
};

const statusPill = (status) => {
  if (status === "active") return <span style={bs.pill("#EAF7EF", C.ok)}>Active</span>;
  if (status === "cooling") return <span style={bs.pill("#FFF6E8", C.warn)}>Cooling</span>;
  return <span style={bs.pill("#F0E7E0", C.muted)}>Inactive</span>;
};

// ===========================================================================
// Feature 1 — Set / Reset Debit Card PIN
// ===========================================================================
function PinFlow({ cards, onClose, onComplete }) {
  const [step, setStep] = useState("select");
  const [card, setCard] = useState(null);
  const [expiry, setExpiry] = useState("");
  const [expErr, setExpErr] = useState("");
  const [pin, setPin] = useState("");
  const [pin2, setPin2] = useState("");
  const [pinErr, setPinErr] = useState("");
  const [reference, setReference] = useState("");

  const pick = (c) => {
    if (c.status !== "ACTIVE") return;
    setCard(c); setStep("expiry");
  };
  const checkExpiry = () => {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) { setExpErr("Enter expiry as MM/YY."); return; }
    if (expiry !== card.expiry) { setExpErr("Card expiry does not match our records."); return; }
    setExpErr(""); setStep("otp");
  };
  const setNewPin = () => {
    const e = validatePin(pin, card.pinLen);
    if (e) { setPinErr(e); return; }
    if (pin !== pin2) { setPinErr("The two PINs do not match."); return; }
    const r = refNo("SRPIN");
    setPinErr(""); setReference(r); setStep("done");
    // NB: pin is never included in the completion message / transcript.
    onComplete(`✅ Debit card PIN updated for card ${maskCard(card.last4)}. Service reference: ${r}`);
  };

  return (
    <>
      <FlowHeader title="Set / Reset Debit Card PIN" onClose={onClose}
        onBack={step === "select" ? null : () => setStep(step === "done" ? "done" : "select")} />
      <div style={bs.body}>
        {step === "select" && (
          <>
            <p style={{ color: C.muted, fontSize: 13, margin: "0 0 12px" }}>Select the debit card you want to set or reset the PIN for.</p>
            {cards.map((c) => {
              const disabled = c.status !== "ACTIVE";
              return (
                <button key={c.id} style={{ ...bs.rowBtn, opacity: disabled ? 0.55 : 1, cursor: disabled ? "not-allowed" : "pointer" }} onClick={() => pick(c)} disabled={disabled}>
                  <FontAwesomeIcon icon={faCreditCard} style={{ color: C.maroon, fontSize: 18 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{c.network}</div>
                    <div style={{ fontSize: 12.5, color: C.muted }}>{maskCard(c.last4)} · Exp {c.expiry}</div>
                  </div>
                  {c.status === "ACTIVE" ? statusPill("active") : <span style={bs.pill("#FDEEF0", C.accent)}>{c.status}</span>}
                </button>
              );
            })}
            <Notice kind="info">Blocked, hotlisted or expired cards cannot have their PIN changed here.</Notice>
          </>
        )}
        {step === "expiry" && (
          <>
            <SummaryCard rows={[["Card", card.network], ["Number", maskCard(card.last4)]]} />
            <Field label="Card expiry (MM/YY) — identity check" error={expErr}>
              <input style={bs.input} value={expiry} placeholder="MM/YY" maxLength={5}
                onChange={(e) => setExpiry(e.target.value.replace(/[^\d/]/g, "").slice(0, 5))} />
            </Field>
            <button style={bs.primary} onClick={checkExpiry}>Continue</button>
          </>
        )}
        {step === "otp" && (
          <OtpGate purpose="your PIN reset" onCancel={onClose} onVerified={() => setStep("setpin")} />
        )}
        {step === "setpin" && (
          <>
            <Notice kind="info">Enter your new {card.pinLen}-digit PIN using the secure keypad. It is never shown in the chat or stored in logs.</Notice>
            <label style={bs.label}>New PIN</label>
            <SecureInput len={card.pinLen} value={pin} onChange={setPin} autoFocus />
            <label style={bs.label}>Confirm new PIN</label>
            <SecureInput len={card.pinLen} value={pin2} onChange={setPin2} />
            {pinErr && <div style={bs.err}>{pinErr}</div>}
            <button style={bs.primary} onClick={setNewPin}>Set PIN</button>
          </>
        )}
        {step === "done" && (
          <Success title="PIN set successfully" refId={reference}
            rows={[["Card", card.network], ["Number", maskCard(card.last4)]]}
            note="For your security the new PIN is effective immediately. If you did not initiate this, call 1800 258 8181." onDone={onClose} />
        )}
      </div>
    </>
  );
}

// ===========================================================================
// Feature 2 — Nominee Addition / Modification
// ===========================================================================
function NomineeFlow({ nominee, setNominee, onClose, onComplete }) {
  const [step, setStep] = useState("view");
  const [form, setForm] = useState(nominee || { name: "", relationship: "", dob: "", address: "", guardian: null });
  const [copyAddr, setCopyAddr] = useState(false);
  const [errors, setErrors] = useState({});
  const [reference, setReference] = useState("");
  const minor = isMinor(form.dob);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setG = (k, v) => setForm((f) => ({ ...f, guardian: { ...(f.guardian || {}), [k]: v } }));

  const validate = () => {
    const e = {};
    if (!form.name.trim() || /\d/.test(form.name)) e.name = "Enter a valid name (letters only).";
    if (!form.relationship) e.relationship = "Select a relationship.";
    if (!form.dob) e.dob = "Enter date of birth.";
    else if (new Date(form.dob) > new Date()) e.dob = "Date of birth cannot be in the future.";
    const addr = copyAddr ? CUSTOMER.address : form.address;
    if (!addr.trim()) e.address = "Enter the nominee's address.";
    if (minor) {
      const g = form.guardian || {};
      if (!g.name?.trim() || /\d/.test(g.name)) e.gname = "Guardian name is required for a minor nominee.";
      if (!g.relationship) e.grel = "Guardian relationship is required.";
      if (!g.address?.trim()) e.gaddr = "Guardian address is required.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const toReview = () => { if (validate()) setStep("review"); };
  const commit = () => {
    const finalForm = { ...form, address: copyAddr ? CUSTOMER.address : form.address, guardian: minor ? form.guardian : null };
    setNominee(finalForm);
    const r = refNo("SRNOM"); setReference(r);
    onComplete(`✅ Nominee ${nominee ? "updated" : "added"}: ${finalForm.name} (${finalForm.relationship}). Reference: ${r}. Pending branch verification.`);
    setStep("done");
  };

  return (
    <>
      <FlowHeader title="Nominee Management" onClose={onClose}
        onBack={step === "view" ? null : () => setStep("view")} />
      <div style={bs.body}>
        {step === "view" && (
          <>
            {nominee ? (
              <>
                <p style={{ color: C.muted, fontSize: 13, margin: "0 0 4px" }}>Current nominee on Savings A/c {maskAcct("6789")}:</p>
                <SummaryCard rows={[
                  ["Name", nominee.name],
                  ["Relationship", nominee.relationship],
                  ["Date of birth", "XX-XX-" + (nominee.dob || "").slice(0, 4)],
                ]} />
              </>
            ) : <Notice kind="warn">No nominee is currently registered on this account. Adding one is strongly recommended.</Notice>}
            <button style={bs.primary} onClick={() => { setForm(nominee || { name: "", relationship: "", dob: "", address: "", guardian: null }); setStep("form"); }}>
              {nominee ? "Modify nominee" : "Add nominee"}
            </button>
            <Notice kind="info">This account supports a single nominee. Nomination changes are registered digitally and confirmed after branch verification.</Notice>
          </>
        )}
        {step === "form" && (
          <>
            <Field label="Nominee full name" error={errors.name}>
              <input style={bs.input} value={form.name} onChange={(e) => set("name", e.target.value)} />
            </Field>
            <Field label="Relationship" error={errors.relationship}>
              <select style={bs.select} value={form.relationship} onChange={(e) => set("relationship", e.target.value)}>
                <option value="">Select…</option>
                {RELATIONSHIPS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </Field>
            <Field label="Date of birth" error={errors.dob}>
              <input type="date" style={bs.input} value={form.dob} onChange={(e) => set("dob", e.target.value)} />
            </Field>
            {minor && <Notice kind="warn">Nominee is a minor — guardian details are mandatory.</Notice>}
            <Field label="Nominee address" error={errors.address}>
              <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, marginBottom: 6, color: C.muted }}>
                <input type="checkbox" checked={copyAddr} onChange={(e) => setCopyAddr(e.target.checked)} />
                Same as account holder's address
              </label>
              {!copyAddr && <textarea style={{ ...bs.input, minHeight: 60 }} value={form.address} onChange={(e) => set("address", e.target.value)} />}
              {copyAddr && <div style={{ fontSize: 13, color: C.text }}>{CUSTOMER.address}</div>}
            </Field>
            {minor && (
              <>
                <Field label="Guardian name" error={errors.gname}>
                  <input style={bs.input} value={form.guardian?.name || ""} onChange={(e) => setG("name", e.target.value)} />
                </Field>
                <Field label="Guardian relationship to nominee" error={errors.grel}>
                  <select style={bs.select} value={form.guardian?.relationship || ""} onChange={(e) => setG("relationship", e.target.value)}>
                    <option value="">Select…</option>
                    {RELATIONSHIPS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </Field>
                <Field label="Guardian address" error={errors.gaddr}>
                  <textarea style={{ ...bs.input, minHeight: 60 }} value={form.guardian?.address || ""} onChange={(e) => setG("address", e.target.value)} />
                </Field>
              </>
            )}
            <button style={bs.primary} onClick={toReview}>Review changes</button>
          </>
        )}
        {step === "review" && (
          <>
            <p style={{ fontWeight: 700, margin: "0 0 8px" }}>Confirm nominee details</p>
            {nominee && (
              <>
                <p style={{ ...bs.label, marginTop: 0 }}>Before</p>
                <SummaryCard rows={[["Name", nominee.name], ["Relationship", nominee.relationship]]} />
                <p style={bs.label}>After</p>
              </>
            )}
            <SummaryCard rows={[
              ["Name", form.name],
              ["Relationship", form.relationship],
              ["Date of birth", fmtDate(new Date(form.dob))],
              ["Address", copyAddr ? CUSTOMER.address : form.address],
              minor && ["Guardian", `${form.guardian?.name} (${form.guardian?.relationship})`],
            ]} />
            <button style={bs.primary} onClick={() => setStep("otp")}>Confirm &amp; get OTP</button>
          </>
        )}
        {step === "otp" && <OtpGate purpose="the nominee update" onCancel={onClose} onVerified={commit} />}
        {step === "done" && (
          <Success title="Nomination request registered" refId={reference}
            note="Your nomination is registered and will be activated after branch verification (typically within 3 working days). You will be notified once confirmed." onDone={onClose} />
        )}
      </div>
    </>
  );
}

// ===========================================================================
// Feature 3 — Manage Beneficiaries
// ===========================================================================
function BeneficiaryFlow({ beneficiaries, setBeneficiaries, onClose, onComplete }) {
  const [step, setStep] = useState("list");
  const [target, setTarget] = useState(null);          // for edit/delete
  const [reference, setReference] = useState("");
  const [activationMsg, setActivationMsg] = useState("");

  const now = useNow();
  const withStatus = beneficiaries.map((b) => ({
    ...b,
    status: b.createdAt && now - b.createdAt < BENEFICIARY_COOLING_MS ? "cooling" : b.status,
  }));

  // ---- Add form state ----
  const [f, setF] = useState({ name: "", acct: "", acct2: "", ifsc: "", nickname: "", limit: "", modes: [] });
  const [fe, setFe] = useState({});
  const [lookup, setLookup] = useState(null);
  const [verifiedName, setVerifiedName] = useState(null);
  const setField = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const toggleMode = (m) => setF((p) => ({ ...p, modes: p.modes.includes(m) ? p.modes.filter((x) => x !== m) : [...p.modes, m] }));

  const doLookup = () => setLookup(ifscLookup(f.ifsc));

  const validateAdd = () => {
    const e = {};
    if (!f.name.trim() || /\d/.test(f.name)) e.name = "Enter a valid beneficiary name.";
    if (!/^\d{9,18}$/.test(f.acct)) e.acct = "Enter a valid account number (9–18 digits).";
    if (f.acct !== f.acct2) e.acct2 = "Account numbers do not match.";
    if (!validIfsc(f.ifsc)) e.ifsc = "Enter a valid IFSC (e.g. HDFC0000123).";
    if (!f.modes.length) e.modes = "Select at least one transfer type.";
    if (f.limit && (!/^\d+$/.test(f.limit) || Number(f.limit) <= 0)) e.limit = "Enter a valid limit amount.";
    if (beneficiaries.some((b) => b.account === f.acct && b.ifsc.toUpperCase() === f.ifsc.toUpperCase())) e.acct = "This beneficiary already exists.";
    if (beneficiaries.length >= MAX_BENEFICIARIES) e.name = `You have reached the maximum of ${MAX_BENEFICIARIES} beneficiaries.`;
    setFe(e);
    return Object.keys(e).length === 0;
  };
  const toSummary = () => { if (validateAdd()) { setLookup(ifscLookup(f.ifsc)); setStep("addSummary"); } };

  const createBeneficiary = () => {
    const created = Date.now();
    const lk = ifscLookup(f.ifsc);
    const b = {
      id: "b" + created, name: f.name.trim(), account: f.acct, last4: f.acct.slice(-4),
      ifsc: f.ifsc.toUpperCase(), bank: lk?.bank || "Partner Bank", branch: lk?.branch || "",
      nickname: f.nickname.trim() || f.name.trim(), modes: f.modes,
      limit: f.limit ? Number(f.limit) : null, status: "cooling", createdAt: created,
    };
    setBeneficiaries((list) => [...list, b]);
    const active = new Date(created + BENEFICIARY_COOLING_MS);
    setActivationMsg(`Active from ${active.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} today. For the first 24 hours transfers to this payee are capped at ₹50,000.`);
    const r = refNo("SRBEN"); setReference(r);
    onComplete(`✅ Beneficiary added: ${b.name} (${b.bank}, ${maskAcct(b.last4)}). Cooling period applies. Reference: ${r}`);
    setStep("addDone");
  };

  const doDelete = () => {
    setBeneficiaries((list) => list.filter((b) => b.id !== target.id));
    const r = refNo("SRBEN"); setReference(r);
    onComplete(`✅ Beneficiary removed: ${target.name} (${maskAcct(target.last4)}). Reference: ${r}`);
    setStep("delDone");
  };

  return (
    <>
      <FlowHeader title="Manage Beneficiaries" onClose={onClose}
        onBack={step === "list" ? null : () => setStep("list")} />
      <div style={bs.body}>
        {step === "list" && (
          <>
            {withStatus.length === 0 && <Notice kind="info">You have no saved beneficiaries yet.</Notice>}
            {withStatus.map((b) => (
              <div key={b.id} style={{ ...bs.rowBtn, cursor: "default", flexDirection: "column", alignItems: "stretch", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{b.nickname} {statusPill(b.status)}</div>
                    <div style={{ fontSize: 12.5, color: C.muted }}>{b.bank} · {maskAcct(b.last4)} · {b.modes.join(", ")}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{ ...bs.ghost, marginTop: 0, flex: 1, padding: "7px" }} onClick={() => { setTarget(b); setStep("edit"); }}>Edit</button>
                  <button style={{ ...bs.ghost, marginTop: 0, flex: 1, padding: "7px", color: C.accent, borderColor: C.accent }} onClick={() => { setTarget(b); setStep("delConfirm"); }}>Delete</button>
                </div>
              </div>
            ))}
            <button style={bs.primary} onClick={() => { setF({ name: "", acct: "", acct2: "", ifsc: "", nickname: "", limit: "", modes: [] }); setFe({}); setLookup(null); setVerifiedName(null); setStep("add"); }}>Add new beneficiary</button>
          </>
        )}

        {step === "add" && (
          <>
            <Field label="Beneficiary name" error={fe.name}><input style={bs.input} value={f.name} onChange={(e) => setField("name", e.target.value)} /></Field>
            <Field label="Account number" error={fe.acct}><input style={bs.input} inputMode="numeric" value={f.acct} onChange={(e) => setField("acct", e.target.value.replace(/\D/g, ""))} /></Field>
            <Field label="Re-enter account number" error={fe.acct2}><input style={bs.input} inputMode="numeric" value={f.acct2} onChange={(e) => setField("acct2", e.target.value.replace(/\D/g, ""))} onPaste={(e) => e.preventDefault()} /></Field>
            <Field label="IFSC" error={fe.ifsc}>
              <div style={{ display: "flex", gap: 8 }}>
                <input style={{ ...bs.input, textTransform: "uppercase" }} value={f.ifsc} onChange={(e) => { setField("ifsc", e.target.value.toUpperCase()); setLookup(null); }} />
                <button style={{ ...bs.ghost, marginTop: 0, width: "auto", padding: "0 14px" }} onClick={doLookup}>Look up</button>
              </div>
              {lookup && <div style={{ fontSize: 12.5, color: C.ok, marginTop: 6 }}>{lookup.bank} · {lookup.branch}</div>}
            </Field>
            <Field label="Transfer type" error={fe.modes}>
              <div style={bs.checkRow}>
                {TRANSFER_MODES.map((m) => <button key={m} type="button" style={bs.chk(f.modes.includes(m))} onClick={() => toggleMode(m)}>{m}</button>)}
              </div>
            </Field>
            <Field label="Nickname (optional)"><input style={bs.input} value={f.nickname} onChange={(e) => setField("nickname", e.target.value)} /></Field>
            <Field label="Per-transfer limit (optional)" error={fe.limit}><input style={bs.input} inputMode="numeric" value={f.limit} onChange={(e) => setField("limit", e.target.value.replace(/\D/g, ""))} /></Field>
            <button style={bs.ghost} onClick={() => { if (/^\d{9,18}$/.test(f.acct)) setVerifiedName(pennyDropName(f.acct)); }}>Verify name (penny-drop)</button>
            {verifiedName && <Notice kind="ok">Account holder name at bank: <strong>{verifiedName}</strong>. Please confirm this matches your intended payee.</Notice>}
            <button style={bs.primary} onClick={toSummary}>Continue</button>
          </>
        )}
        {step === "addSummary" && (
          <>
            <p style={{ fontWeight: 700, margin: "0 0 4px" }}>Confirm new beneficiary</p>
            <SummaryCard rows={[
              ["Name", f.name],
              ["Bank", lookup?.bank],
              ["Account", maskAcct(f.acct.slice(-4))],
              ["IFSC", f.ifsc.toUpperCase()],
              ["Transfer types", f.modes.join(", ")],
              f.limit && ["Per-transfer limit", inr(f.limit)],
            ]} />
            <button style={bs.primary} onClick={() => setStep("addOtp")}>Confirm &amp; get OTP</button>
          </>
        )}
        {step === "addOtp" && <OtpGate purpose="adding this beneficiary" onCancel={onClose} onVerified={createBeneficiary} />}
        {step === "addDone" && (
          <Success title="Beneficiary added" refId={reference} note={activationMsg} onDone={() => setStep("list")} />
        )}

        {step === "edit" && target && <EditBeneficiary target={target} setBeneficiaries={setBeneficiaries} onDone={(msg) => { onComplete(msg); setStep("list"); }} />}

        {step === "delConfirm" && target && (
          <>
            <Notice kind="err">You are about to permanently delete this beneficiary. Any scheduled transfers to them will fail.</Notice>
            <SummaryCard rows={[["Name", target.name], ["Bank", target.bank], ["Account", maskAcct(target.last4)]]} />
            <button style={{ ...bs.primary, background: C.accent }} onClick={() => setStep("delOtp")}>Delete &amp; get OTP</button>
            <button style={bs.ghost} onClick={() => setStep("list")}>Cancel</button>
          </>
        )}
        {step === "delOtp" && target && <OtpGate purpose="deleting this beneficiary" onCancel={() => setStep("list")} onVerified={doDelete} />}
        {step === "delDone" && (
          <Success title="Beneficiary removed" refId={reference} onDone={() => setStep("list")} />
        )}
      </div>
    </>
  );
}

function EditBeneficiary({ target, setBeneficiaries, onDone }) {
  const [nickname, setNickname] = useState(target.nickname);
  const [limit, setLimit] = useState(target.limit ? String(target.limit) : "");
  const save = () => {
    setBeneficiaries((list) => list.map((b) => b.id === target.id ? { ...b, nickname: nickname.trim() || b.name, limit: limit ? Number(limit) : null } : b));
    onDone(`✅ Beneficiary updated: ${nickname || target.name} (${maskAcct(target.last4)}).`);
  };
  return (
    <>
      <Notice kind="info">Only the nickname and per-transfer limit can be edited. To change the account number, delete this payee and add a new one.</Notice>
      <Field label="Nickname"><input style={bs.input} value={nickname} onChange={(e) => setNickname(e.target.value)} /></Field>
      <Field label="Per-transfer limit (optional)"><input style={bs.input} inputMode="numeric" value={limit} onChange={(e) => setLimit(e.target.value.replace(/\D/g, ""))} /></Field>
      <button style={bs.primary} onClick={save}>Save changes</button>
    </>
  );
}

// ===========================================================================
// Feature 4 — Fund Transfer
// ===========================================================================
function TransferFlow({ accounts, setAccounts, beneficiaries, onClose, onComplete }) {
  const [step, setStep] = useState("source");
  const [source, setSource] = useState(null);
  const [payee, setPayee] = useState(null);          // {kind:'own'|'ben', ...}
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("");
  const [remarks, setRemarks] = useState("");
  const [amtErr, setAmtErr] = useState("");
  const [result, setResult] = useState(null);
  const submittingRef = useRef(false);               // idempotency guard

  const now = useNow();
  const activeBens = beneficiaries.filter((b) => !(b.createdAt && now - b.createdAt < BENEFICIARY_COOLING_MS));
  const coolingBens = beneficiaries.filter((b) => b.createdAt && now - b.createdAt < BENEFICIARY_COOLING_MS);

  const payeeName = payee?.kind === "own" ? `${payee.acct.product} (${maskAcct(payee.acct.last4)})` : payee?.ben?.nickname;
  const payeeMasked = payee?.kind === "own" ? maskAcct(payee.acct.last4) : maskAcct(payee?.ben?.last4);

  const checkAmount = () => {
    const amt = Number(amount);
    if (!amt || amt <= 0) return setAmtErr("Enter a valid amount."), false;
    if (amt > source.balance) return setAmtErr(`Insufficient balance. Available: ${inr(source.balance)}.`), false;
    if (amt > CHAT_TXN_LIMIT) return setAmtErr(`Amount exceeds the chat channel limit of ${inr(CHAT_TXN_LIMIT)} per transaction.`), false;
    if (payee.kind === "ben" && payee.ben.limit && amt > payee.ben.limit) return setAmtErr(`Amount exceeds the limit set for this payee (${inr(payee.ben.limit)}).`), false;
    setAmtErr("");
    const suggested = payee.kind === "own" ? "Intra-bank" : suggestMode(amt, payee.ben);
    setMode(suggested);
    setStep("summary");
    return true;
  };

  const execute = () => {
    if (submittingRef.current) return;               // block duplicate debit
    submittingRef.current = true;
    const amt = Number(amount);
    setAccounts((list) => list.map((a) => a.id === source.id ? { ...a, balance: a.balance - amt } : a));
    const utr = refNo("UTR");
    setResult({ utr, amt });
    onComplete(`✅ ${inr(amt)} sent to ${payeeName} via ${mode}. UTR: ${utr}.`);
    setStep("done");
  };

  const allowedModes = payee?.kind === "own" ? ["Intra-bank"] : (payee?.ben?.modes || TRANSFER_MODES);

  return (
    <>
      <FlowHeader title="Fund Transfer" onClose={onClose}
        onBack={step === "source" || step === "done" ? null : () => setStep("source")} />
      <div style={bs.body}>
        {step === "source" && (
          <>
            <p style={{ color: C.muted, fontSize: 13, margin: "0 0 10px" }}>Transfer from</p>
            {accounts.map((a) => (
              <button key={a.id} style={bs.rowBtn} onClick={() => { setSource(a); setStep("payee"); }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{a.product}</div>
                  <div style={{ fontSize: 12.5, color: C.muted }}>{maskAcct(a.last4)} · Bal {inr(a.balance)}</div>
                </div>
              </button>
            ))}
          </>
        )}
        {step === "payee" && (
          <>
            <p style={{ color: C.muted, fontSize: 13, margin: "0 0 10px" }}>Transfer to</p>
            {accounts.filter((a) => a.id !== source.id).map((a) => (
              <button key={a.id} style={bs.rowBtn} onClick={() => { setPayee({ kind: "own", acct: a }); setStep("amount"); }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>My {a.product}</div>
                  <div style={{ fontSize: 12.5, color: C.muted }}>{maskAcct(a.last4)}</div>
                </div>
                <span style={bs.pill("#EEF6FF", "#1E4E8C")}>Own</span>
              </button>
            ))}
            {activeBens.map((b) => (
              <button key={b.id} style={bs.rowBtn} onClick={() => { setPayee({ kind: "ben", ben: b }); setStep("amount"); }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{b.nickname}</div>
                  <div style={{ fontSize: 12.5, color: C.muted }}>{b.bank} · {maskAcct(b.last4)}</div>
                </div>
              </button>
            ))}
            {coolingBens.map((b) => (
              <div key={b.id} style={{ ...bs.rowBtn, cursor: "not-allowed", opacity: 0.6 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{b.nickname} {statusPill("cooling")}</div>
                  <div style={{ fontSize: 12.5, color: C.muted }}>Available after cooling period</div>
                </div>
              </div>
            ))}
            <Notice kind="info">You can only transfer to your own linked accounts or registered beneficiaries. Ad-hoc account entry is not available in chat.</Notice>
          </>
        )}
        {step === "amount" && (
          <>
            <SummaryCard rows={[["From", `${source.product} (${maskAcct(source.last4)})`], ["To", `${payeeName}`]]} />
            <Field label="Amount (₹)" error={amtErr}>
              <input style={bs.input} inputMode="numeric" autoFocus value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))} />
            </Field>
            <Field label="Remarks (optional)"><input style={bs.input} value={remarks} onChange={(e) => setRemarks(e.target.value)} /></Field>
            <button style={bs.primary} onClick={checkAmount}>Continue</button>
          </>
        )}
        {step === "summary" && (
          <>
            <p style={{ fontWeight: 700, margin: "0 0 4px" }}>Review transfer</p>
            <SummaryCard rows={[
              ["From", `${source.product} (${maskAcct(source.last4)})`],
              ["To", `${payeeName}`],
              ["Payee account", payeeMasked],
              ["Amount", inr(amount)],
              ["Mode", (
                <select value={mode} onChange={(e) => setMode(e.target.value)} style={{ ...bs.select, width: "auto", padding: "4px 8px", fontSize: 13 }}>
                  {allowedModes.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              )],
              ["Charges", "₹0 (demo)"],
              remarks && ["Remarks", remarks],
            ]} />
            {mode === "NEFT" && <Notice kind="info">NEFT settles in batches — the payee is typically credited within 2 hours.</Notice>}
            <button style={bs.primary} onClick={() => setStep("otp")}>Confirm &amp; get OTP</button>
          </>
        )}
        {step === "otp" && <OtpGate purpose={`transfer of ${inr(amount)}`} onCancel={onClose} onVerified={execute} />}
        {step === "done" && result && (
          <Success title="Transfer successful" refId={result.utr}
            rows={[["Amount", inr(result.amt)], ["To", payeeName], ["Mode", mode], ["Status", "Completed"]]}
            note={mode === "NEFT" ? "Credit to the payee may take up to 2 hours (NEFT batch settlement)." : null}
            onDone={onClose} />
        )}
      </div>
    </>
  );
}

// ===========================================================================
// Feature 5 — Open FD / RD
// ===========================================================================
function DepositFlow({ accounts, setAccounts, nominee, onClose, onComplete }) {
  const [kind, setKind] = useState(null);            // 'FD' | 'RD'
  const [step, setStep] = useState("choose");
  const [source, setSource] = useState(null);
  const [rates, setRates] = useState(null);          // simulated live fetch
  const [loadingRates, setLoadingRates] = useState(false);
  const [tenure, setTenure] = useState(null);
  const [amount, setAmount] = useState("");
  const [payout, setPayout] = useState("Cumulative");
  const [maturityInstr, setMaturityInstr] = useState("Auto-renew principal + interest");
  const [debitDay, setDebitDay] = useState("5");
  const [amtErr, setAmtErr] = useState("");
  const [result, setResult] = useState(null);

  const senior = isSenior(CUSTOMER.dob);
  const card = kind === "FD" ? FD_RATE_CARD : RD_RATE_CARD;
  const min = kind === "FD" ? FD_MIN : RD_MIN;
  const max = kind === "FD" ? FD_MAX : RD_MAX;

  // Simulated "live" rate fetch — triggered when the user reaches the rates step.
  const goToRates = () => {
    setStep("rates");
    setLoadingRates(true);
    setRates(null);
    setTimeout(() => { setRates(card); setLoadingRates(false); }, 700);
  };

  const effRate = (t) => (t ? t.rate + (senior ? SENIOR_EXTRA : 0) : 0);

  const validateAmt = () => {
    const amt = Number(amount);
    if (!amt || amt < min) return setAmtErr(`Minimum ${kind} amount is ${inr(min)}.`), false;
    if (amt > max) return setAmtErr(`Maximum ${kind} amount is ${inr(max)}.`), false;
    if (kind === "FD" && amt > source.balance) return setAmtErr(`Insufficient balance in source account (${inr(source.balance)}).`), false;
    setAmtErr(""); setStep("preview"); return true;
  };

  const rate = effRate(tenure);
  const maturityDate = tenure ? addMonths(tenure.months) : null;
  const fdMat = kind === "FD" && tenure ? fdMaturity(Number(amount), rate, tenure.months) : 0;
  const rdMat = kind === "RD" && tenure ? rdMaturity(Number(amount), rate, tenure.months) : 0;
  const periodic = kind === "FD" && tenure ? fdPayout(Number(amount), rate, payout === "Monthly" ? 12 : 4) : 0;

  const book = () => {
    if (kind === "FD") setAccounts((list) => list.map((a) => a.id === source.id ? { ...a, balance: a.balance - Number(amount) } : a));
    const acctNo = refNo(kind === "FD" ? "FD" : "RD");
    setResult({ acctNo });
    const summary = kind === "FD"
      ? `✅ Fixed Deposit booked: ${inr(amount)} for ${tenure.label} at ${rate.toFixed(2)}% p.a. Maturity ${inr(fdMat)} on ${fmtDate(maturityDate)}. FD A/c: ${acctNo}`
      : `✅ Recurring Deposit opened: ${inr(amount)}/month for ${tenure.label} at ${rate.toFixed(2)}% p.a. RD A/c: ${acctNo}`;
    onComplete(summary);
    setStep("done");
  };

  return (
    <>
      <FlowHeader title="Open FD / RD" onClose={onClose}
        onBack={step === "choose" || step === "done" ? null : () => setStep("choose")} />
      <div style={bs.body}>
        {step === "choose" && (
          <>
            <button style={bs.rowBtn} onClick={() => { setKind("FD"); setRates(null); setPayout("Cumulative"); setStep("source"); }}>
              <FontAwesomeIcon icon={faPiggyBank} style={{ color: C.maroon, fontSize: 18 }} />
              <div><div style={{ fontWeight: 700 }}>Fixed Deposit (FD)</div><div style={{ fontSize: 12.5, color: C.muted }}>Invest a lump sum for a fixed tenure</div></div>
            </button>
            <button style={bs.rowBtn} onClick={() => { setKind("RD"); setRates(null); setStep("source"); }}>
              <FontAwesomeIcon icon={faPiggyBank} style={{ color: C.maroon, fontSize: 18 }} />
              <div><div style={{ fontWeight: 700 }}>Recurring Deposit (RD)</div><div style={{ fontSize: 12.5, color: C.muted }}>Save a fixed amount every month</div></div>
            </button>
          </>
        )}
        {step === "source" && (
          <>
            <p style={{ color: C.muted, fontSize: 13, margin: "0 0 10px" }}>{kind === "FD" ? "Fund the deposit from" : "Set up the monthly standing instruction from"}</p>
            {accounts.map((a) => (
              <button key={a.id} style={bs.rowBtn} onClick={() => { setSource(a); goToRates(); }}>
                <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 14 }}>{a.product}</div><div style={{ fontSize: 12.5, color: C.muted }}>{maskAcct(a.last4)} · Bal {inr(a.balance)}</div></div>
              </button>
            ))}
          </>
        )}
        {step === "rates" && (
          <>
            <p style={{ fontWeight: 700, margin: "0 0 4px" }}>Current {kind} rates {senior && <span style={bs.pill("#EAF7EF", C.ok)}>Senior +{SENIOR_EXTRA}%</span>}</p>
            <p style={{ fontSize: 12, color: C.muted, margin: "0 0 8px" }}>Fetched live · subject to change</p>
            {loadingRates && <p style={{ color: C.muted }}>Fetching latest rates…</p>}
            {rates && rates.map((t) => (
              <button key={t.key} style={{ ...bs.rowBtn, borderColor: tenure?.key === t.key ? C.maroon : C.border }} onClick={() => { setTenure(t); setStep("details"); }}>
                <div style={{ flex: 1 }}><div style={{ fontWeight: 700 }}>{t.label}</div></div>
                <div style={{ fontWeight: 700, color: C.maroon }}>{effRate(t).toFixed(2)}% p.a.</div>
              </button>
            ))}
          </>
        )}
        {step === "details" && (
          <>
            <SummaryCard rows={[["Type", kind === "FD" ? "Fixed Deposit" : "Recurring Deposit"], ["Tenure", tenure.label], ["Rate", `${rate.toFixed(2)}% p.a.`]]} />
            <Field label={kind === "FD" ? "Deposit amount (₹)" : "Monthly installment (₹)"} error={amtErr}>
              <input style={bs.input} inputMode="numeric" autoFocus value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))} />
            </Field>
            {kind === "FD" && (
              <>
                <Field label="Interest payout">
                  <select style={bs.select} value={payout} onChange={(e) => setPayout(e.target.value)}>
                    <option>Cumulative</option><option>Monthly</option><option>Quarterly</option>
                  </select>
                </Field>
                <Field label="On maturity">
                  <select style={bs.select} value={maturityInstr} onChange={(e) => setMaturityInstr(e.target.value)}>
                    <option>Auto-renew principal + interest</option>
                    <option>Auto-renew principal only</option>
                    <option>Credit to account</option>
                  </select>
                </Field>
              </>
            )}
            {kind === "RD" && (
              <Field label="Monthly debit date">
                <select style={bs.select} value={debitDay} onChange={(e) => setDebitDay(e.target.value)}>
                  {["1", "5", "10", "15", "20", "25"].map((d) => <option key={d} value={d}>{d}th of every month</option>)}
                </select>
              </Field>
            )}
            <button style={bs.primary} onClick={validateAmt}>See preview</button>
          </>
        )}
        {step === "preview" && (
          <>
            <p style={{ fontWeight: 700, margin: "0 0 4px" }}>Deposit preview</p>
            <SummaryCard rows={[
              [kind === "FD" ? "Principal" : "Monthly installment", inr(amount)],
              ["Tenure", tenure.label],
              ["Interest rate", `${rate.toFixed(2)}% p.a.${senior ? " (incl. senior citizen benefit)" : ""}`],
              ["Maturity date", fmtDate(maturityDate)],
              kind === "FD" && payout === "Cumulative" && ["Maturity amount", inr(fdMat)],
              kind === "FD" && payout !== "Cumulative" && [`${payout} payout`, inr(periodic)],
              kind === "RD" && ["Total invested", inr(Number(amount) * tenure.months)],
              kind === "RD" && ["Maturity amount", inr(rdMat)],
              ["Nominee", nominee ? `${nominee.name} (${nominee.relationship})` : "Not set — please add via Nominee Management"],
            ]} />
            <Notice kind="warn">
              TDS is deducted if total interest exceeds ₹40,000 in a financial year (₹50,000 for senior citizens). Submit Form 15G/15H if eligible.
              {kind === "FD" ? " Premature withdrawal attracts ~1% penalty on the applicable rate." : " Missing an installment attracts a small penalty per ₹100 of the installment."}
            </Notice>
            <button style={bs.primary} onClick={() => setStep("otp")}>Confirm &amp; get OTP</button>
          </>
        )}
        {step === "otp" && <OtpGate purpose={`opening this ${kind}`} onCancel={onClose} onVerified={book} />}
        {step === "done" && result && (
          <Success title={`${kind} opened successfully`} refId={result.acctNo}
            rows={kind === "FD"
              ? [["Principal", inr(amount)], ["Rate", `${rate.toFixed(2)}% p.a.`], ["Maturity", `${inr(fdMat)} on ${fmtDate(maturityDate)}`]]
              : [["Installment", `${inr(amount)}/month`], ["Rate", `${rate.toFixed(2)}% p.a.`], ["Maturity", `${inr(rdMat)} on ${fmtDate(maturityDate)}`]]}
            note="A deposit advice/receipt has been sent to your registered email and is available in your account statements." onDone={onClose} />
        )}
      </div>
    </>
  );
}

// ===========================================================================
// Root panel + service menu
// ===========================================================================
const MENU = [
  { key: "pin", icon: faCreditCard, title: "Set / Reset Card PIN", desc: "Set a new debit card PIN securely" },
  { key: "nominee", icon: faUserShield, title: "Nominee", desc: "View, add or update your nominee" },
  { key: "beneficiary", icon: faUsers, title: "Beneficiaries", desc: "Add, edit or remove payees" },
  { key: "transfer", icon: faMoneyBillTransfer, title: "Fund Transfer", desc: "Send money to your accounts or payees" },
  { key: "deposit", icon: faPiggyBank, title: "Open FD / RD", desc: "Book a fixed or recurring deposit" },
];

export default function BankingServices({ onClose, onComplete }) {
  const [view, setView] = useState("menu");
  // In-memory "CBS" state — persists while the panel is mounted (one session).
  const [accounts, setAccounts] = useState(initialAccounts);
  const [cards] = useState(initialCards);
  const [nominee, setNominee] = useState(initialNominee);
  const [beneficiaries, setBeneficiaries] = useState(initialBeneficiaries);

  const close = () => { setView("menu"); onClose(); };

  return (
    <div style={bs.overlay} onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div style={bs.sheet} onClick={(e) => e.stopPropagation()}>
        {view === "menu" && (
          <>
            <FlowHeader title="Self-service Banking" onClose={close} />
            <div style={bs.body}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", color: C.muted, fontSize: 12.5, marginBottom: 12 }}>
                <FontAwesomeIcon icon={faShieldHalved} style={{ color: C.maroon }} />
                Every action here is authenticated and confirmed with an OTP. Demo only — no real money moves.
              </div>
              <div style={bs.menuGrid}>
                {MENU.map((m) => (
                  <button key={m.key} style={bs.menuCard} onClick={() => setView(m.key)}>
                    <span style={bs.menuEmoji}><FontAwesomeIcon icon={m.icon} /></span>
                    <span style={bs.menuTitle}>{m.title}</span>
                    <span style={bs.menuDesc}>{m.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
        {view === "pin" && <PinFlow cards={cards} onClose={close} onComplete={onComplete} />}
        {view === "nominee" && <NomineeFlow nominee={nominee} setNominee={setNominee} onClose={close} onComplete={onComplete} />}
        {view === "beneficiary" && <BeneficiaryFlow beneficiaries={beneficiaries} setBeneficiaries={setBeneficiaries} onClose={close} onComplete={onComplete} />}
        {view === "transfer" && <TransferFlow accounts={accounts} setAccounts={setAccounts} beneficiaries={beneficiaries} onClose={close} onComplete={onComplete} />}
        {view === "deposit" && <DepositFlow accounts={accounts} setAccounts={setAccounts} nominee={nominee} onClose={close} onComplete={onComplete} />}
      </div>
    </div>
  );
}
