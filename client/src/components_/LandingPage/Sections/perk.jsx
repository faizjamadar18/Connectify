import { PERKS } from '../constants/perk';
import { cn } from '@/lib/utils';

import { Chat } from "@mui/icons-material";
import { VideoCall } from "@mui/icons-material";
import { OnlinePrediction } from "@mui/icons-material";
import { Hd } from "@mui/icons-material";

import AnimationContainer from '../global/AnimateContainer';
import Wrapper from '../global/Wrapper';
import SectionBadge from '@/components/ui/section-badge';
import React from 'react';

const Perks = () => {
    return (
        <Wrapper className="py-20 lg:py-32 relative">
            <div className="flex flex-col items-center text-center gap-4">
                <AnimationContainer animation="fadeUp" delay={0.2}>
                    <SectionBadge title="Perks" />
                </AnimationContainer>

                <AnimationContainer animation="fadeUp" delay={0.3}>
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-medium !leading-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-400">
                        Use our platform
                        <br />
                        with powerful tools
                    </h2>
                </AnimationContainer>

                <AnimationContainer animation="fadeUp" delay={0.4}>
                    <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
                        Seamlessly integrated tools for effortless communication management.
                    </p>
                </AnimationContainer>
            </div>

            <div className="relative pt-10">
                <div className="grid grid-cols-2 relative z-20">
                    {PERKS.map((perk, index) => (
                        <div
                            key={index}
                            className={cn(
                                "flex items-center p-8 md:p-16",
                                index % 2 === 0 ? "justify-end border-r border-neutral-800" : "justify-start",
                                index === 2 && "border-t border-neutral-800",
                                index === 3 && "border-t border-neutral-800",
                            )}
                        >
                            <AnimationContainer
                                animation={index % 2 === 0 ? "fadeRight" : "fadeLeft"}
                                delay={0.2 * (index + 1)}
                            >
                                <div className="flex flex-col items-center text-center gap-4">
                                    <div className="size-12 lg:size-16 rounded-lg lg:rounded-2xl bg-neutral-900 flex items-center justify-center">
                                        {React.createElement(perk.icon, {
                                            style: { fontSize: "2rem", color: "#F55916"},
                                        })}


                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-lg md:text-xl font-medium">
                                            {perk.title}
                                        </h3>
                                        <p className="text-xs md:text-sm text-muted-foreground max-w-[250px]">
                                            {perk.description}
                                        </p>
                                    </div>
                                </div>
                            </AnimationContainer>
                        </div>
                    ))}
                </div>
            </div>
        </Wrapper>
    );
};

export default Perks; 