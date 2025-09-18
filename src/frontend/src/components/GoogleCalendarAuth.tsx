import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import GoogleCalendarApi from '../utils/googleCalendarApi';
import toast from 'react-hot-toast';

interface GoogleCalendarAuthProps {
  onAuthenticated?: (authenticated: boolean) => void;
  className?: string;
}

const GoogleCalendarAuth: React.FC<GoogleCalendarAuthProps> = ({ 
  onAuthenticated, 
  className = '' 
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState<boolean>(true);
  const googleCalendarApi = new GoogleCalendarApi();

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsCheckingStatus(true);
      const response = await googleCalendarApi.getStatus();
      
      if (response.success) {
        setIsAuthenticated(response.data.authenticated);
        onAuthenticated?.(response.data.authenticated);
      } else {
        console.error('Auth status check failed:', response.error);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handleAuthenticate = async () => {
    try {
      setIsLoading(true);
      
      // Get authorization URL
      const authResponse = await googleCalendarApi.getAuthUrl();
      
      if (!authResponse.success || !authResponse.data?.authUrl) {
        toast.error(authResponse.error || 'Failed to get authorization URL');
        return;
      }

      // Open Google OAuth in a popup window
      const popup = window.open(
        authResponse.data.authUrl,
        'google-auth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        toast.error('Popup blocked. Please allow popups for this site.');
        return;
      }

      // Listen for the popup to close or receive a message
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          setIsLoading(false);
          // Check if authentication was successful
          checkAuthStatus();
        }
      }, 1000);

      // Listen for messages from the popup
      const messageListener = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          clearInterval(checkClosed);
          popup.close();
          window.removeEventListener('message', messageListener);
          setIsLoading(false);
          
          // Set credentials and check status
          handleAuthSuccess(event.data.tokens);
        } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
          clearInterval(checkClosed);
          popup.close();
          window.removeEventListener('message', messageListener);
          setIsLoading(false);
          toast.error(event.data.error || 'Authentication failed');
        }
      };

      window.addEventListener('message', messageListener);

    } catch (error) {
      console.error('Error during authentication:', error);
      toast.error('Authentication failed');
      setIsLoading(false);
    }
  };

  const handleAuthSuccess = async (tokens: any) => {
    try {
      const response = await googleCalendarApi.setCredentials(tokens);
      
      if (response.success) {
        setIsAuthenticated(true);
        onAuthenticated?.(true);
        toast.success('Successfully connected to Google Calendar!');
      } else {
        toast.error(response.error || 'Failed to set credentials');
      }
    } catch (error) {
      console.error('Error setting credentials:', error);
      toast.error('Failed to complete authentication');
    }
  };

  const handleDisconnect = () => {
    // Clear any stored tokens (in a real app, you'd clear them from secure storage)
    setIsAuthenticated(false);
    onAuthenticated?.(false);
    toast.success('Disconnected from Google Calendar');
  };

  if (isCheckingStatus) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-400">Checking Google Calendar connection...</span>
      </div>
    );
  }

  return (
    <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Calendar className="w-6 h-6 text-blue-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Google Calendar</h3>
            <p className="text-sm text-gray-400">
              {isAuthenticated ? 'Connected' : 'Not connected'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {isAuthenticated ? (
            <CheckCircle className="w-5 h-5 text-green-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {isAuthenticated ? (
        <div className="space-y-3">
          <p className="text-gray-300 text-sm">
            Your Google Calendar is connected and ready for syncing.
          </p>
          <button
            onClick={handleDisconnect}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200 text-sm"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-gray-300 text-sm">
            Connect your Google Calendar to sync your syllabus events automatically.
          </p>
          <button
            onClick={handleAuthenticate}
            disabled={isLoading}
            className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-md transition-colors duration-200 text-sm flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <ExternalLink className="w-4 h-4" />
                <span>Connect Google Calendar</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default GoogleCalendarAuth;
