# Bandhan Bank Customer Chatbot — Knowledge Base (v0.1 Draft)

> **Purpose:** Reference corpus for the Bandhan Bank customer-facing chatbot. Serves two personas: (A) existing customers identified via registered mobile number / account number, and (B) anonymous website visitors exploring products.
>
> **Source basis:** Compiled from publicly available information (bandhan.bank.in and reputable aggregators) as of June 2026.
>
> **IMPORTANT — Validation required:** All interest rates, charges, balance requirements and product terms below are indicative and change frequently. Before UAT, every figure in this KB must be validated against the official Bandhan Bank rates & charges page and signed off by the bank's Product and Compliance teams. The chatbot should ideally pull rates from a bank-maintained API/CMS rather than static text.

---

## 1. About Bandhan Bank (for "Who are you / About the bank" intents)

- Bandhan Bank Limited is a private sector universal bank headquartered in Kolkata, West Bengal.
- Bandhan began in 2001 as a not-for-profit microfinance initiative focused on financial inclusion and women's empowerment; it became India's first microfinance institution to convert into a universal bank, commencing banking operations on 23 August 2015.
- The bank serves urban, semi-urban and rural customers across India through several thousand banking outlets, branches, doorstep service centres (DSCs) and ATMs, with a strong base of over 3 crore customers (verify current figure with the bank).
- Business segments: Retail Banking, Business/Wholesale Banking, NRI Banking, Treasury, and third-party distribution (insurance, mutual funds).
- 24x7 customer care: **1800 258 8181** (toll-free). Website: **bandhanbank.com**.

---

## 2. Savings Accounts (Persona B high-priority; Persona A servicing)

| Account | Target customer | Indicative Monthly Avg. Balance (MAB) | Key highlights |
|---|---|---|---|
| **Neo+ Digital Savings Account** | Digital-first customers; opened fully online | ~₹5,000 | Paperless opening with Aadhaar + PAN + Video KYC; instant access to mBandhan app & internet banking; VISA Classic debit card on request; shopping offers |
| **Standard Savings Account** | First-time / everyday savers | ~₹5,000 | Multi-city 'at par' cheques; unlimited cash withdrawals at Bandhan ATMs; SMS alerts, net & mobile banking |
| **Advantage Savings Account** | Growing savers | ~₹25,000 | Higher transaction limits; free cash deposits & cheque issuance; free NEFT via internet banking/mBandhan |
| **Premium Savings Account** | Affluent customers | ~₹10 lakh (or relationship value) | Higher interest tiers; free cash withdrawals at any bank ATM; lifestyle privileges (dining, shopping, travel); airport lounge access |
| **Elite Savings Account** | HNI / preferred banking | ₹5 lakh MAB or Total Relationship Value ≥ ₹10 lakh (SA + linked FDs) | Personalised service, unlimited branch cash transactions, free cheque return/DD cancellation, Elite debit card with accelerated rewards |
| **Elite Plus Savings Account** | Top-tier customers | High TRV (verify) | Elite Plus debit card; enhanced PoS/e-com limit ~₹6,00,000 and ATM limit ~₹1,00,000/day; domestic airport lounge access for cardholder + companion |
| **Legacy Savings Account** | Premium wealth segment | Verify | Global/preferential banking privileges and premium lifestyle benefits |
| **Avni Savings Account** | Women | Verify | Financial, lifestyle, travel & dining benefits tailored for women |
| **Inspire / Senior Citizen Programme** | Senior citizens | Verify | Priority banking, health-related benefits, preferential FD rates |
| **Special Savings Account** | Differently-abled customers | ~₹5,000 (quarterly avg.) | Low balance, free internet/mobile/phone banking, doorstep assistance |
| **Sanchay Savings Account** | Low-income / inclusion segment | Low/zero | Basic banking with low balance requirement, transaction alerts |
| **BSBDA / PMJDY accounts** | Financial inclusion | Zero | Basic savings bank deposit account as per RBI norms |

**Savings interest (indicative):** tiered, roughly 3% on lower balances rising to ~6% on higher balances depending on slab; paid quarterly. *Always fetch live rates.*

**Account opening journeys the bot must support:**
- *New customer:* eligibility (resident individual, 18+, Aadhaar + PAN), documents, Neo+ online journey link, branch locator, "request a call back" lead capture.
- *Existing customer:* balance enquiry routing, debit card services, cheque book request, statement request, update KYC/mobile/email, dormant account reactivation.

---

## 3. Current Accounts & Business Banking

- **Current account variants:** Biz Standard (MAB ~₹5,000; 50 free cheque leaves/month; ~₹5 lakh/month free cash deposit), Biz Advantage, Biz Premium (MAB ~₹1 lakh; unlimited Bandhan ATM withdrawals; free transaction alerts), Biz Samridhi, plus specialised accounts such as **Escrow accounts** and accounts tailored for borrowers of other banks with automated NEFT/RTGS sweep to the lending bank.
- **Micro Loans (group-based microbanking):** Bandhan's flagship segment — small-ticket loans for income generation, delivered through Doorstep Service Centres; includes top-up loans for existing micro-loan customers.
- **SME / Business loans:** working capital, term loans and loans for small, medium and large enterprises.
- **Other business services:** corporate salary accounts, institutional accounts, transaction banking, corporate internet banking.

