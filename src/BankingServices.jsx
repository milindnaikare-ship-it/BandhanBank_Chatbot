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
import { makeTr, relLabel } from "./bankingI18n";

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
  const icon = kind === "ok" ? faCircleCheck : faTriangleExclamation;
  return <div style={{ ...bs.notice, background: bg, color: fg }}><FontAwesomeIcon icon={icon} style={{ marginTop: 2 }} /><div>{children}</div></div>;
};

const SummaryCard = ({ rows }) => {
  const filtered = rows.filter(Boolean);
  return (
    <div style={bs.sumCard}>
      {filtered.map(([k, v], i) => (
        <div key={i} style={{ ...bs.sumRow, ...(i === filtered.length - 1 ? { borderBottom: "none" } : {}) }}>
          <span style={bs.sumKey}>{k}</span><span style={bs.sumVal}>{v}</span>
        </div>
      ))}
    </div>
  );
};

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
const OtpGate = ({ tr, purpose, onVerified, onCancel }) => {
  const [otp, setOtp] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState("");
  const [locked, setLocked] = useState(false);

  if (locked) {
    return (
      <div style={{ textAlign: "center", padding: "10px 0" }}>
        <FontAwesomeIcon icon={faLock} style={{ fontSize: 34, color: C.accent }} />
        <p style={{ fontWeight: 700, marginTop: 12 }}>{tr("lockedTitle")}</p>
        <p style={{ color: C.muted, fontSize: 13 }}>{tr("lockedBody")}</p>
        <button style={bs.primary} onClick={onCancel}>{tr("close")}</button>
      </div>
    );
  }
  const submit = () => {
    if (otp.length !== 6) { setError(tr("otpNeed6")); return; }
    if (otp === DEMO_OTP) { onVerified(); return; }
    const n = attempts + 1;
    setAttempts(n); setOtp("");
    if (n >= MAX_OTP_ATTEMPTS) setLocked(true);
    else setError(tr("otpWrong", MAX_OTP_ATTEMPTS - n));
  };
  return (
    <div>
      <Notice kind="info">{tr("otpSent", purpose, CUSTOMER.mobileMasked)} <em>{tr("otpDemo")}</em></Notice>
      <label style={bs.label}>{tr("enterOtp")}</label>
      <SecureInput len={6} value={otp} onChange={setOtp} autoFocus />
      {error && <div style={bs.err}>{error}</div>}
      <button style={bs.primary} onClick={submit}>{tr("verifyProceed")}</button>
      <button style={bs.ghost} onClick={onCancel}>{tr("cancel")}</button>
    </div>
  );
};

