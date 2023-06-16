import { useMemo } from "react";
import { INote } from "./App";
import { showDate, showTime } from "./formatDate";

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
    if (typeof note.delta === "string" || !note.delta?.ops) {
      return {
        title: note.text,
        subtitle: "",
      };
    }
    const firstDeltaOpsInsert = note.delta.ops[0]?.insert;
    const secondDeltaOpsInsert = note.delta.ops[1]?.insert;
    if (typeof firstDeltaOpsInsert !== "string") {
      return {
        title: note.text,
        subtitle: "",
      };
    }

    const splitted = firstDeltaOpsInsert.split("\n").filter((s) => s);
    if (splitted.length === 1) {
      return {
        title: firstDeltaOpsInsert,
        subtitle: secondDeltaOpsInsert?.replace("\n", "") || "",
      };
    }

    return {
      title: splitted[0],
      subtitle: splitted[1],
    };
  }, [note]);

  const isDateToday = useMemo(() => {
    const date = new Date(+note.date);
    const today = new Date();

    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }, [note.date]);

  return (
    <li onClick={onNoteClick}>
      <div className={`${isActive ? "active" : ""} flex-col items-start gap-2`}>
        <p className="line-clamp-2 break-all">{noteText.title || "New Note"}</p>
        <div className="flex gap-2 justify-between">
          <div className="badge badge-sm max-w-[100px]">
            {isDateToday ? showTime(+note.date) : showDate(+note.date)}
          </div>
          <div className="text-xs line-clamp-1 break-all flex-1">
            {noteText.subtitle}
          </div>
        </div>
      </div>
    </li>
  );
};

export default Note;
