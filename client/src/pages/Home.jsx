import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalInstructors: 0
  });

  useEffect(() => {
    fetchFeaturedCourses();
    fetchStats();
  }, []);

  const fetchFeaturedCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/courses');
      // Ensure response.data is an array and get first 3 courses as featured
      const courses = Array.isArray(response.data) ? response.data : [];
      setFeaturedCourses(courses.slice(0, 3));
    } catch (error) {
      console.error('Error fetching courses:', error);
      setFeaturedCourses([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // This would typically come from a public stats endpoint
      const response = await axios.get('/api/courses');
      const courses = Array.isArray(response.data) ? response.data : [];
      setStats({
        totalCourses: courses.length,
        totalStudents: Math.floor(Math.random() * 1000) + 500, // Mock data
        totalInstructors: Math.floor(Math.random() * 50) + 20   // Mock data
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        totalCourses: 0,
        totalStudents: 500,
        totalInstructors: 20
      });
    }
  };

  const features = [
    {
      icon: '🎓',
      title: 'Expert Instructors',
      description: 'Learn from industry professionals and experienced educators who are passionate about teaching.'
    },
    {
      icon: '📱',
      title: 'Learn Anywhere',
      description: 'Access your courses on any device, anytime, anywhere. Your learning journey never stops.'
    },
    {
      icon: '🏆',
      title: 'Certificates',
      description: 'Earn certificates upon course completion to showcase your new skills and knowledge.'
    },
    {
      icon: '👥',
      title: 'Community',
      description: 'Join a vibrant community of learners, share knowledge, and grow together.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Transform Your Future with
              <span className="block text-yellow-300">Online Learning</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Join thousands of learners worldwide and unlock your potential with our comprehensive online courses.
            </p>
            <div className="space-x-4">
              <Link
                to="/courses"
                className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition-colors duration-300"
              >
                Explore Courses
              </Link>
              <Link
                to="/register"
                className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors duration-300"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-indigo-600">{stats.totalCourses}+</div>
              <div className="text-gray-600 mt-2">Courses Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600">{stats.totalStudents}+</div>
              <div className="text-gray-600 mt-2">Active Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600">{stats.totalInstructors}+</div>
              <div className="text-gray-600 mt-2">Expert Instructors</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose EduPlatform?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide everything you need for a successful learning experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Courses
            </h2>
            <p className="text-xl text-gray-600">
              Discover our most popular courses
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              // Loading skeleton
              [...Array(3)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : featuredCourses.length > 0 ? (
              featuredCourses.map((course) => (
                <div key={course._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">{course.title?.charAt(0) || 'C'}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title || 'Course Title'}</h3>
                    <p className="text-gray-600 mb-4">{course.description || 'Learn valuable skills with this comprehensive course.'}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-indigo-600">
                        {course.price === 0 ? 'Free' : `$${course.price || '0'}`}
                      </span>
                      <Link
                        to={`/courses/${course._id}`}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300"
                      >
                        Learn More
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // No courses available
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No courses available yet</h3>
                <p className="text-gray-500">Check back soon for exciting new courses!</p>
              </div>
            )}
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/courses"
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors duration-300"
            >
              View All Courses
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join our community of learners and start your journey to success today.
          </p>
          <Link
            to="/register"
            className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition-colors duration-300"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
