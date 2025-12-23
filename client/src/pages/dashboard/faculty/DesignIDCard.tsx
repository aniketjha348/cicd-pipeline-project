
import Template1 from '@/components/Faculty/templates/Template1';
import Template2 from '@/components/Faculty/templates/Template2';
import Template3 from '@/components/Faculty/templates/Template3';
import Template4 from '@/components/Faculty/templates/Template4';
import Template5 from '@/components/Faculty/templates/Template5';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IdCard } from '@/types/IdCard';
interface IdCardTemplate {
  id: string;
  name: string;
  description: string;
  preview: React.ReactNode;
}
const cards:[IdCard]=[
  {
    "admissionId": "21223307",
    "name": "Priya Sharma",
    "course": "B.Tech (CS)",
    "department": "SOET",
    "batchYear": "2023",
    "dateOfBirth": "15.03.2003",
    "emergencyContact": "8765432109",
    "fatherName": "Suresh Sharma",
    "address": "House No. 45, Linking Road, Bandra West, Mumbai, Maharashtra - 400050",
    // "photo": "https://lh3.googleusercontent.com/d/12Lf_5KCN-2fifLMzyqvOIu3UWdIDMLsL?authuser=0",
    "photo":"https://drive.google.com/uc?export=view&id=1O_ryeYJDjQzryzyLoxL3VovzNgOYglNa",
    "barcode": "21223307"
  },
]
const DesignIDCard = () => {
  const [selectedTemplate,setSelectedTemplate]=useState('template5')
const templates: IdCardTemplate[] = [
    {
      id: 'template5',
      name: 'IIMT University Template',
      description: 'Official IIMT University design with red branding',
      preview: <Template5 card={cards[0]} />
    },
    {
      id: 'template2',
      name: 'Modern Gradient Template',
      description: 'Contemporary design with blue-purple gradient',
      preview: <Template2 card={cards[0]} />
    },
    {
      id: 'template3',
      name: 'Academic Green Template',
      description: 'Clean academic design with green accents',
      preview: <Template3 card={cards[0]} />
    },
    // {
    //   id: 'template4',
    //   name: 'PVC Card Template',
    //   description: 'Professional PVC ID card design',
    //   preview: <Template4 card={cards[0]} />
    // }
  ];
  return(
    <section className='flex flex-col primary-p'>
         <div className="text-left mb-8">
          <h1 className="text-4xl  dark:text-slate-200  font-bold text-gray-900 mb-2">ID Card Themess/Templates</h1>
          <p className=" dark:text-slate-400  text-gray-600">Select your theme for student ID cards creations</p>
        </div>

<div className="flex gap-2 md:gap-4 justify-start flex-wrap"
>
   {templates.map((template) => (
              
                  <Card onClick={()=>setSelectedTemplate(template?.id)} key={template?.id} className={`transition-all  ${selectedTemplate === template.id ? 'ring-2 ring-blue-500' : ''}`}>
                    <CardHeader className="p-4 ">
                      <CardTitle className="text-sm">{template.name}</CardTitle>
                      <CardDescription className="text-xs">{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 items-center justify-center flex pt-0">
                      <div className="transform scale-75 origin-top-center  ">
                        {template.preview}
                      </div>
                    </CardContent>
                  </Card>
                
            ))}



</div>

    </section>
  )
};

export default DesignIDCard;
