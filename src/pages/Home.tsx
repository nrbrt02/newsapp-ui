import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useArticle } from '../hooks/useArticle';
import ArticleList from '../components/article/ArticleList';
import type { ArticlePreview } from '../types/article.types';
import { FiSearch, FiX } from 'react-icons/fi';

const Home = () => {
  const { 
    articles, 
    isLoading, 
    error, 
    getPublishedArticles, 
    searchArticles,
    categories,
  } = useArticle();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [featuredArticles, setFeaturedArticles] = useState<ArticlePreview[]>([]);

  useEffect(() => {
    // Load published articles on component mount
    getPublishedArticles();
  }, [getPublishedArticles]);

  // Extract featured articles from the first page
  useEffect(() => {
    if (articles && articles.content && articles.content.length > 0) {
      // Get the top 3 articles with the most views
      const sorted = [...articles.content].sort((a, b) => b.views - a.views);
      setFeaturedArticles(sorted.slice(0, 3));
    }
  }, [articles]);

  const handlePageChange = (page: number) => {
    if (isSearching && searchTerm) {
      searchArticles(searchTerm, page);
    } else {
      getPublishedArticles(page);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setIsSearching(true);
      searchArticles(searchTerm);
    } else {
      setIsSearching(false);
      getPublishedArticles();
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setIsSearching(false);
    getPublishedArticles();
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      setTimeout(() => {
        document.getElementById('search-input')?.focus();
      }, 100);
    }
  };

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-8 relative">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">
            {isSearching ? `Search Results for "${searchTerm}"` : 'Latest Articles'}
          </h1>
          
          <div className="flex items-center">
            <button
              onClick={toggleSearch}
              className="md:hidden p-2 text-gray-500 hover:text-gray-700"
              aria-label="Toggle search"
            >
              <FiSearch size={20} />
            </button>
            
            <form
              onSubmit={handleSearch}
              className={`${
                showSearch ? 'flex' : 'hidden md:flex'
              } absolute md:relative right-0 top-0 md:top-auto items-center w-full md:w-auto`}
            >
              <div className="relative flex-grow">
                <input
                  id="search-input"
                  type="text"
                  placeholder="Search articles..."
                  className="input pr-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    type="button"
                    className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={clearSearch}
                  >
                    <FiX size={18} />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="ml-2 btn btn-primary"
              >
                <FiSearch size={18} />
              </button>
              {showSearch && (
                <button
                  type="button"
                  className="ml-2 md:hidden p-2 text-gray-500 hover:text-gray-700"
                  onClick={toggleSearch}
                >
                  <FiX size={20} />
                </button>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Featured Articles (if not searching) */}
      {!isSearching && featuredArticles.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Featured Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredArticles.map((article) => (
              <div key={article.id} className="rounded-lg overflow-hidden shadow-md bg-white">
                <Link to={`/articles/${article.id}`}>
                  <img
                    src={article.featuredImage || '/placeholder-image.jpg'}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                </Link>
                <div className="p-4">
                  <Link
                    to={`/category/${article.category.id}`}
                    className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full"
                  >
                    {article.category.name}
                  </Link>
                  <Link to={`/articles/${article.id}`}>
                    <h3 className="text-lg font-semibold mt-2 hover:text-primary-600">
                      {article.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {article.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Filter */}
      {!isSearching && categories.length > 0 && (
        <div className="mb-6 overflow-x-auto whitespace-nowrap pb-2">
          <div className="inline-flex space-x-2">
            <Link
              to="/"
              className="px-3 py-1 bg-primary-600 text-white rounded-full text-sm"
            >
              All
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.id}`}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Articles List */}
      <ArticleList
        articles={articles}
        isLoading={isLoading}
        error={error}
        onPageChange={handlePageChange}
        emptyMessage={
          isSearching
            ? `No articles found for "${searchTerm}". Try a different search term.`
            : 'No articles published yet.'
        }
      />
    </div>
  );
};

export default Home;