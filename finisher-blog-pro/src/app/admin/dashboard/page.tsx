'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Eye, 
  MousePointer, 
  FileText,
  TrendingUp,
  Calendar,
  Plus,
  BarChart3
} from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import AnalyticsChart from '@/components/AnalyticsChart';
import { getTotalStats, getAllAnalytics } from '@/lib/analytics';
import { getAllBlogs } from '@/lib/blogService';

interface DashboardStats {
  totalViews: number;
  totalCTRClicks: number;
  totalUniqueVisitors: number;
  totalBlogs: number;
  topBlog: {
    id: string;
    views: number;
    title: string;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalViews: 0,
    totalCTRClicks: 0,
    totalUniqueVisitors: 0,
    totalBlogs: 0,
    topBlog: { id: '', views: 0, title: '' }
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [totalStats, analytics, blogs] = await Promise.all([
          getTotalStats(),
          getAllAnalytics(),
          getAllBlogs()
        ]);

        setStats(totalStats);

        // Prepare chart data
        const blogChartData = blogs.slice(0, 10).map(blog => ({
          name: blog.title.length > 20 ? blog.title.substring(0, 20) + '...' : blog.title,
          views: blog.views || 0,
          clicks: blog.ctrClicks || 0
        }));

        setChartData(blogChartData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Visitors',
      value: stats.totalUniqueVisitors,
      icon: Users,
      color: 'from-blue-400 to-blue-600',
      change: '+12%'
    },
    {
      title: 'Total Views',
      value: stats.totalViews,
      icon: Eye,
      color: 'from-green-400 to-green-600',
      change: '+8%'
    },
    {
      title: 'CTR Clicks',
      value: stats.totalCTRClicks,
      icon: MousePointer,
      color: 'from-purple-400 to-purple-600',
      change: '+15%'
    },
    {
      title: 'Total Blogs',
      value: stats.totalBlogs,
      icon: FileText,
      color: 'from-orange-400 to-orange-600',
      change: '+3%'
    }
  ];

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome to Finisher Blog Pro Admin
              </h2>
              <p className="text-gray-300">
                Manage your blog content and track performance analytics
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 text-gray-300">
                <Calendar size={20} />
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass-card p-6 hover:shadow-lg hover:shadow-blue-400/10 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm font-medium">{card.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {card.value.toLocaleString()}
                  </p>
                  <div className="flex items-center mt-2">
                    <TrendingUp size={16} className="text-green-400 mr-1" />
                    <span className="text-green-400 text-sm">{card.change}</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${card.color} flex items-center justify-center`}>
                  <card.icon size={24} className="text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Top Performing Blog */}
        {stats.topBlog.title && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-card p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Top Performing Blog</h3>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xl font-bold gradient-text">{stats.topBlog.title}</h4>
                <p className="text-gray-300 mt-1">{stats.topBlog.views} views</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-green-400">
                  #{1}
                </span>
                <p className="text-gray-300 text-sm">Most viewed</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <AnalyticsChart
              data={chartData}
              type="bar"
              title="Blog Views"
              dataKey="views"
              xAxisKey="name"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
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

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="neon-button text-left p-4 h-auto">
              <div className="flex items-center space-x-3">
                <Plus className="w-6 h-6" />
                <div>
                  <div className="font-semibold">Create New Blog</div>
                  <div className="text-sm opacity-75">Start writing your next post</div>
                </div>
              </div>
            </button>
            
            <button className="neon-button text-left p-4 h-auto">
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-6 h-6" />
                <div>
                  <div className="font-semibold">View Analytics</div>
                  <div className="text-sm opacity-75">Detailed performance metrics</div>
                </div>
              </div>
            </button>
            
            <button className="neon-button text-left p-4 h-auto">
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6" />
                <div>
                  <div className="font-semibold">Manage Blogs</div>
                  <div className="text-sm opacity-75">Edit existing content</div>
                </div>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}