---

## 4. Deposits

### Fixed Deposits
- Tenures from **7 days to 10 years**; minimum deposit typically **₹1,000**.
- Indicative rate band (retail, < ₹3 crore): roughly **3% to ~7.25–8% p.a.** depending on tenure; **senior citizens get ~0.50–0.75% extra**. *Live rates must come from the bank's published chart.*
- Variants: **Standard FD**, **Neo+ Digital FD** (fully online, video-KYC, no prior relationship needed), **Premium FD** (preferential rates for high-value deposits), **Dhan Samriddhi FD**, **Tax Saver FD** (5-year lock-in, Section 80C benefit up to ₹1.5 lakh, no premature closure/auto-renewal), and NRE/NRO/FCNR deposits for NRIs.
- Features: monthly/quarterly payout or cumulative; premature withdrawal with ~1% penalty (callable FDs); loan/overdraft against FD; auto-renewal; nomination (up to 4 nominees via internet banking).
- TDS rules (verify current thresholds): TDS on interest above prescribed limits; Form 15G/15H submission supported.

### Recurring Deposits
- Tenures ~6 months to 10 years; flexible instalments; single or joint holding; rates broadly aligned to FD slabs.

---

## 5. Loans (Retail)

| Product | What the bot should say |
|---|---|
| **Home Loan** | For purchase, construction, extension or renovation; minimal documentation, quick processing; balance transfer & top-up available. Capture: loan amount, city, income type (salaried/self-employed) → lead. |
| **Personal Loan** | Customisable for personal needs (wedding, travel, medical, education); eligibility based on income & credit score; minimal documentation. |
| **Gold Loan** | Quick loan against gold ornaments for short-term needs; includes Agri Gold Loan variant. |
| **Two-Wheeler Loan** | Available, including a dedicated variant for existing micro-loan customers. |
| **Loan Against Property (LAP)** | Funds against residential/commercial property. |
| **Loan/OD Against Term Deposit** | Liquidity without breaking the FD. |
| **Agri Loans** | Crop and allied-activity finance for farmers. |
| **Micro & Small Enterprise Loans** | Working capital / business growth for micro-entrepreneurs. |

For each loan intent the bot needs: purpose, indicative eligibility, document checklist, EMI calculator hand-off, interest rate disclaimer ("rates depend on profile; see latest rate card"), apply/lead-capture flow, and existing-customer servicing (outstanding balance, EMI date, statement, foreclosure — via authenticated API only).

---

## 6. Cards

- **Debit cards:** RuPay Classic; VISA Classic/Platinum; Mastercard Platinum and Elite variants — differing daily ATM withdrawal limits (₹40k–₹1 lakh) and purchase limits (₹1 lakh–₹6 lakh), insurance covers and lounge access on premium cards.
- **Credit cards (verify current line-up and any co-brand arrangements):** historically marketed One (entry, ~₹299 fee), Plus (~₹699), Xclusive (~₹2,999) with reward points, fuel surcharge waiver and spend-based fee waivers. Contactless limit per tap as per RBI norms.
- Card servicing intents (Persona A): block/hotlist card, reissue, PIN reset guidance, limit query, dispute a transaction, international usage activation — bot guides or executes via secure API; **blocking a card should be possible even with partial authentication** (security best practice).

---

## 7. Digital Banking Channels

- **mBandhan mobile app:** balance & transaction history, fund transfer (IMPS/NEFT/RTGS/UPI), deposit booking and management, bill pay & recharge.
- **Internet banking:** dashboard of CASA relationships, instant deposit booking (2-step journey), FD advice/statement downloads, nominee management, scheduled & recurring transfers.
- **Other channels:** missed-call balance enquiry, SMS banking, phone banking via 1800 258 8181, doorstep banking, WhatsApp banking (verify availability).
- Eligibility for digital channels: existing customer with savings/current account, debit card, and mobile number registered with the bank.

---

## 8. NRI Banking

- NRE / NRO savings accounts and deposits; FCNR deposits (verify).
- NRE FD interest is tax-free in India and fully repatriable; NRO accounts for India-sourced income with repatriation up to USD 1 million/financial year per norms.
- Remittance services and money transfer; senior-citizen rates do **not** apply to NRIs.

---

## 9. Insurance & Investments (third-party distribution)

- Life insurance, health insurance, car/two-wheeler insurance, home insurance, travel insurance, personal accident cover — distributed in partnership with insurers.
- Mutual funds distribution.
- Mandatory bot disclaimer: insurance/investment products are third-party; subject to insurer terms; "Insurance is a subject matter of solicitation"; bot must not give investment advice.

---

## 10. Branch Network, Locations & Contact Details

### 10.1 Corporate offices

