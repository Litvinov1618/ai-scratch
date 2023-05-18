import React, { useEffect, useState } from "react";
import Post from "./Post";
import { IPost } from "./App";
import AIResponseBubble from "./AIResponseBubble";
import PostsSearch from "./PostsSearch";
import searchPosts from "./searchPosts";

interface Props {
  posts: IPost[];
  selectedPost: IPost | null;
  setSelectedPost: React.Dispatch<React.SetStateAction<IPost | null>>;
  closeDrawer: () => void;
}

function Posts({ posts, selectedPost, setSelectedPost, closeDrawer }: Props) {
  const [visiblePosts, setVisiblePosts] = useState(posts);
  const [isSearching, setIsSearching] = useState(false);
  const [aiResponse, setAiResponse] = useState("");

  const selectPost = (id: string) => {
    const post = posts.find((post) => post.id === id);
    if (!post) return;
    setSelectedPost(post);
    closeDrawer();
  };

  const filterPosts = async (searchValue: string) => {
    setIsSearching(true);

    const { posts, aiResponse } = await searchPosts(searchValue);

    if (aiResponse) setAiResponse(aiResponse);

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
    setAiResponse("");
  };

  useEffect(() => {
    setVisiblePosts(posts);
    setAiResponse("");
  }, [posts, setVisiblePosts]);

  return (
    <div className="max-lg:p-3 p-4 w-full">
      <div className="form-control hover:bg-transparent pb-1">
        <PostsSearch onSearch={onSearch} isSearching={isSearching} clearSearchResults={clearSearchResults} />
        <AIResponseBubble aiResponse={aiResponse} />
      </div>
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
  );
}

export default Posts;
