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

    return `You are an expert at parsing academic syllabi and extracting structured information. Please analyze the following syllabus text and extract ONLY specific assignments, readings, and exams. 

CRITICAL INSTRUCTIONS:
1. IGNORE completely: course descriptions, materials lists, objectives, policies, contact info, general textbook references, "one chapter per week" statements
2. FIND and EXTRACT from: "Weekly Assignments", "Assignment Schedule", "Reading Schedule", "Course Schedule", or any section with specific weekly tasks
3. LOOK FOR patterns like: "Week 1:", "January 17:", "Read:", "Assignment:", "Due:", specific page numbers, case names
4. PRIORITIZE: Specific assignments with dates, readings with page numbers, case names, exam dates
5. EXTRACT EXACTLY as written: Don't generalize or summarize - capture the specific details
6. CRITICAL: If you see "Week 1 Readings: M: Introduction materials (Hawkins v. McGee) & Home Building v. Blaisdell W: Door Dash, Inc. v. City of New York; Pages 38-54", extract these EXACT readings, not generic chapter references

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
      "title": "Reading assignment title",
      "details": "Optional description",
      "type": "reading",
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

EXTRACTION RULES:
1. MUST EXTRACT: Specific weekly assignments, readings with page numbers, case names, exam dates
2. MUST IGNORE: General course descriptions, textbook lists, policies, contact information
3. LOOK FOR: "Week X:", "Read:", "Assignment:", "Due:", "Pages XX-XX", "Case Name v. Case Name"
4. EXTRACT EXACTLY: Don't generalize - capture specific details as written
5. DATE HANDLING: Use ISO format (YYYY-MM-DD) for specific dates, move ambiguous dates to activities
6. PRIORITIZE: Weekly schedules over general course materials
7. FORMAT: Return valid JSON only, no additional text

WHAT TO EXTRACT:
- "Week 1: Read Hawkins v. McGee, pages 38-54" → Extract as specific reading
- "Assignment Due: February 14" → Extract as assignment with date
- "Midterm Exam: March 15" → Extract as exam with date
- "Read: Chapters 25-28, pages 181-206" → Extract as specific reading

WHAT TO IGNORE:
- "Required textbook: Situations and Contracts"
- "Course objectives: To learn..."
- "Contact: professor@email.com"
- "Attendance policy: Students must..."
- "We will cover approximately one chapter per week"
- "Each week we will cover one chapter"
- General course structure statements

WHAT TO EXTRACT (EXAMPLES FROM DAWSON SYLLABUS):
- "Week 1 Readings: M: Introduction materials (Hawkins v. McGee) & Home Building v. Blaisdell W: Door Dash, Inc. v. City of New York; Pages 38-54"
- "Week 2: Readings: M: Pages 66-90 W: Pages 91-101; 119-138"
- "Week 6: Readings: M: • Hamer v. Sidway, 258-261 • Ricketts v. Scothorn, Allegheny College, Drennan v. Star Paving, Hoffman v. Red Owl, 277-296"

EXAMPLE 1: If you see "Week 1 Readings: M: Introduction materials (Hawkins v. McGee) & Home Building v. Blaisdell W: Door Dash, Inc. v. City of New York; Pages 38-54", extract:
- "Week 1 Monday: Hawkins v. McGee and Home Building v. Blaisdell"
- "Week 1 Wednesday: Door Dash, Inc. v. City of New York; Pages 38-54"

EXAMPLE 2: If you see "Week 1 January 17 • Read: The Handbook for the New Legal Writer: Chapters 25-28, pages 181-206", extract:
- "Week 1: The Handbook for the New Legal Writer: Chapters 25-28, pages 181-206"

EXAMPLE 3: If you see "Week 1 Readings: M: Introduction materials (Hawkins v. McGee) & Home Building v. Blaisdell W: Door Dash, Inc. v. City of New York; Pages 38-54", extract:
- "Week 1 Monday: Introduction materials (Hawkins v. McGee) & Home Building v. Blaisdell"
- "Week 1 Wednesday: Door Dash, Inc. v. City of New York; Pages 38-54"

CRITICAL: Look for sections that start with "Week" followed by specific assignments, readings, and page numbers. Extract each specific reading assignment exactly as it appears. Do NOT extract general course materials or textbook references.

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

      // Validate date formats - be more flexible with ambiguous dates
      const validateDate = (dateStr: string) => {
        // Skip validation for placeholder dates (XX-XX format)
        if (dateStr.includes('XX') || dateStr.includes('TBD') || dateStr.includes('TBA')) {
          return false; // We'll filter these out later
        }
        const date = new Date(dateStr);
        return !isNaN(date.getTime()) && dateStr.match(/^\d{4}-\d{2}-\d{2}$/);
      };

      // Collect events with invalid dates to add to activities
      const invalidAssignments: any[] = [];
      const invalidExams: any[] = [];

      // Filter assignments - keep valid ones, collect invalid ones
      parsed.assignments = parsed.assignments.filter((assignment: any) => {
        if (!validateDate(assignment.due_date)) {
          console.log(`Moving assignment with invalid date to activities: ${assignment.due_date}`);
          invalidAssignments.push({
            title: assignment.title,
            details: assignment.details || `Due date: ${assignment.due_date}`,
            type: 'other',
            priority: assignment.priority || 'medium'
          });
          return false;
        }
        return true;
      });

      // Filter exams - keep valid ones, collect invalid ones
      parsed.exams = parsed.exams.filter((exam: any) => {
        if (!validateDate(exam.date)) {
          console.log(`Moving exam with invalid date to activities: ${exam.date}`);
          invalidExams.push({
            title: exam.title,
            details: exam.details || `Exam date: ${exam.date}`,
            type: 'other',
            priority: exam.priority || 'medium'
          });
          return false;
        }
        return true;
      });

      // Add invalid events to activities
      parsed.activities = [...(parsed.activities || []), ...invalidAssignments, ...invalidExams];

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

    // Convert activities (these don't have dates, so we'll add them with a placeholder date)
    // Only include reading assignments and academic activities, filter out administrative items
    for (const activity of llmData.activities) {
      // Skip administrative items
      const title = activity.title.toLowerCase();
      const description = (activity.details || '').toLowerCase();
      
      // Filter out administrative items
      if (title.includes('office hours') || 
          title.includes('email') || 
          title.includes('class time') || 
          title.includes('conference') ||
          title.includes('blackboard') ||
          title.includes('twen') ||
          title.includes('absence') ||
          title.includes('policy') ||
          description.includes('office hours') ||
          description.includes('email') ||
          description.includes('class time')) {
        continue; // Skip this activity
      }
      
      // Use a placeholder date far in the future for activities without dates
      const placeholderDate = new Date('2099-12-31');
      
      events.push({
        id: this.generateEventId(activity.title, placeholderDate),
        title: activity.title,
        description: activity.details,
        date: placeholderDate,
        type: activity.type === 'reading' ? EventType.READING : EventType.OTHER,
        priority: this.mapPriority(activity.priority),
        completed: false,
      });
    }

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
