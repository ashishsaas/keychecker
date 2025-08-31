import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3 } from "lucide-react";

interface SubjectScoreTableProps {
  subjectScores: Array<{
    subjectName: string;
    attempted: number;
    notAttempted: number;
    correct: number;
    wrong: number;
    totalMarks: string;
  }>;
  totalResult: {
    totalAttempted: number;
    totalNotAttempted: number;
    totalCorrect: number;
    totalWrong: number;
    overallScore: string;
  };
}

export default function SubjectScoreTable({ subjectScores, totalResult }: SubjectScoreTableProps) {
  return (
    <Card className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
      <CardHeader className="bg-primary text-primary-foreground px-6 py-4">
        <CardTitle className="text-xl font-semibold flex items-center">
          <BarChart3 className="mr-3" />
          Subject-wise Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Subject
                </TableHead>
                <TableHead className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Attempted
                </TableHead>
                <TableHead className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Not Attempted
                </TableHead>
                <TableHead className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Right
                </TableHead>
                <TableHead className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Wrong
                </TableHead>
                <TableHead className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total Marks
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjectScores.map((subject, index) => (
                <TableRow 
                  key={subject.subjectName}
                  className={index % 2 === 1 ? "bg-muted/20" : ""}
                  data-testid={`row-subject-${index}`}
                >
                  <TableCell className="font-medium text-foreground" data-testid={`text-subject-name-${index}`}>
                    {subject.subjectName}
                  </TableCell>
                  <TableCell className="text-center text-foreground" data-testid={`text-attempted-${index}`}>
                    {subject.attempted}
                  </TableCell>
                  <TableCell className="text-center text-foreground" data-testid={`text-not-attempted-${index}`}>
                    {subject.notAttempted}
                  </TableCell>
                  <TableCell className="text-center text-green-600" data-testid={`text-correct-${index}`}>
                    {subject.correct}
                  </TableCell>
                  <TableCell className="text-center text-red-600" data-testid={`text-wrong-${index}`}>
                    {subject.wrong}
                  </TableCell>
                  <TableCell className="text-center font-semibold text-foreground" data-testid={`text-total-marks-${index}`}>
                    {parseFloat(subject.totalMarks).toFixed(1)}
                  </TableCell>
                </TableRow>
              ))}
              
              {/* Total Row */}
              <TableRow className="bg-primary/10 font-semibold border-t-2 border-primary">
                <TableCell className="font-bold text-foreground" data-testid="text-total-label">
                  TOTAL
                </TableCell>
                <TableCell className="text-center font-bold text-foreground" data-testid="text-total-attempted">
                  {totalResult.totalAttempted}
                </TableCell>
                <TableCell className="text-center font-bold text-foreground" data-testid="text-total-not-attempted">
                  {totalResult.totalNotAttempted}
                </TableCell>
                <TableCell className="text-center font-bold text-green-600" data-testid="text-total-correct">
                  {totalResult.totalCorrect}
                </TableCell>
                <TableCell className="text-center font-bold text-red-600" data-testid="text-total-wrong">
                  {totalResult.totalWrong}
                </TableCell>
                <TableCell className="text-center font-bold text-primary text-lg" data-testid="text-total-score">
                  {parseFloat(totalResult.overallScore).toFixed(1)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
