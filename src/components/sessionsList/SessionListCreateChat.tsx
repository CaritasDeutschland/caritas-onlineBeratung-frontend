import * as React from 'react';
import { translate } from '../../utils/translate';
import { ReactComponent as SpeechBubblePlusIcon } from '../../resources/img/icons/speech-bubble-plus.svg';
import './sessionsList.styles';

export const SessionListCreateChat = () => {
	return (
		<div className="sessionsListItem sessionsListItem--active createChatItem">
			<div className="sessionsListItem__content sessionsListItem__content--active">
				<div className="sessionsListItem__row">
					<div className="sessionsListItem__consultingType"></div>
				</div>
				<div className="sessionsListItem__row">
					<SpeechBubblePlusIcon className="sessionsListItem__icon" />
					<div className="sessionsListItem__username">
						{translate('groupChat.create.listItem.label')}
					</div>
				</div>
				<div className="sessionsListItem__row">
					<div className="sessionsListItem__subject"></div>
					<div className="sessionsListItem__date"></div>
				</div>
			</div>
		</div>
	);
};
