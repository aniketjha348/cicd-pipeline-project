import React, {  ReactNode, useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Badge } from '@/components/ui/badge';
import {
    BookOpen,
    GraduationCap,
    Building2,
    Users,
    Calendar,
    Clock,
    School,
    Filter,
    Plus,
    Eye,
    Command
} from 'lucide-react';

import { Link } from 'react-router-dom';
import { useGetCourseQuery, useLazyGetCollegesQuery, useLazyGetCourseQuery } from '@/services/admin';
import { getRandomColor } from '@/lib/genrateRandomColor';
import { SearchWithInput } from '@/components/shared/SearchWithInput';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert } from '@/components/shared/Alert';
import { CompAsyncHandler } from '@/components/shared/AsyncHandler';

interface Course {
    id: string;
    name: string;
    departmentId: string;
    departmentName: string;
    collegeId: string;
    collegeName: string;
    duration: number;
    programType: string;
    batches: Array<{
        batchYear: number;
        years: Array<{
            yearNumber: number;
            sections: Array<{
                name: string;
                capacity: number;
            }>;
        }>;
    }>;
    totalStudents: number;
    description: string;
}


const CourseCardSkeleton=()=>{
    
    const randomColor=getRandomColor("border-l");
  return(

  <Card  className={`animate-pulse border-l-4 border-l-gray-200 border-l-${randomColor?.colorWithValue}`}>
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-9 h-9 rounded-lg" />
          <div>
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <Skeleton className="h-6 w-20" />
      </div>
    </CardHeader>

    <CardContent className="space-y-3">
      <div className="flex items-start gap-2">
        <Skeleton className="h-4 w-4 mt-0.5" />
        <Skeleton className="h-4 w-full" />
      </div>

      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-24" />
      </div>

      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-28" />
      </div>

      <div className="pt-2 border-t flex justify-between items-center">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-12" />
      </div>
    </CardContent>
  </Card>
);
}

const CourseCardNotFound=({randomColor}:any)=>{

  return   (
                    <Card className="animate-fade-in">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <div className="p-4 bg-gray-100 dark:bg-slate-500/40 rounded-full mb-4">
                                <BookOpen className={`h-8 w-8 text-${randomColor.colorWithValue}`} />
                            </div>
                            <h3 className="text-lg font-semibold text-color mb-2">No Courses Found</h3>
                            <p className="text-color-thin  text-center mb-4">
                                No courses match your current filters. Try adjusting your selection or search terms.
                            </p>   <Link to={'./create'}>
                            <Button>
                             
                                
                                  <Plus className="h-4 w-4 mr-2" />
                                Create New Course
                               
                              
                            </Button> </Link>
                        </CardContent>
                    </Card>
                )
}

