"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AboutUs() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);

  return (
    <div className="container mx-auto px-4 my-20 lg:my-30 text-center">
      <h2 className="text-accent-foreground font-semibold text-lg" data-aos="fade-down">
        About Us
      </h2>
      <h1 className="my-5" data-aos="fade-down" data-aos-delay="100">
        Meet Our <span className="text-primary">Capstone</span> Team Project
      </h1>
      <p className="text-base" data-aos="zoom-in">
        CC25-CF083
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-36">
        <div className="relative mx-auto w-full max-w-xs" data-aos="fade-right" data-aos-delay="200">
          <div className="bg-[#e0e0e0] shadow-sm">
            <div className="relative h-48 lg:h-68 overflow-visible">
              <div className="absolute -top-10 lg:-top-30 left-0 right-0 h-58 md:h-78 lg:h-98" style={{ zIndex: 10 }}>
                <Image src="/muhammadrafly.png" alt="Team Member" fill className="object-cover select-none pointer-events-none" style={{ objectPosition: "top center" }} />
              </div>
            </div>
            <div className="p-4 bg-gray-100 relative">
              <h3 className="text-lg font-bold text-primary">Muhammad Rafli</h3>
              <p className="font-medium">Backend Developer</p>
              <p className="text-sm">Universitas Indraprasta PGRI</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xs mt-10" data-aos="fade-down" data-aos-delay="200">
          <div className="bg-[#e0e0e0] shadow-sm">
            <div className="relative h-48 lg:h-78 overflow-visible">
              <div className="absolute -top-10 lg:-top-30 left-0 right-0 h-58 md:h-78 lg:h-108" style={{ zIndex: 10 }}>
                <Image src="/anamsadat.png" alt="Team Member" fill className="object-cover select-none pointer-events-none" style={{ objectPosition: "top center" }} />
              </div>
            </div>
            <div className="p-4 bg-gray-100 relative">
              <h3 className="text-lg font-bold text-primary">Anam Sadat</h3>
              <p className="font-medium">Fullstack Developer</p>
              <p className="text-sm">STIKOM Poltek Cirebon</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xs" data-aos="fade-left" data-aos-delay="200">
          <div className="bg-[#e0e0e0] shadow-sm">
            <div className="relative h-48 lg:h-68 overflow-visible">
              <div className="absolute -top-10 lg:-top-30 left-0 right-0 h-58 md:h-78 lg:h-98" style={{ zIndex: 10 }}>
                <Image src="/adrianoposumah.png" alt="Team Member" fill className="object-cover select-none pointer-events-none" style={{ objectPosition: "top center" }} />
              </div>
            </div>
            <div className="p-4 bg-gray-100 relative">
              <h3 className="text-lg font-bold text-primary">Adriano Posumah</h3>
              <p className="font-medium">Frontend Developer</p>
              <p className="text-sm">Universitas Sam Ratulangi Manado</p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-36">
        <div className="relative mx-auto w-full max-w-xs" data-aos="fade-right" data-aos-delay="200">
          <div className="bg-[#e0e0e0] shadow-sm">
            <div className="relative h-48 lg:h-68 overflow-visible">
              <div className="absolute -top-10 lg:-top-40 left-0 right-0 h-58 md:h-78 lg:h-108" style={{ zIndex: 10 }}>
                <Image src="/christianroeroe.png" alt="Team Member" fill className="object-cover select-none pointer-events-none" style={{ objectPosition: "top center" }} />
              </div>
            </div>
            <div className="p-4 bg-gray-100 relative">
              <h3 className="text-lg font-bold text-primary">Christian Andreas Roeroe</h3>
              <p className="font-medium">Machine Learning</p>
              <p className="text-sm">Universitas Sam Ratulangi Manado</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xs mt-10" data-aos="fade-up" data-aos-delay="200">
          <div className="bg-[#e0e0e0] shadow-sm">
            <div className="relative h-48 lg:h-78 overflow-visible">
              <div className="absolute -top-10 lg:-top-30 left-0 right-0 h-58 md:h-78 lg:h-108" style={{ zIndex: 10 }}>
                <Image src="/default.png" alt="Team Member" fill className="object-cover select-none pointer-events-none" style={{ objectPosition: "top center" }} />
              </div>
            </div>
            <div className="p-4 bg-gray-100 relative">
              <h3 className="text-lg font-bold text-primary">Regita Cahyaningsih</h3>
              <p className="font-medium">Machine Learning</p>
              <p className="text-sm">UIN Syarif Hidayatullah Jakarta</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xs" data-aos="fade-left" data-aos-delay="200">
          <div className="bg-[#e0e0e0] shadow-sm">
            <div className="relative h-48 lg:h-68 overflow-visible">
              <div className="absolute -top-10 lg:-top-30 left-0 right-0 h-58 md:h-78 lg:h-98" style={{ zIndex: 10 }}>
                <Image src="/arsaga.png" alt="Team Member" fill className="object-cover select-none pointer-events-none" style={{ objectPosition: "top center" }} />
              </div>
            </div>
            <div className="p-4 bg-gray-100 relative">
              <h3 className="text-lg font-bold text-primary">Arira Satra Yoga</h3>
              <p className="font-medium">Machine Learning</p>
              <p className="text-sm">Universitas Islam Kebanggan Indonesia</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
