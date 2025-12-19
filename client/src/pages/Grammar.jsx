import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { MdMenuBook, MdArrowForward } from 'react-icons/md';

const Grammar = () => {
  const [topics, setTopics] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTopics();
    loadCategories();
  }, []);

  const loadTopics = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/grammar');
      setTopics(response.data.data);
    } catch (error) {
      toast.error('Failed to load grammar topics');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await axios.get('/api/grammar/categories');
      setCategories(response.data.data);
    } catch (error) {
      console.error('Failed to load categories');
    }
  };

  const filteredTopics =
    selectedCategory === 'all'
      ? topics
      : topics.filter((t) => t.category === selectedCategory);

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700',
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Grammar Lessons</h1>
          <p className="text-gray-600">
            Learn English grammar with detailed explanations and exercises
          </p>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Topics
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Topics grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredTopics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics.map((topic) => (
              <Link
                key={topic.id}
                to={`/grammar/${topic.id}`}
                className="block bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-primary transition-all p-6 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <MdMenuBook className="text-2xl text-primary" />
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      difficultyColors[topic.difficulty] || 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {topic.difficulty}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors">
                  {topic.title}
                </h3>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {topic.description}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{topic.viewCount || 0} views</span>
                  <span className="flex items-center gap-1 text-primary font-medium">
                    Learn more
                    <MdArrowForward className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <MdMenuBook className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No topics found
            </h3>
            <p className="text-gray-500">Try selecting a different category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Grammar;
