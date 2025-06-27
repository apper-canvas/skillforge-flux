import { motion } from "framer-motion";
import Chart from "react-apexcharts";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import ProgressRing from "@/components/atoms/ProgressRing";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
export default function ProgressStats({ enrolledCourses = [], progress = {} }) {
  // Calculate overall progress
  function calculateOverallProgress() {
    if (!enrolledCourses.length) return 0
    
    const totalProgress = enrolledCourses.reduce((sum, course) => {
      const courseProgress = progress[course.id] || {}
      const totalLessons = course.lessons?.length || 0
      const completedLessons = courseProgress.completedLessons?.length || 0
      return sum + (totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0)
    }, 0)
    
    return Math.round(totalProgress / enrolledCourses.length)
  }

  // Get completed courses count
  function getCompletedCourses() {
    return enrolledCourses.filter(course => {
      const courseProgress = progress[course.id] || {}
      const totalLessons = course.lessons?.length || 0
      const completedLessons = courseProgress.completedLessons?.length || 0
      return totalLessons > 0 && completedLessons === totalLessons
    }).length
  }

  // Get subject distribution
  function getSubjectDistribution() {
    const subjects = {}
    
    enrolledCourses.forEach(course => {
      const subject = course.subject || 'Other'
      subjects[subject] = (subjects[subject] || 0) + 1
    })
    
    return subjects
  }

  // Get weekly progress data
  function getWeeklyProgress() {
    const weeklyData = []
    const today = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
      
      // Mock progress data for each day
      const dailyProgress = Math.floor(Math.random() * 5) + 1
      weeklyData.push({
        day: dayName,
        progress: dailyProgress
      })
    }
    
    return weeklyData
  }

  const overallProgress = calculateOverallProgress()
  const completedCourses = getCompletedCourses()
  const subjectData = getSubjectDistribution()
