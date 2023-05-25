import { INote } from "./App";

interface ISearchNotesResponse {
    notes: INote[];
    aiResponse: string;
    error: boolean;
}

const searchNotes = async (searchValue: string, userEmail: string): Promise<ISearchNotesResponse> => {
    const res = await fetch(
        `${process.env.REACT_APP_SERVER_HOST}/notes/search?search_value=${searchValue}&user_email=${userEmail}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    if (!res.ok) {
        console.error(res.status, res.statusText);
        return {
            notes: [],
            aiResponse: `Error while searching notes: ${res.status} ${res.statusText}`,
            error: true,
        }
    }

    const data = await res.json();

    if (data.error) {
        console.error(data.error);
        return {
            notes: [],
            aiResponse: "Error while searching notes: " + data.error,
            error: true,
        }
    }

    return data;
}

export default searchNotes;