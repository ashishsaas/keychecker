import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { candidateFormSchema, CandidateForm } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Upload, Calculator } from "lucide-react";
import { useState } from "react";

interface ScoreFormProps {
  onSubmit: (data: CandidateForm & { file?: File }) => void;
  isLoading: boolean;
}

const states = [
  { value: "ANDHRA_PRADESH", label: "Andhra Pradesh" },
  { value: "ARUNACHAL_PRADESH", label: "Arunachal Pradesh" },
  { value: "ASSAM", label: "Assam" },
  { value: "BIHAR", label: "Bihar" },
  { value: "CHHATTISGARH", label: "Chhattisgarh" },
  { value: "DELHI", label: "Delhi" },
  { value: "GOA", label: "Goa" },
  { value: "GUJARAT", label: "Gujarat" },
  { value: "HARYANA", label: "Haryana" },
  { value: "HIMACHAL_PRADESH", label: "Himachal Pradesh" },
  { value: "JAMMU_KASHMIR", label: "Jammu & Kashmir" },
  { value: "JHARKHAND", label: "Jharkhand" },
  { value: "KARNATAKA", label: "Karnataka" },
  { value: "KERALA", label: "Kerala" },
  { value: "MADHYA_PRADESH", label: "Madhya Pradesh" },
  { value: "MAHARASHTRA", label: "Maharashtra" },
  { value: "MANIPUR", label: "Manipur" },
  { value: "MEGHALAYA", label: "Meghalaya" },
  { value: "MIZORAM", label: "Mizoram" },
  { value: "NAGALAND", label: "Nagaland" },
  { value: "ODISHA", label: "Odisha" },
  { value: "PUNJAB", label: "Punjab" },
  { value: "RAJASTHAN", label: "Rajasthan" },
  { value: "SIKKIM", label: "Sikkim" },
  { value: "TAMIL_NADU", label: "Tamil Nadu" },
  { value: "TELANGANA", label: "Telangana" },
  { value: "TRIPURA", label: "Tripura" },
  { value: "UTTAR_PRADESH", label: "Uttar Pradesh" },
  { value: "UTTARAKHAND", label: "Uttarakhand" },
  { value: "WEST_BENGAL", label: "West Bengal" },
];

const languages = [
  { value: "ENGLISH", label: "English" },
  { value: "HINDI", label: "Hindi" },
  { value: "BENGALI", label: "Bengali" },
  { value: "GUJARATI", label: "Gujarati" },
  { value: "KANNADA", label: "Kannada" },
  { value: "MALAYALAM", label: "Malayalam" },
  { value: "MARATHI", label: "Marathi" },
  { value: "ODIA", label: "Odia" },
  { value: "PUNJABI", label: "Punjabi" },
  { value: "TAMIL", label: "Tamil" },
  { value: "TELUGU", label: "Telugu" },
  { value: "URDU", label: "Urdu" },
];

export default function ScoreForm({ onSubmit, isLoading }: ScoreFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<CandidateForm>({
    resolver: zodResolver(candidateFormSchema),
    defaultValues: {
      answerKeyUrl: "",
      category: "",
      subCategory: "",
      gender: "",
      state: "",
      language: "",
    },
  });

  const handleSubmit = (data: CandidateForm) => {
    onSubmit({ ...data, file: selectedFile || undefined });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      form.setValue("answerKeyUrl", "");
    }
  };

  return (
    <Card className="bg-card rounded-xl shadow-xl border border-border">
      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            
            {/* Answer Key Upload Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-foreground flex items-center">
                <Upload className="text-primary mr-3" />
                Answer Key Information
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* URL Input */}
                <FormField
                  control={form.control}
                  name="answerKeyUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Answer Key URL <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          type="url"
                          placeholder="https://ssc.digialm.com/per/g27/pub... or type 'demo' to test"
                          disabled={!!selectedFile}
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">
                        Paste your SSC answer key link here, or type 'demo' to test with sample data
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* File Upload */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Or Upload PDF File
                  </label>
                  <div className="border-2 border-dashed border-input rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                    <Upload className="mx-auto text-3xl text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {selectedFile ? selectedFile.name : "Drop your PDF here or click to browse"}
                    </p>
                    <input 
                      type="file" 
                      accept=".pdf" 
                      onChange={handleFileChange}
                      className="hidden" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Details Section */}
            {/* (unchanged, same as before) */}

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 px-12 rounded-lg text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Calculator className="mr-3" />
                    CHECK YOUR SCORE
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
