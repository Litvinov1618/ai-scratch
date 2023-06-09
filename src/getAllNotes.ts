import { INote } from "./App";

const getAllNotes = async (userEmail: string): Promise<INote[]> => {
    const res = await fetch(`${process.env.REACT_APP_SERVER_HOST}/notes?user_email=${userEmail}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });

    if (!res.ok) {
        console.error(res.status, res.statusText);
        return [];
    }

    const notes = await res.json();

    if (notes.error) {
        console.error(notes.error);
        return [];
    }

    return notes;
};

export default getAllNotes;