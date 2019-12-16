import React, { Fragment, useState, useEffect, useRef } from 'react';
import useAuth from '../../hooks/useAuth';

export default () => {
	const [showLogin, setLogin] = useState(false);
	const [user, setUser] = useState(null);
	const { login, logout, isAuthenticated } = useAuth();

	const email = useRef();
    const password = useRef();

	const handleLoginDisplay = () => showLogin ? setLogin(false) : setLogin(true);

	const handleLogin = e => {
        e.preventDefault();

        const userInfo = {
            email: email.current.value,
            password: password.current.value
        };

        login(userInfo);
        setUser(localStorage.getItem('credentials'));
    };

    const handleLogout = () => {
    	logout();
    	setUser(null);
    };

	const form = type => {
		return (
			<form className="fr ml6 mv3 pa3 br2 shadow-1 w-70">
				<label className="dib f6 b db mb2" htmlFor='email'>Email</label>
				<input
					className="dib fr w-70"
                    type="email"
                    required
                    ref={email}
                    id="email"
                    placeholder="Email"
				/>
				<label className="dib f6 b db mb2" htmlFor='password'>Password</label>
				<input
					className="dib fr w-70"
                    type="password"
                    required
                    ref={password}
                    id="password"
                    placeholder="Password"
				/>
				<div className="f7 fl mt3 pt1 dim pointer">Don't have an account?</div>
				<button
					className="f6 fw5 bg-white pink dim pointer pa2 pv1 mt2 fr br2"
					type="submit"
					onClick={handleLogin}>
						Submit
				</button>
			</form>
		);
	};

	return (
		<section className='fr'>
			{isAuthenticated()
				? (
					<Fragment>
						{/*<h5 className='dib pr2 dim pointer'>{user ? user.firstName : null} is THERE.</h5>*/}
						<h4 className='dib dim pointer' onClick={handleLogout}>Sign Out</h4>
					</Fragment>
				)
				: (
					<Fragment>
						<h4 className='fr dim pointer' onClick={handleLoginDisplay}>Sign In</h4>
						{showLogin ? form('login') : null}
					</Fragment>
				)
			}
		</section>
	);
};

//mt0 ph3 fr