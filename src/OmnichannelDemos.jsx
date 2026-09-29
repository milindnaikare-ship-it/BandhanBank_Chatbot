import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark, faEnvelope, faPhoneVolume, faHandHoldingDollar,
  faRobot, faHeadset, faCircleCheck, faShieldHalved,
  faInbox, faPaperPlane, faRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import BandhanLogo from "./BandhanLogo";
import {
  FUNCTIONAL_INBOXES, SAMPLE_EMAILS, classifyEmail,
  IVR_INTENTS, COLLECTION_BUCKETS, COLLECTION_LANGS, COLLECTION_CUSTOMER,
  DISPOSITIONS, collectionOpening, refId,
} from "./omniData";

const C = { red: "#D91F2C", navy: "#092E4F", navy2: "#214260", ink: "#10222F", muted: "#5C6B7A",
  line: "#E3E9EF", paper: "#F5F7FA", card: "#FFFFFF", ok: "#137a43", warn: "#B26A00" };

const s = {
  overlay: { position: "fixed", inset: 0, background: "rgba(9,46,79,.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: 20 },
  panel: { background: C.paper, width: "100%", maxWidth: 1040, height: "90vh", borderRadius: 18, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 30px 80px rgba(9,46,79,.4)" },
  head: { background: C.navy, color: "#fff", padding: "16px 22px", display: "flex", alignItems: "center", gap: 13 },
  htitle: { fontWeight: 800, fontSize: 17, flex: 1 },
  hsub: { fontSize: 11.5, color: "#A9BED2", fontWeight: 600 },
  xBtn: { background: "rgba(255,255,255,.12)", border: "none", color: "#fff", width: 34, height: 34, borderRadius: 9, cursor: "pointer", fontSize: 16 },
  tabs: { display: "flex", gap: 4, background: C.navy, padding: "0 16px" },
  tab: (on) => ({ padding: "12px 18px", fontSize: 13.5, fontWeight: 700, cursor: "pointer", color: on ? "#fff" : "#8FA6BC", borderBottom: on ? `3px solid ${C.red}` : "3px solid transparent", display: "flex", alignItems: "center", gap: 8, background: "transparent", border: "none" }),
  body: { flex: 1, overflowY: "auto", padding: 22 },
  demoTag: { display: "inline-flex", alignItems: "center", gap: 7, fontSize: 11.5, color: C.muted, background: "#fff", border: `1px solid ${C.line}`, borderRadius: 999, padding: "5px 12px", marginBottom: 16 },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 },
  card: { background: C.card, border: `1px solid ${C.line}`, borderRadius: 14, padding: 18 },
  h3: { fontSize: 14, fontWeight: 800, color: C.navy, margin: "0 0 12px" },
  label: { display: "block", fontSize: 12, fontWeight: 700, color: C.muted, margin: "12px 0 6px", textTransform: "uppercase", letterSpacing: ".5px" },
  input: { width: "100%", boxSizing: "border-box", padding: "9px 12px", border: `1.5px solid ${C.line}`, borderRadius: 9, fontSize: 13.5, fontFamily: "inherit", color: C.ink },
  textarea: { width: "100%", boxSizing: "border-box", padding: "10px 12px", border: `1.5px solid ${C.line}`, borderRadius: 9, fontSize: 13, minHeight: 120, fontFamily: "inherit", color: C.ink, resize: "vertical" },
  primary: { background: C.red, color: "#fff", border: "none", borderRadius: 9, padding: "11px 18px", fontWeight: 800, fontSize: 13.5, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 },
  ghost: { background: "#fff", color: C.navy, border: `1.5px solid ${C.line}`, borderRadius: 9, padding: "9px 14px", fontWeight: 700, fontSize: 13, cursor: "pointer" },
  chip: (on, col) => ({ padding: "7px 12px", borderRadius: 999, border: `1.5px solid ${on ? (col || C.red) : C.line}`, background: on ? (col || C.red) : "#fff", color: on ? "#fff" : C.ink, cursor: "pointer", fontSize: 12.5, fontWeight: 700 }),
  pill: (bg, fg) => ({ display: "inline-block", padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 800, background: bg, color: fg }),
  kv: { display: "flex", justifyContent: "space-between", gap: 12, padding: "8px 0", borderBottom: `1px solid ${C.line}`, fontSize: 13 },
  kvK: { color: C.muted }, kvV: { color: C.ink, fontWeight: 700, textAlign: "right" },
  bubble: (who) => ({ maxWidth: "82%", alignSelf: who === "customer" ? "flex-end" : "flex-start",
    background: who === "customer" ? C.navy : who === "agent" ? "#FFF1F2" : who === "system" ? "#EEF2F7" : "#fff",
    color: who === "customer" ? "#fff" : C.ink, border: who === "bot" ? `1px solid ${C.line}` : "none",
    borderRadius: 12, padding: "9px 13px", fontSize: 13, lineHeight: 1.5 }),
  transcript: { display: "flex", flexDirection: "column", gap: 9, background: C.paper, border: `1px solid ${C.line}`, borderRadius: 12, padding: 14, minHeight: 120 },
  note: { fontSize: 12.5, color: C.muted, background: "#FFF8E8", border: "1px solid #F0E0B8", borderRadius: 10, padding: "10px 13px", marginTop: 14, lineHeight: 1.5 },
};

const sentPill = (v) => {
  const map = { "Positive": ["#EAF7EF", C.ok], "Neutral": ["#EEF2F7", C.muted], "Negative": ["#FFF6E8", C.warn], "Very negative": ["#FDEEF0", C.red] };
  const [bg, fg] = map[v] || map.Neutral; return <span style={s.pill(bg, fg)}>{v}</span>;
};
const prioPill = (v) => {
  const map = { High: ["#FDEEF0", C.red], Medium: ["#FFF6E8", C.warn], Low: ["#EAF7EF", C.ok] };
  const [bg, fg] = map[v] || map.Low; return <span style={s.pill(bg, fg)}>{v}</span>;
};

// ===========================================================================
// Scope 1 — E-mail bot
// ===========================================================================
function EmailBot() {
  const [from, setFrom] = useState(SAMPLE_EMAILS[0].from);
  const [subject, setSubject] = useState(SAMPLE_EMAILS[0].subject);
  const [text, setText] = useState(SAMPLE_EMAILS[0].body);
  const [result, setResult] = useState(null);

  const load = (e) => { setFrom(e.from); setSubject(e.subject); setText(e.body); setResult(null); };
  const analyze = () => setResult(classifyEmail(subject + " " + text));
  const inbox = result ? FUNCTIONAL_INBOXES[result.inbox] : null;

  return (
    <>
      <div style={s.demoTag}><FontAwesomeIcon icon={faShieldHalved} style={{ color: C.red }} /> Simulated demo · rule + AI routing engine · no live inbox contacted</div>
      <div style={s.grid2}>
        <div style={s.card}>
          <div style={s.h3}><FontAwesomeIcon icon={faInbox} style={{ color: C.red, marginRight: 8 }} />Inbound e-mail</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 10 }}>
            {SAMPLE_EMAILS.map((e) => (
              <button key={e.id} style={s.chip(subject === e.subject, C.navy)} onClick={() => load(e)}>{e.subject.slice(0, 22)}…</button>
            ))}
          </div>
          <label style={s.label}>From</label>
          <input style={s.input} value={from} onChange={(ev) => setFrom(ev.target.value)} />
          <label style={s.label}>Subject</label>
          <input style={s.input} value={subject} onChange={(ev) => setSubject(ev.target.value)} />
          <label style={s.label}>Body</label>
          <textarea style={s.textarea} value={text} onChange={(ev) => setText(ev.target.value)} />
          <button style={{ ...s.primary, marginTop: 14, width: "100%", justifyContent: "center" }} onClick={analyze}>
            <FontAwesomeIcon icon={faRobot} /> Analyse &amp; route
          </button>
        </div>

        <div style={s.card}>
          <div style={s.h3}><FontAwesomeIcon icon={faRobot} style={{ color: C.red, marginRight: 8 }} />AI analysis</div>
          {!result ? (
            <p style={{ color: C.muted, fontSize: 13 }}>Select or edit an email, then run <b>Analyse &amp; route</b> to see the detected intent, sentiment, priority, the functional inbox it is routed to, and the auto-drafted acknowledgement.</p>
          ) : (
            <>
              <div style={s.kv}><span style={s.kvK}>Detected intent</span><span style={s.kvV}>{result.intent}</span></div>
              <div style={s.kv}><span style={s.kvK}>Sentiment</span><span style={s.kvV}>{sentPill(result.sentiment)}</span></div>
              <div style={s.kv}><span style={s.kvK}>Priority</span><span style={s.kvV}>{prioPill(result.priority)} &nbsp;<span style={{ color: C.muted, fontWeight: 500 }}>SLA {result.sla}</span></span></div>
              <div style={{ ...s.kv, borderBottom: "none" }}><span style={s.kvK}>Routed to</span><span style={s.kvV}><span style={s.pill("#EEF2F7", inbox.color)}>{inbox.name}</span></span></div>
              <div style={{ fontSize: 11.5, color: C.muted, margin: "2px 0 10px" }}>{inbox.desc}</div>

              <div style={{ ...s.h3, marginTop: 8 }}><FontAwesomeIcon icon={faPaperPlane} style={{ color: C.red, marginRight: 8 }} />Auto-acknowledgement to customer</div>
              <div style={{ background: C.paper, border: `1px solid ${C.line}`, borderRadius: 10, padding: 13, fontSize: 12.5 }}>
                <div style={{ color: C.muted }}><b>Subject:</b> {result.ackDraft.subject}</div>
                <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", margin: "8px 0 0", color: C.ink, lineHeight: 1.5 }}>{result.ackDraft.body}</pre>
              </div>
            </>
          )}
        </div>
      </div>
      <div style={s.note}><b>How it works in production:</b> a ready-made rule + AI routing engine reads each inbound email, classifies intent &amp; sentiment, routes to the right functional inbox (PNO / Helpdesk / Operations), and drafts a context-aware acknowledgement — configured to Bandhan's inbox taxonomy from a sample corpus. Est. 2–3 weeks to configure.</div>
    </>
  );
}

