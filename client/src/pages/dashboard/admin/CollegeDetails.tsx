import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Building2, Users, BookOpen, Settings, MapPin, Mail, Phone, Shield, GraduationCap, Edit, Plus } from 'lucide-react';
import { toast } from '@/components/shared/Toast';
import CollegeOverview from '@/components/Admin/CollegeOveriew';
import DepartmentsList from '@/components/Admin/DepartmentsList';
import { getRandomColor, getRandomTailwindClass } from '@/lib/genrateRandomColor';
import { useGetCollegesQuery } from '@/services/admin';


const CollegeDetails = () => {
  const { collegeId } = useParams();
  const [isEditMode, setIsEditMode] = useState(false);
  const {currentData}=useGetCollegesQuery({searchType:"deep",collegeId},{
    refetchOnMountOrArgChange:true,
    refetchOnReconnect:true
  })
  console.log(currentData,"current");
  // const college=currentData?.colleges[0];
  

  // Mock college data - in real app this would come from API
  // const college = {
  //   id: collegeId || '1',
  //   name: 'College of Engineering',
  //   code: 'COE',
  //   university: 'State University',
  //   address: '123 University Ave, College Town, ST 12345',
  //   principalName: 'Dr. John Smith',
  //   contactEmail: 'principal@coe.edu',
  //   contactPhone: '+1 (555) 123-4567',
  //   isAutonomous: true,
  //   established: '1985',
  //   accreditation: 'NAAC A+',
  //   totalStudents: 2500,
  //   totalFaculty: 150,
  //   totalDepartments: 8
  // };
  const college=currentData?.colleges[0] ?? {};
  const university=currentData?.university;

  const handleEdit = () => {
    setIsEditMode(!isEditMode);
    if (isEditMode) {
      toast({
        title: "Changes saved",
        description: "College information has been updated successfully.",
      });
    }
  };

  const randomColor = getRandomColor("border");
  return (
    <div className="min-h-screen capitalize bg-gradient-to-br from-blue-50 via-white to-purple-50 w-full dark:bg-none primary-p ">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center animate-fade-in">
          <div className="flex items-center gap-4">
            <Link to="/colleges">
              <Button variant="outline" size="sm" className="hover-scale">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Colleges
              </Button>
            </Link>
          </div>
          
          <Button 
            onClick={handleEdit}
            variant={isEditMode ? "default" : "outline"}
            className="hover-scale flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            {isEditMode ? 'Save Changes' : 'Edit College'}
          </Button>
        </div>

        {/* College Header */}
        <div className={"bg-white rounded-xl shadow-lg p-6 animate-fade-in border-l-4  bg-color text-color" + ` border-${randomColor?.colorWithValue} `}>
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl dark:bg-none dark:bg-slate-600/30">
                <Building2 className={"h-12 w-12 " + ` text-${randomColor?.colorWithValue}`} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl capitalize font-bold text-gray-900 text-color">{college?.name}</h1>
                  {college?.isAutonomous && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      Autonomous
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-gray-600">
                  <Badge variant="secondary">{college?.code}</Badge>
                  <span>•</span>
                  <span>{college?.university}</span>
                  <span>•</span>
                  <span>Est. {college?.established}</span>
                </div>
              </div>
            </div>
            
            <div className="lg:ml-auto grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{college?.totalStudents}</div>
                <div className="text-sm text-gray-600">Students</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{college?.totalFaculty}</div>
                <div className="text-sm text-gray-600">Faculty</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{college?.totalDepartments}</div>
                <div className="text-sm text-gray-600">Departments</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="animate-scale-in" style={{animationDelay: '0.2s'}}>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="departments" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Departments
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <CollegeOverview randomColor={randomColor} college={college} university={university} isEditMode={isEditMode} />
            </TabsContent>

            <TabsContent value="departments" className="mt-6">
              <DepartmentsList randomColor={randomColor} collegeId={college?._id} departments={college?.departments} isEditMode={isEditMode} />
            </TabsContent>

            <TabsContent value="settings" className="mt-6">
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>College Settings</CardTitle>
                  <CardDescription>Manage college configurations and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <h3 className="font-medium">Autonomous Status</h3>
                        <p className="text-sm text-color-thin">College has autonomous decision-making authority</p>
                      </div>
                      <Badge variant={college?.isAutonomous ? "default" : "secondary"}>
                        {college?.isAutonomous ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800  rounded-lg">
                      <div>
                        <h3 className="font-medium">Accreditation</h3>
                        <p className="text-sm text-color-thin">Current accreditation status</p>
                      </div>
                      <Badge variant="outline" className='border-slate-200'>{college?.accreditation}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CollegeDetails;