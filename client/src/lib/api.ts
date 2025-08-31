import { apiRequest } from './queryClient';
import { CandidateForm } from '@shared/schema';

export interface SubmitScoreResponse {
  success: boolean;
  data?: {
    candidate: any;
    result: any;
    subjectScores: any[];
    calculatedResults: any;
  };
  error?: string;
}

export interface ResultsResponse {
  success: boolean;
  data?: {
    candidate: any;
    result: any;
    subjectScores: any[];
  };
  error?: string;
}

export interface StatisticsResponse {
  success: boolean;
  data?: {
    totalCandidates: number;
    averageScore: number;
    totalSubmissions: number;
  };
  error?: string;
}

export const scoreApi = {
  submitScore: async (formData: CandidateForm & { file?: File }): Promise<SubmitScoreResponse> => {
    const data = new FormData();
    
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'file' && value !== undefined && value !== '') {
        data.append(key, value.toString());
      }
    });
    
    if (formData.file) {
      data.append('answerKeyFile', formData.file);
    }

    const response = await fetch('/api/submit-score', {
      method: 'POST',
      body: data,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  },

  getResults: async (candidateId: string): Promise<ResultsResponse> => {
    const response = await apiRequest('GET', `/api/results/${candidateId}`);
    return await response.json();
  },

  getStatistics: async (): Promise<StatisticsResponse> => {
    const response = await apiRequest('GET', '/api/statistics');
    return await response.json();
  }
};
