
export const ADMIN_ROUTES = [
  '/quan-ly-nguoi-dung',
  '/quan-ly-don-hang',
  '/san-pham',
  '/quan-ly-danh-muc',
  
] as const;

export const COOKIE_TOKEN_KEY ='_x_sec_at_data'
export const COOKIE_TOKEN_EXPIRED = 60 * 60 * 24 * 7;
export const COOKIE_SESSION_KEY = '_x_sec_at_session'
export const COOKIE_SESSION_EXPIRED = 60 * 5;