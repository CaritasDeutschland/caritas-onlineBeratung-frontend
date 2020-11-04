import { config } from '../../../resources/scripts/config';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';

export const ajaxCallSessionAssign = async (
	sessionId: number,
	consultantId: string
) => {
	const url =
		config.endpoints.sessionAssign +
		'/' +
		sessionId +
		'/consultant/' +
		consultantId;

	return fetchData({
		url: url,
		method: FETCH_METHODS.PUT,
		responseHandling: [FETCH_ERRORS.CONFLICT]
	});
};