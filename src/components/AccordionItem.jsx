import React from 'react';

export default function AccordionItem({ question, answer, isOpen, onClick }) {
  return (
    <div 
      className={`border transition-all duration-300 ease-out rounded-2xl mb-4 bg-white overflow-hidden ${
        isOpen 
          ? 'border-[#077d8a]/40 shadow-md ring-4 ring-[#077d8a]/10' 
          : 'border-slate-200/80 shadow-sm hover:shadow-md hover:border-[#077d8a]/30'
      }`}
    >
      <button
        className="w-full text-justify p-5 md:p-6 flex justify-between items-start md:items-center bg-transparent focus:outline-none group"
        onClick={onClick}
      >
        <span className={`font-bold text-base md:text-lg pr-6 leading-snug transition-colors duration-200 ${
          isOpen ? 'text-[#077d8a]' : 'text-slate-800 group-hover:text-[#077d8a]/80'
        }`}>
          {question}
        </span>
        <span className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 mt-0.5 md:mt-0 ${
          isOpen ? 'bg-[#077d8a]/10 text-[#077d8a] rotate-180' : 'bg-slate-50 text-slate-400 group-hover:bg-[#077d8a]/10 group-hover:text-[#077d8a]'
        }`}>
          ▼
        </span>
      </button>
      
      {/* Smooth Grid-based Accordion Animation */}
      <div 
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-5 md:p-6 pt-0 bg-white">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-5"></div>
            <div className="prose prose-slate max-w-none">
              {answer.map((paragraph, index) => (
                <p 
                  key={index} 
                  className="mb-4 text-slate-600 text-[15px] md:text-base leading-relaxed text-justify hyphens-auto"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}