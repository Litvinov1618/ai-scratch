import React, { useEffect, useRef, useState } from "react";
import Editor from "./Editor";
import Posts from "./Posts";
import DrawerButton from "./DrawerButton";
import fetchPosts from "./fetchPosts";
import useRequest from "use-request";
import addPost from "./addPost";

export interface IPost {
  id: string;
  text: string;
  date: number;
  embedding: number[];
}

function App() {
  const addPostRequest = useRequest(addPost);
  const fetchPostsRequest = useRequest(fetchPosts);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);

  const editorInputRef = useRef<HTMLTextAreaElement>(null);

  const createEmptyPost = async () => {
    const newSelectedPost: Omit<IPost, "id"> = {
      text: "",
      date: Date.now(),
      embedding: [],
    };
    const newPost = await addPostRequest.execute(newSelectedPost);

    setSelectedPost(newPost);

    const updatedPosts = [...posts, newPost];
    setPosts(updatedPosts);

    editorInputRef.current?.focus();
  };

  const initiatePosts = async () => {
    const notes = await fetchPostsRequest.execute();

    if (!notes?.length) {
      return;
    }

    setPosts(notes);

    setSelectedPost(notes[0]);
  };

  useEffect(() => {
    initiatePosts();
  }, []);

  useEffect(() => {
    if (fetchPostsRequest.completed && !posts.length) {
      createEmptyPost();
    }
  }, [fetchPostsRequest.completed, posts]);

  return (
    <div className="drawer drawer-mobile">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <div className="isolate p-4 lg:pl-1 h-screen max-sm:px-2 max-sm:py-4">
          <div className="text-5xl text-center mb-7 relative">
            AI Scratch
            <div className="absolute top-0 bottom-0 left-0 flex align-middle">
              <DrawerButton />
            </div>
          </div>
          <div className="flex w-full max-sm:h-[88%] h-[90%]">
            <Editor
              posts={posts}
              setPosts={setPosts}
              selectedPost={selectedPost}
              setSelectedPost={setSelectedPost}
              editorInputRef={editorInputRef}
              createEmptyPost={createEmptyPost}
              addPostStatus={addPostRequest.status}
            />
          </div>
        </div>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay" />
        <div className="flex bg-base-100 justify-between w-96 max-sm:w-[320px] max-lg:w-[500px]">
          <Posts
            selectedPost={selectedPost}
            posts={posts}
            setSelectedPost={setSelectedPost}
          />
          <div className="divider divider-horizontal ml-0 max-lg:invisible max-lg:w-0 max-lg:mr-0"></div>
        </div>
      </div>
    </div>
  );
}

export default App;
