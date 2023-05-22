import { useEffect, useState } from "react";
import useRequest, { UseRequestStatus } from "use-request";
import ReactQuill from "react-quill";
import { DeltaStatic } from "quill";
import { IPost } from "./App";
import EditorMenu from "./EditorMenu";
import useDebounce from "./useDebounce";
import deletePost from "./deletePost";
import updatePost from "./updatePost";
import getAllPosts from "./getAllPosts";
import "react-quill/dist/quill.snow.css";
import "./quillEditorStylesOverride.css";

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
  const fetchPostsRequest = useRequest(getAllPosts);

  const [value, setValue] = useState<ReactQuill.Value | undefined>();

  useEffect(() => {
    if (!selectedPost) return;
    setValue(selectedPost?.delta);
  }, [selectedPost]);

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

  const onTextChange = async (delta: DeltaStatic, text: string) => {
    setValue(delta);

    if (!selectedPost) {
      return;
    }

    const updatedPost = {
      ...selectedPost,
      text,
      delta,
      date: Date.now(),
    };

    setSelectedPost(updatedPost);

    debounce(async () => {
      await updatePostRequest.execute({
        text: updatedPost.text,
        date: updatedPost.date,
        delta: updatedPost.delta,
        id: updatedPost.id,
      });
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
      <ReactQuill
        theme="snow"
        value={value}
        onChange={(_content, _delta, _source, editor) => {
          if (controlsDisabled) return;
          const delta = editor.getContents();
          const text = editor.getText().replace(/\n/g, " ").trim();
          onTextChange(delta, text);
        }}
        modules={{
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: "ordered" }, { list: "bullet" }],
            ["image", "code-block"],
          ],
        }}
        placeholder="What's on your mind?"
      />
    </div>
  );
}

export default Editor;
