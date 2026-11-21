// One shared, detailed description of Ashik and the site, used by every page's structured data.
// Every page points to the same @id values, so Google sees one person, one website and one set of projects.

export const SITE = 'https://ashikur.safeshare.co';
export const PERSON_ID = `${SITE}/#person`;
export const WEBSITE_ID = `${SITE}/#website`;
const id = (k: string) => `${SITE}/#${k}`;
const ref = (k: string) => ({ '@id': id(k) });

export const SAME_AS = [
  'https://www.linkedin.com/in/md-ashikur-rahman-ayon/',
  'https://x.com/md_ashikur_ayon',
  'https://www.instagram.com/md_ashikur_ayon',
  'https://www.facebook.com/md.ashikur.ayon',
  'https://medium.com/@md_ashikur_rahman_ayon',
  'https://www.reddit.com/user/md_ashikur_ayon/',
  'https://www.f6s.com/md-ashikur-rahman-ayon',
  'https://www.crunchbase.com/person/md-ashikur-rahman',
];

const PORTRAIT = {
  '@type': 'ImageObject',
  '@id': id('portrait'),
  url: `${SITE}/img/portrait-halftone.png`,
  contentUrl: `${SITE}/img/portrait-halftone.png`,
  width: 1200,
  height: 1499,
  caption: 'Md Ashikur Rahman (Ashik Ayon), Rajshahi, Bangladesh',
  creditText: 'Md Ashikur Rahman',
  copyrightNotice: '© Md Ashikur Rahman',
};

// ---------- organisations ----------
const rajshahi = { '@type': 'City', '@id': id('rajshahi'), name: 'Rajshahi', containedInPlace: { '@type': 'Country', name: 'Bangladesh' } };

const raredev = {
  '@type': 'Organization', '@id': id('raredev'), name: 'RareDev',
  description: 'A product company from Bangladesh that builds SafeShare, privacy-first file sharing, and Eflow, a living island for Windows.',
  founder: { '@id': PERSON_ID }, location: ref('rajshahi'),
  brand: [ref('safeshare'), ref('eflow')],
};
const safeshare = {
  '@type': 'SoftwareApplication', '@id': id('safeshare'), name: 'SafeShare', url: 'https://safeshare.co',
  applicationCategory: 'UtilitiesApplication', operatingSystem: 'Web',
  description: 'Privacy-first file sharing, used by more than 20,000 people around the world.',
  publisher: ref('raredev'), creator: ref('raredev'),
};
const eflow = {
  '@type': 'SoftwareApplication', '@id': id('eflow'), name: 'Eflow', url: 'https://eflow.safeshare.co',
  applicationCategory: 'DesktopEnhancementApplication', operatingSystem: 'Windows',
  description: 'Assistants, notifications and everyday tools in one small island on the Windows screen.',
  publisher: ref('raredev'), creator: ref('raredev'),
};
const slsn = {
  '@type': 'NGO', '@id': id('slsn'), name: 'Sustainability & Life Sciences Network', alternateName: 'SLSN', url: 'https://slsn.community',
  description: 'A youth-run science and sustainability network that brings olympiads to Bangladesh, sends students abroad to compete and works on local problems such as dengue.',
  foundingDate: '2025-08', founder: { '@id': PERSON_ID }, areaServed: { '@type': 'Country', name: 'Bangladesh' },
  subOrganization: [
    { '@type': 'Event', name: 'Bangladesh Olympiad on Climate Change & Environmental Issues', alternateName: 'BOCE', organizer: [ref('slsn'), { '@type': 'Organization', name: 'Zero Competitions' }], location: { '@type': 'Country', name: 'Bangladesh' } },
  ],
};
const bdoaa = { '@type': 'Organization', '@id': id('bdoaa'), name: 'Bangladesh Olympiad on Astronomy & Astrophysics', alternateName: 'BDOAA' };
const uddhar = { '@type': 'NGO', '@id': id('uddhar'), name: 'Uddhar', alternateName: 'উদ্ধার', description: 'A volunteer group for flood rescue and relief in Bangladesh.' };
const school = { '@type': 'HighSchool', '@id': id('school'), name: 'Harimohan Govt. High School', location: { '@type': 'Place', name: 'Chapainawabganj, Bangladesh' } };

// ---------- roles (who, where, when) ----------
const role = (org: object, roleName: string, startDate: string, endDate?: string) => ({
  '@type': 'OrganizationRole', roleName, startDate, ...(endDate ? { endDate } : {}), memberOf: org,
});

