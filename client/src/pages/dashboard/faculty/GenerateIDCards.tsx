

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SingleUserForm from '@/components/Faculty/SingleUserForm';
import MultipleUsersForm from '@/components/Faculty/MultipleUsersForm';
import FileImportForm from '@/components/Faculty/FileImportForm';
import IdCardPreview from '@/components/Faculty/IdCardPreview';
import { IdCard } from '@/types/IdCard';

const GenerateIDCards:React.FC=()=>{
 const [generatedCards, setGeneratedCards] = useState<IdCard[]>([]);
  const [previewMode, setPreviewMode] = useState(false);

  const handleSingleUserSubmit = (cardData: IdCard) => {
    setGeneratedCards([cardData]);
    setPreviewMode(true);
  };

  const handleMultipleUsersSubmit = (cardsData: IdCard[]) => {
    setGeneratedCards(cardsData);
    setPreviewMode(true);
  };

  const handleFileImport = (cardsData: IdCard[]) => {
    setGeneratedCards(cardsData);
    setPreviewMode(true);
  };

  const handleBackToForm = () => {
    setPreviewMode(false);
  };

  if (previewMode) {
    return (
      <div className="min-h-screen bg-gray-50 dark:text-slate-200 dark:bg-gray-900 p-6 w-full">
        <div className="max-w-10xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold dark:text-slate-200  text-gray-900">ID Card Preview</h1>
            <Button onClick={handleBackToForm} variant="outline">
              Back to Form
            </Button>
          </div>
          <IdCardPreview cards={generatedCards} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen dark:text-slate-200 dark:bg-gray-900 bg-white/90 w-full primary-p py-6">
      <div className="max-w-10xl mx-auto">
        <div className="text-left mb-8">
          <h1 className="text-4xl  dark:text-slate-200  font-bold text-gray-900 mb-2">ID Card Generation</h1>
          <p className=" dark:text-slate-400  text-gray-600">Generate professional ID cards for students and faculty</p>
        </div>

        <Card className='dark:bg-slate-900'>
          <CardHeader>
            <CardTitle>Choose Generation Method</CardTitle>
            <CardDescription>
              Select how you want to generate ID cards - single user, multiple users, or import from file
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="single" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="single">Single User</TabsTrigger>
                <TabsTrigger value="multiple">Multiple Users</TabsTrigger>
                <TabsTrigger value="import">File Import</TabsTrigger>
              </TabsList>
              
              <TabsContent value="single" className="mt-6">
                <SingleUserForm onSubmit={handleSingleUserSubmit} />
              </TabsContent>
              
              <TabsContent value="multiple" className="mt-6">
                <MultipleUsersForm onSubmit={handleMultipleUsersSubmit} />
              </TabsContent>
              
              <TabsContent value="import" className="mt-6">
                <FileImportForm onImport={handleFileImport} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// export default PVCIdCard;

export default GenerateIDCards