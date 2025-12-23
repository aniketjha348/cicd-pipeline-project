import { useEffect, useMemo, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';import { FaUniversity } from "react-icons/fa";

import {
  BookOpen,
  GraduationCap,
  Calendar,
  Users,
  Plus,
  Trash2,
  Building2,
  Clock,
  FileText,
  ChevronRight,
  Save,
  X,
  Forward
} from 'lucide-react';
import { toast } from '../shared/Toast';
import { getRandomColor } from '@/lib/genrateRandomColor';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useAddCourseMutation, useLazyGetCollegesQuery } from '@/services/admin';
import { SearchWithInput } from '../shared/SearchWithInput';
import CourseLoading from '../shared/Loading';


const sectionSchema = z.object({
  name: z.string().min(1, 'Section name is required'),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  classTeacherId: z.string().optional(),
});

const yearSchema = z.object({
  yearNumber: z.number().min(1, 'Year number must be at least 1'),
  sections: z.array(sectionSchema).min(1, 'At least one section is required'),
});

const batchSchema = z.object({
  batchYear: z.number().min(2020, 'Batch year must be valid'),
  endYear: z.number().optional(),
  years: z.array(yearSchema).min(1, 'At least one year is required'),
});

const courseSchema = z.object({
  name: z.string().min(1, 'Course name is required'),
  departmentId: z.string().min(1, 'Department is required'),
  collegeId: z.string().min(1, 'College is required'),
  universityId: z.string().min(1, 'University is required'),
 code:z.string()
    .trim()
    .toUpperCase()
    .min(2, { message: "Code must be at least 2 characters long" })
    .max(10, { message: "Code must not exceed 10 characters" }),

  duration: z.number().min(1, 'Duration must be at least 1 year'),
  description: z.string().optional(),
  programType: z.enum(['Undergraduate', 'Postgraduate', 'Diploma', 'Certificate'],

  ),
  uniName: z.string().default("").optional(),
  collName: z.string().default("").optional(),
  deptName: z.string().default("").optional(),
  batches: z.array(batchSchema).min(1, 'At least one batch is required'),
});

type CourseFormData = z.infer<typeof courseSchema>;

interface CourseFormProps {
  initialData?: Partial<CourseFormData>;
  onSubmit: (data: CourseFormData) => void;
  isEditing?: boolean;
}

