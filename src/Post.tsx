import React from "react";
import { IPost } from "./App";
import formatDate from "./formatDate";

interface Props {
  post: IPost;
  isActive?: boolean;
  selectPost: (id: string) => void;
  selectedPost: IPost | null;
}

const Post = ({ post, isActive, selectPost, selectedPost }: Props) => {
  const onPostClick = () => {
    if (selectedPost?.id === post.id) return;
    selectPost(post.id);
  };
  return (
    <li onClick={onPostClick}>
      <div className={`${isActive ? "active" : ""} flex-col items-start`}>
        <p className="line-clamp-2 break-all">{post.text ? post.text : "New Note"}</p>
        <div className="badge badge-sm">{formatDate(+post.date)}</div>
      </div>
    </li>
  );
};

export default Post;
