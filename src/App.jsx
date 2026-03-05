import React, { useState, useEffect, useRef } from 'react';
import { studyData } from './data/index';
import AccordionItem from './components/AccordionItem';

const examSchedule = {
  "Technical Writing": "2026-03-17T00:00:00",
  "Analysis of Algorithm": "2026-03-18T00:00:00",
  "BMIS": "2026-03-19T00:00:00",
  "ERP System": "2026-03-20T00:00:00",
  "Advanced DBMS": "2026-03-23T00:00:00",
  "SQM": "2026-03-24T00:00:00"
};

export default function StudyHub() {
  const subjects = Object.keys(studyData).sort((a, b) => {
    const dateA = new Date(examSchedule[a] || "2099-01-01").getTime();
    const dateB = new Date(examSchedule[b] || "2099-01-01").getTime();
    return dateA - dateB;
  });

  const [activeSubject, setActiveSubject] = useState(subjects[0]);
  const subjectData = studyData[activeSubject];
  const isDocument = subjectData?.type === "document";
  
  const tabs = isDocument ? [] : Object.keys(subjectData || {});
  const [activeTab, setActiveTab] = useState(tabs[0] || "");
  const [openQuestionIndex, setOpenQuestionIndex] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [now, setNow] = useState(new Date());
  const popAudio = useRef(typeof Audio !== "undefined" ? new Audio('/pop.mp3') : null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isDocument) {
      const newTabs = Object.keys(studyData[activeSubject] || {});
      setActiveTab(newTabs.length > 0 ? newTabs[0] : "");
    }
    setOpenQuestionIndex(null);
    setIsMobileMenuOpen(false); 
  }, [activeSubject, isDocument]);

  const handleToggleQuestion = (index) => {
    setOpenQuestionIndex(openQuestionIndex === index ? null : index);
  };

  const playSound = () => {
    if (popAudio.current) {
      popAudio.current.currentTime = 0;
      popAudio.current.play().catch(e => console.log("Audio play failed", e));
    }
  };

  const getCountdown = (subject) => {
    const dateString = examSchedule[subject];
    if (!dateString) return "?";

    const diffTime = new Date(dateString) - now;
    if (diffTime <= 0) return "EXAM DAY!";

    const totalHours = Math.floor(diffTime / (1000 * 60 * 60));
    const m = Math.floor((diffTime / 1000 / 60) % 60);
    const s = Math.floor((diffTime / 1000) % 60);

    return `${totalHours.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  };

  const currentQAs = isDocument ? [] : (subjectData?.[activeTab] || []);

  return (
    <div className="h-screen bg-slate-50 text-slate-900 font-sans flex flex-col overflow-hidden">
      
      {/* CSS to physically destroy the scrollbar across all browsers */}
      <style>{`
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Premium Gradient Header using your Teal theme */}
      <header className="bg-gradient-to-r from-[#045c66] via-[#077d8a] to-[#0996a6] text-white shadow-lg z-40 shrink-0 border-b border-[#045c66]/30">
        <div className="px-4 md:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center justify-between shrink-0">
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter flex items-center gap-2 drop-shadow-sm">
              E.X.A.M
            </h1>
            
            <button 
              className="md:hidden p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
          
          <nav className="hide-scroll flex gap-3 overflow-x-auto pb-2 md:pb-0 snap-x w-full md:justify-end">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => setActiveSubject(subject)}
                className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 whitespace-nowrap snap-start shrink-0 ${
                  activeSubject === subject 
                    ? 'bg-white text-[#077d8a] shadow-md scale-105 transform' 
                    : 'bg-[#045c66]/50 text-[#c7f0f4] hover:bg-[#045c66]/80 hover:text-white'
                }`}
              >
                {subject}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Blurred Mobile Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="absolute inset-0 bg-slate-900/30 z-20 md:hidden backdrop-blur-md transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Floating Sidebar */}
        <aside className={`absolute md:relative w-[85%] md:w-72 h-full bg-white/90 backdrop-blur-xl border-r border-slate-200/60 flex flex-col shadow-2xl md:shadow-none z-30 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shrink-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}>
          <div className="p-6 h-full flex flex-col overflow-y-auto hide-scroll">
            <div className="mb-6 flex justify-between items-center shrink-0">
              <h2 className="text-xs font-black uppercase tracking-widest text-[#077d8a]/60">
                Topics • {activeSubject}
              </h2>
            </div>
            
            {isDocument ? (
               <div className="bg-gradient-to-br from-[#077d8a]/5 to-[#077d8a]/10 border border-[#077d8a]/20 rounded-2xl p-6 text-center mt-4 shadow-sm">
                 <div className="text-4xl mb-3 drop-shadow-sm">📊</div>
                 <p className="text-[#055c66] font-bold mb-2">Visual Mode</p>
                 <p className="text-[#077d8a] text-sm leading-relaxed">Flashcards disabled. Review the embedded PDF guide.</p>
               </div>
            ) : (
              <nav className="flex flex-col gap-2.5">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setOpenQuestionIndex(null);
                      setIsMobileMenuOpen(false); 
                    }}
                    className={`text-left px-4 py-3.5 rounded-xl font-semibold transition-all duration-200 ${
                      activeTab === tab 
                        ? 'bg-[#077d8a]/10 text-[#077d8a] shadow-sm ring-1 ring-[#077d8a]/30 translate-x-1' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 hover:translate-x-1'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto w-full bg-slate-50/50 relative hide-scroll">
          
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#077d8a 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

          <div className={`mx-auto p-4 md:p-10 lg:p-12 relative z-10 ${isDocument ? 'max-w-6xl' : 'max-w-4xl'}`}>
            
            <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shrink-0 border-b border-slate-200/60 pb-8">
              <div className="flex-1">
                <h2 className="text-3xl md:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight">
                  {isDocument ? "Visual Study Guide" : (activeTab || "Select a Topic")}
                </h2>
                <p className="text-slate-500 mt-3 text-base md:text-lg font-medium">
                  {isDocument ? subjectData.message : "Click to reveal the notes. Try to answer in your head first!"}
                </p>
              </div>
              
              <div 
                onClick={playSound}
                className="bg-white/80 backdrop-blur-sm border-2 border-rose-100 text-rose-600 px-7 py-4 rounded-3xl flex flex-col items-center justify-center shadow-lg shadow-rose-100/50 w-full md:w-auto md:min-w-[15rem] cursor-pointer hover:bg-rose-50 hover:border-rose-200 hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all duration-300 select-none group"
              >
                <span className="text-xs font-bold uppercase tracking-widest text-rose-400 mb-1 font-sans group-hover:text-rose-500 transition-colors">
                  Time to Exam
                </span>
                <span className="text-3xl md:text-4xl font-black leading-none tracking-tighter font-mono drop-shadow-sm">
                  {getCountdown(activeSubject)}
                </span>
              </div>
            </header>
            
            {isDocument ? (
              <div className="w-full bg-slate-200 rounded-3xl shadow-md border border-slate-300 overflow-hidden flex flex-col h-[calc(100vh-16rem)] min-h-[500px]">
                <object 
                  data={subjectData.file} 
                  type="application/pdf" 
                  className="w-full h-full flex-1"
                >
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-white">
                    <div className="text-6xl mb-6">📄</div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">PDF Viewer Blocked</h3>
                    <p className="text-slate-500 mb-8 max-w-md text-base">
                      Your browser doesn't support embedded PDFs, or the file couldn't be found.
                    </p>
                    <a 
                      href={subjectData.file} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="px-8 py-4 bg-[#077d8a] text-white rounded-2xl font-bold hover:bg-[#055c66] transition-all shadow-md hover:shadow-xl hover:-translate-y-1 active:translate-y-0"
                    >
                      Open PDF in New Tab
                    </a>
                  </div>
                </object>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {currentQAs.map((qa, index) => (
                  <AccordionItem
                    key={index}
                    question={qa.question}
                    answer={qa.answer}
                    isOpen={openQuestionIndex === index}
                    onClick={() => handleToggleQuestion(index)}
                  />
                ))}
              </div>
            )}

          </div>
        </main>

      </div>
    </div>
  );
}