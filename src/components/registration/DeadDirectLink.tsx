import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import { Text } from '../text/Text';
import { Headline } from '../headline/Headline';
import { useAppConfig } from '../../hooks/useAppConfig';
import './deadDirectLink.styles';

export const DeadDirectLink = () => {
	const { t: translate } = useTranslation();
	const settings = useAppConfig();

	const registrationButton: ButtonItem = {
		label: translate('registration.deadDirectLink.buttonLabel'),
		type: BUTTON_TYPES.PRIMARY
	};

	return (
		<div className="registrationDeadDirectLink">
			<Headline
				text={translate('registration.deadDirectLink.headline')}
				semanticLevel="2"
			/>
			<Text
				text={translate('registration.deadDirectLink.description')}
				type="standard"
			/>
			<Button
				item={registrationButton}
				testingAttribute="dead-direct-link-registration"
				buttonHandle={() => {
					window.location.href = settings.urls.toRegistration;
				}}
			/>
		</div>
	);
};
