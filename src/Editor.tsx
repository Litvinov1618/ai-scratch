import React from "react";
import { IPost } from "./App";
import EditorMenu from "./EditorMenu";

// TODO: Add Debounce

interface Props {
  posts: IPost[];
  setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
  selectedPost: IPost | null;
  setSelectedPost: React.Dispatch<React.SetStateAction<IPost | null>>;
}

function Editor({ posts, setPosts, selectedPost, setSelectedPost }: Props) {
  const formatDate = (date: number) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.toLocaleString("default", { month: "short" });
    const year = d.getFullYear();
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${day} ${month} ${year}, ${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const handleDelete = (id: string) => {
    const filteredPosts = posts.filter((post) => post.id !== id);
    setPosts(filteredPosts);
    localStorage.setItem("posts", JSON.stringify(filteredPosts));
  };

  const updatePost = (text: string) => {
    if (!selectedPost) return;
    const updatedPost: IPost = {
      id: selectedPost?.id,
      text: text,
      date: Date.now(),
    };
    setSelectedPost(updatedPost);

    const updatedPosts = posts.map((post) => {
      if (post.id === selectedPost.id) {
        return updatedPost;
      }
      return post;
    });
    setPosts(updatedPosts);
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
  };

  const onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (selectedPost) {
      updatePost(e.target.value);
      return;
    }

    const newPost: IPost = {
      id: Math.random().toString(36).substr(2, 9),
      text: e.target.value,
      date: Date.now(),
    };

    setSelectedPost(newPost);

    const updatedPosts = [...posts, newPost];

    setPosts(updatedPosts);

    localStorage.setItem("posts", JSON.stringify(updatedPosts));
  };

  const createPost = () => {
    const newSelectedPost: IPost = {
      id: Math.random().toString(36).substr(2, 9),
      text: "",
      date: Date.now(),
    };

    setSelectedPost(newSelectedPost);

    const updatedPosts = [...posts, newSelectedPost];

    setPosts(updatedPosts);

    localStorage.setItem("posts", JSON.stringify(updatedPosts));
  };

  const selectLastPost = () => {
    if (!posts.length) return;
    setSelectedPost(posts[posts.length - 2]);
  };

  return (
    <div className="form-control w-full">
      <EditorMenu
        selectedPost={selectedPost}
        selectLastPost={selectLastPost}
        handleDelete={handleDelete}
        createPost={createPost}
      />
      <div className="py-2 flex justify-center">
        <span className="badge">
          {selectedPost?.date
            ? formatDate(selectedPost.date).toString()
            : formatDate(Date.now())}
        </span>
      </div>
      <textarea
        className="textarea textarea-bordered h-80 resize-none placeholder-black"
        placeholder="What's on your mind?"
        value={selectedPost?.text || ""}
        onChange={onTextChange}
      />
    </div>
  );
}

export default Editor;
