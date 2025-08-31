import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { scoreApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ResultsDisplay from "@/components/ResultsDisplay";
import { Skeleton } from "@/components/ui/skeleton";

export default function Results() {
  const { candidateId } = useParams();
  const [, setLocation] = useLocation();

  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/results', candidateId],
    queryFn: () => scoreApi.getResults(candidateId!),
    enabled: !!candidateId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <Skeleton className="h-10 w-32 mb-8" />
          <Skeleton className="h-16 w-full mb-8" />
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Error Loading Results</h1>
          <p className="text-muted-foreground mb-6">
            {data?.error || "Failed to load your exam results. Please try again."}
          </p>
          <Button onClick={() => setLocation('/')} data-testid="button-back-home">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/')}
            className="flex items-center space-x-2 text-primary hover:text-primary/80"
            data-testid="button-back-form"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Form</span>
          </Button>
        </div>

        {/* Results Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Your Exam Results</h1>
          <p className="text-lg text-muted-foreground">Detailed performance analysis and rankings</p>
        </div>

        {/* Results Display */}
        <ResultsDisplay data={data.data!} />
      </div>
    </div>
  );
}
