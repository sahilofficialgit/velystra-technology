// src/pages/Internships.jsx
import { Monitor, Database, Layers, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import { SITE_CONFIG } from '../config/constants';

const internshipPrograms = [
  {
    id: 'frontend',
    title: 'Frontend Development Internship',
    icon: <Monitor className="text-blue-600" size={32} />,
    overview: 'Learn to build responsive, interactive user interfaces using modern web technologies. Perfect for beginners and intermediate developers.',
    duration: '4-8 Weeks',
    skills: ['HTML/CSS', 'JavaScript', 'React.js', 'Tailwind CSS', 'Responsive Design'],
    projects: 'E-commerce UI, Portfolio Website, Dashboard Interface',
  },
  {
    id: 'backend',
    title: 'Backend Development Internship',
    icon: <Database className="text-blue-600" size={32} />,
    overview: 'Understand server-side logic, database management, and API development. Build the engine that powers web applications.',
    duration: '4-8 Weeks',
    skills: ['Node.js', 'Express.js', 'MongoDB', 'RESTful APIs', 'Authentication'],
    projects: 'User Authentication System, REST API for E-commerce, Task Management API',
  },
  {
    id: 'fullstack',
    title: 'Full Stack Development Internship',
    icon: <Layers className="text-blue-600" size={32} />,
    overview: 'Master both client-side and server-side development. Become a complete web developer capable of building end-to-end applications.',
    duration: '8-12 Weeks',
    skills: ['MERN Stack', 'API Integration', 'State Management', 'Database Design', 'Deployment'],
    projects: 'Full-stack E-commerce Platform, Social Media Clone',
  }
];

const Internships = () => {
  return (
    <div className="w-full bg-slate-50 min-h-screen pb-20">
      
      {/* HEADER SECTION */}
      <div className="bg-slate-900 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">Velystra Internship Programs</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Practical, project-based learning experiences designed to help you build a strong portfolio and real-world developer skills.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        
        {/* TRANSPARENCY / PRICING BANNER */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 md:p-8 mb-12 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            
            {/* Free Offerings */}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Info className="text-blue-600" size={24} />
                100% Free Training & Evaluation
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="text-green-500 shrink-0" size={18} /> <span>Registration: Free</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="text-green-500 shrink-0" size={18} /> <span>Training: Free</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="text-green-500 shrink-0" size={18} /> <span>Projects: Free</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <CheckCircle2 className="text-green-500 shrink-0" size={18} /> <span>Evaluation: Free</span>
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-4">
                The internship itself does not require any registration or training fee. You can complete the program and gain skills at absolutely zero cost.
              </p>
            </div>

            {/* Optional Certificate Pricing */}
            <div className="flex-1 bg-slate-50 p-6 rounded-lg border border-slate-100 w-full">
              <h3 className="font-bold text-slate-900 mb-3">Optional Certificate Processing</h3>
              <p className="text-sm text-slate-600 mb-4">
                If you wish to receive a verifiable certificate after successful completion, nominal processing fees apply:
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-white p-3 rounded border border-slate-200 shadow-sm">
                  <span className="text-sm font-medium text-slate-700">Digital Certificate</span>
                  <span className="font-bold text-slate-900">₹150</span>
                </div>
                <div className="flex justify-between items-center bg-white p-3 rounded border border-slate-200 shadow-sm">
                  <span className="text-sm font-medium text-slate-700">Printed + Courier Certificate</span>
                  <span className="font-bold text-slate-900">₹299</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* PROGRAMS LIST */}
        <div className="space-y-8">
          {internshipPrograms.map((program) => (
            <div key={program.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row">
              
              {/* Left Content */}
              <div className="p-6 md:p-8 flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    {program.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{program.title}</h2>
                    <span className="inline-block mt-1 px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                      Duration: {program.duration}
                    </span>
                  </div>
                </div>
                
                <p className="text-slate-600 mb-6">{program.overview}</p>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-slate-900 mb-2 text-sm uppercase tracking-wider">Skills Covered</h4>
                  <div className="flex flex-wrap gap-2">
                    {program.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-md">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 mb-2 text-sm uppercase tracking-wider">Project-Based Learning</h4>
                  <p className="text-slate-600 text-sm bg-slate-50 p-3 rounded-md border border-slate-100">
                    {program.projects}
                  </p>
                </div>
              </div>

              {/* Right CTA Area */}
              <div className="bg-slate-50 md:w-72 p-6 md:p-8 flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-200">
                <h4 className="font-bold text-slate-900 mb-2">Ready to start?</h4>
                <p className="text-sm text-slate-500 mb-6">Apply now to secure your spot in the upcoming batch.</p>
                <a 
                  href={SITE_CONFIG.applyFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium transition-colors"
                >
                  Apply Now <ArrowRight size={18} />
                </a>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Internships;