import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Building2, User, Mail, Phone, MapPin, Code, FileText, GraduationCap, Users, CheckCircle2, Loader2, CornerUpLeft } from 'lucide-react';
import { toast } from '../shared/Toast';
import { useLazyGetCollegesQuery, useNewDepartmentMutation } from '@/services/admin';
import { SearchWithInput } from '../shared/SearchWithInput';
import { getRandomColor } from '@/lib/genrateRandomColor';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const departmentSchema = z.object({
  name: z.string().min(1, 'Department name is required').trim(),
  shortName: z.string().min(1, 'Department code is required').max(10, 'Code must be 10 characters or less').toUpperCase(),
  description: z.string().optional(),
  collegeId: z.string().min(1, 'College selection is required'),
  universityId: z.string().optional(),
  headOfDepartment: z.string().optional(),
  contactEmail: z.string().email('Invalid email format').optional().or(z.literal('')),
  contactPhone: z.string().optional(),
  officeRoomNumber: z.string().optional(),
  isActive: z.boolean().default(true),
});

type DepartmentFormData = z.infer<typeof departmentSchema>;

// Mock data for dropdowns
const COLLEGES = [
  { id: 'college_001', name: 'St. Xavier\'s College of Engineering' },
  { id: 'college_002', name: 'Mumbai University Institute of Technology' },
  { id: 'college_003', name: 'Delhi Technical University' },
  { id: 'college_004', name: 'Bangalore Institute of Technology' },
];

const UNIVERSITIES = [
  { id: 'univ_001', name: 'Mumbai University' },
  { id: 'univ_002', name: 'Delhi University' },
  { id: 'univ_003', name: 'Bangalore University' },
  { id: 'univ_004', name: 'Chennai University' },
];

const FACULTY = [
  { id: 'faculty_001', name: 'Dr. Rajesh Kumar', department: 'Computer Science' },
  { id: 'faculty_002', name: 'Prof. Priya Sharma', department: 'Information Technology' },
  { id: 'faculty_003', name: 'Dr. Amit Singh', department: 'Electronics' },
  { id: 'faculty_004', name: 'Prof. Sunita Patel', department: 'Mechanical' },
];

interface NewDepartmentFormProps {
  onSubmit?: (data: DepartmentFormData) => void;
  initialData?: Partial<DepartmentFormData>;
}

