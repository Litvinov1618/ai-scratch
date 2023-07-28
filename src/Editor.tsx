import { useEffect, useState } from "react";
import useRequest, { UseRequestStatus } from "use-request";
import ReactQuill from "react-quill";
import { DeltaStatic, Sources } from "quill";
import { INote } from "./App";
import EditorMenu from "./EditorMenu";
import useDebounce from "./useDebounce";
import deleteNote from "./deleteNote";
import updateNote from "./updateNote";
import "react-quill/dist/quill.snow.css";
import "./quillEditorStylesOverride.css";

interface Props {
  notes: INote[];
  setNotes: React.Dispatch<React.SetStateAction<INote[]>>;
  selectedNote: INote | null;
  setSelectedNote: React.Dispatch<React.SetStateAction<INote | null>>;
  setQuillEditorRef: React.Dispatch<React.SetStateAction<ReactQuill | null>>;
  createEmptyNote: () => void;
  addNoteStatus: UseRequestStatus;
  fetchAllNotes: (userEmail: string) => Promise<INote[]>;
}

const QUILL_EDITOR_MODULES = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["code-block", "link"],
  ],
}

function Editor({
  notes,
  setNotes,
  selectedNote,
  setSelectedNote,
  setQuillEditorRef,
  createEmptyNote,
  addNoteStatus,
  fetchAllNotes,
}: Props) {
  const deleteNoteRequest = useRequest(deleteNote);
  const updateNoteRequest = useRequest(updateNote);
  const [previousSelectedNoteId, setPreviousSelectedNoteId] = useState("");
  const [showSavedIndicator, setShowSavedIndicator] = useState(false);

  const [value, setValue] = useState<ReactQuill.Value | undefined>();

  useEffect(() => {
    if (!selectedNote) return;
    setValue(selectedNote?.delta);
  }, [selectedNote]);

  const debounce = useDebounce();

  const selectFirstNote = (notes: INote[]) => {
    if (!notes.length) {
      setSelectedNote(null);
      return;
    }
    setSelectedNote(notes[0]);
  };

  const handleDelete = async (id: string) => {
    await deleteNoteRequest.execute(id);

    const userEmail = sessionStorage.getItem("user_email");

    if (!userEmail) {
      console.error("User email not found");
      return;
    }

    const updatedNotes = await fetchAllNotes(userEmail);
    setNotes(updatedNotes);
    selectFirstNote(updatedNotes);
  };

  const onTextChange = async (delta: DeltaStatic, text: string) => {
    setValue(delta);

    if (!selectedNote) {
      return;
    }

    if (selectedNote.id !== previousSelectedNoteId) {
      setPreviousSelectedNoteId(selectedNote.id);
      setShowSavedIndicator(false);
      return;
    }

    const updatedNote = {
      ...selectedNote,
      text,
      delta,
      date: Date.now(),
    };

    setSelectedNote(updatedNote);
    setShowSavedIndicator(false);

    debounce(async () => {
      await updateNoteRequest.execute({
        text: updatedNote.text,
        date: updatedNote.date,
        delta: updatedNote.delta,
        id: updatedNote.id,
      });

      const userEmail = sessionStorage.getItem("user_email");
      if (!userEmail) {
        console.error("User email not found");
        return;
      }

      const updatedNotes = await fetchAllNotes(userEmail);
      setShowSavedIndicator(true);
      setNotes(updatedNotes);
    }, 1000);
  };

  const handleKeyCombinations = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey && e.key === "Enter") || (e.metaKey && e.key === "Enter")) {
      const cantCreate = controlsDisabled || (!!notes.length && !selectedNote?.text);
      if (cantCreate) return;

      createEmptyNote();
    }

    if (e.metaKey && e.shiftKey && e.key === "Backspace" && selectedNote?.id) {
      const cantDelete = controlsDisabled || notes?.length === 1 || !selectedNote;
      if (cantDelete) return;

      handleDelete(selectedNote.id);
    }
  };

  const handleEditorChange = (
    _content: string,
    _delta: DeltaStatic,
    _source: Sources,
    editor: ReactQuill.UnprivilegedEditor
  ) => {
    if (controlsDisabled) return;
    const delta = editor.getContents();
    const text = editor.getText().replace(/\n/g, " ").trim();
    onTextChange(delta, text);
  };

  useEffect(() => {
    if (!showSavedIndicator) return;

    const timeout = setTimeout(() => {
      setShowSavedIndicator(false);
    }, 8000);

    return () => clearTimeout(timeout);
  }, [showSavedIndicator]);

  const isNoteAdding = addNoteStatus === UseRequestStatus.Pending;
  const isNoteDeleting = deleteNoteRequest.pending;

  const controlsDisabled = isNoteAdding || isNoteDeleting;

  return (
    <div className="flex flex-col flex-1 h-[100%]">
      <EditorMenu
        selectedNotes={selectedNote}
        handleDelete={handleDelete}
        createNote={createEmptyNote}
        notes={notes}
        controlsDisabled={controlsDisabled}
        showSavedIndicator={showSavedIndicator}
      />
      <ReactQuill
        ref={setQuillEditorRef}
        theme="snow"
        value={value}
        onChange={handleEditorChange}
        onKeyDown={handleKeyCombinations}
        modules={QUILL_EDITOR_MODULES}
        placeholder="What's on your mind?"
      />
    </div>
  );
}

export default Editor;
