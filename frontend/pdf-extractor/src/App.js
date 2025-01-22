import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [extractedInfo, setExtractedInfo] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/extract', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setExtractedInfo(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-2xl font-bold mb-5">PDF Information Extractor</h1>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                  >
                    {loading ? 'Processing...' : 'Extract Information'}
                  </button>
                </form>

                {error && (
                  <div className="text-red-500 mt-2">{error}</div>
                )}

                <div className="mt-6">
                  <h2 className="text-xl font-semibold mb-4">Extracted Information</h2>
                  <div className="space-y-2">
                    <div>
                      <label className="font-medium">Name:</label>
                      <input
                        type="text"
                        value={extractedInfo.name}
                        readOnly
                        className="w-full p-2 border rounded mt-1"
                      />
                    </div>
                    <div>
                      <label className="font-medium">Phone:</label>
                      <input
                        type="text"
                        value={extractedInfo.phone}
                        readOnly
                        className="w-full p-2 border rounded mt-1"
                      />
                    </div>
                    <div>
                      <label className="font-medium">Address:</label>
                      <input
                        type="text"
                        value={extractedInfo.address}
                        readOnly
                        className="w-full p-2 border rounded mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;