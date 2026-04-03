import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

const RoadmapModal = ({ skill, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);

  const generateRoadmap = async () => {
    setLoading(true);
    try {
      const response = await axios.post('https://hirelens-oowi.onrender.com/api/roadmap', { skill });
      setRoadmap(response.data.roadmap); // Assuming the API returns a "roadmap" field
    } catch (error) {
      console.error('Error generating roadmap:', error);
      alert('Failed to generate roadmap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateRoadmap();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-900">Roadmap for {skill}</h2>
          <button onClick={onClose}>
            <X size={20} className="text-slate-500 hover:text-slate-700" />
          </button>
        </div>
        {loading ? (
          <div className="text-center py-10">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <p className="text-slate-500">Generating roadmap...</p>
          </div>
        ) : roadmap ? (
          <div>
            <ul className="list-disc pl-5 space-y-2">
              {roadmap.map((step, index) => (
                <li key={index} className="text-slate-600">
                  {step}
                </li>
              ))}
            </ul>
            <button
              onClick={() => onSave(roadmap)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Save and Open Roadmap
            </button>
          </div>
        ) : (
          <p className="text-slate-500">No roadmap available.</p>
        )}
      </div>
    </div>
  );
};

export default RoadmapModal;