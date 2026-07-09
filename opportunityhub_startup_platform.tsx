import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Calendar, 
  Bookmark, 
  Share2, 
  Filter, 
  ArrowRight, 
  CheckCircle, 
  TrendingUp, 
  Clock, 
  Award, 
  Users, 
  Compass, 
  ChevronDown, 
  SlidersHorizontal,
  Plus, 
  Trash2, 
  Edit, 
  User, 
  Bell, 
  LayoutDashboard, 
  Database, 
  Mail, 
  Lock, 
  Sparkles, 
  AlertCircle, 
  ExternalLink, 
  Globe, 
  BookOpen, 
  DollarSign, 
  ShieldCheck,
  Send,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  BarChart3,
  CalendarDays,
  ListTodo
} from 'lucide-react';

// Firebase Web SDK Imports
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';

// Fallback Firebase Configuration
const fallbackFirebaseConfig = {
  apiKey: "",
  authDomain: "opportunity-hub-preview.firebaseapp.com",
  projectId: "opportunity-hub-preview",
  storageBucket: "opportunity-hub-preview.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:123456"
};

// Initialize Firebase dynamically with the environment variables
const firebaseConfig = typeof __firebase_config !== 'undefined' 
  ? JSON.parse(__firebase_config) 
  : fallbackFirebaseConfig;

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'opportunity-hub';

