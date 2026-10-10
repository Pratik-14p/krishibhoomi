/** Local browser cache keys must never be shared between authenticated accounts. */
export function userScopedStorageKey(key: string, userId?: string | null): string {
  return `${key}_${userId ? encodeURIComponent(userId) : 'anonymous'}`;
}
