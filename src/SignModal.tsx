import React, { useState } from "react";

enum SignModalType {
  SignIn,
  SignUp,
}

function SignModal() {
  const [signModalType, setSignModalType] = useState(SignModalType.SignIn);
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
            <div className="flex flex-col gap-3 py-4">
              <div className="form-control">
                <label className="input-group">
                  <input
                    type="text"
                    className="input input-bordered grow"
                    placeholder="Email"
                  />
                </label>
              </div>
              <div className="form-control">
                <label className="input-group">
                  <input
                    type="text"
                    className="input input-bordered grow"
                    placeholder="Password"
                  />
                </label>
              </div>
              {signModalType === SignModalType.SignUp && (
                <div className="form-control">
                  <label className="input-group">
                    <input
                      type="text"
                      className="input input-bordered grow"
                      placeholder="Confirm password"
                    />
                  </label>
                </div>
              )}
            </div>
            <div className="flex w-full justify-center pb-3">
              <button className="btn btn-primary w-40">
                {signModalType === SignModalType.SignIn ? "Submit" : "Register"}
              </button>
            </div>
          </div>
          <ul className="menu menu-horizontal bg-base-100 rounded-box w-full">
            <li className="grow">
              <button
                className={`${
                  signModalType === SignModalType.SignIn ? "btn-active" : ""
                } btn btn-outline w-full flex justify-center`}
                onClick={() => setSignModalType(SignModalType.SignIn)}
              >
                Sign in
              </button>
            </li>
            <li className="grow">
              <button
                className={`${
                  signModalType === SignModalType.SignUp ? "btn-active" : ""
                } btn btn-outline w-full flex justify-center`}
                onClick={() => setSignModalType(SignModalType.SignUp)}
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
