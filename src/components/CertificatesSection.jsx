import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { certificates } from '../data/certificates';

const SCROLL_OFFSET_PX = 96;

export function CertificateShowcase({
  autoSlideInterval = 5000,
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState("next");

  const timerRef = useRef(null);
  const stripRef = useRef(null);
  const thumbRefs = useRef({});
  const activeCert = certificates[activeIndex];

  // Keep the active thumbnail in view when auto-advance or user nav moves it offscreen.
  useEffect(() => {
    const strip = stripRef.current;
    const thumb = thumbRefs.current[activeIndex];
    if (!strip || !thumb) return;
    const stripRect = strip.getBoundingClientRect();
    const thumbRect = thumb.getBoundingClientRect();
    if (thumbRect.left < stripRect.left) {
      strip.scrollBy({ left: thumbRect.left - stripRect.left - SCROLL_OFFSET_PX, behavior: "smooth" });
    } else if (thumbRect.right > stripRect.right) {
      strip.scrollBy({ left: thumbRect.right - stripRect.right + SCROLL_OFFSET_PX, behavior: "smooth" });
    }
  }, [activeIndex]);

  // Framer Motion variants driven by `custom={direction}`.
  // exit: current slides OUT toward the OPPOSITE of the incoming direction
  //       (i.e. exits LEFT when next slide enters from RIGHT; vice versa).
  const slideVariants = {
    enter: (dir) => ({
      opacity: 0,
      x: dir === "next" ? 40 : -40,
      scale: 0.98,
    }),
    center: {
      opacity: 1,
      x: 0,
      scale: 1,
    },
    exit: (dir) => ({
      opacity: 0,
      x: dir === "next" ? -40 : 40,
      scale: 0.98,
    }),
  };

  const goToSlide = (newIndex) => {
    if (newIndex === activeIndex) return;
    setDirection(newIndex > activeIndex ? "next" : "prev");
    setActiveIndex(newIndex);
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % certificates.length;
    goToSlide(nextIdx);
  };

  const handlePrev = () => {
    const prevIdx = (activeIndex - 1 + certificates.length) % certificates.length;
    goToSlide(prevIdx);
  };

  // Auto-Slide Timer with Hover Pause & Manual Reset
  useEffect(() => {
    if (isHovered || certificates.length <= 1) return;

    timerRef.current = setInterval(() => {
      handleNext();
    }, autoSlideInterval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeIndex, isHovered, certificates.length, autoSlideInterval]);

  return (
    <div>
      <motion.div
        className="mt-20 mb-10 text-center"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className="text-center"
        >
          <span className="inline-block font-mono w-full max-w-xl text-sm text-primary">
            Certifications
          </span>
          <span className="inline-block w-full text-4xl md:text-5xl font-bold text-white leading-tight text-center">
            Professional Credentials
          </span>
        </div>
      </motion.div>
      <section className="w-full">
        <div className="w-full flex flex-col gap-6">
          {/* Main Active Certificate Showcase Card */}
          <div
            className="relative bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 overflow-hidden backdrop-blur-md shadow-2xl min-h-[320px] group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Active Content Grid */}
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center"
              >
                {/* Left: Certificate Image */}
                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-black/20 flex items-center justify-center">
                  <img
                    src={activeCert.image}
                    alt={activeCert.title}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                    loading="eager"
                  />
                </div>

                {/* Right: Title & Description */}
                <div className="flex flex-col gap-3">
                  {activeCert.issuedBy && (
                    <span className="text-xs md:text-sm font-semibold tracking-wider uppercase text-indigo-400">
                      {activeCert.issuedBy}{" "}
                      {activeCert.date ? `• ${activeCert.date}` : ""}
                    </span>
                  )}
                  <h3 className="text-xl md:text-3xl font-bold leading-tight text-white">
                    {activeCert.title}
                  </h3>
                  <p className="text-sm md:text-base leading-relaxed text-zinc-400">
                    {activeCert.description}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Prev / Next Controls (overlaid on the card only) */}
            {certificates.length > 1 && (
              <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 md:px-4 pointer-events-none z-10">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous certificate"
                  className="pointer-events-auto w-9 h-9 md:w-10 md:h-10 rounded-full bg-black/40 hover:bg-indigo-500/60 border border-white/10 text-white/80 hover:text-white flex items-center justify-center transition-colors duration-200 backdrop-blur-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next certificate"
                  className="pointer-events-auto w-9 h-9 md:w-10 md:h-10 rounded-full bg-black/40 hover:bg-indigo-500/60 border border-white/10 text-white/80 hover:text-white flex items-center justify-center transition-colors duration-200 backdrop-blur-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            )}

            {/* Progress Line Indicator */}
            <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white/5">
              <div
                key={activeIndex + (isHovered ? "-paused" : "-active")}
                className="h-full bg-indigo-500 animate-[progress_linear_infinite]"
                style={{
                  animationDuration: `${autoSlideInterval}ms`,
                  animationPlayState: isHovered ? "paused" : "running",
                }}
              />
            </div>
          </div>

          {/* Bottom Certificate Thumbnails Scroll Strip */}
          <div
            ref={stripRef}
            className="w-full overflow-x-auto pb-2 [scrollbar-width:thin] [touch-action:pan-x_pan-y] overscroll-x-contain"
          >
            <div className="flex gap-4 w-max">
              {certificates.map((cert, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={cert.id || idx}
                    ref={(el) => {
                      if (el) thumbRefs.current[idx] = el;
                      else delete thumbRefs.current[idx];
                    }}
                    onClick={() => goToSlide(idx)}
                    className={`flex flex-col gap-2 w-36 md:w-44 p-2 rounded-xl text-left border transition-all duration-200 outline-none focus:outline-none ${
                      isActive
                        ? "bg-indigo-500/10 border-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.25)]"
                        : "bg-white/[0.02] border-white/10 hover:bg-white/[0.06] hover:border-white/20 hover:-translate-y-0.5"
                    }`}
                    aria-label={`Select ${cert.title}`}
                  >
                    <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-black/30">
                      <img
                        src={cert.image}
                        alt={cert.title}
                        className={`w-full h-full object-cover transition-opacity duration-200 ${
                          isActive
                            ? "opacity-100"
                            : "opacity-75 hover:opacity-100"
                        }`}
                      />
                    </div>
                    <div className="px-1">
                      <span className="line-clamp-1 text-xs font-medium text-zinc-300">
                        {cert.title}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CertificateShowcase;