// ---------- the person ----------
export const person = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: 'Md Ashikur Rahman',
  givenName: 'Ashikur',
  familyName: 'Rahman',
  additionalName: 'Ayon',
  alternateName: [
    'Ashikur Rahman', 'Ashik', 'Ayon', 'Ashik Ayon', 'Ashikur Rahman Ayon', 'Md Ashikur Rahman Ayon',
    'Md. Ashikur Rahman', 'Mohammad Ashikur Rahman', 'Muhammad Ashikur Rahman',
    'আশিক', 'আশিকুর রহমান', 'মো. আশিকুর রহমান',
  ],
  url: `${SITE}/`,
  mainEntityOfPage: `${SITE}/about/`,
  image: PORTRAIT,
  description:
    'Md Ashikur Rahman, known as Ashik or Ayon, is a product builder from Rajshahi, Bangladesh. He is co-founder and Head of Product at RareDev, the company behind SafeShare and Eflow, and co-founder and Director of Strategy at the Sustainability & Life Sciences Network (SLSN). He also works with the Bangladesh Olympiad on Astronomy & Astrophysics, volunteers with the flood relief group Uddhar, debates, researches, and writes the Notebook.',
  disambiguatingDescription: 'Co-founder of RareDev (SafeShare, Eflow) and SLSN, from Rajshahi, Bangladesh.',
  jobTitle: ['Co-founder and Head of Product, RareDev', 'Co-founder and Director of Strategy, SLSN'],
  hasOccupation: [
    { '@type': 'Occupation', name: 'Head of Product', occupationLocation: ref('rajshahi'), skills: 'Product strategy, product design, user research, branding' },
    { '@type': 'Occupation', name: 'Entrepreneur', occupationLocation: ref('rajshahi') },
  ],
  worksFor: [
    role(raredev, 'Co-founder and Head of Product', '2026-01'),
    role(slsn, 'Co-founder and Director of Strategy', '2025-08'),
  ],
  memberOf: [
    role(uddhar, 'Admin', '2024-08'),
    role(bdoaa, 'Senior Associate (joined as graphics intern)', '2024-12'),
    role({ '@type': 'Organization', name: 'Harimohan Govt. High School Debate Club' }, 'President', '2025-02', '2026-02'),
    role({ '@type': 'Organization', name: 'Chapainawabganj Debating Club' }, 'Assistant General Secretary', '2025-03', '2026-06'),
    role({ '@type': 'Organization', name: 'Bangladesh United Astronomical Forum' }, 'Head of the Creative Department', '2025-04', '2026-09'),
    role({ '@type': 'Organization', name: 'Bangladesh Space Research Society' }, 'Executive, Creative Department', '2025-04', '2025-12'),
    role({ '@type': 'Organization', name: 'The Knowledge Society', url: 'https://tks.world' }, 'Selected participant', '2026'),
  ],
  alumniOf: ref('school'),
  homeLocation: ref('rajshahi'),
  address: { '@type': 'PostalAddress', addressLocality: 'Rajshahi', addressRegion: 'Rajshahi Division', addressCountry: 'BD' },
  nationality: { '@type': 'Country', name: 'Bangladesh' },
  knowsLanguage: [
    { '@type': 'Language', name: 'Bangla', alternateName: 'bn' },
    { '@type': 'Language', name: 'English', alternateName: 'en' },
    { '@type': 'Language', name: 'Hindi', alternateName: 'hi' },
    { '@type': 'Language', name: 'Urdu', alternateName: 'ur' },
    { '@type': 'Language', name: 'Spanish', alternateName: 'es' },
  ],
  knowsAbout: [
    'Product management', 'Product strategy', 'Product design', 'User experience design', 'Graphic design', 'Branding',
    'Startups', 'Entrepreneurship', 'File sharing', 'Privacy', 'Windows software',
    'Astronomy', 'Astrophysics education', 'Space science', 'Science olympiads',
    'Sustainability', 'Climate change', 'Environmental science', 'Dengue prevention', 'Wildfire detection',
    'Development economics', 'Technology leapfrogging', 'Debate', 'Public speaking',
    'Bangla literature', 'Bangla science fiction', 'George Orwell', 'Animal Farm', 'Chess', 'Jazz',
  ],
  award: [
    'Outstanding Presentation Award, International Scientific Conference on Ecology and Climate Change / International Olympiad on Climate Change, Sirius, Russia (September 2025)',
    'Champion, 9th Rajshahi College Science Fest (February 2026)',
    'First runner-up, IUT Techathon (2026)',
    'First runner-up, BDOAA Astro Poster Competition (April 2025)',
    'Selected, The Knowledge Society, 15% acceptance (2026)',
    'Essay accepted, Open Dialogue Russia, on investments in technology (2026)',
  ],
  owns: [ref('safeshare'), ref('eflow')],
  subjectOf: [{ '@id': `${SITE}/notebook/#blog` }],
  sameAs: SAME_AS,
  email: 'mailto:ashikur.ayon190@gmail.com',
};

