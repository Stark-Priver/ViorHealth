import { useState, useEffect } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { Clock, User, Package, ShoppingCart, FileText } from 'lucide-react';
import { analyticsAPI } from '../../services/api';

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getRecentActivities();
      const data = Array.isArray(response.data) ? response.data : response.data.results || [];
      
      const formattedActivities = data.map((activity, index) => {
        const timeAgo = getTimeAgo(activity.created_at);
        
        return {
          id: activity.id || index,
          type: activity.activity_type || 'general',
          icon: activity.activity_type === 'sale' ? ShoppingCart : 
                activity.activity_type === 'prescription' ? FileText : Package,
          title: activity.title || activity.activity_type || 'Activity',
          description: activity.description || '',
          user: activity.user || 'System',
          time: timeAgo,
          status: activity.status || 'info',
        };
      });
      
      setActivities(formattedActivities.length > 0 ? formattedActivities : [
        {
          id: 0,
          type: 'info',
          icon: Package,
          title: 'No recent activity',
          description: 'Start using the system to see activities here',
          user: 'System',
          time: 'Just now',
          status: 'info',
        }
      ]);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  return (
    <Card title="Recent Activity">
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
          <p className="mt-2 text-sm text-neutral-600">Loading activities...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-4 hover:bg-neutral-50 rounded-lg transition-colors"
            >
              <div className={`p-2 rounded-lg ${
                activity.status === 'success' ? 'bg-success-100' :
                activity.status === 'warning' ? 'bg-warning-100' :
                activity.status === 'danger' ? 'bg-danger-100' :
                'bg-primary-100'
              }`}>
                <activity.icon className={`w-5 h-5 ${
                  activity.status === 'success' ? 'text-success-600' :
                  activity.status === 'warning' ? 'text-warning-600' :
                  activity.status === 'danger' ? 'text-danger-600' :
                  'text-primary-600'
                }`} />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="text-sm font-semibold text-neutral-800">{activity.title}</h4>
                  <Badge variant={activity.status} size="sm">{activity.status}</Badge>
                </div>
                <p className="text-sm text-neutral-600 mb-1">{activity.description}</p>
                <div className="flex items-center gap-3 text-xs text-neutral-500">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {activity.user}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default RecentActivity;
