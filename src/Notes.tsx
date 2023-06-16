import { useEffect, useState } from "react";
import Note from "./Note";
import { INote, IUserSettings } from "./App";
import AIResponseBubble, {
  AIResponse,
  AIResponseType,
} from "./AIResponseBubble";
import NotesSearch from "./NotesSearch";
import searchNotes from "./searchNotes";

interface Props {
  notes: INote[];
  selectedNote: INote | null;
  setSelectedNote: React.Dispatch<React.SetStateAction<INote | null>>;
  closeDrawer: () => void;
  logout: () => void;
  openSettings: () => void;
  settings: IUserSettings | null;
}

function Notes({
  notes,
  selectedNote,
  setSelectedNote,
  closeDrawer,
  logout,
  openSettings,
  settings,
}: Props) {
  const [visibleNotes, setVisibleNotes] = useState(notes);
  const [isSearching, setIsSearching] = useState(false);
  const [aiResponse, setAiResponse] = useState<AIResponse>({
    message: "",
    type: AIResponseType.Info,
  });

  const selectNote = (id: string) => {
    const note = notes.find((note) => note.id === id);
    if (!note) return;
    setSelectedNote(note);
    closeDrawer();
  };

  const filterNotes = async (searchValue: string) => {
    setIsSearching(true);

    const userEmail = sessionStorage.getItem("user_email");
    if (!userEmail) {
      setIsSearching(false);
      console.error("User email not found");
      return;
    }

    const { notes, aiResponse, error } = await searchNotes(
      searchValue,
      userEmail,
      settings?.notesSimilarityThreshold,
      settings?.aiResponseTemperature
    );

    setAiResponse({
      message: aiResponse,
      type: error ? AIResponseType.Error : AIResponseType.Info,
    });

    setVisibleNotes(notes);
    setIsSearching(false);
  };

  const onSearch = (searchValue: string) => {
    if (!searchValue) {
      setVisibleNotes(notes);
      return;
    }

    filterNotes(searchValue);
  };

  const clearSearchResults = () => {
    setVisibleNotes(notes);
    setAiResponse({
      message: "",
      type: AIResponseType.Info,
    });
  };

  useEffect(() => {
    setVisibleNotes(notes);
    setAiResponse({
      message: "",
      type: AIResponseType.Info,
    });
  }, [notes, setVisibleNotes]);

  return (
    <div className="w-[100%] h-[100%] flex flex-col fixed flex-1 overflow-hidden">
      <div className="form-control hover:bg-transparent p-2">
        <NotesSearch
          onSearch={onSearch}
          isSearching={isSearching}
          clearSearchResults={clearSearchResults}
        />
        {settings?.showAiResponse && <AIResponseBubble aiResponse={aiResponse} />}
      </div>
      <div className="h-[100%] p-2 pt-0 overflow-y-auto flex-1 no-scrollbar">
        {visibleNotes.length ? (
          <ul className="menu bg-base-100">
            {visibleNotes.map((note) => (
              <Note
                key={note.date}
                note={note}
                isActive={selectedNote?.id === note.id}
                selectNote={selectNote}
                selectedNote={selectedNote}
              />
            ))}
          </ul>
        ) : null}
      </div>
      <div className="flex justify-center gap-2 p-2 bg-base-100 border-t border-gray-950 border-opacity-10">
        <button className="btn btn-outline" onClick={logout}>
          Logout
        </button>
        <button className="btn btn-outline" onClick={openSettings}>
          <svg
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
            width="24px"
            height="24px"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Notes;
