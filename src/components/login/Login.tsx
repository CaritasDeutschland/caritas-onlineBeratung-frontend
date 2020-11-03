import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Stage } from '../stage/ts/stage';
import { translate } from '../../resources/scripts/i18n/translate';
import { InputField, InputFieldItem } from '../inputField/ts/InputField';
import { useState, useEffect } from 'react';
import { config } from '../../resources/scripts/config';
import { ButtonItem, Button, BUTTON_TYPES } from '../button/ts/Button';
import { autoLogin } from '../registration/ts/autoLogin';
import { SVG } from '../svgSet/ts/SVG';
import { ICON_KEYS } from '../svgSet/ts/SVGHelpers';
import './login.styles';
import '../../resources/styles/styles';

export const initLogin = () => {
	ReactDOM.render(<Login />, document.getElementById('loginRoot'));
};

const loginButton: ButtonItem = {
	label: translate('login.button.label'),
	type: BUTTON_TYPES.PRIMARY
};

const Login = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [isButtonDisabled, setIsButtonDisabled] = useState(
		username.length > 0 && password.length > 0
	);
	const [showLoginError, setShowLoginError] = useState(false);
	const [isRequestInProgress, setIsRequestInProgress] = useState(false);

	useEffect(() => {
		setShowLoginError(false);
		if (username && password) {
			setIsButtonDisabled(false);
		} else {
			setIsButtonDisabled(true);
		}
	}, [username, password]);

	const inputItemUsername: InputFieldItem = {
		name: 'username',
		class: 'login',
		id: 'username',
		type: 'text',
		label: translate('login.user.label'),
		content: username,
		icon: <SVG name={ICON_KEYS.PERSON} />
	};

	const inputItemPassword: InputFieldItem = {
		name: 'password',
		class: 'passwordFields__fieldGroup__input',
		id: 'passwordInput',
		type: 'password',
		label: translate('login.password.label'),
		content: password,
		icon: <SVG name={ICON_KEYS.LOCK} />
	};

	const handleUsernameChange = (event) => {
		setUsername(event.target.value);
	};

	const handlePasswordChange = (event) => {
		setPassword(event.target.value);
	};

	const handleLoginError = () => {
		setShowLoginError(true);
		setIsRequestInProgress(false);
	};

	const handleLogin = () => {
		if (isRequestInProgress) {
			return null;
		}
		setIsRequestInProgress(true);
		if (username && password) {
			autoLogin(username, password, true, handleLoginError);
		}
	};

	const handleKeyUp = (e) => {
		if (e.key === 'Enter') {
			handleLogin();
		}
	};

	return (
		<div className="loginWrapper">
			<Stage hasAnimation={true}></Stage>
			<div className="loginForm loginForm">
				<div className="loginForm__headline">
					<h1>{translate('login.headline')}</h1>
				</div>
				<InputField
					item={inputItemUsername}
					inputHandle={handleUsernameChange}
					keyUpHandle={handleKeyUp}
				/>
				<InputField
					item={inputItemPassword}
					inputHandle={handlePasswordChange}
					keyUpHandle={handleKeyUp}
				/>
				{showLoginError ? (
					<div className="formWrapper">
						<p className="formWrapper__infoText warning">
							{translate('warningLabels.login.failed')}
						</p>
					</div>
				) : null}
				<a
					href={config.endpoints.loginResetPasswordLink}
					target="_blank"
					rel="noreferrer"
					className="loginForm__passwordReset"
				>
					{translate('login.resetPasswort.label')}
				</a>
				<Button
					item={loginButton}
					buttonHandle={handleLogin}
					disabled={isButtonDisabled}
				/>
				<div className="loginForm__register">
					<p className="loginForm__register__infoText">
						{translate('login.register.infoText.title')}
						<br />
						{translate('login.register.infoText.copy')}
					</p>
					<a
						className="loginForm__register__link"
						href={
							config.endpoints.loginRedirectToRegistrationOverview
						}
						target="_self"
					>
						{translate('login.register.linkLabel')}
					</a>
				</div>
			</div>
		</div>
	);
};