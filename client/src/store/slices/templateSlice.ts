import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export interface TemplateElement {
  id: string;
  type: 'text' | 'image' | 'qrcode' | 'barcode' | 'signature';
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  style?: {
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: string;
    color?: string;
    backgroundColor?: string;
    borderRadius?: number;
    padding?: number;
  };
  field?: string; // For dynamic content (e.g., student.name)
}

export interface IDCardTemplate {
  id: string;
  name: string;
  department?: string;
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
  elements: TemplateElement[];
  background?: string;
  createdAt: string;
  updatedAt: string;
}

interface TemplateState {
  templates: IDCardTemplate[];
  currentTemplate: IDCardTemplate | null;
  loading: boolean;
  error: string | null;
}

// Mock initial templates
const initialTemplates: IDCardTemplate[] = [
  {
    id: '1',
    name: 'Standard ID Card',
    width: 85.6, // Standard card width in mm
    height: 53.98, // Standard card height in mm
    orientation: 'landscape',
    elements: [
      {
        id: 'header',
        type: 'text',
        x: 5,
        y: 5,
        width: 75,
        height: 10,
        content: 'UNIVERSITY NAME',
        style: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#3B82F6',
        },
      },
      {
        id: 'photo',
        type: 'image',
        x: 5,
        y: 18,
        width: 25,
        height: 30,
        content: '',
        field: 'photo',
      },
      {
        id: 'name-label',
        type: 'text',
        x: 35,
        y: 18,
        width: 45,
        height: 5,
        content: 'Name:',
        style: {
          fontSize: 12,
          fontWeight: 'bold',
        },
      },
      {
        id: 'name',
        type: 'text',
        x: 35,
        y: 24,
        width: 45,
        height: 5,
        content: '',
        field: 'name',
        style: {
          fontSize: 12,
        },
      },
      {
        id: 'id-label',
        type: 'text',
        x: 35,
        y: 30,
        width: 45,
        height: 5,
        content: 'ID:',
        style: {
          fontSize: 12,
          fontWeight: 'bold',
        },
      },
      {
        id: 'id',
        type: 'text',
        x: 35,
        y: 36,
        width: 45,
        height: 5,
        content: '',
        field: 'rollNo',
        style: {
          fontSize: 12,
        },
      },
      {
        id: 'department-label',
        type: 'text',
        x: 35,
        y: 42,
        width: 45,
        height: 5,
        content: 'Department:',
        style: {
          fontSize: 12,
          fontWeight: 'bold',
        },
      },
      {
        id: 'department',
        type: 'text',
        x: 35,
        y: 48,
        width: 45,
        height: 5,
        content: '',
        field: 'department',
        style: {
          fontSize: 12,
        },
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const defaultTemplate: IDCardTemplate = {
  id: uuidv4(),
  name: 'New Template',
  width: 85.6,
  height: 53.98,
  orientation: 'landscape',
  elements: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const initialState: TemplateState = {
  templates: initialTemplates,
  currentTemplate: null,
  loading: false,
  error: null,
};

const templateSlice = createSlice({
  name: 'templates',
  initialState,
  reducers: {
    fetchTemplatesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTemplatesSuccess: (state, action: PayloadAction<IDCardTemplate[]>) => {
      state.templates = action.payload;
      state.loading = false;
    },
    fetchTemplatesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentTemplate: (state, action: PayloadAction<string>) => {
      const template = state.templates.find((t) => t.id === action.payload);
      state.currentTemplate = template || null;
    },
    createNewTemplate: (state, action: PayloadAction<Partial<IDCardTemplate> | undefined>) => {
      const now = new Date().toISOString();
      const newTemplate: IDCardTemplate = {
        ...defaultTemplate,
        ...action.payload,
        id: uuidv4(),
        createdAt: now,
        updatedAt: now,
      };
      state.templates.push(newTemplate);
      state.currentTemplate = newTemplate;
    },
    updateTemplate: (state, action: PayloadAction<{ id: string; updates: Partial<IDCardTemplate> }>) => {
      const { id, updates } = action.payload;
      const templateIndex = state.templates.findIndex((template) => template.id === id);
      
      if (templateIndex !== -1) {
        state.templates[templateIndex] = {
          ...state.templates[templateIndex],
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        
        if (state.currentTemplate && state.currentTemplate.id === id) {
          state.currentTemplate = state.templates[templateIndex];
        }
      }
    },
    deleteTemplate: (state, action: PayloadAction<string>) => {
      state.templates = state.templates.filter((template) => template.id !== action.payload);
      
      if (state.currentTemplate && state.currentTemplate.id === action.payload) {
        state.currentTemplate = null;
      }
    },
    addElement: (state, action: PayloadAction<Omit<TemplateElement, 'id'>>) => {
      if (state.currentTemplate) {
        const newElement: TemplateElement = {
          ...action.payload,
          id: uuidv4(),
        };
        
        state.currentTemplate.elements.push(newElement);
        state.currentTemplate.updatedAt = new Date().toISOString();
        
        // Update the template in the templates array
        const templateIndex = state.templates.findIndex((t) => t.id === state.currentTemplate?.id);
        if (templateIndex !== -1) {
          state.templates[templateIndex] = state.currentTemplate;
        }
      }
    },
    updateElement: (state, action: PayloadAction<{ id: string; updates: Partial<TemplateElement> }>) => {
      if (state.currentTemplate) {
        const { id, updates } = action.payload;
        const elementIndex = state.currentTemplate.elements.findIndex((el) => el.id === id);
        
        if (elementIndex !== -1) {
          state.currentTemplate.elements[elementIndex] = {
            ...state.currentTemplate.elements[elementIndex],
            ...updates,
          };
          
          state.currentTemplate.updatedAt = new Date().toISOString();
          
          // Update the template in the templates array
          const templateIndex = state.templates.findIndex((t) => t.id === state.currentTemplate?.id);
          if (templateIndex !== -1) {
            state.templates[templateIndex] = state.currentTemplate;
          }
        }
      }
    },
    deleteElement: (state, action: PayloadAction<string>) => {
      if (state.currentTemplate) {
        state.currentTemplate.elements = state.currentTemplate.elements.filter(
          (el) => el.id !== action.payload
        );
        
        state.currentTemplate.updatedAt = new Date().toISOString();
        
        // Update the template in the templates array
        const templateIndex = state.templates.findIndex((t) => t.id === state.currentTemplate?.id);
        if (templateIndex !== -1) {
          state.templates[templateIndex] = state.currentTemplate;
        }
      }
    },
  },
});

export const {
  fetchTemplatesStart,
  fetchTemplatesSuccess,
  fetchTemplatesFailure,
  setCurrentTemplate,
  createNewTemplate,
  updateTemplate,
  deleteTemplate,
  addElement,
  updateElement,
  deleteElement,
} = templateSlice.actions;

export default templateSlice.reducer;