import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { IdCard } from '@/types/IdCard';
import { toast } from '../shared/Toast';
import ImageUploader from '../shared/ImageUploader';
// import { useToast } from '@/hooks/use-toast';

const userFormSchema = z.object({
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

type UserFormData = z.infer<typeof userFormSchema>;

interface MultipleUsersFormProps {
  onSubmit: (cardsData: IdCard[]) => void;
}

const MultipleUsersForm = ({ onSubmit }: MultipleUsersFormProps) => {
  const [jsonData, setJsonData] = useState('');
  const [userForms, setUserForms] = useState<UserFormData[]>([]);
  // const { toast } = useToast();

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      admissionId: '',
      name: '',
      course: '',
      department: '',
      batchYear: '',
      dateOfBirth: '',
      emergencyContact: '',
      fatherName: '',
      address: '',
      photo: '',
    },
  });

  const addUserForm = () => {
    setUserForms(prev => [...prev, {
      admissionId: '',
      name: '',
      course: '',
      department: '',
      batchYear: '',
      dateOfBirth: '',
      emergencyContact: '',
      fatherName: '',
      address: '',
      photo: '',
    }]);
  };

  const removeUserForm = (index: number) => {
    setUserForms(prev => prev.filter((_, i) => i !== index));
  };

  const updateUserForm = (index: number, field: keyof UserFormData, value: string) => {
    setUserForms(prev => prev.map((form, i) => 
      i === index ? { ...form, [field]: value } : form
    ));
  };

  const validateUserForm = (formData: UserFormData): boolean => {
    try {
      userFormSchema.parse(formData);
      return true;
    } catch {
      return false;
    }
  };

  const handleJsonSubmit = () => {
    if (!jsonData.trim()) {
      toast({
        title: "Error",
        description: "Please enter JSON data",
        variant: "destructive",
      });
      return;
    }

    try {
      const parsedData = JSON.parse(jsonData);
      const cardsData = Array.isArray(parsedData) ? parsedData : [parsedData];
      
      // Validate each card
      const validatedCards = cardsData.map(card => userFormSchema.parse(card));
      
      const cardsWithBarcodes = validatedCards.map((card: IdCard) => ({
        ...card,
        barcode: card.admissionId,
      }));
      
      onSubmit(cardsWithBarcodes);
    } catch (error) {
      toast({
        title: "Validation Error",
        description: error instanceof z.ZodError 
          ? `Validation failed: ${error.errors[0].message}`
          : "Invalid JSON format. Please check your data.",
        variant: "destructive",
      });
    }
  };

  const handleManualSubmit = () => {
    if (userForms.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one user form.",
        variant: "destructive",
      });
      return;
    }

    const validForms = userForms.filter(validateUserForm);
    
    if (validForms.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields correctly in at least one form.",
        variant: "destructive",
      });
      return;
    }

    if (validForms.length !== userForms.length) {
      toast({
        title: "Warning",
        description: `${userForms.length - validForms.length} forms were skipped due to validation errors.`,
      });
    }

    const cardsWithBarcodes = validForms.map(card => ({
      ...card,
      barcode: card.admissionId,
    }));
    onSubmit(cardsWithBarcodes);
  };

  const sampleJson = `[
  {
    "admissionId": "21223306",
    "name": "Manish Maurya",
    "course": "BCA",
    "department": "SOCSA",
    "batchYear": "2022-2025/3rd",
    "dateOfBirth": "24.11.2002",
    "emergencyContact": "9026123956",
    "fatherName": "Father's Name",
    "address": "Jasol, Muzaffarnagar"
  }
]`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>JSON Data Input</CardTitle>
          <CardDescription>
            Paste JSON data for multiple users (faster for bulk generation)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="jsonData">JSON Data</Label>
            <Textarea
              id="jsonData"
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              placeholder={sampleJson}
              className="min-h-[200px] font-mono text-sm"
            />
          </div>
          <Button onClick={handleJsonSubmit} className="w-full">
            Generate from JSON
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manual Data Entry</CardTitle>
          <CardDescription>
            Fill forms manually for multiple users
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {userForms.map((formData, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">User {index + 1}</h4>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeUserForm(index)}
                >
                  Remove
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Admission ID *</Label>
                  <Input
                    value={formData.admissionId}
                    onChange={(e) => updateUserForm(index, 'admissionId', e.target.value)}
                    placeholder="21223306"
                    className={!formData.admissionId ? 'border-red-300' : ''}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Full Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => updateUserForm(index, 'name', e.target.value)}
                    placeholder="Manish Maurya"
                    className={formData.name.length < 2 ? 'border-red-300' : ''}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Course *</Label>
                  <Input
                    value={formData.course}
                    onChange={(e) => updateUserForm(index, 'course', e.target.value)}
                    placeholder="BCA"
                    className={!formData.course ? 'border-red-300' : ''}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Department *</Label>
                  <Input
                    value={formData.department}
                    onChange={(e) => updateUserForm(index, 'department', e.target.value)}
                    placeholder="SOCSA"
                    className={!formData.department ? 'border-red-300' : ''}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Batch Year *</Label>
                  <Input
                    value={formData.batchYear}
                    onChange={(e) => updateUserForm(index, 'batchYear', e.target.value)}
                    placeholder="2022-2025/3rd"
                    className={!formData.batchYear ? 'border-red-300' : ''}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Date of Birth *</Label>
                  <Input
                    value={formData.dateOfBirth}
                    onChange={(e) => updateUserForm(index, 'dateOfBirth', e.target.value)}
                    placeholder="24.11.2002"
                    className={!formData.dateOfBirth ? 'border-red-300' : ''}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Emergency Contact *</Label>
                  <Input
                    value={formData.emergencyContact}
                    onChange={(e) => updateUserForm(index, 'emergencyContact', e.target.value)}
                    placeholder="9026123956"
                    className={formData.emergencyContact.length < 10 ? 'border-red-300' : ''}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Father's Name *</Label>
                  <Input
                    value={formData.fatherName}
                    onChange={(e) => updateUserForm(index, 'fatherName', e.target.value)}
                    placeholder="Father's Name"
                    className={formData.fatherName.length < 2 ? 'border-red-300' : ''}
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Address *</Label>
                <Textarea
                  value={formData.address}
                  onChange={(e) => updateUserForm(index, 'address', e.target.value)}
                  placeholder="Jasol, Muzaffarnagar"
                  className={formData.address.length < 5 ? 'border-red-300' : ''}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Photo URL (Optional)</Label>
                <ImageUploader onUpload={(result)=>updateUserForm(index,"photo",result)}/>
                {/* <Input
                  type="url"
                  value={formData.photo}
                  onChange={(e) => updateUserForm(index, 'photo', e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                /> */}
              </div>
            </div>
          ))}
          
          <div className="flex gap-2">
            <Button onClick={addUserForm} variant="outline" className="flex-1">
              Add Another User
            </Button>
            <Button onClick={handleManualSubmit} className="flex-1">
              Generate ID Cards
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultipleUsersForm;
