// Blog post data used by both index and detail pages.
// Extending this array automatically surfaces new posts everywhere.

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categoryColor: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  featured?: boolean;
  tags: string[];
  body: {
    kicker?: string;
    heading?: string;
    paragraph?: string;
    list?: string[];
    quote?: { text: string; attribution: string };
  }[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'Kandella-layer-1-blockchain-for-data',
    title: 'The Blockchain for Data — Why Kandella is a Full-Stack Layer 3',
    excerpt:
      'How Kandella\u2019s native oracle, state connector and FAssets unlock programmable use of non-smart-contract assets like BTC, XRP and DOGE.',
    category: 'Technology',
    categoryColor: '#D4AF7F',
    author: 'The Kandella Council',
    authorRole: 'Protocol Research',
    date: 'Apr 12, 2026',
    readTime: '7 min read',
    featured: true,
    tags: ['Layer 3', 'Oracle', 'DeFi'],
    body: [
      {
        paragraph:
          'Kandella is a full-stack Layer 3 solution designed for data-intensive use cases. Unlike general-purpose chains that rely on third-party oracles, Kandella encodes decentralized data feeds directly into its consensus \u2014 inheriting the full economic security of the network.',
      },
      {
        kicker: 'Kandella Time Series Oracle',
        heading: 'A native oracle refreshed every 1.8 seconds.',
        paragraph:
          'ATSO is Kandella\u2019s enshrined oracle. Independent data providers submit price estimates every 1.8 seconds; the system calculates a median that becomes the official feed. More than 98 providers currently secure 66+ live feeds, backed by over $75M in staked ATRIUM.',
      },
      {
        kicker: 'FAssets',
        heading: 'Programmable BTC, XRP and DOGE.',
        paragraph:
          'FAssets bring trust-minimized versions of non-smart-contract tokens to Kandella. Users lock native assets on their origin chain; the State Connector verifies the lock-up and mints an equivalent FAsset \u2014 freely composable across Kandella DeFi.',
      },
      {
        list: [
          '90M+ FAssets minted to date',
          'Roughly 80% actively deployed in DeFi',
          'Composable across SparkDex, Kinetic and Enosys',
        ],
      },
      {
        quote: {
          text: 'We believe the next generation of DeFi isn\u2019t about bridging liquidity between chains \u2014 it\u2019s about bringing the data the chains need into consensus itself.',
          attribution: 'Office of the Chairman, Kandella',
        },
      },
    ],
  },
  {
    slug: 'atairdrops-24-month-distribution-cycle',
    title: 'Inside ATAirDrops \u2014 The 24-Month, 24.2 Billion Token Distribution',
    excerpt:
      'From the December 2025 snapshot to monthly WATRIUM installments, here\u2019s how the largest community allocation in Kandella\u2019s history unfolds.',
    category: 'Tokenomics',
    categoryColor: '#60A5FA',
    author: 'Tokenomics Desk',
    authorRole: 'Research',
    date: 'Apr 04, 2026',
    readTime: '6 min read',
    tags: ['Tokenomics', 'Airdrops', 'Governance'],
    body: [
      {
        paragraph:
          'ATAirDrops is the mechanism for distributing 24.2 billion ATRIUM tokens \u2014 85% of the initial community allocation \u2014 to the network\u2019s active participants across 24 months starting January 30, 2025.',
      },
      {
        kicker: 'The Snapshot',
        heading: 'Dec 12, 2025 \u2014 the starting gun.',
        paragraph:
          'Kandella captured balances on the Ethereum and Solana ledgers on December 12, 2025. Qualifying wallets were earmarked for future distribution.',
      },
      {
        kicker: 'Monthly installments',
        heading: 'Roughly 670M tokens, every 30 days.',
        paragraph:
          'Each month\u2019s reward is determined by taking three random snapshots of a wallet\u2019s WATRIUM balance during the 23 days prior to the claim date \u2014 discouraging last-minute wrapping and rewarding long-term alignment.',
      },
      {
        list: [
          'Year 1 inflation: 10%',
          'Year 2 inflation: 7%',
          'Year 3 inflation: 5%',
          'Inflation capped at 5 billion tokens per year',
        ],
      },
    ],
  },
  {
    slug: 'staking-and-earn-on-Kandella',
    title: 'Staking, Delegation and Earn \u2014 A Practical Guide',
    excerpt:
      'Validator staking, ATSO delegation, and the difference between flexible and bonded Earn. A field guide to yield on Kandella.',
    category: 'Staking',
    categoryColor: '#10B981',
    author: 'Earn Desk',
    authorRole: 'Research',
    date: 'Mar 22, 2026',
    readTime: '8 min read',
    tags: ['Staking', 'Earn', 'Yield'],
    body: [
      {
        paragraph:
          'Kandella offers a dual-purpose staking system that secures consensus and data provision simultaneously. For holders, that means two compatible streams of rewards \u2014 validator-level and oracle-level \u2014 paid in the staked asset.',
      },
      {
        kicker: 'Validator staking',
        heading: '50,000 ATRIUM minimum \u2014 14-day lock.',
        paragraph:
          'Stakers lock ATRIUM to a validator securing the chain itself. Rewards are distributed every two weeks. It is the deepest level of participation in network security.',
      },
      {
        kicker: 'ATSO delegation',
        heading: 'Wrap, delegate, earn every 3.5 days.',
        paragraph:
          'Holders wrap ATRIUM into WATRIUM and delegate voting power to data providers. Delegators earn a share of the provider\u2019s oracle rewards \u2014 usually paid in WATRIUM every 3.5 days.',
      },
      {
        kicker: 'Earn product',
        heading: 'Up to 17% APY \u2014 no transaction fees.',
        paragraph:
          'Flexible staking has no lock-up. Bonded Earn commits assets for a set period in exchange for higher reward potential. Clients have earned more than $100M in rewards to date; commission on flexible staking with unbonding periods is 20%.',
      },
    ],
  },
  {
    slug: 'institutional-custody-and-otc',
    title: 'Qualified Custody Meets OTC \u2014 Built for Institutional Flow',
    excerpt:
      'Sub-accounts, role-based approvals, FIX 4.4 connectivity, 2.5ms benchmark latency. A tour of Kandella\u2019s institutional stack.',
    category: 'Institutional',
    categoryColor: '#A78BFA',
    author: 'Institutional Services',
    authorRole: 'Desk Note',
    date: 'Mar 08, 2026',
    readTime: '5 min read',
    tags: ['Institutional', 'Custody', 'OTC'],
    body: [
      {
        paragraph:
          'Institutions don\u2019t pick an exchange \u2014 they pick an operating system. Kandella\u2019s institutional suite puts trading, custody, financing and benchmark data behind a single interface, covering spot, derivatives and structured products.',
      },
      {
        kicker: 'Custody',
        heading: 'Qualified, vault-partitioned, role-based.',
        paragraph:
          'Assets sit in a qualified custody structure with vault-level access permissions, role-based approvals, and policy enforcement that meets the most demanding internal-control frameworks.',
      },
      {
        kicker: 'OTC',
        heading: 'For trades beyond $50,000.',
        paragraph:
          'An RFQ portal provides executable quotes and instant settlement from existing account balances. For anything more bespoke, the chat desk delivers discreet service from consultation through execution.',
      },
      {
        list: [
          '2.5ms benchmark round-trip latency',
          '99.9% platform uptime',
          'REST, WebSockets and FIX 4.4 connectivity',
          '24/7 relationship and operational support',
        ],
      },
    ],
  },
  {
    slug: 'portfolio-security-best-practices',
    title: 'Portfolio Security \u2014 Habits That Protect You',
    excerpt:
      '2FA, hardware wallets, withdrawal whitelists. Eight habits that separate protected portfolios from vulnerable ones.',
    category: 'Security',
    categoryColor: '#22D3EE',
    author: 'Security Office',
    authorRole: 'Guide',
    date: 'Feb 19, 2026',
    readTime: '6 min read',
    tags: ['Security', '2FA', 'Self-Custody'],
    body: [
      {
        paragraph:
          'Good security is routine more than it is technical. Eight small habits, practiced consistently, do more to protect a portfolio than any one product. Here is the shortlist the Kandella Security Office recommends.',
      },
      {
        list: [
          'Enable hardware-backed two-factor authentication on every account',
          'Use a hardware wallet for long-term positions',
          'Whitelist withdrawal addresses and enforce a cooldown window',
          'Never reuse passwords \u2014 always pair with a password manager',
          'Keep a separate, cold email address for financial accounts',
          'Beware of unsolicited \u201csupport\u201d contact on social media',
          'Verify URLs manually \u2014 never trust search-engine sponsored results',
          'Audit connected dApps quarterly; revoke stale token approvals',
        ],
      },
      {
        quote: {
          text: 'Security is a ritual, not a feature.',
          attribution: 'The Kandella Security Office',
        },
      },
    ],
  },
  {
    slug: 'market-outlook-q2-2026',
    title: 'Market Outlook \u2014 Q2 2026',
    excerpt:
      'Where the macro tape meets crypto beta. Our read on rates, ETH staking flows and the structural demand for on-chain yield.',
    category: 'Markets',
    categoryColor: '#EC4899',
    author: 'Research Desk',
    authorRole: 'Quarterly',
    date: 'Feb 01, 2026',
    readTime: '9 min read',
    tags: ['Macro', 'Outlook', 'Q2 2026'],
    body: [
      {
        paragraph:
          'Our Q2 thesis centers on a measured repricing of risk as real yields continue to compress. Crypto\u2019s beta to liquidity is as high as ever, but the dispersion within the basket is rising \u2014 which argues for active allocation rather than passive exposure.',
      },
      {
        kicker: 'Key themes',
        heading: 'Three things we are watching.',
        paragraph:
          'Real rate compression, ETH net staking flows, and regulatory clarity in derivatives markets. Each has the potential to be an additive tailwind or a meaningful headwind.',
      },
      {
        list: [
          'ETH staking yields hold near 4.1% \u2014 marginal flows still constructive',
          'BTC dominance stabilizing in the mid-40s',
          'Derivatives open interest up 18% QoQ',
        ],
      },
    ],
  },
];
