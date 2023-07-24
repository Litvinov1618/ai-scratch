import { useRef } from "react";

interface Props {
  onSearch: (searchValue: string) => void;
  isSearching: boolean;
  clearSearchResults: () => void;
}

function NotesSearch({ onSearch, isSearching, clearSearchResults }: Props) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="input-group">
      <input
        type="text"
        placeholder="Search…"
        className="input input-bordered placeholder-black focus:outline-none w-full"
        onChange={(e) => {
          if (isSearching) return;
          if (!e.target.value) clearSearchResults();
        }}
        onKeyUp={(e) => {
          if (isSearching) return;
          if (e.key !== "Enter") return;
          onSearch(searchInputRef.current?.value || "");
        }}
        ref={searchInputRef}
      />
      <button
        className={`btn btn-square ${isSearching ? "loading" : ""}`}
        onClick={() => onSearch(searchInputRef.current?.value || "")}
      >
        {!isSearching ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        ) : null}
      </button>
    </div>
  );
}

export default NotesSearch;
