// Generate or retrieve anonymous user ID
export function getUserId(): string {
  const STORAGE_KEY = "dsa-lab-user-id";
  let userId = localStorage.getItem(STORAGE_KEY);

  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    localStorage.setItem(STORAGE_KEY, userId);
  }

  return userId;
}

// Clear user ID (for debugging/logout)
export function clearUserId(): void {
  localStorage.removeItem("dsa-lab-user-id");
}

