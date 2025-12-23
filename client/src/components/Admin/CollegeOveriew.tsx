import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import clsx from 'clsx';
import { MapPin, Mail, Phone, User, Calendar, Award } from 'lucide-react';

interface College {
  id: string;
  name: string;
  code: string;
  university: string;
  address: string;
  principalName: string;
  contactEmail: string;
  contactPhone: string;
  established: string;
  accreditation: string;
  totalStudents: number;
  totalFaculty: number;
  totalDepartments: number;
}

interface RandomColor {
 class?:string;
  color?:string;
  value?:string | number;
  colorWithValue?:string
}

interface CollegeOverviewProps {
  college: College;
  isEditMode: boolean;
  randomColor: RandomColor;
  university:object;
}

const CollegeOverview = ({ college,university, isEditMode,randomColor }: CollegeOverviewProps) => {
  console.log(randomColor);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
      {/* Basic Information */}
      <Card className="animate-fade-in hover-scale">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Basic Information
          </CardTitle>
          <CardDescription>Core college details and contact information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">College Name</Label>
              {isEditMode ? (
                <Input id="name" className='bg-transparent' defaultValue={college?.name} />
              ) : (
                
                <p className={`mt-1 p-2  border border-${randomColor?.color}-500/60  rounded`}>{college?.name}</p>
              )}
            </div>
            <div>
              <Label htmlFor="code">College Code</Label>
              {isEditMode ? (
                <Input id="code" defaultValue={college?.code} />
              ) : (
                <p className={`mt-1 p-2  border border-${randomColor?.color}-500/60  rounded`}>{college?.code}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="university">University</Label>
            {isEditMode ? (
              <Input disabled id="university" defaultValue={university?.name} />
            ) : (
              <p className={`mt-1 p-2  border border-${randomColor?.color}-500/60  rounded`}>{university?.name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            {JSON.stringify(college?.address?.line1)}
            {isEditMode ? (
              <Textarea id="address" defaultValue={college?.address ? college?.address?.line1:college?.address } />

            ) : (
              <div className={`mt-1 p-2 rounded flex items-start gap-2  border border-${randomColor?.color}-500/60`}>
                <MapPin className="h-4 w-4 mt-0.5 text-gray-400" />
                <span>{college?.address ? college?.address?.line1:college?.address }</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="animate-fade-in hover-scale" style={{animationDelay: '0.1s'}}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Contact Information
          </CardTitle>
          <CardDescription>Principal and administrative contacts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="principal">Principal Name</Label>
            {isEditMode ? (
              <Input id="principal" defaultValue={college?.principalName} />
            ) : (
              <div className={`mt-1 p-2   border border-${randomColor?.color}-500/60 rounded flex items-center gap-2`}>
                <User className="h-4 w-4 text-gray-400" />
                <span>{college?.principalName}</span>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="email">Contact Email</Label>
            {isEditMode ? (
              <Input id="email" type="email" defaultValue={college?.contactEmail ?? college?.email} />
            ) : (
              <div className={`mt-1 p-2   border border-${randomColor?.color}-500/60 rounded flex items-center gap-2`}>
                <Mail className="h-4 w-4 text-gray-400" />
                <span>{college?.contactEmail ?? college?.email}</span>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="phone">Contact Phone</Label>
            {isEditMode ? (
              <Input id="phone" defaultValue={college?.contactPhone ?? college?.phone} />
            ) : (
              <div className={`mt-1 p-2   border border-${randomColor?.color}-500/60 rounded flex items-center gap-2`}>
                <Phone className="h-4 w-4 text-gray-400" />
                <span>{college?.contactPhone ?? college?.phone}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Additional Details */}
      <Card className="animate-fade-in hover-scale lg:col-span-2" style={{animationDelay: '0.2s'}}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Additional Details
          </CardTitle>
          <CardDescription>Institutional information and achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">{college?.established}</div>
              <div className="text-sm text-gray-600">Year Established</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
              <Award className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-lg font-bold text-green-600">{college?.accreditation}</div>
              <div className="text-sm text-gray-600">Accreditation</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
              <User className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-lg font-bold text-purple-600">Active</div>
              <div className="text-sm text-gray-600">Status</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollegeOverview;