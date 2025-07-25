import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    fetchCourse();
    checkEnrollmentStatus();
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/courses/${id}`);
      setCourse(response.data);
      setError('');
    } catch (err) {
      setError('Course not found or failed to load.');
      console.error('Error fetching course:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollmentStatus = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && course) {
      setIsEnrolled(course.students?.includes(user._id) || false);
    }
  };

  const handleEnroll = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to enroll in courses.');
      return;
    }

    try {
      setEnrolling(true);
      await axios.post(`/api/courses/${id}/enroll`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsEnrolled(true);
      alert('Successfully enrolled in the course!');
    } catch (err) {
      alert('Failed to enroll. Please try again.');
      console.error('Enrollment error:', err);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link to="/courses" className="text-indigo-600 hover:text-indigo-800">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              {/* Category Badge */}
              {course.category && (
                <span className="inline-block bg-yellow-400 text-gray-900 text-sm px-3 py-1 rounded-full mb-4">
                  {course.category}
                </span>
              )}
              
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-indigo-100 mb-6">
                {course.description || 'Learn valuable skills with this comprehensive course.'}
              </p>
              
              {/* Instructor Info */}
              <div className="flex items-center mb-6">
                <div className="flex-shrink-0 h-12 w-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-medium">
                    {course.instructor?.name?.charAt(0) || 'I'}
                  </span>
                </div>
                <div className="ml-4">
                  <p className="text-lg font-medium">{course.instructor?.name || 'Instructor'}</p>
                  <p className="text-indigo-200">Course Instructor</p>
                </div>
              </div>
              
              {/* Course Stats */}
              <div className="flex space-x-6 text-indigo-100">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {course.students?.length || 0} students enrolled
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {course.lessons?.length || 0} lessons
                </div>
              </div>
            </div>
            
            {/* Enrollment Card */}
            <div className="bg-white text-gray-900 p-6 rounded-lg shadow-lg">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-indigo-600 mb-2">
                  {course.price === 0 ? 'Free' : `$${course.price.toFixed(2)}`}
                </div>
                <p className="text-gray-600">Full course access</p>
              </div>
              
              {isEnrolled ? (
                <div className="text-center">
                  <div className="bg-green-100 text-green-800 py-3 px-4 rounded-md mb-4">
                    ✓ You are enrolled in this course
                  </div>
                  <Link
                    to={`/student/course/${course._id}`}
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300 inline-block text-center"
                  >
                    Start Learning
                  </Link>
                </div>
              ) : (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors duration-300 ${
                    enrolling
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </button>
              )}
              
              <div className="mt-4 text-sm text-gray-600 space-y-2">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Lifetime access
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Certificate of completion
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Mobile access
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What you'll learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Master core concepts and principles</span>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Apply knowledge to real-world projects</span>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Build practical skills and experience</span>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Gain industry-relevant knowledge</span>
                </div>
              </div>
            </div>

            {/* Course Requirements */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
              <ul className="space-y-2 text-gray-700">
                <li>• Basic computer skills and internet access</li>
                <li>• Willingness to learn and practice</li>
                <li>• No prior experience required</li>
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Course Details</h3>
              <div className="space-y-4">
                <div>
                  <span className="font-medium text-gray-700">Category:</span>
                  <span className="ml-2 text-gray-600">{course.category || 'General'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Level:</span>
                  <span className="ml-2 text-gray-600">Beginner</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Duration:</span>
                  <span className="ml-2 text-gray-600">Self-paced</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Language:</span>
                  <span className="ml-2 text-gray-600">English</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
