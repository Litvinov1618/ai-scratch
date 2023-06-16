import { useEffect, useRef, useState } from "react";
import useRequest from "use-request";
import ReactQuill from "react-quill";
import { getAuth } from "firebase/auth";
import LoadingScreen from "./LoadingScreen";
import TutorialModal from "./TutorialModal";
import SettingsModal from "./SettingsModal";
import SignModal from "./SignModal";
import Header from "./Header";
import Editor from "./Editor";
import Drawer from "./Drawer";
import Notes from "./Notes";
import registerSwipeListeners from "./registerSwipeListeners";
import checkMobileDevice from "./checkMobileDevice";
import addUserSettings from "./addUserSettings";
import getUserSettings from "./getUserSettings";
import getAllNotes from "./getAllNotes";
import addNote from "./addNote";
import app from "./firebase";
import initiateSettings from "./initiateSettings";
import initiateNotes from "./initiateNotes";

export interface INote {
  id: string;
  text: string;
  delta: ReactQuill.Value;
  date: number;
}

export interface IUserSettings {
  notesSimilarityThreshold: number;
  aiResponseTemperature: number;
  showAiResponse: boolean;
}

function App() {
  const addNoteRequest = useRequest(addNote);
  const fetchNotesRequest = useRequest(getAllNotes);
  const fetchUserSettingsRequest = useRequest(getUserSettings);
  const addUserSettingsRequest = useRequest(addUserSettings);

  const [notes, setNotes] = useState<INote[]>([]);
  const [selectedNote, setSelectedNote] = useState<INote | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isUserChecked, setIsUserChecked] = useState(false);
  const [blurEditor, setBlurEditor] = useState(false);
  const [initialNotesLoaded, setInitialNotesLoaded] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [settings, setSettings] = useState<IUserSettings | null>(null);

  const auth = getAuth(app);
  const [user, setUser] = useState(auth.currentUser);

  const [quillEditorRef, setQuillEditorRef] = useState<ReactQuill | null>(null);
  const settingsModalRef = useRef<HTMLDialogElement>(null);

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

  const openSettings = () => {
    settingsModalRef.current?.showModal();
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
        initiateNotes(
          fetchNotesRequest,
          createEmptyNote,
          setNotes,
          setSelectedNote,
          setInitialNotesLoaded
        );
        initiateSettings(
          fetchUserSettingsRequest,
          addUserSettingsRequest,
          setSettings
        );
      }
      setUser(user);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  useEffect(() => {
    setIsMobileDevice(checkMobileDevice());

    return registerSwipeListeners(closeDrawer, openDrawer);
  }, []);

  return (
    <div className="relative">
      {settings && (
        <SettingsModal
          settingsModalRef={settingsModalRef}
          settings={settings}
          setSettings={setSettings}
        />
      )}
      {isUserChecked && !user && (
        <SignModal auth={auth} setIsNewUser={setIsNewUser} />
      )}
      {(!initialNotesLoaded || !isUserChecked) && <LoadingScreen />}
      {isNewUser && <TutorialModal setIsNewUser={setIsNewUser} />}
      <Drawer
        content={
          <Notes
            selectedNote={selectedNote}
            notes={notes}
            setSelectedNote={setSelectedNote}
            closeDrawer={closeDrawer}
            logout={logout}
            openSettings={openSettings}
            settings={settings}
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
