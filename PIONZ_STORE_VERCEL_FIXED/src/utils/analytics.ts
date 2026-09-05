export type AnalyticsEventType =
  | 'page_view'
  | 'account_view'
  | 'buy_click'
  | 'category_filter'
  | 'search';

const VISITOR_KEY = 'pionz_analytics_visitor_id';
const VISIT_KEY = 'pionz_analytics_session_visit';

const getVisitorId = () => {
  try {
    const saved = localStorage.getItem(VISITOR_KEY);
    if (saved) return saved;
    const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(VISITOR_KEY, id);
    return id;
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
};

export const trackEvent = async (
  eventType: AnalyticsEventType,
  data: { accountId?: string; accountCode?: string; value?: string } = {}
) => {
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        eventType,
        visitorId: getVisitorId(),
        accountId: data.accountId,
        accountCode: data.accountCode,
        value: data.value,
      }),
    });
  } catch {
    // Analytics must never block the storefront.
  }
};

export const trackSessionVisit = () => {
  try {
    if (sessionStorage.getItem(VISIT_KEY) === '1') return;
    sessionStorage.setItem(VISIT_KEY, '1');
  } catch {
    // Ignore storage restrictions.
  }
  void trackEvent('page_view');
};
