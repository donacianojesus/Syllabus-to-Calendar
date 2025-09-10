const OpenAI = require('openai');
import { CalendarEvent, EventType, Priority, ParsedSyllabus } from '../../../shared/types';
import { LLMParsedSyllabus, LLMAssignment, LLMExam, LLMActivity, LLM_SCHEMA } from '../types/llm-schema';

export interface LLMParsingResult {
  success: boolean;
  data?: ParsedSyllabus;
  error?: string;
  confidence: number;
  method: 'llm' | 'fallback';
  rawResponse?: any;
}

export class LLMParserService {
  private static openai: any = null;
  private static isInitialized = false;

  /**
   * Initialize OpenAI client
   */
  private static initializeOpenAI(): boolean {
    if (this.isInitialized) return true;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.warn('OpenAI API key not found. LLM parsing will be disabled.');
      return false;
    }

    try {
      this.openai = new OpenAI({
        apiKey: apiKey,
      });
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize OpenAI client:', error);
      return false;
    }
  }

  /**
   * Parse syllabus using LLM
   */
  static async parseSyllabusWithLLM(
    text: string,
    courseName?: string,
    courseCode?: string,
    semester?: string,
    year?: number
  ): Promise<LLMParsingResult> {
    // Check if LLM parsing is enabled
    if (process.env.ENABLE_LLM_PARSING !== 'true') {
      return {
        success: false,
        error: 'LLM parsing is disabled',
        confidence: 0,
        method: 'fallback',
      };
    }

    // Initialize OpenAI if not already done
    if (!this.initializeOpenAI()) {
      return {
        success: false,
        error: 'OpenAI client not available',
        confidence: 0,
        method: 'fallback',
      };
    }

    try {
      // Preprocess text for LLM
      const cleanedText = this.preprocessText(text);
      
      // Create the prompt
      const prompt = this.createPrompt(cleanedText, courseName, courseCode, semester, year);
      
      // Call OpenAI API
      const response = await this.callOpenAI(prompt);
      
      // Parse and validate response
      const parsedResponse = this.parseLLMResponse(response);
      
      if (!parsedResponse.success) {
        return {
          success: false,
          error: parsedResponse.error || 'Failed to parse LLM response',
          confidence: 0,
          method: 'fallback',
          rawResponse: response,
        };
      }

      // Convert LLM response to our internal format
      const calendarEvents = this.convertToCalendarEvents(parsedResponse.data!);
      
      // Create parsed syllabus object
      const parsedSyllabus: ParsedSyllabus = {
        courseName: parsedResponse.data!.course_info?.course_name || courseName || 'Unknown Course',
        courseCode: parsedResponse.data!.course_info?.course_code || courseCode || 'UNKNOWN',
        semester: parsedResponse.data!.course_info?.semester || semester || 'Unknown',
        year: parsedResponse.data!.course_info?.year || year || new Date().getFullYear(),
        events: calendarEvents,
        rawText: text,
        parsedAt: new Date(),
      };

      return {
        success: true,
        data: parsedSyllabus,
        confidence: parsedResponse.data!.confidence_score || 85,
        method: 'llm',
        rawResponse: response,
      };

    } catch (error) {
      console.error('LLM parsing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown LLM parsing error',
        confidence: 0,
        method: 'fallback',
      };
    }
  }

  /**
   * Preprocess text for LLM consumption
   */
  private static preprocessText(text: string): string {
    return text
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      // Remove page numbers and headers
      .replace(/^\s*\d+\s*$/gm, '')
      .replace(/Page \d+ of \d+/gi, '')
      // Normalize line endings
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      // Remove excessive newlines
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      // Truncate if too long (to manage token limits)
      .substring(0, 8000)
      .trim();
  }

  /**
   * Create the prompt for the LLM
   */
  private static createPrompt(
    text: string,
    courseName?: string,
    courseCode?: string,
    semester?: string,
    year?: number
  ): string {
    const courseInfo = courseName ? `\nCourse: ${courseName}${courseCode ? ` (${courseCode})` : ''}${semester ? ` - ${semester}` : ''}${year ? ` ${year}` : ''}` : '';

    return `You are an expert at parsing academic syllabi and extracting structured information. Please analyze the following syllabus text and extract all assignments, exams, and activities with their dates.

${courseInfo}

Syllabus Text:
${text}

Please extract and return a JSON object with the following structure:
{
  "assignments": [
    {
      "title": "Assignment title",
      "due_date": "YYYY-MM-DD",
      "details": "Optional description",
      "priority": "low|medium|high|urgent"
    }
  ],
  "exams": [
    {
      "title": "Exam title",
      "date": "YYYY-MM-DD",
      "time": "Optional time",
      "details": "Optional description",
      "priority": "low|medium|high|urgent"
    }
  ],
  "activities": [
    {
      "title": "Activity title",
      "details": "Optional description",
      "type": "reading|class|discussion|other",
      "priority": "low|medium|high|urgent"
    }
  ],
  "course_info": {
    "course_name": "Extracted course name",
    "course_code": "Extracted course code",
    "semester": "Extracted semester",
    "year": 2024
  },
  "confidence_score": 85
}

Important guidelines:
1. Only include events with specific dates in assignments and exams
2. Include events without dates in activities
3. Use ISO date format (YYYY-MM-DD) for all dates
4. Be conservative with confidence scores (0-100)
5. Extract course information if not provided
6. Return valid JSON only, no additional text

JSON Response:`;
  }

  /**
   * Call OpenAI API
   */
  private static async callOpenAI(prompt: string): Promise<any> {
    if (!this.openai) {
      throw new Error('OpenAI client not initialized');
    }

    const response = await this.openai.chat.completions.create({
      model: process.env.LLM_MODEL || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at parsing academic syllabi and extracting structured information. Always return valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: parseInt(process.env.LLM_MAX_TOKENS || '2000'),
      temperature: parseFloat(process.env.LLM_TEMPERATURE || '0.1'),
      response_format: { type: "json_object" }
    });

    return response;
  }

  /**
   * Parse and validate LLM response
   */
  private static parseLLMResponse(response: any): { success: boolean; data?: LLMParsedSyllabus; error?: string } {
    try {
      const content = response.choices[0]?.message?.content;
      if (!content) {
        return { success: false, error: 'No content in LLM response' };
      }

      const parsed = JSON.parse(content);
      
      // Basic validation
      if (!parsed.assignments || !parsed.exams || !parsed.activities) {
        return { success: false, error: 'Missing required fields in LLM response' };
      }

      // Validate date formats
      const validateDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return !isNaN(date.getTime()) && dateStr.match(/^\d{4}-\d{2}-\d{2}$/);
      };

      // Validate assignments
      for (const assignment of parsed.assignments) {
        if (!validateDate(assignment.due_date)) {
          return { success: false, error: `Invalid date format in assignment: ${assignment.due_date}` };
        }
      }

      // Validate exams
      for (const exam of parsed.exams) {
        if (!validateDate(exam.date)) {
          return { success: false, error: `Invalid date format in exam: ${exam.date}` };
        }
      }

      return { success: true, data: parsed };

    } catch (error) {
      return { 
        success: false, 
        error: `Failed to parse LLM response: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }

  /**
   * Convert LLM response to CalendarEvent format
   */
  private static convertToCalendarEvents(llmData: LLMParsedSyllabus): CalendarEvent[] {
    const events: CalendarEvent[] = [];

    // Convert assignments
    for (const assignment of llmData.assignments) {
      events.push({
        id: this.generateEventId(assignment.title, new Date(assignment.due_date)),
        title: assignment.title,
        description: assignment.details,
        date: new Date(assignment.due_date),
        type: EventType.ASSIGNMENT,
        priority: this.mapPriority(assignment.priority),
        completed: false,
      });
    }

    // Convert exams
    for (const exam of llmData.exams) {
      events.push({
        id: this.generateEventId(exam.title, new Date(exam.date)),
        title: exam.title,
        description: exam.details,
        date: new Date(exam.date),
        time: exam.time,
        type: EventType.EXAM,
        priority: this.mapPriority(exam.priority),
        completed: false,
      });
    }

    // Convert activities (these don't have dates, so we'll handle them separately)
    // For now, we'll skip activities since they don't have dates
    // In the future, these could be added to a separate "activities" section

    return events.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  /**
   * Map LLM priority to our Priority enum
   */
  private static mapPriority(priority?: string): Priority {
    switch (priority?.toLowerCase()) {
      case 'urgent': return Priority.URGENT;
      case 'high': return Priority.HIGH;
      case 'medium': return Priority.MEDIUM;
      case 'low': return Priority.LOW;
      default: return Priority.MEDIUM;
    }
  }

  /**
   * Generate unique event ID
   */
  private static generateEventId(title: string, date: Date): string {
    const titleHash = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const dateStr = date.toISOString().split('T')[0];
    return `${titleHash}-${dateStr}`;
  }

  /**
   * Get LLM service status
   */
  static getStatus(): { available: boolean; model?: string; error?: string } {
    if (!this.initializeOpenAI()) {
      return { 
        available: false, 
        error: 'OpenAI API key not configured or invalid' 
      };
    }

    return {
      available: true,
      model: process.env.LLM_MODEL || 'gpt-3.5-turbo',
    };
  }
}
