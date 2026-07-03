// Set when the user disables an enforced 2FA from their profile. It keeps the
// TwoFactorNag suppressed for the rest of the session, so 2FA is only
// re-enforced on the next login. Cleared on logout.
export const STORAGE_KEY_SUPPRESS_2FA_NAG = 'suppressTwoFactorNagUntilLogout';
