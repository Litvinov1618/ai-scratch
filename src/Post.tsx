import React from "react";
import { IPost } from "./App";
import formatDate from "./formatDate";

interface Props {
  post: IPost;
  isActive?: boolean;
  selectPost: (id: string) => void;
}

const Post = ({ post, isActive, selectPost }: Props) => {
  return (
    <li onClick={() => selectPost(post.id)}>
      <div className={`${isActive ? "active" : ""} flex-col items-start`}>
        <p className="line-clamp-2">{post.text ? post.text : "New Note"}</p>
        <div className="badge badge-sm">{formatDate(+post.date)}</div>
      </div>
    </li>
  );
};

export default Post;
