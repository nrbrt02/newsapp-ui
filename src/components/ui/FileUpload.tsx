import { useState, useRef } from 'react';
import { FiUpload, FiImage, FiX } from 'react-icons/fi';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onUrlSelect?: (url: string) => void;
  preview?: string | null;
  onRemove?: () => void;
  accept?: string;
  maxSize?: number; // in bytes
  disabled?: boolean;
  className?: string;
  showUrlOption?: boolean;
}

const FileUpload = ({
  onFileSelect,
  onUrlSelect,
  preview,
  onRemove,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB default
  disabled = false,
  className = '',
  showUrlOption = true
}: FileUploadProps) => {
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [url, setUrl] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Validate file size
    if (file.size > maxSize) {
      setError(`File size exceeds the maximum limit of ${maxSize / (1024 * 1024)}MB`);
      return;
    }
    
    // Validate file type if accept is provided
    if (accept !== '*' && !accept.includes('*')) {
      const fileType = file.type;
      const acceptTypes = accept.split(',').map(type => type.trim());
      
      if (!acceptTypes.some(type => {
        // Handle mime types with wildcards like "image/*"
        if (type.endsWith('/*')) {
          const category = type.split('/')[0];
          return fileType.startsWith(`${category}/`);
        }
        return type === fileType;
      })) {
        setError(`Invalid file type. Accepted types: ${accept}`);
        return;
      }
    }
    
    setError(null);
    onFileSelect(file);
  };

  const handleUrlSubmit = () => {
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }
    
    setError(null);
    
    if (onUrlSelect) {
      onUrlSelect(url);
      setUrl('');
      setShowUrlInput(false);
    }
  };

  const handleBrowseClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="File Preview"
            className="w-full h-48 object-cover rounded-md"
          />
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              disabled={disabled}
            >
              <FiX size={16} />
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept={accept}
            onChange={handleFileChange}
            disabled={disabled}
          />
          
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleBrowseClick}
              className="flex-1 flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400 transition duration-150"
              disabled={disabled}
            >
              <div className="text-center">
                <FiUpload size={24} className="mx-auto text-gray-400" />
                <span className="mt-2 block text-sm text-gray-600">Upload from device</span>
              </div>
            </button>
            
            {showUrlOption && onUrlSelect && (
              <div className="flex-1">
                {showUrlInput ? (
                  <div className="h-32 flex flex-col justify-center">
                    <div className="mb-2">
                      <input
                        type="text"
                        className="input w-full"
                        placeholder="Enter URL"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        disabled={disabled}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={handleUrlSubmit}
                        className="btn btn-primary flex-1"
                        disabled={!url.trim() || disabled}
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowUrlInput(false);
                          setUrl('');
                          setError(null);
                        }}
                        className="btn btn-secondary flex-1"
                        disabled={disabled}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(true)}
                    className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400 transition duration-150"
                    disabled={disabled}
                  >
                    <div className="text-center">
                      <FiImage size={24} className="mx-auto text-gray-400" />
                      <span className="mt-2 block text-sm text-gray-600">Add image URL</span>
                    </div>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default FileUpload;