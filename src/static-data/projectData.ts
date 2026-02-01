export interface Project {
	id: number;
	orderNo: string;
	title: string;
	subtitle: string;
	description: string;
	fullDescription: string;
	demoLink: string;
	image: string;
	technologies: string[];
	role: string;
	highlights: string[];
}

export const Projects: Project[] = [
	{
		id: 0,
		orderNo: '01',
		title: 'equally.ai',
		subtitle: 'AI-Powered Accessibility Platform',
		description: 'The landing page of equally.ai - an enterprise accessibility solution',
		fullDescription: 'Designed and developed the marketing website for equally.ai, showcasing their AI-driven accessibility remediation platform. Focused on performance and seamless user experience.',
		demoLink: 'https://equally.ai',
		image: 'https://res.cloudinary.com/abisola/image/upload/v1720393166/Screenshot_2024-07-07_at_23.53.52_gmiikm.png',
		technologies: ['Next.js', 'Material-UI', 'Framer Motion'],
		role: 'Full Stack Developer',
		highlights: [
			'Optimized for performance (95+ Lighthouse)',
			'Smooth scroll animations',
			'Responsive across all devices'
		]
	},
	{
		id: 1,
		orderNo: '02',
		title: 'flowy',
		subtitle: 'Accessibility Made Simple',
		description: 'A Chrome extension for running and managing website accessibility audits',
		fullDescription: 'Flowy empowers developers and content creators to identify and fix accessibility issues in real-time. Built with a focus on usability, it integrates seamlessly into existing workflows and provides actionable insights.',
		demoLink: 'https://chromewebstore.google.com/detail/flowy/fjkmnbfpagmpblgkdflondomjkaejipi?pli=1',
		image: 'https://res.cloudinary.com/abisola/image/upload/v1720393167/Screenshot_2024-07-07_at_23.54.14_rma7z7.png',
		technologies: ['React', 'Material-UI', 'Redux', 'Chrome APIs'],
		role: 'Frontend Developer',
		highlights: [
			'Real-time accessibility scanning',
			'WCAG 2.1 compliance checking',
			'Actionable remediation suggestions'
		]
	},
	{
		id: 2,
		orderNo: '03',
		title: 'testassessify.com',
		subtitle: 'EdTech Assessment Platform',
		description: 'A comprehensive assessment platform for educational institutions',
		fullDescription: 'Built a robust assessment platform that helps educational institutions create, manage, and analyze tests. Features real-time analytics and an intuitive interface for both educators and students.',
		demoLink: 'https://testassessify.com',
		image: 'https://res.cloudinary.com/abisola/image/upload/v1720393166/Screenshot_2024-07-07_at_23.54.59_ek3bjo.png',
		technologies: ['React', 'Node.js', 'REST APIs'],
		role: 'Lead Frontend Developer',
		highlights: [
			'Real-time test analytics',
			'Intuitive question builder',
			'Secure exam environment'
		]
	},
	{
		id: 4,
		orderNo: '04',
		title: 'shortty.app',
		subtitle: 'URL Shortener',
		description: 'A clean, fast URL shortening service',
		fullDescription: 'A minimalist URL shortening application that provides quick link generation with analytics tracking. Built for speed and simplicity.',
		demoLink: 'https://shortty.netlify.app/',
		image: 'https://res.cloudinary.com/abisola/image/upload/v1615895192/shortly_y7s9b3.png',
		technologies: ['React', 'CSS', 'REST APIs'],
		role: 'Developer',
		highlights: [
			'Instant link generation',
			'Clean, minimal interface',
			'Copy to clipboard functionality'
		]
	},
];
