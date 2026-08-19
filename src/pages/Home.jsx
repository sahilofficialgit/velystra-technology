// src/pages/Home.jsx
import { 
  ArrowRight, Code, Terminal, BookOpen, Users, Trophy, Briefcase, 
  Lightbulb, Monitor, Database, Layers, Clock, CheckCircle2, ShieldCheck, Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SITE_CONFIG } from '../config/constants';

// Data for Section 2: What We Offer
const offerings = [
  { title: 'Internship Programs', description: 'Gain real-world experience building production-ready applications.', icon: <Briefcase className="text-blue-600" size={24} /> },
  { title: 'Hands-on Projects', description: 'Learn by doing with practical projects that solve actual problems.', icon: <Terminal className="text-blue-600" size={24} /> },
  { title: 'Technical Training', description: 'Structured learning paths designed by experienced developers.', icon: <BookOpen className="text-blue-600" size={24} /> },
  { title: 'Coding Challenges', description: 'Test your skills and compete with peers in regular coding events.', icon: <Trophy className="text-blue-600" size={24} /> },
  { title: 'Developer Community', description: 'Connect, collaborate, and grow with a network of tech enthusiasts.', icon: <Users className="text-blue-600" size={24} /> },
  { title: 'Practical Skill Development', description: 'Focus on modern tech stacks and industry-standard best practices.', icon: <Lightbulb className="text-blue-600" size={24} /> },
];

// Data for Section 3: Internship Programs
const featuredInternships = [
  {
    title: 'Frontend Development',
    icon: <Monitor size={28} className="text-blue-600 mb-4" />,
    description: 'Master React.js, modern CSS, and responsive web design by building dynamic user interfaces.',
    skills: ['React.js', 'Tailwind CSS', 'JavaScript'],
    duration: '4-8 Weeks'
  },
  {
    title: 'Backend Development',
    icon: <Database size={28} className="text-blue-600 mb-4" />,
    description: 'Build robust APIs, manage databases, and learn server-side logic using Node.js and Express.',
    skills: ['Node.js', 'Express', 'MongoDB'],
    duration: '4-8 Weeks'
  },
  {
    title: 'Full Stack Development',
    icon: <Layers size={28} className="text-blue-600 mb-4" />,
    description: 'Combine frontend and backend skills to develop complete, end-to-end web applications.',
    skills: ['MERN Stack', 'API Integration', 'Deployment'],
    duration: '8-12 Weeks'
  }
];

// Data for Section 4: Why Velystra?
const benefits = [
  "Practical Learning Approach",
  "Project-Based Experience",
  "Structured Evaluation",
  "Active Developer Community",
  "Technical Challenges",
  "Career-Focused Skills"
];

// Data for Section 5: How It Works
const steps = [
  { step: '01', title: 'Apply', desc: 'Choose your program and submit your application.' },
  { step: '02', title: 'Learn', desc: 'Access resources and understand the tech stack.' },
  { step: '03', title: 'Build', desc: 'Work on hands-on, real-world projects.' },
  { step: '04', title: 'Get Evaluated', desc: 'Submit your work for review and feedback.' },
  { step: '05', title: 'Complete', desc: 'Earn your verified certificate and showcase your skills.' }
];

