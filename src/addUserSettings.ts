import { IUserSettings } from './App';

const addUserSettings = async (userEmail: string, userSettings: IUserSettings): Promise<IUserSettings | null> => {
    const res = await fetch(`${process.env.REACT_APP_SERVER_HOST}/user-settings`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: userEmail,
            notes_similarity_threshold: userSettings.notesSimilarityThreshold,
            ai_response_temperature: userSettings.aiResponseTemperature,
            show_ai_response: userSettings.showAiResponse,
        }),
    });

    if (!res.ok) {
        console.error(res.status, res.statusText);
        return null;
    }

    const newUserSettings = await res.json();

    if (newUserSettings.error) {
        console.error(newUserSettings.error);
        return null;
    }

    return newUserSettings;
};

export default addUserSettings;
