import CTA from '@/components_/LandingPage/Sections/cta'
import Features from '@/components_/LandingPage/Sections/feature'
import Footer from '@/components_/LandingPage/Sections/footer'
import Hero from '@/components_/LandingPage/Sections/hero'
import Navbar from '@/components_/LandingPage/Sections/navbar'
import Perks from '@/components_/LandingPage/Sections/perk'
import Testimonials from '@/components_/LandingPage/Sections/testomonials'

import React from 'react'


const HomePage = () => {
    return (
        <div className="w-full relative flex flex-col bg-black overflow-x-hidden z-10 hide">
            <section className="w-full">
                <Navbar />
                <section className="w-full">
                    <Hero />
                </section>
                <section className="w-full">
                    <Perks />
                </section>
                <section className="w-full">
                    <Features />
                </section>
                <section className="w-full">
                    <Testimonials />
                </section>
                <section className="w-full">
                    <CTA />
                </section>
                <section className="w-full">
                    <Footer />
                </section>

            </section>
        </div>
    )
}

export default HomePage
