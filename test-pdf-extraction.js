const pdf = require('pdf-parse');
const fs = require('fs');

async function testPdfExtraction() {
  try {
    const pdfPath = 'HIST 242_ Syllabus - HIST 242-1-10662 (CH,D)Modern East Asia (Fall 2025).pdf';
    const dataBuffer = fs.readFileSync(pdfPath);
    
    const data = await pdf(dataBuffer);
    console.log('PDF Text Length:', data.text.length);
    console.log('First 500 characters:');
    console.log(data.text.substring(0, 500));
    console.log('\nLast 500 characters:');
    console.log(data.text.substring(data.text.length - 500));
    
    // Check if it contains Torres content
    if (data.text.includes('Handbook for the New Legal Writer')) {
      console.log('\n❌ ERROR: PDF contains Torres content!');
    } else {
      console.log('\n✅ PDF does not contain Torres content');
    }
    
    // Check if it contains HIST 242 content
    if (data.text.includes('Modern East Asia') || data.text.includes('HIST 242')) {
      console.log('✅ PDF contains HIST 242 content');
    } else {
      console.log('❌ PDF does not contain HIST 242 content');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testPdfExtraction();
