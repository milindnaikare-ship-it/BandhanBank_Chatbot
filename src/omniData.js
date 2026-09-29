// ---------------------------------------------------------------------------
// Simulated logic for the Omnichannel AI demos (Email bot, Cisco IVR voice
// bot, Collections voice bot). Everything here is a DEMO: deterministic,
// rule-based classification and canned resolution flows that mirror how the
// production capability behaves. No real email inbox, telephony or CBS is
// contacted. Swap these helpers for the real routing/IVR/CBS integrations
// during productionisation.
// ---------------------------------------------------------------------------

// ---- Scope 1: E-mail bot --------------------------------------------------

export const FUNCTIONAL_INBOXES = {
  PNO: { name: "PNO — Principal Nodal Officer", desc: "Escalations, grievances, fraud & regulatory", color: "#B0121E" },
  HELPDESK: { name: "Customer Helpdesk", desc: "Digital banking, accounts, cards, general queries", color: "#1E4E8C" },
  OPS: { name: "Operations", desc: "Payments, NEFT/RTGS/IMPS, refunds, reconciliation", color: "#137a43" },
};

export const SAMPLE_EMAILS = [
  {
    id: "e1",
    from: "rakesh.sharma@example.com",
    subject: "Unauthorized transaction on my debit card — URGENT",
    body: "I have noticed an unauthorized transaction of ₹18,500 on my debit card ending 6789 that I did NOT make. I have already blocked the card. This is the second time this is happening and no one is helping me. Please resolve this immediately or I will approach the ombudsman.",
  },
  {
    id: "e2",
    from: "priya.mehta@example.com",
    subject: "Not able to login to net banking",
    body: "Hi team, since yesterday I am unable to log in to internet banking. It keeps saying invalid credentials even though my password is correct. Could you please help me reset it? Thanks in advance.",
  },
  {
    id: "e3",
    from: "anil.desai@example.com",
    subject: "NEFT transfer failed but amount debited",
    body: "I made a NEFT transfer of ₹42,000 yesterday. The amount got debited from my account but the beneficiary has not received it and there is no UTR. Please check and either credit the beneficiary or reverse the amount to my account.",
  },
  {
    id: "e4",
    from: "sunita.rao@example.com",
    subject: "Thank you for the quick FD booking",
    body: "Just wanted to say the new mBandhan app made it very easy to open a fixed deposit. Great experience, please pass on my appreciation to the team.",
  },
];

const NEG_WORDS = ["not", "no one", "unauthorized", "fraud", "cheated", "worst", "pathetic", "harass", "ombudsman", "complaint", "escalate", "urgent", "failed", "unable", "angry", "disappointed", "never", "again"];
const POS_WORDS = ["thank", "thanks", "appreciate", "great", "excellent", "good experience", "happy", "kudos"];

// Deterministic keyword classifier that mirrors the production intent + routing engine.
export function classifyEmail(text) {
  const t = (text || "").toLowerCase();
  const has = (arr) => arr.some((w) => t.includes(w));

  // Sentiment
  const negHits = NEG_WORDS.filter((w) => t.includes(w)).length;
  const posHits = POS_WORDS.filter((w) => t.includes(w)).length;
  let sentiment = "Neutral";
  if (posHits > negHits) sentiment = "Positive";
  else if (negHits >= 3) sentiment = "Very negative";
  else if (negHits >= 1) sentiment = "Negative";

  // Intent + routing
  let intent, inbox;
  if (has(["unauthorized", "fraud", "cheated", "phishing", "did not make", "not make"])) {
    intent = "Fraud / unauthorized transaction"; inbox = "PNO";
  } else if (has(["ombudsman", "escalate", "complaint", "no one is helping", "second time", "harass", "worst", "pathetic"])) {
    intent = "Grievance escalation"; inbox = "PNO";
  } else if (has(["neft", "rtgs", "imps", "debited", "refund", "reverse", "utr", "beneficiary has not"])) {
    intent = "Payment / transaction operations"; inbox = "OPS";
  } else if (has(["login", "net banking", "internet banking", "password", "otp", "app", "mbandhan", "statement", "balance"])) {
    intent = "Digital banking support"; inbox = "HELPDESK";
  } else if (has(["loan", "emi", "fd", "fixed deposit", "nominee", "kyc", "interest"])) {
    intent = "Product / account servicing"; inbox = "HELPDESK";
  } else {
    intent = "General enquiry"; inbox = "HELPDESK";
  }

  // Priority
  let priority = "Low";
  if (inbox === "PNO" || sentiment === "Very negative") priority = "High";
  else if (sentiment === "Negative") priority = "Medium";
  if (t.includes("urgent") || t.includes("immediately")) priority = "High";

  // SLA suggestion
  const sla = priority === "High" ? "4 business hours" : priority === "Medium" ? "1 business day" : "2 business days";

  // Context-aware acknowledgement (LLM-drafted in production)
  const ackDraft = buildAck(intent, inbox, priority, sla);

  return { intent, inbox, sentiment, priority, sla, ackDraft };
}

