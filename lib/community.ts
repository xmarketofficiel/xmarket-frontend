export const COMMUNITY_EMAIL_PATTERN = /^[^@\s]+@(um6p\.ma|student\.1337\.ma)$/i;

export function isCommunityEmail(email: string): boolean {
  return COMMUNITY_EMAIL_PATTERN.test(email.trim());
}
