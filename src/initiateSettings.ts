import { Request } from "use-request";
import { IUserSettings } from "./App";

export const DEFAULT_SETTINGS: IUserSettings = {
    notesSimilarityThreshold: 0.8,
    aiResponseTemperature: 0.7,
    showAiResponse: true,
};

const initiateSettings = async (
    fetchUserSettingsRequest: Request<IUserSettings | null, unknown, [userEmail: string]>,
    addUserSettingsRequest: Request<IUserSettings | null, unknown, [userEmail: string, userSettings: IUserSettings]>,
    setSettings: React.Dispatch<React.SetStateAction<IUserSettings | null>>
) => {
    const userEmail = sessionStorage.getItem("user_email");
    if (!userEmail) {
        return;
    }

    const userSettings = await fetchUserSettingsRequest.execute(userEmail);

    if (!userSettings) {
        await addUserSettingsRequest.execute(userEmail, DEFAULT_SETTINGS);
        setSettings(DEFAULT_SETTINGS);
        return;
    }

    setSettings(userSettings);
};

export default initiateSettings;