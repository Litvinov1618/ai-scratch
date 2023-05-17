import React, { useEffect, useRef, useState } from "react";
import Editor from "./Editor";
import Posts from "./Posts";
import DrawerButton from "./DrawerButton";
import fetchPosts from "./fetchPosts";
import useRequest from "use-request";
import addPost from "./addPost";
import loadingMessages from "./loadingMessages";
import registerSwipeListeners from "./registerSwipeListeners";
import checkMobileDevice from "./checkMobileDevice";

export interface IPost {
  id: string;
  text: string;
  date: number;
}

function App() {
  const addPostRequest = useRequest(addPost);
  const fetchPostsRequest = useRequest(fetchPosts);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  const editorInputRef = useRef<HTMLTextAreaElement>(null);

  const createEmptyPost = async () => {
    const newSelectedPost: Omit<IPost, "id"> = {
      text: "",
      date: Date.now(),
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

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  useEffect(() => {
    setLoadingMessageIndex(Math.floor(Math.random() * loadingMessages.length));

    initiatePosts();

    setIsMobileDevice(checkMobileDevice());

    return registerSwipeListeners(closeDrawer, openDrawer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (fetchPostsRequest.completed && !posts.length) {
      createEmptyPost();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchPostsRequest.completed, posts]);

  return (
    <div className="relative">
      {fetchPostsRequest.pending && (
        <div className="backdrop-blur-sm absolute top-0 left-0 right-0 bottom-0 z-20 flex items-center justify-center">
          <div className="flex flex-col items-center gap-5 w-[380px] max-sm:w-[280px] whitespace-pre-wrap">
            {loadingMessages[loadingMessageIndex]}
            <progress className="progress w-56"></progress>
          </div>
        </div>
      )}
      <div className="drawer drawer-mobile">
        <input
          id="my-drawer"
          type="checkbox"
          className="drawer-toggle"
          checked={isDrawerOpen}
          onChange={() => setIsDrawerOpen(!isDrawerOpen)}
        />
        <div className="drawer-content">
          <div className="isolate p-4 lg:pl-1 h-screen max-sm:px-2 max-sm:py-4">
            <div className="text-5xl text-center mb-7 relative">
              AI Scratch
              <div
                className={`absolute top-0 bottom-0 left-0 flex align-middle lg:hidden ${
                  isMobileDevice ? "hidden" : ""
                }`}
              >
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
              closeDrawer={closeDrawer}
            />
            <div className="divider divider-horizontal ml-0 max-lg:invisible max-lg:w-0 max-lg:mr-0" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
