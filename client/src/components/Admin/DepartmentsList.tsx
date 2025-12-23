import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Search, BookOpen, Users, GraduationCap, Edit, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from '../shared/Toast';


interface Department {
  id: string;
  name: string;
  code: string;
  hodName: string;
  totalStudents: number;
  totalFaculty: number;
  courses: Course[];
}

interface Course {
  id: string;
  name: string;
  code: string;
  semester: number;
  credits: number;
  sections: Section[];
}

interface Section {
  id: string;
  name: string;
  capacity: number;
  enrolled: number;
  instructor: string;
}

interface DepartmentsListProps {
  collegeId: string;
  isEditMode: boolean;
  randomColor:any;
  departments:object;
}

const DepartmentsList = ({ collegeId,departments,randomColor ,isEditMode }: DepartmentsListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<{type: 'department' | 'course' | 'section', id: string} | null>(null);

  // Mock departments data
  // const departments: Department[] = [
  //   {
  //     id: '1',
  //     name: 'Computer Science Engineering',
  //     code: 'CSE',
  //     hodName: 'Dr. Alice Johnson',
  //     totalStudents: 480,
  //     totalFaculty: 24,
  //     courses: [
  //       {
  //         id: '1',
  //         name: 'Data Structures and Algorithms',
  //         code: 'CSE301',
  //         semester: 3,
  //         credits: 4,
  //         sections: [
  //           { id: '1', name: 'Section A', capacity: 60, enrolled: 58, instructor: 'Prof. Smith' },
  //           { id: '2', name: 'Section B', capacity: 60, enrolled: 55, instructor: 'Prof. Johnson' }
  //         ]
  //       },
  //       {
  //         id: '2',
  //         name: 'Database Management Systems',
  //         code: 'CSE401',
  //         semester: 4,
  //         credits: 3,
  //         sections: [
  //           { id: '3', name: 'Section A', capacity: 50, enrolled: 48, instructor: 'Dr. Brown' }
  //         ]
  //       }
  //     ]
  //   },
  //   {
  //     id: '2',
  //     name: 'Mechanical Engineering',
  //     code: 'ME',
  //     hodName: 'Dr. Robert Wilson',
  //     totalStudents: 420,
  //     totalFaculty: 20,
  //     courses: [
  //       {
  //         id: '3',
  //         name: 'Thermodynamics',
  //         code: 'ME301',
  //         semester: 3,
  //         credits: 4,
  //         sections: [
  //           { id: '4', name: 'Section A', capacity: 70, enrolled: 68, instructor: 'Prof. Davis' }
  //         ]
  //       }
  //     ]
  //   }
  // ];

  const {color,colorWithValue}=randomColor;
  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (type: 'department' | 'course' | 'section', id: string) => {
    setEditingItem({ type, id });
    toast({
      title: "Edit Mode",
      description: `Editing ${type}: ${id}`,
    });
  };

  const handleSave = () => {
    toast({
      title: "Changes Saved",
      description: "Your changes have been saved successfully.",
    });
    setEditingItem(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-color">Departments & Courses</h2>
          <p className="text-color-thin">Manage academic departments, courses, and sections</p>
        </div>
        
        {isEditMode && (
          <div className="flex gap-2">
            <Link to="/departments/create">
              <Button className="hover-scale flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Department
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search departments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 placeholder:text-color-thin"
        />
      </div>

      {/* Departments */}
      <div className="space-y-4">
        {departments && departments?.length>0 && departments?.map((department, index) => (
          <Card key={department?._id} className="animate-fade-in hover-scale" style={{animationDelay: `${index * 0.1}s`}}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg dark:bg-none dark:bg-slate-500/40 text-${colorWithValue}`}>
                    <BookOpen className="h-6 w-6 " />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{department?.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Badge variant="secondary">{department?.shortName	}</Badge>
                      <span>HOD: {department?.hodName}</span>
                    </CardDescription>
                  </div>
                </div>
                {isEditMode && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => handleEdit('department', department?._id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Department</DialogTitle>
                        <DialogDescription>
                          Make changes to the department information here.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <label htmlFor="dept-name" className="text-sm font-medium">
                            Department Name
                          </label>
                          <Input id="dept-name" defaultValue={department?.name} />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="dept-code" className="text-sm font-medium">
                            Department Code
                          </label>
                          <Input id="dept-code" defaultValue={department?.shortName} />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="hod-name" className="text-sm font-medium">
                            HOD Name
                          </label>
                          <Input id="hod-name" defaultValue={department?.hodName} />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={handleSave}>Save changes</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-color-thin">
                  <Users className="h-4 w-4" />
                  <span>{department?.totalStudents} Students</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-color-thin">
                  <GraduationCap className="h-4 w-4" />
                  <span>{department?.totalFaculty} Faculty</span>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Accordion type="single" collapsible>
                <AccordionItem value="courses">
                  <AccordionTrigger className="text-base font-medium">
                    Courses ({department?.courses.length})
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 mt-4">
                      {department?.courses?.map((course) => (
                        <Card key={course.id} className={`border-l-4 border-l-blue-200 border-l-${colorWithValue}`}>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="text-lg">{course?.name}</CardTitle>
                                <CardDescription className="flex items-center gap-2">
                                  <Badge variant="outline">{course?.code}</Badge>
                                  <span>Semester {course?.semester}</span>
                                  <span>•</span>
                                  <span>{course?.credits} Credits</span>
                                </CardDescription>
                              </div>
                              {isEditMode && (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" onClick={() => handleEdit('course', course?._id)}>
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                      <DialogTitle>Edit Course</DialogTitle>
                                      <DialogDescription>
                                        Make changes to the course information here.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                      <div className="space-y-2">
                                        <label htmlFor="course-name" className="text-sm font-medium">
                                          Course Name
                                        </label>
                                        <Input id="course-name" defaultValue={course?.name} />
                                      </div>
                                      <div className="space-y-2">
                                        <label htmlFor="course-code" className="text-sm font-medium">
                                          Course Code
                                        </label>
                                        <Input id="course-code" defaultValue={course?.code} />
                                      </div>
                                      <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-2">
                                          <label htmlFor="semester" className="text-sm font-medium">
                                            Semester
                                          </label>
                                          <Input id="semester" type="number" defaultValue={course?.semester} />
                                        </div>
                                        <div className="space-y-2">
                                          <label htmlFor="credits" className="text-sm font-medium">
                                            Credits
                                          </label>
                                          <Input id="credits" type="number" defaultValue={course?.credits} />
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex justify-end">
                                      <Button onClick={handleSave}>Save changes</Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              )}
                            </div>
                          </CardHeader>
                          
                          <CardContent className=''>
                            <div className="space-y-3">
                              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                <ChevronRight className="h-4 w-4" />
                                Sections ({course?.sections?.length})
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {course?.sections?.map((section) => (
                                  <div key={section?._id} className="p-3 bg-gray-50  dark:bg-gray-800 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="font-medium">{section.name}</span>
                                      <div className="flex items-center gap-2">
                                        <Badge variant={section?.enrolled >= section?.capacity ? "destructive" : "default"}>
                                          {section?.enrolled}/{section?.capacity}
                                        </Badge>
                                        {isEditMode && (
                                          <Dialog>
                                            <DialogTrigger asChild>
                                              <Button variant="ghost" size="sm" onClick={() => handleEdit('section', section?._id)}>
                                                <Edit className="h-3 w-3" />
                                              </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[425px]">
                                              <DialogHeader>
                                                <DialogTitle>Edit Section</DialogTitle>
                                                <DialogDescription>
                                                  Make changes to the section information here.
                                                </DialogDescription>
                                              </DialogHeader>
                                              <div className="grid gap-4 py-4">
                                                <div className="space-y-2">
                                                  <label htmlFor="section-name" className="text-sm font-medium">
                                                    Section Name
                                                  </label>
                                                  <Input id="section-name" defaultValue={section?.name} />
                                                </div>
                                                <div className="space-y-2">
                                                  <label htmlFor="instructor" className="text-sm font-medium">
                                                    Instructor
                                                  </label>
                                                  <Input id="instructor" defaultValue={section.instructor} />
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                  <div className="space-y-2">
                                                    <label htmlFor="capacity" className="text-sm font-medium">
                                                      Capacity
                                                    </label>
                                                    <Input id="capacity" type="number" defaultValue={section.capacity} />
                                                  </div>
                                                  <div className="space-y-2">
                                                    <label htmlFor="enrolled" className="text-sm font-medium">
                                                      Enrolled
                                                    </label>
                                                    <Input id="enrolled" type="number" defaultValue={section.enrolled} />
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="flex justify-end">
                                                <Button onClick={handleSave}>Save changes</Button>
                                              </div>
                                            </DialogContent>
                                          </Dialog>
                                        )}
                                      </div>
                                    </div>
                                    <p className="text-sm text-color-thin">Instructor: {section.instructor}</p>
                                  </div>
                                ))}
                              </div>
                              {isEditMode && (
                                <Button variant="outline" size="sm" className="mt-2">
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Section
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      {isEditMode && (
                        <Button variant="outline" className="w-full">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Course
                        </Button>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredDepartments.length === 0 && (
        <div className="text-center py-12 animate-fade-in">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No departments found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first department'}
          </p>
          {isEditMode && !searchTerm && (
            <Link to="/departments/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create First Department
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default DepartmentsList;