'use client';
import { useEffect, useState } from 'react';
import PromptCard from './PromptCard';

const PromptCardList = ({ data, handleTagClick }: any) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post: any) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState('');
  const [allPosts, setAllPosts] = useState([]);
  const [searchTimeout, setSearchTimeout]: any = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);

  const filterPrompts = (searchtext: any) => {
    const regex = new RegExp(searchtext, 'i'); // 'i' flag for case-insensitive search
    return allPosts.filter(
      (item: any) =>
        regex.test(item.creator.username) ||
        regex.test(item.tag) ||
        regex.test(item.prompt)
    );
  };

  const handleSearchChange = (e: any) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    // debounce method
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPrompts(e.target.value);
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  const fetchPosts = async () => {
    const response = await fetch('/api/prompt');
    const data = await response.json();

    setAllPosts(data);
  };

  const handleTagClick = (tagName: string) => {
    setSearchText(tagName);

    const searchResult = filterPrompts(tagName);
    setSearchedResults(searchResult);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>

      {/* All Prompts */}

      <PromptCardList
        data={searchText ? searchedResults : allPosts}
        handleTagClick={handleTagClick}
      />
    </section>
  );
};

export default Feed;
