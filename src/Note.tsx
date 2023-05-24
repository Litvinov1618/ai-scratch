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
  return (
    <li onClick={onNoteClick}>
      <div className={`${isActive ? "active" : ""} flex-col items-start`}>
        <p className="line-clamp-2 break-all">
          {note.text ? note.text : "New Note"}
        </p>
        <div className="badge badge-sm">{formatDate(+note.date)}</div>
      </div>
    </li>
  );
};

export default Note;
