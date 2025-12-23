import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "./index";
import { loginFailure, loginSuccess, logout } from "../store/slices/authSlice";
import { toast } from "@/components/shared/Toast";
const baseQuery = fetchBaseQuery({
    baseUrl: `${baseUrl}/api/auth`,
    credentials: "include"
})
const AuthApi = createApi({
    reducerPath: "Auth",
    baseQuery,
    endpoints: (builder) => ({

        register: builder.mutation({

            query: (data) => ({
                url: "register",
                body: data,
                method: "POST"
            }),
            async onQueryStarted({}, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    console.log(data, "data");
                    if(data){   
                          dispatch(loginSuccess(data?.user));
                    }

                } catch (err) {
                    const {error}=err as { error: any };
                    // dispatch(loginFailure(err?.error?.message))
                    toast({title:"Register Failed.",description:error?.data?.message,toastType:"error"})
                    console.log("Register error", err);
                }
            },


        }),
        login: builder.mutation({
            query: ({data}) => ({
                url: "login",
                body: data,
                method: "POST"
            }),
             async onQueryStarted({}, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    console.log(data, "data");
                    if(data){   
                        dispatch(loginSuccess(data?.user));
                        toast({title:"Login success.",description:data?.message,toastType:"success"})

                    }

                } catch (err) {
                    const {error}=err as { error: any };
                    // dispatch(loginFailure(err?.error?.message))
                    toast({title:"Register Failed.",description:error?.data?.message,toastType:"error"})
                    console.log("Register error", err);
                }
            },
        }),
        adminRegister: builder.mutation({

            query: (data) => ({
                url: "admin/register",
                body: data,
                method: "POST"
            }),
             async onQueryStarted({navigate}, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    console.log(data, "data");
                    if(data){   
                          dispatch(loginSuccess(data?.user));
                    }

                } catch (err) {
                    const {error}=err as { error: any };
                    // dispatch(loginFailure(err?.error?.message))
                    toast({title:"Register Failed.",description:error?.data?.message,toastType:"error"})
                    console.log("Register error", err);
                }
            },
        }),
        verifyUser: builder.query({
            query: () => ({
                url: "verify-user",
                method: "GET"
            }),
             async onQueryStarted({navigate}, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    console.log(data, "data");
                    if(data){   
                          dispatch(loginSuccess(data?.user));
                    }

                } catch (err) {
                    const {error}=err as { error: any };
                    // dispatch(loginFailure(err?.error?.message))
                    toast({title:"Register Failed.",description:error?.data?.message,toastType:"error"})
                    console.log("Register error", err);
                }
            },
        }),
        logout: builder.query({
            query: () => ({
                url: "logout",
                method: "GET"
            }),
             async onQueryStarted({}, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    console.log(data, "data");
                    if(data){   
                          dispatch(logout());
                         
                          toast({title:"Logout Success.",description:data?.message,toastType:"success"})
                    }

                } catch (err) {
                    const {error}=err as { error: any };
                    // dispatch(loginFailure(err?.error?.message))
                    toast({title:"Logout Failed.",description:error?.data?.message,toastType:"error"})
                    console.log("Register error", err);
                }
            },
        })
    })
})

export const { useRegisterMutation,useLazyLogoutQuery, useLoginMutation, useAdminRegisterMutation, useLazyVerifyUserQuery } = AuthApi
export default AuthApi