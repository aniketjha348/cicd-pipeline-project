import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowLeft, GraduationCap, Building2, Users, BookOpen } from 'lucide-react';
import React, { useState } from 'react';
import CollegeForm from '@/components/Admin/CollegeForm';
import CollegeList from '@/components/Admin/CollegeList';
// const CollegeForm=React.lazy(()=>import("../../../components/Admin/CollegeForm"))


const ManageColleges = () => {
    const [showForm, setShowForm] = useState(false);

  const handleAddClick = () => {
    setShowForm(true);
  };

  const handleBackToList = () => {
    setShowForm(false);
  };
 return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-md dark:bg-transparent dark:bg-none primary-p  w-full">
      <div className="max-w-6xl mx-auto ">
        {/* Header Section */}
        <div className="flex items-center gap-4 animate-fade-in relative p-4">
        
          
          {showForm && (
            <Button variant="outline" size="sm" className="hover-scale  absolute top-1/2 right-0" onClick={handleBackToList}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Colleges
            </Button>
          )}
        </div>

        {!showForm ? (
          <>
            {/* Page Title */}
            <div className="text-center space-y-4 animate-fade-in">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-primary/10 rounded-full animate-pulse">
                  <GraduationCap className="h-12 w-12 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-slate-200 mb-2">College Management</h1>
              <p className="text-lg text-gray-600 max-w-2xl dark:text-slate-200/40 mx-auto">
                Manage colleges within your university system with comprehensive details and configurations
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="hover-scale animate-fade-in border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Building2 className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Infrastructure</CardTitle>
                      <CardDescription>Modern facilities and campuses</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="hover-scale animate-fade-in border-l-4 border-l-green-500" style={{animationDelay: '0.1s'}}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Faculty</CardTitle>
                      <CardDescription>Experienced teaching staff</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="hover-scale animate-fade-in border-l-4 border-l-purple-500" style={{animationDelay: '0.2s'}}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <BookOpen className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Programs</CardTitle>
                      <CardDescription>Diverse academic offerings</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>

            {/* College List */}
            <div className="animate-scale-in" style={{animationDelay: '0.3s'}}>
              <CollegeList onAddClick={handleAddClick} />
            </div>
          </>
        ) : (
          <>
            {/* Form Header */}
            {/* <div className="text-center space-y-4 animate-fade-in">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-primary/10 rounded-full animate-pulse">
                  <GraduationCap className="h-12 w-12 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-slate-200 mb-2">Create New College</h1>
              <p className="text-lg text-gray-600 max-w-2xl dark:text-slate-200/40 mx-auto">
                Establish a new college within your university system with comprehensive details and configurations
              </p>
            </div> */}

            {/* College Form */}
            <div className="animate-scale-in" style={{animationDelay: '0.3s'}}>
              <CollegeForm />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ManageColleges;