const Success = ({ tr, title, refId: reference, rows, note, onDone }) => (
  <div>
    <div style={{ textAlign: "center", padding: "6px 0 2px" }}>
      <FontAwesomeIcon icon={faCircleCheck} style={{ fontSize: 44, color: C.ok }} />
      <p style={{ fontWeight: 700, fontSize: 17, marginTop: 10 }}>{title}</p>
      {reference && <p style={{ color: C.muted, fontSize: 13 }}>{tr("reference")}: <strong style={{ color: C.text }}>{reference}</strong></p>}
    </div>
    {rows && <SummaryCard rows={rows} />}
    {note && <Notice kind="warn">{note}</Notice>}
    <button style={bs.primary} onClick={onDone}>{tr("done")}</button>
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

const statusPill = (status, tr) => {
  if (status === "active") return <span style={bs.pill("#EAF7EF", C.ok)}>{tr("active")}</span>;
  if (status === "cooling") return <span style={bs.pill("#FFF6E8", C.warn)}>{tr("cooling")}</span>;
  return <span style={bs.pill("#F0E7E0", C.muted)}>{tr("inactive")}</span>;
};

// ===========================================================================
// Feature 1 — Set / Reset Debit Card PIN
// ===========================================================================
function PinFlow({ tr, cards, onClose, onComplete }) {
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
    if (!/^\d{2}\/\d{2}$/.test(expiry)) { setExpErr(tr("pinExpiryFmt")); return; }
    if (expiry !== card.expiry) { setExpErr(tr("pinExpiryMismatch")); return; }
    setExpErr(""); setStep("otp");
  };
  const setNewPin = () => {
    const e = validatePin(pin, card.pinLen);
    if (e) { setPinErr(e); return; }
    if (pin !== pin2) { setPinErr(tr("pinMismatch")); return; }
    const r = refNo("SRPIN");
    setPinErr(""); setReference(r); setStep("done");
    // NB: pin is never included in the completion message / transcript.
    onComplete(tr("pinMsg", maskCard(card.last4), r));
  };

  return (
    <>
      <FlowHeader title={tr("pinTitle")} onClose={onClose}
        onBack={step === "select" ? null : () => setStep(step === "done" ? "done" : "select")} />
      <div style={bs.body}>
        {step === "select" && (
          <>
            <p style={{ color: C.muted, fontSize: 13, margin: "0 0 12px" }}>{tr("pinSelect")}</p>
            {cards.map((c) => {
              const disabled = c.status !== "ACTIVE";
              return (
                <button key={c.id} style={{ ...bs.rowBtn, opacity: disabled ? 0.55 : 1, cursor: disabled ? "not-allowed" : "pointer" }} onClick={() => pick(c)} disabled={disabled}>
                  <FontAwesomeIcon icon={faCreditCard} style={{ color: C.maroon, fontSize: 18 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{c.network}</div>
                    <div style={{ fontSize: 12.5, color: C.muted }}>{maskCard(c.last4)} · Exp {c.expiry}</div>
                  </div>
                  {c.status === "ACTIVE" ? statusPill("active", tr) : <span style={bs.pill("#FDEEF0", C.accent)}>{c.status}</span>}
                </button>
              );
            })}
            <Notice kind="info">{tr("pinBlocked")}</Notice>
          </>
        )}
        {step === "expiry" && (
          <>
            <SummaryCard rows={[[tr("card"), card.network], [tr("number"), maskCard(card.last4)]]} />
            <Field label={tr("pinExpiryLabel")} error={expErr}>
              <input style={bs.input} value={expiry} placeholder="MM/YY" maxLength={5}
                onChange={(e) => setExpiry(e.target.value.replace(/[^\d/]/g, "").slice(0, 5))} />
            </Field>
            <button style={bs.primary} onClick={checkExpiry}>{tr("continue")}</button>
          </>
        )}
        {step === "otp" && (
          <OtpGate tr={tr} purpose={tr("pinPurpose")} onCancel={onClose} onVerified={() => setStep("setpin")} />
        )}
        {step === "setpin" && (
          <>
            <Notice kind="info">{tr("pinSetNote", card.pinLen)}</Notice>
            <label style={bs.label}>{tr("pinNew")}</label>
            <SecureInput len={card.pinLen} value={pin} onChange={setPin} autoFocus />
            <label style={bs.label}>{tr("pinConfirm")}</label>
            <SecureInput len={card.pinLen} value={pin2} onChange={setPin2} />
            {pinErr && <div style={bs.err}>{pinErr}</div>}
            <button style={bs.primary} onClick={setNewPin}>{tr("pinSetBtn")}</button>
          </>
        )}
        {step === "done" && (
          <Success tr={tr} title={tr("pinDoneTitle")} refId={reference}
            rows={[[tr("card"), card.network], [tr("number"), maskCard(card.last4)]]}
            note={tr("pinDoneNote")} onDone={onClose} />
        )}
      </div>
    </>
  );
}

// ===========================================================================
// Feature 2 — Nominee Addition / Modification
// ===========================================================================
function NomineeFlow({ tr, lang, nominee, setNominee, onClose, onComplete }) {
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
    if (!form.name.trim() || /\d/.test(form.name)) e.name = tr("nomNameErr");
    if (!form.relationship) e.relationship = tr("relErr");
    if (!form.dob) e.dob = tr("dobErr");
    else if (new Date(form.dob) > new Date()) e.dob = tr("dobFuture");
    const addr = copyAddr ? CUSTOMER.address : form.address;
    if (!addr.trim()) e.address = tr("nomAddrErr");
    if (minor) {
      const g = form.guardian || {};
      if (!g.name?.trim() || /\d/.test(g.name)) e.gname = tr("gNameErr");
      if (!g.relationship) e.grel = tr("gRelErr");
      if (!g.address?.trim()) e.gaddr = tr("gAddrErr");
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const toReview = () => { if (validate()) setStep("review"); };
  const commit = () => {
    const finalForm = { ...form, address: copyAddr ? CUSTOMER.address : form.address, guardian: minor ? form.guardian : null };
    setNominee(finalForm);
    const r = refNo("SRNOM"); setReference(r);
    onComplete(tr("nomMsg", nominee ? tr("updated") : tr("added"), finalForm.name, relLabel(lang, finalForm.relationship), r));
    setStep("done");
  };

  return (
    <>
      <FlowHeader title={tr("nomTitle")} onClose={onClose}
        onBack={step === "view" ? null : () => setStep("view")} />
      <div style={bs.body}>
        {step === "view" && (
          <>
            {nominee ? (
              <>
                <p style={{ color: C.muted, fontSize: 13, margin: "0 0 4px" }}>{tr("nomCurrent", maskAcct("6789"))}</p>
                <SummaryCard rows={[
                  [tr("name"), nominee.name],
                  [tr("relationship"), relLabel(lang, nominee.relationship)],
                  [tr("dob"), "XX-XX-" + (nominee.dob || "").slice(0, 4)],
                ]} />
              </>
            ) : <Notice kind="warn">{tr("nomNone")}</Notice>}
            <button style={bs.primary} onClick={() => { setForm(nominee || { name: "", relationship: "", dob: "", address: "", guardian: null }); setStep("form"); }}>
              {nominee ? tr("nomModify") : tr("nomAdd")}
            </button>
            <Notice kind="info">{tr("nomSingle")}</Notice>
          </>
        )}
        {step === "form" && (
          <>
            <Field label={tr("nomName")} error={errors.name}>
              <input style={bs.input} value={form.name} onChange={(e) => set("name", e.target.value)} />
            </Field>
            <Field label={tr("relationship")} error={errors.relationship}>
              <select style={bs.select} value={form.relationship} onChange={(e) => set("relationship", e.target.value)}>
                <option value="">{tr("selectOpt")}</option>
                {RELATIONSHIPS.map((r) => <option key={r} value={r}>{relLabel(lang, r)}</option>)}
              </select>
            </Field>
            <Field label={tr("dob")} error={errors.dob}>
              <input type="date" style={bs.input} value={form.dob} onChange={(e) => set("dob", e.target.value)} />
            </Field>
            {minor && <Notice kind="warn">{tr("minorNote")}</Notice>}
            <Field label={tr("nomAddr")} error={errors.address}>
              <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, marginBottom: 6, color: C.muted }}>
                <input type="checkbox" checked={copyAddr} onChange={(e) => setCopyAddr(e.target.checked)} />
                {tr("sameAddr")}
              </label>
              {!copyAddr && <textarea style={{ ...bs.input, minHeight: 60 }} value={form.address} onChange={(e) => set("address", e.target.value)} />}
              {copyAddr && <div style={{ fontSize: 13, color: C.text }}>{CUSTOMER.address}</div>}
            </Field>
            {minor && (
              <>
                <Field label={tr("gName")} error={errors.gname}>
                  <input style={bs.input} value={form.guardian?.name || ""} onChange={(e) => setG("name", e.target.value)} />
                </Field>
                <Field label={tr("gRel")} error={errors.grel}>
                  <select style={bs.select} value={form.guardian?.relationship || ""} onChange={(e) => setG("relationship", e.target.value)}>
                    <option value="">{tr("selectOpt")}</option>
                    {RELATIONSHIPS.map((r) => <option key={r} value={r}>{relLabel(lang, r)}</option>)}
                  </select>
                </Field>
                <Field label={tr("gAddr")} error={errors.gaddr}>
                  <textarea style={{ ...bs.input, minHeight: 60 }} value={form.guardian?.address || ""} onChange={(e) => setG("address", e.target.value)} />
                </Field>
              </>
            )}
            <button style={bs.primary} onClick={toReview}>{tr("reviewChanges")}</button>
          </>
        )}
        {step === "review" && (
          <>
            <p style={{ fontWeight: 700, margin: "0 0 8px" }}>{tr("confirmNominee")}</p>
            {nominee && (
              <>
                <p style={{ ...bs.label, marginTop: 0 }}>{tr("before")}</p>
                <SummaryCard rows={[[tr("name"), nominee.name], [tr("relationship"), relLabel(lang, nominee.relationship)]]} />
                <p style={bs.label}>{tr("after")}</p>
              </>
            )}
            <SummaryCard rows={[
              [tr("name"), form.name],
              [tr("relationship"), relLabel(lang, form.relationship)],
              [tr("dob"), fmtDate(new Date(form.dob))],
              [tr("address"), copyAddr ? CUSTOMER.address : form.address],
              minor && [tr("guardian"), `${form.guardian?.name} (${relLabel(lang, form.guardian?.relationship)})`],
            ]} />
            <button style={bs.primary} onClick={() => setStep("otp")}>{tr("confirmOtp")}</button>
          </>
        )}
        {step === "otp" && <OtpGate tr={tr} purpose={tr("nomPurpose")} onCancel={onClose} onVerified={commit} />}
        {step === "done" && (
          <Success tr={tr} title={tr("nomDoneTitle")} refId={reference} note={tr("nomDoneNote")} onDone={onClose} />
        )}
      </div>
    </>
  );
}

// ===========================================================================
// Feature 3 — Manage Beneficiaries
// ===========================================================================
function BeneficiaryFlow({ tr, beneficiaries, setBeneficiaries, onClose, onComplete }) {
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
    if (!f.name.trim() || /\d/.test(f.name)) e.name = tr("benNameErr");
    if (!/^\d{9,18}$/.test(f.acct)) e.acct = tr("acctErr");
    if (f.acct !== f.acct2) e.acct2 = tr("acctReErr");
    if (!validIfsc(f.ifsc)) e.ifsc = tr("ifscErr");
    if (!f.modes.length) e.modes = tr("modesErr");
    if (f.limit && (!/^\d+$/.test(f.limit) || Number(f.limit) <= 0)) e.limit = tr("limitErr");
    if (beneficiaries.some((b) => b.account === f.acct && b.ifsc.toUpperCase() === f.ifsc.toUpperCase())) e.acct = tr("benDup");
    if (beneficiaries.length >= MAX_BENEFICIARIES) e.name = tr("benMax", MAX_BENEFICIARIES);
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
    setActivationMsg(tr("benActivation", active.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })));
    const r = refNo("SRBEN"); setReference(r);
    onComplete(tr("benAddMsg", b.name, b.bank, maskAcct(b.last4), r));
    setStep("addDone");
  };

  const doDelete = () => {
    setBeneficiaries((list) => list.filter((b) => b.id !== target.id));
    const r = refNo("SRBEN"); setReference(r);
    onComplete(tr("benDelMsg", target.name, maskAcct(target.last4), r));
    setStep("delDone");
  };

  return (
    <>
      <FlowHeader title={tr("benTitle")} onClose={onClose}
        onBack={step === "list" ? null : () => setStep("list")} />
      <div style={bs.body}>
        {step === "list" && (
          <>
            {withStatus.length === 0 && <Notice kind="info">{tr("benNone")}</Notice>}
            {withStatus.map((b) => (
              <div key={b.id} style={{ ...bs.rowBtn, cursor: "default", flexDirection: "column", alignItems: "stretch", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{b.nickname} {statusPill(b.status, tr)}</div>
                    <div style={{ fontSize: 12.5, color: C.muted }}>{b.bank} · {maskAcct(b.last4)} · {b.modes.join(", ")}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{ ...bs.ghost, marginTop: 0, flex: 1, padding: "7px" }} onClick={() => { setTarget(b); setStep("edit"); }}>{tr("edit")}</button>
                  <button style={{ ...bs.ghost, marginTop: 0, flex: 1, padding: "7px", color: C.accent, borderColor: C.accent }} onClick={() => { setTarget(b); setStep("delConfirm"); }}>{tr("delete")}</button>
                </div>
              </div>
            ))}
            <button style={bs.primary} onClick={() => { setF({ name: "", acct: "", acct2: "", ifsc: "", nickname: "", limit: "", modes: [] }); setFe({}); setLookup(null); setVerifiedName(null); setStep("add"); }}>{tr("addNew")}</button>
          </>
        )}

        {step === "add" && (
          <>
            <Field label={tr("benName")} error={fe.name}><input style={bs.input} value={f.name} onChange={(e) => setField("name", e.target.value)} /></Field>
            <Field label={tr("acctNum")} error={fe.acct}><input style={bs.input} inputMode="numeric" value={f.acct} onChange={(e) => setField("acct", e.target.value.replace(/\D/g, ""))} /></Field>
            <Field label={tr("acctRe")} error={fe.acct2}><input style={bs.input} inputMode="numeric" value={f.acct2} onChange={(e) => setField("acct2", e.target.value.replace(/\D/g, ""))} onPaste={(e) => e.preventDefault()} /></Field>
            <Field label={tr("ifsc")} error={fe.ifsc}>
              <div style={{ display: "flex", gap: 8 }}>
                <input style={{ ...bs.input, textTransform: "uppercase" }} value={f.ifsc} onChange={(e) => { setField("ifsc", e.target.value.toUpperCase()); setLookup(null); }} />
                <button style={{ ...bs.ghost, marginTop: 0, width: "auto", padding: "0 14px" }} onClick={doLookup}>{tr("lookUp")}</button>
              </div>
              {lookup && <div style={{ fontSize: 12.5, color: C.ok, marginTop: 6 }}>{lookup.bank} · {lookup.branch}</div>}
            </Field>
            <Field label={tr("transferType")} error={fe.modes}>
              <div style={bs.checkRow}>
                {TRANSFER_MODES.map((m) => <button key={m} type="button" style={bs.chk(f.modes.includes(m))} onClick={() => toggleMode(m)}>{m}</button>)}
              </div>
            </Field>
            <Field label={tr("nickname")}><input style={bs.input} value={f.nickname} onChange={(e) => setField("nickname", e.target.value)} /></Field>
            <Field label={tr("perLimit")} error={fe.limit}><input style={bs.input} inputMode="numeric" value={f.limit} onChange={(e) => setField("limit", e.target.value.replace(/\D/g, ""))} /></Field>
            <button style={bs.ghost} onClick={() => { if (/^\d{9,18}$/.test(f.acct)) setVerifiedName(pennyDropName(f.acct)); }}>{tr("verifyName")}</button>
            {verifiedName && <Notice kind="ok">{tr("verifyNameOk", verifiedName)}</Notice>}
            <button style={bs.primary} onClick={toSummary}>{tr("continue")}</button>
          </>
        )}
        {step === "addSummary" && (
          <>
            <p style={{ fontWeight: 700, margin: "0 0 4px" }}>{tr("confirmNewBen")}</p>
            <SummaryCard rows={[
              [tr("name"), f.name],
              [tr("bank"), lookup?.bank],
              [tr("account"), maskAcct(f.acct.slice(-4))],
              [tr("ifsc"), f.ifsc.toUpperCase()],
              [tr("transferTypes"), f.modes.join(", ")],
              f.limit && [tr("perLimitShort"), inr(f.limit)],
            ]} />
            <button style={bs.primary} onClick={() => setStep("addOtp")}>{tr("confirmOtp")}</button>
          </>
        )}
        {step === "addOtp" && <OtpGate tr={tr} purpose={tr("benPurpose")} onCancel={onClose} onVerified={createBeneficiary} />}
        {step === "addDone" && (
          <Success tr={tr} title={tr("benDoneTitle")} refId={reference} note={activationMsg} onDone={() => setStep("list")} />
        )}

        {step === "edit" && target && <EditBeneficiary tr={tr} target={target} setBeneficiaries={setBeneficiaries} onDone={(msg) => { onComplete(msg); setStep("list"); }} />}

        {step === "delConfirm" && target && (
          <>
            <Notice kind="err">{tr("delWarn")}</Notice>
            <SummaryCard rows={[[tr("name"), target.name], [tr("bank"), target.bank], [tr("account"), maskAcct(target.last4)]]} />
            <button style={{ ...bs.primary, background: C.accent }} onClick={() => setStep("delOtp")}>{tr("delGetOtp")}</button>
            <button style={bs.ghost} onClick={() => setStep("list")}>{tr("cancel")}</button>
          </>
        )}
        {step === "delOtp" && target && <OtpGate tr={tr} purpose={tr("delPurpose")} onCancel={() => setStep("list")} onVerified={doDelete} />}
        {step === "delDone" && (
          <Success tr={tr} title={tr("benDelTitle")} refId={reference} onDone={() => setStep("list")} />
        )}
      </div>
    </>
  );
}

