import React, { useEffect, useRef, useState } from "react";
import Post from "./Post";
import { IPost } from "./App";
import AIResponseBubble from "./AIResponseBubble";
import searchPosts from "./searchPosts";

interface Props {
  posts: IPost[];
  selectedPost: IPost | null;
  setSelectedPost: React.Dispatch<React.SetStateAction<IPost | null>>;
}

function Posts({ posts, selectedPost, setSelectedPost }: Props) {
  const [searchValue, setSearchValue] = useState("");
  const [visiblePosts, setVisiblePosts] = useState(posts);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [aiResponse, setAiResponse] = useState("");

  const selectPost = (id: string) => {
    const post = posts.find((post) => post.id === id);
    if (!post) return;
    setSelectedPost(post);
  };

  const filterPosts = async (searchValue: string) => {
    setIsLoading(true);

    const { posts, aiResponse } = await searchPosts(searchValue);

    if (aiResponse) setAiResponse(aiResponse);

    setVisiblePosts(posts);
    setIsLoading(false);
  };

  const search = () => {
    if (!searchValue) {
      setVisiblePosts(posts);
      return;
    }

    filterPosts(searchValue);
  };

  useEffect(() => {
    setVisiblePosts(posts);
    setAiResponse("");
  }, [posts, setVisiblePosts]);

  useEffect(() => {
    if (searchValue) return;
    setVisiblePosts(posts);
    setAiResponse("");
  }, [searchValue, setVisiblePosts, posts]);

  return (
    <div className="max-lg:p-3 p-4 w-full">
      <div className="form-control hover:bg-transparent pb-1">
        <div className="input-group">
          <input
            type="text"
            placeholder="Search…"
            className="input input-bordered placeholder-black focus:outline-none w-full"
            value={searchValue}
            onChange={(e) => !isLoading && setSearchValue(e.target.value)}
            onKeyUp={(e) => {
              if (isLoading) return;
              if (e.key !== "Enter") return;
              search();
            }}
            ref={inputRef}
          />
          <button
            className={`btn btn-square ${isLoading ? "loading" : ""}`}
            onClick={search}
          >
            {!isLoading ? (
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
        {aiResponse ? (
          <div className="pt-3">
            {aiResponse ? <AIResponseBubble aiResponse={aiResponse} /> : null}
          </div>
        ) : null}
      </div>
      {visiblePosts.length ? (
        <ul className="menu bg-base-100">
          {visiblePosts.map((post) => (
            <Post
              key={post.date}
              post={post}
              isActive={selectedPost?.id === post.id}
              selectPost={selectPost}
              selectedPost={selectedPost}
            />
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default Posts;
