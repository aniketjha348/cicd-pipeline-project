import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import { useToast } from '@/hooks/use-toast';
import { Building2, User, Mail, Phone, MapPin, Shield, Save, Sparkles } from 'lucide-react';
import { toast } from '../shared/Toast';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useNewCollegeMutation } from '@/services/admin';

const collegeSchema = z.object({
  name: z.string().min(2, 'College name must be at least 2 characters'),
  code: z.string().min(2, 'College code must be at least 2 characters').max(10, 'College code must be less than 10 characters'),
  // university: z.string().min(1, 'University selection is required'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  principalName: z.string().min(2, 'Principal name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
 isAutonomous: z.coerce.boolean().default(false),

});

type CollegeFormData = z.infer<typeof collegeSchema>;
const CollegeForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addCollege,{isLoading}]=useNewCollegeMutation();
  const form = useForm<CollegeFormData>({
    resolver: zodResolver(collegeSchema),
    defaultValues: {
      name: '',
      code: '',
      // university: '',
      address: '',
      principalName: '',
      email: '',
      phone: '',
      isAutonomous: false,
    },
  });

  const onSubmit = async (data: CollegeFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await addCollege(data).unwrap().then(res=>{
        console.log(res);
           toast({
        title: "Success!",
        description: `College "${data.name}" has been created successfully.`,
      });
      }).catch(err=>{
        console.log(err);
           toast({
        title: "Error!",
        description: err?.data?.message,
        toastType:"error"
      });
      })
      console.log('College Data:', data);
      
   
      
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create college. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto shadow-lg animate-scale-in">
      <CardHeader className="text-center border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:bg-none">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-yellow-500" />
          College Registration Form
          <Sparkles className="h-6 w-6 text-yellow-500" />
        </CardTitle>
        <CardDescription className="text-base">
          Fill in the details below to register a new college in the university system
        </CardDescription>
      </CardHeader>

      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Basic Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="animate-fade-in">
                      <FormLabel className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        College Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Enter college name" {...field} className="transition-all duration-200 focus:scale-105" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem className="animate-fade-in" style={{animationDelay: '0.1s'}}>
                      <FormLabel>College Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter college code (e.g., CSE, ENG)" {...field} className="transition-all duration-200 focus:scale-105" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* <FormField
                control={form.control}
                name="university"
                render={({ field }) => (
                  <FormItem className="animate-fade-in" style={{animationDelay: '0.2s'}}>
                    <FormLabel>University ID</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder="Enter university identifier" {...field} className="transition-all duration-200 focus:scale-105" />
                    </FormControl>
                    <FormDescription>
                      The university this college belongs to
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="animate-fade-in" style={{animationDelay: '0.3s'}}>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Address
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter complete address with city, state, and postal code" 
                        className="min-h-20 transition-all duration-200 focus:scale-105" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contact Information Section */}
            <div className="space-y-6 border-t pt-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Contact Information</h3>
              </div>

              <FormField
                control={form.control}
                name="principalName"
                render={({ field }) => (
                  <FormItem className="animate-fade-in" style={{animationDelay: '0.4s'}}>
                    <FormLabel className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Principal Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter principal's full name" {...field} className="transition-all duration-200 focus:scale-105" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="animate-fade-in" style={{animationDelay: '0.5s'}}>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Contact Email
                      </FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contact@college.edu" {...field} className="transition-all duration-200 focus:scale-105" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="animate-fade-in" style={{animationDelay: '0.6s'}}>
                      <FormLabel className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Contact Phone
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} className="transition-all duration-200 focus:scale-105" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Special Status Section */}
            <div className="space-y-6 border-t pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Special Status</h3>
              </div>

              <FormField
                control={form.control}
                name="isAutonomous"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 animate-fade-in" style={{animationDelay: '0.7s'}}>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="transition-all duration-200 hover:scale-110"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Autonomous College
                      </FormLabel>
                      <FormDescription>
                        Check this if the college has autonomous status and independent governance
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6 animate-fade-in" style={{animationDelay: '0.8s'}}>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full md:w-auto px-8 py-3 text-lg hover-scale transition-all duration-200"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating College...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Create College
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CollegeForm;
