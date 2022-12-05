import * as React from 'react';
import { createContext, useCallback, useEffect, useState } from 'react';
import {
	apiRocketChatSettingsPublic,
	IBooleanSetting,
	INumberSetting,
	SETTING_E2E_ENABLE,
	SETTING_HIDE_SYSTEM_MESSAGES,
	SETTING_MESSAGE_MAXALLOWEDSIZE,
	TSetting
} from '../../api/apiRocketChatSettingsPublic';
import { INPUT_MAX_LENGTH } from '../../components/messageSubmitInterface/richtextHelpers';
import {
	ENCRYPTION_VERSION_ACTIVE,
	KEY_ID_LENGTH,
	MAX_PREFIX_LENGTH,
	VECTOR_LENGTH,
	VERSION_SEPERATOR
} from '../../utils/encryptionHelpers';
import { apiPostError, ERROR_LEVEL_WARN } from '../../api/apiPostError';

const SETTINGS_TO_FETCH = [
	SETTING_E2E_ENABLE,
	SETTING_MESSAGE_MAXALLOWEDSIZE,
	SETTING_HIDE_SYSTEM_MESSAGES
];

type RocketChatGlobalSettingsContextProps = {
	settings: TSetting[];
	getSetting: <T extends TSetting>(id: T['_id']) => T | null;
};

export const RocketChatGlobalSettingsContext =
	createContext<RocketChatGlobalSettingsContextProps>(null);

export const RocketChatGlobalSettingsProvider = (props) => {
	const [settings, setSettings] = useState<TSetting[]>([]);

	useEffect(() => {
		apiRocketChatSettingsPublic(SETTINGS_TO_FETCH).then((res) =>
			setSettings(res.settings)
		);
	}, []);

	const getSetting = useCallback(
		<T extends TSetting>(id: T['_id']): T | null => {
			return (settings.find((s) => s._id === id) as T) ?? null;
		},
		[settings]
	);

	// Check rc configured message length
	useEffect(() => {
		if (settings.length <= 0) {
			return;
		}
		const isE2eeEnabled =
			getSetting<IBooleanSetting>(SETTING_E2E_ENABLE)?.value ?? false;
		const configuredInputMaxLength =
			getSetting<INumberSetting>(SETTING_MESSAGE_MAXALLOWEDSIZE)?.value ??
			0;

		let requiredInputMaxLength = INPUT_MAX_LENGTH;

		if (isE2eeEnabled) {
			// Calculate required size plus 100 signs as extra space
			requiredInputMaxLength =
				(requiredInputMaxLength + VECTOR_LENGTH * 2) * 2 +
				KEY_ID_LENGTH +
				MAX_PREFIX_LENGTH +
				VERSION_SEPERATOR.length +
				ENCRYPTION_VERSION_ACTIVE.length +
				100;
		}

		if (configuredInputMaxLength < requiredInputMaxLength) {
			console.error('Max allowed size is configured too short in RC!');
			apiPostError({
				name: 'MessageMaxAllowedSize',
				message: `Max allowed size is configured too short in RC! Configured: ${configuredInputMaxLength} Required: ${requiredInputMaxLength}`,
				level: ERROR_LEVEL_WARN
			}).then();
		}
	}, [getSetting, settings.length]);

	return (
		<RocketChatGlobalSettingsContext.Provider
			value={{ settings, getSetting }}
		>
			{props.children}
		</RocketChatGlobalSettingsContext.Provider>
	);
};
