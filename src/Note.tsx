import { useMemo } from "react";
import { INote } from "./App";
import formatDate from "./formatDate";

interface Props {
  note: INote;
  isActive?: boolean;
  selectNote: (id: string) => void;
  selectedNote: INote | null;
}

const Note = ({ note, isActive, selectNote, selectedNote }: Props) => {
  const onNoteClick = () => {
    if (selectedNote?.id === note.id) return;
    selectNote(note.id);
  };

  const noteText = useMemo(() => {
    if (typeof note.delta === 'string' || !note.delta?.ops) return note.text;
    const firstDeltaOpsInsert = note.delta.ops[0].insert;
    if (typeof firstDeltaOpsInsert !== "string") {
      return note.text;
    }

    const nextLineIndex = firstDeltaOpsInsert.indexOf("\n");
    if (nextLineIndex === -1) {
      return firstDeltaOpsInsert;
    }

    return firstDeltaOpsInsert.slice(0, nextLineIndex);
  }, [note]);

  return (
    <li onClick={onNoteClick}>
      <div className={`${isActive ? "active" : ""} flex-col items-start`}>
        <p className="line-clamp-2 break-all">
          {noteText || "New Note"}
        </p>
        <div className="badge badge-sm">{formatDate(+note.date)}</div>
      </div>
    </li>
  );
};

export default Note;
