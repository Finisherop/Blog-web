'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  MousePointer, 
  Calendar,
  Award
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import AnalyticsChart from '@/components/AnalyticsChart';
import { getTotalStats, getAllAnalytics } from '@/lib/analytics';
import { getAllBlogs } from '@/lib/blogService';

export default function AdminAnalytics() {
  const [stats, setStats] = useState({
    totalViews: 0,
    totalCTRClicks: 0,
    totalUniqueVisitors: 0,
    totalBlogs: 0,
    topBlog: { id: '', views: 0, title: '' }
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [topBlogs, setTopBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const [totalStats, analytics, blogs] = await Promise.all([
          getTotalStats(),
          getAllAnalytics(),
          getAllBlogs()
        ]);

        setStats(totalStats);

        // Prepare chart data for views over time
        const viewsData = blogs.slice(0, 10).map(blog => ({
          name: blog.title.length > 15 ? blog.title.substring(0, 15) + '...' : blog.title,
          views: blog.views || 0,
          clicks: blog.ctrClicks || 0,
          date: new Date(blog.createdAt).toLocaleDateString()
        }));

        setChartData(viewsData);

        // Top performing blogs
        const sortedBlogs = blogs
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 5)
          .map((blog, index) => ({
            ...blog,
            rank: index + 1,
            engagement: blog.views > 0 ? ((blog.ctrClicks || 0) / blog.views * 100).toFixed(1) : '0'
          }));

        setTopBlogs(sortedBlogs);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (loading) {
    return (
      <AdminLayout title="Analytics">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  const engagementRate = stats.totalViews > 0 
    ? ((stats.totalCTRClicks / stats.totalViews) * 100).toFixed(1)
    : '0';

  return (
    <AdminLayout title="Analytics">
      <div className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm font-medium">Total Views</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {stats.totalViews.toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp size={16} className="text-green-400 mr-1" />
                  <span className="text-green-400 text-sm">+12%</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                <Eye size={24} className="text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm font-medium">Unique Visitors</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {stats.totalUniqueVisitors.toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp size={16} className="text-green-400 mr-1" />
                  <span className="text-green-400 text-sm">+8%</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                <Users size={24} className="text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm font-medium">CTR Clicks</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {stats.totalCTRClicks.toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp size={16} className="text-green-400 mr-1" />
                  <span className="text-green-400 text-sm">+15%</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center">
                <MousePointer size={24} className="text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm font-medium">Engagement Rate</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {engagementRate}%
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp size={16} className="text-green-400 mr-1" />
                  <span className="text-green-400 text-sm">+5%</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center">
                <Award size={24} className="text-white" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <AnalyticsChart
              data={chartData}
              type="bar"
              title="Blog Views Performance"
              dataKey="views"
              xAxisKey="name"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <AnalyticsChart
              data={chartData}
              type="line"
              title="CTR Clicks Trend"
              dataKey="clicks"
              xAxisKey="name"
            />
          </motion.div>
        </div>

        {/* Top Performing Blogs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="glass-card p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6">Top Performing Blogs</h2>
          
          <div className="space-y-4">
            {topBlogs.map((blog) => (
              <div
                key={blog.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    blog.rank === 1 ? 'bg-yellow-500 text-black' :
                    blog.rank === 2 ? 'bg-gray-400 text-black' :
                    blog.rank === 3 ? 'bg-orange-600 text-white' :
                    'bg-blue-500 text-white'
                  }`}>
                    {blog.rank}
                  </div>
                  
                  <div>
                    <h3 className="text-white font-semibold">
                      {blog.title.length > 50 ? blog.title.substring(0, 50) + '...' : blog.title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Published {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <p className="text-white font-semibold">{blog.views || 0}</p>
                    <p className="text-gray-400">Views</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-white font-semibold">{blog.ctrClicks || 0}</p>
                    <p className="text-gray-400">Clicks</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-white font-semibold">{blog.engagement}%</p>
                    <p className="text-gray-400">CTR</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {topBlogs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">No blog data available yet.</p>
            </div>
          )}
        </motion.div>

        {/* Performance Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Best Performing Day</h3>
            <div className="flex items-center space-x-2">
              <Calendar size={20} className="text-blue-400" />
              <span className="text-gray-300">Monday</span>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Highest engagement on Mondays
            </p>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Average Session</h3>
            <div className="flex items-center space-x-2">
              <Eye size={20} className="text-green-400" />
              <span className="text-gray-300">2.5 pages</span>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              Per visitor session
            </p>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Top Traffic Source</h3>
            <div className="flex items-center space-x-2">
              <TrendingUp size={20} className="text-purple-400" />
              <span className="text-gray-300">Direct</span>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              45% of total traffic
            </p>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}