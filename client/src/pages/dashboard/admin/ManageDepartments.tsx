import React, { useCallback, useEffect, useState } from 'react';

import {
  Briefcase, Plus, Search,
  School,
  Trash,
  Pencil,
  Building2,
  MapPin,
  Shield,
  // Badge,
  Mail,
  Phone,
  Book,
  Users
} from 'lucide-react';

import DepartmentForm from '@/components/Admin/DepartmentForm';
import { CollegeApi, useDeleteDepartmentMutation, useGetDepartmentsQuery, useGetNewDepartmentsQuery, useLazyGetDepartmentsQuery } from '@/services/admin';
import { getRandomColor, getRandomTailwindClass, } from '@/lib/genrateRandomColor';
import clsx from 'clsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton';
import { Alert } from '@/components/shared/Alert';
import { useNavigate } from 'react-router-dom';
import { CompAsyncHandler } from '@/components/shared/AsyncHandler';
import { toast } from '@/components/shared/Toast';
import { DeleteLoading } from '@/components/shared/Loading';
import { useDispatch } from 'react-redux';
import { Input } from '@/components/ui/input';


interface FormData {


  data?: any,
  formType?: string,
  code?: string,
}
const DepartmentCardSkeleton = () => {

  const randomColor = getRandomColor("border-l");
  return (

    <Card className={`animate-pulse border-l-4 border-l-gray-200 border-l-${randomColor?.colorWithValue}`}>
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


const ManageDepartments: React.FC = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const [deleteId, setDeleteId] = useState<string | null | boolean>(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    data: {},
    formType: "update",
    code: '',
  });
  const [deleteDepartment, { isLoading: isDeleting }] = useDeleteDepartmentMutation();
  const [selectedDept, setSelectedDept] = useState<Record<string, any> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(searchTerm), 600);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const { currentData: departmentData, isFetching, refetch } = useGetDepartmentsQuery({ search: debouncedSearch }, {
    refetchOnMountOrArgChange: true,
    selectFromResult: ({ data, ...rest }) => {
      return {
        ...rest,


        data: data?.department?.length ? data : { department: [] },
      }
    },

  });


  const handleEdit = (dept: any) => {

    console.log(dept);

    setFormData(prev => ({ ...prev, data: dept, formType: "update" }));
    console.log("edit");

    // setEditingDepartment(dept.id);
    setShowAddModal(true);
  };
  const handleDelete = async (id: string, type: any = "delete") => {
    try {
      setDeleteId(id);
      const res = await deleteDepartment({ id, type }).unwrap();
      dispatch(CollegeApi.util.resetApiState());


      toast({
        title: `Department ${type} Success.`,
        description: res?.message,
      });



    } catch (err) {
      toast({
        title: `Department ${type} Failed`,
        description: err?.data?.message,
        toastType: 'error'
      });
    } finally {
      setDeleteId(null);
    }
  };
  const navigate = useNavigate();

  return (
    <div className='relative w-full primary-p'>
      <header className="mb-8 relative">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Departments</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Add, edit, or remove departments from your institution
        </p>

        {showAddModal && <button onClick={() => {
          setShowAddModal(false); setFormData({
            data: "",
            formType: "",
            code: ""
          })
        }} className='p-2 border border-gray-200 rounded-md absolute right-0 top-1/2 -translate-y-1/2'>Back to Department</button>}
      </header>


      {
        selectedDept && (
          <Alert
            title="Delete Department?"
            subtitle="Deleting this department will also remove all linked courses and related records. Do you want to continue?."
            defaultOpen={true}
            btnTitle="Delete"
            cnslBtnTitle="Cancel"
            onAllow={() => { handleDelete(selectedDept?._id); setSelectedDept(null) }}
            onCancel={() => setSelectedDept(null)}
            showConfirmInput={true}
            confirmName={selectedDept?.name}
          />
        )
      }
      {/* Actions bar */}
      {

        showAddModal ? (
          <DepartmentForm dept={formData?.data} formType={formData?.formType} />
        ) :
          (
            <>
              <div className="mb-6 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search departments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={() => {
                    setFormData({
                      data: "",
                      code: "",
                      formType: ""
                    })
                    navigate("./add")
                    setShowAddModal(true);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Department
                </button>
              </div>
              {/* Departments grid */}
              <div className="grid grid-cols-1 transition-all duration-700 ease md:grid-cols-2 lg:grid-cols-3 gap-6">

                {
                  isFetching && (
                    Array.from({ length: 6 }).map((_, index) =>
                      <DepartmentCardSkeleton key={index} />)
                  )
                }
                {!isFetching && departmentData && departmentData?.department.length > 0 && departmentData?.department.map((dept: any) => {
                  const randomColor = getRandomColor("border");
                  return (
                    <Card

                      className={`hover-scale animate-fade-in relative overflow-hidden  border-l-4 hover:border-l-[8px] transition-colors transition-all duration-700 ease hover:shadow-lg border-l-${randomColor.colorWithValue} `}
                      style={{ animationDelay: `${1 * 0.1}s` }}
                    >
                      {deleteId === dept?._id && isDeleting && <DeleteLoading />}
                      <div className="absolute top-0 gap-2 right-0 flex p-2 text-sm"><span onClick={() => setSelectedDept(dept)} className={`p-2 border fade-in  border-${randomColor} rounded`}>


                        <Trash className={`size-4  text-${randomColor.colorWithValue}`} />
                      </span>
                        {/* 
                        <Alert CloseButton={
                          
                        }
                          // onAllow={()=>{handleDelete(dept?._id)}}
                          title="Delete Department?"
                          subtitle="Deleting this department will also remove all linked courses and related records. Do you want to continue?."
                          btnTitle="Delete"
                          cnslBtnTitle="Cancel"
                          onAllow={() => console.log("College deleted")}
                          onCancel={() => console.log("Cancelled")}
                          showConfirmInput={true}
                          confirmName={dept?.name}
                        /> */}

                        <span onClick={() => handleEdit(dept)} className={`p-2 fade-in  border border-${randomColor} rounded`}>

                          <Pencil className={`size-4   text-${randomColor.colorWithValue}`} />
                        </span>
                        {/* <Pencil /> */}
                      </div>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="p-2 mt-2 bg-gradient-to-r from-blue-100 to-purple-100 
                                    dark:from-blue-50/30 dark:to-purple-50/30 rounded-lg">
                              <Building2 className={"h-5 w-5  " + `text-${randomColor.colorWithValue}`} />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{dept?.name}</CardTitle>
                              <CardDescription className="flex items-start flex-col gap-1">
                                <span> {dept?.collegeId?.name}</span>
                                <Badge variant="secondary" className={"text-xs border " + `border-${randomColor}`}>
                                  {dept?.shortName}
                                </Badge>

                              </CardDescription>
                            </div>
                          </div>
                          {dept?.isAutonomous && (
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
                            + `text-${randomColor.colorWithValue}`
                          } />
                          <span className="line-clamp-2">{dept?.collegeId?.address?.line1},{dept?.collegeId?.address?.city}</span>
                        </div>

                        {/* <div className="flex items-center gap-2 text-sm dark:text-slate-200/80 text-gray-600">
                                  <User className={"h-4 w-4 mt-0.5  " 
                                    + `text-${randomColor}`
                                  }/>
                                  <span>{college?.principalName}</span>
                                </div> */}

                        <div className="flex items-center gap-2 text-sm dark:text-slate-200/80 text-gray-600">
                          <Mail className={"h-4 w-4 mt-0.5  "
                            + `text-${randomColor?.colorWithValue}`
                          } />
                          <span className="truncate">{dept?.email || "department@email.com"}</span>
                        </div>

                        <div className="flex dark:text-slate-200/80 items-center gap-2 text-sm text-gray-600">
                          <Phone className={"h-4 w-4 mt-0.5  "
                            + `text-${randomColor?.colorWithValue}`
                          } />
                          <span>{dept?.phone || "+91 9873678239"}</span>
                        </div>
                        <div className="flex dark:text-slate-200/80 items-center gap-2 text-sm text-gray-600">
                          <School className={"h-4 w-4 mt-0.5  "
                            + `text-${randomColor.colorWithValue}`
                          } />
                          <div className="flex-1 flex flex-wrap gap-2">
                            {dept?.courses?.map((course: any, index: number) => {
                              if (index <= 4)
                                return (
                                  <span className={clsx(getRandomTailwindClass("border"), "px-2 mr-2 py-1 rounded-md text-xs border")}>
                                    {course?.code}
                                  </span>
                                )
                            })}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <span title='Depatments' className=" flex w-[60px] rounded-md p-2 border border-slate-200 items-center gap-2 text-sm ">
                            <Users className={"h-4 w-4 mt-0.5  "
                              + `text-${randomColor.colorWithValue}`
                            } />
                            <span>{dept?.departments?.length ?? 0}</span>
                          </span>
                          <span title='Courses' className=" flex w-[60px] rounded-md p-2 border border-slate-200 items-center gap-2 text-sm ">
                            <Book className={"h-4 w-4 mt-0.5  "
                              + `text-${randomColor.colorWithValue}`
                            } />
                            <span>{dept?.courses?.length}</span>
                          </span>
                        </div>

                        {/* <div className="flex dark:text-slate-200/80 items-center gap-2 text-sm text-gray-600">
                                  <Phone className={"h-4 w-4 mt-0.5  " 
                                    + `text-${randomColor}`
                                  } />
                                  <span>{college?.departments?.courses?.length}</span>
                                </div> */}

                      </CardContent>
                    </Card>
                  )
                }

                )}


                {!departmentData &&

                  <CompAsyncHandler
                    children={
                      (
                        <div className="col-span-full text-center py-12">
                          <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No departments found</h3>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {searchTerm ? 'Try a different search term' : 'Get started by adding a new department'}
                          </p>
                          {!searchTerm && (
                            <div className="mt-6">
                              <button
                                onClick={() => setShowAddModal(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                              >
                                <Plus className="h-5 w-5 mr-2" />
                                Add Department
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    }

                    loadingChildren={(
                      Array.from({ length: 6 }).map((_, index) =>
                        <DepartmentCardSkeleton key={index} />)
                    )}
                  />
                }
              </div>
            </>
          )}


    </div>
  );
};


export default ManageDepartments;



