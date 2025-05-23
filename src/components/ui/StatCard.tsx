import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
}

const StatCard = ({ title, value, icon, trend, trendLabel }: StatCardProps) => {
  const formatValue = (val: number | string) => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <FiTrendingUp className="h-4 w-4" />;
    if (trend < 0) return <FiTrendingDown className="h-4 w-4" />;
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">
            {formatValue(value)}
          </p>
          {trend !== undefined && (
            <div className="flex items-center mt-2">
              <span className={`flex items-center text-sm ${getTrendColor(trend)}`}>
                {getTrendIcon(trend)}
                <span className="ml-1">
                  {Math.abs(trend)}% {trendLabel || 'from last period'}
                </span>
              </span>
            </div>
          )}
        </div>
        <div className="p-3 bg-primary-50 rounded-full">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard; 