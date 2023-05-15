import React, { useEffect, useState } from "react";
import Editor from "./Editor";
import Posts from "./Posts";
import DeveloperModeToggleButton from "./DeveloperModeToggleButton";
import DrawerButton from "./DrawerButton";
import fetchPosts from "./fetchPosts";

export interface IPost {
  id: string;
  text: string;
  date: number;
  embedding: number[];
}

function App() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);

  const initiatePosts = async () => {
    const notes = await fetchPosts();
    if (!notes) return;

    setPosts(notes);

    if (!notes.length) return;
    setSelectedPost(notes[0]);
  };

  useEffect(() => {
    initiatePosts();
  }, []);

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
            <div className="absolute top-0 bottom-0 right-0 flex align-middle">
              <DeveloperModeToggleButton
                isDeveloperMode={isDeveloperMode}
                setIsDeveloperMode={setIsDeveloperMode}
              />
            </div>
          </div>
          <div className="flex w-full max-sm:h-[88%] h-[90%]">
            <Editor
              posts={posts}
              setPosts={setPosts}
              selectedPost={selectedPost}
              setSelectedPost={setSelectedPost}
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
            isDeveloperMode={isDeveloperMode}
          />
          <div className="divider divider-horizontal ml-0 max-lg:invisible max-lg:w-0 max-lg:mr-0"></div>
        </div>
      </div>
    </div>
  );
}

export default App;
