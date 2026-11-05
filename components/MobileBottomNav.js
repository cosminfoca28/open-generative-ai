'use client';

const PRIMARY_TOOLS = [
  {
    id: 'image',
    label: 'Images',
    path: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m4 17 5-5 4 4 3-3 4 4"/></svg>,
  },
  {
    id: 'video',
    label: 'Video',
    path: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="14" height="14" rx="3"/><path d="m17 10 4-3v10l-4-3"/></svg>,
  },
  {
    id: 'cinema',
    label: 'Cinema',
    path: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="15" rx="3"/><path d="M3 10h18M8 5l4 5m2-5 4 5"/></svg>,
  },
  {
    id: 'workflows',
    label: 'Workflows',
    path: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2.5" y="3" width="7" height="7" rx="1"/><rect x="14.5" y="3" width="7" height="7" rx="1"/><rect x="8.5" y="15" width="7" height="7" rx="1"/><path d="M6 10v2.5h12V10m-6 2.5V15"/></svg>,
  },
];

export default function MobileBottomNav({ activeTab, onSelect, onMore, getLabel }) {
  return (
    <nav className="mobile-studio-tabbar md:hidden" aria-label="Mobile studio navigation">
      {PRIMARY_TOOLS.map((tool) => {
        const selected = activeTab === tool.id;
        return (
          <button
            key={tool.id}
            type="button"
            onClick={() => onSelect(tool.id)}
            className={`mobile-studio-tab ${selected ? 'is-active' : ''}`}
            aria-label={getLabel?.(tool.id) || tool.label}
            aria-current={selected ? 'page' : undefined}
          >
            {tool.path}
            <span>{tool.label}</span>
          </button>
        );
      })}
      <button
        type="button"
        onClick={onMore}
        className={`mobile-studio-tab ${!PRIMARY_TOOLS.some((tool) => tool.id === activeTab) ? 'is-active' : ''}`}
        aria-label="More tools"
        aria-haspopup="true"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>
        <span>More</span>
      </button>
    </nav>
  );
}
