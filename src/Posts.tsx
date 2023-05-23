import { useEffect, useState } from "react";
import Post from "./Post";
import { IPost } from "./App";
import AIResponseBubble, {
  AIResponse,
  AIResponseType,
} from "./AIResponseBubble";
import PostsSearch from "./PostsSearch";
import searchPosts from "./searchPosts";

interface Props {
  posts: IPost[];
  selectedPost: IPost | null;
  setSelectedPost: React.Dispatch<React.SetStateAction<IPost | null>>;
  closeDrawer: () => void;
  logout: () => void;
}

function Posts({
  posts,
  selectedPost,
  setSelectedPost,
  closeDrawer,
  logout,
}: Props) {
  const [visiblePosts, setVisiblePosts] = useState(posts);
  const [isSearching, setIsSearching] = useState(false);
  const [aiResponse, setAiResponse] = useState<AIResponse>({
    message: "",
    type: AIResponseType.Info,
  });

  const selectPost = (id: string) => {
    const post = posts.find((post) => post.id === id);
    if (!post) return;
    setSelectedPost(post);
    closeDrawer();
  };

  const filterPosts = async (searchValue: string) => {
    setIsSearching(true);

    const userEmail = sessionStorage.getItem("user_email");
    if (!userEmail) {
      setIsSearching(false);
      console.error("User email not found");
      return;
    }

    const { posts, aiResponse, error } = await searchPosts(
      searchValue,
      userEmail
    );

    setAiResponse({
      message: aiResponse,
      type: error ? AIResponseType.Error : AIResponseType.Info,
    });

    setVisiblePosts(posts);
    setIsSearching(false);
  };

  const onSearch = (searchValue: string) => {
    if (!searchValue) {
      setVisiblePosts(posts);
      return;
    }

    filterPosts(searchValue);
  };

  const clearSearchResults = () => {
    setVisiblePosts(posts);
    setAiResponse({
      message: "",
      type: AIResponseType.Info,
    });
  };

  useEffect(() => {
    setVisiblePosts(posts);
    setAiResponse({
      message: "",
      type: AIResponseType.Info,
    });
  }, [posts, setVisiblePosts]);

  return (
    <div className="max-lg:p-3 p-4 w-full relative">
      <div className="form-control hover:bg-transparent pb-1">
        <PostsSearch
          onSearch={onSearch}
          isSearching={isSearching}
          clearSearchResults={clearSearchResults}
        />
        <AIResponseBubble aiResponse={aiResponse} />
      </div>
      <div className="overflow-auto h-[87%] no-scrollbar">
        {visiblePosts.length ? (
          <ul className="menu bg-base-100">
            {visiblePosts.map((post) => (
              <Post
                key={post.date}
                post={post}
                isActive={selectedPost?.id === post.id}
                selectPost={selectPost}
                selectedPost={selectedPost}
              />
            ))}
          </ul>
        ) : null}
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex justify-center p-2 bg-base-100">
        <button className="btn btn-outline" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Posts;
