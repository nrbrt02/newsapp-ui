import { Link } from 'react-router-dom';
import { FiUsers, FiFileText, FiTag, FiMessageSquare } from 'react-icons/fi';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">About NewsApp</h1>
      
      <div className="prose prose-lg max-w-none mb-10">
        <p>
          Welcome to NewsApp, a modern platform for news and articles on a variety of topics.
          Our mission is to provide high-quality, informative, and engaging content to our readers.
        </p>
        
        <p>
          Whether you're interested in technology, health, science, or any other field,
          NewsApp offers a diverse range of articles written by expert contributors and journalists.
        </p>
        
        <p>
          We believe in fostering a community of readers and writers who share knowledge,
          perspectives, and ideas through our platform. Join us in our journey to make
          information accessible, reliable, and enjoyable for everyone.
        </p>
      </div>
      
      {/* Features Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-3">
                <FiFileText size={20} />
              </div>
              <h3 className="text-xl font-semibold">Quality Content</h3>
            </div>
            <p className="text-gray-600">
              Access a wide range of well-researched articles written by experienced writers
              and subject matter experts.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-3">
                <FiTag size={20} />
              </div>
              <h3 className="text-xl font-semibold">Categorized Topics</h3>
            </div>
            <p className="text-gray-600">
              Easily browse articles by categories and tags to find content that
              interests you the most.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-3">
                <FiMessageSquare size={20} />
              </div>
              <h3 className="text-xl font-semibold">Community Interaction</h3>
            </div>
            <p className="text-gray-600">
              Engage with content through comments, replies, and discussions with
              other readers and authors.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mr-3">
                <FiUsers size={20} />
              </div>
              <h3 className="text-xl font-semibold">Contribute Content</h3>
            </div>
            <p className="text-gray-600">
              Become a writer and share your knowledge and insights with our growing
              community of readers.
            </p>
          </div>
        </div>
      </div>
      
      {/* Get Started Section */}
      <div className="bg-primary-50 p-8 rounded-lg border border-primary-100 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to Get Started?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Join our community today to access all the features of NewsApp.
          Register to comment on articles, save your favorites, and more.
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/register" className="btn btn-primary">
            Create an Account
          </Link>
          <Link to="/" className="btn btn-secondary">
            Browse Articles
          </Link>
        </div>
      </div>
      
      {/* Contact Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Us</h2>
        <p className="text-gray-600 mb-4">
          Have questions, feedback, or suggestions? We'd love to hear from you!
        </p>
        <p className="text-gray-600">
          Email us at: <a href="mailto:contact@newsapp.com" className="text-primary-600 hover:underline">contact@newsapp.com</a>
        </p>
      </div>
    </div>
  );
};

export default About;