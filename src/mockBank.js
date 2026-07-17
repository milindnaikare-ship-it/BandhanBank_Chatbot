// ---------------------------------------------------------------------------
// Mock "core banking system" for the DEMO self-service flows.
// Nothing here talks to a real bank. All data is fictional and all "writes"
// are simulated in-memory. Replace these helpers with real CBS API calls when
// the client's API catalogue is available (see developer brief §4).
// ---------------------------------------------------------------------------

// Demo second factor. In production this is a real OTP to the registered mobile.
export const DEMO_OTP = "123456";
export const MAX_OTP_ATTEMPTS = 3;

// Channel-specific transaction limit for chat (brief §4.4 — client to finalise).
export const CHAT_TXN_LIMIT = 200000;      // per transaction
export const BENEFICIARY_COOLING_MS = 30 * 60 * 1000; // 30 min (brief §3.3)
export const MAX_BENEFICIARIES = 20;

export const CUSTOMER = {
  name: "Milind Naikare",
  customerId: "BB0099213",
  dob: "1985-07-14",                 // 40y — not a senior citizen
  mobileMasked: "+91-99XXXX0592",
  emailMasked: "mil****@example.com",
  address: "Flat 12B, Green Meadows, Andheri West, Mumbai 400058",
};

export const RELATIONSHIPS = [
  "Spouse", "Son", "Daughter", "Father", "Mother",
  "Brother", "Sister", "Grandson", "Granddaughter", "Other",
];

export const TRANSFER_MODES = ["IMPS", "NEFT", "RTGS", "Intra-bank"];

// ---- Seed data (mutated in-memory by the demo flows) ----------------------

export const initialAccounts = () => [
  { id: "0123456789", last4: "6789", type: "Savings", product: "Advantage Savings", balance: 50000, ifsc: "BDBL0001234", branch: "Andheri West" },
  { id: "0987654321", last4: "4321", type: "Current", product: "Biz Standard", balance: 128500, ifsc: "BDBL0001234", branch: "Andheri West" },
];

export const initialCards = () => [
  { id: "c1", last4: "6789", network: "VISA Classic", status: "ACTIVE", expiry: "08/27", linked: "6789", pinLen: 4 },
  { id: "c2", last4: "4521", network: "RuPay Platinum", status: "BLOCKED", expiry: "03/26", linked: "6789", pinLen: 4 },
  { id: "c3", last4: "3310", network: "Mastercard Platinum", status: "EXPIRED", expiry: "01/24", linked: "4321", pinLen: 4 },
];

export const initialNominee = () => ({
  name: "Anjali Naikare",
  relationship: "Spouse",
  dob: "1988-02-20",
  address: "Flat 12B, Green Meadows, Andheri West, Mumbai 400058",
  guardian: null,
});

export const initialBeneficiaries = () => [
  { id: "b1", name: "Ramesh Kumar", account: "55221100987", last4: "0987", ifsc: "HDFC0000123", bank: "HDFC Bank", branch: "Pune Camp", nickname: "Ramesh", modes: ["IMPS", "NEFT"], limit: 100000, status: "active", createdAt: 0 },
  { id: "b2", name: "Sharma Stores", account: "112200334455", last4: "4455", ifsc: "BDBL0001234", bank: "Bandhan Bank", branch: "Andheri West", nickname: "Sharma Stores", modes: ["Intra-bank", "IMPS"], limit: 50000, status: "active", createdAt: 0 },
];

// A pool of names the simulated penny-drop / name-match API "returns".
export const pennyDropName = (account) => {
  const pool = ["RAMESH KUMAR", "PRIYA MEHTA", "S K TRADERS", "ANIL DESHPANDE", "SHARMA STORES"];
  const idx = account.split("").reduce((a, c) => a + (Number(c) || 0), 0) % pool.length;
  return pool[idx];
};

