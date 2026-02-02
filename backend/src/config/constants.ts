export const APP_NAME = "IFA Etsy Plugin";

// Rate limiting - TIGHTENED FOR PUBLIC API
export const RATE_LIMIT = {
  WINDOW_MS: 60 * 1000, // 1 minute
  MAX_REQUESTS: 30, // Reduced from 100 - 30 requests per minute per IP
  AUTH_MAX_REQUESTS: 5, // Reduced from 10 - 5 auth attempts per minute
  REGISTRATION_MAX_REQUESTS: 3, // New - 3 registrations per hour per IP
  REGISTRATION_WINDOW_MS: 60 * 60 * 1000, // 1 hour for registration limit
};

// JWT
export const JWT = {
  EXPIRES_IN: "7d",
  ALGORITHM: "HS256" as const,
};

// Etsy API
export const ETSY = {
  API_BASE: "https://api.etsy.com/v3",
  OAUTH_BASE: "https://www.etsy.com/oauth",
  SCOPES: [
    "listings_r",
    "listings_w",
    "shops_r",
    "shops_w",
    "transactions_r",
  ],
  TOKEN_URL: "https://api.etsy.com/v3/public/oauth/token",
};

// Agent
export const AGENT = {
  POLL_INTERVAL_MS: 1000,
  MAX_RUN_TIME_MS: 30 * 60 * 1000, // 30 minutes
  MAX_RETRY_ATTEMPTS: 3,
};

// Product sync
export const PRODUCT_SYNC = {
  BATCH_SIZE: 100,
  SYNC_INTERVAL_MS: 15 * 60 * 1000, // 15 minutes
};

// Prefixes for IDs
export const ID_PREFIX = {
  SELLER: "sel_",
  ETSY_CONNECTION: "etsy_",
  PRODUCT: "prod_",
  AGENT: "agt_",
  INBOX: "inb_",
  EVENT: "evt_",
  CHANNEL: "chn_",
};
