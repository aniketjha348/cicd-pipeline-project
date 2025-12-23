import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Settings, Shield, Plus } from 'lucide-react';
import { FacultyAccessDialog,SearchFilterAdvanced } from '@/components/Admin/FacultyAccessComp';
import { useNavigate } from 'react-router-dom';
import { useLazyGetUsersQuery } from '@/services/admin';
import { getRandomColor } from '@/lib/genrateRandomColor';
  type AccessStatus = 'active' | 'pending' | 'denied';

interface Faculty {
  id: string;
  name: string;
  email: string;
  avatar: string;
  department: string;
  hasAccess: AccessStatus;
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





const FacultyAccessManagement = () => {

  const [accessScopes, setAccessScopes] = useState<AccessScope[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [getUser,{currentData:users, isFetching}]=useLazyGetUsersQuery();
  const [activeFilters, setActiveFilters] = useState<{
    college?: string;
    department?: string;
    course?: string;
    accessStatus?: string;
  }>({});

  useEffect(()=>{
getUser({role:"faculty"}).unwrap();

  },[])

  
  const navigate =useNavigate();

  const getFacultyAccess = (facultyId: string) => {
    return accessScopes.filter(scope => scope.facultyId === facultyId);
  };

  const handleSetAccess = (facultyMember: Faculty) => {
    navigate("./add",{state:facultyMember})

  };

  const handleSaveAccess = (newAccessScope: AccessScope) => {
    setAccessScopes(prev => {
      const filtered = prev.filter(scope => 
        scope.facultyId !== newAccessScope.facultyId || 
        scope.collegeId !== newAccessScope.collegeId
      );
      return [...filtered, newAccessScope];
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };




function countAccessStatus() {

  
if(!users) return {}
 

return users.reduce(
    (acc, user) => {
      acc.total++;
      if (user.hasAccess === 'active') acc.active++;
      else if (user.hasAccess === 'pending') acc.pending++;
      else if (user.hasAccess === 'denied') acc.denied++;
      return acc;
    },
    { active: 0, pending: 0, denied: 0, total: 0 }
  );
} 

const headData=useMemo(()=>{
  return countAccessStatus()
},[users])

const randomColor=useMemo(()=>getRandomColor("border"),[])

  return (
    <div className="min-h-screen bg-color w-full  min-h-full text-color p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Faculty Access Management</h1>
            <p className="text-muted-foreground mt-1">Manage faculty access to colleges, departments, and courses</p>
          </div>
        </div>

        {/* Advanced Search and Filter */}
        <SearchFilterAdvanced
          randomColor={randomColor}
          onSearch={handleSearch}
          onFilter={()=>""}
          activeFilters={activeFilters}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Faculty</CardTitle>
              <Users className={`text-${randomColor?.color}-600 ` + "h-4 w-4 text-muted-foreground"} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{headData?.total ?? 0}</div>
              <p className="text-xs text-muted-foreground">Filtered faculty members</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Access Configured</CardTitle>
              <Shield className={`text-${randomColor?.color}-600 ` + "h-4 w-4 text-muted-foreground"}  />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{headData?.active ?? 0}</div>
              <p className="text-xs text-muted-foreground">Access scopes defined</p>
            </CardContent>
          </Card>
          
          <Card className='border-corner after:bg-blue-500/40 before:bg-red-500/40'>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Setup</CardTitle>
              <Settings className={`text-${randomColor?.color}-600 ` + "h-4 w-4 text-muted-foreground"} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
               { headData?.pending ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">Faculty without access</p>
            </CardContent>
          </Card>
        </div>

        {/* Faculty Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* {filteredFaculty.map(facultyMember => {
            const accessCount = getFacultyAccess(facultyMember.id).length;
            
            return (
              <Card key={facultyMember.id} className="group hover:shadow-lg transition-all duration-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={facultyMember.avatar} alt={facultyMember.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {getInitials(facultyMember.name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSetAccess(facultyMember)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Settings className="w-4 h-4 mr-1" />
                      Set Access
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{facultyMember.name}</h3>
                      <p className="text-sm text-muted-foreground">{facultyMember.email}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {facultyMember.department}
                      </Badge>
                      <Badge 
                        variant={accessCount > 0 ? "default" : "destructive"} 
                        className="text-xs"
                      >
                        {accessCount} Access{accessCount !== 1 ? 'es' : ''}
                      </Badge>
                    </div>
                    
                    {accessCount > 0 && (
                      <div className="text-sm text-muted-foreground">
                        <div className="space-y-1">
                          {getFacultyAccess(facultyMember.id).map((scope, index) => (
                            <div key={index} className="flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                              <span className="truncate">{scope.collegeName}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })} */}

{users && users?.map((facultyMember:any) => {
            // const accessCount = getFacultyAccess(facultyMember?._id).length ?? 0;
            const accessCount =  facultyMember?.accessScope?.length ?? 0;
            const colors=getRandomColor("border-l");

            
            return (
              <Card key={facultyMember?._id} className={` border-l-4 ${colors.class} hover:border-${colors.colorWithValue} ` + " group hover:shadow-lg transition-all duration-200"}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <Avatar className="h-12 w-12 border-1 border-green-500">
                      <AvatarImage src={facultyMember?.avatar} alt={facultyMember?.name} />
                      <AvatarFallback className={`border-${colors?.color}-600 dark:text-${colors?.color}-400/40 ` +" bg-primary/10 border-2  text-primary font-semibold"}>
                        {getInitials(facultyMember?.name)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSetAccess(facultyMember)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Settings className="w-4 h-4 mr-1" />
                      Set Access
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{facultyMember?.name}</h3>
                      <p className="text-sm text-muted-foreground">{facultyMember?.email}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {/* {facultyMember?.department} */}
                      </Badge>
                      <Badge 
                        variant={accessCount > 0 ? "default" : "destructive"} 
                        className="text-xs"
                      >
                        {accessCount} Access{accessCount !== 1 ? 'es' : ''}
                      </Badge>
                    </div>
{/*                     
                    {accessCount > 0 && (
                      <div className="text-sm text-muted-foreground">
                        <div className="space-y-1">
                          {getFacultyAccess(facultyMember?._id).map((scope, index) => (
                            <div key={index} className="flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                              <span className="truncate">{scope?.collegeName}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )} */}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {!users ||  users?.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No faculty members found matching your search criteria.</p>
          </div>
        )}
{/* 
        <FacultyAccessDialog
          faculty={selectedFaculty}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSave={handleSaveAccess}
          existingAccess={selectedFaculty ? getFacultyAccess(selectedFaculty.id) : []}
        /> */}
      </div>
    </div>
  );
};

export default FacultyAccessManagement;