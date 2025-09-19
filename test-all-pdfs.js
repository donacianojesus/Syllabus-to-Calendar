const pdf = require('pdf-parse');
const fs = require('fs');
const path = require('path');

async function testPdfExtraction(pdfPath) {
  try {
    console.log(`\n=== Testing: ${pdfPath} ===`);
    const dataBuffer = fs.readFileSync(pdfPath);
    
    const data = await pdf(dataBuffer);
    console.log('PDF Text Length:', data.text.length);
    console.log('First 200 characters:');
    console.log(data.text.substring(0, 200));
    
    // Check for course content
    if (data.text.includes('Modern East Asia') || data.text.includes('HIST 242')) {
      console.log('✅ Contains HIST 242 content');
    } else if (data.text.includes('Linear Algebra') || data.text.includes('MATH 351')) {
      console.log('✅ Contains MATH 351 content');
    } else if (data.text.includes('Ethics') || data.text.includes('PHIL 210')) {
      console.log('✅ Contains PHIL 210 content');
    } else if (data.text.includes('Professional Integrity') || data.text.includes('LCHS 122')) {
      console.log('✅ Contains LCHS 122 content');
    } else {
      console.log('❓ Unknown content');
    }
    
    return data.text.length;
  } catch (error) {
    console.error('Error:', error.message);
    return 0;
  }
}

async function testAllPdfs() {
  const pdfFiles = [
    'HIST 242_ Syllabus - HIST 242-1-10662 (CH,D)Modern East Asia (Fall 2025).pdf',
    'LCHS 122x (1-MW) FYS-Foundations of Professional Integrity - Syllabus (Fall 2025) (revised 091125).pdf',
    'MATH 351-1-10815 Linear Algebra (Fall 2025) - MATH 351-1-10815 Linear Algebra (Fall 2025).pdf',
    'Phil 210-8 Ethics TTh 230-345 am.pdf'
  ];
  
  for (const pdfFile of pdfFiles) {
    if (fs.existsSync(pdfFile)) {
      await testPdfExtraction(pdfFile);
    } else {
      console.log(`\n❌ File not found: ${pdfFile}`);
    }
  }
}

testAllPdfs();
