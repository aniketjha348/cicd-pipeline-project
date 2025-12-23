import { useState, useEffect, useMemo } from 'react';
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash2, Building, GraduationCap, BookOpen, Users, Shield, Lock } from 'lucide-react';

interface Faculty {
  id: string;
  name: string;
  email: string;
  avatar: string;
  department: string;
}

interface AccessScope {
  facultyId: string;
  collegeId: string;
  collegeName: string;
  departments: {
    departmentId: string;
    departmentName: string;
    courses: {
      courseId: string;
      courseName: string;
      batchAccess: {
        batchYear: number;
        sections: string[];
      }[];
    }[];
  }[];
}

interface FacultyAccessDialogProps {
  faculty: Faculty | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (accessScope: AccessScope) => void;
  existingAccess: AccessScope[];
}

// Mock data for institutions, departments, courses
const mockColleges = [
  { id: 'eng1', name: 'Engineering' },
  { id: 'sci1', name: 'Sciences' },
  { id: 'med1', name: 'Medicine' },
  { id: 'art1', name: 'Arts & Humanities' },
  { id: 'bus1', name: 'Business' }
];

const mockDepartments = [
  { id: 'cs1', name: 'Computer Science', collegeId: 'eng1' },
  { id: 'ee1', name: 'Electrical Engineering', collegeId: 'eng1' },
  { id: 'me1', name: 'Mechanical Engineering', collegeId: 'eng1' },
  { id: 'math1', name: 'Mathematics', collegeId: 'sci1' },
  { id: 'phy1', name: 'Physics', collegeId: 'sci1' },
  { id: 'bio1', name: 'Biology', collegeId: 'sci1' },
  { id: 'ana1', name: 'Anatomy', collegeId: 'med1' },
  { id: 'path1', name: 'Pathology', collegeId: 'med1' }
];

const mockCourses = [
  { id: 'cs101', name: 'Data Structures', departmentId: 'cs1' },
  { id: 'cs102', name: 'Algorithms', departmentId: 'cs1' },
  { id: 'cs103', name: 'Database Systems', departmentId: 'cs1' },
  { id: 'ee101', name: 'Circuit Analysis', departmentId: 'ee1' },
  { id: 'ee102', name: 'Digital Electronics', departmentId: 'ee1' },
  { id: 'math101', name: 'Calculus I', departmentId: 'math1' },
  { id: 'math102', name: 'Linear Algebra', departmentId: 'math1' },
  { id: 'phy101', name: 'Classical Mechanics', departmentId: 'phy1' }
];

const batchYears = [2024, 2023, 2022, 2021];
const sections = ['A', 'B', 'C', 'D'];

