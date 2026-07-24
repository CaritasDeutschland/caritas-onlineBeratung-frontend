import { endpoints } from '../resources/scripts/endpoints';
import { fetchData, FETCH_ERRORS, FETCH_METHODS } from './fetchData';

/**
 * CARITAS-976: Sets/updates the personal registration redirect URL of the current consultant.
 */
export const apiSetConsultantRegistrationUrl = async (
	registrationUrl: string
): Promise<any> => {
	return fetchData({
		url: endpoints.consultantRegistrationUrl,
		method: FETCH_METHODS.PUT,
		bodyData: JSON.stringify({ registrationUrl }),
		rcValidation: true,
		responseHandling: [FETCH_ERRORS.BAD_REQUEST, FETCH_ERRORS.EMPTY]
	});
};

/**
 * CARITAS-976: Removes the personal registration redirect URL of the current consultant.
 */
export const apiDeleteConsultantRegistrationUrl = async (): Promise<any> => {
	return fetchData({
		url: endpoints.consultantRegistrationUrl,
		method: FETCH_METHODS.DELETE,
		rcValidation: true,
		responseHandling: [FETCH_ERRORS.EMPTY]
	});
};

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
		responseHandling: [
			FETCH_ERRORS.BAD_REQUEST,
			FETCH_ERRORS.FORBIDDEN,
			FETCH_ERRORS.EMPTY
		]
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
		responseHandling: [FETCH_ERRORS.FORBIDDEN, FETCH_ERRORS.EMPTY]
	});
};
