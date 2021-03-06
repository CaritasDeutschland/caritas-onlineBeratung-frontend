import { config } from '../resources/scripts/config';
import {
	SESSION_LIST_TAB,
	typeIsSession,
	typeIsTeamSession
} from '../components/session/sessionHelpers';
import { ListItemsResponseInterface } from '../globalState';
import { fetchData, FETCH_METHODS, FETCH_ERRORS } from './fetchData';

export const INITIAL_FILTER: string = 'all';
export const INITIAL_OFFSET: number = 0;
export const SESSION_COUNT: number = 15;
export const TIMEOUT: number = 10000;

export interface ApiGetConsultantSessionListInterface {
	type: string;
	filter?: string;
	offset?: number;
	sessionListTab?: string;
	count?: number;
	signal?: AbortSignal;
}

export const apiGetConsultantSessionList = async ({
	type,
	filter = INITIAL_FILTER,
	offset = INITIAL_OFFSET,
	sessionListTab,
	count = SESSION_COUNT,
	signal
}: ApiGetConsultantSessionListInterface): Promise<ListItemsResponseInterface> => {
	const isTeamSession: boolean = typeIsTeamSession(type);
	let url: string;
	if (isTeamSession) {
		url = config.endpoints.consultantTeamSessions;
	} else if (!isTeamSession && typeIsSession(type)) {
		url = config.endpoints.consultantSessions;
	} else {
		url = `${config.endpoints.consultantEnquiriesBase}${
			sessionListTab && sessionListTab === SESSION_LIST_TAB.ANONYMOUS
				? `${SESSION_LIST_TAB.ANONYMOUS}`
				: `${SESSION_LIST_TAB.REGISTERED}`
		}?`;
	}
	url = url + `count=${count}&filter=${filter}&offset=${offset}`;

	return fetchData({
		url: url,
		method: FETCH_METHODS.GET,
		rcValidation: true,
		responseHandling: [FETCH_ERRORS.EMPTY],
		timeout: TIMEOUT,
		...(signal && { signal: signal })
	});
};