const CoursesOverview = () => {
    const [selectedCollege, setSelectedCollege] = useState<string>('all');
    const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedData,setSelectedData]=useState({});
    
    const [college, { currentData:data, isLoading }] = useLazyGetCollegesQuery({
    //   refetchOnFocus: true,
      refetchOnReconnect: true
    })

    const [formData,setFormData]=useState<object>({
        college:{
            id:"",name:"",
        },
        department:{
            id:"",
            name:""
        }
    })
    const [getCourse,{currentData:filteredCourses,isFetching:courseLoading}]=useLazyGetCourseQuery()

    useEffect(()=>{

        const timout = setTimeout(() => {
            getCourse({collegeId:formData?.college.id,departmentId:formData?.department?.id,search:searchTerm}).unwrap();
        }, 500);
    },[formData,searchTerm])


 
    // const filteredCourses = mockCourses.filter(course => {
    //     const matchesCollege = selectedCollege !== 'all' ? course.collegeId === selectedCollege : true;
    //     const matchesDepartment = selectedDepartment !== 'all' ? course.departmentId === selectedDepartment : true;
    //     const matchesSearch = searchTerm ?
    //         course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         course.description.toLowerCase().includes(searchTerm.toLowerCase()) : true;

    //     return matchesCollege && matchesDepartment && matchesSearch;
    // });

    const getTotalSections = (course: Course) => {
        return course.batches.reduce((total, batch) =>
            total + batch.years.reduce((yearTotal, year) => yearTotal + year.sections.length, 0), 0
        );
    };

    const getProgramTypeColor = (type: string) => {
        switch (type) {
            case 'Undergraduate': return 'bg-blue-100 text-blue-800';
            case 'Postgraduate': return 'bg-purple-100 text-purple-800';
            case 'Diploma': return 'bg-green-100 text-green-800';
            case 'Certificate': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };


   const randomColor = useMemo(() => getRandomColor("border"), []);

const coursesData=filteredCourses && filteredCourses?.courses || [];
console.log(coursesData,"filteredCourse");

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 bg-color">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="animate-fade-in">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-gradient-to-r from-blue-100 to-purple-100 dark:bg-none dark:bg-slate-700/40 rounded-xl">
                            <BookOpen className={`h-8 w-8 text-${randomColor.colorWithValue}`} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-200 ">Course Explorer</h1>
                            <p className="text-color-thin">Browse courses by department and college</p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <Card className="animate-scale-in hover-scale">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className={`h-5 w-5 text-${randomColor.colorWithValue}`}/>
                            Filters
                        </CardTitle>
                        <CardDescription>Select college and department to view courses</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <SearchWithInput randomColor={randomColor} inputPlaceholder='Search Colleges...'
                            onChange={async(search)=>  college({ search,searchType:"deep" }).unwrap()}
                            onSelect={(res)=>{console.log(res,"res");
                            ;setSelectedData(res);setFormData(prev=>({...prev,college:{id:res._id,name:res?.name}}))}}
                            data={data?.colleges}
                            />
                            {}
                              <SearchWithInput randomColor={randomColor} inputPlaceholder='Search Department...'
                              labelName='Department'
                            onChange={async(search)=>  {}}
                            data={selectedData?.departments}
                            />
                            <SearchWithInput randomColor={randomColor} inputPlaceholder='Search Department...'
                              labelName='Search Course'
                            onChange={async(search)=>  {setSearchTerm(search)}}
                            // data={selectedData?.departments}
                            />
                        


                            <div className="flex items-end">
                                <Link to={"./create"}> <Button className="w-full">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Course
                                </Button>
                                </Link>

                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Results Summary animate-fade-in */}
                <div className="">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <GraduationCap className={`h-5 w-5 text-${randomColor.colorWithValue}`} />
                            <span className="text-lg font-semibold">
                                {coursesData?.length} Course{coursesData?.length !== 1 ? 's' : ''} Found
                            </span>
                        </div>
                        {(selectedCollege !== 'all' || selectedDepartment !== 'all' || searchTerm) && (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSelectedCollege('all');
                                    setSelectedDepartment('all');
                                    setSearchTerm('');
                                }}
                            >
                                Clear Filters
                            </Button>
                        )}
                    </div>
                </div>
 {/* Courses Grid loading */}
{courseLoading && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, index) => (
      <CourseCardSkeleton key={index} />
    ))}
  </div>
)}

                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {!courseLoading && coursesData?.length > 0  && coursesData?.map((course:any, index:number) => (
                        <Card
                            key={course._id}
                            className={`border-l-4  border-l-${randomColor.colorWithValue}`}
                            // style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2 capitalize">
                                        <Badge className={`${getProgramTypeColor(course.programType)} border-0`}>
                                            {course.programType}
                                        </Badge>
                                        <CardTitle className="text-lg leading-tight">{course.name}</CardTitle>
                                    </div>
                                    <Button variant="ghost" size="sm" className="hover-scale">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <CardDescription className="text-sm line-clamp-2">
                                    {course?.description}
                                </CardDescription>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-color-thin">
                                        <Building2 className="h-4 w-4" />
                                        <span>{course?.collegeId?.name}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-color-thin">
                                        <School className="h-4 w-4" />
                                        <span>{course?.departmentId?.name}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-color-thin">
                                        <Clock className="h-4 w-4" />
                                        <span>{course?.duration} Year{course.duration > 1 ? 's' : ''}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 pt-3 border-t">
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 text-blue-600">
                                            <Users className="h-4 w-4" />
                                            <span className="font-semibold">{course.totalStudents}</span>
                                        </div>
                                        <div className="text-xs text-gray-500">Students</div>
                                    </div>

                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 text-green-600">
                                            <Calendar className="h-4 w-4" />
                                            <span className="font-semibold">{course?.batches?.length || 0}</span>
                                        </div>
                                        <div className="text-xs text-gray-500">Batches</div>
                                    </div>

                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-1 text-purple-600">
                                            <BookOpen className="h-4 w-4" />
                                            <span className="font-semibold">{getTotalSections(course)}</span>
                                        </div>
                                        <div className="text-xs text-gray-500">Sections</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                   
                </div>

                {/* Empty State */}
                { !courseLoading && coursesData.length === 0 && <CompAsyncHandler
                children={<CourseCardNotFound  randomColor={randomColor} />}
                loadingChildren={  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, index) => (
      <CourseCardSkeleton key={index} />
    ))}
  </div>}
                />
                 }
            </div>
        </div>
    );
};

export default CoursesOverview;
