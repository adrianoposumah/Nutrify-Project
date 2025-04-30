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
    <div className="container mx-auto px-4 my-10 lg:my-30 text-center">
      <h2 className="text-accent-foreground font-semibold text-lg" data-aos="fade-down">
        About
      </h2>
      <h1 className="my-5" data-aos="fade-down" data-aos-delay="100">
        Meet Our <span className="text-primary">Capstone</span> Team Project
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-36">
        <div className="relative mx-auto w-full max-w-xs" data-aos="fade-right" data-aos-delay="200">
          <div className="bg-[#e0e0e0] shadow-sm">
            <div className="relative h-28 md:h-48 lg:h-68 overflow-visible">
              <div className="absolute -top-30 left-0 right-0 h-58 md:h-78 lg:h-98" style={{ zIndex: 10 }}>
                <Image src="/default.png" alt="Team Member" fill className="object-cover" style={{ objectPosition: "top center" }} />
              </div>
            </div>
            <div className="p-4 bg-gray-100 relative">
              <h3 className="text-lg font-bold text-primary">Member 1</h3>
              <p className="font-medium">Frontend Developer</p>
              <p className="text-sm">Universitas</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xs mt-10" data-aos="fade-down" data-aos-delay="200">
          <div className="bg-[#e0e0e0] shadow-sm">
            <div className="relative h-28 md:h-48 lg:h-78 overflow-visible">
              <div className="absolute -top-30 left-0 right-0 h-58 md:h-78 lg:h-108" style={{ zIndex: 10 }}>
                <Image src="/default.png" alt="Team Member" fill className="object-cover" style={{ objectPosition: "top center" }} />
              </div>
            </div>
            <div className="p-4 bg-gray-100 relative">
              <h3 className="text-lg font-bold text-primary">Member 2</h3>
              <p className="font-medium">Frontend Developer</p>
              <p className="text-sm">Universitas</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xs" data-aos="fade-left" data-aos-delay="200">
          <div className="bg-[#e0e0e0] shadow-sm">
            <div className="relative h-28 md:h-48 lg:h-68 overflow-visible">
              <div className="absolute -top-30 left-0 right-0 h-58 md:h-78 lg:h-98" style={{ zIndex: 10 }}>
                <Image src="/default.png" alt="Team Member" fill className="object-cover" style={{ objectPosition: "top center" }} />
              </div>
            </div>
            <div className="p-4 bg-gray-100 relative">
              <h3 className="text-lg font-bold text-primary">Member 3</h3>
              <p className="font-medium">Frontend Developer</p>
              <p className="text-sm">Universitas</p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-36">
        <div className="relative mx-auto w-full max-w-xs" data-aos="fade-right" data-aos-delay="200">
          <div className="bg-[#e0e0e0] shadow-sm">
            <div className="relative h-28 md:h-48 lg:h-68 overflow-visible">
              <div className="absolute -top-30 left-0 right-0 h-58 md:h-78 lg:h-98" style={{ zIndex: 10 }}>
                <Image src="/default.png" alt="Team Member" fill className="object-cover" style={{ objectPosition: "top center" }} />
              </div>
            </div>
            <div className="p-4 bg-gray-100 relative">
              <h3 className="text-lg font-bold text-primary">Member 4</h3>
              <p className="font-medium">Machine Learning</p>
              <p className="text-sm">Universitas</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xs mt-10" data-aos="fade-up" data-aos-delay="200">
          <div className="bg-[#e0e0e0] shadow-sm">
            <div className="relative h-28 md:h-48 lg:h-78 overflow-visible">
              <div className="absolute -top-30 left-0 right-0 h-58 md:h-78 lg:h-108" style={{ zIndex: 10 }}>
                <Image src="/default.png" alt="Team Member" fill className="object-cover" style={{ objectPosition: "top center" }} />
              </div>
            </div>
            <div className="p-4 bg-gray-100 relative">
              <h3 className="text-lg font-bold text-primary">Member 5</h3>
              <p className="font-medium">Machine Learning</p>
              <p className="text-sm">Universitas</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xs" data-aos="fade-left" data-aos-delay="200">
          <div className="bg-[#e0e0e0] shadow-sm">
            <div className="relative h-28 md:h-48 lg:h-68 overflow-visible">
              <div className="absolute -top-30 left-0 right-0 h-58 md:h-78 lg:h-98" style={{ zIndex: 10 }}>
                <Image src="/default.png" alt="Team Member" fill className="object-cover" style={{ objectPosition: "top center" }} />
              </div>
            </div>
            <div className="p-4 bg-gray-100 relative">
              <h3 className="text-lg font-bold text-primary">Member 6</h3>
              <p className="font-medium">Machine Learning</p>
              <p className="text-sm">Universitas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
