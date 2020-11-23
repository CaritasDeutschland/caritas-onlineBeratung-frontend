import {
	OverlayItem,
	OVERLAY_FUNCTIONS,
	OverlayWrapper,
	Overlay
} from '../../overlay/ts/Overlay';
import { translate } from '../../../resources/ts/i18n/translate';
import { BUTTON_TYPES } from '../../button/ts/Button';
import * as React from 'react';
import { ajaxCallSetAbsence } from '../../apiWrapper/ts/';
import { UserDataContext } from '../../../globalState';
import { useContext, useState, useEffect } from 'react';

export const AbsenceHandler = (props) => {
	const absenceReminderOverlayItem: OverlayItem = {
		headline: translate('absence.overlayHeadline'),
		copy: translate('absence.overlayCopy1'),
		copyTwo: translate('absence.overlayCopy2'),
		buttonSet: [
			{
				label: translate('absence.overlayButton1.label'),
				function: OVERLAY_FUNCTIONS.DEACTIVATE_ABSENCE,
				type: BUTTON_TYPES.PRIMARY
			},
			{
				label: translate('absence.overlayButton2.label'),
				function: OVERLAY_FUNCTIONS.CLOSE,
				type: BUTTON_TYPES.GHOST
			}
		]
	};

	const absenceChangedOverlayItem: OverlayItem = {
		imgSrc: '/../resources/img/illustrations/check.svg',
		headline: translate('absence.changeSuccess.overlay.headline'),
		buttonSet: [
			{
				label: translate('absence.changeSuccess.overlay.buttonLabel'),
				function: OVERLAY_FUNCTIONS.CLOSE,
				type: BUTTON_TYPES.AUTO_CLOSE
			}
		]
	};

	const { userData, setUserData } = useContext(UserDataContext);
	const [overlayItem, setOverlayItem] = useState(absenceReminderOverlayItem);
	const [overlayActive, setOverlayActive] = useState(false);
	const [reminderSend, setReminderSend] = useState(false);
	const [init, setInit] = useState(true);

	useEffect(() => {
		if (init) {
			handleAbsenceReminder();
			setInit(false);
		}
	}, [init]);

	const handleAbsenceReminder = () => {
		const absence = userData.absent;
		absence && !reminderSend ? activateOverlay() : null;
	};

	const activateOverlay = () => {
		setReminderSend(true);
		setOverlayActive(true);
	};

	const handleOverlayAction = (buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.CLOSE) {
			setOverlayItem(absenceReminderOverlayItem);
			setOverlayActive(false);
		}
		if (buttonFunction === OVERLAY_FUNCTIONS.DEACTIVATE_ABSENCE) {
			ajaxCallSetAbsence(false, '')
				.then(() => {
					setOverlayItem(absenceChangedOverlayItem);
					setUserData({
						...userData,
						absent: false,
						absenceMessage: null
					});
				})
				.catch((error) => {
					console.log(error);
				});
		}
	};

	if (!overlayActive) return null;

	return (
		<>
			<OverlayWrapper>
				<Overlay
					item={overlayItem}
					handleOverlay={handleOverlayAction}
				/>
			</OverlayWrapper>
		</>
	);
};