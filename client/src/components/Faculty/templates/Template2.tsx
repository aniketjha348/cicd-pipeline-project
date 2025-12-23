import { IdCard } from '@/types/IdCard';
import { extractDriveFileId } from '@/utils/ExtractUrlParams';

interface Template2Props {
  card: IdCard;
}

const Template2 = ({ card }: Template2Props) => {
  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg border-2 border-gray-200 rounded-lg">
      {/* Front Side */}
      <div className="p-4">
        <div className="text-center mb-4">
          <div className="text-white font-bold text-xl">UNIVERSITY</div>
          <div className="text-white font-bold text-lg">ID CARD</div>
          <div className="bg-white text-blue-600 text-xs px-2 py-1 rounded mt-2 inline-block">
            STUDENT
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-24 bg-white rounded flex items-center justify-center">
            {card?.photo ? (
              <img 
                src={extractDriveFileId(card.photo ?? '') || undefined} 
                alt="Student" 
                className="w-full h-full rounded object-cover"
              />
            ) : (
              <span className="text-xs text-gray-500">Photo</span>
            )}
          </div>
          <div className="flex-1">
            <div className="text-white font-bold text-lg mb-2">{card.name}</div>
            <div className="text-white text-sm">{card.admissionId}</div>
            <div className="text-white text-sm">{card.course}</div>
            <div className="text-white text-sm">{card.department}</div>
          </div>
        </div>

        <div className="text-center text-white text-xs">
          <div>Valid Until: {card.batchYear}</div>
        </div>
      </div>

      {/* Back Side */}
      <div className="border-t border-white/30 p-4 bg-black/20">
        <div className="space-y-2 text-sm text-white">
          <div><strong>DOB:</strong> {card.dateOfBirth}</div>
          <div><strong>Emergency:</strong> {card.emergencyContact}</div>
          <div><strong>Father:</strong> {card.fatherName}</div>
          <div><strong>Address:</strong> {card.address}</div>
        </div>

        <div className="mt-4 text-center text-white text-xs">
          <div>In case of emergency, please contact the university</div>
          <div>Contact: university@example.com</div>
        </div>
      </div>
    </div>
  );
};

export default Template2;