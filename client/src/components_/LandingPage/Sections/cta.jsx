import { ArrowRightIcon } from "lucide-react";

import { Link } from "react-router-dom";
import AnimationContainer from "../global/AnimateContainer";
import Wrapper from "../global/Wrapper";
import { Button } from "@/components/ui/button";
// import { FlickeringGrid } from "./ui/flickering-grid";
import SectionBadge from "@/components/ui/section-badge";
import { Security, WatchLater, AutoFixHigh } from "@mui/icons-material";
import React from "react";

const HIGHLIGHTS = [
    {
        icon: Security,
        label: "Secure Platform"
    },
    {
        icon: WatchLater,
        label: "Real-time Updates"
    },
    {
        icon: AutoFixHigh,
        label: "Smart Features"
    }
];

const CTA = () => {
    return (
        <Wrapper className="py-20 lg:py-32">
            <div className="flex flex-col items-center text-center relative gap-4 py-20 lg:py-32 overflow-hidden z-0">
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#000000] w-full h-1/2 z-10"></div>

                <AnimationContainer animation="scaleUp" delay={0.2} className="w-full mx-auto">
                    <div className="absolute -top-1/2 inset-x-0 mx-auto bg-white/50 rounded-full size-1/2 blur-[4rem] lg:blur-[10rem]"></div>
                </AnimationContainer>

                <AnimationContainer animation="scaleUp" delay={0.3}>
                    <div className="absolute top-0 w-4/5 mx-auto inset-x-0 h-px bg-gradient-to-r from-black/0 via-foreground/50 to-foreground/0"></div>
                </AnimationContainer>

                <div className="flex flex-col items-center justify-center w-full z-30">
                    <AnimationContainer animation="fadeUp" delay={0.3}>
                        <SectionBadge title="Start now" />
                    </AnimationContainer>

                    <AnimationContainer animation="fadeUp" delay={0.4}>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-medium !leading-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-400">
                            Ready to get started?
                        </h2>
                    </AnimationContainer>

                    <AnimationContainer animation="fadeUp" delay={0.5}>
                        <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-lg mx-auto mt-4">
                            Sign up for a free trial and see how Connectify can help you manage your communication.
                        </p>
                    </AnimationContainer>

                    <AnimationContainer animation="fadeUp" delay={0.6} >
                        <div className="flex items-center mt-4">
                            <div className="rounded-full px-4 py-2.5 bg-neutral-900 flex flex-wrap md:flex-row items-center justify-center gap-4">
                                {HIGHLIGHTS.map((item, index) => (
                                    <AnimationContainer
                                        key={index}
                                        animation="fadeRight"
                                        delay={0.7 + (index * 0.1)}
                                    >
                                        <div className="flex items-center gap-2 last:hidden md:last:flex">

                                            {React.createElement(item.icon, {
                                                style: { fontSize: "1rem", color: "gray" },
                                            })}

                                            <span className="text-sm text-gray-300">
                                                {item.label}
                                            </span>
                                        </div>
                                    </AnimationContainer>
                                ))}
                            </div>
                        </div>
                    </AnimationContainer>

                    <AnimationContainer animation="fadeUp" delay={1}>
                        <Link to="/login">
                            <Button size="lg" className="mt-6 bg-orange-600">
                                Start now
                                <ArrowRightIcon className="size-4 ml-2" />
                            </Button>
                        </Link>
                    </AnimationContainer>
                </div>
            </div>
        </Wrapper>
    )
};

export default CTA;