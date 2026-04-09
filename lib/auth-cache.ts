// Cache en cliente para datos de autenticación
// Evita decodificaciones y verificaciones repetidas del token

interface UserCache {
  user: unknown | null;
  token: string | null;
  timestamp: number;
}

const CACHE_DURATION = 15 * 60 * 1000; // 15 minutos
let authCache: UserCache = {
  user: null,
  token: null,
  timestamp: 0,
};

export function getAuthCache(): UserCache {
  const now = Date.now();
  // Invalidar caché si expiró
  if (now - authCache.timestamp > CACHE_DURATION) {
    authCache = {
      user: null,
      token: null,
      timestamp: 0,
    };
  }
  return authCache;
}

export function setAuthCache(user: unknown | null, token: string | null): void {
  authCache = {
    user,
    token,
    timestamp: Date.now(),
  };
}

export function invalidateAuthCache(): void {
  authCache = {
    user: null,
    token: null,
    timestamp: 0,
  };
}
