import React, { useEffect, useState } from "react";
import Editor from "./Editor";
import Posts from "./Posts";

export interface IPost {
  id: string;
  text: string;
  date: number;
}

function App() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("posts");
    if (!data) return;
    const posts = JSON.parse(data);
    setPosts(posts);
    setSelectedPost(posts[0]);
  }, []);

  return (
    <div className="isolate px-6 py-8 h-screen">
      <div className="text-5xl text-center pb-10">AI Scratch</div>
      <div className="flex w-full h-full">
        <Posts selectedPost={selectedPost} posts={posts} setSelectedPost={setSelectedPost} />
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
