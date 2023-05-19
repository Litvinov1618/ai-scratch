import { useRef, useState } from "react";

interface Props {
  onSearch: (searchValue: string) => void;
  isSearching: boolean;
  clearSearchResults: () => void;
}

function PostsSearch({ onSearch, isSearching, clearSearchResults }: Props) {
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="input-group">
      <input
        type="text"
        placeholder="Search…"
        className="input input-bordered placeholder-black focus:outline-none w-full"
        value={searchValue}
        onChange={(e) => {
          if (isSearching) return;
          setSearchValue(e.target.value);
          if (!e.target.value) clearSearchResults();
        }}
        onKeyUp={(e) => {
          if (isSearching) return;
          if (e.key !== "Enter") return;
          onSearch(searchValue);
        }}
        ref={inputRef}
      />
      <button
        className={`btn btn-square ${isSearching ? "loading" : ""}`}
        onClick={() => onSearch(searchValue)}
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

export default PostsSearch;
