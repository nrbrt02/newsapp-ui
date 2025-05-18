import { useState } from 'react';
import { FiSend } from 'react-icons/fi';

interface CommentFormProps {
  onSubmit: (content: string) => Promise<boolean>;
  isSubmitting: boolean;
  placeholder?: string;
}

const CommentForm = ({ 
  onSubmit, 
  isSubmitting, 
  placeholder = 'Write a comment...' 
}: CommentFormProps) => {
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    
    setError(null);
    const success = await onSubmit(comment);
    
    if (success) {
      setComment('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <textarea
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        rows={3}
        placeholder={placeholder}
        value={comment}
        onChange={(e) => {
          setComment(e.target.value);
          if (error) setError(null);
        }}
        disabled={isSubmitting}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
      <button
        type="submit"
        className="absolute bottom-3 right-3 p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isSubmitting || !comment.trim()}
      >
        <FiSend />
      </button>
    </form>
  );
};

export default CommentForm;