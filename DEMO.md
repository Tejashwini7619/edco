# DealMemory: 3-Minute Hackathon Demo Script ⚡

> **Target Audience**: Microsoft Hackathon Judges & Sales Leadership  
> **Total Time**: 3 minutes  
> **Key Message**: Real persistent AI memory with Hindsight solves pre-call prep, eliminates hallucination with grounded citations, and unlocks cross-deal sales tactics that increase win rates by +49%.

---

## ⏱️ Demo Overview Timeline

| Timestamp | Segment | Key Feature Shown | Demo Impact Moment |
| :--- | :--- | :--- | :--- |
| **0:00 – 0:35** | **Act 1**: The Messy Deal Workspace | Deal List, Risk Signals, Keyboard Nav (`J`/`K`) | Memory-derived risk scores, not random numbers |
| **0:35 – 1:15** | **Act 2**: The 30-Second Pre-Call Brief | `reflect()`, Clickable Citations, Teams Card | 3 lines of status + clickable `[1]` citation chips |
| **1:15 – 1:55** | **Act 3**: Ingest Studio & Memory Defense | `retain()`, Live Extraction, Secret Scrubbing | The "Aha!" moment: watching facts & entities extracted live |
| **1:55 – 2:30** | **Act 4**: Memory Inspector & Changed Beliefs | Auto-Consolidated Observations, Belief History | Proves memory is real: Marcus Vance sentiment shift |
| **2:30 – 3:00** | **Act 5**: Cross-Deal Tactic Recommender | `reflect()` across past outcomes, Win-Rate Lift | "+49% win rate when using Phased Ramp against ApexCloud" |

---

## 🎬 Step-by-Step Demo Walkthrough

### 📍 Act 1: The Messy Deal Workspace (0:00 – 0:35)
1. **Presenter**: *"Sales reps waste 45 minutes before every meeting digging through messy CRM notes. Here in DealMemory, we have 13 active enterprise deals."*
2. Navigate the workspace table using **`J` and `K`** on the keyboard.
3. Highlight the **Memory Risk Signal** column:
   - Point out **Acme Financial ($280k ARR)**: Risk score is **48 (Medium)** because *"CFO pushed back on \$280k multi-year commit; competitor ApexCloud offering 30% bundle discount."*
   - Point out **CloudScale Logistics ($340k ARR)**: Risk score is **74 (High)** because *"Champion Marcus Vance changed sentiment from enthusiastic to silent blocker."*
4. Press **`Enter`** or click on **Acme Financial**.

---

### 📍 Act 2: The 30-Second Pre-Call Brief (0:35 – 1:15)
1. **Presenter**: *"I have a call with Acme's CFO Evelyn Vance in 5 minutes. Instead of reading 6 past documents, I look at the Pre-Call Brief generated via Hindsight's `reflect()` operation."*
2. **Show the 3-line Status**:
   - Status line 1: Deal in commercial negotiation for \$280k ARR.
   - Status line 2: Technical & InfoSec review approved by VP Eng David Zhao and CRO Helena Cross.
   - Status line 3: CFO reviewing phased \$60k Q4 ramp vs ApexCloud.
3. **The Clickable Citation Moment**:
   - Click on citation chip **`[1]`** next to Evelyn Vance's pricing objection.
   - The **Citation Drawer** slides in from the right, displaying the exact source memory from the September 12 pricing negotiation, timestamp, context label, and Memory Defense certification badge.
4. **Show the Microsoft Teams Export**:
   - Click **"Share to Teams"** to demonstrate instant Adaptive Card JSON payload generation for Microsoft Teams side panels.

---

### 📍 Act 3: Ingest Studio & Memory Defense (1:15 – 1:55)
1. **Presenter**: *"What happens when a new call happens? Let's go to Ingest Studio."*
2. Click **"Ingest Studio"** in the top navigation.
3. Under *"Or Load Sample Interaction"*, click **"Acme Financial - CFO Pricing Sync"** (or paste a custom transcript).
4. Point out the untrusted input defense:
   - Click the sample *"Untrusted Note with PII & Prompt Injection Test"* to show **Memory Defense** scrubbing API keys (`[REDACTED:openai_api_key]`), SSNs, and neutralizing injection overrides in real-time.
5. Click **"Execute `retain()`"**:
   - Watch the live animation decompose the unstructured dialogue into atomic facts and linked entity graph pills (`David Zhao`, `Evelyn Vance`, `ApexCloud`, `\$60k`, `\$280k`).
6. Click **"View Deal Brief & Inspector"** to show instant memory persistence.

---

### 📍 Act 4: Memory Inspector & Belief Evolution (1:55 – 2:30)
1. Navigate to **CloudScale Logistics** (`/deals/deal-cloudscale-logistics`) and click the **"Memory Inspector"** tab.
2. **Presenter**: *"Naïve vector search can only find keywords. Hindsight tracks evolving beliefs over time. Look at how our understanding of CTO Marcus Vance evolved."*
3. Walk through the 4 historical steps in the timeline:
   - **July 10**: Marcus is an *Enthusiastic Champion* declaring the product a "no-brainer".
   - **July 25**: Marcus is a *Proactive Sponsor* requesting fast-track paperwork.
   - **August 18**: Marcus turns *Unresponsive / Silent* following a board cost-freeze.
   - **September 10**: Marcus becomes a *Passive Blocker* after InfoSec raises driver GPS privacy concerns.
4. **Presenter**: *"The agent knows Marcus is not unresponsive because he dislikes us—he's protecting his career after an InfoSec audit. The brief automatically recommends presenting the Azure Private Link enclave to unblock him."*

---

### 📍 Act 5: Cross-Deal Tactic Recommender (2:30 – 3:00)
1. Click **"Tactic Recommender"** in the top header.
2. Type or select: **"How to beat ApexCloud Enterprise on price when they offer 30-40% bundle discounts?"**
3. Click **"Recommend Tactic"**:
   - Show the **Empirical Win-Rate Lift**: **78% win rate with tactic vs. 29% without**.
   - Show the **Winning Tactic**: *"Never match software discounts. Attack their proprietary lock-in, calculate true TCO including \$85k/yr egress fees, and offer a Phased Milestone Ramp."*
   - Show the **Supporting Past Deals**: Point to **NovaMed Health (\$420k Won)** and **Strata Commerce (\$260k Lost)** as verifiable proof.
4. **Closing Statement**: *"DealMemory transforms raw sales conversations into persistent institutional memory and winning revenue tactics, grounded in Hindsight and Microsoft Azure."*

---

## 🎯 Tips for the Presenter
- Use `⌘+K` / `Ctrl+K` during the presentation to smoothly jump between deals.
- Click citation chips to emphasize that the AI never invents numbers or quotes.
- Emphasize the +49% win rate impact as the commercial ROI for enterprise sales teams.
