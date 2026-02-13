
import React, { useState } from 'react';
import { Activity } from '../types';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: Partial<Activity>) => void;
  initialData?: Activity;
}

const ActivityModal: React.FC<ActivityModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Activity>>(initialData || {
    type: 'PRACTICE',
    title: '',
    description: '',
    fromDate: '',
    toDate: '',
  });
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert("Only PDF files are allowed.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileBase64(reader.result as string);
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      fileData: fileBase64 ? fileBase64.split(',')[1] : formData.fileData,
      fileName: fileName || formData.fileName,
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="glass-card w-full max-w-xl p-8 rounded-none border-gray-700 animate-in fade-in zoom-in duration-300">
        <h2 className="text-2xl font-bold mb-6 tracking-tight uppercase">
          {initialData ? 'Edit' : 'New'} {formData.type}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1 uppercase">Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  className="accent-white"
                  checked={formData.type === 'PRACTICE'} 
                  onChange={() => setFormData({...formData, type: 'PRACTICE'})}
                />
                <span className="text-sm">Practice</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  className="accent-white"
                  checked={formData.type === 'SEMINAR'} 
                  onChange={() => setFormData({...formData, type: 'SEMINAR'})}
                />
                <span className="text-sm">Seminar</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1 uppercase">Title</label>
            <input 
              required
              className="w-full bg-black/50 border border-gray-700 p-3 text-white focus:outline-none focus:border-white transition-colors"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1 uppercase">From Date</label>
              <input 
                type="date"
                required
                className="w-full bg-black/50 border border-gray-700 p-3 text-white focus:outline-none focus:border-white transition-colors [color-scheme:dark]"
                value={formData.fromDate}
                onChange={e => setFormData({...formData, fromDate: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1 uppercase">To Date</label>
              <input 
                type="date"
                required
                className="w-full bg-black/50 border border-gray-700 p-3 text-white focus:outline-none focus:border-white transition-colors [color-scheme:dark]"
                value={formData.toDate}
                onChange={e => setFormData({...formData, toDate: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1 uppercase">Description</label>
            <textarea 
              rows={3}
              className="w-full bg-black/50 border border-gray-700 p-3 text-white focus:outline-none focus:border-white transition-colors"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1 uppercase">Proof (PDF only)</label>
            <input 
              type="file" 
              accept=".pdf"
              className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-gray-200"
              onChange={handleFileChange}
            />
            {(fileName || formData.fileName) && (
              <p className="mt-2 text-xs text-green-500">Current: {fileName || formData.fileName}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-2 border border-gray-700 hover:border-white transition-colors text-sm uppercase"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2 bg-white text-black font-bold hover:bg-gray-200 transition-colors text-sm uppercase shadow-[4px_4px_0px_#444]"
            >
              Save Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActivityModal;
