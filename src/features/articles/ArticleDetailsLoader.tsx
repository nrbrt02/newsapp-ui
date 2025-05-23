import { useEffect, useState, useRef, useCallback } from 'react';
import { FiLoader } from 'react-icons/fi';
import { useArticle } from '../../hooks/useArticle';
import ArticleDetailsModal from './ArticleDetailsModal';

interface ArticleDetailsLoaderProps {
  articleId: number;
  onError?: () => void;
}

const ArticleDetailsLoader = ({ articleId, onError }: ArticleDetailsLoaderProps) => {
  const { article, isLoading, error, getArticleById, clearArticle } = useArticle();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const hasLoadedRef = useRef(false);
  const articleIdRef = useRef(articleId);
  const isMountedRef = useRef(true);

  const loadArticle = useCallback(async () => {
    // Skip if we've already loaded this article
    if (hasLoadedRef.current && articleIdRef.current === articleId) {
      return;
    }

    // Update refs
    articleIdRef.current = articleId;
    hasLoadedRef.current = false;
    setIsInitialLoad(true);

    try {
      const success = await getArticleById(articleId);
      if (!success && onError && isMountedRef.current) {
        onError();
      }
    } catch (error) {
      if (onError && isMountedRef.current) {
        onError();
      }
    } finally {
      if (isMountedRef.current) {
        setIsInitialLoad(false);
        hasLoadedRef.current = true;
      }
    }
  }, [articleId, getArticleById, onError]);

  useEffect(() => {
    isMountedRef.current = true;
    loadArticle();

    return () => {
      isMountedRef.current = false;
      // Only clear article if component is unmounting
      if (!isMountedRef.current) {
        clearArticle();
        hasLoadedRef.current = false;
      }
    };
  }, [articleId]); // Only depend on articleId

  if (isInitialLoad || isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FiLoader className="animate-spin text-primary-600 text-4xl mr-2" />
        <span className="text-gray-700">Loading article details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6">
        <p className="text-red-500">Error loading article: {error}</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center p-6">
        <p className="text-gray-500">No article data available</p>
      </div>
    );
  }

  return <ArticleDetailsModal article={article} />;
};

export default ArticleDetailsLoader; 