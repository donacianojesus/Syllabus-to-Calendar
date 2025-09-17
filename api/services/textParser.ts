import { Buffer } from 'buffer';

export interface TextParseResult {
  text: string;
  encoding: string;
  size: number;
}

export class TextParserService {
  /**
   * Parse text file and extract content
   */
  static async parseText(buffer: Buffer): Promise<TextParseResult> {
    try {
      // Try different encodings
      const encodings = ['utf8', 'utf16le', 'latin1', 'ascii'];
      
      for (const encoding of encodings) {
        try {
          const text = buffer.toString(encoding as BufferEncoding);
          
          // Check if the text looks valid (not too many replacement characters)
          const replacementCharCount = (text.match(/\uFFFD/g) || []).length;
          const totalChars = text.length;
          
          if (replacementCharCount / totalChars < 0.1) { // Less than 10% replacement characters
            return {
              text: this.cleanText(text),
              encoding,
              size: buffer.length,
            };
          }
        } catch (error) {
          // Try next encoding
          continue;
        }
      }
      
      // Fallback to utf8
      const text = buffer.toString('utf8');
      return {
        text: this.cleanText(text),
        encoding: 'utf8',
        size: buffer.length,
      };
    } catch (error) {
      throw new Error(`Failed to parse text file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Clean and normalize text content
   */
  static cleanText(text: string): string {
    return text
      // Remove excessive whitespace
      .replace(/\s+/g, ' ')
      // Normalize line endings
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      // Remove multiple consecutive newlines
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      // Remove null characters and other control characters
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
      .trim();
  }

  /**
   * Check if text is likely a syllabus based on content analysis
   */
  static isLikelySyllabus(text: string): boolean {
    const syllabusKeywords = [
      'syllabus',
      'course description',
      'assignments',
      'due date',
      'deadline',
      'exam',
      'midterm',
      'final',
      'reading',
      'schedule',
      'calendar',
      'grading',
      'rubric',
      'course outline',
      'learning objectives'
    ];

    const lowerText = text.toLowerCase();
    const keywordMatches = syllabusKeywords.filter(keyword => 
      lowerText.includes(keyword)
    ).length;

    // If we find at least 3 syllabus-related keywords, it's likely a syllabus
    return keywordMatches >= 3;
  }
}