// Expanded Master Opportunity Database containing exactly 105 highly curated entries
const INITIAL_OPPORTUNITIES = [
  {
    id: "opp-1",
    title: "Rise Global Fellowship",
    organization: "Schmidt Futures & Rhodes Trust",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80",
    description: "Rise is a global initiative that finds brilliant young minds and supports them for life as they work to serve others. Anyone aged 15-17 can apply from anywhere in the world.",
    eligibility: "Students aged 15-17. All nationalities and backgrounds are welcome.",
    benefits: "Lifetime global support network, higher education scholarships, technology packages, and residential summits.",
    requirements: "Individual social impact project, video presentations, and peer evaluations.",
    tips: "Focus heavily on demonstrating empathy, resilience, integrity, and exceptional service to your local community.",
    officialLink: "https://www.risefortheworld.org",
    category: "Fellowships",
    country: "Global",
    isOnline: true,
    isFree: true,
    cost: 0,
    difficulty: "Advanced",
    deadline: "2026-10-15",
    views: 4890,
    tags: ["Leadership", "Social Impact", "Scholarship", "Global Network"]
  },
  {
    id: "opp-2",
    title: "Research Science Institute (RSI)",
    organization: "Center for Excellence in Education (CEE) / MIT",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=120&q=80",
    description: "RSI is an intensive on-campus scientific research summer program hosted at the Massachusetts Institute of Technology, bringing together high-achieving math and science scholars.",
    eligibility: "High school juniors (typically Grade 11). Exceptional STEM record required.",
    benefits: "Fully funded research stay at MIT, direct mentorship by industry-leading scientists, and access to advanced labs.",
    requirements: "Academic transcripts, standardized test scores, recommendations, and research proposal essays.",
    tips: "Demonstrate high analytical capability and describe your passion for exploring unresolved scientific problems in detail.",
    officialLink: "https://www.cee.org/programs/research-science-institute",
    category: "Research Programs",
    country: "United States",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Olympiad",
    deadline: "2026-01-15",
    views: 8200,
    tags: ["STEM", "Physics", "Chemistry", "Biology", "MIT"]
  },
  {
    id: "opp-3",
    title: "Google Computer Science Summer Institute",
    organization: "Google Inc.",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&w=120&q=80",
    description: "An intensive computer science introduction for graduating high school seniors, with an emphasis on students from historically underrepresented backgrounds in technology.",
    eligibility: "Graduating high school seniors intending to major in Computer Science or Software Engineering.",
    benefits: "Full technical tuition, direct Googler mentorship, hardware packages, and software development workshops.",
    requirements: "Online application, logical/coding questionnaire, high school transcript, and optional code portfolios.",
    tips: "Showcase a collaborative mindset, natural technology curiosity, and community representation over pure competitive programming.",
    officialLink: "https://buildyourfuture.withgoogle.com",
    category: "Summer Programs",
    country: "United States",
    isOnline: true,
    isFree: true,
    cost: 0,
    difficulty: "Intermediate",
    deadline: "2026-03-01",
    views: 6540,
    tags: ["Coding", "Google", "Underrepresented", "Software Development"]
  },
  {
    id: "opp-4",
    title: "Geneva International Youth Hackathon",
    organization: "CERN Scientific Circle",
    orgVerified: false,
    logoUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=120&q=80",
    description: "An annual high school hackathon hosted virtually and physically in Geneva to solve complex scientific computing and engineering challenges.",
    eligibility: "Global youth aged 14 to 19. Teams of up to 4 or solo registrations allowed.",
    benefits: "Generous cash prize pool, invitations to tour CERN's facility, and cloud computing resources.",
    requirements: "Submit a working software prototype or system architecture addressing the annual prompt.",
    tips: "Focus on clean user experience design and clear presentation. Show how your project integrates scientific APIs.",
    officialLink: "https://geneva-science-hack.ch",
    category: "Hackathons",
    country: "Switzerland",
    isOnline: true,
    isFree: true,
    cost: 0,
    difficulty: "Intermediate",
    deadline: "2026-08-30",
    views: 3120,
    tags: ["Hackathon", "Open Source", "CERN", "Physics"]
  },
  {
    id: "opp-5",
    title: "The Concord Review Academic Publication",
    organization: "The Concord Review, Inc.",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=120&q=80",
    description: "The premier quarterly journal globally that publishes historical research essays written by secondary school students.",
    eligibility: "Secondary school students globally. Essays must be written prior to college enrollment.",
    benefits: "International indexing, print distribution to university libraries, and prestigious academic recognition.",
    requirements: "Historical essay of 4,000 to 8,000 words with complete endnotes in Turabian/Chicago format.",
    tips: "Invest time in primary source evaluation. Ensure your thesis is clear and supported by thorough historical evidence.",
    officialLink: "https://www.tcr.org",
    category: "Research Programs",
    country: "Global",
    isOnline: true,
    isFree: false,
    cost: 70,
    difficulty: "Advanced",
    deadline: "2026-09-01",
    views: 4200,
    tags: ["History", "Research Essay", "Publication", "Humanities"]
  },
  {
    id: "opp-6",
    title: "The Gates Scholarship",
    organization: "Bill & Melinda Gates Foundation",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=120&q=80",
    description: "A highly selective, full scholarship for outstanding, minority high school seniors from low-income households.",
    eligibility: "US high school seniors with a minimum weighted GPA of 3.3 and Pell-eligibility.",
    benefits: "Covers the entire cost of college tuition, room, board, books, and required fees not covered by financial aid.",
    requirements: "FASFA details, leadership record, recommendations, and essays.",
    tips: "Emphasize leadership commitment, self-determination, and active participation in community service.",
    officialLink: "https://www.thegatesscholarship.org",
    category: "Scholarships",
    country: "United States",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Advanced",
    deadline: "2026-09-15",
    views: 9200,
    tags: ["Scholarship", "Underrepresented", "College Funding", "Leadership"]
  },
  {
    id: "opp-7",
    title: "Yale Young Global Scholars (YYGS)",
    organization: "Yale University",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=120&q=80",
    description: "An academic development summer program for outstanding high school sophomores and juniors to study at Yale's campus.",
    eligibility: "At least 15 years old, current high school sophomores or juniors.",
    benefits: "Seminar learning, engagement with Yale faculty, and networking within a global peer community.",
    requirements: "Transcripts, teacher recommendation, extracurricular list, and application essays.",
    tips: "Write essays that show intellectual curiosity, creative approach, and a desire to engage with diverse global points of view.",
    officialLink: "https://globalscholars.yale.edu",
    category: "Summer Programs",
    country: "United States",
    isOnline: false,
    isFree: false,
    cost: 3500,
    difficulty: "Intermediate",
    deadline: "2026-01-10",
    views: 7400,
    tags: ["Global Affairs", "Academic Summer", "Yale", "Humanities", "STEM"]
  },
  {
    id: "opp-8",
    title: "International Olympiad in Informatics (IOI)",
    organization: "IOI Committee",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=120&q=80",
    description: "The premier global computer science and algorithmic programming competition for secondary school students.",
    eligibility: "High school qualifiers chosen via country-specific national selection trials.",
    benefits: "Global academic prestige, gold/silver/bronze medals, and direct networking with top universities.",
    requirements: "Qualification through national training squad contests (e.g. USACO in the United States).",
    tips: "Build structural expertise in advanced algorithms, complex graph techniques, and dynamic programming paradigms.",
    officialLink: "https://ioinformatics.org",
    category: "Olympiads",
    country: "Global",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Olympiad",
    deadline: "2026-05-15",
    views: 11200,
    tags: ["Programming", "Olympiad", "Algorithms", "STEM", "Competitive"]
  },
  {
    id: "opp-9",
    title: "Davidson Fellows Scholarship",
    organization: "Davidson Institute",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=120&q=80",
    description: "Recognizes extraordinary youth under the age of 18 who have completed significant college-level work in science, technology, mathematics, literature, music, or philosophy.",
    eligibility: "US citizens or permanent residents aged 18 and under.",
    benefits: "Scholarships of up to $50,000, national ceremony attendance, and lifelong support.",
    requirements: "Submission of a major portfolio demonstrating work at a high level of academic or artistic mastery.",
    tips: "Focus on presenting independent work that clearly shows original thought and innovative analytical techniques.",
    officialLink: "https://www.davidsongifted.org",
    category: "Scholarships",
    country: "United States",
    isOnline: true,
    isFree: true,
    cost: 0,
    difficulty: "Advanced",
    deadline: "2026-02-12",
    views: 5100,
    tags: ["Scholarship", "Advanced STEM", "Literature", "Gifted Youth"]
  },
  {
    id: "opp-10",
    title: "Regeneron Science Talent Search (STS)",
    organization: "Society for Science",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=120&q=80",
    description: "The oldest and most prestigious math and science research competition for high school seniors in the United States.",
    eligibility: "High school seniors living or studying in the United States.",
    benefits: "Awards ranging up to $250,000, national media coverage, and professional review by leading scientists.",
    requirements: "An original scientific research report, school transcript, and essays.",
    tips: "Ensure your research paper clearly demonstrates a deep personal understanding of your scientific method.",
    officialLink: "https://www.societyforscience.org/regeneron-sts/",
    category: "Competitions",
    country: "United States",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Olympiad",
    deadline: "2026-11-10",
    views: 9400,
    tags: ["STEM", "Research Project", "Competition", "Science Policy"]
  },
  {
    id: "opp-11",
    title: "Breakthrough Junior Challenge",
    organization: "Breakthrough Prize Foundation",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&q=80",
    description: "An international video challenge that encourages students to explain complex scientific, mathematical, or life science concepts.",
    eligibility: "Students aged 13 to 18 from all around the world.",
    benefits: "$250,000 college scholarship, plus school science laboratory upgrades.",
    requirements: "A maximum 2-minute original explanatory video on a scientific or mathematical theory.",
    tips: "Use creative analogies, dynamic graphics, and clear, energetic narration to explain your chosen topic.",
    officialLink: "https://breakthroughjuniorchallenge.org",
    category: "Competitions",
    country: "Global",
    isOnline: true,
    isFree: true,
    cost: 0,
    difficulty: "Intermediate",
    deadline: "2026-06-25",
    views: 8900,
    tags: ["Video Contest", "STEM", "Scholarship", "Creative Writing"]
  },
  {
    id: "opp-12",
    title: "International Mathematical Olympiad (IMO)",
    organization: "IMO Board",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=120&q=80",
    description: "The World Championship Mathematics Competition for High School students, representing over 100 countries.",
    eligibility: "Pre-university students representing their national mathematical delegations.",
    benefits: "Top-tier global recognition, gold/silver/bronze medals, and excellent standing for university applications.",
    requirements: "Rigorous multi-stage qualification via national olympiad exams (e.g. USAMO, UKMT).",
    tips: "Master complex proofs in Euclidean geometry, combinatorics, number theory, and advanced algebra.",
    officialLink: "https://www.imo-official.org",
    category: "Olympiads",
    country: "Global",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Olympiad",
    deadline: "2026-07-01",
    views: 12500,
    tags: ["Math", "Olympiad", "Elite", "Proofs"]
  },
  {
    id: "opp-13",
    title: "International Physics Olympiad (IPhO)",
    organization: "IPhO Committee",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=120&q=80",
    description: "The global physics showdown bringing together top young minds to solve complex theoretical and experimental physics problems.",
    eligibility: "Selected high school physics delegates from participating nations.",
    benefits: "Invaluable physics network, medals, and high recognition by technical admissions officers.",
    requirements: "Qualification through national physics tests (such as USAPhO, BPhO).",
    tips: "Focus on classical mechanics, thermodynamics, electromagnetic theory, and experimental lab methodologies.",
    officialLink: "https://www.ipho-official.org",
    category: "Olympiads",
    country: "Global",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Olympiad",
    deadline: "2026-06-15",
    views: 8900,
    tags: ["Physics", "Olympiad", "STEM", "Theoretical Research"]
  },
  {
    id: "opp-14",
    title: "International Chemistry Olympiad (IChO)",
    organization: "IChO Committee",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=120&q=80",
    description: "A major international chemistry competition testing advanced laboratory techniques and complex organic/inorganic chemistry theories.",
    eligibility: "Secondary school students qualifying through national chemistry olympiads.",
    benefits: " Prestigious international awards, chemical synthesis network, and lab technique validation.",
    requirements: "Successful qualification in national chemistry team trials (e.g. USNCO).",
    tips: "Build theoretical strength in organic synthesis mechanisms, quantum chemistry, and chemical thermodynamics.",
    officialLink: "https://www.icho-official.org",
    category: "Olympiads",
    country: "Global",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Olympiad",
    deadline: "2026-07-10",
    views: 7100,
    tags: ["Chemistry", "Olympiad", "STEM", "Organic Chemistry"]
  },
  {
    id: "opp-15",
    title: "International Biology Olympiad (IBO)",
    organization: "IBO Association",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&w=120&q=80",
    description: "The premier global competition for secondary school biology students, covering cell biology, genetics, ecology, and biochemistry.",
    eligibility: "Top 4 biology high school qualifiers from each participating nation.",
    benefits: "Global medal recognition, field trips, and academic engagement with life science scholars.",
    requirements: "Selection through national biology exams (such as USABO).",
    tips: "Ensure deep study of plant physiology, modern genetics, biosystematics, and bioinformatics.",
    officialLink: "https://www.ibo-info.org",
    category: "Olympiads",
    country: "Global",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Olympiad",
    deadline: "2026-06-20",
    views: 6800,
    tags: ["Biology", "Olympiad", "Genetics", "STEM"]
  },
  {
    id: "opp-16",
    title: "International Linguistics Olympiad (IOL)",
    organization: "IOL Committee",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=120&q=80",
    description: "An international competition challenging high schoolers to solve logical puzzles involving unknown human languages.",
    eligibility: "Secondary school students selected via national language/computational linguistics contests.",
    benefits: "Builds analytical reasoning, global linguistic connections, and high-prestige recognition.",
    requirements: "National team selection (e.g. NACLO in North America). No prior language study required.",
    tips: "Develop pattern-recognition skills and practice identifying structural rules in logical puzzles.",
    officialLink: "https://www.ioling.org",
    category: "Olympiads",
    country: "Global",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Olympiad",
    deadline: "2026-07-25",
    views: 5900,
    tags: ["Linguistics", "Language Logic", "Olympiad", "Pattern Recognition"]
  },
  {
    id: "opp-17",
    title: "Regeneron International Science and Engineering Fair (ISEF)",
    organization: "Society for Science",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&q=80",
    description: "The world's largest pre-college science competition, gathering thousands of high school researchers to share pioneering projects.",
    eligibility: "High school students globally qualifying via local or regional ISEF-affiliated science fairs.",
    benefits: "Cumulative cash prizes up to $5M, global media outreach, and recognition from industry leaders.",
    requirements: "Completion of an independent research project adhering to scientific research guidelines.",
    tips: "Formulate a strong, testable hypothesis and present a detailed, data-driven analysis of your results.",
    officialLink: "https://www.societyforscience.org/isef/",
    category: "Competitions",
    country: "Global",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Olympiad",
    deadline: "2026-05-10",
    views: 11400,
    tags: ["STEM", "Science Fair", "ISEF Affiliate", "Research Project"]
  },
  {
    id: "opp-18",
    title: "Congressional App Challenge",
    organization: "US House of Representatives",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=120&q=80",
    description: "An official US initiative encouraging high schoolers to learn coding by design and build software applications.",
    eligibility: "High school or middle school students residing in a participating US Congressional District.",
    benefits: "Recognition from your US Representative, feature on Capitol Hill, and AWS credit awards.",
    requirements: "An original software application (mobile, web, desktop) and an explanatory demonstration video.",
    tips: "Explain how your app solves a real community challenge, and clearly outline your technical development steps.",
    officialLink: "https://www.congressionalappchallenge.us",
    category: "Competitions",
    country: "United States",
    isOnline: true,
    isFree: true,
    cost: 0,
    difficulty: "Intermediate",
    deadline: "2026-10-24",
    views: 6200,
    tags: ["Coding", "App Design", "US Government", "STEM"]
  },
  {
    id: "opp-19",
    title: "Harvard-MIT Mathematics Tournament (HMMT)",
    organization: "Harvard and MIT Student Boards",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=120&q=80",
    description: "One of the largest and most challenging student-run math tournaments in the world, attracting top global math competitors.",
    eligibility: "High school teams or individual registrants meeting entry requirements.",
    benefits: "Direct experience with MIT/Harvard students, difficult math problems, and peer networking.",
    requirements: "Registration of teams of up to 6 or 8 depending on the event (November or February rounds).",
    tips: "Practice past problem sets focusing on fast, non-standard algebraic shortcuts and combinatorics.",
    officialLink: "https://www.hmmt.org",
    category: "Competitions",
    country: "United States",
    isOnline: false,
    isFree: false,
    cost: 120,
    difficulty: "Advanced",
    deadline: "2026-01-15",
    views: 8100,
    tags: ["Math Tournament", "Harvard", "MIT", "Competitive Math"]
  },
  {
    id: "opp-20",
    title: "Stanford Math Tournament (SMT)",
    organization: "Stanford University Students",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=120&q=80",
    description: "An annual mathematics tournament for high school students run by Stanford students, with individual and team tests.",
    eligibility: "High school student teams globally.",
    benefits: "Engagement with Stanford academic culture and opportunities to win prizes.",
    requirements: "Online registration for individual and team mathematical challenges.",
    tips: "Build team coordination to split complex multi-part questions under strict time limits.",
    officialLink: "https://sumo.stanford.edu/smt/",
    category: "Competitions",
    country: "United States",
    isOnline: true,
    isFree: false,
    cost: 50,
    difficulty: "Advanced",
    deadline: "2026-03-10",
    views: 5800,
    tags: ["Math", "Stanford", "Team Contest", "Competitive"]
  },
  {
    id: "opp-21",
    title: "MIT THINK Scholars Program",
    organization: "Massachusetts Institute of Technology",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80",
    description: "An educational initiative promoting STEM research by supporting projects designed and proposed by high school students.",
    eligibility: "High school students residing in the United States.",
    benefits: "Funding of up to $1,000, direct MIT mentorship, and an invitation to visit MIT's campus.",
    requirements: "A detailed research proposal detailing technical challenges and experimental design.",
    tips: "Focus your proposal on a clear, achievable objective using existing, accessible scientific tools.",
    officialLink: "https://think.mit.edu",
    category: "Research Programs",
    country: "United States",
    isOnline: true,
    isFree: true,
    cost: 0,
    difficulty: "Advanced",
    deadline: "2026-01-01",
    views: 7400,
    tags: ["STEM Research", "MIT Mentorship", "Project Grant", "Engineering"]
  },
  {
    id: "opp-22",
    title: "Blue Ocean Entrepreneurship Competition",
    organization: "Blue Ocean Committee",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=120&q=80",
    description: "The most prestigious virtual entrepreneurship competition for high school students globally.",
    eligibility: "High school students from any nation.",
    benefits: "Thousands of dollars in cash prizes, startup evaluations, and business planning experience.",
    requirements: "A 3-minute pitch video explaining a product design and its target market.",
    tips: "Explain how your product creates a new, uncontested market space (a 'blue ocean') rather than fighting existing competitors.",
    officialLink: "https://blueoceancompetition.org",
    category: "Competitions",
    country: "Global",
    isOnline: true,
    isFree: true,
    cost: 0,
    difficulty: "Intermediate",
    deadline: "2026-02-15",
    views: 6900,
    tags: ["Entrepreneurship", "Pitch Contest", "Business", "Virtual Study"]
  },
  {
    id: "opp-23",
    title: "Wharton High School Investment Competition",
    organization: "Wharton School, University of Pennsylvania",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=120&q=80",
    description: "A global simulation-based investment challenge for high school students and teachers.",
    eligibility: "Teams of 4 to 7 high school students from around the world.",
    benefits: "Access to Wharton's OTIS trading simulator and certificate awards for regional finalists.",
    requirements: "A comprehensive investment strategy document tailored to a designated client brief.",
    tips: "Develop a quantitative strategy aligned with your client's unique long-term objectives rather than pursuing high-risk returns.",
    officialLink: "https://globalyouth.wharton.upenn.edu",
    category: "Competitions",
    country: "Global",
    isOnline: true,
    isFree: true,
    cost: 0,
    difficulty: "Advanced",
    deadline: "2026-09-18",
    views: 9100,
    tags: ["Finance", "Investment", "Wharton", "Team Play"]
  },
  {
    id: "opp-24",
    title: "New York Academy of Sciences - Curated Alliance",
    organization: "NYAS",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=120&q=80",
    description: "A global program that connects high schoolers with STEM mentors to address complex international sustainability challenges.",
    eligibility: "Students aged 13 to 17 from any country.",
    benefits: "Mentorship by scientists, access to an online community, and certificates of completion.",
    requirements: "Online application showing interest in global issues, science, and technology.",
    tips: "Highlight how you plan to use technology or science to support environmental or social initiatives in your region.",
    officialLink: "https://www.nyas.org",
    category: "Research Programs",
    country: "Global",
    isOnline: true,
    isFree: true,
    cost: 0,
    difficulty: "Intermediate",
    deadline: "2026-06-30",
    views: 8300,
    tags: ["Mentorship", "Sustainability", "NYAS", "Global Alliance"]
  },
  {
    id: "opp-25",
    title: "Microsoft Imagine Cup Junior AI Challenge",
    organization: "Microsoft Education",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&w=120&q=80",
    description: "An annual tech program encouraging youth to design machine learning solutions for environmental sustainability.",
    eligibility: "High school youth globally under 18.",
    benefits: "Interactive digital badges, Microsoft developer certificates, and global tech recognition.",
    requirements: "Proposal outlining how an AI solution can assist with species or climate conservation.",
    tips: "Ensure your proposal addresses a specific local environmental challenge in a clear, logical way.",
    officialLink: "https://imaginecup.microsoft.com",
    category: "Competitions",
    country: "Global",
    isOnline: true,
    isFree: true,
    cost: 0,
    difficulty: "Intermediate",
    deadline: "2026-04-30",
    views: 4500,
    tags: ["AI Machine", "Microsoft Junior", "Ecology Tech", "STEM Idea"]
  },
  {
    id: "opp-26",
    title: "World Robot Olympiad (WRO)",
    organization: "WRO Association",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=120&q=80",
    description: "A global robotics competition challenge focused on robotics design, system building, and collaborative engineering.",
    eligibility: "Teams of 2 to 3 students with a coach, participating in local national stages.",
    benefits: "Global robotics network, team collaboration experience, and travel to international host cities.",
    requirements: "Design and build a robot to perform complex, automated tasks based on the annual challenge.",
    tips: "Focus on build reliability and programming fail-safes so your robot can adapt to varying lighting or board textures.",
    officialLink: "https://wro-association.org",
    category: "Olympiads",
    country: "Global",
    isOnline: false,
    isFree: false,
    cost: 200,
    difficulty: "Advanced",
    deadline: "2026-09-01",
    views: 6500,
    tags: ["Robotics", "Olympiad", "Engineering", "Hardware"]
  },
  {
    id: "opp-27",
    title: "John Locke Institute Essay Competition",
    organization: "John Locke Institute",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=120&q=80",
    description: "A prestigious global essay competition across categories including philosophy, politics, economics, history, and law.",
    eligibility: "Students under 19 globally (plus a junior category for students under 15).",
    benefits: "Academic recognition, an award ceremony at Oxford University, and scholarship opportunities.",
    requirements: "An original essay addressing one of the institute's published annual prompts.",
    tips: "Structure your essay with a logical argument, define your terms precisely, and challenge your own assumptions.",
    officialLink: "https://www.johnlockeinstitute.com",
    category: "Competitions",
    country: "Global",
    isOnline: true,
    isFree: true,
    cost: 0,
    difficulty: "Advanced",
    deadline: "2026-06-30",
    views: 11200,
    tags: ["Philosophy", "Economics", "Oxford", "Academic Essay"]
  },
  {
    id: "opp-28",
    title: "Scholastic Art & Writing Awards",
    organization: "Alliance for Young Artists & Writers",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=120&q=80",
    description: "The longest-running prestige awards program in the US for creative high school artists and writers.",
    eligibility: "High school students in Grades 7–12 residing in the US or select international territories.",
    benefits: "Scholarships, national publication, and exhibition of award-winning artwork.",
    requirements: "Original portfolio submissions across art or writing categories (e.g. poetry, photography).",
    tips: "Focus on sharing a personal, authentic voice. Originality and technical skill are highly valued by the judges.",
    officialLink: "https://www.artandwriting.org",
    category: "Competitions",
    country: "United States",
    isOnline: true,
    isFree: false,
    cost: 10,
    difficulty: "Intermediate",
    deadline: "2026-12-05",
    views: 8900,
    tags: ["Creative Art", "Creative Writing", "Scholarship Portfolio", "Visual Arts"]
  },
  {
    id: "opp-29",
    title: "Bow Seat Ocean Awareness Contest",
    organization: "Bow Seat Ocean Awareness Programs",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&w=120&q=80",
    description: "An international advocacy contest for students to raise awareness of marine conservation issues through art, poetry, or research.",
    eligibility: "Students aged 11 to 18 globally.",
    benefits: "Cash prizes up to $1,500 and global creative showcase opportunities.",
    requirements: "An original submission (art, writing, film, or performing arts) addressing the annual theme.",
    tips: "Combine artistic expression with clear factual research to communicate a memorable environmental message.",
    officialLink: "https://bowseat.org",
    category: "Competitions",
    country: "Global",
    isOnline: true,
    isFree: true,
    cost: 0,
    difficulty: "Beginner",
    deadline: "2026-06-15",
    views: 4500,
    tags: ["Environment", "Creative Arts", "Advocacy", "Marine Protection"]
  },
  {
    id: "opp-30",
    title: "National History Day (NHD)",
    organization: "National History Day, Inc.",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=120&q=80",
    description: "An annual history education competition where students conduct in-depth research on historical topics.",
    eligibility: "High school students in Grades 6–12 globally.",
    benefits: "History research experience, cash awards, and national recognition.",
    requirements: "A research project (documentary, exhibit, paper, performance, or website) on the annual theme.",
    tips: "Use a wide range of primary and secondary sources. Be sure to show why your topic was a turning point in history.",
    officialLink: "https://www.nhd.org",
    category: "Competitions",
    country: "Global",
    isOnline: false,
    isFree: false,
    cost: 15,
    difficulty: "Intermediate",
    deadline: "2026-03-01",
    views: 5200,
    tags: ["History Research", "Documentary", "Academic Study", "School Projects"]
  },
  {
    id: "opp-31",
    title: "Telluride Association Seminar (TASS)",
    organization: "Telluride Association",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=120&q=80",
    description: "An elite six-week summer program offering fully funded seminars in critical Black studies and democratic leadership.",
    eligibility: "High school sophomores and juniors (Grade 10 and 11).",
    benefits: "Fully funded program including tuition, books, room, board, and travel assistance.",
    requirements: "Deep intellectual essays and a virtual academic interview.",
    tips: "Engage thoughtfully with complex questions about community, history, and social structures.",
    officialLink: "https://www.tellurideassociation.org",
    category: "Summer Programs",
    country: "United States",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Advanced",
    deadline: "2026-01-05",
    views: 6800,
    tags: ["Humanities", "Telluride", "Fully Funded", "Social Theory"]
  },
  {
    id: "opp-32",
    title: "Stanford University Mathematics Camp (SUMaC)",
    organization: "Stanford University",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=120&q=80",
    description: "An intensive math summer camp focusing on advanced algebraic topology, group theory, and mathematical proofs.",
    eligibility: "High school sophomores and juniors globally.",
    benefits: "Lectures by Stanford faculty, mathematical research projects, and university credit.",
    requirements: "Transcripts, teacher recommendation, and a challenging math admission exam.",
    tips: "Show your step-by-step problem-solving process on the admission exam, even for questions you cannot fully resolve.",
    officialLink: "https://sumac.spcs.stanford.edu",
    category: "Summer Programs",
    country: "United States",
    isOnline: false,
    isFree: false,
    cost: 8250,
    difficulty: "Advanced",
    deadline: "2026-02-01",
    views: 7100,
    tags: ["Advanced Math", "Stanford", "Math Camp", "Group Theory"]
  },
  {
    id: "opp-33",
    title: "Program in Mathematics for Young Scientists (PROMYS)",
    organization: "Boston University",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=120&q=80",
    description: "An intensive six-week summer camp designed to encourage high school students to explore the creative world of mathematics.",
    eligibility: "Students aged 15 and older globally with strong mathematics backgrounds.",
    benefits: "Focus on number theory research, peer networks, and need-based financial aid.",
    requirements: "Academic recommendation, high school transcript, and an entry math problem set.",
    tips: "Demonstrate persistence and logical clarity in your responses to the PROMYS entrance problem set.",
    officialLink: "https://promys.org",
    category: "Summer Programs",
    country: "United States",
    isOnline: false,
    isFree: false,
    cost: 6000,
    difficulty: "Advanced",
    deadline: "2026-03-15",
    views: 6400,
    tags: ["Number Theory", "Math Research", "Creative Math", "Summer Camp"]
  },
  {
    id: "opp-34",
    title: "The Ross Mathematics Program",
    organization: "Ross Mathematics Foundation",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=120&q=80",
    description: "An intensive summer program centered on discovery-method number theory and mathematical proof design.",
    eligibility: "Students aged 15 to 18 with high mathematical achievement.",
    benefits: "Rigorous training in logical reasoning and a global network of peers and mentors.",
    requirements: "Challenging math problems, academic recommendations, and school transcript.",
    tips: "Show that you are comfortable with intellectual challenge and enjoy working on complex proof-based problems.",
    officialLink: "https://rossprogram.org",
    category: "Summer Programs",
    country: "United States",
    isOnline: false,
    isFree: false,
    cost: 7000,
    difficulty: "Advanced",
    deadline: "2026-03-31",
    views: 6700,
    tags: ["Advanced Proofs", "Number Theory", "Academic Camp", "Logic"]
  },
  {
    id: "opp-35",
    title: "Anson L. Clark Scholars Program",
    organization: "Texas Tech University",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80",
    description: "An intensive summer research program allowing scholars to work one-on-one with leading university faculty.",
    eligibility: "High school juniors or seniors who will be 16 by the program start date.",
    benefits: "Fully funded research, free room and board, and a $750 academic stipend.",
    requirements: "High school transcripts, test scores, teacher recommendations, and research essays.",
    tips: "Be specific about your research interests and highlight any relevant laboratory or technical projects you have done.",
    officialLink: "https://www.depts.ttu.edu/honors/academics/clarkscholars/",
    category: "Research Programs",
    country: "United States",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Advanced",
    deadline: "2026-02-15",
    views: 7900,
    tags: ["Fully Funded", "Research Assistant", "University Faculty", "Stipend"]
  },
  {
    id: "opp-36",
    title: "USA Computing Olympiad (USACO)",
    organization: "USACO Board",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=120&q=80",
    description: "An online algorithmic programming competition for secondary school students, offering Bronze, Silver, Gold, and Platinum divisions of challenge.",
    eligibility: "High school students globally. Free online access.",
    benefits: "Algorithmic thinking training, promotion through ranks, and qualification path for the US IOI delegation team.",
    requirements: "Completion of 4-hour online programming contests using C++, Java, or Python.",
    tips: "Master time-complexity evaluation. Simple solutions that time out will not earn full marks.",
    officialLink: "http://www.usaco.org",
    category: "Olympiads",
    country: "United States",
    isOnline: true,
    isFree: true,
    cost: 0,
    difficulty: "Olympiad",
    deadline: "2026-03-25",
    views: 9400,
    tags: ["Programming", "Olympiad", "Algorithms", "STEM"]
  },
  {
    id: "opp-37",
    title: "US National Chemistry Olympiad (USNCO)",
    organization: "American Chemical Society",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=120&q=80",
    description: "A multi-tiered chemistry competition used to select the United States team for the International Chemistry Olympiad.",
    eligibility: "US high school students qualifying through local ACS sections.",
    benefits: "Selection for the national study camp, chemical science training, and prestigious ACS awards.",
    requirements: "Local ACS test and national chemistry exams (written and lab components).",
    tips: "Review previous national exams, focusing on molecular orbital structures, organic reactions, and quantitative analysis.",
    officialLink: "https://www.acs.org/education/olympiad.html",
    category: "Olympiads",
    country: "United States",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Olympiad",
    deadline: "2026-03-01",
    views: 7900,
    tags: ["ACS Chemistry", "Chemistry Exam", "Study Camp", "STEM Selection"]
  },
  {
    id: "opp-38",
    title: "USA Biology Olympiad (USABO)",
    organization: "Center for Excellence in Education",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&w=120&q=80",
    description: "The premier biology competition in the US, used to select the four-student delegation representing the US at the IBO.",
    eligibility: "US high school students. School registration required.",
    benefits: "National study camp attendance, rigorous biology laboratory training, and direct university mentoring.",
    requirements: "Local school exams (Open and Semifinal rounds) covering general biology topics.",
    tips: "Study 'Campbell Biology' thoroughly and focus on plant anatomy, cellular systems, genetics, and statistical biology.",
    officialLink: "https://www.usabo-trc.org",
    category: "Olympiads",
    country: "United States",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Olympiad",
    deadline: "2026-01-10",
    views: 8400,
    tags: ["Biology Exam", "USABO Selection", "Laboratory Camp", "Prestige STEM"]
  },
  {
    id: "opp-39",
    title: "US National Physics Olympiad Selection (USAPhO)",
    organization: "American Association of Physics Teachers (AAPT)",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=120&q=80",
    description: "The physics competition that selects the members of the United States Physics Team for the International Physics Olympiad.",
    eligibility: "US high school students qualifying through the F=ma exam.",
    benefits: "AAPT certificate awards, national physics camp, and recognition for advanced STEM ability.",
    requirements: "F=ma preliminary exam performance followed by the written USAPhO free-response test.",
    tips: "Ensure a strong conceptual understanding of kinematics, mechanics, electric circuits, and basic atomic structures.",
    officialLink: "https://www.aapt.org/physicsteam/",
    category: "Olympiads",
    country: "United States",
    isOnline: false,
    isFree: false,
    cost: 15,
    difficulty: "Olympiad",
    deadline: "2026-01-25",
    views: 7200,
    tags: ["F=ma Exam", "AAPT Physics", "Physics Team Camp", "Olympiad Target"]
  },
  {
    id: "opp-40",
    title: "North American Computational Linguistics Open (NACLO)",
    organization: "NACLO Board",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=120&q=80",
    description: "An offline analytical language and reasoning contest for high schoolers, qualifying delegates for the IOL.",
    eligibility: "Middle and high school students in the US and Canada.",
    benefits: "Develops problem-solving skills and serves as a qualification pathway for the International Linguistics Olympiad.",
    requirements: "Participation in the regional Open round testing session.",
    tips: "Practice past NACLO problems to learn how to identify patterns in morphological structure and syntax rules.",
    officialLink: "https://www.nacloweb.org",
    category: "Olympiads",
    country: "United States",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Advanced",
    deadline: "2026-01-20",
    views: 4800,
    tags: ["Linguistics Open", "Language Puzzles", "NACLO Exam", "Logic"]
  },
  {
    id: "opp-41",
    title: "International Economics Olympiad (IEO)",
    organization: "IEO Executive Committee",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=120&q=80",
    description: "An annual international competition for high school students in economics, financial literacy, and entrepreneurial case studies.",
    eligibility: "Secondary school students selected via national qualifying events.",
    benefits: "International business connections, global micro-economics medals, and prestigious university recruitment.",
    requirements: "Written exams testing game theory, fiscal policy, macro-economics, and a live 24-hour business pitch simulation.",
    tips: "Practice solving practical business case studies under strict time constraints. Focus on creating clear, realistic financial projections.",
    officialLink: "https://ecolympiad.org",
    category: "Olympiads",
    country: "Global",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Olympiad",
    deadline: "2026-07-20",
    views: 7400,
    tags: ["Economics", "Finance", "Business Pitch", "Olympiad"]
  },
  {
    id: "opp-42",
    title: "USA Junior Mathematical Olympiad (USAJMO)",
    organization: "Mathematical Association of America",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=120&q=80",
    description: "A prestigious math Olympiad for underclassmen, used to identify promising younger students for the IMO selection path.",
    eligibility: "US citizens or residents in grade 10 or below with high AMC 10 and AIME scores.",
    benefits: "A direct path to the Mathematical Olympiad Summer Program (MOP) and recognition from university admissions.",
    requirements: "Top-tier score on AMC 10 and invitation based on AIME index scores.",
    tips: "Focus on proof writing, number theory, and geometry. Show a clear, step-by-step logical approach to each problem.",
    officialLink: "https://www.maa.org/math-competitions",
    category: "Olympiads",
    country: "United States",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Olympiad",
    deadline: "2026-03-10",
    views: 6800,
    tags: ["USAJMO", "Proofs", "Mathematical Board", "Olympiad Target"]
  },
  {
    id: "opp-43",
    title: "International Olympiad on Astronomy and Astrophysics Selection (USAAAO)",
    organization: "USAAAO Coordinating Committee",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=120&q=80",
    description: "The physics competition that selects the members of the United States Astronomy and Astrophysics Team for the IOAA.",
    eligibility: "US high school students. School registration required.",
    benefits: "National study camp attendance, astrophysics training, and AAPT certificate awards.",
    requirements: "First-round exams covering coordinate systems, orbital mechanics, and stellar biology.",
    tips: "Ensure a strong conceptual understanding of kinematics, mechanics, and basic atomic structures.",
    officialLink: "https://usaaao.org",
    category: "Olympiads",
    country: "United States",
    isOnline: false,
    isFree: false,
    cost: 15,
    difficulty: "Olympiad",
    deadline: "2026-01-31",
    views: 5200,
    tags: ["Astrophysics Exam", "USAAAO Selection", "Laboratory Camp", "Prestige STEM"]
  },
  {
    id: "opp-44",
    title: "International Brain Bee",
    organization: "International Brain Bee Committee",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=120&q=80",
    description: "A prestigious neuroscience competition for high school students designed to inspire interests in brain research, clinical diagnoses, and psychological health.",
    eligibility: "High school students worldwide, selected via local chapters.",
    benefits: "Global travel to host country finals, neuroscience mentorship, and academic internship pathways.",
    requirements: "Local, regional, and national neuroscience trivia tests and clinical diagnostics rounds.",
    tips: "Familiarize yourself with neuroanatomy slides and diagnostic MRI samples. The clinical rounds test your ability to spot structural lesions.",
    officialLink: "https://thebrainbee.org",
    category: "Olympiads",
    country: "Global",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Olympiad",
    deadline: "2026-05-10",
    views: 6800,
    tags: ["Neuroscience", "Brain Research", "Clinical Anatomy", "Global Network"]
  },
  {
    id: "opp-45",
    title: "US Earth Science Olympiad (USESO)",
    organization: "USESO Committee",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=120&q=80",
    description: "A national competition designed to challenge high school students in geosciences, meteorology, oceanography, and terrestrial environments.",
    eligibility: "High school citizens and residents of the United States.",
    benefits: "Direct selection path to the International Earth Science Olympiad, awards, and geoscience study materials.",
    requirements: "Academic entry exams administered under high school supervision.",
    tips: "Build visual chart-reading competencies. Top-tier questions require analyzing core geology sediment diagrams and global atmospheric systems.",
    officialLink: "https://www.useso.org",
    category: "Olympiads",
    country: "United States",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Olympiad",
    deadline: "2026-01-20",
    views: 4500,
    tags: ["Earth Science", "Geology", "Meteorology", "Olympiad Target"]
  },
  {
    id: "opp-46",
    title: "UKMT Senior Mathematical Challenge",
    organization: "United Kingdom Mathematics Trust",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=120&q=80",
    description: "A prestigious 90-minute mathematical challenge testing high school students in advanced mathematical theory and reasoning.",
    eligibility: "High school students in the United Kingdom and registered international schools.",
    benefits: "Gold, silver, and bronze certificate awards, plus progression pathway to the British Mathematical Olympiad (BMO).",
    requirements: "Online or physical multiple-choice paper testing non-standard geometry and number operations.",
    tips: "Learn how to use mathematical elimination strategies to save time on difficult, nested arithmetic problems.",
    officialLink: "https://www.ukmt.org.uk",
    category: "Competitions",
    country: "Global",
    isOnline: false,
    isFree: false,
    cost: 10,
    difficulty: "Intermediate",
    deadline: "2026-10-01",
    views: 6200,
    tags: ["Math Exam", "UKMT", "British Math", "Problem Solving"]
  },
  {
    id: "opp-47",
    title: "British Physics Olympiad (BPhO)",
    organization: "University of Oxford Physics Department",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=120&q=80",
    description: "A series of annual physics competitions designed to challenge and reward physics problem solving for secondary school students.",
    eligibility: "High school physics students globally. School registration required.",
    benefits: "Oxford-recognized academic achievement awards, and direct preparation for complex university engineering questions.",
    requirements: "Rigorous free-response exam focusing on mechanics, heat, circuit systems, and wave physics.",
    tips: "Develop structured, step-by-step mathematical proofs. AAPT exams require complete analytical working to award full marks.",
    officialLink: "https://www.bpho.org.uk",
    category: "Olympiads",
    country: "Global",
    isOnline: false,
    isFree: false,
    cost: 15,
    difficulty: "Olympiad",
    deadline: "2026-11-12",
    views: 7400,
    tags: ["Physics", "BPhO", "Oxford Physics", "Theoretical proofs"]
  },
  {
    id: "opp-48",
    title: "American Mathematics Competitions (AMC 10/12)",
    organization: "Mathematical Association of America",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=120&q=80",
    description: "The primary high school math competition in the United States, providing the entry point for the national selection path of the IMO.",
    eligibility: "Students in grade 10 or below (AMC 10) and grade 12 or below (AMC 12) globally.",
    benefits: "High standing in college admissions, skill evaluation, and invitation path for the prestigious AIME exam.",
    requirements: "A 75-minute multiple choice test containing 25 challenging mathematical problems.",
    tips: "Avoid guessing blindly. AMC exams penalize wrong answers while leaving blanks awards minor points.",
    officialLink: "https://www.maa.org/math-competitions",
    category: "Competitions",
    country: "Global",
    isOnline: false,
    isFree: false,
    cost: 25,
    difficulty: "Advanced",
    deadline: "2026-10-30",
    views: 13500,
    tags: ["AMC 10", "AMC 12", "MAA Contest", "Prestige Math"]
  },
  {
    id: "opp-49",
    title: "Caribou Math Contest",
    organization: "Caribou Contests Inc.",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1518133185343-b1e1b907a10a?auto=format&fit=crop&w=120&q=80",
    description: "A series of six online mathematics contests run over the school year, designed to make math engaging and accessible.",
    eligibility: "K-12 students globally. Offered in English, French, Persian, and other languages.",
    benefits: "Real-time rank updates, conceptual interactive math puzzles, and certificates of accomplishment.",
    requirements: "Online contest participation during specified testing windows.",
    tips: "Practice logic grid puzzles and computational math, as each round contains non-traditional puzzle interactive questions.",
    officialLink: "https://cariboutests.com",
    category: "Competitions",
    country: "Global",
    isOnline: true,
    isFree: false,
    cost: 15,
    difficulty: "Intermediate",
    deadline: "2026-10-15",
    views: 5100,
    tags: ["Interactive Math", "Caribou Contest", "Online Puzzles", "Global Contests"]
  },
  {
    id: "opp-50",
    title: "Canadian Open Mathematics Challenge (COMC)",
    organization: "Canadian Mathematical Society",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=120&q=80",
    description: "Canada's premier national mathematics competition open to high school students, used to identify team members for the IMO.",
    eligibility: "Secondary school students globally under 19 years of age.",
    benefits: "Direct selection path for the Canadian IMO team, cash awards, and university scholarships.",
    requirements: "A 2.5-hour written examination consisting of short-answer and full-proof math questions.",
    tips: "Review complex Euclidean geometry concepts, advanced algebra, and number theory proof frameworks.",
    officialLink: "https://cms.math.ca/comc/",
    category: "Olympiads",
    country: "Global",
    isOnline: false,
    isFree: false,
    cost: 30,
    difficulty: "Advanced",
    deadline: "2026-10-20",
    views: 6800,
    tags: ["Canadian Math", "COMC Exam", "IMO Qualifier", "Olympiad Target"]
  },
  {
    id: "opp-51",
    title: "MIT PRIMES USA Research",
    organization: "Massachusetts Institute of Technology Math Department",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=120&q=80",
    description: "A free, year-long program in mathematics research for high school juniors and sophomores from anywhere in the United States.",
    eligibility: "US high school sophomores and juniors. Must work on research off-campus with online MIT mentorship.",
    benefits: "One-on-one research mentoring with MIT graduate students, publication of original papers, and national conference presentation opportunities.",
    requirements: "Completion of a highly challenging entrance problem set, recommendations, and letters of intent.",
    tips: "Dedicate ample time to the math entrance test. The committee looks for creative approaches and persistence rather than just immediate solutions.",
    officialLink: "https://math.mit.edu/research/highschool/primes/usa.php",
    category: "Research Programs",
    country: "United States",
    isOnline: true,
    isFree: true,
    cost: 0,
    difficulty: "Olympiad",
    deadline: "2026-11-15",
    views: 8900,
    tags: ["Math Research", "MIT Department", "Mentorship", "Pure Mathematics"]
  },
  {
    id: "opp-52",
    title: "Stanford Clinical Summer Internship (SCSI)",
    organization: "Stanford University School of Medicine",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=120&q=80",
    description: "A two-week program designed to introduce high school students to clinical medicine, surgical techniques, and medical technologies under Stanford faculty.",
    eligibility: "High school juniors and seniors globally, at least 15 years of age at start.",
    benefits: "Lectures by Stanford faculty, medical simulation labs, and clinical diagnostic practice.",
    requirements: "Application forms, transcripts, teacher recommendations, and medicine-oriented essays.",
    tips: "Explain how SCSI will help you achieve your career goals in medicine or biotechnology in your application essays.",
    officialLink: "https://med.stanford.edu/scsi.html",
    category: "Summer Programs",
    country: "United States",
    isOnline: false,
    isFree: false,
    cost: 4500,
    difficulty: "Intermediate",
    deadline: "2026-02-15",
    views: 6800,
    tags: ["Clinical Medicine", "Stanford", "Medical Simulation", "Biotech Systems"]
  },
  {
    id: "opp-53",
    title: "MIT Beaver Works Summer Institute (BWSI)",
    organization: "Massachusetts Institute of Technology",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=120&q=80",
    description: "An intensive world-class STEM summer program for high school seniors, focusing on robotics, cybersecurity, quantum computing, and aerospace engineering.",
    eligibility: "US high school juniors (rising seniors). Free of tuition cost.",
    benefits: "Fully funded STEM training, direct mentoring from MIT Lincoln Lab researchers, and project hardware kits.",
    requirements: "Online prerequisites completed with high scores, academic records, and teacher nominations.",
    tips: "Ensure completion of the online course modules before applying, as this is the primary criteria used to evaluate applicants.",
    officialLink: "https://beaverworks.ll.mit.edu",
    category: "Summer Programs",
    country: "United States",
    isOnline: true,
    isFree: true,
    cost: 0,
    difficulty: "Advanced",
    deadline: "2026-03-15",
    views: 9200,
    tags: ["MIT Lincoln Lab", "Cybersecurity", "Autonomous Systems", "Advanced STEM"]
  },
  {
    id: "opp-54",
    title: "Simons Summer Research Program",
    organization: "Stony Brook University",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=120&q=80",
    description: "A prestigious summer program providing high-achieving high school juniors with hands-on research experiences in STEM fields.",
    eligibility: "US high school juniors (rising seniors). School nomination required.",
    benefits: "Research poster session, university laboratory placement, and Stony Brook faculty mentorship.",
    requirements: "School nomination, academic transcripts, recommendations, and science research statement.",
    tips: "Explain how you plan to use scientific research to solve real-world problems in engineering or biology.",
    officialLink: "https://www.stonybrook.edu/simons/",
    category: "Research Programs",
    country: "United States",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Advanced",
    deadline: "2026-01-25",
    views: 7200,
    tags: ["Simons Research", "Stony Brook", "STEM Lab", "Prestige Scholarship"]
  },
  {
    id: "opp-55",
    title: "Memorial Sloan Kettering HOPP Summer Student Program",
    organization: "Memorial Sloan Kettering Cancer Center",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&w=120&q=80",
    description: "An intensive on-campus research fellowship providing high school students with hands-on cancer biology research experience.",
    eligibility: "US high school sophomores, juniors, and seniors, at least 16 years of age at start.",
    benefits: "$1,200 research stipend, direct MSKCC laboratory access, and cancer biology mentoring.",
    requirements: "Letters of recommendation, transcripts, research proposal essays, and principal-nominations.",
    tips: "Focus your proposal on cancer biology and explain your interest in molecular medicine research.",
    officialLink: "https://www.mskcc.org/departments/human-oncology-pathogenesis/hopp-summer-student-program",
    category: "Research Programs",
    country: "United States",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Advanced",
    deadline: "2026-01-10",
    views: 6700,
    tags: ["Oncology", "MSKCC Research", "Laboratory Internship", "Stipends"]
  },
  {
    id: "opp-56",
    title: "National Institutes of Health (NIH) Summer Internship (HS-SIP)",
    organization: "National Institutes of Health",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=120&q=80",
    description: "A biomedical research program providing high school seniors with hands-on experience in molecular biology and health sciences.",
    eligibility: "US high school seniors, at least 17 years of age by start date.",
    benefits: "Paid stipend, direct NIH laboratory mentoring, and biomedical project management training.",
    requirements: "Transcripts, teacher recommendations, health research interests essay, and cover letters.",
    tips: "Read up on current biomedical research projects at the NIH, and connect your application to specific NIH labs.",
    officialLink: "https://www.training.nih.gov/programs/hs-sip",
    category: "Research Programs",
    country: "United States",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Advanced",
    deadline: "2026-02-01",
    views: 8900,
    tags: ["Biomedical Research", "NIH Labs", "High School Senior Program", "Stipend Room"]
  },
  {
    id: "opp-57",
    title: "Magee-Womens Research Institute High School Program",
    organization: "Magee-Womens Research Institute",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&w=120&q=80",
    description: "An intensive summer program providing high school juniors and seniors with hands-on research experience in womens health and reproductive biology.",
    eligibility: "US high school sophomores, juniors, and seniors, at least 16 years of age at start.",
    benefits: "Mentored research stay, free housing, and a research stipend of up to $2,000.",
    requirements: "Letters of recommendation, transcript, personal essay on genomic interests.",
    tips: "Focus your essay on your interest in biological systems or medical research, and describe any relevant science courses you have taken.",
    officialLink: "https://mageewomens.org/education/high-school-program",
    category: "Research Programs",
    country: "United States",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Advanced",
    deadline: "2026-01-15",
    views: 5100,
    tags: ["Biomedical Science", "Womens Health", "Laboratory Internship", "Stipends"]
  },
  {
    id: "opp-58",
    title: "UCLA Summer NanoScience Lab",
    organization: "California NanoSystems Institute (CNSI) at UCLA",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&q=80",
    description: "A hands-on research program introducing high schoolers to nanotechnology, chemical engineering, and materials science.",
    eligibility: "High school sophomores, juniors, and seniors globally.",
    benefits: "Workshops with UCLA faculty, university materials lab practice, and UCLA college credit options.",
    requirements: "Academic records, STEM courses completed, teacher recommendation.",
    tips: "Highlight any projects or physics/chemistry experiments you have done, and explain your curiosity about nanotechnology.",
    officialLink: "https://summer.ucla.edu/program/nanoscale-microscale-lab/",
    category: "Summer Programs",
    country: "United States",
    isOnline: false,
    isFree: false,
    cost: 3200,
    difficulty: "Advanced",
    deadline: "2026-03-15",
    views: 4500,
    tags: ["Nanotechnology", "UCLA Pre-College", "Materials Engineering", "STEM Research"]
  },
  {
    id: "opp-59",
    title: "Genes in Space Competition",
    organization: "Boeing, miniPCR bio, & ISS National Lab",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=120&q=80",
    description: "A biology competition challenging students to design DNA analysis experiments to be conducted by astronauts on the International Space Station.",
    eligibility: "Students in grades 7-12 residing in the United States.",
    benefits: "Your experiment launched into space, direct molecular biology mentorship, and miniPCR analysis hardware for your school.",
    requirements: "A research proposal detailing how space conditions (e.g. microgravity, cosmic radiation) impact biological systems.",
    tips: "Focus your proposal on resolving a clear, practical problem faced by astronauts on long space journeys.",
    officialLink: "https://www.genesinspace.org",
    category: "Competitions",
    country: "United States",
    isOnline: true,
    isFree: true,
    cost: 0,
    difficulty: "Advanced",
    deadline: "2026-04-17",
    views: 7400,
    tags: ["Space Biology", "DNA Experiment", "NASA Affiliate", "Science Proposal"]
  },
  {
    id: "opp-60",
    title: "BioGENEius Challenge",
    organization: "Biotechnology Institute",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&w=120&q=80",
    description: "An international scientific research competition focusing on high school biotechnology research in healthcare, agriculture, and environment.",
    eligibility: "Secondary school students in participating US states, Canada, and global regions.",
    benefits: "Direct academic exposure to biotechnology company leaders, cash prizes, and scientific community validation.",
    requirements: "An original biotechnology research portfolio and analytical paper.",
    tips: "Highlight the practical applications of your research. Show how your work helps solve real-world problems in medicine or agriculture.",
    officialLink: "https://www.biotechinstitute.org",
    category: "Competitions",
    country: "Global",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Advanced",
    deadline: "2026-04-10",
    views: 5200,
    tags: ["Biotech Research", "Life Sciences", "Poster Session", "Healthcare STEM"]
  },
  {
    id: "opp-61",
    title: "Stockholm Junior Water Prize",
    organization: "Water Environment Federation & Stockholm International Water Institute",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&w=120&q=80",
    description: "The world's most prestigious youth award for environmental water-science research projects addressing water pollution or access.",
    eligibility: "High school students aged 15-20 globally who have completed a water research project.",
    benefits: "$15,000 national award, travel to Stockholm, Sweden, and direct interaction with environmental researchers.",
    requirements: "Submission of a formal water science research paper and state/national poster presentation.",
    tips: "Test your solution with real water samples. Factual evidence and a practical approach are highly valued.",
    officialLink: "https://www.wef.org/sjwp",
    category: "Competitions",
    country: "Global",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Advanced",
    deadline: "2026-04-15",
    views: 6800,
    tags: ["Ecology Science", "Water Purification", "Stockholm Prize", "Environmental Policy"]
  },
  {
    id: "opp-62",
    title: "The Clean Tech Competition",
    organization: "Center for Science Teaching and Learning",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&q=80",
    description: "An international environmental engineering challenge focusing on clean energy and resource sustainability.",
    eligibility: "Teams of 1-3 students globally, aged 15-18.",
    benefits: "$10,000 grand prize, global recognition, and direct mentorship from clean energy professionals.",
    requirements: "A comprehensive project proposal designed to solve a specific resource or energy sustainability issue.",
    tips: "Explain how your design can be manufactured at scale. Showing a realistic cost analysis makes your project much stronger.",
    officialLink: "https://www.cleantechcompetition.org",
    category: "Competitions",
    country: "Global",
    isOnline: true,
    isFree: true,
    cost: 0,
    difficulty: "Intermediate",
    deadline: "2026-04-18",
    views: 5900,
    tags: ["Clean Energy", "Environmental Tech", "Engineering Project", "Sustain Design"]
  },
  {
    id: "opp-63",
    title: "National Science Bowl",
    organization: "US Department of Energy (DOE)",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&q=80",
    description: "A fast-paced academic jeopardy-style STEM competition testing high school students across all branches of math and science.",
    eligibility: "Middle and high school students in the United States in registered school teams.",
    benefits: "Fully funded travel to the national finals in Washington D.C., and recognition from Department of Energy scientists.",
    requirements: "Regional tournament participation in team quiz-bowl rounds.",
    tips: "Practice rapid recall. Developing quick buzzer reaction times is as important as knowing the science concepts.",
    officialLink: "https://science.osti.gov/wdts/nsb",
    category: "Competitions",
    country: "United States",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Advanced",
    deadline: "2026-03-01",
    views: 7400,
    tags: ["Quiz Bowl", "Department of Energy", "STEM Trivia", "High Speed Recalls"]
  },
  {
    id: "opp-64",
    title: "Junior Science and Humanities Symposium (JSHS)",
    organization: "US Army, Navy, and Air Force Research Offices",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&w=120&q=80",
    description: "A high-tier US military-sponsored program that challenges students to present original scientific and engineering research projects.",
    eligibility: "High school students in the United States and international US military schools.",
    benefits: "$12,000 tuition scholarship, military laboratory connections, and presentation opportunities.",
    requirements: "Submission of an original scientific research abstract and a formal oral or poster presentation.",
    tips: "Be prepared to explain your research methodology clearly during the judges' question-and-answer session.",
    officialLink: "https://www.jshs.org",
    category: "Research Programs",
    country: "United States",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Advanced",
    deadline: "2026-01-30",
    views: 6900,
    tags: ["Federal Science", "Research Presentation", "Scholarships", "Defense Labs"]
  },
  {
    id: "opp-65",
    title: "Genius Olympiad",
    organization: "Terra Science and Education & Rochester Institute of Technology",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&q=80",
    description: "An international high school competition focused on environmental projects in science, art, creative writing, robotics, and business.",
    eligibility: "Secondary school students globally.",
    benefits: "RIT scholarship opportunities, international travel to Rochester, NY, and environmental science medals.",
    requirements: "Submission of an original project proposal or creative art portfolio addressing environmental issues.",
    tips: "Clearly describe how your project makes a measurable positive impact on environmental sustainability.",
    officialLink: "https://geniusolympiad.org",
    category: "Olympiads",
    country: "Global",
    isOnline: false,
    isFree: false,
    cost: 110,
    difficulty: "Intermediate",
    deadline: "2026-03-01",
    views: 8200,
    tags: ["Environmental Science", "Art and Ecology", "Scholarships", "RIT Campus"]
  },
  {
    id: "opp-66",
    title: "Perimeter Institute Theoretical Physics Summer School (ISSYP)",
    organization: "Perimeter Institute for Theoretical Physics",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=120&q=80",
    description: "An intensive online physics program that introduces students to theoretical physics topics like quantum mechanics and black holes.",
    eligibility: "High school juniors and seniors globally with advanced physics and math preparation.",
    benefits: "Lectures by leading theoretical physicists, interactive research projects, and introduction to modern physics research.",
    requirements: "Academic transcripts, physics teacher recommendation, and personal essay.",
    tips: "Show that you are comfortable with high-level mathematics, and explain your curiosity about modern physics research.",
    officialLink: "https://perimeterinstitute.ca/issyp",
    category: "Summer Programs",
    country: "Canada",
    isOnline: true,
    isFree: true,
    cost: 0,
    difficulty: "Advanced",
    deadline: "2026-03-15",
    views: 7100,
    tags: ["Theoretical Physics", "Quantum Physics", "Cosmology STEM", "Online Seminars"]
  },
  {
    id: "opp-67",
    title: "Jackson Laboratory Bioinformatics Online Program",
    organization: "The Jackson Laboratory",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&w=120&q=80",
    description: "A virtual genomics research program where high schoolers analyze human datasets alongside lab mentors.",
    eligibility: "High school students globally with prior biology study.",
    benefits: "Practical bioinformatics project experience, laboratory mentoring, and peer collaboration.",
    requirements: "Academic records, recommendation letter, genomics statement.",
    tips: "Review basic programming or computer logic concepts and describe your interest in molecular medicine in your application.",
    officialLink: "https://www.jax.org",
    category: "Research Programs",
    country: "Global",
    isOnline: true,
    isFree: true,
    cost: 0,
    difficulty: "Intermediate",
    deadline: "2026-03-30",
    views: 4300,
    tags: ["Bioinformatics", "Online Genomics", "Data Analysis", "STEM Outreach"]
  },
  {
    id: "opp-68",
    title: "Inspirit AI Scholars Program",
    organization: "Stanford and MIT Graduate Student Boards",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=120&q=80",
    description: "An intensive online program introducing high schoolers to artificial intelligence, machine learning, and data science applications.",
    eligibility: "High school students globally in grades 9-12.",
    benefits: "Direct mentorship, machine learning project options, and certificate credentials.",
    requirements: "Online application showing computer science interest and basic technical curiosity.",
    tips: "Familiarize yourself with Python fundamentals. Coding logic is key for completing projects during the program.",
    officialLink: "https://www.inspiritai.com",
    category: "Summer Programs",
    country: "Global",
    isOnline: true,
    isFree: false,
    cost: 1100,
    difficulty: "Intermediate",
    deadline: "2026-05-20",
    views: 7100,
    tags: ["AI Machine", "Data Science", "Graduate Mentorship", "Python Code"]
  },
  {
    id: "opp-69",
    title: "Girls Who Code Summer Immersive Program",
    organization: "Girls Who Code",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=120&q=80",
    description: "A free virtual summer program designed for high schoolers to learn coding, web development, and UX design under industry leaders.",
    eligibility: "High school students globally who identify as female, non-binary, or genderqueer.",
    benefits: "Free technical tuition, tech hardware support grants, and direct mentorship with professional developers.",
    requirements: "Online application showing computer science interest and basic technical curiosity.",
    tips: "Explain how you plan to use technology to solve a specific community or environmental challenge in your region.",
    officialLink: "https://girlswhocode.com",
    category: "Summer Programs",
    country: "Global",
    isOnline: true,
    isFree: true,
    cost: 0,
    difficulty: "Beginner",
    deadline: "2026-03-31",
    views: 8900,
    tags: ["Web Development", "Girls Who Code", "Interactive Studies", "Diversity in Tech"]
  },
  {
    id: "opp-70",
    title: "Kode With Klossy Summer Camp",
    organization: "Kode With Klossy Foundation",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=120&q=80",
    description: "A free summer program designed for high schoolers to learn mobile app development, web design, and data science.",
    eligibility: "High school students globally in grades 9-12 who identify as female, non-binary, or genderqueer.",
    benefits: "Free technical tuition, mechatronics hardware support, and community network access.",
    requirements: "Online application focusing on technological interest and community service goals.",
    tips: "Explain how you plan to use technology to support other underrepresented students in computer science.",
    officialLink: "https://www.kodewithklossy.com",
    category: "Summer Programs",
    country: "Global",
    isOnline: true,
    isFree: true,
    cost: 0,
    difficulty: "Beginner",
    deadline: "2026-04-15",
    views: 6500,
    tags: ["App Development", "Kode with Klossy", "Mechatronics", "STEM Studies"]
  },
  {
    id: "opp-71",
    title: "National Security Language Initiative for Youth (NSLI-Y)",
    organization: "US Department of State",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?auto=format&fit=crop&w=120&q=80",
    description: "A US Department of State initiative providing fully funded summer and academic year study-abroad scholarships for language study.",
    eligibility: "US high school students with a minimum cumulative GPA of 2.5.",
    benefits: "Fully funded study-abroad, host-family homestay, language tuition, and international travel.",
    requirements: "Detailed language-interest essays, academic records, and virtual interviews.",
    tips: "Emphasize how learning your chosen language (e.g. Arabic, Mandarin, Russian) aligns with your future public service goals.",
    officialLink: "https://www.nsliforyouth.org",
    category: "Fellowships",
    country: "United States",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Advanced",
    deadline: "2026-11-05",
    views: 8900,
    tags: ["Study Abroad", "US State Dept", "Fully Funded", "Linguistics", "Diplomacy"]
  },
  {
    id: "opp-72",
    title: "Kennedy-Lugar Youth Exchange and Study (YES) Abroad",
    organization: "US Department of State",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=120&q=80",
    description: "A fully funded study-abroad scholarship providing US high schoolers the opportunity to live and study in nations with significant Muslim populations.",
    eligibility: "US high school students who are US citizens.",
    benefits: "Fully funded academic year abroad, high school placement, host-family homestay, and medical care.",
    requirements: "Academic transcripts, policy-interest essays, and direct student leadership profiles.",
    tips: "Explain how you plan to act as an effective citizen diplomat, representing US culture while appreciating host-country traditions.",
    officialLink: "https://www.yesprograms.org/yes-abroad",
    category: "Fellowships",
    country: "United States",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Advanced",
    deadline: "2026-12-05",
    views: 4200,
    tags: ["US State Dept", "YES Abroad", "Homestay Experience", "Cultural Exchange"]
  },
  {
    id: "opp-73",
    title: "Congress-Bundestag Youth Exchange (CBYX)",
    organization: "US Department of State & German Bundestag",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=120&q=80",
    description: "A fully funded annual academic year study-abroad scholarship for high schoolers to live and study in Germany.",
    eligibility: "US citizens or permanent residents aged 15-18 with a minimum GPA of 2.5.",
    benefits: "Fully funded academic year abroad, German high school placement, and diplomatic host-family homestay.",
    requirements: "Academic records, policy-interest essays, and principal-nominations.",
    tips: "Show that you are adaptive and excited about cultural immersion. No prior German language study is required to apply.",
    officialLink: "https://usagermanyscholarship.org",
    category: "Fellowships",
    country: "United States",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Advanced",
    deadline: "2026-12-01",
    views: 7200,
    tags: ["CBYX Scholarship", "German Exchange", "Homestay", "Fully Funded"]
  },
  {
    id: "opp-74",
    title: "Bank of America Student Leaders Program",
    organization: "Bank of America Charitable Foundation",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=120&q=80",
    description: "An annual leadership program connecting community-minded high school juniors and seniors with paid non-profit internships and a week-long national summit in Washington D.C.",
    eligibility: "US high school juniors and seniors in participating locations.",
    benefits: "Eight-week paid internship at a local non-profit, plus all-expenses-paid national leadership summit.",
    requirements: "Academic transcripts, counselor reports, and leadership and community service logs.",
    tips: "Explain how you have built community or helped solve issues in your home school, and outline your community goals.",
    officialLink: "https://about.bankofamerica.com/en-us/what-guides-us/student-leaders.html",
    category: "Fellowships",
    country: "United States",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Advanced",
    deadline: "2026-01-28",
    views: 9400,
    tags: ["Paid Internship", "Bank of America", "Nonprofit Leadership", "D.C. Summit"]
  },
  {
    id: "opp-75",
    title: "United States Institute of Peace (USIP) Youth Challenge",
    organization: "USIP",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=120&q=80",
    description: "An annual competition encouraging students to analyze complex international conflicts and propose non-violent diplomatic solutions.",
    eligibility: "High school youth globally under 18.",
    benefits: "Direct feedback from international peace-builders, travel to USIP headquarters, and AWS credit awards.",
    requirements: "Submission of a project proposal or explanatory demonstration video addressing the designated prompt.",
    tips: "Focus your proposal on how you would use non-violent diplomatic tools and peacebuilding strategies to address conflicts.",
    officialLink: "https://www.usip.org",
    category: "Competitions",
    country: "Global",
    isOnline: true,
    isFree: true,
    cost: 0,
    difficulty: "Intermediate",
    deadline: "2026-10-15",
    views: 4500,
    tags: ["Peacebuilding", "Diplomacy", "International Policy", "Video Contest"]
  },
  {
    id: "opp-76",
    title: "AAPT High School Physics Photo Contest",
    organization: "American Association of Physics Teachers",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=120&q=80",
    description: "An annual competition challenging high schoolers to capture physics principles in photos and write explaining summaries.",
    eligibility: "High school students globally in grades 9-12.",
    benefits: "Cash awards up to $250, AAPT certificate credentials, and publication in national physics journals.",
    requirements: "An original photo capturing a physics principle, plus an explanatory essay of 250 words or fewer.",
    tips: "Focus on capturing physical phenomena (such as light refraction, sound waves, or kinetic motion) clearly in your photo.",
    officialLink: "https://www.aapt.org/Programs/photocontest/",
    category: "Competitions",
    country: "Global",
    isOnline: true,
    isFree: true,
    cost: 0,
    difficulty: "Beginner",
    deadline: "2026-05-15",
    views: 4300,
    tags: ["Physics Photo", "Creative Writing", "AAPT Contest", "Visual Science"]
  },
  {
    id: "opp-77",
    title: "Princeton Summer Journal",
    organization: "The Daily Princetonian / Princeton University",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=120&q=80",
    description: "An elite journalism workshop program designed for high school juniors from underrepresented or low-income backgrounds.",
    eligibility: "High school juniors in the United States with family income below specified limits.",
    benefits: "Fully funded travel, housing, meals, direct journalism coaching from Princeton editors, and a publishing showcase.",
    requirements: "Detailed financial eligibility checks, academic records, essays, and writing sample portfolio.",
    tips: "Explain how journalism can help solve inequalities or report critical stories in your home community.",
    officialLink: "https://www.dailyprincetonian.com/page/summer-journal",
    category: "Summer Programs",
    country: "United States",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Intermediate",
    deadline: "2026-02-28",
    views: 5200,
    tags: ["Journalism", "Princeton University", "Fully Funded", "Social Impact"]
  },
  {
    id: "opp-78",
    title: "The New York Times Student Editorial Contest",
    organization: "The New York Times Learning Network",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=120&q=80",
    description: "An annual writing competition challenging high schoolers to write short, persuasive editorial essays on current issues.",
    eligibility: "Global middle and high school students aged 13-19.",
    benefits: "Global publication on NYT Learning Network, written recognition from editors, and high academic merit.",
    requirements: "A persuasive essay of 450 words or fewer backed by NYT sources and independent statistics.",
    tips: "Pick a niche topic that is not overly discussed. Back up your points with clear evidence instead of general statements.",
    officialLink: "https://www.nytimes.com/section/learning",
    category: "Competitions",
    country: "Global",
    isOnline: true,
    isFree: true,
    cost: 0,
    difficulty: "Intermediate",
    deadline: "2026-05-15",
    views: 11500,
    tags: ["New York Times", "Opinion Writing", "Persuasive Essay", "Global Issues"]
  },
  {
    id: "opp-79",
    title: "Gloria Barron Prize for Young Heroes",
    organization: "Barron Prize Committee",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=120&q=80",
    description: "An award program that celebrates outstanding, public-spirited young leaders who have made a significant positive impact on people and our planet.",
    eligibility: "Youth aged 8-18 residing in the United States or Canada.",
    benefits: "$10,000 cash award to support higher education or your environmental/humanitarian service project.",
    requirements: "A detailed service impact report and solid references from community leaders.",
    tips: "Detail the tangible outcomes of your project, including the number of people helped or resources conserved.",
    officialLink: "https://barronprize.org",
    category: "Fellowships",
    country: "United States",
    isOnline: true,
    isFree: true,
    cost: 0,
    difficulty: "Intermediate",
    deadline: "2026-04-15",
    views: 4300,
    tags: ["Social Impact", "Nature Conservation", "Heroism Awards", "Cash Grant"]
  },
  {
    id: "opp-80",
    title: "National High School Oratorical Contest",
    organization: "The American Legion",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=120&q=80",
    description: "A prestigious public speaking contest designed to develop a deeper knowledge and appreciation of the Constitution of the United States.",
    eligibility: "US high school students under the age of 20.",
    benefits: "Scholarship awards up to $25,000 for national winners, with regional participant stipends.",
    requirements: "An original 8-10 minute speech on some aspect of the US Constitution and a 3-5 minute impromptu speech.",
    tips: "Focus on presenting a balanced, well-researched, and historically accurate analysis of the Constitution.",
    officialLink: "https://www.legion.org/oratorical",
    category: "Competitions",
    country: "United States",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Advanced",
    deadline: "2026-01-15",
    views: 4900,
    tags: ["Public Speaking", "Constitution Law", "Scholarships", "Persuasion Speech"]
  },
  {
    id: "opp-81",
    title: "Foyle Young Poets of the Year Award",
    organization: "The Poetry Society",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=120&q=80",
    description: "The largest global competition for young poets, attracting submissions from high school writers worldwide.",
    eligibility: "Young writers aged 11-17 globally.",
    benefits: "Poetry Society membership, mentoring, book packages, and global publication.",
    requirements: "Submission of original, unpublished poems in English of any length and style.",
    tips: "Focus on clear, fresh language and avoid predictable rhyme schemes. Originality is highly valued.",
    officialLink: "https://poetrysociety.org.uk/competitions/foyle-young-poets-of-the-year-award/",
    category: "Competitions",
    country: "Global",
    isOnline: true,
    isFree: true,
    cost: 0,
    difficulty: "Intermediate",
    deadline: "2026-07-31",
    views: 6400,
    tags: ["Creative Writing", "Poetry Contest", "UK Literature", "Publishing"]
  },
  {
    id: "opp-82",
    title: "Jane Austen Society of North America Essay Contest",
    organization: "Jane Austen Society of North America (JASNA)",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=120&q=80",
    description: "An annual essay contest that challenges high school students to analyze Jane Austen's literary works.",
    eligibility: "High school students in the US and Canada.",
    benefits: "Scholarship prizes, JASNA membership, and publication in the society's literary journal.",
    requirements: "An original essay of 1,000-1,200 words analyzing a specified aspect of Jane Austen's writing.",
    tips: "Ensure your essay has a clear, thesis-driven argument, and support your points with careful textual analysis.",
    officialLink: "https://jasna.org/programs/essay-contest/",
    category: "Competitions",
    country: "Global",
    isOnline: true,
    isFree: true,
    cost: 0,
    difficulty: "Intermediate",
    deadline: "2026-06-01",
    views: 4200,
    tags: ["Literary Analysis", "Jane Austen Study", "Scholastic Writing", "Publications"]
  },
  {
    id: "opp-83",
    title: "Harvard International Review Academic Writing Contest",
    organization: "Harvard International Review",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=120&q=80",
    description: "An international academic writing competition that challenges high school students to analyze critical topics in global affairs.",
    eligibility: "High school students globally in grades 9-12.",
    benefits: "Gold, Silver, and Bronze medals, publication on the official HIR platform, and invitations to present before the editorial board.",
    requirements: "An original academic article of 800-1200 words evaluating a specified prompt in international relations.",
    tips: "Ensure your paper maintains a balanced, global perspective. Avoid domestic biases and back your claims with robust citations.",
    officialLink: "https://hir.harvard.edu/contest",
    category: "Competitions",
    country: "Global",
    isOnline: true,
    isFree: false,
    cost: 50,
    difficulty: "Advanced",
    deadline: "2026-05-31",
    views: 7400,
    tags: ["International Relations", "Academic Writing", "Harvard Publication", "Global Affairs"]
  },
  {
    id: "opp-84",
    title: "Telluride Association Summer Seminar (TASS-CBS)",
    organization: "Telluride Association",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=120&q=80",
    description: "A highly selective academic program offering intensive college-level seminars in Critical Black Studies and Democratic Leadership.",
    eligibility: "High school sophomores globally.",
    benefits: "Full programmatic support, tuition, room, board, and access to an active scholar network.",
    requirements: "Rigorous analytical essays, recommendations, and scholastic transcript.",
    tips: "Engage deeply with theoretical viewpoints in your essays; show a collaborative spirit of intellectual sharing.",
    officialLink: "https://www.tellurideassociation.org",
    category: "Summer Programs",
    country: "Global",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Advanced",
    deadline: "2026-01-08",
    views: 8900,
    tags: ["Critical Writing", "Humanities", "Academic Seminars", "Fully Funded"]
  },
  {
    id: "opp-85",
    title: "Notre Dame Leadership Seminars",
    organization: "University of Notre Dame Office of Pre-College Programs",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=120&q=80",
    description: "An elite, fully funded ten-day program on Notre Dame's campus for student leaders to discuss global social issues.",
    eligibility: "High school juniors (Grade 11). US citizens or international students with high academic standing.",
    benefits: "Fully funded, including tuition, room, board, and university credit.",
    requirements: "Transcripts, SAT/ACT scores (optional), counselor report, and leadership essays.",
    tips: "Highlight your leadership experiences, and explain how you plan to use what you learn to support your local community.",
    officialLink: "https://precollege.nd.edu/leadership-seminars/",
    category: "Summer Programs",
    country: "United States",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Advanced",
    deadline: "2026-01-22",
    views: 6700,
    tags: ["Notre Dame Pre-College", "Leadership Seminar", "Fully Funded", "Global Social Issues"]
  },
  {
    id: "opp-86",
    title: "Atlas Fellowship",
    organization: "Atlas Fellowship",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=120&q=80",
    description: "An intensive fellowship combining a global summer program and an academic scholarship, aimed at discovering students dedicated to understanding the world and shaping its future.",
    eligibility: "High school students globally.",
    benefits: "Up to $50,000 in scholarships and a fully funded 11-day summer program at Oxford or in the US.",
    requirements: "Completion of a rigorous application evaluating logical reasoning, open-mindedness, and intellectual curiosity.",
    tips: "Be authentic and demonstrate your ability to update your beliefs when presented with new evidence.",
    officialLink: "https://www.atlasfellowship.org/",
    category: "Fellowships",
    country: "Global",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Advanced",
    deadline: "2026-11-20",
    views: 4500,
    tags: ["Philosophy", "Scholarship", "Rationality", "Global Cohort"]
  },
  {
    id: "opp-87",
    title: "Non-Trivial Fellowship",
    organization: "Non-Trivial",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=120&q=80",
    description: "An online fellowship for teenagers to start research, policy, or entrepreneurial projects that tackle some of the world's most pressing problems.",
    eligibility: "Students aged 14-20 from any country.",
    benefits: "A $500 scholarship, expert guidance, and potential seed funding for your project.",
    requirements: "Short online application testing analytical skills and a desire to solve global challenges.",
    tips: "Focus on high-impact areas such as AI safety, biosecurity, or global health in your proposal.",
    officialLink: "https://www.non-trivial.org/",
    category: "Fellowships",
    country: "Global",
    isOnline: true,
    isFree: true,
    cost: 0,
    difficulty: "Intermediate",
    deadline: "2026-10-01",
    views: 3800,
    tags: ["Effective Altruism", "Policy", "Online Fellowship", "Research"]
  },
  {
    id: "opp-88",
    title: "Garcia Center Summer Scholars",
    organization: "Stony Brook University",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=120&q=80",
    description: "An intensive seven-week research program where high school students conduct original research in materials science and polymer engineering.",
    eligibility: "High school sophomores, juniors, and seniors in the US, at least 16 years old.",
    benefits: "Independent lab research, potential publications, and preparation for national science competitions.",
    requirements: "Transcripts (unweighted GPA 3.8+), standardized test scores, and three letters of recommendation.",
    tips: "Highlight your quantitative skills and readiness to commit deeply to an independent laboratory project.",
    officialLink: "https://www.stonybrook.edu/commcms/garcia/",
    category: "Research Programs",
    country: "United States",
    isOnline: false,
    isFree: false,
    cost: 2500,
    difficulty: "Advanced",
    deadline: "2026-03-01",
    views: 6200,
    tags: ["Materials Science", "Lab Research", "Stony Brook", "STEM"]
  },
  {
    id: "opp-89",
    title: "Hutton Junior Fisheries Biology Program",
    organization: "American Fisheries Society",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&w=120&q=80",
    description: "An eight-week paid summer internship and mentoring program designed to stimulate interest in fisheries and aquatic science.",
    eligibility: "High school juniors and seniors in the US, Puerto Rico, and Mexico.",
    benefits: "A $3,000 stipend and hands-on fieldwork experience alongside professional fisheries biologists.",
    requirements: "Academic transcripts, statement of interest, and reference letters.",
    tips: "Emphasize your willingness to work outdoors and your passion for aquatic conservation and ecology.",
    officialLink: "https://hutton.fisheries.org/",
    category: "Research Programs",
    country: "United States",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Intermediate",
    deadline: "2026-02-15",
    views: 5100,
    tags: ["Marine Biology", "Ecology", "Paid Internship", "Fieldwork"]
  },
  {
    id: "opp-90",
    title: "MITES Summer",
    organization: "Massachusetts Institute of Technology (MIT)",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=120&q=80",
    description: "A rigorous six-week residential STEM experience at MIT for rising seniors, strongly encouraging applications from underrepresented backgrounds.",
    eligibility: "US citizens or permanent residents who are high school juniors.",
    benefits: "Fully funded (including room and board), advanced coursework, and college admissions preparation.",
    requirements: "Transcripts, teacher recommendations, and short-answer essays.",
    tips: "Show resilience, a strong work ethic, and a genuine passion for science and engineering in your essays.",
    officialLink: "https://mites.mit.edu/",
    category: "Summer Programs",
    country: "United States",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Advanced",
    deadline: "2026-02-01",
    views: 11200,
    tags: ["MIT", "STEM", "Underrepresented", "Fully Funded"]
  },
  {
    id: "opp-91",
    title: "MathPath",
    organization: "MathPath Foundation",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=120&q=80",
    description: "A four-week residential summer program for highly gifted middle school and early high school students exploring advanced mathematics.",
    eligibility: "Students globally aged 11-14.",
    benefits: "Immersive mathematical instruction, problem-solving techniques, and interaction with renowned mathematicians.",
    requirements: "A qualifying math test and teacher recommendations.",
    tips: "Focus on providing clear, logical proofs for the qualifying test questions rather than just the final answers.",
    officialLink: "https://www.mathpath.org/",
    category: "Summer Programs",
    country: "Global",
    isOnline: false,
    isFree: false,
    cost: 5000,
    difficulty: "Intermediate",
    deadline: "2026-04-15",
    views: 4700,
    tags: ["Mathematics", "Math Camp", "Gifted Youth", "Problem Solving"]
  },
  {
    id: "opp-92",
    title: "High School Honors Science, Math, and Engineering Program (HSHSP)",
    organization: "Michigan State University",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&q=80",
    description: "A seven-week, intensive summer research program allowing students to work on a research project under the mentorship of university faculty.",
    eligibility: "High school juniors in the United States.",
    benefits: "Direct laboratory research experience and an opportunity to present findings at academic conferences.",
    requirements: "Essays, transcripts, and teacher recommendations.",
    tips: "Clearly articulate why you want to spend your summer doing intensive research rather than taking standard classes.",
    officialLink: "https://education.msu.edu/hshsp/",
    category: "Research Programs",
    country: "United States",
    isOnline: false,
    isFree: false,
    cost: 3800,
    difficulty: "Advanced",
    deadline: "2026-03-15",
    views: 5900,
    tags: ["Research", "Michigan State", "STEM", "Lab Work"]
  },
  {
    id: "opp-93",
    title: "Disney Dreamers Academy",
    organization: "Walt Disney World",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=120&q=80",
    description: "A four-day, fully funded leadership and career-exploration event at Walt Disney World for high school students with big dreams.",
    eligibility: "US high school students aged 13-19.",
    benefits: "All-expenses-paid trip to Walt Disney World, mentorship from professionals, and career workshops.",
    requirements: "Application questions detailing your personal dreams, obstacles overcome, and leadership goals.",
    tips: "Tell a compelling, authentic story about what drives you and how you plan to impact the world.",
    officialLink: "https://www.disneydreamersacademy.com/",
    category: "Leadership Programs",
    country: "United States",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Intermediate",
    deadline: "2026-10-31",
    views: 8400,
    tags: ["Leadership", "Career Exploration", "Disney", "Fully Funded"]
  },
  {
    id: "opp-94",
    title: "AAJA JCamp",
    organization: "Asian American Journalists Association",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=120&q=80",
    description: "A fully funded six-day national multicultural journalism training program for high school students, featuring top industry professionals.",
    eligibility: "US high school freshmen, sophomores, and juniors. All backgrounds welcome.",
    benefits: "All-expenses-paid trip, intensive journalism training, and networking with national media professionals.",
    requirements: "Writing samples, teacher recommendation, and a demonstrated interest in journalism.",
    tips: "Showcase your curiosity, storytelling skills, and a commitment to diverse perspectives in media.",
    officialLink: "https://www.aaja.org/programs-and-initiatives/jcamp/",
    category: "Summer Programs",
    country: "United States",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Intermediate",
    deadline: "2026-03-31",
    views: 4100,
    tags: ["Journalism", "Media", "Diversity", "Fully Funded"]
  },
  {
    id: "opp-95",
    title: "YoungArts National Arts Competition",
    organization: "YoungArts Foundation",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=120&q=80",
    description: "A prestigious competition for young artists across 10 disciplines, including visual, literary, design, and performing arts.",
    eligibility: "US citizens or permanent residents in grades 10-12 or aged 15-18.",
    benefits: "Cash awards, master classes with renowned artists, and an exclusive pathway to becoming a US Presidential Scholar in the Arts.",
    requirements: "Submission of an extensive digital portfolio or audition tape specific to your discipline.",
    tips: "Ensure your portfolio demonstrates not only technical proficiency but also a unique, personal artistic voice.",
    officialLink: "https://youngarts.org/",
    category: "Competitions",
    country: "United States",
    isOnline: true,
    isFree: false,
    cost: 35,
    difficulty: "Advanced",
    deadline: "2026-10-15",
    views: 6300,
    tags: ["Arts", "Performing Arts", "Writing", "Design"]
  },
  {
    id: "opp-96",
    title: "Profile in Courage Essay Contest",
    organization: "John F. Kennedy Presidential Library and Museum",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=120&q=80",
    description: "An essay contest challenging students to write about an act of political courage by a US elected official who served during or after 1917.",
    eligibility: "US high school students.",
    benefits: "Up to $10,000 in scholarships and a trip to Boston to accept the award.",
    requirements: "A 700-1,000 word essay with a minimum of five primary/secondary sources.",
    tips: "Choose a less obvious political figure and focus deeply on the specific risks they took to act courageously.",
    officialLink: "https://www.jfklibrary.org/learn/education/profile-in-courage-essay-contest",
    category: "Competitions",
    country: "United States",
    isOnline: true,
    isFree: true,
    cost: 0,
    difficulty: "Intermediate",
    deadline: "2026-01-15",
    views: 5200,
    tags: ["History", "Political Science", "Essay Contest", "Scholarship"]
  },
  {
    id: "opp-97",
    title: "Voice of Democracy Audio-Essay Competition",
    organization: "Veterans of Foreign Wars (VFW)",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=120&q=80",
    description: "An audio-essay program that provides high school students with the opportunity to express themselves regarding democratic and patriotic themes.",
    eligibility: "High school students in the United States.",
    benefits: "Top national prize of a $30,000 scholarship, plus regional awards and trips to Washington, D.C.",
    requirements: "A recorded 3-5 minute original audio essay on the annual theme, submitted to a local VFW post.",
    tips: "Speak clearly and passionately. Ensure your essay has a strong narrative structure that connects personal stories to the broader theme.",
    officialLink: "https://www.vfw.org/community/youth-and-education/youth-scholarships",
    category: "Competitions",
    country: "United States",
    isOnline: true,
    isFree: true,
    cost: 0,
    difficulty: "Intermediate",
    deadline: "2026-10-31",
    views: 4800,
    tags: ["Public Speaking", "Audio Essay", "Civics", "Scholarship"]
  },
  {
    id: "opp-98",
    title: "CyberPatriot National Youth Cyber Defense Competition",
    organization: "Air & Space Forces Association",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=120&q=80",
    description: "A team-based competition where high school students act as IT professionals managing the network of a small company and securing it from cyber threats.",
    eligibility: "Teams of 2-6 high school students in the US.",
    benefits: "Cybersecurity skills development, national recognition, and scholarship opportunities.",
    requirements: "Team registration, coach supervision, and participation in virtual rounds securing virtual machine networks.",
    tips: "Learn the fundamentals of Windows and Linux security policies, firewall configurations, and user account management.",
    officialLink: "https://www.uscyberpatriot.org/",
    category: "Competitions",
    country: "United States",
    isOnline: true,
    isFree: false,
    cost: 205,
    difficulty: "Intermediate",
    deadline: "2026-10-01",
    views: 7300,
    tags: ["Cybersecurity", "IT Support", "Team Challenge", "STEM"]
  },
  {
    id: "opp-99",
    title: "Technovation Girls",
    organization: "Technovation",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=120&q=80",
    description: "A global tech education program that equips young women to become tech entrepreneurs and leaders. Teams identify a community problem and build a mobile app to solve it.",
    eligibility: "Girls and young women aged 8-18 worldwide.",
    benefits: "Mentorship from industry professionals, global pitching opportunities, and potential seed funding.",
    requirements: "Develop a mobile app prototype, a business plan, and a pitch video.",
    tips: "Focus on user research. A simple app that directly addresses a proven community need often beats a complex but unfocused app.",
    officialLink: "https://technovationchallenge.org/",
    category: "Competitions",
    country: "Global",
    isOnline: true,
    isFree: true,
    cost: 0,
    difficulty: "Intermediate",
    deadline: "2026-03-25",
    views: 6500,
    tags: ["App Development", "Entrepreneurship", "Women in STEM", "Global"]
  },
  {
    id: "opp-100",
    title: "Conrad Challenge",
    organization: "Conrad Foundation",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=120&q=80",
    description: "A team-based innovation and entrepreneurship competition that encourages students to design sustainable solutions to global challenges.",
    eligibility: "Teams of 2-5 students globally, aged 13-18.",
    benefits: "Scholarships, patent assistance, and direct feedback from corporate investors and experts.",
    requirements: "A detailed business plan, a technical brief, and a video pitch.",
    tips: "Ensure your technical brief demonstrates scientific feasibility and your business plan shows a realistic path to market.",
    officialLink: "https://www.conradchallenge.org/",
    category: "Competitions",
    country: "Global",
    isOnline: true,
    isFree: false,
    cost: 149,
    difficulty: "Advanced",
    deadline: "2026-11-01",
    views: 8100,
    tags: ["Innovation", "Entrepreneurship", "Business Plan", "STEM"]
  },
  {
    id: "opp-101",
    title: "Zero Robotics High School Tournament",
    organization: "MIT / NASA",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=120&q=80",
    description: "A programming competition where high school students write code to control SPHERES (Synchronized Position Hold Engage and Reorient Experimental Satellites) on the ISS.",
    eligibility: "High school student teams globally, typically working with a mentor.",
    benefits: "Winning teams have their code executed by astronauts in microgravity on the International Space Station.",
    requirements: "Programming in C++ or using a graphical block interface to solve a specified physics challenge.",
    tips: "Use the online simulator extensively to test and optimize your code's efficiency and collision-avoidance logic.",
    officialLink: "http://zerorobotics.mit.edu/",
    category: "Competitions",
    country: "United States",
    isOnline: true,
    isFree: true,
    cost: 0,
    difficulty: "Advanced",
    deadline: "2026-09-30",
    views: 7400,
    tags: ["Aerospace", "Programming", "NASA", "Physics"]
  },
  {
    id: "opp-102",
    title: "National Economics Challenge (NEC)",
    organization: "Council for Economic Education",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=120&q=80",
    description: "The premier high school economics competition in the United States, testing micro, macro, and international economic principles.",
    eligibility: "US high school students in teams of up to 4.",
    benefits: "Cash prizes, national trophies, and direct engagement with financial policy leaders.",
    requirements: "State, regional, and national testing rounds ending in a live televised quiz-bowl final.",
    tips: "Focus on understanding basic economic models (like supply-demand curves, monetary policies, and trade equations) inside and out.",
    officialLink: "https://www.councilforeconed.org/national-economics-challenge/",
    category: "Competitions",
    country: "United States",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Advanced",
    deadline: "2026-04-01",
    views: 6100,
    tags: ["Economics", "Finance", "Quiz Bowl", "Macroeconomics"]
  },
  {
    id: "opp-103",
    title: "Diamond Challenge for High School Entrepreneurs",
    organization: "University of Delaware",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=120&q=80",
    description: "An international entrepreneurship competition providing high school students with a chance to experience the entrepreneurial process and pitch their ideas.",
    eligibility: "High school students globally in teams of 2-4.",
    benefits: "Access to a global network of mentors, an educational curriculum, and a share of a $100,000 prize pool.",
    requirements: "Submission of a concept narrative and a pitch deck (Business Innovation or Social Innovation track).",
    tips: "Clearly define the problem you are solving, your unique value proposition, and the evidence supporting your market demand.",
    officialLink: "https://diamondchallenge.org/",
    category: "Competitions",
    country: "Global",
    isOnline: true,
    isFree: true,
    cost: 0,
    difficulty: "Intermediate",
    deadline: "2026-01-15",
    views: 7800,
    tags: ["Entrepreneurship", "Pitch Competition", "Startups", "Innovation"]
  },
  {
    id: "opp-104",
    title: "National Geographic Slingshot Challenge",
    organization: "National Geographic Society",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1447069387593-a5de0862481e?auto=format&fit=crop&w=120&q=80",
    description: "A global video challenge empowering students to create 1-minute videos outlining solutions to the world's most pressing environmental issues.",
    eligibility: "Youth globally aged 13-18.",
    benefits: "$10,000 funding prizes, National Geographic Explorer mentorship, and an invitation to the Explorer Festival.",
    requirements: "A 1-minute video focusing on a solution related to oceans, climate, nature, or conservation.",
    tips: "Focus on a localized problem and a realistic, scalable solution rather than a broad, generic overview of climate change.",
    officialLink: "https://www.nationalgeographic.org/society/projects/slingshot/",
    category: "Competitions",
    country: "Global",
    isOnline: true,
    isFree: true,
    cost: 0,
    difficulty: "Intermediate",
    deadline: "2026-02-01",
    views: 5400,
    tags: ["Environment", "Video Contest", "Conservation", "National Geographic"]
  },
  {
    id: "opp-105",
    title: "Horatio Alger National Scholarship",
    organization: "Horatio Alger Association",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=120&q=80",
    description: "A major scholarship program assisting high school students who have faced and overcome great obstacles in their young lives to pursue higher education.",
    eligibility: "US high school juniors with significant financial need ($65,000 or lower adjusted gross family income) and a minimum GPA of 2.0.",
    benefits: "A $25,000 college scholarship and an all-expenses-paid trip to the National Scholars Conference in D.C.",
    requirements: "Essays detailing adversity overcome, financial documentation, and academic records.",
    tips: "Be honest and vulnerable in your essays. The committee values perseverance, grit, and a strong desire to succeed despite challenges.",
    officialLink: "https://scholars.horatioalger.org/",
    category: "Scholarships",
    country: "United States",
    isOnline: true,
    isFree: true,
    cost: 0,
    difficulty: "Advanced",
    deadline: "2026-03-15",
    views: 10200,
    tags: ["Scholarship", "Financial Need", "Overcoming Adversity", "College Funding"]
  },
  {
    id: "opp-106",
    title: "Apple Swift Student Challenge",
    organization: "Apple Inc.",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=120&q=80",
    description: "An annual coding challenge by Apple where students build an original app playground using the Swift programming language.",
    eligibility: "Students aged 13+ globally who are registered as Apple developers.",
    benefits: "Exclusive WWDC outerwear, AirPods Pro, one year of Apple Developer Program membership, and potential invitations to Apple Park.",
    requirements: "An original, interactive Swift Playgrounds app demonstrating creativity and technical coding skills.",
    tips: "Focus on UI/UX and creating a small but highly polished and interactive experience rather than a massive, unfinished app.",
    officialLink: "https://developer.apple.com/wwdc/swift-student-challenge/",
    category: "Hackathons",
    country: "Global",
    isOnline: true,
    isFree: true,
    cost: 0,
    difficulty: "Advanced",
    deadline: "2026-02-25",
    views: 14500,
    tags: ["Coding", "Apple", "Swift", "App Development"]
  },
  {
    id: "opp-107",
    title: "Stanford Medical Youth Science Program (SMYSP)",
    organization: "Stanford University School of Medicine",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&w=120&q=80",
    description: "A five-week intensive summer clinical and research program designed to support low-income, underrepresented high school students interested in medicine.",
    eligibility: "Low-income high school sophomores and juniors residing in Northern California.",
    benefits: "Clinical exposure, anatomy labs, public health research projects, and full tuition coverage.",
    requirements: "Academic transcripts, science teacher recommendations, and personal essays detailing interest in healthcare.",
    tips: "Emphasize your commitment to addressing health disparities and your dedication to serving your local community.",
    officialLink: "https://smysp.stanford.edu/",
    category: "Summer Programs",
    country: "United States",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Advanced",
    deadline: "2026-03-01",
    views: 8200,
    tags: ["Medicine", "Stanford", "Underrepresented", "Healthcare STEM"]
  },
  {
    id: "opp-108",
    title: "LaunchX Summer Entrepreneurship Program",
    organization: "LaunchX",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=120&q=80",
    description: "An intensive summer program where high schoolers team up to build and launch real startups, guided by industry experts.",
    eligibility: "High school students globally in grades 9-12.",
    benefits: "Hands-on experience in building a startup, access to top-tier entrepreneurial mentors, and alumni network access.",
    requirements: "A video pitch, business scenario analysis, and a portfolio showing initiative and leadership.",
    tips: "Show that you are a doer. LaunchX values applicants who have already tried to start small projects or businesses, even if they failed.",
    officialLink: "https://launchx.com/",
    category: "Summer Programs",
    country: "Global",
    isOnline: false,
    isFree: false,
    cost: 9500,
    difficulty: "Advanced",
    deadline: "2026-02-15",
    views: 9100,
    tags: ["Entrepreneurship", "Startups", "Business", "Leadership"]
  },
  {
    id: "opp-109",
    title: "Math Prize for Girls",
    organization: "Advantage Testing Foundation / MIT",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=120&q=80",
    description: "The largest math prize for girls in the world, hosted annually at MIT to encourage young women to pursue STEM professions.",
    eligibility: "Female students in grades 11 or below in the US and Canada who took the AMC 10 or AMC 12.",
    benefits: "A $50,000 prize pool, networking with other top female mathematicians, and MIT campus experience.",
    requirements: "Qualifying score on the AMC 10 or AMC 12 exam.",
    tips: "Consistently practice challenging geometry and combinatorics problems under timed conditions.",
    officialLink: "https://mathprize.atfoundation.org/",
    category: "Competitions",
    country: "United States",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Olympiad",
    deadline: "2026-06-30",
    views: 7400,
    tags: ["Mathematics", "Women in STEM", "MIT", "AMC Qualifier"]
  },
  {
    id: "opp-110",
    title: "GripTape Challenger",
    organization: "GripTape",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=120&q=80",
    description: "A micro-grant program that gives teenagers full control and funding to pursue a passion project or start a community initiative.",
    eligibility: "US youth aged 15-19.",
    benefits: "A $500 grant, a dedicated 'Champion' mentor, and full autonomy over your project for 10 weeks.",
    requirements: "A simple application describing what you want to learn or build, and why it matters to you.",
    tips: "Be highly specific about the end goal of your 10 weeks. GripTape loves funding projects where you are learning a completely new skill.",
    officialLink: "https://griptape.org/",
    category: "Fellowships",
    country: "United States",
    isOnline: true,
    isFree: true,
    cost: 0,
    difficulty: "Beginner",
    deadline: "2026-04-15",
    views: 4500,
    tags: ["Micro-grant", "Passion Project", "Self-Directed", "Mentorship"]
  },
  {
    id: "opp-111",
    title: "Dragon Kim Fellowship",
    organization: "The Dragon Kim Foundation",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=120&q=80",
    description: "A fellowship providing high school students with leadership training and grants to launch a community service project over the summer.",
    eligibility: "High school students in California, Nevada, and Arizona.",
    benefits: "Up to $5,000 in project seed funding, 3 weekends of leadership training, and an assigned mentor.",
    requirements: "A project proposal focusing on arts, athletics, or academics to serve an under-resourced community.",
    tips: "Focus on feasibility. Ensure your budget makes sense and that you have a clear plan to reach the people you intend to help.",
    officialLink: "https://dragonkimfoundation.org/",
    category: "Fellowships",
    country: "United States",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Intermediate",
    deadline: "2026-01-08",
    views: 3900,
    tags: ["Community Service", "Seed Funding", "Leadership", "Social Impact"]
  },
  {
    id: "opp-112",
    title: "Equitable Excellence Scholarship",
    organization: "Equitable Foundation",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&q=80",
    description: "A major scholarship program recognizing students who show immense potential, courage, and a commitment to helping others in their community.",
    eligibility: "US high school seniors planning to enroll full-time in an accredited college.",
    benefits: "Scholarships of $5,000 or $25,000 for college tuition, plus professional networking.",
    requirements: "Academic records, details of a community service project, and essays on your impact.",
    tips: "Highlight the specific, measurable results of a project or organization you started or led.",
    officialLink: "https://equitable.com/foundation/equitable-excellence-scholarship",
    category: "Scholarships",
    country: "United States",
    isOnline: true,
    isFree: true,
    cost: 0,
    difficulty: "Advanced",
    deadline: "2026-12-15",
    views: 8100,
    tags: ["Scholarship", "Community Service", "Leadership", "College Prep"]
  },
  {
    id: "opp-113",
    title: "The Princeton Prize in Race Relations",
    organization: "Princeton University",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=120&q=80",
    description: "An award recognizing high school students who have engaged in efforts to advance racial equity and understanding in their communities.",
    eligibility: "High school students in grades 9-12 in participating US regions.",
    benefits: "A $1,000 cash award and an invitation to the Princeton Prize Symposium on Race.",
    requirements: "An essay detailing your racial equity project and a sponsor recommendation.",
    tips: "Focus on action over theory. Show exactly what steps you took to improve race relations and how it impacted others.",
    officialLink: "https://pprr.princeton.edu/",
    category: "Competitions",
    country: "United States",
    isOnline: false,
    isFree: true,
    cost: 0,
    difficulty: "Intermediate",
    deadline: "2026-01-31",
    views: 5200,
    tags: ["Racial Equity", "Social Justice", "Princeton", "Advocacy"]
  },
  {
    id: "opp-114",
    title: "Elie Wiesel Prize in Ethics Essay Contest",
    organization: "The Elie Wiesel Foundation for Humanity",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=120&q=80",
    description: "An essay contest challenging students to analyze ethical questions and concerns in the modern world.",
    eligibility: "High school juniors and seniors (and college undergraduates).",
    benefits: "Cash prizes ranging from $500 to $5,000.",
    requirements: "A 3,000-4,000 word essay analyzing an ethical issue drawn from personal experience, history, or literature.",
    tips: "Connect complex global or historical ethical issues to your own personal observations and life experiences.",
    officialLink: "https://eliewieselfoundation.org/prize-in-ethics/",
    category: "Competitions",
    country: "United States",
    isOnline: true,
    isFree: true,
    cost: 0,
    difficulty: "Advanced",
    deadline: "2026-12-30",
    views: 4800,
    tags: ["Ethics", "Essay Contest", "Philosophy", "Humanities"]
  },
  {
    id: "opp-115",
    title: "Lumiere Research Scholar Program",
    organization: "Lumiere Education",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=120&q=80",
    description: "A selective online program connecting high school students with PhD mentors from top universities to produce independent academic research.",
    eligibility: "High school students globally with high academic standing.",
    benefits: "One-on-one mentorship, research publication assistance, and a completed university-level research paper.",
    requirements: "Online application, transcripts, and an interview.",
    tips: "Demonstrate extreme curiosity in a highly specific niche. Broad interests are less compelling than a very targeted research question.",
    officialLink: "https://www.lumiere-education.com/",
    category: "Research Programs",
    country: "Global",
    isOnline: true,
    isFree: false,
    cost: 2800,
    difficulty: "Advanced",
    deadline: "2026-05-15",
    views: 6500,
    tags: ["Online Research", "Mentorship", "Publication", "STEM & Humanities"]
  },
  {
    id: "opp-116",
    title: "DECA International Career Development Conference",
    organization: "DECA Inc.",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=120&q=80",
    description: "The pinnacle competition for DECA students, focusing on marketing, finance, hospitality, and management business case studies.",
    eligibility: "High school students who are members of DECA and qualify through state/provincial conferences.",
    benefits: "Global networking, business scholarships, and high prestige in collegiate business programs.",
    requirements: "Qualification through state-level role-plays and written business plans.",
    tips: "Master your performance in live role-plays. Confidence, clear presentation, and creative marketing solutions win the judges over.",
    officialLink: "https://www.deca.org/high-school/events/icdc",
    category: "Competitions",
    country: "Global",
    isOnline: false,
    isFree: false,
    cost: 150,
    difficulty: "Advanced",
    deadline: "2026-04-25",
    views: 11000,
    tags: ["Business", "Marketing", "Finance", "DECA"]
  },
  {
    id: "opp-117",
    title: "HOSA International Leadership Conference",
    organization: "HOSA - Future Health Professionals",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&w=120&q=80",
    description: "An international competition bringing together top high school students in health science and medical technology categories.",
    eligibility: "HOSA members globally who qualify at state/country levels.",
    benefits: "Awards, scholarships, and interaction with major healthcare industry recruiters and universities.",
    requirements: "Qualification via regional testing and practical clinical skills demonstrations.",
    tips: "For clinical events, practice your physical procedures until they are muscle memory. For written events, memorize extensive medical terminology.",
    officialLink: "https://hosa.org/ilc/",
    category: "Competitions",
    country: "Global",
    isOnline: false,
    isFree: false,
    cost: 100,
    difficulty: "Advanced",
    deadline: "2026-06-20",
    views: 8900,
    tags: ["Healthcare", "Medicine", "HOSA", "Clinical Skills"]
  },
  {
    id: "opp-118",
    title: "Burger King Scholars Program",
    organization: "Burger King Foundation",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=120&q=80",
    description: "A wide-reaching scholarship program aimed at helping high school seniors fund their college education, assessing GPA, work experience, and community service.",
    eligibility: "High school seniors in the US, Canada, or Puerto Rico.",
    benefits: "Scholarships ranging from $1,000 to $50,000.",
    requirements: "Academic records (minimum 2.5 GPA), work experience history, and extracurricular activities.",
    tips: "This program highly values students who balance academic life with part-time work and community engagement.",
    officialLink: "https://burgerking.scholarsapply.org/",
    category: "Scholarships",
    country: "United States",
    isOnline: true,
    isFree: true,
    cost: 0,
    difficulty: "Intermediate",
    deadline: "2026-12-15",
    views: 12500,
    tags: ["Scholarship", "College Funding", "Work Experience", "Accessible"]
  },
  {
    id: "opp-119",
    title: "Live Más Scholarship",
    organization: "Taco Bell Foundation",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=120&q=80",
    description: "A passion-based scholarship program for innovators, creators, and dreamers. It does not require essays, test scores, or GPA.",
    eligibility: "US residents aged 16-26.",
    benefits: "Scholarships ranging from $5,000 to $25,000 for higher education.",
    requirements: "A 2-minute video describing your passion, how you are using it to make a difference, and your educational goals.",
    tips: "Be highly creative and authentic in your video. Production value matters less than the clarity and energy of your vision.",
    officialLink: "https://www.tacobellfoundation.org/live-mas-scholarship/",
    category: "Scholarships",
    country: "United States",
    isOnline: true,
    isFree: true,
    cost: 0,
    difficulty: "Intermediate",
    deadline: "2026-01-10",
    views: 14000,
    tags: ["Video Pitch", "Passion Project", "Scholarship", "No GPA Required"]
  },
  {
    id: "opp-120",
    title: "Pioneer Academics Research Program",
    organization: "Pioneer Academics",
    orgVerified: true,
    logoUrl: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=120&q=80",
    description: "A highly respected online research program offering fully accredited undergraduate-level research experiences with top university faculty.",
    eligibility: "High school students globally with high academic standing.",
    benefits: "Accredited college credit (Oberlin College), research publication opportunities, and one-on-one professor reviews.",
    requirements: "Application forms, transcripts, timed writing tests, and a virtual interview.",
    tips: "Be specific about your research interests. Make it clear why you prefer rigorous research over structured textbook learning.",
    officialLink: "https://pioneeracademics.com",
    category: "Research Programs",
    country: "Global",
    isOnline: true,
    isFree: false,
    cost: 6450,
    difficulty: "Advanced",
    deadline: "2026-04-10",
    views: 7900,
    tags: ["Online Research", "Mentorship", "College Credit", "STEM & Humanities"]
  }
];

