'use client';

import SectionPreview from '@/components/dashboard/SectionPreview';
import {
  FaCommentDots,
  FaUsers,
  FaPaperclip,
  FaCheckDouble,
  FaShieldAlt,
  FaHistory,
} from 'react-icons/fa';

export default function CapitalChatPage() {
  return (
    <SectionPreview
      kicker="Capital Desk · Chat Trading"
      title="Talk to the desk,"
      titleAccent="trade in the chat."
      description="Slack-style direct messaging with the Kandella trading desk. Order cards drop into the conversation — click to populate the RFQ flow with one tap."
      gradient="linear-gradient(135deg, #6366F1 0%, #A855F7 50%, #EC4899 100%)"
      accent="#A855F7"
      status="Desk Open · Encrypted"
      metrics={[
        { label: 'Coverage', value: '24 / 7', sub: 'Three-region desk rotation' },
        { label: 'Response SLA', value: '< 90s', sub: 'For active relationships' },
        { label: 'File limit', value: '25 MB', sub: 'Per upload' },
        { label: 'Encryption', value: 'E2E', sub: 'Per session' },
      ]}
      features={[
        {
          icon: <FaCommentDots size={14} />,
          title: 'Persistent thread',
          description:
            'Every chat with the desk is one continuous thread, indexed by your account ID. Search history any time.',
        },
        {
          icon: <FaUsers size={14} />,
          title: 'Roster & status',
          description:
            'See which desk members are online, on call, or out-of-office. Status dots reflect real availability.',
        },
        {
          icon: <FaPaperclip size={14} />,
          title: 'Drag-and-drop uploads',
          description:
            'Drop compliance documents, order tickets, or screenshots into the chat. Encrypted at rest, audited per policy.',
        },
        {
          icon: <FaCheckDouble size={14} />,
          title: 'Embedded order cards',
          description:
            'Trade tickets render as clickable cards inside the chat — click to populate the RFQ widget pre-filled.',
        },
        {
          icon: <FaShieldAlt size={14} />,
          title: 'Compliance audit trail',
          description:
            'Every message — including order cards and uploads — is preserved for regulatory review. Tamper-evident.',
        },
        {
          icon: <FaHistory size={14} />,
          title: 'Searchable history',
          description:
            'Filter by date, asset, counterparty, or document type. Export thread to PDF for record-keeping.',
        },
      ]}
      bullets={[
        'Slack-style sidebar with desk roster',
        'Embedded order cards click to populate RFQ',
        'Drag-and-drop file upload into the conversation',
        'Status indicators per desk member',
        'Tamper-evident audit log for every interaction',
      ]}
      ctas={[
        { label: 'Open Support', href: '/support', variant: 'primary' },
        { label: 'Self-Service RFQ', href: '/capital/rfq', variant: 'ghost' },
      ]}
    />
  );
}
