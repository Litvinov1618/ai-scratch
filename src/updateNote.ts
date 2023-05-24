import { INote } from "./App";
import { SERVER_HOST } from "./constants";

const updateNote = async (note: INote): Promise<Response> => {
    const res = await fetch(`${SERVER_HOST}/notes/${note.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
    });

    if (!res.ok) {
        console.error(res.status, res.statusText);
        return res;
    }

    return res;
}

export default updateNote;