| Office | Details |
|---|---|
| **Registered Office** | Bandhan Bank Limited, DN-32, Sector V, Salt Lake City, Kolkata – 700091, West Bengal, India |
| **Head Office (Corporate)** | Floors 12–14, Adventz Infinity@5, BN-5, Sector V, Salt Lake City, Kolkata – 700091, West Bengal |
| **Head Office Phone** | 033-6609-0909 (Mon–Sat, ~9:15 AM–5:45 PM; closed 2nd & 4th Saturdays and bank holidays) |

### 10.2 Customer contact channels (bot must surface these on "contact us" intents)

| Channel | Details |
|---|---|
| **24x7 Customer Care (toll-free)** | **1800 258 8181** |
| **Alternate customer care (tolled)** | 033-4409-9090 / 033-6633-3333 |
| **Missed-call balance enquiry** | 9223008666 / 9223008777 (from registered mobile) |
| **SMS banking** | SMS to 9223011000 from registered mobile; UPI activate/block: SMS UPIACTIVATE / UPIBLOCK to 56767641 |
| **Email — service requests** | customercare@bandhanbank.com |
| **Email — complaints/feedback** | getintouch@bandhanbank.com |
| **Website** | bandhanbank.com (branch & ATM locator, grievance redressal form) |

> **Validation note:** All numbers, email IDs and office hours above must be re-verified against bandhanbank.com → Contact Us / Grievance Redressal pages during KB sign-off, and re-checked at every content-refresh cycle.

### 10.3 Branch & ATM network (for "find a branch" intents)

- Bandhan Bank operates a pan-India network of roughly **1,700+ bank branches** and **4,500+ banking units/doorstep service centres**, totalling over **6,300 banking outlets across 34 states and union territories**, with several hundred ATMs (verify exact current counts with the bank — these change quarterly).
- The network is densest in **East and Northeast India** — West Bengal alone has 450+ branches — with growing presence in Bihar, Assam, Uttar Pradesh, Maharashtra, Tripura, Jharkhand, Odisha, MP and other states as the bank expands beyond its traditional geography.
- Every branch has a unique **IFSC code** (prefix **BDBL**) required for NEFT/RTGS/IMPS.

**How the chatbot should handle branch queries (design requirement, not static data):**
1. Do **not** store the branch list statically in the KB — branches open/close frequently. Integrate with the bank's **Branch/ATM Locator API** (or a bank-maintained branch master with IFSC, address, phone, working hours, lat/long).
2. Flow: user shares city/PIN code/locality (or grants browser location) → bot returns nearest 3–5 branches/ATMs with address, IFSC, contact number, working hours and a Google Maps deep link.
3. Support IFSC lookup both ways: "IFSC of <branch>" and "which branch is <IFSC>".
4. Standard working-hours response (verify with bank): Mon–Fri ~9:30/10 AM–4 PM; Saturday banking except 2nd & 4th Saturdays; closed Sundays and bank holidays; hours can vary by branch/state.
5. Fallback if locator API is down: direct user to the website locator page and the 24x7 helpline.

### 10.4 Grievance redressal escalation (bot script)

1. **Level 1:** Register complaint via branch, 1800 258 8181, getintouch@bandhanbank.com, or the website grievance form — bot captures it with a reference/ticket ID.
2. **Level 2:** Escalate to the Regional Nodal Officer / Principal Nodal Officer at Head Office (033-4045-6353, pno@bandhanbank.com — verify current officer details) if unresolved in the committed TAT.
3. **Level 3:** RBI Integrated Ombudsman Scheme, 2021 — cms.rbi.org.in — if the bank's resolution is unsatisfactory or no reply within 30 days.
- Safe-banking education: the bank never asks for OTP/PIN/CVV/passwords; report fraud immediately via customer care and the national cybercrime helpline **1930** / cybercrime.gov.in.

---

## 11. Chatbot Intent Taxonomy (derived from the above)

**Anonymous (Persona B):** product discovery (savings/current/FD/RD/loans/cards/insurance/NRI), rates & charges, eligibility & documents, EMI/FD calculators, account-opening journeys, branch/ATM locator & IFSC lookup, contact-us & office addresses, grievance escalation guidance, lead capture & call-back, general bank info, safe-banking FAQs.

**Authenticated (Persona A):** balance & mini-statement, transaction search, FD/RD details & maturity, loan account servicing (EMI, outstanding, statements), card services (block, limits, disputes), cheque book/statement requests, profile updates (guided), complaint registration & tracking, product cross-sell with consent.

**Universal guardrails:**
1. Never display or request full card number, CVV, OTP, or passwords; mask account numbers (XXXX1234).
2. Authenticated data only after OTP verification on the registered mobile number; session timeout and re-auth for sensitive actions.
3. All rates/charges responses end with "as on <date>, subject to change" and a link to the official rates page.
4. Out-of-scope or low-confidence queries → human hand-off (call centre / branch / call-back), never guess.
5. No financial, tax or investment advice; provide factual product information only.
6. Language support roadmap: English + Hindi + Bangla at minimum (Bandhan's core geography), extensible to other Indian languages.
