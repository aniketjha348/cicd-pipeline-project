import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Building2, MapPin, User, Mail, Phone, Shield, School, Book, Trash, Pencil, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { getRandomTailwindClass } from '@/lib/genrateRandomColor';
import { CollegeApi, useDeleteCollegeMutation, useLazyGetCollegesQuery } from '@/services/admin';
import { Link, useNavigate } from 'react-router-dom';
import { Alert } from '../shared/Alert';
import { CompAsyncHandler } from '../shared/AsyncHandler';
import { DeleteLoading } from '../shared/Loading';
import { useDispatch } from 'react-redux';
interface Address {
  line1: string;
  city: string;
  state: string;
  [key: string]: any; // allows additional fields like pincode, country, etc.
}

interface College {
  _id: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  website: string;
  logoUrl: string;
  type: 'college' | string; // defaults to 'college', but flexible
  isActive: boolean;
  address: Address;
  collegeIds: string[];
  departments: any[any]; // could be string[] or object[], using any for flexibility
  universityId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

interface CollegeListProps {
  onAddClick: () => void;
}
const CollegeCardSkeleton = () => (
  <Card className="animate-pulse border-l-4 border-l-gray-200">
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
const CollegeList = ({ onAddClick }: CollegeListProps) => {
  //   const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteCollege, { isLoading: isDeleting }] = useDeleteCollegeMutation();
  const dispatch=useDispatch();

  let [getColleges, { data, isFetching:isLoading }] = useLazyGetCollegesQuery()

const [selectedCollege, setSelectedCollege] = useState(null);
  useEffect(() => {

    const timer = setTimeout(() => {
      getColleges({ search: searchTerm, searchType: "deep" }).unwrap();
      //   setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);

  }, [searchTerm])


  //   console.log();

  const colleges: College[] = data?.colleges || [];
  const navigate=useNavigate(); 
  const handleDelete = async (e: React.MouseEvent, collegeId: string,type:any="delete") => {
    e.preventDefault();
    e.stopPropagation();

    const confirmDelete = confirm("Are you sure you want to delete this college?");
    if (!confirmDelete) return;

    try {
      setDeletingId(collegeId);
      await deleteCollege({collegeId,type}).unwrap();
            dispatch(CollegeApi.util.resetApiState());
      
    } catch (err) {
      console.error("Failed to delete:", err);
      // Optionally show toast or alert
    } finally {
      setDeletingId(null);
    }
  };


  return (
    <div className="space-y-6 ">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-200">Colleges</h2>
            <p className="text-gray-600 dark:text-slate-200/40">Manage university colleges</p>
          </div>
        </div>

        <Button
          onClick={onAddClick}
          className="hover-scale flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New College
        </Button>
      </div>
      {/* Search Bar */}
      <label className="center relative transition-all ">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search colleges by name, code, or principal..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border-green-500  transition-all duration-500 
    placeholder:dark:text-slate-200/60  
 
    "
          disabled={isLoading}
        />
      </label>

{selectedCollege && (
  <Alert
    title="Delete College?"
    subtitle="Are you sure you want to delete this college? All associated departments, courses, and data will also be removed."
    btnTitle="Delete"
    cnslBtnTitle="Cancel"
    defaultOpen={true}
    triggerClass="hidden"
    confirmName={selectedCollege?.name}
    showConfirmInput={true}
    onCancel={() => setSelectedCollege(null)}
    onAllow={(e) => {
      handleDelete(e,selectedCollege?._id);
      setSelectedCollege(null);
    }}
  />
)}
      {/* Colleges Grid */}
      <div className="grid capitalize  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, index: number) =>
            <CollegeCardSkeleton key={index} />
          )
        ) : (
          // Actual college cards
          colleges.map((college, index) => {

            let randomColor = getRandomTailwindClass('border', "color");
            let totalCourses = 0;
            const isCardDeleting = deletingId === college._id;

            college?.departments.forEach((dept: any) => {
              totalCourses += dept.courses.length;
            });
            return (


                <Card
key={college?._id} onClick={()=>navigate(college?._id)}
                  className={`hover-scale animate-fade-in  border-l-4 hover:border-l-[8px] transition-colors transition-all duration-300 hover:shadow-lg relative overflow-hidden border-l-${randomColor} `}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {deletingId===college?._id && isDeleting && (
                   <DeleteLoading title="Deleting  all records of college."/>
                  )}
                  <div className="absolute top-0 gap-2 right-0 flex p-2 text-sm">
                    <span onClick={(e) =>{e.preventDefault();e.stopPropagation();setSelectedCollege(college)}} className={`p-2 border fade-in  border-${randomColor} rounded`}>
                      <Trash className={`size-4  text-${randomColor}`} />
                    </span>  

                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 
                    dark:from-blue-50/30 dark:to-purple-50/30 rounded-lg">
                          <Building2 className={"h-5 w-5  " + `text-${randomColor}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{college?.name}</CardTitle>
                          <CardDescription className="flex items-center gap-1">
                            <Badge variant="secondary" className={"text-xs border " + `border-${randomColor}`}>
                              {college?.code}
                            </Badge>
                          </CardDescription>
                        </div>
                      </div>
                      {college?.isAutonomous && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          Autonomous
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-slate-200/80">
                      <MapPin className={"h-4 w-4 mt-0.5  "
                        + `text-${randomColor}`
                      } />
                      <span className="line-clamp-2">{college?.address?.line1}</span>
                    </div>

                    {/* <div className="flex items-center gap-2 text-sm dark:text-slate-200/80 text-gray-600">
                  <User className={"h-4 w-4 mt-0.5  " 
                    + `text-${randomColor}`
                  }/>
                  <span>{college?.principalName}</span>
                </div> */}

                    <div className="flex items-center gap-2 text-sm dark:text-slate-200/80 text-gray-600">
                      <Mail className={"h-4 w-4 mt-0.5  "
                        + `text-${randomColor}`
                      } />
                      <span className="truncate">{college?.email}</span>
                    </div>

                    <div className="flex dark:text-slate-200/80 items-center gap-2 text-sm text-gray-600">
                      <Phone className={"h-4 w-4 mt-0.5  "
                        + `text-${randomColor}`
                      } />
                      <span>{college?.phone}</span>
                    </div>
                    <div className="flex gap-2">
                      <span title='Depatments' className=" flex w-[60px] rounded-md p-2 border border-slate-200 items-center gap-2 text-sm ">
                        <School className={"h-4 w-4 mt-0.5  "
                          + `text-${randomColor}`
                        } />
                        <span>{college?.departments?.length}</span>
                      </span>
                      <span title='Courses' className=" flex w-[60px] rounded-md p-2 border border-slate-200 items-center gap-2 text-sm ">
                        <Book className={"h-4 w-4 mt-0.5  "
                          + `text-${randomColor}`
                        } />
                        <span>{totalCourses}</span>
                      </span>
                    </div>

                    {/* <div className="flex dark:text-slate-200/80 items-center gap-2 text-sm text-gray-600">
                  <Phone className={"h-4 w-4 mt-0.5  " 
                    + `text-${randomColor}`
                  } />
                  <span>{college?.departments?.courses?.length}</span>
                </div> */}
                    <div className="pt-2  border-t flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-slate-200/80">University: {data?.university?.name}</span>
                      <Button variant="outline" size="sm" className="hover-scale">
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
     

            )
          })
        )}
      </div>

      {/* Empty State */}
      {!isLoading && colleges?.length === 0 && 
      
      <CompAsyncHandler
      children={
      (
        <div className="text-center py-12 animate-fade-in">
          <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Building2 className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No colleges found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first college'}
          </p>
          {!searchTerm && (
            <Button onClick={onAddClick} className="hover-scale">
              <Plus className="h-4 w-4 mr-2" />
              Create First College
            </Button>
          )}
        </div>
      )  
      }
      loadingChildren={
        (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, index: number) =>
            <CollegeCardSkeleton key={index} />
          )
        )
      }
      />
      }
    </div>
  );
};

export default CollegeList;
