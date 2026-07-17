# Bandhan Sahayak — AI Virtual Assistant
### Feature & Sales Enablement Document

**Prepared by:** Business Analysis · Applied Cloud Computing
**Audience:** Sales & Pre-Sales teams
**Product:** Bandhan Sahayak — conversational AI banking assistant (proof-of-concept)
**Status:** Working demo prototype

---

## 1. Executive Summary

**Bandhan Sahayak** is an AI-powered virtual assistant that embeds directly into a bank's website and mobile channels. It combines a **knowledge-grounded conversational engine** (so answers are accurate, not invented) with **guided self-service banking journeys** that let existing customers complete real service requests — reset a card PIN, add a payee, transfer funds, open a deposit — without a branch visit, a call, or navigating the full net-banking portal.

It speaks the customer's language — literally — supporting **English, Hindi, Bengali, Marathi and Hinglish** across both **text and voice**, and it feels like a native part of the bank's own website.

> **One-line pitch:** *"A multilingual, voice-enabled AI banker that answers accurately from your own knowledge base and lets customers self-serve securely — deflecting calls, cutting branch load, and improving CX, deployed on your website in weeks."*

---

## 2. The Business Problem We Solve

| Pain point | Impact on the bank | How Bandhan Sahayak helps |
|---|---|---|
| High call-centre & branch volume for routine queries | Cost per contact, long queues | Deflects FAQs and routine service to self-service chat, 24×7 |
| Customers abandon complex net-banking journeys | Lost engagement, more support tickets | Guided step-by-step flows with secure widgets |
| Language barriers across India | Exclusion of regional customers | 5 languages, text **and** voice |
| Generic chatbots "hallucinate" wrong answers | Compliance & trust risk | Retrieval-Augmented answers grounded in the bank's own content |
| After-hours service gaps | Customer frustration | Always-on, instant responses |

---

## 3. Feature Catalogue

### 3.1 Conversational AI (grounded, not guesswork)
- **Retrieval-Augmented Generation (RAG):** every answer is grounded in the bank's own knowledge base (products, rates, policies, processes). The assistant retrieves the most relevant content and answers from it — dramatically reducing "hallucinated" or off-brand replies.
- **Natural, on-brand tone:** warm, concise, banking-appropriate responses with strict guardrails (never asks for OTP/PIN/CVV; appends rate caveats; declines out-of-scope advice).
- **Rich formatting:** renders tables (e.g., rate comparisons), bullet lists, and headings — not walls of text.
- **Streaming responses:** replies appear word-by-word in real time, so the customer never stares at a blank screen.

### 3.2 Multilingual — text **and** voice
- **5 languages:** English, Hindi (हिंदी), Bengali (বাংলা), Marathi (मराठी), and **Hinglish** (Roman-script Hindi).
- **Pre-chat language selector** so the whole experience adapts up front.
- **Speech-to-Text (voice input):** customers can *speak* their query.
- **Text-to-Speech (voice output):** replies are read aloud using **premium neural voices** tuned for Indian languages, and speech **starts as the first sentence is ready** (low-latency, sentence-by-sentence playback).
- Script-aware fonts and clean speech (emojis/tables are spoken naturally, not read out symbol-by-symbol).

### 3.3 Guided Self-Service Banking (for verified customers)
Five end-to-end journeys, delivered as **guided, button-driven flows** with **secure input widgets** — the safest pattern for banking:

| # | Journey | What the customer can do |
|---|---|---|
| 1 | **Set / Reset Debit Card PIN** | Pick a card, verify identity (expiry + OTP), set a new PIN on a secure keypad |
| 2 | **Nominee Management** | View, add or modify a nominee; guardian details enforced for minors |
| 3 | **Manage Beneficiaries** | Add (with account double-entry, IFSC lookup, name-match), edit, or delete payees |
| 4 | **Fund Transfer** | Send money to own accounts or saved payees, with mode auto-suggestion (IMPS/NEFT/RTGS) |
| 5 | **Open FD / RD** | View live rates, preview maturity, and book a fixed or recurring deposit |

Each journey follows a bank-grade pattern: **collect inputs → summary → explicit confirmation → OTP → reference number.**

### 3.4 Trust, Security & Compliance (by design)
- **Two-step authentication** to enter the assistant, plus **step-up OTP on every sensitive action.**
- **Data masking** everywhere: account and card numbers shown as `XXXX XXXX XXXX 1234`.
- **Secure widgets** for PIN/OTP — never stored in the chat transcript or logs.
- **OTP retry lockout** (3 attempts) to resist brute force.
- **Beneficiary cooling-period** and **channel transaction limits** modelled per banking norms.
- **Idempotency** so a network retry never double-executes a transfer.
- **Reference numbers** issued for every action (audit-friendly).

### 3.5 Human Escalation & Feedback
- **Per-message feedback** (thumbs up/down) to capture satisfaction and improve quality.
- **Smart escalation to a human representative** — offered proactively when the assistant senses it isn't helping, with the 24×7 helpline surfaced.

