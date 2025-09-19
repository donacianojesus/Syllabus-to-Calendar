const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');

// Mock the LLM parser service
async function testLLMParsing() {
  try {
    // Read the PDF
    const pdfPath = path.join(__dirname, 'HIST 242_ Syllabus (Fall 2025) (Brief Ed for Printing).pdf');
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    
    console.log('=== PDF TEXT EXTRACTED ===');
    console.log('Text length:', data.text.length);
    
    // Extract the schedule section - look for a broader pattern
    const scheduleMatch = data.text.match(/Tentative Class Schedule and Topics[\s\S]*?(?=\n\n[A-Z]|$)/);
    if (scheduleMatch) {
      const scheduleText = scheduleMatch[0];
      console.log('\n=== SCHEDULE SECTION ===');
      console.log('Schedule length:', scheduleText.length);
      
      // Look for week patterns
      const weekPatterns = scheduleText.match(/#\d+\s*\([^)]+\)/g);
      console.log('\n=== WEEK PATTERNS FOUND ===');
      console.log('Count:', weekPatterns?.length || 0);
      weekPatterns?.forEach((pattern, index) => {
        console.log(`${index + 1}. ${pattern}`);
      });
      
      // Look for topic descriptions that follow week patterns
      console.log('\n=== TOPIC DESCRIPTIONS ===');
      const lines = scheduleText.split('\n');
      let currentDate = null;
      
      lines.forEach((line, index) => {
        const weekMatch = line.match(/#\d+\s*\(([^)]+)\)\s*(.+)/);
        if (weekMatch) {
          currentDate = weekMatch[1];
          const topic = weekMatch[2].trim();
          if (topic) {
            console.log(`${index + 1}. Date: ${currentDate} | Topic: ${topic}`);
          }
        } else if (currentDate && line.trim() && !line.match(/^[A-Z]/)) {
          // This might be a continuation of the topic
          console.log(`${index + 1}. Date: ${currentDate} | Continuation: ${line.trim()}`);
        }
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testLLMParsing();