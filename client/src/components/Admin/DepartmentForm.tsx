
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Plus, Trash2, GraduationCap, Building, Users, BookOpen, Search, School, UserCheck } from 'lucide-react';
import { toast } from '../shared/Toast';
import { useGetDepartmentsQuery, useLazyGetCollegesQuery, useNewDepartmentMutation } from '@/services/admin';

interface Section {
  name: string;
  faculty: string;
  students: string[];
}

interface Course {
  name: string;
  shortName: string;
  sections: Section[];
}

interface DepartmentData {
  collegeId: string;
  name: string;
  shortName: string;
  courses: Course[];
  universityId: string;
  [key: string]: any;
}

interface CourseSuggestion {
  name: string;
  shortName: string;
}

interface CollegeSuggestion {
  _id: string;
  name: string;
  universityId: string
}

interface FacultySuggestion {
  id: string;
  name: string;
  department: string;
}

const COURSE_SUGGESTIONS: CourseSuggestion[] = [
  { name: "Bachelor of Computer Applications", shortName: "BCA" },
  { name: "Bachelor of Technology - Computer Science", shortName: "B.Tech CSE" },
  { name: "Bachelor of Technology - Information Technology", shortName: "B.Tech IT" },
  { name: "Bachelor of Technology - Electronics", shortName: "B.Tech ECE" },
  { name: "Bachelor of Technology - Mechanical", shortName: "B.Tech ME" },
  { name: "Bachelor of Technology - Civil", shortName: "B.Tech CE" },
  { name: "Bachelor of Business Administration", shortName: "BBA" },
  { name: "Master of Computer Applications", shortName: "MCA" },
  { name: "Master of Technology - Computer Science", shortName: "M.Tech CSE" },
  { name: "Master of Business Administration", shortName: "MBA" },
  { name: "Bachelor of Science - Computer Science", shortName: "B.Sc CS" },
  { name: "Bachelor of Science - Information Technology", shortName: "B.Sc IT" },
  { name: "Bachelor of Commerce", shortName: "B.Com" },
  { name: "Bachelor of Arts", shortName: "BA" },
  { name: "Master of Science - Computer Science", shortName: "M.Sc CS" },
];


const FACULTY_SUGGESTIONS: FacultySuggestion[] = [
  { id: "683f91ee6d9c21addc7a130d", name: "Dr. Rajesh Kumar", department: "Computer Science" },
  { id: "faculty_002", name: "Prof. Priya Sharma", department: "Information Technology" },
  { id: "faculty_003", name: "Dr. Amit Singh", department: "Electronics" },
  { id: "faculty_004", name: "Prof. Sunita Patel", department: "Computer Science" },
  { id: "faculty_005", name: "Dr. Vikram Gupta", department: "Mechanical" },
  { id: "faculty_006", name: "Prof. Neha Agarwal", department: "Civil" },
  { id: "faculty_007", name: "Dr. Ravi Verma", department: "Computer Science" },
  { id: "faculty_008", name: "Prof. Kavita Joshi", department: "Business Administration" },
  { id: "faculty_009", name: "Dr. Suresh Reddy", department: "Information Technology" },
  { id: "faculty_010", name: "Prof. Meera Nair", department: "Computer Science" },
];

// const dept = { "collegeId": "68401e22cdad650b10240d9f", "universityId": "665f10000000000000000001", "name": " bghfgfdfdfgd", "shortName": "vbvbvvvv", "courses": [{ "name": "Bachelor of Computer Applications", "shortName": "BCA", "sections": [{ "name": "A", "faculty": "683f91ee6d9c21addc7a130d", "students": [] }, { "name": "B", "faculty": "faculty_003", "students": [] }] }] }

