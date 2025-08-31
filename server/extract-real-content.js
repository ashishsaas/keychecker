// Quick utility to extract meaningful content from view-source HTML
import fs from 'fs';

try {
  const content = fs.readFileSync('test-ssc-html.html', 'utf-8');
  
  // Look for patterns that might contain candidate data
  const candidatePattern = /candidate[^<>]*name[^<>]*:?[^<>]*([\w\s]+)/gi;
  const rollPattern = /roll[^<>]*number[^<>]*:?[^<>]*(\d+)/gi;
  
  console.log('=== Searching for candidate patterns ===');
  
  let match;
  while ((match = candidatePattern.exec(content)) !== null) {
    console.log('Candidate match:', match[0]);
  }
  
  candidatePattern.lastIndex = 0;
  while ((match = rollPattern.exec(content)) !== null) {
    console.log('Roll number match:', match[0]);
  }
  
  // Look for table-like structures
  const tablePattern = /<table[^>]*>.*?<\/table>/gi;
  const tables = content.match(tablePattern);
  
  console.log(`\n=== Found ${tables?.length || 0} table structures ===`);
  
  // Look for numeric patterns that might be answers
  const answerPattern = /(\d{1,3})[^a-zA-Z0-9]*([A-D])[^a-zA-Z0-9]*([A-D])/g;
  const answers = [];
  
  while ((match = answerPattern.exec(content)) !== null && answers.length < 10) {
    answers.push({
      question: match[1],
      user: match[2], 
      correct: match[3]
    });
  }
  
  console.log('=== Answer patterns found ===');
  console.log(answers);
  
} catch (error) {
  console.error('Error:', error.message);
}