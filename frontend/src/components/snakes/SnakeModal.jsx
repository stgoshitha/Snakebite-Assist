import React, { useState, useEffect } from 'react';
import ProvinceMap from '../maps/ProvinceMap';

const SnakeModal = ({ snake, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    color: '',
    size: '',
    length: '',
    headShape: '',
    pattern: '',
    behavior: '',
    venomType: '',
    painLevel: 1,
    painType: '',
    timeToSymptoms: '',
    commonSymptoms: [''],
    nativeProvinces: []
  });

  const provinces = [
    'Central Province',
    'Eastern Province',
    'North Central Province',
    'Northern Province',
    'North Western Province',
    'Sabaragamuwa Province',
    'Southern Province',
    'Uva Province',
    'Western Province'
  ];

  useEffect(() => {
    if (snake) {
      // Convert legacy nativeProvince to nativeProvinces array
      const nativeProvinces = Array.isArray(snake.nativeProvinces)
        ? snake.nativeProvinces
        : snake.nativeProvince
          ? [snake.nativeProvince]
          : [];

      setFormData({
        ...snake,
        nativeProvinces
      });
    }
  }, [snake]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProvinceChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setFormData(prev => ({
      ...prev,
      nativeProvinces: selectedOptions
    }));
  };

  const handleSymptomsChange = (index, value) => {
    const newSymptoms = [...formData.commonSymptoms];
    newSymptoms[index] = value;
    setFormData(prev => ({
      ...prev,
      commonSymptoms: newSymptoms
    }));
  };

  const addSymptom = () => {
    setFormData(prev => ({
      ...prev,
      commonSymptoms: [...prev.commonSymptoms, '']
    }));
  };

  const removeSymptom = (index) => {
    setFormData(prev => ({
      ...prev,
      commonSymptoms: prev.commonSymptoms.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {snake ? 'Edit Snake' : 'Add New Snake'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Color</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Size</label>
                <input
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Length</label>
                <input
                  type="text"
                  name="length"
                  value={formData.length}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Head Shape</label>
                <input
                  type="text"
                  name="headShape"
                  value={formData.headShape}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Pattern</label>
                <input
                  type="text"
                  name="pattern"
                  value={formData.pattern}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Behavior</label>
                <input
                  type="text"
                  name="behavior"
                  value={formData.behavior}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Venom Type</label>
                <input
                  type="text"
                  name="venomType"
                  value={formData.venomType}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Pain Level (1-10)</label>
                <input
                  type="number"
                  name="painLevel"
                  value={formData.painLevel}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Pain Type</label>
                <input
                  type="text"
                  name="painType"
                  value={formData.painType}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Time to Symptoms</label>
                <input
                  type="text"
                  name="timeToSymptoms"
                  value={formData.timeToSymptoms}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Native Provinces</label>
                <select
                  name="nativeProvinces"
                  value={formData.nativeProvinces}
                  onChange={handleProvinceChange}
                  required
                  multiple
                  size={5}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {provinces.map(province => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  Hold Ctrl (Windows) or Command (Mac) to select multiple provinces
                </p>
              </div>

              {/* Province Map */}
              <div className="col-span-2 h-[400px]">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Province Locations</h3>
                <div className="relative h-full">
                  <ProvinceMap selectedProvinces={formData.nativeProvinces} />
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Common Symptoms</label>
                {formData.commonSymptoms.map((symptom, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={symptom}
                      onChange={(e) => handleSymptomsChange(index, e.target.value)}
                      required
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeSymptom(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSymptom}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Add Symptom
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {snake ? 'Update Snake' : 'Add Snake'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SnakeModal; 