const CourseForm = ({ initialData, onSubmit, isEditing = false }: CourseFormProps) => {
  const [activeTab, setActiveTab] = useState('basic');
  const { user } = useSelector((state: RootState) => state.auth)
  const [hasError, setHasError] = useState(false);
  const [addCourse,{isLoading:addLoading}]=useAddCourseMutation();
  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: '',
      departmentId: '',
      collegeId: '',
      universityId: '',
      uniName: "",
      collName: "",
      deptName: "",
      code:"",
      duration: 3,
      description: '',
      programType: 'Undergraduate',
      batches: [
        {
          batchYear: new Date().getFullYear(),
          years: [
            {
              yearNumber: 1,
              sections: [
                {
                  name: 'A',
                  capacity: 60,
                  classTeacherId: '',
                }
              ]
            }
          ]
        }
      ],
      // batches:[],
      ...initialData,
    },
  });


  useEffect(() => {
    if (hasFormErrors()) {

      toast({
        title: "Form Error",
        description: "Please fix the highlighted errors before submitting.",
        toastType: "error"
      });

    }

    if (!form?.getValues("uniName")) {

      form.setValue("uniName", user?.institution?.name);
      form.setValue("universityId", user?.institution?._id)

    }
  }, [form.formState.errors]);
  const hasFormErrors = () => {
    const { name, collegeId, universityId, departmentId } = form?.formState?.errors;
    if (name) {

      setActiveTab("basic");
      setHasError(true)

    }
    else if ((collegeId || universityId || departmentId)) {
      setActiveTab("structure");
      setHasError(true)

    }
    else if (Object.keys(form.formState.errors).length === 0) {
      if (hasError)
        setActiveTab("batches");
      // setHasError(false)
    }


    return Object.keys(form.formState.errors).length > 0;
  };

  const {
    fields: batchFields,
    append: appendBatch,
    remove: removeBatch,
  } = useFieldArray({
    control: form.control,
    name: 'batches',
  });

  const handleSubmit = async(data: CourseFormData) => {

    if (activeTab === "batches") {
      const allFormData = form.getValues();
      console.log('Course Form Data:', allFormData,);
      // onSubmit(data);
      await addCourse(data).unwrap().then(res=>{

        console.log(res);
        toast({
        title: isEditing ? "Course Updated" : "Course Created",
        description: `Course "${data.name}" has been ${isEditing ? 'updated' : 'created'} successfully.`,
      });
        
      }).catch(err=>{
        console.log(err);
          toast({
        title: isEditing ? "Course Updated" : "Course Creation Failed.",
        description: err?.data?.message,
        toastType:"error"
      });
      })
    }

  };

  const addNewBatch = () => {
    const currentYear = new Date().getFullYear();
    appendBatch({
      batchYear: currentYear,
      years: [
        {
          yearNumber: 1,
          sections: [
            {
              name: 'A',
              capacity: 60,
              classTeacherId: '',
            }
          ]
        }
      ]
    });
  };



  const faculty = [
    { id: '683f91ee6d9c21addc7a130d', name: 'Dr. John Smith' },
    { id: '2', name: 'Prof. Jane Doe' },
    { id: '3', name: 'Dr. Mike Johnson' },
  ];
  const [selectedData, setSelectedData] = useState({});
  const [college, { currentData: data, isLoading }] = useLazyGetCollegesQuery({
    refetchOnFocus: true,
    refetchOnReconnect: true
  })

  const randomColor = useMemo(() => getRandomColor("border"), []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white text-color flex-1 to-purple-50 primary-p bg-color">
      
      <div className="max-w-10xl space-y-8 min-w-full flex flex-col">
        {/* Header */}
        <div className="animate-fade-in">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl dark:bg-none dark:bg-slate-700/40">
              <BookOpen className={`h-8 w-8  text-${randomColor?.colorWithValue}`} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-color">
                {isEditing ? 'Edit Course' : 'Create New Course'}
              </h1>
              <p className="text-color-thin">
                {isEditing ? 'Update course information and structure' : 'Set up a new academic course with batches and sections'}
              </p>
            </div>
          </div>
        </div>

        <Form {...form}>
          
          <form onSubmit={form.handleSubmit(handleSubmit)} className="relative space-y-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="relative animate-scale-in">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Basic Info
                </TabsTrigger>
                <TabsTrigger value="structure" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Academic Structure
                </TabsTrigger>
                <TabsTrigger value="batches" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Batches & Sections
                </TabsTrigger>
              </TabsList>
            { addLoading && <CourseLoading containerClass={""} />}

              {/* Basic Information Tab */}
              <TabsContent value="basic" className="space-y-6 mt-6">
                <Card className="animate-fade-in hover-scale">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className={` h-5 w-5 text-${randomColor?.colorWithValue}`} />
                      Course Details
                    </CardTitle>
                    <CardDescription>Basic information about the course</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Course Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Bachelor of Computer Applications" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                       <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Course Code</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., BCA" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="programType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Program Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select program type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                                <SelectItem value="Postgraduate">Postgraduate</SelectItem>
                                <SelectItem value="Diploma">Diploma</SelectItem>
                                <SelectItem value="Certificate">Certificate</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Clock className={`h-4 w-4  text-${randomColor?.colorWithValue}`} />
                              Duration (Years)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                max="8"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
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
                              placeholder="Brief description of the course..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Academic Structure Tab */}
              <TabsContent value="structure" className="space-y-6 mt-6">
                <Card className="animate-fade-in hover-scale">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className={`h-5 w-5  text-${randomColor?.colorWithValue}`} />
                      Institutional Hierarchy
                    </CardTitle>
                    <CardDescription>Associate this course with university, college, and department</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="universityId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2 p-[3px] '>
                            
<FaUniversity className={`w-4 h-4 mr-2 text-${randomColor?.colorWithValue}`} />
                              University</FormLabel>
                            <Input
                              value={form.watch("uniName")}
                              className='border-slate-800 dark:border-gray-50 border text-color-thin opacity-100'
                              disabled={true}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="collegeId"
                        render={({ field }) => (
                          <FormItem>
                            <SearchWithInput value={form.watch('collName')} randomColor={randomColor} inputPlaceholder='Search Colleges...'
                              onChange={async (search) => college({ search, searchType: "deep" }).unwrap()}
                              onValueChange={(search)=>{
                                
                                if(form.watch('collegeId'))   form.setValue("collegeId","")
                                form.setValue("collName",search);console.log(search);
                              }}
                              onSelect={(res) => {
                                console.log(res, "res");
                                ; setSelectedData(res);
                                field.onChange(res?._id);
                                form?.setValue("collName", res?.name)
                              }
                            

                              }
                              onReset={()=>{
                                form.setValue("collegeId","")
                                form.setValue("collName","")
                              }}
                              data={data?.colleges}
                            />

                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="departmentId"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <SearchWithInput
                               value={form.watch('deptName')} randomColor={randomColor} inputPlaceholder='Search Department...'
                                labelName='Department'
                                // onChange={async (search) => { }}
                                onSelect={(res)=>{
                                field.onChange(res?._id);
                                form?.setValue("deptName", res?.name)
                                }}
                                onValueChange={(search)=>{
                               if(form.watch('departmentId'))   form.setValue("departmentId","")
                                form.setValue("deptName",search);
                                }}
                                data={selectedData?.departments}
                                 onReset={()=>{
                                form.setValue("departmentId","")
                                form.setValue("deptName","")
                              }}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex  items-center  justify-around gap-4 flex-wrap p-4 bg-color dark:border border-slate-200 rounded-lg">
                      <div className=" text-center">
                        <div className="text-sm text-gray-600">University</div>
                        <div className="font-semibold text-blue-600">
                          {form.watch('universityId') ? form.watch('uniName') : "Not selected"
                          }
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <ChevronRight className={`h-4 w-4  text-${randomColor?.colorWithValue}`} />
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">College</div>
                        <div className="font-semibold text-green-600">
                          {form.watch('collegeId') ? form.watch('collName') : "Not selected"
                          }
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <ChevronRight className={`h-4 w-4  text-${randomColor?.colorWithValue}`} />
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Department</div>
                        <div className="font-semibold text-purple-600">
                          {form.watch('departmentId') ? form.watch('deptName') : "Not selected"
                          }
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Batches & Sections Tab */}
              <TabsContent value="batches" className="space-y-6 mt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">Course Batches</h3>
                    <p className="text-gray-600">Manage batches, years, and sections for this course</p>
                  </div>
                  <Button onClick={addNewBatch} className="hover-scale">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Batch
                  </Button>
                </div>

                <div className="space-y-6">
                  {batchFields.map((batch, batchIndex) => (
                    <BatchCard
                      key={batch.id}
                      batchIndex={batchIndex}
                      form={form}
                      randomColor={randomColor}
                      onRemove={() => removeBatch(batchIndex)}
                      faculty={faculty}
                      canRemove={batchFields.length > 1}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-6 border-t animate-fade-in">
              <Button type="button" variant="outline" onClick={() => window.history.back()}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              {activeTab === "batches" ? <Button type="button" className="hover-scale" onClick={form.handleSubmit(handleSubmit)}>
                <Save className="h-4 w-4 mr-2" />
                {isEditing ? 'Update Course' : 'Create Course'}
              </Button> : <Button onClick={hasFormErrors} type="submit" className="hover-scale">
                <Forward className="h-4 w-4 mr-2" />
                Next
              </Button>}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

// Batch Card Component
interface BatchCardProps {
  batchIndex: number;
  form: any;
  onRemove: () => void;
  faculty: Array<{ id: string; name: string }>;
  canRemove: boolean;
  randomColor: any
}

const BatchCard = ({ batchIndex, form, onRemove, faculty, canRemove, randomColor }: BatchCardProps) => {
  const {
    fields: yearFields,
    append: appendYear,
    remove: removeYear,
  } = useFieldArray({
    control: form.control,
    name: `batches.${batchIndex}.years`,
  });

  const addNewYear = () => {
    appendYear({
      yearNumber: yearFields.length + 1,
      sections: [
        {
          name: 'A',
          capacity: 60,
          classTeacherId: '',
        }
      ]
    });
  };

  return (
    <Card className="flex-1 animate-fade-in hover-scale">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg">
              <Calendar className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Batch {batchIndex + 1}</CardTitle>
              <CardDescription>Academic batch configuration</CardDescription>
            </div>
          </div>
          {canRemove && (
            <Button variant="outline" size="sm" onClick={onRemove} className="text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name={`batches.${batchIndex}.batchYear`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Batch Year</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="2020"
                    max="2030"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`batches.${batchIndex}.endYear`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Year (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="2020"
                    max="2035"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Academic Years</h4>
            <Button type="button" variant="outline" size="sm" onClick={addNewYear}>
              <Plus className="h-4 w-4 mr-2" />
              Add Year
            </Button>
          </div>

          {yearFields.map((year, yearIndex) => (
            <YearCard
              key={year.id}
              batchIndex={batchIndex}
              yearIndex={yearIndex}
              form={form}
              randomColor={randomColor}
              onRemove={() => removeYear(yearIndex)}
              faculty={faculty}
              canRemove={yearFields.length > 1}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Year Card Component
interface YearCardProps {
  batchIndex: number;
  yearIndex: number;
  form: any;
  onRemove: () => void;
  faculty: Array<{ id: string; name: string }>;
  canRemove: boolean;
  randomColor: any
}

const YearCard = ({ batchIndex, yearIndex, form, onRemove, faculty, canRemove, randomColor }: YearCardProps) => {
  const {
    fields: sectionFields,
    append: appendSection,
    remove: removeSection,
  } = useFieldArray({
    control: form.control,
    name: `batches.${batchIndex}.years.${yearIndex}.sections`,
  });

  const addNewSection = () => {
    const nextLetter = String.fromCharCode(65 + sectionFields.length); // A, B, C, etc.
    appendSection({
      name: nextLetter,
      capacity: 60,
      classTeacherId: '',
    });
  };

  return (
    <Card className="border-l-4 border-l-blue-200 w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Year {yearIndex + 1}</Badge>
            <span className="text-sm text-gray-600">{sectionFields.length} sections</span>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={addNewSection}>
              <Plus className="h-3 w-3 mr-1" />
              Section
            </Button>
            {canRemove && (
              <Button variant="outline" size="sm" onClick={onRemove} className="text-red-600">
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name={`batches.${batchIndex}.years.${yearIndex}.yearNumber`}
          render={({ field }) => (
            <FormItem className="mb-4">
              <FormLabel>Year Number</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  max="8"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-3">
          <h5 className="font-medium text-sm flex items-center gap-2">
            <Users className={`h-4 w-4 text-${randomColor.colorWithValue}`} />
            Sections
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sectionFields.map((section, sectionIndex) => (
              <div key={section.id} className="p-3 border border-slate-300/20 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Section {sectionIndex + 1}</Badge>
                  {sectionFields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSection(sectionIndex)}
                      className="text-red-600 hover:text-red-700 h-6 w-6 p-0"
                    >
                      <X className={`w-4 h-4 text-${randomColor.colorWithValue}`} />

                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <FormField
                    control={form.control}
                    name={`batches.${batchIndex}.years.${yearIndex}.sections.${sectionIndex}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Name</FormLabel>
                        <FormControl>
                          <Input placeholder="A" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`batches.${batchIndex}.years.${yearIndex}.sections.${sectionIndex}.capacity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Capacity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name={`batches.${batchIndex}.years.${yearIndex}.sections.${sectionIndex}.classTeacherId`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Class Teacher</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Select teacher" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {faculty.map((teacher) => (
                            <SelectItem key={teacher.id} value={teacher.id}>
                              {teacher.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseForm;
