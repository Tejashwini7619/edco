import { Deal, MemoryObservation, MentalModelSummary } from './types';

export const SEED_DEALS: Deal[] = [
  {
    id: 'deal-acme-fintech',
    name: 'Acme Financial - Enterprise AI Orchestration',
    company: 'Acme Financial Group',
    industry: 'Financial Services',
    stage: 'Negotiation',
    value: 280000,
    owner: 'Sarah Jenkins',
    closeDate: '2026-10-15',
    lastContactDate: '2026-09-24',
    risk: {
      level: 'medium',
      score: 48,
      reason: 'CFO pushed back on \$280k multi-year commit; competitor ApexCloud offering 30% bundle discount',
      contributingFactors: [
        'CFO Evelyn Vance requested 20% discount or phased roll-out',
        'ApexCloud Enterprise mentioned 4 days ago in email',
        'Security sign-off obtained but legal review pending'
      ],
      lastAssessed: '2026-09-24'
    },
    nextStep: 'Present Phased Pilot Milestone proposal and ApexCloud TCO comparison to CFO Evelyn Vance on Thursday',
    competitors: ['ApexCloud Enterprise'],
    tags: ['deal:deal-acme-fintech', 'industry:fintech', 'tier:enterprise', 'competitor:apexcloud'],
    interactions: [
      {
        id: 'int-acme-1',
        dealId: 'deal-acme-fintech',
        type: 'discovery_call',
        title: 'Initial Discovery with VP of Engineering & Head of AI',
        timestamp: '2026-08-02T14:30:00Z',
        author: 'Sarah Jenkins',
        context: 'discovery call',
        content: `Sarah Jenkins (2026-08-02T14:30:00Z): Thanks for meeting, David and Priya. What triggered your search for an orchestration platform?
David Zhao (VP Engineering): Our existing microservices are sprawling. We have 14 separate LLM pipelines running on bespoke Python services. Maintaining observability and token routing is costing us 40 hours of DevOps every week.
Priya Nair (Head of AI): We tested ApexCloud Enterprise last quarter. Their API was too rigid and locked us into their proprietary embeddings. We need an open architecture with hybrid Azure/on-premise deployment.
Sarah Jenkins: SynapseFlow provides full Azure tenant isolation and zero-data retention. What timeline are you targeting?
David Zhao: We want to migrate our fraud detection pipeline by Q4. Budget is roughly \$250k - \$300k ARR if security clears it.`
      },
      {
        id: 'int-acme-2',
        dealId: 'deal-acme-fintech',
        type: 'demo',
        title: 'Technical Deep-Dive & Architecture Walkthrough',
        timestamp: '2026-08-16T16:00:00Z',
        author: 'Sarah Jenkins',
        context: 'technical demo',
        content: `Sarah Jenkins (2026-08-16T16:00:00Z): Demonstrating the SynapseFlow distributed state machine and Azure OpenAI integration.
David Zhao: The sub-50ms token routing latency is impressive. How does fallback handling work if the primary Azure OpenAI endpoint times out?
Markus (Solutions Architect): We support multi-region automatic failover with zero loss of execution context.
Priya Nair: Our fraud models process 1.2M queries daily. What is the throughput cap?
Markus: We benchmarked 15,000 requests/sec with dedicated provisioned throughput on Azure.
David Zhao: This solves our core latency bottleneck. Let's schedule the security review with Evelyn's compliance team next week.`
      },
      {
        id: 'int-acme-3',
        dealId: 'deal-acme-fintech',
        type: 'security_review',
        title: 'InfoSec & Compliance Audit with Chief Risk Officer',
        timestamp: '2026-08-28T10:00:00Z',
        author: 'Sarah Jenkins',
        context: 'security review',
        content: `Sarah Jenkins (2026-08-28T10:00:00Z): Meeting with Helena Cross (Chief Risk Officer) and David Zhao.
Helena Cross: In financial services, we cannot have customer transaction metadata stored in external SaaS databases. How is PII handled?
Markus (Solutions Architect): SynapseFlow runs within your Azure Virtual Network (VNet). All memory and state tokens are encrypted with your Customer-Managed Keys (CMK). We retain zero raw financial PII.
Helena Cross: Do you have a completed SOC 2 Type II report and ISO 27001 certification?
Sarah Jenkins: Yes, provided via our Trust Portal. We also support FedRAMP Moderate compliance controls.
Helena Cross: Security requirement is met. I will submit green-light approval to Legal.`
      },
      {
        id: 'int-acme-4',
        dealId: 'deal-acme-fintech',
        type: 'pricing_call',
        title: 'Commercial Proposal & Pricing Negotiation with CFO',
        timestamp: '2026-09-12T15:00:00Z',
        author: 'Sarah Jenkins',
        context: 'pricing negotiation',
        content: `Sarah Jenkins (2026-09-12T15:00:00Z): Presented 3-year Enterprise proposal at \$280,000 ARR including 24/7 SLA and Solutions Architect support.
Evelyn Vance (CFO): \$280k is above our initial \$220k cap for this budget cycle. ApexCloud came back with an aggressive bundle proposal offering their orchestration add-on for \$195k if we renew their core data lake.
David Zhao: But ApexCloud's throughput failed our stress test, and their security model requires external telemetry.
Evelyn Vance: I acknowledge the technical superiority, but I cannot approve \$280k upfront without either a phased milestone ramp or substantial discount. If you can do \$240k or provide phased payments tied to migration milestones, we can sign by end of month.`
      },
      {
        id: 'int-acme-5',
        dealId: 'deal-acme-fintech',
        type: 'email_thread',
        title: 'Competitor ApexCloud FUD Push & TCO Analysis Follow-up',
        timestamp: '2026-09-24T09:15:00Z',
        author: 'Sarah Jenkins',
        context: 'email follow-up',
        content: `From: Sarah Jenkins <sarah.jenkins@synapseflow.ai>
To: Evelyn Vance <evelyn.vance@acmefin.com>, David Zhao <david.zhao@acmefin.com>
Subject: Re: Commercials & ApexCloud Architecture Comparison

Hi Evelyn & David,
Following our discussion, I broke down the Total Cost of Ownership (TCO). While ApexCloud's baseline license is \$195k, their egress fees and required proprietary embeddings add an estimated \$85k/year based on your 1.2M daily transaction volume, making true cost \$280k+.
We propose structuring the agreement into a Phased Implementation Ramp: \$60k for Q4 during the fraud pipeline migration, stepping up to the full \$280k ARR upon full production cutover.
David Zhao: This phased structure eliminates our implementation risk. Evelyn, can we review this on Thursday's sync?`
      }
    ]
  },
  {
    id: 'deal-cloudscale-logistics',
    name: 'CloudScale Logistics - Fleet Automation Suite',
    company: 'CloudScale Logistics Inc',
    industry: 'Supply Chain & Logistics',
    stage: 'Security Review',
    value: 340000,
    owner: 'Michael Chang',
    closeDate: '2026-11-01',
    lastContactDate: '2026-09-20',
    risk: {
      level: 'high',
      score: 74,
      reason: 'Champion Marcus Vance changed sentiment from highly enthusiastic to silent blocker after internal audit',
      contributingFactors: [
        'CTO Marcus Vance went unresponsive for 18 days',
        'VP Operations expressed concern over driver route data privacy',
        'Competitor NimbleStack Pro attempting end-run around IT'
      ],
      lastAssessed: '2026-09-20'
    },
    nextStep: 'Executive alignment call with CIO Teresa Wong to unblock security audit concerns',
    competitors: ['NimbleStack Pro', 'ApexCloud Enterprise'],
    tags: ['deal:deal-cloudscale-logistics', 'industry:logistics', 'risk:champion-shift'],
    interactions: [
      {
        id: 'int-cs-1',
        dealId: 'deal-cloudscale-logistics',
        type: 'discovery_call',
        title: 'Executive Discovery with CTO Marcus Vance',
        timestamp: '2026-07-10T11:00:00Z',
        author: 'Michael Chang',
        context: 'discovery call',
        content: `Michael Chang (2026-07-10T11:00:00Z): Marcus, what is your top priority for the supply chain routing system?
Marcus Vance (CTO): We manage 8,500 delivery trucks across North America. Our legacy dispatch algorithm is rigid. We want real-time agentic re-routing based on weather, traffic, and dock wait times.
Michael Chang: SynapseFlow's event-driven agent mesh was built specifically for high-throughput streaming state.
Marcus Vance: I love this architecture. If you can integrate with our Trimble telematics API, this is a no-brainer. I will champion this directly to our CEO.`
      },
      {
        id: 'int-cs-2',
        dealId: 'deal-cloudscale-logistics',
        type: 'demo',
        title: 'Live Telematics Simulator & Route Optimization Demo',
        timestamp: '2026-07-25T15:00:00Z',
        author: 'Michael Chang',
        context: 'product demo',
        content: `Marcus Vance (CTO): The live dispatch demo blew our operations team away. Saved 14% on simulated fuel costs.
Michael Chang: We are ready to draft the 500-vehicle pilot agreement at \$340,000 enterprise scale.
Marcus Vance: Send over the paperwork. I will push Legal and IT security to fast-track this for an August kickoff.`
      },
      {
        id: 'int-cs-3',
        dealId: 'deal-cloudscale-logistics',
        type: 'crm_note',
        title: 'Internal Shift: Champion Goes Quiet After Board Meeting',
        timestamp: '2026-08-18T17:30:00Z',
        author: 'Michael Chang',
        context: 'crm note',
        content: `Marcus Vance has missed two scheduled weekly syncs. Left voicemail. Reached out to his Senior Director of Infrastructure who mentioned the board mandated a cost-freeze on non-essential IT following Q2 margin compression. Marcus seems under heavy pressure and has stopped responding to emails.`
      },
      {
        id: 'int-cs-4',
        dealId: 'deal-cloudscale-logistics',
        type: 'security_review',
        title: 'Tense Security Review with InfoSec Director Raymond Cole',
        timestamp: '2026-09-10T14:00:00Z',
        author: 'Michael Chang',
        context: 'security review',
        content: `Raymond Cole (InfoSec Director): Marcus Vance forwarded your compliance deck, but we have severe reservations. Truck GPS feeds constitute sensitive physical security telemetry. We cannot allow cloud streaming unless you deploy into our private Azure sovereign enclave.
Marcus Vance (CTO): (Noticeably withdrawn) Yes, Raymond has raised critical audit points. We cannot move forward under the current SaaS tenant model.
Michael Chang: We support Azure Private Link and Customer-Managed Enclaves. We can do a fully isolated zero-egress deployment.
Raymond Cole: Send the architectural whitepaper. We will evaluate internally.`
      },
      {
        id: 'int-cs-5',
        dealId: 'deal-cloudscale-logistics',
        type: 'executive_sync',
        title: 'Check-in with VP of Operations',
        timestamp: '2026-09-20T10:30:00Z',
        author: 'Michael Chang',
        context: 'executive sync',
        content: `Met with VP Operations Karen Bell. She confirmed Marcus Vance is hesitant to take any career risks before his annual review in November. She suggested engaging CIO Teresa Wong directly with the fuel savings ROI calculations (\$1.8M projected annual savings) to provide top-down coverage for Marcus.`
      }
    ]
  },
  {
    id: 'deal-novamed-health',
    name: 'NovaMed Health - Clinical Workflow Intelligence',
    company: 'NovaMed Health Systems',
    industry: 'Healthcare',
    stage: 'Closed Won',
    value: 420000,
    owner: 'Elena Rostova',
    closeDate: '2026-09-05',
    lastContactDate: '2026-09-05',
    risk: {
      level: 'low',
      score: 12,
      reason: 'Deal closed won; HIPAA BAA signed with multi-year commitment',
      contributingFactors: ['Signed 3-year agreement', 'Dedicated Solution Architect assigned'],
      lastAssessed: '2026-09-05'
    },
    nextStep: 'Kick off implementation onboarding with Chief Medical Officer on Oct 1',
    competitors: ['ApexCloud Enterprise'],
    tags: ['deal:deal-novamed-health', 'industry:healthcare', 'outcome:won', 'competitor:apexcloud'],
    outcome: {
      status: 'won',
      closedAt: '2026-09-05',
      primaryReason: 'Superior HIPAA compliance, zero-data retention architecture, and Open-Standards FHIR export',
      winningOrLosingTactics: 'Provided signed BAA pre-template, executed a 2-week HIPAA sandbox with mock EHR data, and highlighted ApexCloud proprietary lock-in risk.'
    },
    interactions: [
      {
        id: 'int-nova-1',
        dealId: 'deal-novamed-health',
        type: 'discovery_call',
        title: 'Clinical Workflow Discovery with CMIO Dr. Aris Thorne',
        timestamp: '2026-06-15T13:00:00Z',
        author: 'Elena Rostova',
        context: 'discovery call',
        content: `Dr. Aris Thorne (Chief Medical Information Officer): Our physicians spend 3.5 hours every evening charting in Epic EHR. We need an intelligent agent that parses patient discharge summaries and pre-fills clinical coding.
Elena Rostova: HIPAA compliance and zero data leakage are paramount.
Dr. Thorne: Exactly. ApexCloud approached us, but their Terms of Service allowed aggregated de-identified telemetry training. That is an absolute dealbreaker for our Institutional Review Board (IRB).`
      },
      {
        id: 'int-nova-2',
        dealId: 'deal-novamed-health',
        type: 'security_review',
        title: 'HIPAA & BAA Legal Review with Chief Legal Counsel',
        timestamp: '2026-07-12T10:00:00Z',
        author: 'Elena Rostova',
        context: 'compliance review',
        content: `Reviewed our standard Business Associate Agreement (BAA) and Azure Confidential Computing enclave architecture.
Legal Counsel Janet Brody: Your zero-retention policy and verifiable encryption in-use satisfy our strictest PHI guidelines. ApexCloud refused to sign our custom indemnification clause; SynapseFlow's standard enterprise terms are significantly more healthcare-friendly.`
      },
      {
        id: 'int-nova-3',
        dealId: 'deal-novamed-health',
        type: 'pricing_call',
        title: 'Pricing & TCO Review against ApexCloud',
        timestamp: '2026-08-10T14:30:00Z',
        author: 'Elena Rostova',
        context: 'pricing negotiation',
        content: `Presented \$420k ARR 3-year contract covering 12 hospital campuses.
Dr. Thorne: ApexCloud offered a lower baseline license (\$310k), but your FHIR native adapters will save us at least \$180k in custom middleware engineering. We will proceed with SynapseFlow.`
      },
      {
        id: 'int-nova-4',
        dealId: 'deal-novamed-health',
        type: 'crm_note',
        title: 'Contract Execution & Closed Won',
        timestamp: '2026-09-05T16:00:00Z',
        author: 'Elena Rostova',
        context: 'deal closed',
        content: `Contract signed for \$420,000 ARR with 3-year commitment (\$1.26M TCV). Winning playbook: Zero-retention HIPAA proof points + FHIR connector vs ApexCloud proprietary lock-in.`
      }
    ]
  },
  {
    id: 'deal-vertex-cyber',
    name: 'Vertex Security - Threat Intelligence Co-Pilot',
    company: 'Vertex Cyber Systems',
    industry: 'Cybersecurity',
    stage: 'Closed Won',
    value: 310000,
    owner: 'Sarah Jenkins',
    closeDate: '2026-08-20',
    lastContactDate: '2026-08-20',
    risk: {
      level: 'low',
      score: 10,
      reason: 'Deal closed won; production deployment underway',
      contributingFactors: ['Signed agreement', 'Phased rollout verified'],
      lastAssessed: '2026-08-20'
    },
    nextStep: 'Quarterly business review scheduled for Q4',
    competitors: ['NimbleStack Pro'],
    tags: ['deal:deal-vertex-cyber', 'industry:cybersecurity', 'outcome:won', 'competitor:nimblestack'],
    outcome: {
      status: 'won',
      closedAt: '2026-08-20',
      primaryReason: 'Enterprise RBAC, SOC2 compliance, and sub-50ms latency vs NimbleStack feature gaps',
      winningOrLosingTactics: 'Conducted live SOC stress-test benchmarking throughput under 50k events/sec and demonstrated NimbleStack lack of granular team-level RBAC.'
    },
    interactions: [
      {
        id: 'int-vtx-1',
        dealId: 'deal-vertex-cyber',
        type: 'discovery_call',
        title: 'Threat Intel Pipeline Discovery',
        timestamp: '2026-06-01T15:00:00Z',
        author: 'Sarah Jenkins',
        context: 'discovery call',
        content: `CISO Gregory Hall: We ingest 200M telemetry logs per day. Our analysts need automated alert triaging.
Sarah Jenkins: NimbleStack Pro was mentioned earlier—how are you evaluating them?
Gregory Hall: NimbleStack is cheap (\$120k), but their security model lacks role-based access control (RBAC) and audit trails for multi-tenant customer data.`
      },
      {
        id: 'int-vtx-2',
        dealId: 'deal-vertex-cyber',
        type: 'demo',
        title: 'High-Throughput Threat Evaluation Benchmark',
        timestamp: '2026-07-08T11:00:00Z',
        author: 'Sarah Jenkins',
        context: 'technical benchmark',
        content: `Ran synthetic stress-test with 50,000 events/sec. SynapseFlow sustained sub-40ms P99 latency with zero dropped frames.
Gregory Hall: NimbleStack choked at 12,000 events/sec during our pilot. Your enterprise architecture clearly scales.`
      },
      {
        id: 'int-vtx-3',
        dealId: 'deal-vertex-cyber',
        type: 'pricing_call',
        title: 'Commercial Agreement Finalization',
        timestamp: '2026-08-15T16:00:00Z',
        author: 'Sarah Jenkins',
        context: 'pricing call',
        content: `Agreed on \$310,000 ARR. Gregory Hall affirmed that paying a premium over NimbleStack was justified by the audit compliance and enterprise support.`
      },
      {
        id: 'int-vtx-4',
        dealId: 'deal-vertex-cyber',
        type: 'crm_note',
        title: 'Closed Won Confirmation',
        timestamp: '2026-08-20T17:00:00Z',
        author: 'Sarah Jenkins',
        context: 'deal closed',
        content: `Closed Won \$310k ARR. Key winning tactic: Side-by-side throughput benchmark + enterprise RBAC comparison vs NimbleStack Pro.`
      }
    ]
  },
  {
    id: 'deal-strata-retail',
    name: 'Strata Commerce - Omnichannel Personalization',
    company: 'Strata Retail Global',
    industry: 'Retail & E-commerce',
    stage: 'Closed Lost',
    value: 260000,
    owner: 'Michael Chang',
    closeDate: '2026-07-30',
    lastContactDate: '2026-07-30',
    risk: {
      level: 'critical',
      score: 95,
      reason: 'Deal closed lost to ApexCloud bundle discount due to lack of phased payment structure',
      contributingFactors: ['ApexCloud 40% suite discount', 'Rep insisted on upfront annual payment without milestone pilot'],
      lastAssessed: '2026-07-30'
    },
    nextStep: 'Nurture for Q2 2027 contract renewal cycle',
    competitors: ['ApexCloud Enterprise'],
    tags: ['deal:deal-strata-retail', 'industry:retail', 'outcome:lost', 'competitor:apexcloud'],
    outcome: {
      status: 'lost',
      closedAt: '2026-07-30',
      primaryReason: 'CFO accepted ApexCloud 40% enterprise bundle discount when rep refused phased migration terms',
      winningOrLosingTactics: 'Rep pushed hard for full \$260k upfront commit rather than offering a phased migration pilot. ApexCloud bundled their inferior tool for \$140k.'
    },
    interactions: [
      {
        id: 'int-strata-1',
        dealId: 'deal-strata-retail',
        type: 'discovery_call',
        title: 'Personalization Engine Discovery',
        timestamp: '2026-05-10T14:00:00Z',
        author: 'Michael Chang',
        context: 'discovery call',
        content: `VP E-commerce Liam Thorne: We need real-time cart recommendations across 40M monthly web visitors.
Michael Chang: SynapseFlow provides sub-30ms inference caching.
Liam Thorne: Our current ApexCloud contract is up for renewal. We are open to switching if the price is right.`
      },
      {
        id: 'int-strata-2',
        dealId: 'deal-strata-retail',
        type: 'pricing_call',
        title: 'Pricing Pushback & Unyielding Term Negotiations',
        timestamp: '2026-06-20T15:30:00Z',
        author: 'Michael Chang',
        context: 'pricing negotiation',
        content: `CFO Samantha Wright: We need a phased pilot or quarterly billing because of engineering resource constraints during Q3.
Michael Chang: Our company policy requires annual upfront payment for Tier-1 enterprise tier (\$260,000).
Samantha Wright: ApexCloud offered to bundle their module into our ERP license for \$140k with deferred billing.`
      },
      {
        id: 'int-strata-3',
        dealId: 'deal-strata-retail',
        type: 'crm_note',
        title: 'Deal Lost to ApexCloud Bundle',
        timestamp: '2026-07-30T11:00:00Z',
        author: 'Michael Chang',
        context: 'deal closed',
        content: `Closed Lost. Samantha Wright signed ApexCloud bundle. Lesson learned: Inflexible upfront payment terms against an incumbent bundle guarantee a loss. Must offer phased milestone ramps.`
      }
    ]
  },
  {
    id: 'deal-quantum-telco',
    name: 'Quantum Telecom - Network Ops Automation',
    company: 'Quantum Telecom Corp',
    industry: 'Telecommunications',
    stage: 'Discovery',
    value: 510000,
    owner: 'Sarah Jenkins',
    closeDate: '2026-12-15',
    lastContactDate: '2026-09-22',
    risk: {
      level: 'medium',
      score: 42,
      reason: 'Massive scale (18M subscribers); incumbent ApexCloud entrenched in billing system',
      contributingFactors: ['High integration complexity', 'Multiple VP stakeholders involved'],
      lastAssessed: '2026-09-22'
    },
    nextStep: 'Coordinate multi-region latency benchmark demo with Network Engineering team',
    competitors: ['ApexCloud Enterprise'],
    tags: ['deal:deal-quantum-telco', 'industry:telecom', 'tier:strategic'],
    interactions: [
      {
        id: 'int-qt-1',
        dealId: 'deal-quantum-telco',
        type: 'discovery_call',
        title: 'Strategic Ops Discovery with VP Network Reliability',
        timestamp: '2026-09-08T10:00:00Z',
        author: 'Sarah Jenkins',
        context: 'discovery call',
        content: `VP Network Reliability Carlos Mendez: Cell tower outages cost us \$120k/minute in regulatory fines. We need an autonomous remediation agent.
Sarah Jenkins: SynapseFlow orchestrates complex multi-step diagnostics with automated rollback.
Carlos Mendez: ApexCloud has been our core vendor for 6 years, but their platform lacks event-driven graph reasoning. We want to test SynapseFlow in our Pacific Northwest testbed.`
      },
      {
        id: 'int-qt-2',
        dealId: 'deal-quantum-telco',
        type: 'email_thread',
        title: 'Technical Requirements & Sandbox Setup',
        timestamp: '2026-09-22T16:00:00Z',
        author: 'Sarah Jenkins',
        context: 'technical scoping',
        content: `Carlos Mendez confirmed security specifications: Requires Azure GovCloud compliance and 99.999% SLA uptime. Sarah shared the FedRAMP architectural blueprint.`
      }
    ]
  },
  {
    id: 'deal-apex-biotech',
    name: 'Apex BioLabs - Genomic Data Pipeline Agent',
    company: 'Apex BioLabs International',
    industry: 'Biotechnology',
    stage: 'Solutioning',
    value: 390000,
    owner: 'Elena Rostova',
    closeDate: '2026-11-20',
    lastContactDate: '2026-09-25',
    risk: {
      level: 'low',
      score: 22,
      reason: 'High technical engagement; champion is head of computational biology with direct budget',
      contributingFactors: ['Strong champion sponsorship', 'Clean security audit path'],
      lastAssessed: '2026-09-25'
    },
    nextStep: 'Present customized Genomic Pipeline POC results to scientific advisory board',
    competitors: ['NimbleStack Pro'],
    tags: ['deal:deal-apex-biotech', 'industry:biotech', 'tier:enterprise'],
    interactions: [
      {
        id: 'int-ab-1',
        dealId: 'deal-apex-biotech',
        type: 'discovery_call',
        title: 'Genomics Pipeline Discovery with Dr. Lin Chen',
        timestamp: '2026-08-14T13:00:00Z',
        author: 'Elena Rostova',
        context: 'discovery call',
        content: `Dr. Lin Chen (Head of Computational Biology): Processing CRISPR sequencing variants requires coordinating 30+ HPC nodes. We need reliable stateful memory across long-running 12-hour compute jobs.
Elena Rostova: SynapseFlow persists multi-turn execution graphs and integrates directly with Azure Batch and HPC cluster queues.
Dr. Lin Chen: NimbleStack crashed repeatedly on jobs exceeding 2 hours due to memory leaks. If you can prove state persistence over 12 hours, we will move forward immediately.`
      },
      {
        id: 'int-ab-2',
        dealId: 'deal-apex-biotech',
        type: 'demo',
        title: '12-Hour Long-Running Compute Simulation',
        timestamp: '2026-09-18T15:00:00Z',
        author: 'Elena Rostova',
        context: 'poc validation',
        content: `Executed synthetic 12-hour genomic alignment run. SynapseFlow recovered state seamlessly across node interruptions.
Dr. Lin Chen: Flawless execution. Preparing statement of work for \$390k ARR.`
      }
    ]
  },
  {
    id: 'deal-horizon-media',
    name: 'Horizon Digital - Automated Content Localization',
    company: 'Horizon Media Group',
    industry: 'Media & Entertainment',
    stage: 'Procurement',
    value: 210000,
    owner: 'Michael Chang',
    closeDate: '2026-10-10',
    lastContactDate: '2026-09-26',
    risk: {
      level: 'low',
      score: 18,
      reason: 'Procurement redlines completed; final signature pending CFO approval',
      contributingFactors: ['Legal approved MSA', 'Phased onboarding planned'],
      lastAssessed: '2026-09-26'
    },
    nextStep: 'Receive countersigned Enterprise Master Services Agreement by Oct 2',
    competitors: ['ApexCloud Enterprise'],
    tags: ['deal:deal-horizon-media', 'industry:media', 'stage:procurement'],
    interactions: [
      {
        id: 'int-hm-1',
        dealId: 'deal-horizon-media',
        type: 'discovery_call',
        title: 'Localization Engine Scoping',
        timestamp: '2026-07-05T14:00:00Z',
        author: 'Michael Chang',
        context: 'discovery call',
        content: `VP Content Claire Dubois: We distribute video in 42 languages. Manual subtitle localization and cultural adaptation takes 6 days per episode.
Michael Chang: SynapseFlow orchestrates multi-agent translation with cultural glossaries and automated audio sync.`
      },
      {
        id: 'int-hm-2',
        dealId: 'deal-horizon-media',
        type: 'pricing_call',
        title: 'Commercial Agreement Finalization',
        timestamp: '2026-08-25T11:30:00Z',
        author: 'Michael Chang',
        context: 'pricing call',
        content: `Offered \$210k ARR with phased language expansion. Claire Dubois approved and forwarded contract to Procurement.`
      }
    ]
  },
  {
    id: 'deal-solargrid-energy',
    name: 'SolarGrid Energy - Smart Inverter Grid Agent',
    company: 'SolarGrid Dynamics',
    industry: 'Clean Energy & Utilities',
    stage: 'Solutioning',
    value: 480000,
    owner: 'Sarah Jenkins',
    closeDate: '2026-11-30',
    lastContactDate: '2026-09-27',
    risk: {
      level: 'medium',
      score: 35,
      reason: 'Strict NERC-CIP utility cybersecurity requirements; competitor ApexCloud bidding',
      contributingFactors: ['High compliance bar', 'Grid load forecasting POC in progress'],
      lastAssessed: '2026-09-27'
    },
    nextStep: 'Deliver NERC-CIP isolation architecture review to Chief Security Officer',
    competitors: ['ApexCloud Enterprise'],
    tags: ['deal:deal-solargrid-energy', 'industry:energy', 'tier:enterprise'],
    interactions: [
      {
        id: 'int-sg-1',
        dealId: 'deal-solargrid-energy',
        type: 'discovery_call',
        title: 'Grid Balancing Automation Discovery',
        timestamp: '2026-08-10T10:00:00Z',
        author: 'Sarah Jenkins',
        context: 'discovery call',
        content: `VP Grid Operations Henrik Lind: Solar volatility causes voltage spikes. We need real-time inverter dispatch under 100ms across 400 utility substations.
Sarah Jenkins: SynapseFlow runs on Azure IoT Edge nodes with sub-25ms response.`
      },
      {
        id: 'int-sg-2',
        dealId: 'deal-solargrid-energy',
        type: 'security_review',
        title: 'NERC-CIP Critical Infrastructure Scoping',
        timestamp: '2026-09-15T14:00:00Z',
        author: 'Sarah Jenkins',
        context: 'security review',
        content: `Henrik Lind: Inverters can never be addressed from the public web.
Markus (Solutions Architect): SynapseFlow edge agents run completely air-gapped with unidirectional telemetry diodes.`
      }
    ]
  },
  {
    id: 'deal-insuraprime-life',
    name: 'InsuraPrime - Claims Adjudication Copilot',
    company: 'InsuraPrime Mutual',
    industry: 'Insurance',
    stage: 'Negotiation',
    value: 360000,
    owner: 'Elena Rostova',
    closeDate: '2026-10-25',
    lastContactDate: '2026-09-28',
    risk: {
      level: 'low',
      score: 25,
      reason: 'CFO signed off on ROI business case (\$2.4M claims processing savings)',
      contributingFactors: ['Strong executive sponsor', 'Legal reviewing MSA'],
      lastAssessed: '2026-09-28'
    },
    nextStep: 'Finalize legal indemnification clauses for fraud decisioning liability',
    competitors: ['ApexCloud Enterprise', 'NimbleStack Pro'],
    tags: ['deal:deal-insuraprime-life', 'industry:insurance', 'tier:enterprise'],
    interactions: [
      {
        id: 'int-ip-1',
        dealId: 'deal-insuraprime-life',
        type: 'discovery_call',
        title: 'Claims Processing Efficiency Discovery',
        timestamp: '2026-07-15T15:00:00Z',
        author: 'Elena Rostova',
        context: 'discovery call',
        content: `Chief Claims Officer Patricia Gomez: Adjusters spend 40% of time reading police reports and medical bills. We need multi-modal document extraction.
Elena Rostova: SynapseFlow extracts medical codes and fraud indicators in under 3 seconds per claim with 99.4% accuracy.`
      },
      {
        id: 'int-ip-2',
        dealId: 'deal-insuraprime-life',
        type: 'pricing_call',
        title: 'Business Case & Commercial Presentation',
        timestamp: '2026-09-02T11:00:00Z',
        author: 'Elena Rostova',
        context: 'pricing negotiation',
        content: `Presented \$360k ARR 2-year agreement. Patricia Gomez: The \$2.4M annual labor savings justifies the investment. Approved to Legal.`
      }
    ]
  },
  {
    id: 'deal-aeroengine-mfg',
    name: 'AeroEngine Corp - Predictive Maintenance Mesh',
    company: 'AeroEngine Global Manufacturing',
    industry: 'Aerospace & Manufacturing',
    stage: 'Closed Won',
    value: 540000,
    owner: 'Sarah Jenkins',
    closeDate: '2026-08-30',
    lastContactDate: '2026-08-30',
    risk: {
      level: 'low',
      score: 8,
      reason: 'Closed won multi-year aerospace contract with ITAR compliance',
      contributingFactors: ['Signed 3-year agreement', 'ITAR enclave verified'],
      lastAssessed: '2026-08-30'
    },
    nextStep: 'Onboard propulsion engineering teams across 4 assembly plants',
    competitors: ['ApexCloud Enterprise'],
    tags: ['deal:deal-aeroengine-mfg', 'industry:aerospace', 'outcome:won'],
    outcome: {
      status: 'won',
      closedAt: '2026-08-30',
      primaryReason: 'ITAR compliance and on-premise Azure Stack Hub edge deployment capability',
      winningOrLosingTactics: 'Demonstrated air-gapped Azure Stack Hub agent orchestration; ApexCloud required public cloud multi-tenant telemetry.'
    },
    interactions: [
      {
        id: 'int-ae-1',
        dealId: 'deal-aeroengine-mfg',
        type: 'discovery_call',
        title: 'Turbine Telemetry Discovery with VP Quality',
        timestamp: '2026-05-20T13:00:00Z',
        author: 'Sarah Jenkins',
        context: 'discovery call',
        content: `VP Quality Frank Miller: Commercial jet turbine testing produces 50TB of vibration data per test. Defense contracts require strict ITAR air-gapping.
Sarah Jenkins: We deploy directly into Azure Stack Hub inside your SCIF facilities.`
      },
      {
        id: 'int-ae-2',
        dealId: 'deal-aeroengine-mfg',
        type: 'crm_note',
        title: 'ITAR Air-Gap Pilot and Contract Signature',
        timestamp: '2026-08-30T16:00:00Z',
        author: 'Sarah Jenkins',
        context: 'deal closed',
        content: `Closed Won \$540k ARR 3-year contract (\$1.62M TCV). Winning tactic: Air-gapped on-premise deployment against ApexCloud public telemetry requirement.`
      }
    ]
  },
  {
    id: 'deal-edulearn-ai',
    name: 'EduLearn Systems - Adaptive Learning Engine',
    company: 'EduLearn Digital',
    industry: 'EdTech',
    stage: 'Discovery',
    value: 175000,
    owner: 'Michael Chang',
    closeDate: '2026-12-01',
    lastContactDate: '2026-09-26',
    risk: {
      level: 'low',
      score: 20,
      reason: 'Discovery proceeding well with Provost and Head of Curriculum',
      contributingFactors: ['Strong user demand', 'FERPA compliance verified'],
      lastAssessed: '2026-09-26'
    },
    nextStep: 'Schedule technical pilot scoping call with Academic IT Director',
    competitors: ['NimbleStack Pro'],
    tags: ['deal:deal-edulearn-ai', 'industry:edtech', 'tier:growth'],
    interactions: [
      {
        id: 'int-el-1',
        dealId: 'deal-edulearn-ai',
        type: 'discovery_call',
        title: 'Student Tutor Architecture Discovery',
        timestamp: '2026-09-20T14:00:00Z',
        author: 'Michael Chang',
        context: 'discovery call',
        content: `Head of Curriculum Maya Patel: We serve 120,000 university students. We need an adaptive Socratic math tutor that personalizes hints based on mastery history.
Michael Chang: SynapseFlow maintains continuous student mastery graphs with zero FERPA student data retention.`
      }
    ]
  },
  {
    id: 'deal-omnicare-pharma',
    name: 'OmniCare Pharma - Regulatory Submission Agent',
    company: 'OmniCare BioSciences',
    industry: 'Pharmaceuticals',
    stage: 'Closed Won',
    value: 460000,
    owner: 'Elena Rostova',
    closeDate: '2026-09-18',
    lastContactDate: '2026-09-18',
    risk: {
      level: 'low',
      score: 10,
      reason: 'Closed won; 21 CFR Part 11 audit trail validated',
      contributingFactors: ['Signed agreement', 'Audit trail compliance verified'],
      lastAssessed: '2026-09-18'
    },
    nextStep: 'Initiate FDA eCTD electronic filing integration',
    competitors: ['ApexCloud Enterprise'],
    tags: ['deal:deal-omnicare-pharma', 'industry:pharma', 'outcome:won'],
    outcome: {
      status: 'won',
      closedAt: '2026-09-18',
      primaryReason: 'Immutable 21 CFR Part 11 electronic signature audit trails and Open-Standards XML export',
      winningOrLosingTactics: 'Delivered pre-packaged validation documentation and demonstrated tamper-proof audit trails for FDA reviewers.'
    },
    interactions: [
      {
        id: 'int-oc-1',
        dealId: 'deal-omnicare-pharma',
        type: 'discovery_call',
        title: 'FDA Dossier Automation Discovery',
        timestamp: '2026-06-25T11:00:00Z',
        author: 'Elena Rostova',
        context: 'discovery call',
        content: `VP Regulatory Affairs Simon Vance: Preparing an IND filing takes 8,000 document hours. We need an agent that cross-references toxicology data with clinical protocol tables.
Elena Rostova: SynapseFlow maintains cryptographic lineage across every cited scientific table.`
      },
      {
        id: 'int-oc-2',
        dealId: 'deal-omnicare-pharma',
        type: 'crm_note',
        title: 'Contract Execution & Closed Won',
        timestamp: '2026-09-18T15:30:00Z',
        author: 'Elena Rostova',
        context: 'deal closed',
        content: `Closed Won \$460,000 ARR with 3-year term. Key winning tactic: 21 CFR Part 11 audit trail compliance documentation vs ApexCloud proprietary lock-in.`
      }
    ]
  }
];

