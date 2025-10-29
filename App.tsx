import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ResumeData, ATSFeedback, TemplateName, ColorScheme, Font } from './types';
import { enhanceWithAI, getAtsFeedback } from './services/geminiService';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import AtsScore from './components/AtsScore';
import { TEMPLATES, COLORS, FONTS } from './constants';
import { FileDown, Brush, Type, FileText, Bot, Sparkles, LoaderCircle, Download } from 'lucide-react';

declare global {
  interface Window {
    html2canvas: any;
    jspdf: any;
    htmlToDocx: any;
    saveAs: (blob: Blob, filename: string) => void;
  }
}


const App: React.FC = () => {
  const [resumeData, setResumeData] = useState<ResumeData>({
    name: 'Richard Johnson',
    title: 'Senior Frontend Developer',
    contact: {
      email: 'richard.johnson@email.com',
      phone: '123-456-7890',
      linkedin: 'linkedin.com/in/richardj',
      github: 'github.com/richardj',
      website: 'richarddev.com'
    },
    summary: 'Seasoned Frontend Developer with 8+ years of experience in creating responsive and performant web applications using modern technologies. Passionate about UI/UX and building accessible digital experiences.',
    experience: [
      {
        id: 1,
        title: 'Lead Frontend Engineer',
        company: 'Innovate Inc.',
        location: 'San Francisco, CA',
        dates: 'Jan 2020 - Present',
        description: [
          'Led a team of 5 developers in the creation of a new client-facing dashboard, resulting in a 20% increase in user engagement.',
          'Architected and implemented a design system using React and Storybook, improving development consistency and speed by 30%.',
          'Optimized application performance, reducing load times by 40% through code splitting and lazy loading.'
        ]
      },
      {
        id: 2,
        title: 'Software Engineer',
        company: 'Tech Solutions',
        location: 'Austin, TX',
        dates: 'Jun 2016 - Dec 2019',
        description: [
          'Developed and maintained features for a large-scale e-commerce platform using Angular.',
          'Collaborated with UX/UI designers to translate wireframes into high-quality, responsive code.',
          'Wrote unit and end-to-end tests to ensure application stability and reliability.'
        ]
      }
    ],
    education: [
      {
        id: 1,
        degree: 'B.S. in Computer Science',
        institution: 'University of Technology',
        location: 'Austin, TX',
        dates: '2012 - 2016'
      }
    ],
    skills: ['React', 'TypeScript', 'JavaScript', 'Next.js', 'Tailwind CSS', 'Node.js', 'GraphQL', 'Jest', 'CI/CD'],
    interests: ['Open Source Contribution', 'Competitive Programming', 'UX/UI Design blogs'],
    achievements: [
        'Winner of Innovate Inc. Hackathon 2021',
        'Published 3 articles on modern web development on Medium',
        'Speaker at Local JS Meetup'
    ]
  });

  const [jobDescription, setJobDescription] = useState<string>('');
  const [atsFeedback, setAtsFeedback] = useState<ATSFeedback | null>(null);
  const [isLoading, setIsLoading] = useState<{ enhance: boolean, ats: boolean }>({ enhance: false, ats: false });
  
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateName>('modern');
  const [selectedColor, setSelectedColor] = useState<ColorScheme>(COLORS[0]);
  const [selectedFont, setSelectedFont] = useState<Font>(FONTS[0]);
  
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const resumePreviewRef = useRef<HTMLDivElement>(null);
  const appearanceRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (appearanceRef.current && !appearanceRef.current.contains(event.target as Node)) {
        setIsAppearanceOpen(false);
      }
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setIsExportOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDataChange = useCallback((newData: Partial<ResumeData>) => {
    setResumeData(prev => ({ ...prev, ...newData }));
  }, []);

  const handleEnhance = async () => {
    setIsLoading({ ...isLoading, enhance: true });
    setAtsFeedback(null);
    try {
      const enhancedData = await enhanceWithAI(resumeData, jobDescription);
      setResumeData(enhancedData);
    } catch (error) {
      console.error("Failed to enhance resume:", error);
      alert('An error occurred while enhancing the resume with AI. Please check the console.');
    } finally {
      setIsLoading({ ...isLoading, enhance: false });
    }
  };
  
  const handleCheckATS = async () => {
    setIsLoading({ ...isLoading, ats: true });
    setAtsFeedback(null);
    try {
        if (!resumePreviewRef.current) return;
        const resumeText = resumePreviewRef.current.innerText;
        const feedback = await getAtsFeedback(resumeText, jobDescription);
        setAtsFeedback(feedback);
    } catch (error) {
        console.error("Failed to check ATS score:", error);
        alert('An error occurred while checking the ATS score. Please check the console.');
    } finally {
        setIsLoading({ ...isLoading, ats: false });
    }
  };

  const handleExportPDF = async () => {
    if (!resumePreviewRef.current) return;
    
    const { jsPDF } = window.jspdf;
    const canvas = await window.html2canvas(resumePreviewRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
    });
    
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`${resumeData.name.replace(/ /g, '_')}_Resume.pdf`);
    setIsExportOpen(false);
  };
  
  const handleExportDOCX = async () => {
    if (!resumePreviewRef.current) return;
    const elementToExport = resumePreviewRef.current.cloneNode(true) as HTMLElement;
    elementToExport.querySelectorAll('svg').forEach(svg => svg.remove());
    const content = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>${elementToExport.innerHTML}</body></html>`;

    try {
        if (window.htmlToDocx && window.saveAs) {
            const fileBuffer = await window.htmlToDocx.asBlob(content);
            window.saveAs(fileBuffer, `${resumeData.name.replace(/ /g, '_')}_Resume.docx`);
        } else {
            throw new Error('Required export libraries not found.');
        }
    } catch (error) {
        console.error("Failed to export DOCX:", error);
        alert('An error occurred while exporting as DOCX. Please check the console.');
    }
    setIsExportOpen(false);
  };

  const handleExportHTML = () => {
    if (!resumePreviewRef.current) return;
    const googleFontsUrl = "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Inter:wght@400;500;600;700&family=Lato:wght@400;700&display=swap";
    const resumeHtml = resumePreviewRef.current.outerHTML;
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${resumeData.name}'s Resume</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="${googleFontsUrl}" rel="stylesheet">
        <style>
          body {
            background-color: #e5e7eb;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            min-height: 100vh;
            padding-top: 2rem;
            padding-bottom: 2rem;
          }
        </style>
      </head>
      <body>
        ${resumeHtml}
      </body>
      </html>
    `.trim();

    try {
        if (window.saveAs) {
            const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
            window.saveAs(blob, `${resumeData.name.replace(/ /g, '_')}_Resume.html`);
        } else {
            throw new Error('FileSaver library not found.');
        }
    } catch (error) {
        console.error("Failed to export HTML:", error);
        alert('An error occurred while exporting as HTML. Please check the console.');
    }
    setIsExportOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 font-sans antialiased overflow-x-hidden">
      <header className="bg-slate-900/50 backdrop-blur-xl fixed top-0 left-0 right-0 h-16 border-b border-slate-700/50 z-30 flex items-center px-6 justify-between">
        <div className="flex items-center gap-3">
          <FileText className="text-teal-400" size={24} />
          <h1 className="text-xl font-bold text-white tracking-wider">AI Resume Generator</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative" ref={appearanceRef}>
            <button
              onClick={() => { setIsAppearanceOpen(prev => !prev); setIsExportOpen(false); }}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium"
            >
              <Brush size={16} />
              <span>Appearance</span>
            </button>
            {isAppearanceOpen && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl p-4 z-40 animate-fade-in-down space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2 flex items-center gap-2"><Brush size={14} /> Template</label>
                  <div className="grid grid-cols-3 gap-2">
                    {TEMPLATES.map(t => (
                      <button key={t.id} onClick={() => setSelectedTemplate(t.id)} className={`capitalize text-xs py-2 rounded-md transition-all duration-200 ${selectedTemplate === t.id ? 'bg-teal-500 text-white font-bold' : 'bg-slate-700 hover:bg-slate-600'}`}>{t.name}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2 flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-gradient-to-r from-pink-500 to-violet-500"/> Color</label>
                  <div className="flex gap-2 bg-slate-700/50 p-2 rounded-md">
                    {COLORS.map(c => (
                      <button key={c.name} onClick={() => setSelectedColor(c)} className={`w-6 h-6 rounded-full transition-all border-2 transform hover:scale-110 ${selectedColor.name === c.name ? 'border-white' : 'border-transparent'}`} style={{background: c.primary}}></button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2 flex items-center gap-2"><Type size={14} /> Font</label>
                  <select onChange={(e) => setSelectedFont(FONTS.find(f => f.id === e.target.value) || FONTS[0])} value={selectedFont.id} className="w-full bg-slate-700 border-slate-600 rounded-md py-1.5 px-2 text-xs focus:ring-teal-500 focus:border-teal-500">
                    {FONTS.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
          
          <div className="relative" ref={exportRef}>
            <button
              onClick={() => { setIsExportOpen(prev => !prev); setIsAppearanceOpen(false); }}
              className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-lg shadow-teal-600/20 transform hover:-translate-y-0.5 text-sm"
            >
              <Download size={16} />
              <span>Export</span>
            </button>
            {isExportOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl p-2 z-40 animate-fade-in-down">
                <ul className="space-y-1">
                    <li><button onClick={handleExportPDF} className="w-full flex items-center gap-3 text-left px-3 py-2 text-sm rounded-md hover:bg-slate-700 transition-colors"><FileDown size={16} className="text-indigo-400"/> PDF</button></li>
                    <li><button onClick={handleExportDOCX} className="w-full flex items-center gap-3 text-left px-3 py-2 text-sm rounded-md hover:bg-slate-700 transition-colors"><FileDown size={16} className="text-sky-400"/> DOCX</button></li>
                    <li><button onClick={handleExportHTML} className="w-full flex items-center gap-3 text-left px-3 py-2 text-sm rounded-md hover:bg-slate-700 transition-colors"><FileDown size={16} className="text-slate-400"/> HTML</button></li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex flex-col lg:flex-row pt-16">
        <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-8 space-y-6 lg:overflow-y-auto lg:h-[calc(100vh-4rem)]">
          <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3 text-white"><Bot size={24} className="text-teal-400"/>AI Actions</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="job-description" className="block text-sm font-medium text-gray-300 mb-2">Job Description (Optional, but recommended for AI features)</label>
                <textarea
                  id="job-description"
                  rows={5}
                  className="w-full bg-slate-900/70 border border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
                  placeholder="Paste the job description here to tailor your resume..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button onClick={handleEnhance} disabled={isLoading.enhance || isLoading.ats} className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg shadow-blue-600/20 transform hover:-translate-y-0.5">
                  {isLoading.enhance ? <LoaderCircle className="animate-spin" /> : <Sparkles size={18}/>} Enhance with AI
                </button>
                <button onClick={handleCheckATS} disabled={isLoading.ats || isLoading.enhance} className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 disabled:bg-teal-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg shadow-teal-600/20 transform hover:-translate-y-0.5">
                  {isLoading.ats ? <LoaderCircle className="animate-spin" /> : <FileText size={18}/>} Check ATS Score
                </button>
              </div>
            </div>
          </div>
          {(isLoading.ats || atsFeedback) && <AtsScore feedback={atsFeedback} isLoading={isLoading.ats} />}
          <ResumeForm data={resumeData} onDataChange={handleDataChange} />
        </div>

        <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-8 bg-slate-950/30">
          <div className="lg:sticky lg:top-20 space-y-6">
            <div className="transition-all duration-300 group" style={{ perspective: '2000px' }}>
                <ResumePreview
                    ref={resumePreviewRef}
                    data={resumeData}
                    template={selectedTemplate}
                    colorScheme={selectedColor}
                    font={selectedFont}
                    className="transition-transform duration-500 ease-out group-hover:[transform:rotateY(1deg)_rotateX(2deg)_scale(1.02)] transform-gpu"
                />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;