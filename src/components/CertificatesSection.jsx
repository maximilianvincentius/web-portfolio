import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { certificates } from "../data/certificates";
const SCROLL_OFFSET_PX = 96;
export function CertificateShowcase({ autoSlideInterval = 8000 }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState("next");
  const timerRef = useRef(null);
  const stripRef = useRef(null);
  const thumbRefs = useRef({});
  const activeIndexRef = useRef(activeIndex);
  const activeCert = certificates[activeIndex];
  /** * Keep ref synchronized with active index. * Useful for callbacks/timers without relying on stale state. */ useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);
  /** * Automatically reveal the active thumbnail. * * Important: * - Uses native scrollTo only when the active certificate changes. * - Does NOT interfere with normal user scrolling. * - Does NOT use scroll-smooth on the container. */ useEffect(() => {
    const strip = stripRef.current;
    const thumb = thumbRefs.current[activeIndex];
    if (!strip || !thumb) return;
    const stripRect = strip.getBoundingClientRect();
    const thumbRect = thumb.getBoundingClientRect();
    let targetScrollLeft = strip.scrollLeft;
    if (thumbRect.left < stripRect.left) {
      targetScrollLeft += thumbRect.left - stripRect.left - SCROLL_OFFSET_PX;
    } else if (thumbRect.right > stripRect.right) {
      targetScrollLeft += thumbRect.right - stripRect.right + SCROLL_OFFSET_PX;
    } else {
      return;
    }
    strip.scrollTo({ left: Math.max(0, targetScrollLeft), behavior: "smooth" });
  }, [activeIndex]);
  /** * Navigate to a specific certificate. */ const goToSlide = useCallback(
    (newIndex) => {
      if (
        newIndex === activeIndex ||
        newIndex < 0 ||
        newIndex >= certificates.length
      ) {
        return;
      }
      setDirection(newIndex > activeIndex ? "next" : "prev");
      setActiveIndex(newIndex);
    },
    [activeIndex],
  );
  /** * Next certificate. */ const handleNext = useCallback(() => {
    if (certificates.length <= 1) return;
    const nextIndex = (activeIndex + 1) % certificates.length;
    goToSlide(nextIndex);
  }, [activeIndex, goToSlide]);
  /** * Previous certificate. */ const handlePrev = useCallback(() => {
    if (certificates.length <= 1) return;
    const previousIndex =
      (activeIndex - 1 + certificates.length) % certificates.length;
    goToSlide(previousIndex);
  }, [activeIndex, goToSlide]);
  /** * Auto-slide timer. * * Pauses while hovering over the showcase. */ useEffect(() => {
    if (isHovered || certificates.length <= 1 || autoSlideInterval <= 0) {
      return;
    }
    timerRef.current = window.setInterval(() => {
      const currentIndex = activeIndexRef.current;
      const nextIndex = (currentIndex + 1) % certificates.length;
      setDirection("next");
      setActiveIndex(nextIndex);
    }, autoSlideInterval);
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isHovered, autoSlideInterval]);
  /** * Framer Motion variants. * * Only transform/opacity are animated to keep * the animation compositor-friendly. */ const slideVariants =
    useMemo(
      () => ({
        enter: (dir) => ({
          opacity: 0,
          x: dir === "next" ? 40 : -40,
          scale: 0.98,
        }),
        center: { opacity: 1, x: 0, scale: 1 },
        exit: (dir) => ({
          opacity: 0,
          x: dir === "next" ? -40 : 40,
          scale: 0.98,
        }),
      }),
      [],
    );
  return (
    <div className="w-full">
      {" "}
      {/* Header */}{" "}
      <motion.div
        className="mt-20 mb-10 text-center"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {" "}
        <div className="flex flex-col items-center text-center">
          {" "}
          <span className="inline-block w-full max-w-xl font-mono text-sm text-primary">
            {" "}
            Certifications{" "}
          </span>{" "}
          <span className="inline-block w-full text-center text-4xl font-bold leading-tight text-white md:text-5xl">
            {" "}
            Professional Credentials{" "}
          </span>{" "}
        </div>{" "}
      </motion.div>{" "}
      <section className="w-full">
        {" "}
        <div className="flex w-full flex-col gap-6">
          {" "}
          {/* Main Active Certificate Showcase Card */}{" "}
          <div
            className=" group relative min-h-[320px] overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md md:p-8 "
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {" "}
            {/* Active Certificate Content */}{" "}
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              {" "}
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className=" grid grid-cols-1 items-center gap-6 md:grid-cols-2 md:gap-10 "
              >
                {" "}
                {/* Certificate Image */}{" "}
                <div className=" flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-xl bg-black/20 ">
                  {" "}
                  <img
                    src={activeCert.image}
                    alt={activeCert.title}
                    className=" h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.02] "
                    loading="eager"
                    draggable={false}
                  />{" "}
                </div>{" "}
                {/* Certificate Information */}{" "}
                <div className="flex flex-col gap-3">
                  {" "}
                  {activeCert.issuedBy && (
                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 md:text-sm">
                      {" "}
                      {activeCert.issuedBy}{" "}
                      {activeCert.date ? ` • ${activeCert.date}` : ""}{" "}
                    </span>
                  )}{" "}
                  <h3 className="text-xl font-bold leading-tight text-white md:text-3xl">
                    {" "}
                    {activeCert.title}{" "}
                  </h3>{" "}
                  <p className="text-sm leading-relaxed text-zinc-400 md:text-base">
                    {" "}
                    {activeCert.description}{" "}
                  </p>{" "}
                </div>{" "}
              </motion.div>{" "}
            </AnimatePresence>{" "}
            {/* Previous / Next Controls */}{" "}
            {certificates.length > 1 && (
              <div className=" pointer-events-none absolute inset-y-0 left-0 right-0 z-10 flex items-center justify-between px-2 md:px-4 ">
                {" "}
                {/* Previous */}{" "}
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous certificate"
                  className=" pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white/80 backdrop-blur-sm transition-colors duration-200 hover:bg-indigo-500/60 hover:text-white md:h-10 md:w-10 "
                >
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    {" "}
                    <polyline points="15 18 9 12 15 6" />{" "}
                  </svg>{" "}
                </button>{" "}
                {/* Next */}{" "}
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next certificate"
                  className=" pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white/80 backdrop-blur-sm transition-colors duration-200 hover:bg-indigo-500/60 hover:text-white md:h-10 md:w-10 "
                >
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    {" "}
                    <polyline points="9 18 15 12 9 6" />{" "}
                  </svg>{" "}
                </button>{" "}
              </div>
            )}{" "}
            {/* Progress Indicator */}{" "}
            <div className="absolute bottom-0 left-0 h-[3px] w-full bg-white/5">
              {" "}
              <div
                key={`${activeIndex}-${isHovered}`}
                className="h-full bg-indigo-500 animate-[progress_linear_infinite]"
                style={{
                  animationDuration: `${autoSlideInterval}ms`,
                  animationPlayState: isHovered ? "paused" : "running",
                }}
              />{" "}
            </div>{" "}
          </div>{" "}
          {/* Thumbnail Scroll Strip */}{" "}
          {certificates.length > 0 && (
            <div
              ref={stripRef}
              className=" clean-scrollbar w-full max-w-full overflow-x-auto overflow-y-hidden overscroll-x-contain pb-2 touch-pan-x [-webkit-overflow-scrolling:touch] "
            >
              {" "}
              {/* Important: w-max makes the content wider than the container, while max-w-full on the parent prevents the page itself from becoming horizontally scrollable. */}{" "}
              <div className="flex w-max min-w-full gap-4">
                {" "}
                {certificates.map((cert, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <button
                      key={cert.id || index}
                      ref={(element) => {
                        if (element) {
                          thumbRefs.current[index] = element;
                        } else {
                          delete thumbRefs.current[index];
                        }
                      }}
                      type="button"
                      onClick={() => goToSlide(index)}
                      className={` flex w-36 shrink-0 flex-col gap-2 rounded-xl border p-2 text-left outline-none transition-all duration-200 md:w-44 ${isActive ? "border-indigo-500 bg-indigo-500/10 shadow-[0_0_12px_rgba(99,102,241,0.25)]" : "border-white/10 bg-white/[0.02] hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.06]"} `}
                      aria-label={`Select ${cert.title}`}
                    >
                      {" "}
                      {/* Thumbnail Image */}{" "}
                      <div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-black/30">
                        {" "}
                        <img
                          src={cert.image}
                          alt={cert.title}
                          className={` h-full w-full object-cover transition-opacity duration-200 ${isActive ? "opacity-100" : "opacity-75 hover:opacity-100"} `}
                          loading="lazy"
                          draggable={false}
                        />{" "}
                      </div>{" "}
                      {/* Thumbnail Title */}{" "}
                      <div className="px-1">
                        {" "}
                        <span className="line-clamp-1 text-xs font-medium text-zinc-300">
                          {" "}
                          {cert.title}{" "}
                        </span>{" "}
                      </div>{" "}
                    </button>
                  );
                })}{" "}
              </div>{" "}
            </div>
          )}{" "}
        </div>{" "}
      </section>{" "}
    </div>
  );
}
export default CertificateShowcase;
