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
	// CARITAS-976: track the last persisted value locally so the buttons update
	// immediately after a successful save/delete, independent of the reload round-trip.
	const [savedValue, setSavedValue] = useState(initialValue ?? '');
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		setValue(initialValue ?? '');
		setSavedValue(initialValue ?? '');
	}, [initialValue]);

	const trimmed = value.trim();
	const hasStoredValue = savedValue.length > 0;
	const isDirty = trimmed !== savedValue;
	const showInvalid = trimmed.length > 0 && !isValidRegistrationUrl(trimmed);
	const isSaveDisabled =
		isSubmitting || !isDirty || trimmed.length === 0 || showInvalid;

	const handleSave = () => {
		if (isSaveDisabled) {
			return;
		}
		setIsSubmitting(true);
		onSave(trimmed)
			.then(() => setSavedValue(trimmed))
			.finally(() => setIsSubmitting(false));
	};

	const handleDelete = () => {
		setIsSubmitting(true);
		onDelete()
			.then(() => {
				setSavedValue('');
				setValue('');
			})
			.finally(() => setIsSubmitting(false));
	};

	const saveButton: ButtonItem = {
		disabled: isSaveDisabled,
		label: translate('profile.data.registrationLink.override.save'),
		type: BUTTON_TYPES.LINK
	};

	const deleteButton: ButtonItem = {
		disabled: isSubmitting,
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
