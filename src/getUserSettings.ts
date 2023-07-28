import { IUserSettings } from "./App";

const getUserSettings = async (userEmail: string): Promise<IUserSettings | null> => {
    const res = await fetch(`${process.env.REACT_APP_SERVER_HOST}/user-settings/${userEmail}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });

    if (!res.ok) {
        console.error(res.status, res.statusText);
        return null;
    }

    const userSettings = await res.json();

    if (Object.keys(userSettings).length === 0) {
        return null;
    }

    return {
        notesSimilarityThreshold: userSettings.notes_similarity_threshold,
        aiResponseTemperature: userSettings.ai_response_temperature,
        showAiResponse: userSettings.show_ai_response,
    };
};

export default getUserSettings;