const overallProgress = calculateOverallProgress()
  const completedCourses = getCompletedCourses()
  const subjectData = getSubjectDistribution()
  const weeklyProgress = getWeeklyProgress()

  // Helper functions for quiz analytics
  function getQuizAnalytics() {
    const analytics = {
      totalQuizzes: 0,
      averageScore: 0,
      topicPerformance: {},
      weakAreas: []
    };

    enrolledCourses.forEach(course => {
      const courseProgress = progress[course.id];
      if (courseProgress?.quizResults) {
        analytics.totalQuizzes += courseProgress.quizResults.length;
        
        courseProgress.quizResults.forEach(result => {
          result.questionResults?.forEach(qResult => {
            const topic = qResult.topic || 'general';
            if (!analytics.topicPerformance[topic]) {
              analytics.topicPerformance[topic] = { correct: 0, total: 0 };
            }
            analytics.topicPerformance[topic].total++;
            if (qResult.correct) {
              analytics.topicPerformance[topic].correct++;
            }
          });
        });
      }
    });

    // Calculate percentages
    Object.keys(analytics.topicPerformance).forEach(topic => {
      const perf = analytics.topicPerformance[topic];
      perf.percentage = perf.total > 0 ? (perf.correct / perf.total) * 100 : 0;
    });

    return analytics;
  }

  function getTopicPerformanceData() {
    const analytics = getQuizAnalytics();
    return Object.entries(analytics.topicPerformance).map(([topic, data]) => ({
      topic: topic.replace('-', ' '),
      percentage: Math.round(data.percentage),
      correct: data.correct,
      total: data.total
    }));
  }

  function getWeakAreas() {
    const analytics = getQuizAnalytics();
    return Object.entries(analytics.topicPerformance)
      .filter(([_, data]) => data.percentage < 70)
      .map(([topic, data]) => ({
        topic,
        percentage: data.percentage,
        recommendedLessons: getRecommendedLessons(topic)
      }))
      .sort((a, b) => a.percentage - b.percentage);
  }

  function getPracticeRecommendations() {
    return getWeakAreas().map(area => ({
      topic: area.topic,
      currentScore: area.percentage,
      recommendedLessons: area.recommendedLessons,
      priority: area.percentage < 50 ? 'high' : 'medium'
    }));
  }

  function getRecommendedLessons(topic) {
    const lessonMap = {
      'react-basics': ['What is React?', 'Setting up React'],
      'components': ['Understanding Components', 'JSX Syntax'],
      'javascript': ['ES6+ Features', 'Arrow Functions'],
      'math': ['Introduction to Limits', 'Limit Laws'],
      'spanish': ['Hello and Goodbye', 'Pronunciation Practice'],
      'french': ['At the Restaurant', 'Basic Conversations']
    };
    return lessonMap[topic] || ['Foundation Concepts'];
  }
  const weeklyProgress = getWeeklyProgress()

  // ApexCharts configuration for subject distribution (donut chart)
  const donutChartOptions = {
    chart: {
      type: 'donut',
      height: 300
    },
    labels: Object.keys(subjectData),
    colors: ['#5B4FCF', '#7C3AED', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6'],
    plotOptions: {
      pie: {
        donut: {
          size: '70%'
        }
      }
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '14px',
      markers: {
        width: 12,
        height: 12,
        radius: 6
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return Math.round(val) + '%'
      }
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 250
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ]
  }

  const donutChartSeries = Object.values(subjectData)

  // ApexCharts configuration for weekly progress (bar chart)
  const barChartOptions = {
    chart: {
      type: 'bar',
      height: 300,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        dataLabels: {
          position: 'top'
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val
      },
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ['#304758']
      }
    },
    xaxis: {
      categories: weeklyProgress.map(item => item.day),
      position: 'bottom',
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        show: false
      }
    },
    colors: ['#5B4FCF'],
    grid: {
      show: false
    }
  }

  const barChartSeries = [
    {
      name: 'Lessons Completed',
      data: weeklyProgress.map(item => item.progress)
    }
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <ApperIcon name="BarChart3" className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold text-gray-900">Progress Statistics</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
{/* Overall Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ProgressRing 
            progress={overallProgress}
            size={120}
            strokeWidth={8}
            className="mx-auto mb-4"
          />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Overall Progress</h3>
          <p className="text-gray-600">Across all courses</p>
        </motion.div>

        {/* Completed Courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <ApperIcon name="Trophy" className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{completedCourses}</h3>
          <p className="text-gray-600">Courses Completed</p>
        </motion.div>

        {/* Total Enrolled */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
            <ApperIcon name="BookOpen" className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{enrolledCourses.length}</h3>
          <p className="text-gray-600">Total Enrolled</p>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Subject Distribution */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-50 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Distribution</h3>
          {Object.keys(subjectData).length > 0 ? (
            <div className="h-64">
              <Chart
                options={donutChartOptions}
                series={donutChartSeries}
                type="donut"
                height={300}
              />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <ApperIcon name="PieChart" className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No data available</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Weekly Progress */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-50 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h3>
          <div className="h-64">
            <Chart
              options={barChartOptions}
              series={barChartSeries}
              type="bar"
              height={300}
            />
          </div>
        </motion.div>
      </div>

      {/* Achievement Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 pt-6 border-t border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
        <div className="flex flex-wrap gap-3">
          {completedCourses > 0 && (
            <Badge variant="success" className="flex items-center gap-2">
              <ApperIcon name="Trophy" className="w-4 h-4" />
              Course Completer
            </Badge>
          )}
          {overallProgress >= 75 && (
            <Badge variant="primary" className="flex items-center gap-2">
              <ApperIcon name="Target" className="w-4 h-4" />
              High Achiever
            </Badge>
          )}
          {enrolledCourses.length >= 5 && (
            <Badge variant="secondary" className="flex items-center gap-2">
              <ApperIcon name="BookOpen" className="w-4 h-4" />
              Knowledge Seeker
            </Badge>
          )}
          {weeklyProgress.reduce((sum, day) => sum + day.progress, 0) >= 20 && (
            <Badge variant="accent" className="flex items-center gap-2">
              <ApperIcon name="Zap" className="w-4 h-4" />
              Weekly Warrior
</Badge>
          )}
        </div>
      </motion.div>

      {/* Quiz Performance Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 pt-6 border-t border-gray-200"
      >
        <div className="flex items-center gap-3 mb-6">
          <ApperIcon name="Brain" className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Quiz Performance Analysis</h3>
        </div>

        {getQuizAnalytics().totalQuizzes > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Topic Performance Chart */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Topic Performance</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getTopicPerformanceData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="topic" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Performance']}
                      labelFormatter={(label) => `Topic: ${label}`}
                    />
                    <Bar 
                      dataKey="percentage" 
                      fill="#8884d8"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Weak Areas & Recommendations */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Areas for Improvement</h4>
              {getWeakAreas().length > 0 ? (
                <div className="space-y-4">
                  {getWeakAreas().slice(0, 3).map((area, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900 capitalize">
                          {area.topic.replace('-', ' ')}
                        </h5>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          area.percentage < 50 
                            ? 'bg-red-100 text-red-800'
                            : area.percentage < 70
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {area.percentage.toFixed(0)}%
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        Current performance: {area.percentage.toFixed(0)}% - Needs improvement
                      </p>
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-700">Recommended Practice:</p>
                        <div className="flex flex-wrap gap-1">
                          {area.recommendedLessons?.slice(0, 2).map((lesson, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {lesson}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {getWeakAreas().length > 3 && (
                    <div className="text-center">
                      <Button variant="outline" size="sm">
                        View All Recommendations
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ApperIcon name="CheckCircle" className="w-12 h-12 mx-auto mb-2 text-green-500" />
                  <p className="text-gray-600">Great job! No weak areas identified.</p>
                  <p className="text-sm text-gray-500">Keep up the excellent work!</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <ApperIcon name="Target" className="w-12 h-12 mx-auto mb-2 text-gray-400 opacity-50" />
            <p className="text-gray-600 mb-2">No quiz data available yet</p>
            <p className="text-sm text-gray-500">Complete some quizzes to see your performance analysis</p>
          </div>
        )}

        {/* Practice Suggestions */}
        {getQuizAnalytics().totalQuizzes > 0 && getWeakAreas().length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <ApperIcon name="Lightbulb" className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-blue-900 mb-1">Personalized Study Plan</h5>
                <p className="text-sm text-blue-800 mb-3">
                  Based on your quiz performance, we recommend focusing on these areas:
                </p>
                <div className="space-y-2">
                  {getPracticeRecommendations().slice(0, 2).map((rec, index) => (
                    <div key={index} className="text-sm">
                      <span className="font-medium text-blue-900 capitalize">
                        {rec.topic.replace('-', ' ')}:
                      </span>
                      <span className="text-blue-800 ml-1">
                        {rec.recommendedLessons[0]} 
                        {rec.priority === 'high' && ' (High Priority)'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}