const Home = () => {
  return (
    <div className="w-full">
      {/* ==============================================
          HERO SECTION
          ============================================== */}
      <section className="relative bg-slate-900 text-white overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-600 rounded-full blur-[120px] opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium mb-6">
            <Code size={16} />
            <span>Developer Learning Community</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Learn. Compete. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">Succeed.</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-300 mb-10 leading-relaxed">
            Build practical technology skills through internships, real-world projects, technical challenges and developer-focused learning.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href={SITE_CONFIG.applyFormUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors flex items-center justify-center gap-2"
            >
              Apply for Internship
              <ArrowRight size={18} />
            </a>
            <Link 
              to="/internships" 
              className="w-full sm:w-auto px-8 py-3.5 rounded-md bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold transition-colors flex items-center justify-center"
            >
              Explore Programs
            </Link>
          </div>
        </div>
      </section>

      {/* ==============================================
          SECTION 1: WHAT IS VELYSTRA?
          ============================================== */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">What is Velystra Technology?</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto mb-8 rounded-full"></div>
          <p className="text-lg text-slate-600 leading-relaxed">
            Velystra Technology is a technology-focused learning and developer community dedicated to helping students and aspiring developers bridge the gap between academic learning and industry requirements. We provide a structured environment to build practical skills through hands-on projects, technical training, and coding competitions.
          </p>
        </div>
      </section>

      {/* ==============================================
          SECTION 2: WHAT WE OFFER
          ============================================== */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">What We Offer</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Comprehensive programs and resources designed to accelerate your technical growth and career readiness.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {offerings.map((item, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==============================================
          SECTION 3: INTERNSHIP PROGRAMS
          ============================================== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Featured Internships</h2>
              <p className="text-slate-600 max-w-2xl">Practical, project-based internship programs designed to build your portfolio.</p>
            </div>
            <Link to="/internships" className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2 group">
              View All Programs
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredInternships.map((program, index) => (
              <div key={index} className="flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-blue-200 transition-colors">
                <div className="p-8 flex-grow">
                  {program.icon}
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{program.title}</h3>
                  <p className="text-slate-600 mb-6 text-sm">{program.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {program.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                    <Clock size={16} />
                    {program.duration}
                  </div>
                  <Link to="/internships" className="text-blue-600 font-medium text-sm hover:text-blue-700">
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==============================================
          SECTION 4: WHY VELYSTRA?
          ============================================== */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Choose Velystra?</h2>
              <p className="text-slate-300 mb-8 text-lg">We focus on what actually matters in the tech industry: building things that work. Our approach skips the fluff and gets straight to practical development.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="text-blue-400 shrink-0" size={20} />
                    <span className="text-slate-200">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
              <Code size={48} className="text-blue-500 mb-6" />
              <h3 className="text-2xl font-bold mb-4">No Fake Promises</h3>
              <p className="text-slate-400">
                We are a developer community, not a college. We do not offer guaranteed placements, fake affiliations, or misleading certifications. We offer one thing: <strong className="text-white">a platform to build real skills.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================================
          SECTION 5: HOW IT WORKS
          ============================================== */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Your journey from application to project completion.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 justify-between relative">
            {/* Connecting Line for Desktop */}
            <div className="hidden md:block absolute top-6 left-10 right-10 h-0.5 bg-slate-200 z-0"></div>
            
            {steps.map((item, index) => (
              <div key={index} className="relative z-10 flex-1 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-6 shadow-md border-4 border-slate-50">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==============================================
          SECTION 6 & 7: CHALLENGES & VERIFICATION
          ============================================== */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Challenges Card */}
            <div className="bg-slate-50 p-8 rounded-xl border border-slate-100 flex flex-col items-start">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Trophy className="text-blue-600" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Coding Challenges</h3>
              <p className="text-slate-600 mb-8 flex-grow">Participate in our upcoming coding competitions to test your logic, improve problem-solving, and compete with other developers.</p>
              <Link to="/challenges" className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2">
                Explore Challenges <ArrowRight size={18} />
              </Link>
            </div>

            {/* Verification Card */}
            <div className="bg-slate-50 p-8 rounded-xl border border-slate-100 flex flex-col items-start">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <ShieldCheck className="text-blue-600" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Certificate Verification</h3>
              <p className="text-slate-600 mb-8 flex-grow">Employers and recruiters can easily verify the authenticity of any Velystra Technology internship certificate using its unique ID.</p>
              <Link to="/verify" className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2">
                Verify Certificate <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==============================================
          SECTION 8: FINAL CTA
          ============================================== */}
      <section className="py-20 bg-blue-600 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Award size={48} className="mx-auto mb-6 text-blue-200" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to build your next skill?</h2>
          <p className="text-blue-100 text-lg mb-10">Join our community today and start working on real-world projects that matter.</p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href={SITE_CONFIG.applyFormUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-3.5 rounded-md bg-white text-blue-700 hover:bg-slate-50 font-semibold transition-colors"
            >
              Apply for Internship
            </a>
            <a 
              href="#" // You can replace this with Telegram link later
              className="px-8 py-3.5 rounded-md bg-blue-700 hover:bg-blue-800 border border-blue-500 text-white font-semibold transition-colors"
            >
              Join Our Community
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;