import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, LucideSchool, Users } from 'lucide-react';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

const baseUserSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    role: z.enum(['student', 'faculty']),
    department: z.string().min(1, 'Department is required'),
    college: z.string().min(1, 'College is required'),
    status: z.enum(['active', 'inactive']),
});

const studentSchema = baseUserSchema.extend({
    year: z.string().min(1, 'Academic year is required'),
    course: z.string().min(1, 'Course is required'),
    position: z.string().optional(),
});

const facultySchema = baseUserSchema.extend({
    position: z.string().min(1, 'Position is required'),
    year: z.string().optional(),
    course: z.string().optional(),
});

interface User {
    name: string;
    email: string;
    role: 'student' | 'faculty';
    department: string;
    college?: string;
    year?: string | undefined | number;
    course?: string | undefined;
    position?: string;
    status: 'active' | 'inactive';
}

interface AddUserDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddUser: (user: User) => void;
}

export const AddUserDialog = ({ open, onOpenChange, onAddUser }: AddUserDialogProps) => {
    const [selectedRole, setSelectedRole] = useState<'student' | 'faculty'>('student');
    const [addUser, { isLoading }] = useAddUserMutation();

    const schema = selectedRole === 'student' ? studentSchema : facultySchema;

    const form = useForm<User>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            email: '',
            role: 'student',
            department: '',
            college: '',
            year: '',
            course: '',
            position: '',
            status: 'active'
        }
    });

    const handleSubmit = async (data: User) => {

        await addUser(data).unwrap().then(res => {
            console.log(res);
            toast({
                title:"Added success.",
                description:res?.message,
                toastType:"success"
            })

        }).catch(err => {
            console.log(err);
              toast({
                title:"Added Failed.",
                description:err.data?.message,
                toastType:"error"
            })

        })
        // form.reset();
        console.log(data);
        
        // onOpenChange(false);
    };

    const handleRoleChange = (role: 'student' | 'faculty') => {
        setSelectedRole(role);
        form.setValue('role', role);
        // Clear role-specific fields when switching roles
        if (role === 'student') {
            form.setValue('position', '');
        } else {
            form.setValue('year', '');
            form.setValue('course', '');
        }
    };
    const [formData, setFormData] = useState<object>({
        college: {
            id: "", name: "",
        },
        department: {
            id: "",
            name: ""
        }, course: {
            id: "",
            name: ""
        }

    })
    const [selectedData, setSelectedData] = useState({
        college: [],
        department: [],
        course: [],
        batches: [],
    });
    const [college, { currentData: data, isLoading: collegeLoading }] = useLazyGetCollegesQuery({
        //   refetchOnFocus: true,
        refetchOnReconnect: true
    })
    const randomColor = useMemo(() => getRandomColor("border"), []);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                </DialogHeader>


                <Form {...form}>
                    {isLoading && <CourseLoading containerClass="min-h-[110%] w-full" />}
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 relative">

                        {/* Role Selection */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Select Role</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <Card
                                        className={`cursor-pointer transition-all ${selectedRole === 'student' ? 'ring-2 ring-primary' : ''}`}
                                        onClick={() => handleRoleChange('student')}
                                    >
                                        <CardContent className="p-4 text-center">
                                            <GraduationCap className="w-8 h-8 mx-auto mb-2" />
                                            <h3 className="font-semibold">Student</h3>
                                        </CardContent>
                                    </Card>
                                    <Card
                                        className={`cursor-pointer transition-all ${selectedRole === 'faculty' ? 'ring-2 ring-primary' : ''}`}
                                        onClick={() => handleRoleChange('faculty')}
                                    >
                                        <CardContent className="p-4 text-center">
                                            <Users className="w-8 h-8 mx-auto mb-2" />
                                            <h3 className="font-semibold">Faculty</h3>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Basic Information */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder={selectedRole == "student" ? "Student name..." : "Faculty name..."} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder={selectedRole == "student" ? "Ex.. rakesh@student.com" : "Ex.. ramesh@faculty.com "} type="email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* College and Department */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="college"
                                render={({ field }) => (
                                    <FormItem>

                                        <FormControl>

                                            <SearchWithInput randomColor={randomColor} inputPlaceholder='Search Colleges...'
                                                onChange={async (search) => { college({ search, searchType: "deep" }).unwrap(); setFormData(prev => ({ ...prev, college: { id: '', name: '' } })) }}
                                                onSelect={(res) => {
                                                    console.log(res, "res");
                                                    field.onChange(res?._id)
                                                        ; setSelectedData(prev => ({ ...prev, department: res?.departments })); setFormData(prev => ({ ...prev, college: { id: res._id, name: res?.name } }))
                                                }}
                                                onReset={() => field.onChange("")}
                                                data={data?.colleges}
                                                value={formData.college.name}
                                            />
                                        </FormControl>


                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="department"
                                render={({ field }) => (
                                    <FormItem>

                                        <FormControl>
                                            <SearchWithInput randomColor={randomColor} inputPlaceholder='Search Department...'
                                                labelName='Department'
                                                onReset={async () => { field?.onChange(""); setFormData(prev => ({ ...prev, department: { id: '', name: '' } })) }}
                                                data={selectedData?.department}
                                                value={formData.department.name}
                                                onSelect={(res) => {
                                                    console.log(res, "res");
                                                    field?.onChange(res?._id);
                                                    ; setSelectedData(prev => ({ ...prev, course: res?.courses })); setFormData(prev => ({ ...prev, college: { id: res._id, name: res?.name } }))
                                                }}

                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* <SearchWithInput randomColor={randomColor} inputPlaceholder='Search Colleges...'
                            onChange={async (search) => { college({ search, searchType: "deep" }).unwrap(); setFormData(prev => ({ ...prev, college: { id: '', name: '' } })) }}
                            onSelect={(res) => {
                                console.log(res, "res");
                                ; setSelectedData(prev => ({ ...prev, department: res?.departments })); setFormData(prev => ({ ...prev, college: { id: res._id, name: res?.name } }))
                            }}
                            data={data?.colleges}
                            value={formData.college.name}
                        /> */}
                        { }

                        <FormField
                            control={form.control}
                            name="course"
                            render={({ field }) => (
                                <FormItem>

                                    <FormControl>
                                        <SearchWithInput randomColor={randomColor} inputPlaceholder='Search Courses...'
                                            labelName='Search Course'
                                            onReset={async () => { setFormData(prev => ({ ...prev, course: { id: '', name: '' } })); field.onChange('') }}
                                            onSelect={(res) => {
                                                console.log(res, "res");
                                                field.onChange(res?._id);
                                                ; setSelectedData(prev => ({ ...prev, batches: res?.batches })); setFormData(prev => ({ ...prev, course: { id: res._id, name: res?.name } }))
                                            }}
                                            value={formData.course.name}
                                            data={selectedData?.course}
                                        // data={selectedData?.departments}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />



                        {/* Role-specific fields */}
                        {selectedRole === 'student' && (
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="year"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Academic Year</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select year" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {
                                                        selectedData?.batches?.length > 0 && selectedData?.batches?.map((batch:any, index) => {
                                                            return (
                                                                <SelectItem key={index} value={batch?.batchYear.toString()} >{batch?.batchYear}  -  {batch?.endYear}</SelectItem>
                                                            )
                                                        })

                                                    }

                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                            </div>
                        )}

                        {selectedRole === 'faculty' && (

                            <>
                                <FormField
                                    control={form.control}
                                    name="position"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Position</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select position" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                                                    <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                                                    <SelectItem value="Professor">Professor</SelectItem>
                                                    <SelectItem value="Lecturer">Lecturer</SelectItem>
                                                    <SelectItem value="Instructor">Instructor</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* <FacultyAccessForm/> */}
                            </>
                        )}

                        {/* Status */}
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Add User</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};







import { useEffect } from 'react';


interface User {
    id: number;
    name: string;
    email: string;
    role: 'student' | 'faculty';
    department: string;
    college?: string;
    year?: string | undefined;
    course?: string | undefined;
    position?: string;
    avatar: string;
    status: 'active' | 'inactive';
}

interface EditUserDialogProps {
    user: User;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdate: (user: User) => void;
    randomColor: any
}

export const EditUserDialog = ({ user, randomColor, open, onOpenChange, onUpdate }: EditUserDialogProps) => {
    const schema = user.role === 'student' ? studentSchema : facultySchema;

    const form = useForm<User>({
        resolver: zodResolver(schema),
        defaultValues: user
    });

    useEffect(() => {
        form.reset(user);
    }, [user, form]);

    const handleSubmit = (data: User) => {
        onUpdate(data);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        {/* Basic Information */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Role */}
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="student">Student</SelectItem>
                                            <SelectItem value="faculty">Faculty</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* College and Department */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="college"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>College</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select college" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Engineering">Engineering</SelectItem>
                                                <SelectItem value="Sciences">Sciences</SelectItem>
                                                <SelectItem value="Arts">Arts</SelectItem>
                                                <SelectItem value="Business">Business</SelectItem>
                                                <SelectItem value="Medicine">Medicine</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="department"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Department</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Role-specific fields */}
                        {user.role === 'student' && (
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="year"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Academic Year</FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select year" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="1st Year">1st Year</SelectItem>
                                                    <SelectItem value="2nd Year">2nd Year</SelectItem>
                                                    <SelectItem value="3rd Year">3rd Year</SelectItem>
                                                    <SelectItem value="4th Year">4th Year</SelectItem>
                                                    <SelectItem value="Graduate">Graduate</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="course"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Course</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Computer Science" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}

                        {user.role === 'faculty' && (
                            <FormField
                                control={form.control}
                                name="position"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Position</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select position" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                                                <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                                                <SelectItem value="Professor">Professor</SelectItem>
                                                <SelectItem value="Lecturer">Lecturer</SelectItem>
                                                <SelectItem value="Instructor">Instructor</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {/* Status */}
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">Update User</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};








import { Search, Filter, CheckCircle, XCircle } from 'lucide-react';

interface SearchFilterProps {
    onSearch: (searchTerm: string) => void;
    onFilter: (filter: string, value: string) => void;
    activeFilter: string;
    randomColor: any
}

export const SearchFilter = ({ onSearch, randomColor, onFilter, activeFilter }: SearchFilterProps) => {
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (onSearch && typeof onSearch === "function") {
                onSearch(searchTerm)
            }
        }, 1000);
        return () => clearTimeout(timeout);

    }, [searchTerm])
    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        onSearch(value);
    };

    const filterOptions = [
        { key: 'all', label: 'All Users', icon: Users },
        { key: 'role', value: "student", label: 'Students', icon: GraduationCap },
        { key: 'role', value: "faculty", label: 'Faculty', icon: Users },
        { key: 'isActive', value: true, label: 'Active', icon: CheckCircle },
        { key: 'isActive', value: false, label: 'Inactive', icon: XCircle },
    ];

    return (
        <div className={`bg-card border border-sky-300/70 rounded-lg p-4 space-y-4 `}>
            {/* Search Bar */}
            <div className={`relative  `}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                    placeholder="Search users by name, email, or department..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className={`pl-10 pr-4 border-sky-200/30`}
                />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
                    <Filter className="w-4 h-4" />
                    Filter:
                </div>
                {filterOptions.map(({ key, label, icon: Icon, value }) => (
                    <Button
                        key={value}
                        variant={activeFilter === value ? "default" : "outline"}
                        size="sm"
                        onClick={() => onFilter(key, value)}
                        className="flex items-center gap-1.5 text-xs"
                    >
                        <Icon className="w-3 h-3" />
                        {label}
                    </Button>
                ))}
            </div>
        </div>
    );
};




import { Badge } from '@/components/ui/badge';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, MoreVertical, Edit } from 'lucide-react';
import { getRandomColor } from '@/lib/genrateRandomColor';
import { useAddUserMutation, useLazyGetCollegesQuery, useLazyGetUsersQuery } from '@/services/admin';
import CourseLoading from '../shared/Loading';
import FacultyAccessForm from '../Admin/FacultyAccessForm';
import { SearchWithInput } from '../shared/SearchWithInput';
import { BiSolidSchool } from "react-icons/bi";
import { TbSchool } from "react-icons/tb";
interface User {
    id: number;
    name: string;
    email: string;
    role: 'student' | 'faculty';
    department: string;
    college?: string;
    year?: string;
    course?: string;
    position?: string;
    avatar: string;
    status: 'active' | 'inactive';
}

interface UserCardProps {
    user: User;
    onUpdate: (user: User) => void;
    onDelete: (userId: number) => void;
    [key: string]: any
}

export const UserCard = ({ user, onUpdate, onDelete, randomColor: pRandomColor }: UserCardProps) => {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase();
    };

    const getRoleIcon = () => {
        return user.role === 'student' ? (
            <GraduationCap className="w-4 h-4" />
        ) : (
            <Users className="w-4 h-4" />
        );
    };

    const getRoleBadgeVariant = () => {
        return user?.role === 'student' ? 'default' : 'secondary';
    };

    const getStatusBadgeVariant = () => {
        return user?.isActive  ? 'default' : 'destructive';
    };

    const handleEdit = () => {
        setIsEditDialogOpen(true);
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this user?')) {
            onDelete(user.id);
        }
    };

    const randomColor = useMemo(() => getRandomColor("border"), [])
    return (
        <>
            <Card className={`group hover:shadow-lg transition-all duration-200 hover:border-purple-500/40  hover:border-l-purple-500/90  border-l-4 border-${randomColor?.color}-500/20 border-l-${randomColor?.color}-500/80 `}>
                <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {getInitials(user.name)}
                            </AvatarFallback>
                        </Avatar>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem className="flex items-center gap-2" onClick={handleEdit}>
                                    <Edit className="w-4 h-4" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-2 text-destructive" onClick={handleDelete}>
                                    <Plus className="w-4 h-4 rotate-45" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="space-y-2">
                        <div>
                            <h3 className="font-semibold text-foreground line-clamp-1">{user.name}</h3>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                                <Plus className="w-3 h-3" />
                                <span className="line-clamp-1">{user.email}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant={getRoleBadgeVariant()} className="flex items-center gap-1 text-xs">
                                {getRoleIcon()}
                                {user?.role}
                            </Badge>
                            <Badge variant={getStatusBadgeVariant()} className="text-xs">
                                {user?.isActive?"Active":"InActive"}
                            </Badge>
                        </div>

                        <div className="text-sm text-muted-foreground capitalize flex flex-col justify-start">
                            {user.college && (
                                <div className="font-medium  flex gap-2 items-center"><LucideSchool className=' w-5 h-5'/><p className='truncate'>{user?.college?.name}</p></div>
                            )}
                            <div className="font-medium  flex gap-2 items-center"><BiSolidSchool className='w-4 w-4 ' /><p className='truncate'>{user?.department?.name}</p></div>
                            {user.role === 'student' && user.year && (
                                <div className="text-xs">{user?.year}</div>
                            )}
                            {user.role === 'student' && user?.course && (
                                <div className="text-xs text-primary truncate flex gap-2 items-center"><TbSchool className='w-3 h-3' /> {user?.course?.name}</div>
                            )}
                            {user.role === 'faculty' && user.position && (
                                <div className="text-xs">{user?.position}</div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <EditUserDialog
                user={user}
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                onUpdate={onUpdate}
            />
        </>
    );
};


import { Skeleton } from "@/components/ui/skeleton";
import { toast } from '../shared/Toast';

export default function UserCardSkeleton() {
    return (
        <Card className="group hover:shadow-lg transition-all duration-200 border-l-4 border-muted">
            <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">

                    <div className="h-12 w-12 rounded-full overflow-hidden">
                        <Skeleton className="h-full w-full rounded-full" />
                    </div>


                    <Skeleton className="w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="space-y-2">

                    <div>
                        <Skeleton className="h-4 w-2/3 mb-1" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>


                    <div className="flex items-center gap-2 flex-wrap">
                        <Skeleton className="h-5 w-16 rounded-full" />
                        <Skeleton className="h-5 w-12 rounded-full" />
                    </div>

                    <div className="space-y-1 mt-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-3 w-1/5" />
                        <Skeleton className="h-3 w-1/5" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
