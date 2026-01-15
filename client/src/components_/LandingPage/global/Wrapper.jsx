import React from 'react';
import { cn } from '@/lib/utils';



const Wrapper = ({ className, children }) => {
    return (
        <section className={cn(
            "h-full mx-auto w-full lg:max-w-screen-xl px-4 lg:px-20",
            className,
        )}>
            {children}
        </section>
    )
};

export default Wrapper