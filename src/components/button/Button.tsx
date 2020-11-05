import * as React from 'react';
import { useEffect } from 'react';
import { OVERLAY_RESET_TIME } from '../overlay/Overlay';
import './button.styles';

export const BUTTON_TYPES = {
	PRIMARY: 'PRIMARY',
	GHOST: 'GHOST',
	LINK: 'LINK',
	TERTIARY: 'TERTIARY',
	AUTO_CLOSE: 'AUTO_CLOSE'
};

export interface ButtonItem {
	label: string;
	function?: string;
	type: string;
	id?: string;
	target?: string;
}

export interface ButtonProps {
	buttonHandle: Function;
	disabled?: boolean;
	isLink?: boolean;
	item: ButtonItem;
}

export const Button = (props: ButtonProps) => {
	const item = props.item;
	let timeoutID: number;

	useEffect(() => {
		handleButtonTimer();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const handleButtonTimer = () => {
		if (item.type === BUTTON_TYPES.AUTO_CLOSE) {
			timeoutID = window.setTimeout(() => {
				props.buttonHandle(item.function, item.target);
			}, OVERLAY_RESET_TIME);
		}
	};

	const getButtonClassName = (type: string) => {
		let className;
		switch (type) {
			case BUTTON_TYPES.PRIMARY:
				className = 'button__primary';
				break;
			case BUTTON_TYPES.GHOST:
				className = 'button__ghost';
				break;
			case BUTTON_TYPES.TERTIARY:
				className = 'button__tertiary';
				break;
			case BUTTON_TYPES.LINK:
				className = 'button__link';
				break;
			case BUTTON_TYPES.AUTO_CLOSE:
				className = 'button__autoClose';
				break;
			default:
				className = '';
		}
		return className;
	};

	const handleButtonClick = (event) => {
		if (props.disabled || !props.isLink) {
			event.preventDefault();
		}

		if (!props.disabled) {
			window.clearTimeout(timeoutID);
			props.buttonHandle(item.function, item.target);
		}
	};

	return (
		<div className="button__wrapper">
			<button
				onClick={(event) => handleButtonClick(event)}
				id={item.id}
				className={
					'button__item ' +
					getButtonClassName(item.type) +
					(props.disabled ? ' button__item--disabled' : '')
				}
			>
				{item.id === 'reloadButton' ? (
					<svg
						className="button__icon"
						width="24px"
						height="24px"
						viewBox="0 0 24 24"
						version="1.1"
						xmlns="http://www.w3.org/2000/svg"
						xmlnsXlink="http://www.w3.org/1999/xlink"
					>
						<g
							id="Icon_Reload"
							stroke="none"
							strokeWidth="1"
							fill="none"
							fillRule="evenodd"
						>
							<g
								id="Reload-Icon"
								transform="translate(0.000000, 3.000000)"
								fill="#CC1E1C"
								fillRule="nonzero"
							>
								<path
									d="M20.6345966,8.76067542 C20.6345966,3.93002702 16.7045696,0 11.8739212,0 C9.81055207,0 7.85581448,0.708766008 6.28816352,2.01100343 L8.35460016,4.09873164 C9.36310541,3.33406027 10.5868016,2.92036773 11.874349,2.92036773 C15.094325,2.92036773 17.7146567,5.54022889 17.7146567,8.76067542 L15.7153092,8.76067542 C15.4604086,8.76067542 15.2537708,8.96731323 15.2537708,9.22221388 C15.2537708,9.34462897 15.3024029,9.46202963 15.3889675,9.54858612 L18.8482544,13.0075495 C19.0285141,13.1877618 19.3207323,13.187755 19.5009836,13.0075342 L22.959947,9.54857086 C23.1401889,9.36832888 23.1401889,9.07609889 22.959947,8.89585691 C22.8733917,8.80930166 22.7559976,8.76067542 22.63359,8.76067542 L20.6345966,8.76067542 L20.6345966,8.76067542 Z"
									id="Path"
								></path>
								<path
									d="M11.8739212,14.6014109 C8.65351745,14.6014109 6.03361351,11.9810792 6.03361351,8.76067542 L8.03253318,8.76067542 C8.28743383,8.76067542 8.49407164,8.55403761 8.49407164,8.29913696 C8.49407164,8.17672187 8.44543948,8.05932121 8.35887489,7.97276472 L4.899588,4.51380138 C4.71932829,4.33358905 4.42711007,4.33359588 4.24685878,4.51381664 L0.787895437,7.97277998 C0.607653457,8.15302197 0.607653457,8.44525196 0.787895437,8.62549394 C0.874450689,8.71204919 0.991844803,8.76067542 1.11425241,8.76067542 L3.11324578,8.76067542 L3.11324578,8.76067542 C3.11324578,13.5913238 7.0432728,17.5213508 11.8739212,17.5213508 C13.9339251,17.5213508 15.8850283,16.8154845 17.4511629,15.5178368 L15.388586,13.4265229 C14.3811493,14.1887134 13.159069,14.6014109 11.8739212,14.6014109 Z"
									id="Path"
								></path>
							</g>
						</g>
					</svg>
				) : null}
				{item.label}
			</button>
		</div>
	);
};