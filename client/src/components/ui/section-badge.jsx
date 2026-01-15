import React from 'react';


const SectionBadge = ({ title }) => {
    return (
        <div className="px-2.5 py-1 rounded-full bg-neutral-800 flex items-center justify-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-600/40 flex items-center justify-center relative">
                <div className="w-2 h-2 rounded-full bg-orange-600/60 flex items-center justify-center animate-ping">
                    <div className="w-2 h-2 rounded-full bg-orange-600/60 flex items-center justify-center animate-ping"></div>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-orange-600 flex items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                </div>
            </div>
            <span className="text-xs font-medium text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-300">
                {title}
            </span>
        </div>
    )
};

export default SectionBadge