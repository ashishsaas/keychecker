import { type User, type InsertUser, type Candidate, type InsertCandidate, type ExamResult, type InsertExamResult, type SubjectScore, type InsertSubjectScore } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Candidate methods
  createCandidate(candidate: InsertCandidate): Promise<Candidate>;
  getCandidateByRollNumber(rollNumber: string): Promise<Candidate | undefined>;
  
  // Exam result methods
  createExamResult(result: InsertExamResult): Promise<ExamResult>;
  getExamResult(candidateId: string): Promise<ExamResult | undefined>;
  getAllExamResults(): Promise<ExamResult[]>;
  getExamResultsByCategory(category: string): Promise<ExamResult[]>;
  getExamResultsByShift(examDate: string, examTime: string): Promise<ExamResult[]>;
  
  // Subject score methods
  createSubjectScores(scores: InsertSubjectScore[]): Promise<SubjectScore[]>;
  getSubjectScoresByResultId(resultId: string): Promise<SubjectScore[]>;
  
  // Statistics methods
  getTotalCandidatesCount(): Promise<number>;
  getCategoryAverageScore(category: string): Promise<number>;
  getShiftAverageScore(examDate: string, examTime: string): Promise<number>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private candidates: Map<string, Candidate>;
  private examResults: Map<string, ExamResult>;
  private subjectScores: Map<string, SubjectScore>;

  constructor() {
    this.users = new Map();
    this.candidates = new Map();
    this.examResults = new Map();
    this.subjectScores = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createCandidate(insertCandidate: InsertCandidate): Promise<Candidate> {
    const id = randomUUID();
    const candidate: Candidate = { 
      ...insertCandidate, 
      id,
      answerKeyUrl: insertCandidate.answerKeyUrl || null,
      subCategory: insertCandidate.subCategory || null,
      createdAt: new Date()
    };
    this.candidates.set(id, candidate);
    return candidate;
  }

  async getCandidateByRollNumber(rollNumber: string): Promise<Candidate | undefined> {
    return Array.from(this.candidates.values()).find(
      (candidate) => candidate.rollNumber === rollNumber
    );
  }

  async createExamResult(insertResult: InsertExamResult): Promise<ExamResult> {
    const id = randomUUID();
    const result: ExamResult = { 
      ...insertResult, 
      id,
      percentile: insertResult.percentile || null,
      overallRank: insertResult.overallRank || null,
      shiftRank: insertResult.shiftRank || null,
      categoryRank: insertResult.categoryRank || null,
      shiftAverage: insertResult.shiftAverage || null,
      categoryAverage: insertResult.categoryAverage || null,
      createdAt: new Date()
    };
    this.examResults.set(id, result);
    return result;
  }

  async getExamResult(candidateId: string): Promise<ExamResult | undefined> {
    return Array.from(this.examResults.values()).find(
      (result) => result.candidateId === candidateId
    );
  }

  async getAllExamResults(): Promise<ExamResult[]> {
    return Array.from(this.examResults.values());
  }

  async getExamResultsByCategory(category: string): Promise<ExamResult[]> {
    const candidates = Array.from(this.candidates.values()).filter(c => c.category === category);
    const candidateIds = candidates.map(c => c.id);
    return Array.from(this.examResults.values()).filter(r => candidateIds.includes(r.candidateId));
  }

  async getExamResultsByShift(examDate: string, examTime: string): Promise<ExamResult[]> {
    const candidates = Array.from(this.candidates.values()).filter(
      c => c.examDate === examDate && c.examTime === examTime
    );
    const candidateIds = candidates.map(c => c.id);
    return Array.from(this.examResults.values()).filter(r => candidateIds.includes(r.candidateId));
  }

  async createSubjectScores(insertScores: InsertSubjectScore[]): Promise<SubjectScore[]> {
    const scores: SubjectScore[] = insertScores.map(score => ({
      ...score,
      id: randomUUID()
    }));
    
    scores.forEach(score => {
      this.subjectScores.set(score.id, score);
    });
    
    return scores;
  }

  async getSubjectScoresByResultId(resultId: string): Promise<SubjectScore[]> {
    return Array.from(this.subjectScores.values()).filter(
      (score) => score.resultId === resultId
    );
  }

  async getTotalCandidatesCount(): Promise<number> {
    return this.candidates.size;
  }

  async getCategoryAverageScore(category: string): Promise<number> {
    const categoryResults = await this.getExamResultsByCategory(category);
    if (categoryResults.length === 0) return 0;
    
    const totalScore = categoryResults.reduce((sum, result) => 
      sum + parseFloat(result.overallScore), 0
    );
    return totalScore / categoryResults.length;
  }

  async getShiftAverageScore(examDate: string, examTime: string): Promise<number> {
    const shiftResults = await this.getExamResultsByShift(examDate, examTime);
    if (shiftResults.length === 0) return 0;
    
    const totalScore = shiftResults.reduce((sum, result) => 
      sum + parseFloat(result.overallScore), 0
    );
    return totalScore / shiftResults.length;
  }
}

export const storage = new MemStorage();
