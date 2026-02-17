import { useQuery } from '@tanstack/react-query';
import api from '../../config/api';
import UserLayout from '../../layouts/UserLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getImageUrl } from '../../utils/imageUtils';
import { formatDate } from '../../utils/formatters';
import { FlagIcon } from '@heroicons/react/24/outline';

const Reports = () => {
  // Fetch user's reports
  const { data, isLoading } = useQuery({
    queryKey: ['myReports'],
    queryFn: async () => {
      const response = await api.get('/reports/my-reports');
      return response.data.reports;
    },
  });

  const reports = data || [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'resolved':
        return 'bg-green-100 text-green-700';
      case 'dismissed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getReasonLabel = (reason) => {
    const labels = {
      inappropriate_content: 'Inappropriate Content',
      fake_profile: 'Fake Profile',
      harassment: 'Harassment',
      scam_or_fraud: 'Scam or Fraud',
      spam: 'Spam',
      other: 'Other',
    };
    return labels[reason] || reason;
  };

  if (isLoading) {
    return (
      <UserLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="lg" />
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Reports</h1>
          <p className="text-gray-600">
            View the status of reports you've submitted
          </p>
        </div>

        {reports.length > 0 ? (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="card p-4">
                <div className="flex gap-4">
                  {/* Photo */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                      {report.reportedUser?.profilePhotoUrl ? (
                        <img
                          src={getImageUrl(report.reportedUser.profilePhotoUrl)}
                          alt={report.reportedUser.firstName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <FlagIcon className="h-8 w-8" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {report.reportedUser?.firstName}{' '}
                          {report.reportedUser?.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {getReasonLabel(report.reason)}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          report.status
                        )}`}
                      >
                        {report.status.charAt(0).toUpperCase() +
                          report.status.slice(1)}
                      </span>
                    </div>

                    {report.description && (
                      <p className="text-sm text-gray-700 mb-3 bg-gray-50 p-3 rounded">
                        {report.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        Reported on {formatDate(report.createdAt)}
                      </span>
                      {report.resolvedAt && (
                        <span className="text-gray-500">
                          Resolved on {formatDate(report.resolvedAt)}
                        </span>
                      )}
                    </div>

                    {report.adminNotes && report.status !== 'pending' && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                        <p className="text-sm font-medium text-blue-900 mb-1">
                          Admin Response:
                        </p>
                        <p className="text-sm text-blue-800">
                          {report.adminNotes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card">
            <div className="text-center py-12">
              <FlagIcon className="mx-auto h-16 w-16 text-gray-300 stroke-1" />
              <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
                No Reports Submitted
              </h3>
              <p className="text-gray-600">
                You haven't reported any users yet
              </p>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default Reports;
