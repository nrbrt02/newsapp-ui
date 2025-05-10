import { Link } from 'react-router-dom';
import type { ArticlePreview } from '../../types/article.types';
import { formatDistanceToNow } from 'date-fns';
import { FiEye, FiMessageSquare } from 'react-icons/fi';

interface ArticleCardProps {
  article: ArticlePreview;
  className?: string;
}

const ArticleCard = ({ article, className = '' }: ArticleCardProps) => {
  const {
    id,
    title,
    description,
    featuredImage,
    author,
    category,
    tags,
    createdAt,
    views,
  } = article;

  // Format the date as relative time (e.g., "3 days ago")
  const formattedDate = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  return (
    <div className={`card transition-shadow duration-300 hover:shadow-lg ${className}`}>
      <div className="relative">
        {/* Featured Image */}
        <Link to={`/articles/${id}`}>
          <img
            src={featuredImage || '/placeholder-image.jpg'}
            alt={title}
            className="w-full h-48 object-cover object-center"
          />
        </Link>
        
        {/* Category Tag */}
        <div className="absolute top-4 left-4">
          <Link
            to={`/category/${category.id}`}
            className="bg-primary-500 text-white text-xs font-semibold px-2 py-1 rounded-md"
          >
            {category.name}
          </Link>
        </div>
      </div>
      
      <div className="p-4">
        {/* Title */}
        <Link to={`/articles/${id}`}>
          <h2 className="text-xl font-semibold text-gray-800 mb-2 hover:text-primary-600">
            {title}
          </h2>
        </Link>
        
        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {description}
        </p>
        
        {/* Meta Information */}
        <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
          <div className="flex items-center">
            <span className="mr-3">
              <FiEye className="inline mr-1" /> {views}
            </span>
            <span>
              <FiMessageSquare className="inline mr-1" /> 0
            </span>
          </div>
          <span>{formattedDate}</span>
        </div>
        
        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.slice(0, 3).map((tag) => (
              <Link
                key={tag.id}
                to={`/tag/${tag.id}`}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1 rounded"
              >
                #{tag.name}
              </Link>
            ))}
            {tags.length > 3 && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        {/* Author */}
        <div className="flex items-center mt-4 pt-3 border-t border-gray-100">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-600">
            {author.firstName?.charAt(0) || author.username.charAt(0)}
          </div>
          <div className="ml-2">
            <span className="text-sm font-medium text-gray-700">
              {`${author.firstName || ''} ${author.lastName || ''}`}
              {!author.firstName && !author.lastName && author.username}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;