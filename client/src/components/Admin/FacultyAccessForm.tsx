import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Trash2, Plus, User, Mail, Lock, School, Search } from 'lucide-react';
import { toast } from '../shared/Toast';
import { useAddFacultyMutation, useGetDepartmentsQuery } from '@/services/admin';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { SearchWithInput } from '../shared/SearchWithInput';
// import { useToast } from '@/hooks/use-toast';

const accessSchema = z.object({
  name: z.string().min(1, 'Faculty name is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.literal('faculty'),
  collegeId:z.string().optional(),
  position:z.string().optional(),
  accessScope: z.array(z.object({
    departmentId: z.string().min(1, 'Department is required'),
    courses: z.array(z.object({
      courseId: z.string().min(1, 'Course is required'),
      sections: z.array(z.string()).min(1, 'At least one section is required')
    })).min(1, 'At least one course is required')
  })).min(1, 'At least one department access is required')
});

type AccessFormData = z.infer<typeof accessSchema>;

// Mock data for suggestions
const mockDepartments = [
  { id: '665f90a4d1f1a70012e3cd01', name: 'Computer Science', shortName: 'CSE' },
  { id: '665f90a4d1f1a70012e3cd02', name: 'Electronics & Communication', shortName: 'ECE' },
  { id: '665f90a4d1f1a70012e3cd03', name: 'Mechanical Engineering', shortName: 'ME' }
];

const mockCourses = {
  '665f90a4d1f1a70012e3cd01': [
    { id: '665f90c2d1f1a70012e3cd11', name: 'Bachelor of Computer Applications', shortName: 'BCA' },
    { id: '665f90c2d1f1a70012e3cd14', name: 'B.Tech Computer Science', shortName: 'CSE' }
  ],
  '665f90a4d1f1a70012e3cd02': [
    { id: '665f90c2d1f1a70012e3cd20', name: 'B.Tech Electronics', shortName: 'ECE' }
  ],
  '665f90a4d1f1a70012e3cd03': [
    { id: '665f90c2d1f1a70012e3cd30', name: 'B.Tech Mechanical', shortName: 'ME' }
  ]
};

const availableSections = ['A', 'B', 'C', 'D'];

const FacultyAccessForm = () => {
  // const { toast } = useToast();
  
  
  const form = useForm<AccessFormData>({
    resolver: zodResolver(accessSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'faculty',
      collegeId:"",
      position:"",
      accessScope: [{
        departmentId: '',
        courses: [{
          courseId: '',
          sections: []
        }]
      }]
    }
  });

  const { fields: departmentFields, append: appendDepartment, remove: removeDepartment } = useFieldArray({
    control: form.control,
    name: 'accessScope'
  });
  const [addFaulty,{isLoading}]=useAddFacultyMutation();
  const onSubmit = (data: AccessFormData) => {
    console.log('Faculty Access Data:', JSON.stringify(data, null, 2));
    addFaulty(data).unwrap().then(res=>{
      console.log(res);
       toast({
      title: "Faculty Access Created",
      description: `Access granted to ${data.name} for ${data.accessScope.length} department(s)`,
    });
    }).catch(err=>{
      console.log(err);
      toast({
      title: "Faculty Access Denied!",
      description: err?.data?.message,
      toastType:"error"
    });
    })
    
  };

  return (
    <div className="max-w-10xl flex-1 w-full mx-auto  space-y-6">
      <Card className='dark:bg-slate-900'>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Faculty Access Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Faculty Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Faculty Name
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Prof. John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john.doe@college.edu" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="collegeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                       <SearchWithInput/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

   <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Min 6 characters" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </div>

           <FormField
                                control={form.control}
                                name="position"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Position</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select position" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                                                <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                                                <SelectItem value="Professor">Professor</SelectItem>
                                                <SelectItem value="Lecturer">Lecturer</SelectItem>
                                                <SelectItem value="Instructor">Instructor</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

              {/* Department Access Scope */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-semibold">Department Access</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendDepartment({
                      departmentId: '',
                      courses: [{ courseId: '', sections: [] }]
                    })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Department
                  </Button>
                </div>

                {departmentFields.map((departmentField, departmentIndex) => (
                  <DepartmentAccessCard
                    key={departmentField.id}
                    form={form}
                    departmentIndex={departmentIndex}
                    onRemove={() => removeDepartment(departmentIndex)}
                    canRemove={departmentFields.length > 1}
                  />
                ))}
              </div>

              <div className="flex gap-4 pt-6">
                <Button type="submit" className="flex-1">
                  Grant Faculty Access
                </Button>
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                  Reset Form
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

interface DepartmentAccessCardProps {
  form: any;
  departmentIndex: number;
  onRemove: () => void;
  canRemove: boolean;
}

const DepartmentAccessCard = ({ form, departmentIndex, onRemove, canRemove }: DepartmentAccessCardProps) => {
  const { fields: courseFields, append: appendCourse, remove: removeCourse } = useFieldArray({
    control: form.control,
    name: `accessScope.${departmentIndex}.courses`
  });
  const [showDepartmentSuggestions,setShowDepartmentSuggestions]=useState(false);

  const selectedDepartmentId = form.watch(`accessScope.${departmentIndex}.departmentId`);
  // const availableCourses = mockCourses[selectedDepartmentId] || [];
  const [availableCourses,setAvailableCourses]=useState([])
  const [departmentName,setDepartmentName]=useState<string>("");
  const {data}=useGetDepartmentsQuery({search:""},{
    refetchOnFocus:true,
    refetchOnMountOrArgChange:true
  })

  
  return (
    <Card className="bg-transparent border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Department Access #{departmentIndex + 1}</CardTitle>
          {canRemove && (
            <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name={`accessScope.${departmentIndex}.departmentId`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              {/* <Select  onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {mockDepartments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name} ({dept.shortName})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}
               <div className="space-y-2 relative">
                                <Label htmlFor="collegeName" className="text-sm font-medium text-gray-700 flex items-center">
                                  <School className="w-4 h-4 mr-2" />
                                  College Name
                                </Label>
                                <div className="relative">
                                  <Input
                                    id="collegeName"
                                    placeholder="Search for your college..."
                                    value={departmentName}
                                    // onChange={()=>{}}
                                    onFocus={() => {
setShowDepartmentSuggestions(true)
                                    }}
                               onBlur={() => setTimeout(() => setShowDepartmentSuggestions(false), 150)}
                                    className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                  />
                                  <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                                </div>
                        
                                {  showDepartmentSuggestions && (
                                  <div className="absolute top-full left-0 right-0 z-50 mt-1">
                                    <Command className="rounded-lg border shadow-md bg-white dark:bg-slate-900 dark:text-slate-200">
                                      <CommandList className="max-h-48">
                                        <CommandEmpty>No colleges found.</CommandEmpty>
                                        <CommandGroup className=' dark:text-slate-200 text-slate-800 '>
                                          {data && 
                            data?.department?.slice(0, 8).map((suggestion:any, index:number) => (
                                            <CommandItem
                                              key={index}
                                              onSelect={() => {
                                                setDepartmentName(suggestion?.name)
                                                field.onChange(suggestion?._id);
                                                setAvailableCourses(suggestion?.courses)
                                              }}
                                              className="cursor-pointer"
                                            >
                                              <div className="flex flex-col">
                                                <span className="font-medium">{suggestion?.collegeId?.name}</span>
                                                <span className="text-sm text-gray-500 capitalize">{suggestion?.name}</span>
                                              </div>
                                            </CommandItem>
                                          ))}
                                        </CommandGroup>
                                      </CommandList>
                                    </Command>
                                  </div>
                                )}

                              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Course Access</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendCourse({ courseId: '', sections: [] })}
              disabled={!selectedDepartmentId}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </div>

          {courseFields.map((courseField, courseIndex) => (
            <CourseAccessCard
              key={courseField.id}
              form={form}
              departmentIndex={departmentIndex}
              courseIndex={courseIndex}
              availableCourses={availableCourses}
              onRemove={() => removeCourse(courseIndex)}
              canRemove={courseFields.length > 1}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface CourseAccessCardProps {
  form: any;
  departmentIndex: number;
  courseIndex: number;
  availableCourses: any[];
  onRemove: () => void;
  canRemove: boolean;
}

const CourseAccessCard = ({ 
  form, 
  departmentIndex, 
  courseIndex, 
  availableCourses, 
  onRemove, 
  canRemove 
}: CourseAccessCardProps) => {
  const selectedSections = form.watch(`accessScope.${departmentIndex}.courses.${courseIndex}.sections`) || [];

  const handleSectionToggle = (section:any) => {
    const currentSections = form.getValues(`accessScope.${departmentIndex}.courses.${courseIndex}.sections`);
    const newSections = currentSections.includes(section?._id)
      ? currentSections.filter((s: string) => s !== section?._id)
      : [...currentSections, section?._id];
    
    form.setValue(`accessScope.${departmentIndex}.courses.${courseIndex}.sections`, newSections);
  };

  return (
    <div className=" bg-transparent border rounded-lg p-4 space-y-3 bg-gray-50">
      <div className="flex items-center justify-between">
        <Label className="font-medium">Course #{courseIndex + 1}</Label>
        {canRemove && (
          <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>

      <FormField
        control={form.control}
        name={`accessScope.${departmentIndex}.courses.${courseIndex}.courseId`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Course</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {availableCourses.map((course) => (
                  <SelectItem key={course.id} value={course._id}>
                    {course.name} ({course.shortName}) {}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <div>
        
        <Label className="text-sm font-medium">Sections</Label>
        <div className="flex flex-wrap gap-2 mt-2">
       {availableCourses
  .find(
    (course) =>
      course._id === form.watch(
        `accessScope.${departmentIndex}.courses.${courseIndex}.courseId`
      )
  )
  ?.sections.map((section:any) => (
    <Button
      key={section.name}
      type="button"
      variant={selectedSections.includes(section._id) ? "default" : "outline"}
      size="sm"
      onClick={() => handleSectionToggle(section)}
    >
      Section {section.name}
    </Button>
  ))}


        </div>
        {selectedSections.length === 0 && (
          <p className="text-sm text-red-500 mt-1">Select at least one section</p>
        )}
      </div>
    </div>
  );
};

export default FacultyAccessForm;