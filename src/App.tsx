import React, { useEffect, useState } from "react";
import Editor from "./Editor";
import Posts from "./Posts";

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

  useEffect(() => {
    const data = localStorage.getItem("posts");
    if (!data) return;
    const posts = JSON.parse(data);
    setPosts(posts);
    setSelectedPost(posts[0]);
  }, []);

  return (
    <div className="isolate px-6 py-8 h-screen">
      <div className="text-5xl text-center mb-10 relative">
        AI Scratch
        <div className="absolute top-0 bottom-0 right-0 flex align-middle">
          <button onClick={() => setIsDeveloperMode(!isDeveloperMode)}>
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex w-full h-full">
        <Posts
          selectedPost={selectedPost}
          posts={posts}
          setSelectedPost={setSelectedPost}
          isDeveloperMode={isDeveloperMode}
        />
        <div className="divider divider-horizontal"></div>
        <Editor
          posts={posts}
          setPosts={setPosts}
          selectedPost={selectedPost}
          setSelectedPost={setSelectedPost}
        />
      </div>
    </div>
  );
}

export default App;