export const SEED_OBSERVATIONS: MemoryObservation[] = [
  {
    id: 'obs-marcus-vance-sentiment',
    dealId: 'deal-cloudscale-logistics',
    topic: 'Marcus Vance (CTO) Sentiment & Champion Evolution',
    summary: 'Marcus transitioned from an enthusiastic, proactive champion into a cautious, defensive stakeholder following a board cost-freeze and InfoSec telemetry audit pushback.',
    confidence: 'High',
    firstObserved: '2026-07-10',
    lastUpdated: '2026-09-20',
    entities: ['Marcus Vance', 'CloudScale Logistics Inc', 'Raymond Cole', 'Teresa Wong'],
    history: [
      {
        date: '2026-07-10',
        state: 'Enthusiastic Champion',
        evidence: 'Marcus declared the product a "no-brainer" during discovery and committed to championing it directly to the CEO.',
        sourceContext: 'discovery call',
        citationId: 'int-cs-1'
      },
      {
        date: '2026-07-25',
        state: 'Proactive Sponsor',
        evidence: 'After the telematics demo, Marcus instructed team to fast-track legal and security for an August kickoff.',
        sourceContext: 'product demo',
        citationId: 'int-cs-2'
      },
      {
        date: '2026-08-18',
        state: 'Unresponsive / Defensive',
        evidence: 'Missed two consecutive weekly syncs following a board meeting mandating IT cost-freezes; went silent on email.',
        sourceContext: 'crm note',
        citationId: 'int-cs-3'
      },
      {
        date: '2026-09-10',
        state: 'Passive Blocker / Risk Averse',
        evidence: 'During tense security review with InfoSec Director Raymond Cole, Marcus was noticeably withdrawn and cited audit concerns to pause SaaS adoption.',
        sourceContext: 'security review',
        citationId: 'int-cs-4'
      }
    ]
  },
  {
    id: 'obs-acme-budget-shift',
    dealId: 'deal-acme-fintech',
    topic: 'Acme Financial Pricing & Budget Dynamics',
    summary: 'Acme objection evolved from initial sticker shock at \$280k into a specific request for a phased migration milestone structure to mitigate upfront execution risk.',
    confidence: 'High',
    firstObserved: '2026-08-02',
    lastUpdated: '2026-09-24',
    entities: ['Evelyn Vance', 'David Zhao', 'Acme Financial Group', 'ApexCloud Enterprise'],
    history: [
      {
        date: '2026-08-02',
        state: 'Initial Budget Alignment',
        evidence: 'Engineering VP David Zhao indicated \$250k - \$300k ARR target budget if security cleared.',
        sourceContext: 'discovery call',
        citationId: 'int-acme-1'
      },
      {
        date: '2026-09-12',
        state: 'CFO Pricing Pushback',
        evidence: 'CFO Evelyn Vance cited \$220k budget cap and ApexCloud \$195k bundle offer, requesting 20% discount or phased payments.',
        sourceContext: 'pricing negotiation',
        citationId: 'int-acme-4'
      },
      {
        date: '2026-09-24',
        state: 'Phased Structure Accepted',
        evidence: 'David Zhao agreed that a phased ramp (\$60k Q4 pilot stepping to \$280k) eliminates execution risk and requested Thursday CFO review.',
        sourceContext: 'email follow-up',
        citationId: 'int-acme-5'
      }
    ]
  }
];

