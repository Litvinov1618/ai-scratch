import { INote } from "./App";
import checkIsMobile from "./checkIsMobile";
import { showFullDate } from "./formatDate";

interface Props {
  selectedNote: INote | null;
  handleDelete: (id: string) => void;
  createNote: () => void;
  notes: INote[];
  controlsDisabled: boolean;
  showSavedIndicator: boolean;
}

function EditorMenu({
  selectedNote,
  handleDelete,
  createNote,
  notes,
  controlsDisabled,
  showSavedIndicator,
}: Props) {
  const createButtonDisabled =
    controlsDisabled || (!!notes.length && !selectedNote?.text);
  const deleteButtonDisabled =
    controlsDisabled || notes?.length === 1 || !selectedNote?.id;
  const isMobile = checkIsMobile();

  return (
    <div className="indicator w-full">
      <div
        className="indicator-item indicator-center badge badge-primary transition-opacity absolute top-2"
        style={{
          opacity: showSavedIndicator ? 1 : 0,
        }}
      >
        Note saved
      </div>
      <ul className="menu menu-horizontal bg-base-100 rounded-box w-full justify-between py-3">
        <li
          className={`${createButtonDisabled ? "disabled" : ""} ${
            isMobile ? "" : "invisible"
          }`}
        >
          <button
            onClick={createNote}
            className="px-1"
            disabled={createButtonDisabled}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
        </li>
        <li>
          {selectedNote?.id && (
            <div className="flex justify-center hover:bg-inherit hover:cursor-default">
              <span className="badge">
                {selectedNote?.date
                  ? showFullDate(+selectedNote.date).toString()
                  : showFullDate(Date.now())}
              </span>
            </div>
          )}
        </li>
        <li className={deleteButtonDisabled ? "disabled" : ""}>
          <button
            onClick={() => {
              if (!selectedNote) return;
              handleDelete(selectedNote.id);
            }}
            className="px-1"
            disabled={deleteButtonDisabled}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </button>
        </li>
      </ul>
    </div>
  );
}

export default EditorMenu;
