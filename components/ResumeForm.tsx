import React from 'react';
import { ResumeData, Experience, Education } from '../types';
import { PlusCircle, Trash2 } from 'lucide-react';

interface ResumeFormProps {
  data: ResumeData;
  onDataChange: (newData: Partial<ResumeData>) => void;
}

const ResumeForm: React.FC<ResumeFormProps> = ({ data, onDataChange }) => {

  const handleFieldChange = (section: keyof ResumeData, field: string, value: string) => {
    const sectionData = data[section];
    if (typeof sectionData === 'object' && sectionData !== null && !Array.isArray(sectionData)) {
        onDataChange({ [section]: { ...sectionData, [field]: value } });
    }
  };
  
  const handleSimpleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onDataChange({ [name]: value } as any);
  };

  const handleNestedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [section, field] = name.split('.');
    handleFieldChange(section as keyof ResumeData, field, value);
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDataChange({ skills: e.target.value.split(',').map(skill => skill.trim()) });
  };

  const handleInterestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onDataChange({ interests: e.target.value.split(',').map(item => item.trim()) });
  };

  const handleAchievementsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onDataChange({ achievements: e.target.value.split('\n') });
  };


  // Experience Handlers
  const handleExperienceChange = (id: number, field: keyof Experience, value: string | string[]) => {
    const newExperience = data.experience.map(exp =>
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    onDataChange({ experience: newExperience });
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now(),
      title: '', company: '', location: '', dates: '', description: ['']
    };
    onDataChange({ experience: [...data.experience, newExp] });
  };

  const removeExperience = (id: number) => {
    onDataChange({ experience: data.experience.filter(exp => exp.id !== id) });
  };
  
  // Education Handlers
  const handleEducationChange = (id: number, field: keyof Education, value: string) => {
    const newEducation = data.education.map(edu =>
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    onDataChange({ education: newEducation });
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now(),
      degree: '', institution: '', location: '', dates: ''
    };
    onDataChange({ education: [...data.education, newEdu] });
  };

  const removeEducation = (id: number) => {
    onDataChange({ education: data.education.filter(edu => edu.id !== id) });
  };

  return (
    <div className="space-y-6">
      <Section title="Personal Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Full Name" name="name" value={data.name} onChange={handleSimpleChange} />
          <Input label="Job Title" name="title" value={data.title} onChange={handleSimpleChange} />
          <Input label="Email" name="contact.email" value={data.contact.email} onChange={handleNestedChange} />
          <Input label="Phone" name="contact.phone" value={data.contact.phone} onChange={handleNestedChange} />
          <Input label="LinkedIn" name="contact.linkedin" value={data.contact.linkedin} onChange={handleNestedChange} />
          <Input label="GitHub" name="contact.github" value={data.contact.github} onChange={handleNestedChange} />
          <Input label="Website" name="contact.website" value={data.contact.website} onChange={handleNestedChange} className="sm:col-span-2" />
        </div>
      </Section>

      <Section title="Professional Summary">
        <textarea
          name="summary"
          rows={4}
          className="w-full bg-slate-900/70 border border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
          value={data.summary}
          onChange={handleSimpleChange}
        />
      </Section>
      
      <Section title="Education">
        {data.education.map((edu, index) => (
          <div key={edu.id} className="p-4 bg-slate-800/60 rounded-lg border border-slate-700/50 relative mb-4">
            <button onClick={() => removeEducation(edu.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-300"><Trash2 size={18}/></button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Degree / Certificate" value={edu.degree} onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)} />
                <Input label="Institution" value={edu.institution} onChange={(e) => handleEducationChange(edu.id, 'institution', e.target.value)} />
                <Input label="Location" value={edu.location} onChange={(e) => handleEducationChange(edu.id, 'location', e.target.value)} />
                <Input label="Dates" value={edu.dates} onChange={(e) => handleEducationChange(edu.id, 'dates', e.target.value)} />
            </div>
          </div>
        ))}
        <button onClick={addEducation} className="flex items-center gap-2 text-teal-400 font-semibold hover:text-teal-300"><PlusCircle size={18}/> Add Education</button>
      </Section>

      <Section title="Work Experience">
        {data.experience.map((exp, index) => (
          <div key={exp.id} className="p-4 bg-slate-800/60 rounded-lg border border-slate-700/50 relative mb-4">
            <button onClick={() => removeExperience(exp.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-300"><Trash2 size={18}/></button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Job Title" value={exp.title} onChange={(e) => handleExperienceChange(exp.id, 'title', e.target.value)} />
                <Input label="Company" value={exp.company} onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)} />
                <Input label="Location" value={exp.location} onChange={(e) => handleExperienceChange(exp.id, 'location', e.target.value)} />
                <Input label="Dates" value={exp.dates} onChange={(e) => handleExperienceChange(exp.id, 'dates', e.target.value)} />
                <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Description (one bullet per line)</label>
                    <textarea 
                        rows={4}
                        className="w-full bg-slate-900/70 border border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-sm"
                        value={exp.description.join('\n')}
                        onChange={(e) => handleExperienceChange(exp.id, 'description', e.target.value.split('\n'))} />
                </div>
            </div>
          </div>
        ))}
        <button onClick={addExperience} className="flex items-center gap-2 text-teal-400 font-semibold hover:text-teal-300"><PlusCircle size={18}/> Add Experience</button>
      </Section>
      
       <Section title="Skills">
        <Input label="Skills (comma separated)" name="skills" value={data.skills.join(', ')} onChange={handleSkillsChange} />
      </Section>

      <Section title="Interests">
        <Input label="Interests (comma separated)" name="interests" value={data.interests.join(', ')} onChange={handleInterestsChange} />
      </Section>

      <Section title="Achievements">
        <label className="block text-sm font-medium text-gray-300 mb-1">Achievements (one per line)</label>
        <textarea 
            rows={3}
            className="w-full bg-slate-900/70 border border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 text-sm"
            value={data.achievements.join('\n')}
            onChange={handleAchievementsChange} />
      </Section>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
    <h3 className="text-xl font-semibold mb-4 text-white">{title}</h3>
    {children}
  </div>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
  <div className={props.className}>
    <label htmlFor={props.name} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
    <input
      id={props.name}
      type="text"
      className="w-full bg-slate-900/70 border border-slate-600 rounded-lg p-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
      {...props}
    />
  </div>
);

export default ResumeForm;
