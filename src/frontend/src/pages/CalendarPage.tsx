import React, { useState, useEffect } from 'react';
import { Calendar, Clock, BookOpen, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import CalendarComponent from '../components/Calendar';
import { CalendarEvent, EventType, Priority } from '../../../shared/types';
import { format, isSameDay } from 'date-fns';

interface CalendarPageProps {
  events?: CalendarEvent[];
  courseInfo?: {
    courseName: string;
    courseCode?: string;
    semester?: string;
    year?: number;
  };
}

// Utility function to get the appropriate start month based on semester
const getSemesterStartMonth = (semester?: string, year?: number): Date => {
  const currentDate = new Date();
  
  if (!semester || !year) {
    return currentDate; // Default to current date if no semester/year info
  }
  
  const semesterLower = semester.toLowerCase();
  
  // Determine start month based on semester
  let startMonth: number;
  if (semesterLower.includes('spring')) {
    startMonth = 0; // January (0-indexed)
  } else if (semesterLower.includes('summer')) {
    startMonth = 4; // May (0-indexed)
  } else if (semesterLower.includes('fall') || semesterLower.includes('autumn')) {
    startMonth = 7; // August (0-indexed)
  } else if (semesterLower.includes('winter')) {
    startMonth = 10; // November (0-indexed)
  } else {
    // Default to current month if semester not recognized
    return currentDate;
  }
  
  // Create date with the appropriate year and month
  const semesterStartDate = new Date(year, startMonth, 1);
  return semesterStartDate;
};

const CalendarPage: React.FC<CalendarPageProps> = ({ 
  events = [], 
  courseInfo 
}) => {
  // Initialize with semester-appropriate date
  const [selectedDate, setSelectedDate] = useState<Date>(() => 
    getSemesterStartMonth(courseInfo?.semester, courseInfo?.year)
  );
  const [selectedEvents, setSelectedEvents] = useState<CalendarEvent[]>([]);

  // Update selected events when date changes
  useEffect(() => {
    const dayEvents = events.filter(event => 
      isSameDay(new Date(event.date), selectedDate)
    );
    setSelectedEvents(dayEvents);
  }, [selectedDate, events]);

  // Update calendar view when courseInfo changes (new syllabus uploaded)
  useEffect(() => {
    if (courseInfo?.semester && courseInfo?.year) {
      const semesterStartDate = getSemesterStartMonth(courseInfo.semester, courseInfo.year);
      setSelectedDate(semesterStartDate);
    }
  }, [courseInfo?.semester, courseInfo?.year]);

  // Get events for the current month
  const currentMonthEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
  });

  // Get event type icon
  const getEventTypeIcon = (type: EventType) => {
    switch (type) {
      case EventType.ASSIGNMENT:
        return <FileText className="w-4 h-4 text-blue-400" />;
      case EventType.EXAM:
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case EventType.READING:
        return <BookOpen className="w-4 h-4 text-green-400" />;
      case EventType.CLASS:
        return <Calendar className="w-4 h-4 text-purple-400" />;
      case EventType.DEADLINE:
        return <Clock className="w-4 h-4 text-orange-400" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-400" />;
    }
  };

  // Get priority color
  const getPriorityColor = (priority?: Priority): string => {
    switch (priority) {
      case Priority.URGENT:
        return 'text-red-400';
      case Priority.HIGH:
        return 'text-orange-400';
      case Priority.MEDIUM:
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority?: Priority) => {
    if (!priority || priority === Priority.LOW) return null;
    
    return (
      <span className={`text-xs px-2 py-1 rounded-full ${
        priority === Priority.URGENT ? 'bg-red-900/20 text-red-400' :
        priority === Priority.HIGH ? 'bg-orange-900/20 text-orange-400' :
        'bg-blue-900/20 text-blue-400'
      }`}>
        {priority}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Calendar View
        </h2>
        {courseInfo && (
          <div className="text-gray-400 text-lg">
            <p className="font-medium">{courseInfo.courseName}</p>
            {courseInfo.courseCode && (
              <p className="text-sm">{courseInfo.courseCode} • {courseInfo.semester} {courseInfo.year}</p>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="card">
            <CalendarComponent
              events={events}
              onDateSelect={setSelectedDate}
              selectedDate={selectedDate}
              value={selectedDate}
            />
          </div>
        </div>

        {/* Event Details Sidebar */}
        <div className="space-y-6">
          {/* Selected Date Events */}
          <div className="card">
            <h3 className="text-xl font-bold text-white mb-4">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h3>
            
            {selectedEvents.length > 0 ? (
              <div className="space-y-3">
                {selectedEvents.map((event) => (
                  <div key={event.id} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getEventTypeIcon(event.type)}
                        <h4 className="text-white font-medium">{event.title}</h4>
                      </div>
                      {event.completed && (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm capitalize">
                        {event.type}
                      </span>
                      {getPriorityBadge(event.priority)}
                    </div>
                    
                    {event.description && (
                      <p className="text-gray-300 text-sm mt-2">{event.description}</p>
                    )}
                    
                    {event.time && (
                      <p className="text-gray-400 text-sm mt-1">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {event.time}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No events on this date</p>
            )}
          </div>

          {/* Month Summary */}
          <div className="card">
            <h3 className="text-xl font-bold text-white mb-4">This Month</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{currentMonthEvents.length}</p>
                  <p className="text-gray-400 text-sm">Total Events</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-400">
                    {currentMonthEvents.filter(e => e.type === EventType.ASSIGNMENT).length}
                  </p>
                  <p className="text-gray-400 text-sm">Assignments</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Exams</span>
                  <span className="text-red-400 font-medium">
                    {currentMonthEvents.filter(e => e.type === EventType.EXAM).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Readings</span>
                  <span className="text-green-400 font-medium">
                    {currentMonthEvents.filter(e => e.type === EventType.READING).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Deadlines</span>
                  <span className="text-orange-400 font-medium">
                    {currentMonthEvents.filter(e => e.type === EventType.DEADLINE).length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="card">
            <h3 className="text-xl font-bold text-white mb-4">Upcoming</h3>
            
            {events.length > 0 ? (
              <div className="space-y-2">
                {events
                  .filter(event => new Date(event.date) >= new Date())
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .slice(0, 5)
                  .map((event) => (
                    <div key={event.id} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
                      <div className="flex items-center space-x-2">
                        {getEventTypeIcon(event.type)}
                        <div>
                          <p className="text-white text-sm font-medium">{event.title}</p>
                          <p className="text-gray-400 text-xs">
                            {new Date(event.date).getFullYear() === 2099 ? 'Activity' : format(new Date(event.date), 'MMM d')}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs ${getPriorityColor(event.priority)}`}>
                        {event.priority || 'low'}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-4">No events scheduled</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
