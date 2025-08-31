import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GraduationCap } from "lucide-react";

interface CandidateDetailsTableProps {
  candidate: {
    examName: string;
    candidateName: string;
    rollNumber: string;
    examDate: string;
    examTime: string;
    venueName: string;
  };
}

export default function CandidateDetailsTable({ candidate }: CandidateDetailsTableProps) {
  return (
    <Card className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
      <CardHeader className="bg-primary text-primary-foreground px-6 py-4">
        <CardTitle className="text-xl font-semibold flex items-center">
          <GraduationCap className="mr-3" />
          Candidate Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Subject/Exam Name
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Candidate Name
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Roll Number
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Exam Date
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Exam Time
                </TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Venue Name
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-sm text-foreground" data-testid="text-exam-name">
                  {candidate.examName}
                </TableCell>
                <TableCell className="text-sm text-foreground" data-testid="text-candidate-name">
                  {candidate.candidateName}
                </TableCell>
                <TableCell className="text-sm text-foreground" data-testid="text-roll-number">
                  {candidate.rollNumber}
                </TableCell>
                <TableCell className="text-sm text-foreground" data-testid="text-exam-date">
                  {candidate.examDate}
                </TableCell>
                <TableCell className="text-sm text-foreground" data-testid="text-exam-time">
                  {candidate.examTime}
                </TableCell>
                <TableCell className="text-sm text-foreground" data-testid="text-venue-name">
                  {candidate.venueName}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
