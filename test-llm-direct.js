const OpenAI = require('openai');
require('dotenv').config();

async function testLLMDirect() {
  console.log('🧪 Testing LLM Direct Parsing...');
  
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const testText = `Week 1 Readings: M: Introduction materials (Hawkins v. McGee) & Home Building v. Blaisdell W: Door Dash, Inc. v. City of New York; Pages 38-54 Week 2: Readings: M: Pages 66-90 W: Pages 91-101; 119-138 Week 3: Readings: M: Labor Day Holiday W: pp 153-172 Week 4: Readings: M: pp 181-201 W: pp 206-222 Week 5: Readings: M: 223-240 W: 240-251; 258-263`;

  const prompt = `Extract ALL weekly readings from this text. Return JSON with activities array.

Text: ${testText}

Return JSON:
{
  "activities": [
    {
      "title": "Week X: Description",
      "details": "Full details",
      "type": "reading",
      "priority": "medium"
    }
  ]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.1,
      response_format: { type: "json_object" }
    });

    console.log('✅ LLM Response:');
    console.log(JSON.stringify(JSON.parse(response.choices[0].message.content), null, 2));
    
  } catch (error) {
    console.log('❌ LLM Error:', error.message);
  }
}

testLLMDirect();