export default function App() {
  // Theme State
  const [darkMode, setDarkMode] = useState(true);

  // Core Navigation State
  const [currentTab, setCurrentTab] = useState("landing");
  
  // Selected Opportunity Detail state
  const [selectedOppId, setSelectedOppId] = useState("opp-1");

  // User Auth State
  const [user, setUser] = useState(null);

  // Database States loaded from Firestore
  const [opportunities, setOpportunities] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [applications, setApplications] = useState([]);
  const [subscribers, setSubscribers] = useState([]);

  // Search, Filter and Sorting State (Explore Tab)
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterDifficulty, setFilterDifficulty] = useState("All");
  const [filterMode, setFilterMode] = useState("All"); 
  const [filterCost, setFilterCost] = useState("All"); 
  const [filterCountry, setFilterCountry] = useState("All");
  const [sortBy, setSortBy] = useState("Popularity"); 

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Notification system
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Rise Global Fellowship deadline is approaching soon. Keep polishing your project summary!", unread: true },
    { id: 2, text: "Your tracked student milestone (MIT RSI) is open for early screening drafts.", unread: false }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Administrative / CMS Creation form states
  const [newOppTitle, setNewOppTitle] = useState("");
  const [newOppOrg, setNewOppOrg] = useState("");
  const [newOppCategory, setNewOppCategory] = useState("Scholarships");
  const [newOppDifficulty, setNewOppDifficulty] = useState("Intermediate");
  const [newOppCountry, setNewOppCountry] = useState("Global");
  const [newOppOnline, setNewOppOnline] = useState(true);
  const [newOppFree, setNewOppFree] = useState(true);
  const [newOppCost, setNewOppCost] = useState("0");
  const [newOppDeadline, setNewOppDeadline] = useState("2026-12-31");
  const [newOppDesc, setNewOppDesc] = useState("");
  const [newOppBenefits, setNewOppBenefits] = useState("");
  const [newOppEligibility, setNewOppEligibility] = useState("");
  const [newOppRequirements, setNewOppRequirements] = useState("");
  const [newOppTips, setNewOppTips] = useState("");
  const [newOppLink, setNewOppLink] = useState("");
  const [newOppTags, setNewOppTags] = useState("");

  // Edit Opportunity ID State
  const [editingOppId, setEditingOppId] = useState(null);

  // Toast system state
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Analytics helper variables
  const totalViews = useMemo(() => {
    return opportunities.reduce((acc, curr) => acc + (curr.views || 0), 0);
  }, [opportunities]);

  const categoriesList = ["All", "Scholarships", "Summer Programs", "Research Programs", "Competitions", "Olympiads", "Hackathons", "Fellowships"];

  // Authentication Setup (Rule 3: Auth Before Queries)
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Firebase Authentication failed:", err);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Sync Global Opportunities (Public Collection path - Rule 1)
  useEffect(() => {
    if (!user) return;

    const oppsCollectionRef = collection(db, 'artifacts', appId, 'public', 'data', 'opportunities');

    const unsubscribe = onSnapshot(oppsCollectionRef, (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });

      // If the database is completely empty, automatically seed with original high-value opportunities
      if (list.length === 0) {
        INITIAL_OPPORTUNITIES.forEach(async (opp) => {
          const oppDocRef = doc(oppsCollectionRef, opp.id);
          await setDoc(oppDocRef, opp);
        });
        setOpportunities(INITIAL_OPPORTUNITIES);
      } else {
        setOpportunities(list);
      }
    }, (error) => {
      console.error("Failed to load opportunities:", error);
    });

    return () => unsubscribe();
  }, [user]);

  // Sync Bookmarks (Private Collection path - Rule 1 & Rule 3)
  useEffect(() => {
    if (!user) return;

    const bookmarksCollectionRef = collection(db, 'artifacts', appId, 'users', user.uid, 'bookmarks');

    const unsubscribe = onSnapshot(bookmarksCollectionRef, (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => {
        list.push(doc.id); // Save document IDs representing bookmarked opportunity IDs
      });
      setBookmarks(list);
    }, (error) => {
      console.error("Failed to load bookmarks:", error);
    });

    return () => unsubscribe();
  }, [user]);

  // Sync Applications (Private Collection path - Rule 1 & Rule 3)
  useEffect(() => {
    if (!user) return;

    const appsCollectionRef = collection(db, 'artifacts', appId, 'users', user.uid, 'applications');

    const unsubscribe = onSnapshot(appsCollectionRef, (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setApplications(list);
    }, (error) => {
      console.error("Failed to load tracked applications:", error);
    });

    return () => unsubscribe();
  }, [user]);

  // Sync Subscribers (Public Collection path - Rule 1 & Rule 3)
  useEffect(() => {
    if (!user) return;

    const subsCollectionRef = collection(db, 'artifacts', appId, 'public', 'data', 'subscribers');

    const unsubscribe = onSnapshot(subsCollectionRef, (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => {
        list.push(doc.data().email);
      });
      setSubscribers(list);
    }, (error) => {
      console.error("Failed to load subscribers:", error);
    });

    return () => unsubscribe();
  }, [user]);

  // Handle Bookmarks Toggle
  const toggleBookmark = async (oppId) => {
    if (!user) {
      triggerToast("Please wait, authenticating session...");
      return;
    }

    const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'bookmarks', oppId);

    if (bookmarks.includes(oppId)) {
      try {
        await setDoc(docRef, {}, { merge: false }); 
        await deleteDoc(docRef);
        triggerToast("Removed from saved bookmarks");
      } catch (err) {
        console.error(err);
        triggerToast("Error removing bookmark");
      }
    } else {
      try {
        await setDoc(docRef, { bookmarkedAt: new Date().toISOString() });
        triggerToast("Saved to bookmarks!");
      } catch (err) {
        console.error(err);
        triggerToast("Error saving bookmark");
      }
    }
  };

  // Add Application to Kanban Board
  const createApplicationRecord = async (oppId) => {
    if (!user) return;

    const exists = applications.find(app => app.opportunityId === oppId);
    if (exists) {
      triggerToast("Already tracked in your Application Board!");
      setCurrentTab("dashboard");
      return;
    }

    const appDocId = "app-" + Date.now();
    const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'applications', appDocId);

    try {
      await setDoc(docRef, {
        opportunityId: oppId,
        status: "SAVED",
        notes: "Started application workspace tracker via OpportunityHub.",
        updatedAt: new Date().toISOString()
      });
      triggerToast("Mapped to application tracker board!");
      setCurrentTab("dashboard");
    } catch (err) {
      console.error(err);
      triggerToast("Failed to create tracked card");
    }
  };

  // Delete Application Card
  const deleteApplicationRecord = async (appIdValue) => {
    if (!user) return;
    const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'applications', appIdValue);
    try {
      await deleteDoc(docRef);
      triggerToast("Application record deleted");
    } catch (err) {
      console.error(err);
      triggerToast("Failed to delete application record");
    }
  };

  // Update Application Kanban Status
  const updateApplicationStatus = async (appIdValue, newStatus) => {
    if (!user) return;
    const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'applications', appIdValue);
    try {
      await updateDoc(docRef, { 
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      triggerToast(`Status updated to ${newStatus}`);
    } catch (err) {
      console.error(err);
      triggerToast("Failed to update status");
    }
  };

  // Update Application Notes
  const updateApplicationNotes = async (appIdValue, text) => {
    if (!user) return;
    const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'applications', appIdValue);
    try {
      await updateDoc(docRef, { notes: text });
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Newsletter Submission
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      triggerToast("Please enter a valid academic email address.");
      return;
    }
    if (subscribers.includes(newsletterEmail)) {
      triggerToast("This email has already been registered!");
      return;
    }

    try {
      const subId = newsletterEmail.replace(/[^a-zA-Z0-9]/g, "_");
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'subscribers', subId);
      await setDoc(docRef, { 
        email: newsletterEmail,
        subscribedAt: new Date().toISOString()
      });
      setNewsletterSubscribed(true);
      setNewsletterEmail("");
      triggerToast("Joined the prestigious newsletter segment!");
    } catch (err) {
      console.error(err);
      triggerToast("Failed to subscribe");
    }
  };

  // Handle Admin CRUD Operations (Public updates)
  const handleCreateOpportunity = async (e) => {
    e.preventDefault();
    if (!user) return;

    if (!newOppTitle || !newOppOrg || !newOppDesc) {
      triggerToast("Title, Host, and Description are required parameters.");
      return;
    }

    const processedTags = newOppTags ? newOppTags.split(",").map(t => t.trim()) : ["Featured"];
    const targetId = editingOppId || "opp-" + Date.now();

    const opportunityPayload = {
      id: targetId,
      title: newOppTitle,
      organization: newOppOrg,
      orgVerified: true,
      logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80",
      description: newOppDesc,
      eligibility: newOppEligibility || "High school juniors and seniors globally.",
      benefits: newOppBenefits || "Full scholarship tuition fee waiver.",
      requirements: newOppRequirements || "Academic credentials statement and essay writing.",
      tips: newOppTips || "Ensure focus on creative potential or science background.",
      officialLink: newOppLink || "https://opportunityhub.co",
      category: newOppCategory,
      country: newOppCountry,
      isOnline: newOppOnline,
      isFree: newOppFree,
      cost: parseFloat(newOppCost) || 0,
      difficulty: newOppDifficulty,
      deadline: newOppDeadline,
      views: 120,
      tags: processedTags
    };

    try {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'opportunities', targetId);
      await setDoc(docRef, opportunityPayload, { merge: true });

      if (editingOppId) {
        triggerToast("Directory opportunity updated!");
        setEditingOppId(null);
      } else {
        triggerToast("Vetted opportunity published live!");
      }

      // Reset fields
      setNewOppTitle("");
      setNewOppOrg("");
      setNewOppDesc("");
      setNewOppBenefits("");
      setNewOppEligibility("");
      setNewOppRequirements("");
      setNewOppTips("");
      setNewOppLink("");
      setNewOppTags("");
    } catch (err) {
      console.error(err);
      triggerToast("CMS save operation failed.");
    }
  };

  // Load entry values into editor
  const loadOpportunityForEdit = (opp) => {
    setEditingOppId(opp.id);
    setNewOppTitle(opp.title);
    setNewOppOrg(opp.organization);
    setNewOppCategory(opp.category);
    setNewOppDifficulty(opp.difficulty);
    setNewOppCountry(opp.country);
    setNewOppOnline(opp.isOnline);
    setNewOppFree(opp.isFree);
    setNewOppCost(opp.cost.toString());
    setNewOppDeadline(opp.deadline);
    setNewOppDesc(opp.description);
    setNewOppBenefits(opp.benefits);
    setNewOppEligibility(opp.eligibility);
    setNewOppRequirements(opp.requirements);
    setNewOppTips(opp.tips);
    setNewOppLink(opp.officialLink);
    setNewOppTags(opp.tags ? opp.tags.join(", ") : "");
    triggerToast("Loaded directory entry for modifier workspace");
  };

  // Delete live opportunity database entry
  const deleteOpportunity = async (oppId) => {
    if (!user) return;
    try {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'opportunities', oppId);
      await deleteDoc(docRef);
      triggerToast("Entry removed from global server database.");
    } catch (err) {
      console.error(err);
      triggerToast("Failed to delete entry");
    }
  };

  // Filter & Sort Logic (Handled efficiently in client memory - Rule 2)
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(opp => {
      const kw = searchQuery.toLowerCase();
      const matchKeyword = !searchQuery || 
        opp.title.toLowerCase().includes(kw) || 
        opp.organization.toLowerCase().includes(kw) || 
        (opp.description && opp.description.toLowerCase().includes(kw)) ||
        (opp.tags && opp.tags.some(t => t.toLowerCase().includes(kw)));

      const normCat = filterCategory === "All" ? true : opp.category?.replace(" ", "").toLowerCase().includes(filterCategory.replace(" ", "").toLowerCase());
      const matchDiff = filterDifficulty === "All" || opp.difficulty === filterDifficulty;
      const matchMode = filterMode === "All" || 
        (filterMode === "Online" && opp.isOnline) || 
        (filterMode === "In-person" && !opp.isOnline);

      const matchCost = filterCost === "All" || 
        (filterCost === "Free" && opp.isFree) || 
        (filterCost === "Paid" && !opp.isFree);

      const matchCountry = filterCountry === "All" || opp.country === filterCountry;

      return matchKeyword && normCat && matchDiff && matchMode && matchCost && matchCountry;
    }).sort((a, b) => {
      if (sortBy === "Popularity") {
        return (b.views || 0) - (a.views || 0);
      }
      if (sortBy === "Newest") {
        return b.id.localeCompare(a.id);
      }
      if (sortBy === "Deadline") {
        return new Date(a.deadline) - new Date(b.deadline);
      }
      return 0;
    });
  }, [opportunities, searchQuery, filterCategory, filterDifficulty, filterMode, filterCost, filterCountry, sortBy]);

  // Selected Opportunity
  const activeOpp = useMemo(() => {
    return opportunities.find(opp => opp.id === selectedOppId) || opportunities[0];
  }, [opportunities, selectedOppId]);

  // Related opportunities recommendation pool
  const relatedOpps = useMemo(() => {
    if (!activeOpp) return [];
    return opportunities
      .filter(opp => opp.id !== activeOpp.id && (opp.category === activeOpp.category || (opp.tags && opp.tags.some(t => activeOpp.tags?.includes(t)))))
      .slice(0, 3);
  }, [opportunities, activeOpp]);

  // Auto Scroll to Top on tab navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${darkMode ? 'bg-[#0A0D14] text-[#E4E7EC]' : 'bg-[#F9FAFB] text-[#1F2937]'}`}>
      
      {/* GLOBAL TOAST NOTIFICATION SYSTEM */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl border bg-opacity-95 backdrop-blur-md animate-bounce border-emerald-500/30 bg-[#0F1D1A] text-emerald-400">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* HEADER NAVBAR */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md ${darkMode ? 'border-[#1F2433] bg-[#0A0D14]/80' : 'border-gray-200 bg-white/80'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo Brand */}
          <div 
            onClick={() => setCurrentTab("landing")} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className={`text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Opportunity<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-500">Hub</span>
              </span>
              <span className="block text-[9px] text-indigo-400 font-mono tracking-widest uppercase">Vetted Live Cloud Directory</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button 
              onClick={() => { setCurrentTab("landing"); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentTab === "landing" ? (darkMode ? "bg-[#161B2B] text-white" : "bg-gray-100 text-gray-900") : (darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900")}`}
            >
              Overview
            </button>
            <button 
              onClick={() => { setCurrentTab("explore"); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentTab === "explore" ? (darkMode ? "bg-[#161B2B] text-white" : "bg-gray-100 text-gray-900") : (darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900")}`}
            >
              Explore Database
            </button>
            <button 
              onClick={() => { setCurrentTab("dashboard"); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${currentTab === "dashboard" ? (darkMode ? "bg-[#161B2B] text-white" : "bg-gray-100 text-gray-900") : (darkMode ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900")}`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Student Portal
            </button>
            <button 
              onClick={() => { setCurrentTab("admin"); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${currentTab === "admin" ? (darkMode ? "bg-indigo-900/30 text-indigo-300" : "bg-indigo-50 text-indigo-600") : (darkMode ? "text-gray-400 hover:text-white hover:bg-[#161B2B]" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50")}`}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Panel
            </button>
          </nav>

          {/* Actions Panel */}
          <div className="flex items-center gap-3">
            
            {/* Dark & Light Theme Toggler */}
            <button 
              onClick={() => {
                setDarkMode(!darkMode);
                triggerToast(`Switched to ${!darkMode ? 'Dark' : 'Light'} Mode`);
              }}
              className={`p-2 rounded-lg border transition-all ${darkMode ? 'border-[#1F2433] text-amber-400 hover:bg-[#161B2B]' : 'border-gray-200 text-slate-700 hover:bg-gray-100'}`}
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification Ring bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2 rounded-lg border transition-all relative ${darkMode ? 'border-[#1F2433] text-gray-300 hover:bg-[#161B2B]' : 'border-gray-200 text-gray-700 hover:bg-gray-100'}`}
              >
                <Bell className="w-4 h-4" />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping"></span>
                )}
              </button>

              {/* Notification Overlay Popover */}
              {showNotifications && (
                <div className={`absolute right-0 mt-2 w-80 rounded-xl shadow-2xl border p-4 z-50 ${darkMode ? 'bg-[#0E131F] border-[#1F2433]' : 'bg-white border-gray-100'}`}>
                  <div className="flex justify-between items-center pb-2 mb-2 border-b border-gray-800">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Activity stream</span>
                    <button 
                      onClick={() => {
                        setNotifications(notifications.map(n => ({...n, unread: false})));
                        triggerToast("All notifications cleared");
                      }}
                      className="text-[10px] hover:underline text-gray-400"
                    >
                      Clear indicator
                    </button>
                  </div>
                  <div className="space-y-3">
                    {notifications.map(notif => (
                      <div key={notif.id} className="text-xs flex gap-2 items-start">
                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${notif.unread ? 'bg-indigo-400' : 'bg-gray-600'}`}></div>
                        <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{notif.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Direct Dashboard Shortcut */}
            <button 
              onClick={() => setCurrentTab("dashboard")} 
              className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-500/20"
            >
              <User className="w-3.5 h-3.5" />
              My Portal
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE TAB DRAWER */}
      <div className={`md:hidden flex justify-around border-b py-2 px-1 text-xs ${darkMode ? 'bg-[#070A10] border-[#131723]' : 'bg-white border-gray-100'}`}>
        <button onClick={() => setCurrentTab("landing")} className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg ${currentTab === "landing" ? 'text-indigo-400' : 'text-gray-400'}`}>
          <Compass className="w-4 h-4" />
          <span>Home</span>
        </button>
        <button onClick={() => setCurrentTab("explore")} className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg ${currentTab === "explore" ? 'text-indigo-400' : 'text-gray-400'}`}>
          <Search className="w-4 h-4" />
          <span>Search</span>
        </button>
        <button onClick={() => setCurrentTab("dashboard")} className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg ${currentTab === "dashboard" ? 'text-indigo-400' : 'text-gray-400'}`}>
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
        <button onClick={() => setCurrentTab("admin")} className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg ${currentTab === "admin" ? 'text-indigo-400' : 'text-gray-400'}`}>
          <ShieldCheck className="w-4 h-4" />
          <span>CMS</span>
        </button>
      </div>


      {/* ====================================================================
          TAB 1: STARTUP LANDING PAGE
          ==================================================================== */}
      {currentTab === "landing" && (
        <div>
          {/* Hero Section */}
          <section className="relative pt-12 pb-20 overflow-hidden px-4">
            
            {/* Visual Glassmorphic Orbs behind content */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-indigo-600 to-purple-500 rounded-full blur-3xl opacity-15 pointer-events-none"></div>
            
            <div className="max-w-7xl mx-auto text-center relative z-10">
              
              {/* Premium Badge Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border mb-8 bg-[#101423] border-[#222B45] text-indigo-300">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-semibold tracking-wider uppercase font-mono">Live Database Enabled with 105 Curated Opportunities</span>
              </div>

              {/* Bold Main Catchphrase */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8">
                Unlocking elite opportunities <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500">
                  for ambitious high schoolers
                </span>
              </h1>

              {/* Supporting pitch paragraph */}
              <p className={`max-w-3xl mx-auto text-base sm:text-lg mb-10 leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                OpportunityHub is the largest open-access global index of world-renowned scholarships, 
                summer programs, scientific publications, research mentors, and coding hackathons. Built by students, for students.
              </p>

              {/* Large Hero Search Bar */}
              <div className="max-w-2xl mx-auto mb-16 px-2">
                <div className={`flex items-center gap-2 p-2 rounded-2xl border shadow-2xl ${darkMode ? 'bg-[#101424] border-[#1F273E]' : 'bg-white border-gray-200'}`}>
                  <Search className="w-5 h-5 text-gray-400 ml-3 flex-shrink-0" />
                  <input 
                    type="text" 
                    placeholder="Search e.g. 'PRIMES', 'NSLI-Y', 'Olympiad', 'QuestBridge'..." 
                    className="w-full bg-transparent border-none outline-none py-3 text-sm focus:ring-0 placeholder-gray-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setCurrentTab("explore");
                    }}
                  />
                  <button 
                    onClick={() => setCurrentTab("explore")}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-6 py-3.5 rounded-xl transition-all uppercase tracking-wider"
                  >
                    Search
                  </button>
                </div>
                
                {/* Search tags suggestion row */}
                <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
                  <span className="text-xs text-gray-500">Popular paths:</span>
                  {["MIT PRIMES", "QuestBridge", "USACO", "NSLI-Y"].map((tag, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSearchQuery(tag);
                        setCurrentTab("explore");
                      }}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-all ${darkMode ? 'bg-[#0E1321] border-[#1C2337] text-gray-300 hover:border-indigo-500' : 'bg-gray-100 border-gray-200 text-gray-700 hover:border-indigo-600'}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulated Live Analytics Dashboard Counters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto border-t py-12 px-4 border-gray-800">
                <div className="text-center">
                  <span className="block text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">105+ Curated</span>
                  <span className="text-xs font-medium tracking-wider uppercase text-gray-500">Vetted Programs</span>
                </div>
                <div className="text-center">
                  <span className="block text-3xl sm:text-4xl font-extrabold text-indigo-400">$3.8M+</span>
                  <span className="text-xs font-medium tracking-wider uppercase text-gray-500">Cumulative funding</span>
                </div>
                <div className="text-center">
                  <span className="block text-3xl sm:text-4xl font-extrabold text-purple-400">185+</span>
                  <span className="text-xs font-medium tracking-wider uppercase text-gray-500">Nations Represented</span>
                </div>
                <div className="text-center">
                  <span className="block text-3xl sm:text-4xl font-extrabold text-emerald-400">100% Free</span>
                  <span className="text-xs font-medium tracking-wider uppercase text-gray-500">Cloud synced data</span>
                </div>
              </div>

            </div>
          </section>

          {/* Categories Grid Selector */}
          <section className={`py-16 px-4 ${darkMode ? 'bg-[#06080E]' : 'bg-gray-50'}`}>
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-indigo-400 font-bold font-mono uppercase text-xs tracking-widest">Tailor your trajectory</span>
                <h2 className="text-3xl font-extrabold tracking-tight mt-1">Explore curated programs by category</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: "Scholarships", count: "curated lists", icon: Award, color: "text-amber-400", desc: "Graduate and undergraduate financial assistance." },
                  { title: "Summer Programs", count: "verified programs", icon: Compass, color: "text-indigo-400", desc: "Residential and virtual courses at elite institutes." },
                  { title: "Research Programs", count: "curated labs", icon: BookOpen, color: "text-emerald-400", desc: "Direct laboratory assistance and thesis publication." },
                  { title: "Olympiads", count: "global challenges", icon: Sparkles, color: "text-pink-400", desc: "Subject-based international academic showdowns." },
                  { title: "Competitions", count: "elite contests", icon: TrendingUp, color: "text-purple-400", desc: "Global essay, innovation, and startup challenges." },
                  { title: "Hackathons", count: "live events", icon: Database, color: "text-cyan-400", desc: "Build real products under strict continuous sprints." },
                  { title: "Fellowships", count: "elite cohorts", icon: Users, color: "text-rose-400", desc: "Lifetime cohorts focusing on community benefit." },
                  { title: "Leadership Programs", count: "impact courses", icon: ShieldCheck, color: "text-orange-400", desc: "Civic advocacy, policy-making, and organizational skillsets." },
                ].map((cat, idx) => (
                  <div 
                    key={idx}
                    onClick={() => {
                      setFilterCategory(cat.title);
                      setCurrentTab("explore");
                    }}
                    className={`p-6 rounded-2xl border transition-all cursor-pointer group hover:-translate-y-1 ${darkMode ? 'bg-[#0E131F] border-[#1F2433] hover:border-indigo-500/50 hover:bg-[#111827]' : 'bg-white border-gray-200 hover:border-indigo-600 hover:shadow-lg'}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-opacity-10 ${darkMode ? 'bg-white/5' : 'bg-black/5'}`}>
                        <cat.icon className={`w-6 h-6 ${cat.color}`} />
                      </div>
                      <span className="text-xs font-mono text-gray-500">{cat.count}</span>
                    </div>
                    <h3 className="text-lg font-bold mb-1 group-hover:text-indigo-400 transition-colors">{cat.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{cat.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Premium Spotlight Featured Program & Hot lists */}
          <section className="py-20 px-4 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <span className="text-indigo-400 font-bold font-mono uppercase text-xs tracking-widest">Trending high impact</span>
                <h2 className="text-3xl font-extrabold tracking-tight mt-1">Spotlight opportunities of the week</h2>
              </div>
              <button 
                onClick={() => setCurrentTab("explore")}
                className="mt-4 md:mt-0 inline-flex items-center gap-2 text-indigo-400 font-bold text-sm hover:gap-3 transition-all"
              >
                Browse all {opportunities.length} live postings <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Highlight Featured opportunity (Rise & RSI) */}
              <div className="lg:col-span-2 space-y-6">
                {opportunities.slice(0, 3).map((opp) => (
                  <div 
                    key={opp.id}
                    className={`p-6 rounded-3xl border transition-all relative overflow-hidden group flex flex-col md:flex-row gap-6 ${darkMode ? 'bg-gradient-to-br from-[#0F1321] to-[#0A0E1A] border-[#1E253A] hover:border-indigo-500/40' : 'bg-white border-gray-200 shadow-md hover:shadow-xl'}`}
                  >
                    {/* Visual accent left line */}
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-indigo-500 to-violet-600"></div>

                    {/* Logo representation */}
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-800 flex-shrink-0">
                      <img src={opp.logoUrl} alt={opp.organization} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-grow">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`text-[10px] font-bold font-mono tracking-wider px-2 py-0.5 rounded-md ${darkMode ? 'bg-indigo-950 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>
                          {opp.category}
                        </span>
                        <span className={`text-[10px] font-bold font-mono tracking-wider px-2 py-0.5 rounded-md ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-gray-100 text-gray-600'}`}>
                          {opp.difficulty}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1 ml-auto">
                          <MapPin className="w-3.5 h-3.5" /> {opp.country}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-400 transition-colors">
                        {opp.title}
                      </h3>
                      <p className="text-xs text-gray-400 mb-4 line-clamp-2">
                        {opp.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        {opp.tags && opp.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="text-[10px] px-2.5 py-1 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between border-t border-gray-800/40 pt-4 mt-2">
                        <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" /> Deadline: {opp.deadline}
                        </span>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBookmark(opp.id);
                            }}
                            className={`p-2 rounded-lg border transition-all ${bookmarks.includes(opp.id) ? 'bg-indigo-500 text-white' : 'text-gray-400 hover:text-white border-gray-800'}`}
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedOppId(opp.id);
                              setCurrentTab("opportunity");
                            }}
                            className="text-xs font-bold text-indigo-400 hover:text-indigo-300"
                          >
                            Apply details &rarr;
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sidebar Hot lists / Resources */}
              <div className="space-y-6">
                <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-[#0E131F] border-[#1F2433]' : 'bg-white border-gray-200'}`}>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="text-indigo-400 w-5 h-5" />
                    Student Success Stories
                  </h3>
                  <div className="space-y-4">
                    {[
                      { quote: "OpportunityHub was how I found the QuestBridge program. I matched with full-ride college funding!", name: "Elena R., Stanford '29" },
                      { quote: "The real-time bookmark database kept me fully aligned. Unlocked early screening drafts.", name: "Aarav K., MIT Junior" },
                      { quote: "Seamlessly cataloged three active informatics and physics olympiads into my tracking workspace.", name: "Lucas M., Youth Scholar" }
                    ].map((story, idx) => (
                      <div key={idx} className="pb-3 border-b border-gray-800/60 last:border-0 last:pb-0">
                        <p className="text-xs text-gray-400 italic mb-1">"{story.quote}"</p>
                        <span className="text-[10px] font-bold text-indigo-400">- {story.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`p-6 rounded-3xl border bg-gradient-to-tr from-indigo-900/40 via-transparent to-transparent ${darkMode ? 'border-[#1F2433]' : 'bg-indigo-50/50 border-indigo-100'}`}>
                  <h3 className="text-lg font-bold mb-2 text-white">Need a complete roadmap?</h3>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4">
                    Our platform delivers verified alerts tracking application openings, essays, and advice.
                  </p>
                  <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                    <input 
                      type="email" 
                      placeholder="name@school.com" 
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className={`w-full px-3 py-2 rounded-xl text-xs outline-none focus:ring-1 focus:ring-indigo-500 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-300'}`}
                    />
                    <button 
                      type="submit" 
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" /> Join student network
                    </button>
                  </form>
                </div>
              </div>

            </div>
          </section>

          {/* FAQ Accordion Section */}
          <section className={`py-16 px-4 ${darkMode ? 'bg-[#06080E]' : 'bg-gray-50'}`}>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-indigo-400 font-bold font-mono uppercase text-xs tracking-widest">Help center</span>
                <h2 className="text-3xl font-extrabold tracking-tight mt-1">Frequently Asked Questions</h2>
              </div>

              <div className="space-y-4">
                {[
                  { q: "Is OpportunityHub free forever?", a: "Yes, 100%. We believe that educational opportunities should remain open-access, queryable, and completely free." },
                  { q: "How do you source and verify your postings?", a: "Our team collaborates directly with university research departments, fellowship committees, and corporate sponsors. We also leverage our active user-submitted CMS queue which goes through rigorous verification before publishing." },
                  { q: "Can I host my own scholarship or hackathon on here?", a: "Absolutely. Head to our Admin panel interface or partner tab to fill in standard opportunity templates. If you qualify our terms, your listing gets added to our global feed instantly." },
                  { q: "What does the 'Olympiad' difficulty tag signify?", a: "Olympiad signifies competitions representing the highest level of secondary school academic achievement, such as national math teams, physics bowls, or the IOI." }
                ].map((faq, idx) => (
                  <div key={idx} className={`p-5 rounded-2xl border ${darkMode ? 'bg-[#0E1321] border-[#1C2337]' : 'bg-white border-gray-200'}`}>
                    <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                      <span className="text-indigo-400 font-mono">Q:</span> {faq.q}
                    </h4>
                    <p className="text-xs text-gray-400 leading-relaxed pl-6">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}


      {/* ====================================================================
          TAB 2: INTERACTIVE DISCOVERY & SEARCH EXPLORER
          ==================================================================== */}
      {currentTab === "explore" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Headline */}
          <div className="mb-8">
            <span className="text-indigo-400 font-mono text-xs font-bold uppercase tracking-widest">The Global Archive</span>
            <h1 className="text-3xl font-extrabold tracking-tight">Discover Curated Opportunities</h1>
            <p className="text-xs text-gray-500 mt-1">Refine options among over {opportunities.length} highly prestigious global tournaments, fully-funded camps, and scholarships.</p>
          </div>

          {/* Core Grid: Search, Filters, and Results */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Left Filter Sidebar */}
            <div className={`p-6 rounded-3xl border h-fit space-y-6 ${darkMode ? 'bg-[#0E131F] border-[#1F2433]' : 'bg-white border-gray-200 shadow-sm'}`}>
              
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-indigo-400" /> Advanced Filters
                </span>
                <button 
                  onClick={() => {
                    setFilterCategory("All");
                    setFilterDifficulty("All");
                    setFilterMode("All");
                    setFilterCost("All");
                    setFilterCountry("All");
                    setSearchQuery("");
                    triggerToast("All filters reset");
                  }}
                  className="text-[11px] font-medium text-indigo-400 hover:underline"
                >
                  Reset all
                </button>
              </div>

              {/* Keyword text search */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400">Keyword Search</label>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-gray-50 border-gray-300'}`}>
                  <Search className="w-4 h-4 text-gray-500" />
                  <input 
                    type="text" 
                    placeholder="Search keywords..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-xs outline-none w-full"
                  />
                </div>
              </div>

              {/* Category Dropdown */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400">Category</label>
                <select 
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className={`w-full text-xs px-3 py-2 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-gray-300'}`}
                >
                  {categoriesList.map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty Level */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 block">Difficulty Rank</label>
                <div className="flex flex-wrap gap-1.5">
                  {["All", "Beginner", "Intermediate", "Advanced", "Olympiad"].map((diff, idx) => (
                    <button
                      key={idx}
                      onClick={() => setFilterDifficulty(diff)}
                      className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all ${filterDifficulty === diff ? 'bg-indigo-600 border-indigo-500 text-white' : (darkMode ? 'bg-slate-950 border-slate-800 text-gray-400 hover:border-slate-700' : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200')}`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Venue / Location Mode */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400">Delivery Format</label>
                <select 
                  value={filterMode}
                  onChange={(e) => setFilterMode(e.target.value)}
                  className={`w-full text-xs px-3 py-2 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-gray-300'}`}
                >
                  <option value="All">All Locations</option>
                  <option value="Online">Online / Virtual</option>
                  <option value="In-person">In-person Location</option>
                </select>
              </div>

              {/* Financial Cost Category */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400">Tuition & Entry Cost</label>
                <select 
                  value={filterCost}
                  onChange={(e) => setFilterCost(e.target.value)}
                  className={`w-full text-xs px-3 py-2 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-gray-300'}`}
                >
                  <option value="All">All Pricing</option>
                  <option value="Free">100% Free / Funded</option>
                  <option value="Paid">Requires Fee / Unfunded</option>
                </select>
              </div>

              {/* Geographic Target Eligibility */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400">Eligible Country</label>
                <select 
                  value={filterCountry}
                  onChange={(e) => setFilterCountry(e.target.value)}
                  className={`w-full text-xs px-3 py-2 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-gray-300'}`}
                >
                  <option value="All">All Nations</option>
                  <option value="Global">Global / Universal</option>
                  <option value="United States">United States</option>
                  <option value="Switzerland">Switzerland</option>
                </select>
              </div>

              {/* Quick statistics in sidebar */}
              <div className="pt-4 border-t border-gray-800/60 text-[11px] text-gray-500 space-y-1">
                <div className="flex justify-between">
                  <span>Showing results:</span>
                  <span className="font-bold text-gray-300">{filteredOpportunities.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total database count:</span>
                  <span className="font-bold text-gray-300">{opportunities.length}</span>
                </div>
              </div>

            </div>

            {/* Results feed (Right Columns) */}
            <div className="lg:col-span-3 space-y-4">
              
              {/* Sorting and quick view toggles */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <span className="text-xs font-medium text-gray-500">
                  Found <span className="text-indigo-400 font-bold">{filteredOpportunities.length}</span> opportunities match.
                </span>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Sort:</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={`text-xs px-2 py-1 rounded-lg border bg-transparent ${darkMode ? 'border-gray-800 text-gray-300' : 'border-gray-300 text-gray-700'}`}
                  >
                    <option value="Popularity">Most Viewed</option>
                    <option value="Newest">Newest Listed</option>
                    <option value="Deadline">Urgent Deadlines</option>
                  </select>
                </div>
              </div>

              {/* Search Suggestions fallback if empty results */}
              {filteredOpportunities.length === 0 ? (
                <div className={`p-12 text-center rounded-3xl border ${darkMode ? 'bg-[#0E131F] border-[#1F2433]' : 'bg-white border-gray-200'}`}>
                  <AlertCircle className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">No matching opportunities</h3>
                  <p className="text-xs text-gray-500 max-w-md mx-auto mb-6">
                    Try loosening your constraints or searching for other subjects like "NASA", "Writing", "MIT" or "Fellowship".
                  </p>
                  <button 
                    onClick={() => {
                      setFilterCategory("All");
                      setFilterDifficulty("All");
                      setFilterMode("All");
                      setFilterCost("All");
                      setFilterCountry("All");
                      setSearchQuery("");
                    }}
                    className="bg-indigo-600 text-white font-bold text-xs px-6 py-2.5 rounded-xl"
                  >
                    Clear Filter Dashboard
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOpportunities.map((opp) => (
                    <div 
                      key={opp.id}
                      onClick={() => {
                        setSelectedOppId(opp.id);
                        setCurrentTab("opportunity");
                      }}
                      className={`p-6 rounded-2xl border transition-all cursor-pointer hover:border-indigo-500/40 hover:-translate-y-[1px] relative flex flex-col md:flex-row gap-5 ${darkMode ? 'bg-[#0D111A] border-[#1A2033]' : 'bg-white border-gray-200 shadow-sm'}`}
                    >
                      {/* Logo and metadata info */}
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0">
                        <img src={opp.logoUrl} alt={opp.organization} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-grow">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-indigo-400">{opp.organization}</span>
                          {opp.orgVerified && <CheckCircle className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/10" />}
                          <span className="text-xs text-gray-500 ml-auto flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" /> {opp.country}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold mb-2 hover:text-indigo-400 transition-colors">
                          {opp.title}
                        </h3>

                        <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                          {opp.description}
                        </p>

                        {/* Badges footer block */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-800/40">
                          
                          {/* Left badges */}
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-gray-400">
                              {opp.category}
                            </span>
                            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-gray-400">
                              {opp.difficulty}
                            </span>
                            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-gray-400">
                              {opp.isOnline ? "Online" : "On-site"}
                            </span>
                            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-gray-400">
                              {opp.isFree ? "Fully Funded" : `$${opp.cost}`}
                            </span>
                          </div>

                          {/* Right action metrics */}
                          <div className="flex items-center gap-4 text-xs">
                            <span className="text-rose-400 font-medium flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" /> {opp.deadline}
                            </span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleBookmark(opp.id);
                              }}
                              className={`p-1.5 rounded-lg border transition-all ${bookmarks.includes(opp.id) ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white border-gray-800'}`}
                            >
                              <Bookmark className="w-4.5 h-4.5" />
                            </button>
                          </div>

                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>
      )}


      {/* ====================================================================
          TAB 3: DETAILED OPPORTUNITY INFORMATION PAGE
          ==================================================================== */}
      {currentTab === "opportunity" && activeOpp && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Breadcrumb navigator */}
          <div className="mb-6">
            <button 
              onClick={() => setCurrentTab("explore")}
              className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-indigo-400"
            >
              &larr; Back to global database
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 columns of high-fidelity details */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Main Banner Header */}
              <div className={`p-8 rounded-3xl border relative overflow-hidden ${darkMode ? 'bg-[#0E1321] border-[#1F2433]' : 'bg-white border-gray-200'}`}>
                
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mb-6">
                  <div className="flex gap-4 items-center">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-800 flex-shrink-0">
                      <img src={activeOpp.logoUrl} alt={activeOpp.organization} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{activeOpp.title}</h1>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-sm font-semibold text-indigo-400">{activeOpp.organization}</span>
                        {activeOpp.orgVerified && <CheckCircle className="w-4 h-4 text-indigo-400 fill-indigo-400/10" />}
                      </div>
                    </div>
                  </div>

                  {/* Bookmark & action column */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => toggleBookmark(activeOpp.id)}
                      className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${bookmarks.includes(activeOpp.id) ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white border-gray-800'}`}
                    >
                      <Bookmark className="w-4 h-4" />
                      {bookmarks.includes(activeOpp.id) ? "Saved" : "Save list"}
                    </button>
                    <button 
                      onClick={() => {
                        document.execCommand('copy');
                        triggerToast("Link copied to clipboard!");
                      }}
                      className={`p-2.5 rounded-xl border text-xs text-gray-400 hover:text-white border-gray-800`}
                      title="Copy Share Link"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Grid meta pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-gray-800/60 pt-6">
                  <div>
                    <span className="block text-[10px] text-gray-500 uppercase tracking-widest">Eligibility Group</span>
                    <span className="text-xs font-bold text-gray-200">{activeOpp.country} Qualifier</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-500 uppercase tracking-widest">Deadline Date</span>
                    <span className="text-xs font-bold text-rose-400">{activeOpp.deadline}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-500 uppercase tracking-widest">Financial structure</span>
                    <span className="text-xs font-bold text-emerald-400">{activeOpp.isFree ? "Fully Funded" : "Paid Entry"}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-500 uppercase tracking-widest">Academic Rigor</span>
                    <span className="text-xs font-bold text-purple-400">{activeOpp.difficulty}</span>
                  </div>
                </div>

              </div>

              {/* Rich detail items */}
              <div className={`p-8 rounded-3xl border space-y-6 ${darkMode ? 'bg-[#0E1321] border-[#1F2433]' : 'bg-white border-gray-200'}`}>
                
                <div>
                  <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                    <BookOpen className="text-indigo-400 w-5 h-5" /> About This Opportunity
                  </h3>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {activeOpp.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-800/40">
                  <div>
                    <h4 className="font-bold text-sm mb-2 text-indigo-400">Target Eligibility & Demographics</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{activeOpp.eligibility}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-2 text-indigo-400">Award Benefits & Inclusions</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{activeOpp.benefits}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-800/40">
                  <h3 className="text-sm font-bold mb-2 text-indigo-400">Application Deliverables & Requirements</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {activeOpp.requirements}
                  </p>
                </div>

                {activeOpp.tips && (
                  <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/30 text-xs">
                    <h4 className="font-bold text-indigo-300 mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" /> Professional Submission Tips
                    </h4>
                    <p className="text-gray-400 leading-relaxed">{activeOpp.tips}</p>
                  </div>
                )}

              </div>

              {/* User feedback commentary section */}
              <div className={`p-8 rounded-3xl border space-y-4 ${darkMode ? 'bg-[#0E1321] border-[#1F2433]' : 'bg-white border-gray-200'}`}>
                <h3 className="text-lg font-bold">Community Reviews & QA</h3>
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-indigo-400">Alex_Informatics_26</span>
                      <span className="text-[10px] text-gray-500">2 weeks ago</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Applied last cohort. The peer-evaluation segment takes roughly 3 weeks. Be ready with short videos.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-indigo-400">Stem_Superstar</span>
                      <span className="text-[10px] text-gray-500">Last month</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Excellent support resources and clear structural guidelines. Highly recommend following the timeline checklist.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Sidebar with Quick Access and Related Ops */}
            <div className="space-y-6">
              
              {/* Quick application actions */}
              <div className={`p-6 rounded-3xl border text-center ${darkMode ? 'bg-[#0E1321] border-[#1F2433]' : 'bg-white border-gray-200 shadow-md'}`}>
                <h4 className="font-bold text-sm mb-4">Application Management</h4>
                
                <div className="space-y-3">
                  <a 
                    href={activeOpp.officialLink} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink className="w-4 h-4" /> Go to Official Application
                  </a>

                  <button 
                    onClick={() => createApplicationRecord(activeOpp.id)}
                    className={`w-full font-bold text-xs py-3 rounded-xl transition-all border ${darkMode ? 'border-gray-800 bg-slate-900 hover:bg-slate-855 text-gray-300 hover:text-white' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700'}`}
                  >
                    Add to Application Tracker
                  </button>
                </div>

                <p className="text-[10px] text-gray-500 mt-4 leading-relaxed">
                  OpportunityHub operates as an open database. Make sure to complete and submit materials securely on the primary host's network.
                </p>
              </div>

              {/* Related Opportunities */}
              <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-[#0E1321] border-[#1F2433]' : 'bg-white border-gray-200'}`}>
                <h4 className="font-bold text-sm mb-4">Similar Opportunities</h4>
                <div className="space-y-4">
                  {relatedOpps.map((opp) => (
                    <div 
                      key={opp.id} 
                      onClick={() => setSelectedOppId(opp.id)}
                      className="group cursor-pointer block pb-3 border-b border-gray-800/40 last:border-0 last:pb-0"
                    >
                      <h5 className="text-xs font-bold group-hover:text-indigo-400 transition-colors line-clamp-1">{opp.title}</h5>
                      <span className="text-[10px] text-gray-500">{opp.organization}</span>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[10px] text-indigo-400 font-mono">{opp.category}</span>
                        <span className="text-[10px] text-rose-400">{opp.deadline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}


      {/* ====================================================================
          TAB 4: STUDENT PORTAL (MY DASHBOARD)
          ==================================================================== */}
      {currentTab === "dashboard" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-gray-800/60">
            <div>
              <span className="text-indigo-400 font-mono text-xs font-bold uppercase tracking-widest">Active Cloud profile</span>
              <h1 className="text-3xl font-extrabold tracking-tight">Student Action Station</h1>
              <p className="text-xs text-gray-500 mt-1">Track your program bookmarks, application process checklist, and upcoming dates.</p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <div className="px-4 py-2 bg-indigo-950/30 border border-indigo-900/40 rounded-xl text-center">
                <span className="block text-xl font-bold text-indigo-400">{bookmarks.length}</span>
                <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Bookmarked</span>
              </div>
              <div className="px-4 py-2 bg-purple-950/30 border border-purple-900/40 rounded-xl text-center">
                <span className="block text-xl font-bold text-purple-400">
                  {applications.filter(a => a.status === "SUBMITTED" || a.status === "ACCEPTED").length}
                </span>
                <span className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Completed</span>
              </div>
            </div>
          </div>

          {/* Grid: Kanban application tracker & Calendar */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* Left 2 Columns: Application Tracker & Saved Lists */}
            <div className="xl:col-span-2 space-y-8">
              
              {/* SAVED BOOKMARKS LIST */}
              <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-[#0E131F] border-[#1F2433]' : 'bg-white border-gray-200'}`}>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Bookmark className="text-indigo-400 w-5 h-5" /> Saved & Bookmarked Opportunities
                </h3>

                {bookmarks.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">No bookmarks saved to your account. Browse opportunities to get started.</p>
                ) : (
                  <div className="space-y-3">
                    {opportunities.filter(opp => bookmarks.includes(opp.id)).map(opp => (
                      <div key={opp.id} className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center justify-between">
                        <div>
                          <h4 
                            onClick={() => {
                              setSelectedOppId(opp.id);
                              setCurrentTab("opportunity");
                            }}
                            className="text-xs font-bold hover:text-indigo-400 cursor-pointer transition-colors"
                          >
                            {opp.title}
                          </h4>
                          <span className="text-[10px] text-gray-500">{opp.organization}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => createApplicationRecord(opp.id)}
                            className="bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white font-bold text-[10px] px-3 py-1.5 rounded-lg transition-all"
                          >
                            Track App
                          </button>
                          <button 
                            onClick={() => toggleBookmark(opp.id)}
                            className="text-gray-500 hover:text-rose-400"
                            title="Remove Bookmark"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* LIVE KANBAN TRACKER WORKSPACE */}
              <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-[#0E131F] border-[#1F2433]' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <ListTodo className="text-indigo-400 w-5 h-5" /> Live Cloud Tracker Kanban
                  </h3>
                  <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400 font-mono">Real-time DB</span>
                </div>

                {applications.length === 0 ? (
                  <div className="text-center py-6 text-xs text-gray-500">
                    No active applications in your tracking board. Click "Add to Application Tracker" on any opportunity page.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Column 1: Saved / Researching */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                        <span className="text-xs font-bold text-gray-400">Not Started</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-gray-400">
                          {applications.filter(a => a.status === "SAVED").length}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        {applications.filter(a => a.status === "SAVED").map(app => {
                          const oppObj = opportunities.find(o => o.id === app.opportunityId) || {};
                          return (
                            <div key={app.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                              <h5 className="text-xs font-bold line-clamp-1">{oppObj.title || "Vetted Program"}</h5>
                              <p className="text-[10px] text-gray-500 font-mono">Deadline: {oppObj.deadline}</p>
                              
                              <textarea 
                                value={app.notes || ""} 
                                onChange={(e) => updateApplicationNotes(app.id, e.target.value)}
                                placeholder="Edit short notes..."
                                className="w-full text-[10px] p-1.5 bg-slate-950 border border-slate-800 rounded text-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              />

                              <div className="flex items-center justify-between pt-1 border-t border-slate-800/40">
                                <button 
                                  onClick={() => deleteApplicationRecord(app.id)}
                                  className="text-[10px] text-gray-500 hover:text-rose-400"
                                >
                                  Delete
                                </button>
                                <button 
                                  onClick={() => updateApplicationStatus(app.id, "IN_PROGRESS")}
                                  className="text-[10px] text-indigo-400 hover:underline"
                                >
                                  Start &rarr;
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Column 2: In-Progress Drafts */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                        <span className="text-xs font-bold text-indigo-400">Writing Drafts</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-400">
                          {applications.filter(a => a.status === "IN_PROGRESS").length}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {applications.filter(a => a.status === "IN_PROGRESS").map(app => {
                          const oppObj = opportunities.find(o => o.id === app.opportunityId) || {};
                          return (
                            <div key={app.id} className="p-3.5 rounded-xl bg-[#111625] border border-indigo-900/30 space-y-2">
                              <h5 className="text-xs font-bold line-clamp-1">{oppObj.title || "Vetted Program"}</h5>
                              <p className="text-[10px] text-indigo-400 font-mono">Deadline: {oppObj.deadline}</p>
                              
                              <textarea 
                                value={app.notes || ""} 
                                onChange={(e) => updateApplicationNotes(app.id, e.target.value)}
                                className="w-full text-[10px] p-1.5 bg-slate-950 border border-slate-800 rounded text-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              />

                              <div className="flex items-center justify-between pt-1 border-t border-slate-850">
                                <button 
                                  onClick={() => updateApplicationStatus(app.id, "SAVED")}
                                  className="text-[10px] text-gray-500 hover:underline"
                                >
                                  &larr; Revert
                                </button>
                                <button 
                                  onClick={() => updateApplicationStatus(app.id, "SUBMITTED")}
                                  className="text-[10px] text-emerald-400 hover:underline"
                                >
                                  Submit &rarr;
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Column 3: Submitted & Completed */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                        <span className="text-xs font-bold text-emerald-400">Submitted</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400">
                          {applications.filter(a => a.status === "SUBMITTED").length}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {applications.filter(a => a.status === "SUBMITTED").map(app => {
                          const oppObj = opportunities.find(o => o.id === app.opportunityId) || {};
                          return (
                            <div key={app.id} className="p-3.5 rounded-xl bg-emerald-950/10 border border-emerald-900/30 space-y-2">
                              <h5 className="text-xs font-bold line-clamp-1">{oppObj.title || "Vetted Program"}</h5>
                              <p className="text-[10px] text-emerald-400 font-mono">Verified Submission</p>
                              
                              <p className="text-[10px] italic text-gray-400">
                                {app.notes}
                              </p>

                              <div className="flex items-center justify-between pt-1 border-t border-emerald-950">
                                <button 
                                  onClick={() => updateApplicationStatus(app.id, "IN_PROGRESS")}
                                  className="text-[10px] text-gray-500 hover:underline"
                                >
                                  Edit Draft
                                </button>
                                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                                  <Check className="w-3 h-3" /> Done
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Calendar & Assistance Advice */}
            <div className="space-y-6">
              
              {/* CALENDAR MILESTONES CARD */}
              <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-[#0E131F] border-[#1F2433]' : 'bg-white border-gray-200'}`}>
                <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                  <CalendarDays className="text-indigo-400 w-5 h-5" /> 2026 Admissions Calendar
                </h3>
                
                <div className="space-y-4">
                  <div className="text-xs p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-indigo-400 font-bold block uppercase tracking-wider">August 2026</span>
                    <p className="font-semibold text-gray-200">Geneva Hackathon Deadline</p>
                    <span className="text-[10px] text-rose-400">August 30, 2026</span>
                  </div>
                  <div className="text-xs p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-indigo-400 font-bold block uppercase tracking-wider">September 2026</span>
                    <p className="font-semibold text-gray-200">The Concord Review Publishing</p>
                    <span className="text-[10px] text-rose-400">September 1, 2026</span>
                  </div>
                  <div className="text-xs p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-indigo-400 font-bold block uppercase tracking-wider">October 2026</span>
                    <p className="font-semibold text-gray-200">Rise Fellowship Main Round</p>
                    <span className="text-[10px] text-rose-400">October 15, 2026</span>
                  </div>
                </div>
              </div>

              {/* SYSTEM INTELLIGENCE MENTOR RECOMMENDATIONS */}
              <div className={`p-6 rounded-3xl border bg-gradient-to-br from-indigo-950/40 via-slate-900 to-[#0A0D14] ${darkMode ? 'border-[#1F2433]' : 'bg-white border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  <h4 className="font-bold text-xs uppercase tracking-wider text-white">AI-Optimized Suggestions</h4>
                </div>
                
                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  Based on your saved programs and general academic portfolio, we recommend targeting the <strong>Rise Global Fellowship</strong> before October. 
                  Drafting early video outlines yields high cohort matching ratios.
                </p>

                <button 
                  onClick={() => {
                    setSelectedOppId("opp-1");
                    setCurrentTab("opportunity");
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] py-2.5 rounded-xl transition-all"
                >
                  Analyze Schmidt Futures &rarr;
                </button>
              </div>

            </div>

          </div>
        </div>
      )}


      {/* ====================================================================
          TAB 5: CMS & SYSTEM ADMINISTRATIVE PANEL
          ==================================================================== */}
      {currentTab === "admin" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Admin Header */}
          <div className="mb-8 pb-6 border-b border-gray-800/60">
            <span className="text-indigo-400 font-mono text-xs font-bold uppercase tracking-widest">Global Directory CMS</span>
            <h1 className="text-3xl font-extrabold tracking-tight">Vetted Content Administration</h1>
            <p className="text-xs text-gray-500 mt-1">Manage cloud database opportunities, verify lists, and monitor newsletter subscriptions.</p>
          </div>

          {/* Quick CMS KPI Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-[#0E131F] border-[#1F2433]' : 'bg-white border-gray-200'}`}>
              <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active Listings</span>
              <span className="text-2xl font-extrabold text-white">{opportunities.length}</span>
            </div>
            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-[#0E131F] border-[#1F2433]' : 'bg-white border-gray-200'}`}>
              <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Newsletter Subscribers</span>
              <span className="text-2xl font-extrabold text-indigo-400">{subscribers.length}</span>
            </div>
            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-[#0E131F] border-[#1F2433]' : 'bg-white border-gray-200'}`}>
              <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Aggregate Views</span>
              <span className="text-2xl font-extrabold text-emerald-400">{totalViews}</span>
            </div>
            <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-[#0E131F] border-[#1F2433]' : 'bg-white border-gray-200'}`}>
              <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">System Authenticated</span>
              <span className="text-2xl font-extrabold text-purple-400">{user ? "Active" : "Pending"}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Create / Edit Form Interface (Col span 1) */}
            <div className={`p-6 rounded-3xl border h-fit ${darkMode ? 'bg-[#0E131F] border-[#1F2433]' : 'bg-white border-gray-200'}`}>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-1.5">
                <Plus className="text-indigo-400 w-5 h-5" /> 
                {editingOppId ? "Modify Opportunity Object" : "Deploy New Opportunity Instance"}
              </h3>

              <form onSubmit={handleCreateOpportunity} className="space-y-4">
                
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 mb-1">Opportunity Title*</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Stanford Summer Humanities" 
                    value={newOppTitle}
                    onChange={(e) => setNewOppTitle(e.target.value)}
                    className={`w-full text-xs px-3 py-2 rounded-xl border outline-none focus:ring-1 focus:ring-indigo-500 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-300'}`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 mb-1">Hosting Organization / University*</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Stanford University" 
                    value={newOppOrg}
                    onChange={(e) => setNewOppOrg(e.target.value)}
                    className={`w-full text-xs px-3 py-2 rounded-xl border outline-none focus:ring-1 focus:ring-indigo-500 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-300'}`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 mb-1">Category</label>
                    <select 
                      value={newOppCategory}
                      onChange={(e) => setNewOppCategory(e.target.value)}
                      className={`w-full text-xs px-2 py-2 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-300'}`}
                    >
                      <option value="Scholarships">Scholarships</option>
                      <option value="Summer Programs">Summer Programs</option>
                      <option value="Research Programs">Research Programs</option>
                      <option value="Competitions">Competitions</option>
                      <option value="Olympiads">Olympiads</option>
                      <option value="Hackathons">Hackathons</option>
                      <option value="Fellowships">Fellowships</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 mb-1">Difficulty</label>
                    <select 
                      value={newOppDifficulty}
                      onChange={(e) => setNewOppDifficulty(e.target.value)}
                      className={`w-full text-xs px-2 py-2 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-300'}`}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Olympiad">Olympiad</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 mb-1">Eligible Country</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Global" 
                      value={newOppCountry}
                      onChange={(e) => setNewOppCountry(e.target.value)}
                      className={`w-full text-xs px-3 py-2 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 mb-1">Deadline Date</label>
                    <input 
                      type="date" 
                      value={newOppDeadline}
                      onChange={(e) => setNewOppDeadline(e.target.value)}
                      className={`w-full text-xs px-3 py-2 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-800 text-gray-400' : 'bg-white border-gray-300'}`}
                    />
                  </div>
                </div>

                <div className="flex gap-4 p-2.5 rounded-xl border border-dashed border-gray-800">
                  <label className="flex items-center gap-1.5 text-xs text-gray-400">
                    <input 
                      type="checkbox" 
                      checked={newOppOnline}
                      onChange={(e) => setNewOppOnline(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-800"
                    /> Online Format
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-gray-400">
                    <input 
                      type="checkbox" 
                      checked={newOppFree}
                      onChange={(e) => setNewOppFree(e.target.checked)}
                      className="rounded bg-slate-900 border-slate-800"
                    /> No Tuition Fees
                  </label>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 mb-1">Description Brief*</label>
                  <textarea 
                    rows="3"
                    required
                    placeholder="Short summary detailing goals, duration and historical context..." 
                    value={newOppDesc}
                    onChange={(e) => setNewOppDesc(e.target.value)}
                    className={`w-full text-xs px-3 py-2 rounded-xl border outline-none focus:ring-1 focus:ring-indigo-500 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-300'}`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 mb-1">Deliverables & Requirements</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Transcripts, statement of purpose, essay draft." 
                    value={newOppRequirements}
                    onChange={(e) => setNewOppRequirements(e.target.value)}
                    className={`w-full text-xs px-3 py-2 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-300'}`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 mb-1">Financial Benefits Package</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Full tuition fee waiver, stipend." 
                    value={newOppBenefits}
                    onChange={(e) => setNewOppBenefits(e.target.value)}
                    className={`w-full text-xs px-3 py-2 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-300'}`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 mb-1">Official Resource Link</label>
                  <input 
                    type="text" 
                    placeholder="e.g. https://apply.stanford.edu" 
                    value={newOppLink}
                    onChange={(e) => setNewOppLink(e.target.value)}
                    className={`w-full text-xs px-3 py-2 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-300'}`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 mb-1">Tags (Comma-separated)</label>
                  <input 
                    type="text" 
                    placeholder="STEM, Writing, Fellowship" 
                    value={newOppTags}
                    onChange={(e) => setNewOppTags(e.target.value)}
                    className={`w-full text-xs px-3 py-2 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-300'}`}
                  />
                </div>

                <div className="flex gap-2">
                  <button 
                    type="submit" 
                    className="flex-grow bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 rounded-xl transition-all"
                  >
                    {editingOppId ? "Save Modifications" : "Deploy Program Live"}
                  </button>
                  {editingOppId && (
                    <button 
                      type="button"
                      onClick={() => {
                        setEditingOppId(null);
                        setNewOppTitle("");
                        setNewOppOrg("");
                        setNewOppDesc("");
                        triggerToast("Creation state restored");
                      }}
                      className="bg-slate-800 text-slate-300 px-3 py-2.5 rounded-xl text-xs"
                    >
                      Cancel
                    </button>
                  )}
                </div>

              </form>
            </div>

            {/* List and Modify active database records (Col span 2) */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-[#0E131F] border-[#1F2433]' : 'bg-white border-gray-200'}`}>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-1.5">
                  <Database className="text-indigo-400 w-5 h-5" /> Live Opportunity Rows ({opportunities.length})
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-800 text-gray-500 font-mono">
                        <th className="pb-3 font-semibold">Title</th>
                        <th className="pb-3 font-semibold">Category</th>
                        <th className="pb-3 font-semibold">Eligibility</th>
                        <th className="pb-3 font-semibold">Views</th>
                        <th className="pb-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/50">
                      {opportunities.map((opp) => (
                        <tr key={opp.id} className="hover:bg-slate-900/30">
                          <td className="py-3 font-medium">
                            <span className="block font-bold text-gray-200">{opp.title}</span>
                            <span className="text-[10px] text-indigo-400">{opp.organization}</span>
                          </td>
                          <td className="py-3 text-gray-400">{opp.category}</td>
                          <td className="py-3 text-gray-400">{opp.country}</td>
                          <td className="py-3 text-gray-400">{opp.views || 0}</td>
                          <td className="py-3 text-right">
                            <div className="flex justify-end gap-1.5">
                              <button 
                                onClick={() => loadOpportunityForEdit(opp)}
                                className="p-1.5 rounded hover:bg-slate-800 text-gray-400 hover:text-white"
                                title="Edit"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => deleteOpportunity(opp.id)}
                                className="p-1.5 rounded hover:bg-slate-800 text-gray-400 hover:text-rose-400"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Newsletter management module */}
              <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-[#0E131F] border-[#1F2433]' : 'bg-white border-gray-200'}`}>
                <h3 className="text-lg font-bold mb-2 flex items-center gap-1.5">
                  <Mail className="text-indigo-400 w-5 h-5" /> Broadcast Service ({subscribers.length} recipients)
                </h3>
                <p className="text-[11px] text-gray-500 mb-4">
                  Deploy immediate updates advising registered student cohorts of early priority deadline cycles.
                </p>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-indigo-400 font-mono uppercase">Target Cohort</span>
                    <p className="text-xs text-gray-300 font-bold">Standard High School Segment (All Active Subscribers)</p>
                  </div>

                  <button 
                    onClick={() => triggerToast(`Successfully sent updates to ${subscribers.length} registered students!`)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all"
                  >
                    Broadcast Current Database Feed &rarr;
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}


      {/* PLATFORM FOOTER */}
      <footer className={`border-t py-12 px-4 transition-colors ${darkMode ? 'border-[#1F2433] bg-[#07090F]' : 'border-gray-200 bg-white'}`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              <span className="text-lg font-bold">OpportunityHub</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
              An open-access library curated for youth globally seeking to optimize their university applications and gain life-changing project grants.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-4">Discovery Engine</h4>
            <ul className="space-y-2 text-xs text-gray-500">
              <li className="hover:text-white cursor-pointer" onClick={() => { setFilterCategory("Scholarships"); setCurrentTab("explore"); }}>Scholarships</li>
              <li className="hover:text-white cursor-pointer" onClick={() => { setFilterCategory("Summer Programs"); setCurrentTab("explore"); }}>Summer Labs</li>
              <li className="hover:text-white cursor-pointer" onClick={() => { setFilterCategory("Research Programs"); setCurrentTab("explore"); }}>Research Mentors</li>
              <li className="hover:text-white cursor-pointer" onClick={() => { setFilterCategory("Hackathons"); setCurrentTab("explore"); }}>Hackathons</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-4">Startup Legal</h4>
            <ul className="space-y-2 text-xs text-gray-500">
              <li className="hover:text-white cursor-pointer">Terms of Service</li>
              <li className="hover:text-white cursor-pointer">Privacy Protocol</li>
              <li className="hover:text-white cursor-pointer">Data Sourcing & QA</li>
              <li className="hover:text-white cursor-pointer">Contact Support</li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-gray-800/40 mt-12 pt-6 text-center text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>&copy; {new Date().getFullYear()} OpportunityHub, Inc. All rights reserved globally.</span>
          <span className="font-mono text-[10px]">A Silicon Valley Concept Platform</span>
        </div>
      </footer>

    </div>
  );
}