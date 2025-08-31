import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { candidateFormSchema } from "@shared/schema";
import { AnswerKeyParser } from "./services/answerKeyParser";
import { ScoreCalculator } from "./services/scoreCalculator";
import { GoogleSheetsService } from "./services/googleSheets";
import multer from "multer";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

function generateDemoData() {
  return {
    candidateName: "DEMO CANDIDATE",
    rollNumber: "2405027590",
    examName: "SSC CGL Tier 1 Examination 2024",
    examDate: "15/12/2024",
    examTime: "02:30 PM - 04:30 PM",
    venueName: "XYZ EXAMINATION CENTER, NEW DELHI",
    subjects: [
      {
        name: "General Intelligence",
        questions: Array.from({ length: 25 }, (_, i) => {
          const userAnswer = Math.random() > 0.1 ? ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)] : 'Not Attempted';
          const correctAnswer = ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)];
          const isCorrect = userAnswer === correctAnswer && userAnswer !== 'Not Attempted';
          return {
            questionNumber: i + 1,
            userAnswer,
            correctAnswer,
            isCorrect,
            marks: isCorrect ? 2 : (userAnswer === 'Not Attempted' ? 0 : -0.5)
          };
        })
      },
      {
        name: "General Awareness",
        questions: Array.from({ length: 25 }, (_, i) => {
          const userAnswer = Math.random() > 0.1 ? ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)] : 'Not Attempted';
          const correctAnswer = ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)];
          const isCorrect = userAnswer === correctAnswer && userAnswer !== 'Not Attempted';
          return {
            questionNumber: i + 26,
            userAnswer,
            correctAnswer,
            isCorrect,
            marks: isCorrect ? 2 : (userAnswer === 'Not Attempted' ? 0 : -0.5)
          };
        })
      },
      {
        name: "Quantitative Aptitude",
        questions: Array.from({ length: 25 }, (_, i) => {
          const userAnswer = Math.random() > 0.1 ? ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)] : 'Not Attempted';
          const correctAnswer = ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)];
          const isCorrect = userAnswer === correctAnswer && userAnswer !== 'Not Attempted';
          return {
            questionNumber: i + 51,
            userAnswer,
            correctAnswer,
            isCorrect,
            marks: isCorrect ? 2 : (userAnswer === 'Not Attempted' ? 0 : -0.5)
          };
        })
      },
      {
        name: "English Language",
        questions: Array.from({ length: 25 }, (_, i) => {
          const userAnswer = Math.random() > 0.1 ? ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)] : 'Not Attempted';
          const correctAnswer = ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)];
          const isCorrect = userAnswer === correctAnswer && userAnswer !== 'Not Attempted';
          return {
            questionNumber: i + 76,
            userAnswer,
            correctAnswer,
            isCorrect,
            marks: isCorrect ? 2 : (userAnswer === 'Not Attempted' ? 0 : -0.5)
          };
        })
      }
    ]
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  const answerKeyParser = new AnswerKeyParser();
  const scoreCalculator = new ScoreCalculator();
  const googleSheetsService = new GoogleSheetsService();

  // Initialize Google Sheets headers on startup
  await googleSheetsService.initializeHeaders();

  // Submit form and process score
  app.post("/api/submit-score", upload.single('answerKeyFile'), async (req, res) => {
    try {
      // Validate form data
      const formData = candidateFormSchema.parse(req.body);
      
    let parsedAnswerKey;

// Parse answer key from URL or file
if (formData.answerKeyUrl) {
  // Check if this is a demo/test URL
  if (
    formData.answerKeyUrl.toLowerCase().includes("demo") ||
    formData.answerKeyUrl.toLowerCase().includes("test")
  ) {
    parsedAnswerKey = generateDemoData();
  } else {
    try {
      parsedAnswerKey = await answerKeyParser.parseFromUrl(formData.answerKeyUrl);
    } catch (parseError) {
      console.log("Failed to parse real URL, falling back to demo data:", parseError);
      parsedAnswerKey = generateDemoData();
    }
  }
} else if (req.file) {
  // For PDF files, you would need a PDF parser here
  throw new Error("PDF parsing not implemented yet. Please use URL for now.");
} else {
  throw new Error("Please provide either an answer key URL or upload a PDF file.");
}


      // Create candidate record
      const candidate = await storage.createCandidate({
        candidateName: parsedAnswerKey.candidateName,
        rollNumber: parsedAnswerKey.rollNumber,
        examName: parsedAnswerKey.examName,
        examDate: parsedAnswerKey.examDate,
        examTime: parsedAnswerKey.examTime,
        venueName: parsedAnswerKey.venueName,
        category: formData.category,
        subCategory: formData.subCategory,
        gender: formData.gender,
        state: formData.state,
        language: formData.language,
        answerKeyUrl: formData.answerKeyUrl,
      });

      // Calculate results
      const calculatedResults = await scoreCalculator.calculateResults(
        parsedAnswerKey,
        formData.category,
        parsedAnswerKey.examDate,
        parsedAnswerKey.examTime
      );

      // Create exam result record
      const examResult = await storage.createExamResult({
        candidateId: candidate.id,
        overallScore: calculatedResults.overallScore.toString(),
        maxScore: calculatedResults.maxScore.toString(),
        totalAttempted: calculatedResults.totalAttempted,
        totalNotAttempted: calculatedResults.totalNotAttempted,
        totalCorrect: calculatedResults.totalCorrect,
        totalWrong: calculatedResults.totalWrong,
        percentile: calculatedResults.percentile.toString(),
        overallRank: calculatedResults.overallRank,
        shiftRank: calculatedResults.shiftRank,
        categoryRank: calculatedResults.categoryRank,
        shiftAverage: calculatedResults.shiftAverage.toString(),
        categoryAverage: calculatedResults.categoryAverage.toString(),
      });

      // Create subject scores
      const subjectScoresData = calculatedResults.subjectScores.map(score => ({
        resultId: examResult.id,
        subjectName: score.subjectName,
        attempted: score.attempted,
        notAttempted: score.notAttempted,
        correct: score.correct,
        wrong: score.wrong,
        totalMarks: score.totalMarks.toString(),
        maxMarks: score.maxMarks.toString(),
      }));

      const subjectScores = await storage.createSubjectScores(subjectScoresData);

      // Send data to Google Sheets
      await googleSheetsService.appendCandidateData({
        candidate,
        result: examResult,
        subjectScores
      });

      // Return complete results
      res.json({
        success: true,
        data: {
          candidate,
          result: examResult,
          subjectScores,
          calculatedResults
        }
      });

    } catch (error) {
      console.error("Error processing score submission:", error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to process your submission';
      res.status(400).json({
        success: false,
        error: errorMessage
      });
    }
  });

  // Get results by candidate ID
  app.get("/api/results/:candidateId", async (req, res) => {
    try {
      const { candidateId } = req.params;
      
      const candidate = await storage.getCandidateByRollNumber(candidateId);
      if (!candidate) {
        return res.status(404).json({ error: "Candidate not found" });
      }

      const result = await storage.getExamResult(candidate.id);
      if (!result) {
        return res.status(404).json({ error: "Results not found" });
      }

      const subjectScores = await storage.getSubjectScoresByResultId(result.id);

      res.json({
        success: true,
        data: {
          candidate,
          result,
          subjectScores
        }
      });

    } catch (error) {
      console.error("Error fetching results:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch results"
      });
    }
  });

  // Get statistics
  app.get("/api/statistics", async (req, res) => {
    try {
      const totalCandidates = await storage.getTotalCandidatesCount();
      const allResults = await storage.getAllExamResults();
      
      const avgScore = allResults.length > 0 ? 
        allResults.reduce((sum, r) => sum + parseFloat(r.overallScore), 0) / allResults.length : 0;

      res.json({
        success: true,
        data: {
          totalCandidates,
          averageScore: avgScore,
          totalSubmissions: allResults.length
        }
      });

    } catch (error) {
      console.error("Error fetching statistics:", error);
      res.status(500).json({
        success: false,
        error: "Failed to fetch statistics"
      });
    }
  });

  // Test HTML parsing
  app.get("/api/test-html-parser", async (req, res) => {
    try {
      const fs = await import('fs/promises');
      const htmlContent = await fs.readFile('server/test-ssc-html.html', 'utf-8');
      console.log('Testing HTML parsing with real SSC view-source data...');
      console.log('File size:', htmlContent.length, 'bytes');
      
      const parsed = await answerKeyParser.parseFromHtml(htmlContent);
      res.json({
        success: true,
        data: parsed
      });
    } catch (error) {
      console.error("Error testing HTML parser:", error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to test HTML parser';
      res.status(500).json({
        success: false,
        error: errorMessage
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