const NewDepartmentForm: React.FC<NewDepartmentFormProps> = ({ onSubmit, initialData }) => {
 const [createDepartment, { isLoading: dloding }] = useNewDepartmentMutation();
  const form = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: '',
      shortName: '',
      description: '',
      collegeId: '',
      universityId: '',
      headOfDepartment: '',
      contactEmail: '',
      contactPhone: '',
      officeRoomNumber: '',
      isActive: true,
      ...initialData,
    },
  });
    const [college, { currentData:data, isFetching }] = useLazyGetCollegesQuery({
      refetchOnFocus: true,
      refetchOnReconnect: true
    })
    const [selectedData,setSelectedData]=useState("");

    const {user}=useSelector((state:RootState)=>state.auth)
   const randomColor = useMemo(() => getRandomColor("border"), []);
  const handleSubmit = async(data: DepartmentFormData) => {
    console.log('Department Data:', data);

    
    await createDepartment(data).unwrap().then((res)=>{
      // console.log(res); 
      toast({
      title: "Department Created Successfully!",
      description: res?.message,
      toastType:"success"
    });  
    }).catch(err=>{
      // console.log(err);
      toast({
      title: "Department Creation failed!!",
      description: err?.data?.message,
      toastType:"error"
    });
    })
    // if (onSubmit) {
    //   onSubmit(data);
    // } else {
    //   toast({
    //     title: "Department Created Successfully!",
    //     description: `${data.name} (${data.shortName}) has been created.`,
    //   });
    // }
  };
  const navigate=useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 bg-color relative w-full text-color p-6">

      
      <div className="max-w-4xl mx-auto relative">  <Button onClick={()=>navigate(-1)}  className='bg-gradient-to-r from-indigo-600 to-purple-600 text-gray-50 absolute top-0 right-0 z-[2]' >
          <CornerUpLeft />
  Back to Department
        </Button>
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-full">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 text-color mb-2">Create New Department</h1>
          <p className="text-color-thin">Set up a new department with all necessary information</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm animate-scale-in dark:bg-slate-800">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center space-x-2 text-xl">
              <GraduationCap className="w-6 h-6" />
              <span>Department Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                {/* Basic Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-semibold ">Basic Information</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center space-x-2">
                            <Building2 className="w-4 h-4" />
                            <span>Department Name</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Computer Science"
                              {...field}
                              className="focus:ring-indigo-500 focus:border-indigo-500 border dark:border-slate-200 placeholder:text-color-thin"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="shortName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center space-x-2">
                            <Code className="w-4 h-4" />
                            <span>Department Code</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., CS"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                              className="focus:ring-indigo-500 focus:border-indigo-500 dark:border-slate-200 placeholder:text-color-thin"
                            />
                          </FormControl>
                          <FormDescription>
                            Unique identifier for the department (will be converted to uppercase)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief description of the department..."
                            className="resize-none focus:ring-indigo-500 focus:border-indigo-500 dark:border-slate-200 placeholder:text-color-thin"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Institutional Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                    <GraduationCap className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-semibold ">Institutional Information</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="universityId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>University</FormLabel>
                      <FormControl>
                                 <Input 
                                 value={user?.institution?.name} 
                                 disabled={true}
                                 className='border  dark:border-slate-200 placeholder:text-color-thin' />
                      </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="collegeId"
                      render={({ field }) => (
                        <FormItem>
                        
    

                          <SearchWithInput randomColor={randomColor} inputPlaceholder='Search Colleges...'
                          inputClass="rounded"
                                                      onChange={async(search)=>  college({ search,searchType:"loose" }).unwrap()}
                                                      onSelect={(res)=>{console.log(res,"res");
                                                      ;setSelectedData(res);field.onChange(res?._id)}}
                                                      
                                                      data={data?.colleges}
                                  />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                    <Mail className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-semibold ">Contact Information</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center space-x-2">
                            <Mail className="w-4 h-4" />
                            <span>Contact Email</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="department@college.edu"
                              {...field}
                              className="focus:ring-indigo-500 focus:border-indigo-500 border  dark:border-slate-200 placeholder:text-color-thin"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center space-x-2">
                            <Phone className="w-4 h-4" />
                            <span>Contact Phone</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="+1 (555) 123-4567"
                              {...field}
                              className="focus:ring-indigo-500 focus:border-indigo-500 border  dark:border-slate-200 placeholder:text-color-thin"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="headOfDepartment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>Head of Department</span>
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="focus:ring-indigo-500 focus:border-indigo-500 border  dark:border-slate-200 placeholder:text-color-thin">
                                <SelectValue placeholder="Select faculty member" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {FACULTY.map((faculty) => (
                                <SelectItem key={faculty.id} value={faculty.id}>
                                  <div className="flex flex-col">
                                    <span>{faculty.name}</span>
                                    <span className="text-xs text-gray-500">{faculty.department}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="officeRoomNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>Office Room Number</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Room 201, Building A"
                              {...field}
                              className="focus:ring-indigo-500 focus:border-indigo-500 border  dark:border-slate-200 placeholder:text-color-thin"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Status Section */}
                <div className="space-y-6">
                  <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-semibold ">Status</h3>
                  </div>

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 space-y-0 border  dark:border-slate-200 placeholder:text-color-thin">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base font-medium">Active Status</FormLabel>
                          <FormDescription>
                            Enable this department for course creation and student enrollment
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className='dark:bg-slate-200'
                          
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Form Preview */}
                {form.watch('name') && form.watch('shortName') && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200 animate-fade-in">
                    <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      Department Preview
                    </h4>
                    <div className="flex items-center space-x-3">
                      <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1">
                        {form.watch('shortName')}
                      </Badge>
                      <span className="font-medium text-green-900">{form.watch('name')}</span>
                      {form.watch('isActive') && (
                        <Badge className="bg-green-600 text-white">Active</Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end pt-6">
                { !isFetching? <Button
                    type="submit"
                    size="lg"
                    className="px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium transition-all duration-200 hover:scale-105"
                  >
                    Create Department
                  </Button>:<Button
                    type="button"
                    size="lg"
                    className="px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium transition-all duration-200 hover:scale-105"
                  >
                   <Loader2 className='animate-spin duration-1000'/> kindly Wait...
                  </Button>}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewDepartmentForm;
