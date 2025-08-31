import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { scoreApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import ScoreForm from "@/components/ScoreForm";
import { CandidateForm } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const submitScoreMutation = useMutation({
    mutationFn: scoreApi.submitScore,
    onSuccess: (data) => {
      if (data.success && data.data) {
        toast({
          title: "Success!",
          description: "Your score has been calculated successfully.",
        });
        // Navigate to results page
        setLocation(`/results/${data.data.candidate.rollNumber}`);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to process your submission",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit form",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: CandidateForm & { file?: File }) => {
    submitScoreMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-700 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-lg shadow-md">
                <i className="fas fa-graduation-cap text-primary text-2xl"></i>
              </div>
              <div>
                <h1 className="text-white text-2xl font-bold">SSC Score Checker</h1>
                <p className="text-blue-100 text-sm">Staff Selection Commission Results</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-white hover:text-blue-100 transition-colors">Home</a>
              <a href="#" className="text-white hover:text-blue-100 transition-colors">About</a>
              <a href="#" className="text-white hover:text-blue-100 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            CHECK YOUR RANK & SCORE
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get instant results for your SSC examination with detailed analysis, rankings, and subject-wise performance breakdown.
          </p>
        </div>

        {/* Form */}
        <ScoreForm 
          onSubmit={handleSubmit}
          isLoading={submitScoreMutation.isPending}
        />

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-bolt text-primary text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">Instant Results</h3>
            <p className="text-muted-foreground">Get your scores and rankings in seconds with our advanced processing system.</p>
          </div>
          <div className="text-center p-6">
            <div className="bg-green-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-chart-line text-green-500 text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">Detailed Analysis</h3>
            <p className="text-muted-foreground">Subject-wise breakdown with comprehensive performance metrics and insights.</p>
          </div>
          <div className="text-center p-6">
            <div className="bg-purple-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-trophy text-purple-500 text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">Accurate Rankings</h3>
            <p className="text-muted-foreground">Real-time rankings across overall, shift, and category-wise comparisons.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted mt-20">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-primary p-2 rounded-lg">
                  <i className="fas fa-graduation-cap text-primary-foreground text-xl"></i>
                </div>
                <h3 className="text-lg font-bold text-foreground">SSC Score Checker</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Fast, accurate, and reliable SSC exam result checker with detailed analysis and rankings.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Check Score</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Results</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <i className="fab fa-facebook text-xl"></i>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <i className="fab fa-instagram text-xl"></i>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <i className="fab fa-linkedin text-xl"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 SSC Score Checker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