function EditBeneficiary({ tr, target, setBeneficiaries, onDone }) {
  const [nickname, setNickname] = useState(target.nickname);
  const [limit, setLimit] = useState(target.limit ? String(target.limit) : "");
  const save = () => {
    setBeneficiaries((list) => list.map((b) => b.id === target.id ? { ...b, nickname: nickname.trim() || b.name, limit: limit ? Number(limit) : null } : b));
    onDone(tr("benEditMsg", nickname || target.name, maskAcct(target.last4)));
  };
  return (
    <>
      <Notice kind="info">{tr("editNote")}</Notice>
      <Field label={tr("nicknamePlain")}><input style={bs.input} value={nickname} onChange={(e) => setNickname(e.target.value)} /></Field>
      <Field label={tr("perLimit")}><input style={bs.input} inputMode="numeric" value={limit} onChange={(e) => setLimit(e.target.value.replace(/\D/g, ""))} /></Field>
      <button style={bs.primary} onClick={save}>{tr("saveChanges")}</button>
    </>
  );
}

// ===========================================================================
// Feature 4 — Fund Transfer
// ===========================================================================
function TransferFlow({ tr, accounts, setAccounts, beneficiaries, onClose, onComplete }) {
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
    if (!amt || amt <= 0) return setAmtErr(tr("amtInvalid")), false;
    if (amt > source.balance) return setAmtErr(tr("amtInsufficient", inr(source.balance))), false;
    if (amt > CHAT_TXN_LIMIT) return setAmtErr(tr("amtOverChat", inr(CHAT_TXN_LIMIT))), false;
    if (payee.kind === "ben" && payee.ben.limit && amt > payee.ben.limit) return setAmtErr(tr("amtOverPayee", inr(payee.ben.limit))), false;
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
    onComplete(tr("trfMsg", inr(amt), payeeName, mode, utr));
    setStep("done");
  };

  const allowedModes = payee?.kind === "own" ? ["Intra-bank"] : (payee?.ben?.modes || TRANSFER_MODES);

  return (
    <>
      <FlowHeader title={tr("trfTitle")} onClose={onClose}
        onBack={step === "source" || step === "done" ? null : () => setStep("source")} />
      <div style={bs.body}>
        {step === "source" && (
          <>
            <p style={{ color: C.muted, fontSize: 13, margin: "0 0 10px" }}>{tr("trfFrom")}</p>
            {accounts.map((a) => (
              <button key={a.id} style={bs.rowBtn} onClick={() => { setSource(a); setStep("payee"); }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{a.product}</div>
                  <div style={{ fontSize: 12.5, color: C.muted }}>{maskAcct(a.last4)} · {tr("bal")} {inr(a.balance)}</div>
                </div>
              </button>
            ))}
          </>
        )}
        {step === "payee" && (
          <>
            <p style={{ color: C.muted, fontSize: 13, margin: "0 0 10px" }}>{tr("trfTo")}</p>
            {accounts.filter((a) => a.id !== source.id).map((a) => (
              <button key={a.id} style={bs.rowBtn} onClick={() => { setPayee({ kind: "own", acct: a }); setStep("amount"); }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{tr("my")} {a.product}</div>
                  <div style={{ fontSize: 12.5, color: C.muted }}>{maskAcct(a.last4)}</div>
                </div>
                <span style={bs.pill("#EEF6FF", "#1E4E8C")}>{tr("own")}</span>
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
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{b.nickname} {statusPill("cooling", tr)}</div>
                  <div style={{ fontSize: 12.5, color: C.muted }}>{tr("availAfterCool")}</div>
                </div>
              </div>
            ))}
            <Notice kind="info">{tr("trfOnlyNote")}</Notice>
          </>
        )}
        {step === "amount" && (
          <>
            <SummaryCard rows={[[tr("from"), `${source.product} (${maskAcct(source.last4)})`], [tr("to"), `${payeeName}`]]} />
            <Field label={tr("amount")} error={amtErr}>
              <input style={bs.input} inputMode="numeric" autoFocus value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))} />
            </Field>
            <Field label={tr("remarks")}><input style={bs.input} value={remarks} onChange={(e) => setRemarks(e.target.value)} /></Field>
            <button style={bs.primary} onClick={checkAmount}>{tr("continue")}</button>
          </>
        )}
        {step === "summary" && (
          <>
            <p style={{ fontWeight: 700, margin: "0 0 4px" }}>{tr("reviewTransfer")}</p>
            <SummaryCard rows={[
              [tr("from"), `${source.product} (${maskAcct(source.last4)})`],
              [tr("to"), `${payeeName}`],
              [tr("payeeAccount"), payeeMasked],
              [tr("amountShort"), inr(amount)],
              [tr("mode"), (
                <select value={mode} onChange={(e) => setMode(e.target.value)} style={{ ...bs.select, width: "auto", padding: "4px 8px", fontSize: 13 }}>
                  {allowedModes.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              )],
              [tr("charges"), tr("chargesVal")],
              remarks && [tr("remarksShort"), remarks],
            ]} />
            {mode === "NEFT" && <Notice kind="info">{tr("neftNote")}</Notice>}
            <button style={bs.primary} onClick={() => setStep("otp")}>{tr("confirmOtp")}</button>
          </>
        )}
        {step === "otp" && <OtpGate tr={tr} purpose={tr("trfPurpose", inr(amount))} onCancel={onClose} onVerified={execute} />}
        {step === "done" && result && (
          <Success tr={tr} title={tr("trfDoneTitle")} refId={result.utr}
            rows={[[tr("amountShort"), inr(result.amt)], [tr("to"), payeeName], [tr("mode"), mode], [tr("status"), tr("completed")]]}
            note={mode === "NEFT" ? tr("neftDoneNote") : null}
            onDone={onClose} />
        )}
      </div>
    </>
  );
}

