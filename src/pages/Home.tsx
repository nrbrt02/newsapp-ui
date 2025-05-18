import { useEffect, useState, useCallback, useRef } from 'react';
import { useArticle } from '../hooks/useArticle';
import ArticleList from '../components/article/ArticleList';
import { 
  FiSearch, 
  FiX, 
  FiChevronLeft, 
  FiChevronRight, 
  FiArrowUp,
  FiFilter,
  FiClock,
  FiEye,
  FiTrendingUp
} from 'react-icons/fi';
import { debounce } from 'lodash';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const { 
    articles, 
    isLoading, 
    error, 
    getPublishedArticles, 
    searchArticles,
    categories,
    loadCategories
  } = useArticle();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortOption, setSortOption] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [useInfiniteScroll, setUseInfiniteScroll] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const observer = useRef(null);
  const loadMoreRef = useRef(null);

  // Sort options configuration
  const sortOptions = [
    { value: 'newest', label: 'Newest', icon: <FiClock className="mr-1" /> },
    { value: 'oldest', label: 'Oldest', icon: <FiClock className="mr-1" /> },
    { value: 'views', label: 'Most Viewed', icon: <FiEye className="mr-1" /> }
  ];

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (term) => {
      if (term.trim()) {
        setIsSearchLoading(true);
        await searchArticles(term, currentPage, sortOption, selectedCategory);
        setIsSearchLoading(false);
      }
    }, 500),
    [currentPage, sortOption, selectedCategory, searchArticles]
  );

  const loadArticles = useCallback(async (page = 0) => {
    try {
      if (isSearching && searchTerm) {
        await searchArticles(searchTerm, page, sortOption, selectedCategory);
      } else {
        await getPublishedArticles(page, sortOption, selectedCategory);
      }
    } catch (error) {
      console.error("Error loading articles:", error);
    }
  }, [isSearching, searchTerm, sortOption, selectedCategory, searchArticles, getPublishedArticles]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);
  
  // Initial load and when filters change
  useEffect(() => {
    setCurrentPage(0);
    loadArticles(0);
  }, [sortOption, selectedCategory, loadArticles]);

  // Handle search input changes
  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm);
    }
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  // Infinite scroll setup
  useEffect(() => {
    if (!useInfiniteScroll || !loadMoreRef.current || !articles || articles.last) return;

    const handleObserver = (entries) => {
      const target = entries[0];
      if (target.isIntersecting && !loadingMore) {
        setLoadingMore(true);
        const nextPage = currentPage + 1;
        loadArticles(nextPage).finally(() => {
          setCurrentPage(nextPage);
          setLoadingMore(false);
        });
      }
    };

    observer.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1,
    });

    if (loadMoreRef.current) {
      observer.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [useInfiniteScroll, currentPage, loadArticles, loadingMore, articles]);

  // Back to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    setIsSearching(true);
    setCurrentPage(0);
    loadArticles(0);
  }, [loadArticles]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setIsSearching(false);
    setCurrentPage(0);
    loadArticles(0);
  }, [loadArticles]);

  const toggleSearch = useCallback(() => {
    setShowSearch(prev => !prev);
    if (!showSearch) {
      setTimeout(() => {
        document.getElementById('search-input')?.focus();
      }, 100);
    }
  }, [showSearch]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    loadArticles(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [loadArticles]);

  const handleSortChange = useCallback((option) => {
    setSortOption(option);
  }, []);

  const toggleCategoryFilter = useCallback((categoryId) => {
    setSelectedCategory(prev => prev === categoryId ? null : categoryId);
  }, []);

  const toggleScrollMode = useCallback(() => {
    setUseInfiniteScroll(prev => !prev);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Skeleton loading for categories
  const renderCategorySkeletons = () => (
    <div className="flex space-x-2 pb-2">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} width={80} height={32} borderRadius={16} />
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Search and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">
          {isSearching ? `Search: "${searchTerm}"` : 'Latest Articles'}
        </h1>
        
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className={`relative ${showSearch ? 'flex' : 'hidden md:flex'} items-center w-full md:w-64`}
          >
            <input
              id="search-input"
              type="text"
              placeholder="Search articles..."
              className="input input-bordered w-full pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search articles"
            />
            {searchTerm ? (
              <button
                type="button"
                className="absolute right-10 text-gray-400 hover:text-gray-600"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                <FiX size={18} />
              </button>
            ) : null}
            <button
              type="submit"
              className="absolute right-2 text-gray-500 hover:text-gray-700"
              aria-label="Search"
            >
              <FiSearch size={18} />
            </button>
          </form>
          
          <button
            onClick={toggleSearch}
            className="md:hidden btn btn-ghost gap-2"
            aria-label="Toggle search"
          >
            <FiSearch />
            {showSearch ? 'Hide search' : 'Search'}
          </button>

          {/* View Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleScrollMode}
              className={`btn btn-sm ${useInfiniteScroll ? 'btn-primary' : 'btn-ghost'}`}
              aria-label={useInfiniteScroll ? 'Switch to pagination' : 'Switch to infinite scroll'}
            >
              {useInfiniteScroll ? 'Pagination' : 'Infinite Scroll'}
            </button>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Category Filter */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <FiFilter />
            <h2 className="text-lg font-semibold text-gray-700">Filters</h2>
          </div>
          {isLoading && !categories.length ? (
            renderCategorySkeletons()
          ) : (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => toggleCategoryFilter(null)}
                className={`px-4 py-1 rounded-full text-sm font-medium flex items-center ${
                  !selectedCategory
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => toggleCategoryFilter(category.id.toString())}
                  className={`px-4 py-1 rounded-full text-sm font-medium flex items-center ${
                    selectedCategory === category.id.toString()
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort Options */}
        <div className="md:w-64">
          <div className="flex items-center gap-2 mb-2">
            <FiTrendingUp />
            <h2 className="text-lg font-semibold text-gray-700">Sort By</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`px-4 py-1 rounded-full text-sm font-medium flex items-center ${
                  sortOption === option.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.icon}
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles List */}
      <div className="mb-8">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ArticleList
              articles={articles}
              isLoading={isLoading || isSearchLoading}
              error={error}
              onPageChange={handlePageChange}
              emptyMessage={
                isSearching
                  ? `No articles found for "${searchTerm}". Try a different search.`
                  : selectedCategory
                  ? 'No articles in this category yet.'
                  : 'No articles published yet. Check back later!'
              }
            />
          </motion.div>
        </AnimatePresence>

        {/* Load More button for manual infinite scroll */}
        {!useInfiniteScroll && articles && !articles.last && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}

        {/* Infinite scroll trigger */}
        {useInfiniteScroll && <div ref={loadMoreRef} className="h-2" />}
        {loadingMore && (
          <div className="flex justify-center my-4">
            <div className="loading loading-spinner text-primary"></div>
          </div>
        )}
      </div>

      {/* Pagination (for non-infinite scroll mode) */}
      {!useInfiniteScroll && articles && articles.totalPages > 1 && (
        <div className="flex justify-center items-center mt-8">
          <nav className="flex items-center gap-1" aria-label="Pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <FiChevronLeft size={20} />
            </button>

            {Array.from({ length: Math.min(5, articles.totalPages) }).map((_, i) => {
              let pageNum;
              if (articles.totalPages <= 5) {
                pageNum = i;
              } else if (currentPage <= 2) {
                pageNum = i;
              } else if (currentPage >= articles.totalPages - 3) {
                pageNum = articles.totalPages - 5 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-10 h-10 rounded-md flex items-center justify-center ${
                    currentPage === pageNum
                      ? 'bg-primary-600 text-white font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {pageNum + 1}
                </button>
              );
            })}

            {articles.totalPages > 5 && currentPage < articles.totalPages - 3 && (
              <span className="px-2">...</span>
            )}

            {articles.totalPages > 5 && currentPage < articles.totalPages - 3 && (
              <button
                onClick={() => handlePageChange(articles.totalPages - 1)}
                className={`w-10 h-10 rounded-md flex items-center justify-center ${
                  currentPage === articles.totalPages - 1
                    ? 'bg-primary-600 text-white font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {articles.totalPages}
              </button>
            )}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= articles.totalPages - 1}
              className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <FiChevronRight size={20} />
            </button>
          </nav>
        </div>
      )}

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 btn btn-circle btn-primary shadow-lg"
            aria-label="Back to top"
          >
            <FiArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;