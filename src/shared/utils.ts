// Shared utility functions for the LawBandit Calendar application

import { CalendarEvent, EventType, Priority } from './types';

/**
 * Format a date for display in the calendar
 */
export const formatDate = (date: Date, format: 'short' | 'long' | 'time' = 'short'): string => {
  const options: Record<string, Intl.DateTimeFormatOptions> = {
    short: { month: 'short', day: 'numeric' },
    long: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
    time: { hour: 'numeric', minute: '2-digit', hour12: true }
  };

  return new Intl.DateTimeFormat('en-US', options[format]).format(date);
};

/**
 * Get the color associated with an event type
 */
export const getEventTypeColor = (type: EventType): string => {
  const colors = {
    [EventType.ASSIGNMENT]: 'bg-blue-500',
    [EventType.EXAM]: 'bg-red-500',
    [EventType.READING]: 'bg-green-500',
    [EventType.CLASS]: 'bg-purple-500',
    [EventType.DEADLINE]: 'bg-orange-500',
    [EventType.OTHER]: 'bg-gray-500'
  };
  return colors[type] || colors[EventType.OTHER];
};

/**
 * Get the priority color
 */
export const getPriorityColor = (priority: Priority): string => {
  const colors = {
    [Priority.LOW]: 'text-gray-500',
    [Priority.MEDIUM]: 'text-yellow-600',
    [Priority.HIGH]: 'text-orange-600',
    [Priority.URGENT]: 'text-red-600'
  };
  return colors[priority] || colors[Priority.MEDIUM];
};

/**
 * Check if an event is overdue
 */
export const isOverdue = (event: CalendarEvent): boolean => {
  const now = new Date();
  return event.date < now && !event.completed;
};

/**
 * Check if an event is due today
 */
export const isDueToday = (event: CalendarEvent): boolean => {
  const today = new Date();
  const eventDate = new Date(event.date);
  
  return (
    eventDate.getDate() === today.getDate() &&
    eventDate.getMonth() === today.getMonth() &&
    eventDate.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if an event is due this week
 */
export const isDueThisWeek = (event: CalendarEvent): boolean => {
  const today = new Date();
  const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  return event.date >= today && event.date <= weekFromNow;
};

/**
 * Sort events by date and priority
 */
export const sortEvents = (events: CalendarEvent[]): CalendarEvent[] => {
  return events.sort((a, b) => {
    // First sort by date
    const dateComparison = a.date.getTime() - b.date.getTime();
    if (dateComparison !== 0) return dateComparison;
    
    // Then by priority (urgent first)
    const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
    const aPriority = priorityOrder[a.priority || Priority.MEDIUM];
    const bPriority = priorityOrder[b.priority || Priority.MEDIUM];
    
    return aPriority - bPriority;
  });
};

/**
 * Filter events based on criteria
 */
export const filterEvents = (
  events: CalendarEvent[],
  filters: {
    eventTypes?: EventType[];
    courses?: string[];
    dateRange?: { start: Date; end: Date };
    priority?: Priority[];
    showCompleted?: boolean;
  }
): CalendarEvent[] => {
  return events.filter(event => {
    // Event type filter
    if (filters.eventTypes && !filters.eventTypes.includes(event.type)) {
      return false;
    }
    
    // Course filter
    if (filters.courses && event.course && !filters.courses.includes(event.course)) {
      return false;
    }
    
    // Date range filter
    if (filters.dateRange) {
      if (event.date < filters.dateRange.start || event.date > filters.dateRange.end) {
        return false;
      }
    }
    
    // Priority filter
    if (filters.priority && event.priority && !filters.priority.includes(event.priority)) {
      return false;
    }
    
    // Completed filter
    if (filters.showCompleted === false && event.completed) {
      return false;
    }
    
    return true;
  });
};

/**
 * Generate a unique ID for events
 */
export const generateEventId = (): string => {
  return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Validate file type for syllabus upload
 */
export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  return fileExtension ? allowedTypes.includes(fileExtension) : false;
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
