export const technologies = [
  ['JavaScript', '/assets/icons/javascript.svg'],
  ['Python', '/assets/icons/python.svg'],
  ['React', '/assets/icons/react.svg'],
  ['Node.js', '/assets/icons/nodejs.svg'],
  ['C++', '/assets/icons/cplusplus.svg'],
];

export const projects = [
  {
    id: 'archive',
    title: 'Archive',
    description: 'Community-powered library of books and past exams for students.',
    image: '/assets/project1.jpg',
    visit: 'https://aastu-archive.web.app',
    github: 'https://github.com/squidward404',
  },
  {
    id: 'aastu-social',
    title: 'AASTU-SOCIAL',
    description: 'An in-campus social media website(Version 2 is under development).',
    image: '/assets/project2.jpg',
    visit: 'https://aastu-social.web.app',
    github: 'https://github.com/squidward404',
  },
  {
    id: 'wifi-crasher',
    title: 'WIFI-Crasher',
    description: 'WiFi security testing suite written in Python. Built for ethical hacking learning.',
    image: '/assets/project3.jpg',
    visit: 'https://github.com/squidward404/wifi-crasher',
    github: 'https://github.com/squidward404',
  },
];

export const projectImpact = {
  archive: {
    title: 'Archive Impact Snapshot',
    summary: 'A resource hub helping students quickly find books and past exams.',
    metrics: ['Fast search experience', 'Community submissions', 'Accessible from any device'],
    next: [
      'Add smarter resource filtering by semester and course.',
      'Introduce trusted uploader reputation and moderation tools.',
      'Improve analytics for most useful resources.',
    ],
  },
  'aastu-social': {
    title: 'AASTU-SOCIAL Impact Snapshot',
    summary: 'A campus-focused social platform built for student connection and updates.',
    metrics: ['Campus-first user flow', 'Profiles + social feed', 'Version 2 in progress'],
    next: [
      'Ship better community moderation and reporting tools.',
      'Add groups/clubs channels for department-based conversations.',
      'Improve performance and image delivery for low-data users.',
    ],
  },
  'wifi-crasher': {
    title: 'WIFI-Crasher Impact Snapshot',
    summary: 'A Python learning project focused on ethical security experimentation.',
    metrics: ['Hands-on security learning', 'CLI workflow practice', 'Ethical testing focus'],
    next: [
      'Add clearer safety guardrails and beginner learning mode.',
      'Generate structured scan/test reports for learning review.',
      'Expand modular architecture for additional legal test scenarios.',
    ],
  },
};

export const timelineItems = [
  ['archive', 'Archive — MVP Launch', 'Designed the base UI and released core upload/search flow for books and past exams.'],
  ['archive', 'Archive — Community Contributions', 'Added contribution paths so students can submit and discover useful academic resources.'],
  ['aastu-social', 'AASTU-SOCIAL — Initial Version', 'Built the first on-campus social feed and profile interactions for students.'],
  ['aastu-social', 'AASTU-SOCIAL — Version 2 Planning', 'Prepared architecture and improvements for the upcoming iteration now in development.'],
  ['wifi-crasher', 'WIFI-Crasher — Security Toolkit', 'Implemented practical Python workflows to learn and demonstrate ethical testing concepts.'],
  ['wifi-crasher', 'WIFI-Crasher — Learning Focus', 'Refined the project to emphasize safe experimentation and security education.'],
];

export const hobbies = [
  ['Drawing', 'If I am not working, I love to draw.', '/assets/drawing1.jpg'],
  ['Foot ball', 'I enjoy playing football in my free time.', '/assets/drawing2.jpg'],
  ['Hiking', 'I love exploring nature and going on hiking trips.', '/assets/drawing3.jpg'],
];
