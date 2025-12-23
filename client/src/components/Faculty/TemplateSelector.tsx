import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export interface IdCardTemplate {
  id: string;
  name: string;
  description: string;
  preview: React.ReactNode;
}

interface TemplateSelectorProps {
  templates: IdCardTemplate[];
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
  onContinue: () => void;
}

const TemplateSelector = ({ templates, selectedTemplate, onTemplateSelect, onContinue }: TemplateSelectorProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select ID Card Template</CardTitle>
        <CardDescription>Choose a template for your ID cards</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup value={selectedTemplate} onValueChange={onTemplateSelect}>
          {/* grid grid-cols-1 md:grid-cols-2 */}
          <div className="flex items-start flex-wrap  gap-6">
            {templates.map((template) => (
              <div key={template.id} className="flex  items-center space-x-2">
                <RadioGroupItem value={template.id} id={template.id} />
                <Label htmlFor={template.id} className="flex-1 cursor-pointer">
                  <Card className={`transition-all  ${selectedTemplate === template.id ? 'ring-2 ring-blue-500' : ''}`}>
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
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
        
        <Button 
          onClick={onContinue} 
          disabled={!selectedTemplate}
          className="w-full"
        >
          Continue with Selected Template
        </Button>
      </CardContent>
    </Card>
  );
};

export default TemplateSelector;
