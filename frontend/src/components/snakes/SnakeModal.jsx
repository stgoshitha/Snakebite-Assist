import React, { useState, useEffect, useRef } from 'react';
import ProvinceMap from '../maps/ProvinceMap';
import { useTransliteration } from '../../context/TransliterationContext';

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
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [useUrlInput, setUseUrlInput] = useState(true);
  const fileInputRef = useRef(null);
  const { isEnabled, toggleTransliteration, transliterate } = useTransliteration();
  
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
    
    // Apply transliteration if enabled (for text fields only)
    const textFields = ['name', 'color', 'size', 'headShape', 'pattern', 'behavior', 'venomType', 'painType'];
    const isTextField = textFields.includes(name);
    
    // For text fields, use transliteration if enabled
    const processedValue = isEnabled && isTextField ? transliterate(value) : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(file);
      
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      // Clear the URL input if we're using file upload
      if (!useUrlInput) {
        setFormData(prev => ({
          ...prev,
          image: ''
        }));
      }
    }
  };

  const toggleImageInputMode = () => {
    setUseUrlInput(!useUrlInput);
    if (useUrlInput) {
      // Switching to file upload
      setFormData(prev => ({
        ...prev,
        image: ''
      }));
    } else {
      // Switching to URL input
      setUploadedImage(null);
      setImagePreview('');
    }
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
    
    // Apply transliteration if enabled
    newSymptoms[index] = isEnabled ? transliterate(value) : value;
    
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
    
    // We will rely on the useEffect in useTransliterationInput to handle this
    // The key thing is to ensure each new input gets a unique ID
  };

  const removeSymptom = (index) => {
    setFormData(prev => ({
      ...prev,
      commonSymptoms: prev.commonSymptoms.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prepare form data for submission
    const submitData = new FormData();
    
    // Add all form fields
    Object.keys(formData).forEach(key => {
      if (key === 'nativeProvinces' || key === 'commonSymptoms') {
        // Handle arrays
        formData[key].forEach(value => {
          submitData.append(`${key}[]`, value);
        });
      } else {
        submitData.append(key, formData[key]);
      }
    });
    
    // Add the image file if it exists
    if (uploadedImage) {
      submitData.append('snakeImage', uploadedImage);
    }
    
    onSubmit(submitData);
  };

  // Add this inside your return statement, before the form sections
  const renderTransliterationToggle = () => (
    <div className="mb-6 px-6 py-3 bg-[#60B5FF]/10 rounded-lg border border-[#AFDDFF]">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-[#60B5FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          <span className="font-medium text-gray-700">Sinhala Transliteration</span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={isEnabled}
            onChange={toggleTransliteration}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#60B5FF] rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#60B5FF]"></div>
          <span className="ms-2 text-sm font-medium text-gray-700">
            {isEnabled ? 'On' : 'Off'}
          </span>
        </label>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        When enabled, type in English to get Sinhala text (e.g., "amma" becomes "අම්මා").
      </p>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
        {/* Header Section */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-6 border-b border-gray-200 z-10 text-center relative">
          <div className="absolute right-4 top-4">
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white focus:outline-none transition-colors"
              aria-label="Close modal"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <h2 className="text-3xl font-bold text-white">
            {snake ? 'Edit Snake Details' : 'Add New Snake'}
          </h2>
          <p className="text-blue-100 mt-1 text-sm">
            Fill in the details below to {snake ? 'update' : 'add'} snake information
          </p>
        </div>
        
        <div className="p-6">
          {renderTransliterationToggle()}
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information Section */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                    placeholder="Enter snake name"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Snake Image</label>
                    <button
                      type="button"
                      onClick={toggleImageInputMode}
                      className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      {useUrlInput ? 'Switch to File Upload' : 'Switch to URL Input'}
                    </button>
                  </div>
                  
                  {useUrlInput ? (
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                      placeholder="Enter image URL"
                      required={!uploadedImage}
                    />
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="mb-1 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
                          </div>
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            required={!formData.image && !uploadedImage}
                          />
                        </label>
                      </div>
                      
                      {imagePreview && (
                        <div className="relative w-full h-40 mt-2 rounded-lg overflow-hidden">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-full h-full object-cover rounded-lg" 
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setUploadedImage(null);
                              setImagePreview('');
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                            title="Remove image"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Physical Characteristics Section */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
                Physical Characteristics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                    placeholder="Enter snake color"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
                  <input
                    type="text"
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                    placeholder="Enter snake size"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Length</label>
                  <input
                    type="text"
                    name="length"
                    value={formData.length}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                    placeholder="Enter snake length"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Head Shape</label>
                  <input
                    type="text"
                    name="headShape"
                    value={formData.headShape}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                    placeholder="Enter head shape"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pattern</label>
                  <input
                    type="text"
                    name="pattern"
                    value={formData.pattern}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                    placeholder="Enter snake pattern"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Behavior</label>
                  <input
                    type="text"
                    name="behavior"
                    value={formData.behavior}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                    placeholder="Enter snake behavior"
                  />
                </div>
              </div>
            </div>

            {/* Venom Information Section */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14a6 6 0 0112 0z" />
                </svg>
                Venom Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Venom Type</label>
                  <input
                    type="text"
                    name="venomType"
                    value={formData.venomType}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                    placeholder="Enter venom type"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pain Level (1-10)</label>
                  <input
                    type="number"
                    name="painLevel"
                    value={formData.painLevel}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    required
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pain Type</label>
                  <input
                    type="text"
                    name="painType"
                    value={formData.painType}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                    placeholder="Enter pain type"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time to Symptoms</label>
                  <input
                    type="text"
                    name="timeToSymptoms"
                    value={formData.timeToSymptoms}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                    placeholder="Enter time to symptoms"
                  />
                </div>
              </div>
            </div>

            {/* Location and Symptoms Combined Section */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Native Provinces Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-[#60B5FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Native Provinces
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <select
                        name="nativeProvinces"
                        value={formData.nativeProvinces}
                        onChange={handleProvinceChange}
                        required
                        multiple
                        size={5}
                        className="w-full rounded-lg border-[#AFDDFF] shadow-sm focus:border-[#60B5FF] focus:ring-[#60B5FF] transition-colors bg-white"
                      >
                        {provinces.map(province => (
                          <option key={province} value={province}>
                            {province}
                          </option>
                        ))}
                      </select>
                      <p className="mt-2 text-sm text-gray-500">
                        Hold Ctrl (Windows) or Command (Mac) to select multiple provinces
                      </p>
                    </div>
                    <div className="h-[400px] bg-white rounded-lg overflow-hidden border border-[#AFDDFF]">
                      <ProvinceMap selectedProvinces={formData.nativeProvinces} />
                    </div>
                  </div>
                </div>

                {/* Common Symptoms Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-[#60B5FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Common Symptoms
                  </h3>
                  <div className="space-y-3 bg-white p-4 rounded-lg border border-[#AFDDFF]">
                    {formData.commonSymptoms.map((symptom, index) => {
                      // Create a custom hook for each symptom input
                      const SymptomInput = () => {
                        return (
                          <input
                            type="text"
                            value={symptom}
                            onChange={(e) => handleSymptomsChange(index, e.target.value)}
                            required
                            className="flex-1 rounded-lg border-[#AFDDFF] shadow-sm focus:border-[#60B5FF] focus:ring-[#60B5FF] transition-colors"
                            placeholder={`Symptom ${index + 1}`}
                          />
                        );
                      };
                      
                      return (
                        <div key={index} className="flex gap-3">
                          <SymptomInput />
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => removeSymptom(index)}
                              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                              title="Remove symptom"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      );
                    })}
                    <button
                      type="button"
                      onClick={addSymptom}
                      className="w-full mt-2 px-4 py-2 bg-[#AFDDFF]/20 text-[#60B5FF] hover:bg-[#AFDDFF]/30 rounded-lg transition-colors inline-flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Symptom
                    </button>
                  </div>
                  <div className="mt-4 p-4 bg-[#AFDDFF]/10 rounded-lg border border-[#AFDDFF]">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Common Snake Bite Symptoms</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Severe pain and swelling</li>
                      <li>• Redness and bruising</li>
                      <li>• Nausea and vomiting</li>
                      <li>• Difficulty breathing</li>
                      <li>• Numbness or tingling</li>
                      <li>• Blurred vision</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="sticky bottom-0 bg-white pt-4 pb-4 border-t border-gray-200 flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
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