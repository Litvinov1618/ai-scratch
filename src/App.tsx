import { useEffect, useRef, useState } from "react";
import useRequest from "use-request";
import { getAuth } from "firebase/auth";
import Editor from "./Editor";
import Posts from "./Posts";
import Header from "./Header";
import LoadingScreen from "./LoadingScreen";
import Drawer from "./Drawer";
import SignModal from "./SignModal";
import getAllPosts from "./getAllPosts";
import addPost from "./addPost";
import registerSwipeListeners from "./registerSwipeListeners";
import checkMobileDevice from "./checkMobileDevice";
import app from "./firebase";

export interface IPost {
  id: string;
  text: string;
  date: number;
}

function App() {
  const addPostRequest = useRequest(addPost);
  const fetchPostsRequest = useRequest(getAllPosts);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isUserChecked, setIsUserChecked] = useState(false);

  const auth = getAuth(app);
  const [user, setUser] = useState(auth.currentUser);

  const editorInputRef = useRef<HTMLTextAreaElement>(null);

  const createEmptyPost = async () => {
    const newPost = await addPostRequest.execute({
      text: "",
      date: Date.now(),
    });

    setSelectedPost(newPost);

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);

    editorInputRef.current?.focus();
  };

  const initiatePosts = async () => {
    const notes = await fetchPostsRequest.execute();

    if (!notes?.length) {
      await createEmptyPost();
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
  };

  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      if (!isUserChecked) setIsUserChecked(true);
      if (user?.email) {
        sessionStorage.setItem("user_email", user.email);
        initiatePosts();
      }
      setUser(user);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  useEffect(() => {
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
      {isUserChecked && !user && <SignModal auth={auth} />}
      {(!fetchPostsRequest.completed || !isUserChecked) && <LoadingScreen />}
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