// ===========================================================================
// Feature 5 — Open FD / RD
// ===========================================================================
function DepositFlow({ tr, lang, accounts, setAccounts, nominee, onClose, onComplete }) {
  const [kind, setKind] = useState(null);            // 'FD' | 'RD'
  const [step, setStep] = useState("choose");
  const [source, setSource] = useState(null);
  const [rates, setRates] = useState(null);          // simulated live fetch
  const [loadingRates, setLoadingRates] = useState(false);
  const [tenure, setTenure] = useState(null);
  const [amount, setAmount] = useState("");
  const [payout, setPayout] = useState("Cumulative");
  const [maturityInstr, setMaturityInstr] = useState("renewPI");
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
    if (!amt || amt < min) return setAmtErr(tr("minAmt", kind, inr(min))), false;
    if (amt > max) return setAmtErr(tr("maxAmt", kind, inr(max))), false;
    if (kind === "FD" && amt > source.balance) return setAmtErr(tr("depInsufficient", inr(source.balance))), false;
    setAmtErr(""); setStep("preview"); return true;
  };

  const rate = effRate(tenure);
  const maturityDate = tenure ? addMonths(tenure.months) : null;
  const fdMat = kind === "FD" && tenure ? fdMaturity(Number(amount), rate, tenure.months) : 0;
  const rdMat = kind === "RD" && tenure ? rdMaturity(Number(amount), rate, tenure.months) : 0;
  const periodic = kind === "FD" && tenure ? fdPayout(Number(amount), rate, payout === "Monthly" ? 12 : 4) : 0;
  const pa = tr("perAnnum");

  const book = () => {
    if (kind === "FD") setAccounts((list) => list.map((a) => a.id === source.id ? { ...a, balance: a.balance - Number(amount) } : a));
    const acctNo = refNo(kind === "FD" ? "FD" : "RD");
    setResult({ acctNo });
    const summary = kind === "FD"
      ? tr("fdMsg", inr(amount), tenure.label, rate.toFixed(2), inr(fdMat), fmtDate(maturityDate), acctNo)
      : tr("rdMsg", inr(amount), tenure.label, rate.toFixed(2), acctNo);
    onComplete(summary);
    setStep("done");
  };

  const payoutWord = tr(payout.toLowerCase());       // cumulative/monthly/quarterly

  return (
    <>
      <FlowHeader title={tr("depTitle")} onClose={onClose}
        onBack={step === "choose" || step === "done" ? null : () => setStep("choose")} />
      <div style={bs.body}>
        {step === "choose" && (
          <>
            <button style={bs.rowBtn} onClick={() => { setKind("FD"); setRates(null); setPayout("Cumulative"); setStep("source"); }}>
              <FontAwesomeIcon icon={faPiggyBank} style={{ color: C.maroon, fontSize: 18 }} />
              <div><div style={{ fontWeight: 700 }}>{tr("fdName")}</div><div style={{ fontSize: 12.5, color: C.muted }}>{tr("fdDesc")}</div></div>
            </button>
            <button style={bs.rowBtn} onClick={() => { setKind("RD"); setRates(null); setStep("source"); }}>
              <FontAwesomeIcon icon={faPiggyBank} style={{ color: C.maroon, fontSize: 18 }} />
              <div><div style={{ fontWeight: 700 }}>{tr("rdName")}</div><div style={{ fontSize: 12.5, color: C.muted }}>{tr("rdDesc")}</div></div>
            </button>
          </>
        )}
        {step === "source" && (
          <>
            <p style={{ color: C.muted, fontSize: 13, margin: "0 0 10px" }}>{kind === "FD" ? tr("depFundFrom") : tr("depSiFrom")}</p>
            {accounts.map((a) => (
              <button key={a.id} style={bs.rowBtn} onClick={() => { setSource(a); goToRates(); }}>
                <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: 14 }}>{a.product}</div><div style={{ fontSize: 12.5, color: C.muted }}>{maskAcct(a.last4)} · {tr("bal")} {inr(a.balance)}</div></div>
              </button>
            ))}
          </>
        )}
        {step === "rates" && (
          <>
            <p style={{ fontWeight: 700, margin: "0 0 4px" }}>{tr("ratesTitle", kind)} {senior && <span style={bs.pill("#EAF7EF", C.ok)}>{tr("seniorPill", SENIOR_EXTRA)}</span>}</p>
            <p style={{ fontSize: 12, color: C.muted, margin: "0 0 8px" }}>{tr("ratesLive")}</p>
            {loadingRates && <p style={{ color: C.muted }}>{tr("fetching")}</p>}
            {rates && rates.map((t) => (
              <button key={t.key} style={{ ...bs.rowBtn, borderColor: tenure?.key === t.key ? C.maroon : C.border }} onClick={() => { setTenure(t); setStep("details"); }}>
                <div style={{ flex: 1 }}><div style={{ fontWeight: 700 }}>{t.label}</div></div>
                <div style={{ fontWeight: 700, color: C.maroon }}>{effRate(t).toFixed(2)}{pa}</div>
              </button>
            ))}
          </>
        )}
        {step === "details" && (
          <>
            <SummaryCard rows={[[tr("type"), kind === "FD" ? tr("fdName") : tr("rdName")], [tr("tenure"), tenure.label], [tr("rate"), `${rate.toFixed(2)}${pa}`]]} />
            <Field label={kind === "FD" ? tr("depAmount") : tr("monthlyInstallment")} error={amtErr}>
              <input style={bs.input} inputMode="numeric" autoFocus value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))} />
            </Field>
            {kind === "FD" && (
              <>
                <Field label={tr("interestPayout")}>
                  <select style={bs.select} value={payout} onChange={(e) => setPayout(e.target.value)}>
                    <option value="Cumulative">{tr("cumulative")}</option>
                    <option value="Monthly">{tr("monthly")}</option>
                    <option value="Quarterly">{tr("quarterly")}</option>
                  </select>
                </Field>
                <Field label={tr("onMaturity")}>
                  <select style={bs.select} value={maturityInstr} onChange={(e) => setMaturityInstr(e.target.value)}>
                    <option value="renewPI">{tr("renewPI")}</option>
                    <option value="renewP">{tr("renewP")}</option>
                    <option value="creditAcct">{tr("creditAcct")}</option>
                  </select>
                </Field>
              </>
            )}
            {kind === "RD" && (
              <Field label={tr("debitDate")}>
                <select style={bs.select} value={debitDay} onChange={(e) => setDebitDay(e.target.value)}>
                  {["1", "5", "10", "15", "20", "25"].map((d) => <option key={d} value={d}>{tr("debitDay", d)}</option>)}
                </select>
              </Field>
            )}
            <button style={bs.primary} onClick={validateAmt}>{tr("seePreview")}</button>
          </>
        )}
        {step === "preview" && (
          <>
            <p style={{ fontWeight: 700, margin: "0 0 4px" }}>{tr("depPreview")}</p>
            <SummaryCard rows={[
              [kind === "FD" ? tr("principal") : tr("monthlyInstallment"), inr(amount)],
              [tr("tenure"), tenure.label],
              [tr("interestRate"), `${rate.toFixed(2)}${pa}${senior ? tr("seniorIncl") : ""}`],
              [tr("maturityDate"), fmtDate(maturityDate)],
              kind === "FD" && payout === "Cumulative" && [tr("maturityAmount"), inr(fdMat)],
              kind === "FD" && payout !== "Cumulative" && [tr("payoutLabel", payoutWord), inr(periodic)],
              kind === "RD" && [tr("totalInvested"), inr(Number(amount) * tenure.months)],
              kind === "RD" && [tr("maturityAmount"), inr(rdMat)],
              [tr("nominee"), nominee ? `${nominee.name} (${relLabel(lang, nominee.relationship)})` : tr("nomNotSet")],
            ]} />
            <Notice kind="warn">
              {tr("tdsNote")}
              {kind === "FD" ? tr("fdPenalty") : tr("rdPenalty")}
            </Notice>
            <button style={bs.primary} onClick={() => setStep("otp")}>{tr("confirmOtp")}</button>
          </>
        )}
        {step === "otp" && <OtpGate tr={tr} purpose={tr("depPurpose", kind)} onCancel={onClose} onVerified={book} />}
        {step === "done" && result && (
          <Success tr={tr} title={tr("depDoneTitle", kind)} refId={result.acctNo}
            rows={kind === "FD"
              ? [[tr("principal"), inr(amount)], [tr("rate"), `${rate.toFixed(2)}${pa}`], [tr("maturity"), `${inr(fdMat)} · ${fmtDate(maturityDate)}`]]
              : [[tr("installment"), `${inr(amount)}${tr("perMonth")}`], [tr("rate"), `${rate.toFixed(2)}${pa}`], [tr("maturity"), `${inr(rdMat)} · ${fmtDate(maturityDate)}`]]}
            note={tr("depDoneNote")} onDone={onClose} />
        )}
      </div>
    </>
  );
}

