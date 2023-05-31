import { useState } from "react";
import {
  Auth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
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

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).catch((error) => {
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
            <div className="flex w-full justify-center items-center pb-3">
              <button className="btn btn-primary w-30" onClick={onSubmit}>
                {signModalType === SignModalType.SignIn ? "Submit" : "Register"}
              </button>
              <div className="px-2">OR</div>
              <button
                className="btn btn-outline"
                onClick={signInWithGoogle}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 50 50"
                  width="24px"
                  height="24px"
                  stroke="currentColor"
                  fill="currentColor"
                >
                  <path d="M 26 2 C 13.308594 2 3 12.308594 3 25 C 3 37.691406 13.308594 48 26 48 C 35.917969 48 41.972656 43.4375 45.125 37.78125 C 48.277344 32.125 48.675781 25.480469 47.71875 20.9375 L 47.53125 20.15625 L 46.75 20.15625 L 26 20.125 L 25 20.125 L 25 30.53125 L 36.4375 30.53125 C 34.710938 34.53125 31.195313 37.28125 26 37.28125 C 19.210938 37.28125 13.71875 31.789063 13.71875 25 C 13.71875 18.210938 19.210938 12.71875 26 12.71875 C 29.050781 12.71875 31.820313 13.847656 33.96875 15.6875 L 34.6875 16.28125 L 41.53125 9.4375 L 42.25 8.6875 L 41.5 8 C 37.414063 4.277344 31.960938 2 26 2 Z M 26 4 C 31.074219 4 35.652344 5.855469 39.28125 8.84375 L 34.46875 13.65625 C 32.089844 11.878906 29.199219 10.71875 26 10.71875 C 18.128906 10.71875 11.71875 17.128906 11.71875 25 C 11.71875 32.871094 18.128906 39.28125 26 39.28125 C 32.550781 39.28125 37.261719 35.265625 38.9375 29.8125 L 39.34375 28.53125 L 27 28.53125 L 27 22.125 L 45.84375 22.15625 C 46.507813 26.191406 46.066406 31.984375 43.375 36.8125 C 40.515625 41.9375 35.320313 46 26 46 C 14.386719 46 5 36.609375 5 25 C 5 13.390625 14.386719 4 26 4 Z" />
                </svg>
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
