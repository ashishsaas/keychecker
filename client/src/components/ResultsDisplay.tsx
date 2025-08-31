import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CandidateDetailsTable from "./CandidateDetailsTable";
import ScoreCards from "./ScoreCards";
import SubjectScoreTable from "./SubjectScoreTable";

interface ResultsDisplayProps {
  data: {
    candidate: any;
    result: any;
    subjectScores: any[];
  };
}

export default function ResultsDisplay({ data }: ResultsDisplayProps) {
  const { toast } = useToast();
  const { candidate, result, subjectScores } = data;

  const handleDownload = () => {
    // Generate downloadable report
    const reportData = {
      candidate,
      result,
      subjectScores,
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SSC_Results_${candidate.rollNumber}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Started",
      description: "Your results have been downloaded successfully.",
    });
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl).then(() => {
      toast({
        title: "Link Copied",
        description: "Results link copied to clipboard!",
      });
    }).catch(() => {
      toast({
        title: "Share Failed",
        description: "Could not copy link. Please copy the URL manually.",
        variant: "destructive",
      });
    });
  };

  return (
    <div className="space-y-8">
      {/* Candidate Details Table */}
      <CandidateDetailsTable candidate={candidate} />

      {/* Score and Rank Cards */}
      <ScoreCards result={result} candidate={candidate} />

      {/* Subject-wise Score Table */}
      <SubjectScoreTable 
        subjectScores={subjectScores} 
        totalResult={result}
      />

      {/* Download Section */}
      <div className="flex justify-center space-x-4">
        <Button 
          onClick={handleDownload}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
          data-testid="button-download-results"
        >
          <Download className="mr-3 h-4 w-4" />
          Download Results
        </Button>
        <Button 
          onClick={handleShare}
          variant="secondary"
          className="font-semibold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
          data-testid="button-share-results"
        >
          <Share2 className="mr-3 h-4 w-4" />
          Share Results
        </Button>
      </div>
    </div>
  );
}
