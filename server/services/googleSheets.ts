import { Candidate, ExamResult, SubjectScore } from '@shared/schema';

export interface GoogleSheetsData {
  candidate: Candidate;
  result: ExamResult;
  subjectScores: SubjectScore[];
}

export class GoogleSheetsService {
  private apiKey: string;
  private spreadsheetId: string;

  constructor() {
    this.apiKey = process.env.GOOGLE_SHEETS_API_KEY || process.env.GOOGLE_API_KEY || 'your_api_key';
    this.spreadsheetId = process.env.GOOGLE_SHEETS_ID || process.env.SPREADSHEET_ID || 'your_spreadsheet_id';
  }

  async appendCandidateData(data: GoogleSheetsData): Promise<void> {
    try {
      const { candidate, result, subjectScores } = data;
      
      // Prepare row data for Google Sheets
      const rowData = [
        candidate.candidateName,
        candidate.rollNumber,
        candidate.examName,
        candidate.examDate,
        candidate.examTime,
        candidate.venueName,
        candidate.gender,
        candidate.category,
        candidate.subCategory || '',
        candidate.language,
        candidate.state,
        ...subjectScores.map(s => s.subjectName),
        result.totalAttempted,
        result.totalNotAttempted,
        result.totalCorrect,
        result.totalWrong,
        result.overallScore,
        result.overallRank,
        result.percentile,
        result.shiftRank,
        result.categoryRank,
        new Date().toISOString()
      ];

      // Google Sheets API endpoint
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Sheet1:append?valueInputOption=RAW&key=${this.apiKey}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [rowData]
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Google Sheets API error: ${response.statusText} - ${errorData}`);
      }

      console.log('Data successfully appended to Google Sheets');
    } catch (error) {
      console.error('Error appending to Google Sheets:', error);
      // Don't throw error to prevent breaking the main flow
    }
  }

  async initializeHeaders(): Promise<void> {
    try {
      const headers = [
        'Candidate Name',
        'Roll Number', 
        'Subject/Exam Name',
        'Exam Date',
        'Exam Time',
        'Venue Name',
        'Gender',
        'Category',
        'Sub-Category',
        'Language',
        'State',
        'Subject 1 Name',
        'Subject 2 Name', 
        'Subject 3 Name',
        'Subject 4 Name',
        'Attempted',
        'Not Attempted',
        'Right',
        'Wrong',
        'Total Score',
        'Overall Rank',
        'Percentile',
        'Shift Rank',
        'Category Rank',
        'Timestamp'
      ];

      const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.spreadsheetId}/values/Sheet1:A1:append?valueInputOption=RAW&key=${this.apiKey}`;
      
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [headers]
        })
      });
    } catch (error) {
      console.error('Error initializing Google Sheets headers:', error);
    }
  }
}
