export interface IdCard {
  admissionId: string | number;
  name: string;
  course: string;
  department: string;
  batchYear: string;
  dateOfBirth: string | number;
  emergencyContact: string | number;
  fatherName: string;
  address: string;
  photo?: string;
  barcode?: string;
}
