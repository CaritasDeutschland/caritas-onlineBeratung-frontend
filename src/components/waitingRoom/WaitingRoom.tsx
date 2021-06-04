import * as React from 'react';
import { Header } from '../header/Header';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import './waitingRoom.styles';
import { ReactComponent as WelcomeIllustration } from '../../resources/img/illustrations/willkommen.svg';
import { ReactComponent as WaitingIllustration } from '../../resources/img/illustrations/waiting.svg';
import { translate } from '../../utils/translate';
import { useContext, useEffect, useState } from 'react';
import { endpointPort, tld } from '../../resources/scripts/config';
import { apiPostAnonymousRegistration } from '../../api';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import { decodeUsername } from '../../utils/encryptionHelpers';
import {
	deleteCookieByName,
	getTokenFromCookie,
	setTokenInCookie
} from '../sessionCookie/accessSessionCookie';
import {
	Overlay,
	OverlayItem,
	OverlayWrapper,
	OVERLAY_FUNCTIONS
} from '../overlay/Overlay';
import { AnonymousEnquiryAcceptedContext } from '../../globalState';
import { capitalizeFirstLetter } from '../../utils/capitalizeFirstLetter';
import { history } from '../app/app';

export interface WaitingRoomProps {
	consultingTypeSlug: string;
	consultingTypeId: number;
	onAnonymousRegistration: Function;
}

export const WaitingRoom = (props: WaitingRoomProps) => {
	const [
		isDataProtectionViewActive,
		setIsDataProtectionViewActive
	] = useState<boolean>(true);
	const [username, setUsername] = useState<string>();
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);
	const [isOverlayActive, setIsOverlayActive] = useState<boolean>(false);
	const {
		anonymousEnquiryAccepted,
		setAnonymousEnquiryAccepted
	} = useContext(AnonymousEnquiryAcceptedContext);

	useEffect(() => {
		const registeredUsername = getTokenFromCookie('registeredUsername');

		if (registeredUsername && getTokenFromCookie('keycloak')) {
			setIsDataProtectionViewActive(false);
			setUsername(registeredUsername);
			props.onAnonymousRegistration();
		}

		document.title = `${translate(
			'anonymous.waitingroom.title.start'
		)} ${capitalizeFirstLetter(props.consultingTypeSlug)}`;
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (anonymousEnquiryAccepted) {
			setIsOverlayActive(true);
			setAnonymousEnquiryAccepted(false);
		}
	}, [anonymousEnquiryAccepted, setAnonymousEnquiryAccepted]);

	const getRedirectText = () => {
		const url = `${tld + endpointPort}/${
			props.consultingTypeSlug
		}/registration`;

		return `
			<a href="${url}">${translate('anonymous.waitingroom.redirect.link')}</a>
			${translate('anonymous.waitingroom.redirect.suffix')}
		`;
	};

	const getUsernameText = () => {
		return `
		 ${translate('anonymous.waitingroom.username')} 
		 <span class="waitingRoom__username">
		 	${
				username
					? username
					: `<span class="waitingRoom__username--loading">${translate(
							'anonymous.waitingroom.username.loading'
					  )}</span>`
			}
		 </span>
		`;
	};

	const confirmButton: ButtonItem = {
		label: translate('anonymous.waitingroom.dataProtection.button'),
		type: BUTTON_TYPES.PRIMARY
	};

	const handleConfirmButton = () => {
		if (!isRequestInProgress) {
			setIsRequestInProgress(true);
			setIsDataProtectionViewActive(false);
			apiPostAnonymousRegistration(props.consultingTypeId)
				.then((response) => {
					const decodedUsername = decodeUsername(response.userName);
					setUsername(decodedUsername);
					setTokenInCookie('keycloak', response.accessToken);
					setTokenInCookie('registeredUsername', decodedUsername);
					setTokenInCookie('rc_token', response.rcToken);
					setTokenInCookie('rc_uid', response.rcUserId);
					setTokenInCookie('refreshToken', response.refreshToken);

					props.onAnonymousRegistration();
				})
				.catch((err) => {
					console.log(err);
				})
				.finally(() => {
					setIsRequestInProgress(false);
				});
		}
	};

	const redirectOverlayItem: OverlayItem = {
		buttonSet: [
			{
				label: translate('anonymous.waitingroom.overlay.button'),
				function: OVERLAY_FUNCTIONS.REDIRECT,
				type: BUTTON_TYPES.AUTO_CLOSE
			}
		],
		headline: translate('anonymous.waitingroom.overlay.headline'),
		copy: translate('anonymous.waitingroom.overlay.copy'),
		svg: WelcomeIllustration
	};

	const handleOverlayAction = (buttonFunction: string) => {
		if (buttonFunction === OVERLAY_FUNCTIONS.REDIRECT) {
			history.push(`/app`);
			deleteCookieByName('registeredUsername');
		}
	};

	return (
		<>
			<div className="waitingRoom">
				<Header />
				{isDataProtectionViewActive ? (
					<div className="waitingRoom__contentWrapper">
						<div className="waitingRoom__illustration">
							<WelcomeIllustration />
						</div>
						<div>
							<Headline
								className="waitingRoom__headline"
								semanticLevel="1"
								text={translate(
									'anonymous.waitingroom.dataProtection.headline'
								)}
							/>
							<Headline
								className="waitingRoom__subline"
								semanticLevel="3"
								text={translate(
									'anonymous.waitingroom.dataProtection.subline'
								)}
							/>
							<Text
								type="standard"
								text={translate(
									'anonymous.waitingroom.dataProtection.description'
								)}
							/>
							<Text
								type="standard"
								text={translate(
									'registration.dataProtection.label'
								)}
							/>
							<Button
								className="waitingRoom__confirmButton"
								buttonHandle={handleConfirmButton}
								item={confirmButton}
							/>
						</div>
					</div>
				) : (
					<div className="waitingRoom__contentWrapper">
						<div className="waitingRoom__illustration">
							<WaitingIllustration className="waitingRoom__waitingIllustration" />
						</div>
						<div>
							<Headline
								className="waitingRoom__headline"
								semanticLevel="1"
								text={translate(
									'anonymous.waitingroom.headline'
								)}
							/>
							<Headline
								className="waitingRoom__subline"
								semanticLevel="3"
								text={translate(
									'anonymous.waitingroom.subline'
								)}
							/>
							<Text type="standard" text={getUsernameText()} />
							<div className="waitingRoom__redirect">
								<Text
									type="standard"
									text={translate(
										'anonymous.waitingroom.redirect.prefix'
									)}
								/>
								<Text
									type="standard"
									text={getRedirectText()}
								/>
							</div>
						</div>
					</div>
				)}
			</div>
			{isOverlayActive && (
				<OverlayWrapper>
					<Overlay
						item={redirectOverlayItem}
						handleOverlay={handleOverlayAction}
					/>
				</OverlayWrapper>
			)}
		</>
	);
};