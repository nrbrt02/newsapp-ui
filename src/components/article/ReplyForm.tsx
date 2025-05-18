import { useState } from 'react';
import { FiSend } from 'react-icons/fi';

interface ReplyFormProps {
  onSubmit: (content: string) => Promise<boolean>;
  isSubmitting: boolean;
  placeholder?: string;
}

const ReplyForm = ({ 
  onSubmit, 
  isSubmitting, 
  placeholder = 'Write a reply...' 
}: ReplyFormProps) => {
  const [reply, setReply] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reply.trim()) {
      setError('Reply cannot be empty');
      return;
    }
    
    setError(null);
    const success = await onSubmit(reply);
    
    if (success) {
      setReply('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <textarea
        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        rows={2}
        placeholder={placeholder}
        value={reply}
        onChange={(e) => {
          setReply(e.target.value);
          if (error) setError(null);
        }}
        disabled={isSubmitting}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          disabled={isSubmitting || !reply.trim()}
        >
          <FiSend className="mr-2" />
          {isSubmitting ? 'Sending...' : 'Reply'}
        </button>
      </div>
    </form>
  );
};

export default ReplyForm;