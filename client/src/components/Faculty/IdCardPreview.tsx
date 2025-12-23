import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { IdCard } from '@/types/IdCard';
import TemplateSelector, { IdCardTemplate } from './TemplateSelector';
import Template1 from './templates/Template1';
import Template2 from './templates/Template2';
import Template3 from './templates/Template3';
import Template4 from './templates/Template4';

import PrintProgress from './PrintProgress';
import { printIdCardsAsPDF, downloadCardAsImage, printCardsDirectly } from '@/utils/printUtils';
import Template5 from './templates/Template5';

interface IdCardPreviewProps {
  cards: IdCard[];
}

const IdCardPreview = ({ cards }: IdCardPreviewProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState('template1');
  const [showTemplateSelector, setShowTemplateSelector] = useState(true);
  const [showPrintProgress, setShowPrintProgress] = useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  const renderCardWithTemplate = (card: IdCard) => {
    switch (selectedTemplate) {
      case 'template5':
        return <Template5 card={card} />;
      case 'template2':
        return <Template2 card={card} />;
      case 'template3':
        return <Template3 card={card} />;
      case 'template4':
        return <Template4 card={card} />;
      default:
        return <Template5 card={card} />;
    }
  };

  const handlePrint = () => {
    setShowPrintProgress(true);
  };

  const handlePrintComplete = async () => {
    setShowPrintProgress(false);
    
    const cardElements = cardRefs.current.filter(ref => ref !== null) as HTMLElement[];
    if (cardElements.length > 0) {
      await printCardsDirectly(cardElements);
    }
  };

  const handlePrintCancel = () => {
    setShowPrintProgress(false);
  };

  const handleDownloadPDF = async () => {
    const cardElements = cardRefs.current.filter(ref => ref !== null) as HTMLElement[];
    if (cardElements.length > 0) {
      const success = await printIdCardsAsPDF(cardElements, 'id-cards.pdf');
      if (!success) {
        alert('Failed to generate PDF. Please try again.');
      }
    }
  };

  const handleDownloadImages = async () => {
    const cardElements = cardRefs.current.filter(ref => ref !== null) as HTMLElement[];
    for (let i = 0; i < cardElements.length; i++) {
      const element = cardElements[i];
      await downloadCardAsImage(element, `id-card-${i + 1}.png`);
      // Small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const handleDownload = () => {
    const dataStr = JSON.stringify(cards, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'id-cards-data.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (showTemplateSelector) {
    return (
      <TemplateSelector
        templates={templates}
        selectedTemplate={selectedTemplate}
        onTemplateSelect={setSelectedTemplate}
        onContinue={() => setShowTemplateSelector(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 print:hidden">
        <Button onClick={() => setShowTemplateSelector(true)} variant="outline">
          Change Template
        </Button>
        <Button onClick={handlePrint}>Print Cards</Button>
        <Button onClick={handleDownloadPDF} variant="outline">Download as PDF</Button>
        <Button onClick={handleDownloadImages} variant="outline">Download as Images</Button>
        <Button variant="outline" onClick={handleDownload}>Download Data</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {cards.map((card, index) => (
          <div 
            key={index} 
            className="flex p-4 size-fit"
            ref={el => cardRefs.current[index] = el}
          >
            {renderCardWithTemplate(card)}
          </div>
        ))}
      </div>

      <PrintProgress
        isVisible={showPrintProgress}
        onComplete={handlePrintComplete}
        onCancel={handlePrintCancel}
        cardCount={cards.length}
      />
    </div>
  );
};

export default IdCardPreview;
