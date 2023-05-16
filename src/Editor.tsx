import React from "react";
import { IPost } from "./App";
import EditorMenu from "./EditorMenu";
import useDebounce from "./useDebounce";
import deletePostRequest from "./deletePost";
import updatePostRequest from "./updatePost";
import useDefer, { Status } from "use-defer";
import fetchPosts from "./fetchPosts";

interface Props {
  posts: IPost[];
  setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
  selectedPost: IPost | null;
  setSelectedPost: React.Dispatch<React.SetStateAction<IPost | null>>;
  editorInputRef: React.RefObject<HTMLTextAreaElement>;
  createEmptyPost: () => void;
  addPostStatus: Status;
}

function Editor({
  posts,
  setPosts,
  selectedPost,
  setSelectedPost,
  editorInputRef,
  createEmptyPost,
  addPostStatus,
}: Props) {
  const { status: deletePostStatus, execute: deletePost } =
    useDefer(deletePostRequest);
  const { execute: updatePost } = useDefer(updatePostRequest);

  const debounce = useDebounce();

  const selectFirstPost = (posts: IPost[]) => {
    if (!posts.length) {
      setSelectedPost(null);
      editorInputRef.current?.focus();
      return;
    }
    setSelectedPost(posts[0]);
    editorInputRef.current?.focus();
  };

  const handleDelete = async (id: string) => {
    await deletePost(id);
    const updatedPosts = await fetchPosts();
    setPosts(updatedPosts);
    selectFirstPost(updatedPosts);
  };

  const onTextChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!selectedPost) {
      return;
    }

    const updatedPost = {
      ...selectedPost,
      text: e.target.value,
      date: Date.now(),
    };

    setSelectedPost(updatedPost);

    debounce(async () => {
      await updatePost(
        { text: updatedPost.text, date: updatedPost.date },
        selectedPost.id
      );
      const updatedPosts = await fetchPosts();
      setPosts(updatedPosts);
    }, 1000);
  };

  const isPostAdding = addPostStatus === Status.PENDING;
  const isPostDeleting = deletePostStatus === Status.PENDING;

  const controlsDisabled = isPostAdding || isPostDeleting;

  return (
    <div className="form-control w-full">
      <EditorMenu
        selectedPost={selectedPost}
        handleDelete={handleDelete}
        createPost={createEmptyPost}
        posts={posts}
        controlsDisabled={controlsDisabled}
      />
      <textarea
        className="textarea textarea-bordered resize-none placeholder-black h-full"
        placeholder="What's on your mind?"
        value={selectedPost?.text || ""}
        onChange={onTextChange}
        ref={editorInputRef}
        disabled={controlsDisabled}
      />
    </div>
  );
}

export default Editor;
