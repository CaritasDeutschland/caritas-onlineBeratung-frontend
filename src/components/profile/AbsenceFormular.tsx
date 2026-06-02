import './absenceFormular.styles';

import * as React from 'react';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { isMobile } from 'react-device-detect';
import { useTranslation } from 'react-i18next';
import Switch from 'react-switch';

import { apiSetAbsence } from '../../api';
import { UserDataContext } from '../../globalState';
import { ReactComponent as CheckIcon } from '../../resources/img/illustrations/check.svg';
import { BUTTON_TYPES } from '../button/Button';
import { Textarea } from '../form/textarea';
import { Headline } from '../headline/Headline';
import { Overlay, OVERLAY_FUNCTIONS, OverlayItem } from '../overlay/Overlay';
import { Text } from '../text/Text';

export const AbsenceFormular = () => {
	const { t: translate } = useTranslation();
	const { userData, reloadUserData } = useContext(UserDataContext);

	const [absentMessage, setAbsentMessage] = useState(userData.absenceMessage);
	const [overlayActive, setOverlayActive] = useState(false);
	const [activationOverlayActive, setActivationOverlayActive] =
		useState(false);
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);

	const isAbsent = useMemo(() => userData.absent, [userData.absent]);

	const absenceOverlayItem: OverlayItem = {
		svg: CheckIcon,
		headline: translate('absence.overlay.changeSuccess.headline'),
		buttonSet: [
			{
				label: translate('absence.overlay.changeSuccess.buttonLabel'),
				function: OVERLAY_FUNCTIONS.CLOSE,
				type: BUTTON_TYPES.AUTO_CLOSE
			}
		]
	};

	const activationOverlayItem: OverlayItem = {
		headline: translate('absence.overlay.activation.headline'),
		nestedComponent: (
			<div
				className="absenceForm__activationCopy"
				dangerouslySetInnerHTML={{
					__html: translate('absence.overlay.activation.copy')
				}}
			/>
		),
		buttonSet: [
			{
				id: 'absence-activation-cancel',
				label: translate('absence.overlay.activation.cancelLabel'),
				function: OVERLAY_FUNCTIONS.CLOSE,
				type: BUTTON_TYPES.SECONDARY
			},
			{
				label: translate('absence.overlay.activation.confirmLabel'),
				function: OVERLAY_FUNCTIONS.CLOSE_SUCCESS,
				type: BUTTON_TYPES.PRIMARY
			}
		]
	};

	const saveAbsence = useCallback(
		(isAbsent) => {
			if (isRequestInProgress) {
				return null;
			}
			setIsRequestInProgress(true);

			apiSetAbsence(isAbsent, absentMessage)
				.then(reloadUserData)
				.then(() => {
					setOverlayActive(true);
					setIsRequestInProgress(false);
				})
				.catch((error) => {
					console.log(error);
					setIsRequestInProgress(false);
				});
		},
		[absentMessage, isRequestInProgress, reloadUserData]
	);

	useEffect(() => {
		setAbsentMessage(userData.absenceMessage);
	}, [userData]);

	const handleOverlayAction = () => {
		setOverlayActive(false);
	};

	const handleActivationOverlayAction = (action: string) => {
		setActivationOverlayActive(false);
		if (action === OVERLAY_FUNCTIONS.CLOSE_SUCCESS) {
			saveAbsence(true);
		}
	};

	const handleToggleChange = () => {
		if (!isAbsent) {
			setActivationOverlayActive(true);
			return;
		}
		saveAbsence(false);
	};

	return (
		<div id="absenceForm" className="absenceForm">
			<div className="profile__content__title">
				<Headline
					text={translate('profile.functions.absence.title')}
					semanticLevel="5"
				/>
			</div>
			<div className="generalInformation">
				<Textarea
					value={absentMessage ?? ''}
					onChange={({ target: { value } }) =>
						setAbsentMessage(value)
					}
					placeholder={
						isAbsent
							? translate(
									'profile.functions.absence.activated.label'
							  )
							: translate('profile.functions.absence.label')
					}
					disabled={isAbsent}
					className={`${isAbsent ? 'disabled' : ''} ${
						isMobile && isAbsent ? 'mobile' : ''
					}`}
				/>

				<Text
					text={translate('absence.input.infoText')}
					type="infoLargeAlternative"
				/>

				<div className="flex">
					<Switch
						className="mr--1"
						onChange={handleToggleChange}
						checked={isAbsent}
						uncheckedIcon={false}
						checkedIcon={false}
						width={48}
						height={26}
						onColor="#0A882F"
						offColor="#8C878C"
						boxShadow="0px 1px 4px rgba(0, 0, 0, 0.6)"
						handleDiameter={27}
						activeBoxShadow="none"
					/>
					<Text
						text={translate('absence.checkbox.label')}
						type="standard"
					/>
				</div>
			</div>
			{overlayActive && (
				<Overlay
					item={absenceOverlayItem}
					handleOverlay={handleOverlayAction}
				/>
			)}
			{activationOverlayActive && (
				<Overlay
					item={activationOverlayItem}
					handleOverlay={handleActivationOverlayAction}
				/>
			)}
		</div>
	);
};