// ===========================================================================
// Scope 2 — Voice bot (Cisco IVR)
// ===========================================================================
function VoiceIVR() {
  const [intent, setIntent] = useState(null);
  const [auth, setAuth] = useState(true);
  const [ran, setRan] = useState(false);
  const chosen = IVR_INTENTS.find((i) => i.id === intent);

  const reset = () => { setIntent(null); setRan(false); };

  return (
    <>
      <div style={s.demoTag}><FontAwesomeIcon icon={faShieldHalved} style={{ color: C.red }} /> Simulated Cisco IVR call · auth-state-aware STP steering &amp; agent handoff</div>
      <div style={s.grid2}>
        <div style={s.card}>
          <div style={s.h3}><FontAwesomeIcon icon={faPhoneVolume} style={{ color: C.red, marginRight: 8 }} />Simulate an inbound call</div>
          <label style={s.label}>Caller's intent (spoken)</label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {IVR_INTENTS.map((i) => (
              <button key={i.id} style={{ ...s.chip(intent === i.id, C.navy), textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }} onClick={() => { setIntent(i.id); setRan(false); }}>
                {i.label}
                <span style={s.pill(i.stp ? "#EAF7EF" : "#FFF6E8", i.stp ? C.ok : C.warn)}>{i.stp ? "STP" : "Handoff"}</span>
              </button>
            ))}
          </div>
          <label style={s.label}>Authentication state</label>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={s.chip(auth, C.ok)} onClick={() => setAuth(true)}>Verified via IVR OTP</button>
            <button style={s.chip(!auth, C.warn)} onClick={() => setAuth(false)}>Not verified</button>
          </div>
          <button style={{ ...s.primary, marginTop: 16, width: "100%", justifyContent: "center", opacity: intent ? 1 : .5 }} disabled={!intent} onClick={() => setRan(true)}>
            <FontAwesomeIcon icon={faPhoneVolume} /> Place call
          </button>
        </div>

        <div style={s.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={s.h3}>Call transcript</div>
            {ran && <button style={s.ghost} onClick={reset}><FontAwesomeIcon icon={faRotateRight} /> Reset</button>}
          </div>
          {!ran ? (
            <p style={{ color: C.muted, fontSize: 13 }}>Pick an intent and auth state, then <b>Place call</b> to see how the IVR bot steers a straight-through resolution — or hands off to a live agent with full context.</p>
          ) : (
            <div style={s.transcript}>
              <div style={s.bubble("system")}><b>☎ Incoming call</b> · caller: “{chosen.label}”</div>
              {!auth && chosen.needsAuth ? (
                <>
                  <div style={s.bubble("bot")}><FontAwesomeIcon icon={faRobot} /> This action needs verification. Please authenticate with the OTP sent to your registered mobile.</div>
                  <div style={s.bubble("system")}>Caller not verified → secure action blocked.</div>
                  <div style={s.bubble("agent")}><FontAwesomeIcon icon={faHeadset} /> Transferring to a live agent to assist with verification.</div>
                </>
              ) : (
                <>
                  {chosen.steps.map((st, i) => (
                    <div key={i} style={s.bubble(i === chosen.steps.length - 1 && chosen.resolved ? "bot" : "bot")}>
                      <FontAwesomeIcon icon={faRobot} style={{ marginRight: 6, color: C.navy }} />{st}
                    </div>
                  ))}
                  {chosen.resolved ? (
                    <div style={{ ...s.bubble("system"), background: "#EAF7EF", color: C.ok, fontWeight: 700 }}><FontAwesomeIcon icon={faCircleCheck} /> Resolved by the bot — straight-through. No agent needed.</div>
                  ) : (
                    <>
                      <div style={{ ...s.bubble("agent"), fontWeight: 600 }}><FontAwesomeIcon icon={faHeadset} /> Exception → handing off to <b>{chosen.handoff}</b> with context:</div>
                      <div style={{ ...s.bubble("system"), fontSize: 12 }}>
                        <b>Context passed to agent</b><br />Verified: Yes · Intent: {chosen.label}<br />Actions taken: {chosen.steps.slice(0, 3).join("; ")}<br />Ref: {refId("IVR-")}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <div style={s.note}><b>How it works in production:</b> the bot integrates with the bank's Cisco IVR via API. It reuses the same auth-state-aware guided-STP architecture as the chat (balance, PIN reset, mini-statement resolve on the call itself); anything out of scope hands off to a live agent with the full context. Per transactional flow ~3–5 weeks; optional voice services (e.g. Sarvam) enable full spoken resolution.</div>
    </>
  );
}

// ===========================================================================
// Scope 3 — Collections voice bot
// ===========================================================================
function Collections() {
  const [bucket, setBucket] = useState("sma0");
  const [lang, setLang] = useState("hi");
  const [transcript, setTranscript] = useState(null);
  const [captured, setCaptured] = useState([]);   // dispositions captured this session

  const cust = COLLECTION_CUSTOMER;
  const placeCall = () => {
    setTranscript([
      { who: "system", text: `☎ Outbound call · ${COLLECTION_BUCKETS.find((b) => b.id === bucket).label} · ${COLLECTION_LANGS.find((l) => l.id === lang).label}` },
      { who: "bot", text: collectionOpening(lang, bucket, cust) },
      { who: "bot", text: "How would you like to proceed with this payment?" },
    ]);
  };
  const capture = (d) => {
    setTranscript((t) => [...t,
      { who: "customer", text: `“${d.label}”` },
      { who: "system", text: `Disposition captured: ${d.label} — ${d.note}. Recording saved · transcript logged · ref ${refId("COL-")}.` },
      ...(d.id === "rtp" ? [{ who: "agent", text: "Escalating to a human collections agent with full context." }] : []),
    ]);
    setCaptured((c) => [...c, d.id]);
  };

  const counts = DISPOSITIONS.map((d) => ({ ...d, n: captured.filter((x) => x === d.id).length }));
  const total = captured.length;
  const ptpRate = total ? Math.round((captured.filter((x) => x === "ptp").length / total) * 100) : 0;

  return (
    <>
      <div style={s.demoTag}><FontAwesomeIcon icon={faShieldHalved} style={{ color: C.red }} /> Simulated collections call · Pre-due / SMA-0 / SMA-1 · multilingual · disposition &amp; analytics</div>
      <div style={s.grid2}>
        <div style={s.card}>
          <div style={s.h3}><FontAwesomeIcon icon={faHandHoldingDollar} style={{ color: C.red, marginRight: 8 }} />Campaign setup</div>
          <div style={{ background: C.paper, border: `1px solid ${C.line}`, borderRadius: 10, padding: 12, fontSize: 12.5, marginBottom: 6 }}>
            <b>{cust.name}</b> · {cust.loan} · {cust.masked}<br />EMI <b>₹{cust.emi.toLocaleString("en-IN")}</b> due {cust.dueDate}
          </div>
          <label style={s.label}>Bucket</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {COLLECTION_BUCKETS.map((b) => <button key={b.id} style={s.chip(bucket === b.id, C.navy)} onClick={() => setBucket(b.id)}>{b.label}</button>)}
          </div>
          <label style={s.label}>Language</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {COLLECTION_LANGS.map((l) => <button key={l.id} style={s.chip(lang === l.id, C.navy)} onClick={() => setLang(l.id)}>{l.label}</button>)}
          </div>
          <button style={{ ...s.primary, marginTop: 16, width: "100%", justifyContent: "center" }} onClick={placeCall}>
            <FontAwesomeIcon icon={faPhoneVolume} /> Place collections call
          </button>

          <div style={{ ...s.h3, marginTop: 18 }}>Live disposition dashboard</div>
          <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
            <div style={{ flex: 1, background: C.paper, border: `1px solid ${C.line}`, borderRadius: 10, padding: 10, textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.navy }}>{total}</div><div style={{ fontSize: 11, color: C.muted }}>Calls dispositioned</div>
            </div>
            <div style={{ flex: 1, background: C.paper, border: `1px solid ${C.line}`, borderRadius: 10, padding: 10, textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.ok }}>{ptpRate}%</div><div style={{ fontSize: 11, color: C.muted }}>Promise-to-Pay rate</div>
            </div>
          </div>
          {counts.filter((c) => c.n > 0).map((c) => (
            <div key={c.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "4px 0" }}>
              <span style={{ color: C.muted }}>{c.label}</span><b>{c.n}</b>
            </div>
          ))}
        </div>

        <div style={s.card}>
          <div style={s.h3}>Call transcript</div>
          {!transcript ? (
            <p style={{ color: C.muted, fontSize: 13 }}>Choose a bucket &amp; language, then <b>Place collections call</b>. You'll hear the multilingual opening and can capture the customer's disposition.</p>
          ) : (
            <>
              <div style={s.transcript}>
                {transcript.map((m, i) => (
                  <div key={i} style={s.bubble(m.who)}>
                    {m.who === "bot" && <FontAwesomeIcon icon={faRobot} style={{ marginRight: 6, color: C.navy }} />}
                    {m.who === "agent" && <FontAwesomeIcon icon={faHeadset} style={{ marginRight: 6 }} />}
                    {m.text}
                  </div>
                ))}
              </div>
              <label style={s.label}>Capture disposition</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {DISPOSITIONS.map((d) => (
                  <button key={d.id} style={s.chip(false, d.good ? C.ok : C.warn)} onClick={() => capture(d)}>{d.label}</button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <div style={s.note}><b>How it works in production:</b> with Cisco IVR access, an outbound multilingual bot (Hindi, Bengali, Assamese + English fallback) calls Pre-due / SMA-0 / SMA-1 customers, captures dispositions, and logs recordings, transcripts &amp; analytics on vendor infrastructure. With a voice service (e.g. Sarvam) it can complete disposition &amp; resolution directly on the call.</div>
    </>
  );
}

// ===========================================================================
// Root
// ===========================================================================
const TABS = [
  { id: "email", label: "E-mail Bot", icon: faEnvelope },
  { id: "ivr", label: "Voice Bot (Cisco IVR)", icon: faPhoneVolume },
  { id: "collections", label: "Collections Voice Bot", icon: faHandHoldingDollar },
];

export default function OmnichannelDemos({ onClose }) {
  const [tab, setTab] = useState("email");
  return (
    <div style={s.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={s.panel} onClick={(e) => e.stopPropagation()}>
        <div style={s.head}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}><BandhanLogo size={32} /></div>
          <div style={{ flex: 1 }}>
            <div style={s.htitle}>Omnichannel AI — Solution Demos</div>
            <div style={s.hsub}>E-mail bot · Cisco IVR voice bot · Collections voice bot</div>
          </div>
          <button style={s.xBtn} onClick={onClose} aria-label="Close"><FontAwesomeIcon icon={faXmark} /></button>
        </div>
        <div style={s.tabs}>
          {TABS.map((t) => (
            <button key={t.id} style={s.tab(tab === t.id)} onClick={() => setTab(t.id)}>
              <FontAwesomeIcon icon={t.icon} /> {t.label}
            </button>
          ))}
        </div>
        <div style={s.body}>
          {tab === "email" && <EmailBot />}
          {tab === "ivr" && <VoiceIVR />}
          {tab === "collections" && <Collections />}
        </div>
      </div>
    </div>
  );
}
