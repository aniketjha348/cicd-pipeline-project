// import React, { useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { 
//   UserPlus, Trash2, Edit2, Search, 
//   CheckCircle, XCircle, Filter, Download, 
//   CornerUpLeft
// } from 'lucide-react';
// import { RootState } from '../../../store';
// import { deleteUser, updateUser } from '../../../store/slices/userSlice';
// import FacultyAccessForm from '@/components/Admin/FacultyAccessForm';

// const ManageUsers: React.FC = () => {
//   const dispatch = useDispatch();
//   const { users } = useSelector((state: RootState) => state.users);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'faculty' | 'student'>('all');
//   const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState<string | null>(null);


//   // Filter users based on search term and filters
//   const filteredUsers = users.filter(user => {
//     const matchesSearch = 
//       user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
//     const matchesRole = roleFilter === 'all' || user.role === roleFilter;
//     const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
//     return matchesSearch && matchesRole && matchesStatus;
//   });

//   const handleDeleteUser = (userId: string) => {
//     if (window.confirm('Are you sure you want to delete this user?')) {
//       dispatch(deleteUser(userId));
//     }
//   };

//   const handleToggleStatus = (userId: string, currentStatus: 'active' | 'inactive') => {
//     dispatch(updateUser({
//       id: userId,
//       updates: {
//         status: currentStatus === 'active' ? 'inactive' : 'active'
//       }
//     }));
//   };

//   return(
//     <div className="flex primary-p border-1 flex-col w-full h-full">
// <div className="flex flex-1 justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Users</h1>
//       { !showAddModal ? <button
//           onClick={() => setShowAddModal(true)}
//           className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//         >

//           <UserPlus className="w-5 h-5 mr-2" />
         
//          <p className='hidden sm:block'> Add New User</p>
//         </button>:<button
//           onClick={() => setShowAddModal(false)}
//           className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//         >
//           <CornerUpLeft className="w-5 h-5 mr-2" />
//          <p className='hidden sm:block'>Back to </p>
//         </button>}
//       </div>

//       {/* Filters and Search */}

//       {showAddModal ? <FacultyAccessForm/>:
//       (<>
      
//       <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
//         <div className="p-4 border-b dark:border-gray-700">
//           <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
//             <div className="flex-1 relative ">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//               <input
//                 type="text"
//                 placeholder="Search users..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
//               />
//             </div>
//             <div className="flex gap-4  mt-4 md:mt-0 flex-wrap">
//               <select
//                 value={roleFilter}
//                 onChange={(e) => setRoleFilter(e.target.value as any)}
//                 className="border rounded-lg px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
//               >
//                 <option value="all">All Roles</option>
//                 <option value="admin">Admin</option>
//                 <option value="faculty">Faculty</option>
//                 <option value="student">Student</option>
//               </select>
//               <select
//                 value={statusFilter}
//                 onChange={(e) => setStatusFilter(e.target.value as any)}
//                 className="border rounded-lg px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
//               >
//                 <option value="all">All Status</option>
//                 <option value="active">Active</option>
//                 <option value="inactive">Inactive</option>
//               </select>
//               <button
//                 className="flex items-center px-3 py-2 border rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
//               >
//                 <Download className="w-5 h-5 mr-2" />
//                 Export
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>


//       {/* Users Table */}
//       <div className="bg-white  dark:bg-gray-800 rounded-lg shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//             <thead className="bg-gray-50 dark:bg-gray-700">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                   User
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                   Role
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                   Department
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                   Created At
//                 </th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
//               {filteredUsers.map((user) => (
//                 <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <div className="flex-shrink-0 h-10 w-10">
//                         <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-600 dark:text-gray-300 text-lg font-medium">
//                           {user.name.charAt(0)}
//                         </div>
//                       </div>
//                       <div className="ml-4">
//                         <div className="text-sm font-medium text-gray-900 dark:text-white">
//                           {user.name}
//                         </div>
//                         <div className="text-sm text-gray-500 dark:text-gray-400">
//                           {user.email}
//                         </div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                       user.role === 'admin'
//                         ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
//                         : user.role === 'faculty'
//                         ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
//                         : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
//                     }`}>
//                       {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
//                     {user.department || '-'}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <button
//                       onClick={() => handleToggleStatus(user.id, user.status)}
//                       className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
//                         user.status === 'active'
//                           ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
//                           : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
//                       }`}
//                     >
//                       {user.status === 'active' ? (
//                         <CheckCircle className="w-4 h-4 mr-1" />
//                       ) : (
//                         <XCircle className="w-4 h-4 mr-1" />
//                       )}
//                       {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
//                     </button>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
//                     {new Date(user.createdAt).toLocaleDateString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                     <button
//                       onClick={() => setSelectedUser(user.id)}
//                       className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3"
//                     >
//                       <Edit2 className="w-5 h-5" />
//                     </button>
//                     <button
//                       onClick={() => handleDeleteUser(user.id)}
//                       className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
//                     >
//                       <Trash2 className="w-5 h-5" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
        
//         {filteredUsers.length === 0 && (
//           <div className="text-center py-8">
//             <p className="text-gray-500 dark:text-gray-400">No users found matching your criteria.</p>
//           </div>
//         )}
//       </div>
//       </>)}


