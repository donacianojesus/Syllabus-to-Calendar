import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import GoogleCalendarApi from '../utils/googleCalendarApi';

const GoogleAuthCallback: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the authorization code from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
          setStatus('error');
          setMessage(`Authentication failed: ${error}`);
          // Notify parent window
          if (window.opener) {
            window.opener.postMessage({
              type: 'GOOGLE_AUTH_ERROR',
              error: error
            }, window.location.origin);
          }
          return;
        }

        if (!code) {
          setStatus('error');
          setMessage('No authorization code received');
          // Notify parent window
          if (window.opener) {
            window.opener.postMessage({
              type: 'GOOGLE_AUTH_ERROR',
              error: 'No authorization code received'
            }, window.location.origin);
          }
          return;
        }

        // Exchange code for tokens
        const googleCalendarApi = new GoogleCalendarApi();
        const response = await googleCalendarApi.exchangeCodeForTokens(code);

        if (response.success) {
          setStatus('success');
          setMessage('Successfully authenticated with Google Calendar!');
          
          // Notify parent window
          if (window.opener) {
            window.opener.postMessage({
              type: 'GOOGLE_AUTH_SUCCESS',
              tokens: response.data.tokens
            }, window.location.origin);
          }

          // Close the popup after a short delay
          setTimeout(() => {
            window.close();
          }, 2000);
        } else {
          setStatus('error');
          setMessage(response.error || 'Authentication failed');
          
          // Notify parent window
          if (window.opener) {
            window.opener.postMessage({
              type: 'GOOGLE_AUTH_ERROR',
              error: response.error || 'Authentication failed'
            }, window.location.origin);
          }
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        setStatus('error');
        setMessage('An unexpected error occurred during authentication');
        
        // Notify parent window
        if (window.opener) {
          window.opener.postMessage({
            type: 'GOOGLE_AUTH_ERROR',
            error: 'An unexpected error occurred'
          }, window.location.origin);
        }
      }
    };

    handleAuthCallback();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="w-12 h-12 animate-spin text-blue-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">
                Authenticating with Google Calendar
              </h2>
              <p className="text-gray-400">
                Please wait while we complete the authentication process...
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">
                Authentication Successful!
              </h2>
              <p className="text-gray-400 mb-4">
                {message}
              </p>
              <p className="text-sm text-gray-500">
                This window will close automatically...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">
                Authentication Failed
              </h2>
              <p className="text-gray-400 mb-4">
                {message}
              </p>
              <button
                onClick={() => window.close()}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors duration-200"
              >
                Close Window
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoogleAuthCallback;
