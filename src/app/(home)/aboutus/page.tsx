'use client';
import { useEffect } from 'react';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FloatingBubbles } from '@/components/main/FloatingBubbles';

export default function AboutUs() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
  }, []);

  return (
    <>
      <FloatingBubbles />
      <div className="relative" style={{ zIndex: 10 }}>
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
          {/* Desktop */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-36">
              <div className="relative mx-auto w-full max-w-xs" data-aos="fade-right" data-aos-delay="200">
                <div className="backdrop-blur-md bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 rounded-lg shadow-xl">
                  <div className="relative h-48 lg:h-68 overflow-visible">
                    <div className="absolute -top-10 lg:-top-30 left-0 right-0 h-58 md:h-78 lg:h-98" style={{ zIndex: 10 }}>
                      <Image src="/muhammadrafly.png" alt="Team Member" fill className="object-cover select-none pointer-events-none" style={{ objectPosition: 'top center' }} />
                    </div>
                  </div>
                  <div className="p-4 backdrop-blur-sm bg-white/30 dark:bg-white/10 rounded-b-lg relative">
                    <h3 className="text-lg font-bold text-primary">Muhammad Rafli</h3>
                    <p className="font-medium">Backend Developer</p>
                    <p className="text-sm">Universitas Indraprasta PGRI</p>
                  </div>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-xs mt-10" data-aos="fade-down" data-aos-delay="200">
                <div className="backdrop-blur-md bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 rounded-lg shadow-xl">
                  <div className="relative h-48 lg:h-78 overflow-visible">
                    <div className="absolute -top-10 lg:-top-30 left-0 right-0 h-58 md:h-78 lg:h-108" style={{ zIndex: 10 }}>
                      <Image src="/anamsadat.png" alt="Team Member" fill className="object-cover select-none pointer-events-none" style={{ objectPosition: 'top center' }} />
                    </div>
                  </div>
                  <div className="p-4 backdrop-blur-sm bg-white/30 dark:bg-white/10 rounded-b-lg relative">
                    <h3 className="text-lg font-bold text-primary">Anam Sadat</h3>
                    <p className="font-medium">Fullstack Developer</p>
                    <p className="text-sm">STIKOM Poltek Cirebon</p>
                  </div>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-xs" data-aos="fade-left" data-aos-delay="200">
                <div className="backdrop-blur-md bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 rounded-lg shadow-xl">
                  <div className="relative h-48 lg:h-68 overflow-visible">
                    <div className="absolute -top-10 lg:-top-30 left-0 right-0 h-58 md:h-78 lg:h-98" style={{ zIndex: 10 }}>
                      <Image src="/adrianoposumah.png" alt="Team Member" fill className="object-cover select-none pointer-events-none" style={{ objectPosition: 'top center' }} />
                    </div>
                  </div>
                  <div className="p-4 backdrop-blur-sm bg-white/30 dark:bg-white/10 rounded-b-lg relative">
                    <h3 className="text-lg font-bold text-primary">Adriano Posumah</h3>
                    <p className="font-medium">Frontend Developer</p>
                    <p className="text-sm">Universitas Sam Ratulangi Manado</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-36">
              <div className="relative mx-auto w-full max-w-xs" data-aos="fade-right" data-aos-delay="200">
                <div className="backdrop-blur-md bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 rounded-lg shadow-xl">
                  <div className="relative h-48 lg:h-68 overflow-visible">
                    <div className="absolute -top-10 lg:-top-40 left-0 right-0 h-58 md:h-78 lg:h-108" style={{ zIndex: 10 }}>
                      <Image src="/christianroeroe.png" alt="Team Member" fill className="object-cover select-none pointer-events-none" style={{ objectPosition: 'top center' }} />
                    </div>
                  </div>
                  <div className="p-4 backdrop-blur-sm bg-white/30 dark:bg-white/10 rounded-b-lg relative">
                    <h3 className="text-lg font-bold text-primary">Christian Andreas Roeroe</h3>
                    <p className="font-medium">Machine Learning</p>
                    <p className="text-sm">Universitas Sam Ratulangi Manado</p>
                  </div>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-xs mt-10" data-aos="fade-up" data-aos-delay="200">
                <div className="backdrop-blur-md bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 rounded-lg shadow-xl">
                  <div className="relative h-48 lg:h-78 overflow-visible">
                    <div className="absolute -top-10 lg:-top-50 left-0 right-0 h-58 md:h-78 lg:h-128" style={{ zIndex: 10 }}>
                      <Image src="/regitacahyaningsi.png" alt="Team Member" fill className="object-cover select-none pointer-events-none" style={{ objectPosition: 'top center' }} />
                    </div>
                  </div>
                  <div className="p-4 backdrop-blur-sm bg-white/30 dark:bg-white/10 rounded-b-lg relative">
                    <h3 className="text-lg font-bold text-primary">Regita Cahyaningsih</h3>
                    <p className="font-medium">Machine Learning</p>
                    <p className="text-sm">UIN Syarif Hidayatullah Jakarta</p>
                  </div>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-xs" data-aos="fade-left" data-aos-delay="200">
                <div className="backdrop-blur-md bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 rounded-lg shadow-xl">
                  <div className="relative h-48 lg:h-68 overflow-visible">
                    <div className="absolute -top-10 lg:-top-30 left-0 right-0 h-58 md:h-78 lg:h-98" style={{ zIndex: 10 }}>
                      <Image src="/arsaga.png" alt="Team Member" fill className="object-cover select-none pointer-events-none" style={{ objectPosition: 'top center' }} />
                    </div>
                  </div>
                  <div className="p-4 backdrop-blur-sm bg-white/30 dark:bg-white/10 rounded-b-lg relative">
                    <h3 className="text-lg font-bold text-primary">Arira Satra Yoga</h3>
                    <p className="font-medium">Machine Learning</p>
                    <p className="text-sm">Universitas Islam Kebanggan Indonesia</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Tablet Mobile */}
          <div className="block lg:hidden">
            <div className="grid grid-cols-2 gap-4 mt-16">
              <div className="relative mx-auto w-full max-w-xs" data-aos="fade-right" data-aos-delay="200">
                <div className="backdrop-blur-md bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 rounded-lg shadow-xl">
                  <div className="relative h-48 lg:h-68 overflow-visible">
                    <div className="absolute -top-10 lg:-top-30 left-0 right-0 h-58 md:h-78 lg:h-98" style={{ zIndex: 10 }}>
                      <Image src="/muhammadrafly.png" alt="Team Member" fill className="object-cover select-none pointer-events-none" style={{ objectPosition: 'top center' }} />
                    </div>
                  </div>
                  <div className="p-4 backdrop-blur-sm bg-white/30 dark:bg-white/10 rounded-b-lg relative h-30">
                    <h3 className="text-sm font-bold text-primary leading-tight h-8 flex items-center justify-center">Muhammad Rafli</h3>
                    <p className="text-xs font-medium leading-tight h-4 flex items-center justify-center">Backend Developer</p>
                    <p className="text-xs leading-tight h-6 flex items-center justify-center">Universitas Indraprasta PGRI</p>
                  </div>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-xs" data-aos="fade-left" data-aos-delay="200">
                <div className="backdrop-blur-md bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 rounded-lg shadow-xl">
                  <div className="relative h-48 lg:h-78 overflow-visible">
                    <div className="absolute -top-10 lg:-top-30 left-0 right-0 h-58 md:h-78 lg:h-108" style={{ zIndex: 10 }}>
                      <Image src="/anamsadat.png" alt="Team Member" fill className="object-cover select-none pointer-events-none" style={{ objectPosition: 'top center' }} />
                    </div>
                  </div>
                  <div className="p-4 backdrop-blur-sm bg-white/30 dark:bg-white/10 rounded-b-lg relative h-30">
                    <h3 className="text-sm font-bold text-primary leading-tight h-8 flex items-center justify-center">Anam Sadat</h3>
                    <p className="text-xs font-medium leading-tight h-4 flex items-center justify-center">Fullstack Developer</p>
                    <p className="text-xs leading-tight h-6 flex items-center justify-center">STIKOM Poltek Cirebon</p>
                  </div>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-xs mt-8" data-aos="fade-right" data-aos-delay="400">
                <div className="backdrop-blur-md bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 rounded-lg shadow-xl">
                  <div className="relative h-48 lg:h-68 overflow-visible">
                    <div className="absolute -top-10 lg:-top-30 left-0 right-0 h-58 md:h-78 lg:h-98" style={{ zIndex: 10 }}>
                      <Image src="/adrianoposumah.png" alt="Team Member" fill className="object-cover select-none pointer-events-none" style={{ objectPosition: 'top center' }} />
                    </div>
                  </div>
                  <div className="p-4 backdrop-blur-sm bg-white/30 dark:bg-white/10 rounded-b-lg relative h-30">
                    <h3 className="text-sm font-bold text-primary leading-tight h-8 flex items-center justify-center">Adriano Posumah</h3>
                    <p className="text-xs font-medium leading-tight h-4 flex items-center justify-center">Frontend Developer</p>
                    <p className="text-xs leading-tight h-6 flex items-center justify-center">Universitas Sam Ratulangi Manado</p>
                  </div>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-xs mt-8" data-aos="fade-left" data-aos-delay="400">
                <div className="backdrop-blur-md bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 rounded-lg shadow-xl">
                  <div className="relative h-48 lg:h-68 overflow-visible">
                    <div className="absolute -top-10 lg:-top-40 left-0 right-0 h-58 md:h-78 lg:h-108" style={{ zIndex: 10 }}>
                      <Image src="/christianroeroe.png" alt="Team Member" fill className="object-cover select-none pointer-events-none" style={{ objectPosition: 'top center' }} />
                    </div>
                  </div>
                  <div className="p-4 backdrop-blur-sm bg-white/30 dark:bg-white/10 rounded-b-lg relative h-30">
                    <h3 className="text-sm font-bold text-primary leading-tight h-8 flex items-center justify-center">Christian Andreas Roeroe</h3>
                    <p className="text-xs font-medium leading-tight h-4 flex items-center justify-center">Machine Learning</p>
                    <p className="text-xs leading-tight h-6 flex items-center justify-center">Universitas Sam Ratulangi Manado</p>
                  </div>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-xs mt-8" data-aos="fade-right" data-aos-delay="600">
                <div className="backdrop-blur-md bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 rounded-lg shadow-xl">
                  <div className="relative h-48 lg:h-78 overflow-visible">
                    <div className="absolute -top-10 lg:-top-50 left-0 right-0 h-58 md:h-78 lg:h-128" style={{ zIndex: 10 }}>
                      <Image src="/regitacahyaningsi.png" alt="Team Member" fill className="object-cover select-none pointer-events-none" style={{ objectPosition: 'top center' }} />
                    </div>
                  </div>
                  <div className="p-4 backdrop-blur-sm bg-white/30 dark:bg-white/10 rounded-b-lg relative h-30">
                    <h3 className="text-sm font-bold text-primary leading-tight h-8 flex items-center justify-center">Regita Cahyaningsih</h3>
                    <p className="text-xs font-medium leading-tight h-4 flex items-center justify-center">Machine Learning</p>
                    <p className="text-xs leading-tight h-6 flex items-center justify-center">UIN Syarif Hidayatullah Jakarta</p>
                  </div>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-xs mt-8" data-aos="fade-left" data-aos-delay="600">
                <div className="backdrop-blur-md bg-white/20 dark:bg-white/10 border border-white/30 dark:border-white/20 rounded-lg shadow-xl">
                  <div className="relative h-48 lg:h-68 overflow-visible">
                    <div className="absolute -top-10 lg:-top-30 left-0 right-0 h-58 md:h-78 lg:h-98" style={{ zIndex: 10 }}>
                      <Image src="/arsaga.png" alt="Team Member" fill className="object-cover select-none pointer-events-none" style={{ objectPosition: 'top center' }} />
                    </div>
                  </div>
                  <div className="p-4 backdrop-blur-sm bg-white/30 dark:bg-white/10 rounded-b-lg relative h-30">
                    <h3 className="text-sm font-bold text-primary leading-tight h-8 flex items-center justify-center">Arira Satra Yoga</h3>
                    <p className="text-xs font-medium leading-tight h-4 flex items-center justify-center">Machine Learning</p>
                    <p className="text-xs leading-tight h-6 flex items-center justify-center">Universitas Islam Kebanggan Indonesia</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
