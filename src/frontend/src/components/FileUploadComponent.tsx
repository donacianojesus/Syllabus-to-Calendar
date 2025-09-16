import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { SyllabusUploadResponse } from '../../../shared/types';
import { uploadSyllabus } from '../utils/api';
import toast from 'react-hot-toast';

interface FileUploadComponentProps {
  onUploadStart: () => void;
  onUploadSuccess: (result: SyllabusUploadResponse) => void;
  onUploadError: (error: string) => void;
  isUploading: boolean;
}

const FileUploadComponent: React.FC<FileUploadComponentProps> = ({
  onUploadStart,
  onUploadSuccess,
  onUploadError,
  isUploading
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [courseInfo, setCourseInfo] = useState({
    courseName: '',
    courseCode: '',
    semester: '',
    year: new Date().getFullYear()
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      toast.success(`File selected: ${file.name}`);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: isUploading
  });

  const removeFile = () => {
    setSelectedFile(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    // Validate required course information
    if (!courseInfo.courseName.trim()) {
      toast.error('Please enter a course name');
      return;
    }
    if (!courseInfo.courseCode.trim()) {
      toast.error('Please enter a course code');
      return;
    }
    if (!courseInfo.semester) {
      toast.error('Please select a semester');
      return;
    }


    onUploadStart();

    try {
      const formData = new FormData();
      formData.append('syllabus', selectedFile);
      
      // Always append course information (now required)
      formData.append('courseName', courseInfo.courseName);
      formData.append('courseCode', courseInfo.courseCode);
      formData.append('semester', courseInfo.semester);
      formData.append('year', courseInfo.year.toString());

      const result = await uploadSyllabus(formData);

      if (result.success) {
        onUploadSuccess(result as SyllabusUploadResponse);
        toast.success('Syllabus uploaded and parsed successfully!');
      } else {
        onUploadError(result.error || 'Upload failed');
        toast.error(result.error || 'Upload failed');
      }
    } catch (error) {
      let errorMessage = 'Network error occurred';
      
      if (error instanceof Error) {
        if (error.message.includes('500')) {
          errorMessage = 'Backend server error - please check if the backend is running';
        } else if (error.message.includes('404')) {
          errorMessage = 'Backend server not found - please check if the backend is running on port 3001';
        } else if (error.message.includes('ECONNREFUSED')) {
          errorMessage = 'Cannot connect to backend server - please start the backend server';
        } else {
          errorMessage = error.message;
        }
      }
      
      onUploadError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type === 'application/pdf') {
      return <FileText className="w-8 h-8 text-red-400" />;
    }
    return <FileText className="w-8 h-8 text-blue-400" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* File Upload Area */}
      <div className="card">
        <h3 className="text-xl font-bold text-white mb-4">Upload Syllabus</h3>
        
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
            isDragActive
              ? 'border-white bg-gray-800'
              : 'border-gray-600 hover:border-gray-500'
          } ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          {isDragActive ? (
            <p className="text-white text-lg">Drop the file here...</p>
          ) : (
            <div>
              <p className="text-white text-lg mb-2">Drag & drop your syllabus here</p>
              <p className="text-gray-400">or click to browse files</p>
              <p className="text-gray-500 text-sm mt-2">
                Supports PDF files only (max 10MB)
              </p>
            </div>
          )}
        </div>

        {/* File Rejection Errors */}
        {fileRejections.length > 0 && (
          <div className="mt-4 p-4 bg-red-900/20 border border-red-500/20 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <h4 className="text-red-400 font-medium">File Rejected</h4>
            </div>
            {fileRejections.map(({ file, errors }) => (
              <div key={file.name}>
                <p className="text-red-400 text-sm">{file.name}</p>
                <ul className="text-red-300 text-sm mt-1">
                  {errors.map(error => (
                    <li key={error.code}>• {error.message}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Selected File */}
        {selectedFile && (
          <div className="mt-4 p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getFileIcon(selectedFile)}
                <div>
                  <p className="text-white font-medium">{selectedFile.name}</p>
                  <p className="text-gray-400 text-sm">{formatFileSize(selectedFile.size)}</p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="text-gray-400 hover:text-white transition-colors"
                disabled={isUploading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Course Information Form */}
      <div className="card">
        <h3 className="text-xl font-bold text-white mb-4">Course Information <span className="text-red-400">*</span></h3>
        <p className="text-gray-400 text-sm mb-4">Please provide your course details before uploading the syllabus</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">
              Course Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={courseInfo.courseName}
              onChange={(e) => setCourseInfo(prev => ({ ...prev, courseName: e.target.value }))}
              placeholder="e.g., Constitutional Law"
              className="input-field"
              disabled={isUploading}
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">
              Course Code <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={courseInfo.courseCode}
              onChange={(e) => setCourseInfo(prev => ({ ...prev, courseCode: e.target.value }))}
              placeholder="e.g., LAW 101"
              className="input-field"
              disabled={isUploading}
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">
              Semester <span className="text-red-400">*</span>
            </label>
            <select
              value={courseInfo.semester}
              onChange={(e) => setCourseInfo(prev => ({ ...prev, semester: e.target.value }))}
              className="input-field"
              disabled={isUploading}
              required
            >
              <option value="">Select Semester</option>
              <option value="Fall">Fall</option>
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
              <option value="Winter">Winter</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">
              Year
            </label>
            <input
              type="number"
              value={courseInfo.year}
              onChange={(e) => setCourseInfo(prev => ({ ...prev, year: parseInt(e.target.value) || new Date().getFullYear() }))}
              min="2020"
              max="2030"
              className="input-field"
              disabled={isUploading}
            />
          </div>
        </div>
      </div>

      {/* Upload Button */}
      <div className="flex justify-center">
        <button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className={`px-8 py-3 rounded-lg font-medium transition-colors duration-200 ${
            !selectedFile || isUploading
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-white hover:bg-gray-200 text-gray-900'
          }`}
        >
          {isUploading ? 'Processing...' : 'Upload & Parse Syllabus'}
        </button>
      </div>
    </div>
  );
};

export default FileUploadComponent;
