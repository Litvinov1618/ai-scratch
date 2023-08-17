import { INote } from "./App";

const updateNote = async (note: INote): Promise<Response> => {
    const res = await fetch(`${process.env.REACT_APP_SERVER_HOST}/notes/${note.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(note),
        keepalive: true,
    });

    if (!res.ok) {
        console.error(res.status, res.statusText);
        return res;
    }

    return res;
}

export default updateNote;