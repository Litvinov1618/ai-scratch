import { useMemo } from "react";
import { INote } from "./App";
import { showDate, showTime } from "./formatDate";

interface Props {
  note: INote;
  selectNote: (id: string) => void;
  isSelected: boolean;
}

const Note = ({ note, selectNote, isSelected }: Props) => {
  const onNoteClick = () => {
    if (isSelected) return;
    selectNote(note.id);
  };

  const noteContent = useMemo(() => {
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
      <div
        className={`${
          isSelected ? "active" : ""
        } flex-col items-start gap-2 min-h-[72px] justify-center`}
      >
        <p className="line-clamp-2">{noteContent.title || <span className="opacity-60">Empty note</span>}</p>
        {noteContent.title && (
          <div className="flex gap-2 justify-between">
            <div className="badge badge-sm max-w-[120px]">
              {isDateToday ? showTime(+note.date) : showDate(+note.date)}
            </div>
            <div className="text-xs line-clamp-1 flex-1">
              {noteContent.subtitle}
            </div>
          </div>
        )}
      </div>
    </li>
  );
};

export default Note;
