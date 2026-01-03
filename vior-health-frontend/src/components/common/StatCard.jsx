import { TrendingUp, TrendingDown } from 'lucide-react';

// eslint-disable-next-line react/prop-types
const StatCard = ({ icon: Icon, title, value, change, changeType, iconColor = 'bg-primary-100 text-primary-600' }) => {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-neutral-600 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-neutral-800 mb-2">{value}</h3>
          {change && (
            <div className="flex items-center gap-1">
              {changeType === 'increase' ? (
                <TrendingUp className="w-4 h-4 text-success-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-danger-600" />
              )}
              <span
                className={`text-sm font-medium ${
                  changeType === 'increase' ? 'text-success-600' : 'text-danger-600'
                }`}
              >
                {change}
              </span>
              <span className="text-xs text-neutral-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl flex-shrink-0 ${iconColor || 'bg-primary-100'}`}>
          <Icon className={`w-6 h-6 ${iconColor ? 'text-white' : 'text-primary-600'}`} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
