import React, { forwardRef } from 'react';
import { ResumeData, TemplateName, ColorScheme, Font } from '../types';
import { Mail, Phone, Linkedin, Github, Globe } from 'lucide-react';

interface ResumePreviewProps {
  data: ResumeData;
  template: TemplateName;
  colorScheme: ColorScheme;
  font: Font;
  className?: string;
}

const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(({ data, template, colorScheme, font, className = '' }, ref) => {

  const templateStyles: { [key in TemplateName]: { container: string, header: string, sectionTitle: string } } = {
    modern: {
        container: 'p-8 grid grid-cols-3 gap-8',
        header: 'col-span-3 text-center mb-4',
        sectionTitle: `font-bold text-sm uppercase tracking-wider pb-1 mb-2 border-b-2`,
    },
    professional: {
        container: 'p-8 flex',
        header: 'text-left w-full mb-4',
        sectionTitle: `font-semibold text-lg pb-1 mb-2`,
    },
    creative: {
        container: 'p-8',
        header: 'text-center mb-6 relative',
        sectionTitle: `font-bold text-base uppercase tracking-widest pb-1 mb-2`,
    }
  };

  const styles = templateStyles[template];

  const renderContact = () => (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs" style={{ color: colorScheme.text }}>
      {data.contact.email && <span className="flex items-center gap-1.5"><Mail size={12} style={{ color: colorScheme.primary }} /> {data.contact.email}</span>}
      {data.contact.phone && <span className="flex items-center gap-1.5"><Phone size={12} style={{ color: colorScheme.primary }} /> {data.contact.phone}</span>}
      {data.contact.linkedin && <span className="flex items-center gap-1.5"><Linkedin size={12} style={{ color: colorScheme.primary }} /> {data.contact.linkedin}</span>}
      {data.contact.github && <span className="flex items-center gap-1.5"><Github size={12} style={{ color: colorScheme.primary }} /> {data.contact.github}</span>}
      {data.contact.website && <span className="flex items-center gap-1.5"><Globe size={12} style={{ color: colorScheme.primary }} /> {data.contact.website}</span>}
    </div>
  );
  
  const summarySection = (
      <section>
        <h2 className={styles.sectionTitle} style={{ borderColor: colorScheme.primary, color: colorScheme.heading }}>Summary</h2>
        <p className="text-sm" style={{ color: colorScheme.text }}>{data.summary}</p>
      </section>
  );

  const educationSection = (
      <section>
        <h2 className={styles.sectionTitle} style={{ borderColor: colorScheme.primary, color: colorScheme.heading }}>Education</h2>
        {data.education.map(edu => (
            <div key={edu.id} className="mb-2">
                <h3 className="font-bold text-sm" style={{ color: colorScheme.heading }}>{edu.degree}</h3>
                <p className="text-xs" style={{ color: colorScheme.text }}>{edu.institution}</p>
                <p className="text-xs" style={{ color: colorScheme.text }}>{edu.dates}</p>
            </div>
        ))}
    </section>
  );

  const experienceSection = (
      <section>
        <h2 className={styles.sectionTitle} style={{ borderColor: colorScheme.primary, color: colorScheme.heading }}>Experience</h2>
        {data.experience.map(exp => (
          <div key={exp.id} className="mb-4">
            <div className="flex justify-between items-baseline">
              <h3 className="font-bold text-base" style={{ color: colorScheme.heading }}>{exp.title}</h3>
              <p className="text-xs font-medium" style={{ color: colorScheme.text }}>{exp.dates}</p>
            </div>
            <p className="text-sm font-semibold" style={{ color: colorScheme.primary }}>{exp.company} | {exp.location}</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              {exp.description.map((item, index) => item && <li key={index} className="text-sm" style={{ color: colorScheme.text }}>{item}</li>)}
            </ul>
          </div>
        ))}
      </section>
  );
  
  const skillsSection = (
       <section>
            <h2 className={styles.sectionTitle} style={{ borderColor: colorScheme.primary, color: colorScheme.heading }}>Skills</h2>
            <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => skill && (
                    <span key={index} className="text-xs font-medium px-2 py-1 rounded" style={{ backgroundColor: colorScheme.primary, color: colorScheme.background === '#ffffff' ? '#000000' : '#ffffff' }}>
                        {skill}
                    </span>
                ))}
            </div>
        </section>
  );
  
  const interestsSection = (
    <section>
        <h2 className={styles.sectionTitle} style={{ borderColor: colorScheme.primary, color: colorScheme.heading }}>Interests</h2>
        <div className="flex flex-wrap gap-2">
            {data.interests.map((interest, index) => interest && (
                <span key={index} className="text-xs font-medium px-2 py-1 rounded" style={{ backgroundColor: colorScheme.primary + '20', color: colorScheme.primary }}>
                    {interest}
                </span>
            ))}
        </div>
    </section>
  );

  const achievementsSection = (
    <section>
        <h2 className={styles.sectionTitle} style={{ borderColor: colorScheme.primary, color: colorScheme.heading }}>Achievements</h2>
        <ul className="list-disc list-inside mt-1 space-y-1">
          {data.achievements.map((item, index) => item && <li key={index} className="text-sm" style={{ color: colorScheme.text }}>{item}</li>)}
        </ul>
    </section>
  );


  const referencesSection = (
    <section>
        <h2 className={styles.sectionTitle} style={{ borderColor: colorScheme.primary, color: colorScheme.heading }}>References</h2>
        <p className="text-sm italic" style={{ color: colorScheme.text }}>Available upon request.</p>
    </section>
  );


  return (
    <div ref={ref} className={`w-[8.5in] h-[11in] shadow-2xl transition-all duration-300 overflow-hidden ${font.cssClass} ${className}`} style={{ backgroundColor: colorScheme.background, color: colorScheme.text }}>
      
      {template === 'modern' && (
        <div className={styles.container}>
            <div className="col-span-1 pr-6 border-r border-gray-200 space-y-6">
                {skillsSection}
                {interestsSection}
            </div>
            <div className="col-span-2 space-y-6">
                <header className='text-left'>
                    <h1 className="text-4xl font-bold" style={{ color: colorScheme.primary }}>{data.name}</h1>
                    <p className="text-xl font-light" style={{ color: colorScheme.heading }}>{data.title}</p>
                    <div className="mt-2 text-left">{renderContact()}</div>
                </header>
                {summarySection}
                {educationSection}
                {experienceSection}
                {achievementsSection}
                {referencesSection}
            </div>
        </div>
      )}

      {template === 'professional' && (
        <div className={styles.container}>
            <div className="w-full">
                <header className={styles.header}>
                    <h1 className="text-4xl font-bold tracking-tight" style={{ color: colorScheme.heading }}>{data.name}</h1>
                    <p className="text-lg font-medium" style={{ color: colorScheme.primary }}>{data.title}</p>
                    <div className="mt-2 text-left">{renderContact()}</div>
                    <div className='w-full h-px mt-4' style={{backgroundColor: colorScheme.secondary}}></div>
                </header>
                <div className="space-y-4">
                    {summarySection}
                    {educationSection}
                    {experienceSection}
                    {skillsSection}
                    {interestsSection}
                    {achievementsSection}
                    {referencesSection}
                </div>
            </div>
        </div>
      )}
      
      {template === 'creative' && (
        <div className={styles.container}>
            <header className={styles.header}>
                 <div className='w-24 h-1 absolute top-1/2 -translate-y-1/2 left-0' style={{backgroundColor: colorScheme.primary}}></div>
                 <div className='w-24 h-1 absolute top-1/2 -translate-y-1/2 right-0' style={{backgroundColor: colorScheme.primary}}></div>
                <h1 className="text-3xl font-bold tracking-widest uppercase" style={{ color: colorScheme.heading }}>{data.name}</h1>
                <p className="text-md font-light tracking-wider" style={{ color: colorScheme.secondary }}>{data.title}</p>
            </header>
            <div className='text-center mb-6'>{renderContact()}</div>
            <div className="space-y-6">
                {summarySection}
                {educationSection}
                {experienceSection}
                {skillsSection}
                {interestsSection}
                {achievementsSection}
                {referencesSection}
            </div>
        </div>
      )}
    </div>
  );
});

export default ResumePreview;