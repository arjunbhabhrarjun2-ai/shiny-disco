'use client';

import SectionPreview from '@/components/dashboard/SectionPreview';
import {
  FaLink,
  FaShieldAlt,
  FaExchangeAlt,
  FaSatelliteDish,
  FaLock,
  FaCheckCircle,
} from 'react-icons/fa';

export default function BridgePage() {
  return (
    <SectionPreview
      kicker="Wallet · ATAssets Bridge"
      title="Cross-chain bridging,"
      titleAccent="oracle-attested."
      description="Mint and redeem ATAssets — wrapped representations of XRP, BTC, DOGE, and other major chains — backed 1:1 and attested by the State Connector oracle network."
      gradient="linear-gradient(135deg, #06B6D4 0%, #6366F1 100%)"
      accent="#06B6D4"
      status="Live · State Connector"
      metrics={[
        { label: 'Supported chains', value: '8+', sub: 'XRP, BTC, DOGE, ETH…' },
        { label: 'Oracle quorum', value: '> 50%', sub: 'For mint authorization' },
        { label: 'Mint time', value: '~3 min', sub: 'After origin confirms' },
        { label: 'Redeem fee', value: '0.10%', sub: 'On redemption' },
      ]}
      features={[
        {
          icon: <FaLink size={14} />,
          title: 'Source → destination flow',
          description:
            'Pick origin chain, select asset, enter amount. Bridge widget previews fees and finality times before submission.',
        },
        {
          icon: <FaSatelliteDish size={14} />,
          title: 'State Connector attestation',
          description:
            'Multi-step modal shows lock-on-origin tx hash → attestation progress (with provider count) → mint on Kandella.',
        },
        {
          icon: <FaShieldAlt size={14} />,
          title: '1:1 backing guarantee',
          description:
            'Every minted ATAsset is fully backed by reserves on the origin chain, verifiable via Merkle proof.',
        },
        {
          icon: <FaExchangeAlt size={14} />,
          title: 'Mint / redeem toggle',
          description:
            'Switch between mint (lock origin → receive ATAsset) and redeem (burn ATAsset → release origin) in one widget.',
        },
        {
          icon: <FaLock size={14} />,
          title: 'Trustless escrow',
          description:
            'No centralized custodian — locked origin assets remain on-chain until the corresponding ATAsset is burned.',
        },
        {
          icon: <FaCheckCircle size={14} />,
          title: 'Confirmation receipts',
          description:
            'Every bridge action emits an on-chain receipt with both origin and destination tx hashes for full auditability.',
        },
      ]}
      bullets={[
        'Multi-step bridge flow with progress bar and provider consensus indicator',
        'Live finality countdown for the origin chain',
        'Fee preview (lock fee + mint fee) before signing',
        'Pre-warning for network mismatch',
        'Receipt history with both origin and destination tx hashes',
      ]}
      ctas={[
        { label: 'Start a Bridge', href: '/wallet/defi', variant: 'primary' },
        { label: 'Read the Docs', href: '/screens/Kandella/PriceFeeds', variant: 'ghost' },
      ]}
    />
  );
}
