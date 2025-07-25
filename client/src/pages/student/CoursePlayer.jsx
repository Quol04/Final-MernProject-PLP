import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CoursePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  useEffect(() => {
    if (lessons.length > 0) {
      setCurrentLesson(lessons[currentLessonIndex]);
    }
  }, [currentLessonIndex, lessons]);

  const fetchCourseData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch course details
      const courseResponse = await axios.get(`/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourse(courseResponse.data);

      // Fetch lessons for this course
      const lessonsResponse = await axios.get(`/api/lessons/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // If no lessons from API, create mock lessons
      let courseLessons = lessonsResponse.data;
      if (courseLessons.length === 0) {
        courseLessons = createMockLessons(courseResponse.data);
      }
      
      setLessons(courseLessons);
      
      // Mock completed lessons and progress
      const completed = new Set([0, 1]); // First two lessons completed
      setCompletedLessons(completed);
      setProgress((completed.size / courseLessons.length) * 100);
      
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createMockLessons = (course) => {
    return [
      {
        _id: '1',
        title: 'Introduction and Overview',
        description: 'Welcome to the course! Learn what you\'ll accomplish.',
        content: 'This is the introduction lesson content. Here you\'ll learn about the course structure and objectives.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: 10,
        order: 1
      },
      {
        _id: '2',
        title: 'Getting Started',
        description: 'Set up your development environment.',
        content: 'In this lesson, we\'ll set up everything you need to follow along with the course.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        duration: 15,
        order: 2
      },
      {
        _id: '3',
        title: 'Core Concepts',
        description: 'Learn the fundamental concepts.',
        content: 'This lesson covers the core concepts you need to understand before moving forward.',
        duration: 20,
        order: 3
      },
      {
        _id: '4',
        title: 'Practical Application',
        description: 'Apply what you\'ve learned in a real project.',
        content: 'Now let\'s put theory into practice with a hands-on project.',
        duration: 25,
        order: 4
      },
      {
        _id: '5',
        title: 'Advanced Techniques',
        description: 'Explore advanced topics and best practices.',
        content: 'In this advanced lesson, we\'ll explore more sophisticated techniques.',
        duration: 30,
        order: 5
      }
    ];
  };

  const markLessonComplete = (lessonIndex) => {
    const newCompleted = new Set(completedLessons);
    newCompleted.add(lessonIndex);
    setCompletedLessons(newCompleted);
    setProgress((newCompleted.size / lessons.length) * 100);
  };

  const goToNextLesson = () => {
    if (currentLessonIndex < lessons.length - 1) {
      markLessonComplete(currentLessonIndex);
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const goToPreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  const selectLesson = (index) => {
    setCurrentLessonIndex(index);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!course || !currentLesson) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Course not found</h2>
          <button
            onClick={() => navigate('/student/my-courses')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
          >
            Back to My Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-gray-800 overflow-hidden`}>
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold truncate">{course.title}</h2>
          <div className="mt-2">
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Course Content</h3>
          <div className="space-y-2">
            {lessons.map((lesson, index) => (
              <button
                key={lesson._id}
                onClick={() => selectLesson(index)}
                className={`w-full text-left p-3 rounded-md transition-colors ${
                  currentLessonIndex === index 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs ${
                    completedLessons.has(index) 
                      ? 'bg-green-500 text-white' 
                      : currentLessonIndex === index 
                        ? 'bg-white text-indigo-600' 
                        : 'bg-gray-600 text-gray-400'
                  }`}>
                    {completedLessons.has(index) ? '✓' : index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{lesson.title}</div>
                    <div className="text-xs text-gray-400">{lesson.duration} min</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="mr-4 p-2 rounded-md hover:bg-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-semibold">{currentLesson.title}</h1>
                <p className="text-sm text-gray-400">
                  Lesson {currentLessonIndex + 1} of {lessons.length}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowNotes(!showNotes)}
                className={`p-2 rounded-md ${showNotes ? 'bg-indigo-600' : 'hover:bg-gray-700'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              
              <button
                onClick={() => navigate('/student/my-courses')}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md text-sm"
              >
                Exit Course
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Video/Content Area */}
          <div className={`${showNotes ? 'flex-1' : 'w-full'} p-6`}>
            {/* Video Player */}
            {currentLesson.videoUrl ? (
              <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden mb-6">
                <iframe
                  src={currentLesson.videoUrl}
                  title={currentLesson.title}
                  className="w-full h-96"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div className="aspect-w-16 aspect-h-9 bg-gray-800 rounded-lg flex items-center justify-center mb-6">
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-400">No video available for this lesson</p>
                </div>
              </div>
            )}

            {/* Lesson Content */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">{currentLesson.title}</h2>
              <p className="text-gray-300 mb-4">{currentLesson.description}</p>
              <div className="prose prose-invert max-w-none">
                <p>{currentLesson.content}</p>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex justify-between items-center">
              <button
                onClick={goToPreviousLesson}
                disabled={currentLessonIndex === 0}
                className={`flex items-center px-4 py-2 rounded-md ${
                  currentLessonIndex === 0 
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous Lesson
              </button>

              <div className="flex items-center space-x-4">
                {!completedLessons.has(currentLessonIndex) && (
                  <button
                    onClick={() => markLessonComplete(currentLessonIndex)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                  >
                    Mark Complete
                  </button>
                )}
              </div>

              <button
                onClick={goToNextLesson}
                disabled={currentLessonIndex === lessons.length - 1}
                className={`flex items-center px-4 py-2 rounded-md ${
                  currentLessonIndex === lessons.length - 1 
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                Next Lesson
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Notes Panel */}
          {showNotes && (
            <div className="w-80 bg-gray-800 border-l border-gray-700 p-4">
              <h3 className="text-lg font-semibold mb-4">Notes</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Take notes for this lesson..."
                className="w-full h-64 bg-gray-700 border border-gray-600 rounded-md p-3 text-white placeholder-gray-400 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md">
                Save Notes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
