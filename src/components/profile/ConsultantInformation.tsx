import * as React from 'react';
import { useCallback, useContext, useState, useEffect } from 'react';
import { ReactComponent as CopyIcon } from '../../resources/img/icons/documents.svg';
import { ReactComponent as InfoIcon } from '../../resources/img/icons/i.svg';
import {
	AUTHORITIES,
	hasUserAuthority,
	NotificationsContext,
	UserDataContext,
	NOTIFICATION_TYPE_SUCCESS
} from '../../globalState';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';
import { copyTextToClipboard } from '../../utils/clipboardHelpers';
import { Tooltip } from '../tooltip/Tooltip';
import { GenerateQrCode } from '../generateQrCode/GenerateQrCode';
import { PenIcon } from '../../resources/img/icons';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import { EditableData } from '../editableData/EditableData';
import { apiPatchUserData } from '../../api/apiPatchUserData';
import { isValidRegistrationUrl } from './RegistrationUrlInput';
import { useTranslation } from 'react-i18next';
import { useAppConfig } from '../../hooks/useAppConfig';

export const ConsultantInformation = () => {
	const { t: translate } = useTranslation();
	const { userData, reloadUserData } = useContext(UserDataContext);
	const [isEditEnabled, setIsEditEnabled] = useState(false);
	const [editedDisplayName, setEditedDisplayName] = useState('');
	const [initialDisplayName, setInitialDisplayName] = useState('');
	// CARITAS-976: the personal redirect link is edited together with the profile (pencil).
	const [editedRegistrationUrl, setEditedRegistrationUrl] = useState('');

	const isConsultant = hasUserAuthority(
		AUTHORITIES.CONSULTANT_DEFAULT,
		userData
	);
	const isDisplayNameFeatureEnabled = userData?.isDisplayNameEditable;
	// Edit mode is available to consultants (personal redirect link) and whenever the
	// display name feature is on.
	const isEditable = isDisplayNameFeatureEnabled || isConsultant;

	const cancelEditButton: ButtonItem = {
		label: translate('profile.data.edit.button.cancel'),
		type: BUTTON_TYPES.LINK
	};

	// CARITAS-976: an empty url is valid (it removes the override); a non-empty one must
	// contain the allowed domain.
	const trimmedRegistrationUrl = editedRegistrationUrl.trim();
	const isRegistrationUrlValid =
		trimmedRegistrationUrl.length === 0 ||
		isValidRegistrationUrl(trimmedRegistrationUrl);
	const isDisplayNameValid =
		!isDisplayNameFeatureEnabled || !!editedDisplayName;
	const isSaveDisabled = !isDisplayNameValid || !isRegistrationUrlValid;

	const saveEditButton: ButtonItem = {
		disabled: isSaveDisabled,
		label: translate('profile.data.edit.button.save'),
		type: BUTTON_TYPES.LINK
	};

	const handleValidDisplayName = (displayName) => {
		setEditedDisplayName(displayName);
	};

	const handleCancelEditButton = () => {
		setEditedRegistrationUrl(userData.registrationUrl ?? '');
		setIsEditEnabled(false);
	};

	const handleSaveEditButton = () => {
		if (isSaveDisabled) {
			return;
		}

		const patchData: {
			displayName?: string;
			registrationUrl?: string;
		} = {};
		if (isDisplayNameFeatureEnabled) {
			patchData.displayName = editedDisplayName;
		}
		if (isConsultant) {
			// send the trimmed value, or an empty string to remove the override
			patchData.registrationUrl = trimmedRegistrationUrl;
		}

		apiPatchUserData(patchData)
			.then(() => {
				reloadUserData().catch(console.log);
				setInitialDisplayName(editedDisplayName);
				setIsEditEnabled(false);
			})
			.catch(() => {
				setIsEditEnabled(false);
			});
	};

	useEffect(() => {
		setInitialDisplayName(userData.displayName || userData.userName);
		setEditedDisplayName(userData.displayName);
	}, [userData.displayName, userData.userName]);

	useEffect(() => {
		setEditedRegistrationUrl(userData.registrationUrl ?? '');
	}, [userData.registrationUrl]);

	return (
		<div>
			<div className="profile__content__title">
				<div className="flex flex--fd-row flex--jc-sb">
					<Headline
						className="pr--3"
						text={translate('profile.data.title.information')}
						semanticLevel="5"
					/>
					{isEditable && !isEditEnabled && (
						<span
							role="button"
							className="tertiary"
							onClick={() => {
								setIsEditEnabled(true);
							}}
						>
							<PenIcon />
						</span>
					)}
				</div>
				{isConsultant && (
					<>
						<div className="profile__registrationUrlOverride mt--1">
							<label
								className="text--small tertiary"
								htmlFor="registrationUrlOverride"
							>
								{translate(
									'profile.data.registrationLink.override.label'
								)}
							</label>
							<input
								id="registrationUrlOverride"
								type="url"
								className="profile__registrationUrlOverride__input"
								value={editedRegistrationUrl}
								disabled={!isEditEnabled}
								placeholder={translate(
									'profile.data.registrationLink.override.placeholder'
								)}
								onChange={(e) =>
									setEditedRegistrationUrl(e.target.value)
								}
							/>
							{isEditEnabled && !isRegistrationUrlValid && (
								<Text
									text={translate(
										'profile.data.registrationLink.override.invalid'
									)}
									type="infoSmall"
									className="profile__registrationUrlOverride__error"
								/>
							)}
						</div>
						<PersonalRegistrationLink
							cid={userData.userId}
							className="profile__user__personal_link mb--1"
						/>
					</>
				)}
			</div>
			{isDisplayNameFeatureEnabled && (
				<div>
					<Text
						text={translate('profile.data.info.public')}
						type="standard"
						className="tertiary"
					/>
					<ul>
						<li>
							{translate(
								'profile.data.displayNameHint.formatItem1'
							)}
						</li>
						<li>
							{translate(
								'profile.data.displayNameHint.formatItem2'
							)}
						</li>
						<li>
							{translate(
								'profile.data.displayNameHint.formatItem3'
							)}
						</li>
						<li>
							{translate(
								'profile.data.displayNameHint.formatItem4'
							)}
						</li>
						<li>
							{translate(
								'profile.data.displayNameHint.formatItem5'
							)}
						</li>
						<li>
							{translate(
								'profile.data.displayNameHint.formatItem6'
							)}
						</li>
					</ul>
					<Text
						text={translate(
							'profile.data.displayNameHint.examplesTitle'
						)}
						type="standard"
						className="tertiary"
					/>
					<ul>
						<li>
							{translate(
								'profile.data.displayNameHint.exampleItem1'
							)}
						</li>
						<li>
							{translate(
								'profile.data.displayNameHint.exampleItem2'
							)}
						</li>
						<li>
							{translate(
								'profile.data.displayNameHint.exampleItem3'
							)}
						</li>
						<li>
							{translate(
								'profile.data.displayNameHint.exampleItem4'
							)}
						</li>
						<li>
							{translate(
								'profile.data.displayNameHint.exampleItem5'
							)}
						</li>
					</ul>
				</div>
			)}
			<EditableData
				label={translate('profile.data.displayName')}
				type="text"
				initialValue={initialDisplayName}
				isDisabled={!isDisplayNameFeatureEnabled || !isEditEnabled}
				onValueIsValid={handleValidDisplayName}
			/>
			{isEditable && isEditEnabled && (
				<div className="editableData__buttonSet editableData__buttonSet--edit">
					<Button
						item={cancelEditButton}
						buttonHandle={handleCancelEditButton}
					/>
					<Button
						item={saveEditButton}
						buttonHandle={handleSaveEditButton}
					/>
				</div>
			)}
		</div>
	);
};

