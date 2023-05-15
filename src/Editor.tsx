import React, { useRef } from "react";
import { IPost } from "./App";
import EditorMenu from "./EditorMenu";
import useDebounce from "./useDebounce";
import deletePost from "./deletePost";
import updatePostRequest from "./updatePost";
import addPost from "./addPost";

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

  const handleDelete = async (id: string) => {
    const filteredPosts = posts.filter((post) => post.id !== id);
    setPosts(filteredPosts);
    deletePost(id);
    selectFirstPost(filteredPosts);
  };

  const updatePost = (text: string) => {
    if (!selectedPost) return;
    const updatedPost: IPost = {
      id: selectedPost.id,
      text: text,
      date: Date.now(),
      embedding: [],
    };
    setSelectedPost(updatedPost);

    debounce(async () => {
      const updatedPosts = posts.map((post) => {
        if (post.id === selectedPost.id) {
          return updatedPost;
        }
        return post;
      });
      setPosts(updatedPosts);
      updatePostRequest(updatedPost);
    }, 1000);
  };

  const onTextChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!selectedPost) {
      return;
    }
    
    updatePost(e.target.value);
  };

  const createEmptyPost = async () => {
    const newSelectedPost: Omit<IPost, 'id'> = {
      text: "",
      date: Date.now(),
      embedding: [],
    };
    const newPost = await addPost(newSelectedPost);

    setSelectedPost(newPost);

    const updatedPosts = [...posts, newPost];
    setPosts(updatedPosts);

    inputRef.current?.focus();
  };

  return (
    <div className="form-control w-full">
      <EditorMenu
        selectedPost={selectedPost}
        handleDelete={handleDelete}
        createPost={createEmptyPost}
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
