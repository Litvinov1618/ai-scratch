import React from "react";
import Post from "./Post";
import { IPost } from "./App";

interface Props {
  posts: IPost[];
  selectedPost: IPost | null;
  setSelectedPost: React.Dispatch<React.SetStateAction<IPost | null>>;
}

function Posts({ posts, selectedPost, setSelectedPost }: Props) {
  const selectPost = (id: string) => {
    const post = posts.find((post) => post.id === id);
    if (!post) return;
    setSelectedPost(post);
  };

  return (
    <div className="w-1/3">
      <div className="form-control hover:bg-transparent pb-3">
        <div className="input-group">
          <input
            type="text"
            placeholder="Search…"
            className="input input-bordered placeholder-black focus:outline-none w-full"
          />
          <button className="btn btn-square">
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
          </button>
        </div>
      </div>
      {posts.length ? (
        <ul className="menu bg-base-100">
          {posts.map((post) => (
            <Post
              key={post.date}
              post={post}
              isActive={selectedPost?.id === post.id}
              selectPost={selectPost}
            />
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default Posts;
