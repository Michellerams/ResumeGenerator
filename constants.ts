
import { Template, ColorScheme, Font } from './types';

export const TEMPLATES: Template[] = [
    { id: 'modern', name: 'Modern' },
    { id: 'professional', name: 'Professional' },
    { id: 'creative', name: 'Creative' },
];

export const COLORS: ColorScheme[] = [
    { name: 'Teal', primary: '#00f2ea', secondary: '#00c1b8', background: '#ffffff', text: '#334155', heading: '#0f172a' },
    { name: 'Blue', primary: '#3b82f6', secondary: '#1d4ed8', background: '#ffffff', text: '#334155', heading: '#0f172a' },
    { name: 'Purple', primary: '#8b5cf6', secondary: '#6d28d9', background: '#ffffff', text: '#334155', heading: '#0f172a' },
    { name: 'Slate', primary: '#64748b', secondary: '#334155', background: '#ffffff', text: '#334155', heading: '#0f172a' },
]

export const FONTS: Font[] = [
    { id: 'poppins', name: 'Poppins', cssClass: 'font-[Poppins]' },
    { id: 'inter', name: 'Inter', cssClass: 'font-[Inter]' },
    { id: 'lato', name: 'Lato', cssClass: 'font-[Lato]' },
]
