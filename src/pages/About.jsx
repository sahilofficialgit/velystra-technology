// src/pages/About.jsx
import { Target, Lightbulb, Users, Code } from 'lucide-react';

const About = () => {
  return (
    <div className="w-full bg-slate-50 min-h-screen pb-20">
      {/* HEADER */}
      <div className="bg-slate-900 text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">About Velystra Technology</h1>
          <p className="text-lg text-slate-300">
            A technology-focused developer community dedicated to building practical skills through hands-on learning and real-world projects.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-20">
        
        {/* WHO WE ARE & MISSION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-2 text-blue-600 mb-4 font-semibold tracking-wide uppercase text-sm">
              <Target size={18} /> Our Mission
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Bridging the Gap Between Learning and Doing</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              Velystra Technology was created with a simple, realistic goal: to help students and aspiring developers transition from theoretical knowledge to practical execution. 
            </p>
            <p className="text-slate-600 text-lg leading-relaxed">
              We are not a university, and we do not make false promises of guaranteed placements. Instead, we provide a structured environment where you can write code, build projects, make mistakes, and learn exactly what modern tech companies expect from junior developers.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Our Core Focus</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Code className="text-blue-600 shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="font-semibold text-slate-800">Modern Tech Stack</h4>
                  <p className="text-slate-600 text-sm">Focusing on React, Node.js, and Full Stack development.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Lightbulb className="text-blue-600 shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="font-semibold text-slate-800">Project-Based Learning</h4>
                  <p className="text-slate-600 text-sm">Learning by building things that actually work.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Users className="text-blue-600 shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="font-semibold text-slate-800">Community Growth</h4>
                  <p className="text-slate-600 text-sm">Growing alongside peers through coding challenges and feedback.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;