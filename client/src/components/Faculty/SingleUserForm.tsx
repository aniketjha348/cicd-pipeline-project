import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { IdCard } from '@/types/IdCard';
import ImageUploader from '../shared/ImageUploader';

const formSchema = z.object({
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

type FormData = z.infer<typeof formSchema>;

interface SingleUserFormProps {
  onSubmit: (cardData: IdCard) => void;
}

const SingleUserForm = ({ onSubmit }: SingleUserFormProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
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

  const handleSubmit = (data: FormData) => {
    const cardWithBarcode: IdCard = {
      admissionId: data.admissionId,
      name: data.name,
      course: data.course,
      department: data.department,
      batchYear: data.batchYear,
      dateOfBirth: data.dateOfBirth,
      emergencyContact: data.emergencyContact,
      fatherName: data.fatherName,
      address: data.address,
      photo: data.photo || '',
      barcode: data.admissionId,
    };
    onSubmit(cardWithBarcode);
  };

  return (
    <Card className='bg-transparent'>
      <CardHeader>
        <CardTitle>Single ID Card Generation</CardTitle>
        <CardDescription>Enter details for one student ID card</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="admissionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admission ID</FormLabel>
                    <FormControl>
                      <Input placeholder="21223306" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Manish Maurya" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="course"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course/Stream</FormLabel>
                    <FormControl>
                      <Input placeholder="BCA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input placeholder="SOCSA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="batchYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batch Year</FormLabel>
                    <FormControl>
                      <Input placeholder="2022-2025/3rd" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input placeholder="24.11.2002" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emergencyContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Contact</FormLabel>
                    <FormControl>
                      <Input placeholder="9026123956" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fatherName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Father's Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Father's Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Jasol, Muzaffarnagar" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photo URL (Optional)</FormLabel>
                  <FormControl>
                    {/* <Input type="url" placeholder="https://example.com/photo.jpg" {...field} /> */}

                      <ImageUploader onUpload={(result)=>field.onChange(result)}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          
            <Button type="submit" className="w-full">
              Generate ID Card
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SingleUserForm;
