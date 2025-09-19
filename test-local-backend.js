const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');

async function testLocalBackend() {
  try {
    // Read the PDF
    const pdfPath = path.join(__dirname, 'HIST 242_ Syllabus (Fall 2025) (Brief Ed for Printing).pdf');
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    
    console.log('=== PDF CONTENT ANALYSIS ===');
    console.log('Total text length:', data.text.length);
    
    // Count week patterns
    const weekPatterns = data.text.match(/#\d+\s*\([^)]+\)/g);
    console.log('Week patterns found:', weekPatterns?.length || 0);
    console.log('Week patterns:', weekPatterns);
    
    // Count topic descriptions
    const topicPatterns = data.text.match(/#\d+\s*\([^)]+\)[^#]*[A-Z][^#]*/g);
    console.log('Topic patterns found:', topicPatterns?.length || 0);
    
    // Look for specific content
    const readingsCount = (data.text.match(/Readings:/g) || []).length;
    const videosCount = (data.text.match(/Video:/g) || []).length;
    const tipsCount = (data.text.match(/Tips on:/g) || []).length;
    
    console.log('Readings sections:', readingsCount);
    console.log('Video sections:', videosCount);
    console.log('Tips sections:', tipsCount);
    
    // Extract the schedule section
    const scheduleMatch = data.text.match(/Tentative Class Schedule and Topics[\s\S]*?(?=\n\n|\n[A-Z]|$)/);
    if (scheduleMatch) {
      console.log('\n=== SCHEDULE SECTION LENGTH ===');
      console.log('Schedule section length:', scheduleMatch[0].length);
      console.log('\n=== FIRST 2000 CHARS OF SCHEDULE ===');
      console.log(scheduleMatch[0].substring(0, 2000));
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testLocalBackend();
