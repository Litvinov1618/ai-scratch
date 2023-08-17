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
import addUserSettings from "./addUserSettings";
import getUserSettings from "./getUserSettings";
import getAllNotes from "./getAllNotes";
import addNote from "./addNote";
import app from "./firebase";
import initiateSettings from "./initiateSettings";
import initiateNotes from "./initiateNotes";
import updateNote from "./updateNote";

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
  const updateNoteRequest = useRequest(updateNote);

  const [notes, setNotes] = useState<INote[]>([]);
  const [selectedNote, setSelectedNote] = useState<INote | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isUserChecked, setIsUserChecked] = useState(false);
  const [isEditorBlurred, setIsEditorBlurred] = useState(false);
  const [initialNotesLoaded, setInitialNotesLoaded] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [settings, setSettings] = useState<IUserSettings | null>(null);

  const auth = getAuth(app);
  const [user, setUser] = useState(auth.currentUser);

  const [quillEditorRef, setQuillEditorRef] = useState<ReactQuill | null>(null);
  const settingsModalRef = useRef<HTMLDialogElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectNewNote = async () => {
    setSelectedNote({
      id: "",
      text: "",
      delta: "",
      date: Date.now(),
    });
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const openDrawer = () => {
    setIsDrawerOpen(true);
    setIsEditorBlurred(true);
  };

  const logout = () => {
    auth.signOut();
  };

  const openSettings = () => {
    settingsModalRef.current?.showModal();
  };

  useEffect(() => {
    if (!isEditorBlurred) return;

    quillEditorRef?.blur();
    setIsEditorBlurred(false);
  }, [isEditorBlurred, quillEditorRef]);

  useEffect(
    () =>
      auth.onAuthStateChanged((user) => {
        if (!isUserChecked) setIsUserChecked(true);
        if (user?.email) {
          sessionStorage.setItem("user_email", user.email);
          setInitialNotesLoaded(false);
          initiateNotes(
            fetchNotesRequest,
            selectNewNote,
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
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [auth]
  );

  useEffect(() => registerSwipeListeners(closeDrawer, openDrawer), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey && e.key === "k") || (e.ctrlKey && e.key === "k")) {
        searchInputRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown, true);

    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!selectedNote) return;
      updateNoteRequest.execute(selectedNote);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [updateNoteRequest, selectedNote]);

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
            selectNewNote={selectNewNote}
            isDrawerOpen={isDrawerOpen}
            searchInputRef={searchInputRef}
          />
        }
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
      >
        <Header />
        <Editor
          notes={notes}
          setNotes={setNotes}
          selectedNote={selectedNote}
          setSelectedNote={setSelectedNote}
          setQuillEditorRef={setQuillEditorRef}
          selectNewNote={selectNewNote}
          addNoteRequest={addNoteRequest}
          fetchAllNotes={fetchNotesRequest.execute}
          updateNoteRequest={updateNoteRequest}
        />
      </Drawer>
    </div>
  );
}

export default App;
