import { IdCard } from '@/types/IdCard';

interface Template4Props {
  card: IdCard;
}

const Template4 = ({ card }: Template4Props) => {
  return (
    <div className="w-full max-w-sm mx-auto bg-white shadow-lg border-2 border-gray-200 rounded-lg overflow-hidden">
      {/* Front Side */}
      <div className="p-4 relative">
        {/* Logo */}
        <div className="flex justify-start mb-4">
          <div className="w-16 h-16 bg-red-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">IIMT</span>
          </div>
        </div>

        <div className="space-y-3">
          {/* Avatar and User Details */}
          <div className="flex items-start gap-4">
            <div className="w-20 h-24 bg-gray-200 rounded border-2 border-red-400 overflow-hidden flex-shrink-0">
              {card.photo ? (
                <img 
                  src={extractDriveFileId(card.photo ?? '') || undefined} 
                  alt="Student" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-xs text-gray-500">Photo</span>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="text-red-500 font-medium text-lg leading-tight">{card.name}</h3>
              <div className="mt-2">
                <div className="w-full h-6 bg-gray-800 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-mono">{card.admissionId}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Course and Department */}
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Course/Stream:</span>
              <p className="font-semibold">{card.course}</p>
            </div>
            <div>
              <span className="font-medium">Department:</span>
              <p className="font-semibold">{card.department}</p>
            </div>
          </div>
        </div>

        {/* Authority */}
        <div className="absolute bottom-2 right-2 text-center">
          <p className="text-xs font-bold capitalize">Issuing Authority<br/>Register</p>
        </div>
      </div>

      {/* Back Side */}
      <div className="border-t-2 border-dashed border-gray-300 p-4 bg-gray-50">
        <div className="space-y-3">
          {/* Basic Info */}
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Admission ID:</span>
              <p className="font-semibold">{card.admissionId}</p>
            </div>
            <div>
              <span className="font-medium">Batch Year:</span>
              <p className="font-semibold">{card.batchYear}</p>
            </div>
            <div>
              <span className="font-medium">Date of Birth:</span>
              <p className="font-semibold">{card.dateOfBirth}</p>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="text-center">
            <div className="font-medium text-sm">Emergency Contact No.</div>
            <p className="font-bold text-lg">{card.emergencyContact}</p>
          </div>

          {/* Father's Name and Address */}
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Father's Name:</span>
              <p className="font-semibold">{card.fatherName}</p>
            </div>
            <div>
              <span className="font-medium">Address:</span>
              <p className="font-semibold">{card.address}</p>
            </div>
          </div>

          {/* University Info */}
          <div className="text-center mt-4 pt-3 border-t border-gray-300">
            <h4 className="text-red-600 font-bold text-sm uppercase">IIMT UNIVERSITY Meerut</h4>
            <p className="text-xs">TEL: 0121-2793500-507</p>
            <p className="text-xs">mail@iimtindia.net</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template4;