type PersonalRegistrationLinkProps = {
	cid: string;
	className: string;
};

const PersonalRegistrationLink = ({
	cid,
	className
}: PersonalRegistrationLinkProps) => {
	const { t: translate } = useTranslation();
	const settings = useAppConfig();

	const { addNotification } = useContext(NotificationsContext);

	const registrationLink = `${settings.urls.registration}?cid=${cid}`;

	const copyRegistrationLink = useCallback(async () => {
		await copyTextToClipboard(registrationLink, () => {
			addNotification({
				notificationType: NOTIFICATION_TYPE_SUCCESS,
				title: translate(
					'profile.data.personal.registrationLink.notification.title'
				),
				text: translate(
					'profile.data.personal.registrationLink.notification.text'
				)
			});
		});
	}, [registrationLink, addNotification, translate]);

	return (
		<div
			className={`flex flex--wrap flex--ai-c flex-xl--nowrap ${className}`}
		>
			<div className="mt--1">
				<GenerateQrCode
					url={registrationLink}
					filename={'kontaktlink'}
					headline={translate(`qrCode.personal.overlay.headline`)}
					text={translate(`qrCode.personal.overlay.info`)}
				/>
			</div>
			<div className="flex flex--ai-c flex--nowrap mt--1">
				<button
					type="button"
					className="text--right text--nowrap mr--1 text--tertiary primary button-as-link"
					tabIndex={0}
					onClick={copyRegistrationLink}
					title={translate(
						'profile.data.personal.registrationLink.title'
					)}
					aria-label={translate(
						'profile.data.personal.registrationLink.title'
					)}
				>
					<CopyIcon className={`copy icn--s`} />{' '}
					{translate('profile.data.personal.registrationLink.text')}
				</button>
				<div className="flex-xl__col--no-grow flex--inline flex--ai-c">
					<div className="flex-xl__col--no-grow flex--inline flex--ai-c">
						<Tooltip
							trigger={
								<InfoIcon
									className="icn icn--xl"
									title={translate('notifications.info')}
									aria-label={translate('notifications.info')}
								/>
							}
						>
							{translate(
								'profile.data.personal.registrationLink.tooltip'
							)}
						</Tooltip>
					</div>
				</div>
			</div>
		</div>
	);
};
