import './help.styles.scss';

import React, { useCallback, useContext } from 'react';

import { useTranslation } from 'react-i18next';

import {
	AUTHORITIES,
	hasUserAuthority,
	NOTIFICATION_TYPE_SUCCESS,
	NotificationsContext,
	UserDataContext
} from '../../globalState';
import { useAppConfig } from '../../hooks/useAppConfig';
import { copyTextToClipboard } from '../../utils/clipboardHelpers';
import { HelpConsultantProfile } from './HelpConsultantProfile';
import { HelpVideoCall } from './HelpVideoCall';

interface HelpProps {}
export const Help: React.FC<HelpProps> = () => {
	const settings = useAppConfig();
	const { t: translate } = useTranslation();
	const { addNotification } = useContext(NotificationsContext);
	const { userData } = useContext(UserDataContext);

	const copyLoginLink = useCallback(async () => {
		await copyTextToClipboard(`${settings.urls.toLogin}`, () => {
			addNotification({
				notificationType: NOTIFICATION_TYPE_SUCCESS,
				title: translate('help.videoCall.loginLink.notification.title'),
				text: translate('help.videoCall.loginLink.notification.text')
			});
		});
	}, [addNotification, settings.urls.toLogin, translate]);

	const isConsultant = hasUserAuthority(
		AUTHORITIES.CONSULTANT_DEFAULT,
		userData
	);
	const isAsker = hasUserAuthority(AUTHORITIES.ASKER_DEFAULT, userData);

	return (
		<div className="help">
			{isConsultant && <HelpConsultantProfile />}
			{isAsker && (
				<HelpVideoCall
					copyLoginLink={copyLoginLink}
					consultant={false}
				/>
			)}
		</div>
	);
};
