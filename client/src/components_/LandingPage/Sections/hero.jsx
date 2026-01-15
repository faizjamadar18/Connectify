
import { Link } from "react-router-dom";
import AnimationContainer from "../global/AnimateContainer";
import Images from "../global/images";
import Wrapper from "../global/Wrapper";
import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/ui/marquee";
import SectionBadge from "@/components/ui/section-badge";


const Hero = () => {

    const companies = [
        Images.comp1,
        Images.comp2,
        Images.comp3,
        Images.comp4,
        Images.comp5,
        Images.comp6,
    ];

    return (
        <Wrapper className="pt-20 lg:pt-32 relative min-h-screen w-full h-full flex-1">
            <div className="flex flex-col lg:flex-row w-full h-full lg:gap-16">
                <div className="flex flex-col items-start gap-10 py-8 w-full">
                    <div className="flex flex-col items-start gap-4">
                        <AnimationContainer animation="fadeUp" delay={0.2}>
                            <SectionBadge title="Trusted by 10,000+ Users"  />
                        </AnimationContainer>

                        <AnimationContainer animation="fadeUp" delay={0.4}>
                            <h1 className="text-5xl lg:text-6xl font-medium !leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500">
                                Effortless Real Estate Trading
                            </h1>
                        </AnimationContainer>

                        <AnimationContainer animation="fadeUp" delay={0.6}>
                            <p className="text-sm md:text-base lg:text-lg text-muted-foreground">
                                Simplify your property journey with our comprehensive platform. Buy, sell, or manage properties with ease using our innovative tools and expert guidance.
                            </p>
                        </AnimationContainer>
                    </div>

                    <AnimationContainer animation="fadeUp" delay={0.8}>
                        <div className="w-full">
                            <Link to={"/"}>
                                <Button size="sm" className="w-full md:w-auto bg-orange-600" >
                                    Start free trial
                                </Button>
                            </Link>
                        </div>
                    </AnimationContainer>

                    <AnimationContainer animation="fadeUp" delay={1}>
                        <div className="flex flex-col items-start gap-4 py-4">
                            <p className="text-sm md:text-base text-muted-foreground">
                                Trusted by Industry Leaders
                            </p>
                            <div className="w-full relative max-w-[calc(100vw-2rem)] lg:max-w-lg">
                                <Marquee className="[--duration:40s] select-none [--gap:2rem]">
                                    {[...Array(10)].map((_, index) => (
                                        <div key={index} className="flex items-center justify-center text-muted-foreground h-16">
                                            {companies[index % companies.length]({ className: "w-auto h-5" })}
                                        </div>
                                    ))}
                                </Marquee>
                                {/* <div className="pointer-events-none absolute inset-y-0 -right-1 w-1/3 bg-gradient-to-l from-[#101010] z-40"></div>
                                <div className="pointer-events-none absolute inset-y-0 -left-1 w-1/3 bg-gradient-to-r from-[#101010] z-40"></div> */}
                            </div>
                        </div>
                    </AnimationContainer>
                </div>

                <AnimationContainer animation="fadeRight" delay={0.4}>
                    <div className="flex flex-col items-start justify-start w-full h-min relative overflow-visible">
                        <div className="lg:aspect-[1.3884514435695539/1] w-full lg:w-[1000px] lg:h-[auto,720px] relative">
                            <div className="pointer-events-none hidden lg:block absolute inset-y-0 right-1/4 w-1/3 h-full bg-gradient-to-l from-black z-50"></div>
                            <div className="lg:absolute lg:inset-0">
                                <img
                                    src="https://github.com/Shreyas-29/propease/blob/main/public/images/dashboard.png?raw=true"
                                    alt="hero"
                                    sizes="1000px"
                                    width={1024}
                                    height={1024}
                                    className="object-contain min-w-full h-auto rounded-xl lg:rounded-2xl"
                                />
                            </div>
                        </div>
                    </div>
                </AnimationContainer>
            </div>
            <AnimationContainer animation="scaleUp" delay={1.2} className="absolute w-2/3 h-auto -top-[8%] left-1/4 -z-10">
                <img
                    src="https://raw.githubusercontent.com/Shreyas-29/propease/893e81753c81853f94a9c3cd63c33f999df7c8d9/public/images/hero-gradient.svg"
                    alt="hero"
                    width={1024}
                    height={1024}
                    className="object-cover w-full h-auto"
                />
            </AnimationContainer>
        </Wrapper>
    )
};

export default Hero