import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_ERRORS, FETCH_METHODS } from './fetchData';

/**
 * CARITAS-976: Sets/updates the shared registration redirect URL of an agency the current
 * consultant is assigned to.
 */
export const apiSetAgencyRegistrationUrl = async (
	agencyId: number,
	registrationUrl: string
): Promise<any> => {
	return fetchData({
		url: endpoints.consultantAgencyRegistrationUrl(agencyId),
		method: FETCH_METHODS.PUT,
		bodyData: JSON.stringify({ registrationUrl }),
		rcValidation: true,
		// The endpoint answers 204 on success; do NOT pass FETCH_ERRORS.EMPTY here, otherwise
		// fetchData turns the successful 204 into a rejection (CARITAS-976).
		responseHandling: [FETCH_ERRORS.BAD_REQUEST, FETCH_ERRORS.FORBIDDEN]
	});
};

/**
 * CARITAS-976: Removes the shared registration redirect URL of an agency the current consultant
 * is assigned to.
 */
export const apiDeleteAgencyRegistrationUrl = async (
	agencyId: number
): Promise<any> => {
	return fetchData({
		url: endpoints.consultantAgencyRegistrationUrl(agencyId),
		method: FETCH_METHODS.DELETE,
		rcValidation: true,
		// The endpoint answers 204 on success; do NOT pass FETCH_ERRORS.EMPTY here, otherwise
		// fetchData turns the successful 204 into a rejection (CARITAS-976).
		responseHandling: [FETCH_ERRORS.FORBIDDEN]
	});
};