// ===========================================================================
// Root panel + service menu
// ===========================================================================
export default function BankingServices({ lang = "en", onClose, onComplete }) {
  const tr = makeTr(lang);
  const [view, setView] = useState("menu");
  // In-memory "CBS" state — persists while the panel is mounted (one session).
  const [accounts, setAccounts] = useState(initialAccounts);
  const [cards] = useState(initialCards);
  const [nominee, setNominee] = useState(initialNominee);
  const [beneficiaries, setBeneficiaries] = useState(initialBeneficiaries);

  const close = () => { setView("menu"); onClose(); };

  const MENU = [
    { key: "pin", icon: faCreditCard, title: tr("mPinT"), desc: tr("mPinD") },
    { key: "nominee", icon: faUserShield, title: tr("mNomT"), desc: tr("mNomD") },
    { key: "beneficiary", icon: faUsers, title: tr("mBenT"), desc: tr("mBenD") },
    { key: "transfer", icon: faMoneyBillTransfer, title: tr("mTrfT"), desc: tr("mTrfD") },
    { key: "deposit", icon: faPiggyBank, title: tr("mDepT"), desc: tr("mDepD") },
  ];

  return (
    <div style={bs.overlay} onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div style={bs.sheet} onClick={(e) => e.stopPropagation()}>
        {view === "menu" && (
          <>
            <FlowHeader title={tr("panelTitle")} onClose={close} />
            <div style={bs.body}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", color: C.muted, fontSize: 12.5, marginBottom: 12 }}>
                <FontAwesomeIcon icon={faShieldHalved} style={{ color: C.maroon }} />
                {tr("secureNote")}
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
        {view === "pin" && <PinFlow tr={tr} cards={cards} onClose={close} onComplete={onComplete} />}
        {view === "nominee" && <NomineeFlow tr={tr} lang={lang} nominee={nominee} setNominee={setNominee} onClose={close} onComplete={onComplete} />}
        {view === "beneficiary" && <BeneficiaryFlow tr={tr} beneficiaries={beneficiaries} setBeneficiaries={setBeneficiaries} onClose={close} onComplete={onComplete} />}
        {view === "transfer" && <TransferFlow tr={tr} accounts={accounts} setAccounts={setAccounts} beneficiaries={beneficiaries} onClose={close} onComplete={onComplete} />}
        {view === "deposit" && <DepositFlow tr={tr} lang={lang} accounts={accounts} setAccounts={setAccounts} nominee={nominee} onClose={close} onComplete={onComplete} />}
      </div>
    </div>
  );
}
