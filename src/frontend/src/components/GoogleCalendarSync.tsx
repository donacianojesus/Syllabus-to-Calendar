import React, { useState } from 'react';
import { Calendar, Upload, CheckCircle, AlertCircle, Loader2, Settings } from 'lucide-react';
import GoogleCalendarApi from '../utils/googleCalendarApi';
import { CalendarEvent } from '../../../shared/types.ts';
import toast from 'react-hot-toast';

interface GoogleCalendarSyncProps {
  events: CalendarEvent[];
  courseInfo?: {
    courseName: string;
    courseCode?: string;
    semester?: string;
    year?: number;
  };
  isAuthenticated: boolean;
  className?: string;
}

const GoogleCalendarSync: React.FC<GoogleCalendarSyncProps> = ({
  events,
  courseInfo,
  isAuthenticated,
  className = ''
}) => {
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncResult, setLastSyncResult] = useState<any>(null);
  const [showCalendarOptions, setShowCalendarOptions] = useState<boolean>(false);
  const [availableCalendars, setAvailableCalendars] = useState<any[]>([]);
  const [selectedCalendarId, setSelectedCalendarId] = useState<string>('primary');
  const [isLoadingCalendars, setIsLoadingCalendars] = useState<boolean>(false);
  
  const googleCalendarApi = new GoogleCalendarApi();

  // Filter out events with placeholder dates (2099)
  const validEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getFullYear() !== 2099;
  });

  const handleSync = async () => {
    if (!isAuthenticated) {
      toast.error('Please connect to Google Calendar first');
      return;
    }

    if (validEvents.length === 0) {
      toast.error('No events to sync');
      return;
    }

    try {
      setIsSyncing(true);
      
      const response = await googleCalendarApi.syncEvents(validEvents, selectedCalendarId);
      
      if (response.success) {
        setLastSyncResult(response.data);
        toast.success(`Successfully synced ${response.data.syncedEvents} events to Google Calendar!`);
      } else {
        toast.error(response.error || 'Failed to sync events');
        setLastSyncResult({
          syncedEvents: 0,
          failedEvents: validEvents.length,
          errors: [response.error || 'Unknown error']
        });
      }
    } catch (error) {
      console.error('Error syncing events:', error);
      toast.error('Failed to sync events to Google Calendar');
    } finally {
      setIsSyncing(false);
    }
  };

  const loadCalendars = async () => {
    try {
      setIsLoadingCalendars(true);
      const response = await googleCalendarApi.getCalendars();
      
      if (response.success) {
        setAvailableCalendars(response.data.calendars);
      } else {
        toast.error(response.error || 'Failed to load calendars');
      }
    } catch (error) {
      console.error('Error loading calendars:', error);
      toast.error('Failed to load calendars');
    } finally {
      setIsLoadingCalendars(false);
    }
  };

  const handleShowCalendarOptions = () => {
    if (availableCalendars.length === 0) {
      loadCalendars();
    }
    setShowCalendarOptions(!showCalendarOptions);
  };

  const createNewCalendar = async () => {
    if (!courseInfo?.courseName) {
      toast.error('Course name is required to create a calendar');
      return;
    }

    try {
      const calendarName = `${courseInfo.courseName} - ${courseInfo.semester} ${courseInfo.year}`;
      const description = `Calendar for ${courseInfo.courseName} (${courseInfo.courseCode || 'N/A'}) - ${courseInfo.semester} ${courseInfo.year}`;
      
      const response = await googleCalendarApi.createCalendar(calendarName, description);
      
      if (response.success) {
        toast.success('New calendar created successfully!');
        // Refresh calendars list
        loadCalendars();
        // Select the new calendar
        setSelectedCalendarId(response.data.calendar.id);
      } else {
        toast.error(response.error || 'Failed to create calendar');
      }
    } catch (error) {
      console.error('Error creating calendar:', error);
      toast.error('Failed to create calendar');
    }
  };

  return (
    <div className={`bg-gray-800 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Upload className="w-6 h-6 text-green-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Sync to Google Calendar</h3>
            <p className="text-sm text-gray-400">
              {validEvents.length} events ready to sync
            </p>
          </div>
        </div>
        
        <button
          onClick={handleShowCalendarOptions}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-200"
          title="Calendar Options"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Calendar Options */}
      {showCalendarOptions && (
        <div className="mb-4 p-4 bg-gray-700 rounded-lg">
          <h4 className="text-white font-medium mb-3">Choose Calendar</h4>
          
          {isLoadingCalendars ? (
            <div className="flex items-center space-x-2 text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading calendars...</span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="space-y-2">
                {availableCalendars.map((calendar) => (
                  <label key={calendar.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="calendar"
                      value={calendar.id}
                      checked={selectedCalendarId === calendar.id}
                      onChange={(e) => setSelectedCalendarId(e.target.value)}
                      className="text-blue-600"
                    />
                    <span className="text-white text-sm">{calendar.summary}</span>
                    {calendar.primary && (
                      <span className="text-xs text-gray-400">(Primary)</span>
                    )}
                  </label>
                ))}
              </div>
              
              <button
                onClick={createNewCalendar}
                className="w-full mt-3 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 text-sm"
              >
                Create New Calendar
              </button>
            </div>
          )}
        </div>
      )}

      {/* Sync Button */}
      <button
        onClick={handleSync}
        disabled={!isAuthenticated || isSyncing || validEvents.length === 0}
        className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-md transition-colors duration-200 flex items-center justify-center space-x-2"
      >
        {isSyncing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Syncing...</span>
          </>
        ) : (
          <>
            <Calendar className="w-5 h-5" />
            <span>Sync to Google Calendar</span>
          </>
        )}
      </button>

      {/* Last Sync Result */}
      {lastSyncResult && (
        <div className="mt-4 p-3 bg-gray-700 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            {lastSyncResult.syncedEvents > 0 ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400" />
            )}
            <span className="text-white text-sm font-medium">Last Sync Result</span>
          </div>
          
          <div className="text-sm text-gray-300 space-y-1">
            <p>✅ Synced: {lastSyncResult.syncedEvents} events</p>
            {lastSyncResult.failedEvents > 0 && (
              <p>❌ Failed: {lastSyncResult.failedEvents} events</p>
            )}
            {lastSyncResult.errors && lastSyncResult.errors.length > 0 && (
              <div className="mt-2">
                <p className="text-red-400 text-xs">Errors:</p>
                {lastSyncResult.errors.map((error: string, index: number) => (
                  <p key={index} className="text-red-400 text-xs">• {error}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Info */}
      {!isAuthenticated && (
        <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-600/30 rounded-lg">
          <p className="text-yellow-400 text-sm">
            Please connect to Google Calendar first to sync your events.
          </p>
        </div>
      )}
    </div>
  );
};

export default GoogleCalendarSync;
