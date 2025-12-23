import { useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { IdCard } from '@/types/IdCard';
// import { useToast } from '@/hooks/use-toast';
import { Loader2, FileText, Table, Upload, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '../shared/Toast';

const cardSchema = z.object({
  admissionId: z.string().min(1, 'Admission ID is required'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  course: z.string().min(1, 'Course is required'),
  department: z.string().min(1, 'Department is required'),
  batchYear: z.string().min(1, 'Batch year is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  emergencyContact: z.string().min(10, 'Emergency contact must be at least 10 digits'),
  fatherName: z.string().min(2, 'Father\'s name must be at least 2 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  photo: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

interface FileImportFormProps {
  onImport: (cardsData: IdCard[]) => void;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
  value: any;
}

const FileImportForm = ({ onImport }: FileImportFormProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [showErrors, setShowErrors] = useState(false);
  // const { toast } = useToast();

  const validateCardData = (data: any[]): { valid: IdCard[], errors: ValidationError[] } => {
    const valid: IdCard[] = [];
    const errors: ValidationError[] = [];

    data.forEach((item, index) => {
      try {
        // Check if item is null or undefined
        if (!item || typeof item !== 'object') {
          errors.push({
            row: index + 1,
            field: 'general',
            message: 'Invalid data format - row is empty or not an object',
            value: item
          });
          return;
        }

        const validatedData = cardSchema.parse(item);
        const validatedCard: IdCard = {
          admissionId: validatedData.admissionId,
          name: validatedData.name,
          course: validatedData.course,
          department: validatedData.department,
          batchYear: validatedData.batchYear,
          dateOfBirth: validatedData.dateOfBirth,
          emergencyContact: validatedData.emergencyContact,
          fatherName: validatedData.fatherName,
          address: validatedData.address,
          photo: validatedData.photo || '',
          barcode: validatedData.admissionId,
        };
        valid.push(validatedCard);
      } catch (error) {
        if (error instanceof z.ZodError) {
          error.errors.forEach(zodError => {
            errors.push({
              row: index + 1,
              field: zodError.path.join('.'),
              message: zodError.message,
              value: zodError.path.reduce((obj, key) => obj?.[key], item)
            });
          });
        } else {
          errors.push({
            row: index + 1,
            field: 'general',
            message: 'Invalid data format',
            value: item
          });
        }
      }
    });

    return { valid, errors };
  };

  const parseCSV = (csvText: string): any[] => {
    try {
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) {
        throw new Error('CSV file must contain at least a header row and one data row');
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      
      if (headers.length === 0) {
        throw new Error('CSV file has no headers');
      }

      return lines.slice(1).map((line, index) => {
        if (!line.trim()) {
          throw new Error(`CSV row ${index + 2} is empty`);
        }

        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const card: any = {};
        
        headers.forEach((header, headerIndex) => {
          card[header] = values[headerIndex] || '';
        });
        
        return card;
      });
    } catch (error) {
      throw new Error(`CSV parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const parseExcel = async (file: File): Promise<any[]> => {
    setLoadingMessage('Reading Excel file...');
    setLoadingProgress(25);
    
    try {
      const XLSX = await import('xlsx');
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            setLoadingMessage('Processing Excel data...');
            setLoadingProgress(50);
            
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            
            if (workbook.SheetNames.length === 0) {
              throw new Error('Excel file contains no worksheets');
            }
            
            // Get the first worksheet
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            
            setLoadingMessage('Converting to JSON...');
            setLoadingProgress(75);
            
            // Convert to JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            if (jsonData.length < 2) {
              throw new Error('Excel file must contain at least a header row and one data row');
            }
            
            // Convert array of arrays to array of objects
            const headers = jsonData[0] as string[];
            const rows = jsonData.slice(1) as any[][];
            
            if (headers.length === 0) {
              throw new Error('Excel file has no headers');
            }
            
            const result = rows.map((row, index) => {
              const obj: any = {};
              headers.forEach((header, headerIndex) => {
                const value = row[headerIndex];
                // Convert all values to strings, handling numbers, dates, and other types
                if (value !== null && value !== undefined) {
                  obj[header] = String(value);
                } else {
                  obj[header] = '';
                }
              });
              return obj;
            }).filter(row => Object.values(row).some(value => value !== ''));
            
            if (result.length === 0) {
              throw new Error('Excel file contains no valid data rows');
            }
            
            setLoadingProgress(100);
            resolve(result);
          } catch (error) {
            reject(new Error(`Excel processing error: ${error instanceof Error ? error.message : 'Unknown error'}`));
          }
        };
        
        reader.onerror = () => reject(new Error('Failed to read Excel file - file may be corrupted'));
        reader.readAsArrayBuffer(file);
      });
    } catch (error) {
      throw new Error(`Excel import error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) {
      toast({
        title: "Error",
        description: "No file selected",
        variant: "destructive",
      });
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Size Error",
        description: "File size must be less than 5MB. Current file size: " + (file.size / (1024 * 1024)).toFixed(2) + "MB",
        variant: "destructive",
      });
      return;
    }

    // Validate file extension
    const allowedExtensions = ['.json', '.csv', '.xlsx', '.xls'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      toast({
        title: "Invalid File Type",
        description: `Please upload a JSON, CSV, or Excel file. Current file type: ${fileExtension}`,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setLoadingProgress(0);
    setLoadingMessage('Starting file processing...');
    setValidationErrors([]);
    setShowErrors(false);

    try {
      let cardsData: any[] = [];
      
      if (file.name.endsWith('.json')) {
        setLoadingMessage('Reading JSON file...');
        setLoadingProgress(25);
        
        const text = await file.text();
        if (!text.trim()) {
          throw new Error('JSON file is empty');
        }
        
        setLoadingMessage('Parsing JSON data...');
        setLoadingProgress(50);
        
        try {
          const jsonData = JSON.parse(text);
          cardsData = Array.isArray(jsonData) ? jsonData : [jsonData];
        } catch (parseError) {
          throw new Error('Invalid JSON format - please check your file syntax');
        }
        
        setLoadingProgress(75);
      } else if (file.name.endsWith('.csv')) {
        setLoadingMessage('Reading CSV file...');
        setLoadingProgress(25);
        
        const text = await file.text();
        if (!text.trim()) {
          throw new Error('CSV file is empty');
        }
        
        setLoadingMessage('Parsing CSV data...');
        setLoadingProgress(50);
        
        cardsData = parseCSV(text);
        
        setLoadingProgress(75);
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        cardsData = await parseExcel(file);
      }

      if (cardsData.length === 0) {
        throw new Error('File contains no data rows');
      }

      setLoadingMessage('Validating data...');
      setLoadingProgress(90);

      const { valid, errors } = validateCardData(cardsData);
      setValidationErrors(errors);

      if (errors.length > 0) {
        setShowErrors(true);
        toast({
          title: "Validation Errors Found",
          description: `${errors.length} validation error(s) found. ${valid.length > 0 ? `${valid.length} valid record(s) will be imported.` : 'No valid records found.'}`,
          variant: "destructive",
        });
        
        if (valid.length === 0) {
          setIsLoading(false);
          return;
        }
      }

      if (valid.length > 0) {
        setLoadingMessage('Import completed!');
        setLoadingProgress(100);
        
        toast({
          title: "Import Successful",
          description: `Successfully imported ${valid.length} ID card(s)${errors.length > 0 ? ` (${errors.length} record(s) skipped due to errors)` : ''}`,
        });
        
        // Small delay to show completion
        setTimeout(() => {
          onImport(valid);
          setIsLoading(false);
        }, 500);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred while processing file";
      toast({
        title: "Import Failed",
        description: errorMessage,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>File Import</CardTitle>
        <CardDescription>
          Upload JSON, CSV, or Excel files to generate multiple ID cards
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="space-y-4 py-8">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-lg font-medium">Processing File...</span>
            </div>
            <div className="space-y-2">
              <Progress value={loadingProgress} className="w-full" />
              <p className="text-sm text-muted-foreground text-center">{loadingMessage}</p>
            </div>
          </div>
        ) : (
          <>
            {/* Show validation errors if any */}
            {showErrors && validationErrors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">Found {validationErrors.length} validation error(s):</p>
                    <div className="max-h-48 overflow-y-auto space-y-1">
                      {validationErrors.slice(0, 10).map((error, index) => (
                        <div key={index} className="text-sm bg-red-50 p-2 rounded border-l-2 border-red-200">
                          <span className="font-medium">Row {error.row}:</span> 
                          <span className="ml-1">{error.field !== 'general' ? `${error.field} - ` : ''}{error.message}</span>
                          {error.value && (
                            <div className="text-xs text-red-600 mt-1">
                              Current value: "{String(error.value)}"
                            </div>
                          )}
                        </div>
                      ))}
                      {validationErrors.length > 10 && (
                        <p className="text-sm text-muted-foreground">
                          ... and {validationErrors.length - 10} more errors
                        </p>
                      )}
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="space-y-4">
                <div className="text-4xl text-gray-400">
                  <Upload className="h-12 w-12 mx-auto" />
                </div>
                <div>
                  <p className="text-lg font-medium">Drop files here or click to upload</p>
                  <p className="text-sm text-gray-500">Supports JSON, CSV, and Excel files (max 5MB)</p>
                </div>
                     <Input
  type="file"
  accept=".json,.csv,.xls,.xlsx"
  onChange={handleFileSelect}
  className="hidden"
  id="file-upload" // Make sure this ID is unique in your application
/>

{/* Style the label directly to look like a button */}
<label
  htmlFor="file-upload"
  className="max-w-40 mt-2 bg-slate-200 px-2 py-1 rounded-md dark:text-slate-900 cursor-pointer z-50 relative inline-block text-center"
  // Added 'inline-block' to allow padding/width to apply properly.
  // Added 'text-center' to center the "Choose Files" text within the label.
>
  Choose Files
</label>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Supported Formats:</h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span><strong>JSON:</strong> Array of objects with ID card data</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span><strong>CSV:</strong> Comma-separated values with headers</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Table className="h-4 w-4" />
                    <span><strong>Excel:</strong> .xlsx or .xls files with headers in first row</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Required Fields:</h4>
                <div className="text-sm text-gray-600 grid grid-cols-2 gap-1">
                  <p>• admissionId</p>
                  <p>• name (min 2 chars)</p>
                  <p>• course</p>
                  <p>• department</p>
                  <p>• batchYear</p>
                  <p>• dateOfBirth</p>
                  <p>• emergencyContact (min 10 chars)</p>
                  <p>• fatherName (min 2 chars)</p>
                  <p>• address (min 5 chars)</p>
                  <p>• photo (optional, must be valid URL)</p>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default FileImportForm;