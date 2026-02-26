export const isProduction = process.env.NODE_ENV === "production";

export const userWithUnlimitedApiAccess = process.env.UNLIMITED_API_ACCESS_USER_IDS?.split(",").map(id => id.trim()) ?? [];