//     </div>
//   )


// };

// export default ManageUsers;










import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, GraduationCap, UserPlus } from 'lucide-react';
import UserCardSkeleton, { AddUserDialog,UserCard,SearchFilter } from '@/components/Dashboard/UserManage';
import { getRandomColor } from '@/lib/genrateRandomColor';
import { useLazyGetUsersQuery } from '@/services/admin';
import { CompAsyncHandler } from '@/components/shared/AsyncHandler';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'faculty';
  department: any;
 [key:string]:any;
}

// Mock data for demonstration
const mockUsers: User[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@university.edu',
    role: 'student' as const,
    department: 'Computer Science',
    college: 'Engineering',
    year: '3rd Year',
    course: 'Software Engineering',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    status: 'active' as const
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    email: 'michael.chen@university.edu',
    role: 'faculty' as const,
    department: 'Computer Science',
    college: 'Engineering',
    position: 'Professor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    status: 'active' as const
  },
  {
    id: 3,
    name: 'Emily Davis',
    email: 'emily.davis@university.edu',
    role: 'student' as const,
    department: 'Mathematics',
    college: 'Sciences',
    year: '2nd Year',
    course: 'Applied Mathematics',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    status: 'active' as const
  },
  {
    id: 4,
    name: 'Prof. James Wilson',
    email: 'james.wilson@university.edu',
    role: 'faculty' as const,
    department: 'Physics',
    college: 'Sciences',
    position: 'Associate Professor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    status: 'active' as const
  },
  {
    id: 5,
    name: 'Alex Rodriguez',
    email: 'alex.rodriguez@university.edu',
    role: 'student' as const,
    department: 'Engineering',
    college: 'Engineering',
    year: '4th Year',
    course: 'Mechanical Engineering',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    status: 'inactive' as const
  },
  {
    id: 6,
    name: 'Dr. Lisa Thompson',
    email: 'lisa.thompson@university.edu',
    role: 'faculty' as const,
    department: 'Biology',
    college: 'Sciences',
    position: 'Assistant Professor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    status: 'active' as const
  }
];

const ManageUsers = () => {
  // const [users, setUsers] = useState<User[]>(mockUsers);
  // const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [getUser,{currentData:users, isFetching}]=useLazyGetUsersQuery();

  const handleSearch = async(searchTerm: string) => {
    console.log("handle",searchTerm);
    
   await getUser({search:searchTerm}).unwrap();
  };
  

  const handleFilter = async(key: string, value: string) => {
    setActiveFilter(value);
 console.log(key,value);
 
     await getUser({[key]:value}).unwrap();
    

  };

  const handleAddUser = (newUser: Omit<User, 'id' | 'avatar'>) => {
    const user: User = {
      ...newUser,
      id: Date.now(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUser.name}`
    };
    setUsers(prev => [...prev, user]);
    setFilteredUsers(prev => [...prev, user]);
  };

  const handleUpdateUser = (updatedUser: User) => {

  };

  const handleDeleteUser = (userId: number) => {

  };

  const studentCount = users?.filter(user => user.role === 'student').length;
  const facultyCount = users?.filter(user => user.role === 'faculty').length;


  const randomColor = useMemo(() => getRandomColor("border"), []);
  return (
    <div className="min-h-screen w-full flex bg-color bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl w-full mx-auto space-y-6">
        {/* Header */}
        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 `}>
          <div>
            <h1 className="text-3xl font-bold text-foreground">User Management</h1>
            <p className="text-muted-foreground mt-1">Manage students and faculty members</p>
          </div>
          <Button 
            className="flex items-center gap-2"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <UserPlus className="w-4 h-4" />
            Add User
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className={`border-${randomColor.colorWithValue}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users?.length}</div>
              <p className="text-xs text-muted-foreground">Active users in system</p>
            </CardContent>
          </Card>
          
          <Card className={`border-${randomColor.colorWithValue}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentCount}</div>
              <p className="text-xs text-muted-foreground">Enrolled students</p>
            </CardContent>
          </Card>
          
          <Card className={`border-${randomColor.colorWithValue}`}> 
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faculty</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{facultyCount}</div>
              <p className="text-xs text-muted-foreground">Teaching staff</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <SearchFilter 
          onSearch={handleSearch}
          onFilter={handleFilter}
          activeFilter={activeFilter}
          randomColor={randomColor}
        />

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {users?.length>0 && users.map(user => (
            <UserCard 
              key={user.id} 
              user={user} 
              onUpdate={handleUpdateUser}
              onDelete={handleDeleteUser}
              randomColor={randomColor}
            />
          ))}
        </div>

{!users &&  isFetching && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">{
  Array.from({length:6}).map((_,index)=><UserCardSkeleton/>)
  }</div>}
       
        <CompAsyncHandler
        children=
           {!isFetching && users?.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold text-foreground">No users found</h3>
            <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or filter criteria.</p>
          </div>
        )
        }
        loadingChildren={<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">{
  Array.from({length:6}).map((_,index)=><UserCardSkeleton/>)
  }</div>}
        />

        <AddUserDialog 
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAddUser={handleAddUser}
        />
      </div>
    </div>
  );
};

export default ManageUsers;