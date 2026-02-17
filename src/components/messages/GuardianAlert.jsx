import { InformationCircleIcon } from '@heroicons/react/24/outline';

const GuardianAlert = ({ guardianInfo }) => {
  if (!guardianInfo) return null;

  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
      <div className="flex items-start gap-3">
        <InformationCircleIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-blue-900 mb-1">
            Guardian Information
          </h3>
          <p className="text-sm text-blue-800 mb-2">
            As per Islamic tradition, it's recommended that this conversation
            involves the woman's guardian (wali).
          </p>
          <div className="bg-white rounded-lg p-3 text-sm">
            <p className="text-gray-700">
              <strong>Guardian:</strong> {guardianInfo.guardianName}
            </p>
            <p className="text-gray-700">
              <strong>Relationship:</strong> {guardianInfo.guardianRelationship}
            </p>
            <p className="text-gray-700">
              <strong>Contact:</strong> {guardianInfo.guardianPhone}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuardianAlert;
