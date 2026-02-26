import React from 'react';

import { useTranslation } from 'react-i18next';

import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';

const SERVICE_ITEM_COUNT = 20;

export const HelpConsultantProfile: React.FC = () => {
	const { t: translate } = useTranslation();
	const translationPrefix = `help.consultant`;

	return (
		<>
			<div className="help__text">
				<Headline
					text={translate(`${translationPrefix}.headline`)}
					semanticLevel="3"
					className="help__text--centered"
				/>
				<Text
					text={translate(`${translationPrefix}.intro`)}
					type="standard"
					className="help__text--centered"
				/>
				<p>
					<a href="https://support.beratung.caritas.de/support/home">
						{translate(`${translationPrefix}.supportPortal`)}
					</a>
					<br />
					{translate(`${translationPrefix}.supportPortalDescription`)}
				</p>
				<p>
					<a href="https://support.beratung.caritas.de/support/home">
						{translate(`${translationPrefix}.servicePortal`)}
					</a>
					<br />
					{translate(`${translationPrefix}.servicePortalDescription`)}
				</p>
				<ul>
					{Array.from({ length: SERVICE_ITEM_COUNT }, (_, i) => (
						<li key={i + 1}>
							{translate(
								`${translationPrefix}.serviceItems.${i + 1}`
							)}
						</li>
					))}
				</ul>
				<p>
					{translate(`${translationPrefix}.note`)}
					<a href="mailto:online-beratung@caritas.de">
						{translate(`${translationPrefix}.noteEmail`)}
					</a>
					.
				</p>
			</div>
		</>
	);
};
