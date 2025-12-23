
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  BookOpen, 
  Users, 
  Award, 
  Building,
  GraduationCap,
  Clock,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  Camera
} from 'lucide-react';
import { toast } from '@/components/shared/Toast';


interface Department {
  id: string;
  name: string;
  code: string;
  studentCount: number;
  courseCount: number;
}

interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  semester: string;
  studentCount: number;
  department: string;
}

interface FacultyProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  designation: string;
  department: string;
  joiningDate: string;
  qualification: string[];
  experience: string;
  avatar: string;
  employeeId: string;
}



const FacultyProfile = () => {

  const [activeTab, setActiveTab] = useState('profile');
  const [isVisible, setIsVisible] = useState(true);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingDepartment, setEditingDepartment] = useState<string | null>(null);
  const [editingCourse, setEditingCourse] = useState<string | null>(null);

  const [facultyData, setFacultyData] = useState<FacultyProfile>({
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@university.edu',
    phone: '+1 (555) 123-4567',
    address: '123 University Ave, Academic City, AC 12345',
    designation: 'Associate Professor',
    department: 'Computer Science',
    joiningDate: '2018-08-15',
    qualification: ['Ph.D. Computer Science', 'M.Tech Software Engineering', 'B.Tech Computer Science'],
    experience: '8 years',
    avatar: '/api/placeholder/150/150',
    employeeId: 'FAC001'
  });

  const [editData, setEditData] = useState<FacultyProfile>(facultyData);
  const [newQualification, setNewQualification] = useState('');

  const [departmentsHandled, setDepartmentsHandled] = useState<Department[]>([
    {
      id: '1',
      name: 'Computer Science',
      code: 'CS',
      studentCount: 150,
      courseCount: 8
    },
    {
      id: '2',
      name: 'Information Technology',
      code: 'IT',
      studentCount: 120,
      courseCount: 6
    }
  ]);

  const [editDepartmentData, setEditDepartmentData] = useState<Department | null>(null);

  const [coursesHandled, setCoursesHandled] = useState<Course[]>([
    {
      id: '1',
      name: 'Data Structures and Algorithms',
      code: 'CS301',
      credits: 4,
      semester: 'Fall 2024',
      studentCount: 45,
      department: 'Computer Science'
    },
    {
      id: '2',
      name: 'Database Management Systems',
      code: 'CS401',
      credits: 3,
      semester: 'Fall 2024',
      studentCount: 38,
      department: 'Computer Science'
    },
    {
      id: '3',
      name: 'Web Development',
      code: 'IT302',
      credits: 3,
      semester: 'Fall 2024',
      studentCount: 42,
      department: 'Information Technology'
    },
    {
      id: '4',
      name: 'Software Engineering',
      code: 'CS402',
      credits: 4,
      semester: 'Spring 2024',
      studentCount: 35,
      department: 'Computer Science'
    }
  ]);

  const [editCourseData, setEditCourseData] = useState<Course | null>(null);
  const [newDepartment, setNewDepartment] = useState<Omit<Department, 'id'>>({
    name: '',
    code: '',
    studentCount: 0,
    courseCount: 0
  });
  const [newCourse, setNewCourse] = useState<Omit<Course, 'id'>>({
    name: '',
    code: '',
    credits: 0,
    semester: '',
    studentCount: 0,
    department: ''
  });
  const [showNewDepartmentDialog, setShowNewDepartmentDialog] = useState(false);
  const [showNewCourseDialog, setShowNewCourseDialog] = useState(false);

  const handleEditToggle = (section?: string) => {
    if (section) {
      setEditingSection(editingSection === section ? null : section);
    }
  };

  const handleSave = () => {
    setFacultyData(editData);
    setEditingSection(null);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleCancel = () => {
    setEditData(facultyData);
    setEditingSection(null);
  };

  const handleInputChange = (field: keyof FacultyProfile, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const addQualification = () => {
    if (newQualification.trim()) {
      setEditData(prev => ({
        ...prev,
        qualification: [...prev.qualification, newQualification.trim()]
      }));
      setNewQualification('');
    }
  };

  const removeQualification = (index: number) => {
    setEditData(prev => ({
      ...prev,
      qualification: prev.qualification.filter((_, i) => i !== index)
    }));
  };

  const handleDepartmentEdit = (dept: Department) => {
    setEditDepartmentData(dept);
    setEditingDepartment(dept.id);
  };

  const saveDepartment = () => {
    if (editDepartmentData) {
      setDepartmentsHandled(prev => 
        prev.map(dept => 
          dept.id === editDepartmentData.id ? editDepartmentData : dept
        )
      );
      setEditingDepartment(null);
      setEditDepartmentData(null);
      toast({
        title: "Department Updated",
        description: "Department information has been updated successfully.",
      });
    }
  };

  const deleteDepartment = (id: string) => {
    setDepartmentsHandled(prev => prev.filter(dept => dept.id !== id));
    toast({
      title: "Department Deleted",
      description: "Department has been removed successfully.",
    });
  };

  const addDepartment = () => {
    if (newDepartment.name && newDepartment.code) {
      const dept: Department = {
        ...newDepartment,
        id: Date.now().toString()
      };
      setDepartmentsHandled(prev => [...prev, dept]);
      setNewDepartment({ name: '', code: '', studentCount: 0, courseCount: 0 });
      setShowNewDepartmentDialog(false);
      toast({
        title: "Department Added",
        description: "New department has been added successfully.",
      });
    }
  };

  const handleCourseEdit = (course: Course) => {
    setEditCourseData(course);
    setEditingCourse(course.id);
  };

  const saveCourse = () => {
    if (editCourseData) {
      setCoursesHandled(prev => 
        prev.map(course => 
          course.id === editCourseData.id ? editCourseData : course
        )
      );
      setEditingCourse(null);
      setEditCourseData(null);
      toast({
        title: "Course Updated",
        description: "Course information has been updated successfully.",
      });
    }
  };

  const deleteCourse = (id: string) => {
    setCoursesHandled(prev => prev.filter(course => course.id !== id));
    toast({
      title: "Course Deleted",
      description: "Course has been removed successfully.",
    });
  };

  const addCourse = () => {
    if (newCourse.name && newCourse.code) {
      const course: Course = {
        ...newCourse,
        id: Date.now().toString()
      };
      setCoursesHandled(prev => [...prev, course]);
      setNewCourse({ name: '', code: '', credits: 0, semester: '', studentCount: 0, department: '' });
      setShowNewCourseDialog(false);
      toast({
        title: "Course Added",
        description: "New course has been added successfully.",
      });
    }
  };

  const totalStudents = coursesHandled.reduce((sum, course) => sum + course.studentCount, 0);
  const totalCourses = coursesHandled.length;
  const totalDepartments = departmentsHandled.length;

  return (
    <div className="min-h-screen w-full bg-color primary-p text-color">
      <div className="max-w-14xl mx-auto">
        {/* Header Section */}
        <div className={`mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0  bg-gradient-to-r from-blue-600 to-purple-600 opacity-10"></div>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative group">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                    <AvatarImage src={facultyData.avatar} alt={facultyData.name} />
                    <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      {facultyData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    size="sm" 
                    className="absolute bottom-0 right-0 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                  <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  {editingSection === 'header' ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={editData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="text-xl font-bold"
                        />
                      </div>
                      <div>
                        <Label htmlFor="designation">Designation</Label>
                        <Input
                          id="designation"
                          value={editData.designation}
                          onChange={(e) => handleInputChange('designation', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          value={editData.department}
                          onChange={(e) => handleInputChange('department', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="experience">Experience</Label>
                        <Input
                          id="experience"
                          value={editData.experience}
                          onChange={(e) => handleInputChange('experience', e.target.value)}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{facultyData.name}</h1>
                      <p className="text-xl text-gray-600 mb-4">{facultyData.designation}</p>
                    </>
                  )}
                  
                  {!editingSection && (
                    <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        {facultyData.department}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Joined {new Date(facultyData.joiningDate).getFullYear()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {facultyData.experience} Experience
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {editingSection === 'header' ? (
                    <>
                      <Button onClick={() => {handleSave(); setEditingSection(null);}} className="hover-scale">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" onClick={() => setEditingSection(null)} className="hover-scale">
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => handleEditToggle('header')} className="hover-scale">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className={`hover-scale transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-3xl font-bold text-blue-600">{totalStudents}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`hover-scale transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Courses</p>
                  <p className="text-3xl font-bold text-green-600">{totalCourses}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`hover-scale transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Departments</p>
                  <p className="text-3xl font-bold text-purple-600">{totalDepartments}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Building className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`hover-scale transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Experience</p>
                  <p className="text-3xl font-bold text-orange-600">{facultyData.experience.split(' ')[0]}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <Award className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Card className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile">Personal Info</TabsTrigger>
                <TabsTrigger value="departments">Departments</TabsTrigger>
                <TabsTrigger value="courses">Courses</TabsTrigger>
                <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">Personal Information</h3>
                  {editingSection !== 'personal' && (
                    <Button onClick={() => handleEditToggle('personal')} variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Info
                    </Button>
                  )}
                </div>

                {editingSection === 'personal' ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">Contact Information</h4>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={editData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            value={editData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Textarea
                            id="address"
                            value={editData.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            rows={3}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900">Professional Details</h4>
                        
                        <div className="space-y-2">
                          <Label htmlFor="employeeId">Employee ID</Label>
                          <Input
                            id="employeeId"
                            value={editData.employeeId}
                            onChange={(e) => handleInputChange('employeeId', e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="joiningDate">Joining Date</Label>
                          <Input
                            id="joiningDate"
                            type="date"
                            value={editData.joiningDate}
                            onChange={(e) => handleInputChange('joiningDate', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button onClick={() => {handleSave(); setEditingSection(null);}}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setEditingSection(null)}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold mb-4">Contact Information</h4>
                      
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Mail className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium">{facultyData.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Phone className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-medium">{facultyData.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600">Address</p>
                          <p className="font-medium">{facultyData.address}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold mb-4">Professional Details</h4>
                      
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <User className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600">Employee ID</p>
                          <p className="font-medium">{facultyData.employeeId}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Building className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600">Department</p>
                          <p className="font-medium">{facultyData.department}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-600">Joining Date</p>
                          <p className="font-medium">{new Date(facultyData.joiningDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="departments" className="mt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Department Management</h3>
                    <Dialog open={showNewDepartmentDialog} onOpenChange={setShowNewDepartmentDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Department
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Department</DialogTitle>
                          <DialogDescription>
                            Fill in the details for the new department.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="deptName">Department Name</Label>
                            <Input
                              id="deptName"
                              value={newDepartment.name}
                              onChange={(e) => setNewDepartment(prev => ({...prev, name: e.target.value}))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="deptCode">Department Code</Label>
                            <Input
                              id="deptCode"
                              value={newDepartment.code}
                              onChange={(e) => setNewDepartment(prev => ({...prev, code: e.target.value}))}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="studentCount">Student Count</Label>
                              <Input
                                id="studentCount"
                                type="number"
                                value={newDepartment.studentCount}
                                onChange={(e) => setNewDepartment(prev => ({...prev, studentCount: parseInt(e.target.value) || 0}))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="courseCount">Course Count</Label>
                              <Input
                                id="courseCount"
                                type="number"
                                value={newDepartment.courseCount}
                                onChange={(e) => setNewDepartment(prev => ({...prev, courseCount: parseInt(e.target.value) || 0}))}
                              />
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={addDepartment}>Add Department</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {departmentsHandled.map((dept, index) => (
                      <Card key={dept.id} className={`hover-scale animate-fade-in`} style={{ animationDelay: `${index * 0.1}s` }}>
                        <CardContent className="p-4">
                          {editingDepartment === dept.id && editDepartmentData ? (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>Department Name</Label>
                                <Input 
                                  value={editDepartmentData.name}
                                  onChange={(e) => setEditDepartmentData(prev => prev ? {...prev, name: e.target.value} : null)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Department Code</Label>
                                <Input 
                                  value={editDepartmentData.code}
                                  onChange={(e) => setEditDepartmentData(prev => prev ? {...prev, code: e.target.value} : null)}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Students</Label>
                                  <Input 
                                    type="number"
                                    value={editDepartmentData.studentCount}
                                    onChange={(e) => setEditDepartmentData(prev => prev ? {...prev, studentCount: parseInt(e.target.value) || 0} : null)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Courses</Label>
                                  <Input 
                                    type="number"
                                    value={editDepartmentData.courseCount}
                                    onChange={(e) => setEditDepartmentData(prev => prev ? {...prev, courseCount: parseInt(e.target.value) || 0} : null)}
                                  />
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" onClick={saveDepartment}>
                                  <Save className="w-4 h-4 mr-1" />
                                  Save
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => {setEditingDepartment(null); setEditDepartmentData(null);}}>
                                  <X className="w-4 h-4 mr-1" />
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold text-lg">{dept.name}</h4>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">{dept.code}</Badge>
                                  <Button size="sm" variant="ghost" onClick={() => handleDepartmentEdit(dept)}>
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={() => deleteDepartment(dept.id)}>
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </Button>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4 text-blue-500" />
                                  <span>{dept.studentCount} Students</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <BookOpen className="w-4 h-4 text-green-500" />
                                  <span>{dept.courseCount} Courses</span>
                                </div>
                              </div>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="courses" className="mt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Course Management</h3>
                    <Dialog open={showNewCourseDialog} onOpenChange={setShowNewCourseDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Course
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Course</DialogTitle>
                          <DialogDescription>
                            Fill in the details for the new course.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="courseName">Course Name</Label>
                              <Input
                                id="courseName"
                                value={newCourse.name}
                                onChange={(e) => setNewCourse(prev => ({...prev, name: e.target.value}))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="courseCode">Course Code</Label>
                              <Input
                                id="courseCode"
                                value={newCourse.code}
                                onChange={(e) => setNewCourse(prev => ({...prev, code: e.target.value}))}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="credits">Credits</Label>
                              <Input
                                id="credits"
                                type="number"
                                value={newCourse.credits}
                                onChange={(e) => setNewCourse(prev => ({...prev, credits: parseInt(e.target.value) || 0}))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="semester">Semester</Label>
                              <Input
                                id="semester"
                                value={newCourse.semester}
                                onChange={(e) => setNewCourse(prev => ({...prev, semester: e.target.value}))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="courseStudents">Students</Label>
                              <Input
                                id="courseStudents"
                                type="number"
                                value={newCourse.studentCount}
                                onChange={(e) => setNewCourse(prev => ({...prev, studentCount: parseInt(e.target.value) || 0}))}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="courseDepartment">Department</Label>
                            <Input
                              id="courseDepartment"
                              value={newCourse.department}
                              onChange={(e) => setNewCourse(prev => ({...prev, department: e.target.value}))}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={addCourse}>Add Course</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {coursesHandled.map((course, index) => (
                      <Card key={course.id} className={`hover-scale animate-fade-in`} style={{ animationDelay: `${index * 0.1}s` }}>
                        <CardContent className="p-4">
                          {editingCourse === course.id && editCourseData ? (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Course Name</Label>
                                  <Input 
                                    value={editCourseData.name}
                                    onChange={(e) => setEditCourseData(prev => prev ? {...prev, name: e.target.value} : null)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Course Code</Label>
                                  <Input 
                                    value={editCourseData.code}
                                    onChange={(e) => setEditCourseData(prev => prev ? {...prev, code: e.target.value} : null)}
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-4 gap-4">
                                <div className="space-y-2">
                                  <Label>Credits</Label>
                                  <Input 
                                    type="number"
                                    value={editCourseData.credits}
                                    onChange={(e) => setEditCourseData(prev => prev ? {...prev, credits: parseInt(e.target.value) || 0} : null)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Students</Label>
                                  <Input 
                                    type="number"
                                    value={editCourseData.studentCount}
                                    onChange={(e) => setEditCourseData(prev => prev ? {...prev, studentCount: parseInt(e.target.value) || 0} : null)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Semester</Label>
                                  <Input 
                                    value={editCourseData.semester}
                                    onChange={(e) => setEditCourseData(prev => prev ? {...prev, semester: e.target.value} : null)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Department</Label>
                                  <Input 
                                    value={editCourseData.department}
                                    onChange={(e) => setEditCourseData(prev => prev ? {...prev, department: e.target.value} : null)}
                                  />
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" onClick={saveCourse}>
                                  <Save className="w-4 h-4 mr-1" />
                                  Save
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => {setEditingCourse(null); setEditCourseData(null);}}>
                                  <X className="w-4 h-4 mr-1" />
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-semibold text-lg">{course.name}</h4>
                                  <Badge>{course.code}</Badge>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Award className="w-4 h-4" />
                                    {course.credits} Credits
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    {course.studentCount} Students
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {course.semester}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Building className="w-4 h-4" />
                                    {course.department}
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" variant="ghost" onClick={() => handleCourseEdit(course)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => deleteCourse(course.id)}>
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="qualifications" className="mt-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Educational Qualifications</h3>
                    {editingSection !== 'qualifications' && (
                      <Button onClick={() => handleEditToggle('qualifications')} variant="outline">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Qualifications
                      </Button>
                    )}
                  </div>

                  {editingSection === 'qualifications' ? (
                    <div className="space-y-4">
                      <div className="space-y-4">
                        {editData.qualification.map((qual, index) => (
                          <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                            <GraduationCap className="w-5 h-5 text-blue-600" />
                            <Input
                              value={qual}
                              onChange={(e) => {
                                const newQuals = [...editData.qualification];
                                newQuals[index] = e.target.value;
                                setEditData(prev => ({ ...prev, qualification: newQuals }));
                              }}
                              className="flex-1"
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeQualification(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Input
                          placeholder="Add new qualification"
                          value={newQualification}
                          onChange={(e) => setNewQualification(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addQualification()}
                        />
                        <Button onClick={addQualification}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add
                        </Button>
                      </div>

                      <div className="flex gap-4 pt-4">
                        <Button onClick={() => {handleSave(); setEditingSection(null);}}>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={() => setEditingSection(null)}>
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {facultyData.qualification.map((qual, index) => (
                        <Card key={index} className={`hover-scale animate-fade-in`}>
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-blue-100 p-2 rounded-full">
                                <GraduationCap className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-semibold">{qual}</p>
                                <p className="text-sm text-gray-600">Academic Qualification</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  <div className="mt-8">
                    <h4 className="text-lg font-semibold mb-4">Professional Experience</h4>
                    <Card className="hover-scale">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-green-100 p-2 rounded-full">
                            <Clock className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-semibold">{facultyData.experience}</p>
                            <p className="text-sm text-gray-600">Total Teaching Experience</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


export default FacultyProfile
