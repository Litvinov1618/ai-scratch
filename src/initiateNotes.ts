import { Request } from "use-request";
import { INote } from "./App";

const initiateNotes = async (
    fetchNotesRequest: Request<INote[] | null, unknown, [userEmail: string]>,
    createEmptyNote: () => Promise<void>,
    setNotes: React.Dispatch<React.SetStateAction<INote[]>>,
    setSelectedNote: React.Dispatch<React.SetStateAction<INote | null>>,
    setInitialNotesLoaded: React.Dispatch<React.SetStateAction<boolean>>
) => {
    const userEmail = sessionStorage.getItem("user_email");

    if (!userEmail) {
        console.error("User email not found");
        return;
    }

    const notes = await fetchNotesRequest.execute(userEmail);

    if (!notes?.length) {
        await createEmptyNote();
        setInitialNotesLoaded(true);
        return;
    }

    setInitialNotesLoaded(true);

    setNotes(notes);

    setSelectedNote(notes[0]);
}

export default initiateNotes;
