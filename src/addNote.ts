import { INote } from "./App";

export interface INewNote extends Omit<INote, 'id'> {
    user_email: string;
}

const addNote = async (note: INewNote): Promise<INote | undefined> => {
    const res = await fetch(`${process.env.REACT_APP_SERVER_HOST}/notes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
    });

    if (!res.ok) {
        console.error(res.status, res.statusText);
        return;
    }

    const newNote = await res.json();

    if (newNote.error) {
        console.error(newNote.error);
        return;
    }

    return newNote;
};

export default addNote;