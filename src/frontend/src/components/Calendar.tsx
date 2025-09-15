import React, { useMemo } from 'react';
import Calendar from 'react-calendar';
import { format, isSameDay } from 'date-fns';
import { CalendarEvent, EventType, Priority } from '../../../shared/types';
import 'react-calendar/dist/Calendar.css';

interface CalendarProps {
  events: CalendarEvent[];
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date;
  value?: Date; // Controls which month/year is displayed
}

const CalendarComponent: React.FC<CalendarProps> = ({
  events,
  onDateSelect,
  selectedDate,
  value
}) => {

  // Group events by date for efficient rendering
  const eventsByDate = useMemo(() => {
    const grouped: { [key: string]: CalendarEvent[] } = {};
    
    events.forEach(event => {
      const dateKey = format(new Date(event.date), 'yyyy-MM-dd');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });
    
    return grouped;
  }, [events]);

  // Get events for a specific date
  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return eventsByDate[dateKey] || [];
  };

  // Get event type color
  const getEventTypeColor = (type: EventType): string => {
    switch (type) {
      case EventType.ASSIGNMENT:
        return 'bg-blue-500';
      case EventType.EXAM:
        return 'bg-red-500';
      case EventType.READING:
        return 'bg-green-500';
      case EventType.CLASS:
        return 'bg-purple-500';
      case EventType.DEADLINE:
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Get priority styling
  const getPriorityStyle = (priority?: Priority): string => {
    switch (priority) {
      case Priority.URGENT:
        return 'ring-2 ring-red-400';
      case Priority.HIGH:
        return 'ring-1 ring-orange-400';
      case Priority.MEDIUM:
        return 'ring-1 ring-blue-400';
      default:
        return '';
    }
  };

  // Custom tile content for react-calendar
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;

    const dayEvents = getEventsForDate(date);
    if (dayEvents.length === 0) return null;

    // Show up to 3 event indicators
    const visibleEvents = dayEvents.slice(0, 3);
    const hasMore = dayEvents.length > 3;

    return (
      <div className="absolute bottom-1 left-1 right-1 flex flex-wrap gap-0.5">
        {visibleEvents.map((event, index) => (
          <div
            key={`${event.id}-${index}`}
            className={`w-1.5 h-1.5 rounded-full ${getEventTypeColor(event.type)} ${getPriorityStyle(event.priority)}`}
            title={`${event.title} (${event.type})`}
          />
        ))}
        {hasMore && (
          <div className="w-1.5 h-1.5 rounded-full bg-gray-400" title={`+${dayEvents.length - 3} more events`} />
        )}
      </div>
    );
  };

  // Custom tile class for styling
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return '';

    const classes = ['relative'];
    
    // Highlight today
    if (isSameDay(date, new Date())) {
      classes.push('bg-white/10');
    }
    
    // Highlight selected date
    if (selectedDate && isSameDay(date, selectedDate)) {
      classes.push('bg-white/20');
    }
    
    // Highlight dates with events
    const dayEvents = getEventsForDate(date);
    if (dayEvents.length > 0) {
      classes.push('border-l-2 border-white/30');
    }

    return classes.join(' ');
  };

  const handleDateChange = (value: any) => {
    if (value instanceof Date && onDateSelect) {
      onDateSelect(value);
    }
  };

  return (
    <div className="calendar-container">
      <Calendar
        value={value || selectedDate}
        onChange={handleDateChange}
        tileContent={tileContent}
        tileClassName={tileClassName}
        className="react-calendar"
        calendarType="US"
        showNeighboringMonth={false}
        formatShortWeekday={(_, date) => format(date, 'EEE')}
        formatMonthYear={(_, date) => format(date, 'MMMM yyyy')}
        formatDay={(_, date) => format(date, 'd')}
        next2Label={null}
        prev2Label={null}
        showFixedNumberOfWeeks={false}
        minDetail="month"
        maxDetail="month"
      />
    </div>
  );
};

export default CalendarComponent;
