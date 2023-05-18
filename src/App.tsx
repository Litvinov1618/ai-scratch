import React, { useEffect, useRef, useState } from "react";
import useRequest from "use-request";
import Editor from "./Editor";
import Posts from "./Posts";
import Header from "./Header";
import LoadingScreen from "./LoadingScreen";
import Drawer from "./Drawer";
import fetchPosts from "./fetchPosts";
import addPost from "./addPost";
import registerSwipeListeners from "./registerSwipeListeners";
import checkMobileDevice from "./checkMobileDevice";
import { getAuth } from "firebase/auth";
import app from "./firebase";
import SignModal from "./SignModal";

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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  const auth = getAuth(app);
  const [user, setUser] = useState(auth.currentUser);

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

  const logout = () => {
    auth.signOut();
  }

  useEffect(() => {
    return auth.onAuthStateChanged((user) => setUser(user));
  }, [auth]);

  useEffect(() => {
    initiatePosts();

    setIsMobileDevice(checkMobileDevice());

    return registerSwipeListeners(closeDrawer, openDrawer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!fetchPostsRequest.completed || posts.length) return;
    createEmptyPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchPostsRequest.completed, posts]);

  return (
    <div className="relative">
      {!user && <SignModal auth={auth} />}
      <LoadingScreen fetchPostsRequest={fetchPostsRequest} />
      <Drawer
        content={
          <Posts
            selectedPost={selectedPost}
            posts={posts}
            setSelectedPost={setSelectedPost}
            closeDrawer={closeDrawer}
            logout={logout}
          />
        }
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
      >
        <Header isMobileDevice={isMobileDevice} />
        <Editor
          posts={posts}
          setPosts={setPosts}
          selectedPost={selectedPost}
          setSelectedPost={setSelectedPost}
          editorInputRef={editorInputRef}
          createEmptyPost={createEmptyPost}
          addPostStatus={addPostRequest.status}
        />
      </Drawer>
    </div>
  );
}

export default App;