function buildAck(intent, inboxKey, priority, sla) {
  const inbox = FUNCTIONAL_INBOXES[inboxKey].name;
  const ref = "BB-" + Math.floor(100000 + Math.random() * 900000);
  const empathy = priority === "High"
    ? "We're sorry for the trouble and understand this needs urgent attention."
    : "Thank you for reaching out to Bandhan Bank.";
  return {
    ref,
    subject: `Re: your request [Ref ${ref}]`,
    body:
`Dear Customer,

${empathy} We have received your email and identified it as: "${intent}".

Your request has been routed to our ${inbox} and logged with reference ${ref} (priority: ${priority}). Our team will respond within ${sla}.

You can quote reference ${ref} in any follow-up. Bandhan Bank never asks for your OTP, PIN or CVV.

Warm regards,
Bandhan Sahayak — Automated Assistant`,
  };
}

// ---- Scope 2: Voice bot (Cisco IVR) --------------------------------------

export const IVR_INTENTS = [
  { id: "bal", label: "Check account balance", stp: true, needsAuth: true,
    steps: ["Balance enquiry recognised.", "Verified caller via IVR OTP.", "Fetching balance from core banking…", "Your available balance is ₹50,000. Anything else?"],
    resolved: true },
  { id: "pin", label: "Reset debit-card PIN", stp: true, needsAuth: true,
    steps: ["PIN reset requested.", "Verified caller via IVR OTP + card expiry.", "Captured new PIN on secure DTMF keypad (masked).", "Your debit-card PIN has been reset. Reference SRPIN-482910."],
    resolved: true },
  { id: "mini", label: "Last 5 transactions", stp: true, needsAuth: true,
    steps: ["Mini-statement requested.", "Verified caller via IVR OTP.", "Reading last 5 transactions…", "An SMS with your mini-statement has been sent. Anything else?"],
    resolved: true },
  { id: "fraud", label: "Report a fraudulent transaction", stp: false, needsAuth: true,
    steps: ["Fraud report detected — high sensitivity.", "Verified caller via IVR OTP.", "Card hot-listed as a precaution.", "This case needs a specialist — connecting you to a fraud agent."],
    resolved: false, handoff: "Fraud / dispute desk" },
  { id: "loan", label: "Loan foreclosure request", stp: false, needsAuth: true,
    steps: ["Loan foreclosure enquiry detected.", "Verified caller via IVR OTP.", "Foreclosure needs manual calculation & confirmation.", "Connecting you to a loans specialist."],
    resolved: false, handoff: "Loans specialist" },
];

// ---- Scope 3: Collections voice bot --------------------------------------

export const COLLECTION_BUCKETS = [
  { id: "predue", label: "Pre-due reminder", desc: "Courtesy reminder before the due date", tone: "gentle" },
  { id: "sma0", label: "SMA-0 (1–30 dpd)", desc: "Overdue up to 30 days", tone: "firm-polite" },
  { id: "sma1", label: "SMA-1 (31–60 dpd)", desc: "Overdue 31–60 days", tone: "firm" },
];

export const COLLECTION_LANGS = [
  { id: "hi", label: "हिंदी · Hindi" },
  { id: "bn", label: "বাংলা · Bengali" },
  { id: "as", label: "অসমীয়া · Assamese" },
  { id: "en", label: "English (fallback)" },
];

export const COLLECTION_CUSTOMER = { name: "Ravi Kumar", loan: "Personal Loan", emi: 8450, dueDate: "05 Oct 2026", masked: "XXXXXX4821" };

export const DISPOSITIONS = [
  { id: "ptp", label: "Promise to Pay (PTP)", good: true, note: "Customer committed to pay by a date" },
  { id: "paid", label: "Already Paid", good: true, note: "Customer states payment already made" },
  { id: "callback", label: "Requested Callback", good: false, note: "Call back at a preferred time" },
  { id: "dispute", label: "Dispute / Query", good: false, note: "Routed to Ops for clarification" },
  { id: "rtp", label: "Refuse to Pay (RTP)", good: false, note: "Escalated to a human collections agent" },
  { id: "nc", label: "Not Contactable", good: false, note: "No answer / wrong number — retry scheduled" },
];

// Greeting line per language + bucket (Roman transliteration shown for demo clarity).
export function collectionOpening(langId, bucket, cust) {
  const amt = "₹" + cust.emi.toLocaleString("en-IN");
  const lines = {
    hi: `नमस्ते ${cust.name} जी, मैं बंधन बैंक की ओर से बात कर रही हूँ। आपके ${cust.loan} की ${amt} की EMI ${cust.dueDate} को देय है।`,
    bn: `নমস্কার ${cust.name}, আমি বন্ধন ব্যাঙ্ক থেকে বলছি। আপনার ${cust.loan}-এর ${amt} EMI ${cust.dueDate}-এ প্রদেয়।`,
    as: `নমস্কাৰ ${cust.name}, মই বন্ধন বেংকৰ পৰা কৈছোঁ। আপোনাৰ ${cust.loan}ৰ ${amt} EMI ${cust.dueDate}ত পৰিশোধযোগ্য।`,
    en: `Hello ${cust.name}, this is Bandhan Bank calling. Your ${cust.loan} EMI of ${amt} is due on ${cust.dueDate}.`,
  };
  return lines[langId] || lines.en;
}

export const refId = (p) => p + Math.floor(100000 + Math.random() * 900000);
