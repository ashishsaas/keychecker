import { ParsedAnswerKey } from './answerKeyParser';
import { storage } from '../storage';

export interface CalculatedResults {
  overallScore: number;
  maxScore: number;
  totalAttempted: number;
  totalNotAttempted: number;
  totalCorrect: number;
  totalWrong: number;
  percentile: number;
  overallRank: number;
  shiftRank: number;
  categoryRank: number;
  shiftAverage: number;
  categoryAverage: number;
  subjectScores: Array<{
    subjectName: string;
    attempted: number;
    notAttempted: number;
    correct: number;
    wrong: number;
    totalMarks: number;
    maxMarks: number;
  }>;
}

export class ScoreCalculator {
  async calculateResults(
    parsedData: ParsedAnswerKey,
    category: string,
    examDate: string,
    examTime: string
  ): Promise<CalculatedResults> {
    // Calculate subject-wise scores
    const subjectScores = parsedData.subjects.map(subject => {
      const attempted = subject.questions.filter(q => q.userAnswer !== 'Not Attempted').length;
      const notAttempted = subject.questions.filter(q => q.userAnswer === 'Not Attempted').length;
      const correct = subject.questions.filter(q => q.isCorrect).length;
      const wrong = attempted - correct;
      const totalMarks = subject.questions.reduce((sum, q) => sum + q.marks, 0);
      const maxMarks = subject.questions.length * 2; // Assuming 2 marks per question
      
      return {
        subjectName: subject.name,
        attempted,
        notAttempted,
        correct,
        wrong,
        totalMarks,
        maxMarks
      };
    });

    // Calculate overall totals
    const totalAttempted = subjectScores.reduce((sum, s) => sum + s.attempted, 0);
    const totalNotAttempted = subjectScores.reduce((sum, s) => sum + s.notAttempted, 0);
    const totalCorrect = subjectScores.reduce((sum, s) => sum + s.correct, 0);
    const totalWrong = subjectScores.reduce((sum, s) => sum + s.wrong, 0);
    const overallScore = subjectScores.reduce((sum, s) => sum + s.totalMarks, 0);
    const maxScore = subjectScores.reduce((sum, s) => sum + s.maxMarks, 0);

    // Calculate averages
    const shiftAverage = await storage.getShiftAverageScore(examDate, examTime);
    const categoryAverage = await storage.getCategoryAverageScore(category);

    // Calculate ranks
    const allResults = await storage.getAllExamResults();
    const categoryResults = await storage.getExamResultsByCategory(category);
    const shiftResults = await storage.getExamResultsByShift(examDate, examTime);

    const overallRank = allResults.filter(r => parseFloat(r.overallScore) > overallScore).length + 1;
    const categoryRank = categoryResults.filter(r => parseFloat(r.overallScore) > overallScore).length + 1;
    const shiftRank = shiftResults.filter(r => parseFloat(r.overallScore) > overallScore).length + 1;

    // Calculate percentile
    const totalCandidates = await storage.getTotalCandidatesCount();
    const percentile = totalCandidates > 0 ? 
      ((totalCandidates - overallRank + 1) / totalCandidates) * 100 : 0;

    return {
      overallScore,
      maxScore,
      totalAttempted,
      totalNotAttempted,
      totalCorrect,
      totalWrong,
      percentile,
      overallRank,
      shiftRank,
      categoryRank,
      shiftAverage,
      categoryAverage,
      subjectScores
    };
  }
}
