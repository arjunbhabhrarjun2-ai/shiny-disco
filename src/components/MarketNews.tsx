'use client';

import { useMarketNews, formatTimeAgo } from '@/lib/hooks/useMarketNews';
import { FaExternalLinkAlt, FaNewspaper } from 'react-icons/fa';

export default function MarketNews() {
  const { data, isLoading, isError } = useMarketNews();

  const cardStyle = {
    background: '#0D1421',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '12px',
    padding: '20px',
  };

  if (isLoading) {
    return (
      <div style={cardStyle}>
        <div className="flex items-center gap-2.5 mb-5">
          <FaNewspaper style={{ color: '#3B82F6' }} size={14} />
          <h3
            className="text-sm font-semibold text-white"
            style={{ fontFamily: 'var(--font-space-grotesk, system-ui)' }}
          >
            Market News
          </h3>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-16 h-16 rounded-lg flex-shrink-0" style={{ background: '#111827' }} />
              <div className="flex-1 space-y-2">
                <div className="h-3 rounded w-3/4" style={{ background: '#111827' }} />
                <div className="h-3 rounded w-1/2" style={{ background: '#111827' }} />
                <div className="h-2.5 rounded w-1/4" style={{ background: '#111827' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data || !data.articles?.length) {
    return (
      <div style={cardStyle}>
        <div className="flex items-center gap-2.5 mb-4">
          <FaNewspaper style={{ color: '#3B82F6' }} size={14} />
          <h3 className="text-sm font-semibold text-white">Market News</h3>
        </div>
        <p className="text-sm text-center py-8" style={{ color: '#6B7280' }}>
          {isError ? 'Failed to load news' : 'No market news available'}
        </p>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <div className="flex items-center gap-2.5 mb-5">
        <FaNewspaper style={{ color: '#3B82F6' }} size={14} />
        <h3
          className="text-sm font-semibold text-white"
          style={{ fontFamily: 'var(--font-space-grotesk, system-ui)' }}
        >
          Market News
        </h3>
        <span
          className="ml-auto text-xs px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}
        >
          LIVE
        </span>
      </div>

      <div className="space-y-1">
        {data.articles.map((article, index) => (
          <a
            key={`${article.url}-${index}`}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg p-3 transition-all duration-200"
            style={{ borderRadius: '8px' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.03)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}
          >
            <div className="flex gap-3">
              {article.image && (
                <div
                  className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden"
                  style={{ background: '#111827' }}
                >
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h4
                  className="text-sm font-medium text-white mb-1 line-clamp-2 transition-colors duration-200"
                  onMouseEnter={(e) => { (e.currentTarget as HTMLHeadingElement).style.color = '#60A5FA'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLHeadingElement).style.color = '#F9FAFB'; }}
                >
                  {article.title}
                  <FaExternalLinkAlt
                    className="inline-block ml-1 text-xs"
                    style={{ color: '#4B5563' }}
                  />
                </h4>
                <p className="text-xs mb-2 line-clamp-1" style={{ color: '#6B7280' }}>
                  {article.description}
                </p>
                <div className="flex items-center gap-2 text-xs" style={{ color: '#4B5563' }}>
                  <span className="font-medium">{article.source}</span>
                  <span>·</span>
                  <span>{formatTimeAgo(article.publishedAt)}</span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
