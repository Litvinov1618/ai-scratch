import React, { useRef } from "react";
import { IPost } from "./App";
import EditorMenu from "./EditorMenu";
import useDebounce from "./useDebounce";
import createEmbedding from "./createEmbedding";
import formatDate from "./formatDate";

interface Props {
  posts: IPost[];
  setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
  selectedPost: IPost | null;
  setSelectedPost: React.Dispatch<React.SetStateAction<IPost | null>>;
}

function Editor({ posts, setPosts, selectedPost, setSelectedPost }: Props) {
  const debounce = useDebounce();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const selectFirstPost = (posts: IPost[]) => {
    if (!posts.length) {
      setSelectedPost(null);
      inputRef.current?.focus();
      return;
    }
    setSelectedPost(posts[0]);
    inputRef.current?.focus();
  };

  const handleDelete = (id: string) => {
    const filteredPosts = posts.filter((post) => post.id !== id);
    setPosts(filteredPosts);
    localStorage.setItem("posts", JSON.stringify(filteredPosts));
    selectFirstPost(filteredPosts);
  };

  const updatePost = (text: string) => {
    if (!selectedPost) return;
    const updatedPost: IPost = {
      id: selectedPost?.id,
      text: text,
      date: Date.now(),
      embedding: [],
    };
    setSelectedPost(updatedPost);

    debounce(async () => {
      const embedding = await createEmbedding(text + " " + formatDate(updatedPost.date));

      const updatedPosts = posts.map((post) => {
        if (post.id === selectedPost.id) {
          return { ...updatedPost, embedding };
        }
        return post;
      });
      setPosts(updatedPosts);
      localStorage.setItem("posts", JSON.stringify(updatedPosts));
    }, 1000);
  };

  const onTextChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (selectedPost) {
      updatePost(e.target.value);
      return;
    }

    const newPost: IPost = {
      id: Math.random().toString(36).substr(2, 9),
      text: e.target.value,
      date: Date.now(),
      embedding: [],
    };

    setSelectedPost(newPost);

    const updatedPosts = [...posts, { ...newPost, text: "" }];

    setPosts(updatedPosts);

    localStorage.setItem("posts", JSON.stringify(updatedPosts));
  };

  const createPost = () => {
    const newSelectedPost: IPost = {
      id: Math.random().toString(36).substr(2, 9),
      text: "",
      date: Date.now(),
      embedding: [],
    };

    setSelectedPost(newSelectedPost);

    const updatedPosts = [...posts, newSelectedPost];
    setPosts(updatedPosts);

    localStorage.setItem("posts", JSON.stringify(updatedPosts));
    inputRef.current?.focus();
  };

  return (
    <div className="form-control w-full">
      <EditorMenu
        selectedPost={selectedPost}
        handleDelete={handleDelete}
        createPost={createPost}
      />
      <textarea
        className="textarea textarea-bordered resize-none placeholder-black h-full"
        placeholder="What's on your mind?"
        value={selectedPost?.text || ""}
        onChange={onTextChange}
        ref={inputRef}
        autoFocus
      />
    </div>
  );
}

export default Editor;
