const pdf = require('pdf-parse');
const fs = require('fs');

async function testCorrectHist242() {
  try {
    const pdfPath = 'HIST 242_ Syllabus (Fall 2025) (Brief Ed for Printing).pdf';
    const dataBuffer = fs.readFileSync(pdfPath);
    
    const data = await pdf(dataBuffer);
    const text = data.text;
    
    console.log('=== CORRECT HIST 242 PDF Analysis ===');
    console.log('Total text length:', text.length);
    console.log('First 500 characters:');
    console.log(text.substring(0, 500));
    
    // Look for week patterns with dates
    console.log('\n=== WEEK PATTERNS WITH DATES ===');
    const weekMatches = text.match(/Week #?\d+ \([0-9\/&]+\)/g);
    if (weekMatches) {
      weekMatches.forEach(match => console.log(match));
    }
    
    // Look for specific date patterns
    console.log('\n=== DATE PATTERNS ===');
    const datePatterns = [
      /\([0-9]+\/[0-9]+\)/g,
      /\([0-9]+\/[0-9]+&[0-9]+\/[0-9]+\)/g,
      /[0-9]+\/[0-9]+/g
    ];
    
    datePatterns.forEach((pattern, index) => {
      const matches = text.match(pattern);
      if (matches) {
        console.log(`Pattern ${index + 1}:`, matches.slice(0, 15)); // Show first 15 matches
      }
    });
    
    // Look for content that should have dates
    console.log('\n=== SAMPLE WEEKLY CONTENT ===');
    const sampleContent = text.match(/Week #?\d+ \([0-9\/&]+\)[^]*?(?=Week #?\d+|$)/g);
    if (sampleContent) {
      sampleContent.slice(0, 3).forEach((content, index) => {
        console.log(`\n--- Week ${index + 1} Content ---`);
        console.log(content.substring(0, 300) + '...');
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testCorrectHist242();
