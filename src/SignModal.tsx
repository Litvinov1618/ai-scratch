import React from 'react';

function SignModal() {
    return (
        <div className="modal" id="modal">
        <div className="modal__content">
            <div className="modal__header">
            <h2 className="modal__title">Sign in</h2>
            <button className="modal__close" id="close">
                &times;
            </button>
            </div>
            <div className="modal__body">
            <form className="form">
                <div className="form__group">
                <label htmlFor="email" className="form__label">
                    Email
                </label>
                <input
                    type="email"
                    className="form__input"
                    id="email"
                    placeholder="Enter email"
                    required
                />
                </div>
                <div className="form__group">
                <label htmlFor="password" className="form__label">
                    Password
                </label>
                <input
                    type="password"
                    className="form__input"
                    id="password"
                    placeholder="Enter password"
                    required
                />
                </div>
                <button className="btn btn--primary btn--block">Sign in</button>
            </form>
            </div>
        </div>
        </div>
    );
}