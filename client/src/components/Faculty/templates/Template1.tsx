import { IdCard } from '@/types/IdCard';
import { extractDriveFileId } from '@/utils/ExtractUrlParams';

interface Template1Props {
  card: IdCard;
}

const Template1 = ({ card }: Template1Props) => {
  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-lg border-2 border-gray-200">
      {/* Front Side */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="text-red-600 font-bold text-lg">IIMT</div>
            <div className="text-red-600 font-bold text-sm">UNIVERSITY</div>
            <div className="text-red-600 font-bold text-xs">MEERUT</div>
            <div className="text-xs text-gray-600 mt-1">
              Transforming Education System, Transforming Lives
            </div>
            <div className="bg-red-500 text-white text-xs px-2 py-1 rounded mt-1 inline-block">
              UGC Approved
            </div>
            <div className="text-xs">Section 2(f) & 12B</div>
          </div>
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            {card.photo ? (
              <img 
                src={extractDriveFileId(card.photo || '') || ""} 
                alt="Student" 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-xs text-gray-500">Photo</span>
            )}
          </div>
        </div>

        <div className="text-center mb-4">
          <div className="h-12 w-1 bg-red-300 mx-auto mb-2"></div>
          <div className="text-red-500 font-bold text-lg">{card.name}</div>
          <div className="text-xs">
            {Array.from(card.admissionId).map((digit, i) => (
              <span key={i} className="inline-block w-2 h-3 border border-black text-center text-xs mr-0.5">
                {digit}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-1 text-sm">
          <div><strong>Course/Stream:</strong> {card.course}</div>
          <div><strong>Department:</strong> {card.department}</div>
        </div>

        <div className="text-center mt-4 text-xs">
          <div>Issuing Authority</div>
          <div className="underline">Register</div>
        </div>
      </div>

      {/* Back Side */}
      <div className="border-t-2 border-dashed border-gray-300 p-4 bg-gray-50">
        <div className="space-y-2 text-sm">
          <div><strong>Admission ID:</strong> {card.admissionId}</div>
          <div><strong>Batch Year:</strong> {card.batchYear}</div>
          <div><strong>Date of Birth:</strong> {card.dateOfBirth}</div>
          <div><strong>Emergency Contact No.</strong></div>
          <div className="text-center font-bold">{card.emergencyContact}</div>
          <div><strong>Father's Name:</strong></div>
          <div>{card.fatherName}</div>
          <div><strong>Address:</strong></div>
          <div>{card.address}</div>
        </div>

        <div className="mt-4 text-center">
          <div className="text-red-600 font-bold">IIMT UNIVERSITY MEERUT</div>
          <div className="text-xs">TEL:0121-2793500-507</div>
          <div className="text-xs">MAIL@IIMTINDIA.NET</div>
        </div>
      </div>
    </div>
  );
};

export default Template1;