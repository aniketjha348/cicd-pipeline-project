import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./index";

const authBaseUrl = fetchBaseQuery({
    baseUrl: `${baseUrl}/api/admin/users`, credentials: "include"
})
// export const adminAuthApi = createApi({
//     reducerPath: "adminAuthApi",
//     baseQuery: authBaseUrl,
//     endpoints: (builder) => ({

//         addUser: builder.mutation({
//             query: (data) => ({
//                 url: "",
//                 method: "POST",
//                 body: data
//             })
//         }),
//         getUsers: builder.query({

//             query: (data) => {
//                 const queryString = new URLSearchParams(data).toString();
//                 return {
//                     url: `?${queryString}`, // replace `/users` with your actual endpoint
//                     method: "GET",
//                 };
//             },
//         }),
//         updateUser: builder.mutation({
//             query: (id) => ({
//                 url: `${id}`,
//                 method: "PATCH",
//             })
//         }),
//         deleteUser: builder.query({
//             query: (id) => ({
//                 url: `${id}`,
//                 method: "DELETE",
//             })
//         }),
//         // faculty manages Api
//         addFacultyScope: builder.mutation({
//             query: (arg: any) => ({
//                 url: "faculty/scope", 
//                 method: "POST",
//                 body: arg
//             })
//         })
//     })

// })


export const adminAuthApi = createApi({
  reducerPath: "adminAuthApi",
  baseQuery: authBaseUrl,
  tagTypes: ["User", "Faculty"], // Add relevant tags
  endpoints: (builder) => ({

    // ✅ Add new user
    addUser: builder.mutation({
      query: (data) => ({
        url: "",
        method: "POST",
        body: data
      }),
      invalidatesTags: ["User"],
    }),

    // ✅ Get all users (with query parameters)
    getUsers: builder.query({
      query: (params) => {
        const queryString = new URLSearchParams(params).toString();
        return {
          url: `?${queryString}`,
          method: "GET",
        };
      },
      providesTags: ["User"],
    }),

    // ✅ Update user by ID
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // ✅ Delete user by ID (changed to mutation)
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    // ✅ Add faculty access scope
    addFacultyScope: builder.mutation({
      query: (arg) => ({
        url: "faculty/scope",
        method: "POST",
        body: arg
      }),
      invalidatesTags: ["Faculty"],
    }),

  }),
});

export const { useAddUserMutation,useAddFacultyScopeMutation, useDeleteUserMutation, useLazyGetUsersQuery, useUpdateUserMutation } = adminAuthApi;










const baseQuery = fetchBaseQuery({
    baseUrl: `${baseUrl}/api/admin/colleges`,
    credentials: "include",
})
export const CollegeApi = createApi({
    reducerPath: "collegeApi",
    baseQuery,
    tagTypes: ["College", "Department"],
    endpoints: (builder) => ({

        getColleges: builder.query({

            query: (data) => ({
                url: `/search?search=${data?.search}&searchType=${data?.searchType}&collegeId=${data?.collegeId ? data?.collegeId : ""}`,
                method: "GET",

            }),
            providesTags: ["College"]
        }),

        deleteCollege: builder.mutation({
            query: ({ collegeId, type }) => ({
                url: `/c1/${collegeId}?type=${type}`,
                method: "DELETE",

            }),
            invalidatesTags: ["College"]
        }),
        newDepartment: builder.mutation({
            query: (data) => ({
                url: "departments/add",
                method: "POSt",
                body: data
            })
        }),
        newCollege: builder.mutation({
            query: (data) => ({
                url: "add",
                method: "POSt",
                body: data
            })
        }),
        deleteDepartment: builder.mutation({
            query: ({ id, type }) => ({
                url: `departments/${id}?type=${type}`,
                method: "DELETE",
            }),

        }),

        getDepartments: builder.query({
            query: ({ search, departmentId }) => ({
                url: "departments",
                method: "GET",
                params: { search, departmentId },
            }),
        }),

    })
})

export const dept = createApi({
    reducerPath: "deptApi",
    baseQuery,
    endpoints: (builder) => ({
        getNewDepartments: builder.query({
            query: ({ search, departmentId }) => ({
                url: `departments?search=${search}&departmentId=${departmentId}`,
                method: "GET",
                // params: { search, departmentId },
            }),
        }),

    })
})

export const { useGetNewDepartmentsQuery } = dept

export const { useLazyGetCollegesQuery,useGetCollegesQuery, useNewDepartmentMutation, useGetDepartmentsQuery, useNewCollegeMutation, useLazyGetDepartmentsQuery, useDeleteDepartmentMutation, useDeleteCollegeMutation } = CollegeApi;

const couserBaseQuery = fetchBaseQuery({
    baseUrl: `${baseUrl}/api/admin/college/department/course`,
    credentials: "include",
})

export const CourseApi = createApi({
    reducerPath: "api",
    baseQuery: couserBaseQuery,
    endpoints: (builder) => ({

        getCourse: builder.query({

            query: (data) => ({
                url: `search?search=${data}`,
                method: "POST",
                body: data
            })
        }),
        addCourse: builder.mutation({
            query: (data) => ({
                url: ``,
                method: "POST",
                body: data

            })
        }),
        updateCourse: builder.mutation({
            query: (data) => ({
                url: "departments/add",
                method: "POSt",
                body: data
            })
        }),
        deleteCourse: builder.mutation({
            query: (id) => ({
                url: `${id}`,
                method: "DELETE",

            })
        }),

    })
})

export const { useAddCourseMutation, useDeleteCourseMutation, useGetCourseQuery, useLazyGetCourseQuery, useUpdateCourseMutation } = CourseApi;


const facultyBaseQuery = fetchBaseQuery({
    baseUrl: `${baseUrl}/api/admin/faculty`,
    credentials: "include"
})
export const facultyApi = createApi({
    reducerPath: "faculty",
    baseQuery: facultyBaseQuery,
    endpoints: (builder) => ({

        getFaculty: builder.query({

            query: (search) => ({
                url: `/${search}`,
                method: "GET",

            })
        }),
        addFaculty: builder.mutation({
            query: (data) => ({
                url: "add",
                method: "POSt",
                body: data
            })
        }),
        removeFaculty: builder.query({
            query: () => ({
                url: "remove",
                method: "GET"
            })
        })
    })
})


export const { useGetFacultyQuery, useAddFacultyMutation, useLazyRemoveFacultyQuery } = facultyApi;