export const FacultyAccessDialog = ({
  faculty,
  open,
  onOpenChange,
  onSave,
  existingAccess
}: FacultyAccessDialogProps) => {
  const [collegeAccesses, setCollegeAccesses] = useState<{
    collegeId: string;
    collegeName: string;
    departments: {
      departmentId: string;
      departmentName: string;
      courses: {
        courseId: string;
        courseName: string;
        batchAccess: {
          batchYear: number;
          sections: string[];
        }[];
      }[];
    }[];
  }[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (open && faculty) {
      // Initialize with existing access or empty
      if (existingAccess.length > 0) {
        setCollegeAccesses(existingAccess.map(access => ({
          collegeId: access.collegeId,
          collegeName: access.collegeName,
          departments: access.departments
        })));
      } else {
        setCollegeAccesses([]);
      }
    }
  }, [open, faculty, existingAccess]);

  const addCollege = (collegeId: string) => {
    const college = mockColleges.find(c => c.id === collegeId);
    if (!college || collegeAccesses.find(ca => ca.collegeId === collegeId)) return;

    setCollegeAccesses(prev => [...prev, {
      collegeId,
      collegeName: college.name,
      departments: []
    }]);
  };

  const removeCollege = (collegeId: string) => {
    setCollegeAccesses(prev => prev.filter(ca => ca.collegeId !== collegeId));
  };

  const getAvailableDepartments = (collegeId: string) => {
    return mockDepartments.filter(dept => dept.collegeId === collegeId);
  };

  const getAvailableCourses = (departmentId: string) => {
    return mockCourses.filter(course => course.departmentId === departmentId);
  };

  const addDepartment = (collegeId: string, departmentId: string, departmentName: string) => {
    setCollegeAccesses(prev => prev.map(college => {
      if (college.collegeId === collegeId) {
        if (college.departments.find(d => d.departmentId === departmentId)) return college;
        return {
          ...college,
          departments: [...college.departments, {
            departmentId,
            departmentName,
            courses: []
          }]
        };
      }
      return college;
    }));
  };

  const removeDepartment = (collegeId: string, departmentId: string) => {
    setCollegeAccesses(prev => prev.map(college => {
      if (college.collegeId === collegeId) {
        return {
          ...college,
          departments: college.departments.filter(d => d.departmentId !== departmentId)
        };
      }
      return college;
    }));
  };

  const addCourse = (collegeId: string, departmentId: string, courseId: string, courseName: string) => {
    setCollegeAccesses(prev => prev.map(college => {
      if (college.collegeId === collegeId) {
        return {
          ...college,
          departments: college.departments.map(dept => {
            if (dept.departmentId === departmentId) {
              if (dept.courses.find(c => c.courseId === courseId)) return dept;
              return {
                ...dept,
                courses: [...dept.courses, {
                  courseId,
                  courseName,
                  batchAccess: []
                }]
              };
            }
            return dept;
          })
        };
      }
      return college;
    }));
  };

  const removeCourse = (collegeId: string, departmentId: string, courseId: string) => {
    setCollegeAccesses(prev => prev.map(college => {
      if (college.collegeId === collegeId) {
        return {
          ...college,
          departments: college.departments.map(dept => {
            if (dept.departmentId === departmentId) {
              return {
                ...dept,
                courses: dept.courses.filter(c => c.courseId !== courseId)
              };
            }
            return dept;
          })
        };
      }
      return college;
    }));
  };

  const addBatchAccess = (collegeId: string, departmentId: string, courseId: string, batchYear: number) => {
    setCollegeAccesses(prev => prev.map(college => {
      if (college.collegeId === collegeId) {
        return {
          ...college,
          departments: college.departments.map(dept => {
            if (dept.departmentId === departmentId) {
              return {
                ...dept,
                courses: dept.courses.map(course => {
                  if (course.courseId === courseId) {
                    if (course.batchAccess.find(b => b.batchYear === batchYear)) return course;
                    return {
                      ...course,
                      batchAccess: [...course.batchAccess, {
                        batchYear,
                        sections: []
                      }]
                    };
                  }
                  return course;
                })
              };
            }
            return dept;
          })
        };
      }
      return college;
    }));
  };

  const toggleSection = (collegeId: string, departmentId: string, courseId: string, batchYear: number, section: string) => {
    setCollegeAccesses(prev => prev.map(college => {
      if (college.collegeId === collegeId) {
        return {
          ...college,
          departments: college.departments.map(dept => {
            if (dept.departmentId === departmentId) {
              return {
                ...dept,
                courses: dept.courses.map(course => {
                  if (course.courseId === courseId) {
                    return {
                      ...course,
                      batchAccess: course.batchAccess.map(batch => {
                        if (batch.batchYear === batchYear) {
                          const newSections = batch.sections.includes(section)
                            ? batch.sections.filter(s => s !== section)
                            : [...batch.sections, section];
                          return { ...batch, sections: newSections };
                        }
                        return batch;
                      })
                    };
                  }
                  return course;
                })
              };
            }
            return dept;
          })
        };
      }
      return college;
    }));
  };

  const handleSave = () => {
    if (!faculty || collegeAccesses.length === 0) return;

    // Save each college access as a separate access scope
    collegeAccesses.forEach(collegeAccess => {
      if (collegeAccess.departments.length > 0) {
        const newAccessScope: AccessScope = {
          facultyId: faculty.id,
          collegeId: collegeAccess.collegeId,
          collegeName: collegeAccess.collegeName,
          departments: collegeAccess.departments
        };
        onSave(newAccessScope);
      }
    });

    onOpenChange(false);
  };

  if (!faculty) return null;


  return (
    <section className="max-w-14xl  w-full overflow-y-auto p-6 border rounded-md shadow-sm bg-white dark:bg-slate-900">
      <Button className='float-start sm:float-end' onClick={() => navigate(-1)} > back to </Button>
      <br />
      <h2 className="text-2xl font-semibold flex items-center gap-2 mb-6">
        <Users className="w-5 h-5" />
        Set Multi-College Access for {faculty.name}
      </h2>


      <div className="space-y-6">
        {/* Add College */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            Add College Access
          </Label>
          <Select onValueChange={(value) => addCollege(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Add a college" />
            </SelectTrigger>
            <SelectContent>
              {mockColleges
                .filter(college => !collegeAccesses.find(ca => ca.collegeId === college.id))
                .map(college => (
                  <SelectItem key={college.id} value={college.id}>
                    {college.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* College Access Cards */}
        {collegeAccesses.map(collegeAccess => (
          <Card key={collegeAccess.collegeId} className="border-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  {collegeAccess.collegeName}
                </span>
                <Button variant="ghost" size="sm" onClick={() => removeCollege(collegeAccess.collegeId)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Department */}
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <GraduationCap className="w-4 h-4" />
                  Add Departments
                </Label>
                <Select onValueChange={(value) => {
                  const dept = mockDepartments.find(d => d.id === value);
                  if (dept) addDepartment(collegeAccess.collegeId, dept.id, dept.name);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add a department" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableDepartments(collegeAccess.collegeId)
                      .filter(dept => !collegeAccess.departments.find(d => d.departmentId === dept.id))
                      .map(dept => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Departments */}
              {collegeAccess.departments.map(department => (
                <Card key={department.departmentId} className="ml-4">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        {department.departmentName}
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => removeDepartment(collegeAccess.collegeId, department.departmentId)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Add Course */}
                    <div>
                      <Label className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-4 h-4" />
                        Add Courses
                      </Label>
                      <Select onValueChange={(value) => {
                        const course = mockCourses.find(c => c.id === value);
                        if (course) addCourse(collegeAccess.collegeId, department.departmentId, course.id, course.name);
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Add a course" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableCourses(department.departmentId)
                            .filter(course => !department.courses.find(c => c.courseId === course.id))
                            .map(course => (
                              <SelectItem key={course.id} value={course.id}>
                                {course.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Courses */}
                    {department.courses.map(course => (
                      <Card key={course.courseId} className="ml-4">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <BookOpen className="w-3 h-3" />
                              {course.courseName}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCourse(collegeAccess.collegeId, department.departmentId, course.courseId)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {/* Add Batch Year */}
                          <div>
                            <Label className="text-sm mb-2 block">Add Batch Access</Label>
                            <Select onValueChange={(value) => {
                              addBatchAccess(collegeAccess.collegeId, department.departmentId, course.courseId, parseInt(value));
                            }}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Add batch year" />
                              </SelectTrigger>
                              <SelectContent>
                                {batchYears
                                  .filter(year => !course.batchAccess.find(b => b.batchYear === year))
                                  .map(year => (
                                    <SelectItem key={year} value={year.toString()}>
                                      Batch {year}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Batch Access */}
                          {course.batchAccess.map(batch => (
                            <div key={batch.batchYear} className="space-y-2 p-3 border rounded">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">Batch {batch.batchYear}</Badge>
                              </div>
                              <div className="grid grid-cols-4 gap-2">
                                {sections.map(section => (
                                  <div key={section} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`${collegeAccess.collegeId}-${course.courseId}-${batch.batchYear}-${section}`}
                                      checked={batch.sections.includes(section)}
                                      onCheckedChange={() =>
                                        toggleSection(collegeAccess.collegeId, department.departmentId, course.courseId, batch.batchYear, section)
                                      }
                                    />
                                    <Label
                                      htmlFor={`${collegeAccess.collegeId}-${course.courseId}-${batch.batchYear}-${section}`}
                                      className="text-sm"
                                    >
                                      Section {section}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end gap-2 pt-6">
        <Button variant="outline" onClick={() => ""}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={collegeAccesses.length === 0 || !collegeAccesses.some(ca => ca.departments.length > 0)}
        >
          Save Access
        </Button>
      </div>
    </section>

  )

  // return (
  //   <Dialog open={open} onOpenChange={onOpenChange}>
  //     <DialogContent className="max-w-5xl max-h-[80vh]">
  //       <DialogHeader>
  //         <DialogTitle className="flex items-center gap-2">
  //           <Users className="w-5 h-5" />
  //           Set Multi-College Access for {faculty.name}
  //         </DialogTitle>
  //       </DialogHeader>

  //       <ScrollArea className="max-h-[60vh] pr-4">
  //         <div className="space-y-6">
  //           {/* Add College */}
  //           <div className="space-y-2">
  //             <Label className="flex items-center gap-2">
  //               <Building className="w-4 h-4" />
  //               Add College Access
  //             </Label>
  //             <Select onValueChange={(value) => addCollege(value)}>
  //               <SelectTrigger>
  //                 <SelectValue placeholder="Add a college" />
  //               </SelectTrigger>
  //               <SelectContent>
  //                 {mockColleges
  //                   .filter(college => !collegeAccesses.find(ca => ca.collegeId === college.id))
  //                   .map(college => (
  //                   <SelectItem key={college.id} value={college.id}>
  //                     {college.name}
  //                   </SelectItem>
  //                 ))}
  //               </SelectContent>
  //             </Select>
  //           </div>

  //           {/* College Access Cards */}
  //           {collegeAccesses.map(collegeAccess => (
  //             <Card key={collegeAccess.collegeId} className="border-2">
  //               <CardHeader className="pb-3">
  //                 <CardTitle className="text-xl flex items-center justify-between">
  //                   <span className="flex items-center gap-2">
  //                     <Building className="w-5 h-5" />
  //                     {collegeAccess.collegeName}
  //                   </span>
  //                   <Button
  //                     variant="ghost"
  //                     size="sm"
  //                     onClick={() => removeCollege(collegeAccess.collegeId)}
  //                   >
  //                     <Trash2 className="w-4 h-4" />
  //                   </Button>
  //                 </CardTitle>
  //               </CardHeader>
  //               <CardContent className="space-y-4">
  //                 {/* Add Department */}
  //                 <div>
  //                   <Label className="flex items-center gap-2 mb-2">
  //                     <GraduationCap className="w-4 h-4" />
  //                     Add Departments
  //                   </Label>
  //                   <Select onValueChange={(value) => {
  //                     const dept = mockDepartments.find(d => d.id === value);
  //                     if (dept) addDepartment(collegeAccess.collegeId, dept.id, dept.name);
  //                   }}>
  //                     <SelectTrigger>
  //                       <SelectValue placeholder="Add a department" />
  //                     </SelectTrigger>
  //                     <SelectContent>
  //                       {getAvailableDepartments(collegeAccess.collegeId)
  //                         .filter(dept => !collegeAccess.departments.find(d => d.departmentId === dept.id))
  //                         .map(dept => (
  //                         <SelectItem key={dept.id} value={dept.id}>
  //                           {dept.name}
  //                         </SelectItem>
  //                       ))}
  //                     </SelectContent>
  //                   </Select>
  //                 </div>

  //                 {/* Departments */}
  //                 {collegeAccess.departments.map(department => (
  //                   <Card key={department.departmentId} className="ml-4">
  //                     <CardHeader className="pb-3">
  //                       <CardTitle className="text-lg flex items-center justify-between">
  //                         <span className="flex items-center gap-2">
  //                           <GraduationCap className="w-4 h-4" />
  //                           {department.departmentName}
  //                         </span>
  //                         <Button
  //                           variant="ghost"
  //                           size="sm"
  //                           onClick={() => removeDepartment(collegeAccess.collegeId, department.departmentId)}
  //                         >
  //                           <Trash2 className="w-4 h-4" />
  //                         </Button>
  //                       </CardTitle>
  //                     </CardHeader>
  //                     <CardContent className="space-y-4">
  //                       {/* Add Course */}
  //                       <div>
  //                         <Label className="flex items-center gap-2 mb-2">
  //                           <BookOpen className="w-4 h-4" />
  //                           Add Courses
  //                         </Label>
  //                         <Select onValueChange={(value) => {
  //                           const course = mockCourses.find(c => c.id === value);
  //                           if (course) addCourse(collegeAccess.collegeId, department.departmentId, course.id, course.name);
  //                         }}>
  //                           <SelectTrigger>
  //                             <SelectValue placeholder="Add a course" />
  //                           </SelectTrigger>
  //                           <SelectContent>
  //                             {getAvailableCourses(department.departmentId)
  //                               .filter(course => !department.courses.find(c => c.courseId === course.id))
  //                               .map(course => (
  //                               <SelectItem key={course.id} value={course.id}>
  //                                 {course.name}
  //                               </SelectItem>
  //                             ))}
  //                           </SelectContent>
  //                         </Select>
  //                       </div>

  //                       {/* Courses */}
  //                       {department.courses.map(course => (
  //                         <Card key={course.courseId} className="ml-4">
  //                           <CardHeader className="pb-2">
  //                             <CardTitle className="text-base flex items-center justify-between">
  //                               <span className="flex items-center gap-2">
  //                                 <BookOpen className="w-3 h-3" />
  //                                 {course.courseName}
  //                               </span>
  //                               <Button
  //                                 variant="ghost"
  //                                 size="sm"
  //                                 onClick={() => removeCourse(collegeAccess.collegeId, department.departmentId, course.courseId)}
  //                               >
  //                                 <Trash2 className="w-3 h-3" />
  //                               </Button>
  //                             </CardTitle>
  //                           </CardHeader>
  //                           <CardContent className="space-y-3">
  //                             {/* Add Batch Year */}
  //                             <div>
  //                               <Label className="text-sm mb-2 block">Add Batch Access</Label>
  //                               <Select onValueChange={(value) => {
  //                                 addBatchAccess(collegeAccess.collegeId, department.departmentId, course.courseId, parseInt(value));
  //                               }}>
  //                                 <SelectTrigger className="w-full">
  //                                   <SelectValue placeholder="Add batch year" />
  //                                 </SelectTrigger>
  //                                 <SelectContent>
  //                                   {batchYears
  //                                     .filter(year => !course.batchAccess.find(b => b.batchYear === year))
  //                                     .map(year => (
  //                                     <SelectItem key={year} value={year.toString()}>
  //                                       Batch {year}
  //                                     </SelectItem>
  //                                   ))}
  //                                 </SelectContent>
  //                               </Select>
  //                             </div>

  //                             {/* Batch Access */}
  //                             {course.batchAccess.map(batch => (
  //                               <div key={batch.batchYear} className="space-y-2 p-3 border rounded">
  //                                 <div className="flex items-center gap-2">
  //                                   <Badge variant="outline">Batch {batch.batchYear}</Badge>
  //                                 </div>
  //                                 <div className="grid grid-cols-4 gap-2">
  //                                   {sections.map(section => (
  //                                     <div key={section} className="flex items-center space-x-2">
  //                                       <Checkbox
  //                                         id={`${collegeAccess.collegeId}-${course.courseId}-${batch.batchYear}-${section}`}
  //                                         checked={batch.sections.includes(section)}
  //                                         onCheckedChange={() => 
  //                                           toggleSection(collegeAccess.collegeId, department.departmentId, course.courseId, batch.batchYear, section)
  //                                         }
  //                                       />
  //                                       <Label 
  //                                         htmlFor={`${collegeAccess.collegeId}-${course.courseId}-${batch.batchYear}-${section}`}
  //                                         className="text-sm"
  //                                       >
  //                                         Section {section}
  //                                       </Label>
  //                                     </div>
  //                                   ))}
  //                                 </div>
  //                               </div>
  //                             ))}
  //                           </CardContent>
  //                         </Card>
  //                       ))}
  //                     </CardContent>
  //                   </Card>
  //                 ))}
  //               </CardContent>
  //             </Card>
  //           ))}
  //         </div>
  //       </ScrollArea>

  //       <div className="flex justify-end gap-2 pt-4">
  //         <Button variant="outline" onClick={() => onOpenChange(false)}>
  //           Cancel
  //         </Button>
  //         <Button 
  //           onClick={handleSave}
  //           disabled={collegeAccesses.length === 0 || !collegeAccesses.some(ca => ca.departments.length > 0)}
  //         >
  //           Save Access
  //         </Button>
  //       </div>
  //     </DialogContent>
  //   </Dialog>
  // );
};



import { Input } from '@/components/ui/input';


import { Search, Filter, CheckCircle, XCircle, X, Sparkles } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SearchWithInput } from '../shared/SearchWithInput';
import { useAddFacultyScopeMutation, useLazyGetCollegesQuery } from '@/services/admin';
import { getRandomColor } from '@/lib/genrateRandomColor';

interface SearchFilterAdvancedProps {
  onSearch: (searchTerm: string) => void;
  onFilter: (filters: {
    college?: string;
    department?: string;
    course?: string;
    accessStatus?: string;
  }) => void;
  activeFilters: {
    college?: string;
    department?: string;
    course?: string;
    accessStatus?: string;
  };
  randomColor:object;
}

export const SearchFilterAdvanced = ({ onSearch,randomColor, onFilter, activeFilters }: SearchFilterAdvancedProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    const newFilters = { ...activeFilters };
    if (value === 'all' || value === '') {
      delete newFilters[filterType as keyof typeof newFilters];
    } else {
      newFilters[filterType as keyof typeof newFilters] = value;
    }
    onFilter(newFilters);
  };

  const clearAllFilters = () => {
    onFilter({});
  };

  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  // Mock data for filter options
  const colleges = [
    { id: 'eng1', name: 'Engineering' },
    { id: 'sci1', name: 'Sciences' },
    { id: 'med1', name: 'Medicine' },
    { id: 'art1', name: 'Arts & Humanities' },
    { id: 'bus1', name: 'Business' }
  ];

  const departments = [
    { id: 'cs1', name: 'Computer Science' },
    { id: 'ee1', name: 'Electrical Engineering' },
    { id: 'me1', name: 'Mechanical Engineering' },
    { id: 'math1', name: 'Mathematics' },
    { id: 'phy1', name: 'Physics' },
    { id: 'bio1', name: 'Biology' }
  ];

  const courses = [
    { id: 'cs101', name: 'Data Structures' },
    { id: 'cs102', name: 'Algorithms' },
    { id: 'cs103', name: 'Database Systems' },
    { id: 'ee101', name: 'Circuit Analysis' },
    { id: 'math101', name: 'Calculus I' },
    { id: 'phy101', name: 'Classical Mechanics' }
  ];

  return (
    <div className="bg-card border rounded-xl shadow-lg p-6 space-y-6 transition-all duration-300 hover:shadow-xl">
      {/* Header with Icon */}
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Sparkles className={"w-5 h-5  animate-pulse border-1 " + `text-${randomColor?.color}-800` }/>
        </div>
        <h3 className="text-lg font-semibold text-foreground">Advanced Search & Filters</h3>
      </div>

      {/* Search Bar with Enhanced Design */}
      <div className="relative group">
        <Search className={`text-${randomColor?.color}-600 `+" absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 transition-colors group-focus-within:text-primary"} />
        <Input
          placeholder="Search faculty by name, email, or any keyword..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-12 pr-4 h-12 text-base border-2 transition-all duration-200 focus:border-primary focus:shadow-md hover:border-primary/50"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSearchChange('')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Filter Dropdowns with Icons and Animation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="space-y-2 group">
          <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
            <Building className={ `text-${randomColor?.color}-600 ` + "w-4 h-4" } />
            College
          </label>
          <Select
            value={activeFilters.college || 'all'}
            onValueChange={(value) => handleFilterChange('college', value)}
          >
            <SelectTrigger className="h-11 transition-all duration-200 hover:border-primary/50 focus:border-primary">
              <SelectValue placeholder="All Colleges" />
            </SelectTrigger>
            <SelectContent className="animate-fade-in">
              <SelectItem value="all" className="hover:bg-primary/5">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  All Colleges
                </div>
              </SelectItem>
              {colleges.map((college) => (
                <SelectItem key={college.id} value={college.id} className="hover:bg-primary/5">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-primary" />
                    {college.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 group">
          <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
            <GraduationCap  className={ `text-${randomColor?.color}-600 ` + "w-4 h-4" } />
            Department
          </label>
          <Select
            value={activeFilters.department || 'all'}
            onValueChange={(value) => handleFilterChange('department', value)}
          >
            <SelectTrigger className="h-11 transition-all duration-200 hover:border-primary/50 focus:border-primary">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent className="animate-fade-in">
              <SelectItem value="all" className="hover:bg-primary/5">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-muted-foreground" />
                  All Departments
                </div>
              </SelectItem>
              {departments.map((department) => (
                <SelectItem key={department.id} value={department.id} className="hover:bg-primary/5">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-primary" />
                    {department.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 group">
          <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
            <BookOpen  className={ `text-${randomColor?.color}-600 ` + "w-4 h-4" } />
            Course
          </label>
          <Select
            value={activeFilters.course || 'all'}
            onValueChange={(value) => handleFilterChange('course', value)}
          >
            <SelectTrigger className="h-11 transition-all duration-200 hover:border-primary/50 focus:border-primary">
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent className="animate-fade-in">
              <SelectItem value="all" className="hover:bg-primary/5">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  All Courses
                </div>
              </SelectItem>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id} className="hover:bg-primary/5">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    {course.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 group">
          <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
            <Users  className={ `text-${randomColor?.color}-600 ` + "w-4 h-4" }/>
            Access Status
          </label>
          <Select
            value={activeFilters.accessStatus || 'all'}
            onValueChange={(value) => handleFilterChange('accessStatus', value)}
          >
            <SelectTrigger className="h-11 transition-all duration-200 hover:border-primary/50 focus:border-primary">
              <SelectValue placeholder="All Faculty" />
            </SelectTrigger>
            <SelectContent className="animate-fade-in">
              <SelectItem value="all" className="hover:bg-primary/5">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  All Faculty
                </div>
              </SelectItem>
              <SelectItem value="with-access" className="hover:bg-primary/5">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  With Access
                </div>
              </SelectItem>
              <SelectItem value="without-access" className="hover:bg-primary/5">
                <div className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  Without Access
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters Section with Enhanced Animation */}
      {hasActiveFilters && (
        <div className="animate-fade-in flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border/50">
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Filter className="w-4 h-4" />
              Active Filters:
            </div>
            {activeFilters.college && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 text-primary px-3 py-1.5 rounded-full text-sm border border-primary/20 animate-scale-in">
                <Building className="w-3 h-3" />
                <span className="font-medium">{colleges.find(c => c.id === activeFilters.college)?.name}</span>
              </div>
            )}
            {activeFilters.department && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 text-primary px-3 py-1.5 rounded-full text-sm border border-primary/20 animate-scale-in">
                <GraduationCap className="w-3 h-3" />
                <span className="font-medium">{departments.find(d => d.id === activeFilters.department)?.name}</span>
              </div>
            )}
            {activeFilters.course && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 text-primary px-3 py-1.5 rounded-full text-sm border border-primary/20 animate-scale-in">
                <BookOpen className="w-3 h-3" />
                <span className="font-medium">{courses.find(c => c.id === activeFilters.course)?.name}</span>
              </div>
            )}
            {activeFilters.accessStatus && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-primary/10 to-primary/5 text-primary px-3 py-1.5 rounded-full text-sm border border-primary/20 animate-scale-in">
                {activeFilters.accessStatus === 'with-access' ? (
                  <>
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span className="font-medium">With Access</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3 text-red-500" />
                    <span className="font-medium">Without Access</span>
                  </>
                )}
              </div>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="flex items-center gap-2 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20 transition-all duration-200 self-start sm:self-auto"
          >
            <X className="w-3 h-3" />
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
};


import {
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { Switch } from "@/components/ui/switch";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function PermissionDialog() {
  const [permissions, setPermissions] = useState<string[]>(["read"]);
  const [status, setStatus] = useState("pending");

  const handleCheckboxChange = (permission: string) => {
    setPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((perm) => perm !== permission)
        : [...prev, permission]
    );
  };

  const handleSubmit = () => {
    console.log("Permissions:", permissions);
    console.log("Status:", status);
    // Submit to backend here
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Manage Access</Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Set Access Permissions</DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Card className="p-4 space-y-6 rounded-2xl shadow-xl">

            {/* Permission Checkboxes */}
            <div className="space-y-2">
              <p className="font-semibold text-gray-700 dark:text-gray-200">Permissions</p>
              {["create", "read", "update", "delete"].map((perm) => (
                <div key={perm} className="flex items-center gap-2">
                  <Checkbox
                    id={perm}
                    checked={permissions.includes(perm)}
                    onCheckedChange={() => handleCheckboxChange(perm)}
                  />
                  <Label htmlFor={perm} className="capitalize">
                    {perm}
                  </Label>
                </div>
              ))}
            </div>

            {/* Status Selector */}
            <div className="space-y-2">
              <p className="font-semibold text-gray-700 dark:text-gray-200">Status</p>
              <RadioGroup
                value={status}
                onValueChange={setStatus}
                className="flex flex-col gap-2"
              >
                {["active", "pending", "denied"].map((stat) => (
                  <div key={stat} className="flex items-center space-x-2">
                    <RadioGroupItem value={stat} id={stat} />
                    <Label htmlFor={stat} className="capitalize">{stat}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </Card>
        </motion.div>

        <DialogFooter className="mt-4">
          <Button onClick={handleSubmit} className="w-full">
            Save Access
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { Loader2 } from "lucide-react";
import { useBeforeUnload, useBlockBackNavigation } from '@/utils/useBrowserEvent';


export function LoadingPage() {
  const bubbleCount = 12;

  const random = (min: number, max: number) =>
    Math.random() * (max - min) + min;

  const bubbles = Array.from({ length: bubbleCount }, (_, i) => ({
    size: random(30, 60),
    top: random(0, 100),
    left: random(0, 100),
    duration: random(6, 12),
    delay: random(0, 3),
    blur: random(4, 16),
    opacity: random(0.3, 0.5),
  }));
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  return (
    <div className="absolute z-[100]  top-0 left-0 w-full h-full flex flex-col items-center justify-center h-screen bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-800 overflow-hidden">
      {/* Background Bubbles */}
      {bubbles.map((bubble, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-indigo-400 dark:bg-indigo-600"
          style={{
            width: bubble.size,
            height: bubble.size,
            top: `${bubble.top}%`,
            left: `${bubble.left}%`,
            opacity: bubble.opacity,
            filter: `blur(${bubble.blur}px)`,
          }}
          animate={{
            y: [0, -30, 0],
          }}
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            repeatType: "loop",
            delay: bubble.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Loading Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10 text-center p-6 bg-white/60 dark:bg-slate-900/60 rounded-2xl shadow-2xl backdrop-blur-2xl border border-white/30 dark:border-slate-700/50"
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "linear",
          }}
        >
          <Loader2 className="mx-auto h-10 w-10 text-indigo-500 dark:text-indigo-400" />
        </motion.div>

        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mt-4">
          Granting Faculty Access
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
          Please wait while we securely configure their permissions.
        </p>
      </motion.div>
    </div>
  );
}
export const FacultyAccess = ({
  // faculty,
  open,
  // onOpenChange,
  // onSave,
  existingAccess
}: FacultyAccessDialogProps) => {
  const [collegeAccesses, setCollegeAccesses] = useState<{
    collegeId: string;
    collegeName: string;
    departments: {
      departmentId: string;
      departmentName: string;
      courses: {
        courseId: string;
        courseName: string;
        batchAccess: {
          batchYear: number;
          sections: string[];
        }[];
      }[];
    }[];
  }[]>([]);
  const navigate = useNavigate();
  const [faculty,setFaculty]=useState({});
  const location=useLocation();
  const [isDirty, setIsDirty] = useState(false);
const [addScope]=useAddFacultyScopeMutation();
  // Block both tab close and internal route navigation
  useBeforeUnload(isDirty, "You have unsaved changes. Are you sure you want to leave?");
  useBlockBackNavigation(isDirty);  
  const [selectedCollege, setSelectedColl] = useState<any[]>([])
  useEffect(() => {
    // if (open && faculty) {
    //   // Initialize with existing access or empty
    //   if (existingAccess.length > 0) {
    //     setCollegeAccesses(existingAccess.map(access => ({
    //       collegeId: access.collegeId,
    //       collegeName: access.collegeName,
    //       departments: access.departments
    //     })));
    //   } else {
    //     setCollegeAccesses([]);
    //   }
    // }

    console.log(location?.state);
    setFaculty(location?.state);
    if(location?.state){
      setCollegeAccesses(location?.state?.accessScope);
      console.log(location?.state?.accessScope);
      
    }
    
  }, [open, faculty, existingAccess]);

  const addCollege = (collegeId: string, name: string) => {
    // const college = mockColleges.find(c => c.id === collegeId);
    // if (!college || collegeAccesses.find(ca => ca.collegeId === collegeId)) return;

    setCollegeAccesses(prev => [...prev, {
      collegeId,
      collegeName: name ?? "",
      departments: []
    }]);
    setIsDirty(true)
  };

  const removeCollege = (collegeId: string) => {
    setCollegeAccesses(prev => prev.filter(ca => ca.collegeId !== collegeId));
    setSelectedColl(prev => prev.filter(ca => ca?._id !== collegeId));
  };

  const addDepartment = (collegeId: string, departmentId: string, departmentName: string) => {
    setCollegeAccesses(prev => prev.map(college => {
      if (college.collegeId === collegeId) {
        if (college.departments.find(d => d.departmentId === departmentId)) return college;
        return {
          ...college,
          departments: [...college.departments, {
            departmentId,
            departmentName,
            courses: []
          }]
        };
      }
      return college;
    }));
  };

  const removeDepartment = (collegeId: string, departmentId: string) => {
    setCollegeAccesses(prev => prev.map(college => {
      if (college.collegeId === collegeId) {
        return {
          ...college,
          departments: college.departments.filter(d => d.departmentId !== departmentId)
        };
      }
      return college;
    }));
  };

  const addCourse = (collegeId: string, departmentId: string, courseId: string, courseName: string) => {
    setCollegeAccesses(prev => prev.map(college => {
      if (college.collegeId === collegeId) {
        return {
          ...college,
          departments: college.departments.map(dept => {
            if (dept.departmentId === departmentId) {
              if (dept.courses.find(c => c.courseId === courseId)) return dept;
              return {
                ...dept,
                courses: [...dept.courses, {
                  courseId,
                  courseName,
                  batchAccess: []
                }]
              };
            }
            return dept;
          })
        };
      }
      return college;
    }));
  };

  const removeCourse = (collegeId: string, departmentId: string, courseId: string) => {
    setCollegeAccesses(prev => prev.map(college => {
      if (college.collegeId === collegeId) {
        return {
          ...college,
          departments: college.departments.map(dept => {
            if (dept.departmentId === departmentId) {
              return {
                ...dept,
                courses: dept.courses.filter(c => c.courseId !== courseId)
              };
            }
            return dept;
          })
        };
      }
      return college;
    }));
  };

  const addBatchAccess = (collegeId: string, departmentId: string, courseId: string, batchYear: number) => {
    setCollegeAccesses(prev => prev.map(college => {
      if (college.collegeId === collegeId) {
        return {
          ...college,
          departments: college.departments.map(dept => {
            if (dept.departmentId === departmentId) {
              return {
                ...dept,
                courses: dept.courses.map(course => {
                  if (course.courseId === courseId) {
                    if (course.batchAccess.find(b => b.batchYear === batchYear)) return course;
                    return {
                      ...course,
                      batchAccess: [...course.batchAccess, {
                        batchYear,
                        sections: []
                      }]
                    };
                  }
                  return course;
                })
              };
            }
            return dept;
          })
        };
      }
      return college;
    }));
  };

  const toggleSection = (collegeId: string, departmentId: string, courseId: string, batchYear: number, section: string) => {
    setCollegeAccesses(prev => prev.map(college => {
      if (college.collegeId === collegeId) {
        return {
          ...college,
          departments: college.departments.map(dept => {
            if (dept.departmentId === departmentId) {
              return {
                ...dept,
                courses: dept.courses.map(course => {
                  if (course.courseId === courseId) {
                    return {
                      ...course,
                      batchAccess: course.batchAccess.map(batch => {
                        if (batch.batchYear === batchYear) {
                          const newSections = batch.sections.includes(section)
                            ? batch.sections.filter(s => s !== section)
                            : [...batch.sections, section];
                          return { ...batch, sections: newSections };
                        }
                        return batch;
                      })
                    };
                  }
                  return course;
                })
              };
            }
            return dept;
          })
        };
      }
      return college;
    }));
  };

  const handleSave = async() => {
    if (!faculty || collegeAccesses.length === 0) return;

    // Save each college access as a separate access scope
    collegeAccesses.forEach(collegeAccess => {
      if (collegeAccess.departments.length > 0) {
        const newAccessScope: AccessScope = {
          facultyId: faculty?._id,
          collegeId: collegeAccess.collegeId,
          collegeName: collegeAccess.collegeName,
          departments: collegeAccess.departments
        };

        console.log(newAccessScope);


      }
    });


    console.log({scope:collegeAccesses,id:faculty?._id});
await addScope({scope:collegeAccesses,id:faculty?._id}).unwrap().then(res=>{
  console.log(res);
  
}).catch(err=>{
  console.log(err);

})
    
  };


  const [college, { currentData: data, isLoading }] = useLazyGetCollegesQuery({
    refetchOnFocus: true,
    refetchOnReconnect: true
  })
  const randomColor = useMemo(() => getRandomColor("border"), []);

  const getSelectedDept = (collId: string, deptId: string) => {


    try {
      const data = selectedCollege?.filter(item => item?._id === collId)[0].departments?.filter((i) => i?._id === deptId)[0].courses;

      return data
    } catch (error) {
      return []
    }


  }

  const ShieldButton = () => {
    return (
      <span className='flex flex-1 justify-end '>
        <Button variant="ghost" title='permissions' size="sm" className='float-end' onClick={() => ""}>
          <Shield className="w-4 h-4" />
        </Button>
      </span>
    )
  }  
  
  if (!faculty) return (<div className='center w-full capitalize flex-col py-20 bg-color gap-4 sm:gap-8'>
<span className='animate-btn center gap-2 text-2xl md:text-4xl font-bold'>    <Lock className='size-10 text-pink-300 '/> <p className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-4xl font-bold text-transparent ">  Locked</p></span>
  <Button className='hover:animate-btn relative  transition-all ease duration-700 bg-gradient-to-br from-purple-500 via-vilot-400 to-pink-200 dark:bg-none dark:bg-gray-900' onClick={()=>navigate(-1)} title='Go Back & choose faculty! ' >Go Back & choose faculty!</Button>
  </div>);
  return (
    <section className="relative max-w-14xl min-h-screen  w-full p-6 border rounded-md shadow-sm bg-white dark:bg-slate-900">
      {false && <LoadingPage />}
      <Button className='float-start sm:float-end' onClick={() => navigate(-1)} > back to </Button>
      <br />
      <h2 className="text-2xl font-semibold flex items-center gap-2 mb-6">
        <Users className="w-5 h-5" />
        Set Multi-College Access for {faculty.name}
      </h2>
    {false &&  <PermissionDialog />}

      <div className="space-y-6">
        {/* Add College */}
        <div className="space-y-2">

          <SearchWithInput labelIcon={<Building className="w-4 h-4" />} labelName=' Add College Access' value={undefined} randomColor={randomColor} inputPlaceholder='Add a college'
            onChange={async (search) => college({ search, searchType: "deep" }).unwrap()}
            onValueChange={(search) => {
    //   setCollegeAccesses(prev => [...prev, {
    //     ...collegeAccesses?.
    //   collegeName: name ?? "",
    // }]);
            }}
            onSelect={(res) => {
              console.log(res, "res");
              addCollege(res?._id, res?.name)
              setSelectedColl(prev => [...prev, res])
            }


            }
            onReset={() => {

            }}
            data={data?.colleges}
          />
        </div>

        {/* College Access Cards */}
        {collegeAccesses?.map(collegeAccess => (
          <Card key={collegeAccess?.collegeId} className="border-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  {collegeAccess?.collegeName}
                </span>
                <ShieldButton />
                <Button variant="ghost" size="sm" onClick={() => removeCollege(collegeAccess?.collegeId)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Department */}
              <div>


                <SearchWithInput labelIcon={<GraduationCap className="w-4 h-4" />}
                  value={undefined} randomColor={randomColor} inputPlaceholder='Search Department...'
                  labelName='Add Departments'
                  // onChange={async (search) => { }}
                  onSelect={(res) => {
                    addDepartment(collegeAccess.collegeId, res?._id, res.name);
                  }}
                  onValueChange={(search) => {

                  }}
                  data={selectedCollege?.filter(item => item?._id === collegeAccess?.collegeId)[0]?.departments}
                  onReset={() => {

                  }}
                />
              </div>

              {/* Departments */}
              {collegeAccess.departments.map(department => (
                <Card key={department.departmentId} className="ml-4">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        {department.departmentName}
                      </span>
                      <ShieldButton />
                      <Button variant="ghost" size="sm" onClick={() => removeDepartment(collegeAccess.collegeId, department.departmentId)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Add Course */}
                    <div>




                      <SearchWithInput labelIcon={<BookOpen className="w-4 h-4" />}
                        value={undefined} randomColor={randomColor} inputPlaceholder='Search Courses...'
                        labelName='Add Courses'
                        // onChange={async (search) => { }}
                        onSelect={(res) => {
                          addCourse(collegeAccess.collegeId, department.departmentId, res?._id, res?.name)
                        }}
                        onValueChange={(search) => {

                        }}
                        data={getSelectedDept(collegeAccess?.collegeId, department?.departmentId)}
                        onReset={() => {

                        }}
                      />
                    </div>

                    {/* Courses */}
                    {department.courses.map(course => (
                      <Card key={course.courseId} className="ml-4">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <BookOpen className="w-3 h-3" />
                              {course.courseName}
                            </span>
                            <ShieldButton />

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCourse(collegeAccess.collegeId, department.departmentId, course.courseId)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {/* Add Batch Year */}
                          <div>
                            <Label className="text-sm mb-2 block">Add Batch Access</Label>
                            <Select onValueChange={(value) => {
                              addBatchAccess(collegeAccess.collegeId, department.departmentId, course.courseId, parseInt(value));
                            }}>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Add batch year" />
                              </SelectTrigger>
                              <SelectContent>
                                {batchYears
                                  .filter(year => !course.batchAccess.find(b => b.batchYear === year))
                                  .map(year => (
                                    <SelectItem key={year} value={year.toString()}>
                                      Batch {year}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Batch Access */}
                          {course.batchAccess.map(batch => (
                            <div key={batch.batchYear} className="space-y-2 p-3 border rounded">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">Batch {batch.batchYear}</Badge>
                              </div>
                              <div className="grid grid-cols-4 gap-2">
                                {sections.map(section => (
                                  <div key={section} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`${collegeAccess.collegeId}-${course.courseId}-${batch.batchYear}-${section}`}
                                      checked={batch.sections.includes(section)}
                                      onCheckedChange={() =>
                                        toggleSection(collegeAccess.collegeId, department.departmentId, course.courseId, batch.batchYear, section)
                                      }
                                    />
                                    <Label
                                      htmlFor={`${collegeAccess.collegeId}-${course.courseId}-${batch.batchYear}-${section}`}
                                      className="text-sm"
                                    >
                                      Section {section}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end gap-2 pt-6">
        <Button variant="outline" onClick={() => ""}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={collegeAccesses.length === 0 || !collegeAccesses.some(ca => ca.departments.length > 0)}
        >
          Save Access
        </Button>
      </div>
    </section>

  )

};


