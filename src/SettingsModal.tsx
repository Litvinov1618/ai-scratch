import { useState } from "react";
import useRequest from "use-request";
import updateUserSettings from "./updateUserSettings";
import { DEFAULT_SETTINGS } from "./initiateSettings";
import { IUserSettings } from "./App";
import closeOnDialogClickOutside from "./closeOnDialogClickOutside";

interface SettingsModalProps {
  settingsModalRef: React.RefObject<HTMLDialogElement>;
  settings: IUserSettings;
  setSettings: React.Dispatch<React.SetStateAction<IUserSettings | null>>;
}

function SettingsModal({
  settingsModalRef,
  settings,
  setSettings,
}: SettingsModalProps) {
  const [similarityRange, setSimilarityRange] = useState(
    settings.notesSimilarityThreshold
  );
  const [temperatureRange, setTemperatureRange] = useState(
    settings.aiResponseTemperature
  );
  const [showAiResponse, setShowAiResponse] = useState(settings.showAiResponse);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const updateSettingsRequest = useRequest(updateUserSettings);

  const cancel = () => {
    settingsModalRef.current?.close();
  };

  const saveSettings = async () => {
    const userEmail = sessionStorage.getItem("user_email");

    if (!userEmail) {
      console.error("User email not found");
      return;
    }

    const settings = {
      notesSimilarityThreshold: +similarityRange,
      aiResponseTemperature: +temperatureRange,
      showAiResponse,
    };

    setIsLoading(true);
    const res = await updateSettingsRequest.execute(userEmail, settings);
    setIsLoading(false);

    if (!res) {
      console.error("No Settings found to update");
      setError("No Settings found to update");
      return;
    }

    setSettings(settings);
    cancel();
  };

  const onDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    closeOnDialogClickOutside(e, cancel);
  };

  return (
    <dialog
      ref={settingsModalRef}
      className="p-0 bg-transparent"
      onClick={onDialogClick}
    >
      <div className="w-fit max-w-md bg-base-100 p-6">
        <form>
          <h3 className="font-bold text-lg">Settings</h3>
          {error && (
            <div className="alert alert-error">
              <div className="flex-1">
                <label>{error}</label>
              </div>
            </div>
          )}
          <div className="py-4 flex flex-col gap-3">
            <div className="form-control w-full">
              <h2 className="text-lg font-bold mb-[-10px]">Results</h2>
              <div className="collapse collapse-arrow">
                <input type="checkbox" className="peer" />
                <div className="collapse-title max-sm:text-sm text-md tracking-tight pl-0">
                  Similarity Threshold - {similarityRange}
                </div>
                <div className="collapse-content pl-1">
                  <p className="text-sm">
                    The Similarity Threshold for notes search determines how
                    closely a note needs to match your search query to be
                    considered a match. Higher thresholds find more precise
                    matches, but may result in fewer results. Lower thresholds
                    include broader matches, potentially giving more results,
                    but they may be less relevant.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={similarityRange}
                  onChange={(e) => setSimilarityRange(+e.target.value)}
                  className="range range-xs range-primary z-10"
                />
                <button
                  className="btn btn-outline btn-xs"
                  onClick={(e) => {
                    e.preventDefault();
                    setSimilarityRange(
                      DEFAULT_SETTINGS.notesSimilarityThreshold
                    );
                  }}
                  formMethod="dialog"
                >
                  Reset
                </button>
              </div>
            </div>
            <div className="form-control w-full">
              <div className="flex justify-between pt-2 items-center">
                <h2 className="text-lg font-bold mb-[-10px]">AI Response</h2>
                <input
                  type="checkbox"
                  className="toggle toggle-primary mb-[-10px] z-10"
                  checked={showAiResponse}
                  onChange={(e) => {
                    setShowAiResponse(e.target.checked);
                  }}
                />
              </div>
              <div className="collapse collapse-arrow">
                <input type="checkbox" className="peer" />
                <div className="collapse-title max-sm:text-sm text-md tracking-tight pl-0">
                  AI Response Temperature - {temperatureRange}
                </div>
                <div className="collapse-content pl-1">
                  <p className="text-sm">
                    AI Suggestion Temperature controls the level of randomness
                    in suggested content. Lower values produce focused
                    suggestions, while higher values result in more creative and
                    diverse outputs. Experiment to find the right balance for
                    your needs.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-center relative">
                {!showAiResponse && (
                  <div className="absolute top-0 right-0 left-0 bottom-0 opacity-50 z-20 bg-base-100" />
                )}
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={temperatureRange}
                  onChange={(e) => setTemperatureRange(+e.target.value)}
                  className="range range-xs range-primary z-10"
                />
                <button
                  className="btn btn-outline btn-xs"
                  onClick={(e) => {
                    e.preventDefault();
                    setTemperatureRange(DEFAULT_SETTINGS.aiResponseTemperature);
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <div className="flex gap-2">
              <button
                className="btn btn-outline btn-sm"
                formMethod="dialog"
                onClick={cancel}
              >
                Cancel
              </button>
              <button
                className="btn btn-sm"
                formMethod="dialog"
                onClick={saveSettings}
                disabled={isLoading}
              >
                Apply
              </button>
            </div>
          </div>
        </form>
      </div>
    </dialog>
  );
}

export default SettingsModal;
