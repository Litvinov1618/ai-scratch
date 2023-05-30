import { useState } from "react";
import {
  Auth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import ShowPasswordButton from "./ShowPasswordButton";

enum SignModalType {
  SignIn,
  SignUp,
}

interface Props {
  auth: Auth;
  setIsNewUser: React.Dispatch<React.SetStateAction<boolean>>;
}

function SignModal({ auth, setIsNewUser }: Props) {
  const [signModalType, setSignModalType] = useState(SignModalType.SignIn);
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  const clearMessages = () => {
    setErrorMessage("");
    setIsEmailSent(false);
  };

  const signIn = () => {
    if (!currentPassword) {
      setErrorMessage("Password is required");
      return;
    }

    signInWithEmailAndPassword(auth, email, currentPassword).catch((error) => {
      setErrorMessage(error.message);
    });
  };

  const signUp = () => {
    if (!newPassword) {
      setErrorMessage("Password is required");
      return;
    }

    if (!confirmPassword) {
      setErrorMessage("Confirm password is required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    createUserWithEmailAndPassword(auth, email, newPassword)
      .then(() => {
        setIsNewUser(true);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  const onSubmit = () => {
    if (!email) {
      setErrorMessage("Email is required");
      return;
    }

    if (signModalType === SignModalType.SignIn) {
      signIn();
      return;
    }

    signUp();
  };

  const resetPassword = () => {
    if (!email) {
      setErrorMessage("Email is required");
      return;
    }

    setErrorMessage("");
    sendPasswordResetEmail(auth, email)
      .then((res) => {
        setIsEmailSent(true);
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  const changeModalType = (type: SignModalType) => {
    clearMessages();
    setEmail("");
    setSignModalType(type);
  };

  return (
    <div>
      <input
        type="checkbox"
        id="my-modal"
        className="modal-toggle"
        defaultChecked
      />
      <div className="modal backdrop-blur-sm">
        <div className="modal-box p-0">
          <div className="p-6 pb-0">
            <h3 className="font-bold text-lg text-center">
              Sign {signModalType === SignModalType.SignIn ? "in" : "up"} now
              and let’s hack the planet together.
            </h3>
            <form className="flex flex-col gap-3 py-4">
              {errorMessage && (
                <div className="alert alert-error">
                  <div className="flex-1">
                    <label>{errorMessage}</label>
                  </div>
                </div>
              )}
              {isEmailSent && (
                <div className="alert alert-success">
                  <div className="flex-1">
                    <label>
                      Email with password reset instructions has been sent to
                      your email address.
                    </label>
                  </div>
                </div>
              )}
              <div className="form-control">
                <label className="input-group">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    className="input input-bordered grow"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearMessages();
                    }}
                  />
                </label>
              </div>
              {signModalType === SignModalType.SignIn && (
                <div className="form-control">
                  <label className="input-group relative">
                    <input
                      type={isPasswordShown ? "text" : "password"}
                      id="current-password"
                      name="current-password"
                      autoComplete="current-password"
                      className="input input-bordered grow"
                      placeholder="Password"
                      value={currentPassword}
                      onChange={(e) => {
                        setCurrentPassword(e.target.value);
                        clearMessages();
                      }}
                    />
                    <ShowPasswordButton
                      isPasswordShown={isPasswordShown}
                      setIsPasswordShown={setIsPasswordShown}
                    />
                  </label>
                </div>
              )}
              {signModalType === SignModalType.SignUp && (
                <>
                  <div className="form-control">
                    <label className="input-group relative">
                      <input
                        type={isPasswordShown ? "text" : "password"}
                        id="new-password"
                        name="new-password"
                        autoComplete="new-password"
                        className="input input-bordered grow"
                        placeholder="Password"
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          clearMessages();
                        }}
                      />
                      <ShowPasswordButton
                        isPasswordShown={isPasswordShown}
                        setIsPasswordShown={setIsPasswordShown}
                      />
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="input-group">
                      <input
                        type={isPasswordShown ? "text" : "password"}
                        id="confirm-password"
                        name="confirm-password"
                        autoComplete="new-password"
                        className="input input-bordered grow"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          clearMessages();
                        }}
                      />
                    </label>
                  </div>
                </>
              )}
            </form>
            <div className="flex w-full justify-center pb-3">
              <button className="btn btn-primary w-40" onClick={onSubmit}>
                {signModalType === SignModalType.SignIn ? "Submit" : "Register"}
              </button>
            </div>
            {signModalType === SignModalType.SignIn && (
              <div className="flex justify-center pb-3">
                <button className="link link-primary" onClick={resetPassword}>
                  I forgot my password
                </button>
              </div>
            )}
          </div>
          <ul className="menu menu-horizontal bg-base-100 rounded-box w-full">
            <li className="grow">
              <button
                className={`${
                  signModalType === SignModalType.SignIn ? "btn-active" : ""
                } btn btn-outline w-full flex justify-center`}
                onClick={() => changeModalType(SignModalType.SignIn)}
              >
                Sign in
              </button>
            </li>
            <li className="grow">
              <button
                className={`${
                  signModalType === SignModalType.SignUp ? "btn-active" : ""
                } btn btn-outline w-full flex justify-center`}
                onClick={() => changeModalType(SignModalType.SignUp)}
              >
                Sign up
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SignModal;
