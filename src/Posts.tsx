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
    }

  return (
    <div className="w-1/3">
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
