const pdf = require('pdf-parse');
const fs = require('fs');

async function testHist242Dates() {
  try {
    const pdfPath = 'HIST 242_ Syllabus - HIST 242-1-10662 (CH,D)Modern East Asia (Fall 2025).pdf';
    const dataBuffer = fs.readFileSync(pdfPath);
    
    const data = await pdf(dataBuffer);
    const text = data.text;
    
    console.log('=== HIST 242 PDF Date Analysis ===');
    console.log('Total text length:', text.length);
    
    // Look for date patterns
    const datePatterns = [
      /Week #?\d+ \([0-9\/]+\)/g,
      /\([0-9]+\/[0-9]+\)/g,
      /[0-9]+\/[0-9]+/g,
      /August [0-9]+/g,
      /September [0-9]+/g,
      /October [0-9]+/g,
      /November [0-9]+/g,
      /December [0-9]+/g
    ];
    
    console.log('\n=== DATE PATTERNS FOUND ===');
    datePatterns.forEach((pattern, index) => {
      const matches = text.match(pattern);
      if (matches) {
        console.log(`Pattern ${index + 1}:`, matches.slice(0, 10)); // Show first 10 matches
      }
    });
    
    // Look for specific week patterns
    console.log('\n=== WEEK PATTERNS ===');
    const weekMatches = text.match(/Week #?\d+ \([0-9\/]+\)/g);
    if (weekMatches) {
      weekMatches.forEach(match => console.log(match));
    }
    
    // Look for content that should have dates
    console.log('\n=== CONTENT WITH MISSING DATES ===');
    const topics = [
      'Foundations of East Asian civilization',
      'Qing China: political, cultural, and economic institutions',
      'Tokugawa Japan',
      'Western intrusion and China',
      'The Meiji reforms',
      'Korea from the late 19th century',
      'China: The end of dynastic order',
      'Imperial Japan',
      'The 2nd Sino-Japanese War',
      'China under Mao Zedong',
      'U.S. occupation',
      'The Korean Peninsula',
      'The origins, development and aftermaths of the Vietnam War',
      'China from Mao to the present'
    ];
    
    topics.forEach(topic => {
      const regex = new RegExp(topic + '.*?(?=\\n|$)', 'g');
      const match = text.match(regex);
      if (match) {
        console.log(`\n${topic}:`);
        console.log(match[0].substring(0, 200) + '...');
      }
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testHist242Dates();
