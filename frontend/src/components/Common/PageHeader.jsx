import React from 'react';

const PageHeader = ({ title, description, actions }) => {
    return (
        <header className="mb-10 rounded-3xl p-8 bg-slate-900 text-white shadow-xl overflow-hidden relative group">
            {/* Animated accent background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-blue-600/20 transition-all duration-700"></div>
            
            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="max-w-3xl">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-[10px] font-bold border border-white/20">SH</div>
                        <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Operations Center</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight mb-3 italic">{title}</h1>
                    <p className="text-slate-400 text-lg leading-relaxed font-medium">
                        {description}
                    </p>
                </div>
                {actions && (
                    <div className="flex-shrink-0">
                        {actions}
                    </div>
                )}
            </div>
        </header>
    );
};

export default PageHeader;
