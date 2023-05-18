import React from "react";
import { IPost } from "./App";
import EditorMenu from "./EditorMenu";
import useDebounce from "./useDebounce";
import deletePost from "./deletePost";
import updatePost from "./updatePost";
import fetchPosts from "./fetchPosts";
import useRequest, { UseRequestStatus } from "use-request";

interface Props {
  posts: IPost[];
  setPosts: React.Dispatch<React.SetStateAction<IPost[]>>;
  selectedPost: IPost | null;
  setSelectedPost: React.Dispatch<React.SetStateAction<IPost | null>>;
  editorInputRef: React.RefObject<HTMLTextAreaElement>;
  createEmptyPost: () => void;
  addPostStatus: UseRequestStatus;
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
  const deletePostRequest = useRequest(deletePost);
  const updatePostRequest = useRequest(updatePost);
  const fetchPostsRequest = useRequest(fetchPosts);

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
    await deletePostRequest.execute(id);
    const updatedPosts = await fetchPostsRequest.execute();
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
      await updatePostRequest.execute(
        { text: updatedPost.text, date: updatedPost.date },
        selectedPost.id
      );
      const updatedPosts = await fetchPostsRequest.execute();
      setPosts(updatedPosts);
    }, 1000);
  };

  const isPostAdding = addPostStatus === UseRequestStatus.Pending;
  const isPostDeleting = deletePostRequest.pending;

  const controlsDisabled = isPostAdding || isPostDeleting;

  return (
    <div className="form-control flex w-full max-sm:h-[88%] h-[90%]">
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