export const SEED_MENTAL_MODELS: MentalModelSummary[] = [
  {
    id: 'mm-objection-migration-cost',
    name: 'Objection Playbook: High Migration Cost & Engineering Bandwidth',
    category: 'objection_playbook',
    sourceQuery: 'What is the most effective tactic against "High Initial Migration Cost and Engineering Bandwidth" objections?',
    summary: 'Pure software discounts (15-30%) yield only a 28% win rate when buyers fear implementation failure. In contrast, offering a Phased Milestone Ramp (\$50k-\$75k pilot credit transitioning to full ARR upon cutover) paired with a Dedicated Solutions Architect achieves an 86% win rate across 7 enterprise deals.',
    keyTactics: [
      'Offer a Phased Milestone Ramp with proof of value before full ARR commitment',
      'Provide Dedicated Solutions Architect onboarding credits to relieve customer DevOps bottleneck',
      'Present a TCO comparison showing hidden egress and maintenance costs of legacy solutions'
    ],
    winRateImpact: '+58% win-rate vs pure discount',
    tags: ['objection:migration_cost', 'playbook:commercials', 'tactics:phased_ramp'],
    lastRefreshed: '2026-09-28T12:00:00Z'
  },
  {
    id: 'mm-battlecard-apexcloud',
    name: 'Competitor Battlecard: ApexCloud Enterprise',
    category: 'competitor_battlecard',
    sourceQuery: 'How do we consistently win against ApexCloud Enterprise when they offer aggressive suite bundle discounts?',
    summary: 'ApexCloud routinely attempts to protect accounts by offering 30-40% bundle discounts on their legacy data suite. We win (78% win rate) by attacking their proprietary embedding lock-in, exposing hidden egress and compute costs (averaging \$85k/yr), and demonstrating our sub-50ms token routing throughput under stress test.',
    keyTactics: [
      'Highlight open-standard FHIR / OpenTelemetry export vs ApexCloud proprietary lock-in',
      'Provide side-by-side TCO calculation showing true cost including egress bandwidth',
      'Execute a live 15,000 req/sec stress test highlighting ApexCloud latency bottlenecks',
      'Emphasize Zero-Retention in-VNet security architecture for regulated compliance'
    ],
    winRateImpact: '78% win-rate when TCO & lock-in framed early',
    tags: ['competitor:apexcloud', 'battlecard', 'tactics:tco_framing'],
    lastRefreshed: '2026-09-28T12:00:00Z'
  },
  {
    id: 'mm-battlecard-nimblestack',
    name: 'Competitor Battlecard: NimbleStack Pro',
    category: 'competitor_battlecard',
    sourceQuery: 'How to position against NimbleStack Pro developer-first low price points?',
    summary: 'NimbleStack Pro targets developers with \$100k-\$120k pricing but fails in enterprise security and long-running job stability. We win (91% win rate) by involving InfoSec/Compliance early and demonstrating their lack of granular RBAC, lack of FedRAMP/HIPAA certifications, and failure in jobs exceeding 2 hours.',
    keyTactics: [
      'Involve InfoSec & Compliance early to mandate enterprise RBAC and audit logging',
      'Run a 12-hour long-running compute job benchmark to expose NimbleStack memory leaks',
      'Offer standard BAA and SOC 2 Type II compliance artifacts'
    ],
    winRateImpact: '91% win-rate with InfoSec engagement',
    tags: ['competitor:nimblestack', 'battlecard', 'tactics:infosec_lead'],
    lastRefreshed: '2026-09-28T12:00:00Z'
  }
];
