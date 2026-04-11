export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  chat: '/chat',
  prediction: '/prediction',
  admin: '/admin',
  alerts: '/alerts',
  forum: '/forum',
  calendar: '/calendar',
  cropMarket: '/crop-market',
  trends: '/trends',
  markets: '/markets',
  profile: '/profile',
  calculator: '/calculator',
  schemes: '/schemes',
  search: '/search',
  shipments: '/shipments',
  weather: '/weather',
};

export const ROUTE_ALIASES = {
  '/ai-chat': ROUTES.chat,
  '/market-trends': ROUTES.trends,
  '/weather-forecast': ROUTES.weather,
  '/crop-calendar': ROUTES.calendar,
  '/profit-calculator': ROUTES.calculator,
  '/community-forum': ROUTES.forum,
};

export const PRIMARY_NAV_ROUTES = [
  { to: ROUTES.home, labelKey: 'common.dashboard' },
  { to: ROUTES.markets, labelKey: 'common.market_prices' },
  { to: ROUTES.schemes, labelKey: 'common.schemes' },
  { to: ROUTES.chat, labelKey: 'common.ai_chat' },
  { to: ROUTES.trends, labelKey: 'nav.trends' },
  { to: ROUTES.weather, labelKey: 'nav.weather' },
];