const DepartmentForm = ({ dept, formType }: any) => {

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<DepartmentData>({
    collegeId: dept?.collegeId?._id || "",
    universityId: dept?.universityId || "",
    name: dept?.name || " ",
    shortName: dept?.shortName || '',
    courses: dept?.courses || [],
  });

  // College selection state
  const [collegeName, setCollegeName] = useState('');
  const [showCollegeSuggestions, setShowCollegeSuggestions] = useState(false);
  const [collegeSearchQuery, setCollegeSearchQuery] = useState('');

  // Course suggestions state
  const [showCourseSuggestions, setShowCourseSuggestions] = useState<number | null>(null);
  const [courseSearchQuery, setCourseSearchQuery] = useState<string>('');

  // Faculty suggestions state
  const [showFacultySuggestions, setShowFacultySuggestions] = useState<{ courseIndex: number, sectionIndex: number } | null>(null);
  const [facultySearchQuery, setFacultySearchQuery] = useState<string>('');
  const [college, { data, isLoading }] = useLazyGetCollegesQuery({
    refetchOnFocus: true,
    refetchOnReconnect: true
  })
  const [createDepartment, { isLoading: dloding }] = useNewDepartmentMutation();
  const addCourse = () => {
    setFormData(prev => ({
      ...prev,
      courses: [...prev.courses, { name: '', shortName: '', sections: [] }]
    }));
  };

  const removeCourse = (index: number) => {
    setFormData(prev => ({
      ...prev,
      courses: prev.courses.filter((_, i) => i !== index)
    }));
  };

  const updateCourse = (index: number, field: keyof Course, value: string) => {
    setFormData(prev => ({
      ...prev,
      courses: prev.courses.map((course, i) =>
        i === index ? { ...course, [field]: value } : course
      )
    }));
  };

  const selectCourseSuggestion = (courseIndex: number, suggestion: CourseSuggestion) => {
    updateCourse(courseIndex, 'name', suggestion.name);
    updateCourse(courseIndex, 'shortName', suggestion.shortName);
    setShowCourseSuggestions(null);
    setCourseSearchQuery('');
  };

  const selectCollegeSuggestion = (suggestion: CollegeSuggestion) => {
    setFormData(prev => ({ ...prev, collegeId: suggestion._id, universityId: suggestion?.universityId }));
    setCollegeName(suggestion.name);
    setShowCollegeSuggestions(false);
    setCollegeSearchQuery('');
  };

  const selectFacultySuggestion = (courseIndex: number, sectionIndex: number, suggestion: FacultySuggestion) => {
    updateSection(courseIndex, sectionIndex, 'faculty', suggestion.id);
    setShowFacultySuggestions(null);
    setFacultySearchQuery('');
  };

  const filteredCourseSuggestions = COURSE_SUGGESTIONS.filter(course =>
    course.name.toLowerCase().includes(courseSearchQuery.toLowerCase()) ||
    course.shortName.toLowerCase().includes(courseSearchQuery.toLowerCase())
  );

  const filteredFacultySuggestions = FACULTY_SUGGESTIONS.filter(faculty =>
    faculty.name.toLowerCase().includes(facultySearchQuery.toLowerCase()) ||
    faculty.department.toLowerCase().includes(facultySearchQuery.toLowerCase())
  );

  const addSection = (courseIndex: number) => {
    setFormData(prev => ({
      ...prev,
      courses: prev.courses.map((course, i) =>
        i === courseIndex
          ? { ...course, sections: [...course.sections, { name: '', faculty: '', students: [] }] }
          : course
      )
    }));
  };

  const removeSection = (courseIndex: number, sectionIndex: number) => {
    setFormData(prev => ({
      ...prev,
      courses: prev.courses.map((course, i) =>
        i === courseIndex
          ? { ...course, sections: course.sections.filter((_, j) => j !== sectionIndex) }
          : course
      )
    }));
  };

  const updateSection = (courseIndex: number, sectionIndex: number, field: keyof Section, value: string) => {
    setFormData(prev => ({
      ...prev,
      courses: prev.courses.map((course, i) =>
        i === courseIndex
          ? {
            ...course,
            sections: course.sections.map((section, j) =>
              j === sectionIndex ? { ...section, [field]: value } : section
            )
          }
          : course
      )
    }));
  };

  const getFacultyNameById = (facultyId: string) => {
    const faculty = FACULTY_SUGGESTIONS.find(f => f.id === facultyId);
    return faculty ? faculty.name : facultyId;
  };


  useEffect(() => {
 if(dept){
  college({ collegeId:dept?.collegeId?._id ,searchType:"deep"}).unwrap().then(res => {
      setCollegeName(res?.colleges[0]?.name)
    }).catch(err => {
      console.log(err);

    })
  setCurrentStep(3)
 }

  }, [dept])
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
console.log("handle submit");


    await createDepartment(formData).unwrap().then(res=>{
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

  };
  const handleUpdate=()=>{
console.log("handle update");

    
  }

  const tryhandle = async (value: string) => {

    await college({ search: value }).unwrap();
  }

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const steps = [
    { number: 1, title: 'Basic Info', icon: Building },
    { number: 2, title: 'Courses', icon: BookOpen },
    { number: 3, title: 'Review', icon: GraduationCap }
  ];

  return (
    <div className="relative rounded-md top-0 left-0 w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-800 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className=" flex items-center justify-start sm:justify-center flex-wrap gap-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center size-8 sm:size-12 rounded-full border-2 transition-all duration-300 ${currentStep >= step.number
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                  <step.icon className="size-4 sm:size-5 " />
                </div>
                <div className="ml-3 text-sm sm:text-md">
                  <p className={`font-medium ${currentStep >= step.number ? 'text-indigo-600' : 'text-gray-400'}`}>
                    Step {step.number}
                  </p>
                  <p className="text-sm text-gray-600">{step.title}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 ml-8 ${currentStep > step.number ? 'bg-indigo-600' : 'bg-gray-300'
                    }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form className="space-y-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <Card className="shadow-xl text-slate-900 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <Building className="w-6 h-6" />
                  <span>Department Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2 relative">
                  <Label htmlFor="collegeName" className="text-sm font-medium text-gray-700 flex items-center">
                    <School className="w-4 h-4 mr-2" />
                    College Name
                  </Label>
                  <div className="relative">
                    <Input
                      id="collegeName"
                      placeholder="Search for your college..."
                      value={collegeName}
                      onChange={(e) => {
                        tryhandle(e.target.value)
                        setCollegeName(e.target.value);
                        setCollegeSearchQuery(e.target.value);
                        setShowCollegeSuggestions(e.target.value.length > 0);
                      }}
                      onFocus={() => {
                        if (collegeName) {
                          setCollegeSearchQuery(collegeName);
                          setShowCollegeSuggestions(true);
                        }
                      }}
                      className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  </div>
                  {/*  && filteredCollegeSuggestions.length > 0 */}
                  {data && showCollegeSuggestions && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-1">
                      <Command className="rounded-lg border shadow-md bg-white">
                        <CommandList className="max-h-48">
                          <CommandEmpty>No colleges found.</CommandEmpty>
                          <CommandGroup className='text-slate-800 '>
                            {data &&
                              data?.colleges?.slice(0, 8).map((suggestion: any, index: number) => (
                                <CommandItem
                                  key={index}
                                  onSelect={() => selectCollegeSuggestion(suggestion)}
                                  className="cursor-pointer"
                                >
                                  <div className="flex flex-col">
                                    <span className="font-medium">{suggestion.name}</span>
                                    <span className="text-sm text-gray-500">ID: {suggestion._id}</span>
                                  </div>
                                </CommandItem>
                              ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Department Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="e.g., Computer Science"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shortName" className="text-sm font-medium text-gray-700">
                      Short Name
                    </Label>
                    <Input
                      id="shortName"
                      placeholder="e.g., CSE"
                      value={formData.shortName}
                      onChange={(e) => setFormData(prev => ({ ...prev, shortName: e.target.value }))}
                      className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {formData.collegeId && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800">
                      <strong>Selected College ID:</strong> {formData.collegeId}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 2: Courses and Sections */}
          {currentStep === 2 && (
            <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-700 backdrop-blur-sm ">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-6 h-6" />
                    <span>Courses & Sections</span>
                  </div>
                  <Button
                    type="button"
                    onClick={addCourse}
                    variant="secondary"
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Course
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {formData.courses.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">No courses added yet</p>
                    <p>Click "Add Course" to get started</p>
                  </div>
                ) : (
                  formData.courses.map((course, courseIndex) => (
                    <Card key={courseIndex} className="border-gray-200 shadow-sm bg-white/90  text-gray-500">
                      <CardHeader className="bg-gray-50 border-b rounded-t-md">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-indigo-600 border-indigo-200">
                            Course {courseIndex + 1}
                          </Badge>
                          <Button
                            type="button"
                            onClick={() => removeCourse(courseIndex)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2 relative">
                            <Label className="text-sm font-medium text-gray-700">Course Name</Label>
                            <div className="relative">
                              <Input
                                placeholder="e.g., Bachelor of Computer Applications"
                                value={course.name}
                                onChange={(e) => {
                                  updateCourse(courseIndex, 'name', e.target.value);
                                  setCourseSearchQuery(e.target.value);
                                  setShowCourseSuggestions(e.target.value ? courseIndex : null);
                                }}
                                onFocus={() => {
                                  if (course.name) {
                                    setCourseSearchQuery(course.name);
                                    setShowCourseSuggestions(courseIndex);
                                  }
                                }}
                                className="border-gray-300 focus:border-indigo-500"
                              />
                              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                            </div>

                            {showCourseSuggestions === courseIndex && filteredCourseSuggestions.length > 0 && (
                              <div className="absolute top-full left-0 right-0 z-50 mt-1">
                                <Command className="rounded-lg border shadow-md bg-white">
                                  <CommandList className="max-h-48">
                                    <CommandEmpty>No courses found.</CommandEmpty>
                                    <CommandGroup>
                                      {filteredCourseSuggestions.slice(0, 8).map((suggestion, index) => (
                                        <CommandItem
                                          key={index}
                                          onSelect={() => selectCourseSuggestion(courseIndex, suggestion)}
                                          className="cursor-pointer"
                                        >
                                          <div className="flex flex-col">
                                            <span className="font-medium">{suggestion.name}</span>
                                            <span className="text-sm text-gray-500">{suggestion.shortName}</span>
                                          </div>
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">Short Name</Label>
                            <Input
                              placeholder="e.g., BCA"
                              value={course.shortName}
                              onChange={(e) => updateCourse(courseIndex, 'shortName', e.target.value)}
                              className="border-gray-300 focus:border-indigo-500"
                            />
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-700 flex items-center">
                              <Users className="w-4 h-4 mr-2" />
                              Sections
                            </h4>
                            <Button
                              type="button"
                              onClick={() => addSection(courseIndex)}
                              variant="outline"
                              size="sm"
                              className="bg-white border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-slate-800"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add Section
                            </Button>
                          </div>

                          {course.sections.map((section, sectionIndex) => (
                            <div key={sectionIndex} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-lg">
                              <div className="space-y-1">
                                <Label className="text-xs font-medium text-gray-600">Section Name</Label>
                                <Input
                                  placeholder="e.g., A"
                                  value={section.name}
                                  onChange={(e) => updateSection(courseIndex, sectionIndex, 'name', e.target.value)}
                                  className="text-sm"
                                />
                              </div>
                              <div className="space-y-1 mt-1.5 relative">
                                <Label className="text-xs font-medium text-gray-600 flex items-center">
                                  <UserCheck className="w-3 h-3 mr-1" />
                                  Faculty
                                </Label>
                                <div className="relative">
                                  <Input
                                    placeholder="Search faculty..."
                                    value={section.faculty ? getFacultyNameById(section.faculty) : ''}
                                    onChange={(e) => {
                                      setFacultySearchQuery(e.target.value);
                                      setShowFacultySuggestions({ courseIndex, sectionIndex });
                                    }}
                                    onFocus={() => {
                                      setFacultySearchQuery('');
                                      setShowFacultySuggestions({ courseIndex, sectionIndex });
                                    }}
                                    className="text-sm"
                                  />
                                  <Search className="absolute right-2 top-2 h-3 w-3 text-gray-400" />
                                </div>

                                {showFacultySuggestions?.courseIndex === courseIndex &&
                                  showFacultySuggestions?.sectionIndex === sectionIndex &&
                                  filteredFacultySuggestions.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 z-50 mt-1">
                                      <Command className="rounded-lg border shadow-md bg-white">
                                        <CommandList className="max-h-32">
                                          <CommandEmpty>No faculty found.</CommandEmpty>
                                          <CommandGroup>
                                            {filteredFacultySuggestions.slice(0, 5).map((suggestion, index) => (
                                              <CommandItem
                                                key={index}
                                                onSelect={() => selectFacultySuggestion(courseIndex, sectionIndex, suggestion)}
                                                className="cursor-pointer"
                                              >
                                                <div className="flex flex-col">
                                                  <span className="font-medium text-xs">{suggestion.name}</span>
                                                  <span className="text-xs text-gray-500">{suggestion.department}</span>
                                                </div>
                                              </CommandItem>
                                            ))}
                                          </CommandGroup>
                                        </CommandList>
                                      </Command>
                                    </div>
                                  )}
                              </div>
                              <div className="flex items-end">
                                <Button
                                  type="button"
                                  onClick={() => removeSection(courseIndex, sectionIndex)}
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-800 hover:bg-red-50 w-full"
                                >
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Remove
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && (
            <Card className="shadow-xl  border-0 dark:bg-slate-700 bg-white/90 backdrop-blur-sm text-slate-900 dark:text-slate-200">
              <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="w-6 h-6" />
                  <span>Review Department</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6 ">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-indigo-50 rounded-lg">
                    <Building className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
                    <p className="font-semibold text-indigo-900">{formData.name || 'Department Name'}</p>
                    <p className="text-sm text-indigo-600">{formData.shortName || 'Short Name'}</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <School className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <p className="font-semibold text-green-900">{collegeName || 'College Name'}</p>
                    <p className="text-sm text-green-600">ID: {formData.collegeId || 'Not Selected'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                    <p className="font-semibold text-purple-900">{formData.courses.length}</p>
                    <p className="text-sm text-purple-600">Courses</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <Users className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                    <p className="font-semibold text-orange-900">
                      {formData.courses.reduce((total, course) => total + course.sections.length, 0)}
                    </p>
                    <p className="text-sm text-orange-600">Total Sections</p>
                  </div>
                </div>

                {formData.courses.map((course, index) => (
                  <Card key={index} className=" bg-transparent border-gray-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-slate-900 dark:text-slate-200">{course.name}</h4>
                        <Badge className='bg-blue-600' variant="secondary">{course.shortName}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {course.sections.map((section, sectionIndex) => (
                          <div key={sectionIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <Badge variant="outline" className="text-slate-900 text-xs">
                              Section {section.name}
                            </Badge>
                            {section.faculty && (
                              <span className="text-xs text-gray-600">
                                Faculty: {getFacultyNameById(section.faculty)}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              variant="outline"
              className="px-6"
            >
              Previous
            </Button>

            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="px-6 bg-indigo-600 hover:bg-indigo-700"
              >
                Next
              </Button>
            ) : (
              formType==="update"?
              <Button
                type="button"
                onClick={()=>handleUpdate()}
                className="px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                Update Department
              </Button>
              
              :<Button
                type="button"
                onClick={handleSubmit}
                className="px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                Create Department
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartmentForm;
