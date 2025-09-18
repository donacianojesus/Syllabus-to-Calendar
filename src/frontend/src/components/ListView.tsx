import React, { useState, useMemo } from 'react';
import { Calendar, Clock, BookOpen, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { CalendarEvent, EventType, Priority } from '../../../shared/types.ts';
import { format, isToday, isTomorrow, isThisWeek, isThisMonth } from 'date-fns';

interface ListViewProps {
  events: CalendarEvent[];
  onEventSelect?: (event: CalendarEvent) => void;
  selectedEvent?: CalendarEvent;
}

type SortOption = 'date' | 'type' | 'priority' | 'title';

const ListView: React.FC<ListViewProps> = ({ 
  events, 
  onEventSelect, 
  selectedEvent 
}) => {
  const [sortBy, setSortBy] = useState<SortOption>('date');

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

  // Get relative date description
  const getRelativeDate = (date: Date): string => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isThisWeek(date)) return format(date, 'EEEE');
    if (isThisMonth(date)) return format(date, 'MMM d');
    return format(date, 'MMM d, yyyy');
  };

  // Sort events
  const sortedEvents = useMemo(() => {
    const sorted = [...events];
    
    sorted.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'type':
          return a.type.localeCompare(b.type);
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          const aPriority = priorityOrder[a.priority || 'low'];
          const bPriority = priorityOrder[b.priority || 'low'];
          return bPriority - aPriority;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return sorted;
  }, [events, sortBy]);

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">Event List</h3>
          <p className="text-gray-400 text-sm">
            {sortedEvents.length} events
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="btn-secondary"
          >
            <option value="date">Sort by Date</option>
            <option value="type">Sort by Type</option>
            <option value="priority">Sort by Priority</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>
      </div>


      {/* Events List */}
      <div className="space-y-3">
        {sortedEvents.length > 0 ? (
          sortedEvents.map((event) => {
            const isSelected = selectedEvent?.id === event.id;
            const eventDate = new Date(event.date);
            const isPlaceholderDate = eventDate.getFullYear() === 2099;

            return (
              <div
                key={event.id}
                onClick={() => onEventSelect?.(event)}
                className={`bg-gray-800 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:bg-gray-750 border ${
                  isSelected ? 'border-blue-500 bg-gray-750' : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getEventTypeIcon(event.type)}
                    <div>
                      <h4 className="text-white font-medium">{event.title}</h4>
                      <p className="text-gray-400 text-sm capitalize">{event.type}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {event.completed && (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                    {getPriorityBadge(event.priority)}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">
                        {isPlaceholderDate ? (
                          event.type === EventType.OTHER ? 'Activity (no date)' : 'No date'
                        ) : getRelativeDate(eventDate)}
                      </span>
                    </div>
                    
                    {event.time && (
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-300">{event.time}</span>
                      </div>
                    )}

                    {event.course && (
                      <span className="text-gray-400 text-xs bg-gray-700 px-2 py-1 rounded">
                        {event.course}
                      </span>
                    )}
                  </div>

                  {!isPlaceholderDate && (
                    <span className="text-gray-400 text-xs">
                      {format(eventDate, 'MMM d, yyyy')}
                    </span>
                  )}
                </div>

                {event.description && (
                  <p className="text-gray-300 text-sm mt-3 line-clamp-2">
                    {event.description}
                  </p>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">No events found</h3>
            <p className="text-gray-500 text-sm">
              Try adjusting your filters or upload a syllabus to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListView;
