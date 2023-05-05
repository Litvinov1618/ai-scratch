import React from "react";
import { IPost } from "./App";

interface Props {
  post: IPost;
  isActive?: boolean;
  selectPost: (id: string) => void;
}

const Post = ({ post, isActive, selectPost }: Props) => {
  return (
    <li onClick={() => selectPost(post.id)}>
      <div className={isActive ? "active" : ""}>
        <p className="line-clamp-2">
          {post.text ? post.text : "New Note"}
        </p>
      </div>
    </li>
  );
};

export default Post;
