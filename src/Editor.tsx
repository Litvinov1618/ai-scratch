import { useEffect, useState } from "react";
import useRequest, { UseRequestStatus } from "use-request";
import ReactQuill from "react-quill";
import { DeltaStatic } from "quill";
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

    const updatedNote = {
      ...selectedNote,
      text,
      delta,
      date: Date.now(),
    };

    setSelectedNote(updatedNote);

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
      setNotes(updatedNotes);
    }, 1000);
  };

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
      />
      <ReactQuill
        ref={(ref) => {
          setQuillEditorRef(ref);
        }}
        theme="snow"
        value={value}
        onChange={(_content, _delta, _source, editor) => {
          if (controlsDisabled) return;
          const delta = editor.getContents();
          const text = editor.getText().replace(/\n/g, " ").trim();
          onTextChange(delta, text);
        }}
        modules={{
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["image", "code-block"],
          ],
        }}
        placeholder="What's on your mind?"
      />
    </div>
  );
}

export default Editor;
