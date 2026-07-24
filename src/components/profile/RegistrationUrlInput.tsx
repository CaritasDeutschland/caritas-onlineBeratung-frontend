import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import { Text } from '../text/Text';

/** CARITAS-976: only URLs containing this domain are accepted as a registration redirect. */
export const ALLOWED_REGISTRATION_DOMAIN = 'caritas-onlineberatung.de';

export const isValidRegistrationUrl = (value: string): boolean =>
	value.toLowerCase().includes(ALLOWED_REGISTRATION_DOMAIN);

type RegistrationUrlInputProps = {
	initialValue?: string;
	onSave: (url: string) => Promise<any>;
	onDelete: () => Promise<any>;
};

export const RegistrationUrlInput = ({
	initialValue,
	onSave,
	onDelete
}: RegistrationUrlInputProps) => {
	const { t: translate } = useTranslation();
	const [value, setValue] = useState(initialValue ?? '');
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		setValue(initialValue ?? '');
	}, [initialValue]);

	const trimmed = value.trim();
	const hasStoredValue = !!(initialValue && initialValue.length > 0);
	const isDirty = trimmed !== (initialValue ?? '');
	const showInvalid = trimmed.length > 0 && !isValidRegistrationUrl(trimmed);
	const isSaveDisabled =
		isSubmitting || !isDirty || trimmed.length === 0 || showInvalid;

	const handleSave = () => {
		if (isSaveDisabled) {
			return;
		}
		setIsSubmitting(true);
		onSave(trimmed).finally(() => setIsSubmitting(false));
	};

	const handleDelete = () => {
		setIsSubmitting(true);
		onDelete().finally(() => setIsSubmitting(false));
	};

	const saveButton: ButtonItem = {
		disabled: isSaveDisabled,
		label: translate('profile.data.registrationLink.override.save'),
		type: BUTTON_TYPES.LINK
	};

	const deleteButton: ButtonItem = {
		label: translate('profile.data.registrationLink.override.delete'),
		type: BUTTON_TYPES.LINK
	};

	return (
		<div className="profile__registrationUrlOverride mt--1">
			<label
				className="text--small tertiary"
				htmlFor="registrationUrlOverride"
			>
				{translate('profile.data.registrationLink.override.label')}
			</label>
			<input
				id="registrationUrlOverride"
				type="url"
				className="profile__registrationUrlOverride__input"
				value={value}
				placeholder={translate(
					'profile.data.registrationLink.override.placeholder'
				)}
				onChange={(e) => setValue(e.target.value)}
			/>
			{showInvalid && (
				<Text
					text={translate(
						'profile.data.registrationLink.override.invalid'
					)}
					type="infoSmall"
					className="profile__registrationUrlOverride__error"
				/>
			)}
			<div className="editableData__buttonSet">
				<Button item={saveButton} buttonHandle={handleSave} />
				{hasStoredValue && (
					<Button item={deleteButton} buttonHandle={handleDelete} />
				)}
			</div>
		</div>
	);
};
