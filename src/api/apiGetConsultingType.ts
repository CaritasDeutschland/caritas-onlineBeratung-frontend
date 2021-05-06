import { ConsultingTypeInterface } from '../globalState';
import { config } from '../resources/scripts/config';
import { fetchData, FETCH_ERRORS, FETCH_METHODS } from './fetchData';

export const apiGetConsultingType = async (params: {
	consultingTypeSlug?: string;
	consultingTypeId?: number;
}): Promise<ConsultingTypeInterface> => {
	if (params.consultingTypeSlug != null) {
		return fetchData({
			url: `${config.endpoints.consultingTypeServiceBase}/byslug/${params.consultingTypeSlug}/full`,
			method: FETCH_METHODS.GET,
			skipAuth: true,
			responseHandling: [FETCH_ERRORS.NO_MATCH]
		});
	} else if (params.consultingTypeId !== null) {
		return fetchData({
			url: `${config.endpoints.consultingTypeServiceBase}/${params.consultingTypeId}/full`,
			method: FETCH_METHODS.GET,
			skipAuth: true,
			responseHandling: [FETCH_ERRORS.NO_MATCH]
		});
	}
};
