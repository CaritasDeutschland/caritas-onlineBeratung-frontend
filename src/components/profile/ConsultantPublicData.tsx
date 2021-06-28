import * as React from 'react';
import { useContext } from 'react';
import { UserDataContext } from '../../globalState';
import { translate } from '../../utils/translate';
import { Headline } from '../headline/Headline';
import { Text } from '../text/Text';

export const ConsultantPublicData = () => {
	const { userData } = useContext(UserDataContext);

	return (
		<div>
			<div className="profile__content__title">
				<Headline
					text={translate('profile.data.title.public')}
					semanticLevel="5"
				/>
				<Text
					text={translate('profile.data.info.public')}
					type="infoLargeAlternative"
				/>
			</div>
			<div className="profile__data__item">
				<p className="profile__data__label">
					{translate('profile.data.userName')}
				</p>
				<p className="profile__data__content">{userData.userName}</p>
			</div>
			<div className="profile__data__item">
				<p className="profile__data__label">
					{translate('profile.data.agency')}
				</p>
				{userData.agencies.map((item, i) => {
					return (
						<p className="profile__data__content" key={i}>
							{item.name}
						</p>
					);
				})}
			</div>
		</div>
	);
};
