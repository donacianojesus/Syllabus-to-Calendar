import React, { useState } from 'react';
import { FileText, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import FileUploadComponent from '../components/FileUploadComponent';
import { SyllabusUploadResponse } from '../../../shared/types';

interface UploadPageProps {
  onUploadSuccess?: (result: SyllabusUploadResponse) => void;
}

const UploadPage: React.FC<UploadPageProps> = ({ onUploadSuccess }) => {
  const [uploadResult, setUploadResult] = useState<SyllabusUploadResponse | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadSuccess = (result: SyllabusUploadResponse) => {
    try {
      setUploadResult(result);
      setIsUploading(false);
      
      // Call parent callback if provided
      if (onUploadSuccess) {
        onUploadSuccess(result);
      }
    } catch (error) {
      console.error('Error processing upload result:', error);
      handleUploadError('Failed to process upload result');
    }
  };

  const handleUploadStart = () => {
    setIsUploading(true);
    setUploadResult(null);
  };

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error);
    setUploadResult({
      success: false,
      error: error
    });
    setIsUploading(false);
  };

  const handleUploadAnother = () => {
    setUploadResult(null);
    setIsUploading(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Upload Syllabus
        </h2>
        <p className="text-gray-400 text-lg">
          Upload your PDF syllabus to automatically extract assignments, exams, and deadlines
        </p>
      </div>


      {/* Upload Component */}
      <div className="max-w-4xl mx-auto">
        <FileUploadComponent
          onUploadStart={handleUploadStart}
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
          isUploading={isUploading}
        />
      </div>

      {/* Upload Status */}
      {isUploading && (
        <div className="card max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <Loader className="w-6 h-6 text-white animate-spin" />
            <div>
              <h3 className="text-lg font-semibold text-white">Processing Syllabus</h3>
              <p className="text-gray-400">Extracting events and assignments...</p>
              <p className="text-gray-500 text-sm mt-1">This may take up to 30 seconds for large files</p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Results */}
      {uploadResult && (
        <div className="max-w-4xl mx-auto">
          {uploadResult.success ? (
            <div className="card">
              <div className="flex items-center space-x-4 mb-6">
                <CheckCircle className="w-8 h-8 text-green-400" />
                <div>
                  <h3 className="text-xl font-bold text-white">Upload Successful!</h3>
                  <p className="text-gray-400">Syllabus processed successfully</p>
                </div>
              </div>

              {uploadResult.data && (
                <div className="space-y-6">
                  {/* Course Information */}
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-white mb-3">Course Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-400">Course Name:</span>
                        <p className="text-white font-medium">{uploadResult.data.courseName}</p>
                      </div>
                      {uploadResult.data.courseCode && (
                        <div>
                          <span className="text-gray-400">Course Code:</span>
                          <p className="text-white font-medium">{uploadResult.data.courseCode}</p>
                        </div>
                      )}
                      {uploadResult.data.semester && (
                        <div>
                          <span className="text-gray-400">Semester:</span>
                          <p className="text-white font-medium">{uploadResult.data.semester}</p>
                        </div>
                      )}
                      {uploadResult.data.year && (
                        <div>
                          <span className="text-gray-400">Year:</span>
                          <p className="text-white font-medium">{uploadResult.data.year}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Events Summary */}
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-white mb-3">Events Found</h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-white">{uploadResult.data.events?.length || 0}</p>
                        <p className="text-gray-400 text-sm">Total Events</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-400">
                          {uploadResult.data.events?.filter(e => e.type === 'assignment').length || 0}
                        </p>
                        <p className="text-gray-400 text-sm">Assignments</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-400">
                          {uploadResult.data.events?.filter(e => e.type === 'exam').length || 0}
                        </p>
                        <p className="text-gray-400 text-sm">Exams</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-400">
                          {uploadResult.data.events?.filter(e => e.type === 'reading').length || 0}
                        </p>
                        <p className="text-gray-400 text-sm">Readings</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-400">
                          {uploadResult.data.events?.filter(e => e.type === 'other').length || 0}
                        </p>
                        <p className="text-gray-400 text-sm">Activities</p>
                      </div>
                    </div>
                  </div>

                  {/* Dated Events */}
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-white mb-3">Dated Events</h4>
                    <div className="space-y-2">
                      {uploadResult.data.events
                        ?.filter(e => new Date(e.date).getFullYear() !== 2099) // Filter out placeholder dates
                        ?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        ?.map((event) => (
                          <div key={event.id} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${
                                event.type === 'assignment' ? 'bg-blue-400' :
                                event.type === 'exam' ? 'bg-red-400' :
                                event.type === 'reading' ? 'bg-green-400' :
                                'bg-gray-400'
                              }`}></div>
                              <div>
                                <p className="text-white font-medium">{event.title}</p>
                                <p className="text-gray-400 text-sm">{event.type}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-white text-sm">
                                {new Date(event.date).toLocaleDateString()}
                              </p>
                              {event.priority && (
                                <p className={`text-xs ${
                                  event.priority === 'urgent' ? 'text-red-400' :
                                  event.priority === 'high' ? 'text-orange-400' :
                                  'text-gray-400'
                                }`}>
                                  {event.priority}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      {(!uploadResult.data.events || uploadResult.data.events.filter(e => new Date(e.date).getFullYear() !== 2099).length === 0) && (
                        <p className="text-gray-400 text-center py-4">No dated events found</p>
                      )}
                    </div>
                  </div>

                  {/* Activities (No Specific Dates) */}
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-white mb-3">Activities</h4>
                    <p className="text-gray-400 text-sm mb-3">Items without specific dates</p>
                    <div className="space-y-2">
                      {uploadResult.data.events
                        ?.filter(e => new Date(e.date).getFullYear() === 2099) // Only placeholder dates
                        ?.map((event) => (
                          <div key={event.id} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${
                                event.type === 'assignment' ? 'bg-blue-400' :
                                event.type === 'exam' ? 'bg-red-400' :
                                event.type === 'reading' ? 'bg-green-400' :
                                'bg-purple-400'
                              }`}></div>
                              <div>
                                <p className="text-white font-medium">{event.title}</p>
                                <p className="text-gray-400 text-sm">{event.type}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-400 text-sm">No date</p>
                              {event.priority && (
                                <p className={`text-xs ${
                                  event.priority === 'urgent' ? 'text-red-400' :
                                  event.priority === 'high' ? 'text-orange-400' :
                                  'text-gray-400'
                                }`}>
                                  {event.priority}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      {(!uploadResult.data.events || uploadResult.data.events.filter(e => new Date(e.date).getFullYear() === 2099).length === 0) && (
                        <p className="text-gray-400 text-center py-4">No activities found</p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <button className="btn-primary">
                      View Calendar
                    </button>
                    <button 
                      className="btn-secondary"
                      onClick={handleUploadAnother}
                    >
                      Upload Another
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="card">
              <div className="flex items-center space-x-4 mb-4">
                <AlertCircle className="w-8 h-8 text-red-400" />
                <div>
                  <h3 className="text-xl font-bold text-white">Upload Failed</h3>
                  <p className="text-gray-400">There was an error processing your syllabus</p>
                </div>
              </div>
              <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-400">{uploadResult.error}</p>
              </div>
              <div className="mt-4">
                <button 
                  className="btn-primary"
                  onClick={() => setUploadResult(null)}
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Help Section */}
      <div className="card max-w-4xl mx-auto">
        <h3 className="text-xl font-bold text-white mb-4">Supported Format</h3>
        <div className="grid grid-cols-1 gap-6">
          <div className="flex items-start space-x-3">
            <FileText className="w-6 h-6 text-blue-400 mt-1" />
            <div>
              <h4 className="text-white font-medium">PDF Files</h4>
              <p className="text-gray-400 text-sm">Upload PDF syllabi for parsing results</p>
            </div>
          </div>
        </div>
        <div className="mt-4 p-4 bg-gray-800 rounded-lg">
          <h4 className="text-white font-medium mb-2">Tips for Best Results:</h4>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>• Ensure your syllabus contains clear assignment dates</li>
            <li>• Use recognizable date formats (MM/DD/YYYY, Month DD, etc.)</li>
            <li>• Include course name and semester information when possible</li>
            <li>• Maximum file size: 10MB</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
