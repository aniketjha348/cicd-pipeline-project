import React, { useState } from 'react';

interface ImageUploaderProps {
  onUpload?: (base64Url: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [base64String, setBase64String] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      onUpload && onUpload(result)
      setImagePreview(result);
      setBase64String(result);

    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 space-y-6">
      <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white">📷 Upload Image & Get Base64</h2>

      <div className="flex justify-center">
        <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition">
          Select Image
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </div>

      {imagePreview && (
        <div className="w-full flex justify-center">
          <img
            src={imagePreview}
            alt="Preview"
            className="max-w-full max-h-64 rounded-md border border-slate-300 dark:border-slate-700"
          />
        </div>
      )}

      {/* {base64String && (
        <div>
          <label className="block mb-1 text-sm font-medium text-slate-700 dark:text-slate-300">Base64 Output</label>
          <textarea
            className="w-full h-40 p-3 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-mono text-sm border border-slate-300 dark:border-slate-700 resize-none"
            value={base64String}
            readOnly
          />
        </div>
      )} */}
    </div>
  );
};

export default ImageUploader;
