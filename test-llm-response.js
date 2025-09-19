const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testLLMResponse() {
  try {
    const pdfPath = path.join(__dirname, 'HIST 242_ Syllabus (Fall 2025) (Brief Ed for Printing).pdf');
    
    const formData = new FormData();
    formData.append('syllabus', fs.createReadStream(pdfPath));
    formData.append('courseName', 'Modern East Asia');
    formData.append('courseCode', 'HIST 242');
    formData.append('semester', 'Fall');
    formData.append('year', '2025');
    
    const response = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders()
    });
    
    const result = await response.json();
    
    console.log('=== LLM RESPONSE ANALYSIS ===');
    console.log('Success:', result.success);
    console.log('Total events:', result.data?.assignments?.length + result.data?.exams?.length + result.data?.activities?.length);
    console.log('Assignments:', result.data?.assignments?.length || 0);
    console.log('Exams:', result.data?.exams?.length || 0);
    console.log('Activities:', result.data?.activities?.length || 0);
    
    console.log('\n=== ASSIGNMENTS ===');
    result.data?.assignments?.forEach((item, index) => {
      console.log(`${index + 1}. ${item.title} - ${item.due_date || 'No date'}`);
    });
    
    console.log('\n=== EXAMS ===');
    result.data?.exams?.forEach((item, index) => {
      console.log(`${index + 1}. ${item.title} - ${item.date || 'No date'}`);
    });
    
    console.log('\n=== ACTIVITIES ===');
    result.data?.activities?.forEach((item, index) => {
      console.log(`${index + 1}. ${item.title} - ${item.due_date || 'No date'}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testLLMResponse();
