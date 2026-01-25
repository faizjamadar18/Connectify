import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';

import { Link } from 'react-router-dom';
import AnimationContainer from '../global/AnimateContainer';
import Wrapper from '../global/Wrapper';

const PRODUCT_LINKS = [
    { label: "Property Search", href: "#" },
    { label: "Management Tools", href: "#" },
    { label: "Virtual Tours", href: "#" },
    { label: "Market Analytics", href: "#" },
];

const RESOURCES_LINKS = [
    { label: "Knowledge Base", href: "#" },
    { label: "Market Reports", href: "#" },
    { label: "Property Guides", href: "#" },
    { label: "Success Stories", href: "#" },
];

const COMPANY_LINKS = [
    { label: "About Us", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
];

const SOCIAL_LINKS = [
    { icon: Facebook, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Instagram, href: "#" },
    { icon: Linkedin, href: "#" },
    { icon: Youtube, href: "#" },
];

const Footer = () => {
    return (
        <footer className="relative border-t border-t-neutral-900 pt-16 pb-8 md:pb-0 w-full overflow-hidden">
            <Wrapper className="">
                <AnimationContainer animation="scaleUp" delay={0.2}>
                    <div className="absolute -top-1/8 lg:-top-1/2 inset-x-0 mx-auto bg-orange-600/50 lg:bg-orange-600/70 rounded-full w-1/2 h-1/4 blur-[6rem] lg:blur-[12rem]"></div>
                </AnimationContainer>

                <AnimationContainer animation="scaleUp" delay={0.3}>
                    <div className="absolute top-0 w-4/5 mx-auto inset-x-0 h-px bg-gradient-to-r from-orange-600/0 via-orange-from-orange-600/80 to-orange-from-orange-600/0"></div>
                </AnimationContainer>

                <div className="grid gap-8 xl:grid-cols-3 xl:gap-8">
                    <AnimationContainer animation="fadeRight" delay={0.4}>
                        <div className="flex flex-col items-start justify-start md:max-w-[300px]">
                            <Link href="/" className="flex items-center gap-1.5 text-white">
                                <img className="h-10" src="/logo_chatapp.png" alt="" />
                                <div className="text-lg font-semibold !leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-500">
                                    Connectify
                                </div>
                            </Link>
                            <p className="text-muted-foreground mt-4 text-sm">
                               @FaizJamadar
                            </p>
                            <div className="text-sm text-muted-foreground">
                                <p>support@connectify.com</p>
                                
                            </div>
                            <div className="flex items-center gap-4 mt-6">
                                {SOCIAL_LINKS.map((social, index) => (
                                    <AnimationContainer
                                        key={index}
                                        animation="fadeUp"
                                        delay={0.6 + (index * 0.1)}
                                    >
                                        <Link
                                            to={social.href}
                                            className="text-muted-foreground hover:text-orange-from-orange-600 transition-colors"
                                        >
                                            <social.icon className="size-5" />
                                        </Link>
                                    </AnimationContainer>
                                ))}
                            </div>
                        </div>
                    </AnimationContainer>

                    <div className="grid grid-cols-2 gap-8 xl:col-span-2">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <AnimationContainer animation="fadeUp" delay={0.5}>
                                <div>
                                    <h3 className="text-base font-medium text-white">Product</h3>
                                    <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                                        {PRODUCT_LINKS.map((link, index) => (
                                            <AnimationContainer
                                                key={index}
                                                animation="fadeLeft"
                                                delay={0.6 + (index * 0.1)}
                                            >
                                                <li>
                                                    <Link
                                                        to={link.href}
                                                        className="hover:text-white transition-colors"
                                                    >
                                                        {link.label}
                                                    </Link>
                                                </li>
                                            </AnimationContainer>
                                        ))}
                                    </ul>
                                </div>
                            </AnimationContainer>

                            <AnimationContainer animation="fadeUp" delay={0.5}>
                                <div className="mt-10 md:mt-0">
                                    <h3 className="text-base font-medium text-white">Resources</h3>
                                    <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                                        {RESOURCES_LINKS.map((link, index) => (
                                            <AnimationContainer
                                                key={index}
                                                animation="fadeLeft"
                                                delay={0.7 + (index * 0.1)}
                                            >
                                                <li>
                                                    <Link
                                                        to={link.href}
                                                        className="hover:text-white transition-colors"
                                                    >
                                                        {link.label}
                                                    </Link>
                                                </li>
                                            </AnimationContainer>
                                        ))}
                                    </ul>
                                </div>
                            </AnimationContainer>
                        </div>

                        <AnimationContainer animation="fadeUp" delay={0.5}>
                            <div>
                                <h3 className="text-base font-medium text-white">Company</h3>
                                <ul className="mt-4 space-y-2 text-sm text-muted-foreground ">
                                    {COMPANY_LINKS.map((link, index) => (
                                        <AnimationContainer
                                            key={index}
                                            animation="fadeLeft"
                                            delay={0.8 + (index * 0.1)}
                                        >
                                            <li>
                                                <Link
                                                    to={link.href}
                                                    className="hover:text-white transition-colors"
                                                >
                                                    {link.label}
                                                </Link>
                                            </li>
                                        </AnimationContainer>
                                    ))}
                                </ul>
                            </div>
                        </AnimationContainer>
                    </div>
                </div>

                <AnimationContainer animation="fadeUp" delay={1}>
                    <div className="mt-16 border-t border-gray-900/40 py-8 flex flex-col md:flex-row items-center justify-center mb-16">
                        <p className="text-sm text-muted-foreground">
                            © {new Date().getFullYear()} Connecify by <span className='text-neutral-300 font-bold'>Faiz</span>  All rights reserved.
                        </p>
                    </div>
                </AnimationContainer>
            </Wrapper>
        </footer>
    );
};

export default Footer;