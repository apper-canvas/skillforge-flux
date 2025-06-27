import { motion } from 'framer-motion'
import Chart from 'react-apexcharts'
import ApperIcon from '@/components/ApperIcon'
import ProgressRing from '@/components/atoms/ProgressRing'
import Badge from '@/components/atoms/Badge'

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
    </div>
  )
}