// ---------- research and travel, linked back to the person ----------
const research = [
  { '@type': 'CreativeWork', '@id': id('research-slim'), name: 'The Structured Leapfrogging Investment Model', about: 'How a late-developing economy can skip a stage of technology instead of repeating it: the order in which a country invests to leap ahead and keep the growth.', author: { '@id': PERSON_ID }, dateCreated: '2025-12', creativeWorkStatus: 'In progress', genre: 'Research' },
  { '@type': 'CreativeWork', '@id': id('research-astro'), name: 'Astronomy education in Bangladesh', about: 'What is missing in astronomy education in Bangladesh, and how digital learning and local communities could put space science within reach.', author: { '@id': PERSON_ID }, dateCreated: '2025-02', creativeWorkStatus: 'In progress', genre: 'Research' },
  { '@type': 'CreativeWork', '@id': id('research-fire'), name: 'Early wildfire detection', about: 'Using satellite images, weather and environmental data to detect wildfires before they spread.', author: { '@id': PERSON_ID }, dateCreated: '2025-12', creativeWorkStatus: 'In progress', genre: 'Research' },
  { '@type': 'SoftwareApplication', '@id': id('quitora'), name: 'Quitora', description: 'Software to help prevent dengue in Bangladesh, built around a reward model. In development at SLSN.', creator: [ref('slsn'), { '@id': PERSON_ID }], applicationCategory: 'HealthApplication' },
];
const ev = (k: string, name: string, startDate: string, place: string, country: string, extra: object = {}) => ({
  '@type': 'Event', '@id': id(k), name, startDate, eventStatus: 'https://schema.org/EventScheduled',
  location: { '@type': 'Place', name: place, address: { '@type': 'PostalAddress', addressCountry: country } },
  attendee: { '@id': PERSON_ID }, ...extra,
});
const travel = [
  ev('ev-darjeeling', 'Indo-Bangladesh Scouts Friendship Camp', '2024-02', 'Snow View campsite, Kurseong, Darjeeling', 'IN', { description: 'Ashik’s first time representing Bangladesh abroad.' }),
  ev('ev-sirius', 'International Scientific Conference on Ecology and Climate Change', '2025-09', 'Sirius, Sochi', 'RU', { description: 'Represented Bangladesh, presented on environmental solutions and won an Outstanding Presentation Award.' }),
  ev('ev-vietnam', 'Doing Good, a UWC short course', '2026-07', 'Da Nang and Hoi An', 'VN'),
];

// ---------- the website ----------
export const website = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  name: 'Md Ashikur Rahman',
  alternateName: ['Ashik', 'Ashikur Rahman', 'Ashik’s notebook'],
  url: `${SITE}/`,
  description: 'The personal site of Md Ashikur Rahman (Ashik Ayon) from Rajshahi, Bangladesh: his work, the places he has been, the books that shaped him and the Notebook.',
  inLanguage: 'en',
  author: { '@id': PERSON_ID },
  publisher: { '@id': PERSON_ID },
  copyrightHolder: { '@id': PERSON_ID },
  about: { '@id': PERSON_ID },
};

// everything that describes Ashik, for the pages about him
export const personGraph = [website, person, PORTRAIT, rajshahi, raredev, safeshare, eflow, slsn, bdoaa, uddhar, school, ...research, ...travel];
// the light version for article and list pages
export const baseGraph = [website, person, PORTRAIT, rajshahi, raredev, safeshare, eflow, slsn, bdoaa, uddhar, school];

export const crumbs = (items: [string, string][]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: SITE + path })),
});

const clean = (o: unknown): unknown =>
  Array.isArray(o) ? o.map(clean) : o && typeof o === 'object'
    ? Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined).map(([k, v]) => [k, clean(v)]))
    : o;

export const graph = (...nodes: object[]) => clean({ '@context': 'https://schema.org', '@graph': nodes.flat() }) as object;