### 3.6 Native Website Experience
- Embeds as a **floating chat widget** and a **sticky "Be our customer!" ribbon** on the bank's site.
- Fully **themed to the bank's brand** (colours, logo, typography) so it looks first-party, not bolted-on.
- **Accessibility-aware** (text-resize controls on the host page).

---

## 4. What Makes It Different (Competitive Differentiators)

1. **Grounded answers, not guesses** — RAG on the bank's own content means accuracy and compliance, the #1 failure mode of generic chatbots.
2. **True Indian multilingual voice** — most bots do English text only; this does 5 languages in **both** text and premium voice.
3. **Real transactions, not just FAQs** — guided secure journeys move it from "deflection tool" to "digital service channel."
4. **Bank-grade security patterns baked in** — masking, step-up OTP, cooling periods, idempotency, audit references.
5. **Native look-and-feel** — brand-themed, so it elevates rather than clutters the site.
6. **Modern, low-latency UX** — streaming text and sentence-level voice make it feel fast and human.

---

## 5. Technology Foundation (for technical stakeholders)

- **Conversational engine:** Anthropic **Claude Haiku 4.5** — fast, cost-efficient, high-quality (upgrade path to Sonnet/Opus for richer reasoning).
- **Knowledge retrieval:** **Pinecone** vector database with integrated embeddings — the bank's knowledge base is ingested once and searched per query.
- **Voice:** **Google Cloud Text-to-Speech** (Neural2 / WaveNet Indian voices); browser speech recognition for input.
- **Front end:** React single-page app; deploys as a static site with lightweight serverless API functions (e.g., **Vercel**).
- **Integration-ready:** the self-service flows are modelled against a mock core-banking layer with clean seams to plug into the bank's real **CBS/APIs** (cards, payments, deposits, nominee, beneficiary).

> **Deployment footprint is light:** static front end + serverless functions + managed vector DB. No heavy infrastructure to stand up.

---

## 6. Prioritised Value / ROI Talking Points

- **Cost deflection:** every routine query answered in-chat is a call or branch visit avoided.
- **24×7 availability** with zero incremental staffing.
- **Financial inclusion:** regional-language voice reaches customers underserved by English-only digital channels.
- **Higher digital adoption:** guided journeys convert "I'll go to the branch" into "I did it in the app."
- **Compliance posture:** masking, 2FA, and audit references align with regulator expectations (e.g., RBI 2FA, nominee rules) — subject to the bank's compliance sign-off.
- **Fast time-to-value:** brandable, embeddable, and built on managed services.

---

## 7. Suggested Demo Script (5 minutes)

1. **Open the site** — point out the native-branded widget and "Be our customer!" ribbon.
2. **Ask a product question** in English (e.g., *"Compare your savings accounts"*) → show the grounded, **table-formatted** answer.
3. **Switch language to Hindi/Bengali** and ask again → show the same quality in-language.
4. **Use voice** — speak a query, let the assistant **read the answer aloud**.
5. **Log in as an existing customer** (demo OTP) → open **Self-service Banking**.
6. **Run a Fund Transfer**: pick payee → summary → OTP → **UTR reference**. Highlight masking and the confirmation pattern.
7. **Open an FD**: show **live rates**, maturity preview, and instant booking.
8. **Trigger feedback / escalation** to show the human hand-off.

---

## 8. Positioning by Audience

| Stakeholder | Lead with |
|---|---|
| **CXO / Business Head** | Cost deflection, 24×7 CX, financial inclusion, digital adoption |
| **Head of Digital** | Native embed, streaming UX, 5-language voice, roadmap to CBS integration |
| **Compliance / Risk** | Masking, step-up OTP, cooling periods, idempotency, audit references |
| **CTO / Engineering** | RAG accuracy, managed stack (Claude + Pinecone + serverless), clean API seams |

---

## 9. Handling Common Objections

- **"Chatbots give wrong answers."** → We use RAG on *your* content, with guardrails; it answers from the knowledge base, not from thin air, and escalates when unsure.
- **"Our customers don't speak English."** → 5 languages including Hinglish, in text **and** voice.
- **"Is it secure enough for transactions?"** → Step-up OTP on every action, data masking, secure widgets, cooling periods, idempotency, and audit references — patterned on banking norms.
- **"Integration will take forever."** → The journeys are built with clean seams; we plug into your CBS/API catalogue. Front end and rails are already live.

---

## 10. Current Status & Roadmap

**Available today (demo):** grounded multilingual chat (text + voice), 5 self-service journeys with secure widgets, feedback & escalation, brand-themed native embed.

**Productionisation (next):**
- Integrate the five journeys with the bank's live **CBS/APIs** (the single largest dependency).
- Wire real **OTP infrastructure, audit logging, and observability/analytics dashboards**.
- Compliance finalisation (2FA policy, cooling periods, transaction limits, transcript retention).
- Optional: WhatsApp / mobile-app channels, additional languages, scheduled/recurring transfers, richer analytics.

---

> **Note for the field team:** This is a **working proof-of-concept**. Figures, rates, and the customer/data shown in the demo are illustrative. Security controls demonstrated reflect the *design intent*; final controls are confirmed with the bank's compliance and engineering teams during productionisation.
