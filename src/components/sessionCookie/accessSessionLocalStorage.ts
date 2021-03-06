export type LocalStorageKey =
	| 'auth.access_token_valid_until'
	| 'auth.refresh_token_valid_until';

export const getLocalStorageItem = (key: LocalStorageKey): string => {
	return localStorage.getItem(key);
};

export const removeLocalStorageItem = (key: LocalStorageKey): void => {
	localStorage.removeItem(key);
};

export const setTokenExpiryInLocalStorage = (
	key: LocalStorageKey,
	expiresInMs: number
) => {
	const validUntilTime = new Date().getTime() + expiresInMs * 1000;
	localStorage.setItem(key, validUntilTime.toString());
};

export const getTokenExpiryFromLocalStorage = () => ({
	accessTokenValidUntilTime: parseInt(
		getLocalStorageItem('auth.access_token_valid_until')
	),
	refreshTokenValidUntilTime: parseInt(
		getLocalStorageItem('auth.refresh_token_valid_until')
	)
});

export const removeTokenExpiryFromLocalStorage = () => {
	removeLocalStorageItem('auth.access_token_valid_until');
	removeLocalStorageItem('auth.refresh_token_valid_until');
};
