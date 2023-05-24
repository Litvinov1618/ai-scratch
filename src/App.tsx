import { useEffect, useState } from "react";
import useRequest from "use-request";
import ReactQuill from "react-quill";
import { getAuth } from "firebase/auth";
import Editor from "./Editor";
import Notes from "./Notes";
import Header from "./Header";
import LoadingScreen from "./LoadingScreen";
import Drawer from "./Drawer";
import SignModal from "./SignModal";
import getAllNotes from "./getAllNotes";
import addNote from "./addNote";
import registerSwipeListeners from "./registerSwipeListeners";
import checkMobileDevice from "./checkMobileDevice";
import app from "./firebase";

export interface INote {
  id: string;
  text: string;
  delta: ReactQuill.Value;
  date: number;
}

function App() {
  const addNoteRequest = useRequest(addNote);
  const fetchNotesRequest = useRequest(getAllNotes);
  const [notes, setNotes] = useState<INote[]>([]);
  const [selectedNote, setSelectedNote] = useState<INote | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isUserChecked, setIsUserChecked] = useState(false);
  const [blurEditor, setBlurEditor] = useState(false);
  const [initialNotesLoaded, setInitialNotesLoaded] = useState(false);

  const auth = getAuth(app);
  const [user, setUser] = useState(auth.currentUser);

  const [quillEditorRef, setQuillEditorRef] = useState<ReactQuill | null>(null);

  const createEmptyNote = async () => {
    const userEmail = sessionStorage.getItem("user_email");
    if (!userEmail) {
      console.error("User email not found");
      return;
    }

    const newNote = await addNoteRequest.execute({
      date: Date.now(),
      user_email: userEmail,
    });

    if (!newNote) return;

    setSelectedNote(newNote);

    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
  };

  const initiateNotes = async () => {
    const userEmail = sessionStorage.getItem("user_email");

    if (!userEmail) {
      console.error("User email not found");
      return;
    }

    const notes = await fetchNotesRequest.execute(userEmail);

    if (!notes?.length) {
      await createEmptyNote();
      return;
    }

    setInitialNotesLoaded(true);

    setNotes(notes);

    setSelectedNote(notes[0]);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const openDrawer = () => {
    setIsDrawerOpen(true);
    setBlurEditor(true);
  };

  const logout = () => {
    auth.signOut();
  };

  useEffect(() => {
    if (!blurEditor) return;

    quillEditorRef?.blur();
    setBlurEditor(false);
  }, [blurEditor, quillEditorRef]);

  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      if (!isUserChecked) setIsUserChecked(true);
      if (user?.email) {
        sessionStorage.setItem("user_email", user.email);
        setInitialNotesLoaded(false);
        initiateNotes();
      }
      setUser(user);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  useEffect(() => {
    setIsMobileDevice(checkMobileDevice());

    return registerSwipeListeners(closeDrawer, openDrawer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative">
      {isUserChecked && !user && <SignModal auth={auth} />}
      {(!initialNotesLoaded || !isUserChecked) && <LoadingScreen />}
      <Drawer
        content={
          <Notes
            selectedNote={selectedNote}
            notes={notes}
            setSelectedNote={setSelectedNote}
            closeDrawer={closeDrawer}
            logout={logout}
          />
        }
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
      >
        <Header isMobileDevice={isMobileDevice} />
        <Editor
          notes={notes}
          setNotes={setNotes}
          selectedNote={selectedNote}
          setSelectedNote={setSelectedNote}
          setQuillEditorRef={setQuillEditorRef}
          createEmptyNote={createEmptyNote}
          addNoteStatus={addNoteRequest.status}
          fetchAllNotes={fetchNotesRequest.execute}
        />
      </Drawer>
    </div>
  );
}

export default App;