// ---- FD / RD rate card (brief §5: "rates always fetched live"). ------------
// Simulated as a live fetch in the UI; senior-citizen column applied by DOB.
export const FD_RATE_CARD = [
  { key: "6m", label: "6 months", months: 6, rate: 5.50 },
  { key: "1y", label: "1 year", months: 12, rate: 7.25 },
  { key: "2y", label: "2 years", months: 24, rate: 7.00 },
  { key: "3y", label: "3 years", months: 36, rate: 6.75 },
  { key: "5y", label: "5 years", months: 60, rate: 6.50 },
];
export const RD_RATE_CARD = [
  { key: "1y", label: "1 year", months: 12, rate: 6.75 },
  { key: "2y", label: "2 years", months: 24, rate: 6.90 },
  { key: "3y", label: "3 years", months: 36, rate: 6.75 },
  { key: "5y", label: "5 years", months: 60, rate: 6.50 },
];
export const SENIOR_EXTRA = 0.50;         // extra % p.a. for senior citizens
export const FD_MIN = 1000, FD_MAX = 10000000;
export const RD_MIN = 500, RD_MAX = 1000000;

// ---- Pure helpers ---------------------------------------------------------

export const maskAcct = (last4) => `XXXX ${last4}`;
export const maskCard = (last4) => `XXXX XXXX XXXX ${last4}`;

export const inr = (n) =>
  "₹" + Number(n).toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export const ageFromDob = (iso) => {
  const d = new Date(iso), now = new Date();
  let a = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) a--;
  return a;
};
export const isMinor = (iso) => iso && ageFromDob(iso) < 18;
export const isSenior = (iso) => iso && ageFromDob(iso) >= 60;

// Reference-number generator (prefix + yymmdd + 6 random digits).
export const refNo = (prefix) => {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}${ymd}${rand}`;
};

export const IFSC_RE = /^[A-Z]{4}0[A-Z0-9]{6}$/;
export const validIfsc = (v) => IFSC_RE.test((v || "").toUpperCase());

// IFSC "master lookup" — derive a plausible bank/branch for the demo.
export const ifscLookup = (v) => {
  const code = (v || "").toUpperCase();
  if (!validIfsc(code)) return null;
  const banks = { HDFC: "HDFC Bank", ICIC: "ICICI Bank", SBIN: "State Bank of India", BDBL: "Bandhan Bank", UTIB: "Axis Bank", PUNB: "Punjab National Bank" };
  const bank = banks[code.slice(0, 4)] || "Partner Bank";
  return { bank, branch: `Branch ${code.slice(-4)}` };
};

// PIN rules (brief §3.1 — confirm exact ruleset with bank).
export const trivialPins = new Set(["0000", "1111", "2222", "3333", "4444", "5555", "6666", "7777", "8888", "9999", "1234", "4321", "0123", "1985"]);
export const validatePin = (pin, len) => {
  if (!/^\d+$/.test(pin) || pin.length !== len) return `PIN must be ${len} digits.`;
  if (trivialPins.has(pin)) return "This PIN is too easy to guess. Avoid sequences, repeats or your birth year.";
  return null;
};

// Suggest a transfer mode from amount + time (brief §3.4 auto-suggest).
export const suggestMode = (amount, beneficiary) => {
  const intra = beneficiary?.modes?.includes("Intra-bank");
  if (intra) return "Intra-bank";
  if (amount >= 200000) return "RTGS";
  return "IMPS"; // IMPS is 24x7 and instant for the demo
};

// FD maturity (quarterly compounding for cumulative payout).
export const fdMaturity = (principal, ratePct, months) => {
  const years = months / 12;
  const r = ratePct / 100;
  const amount = principal * Math.pow(1 + r / 4, 4 * years);
  return Math.round(amount);
};
// Non-cumulative periodic interest payout.
export const fdPayout = (principal, ratePct, freqPerYear) =>
  Math.round((principal * (ratePct / 100)) / freqPerYear);

// RD maturity: each monthly installment compounds quarterly until maturity.
export const rdMaturity = (installment, ratePct, months) => {
  const r = ratePct / 100 / 4;   // quarterly rate
  let total = 0;
  for (let k = 0; k < months; k++) {
    const monthsLeft = months - k;
    total += installment * Math.pow(1 + r, monthsLeft / 3);
  }
  return Math.round(total);
};

export const addMonths = (months) => {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d;
};
export const fmtDate = (d) =>
  d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
