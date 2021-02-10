import * as React from 'react';
import './formAccordionItem.styles';
import { ReactComponent as ValidIcon } from '../../resources/img/icons/checkmark.svg';
import { ReactComponent as UnvalidIcon } from '../../resources/img/icons/exclamation-mark.svg';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import { translate } from '../../resources/scripts/i18n/translate';

interface FormAccordionItemProps {
	title: string;
	content: string;
	index: number;
	isActive: boolean;
	validity: 'initial' | 'valid' | 'unvalid';
	onStepSubmit: Function;
	onItemHeaderClick: Function;
}

export const FormAccordionItem = (props: FormAccordionItemProps) => {
	const handleStepSubmit = () => {
		props.onStepSubmit(props.index);
	};

	const handleOnHeaderClick = () => {
		console.log('handle on header click');
		props.onItemHeaderClick(props.index);
	};

	const buttonAnswerVideoCall: ButtonItem = {
		title: translate('registration.accordion.item.continueButton.title'),
		label: translate('registration.accordion.item.continueButton'),
		type: BUTTON_TYPES.LINK
	};

	return (
		<div
			className={`formAccordionItem ${
				props.isActive ? 'formAccordionItem--active' : ''
			}`}
			role="tab"
		>
			<div
				className="formAccordionItem__header"
				role="button"
				onClick={handleOnHeaderClick}
			>
				<span className="formAccordionItem__index">{props.index}</span>
				{/*TODO: change title from span to h3 element as soon as registration h3 styles are removed*/}
				<span className="formAccordionItem__title">{props.title}</span>
				{props.validity === 'valid' && (
					<ValidIcon className="formAccordionItem__validationIcon formAccordionItem__validationIcon--valid" />
				)}
				{props.validity === 'unvalid' && (
					<UnvalidIcon className="formAccordionItem__validationIcon formAccordionItem__validationIcon--unvalid" />
				)}
			</div>
			<div className="formAccordionItem__content">
				{/* TODO: add specific component as a prop */}
				{props.content}
				<Button
					buttonHandle={handleStepSubmit}
					item={buttonAnswerVideoCall}
					disabled={false}
					className="formAccordionItem__continueButton"
				/>
			</div>
		</div>
	);
};
