export interface SkillCategory {
  title: string;
  description: string;
  skills: string[];
}

export const skillsData: SkillCategory[] = [
  {
    title: 'Frontend',
    description: 'Building beautiful, accessible interfaces',
    skills: [
      'React',
      'TypeScript',
      'Next.js',
      'JavaScript',
      'HTML5',
      'CSS/SASS',
      'Tailwind CSS',
      'Material-UI',
      'Framer Motion',
    ]
  },
  {
    title: 'Backend',
    description: 'Server-side solutions & APIs',
    skills: [
      'Node.js',
      'GraphQL',
      'REST APIs',
      'Python',
      'PostgreSQL',
    ]
  },
  {
    title: 'Tools & Practices',
    description: 'Development workflow & collaboration',
    skills: [
      'Git',
      'Accessibility (a11y)',
      'Redux',
      'Testing (Jest)',
      'CI/CD',
      'Figma',
      'Chrome Extensions',
    ]
  }
];
