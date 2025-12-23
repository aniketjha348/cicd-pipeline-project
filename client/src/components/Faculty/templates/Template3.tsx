import { IdCard } from '@/types/IdCard';
import { extractDriveFileId } from '@/utils/ExtractUrlParams';

interface Template3Props {
  card: IdCard;
}

const Template3 = ({ card }: Template3Props) => {
  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-lg border-2 border-green-300 rounded-lg">
      {/* Front Side */}
      <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="text-center mb-4">
          <div className="text-green-600 font-bold text-xl">ACADEMIC</div>
          <div className="text-green-600 font-bold text-lg">INSTITUTION</div>
          <div className="w-16 h-1 bg-green-500 mx-auto mt-2"></div>
        </div>

        <div className="text-center mb-4">
          <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
            {card.photo ? (
              <img 
                src={extractDriveFileId(card.photo ?? '') || undefined}
                alt="Student" 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-xs text-gray-500">Photo</span>
            )}
          </div>
          <div className="text-green-700 font-bold text-lg">{card.name}</div>
          <div className="text-green-600 text-sm">ID: {card.admissionId}</div>
        </div>

        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex justify-between">
            <span className="font-medium">Course:</span>
            <span>{card.course}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Department:</span>
            <span>{card.department}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Batch:</span>
            <span>{card.batchYear}</span>
          </div>
        </div>
      </div>

      {/* Back Side */}
      <div className="border-t border-green-200 p-4">
        <div className="space-y-2 text-sm text-gray-700">
          <div><strong>Date of Birth:</strong> {card.dateOfBirth}</div>
          <div><strong>Emergency Contact:</strong> {card.emergencyContact}</div>
          <div><strong>Father's Name:</strong> {card.fatherName}</div>
          <div><strong>Address:</strong> {card.address}</div>
        </div>

        <div className="mt-4 text-center">
          <div className="text-green-600 font-bold text-sm">STUDENT IDENTIFICATION</div>
          <div className="text-xs text-gray-500 mt-1">This card is property of the institution</div>
        </div>
      </div>
    </div>
  );
};

export default Template3;
