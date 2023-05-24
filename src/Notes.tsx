import { useEffect, useState } from "react";
import Note from "./Note";
import { INote } from "./App";
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
}

function Notes({
  notes,
  selectedNote,
  setSelectedNote,
  closeDrawer,
  logout,
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
      userEmail
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
    <div className="max-lg:p-3 p-4 w-full relative">
      <div className="form-control hover:bg-transparent pb-1">
        <NotesSearch
          onSearch={onSearch}
          isSearching={isSearching}
          clearSearchResults={clearSearchResults}
        />
        <AIResponseBubble aiResponse={aiResponse} />
      </div>
      <div className="overflow-auto h-[87%] no-scrollbar">
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
      <div className="absolute bottom-0 left-0 right-0 flex justify-center p-2 bg-base-100 border-t border-gray-950">
        <button className="btn btn-outline" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Notes;
