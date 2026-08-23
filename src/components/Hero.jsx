import { useEffect, useState, useRef } from "react";
import { technologies } from "../data/technologies";
import { Github, Linkedin, FileText, Mail } from "lucide-react";

const resumePath = "../../public/assets/MAXIMILIAN_VINCENTIUS_RESUME.pdf";

function TypingEffect({
  phrases = ["Tech enthusiast", "Future Computer Science Student"],
  typeSpeed = 100,
  deleteSpeed = 100,
  pauseTime = 3000,
}) {
  const [text, setText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];

    let delay = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && text === currentPhrase) {
      delay = pauseTime;
    }

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (text.length < currentPhrase.length) {
          setText(currentPhrase.slice(0, text.length + 1));
        } else {
          setIsDeleting(true);
        }
      } else {
        if (text.length > 0) {
          setText(currentPhrase.slice(0, text.length - 1));
        } else {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [
    text,
    isDeleting,
    phraseIndex,
    phrases,
    typeSpeed,
    deleteSpeed,
    pauseTime,
  ]);

  return <span>{text}</span>;
}

export default function Hero() {
  return (
    <section>
      <div className="flex flex-col">
        <div className="flex justify-between">
          <h1>
            <span className="text-white">
              Hi, I'm <span className="text-yellow-500">Max</span>
              <br />
              <div className="text-2xl! md:text-3xl! font-mono font-light text-gray-400">
                <TypingEffect />
                <span className="inline-block">_</span>
              </div>
            </span>
          </h1>
          <div className="text-white">
            <div className="flex flex-col gap-y-3 md:gap-y-0 md:flex-row gap-x-5 items-end md:items-center md:justify-center text-end md:min-w-0">
              <a
                href="mailto:maximilianvincentius@gmail.com"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center bg-white/5 backdrop-blur-md border border-white/10 p-2 rounded-xl text-white font-mono text-[10px] transition-all duration-300 hover:bg-white/15"
              >
                <Mail size={18} className="shrink-0" />
                <span  className="max-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out group-hover:max-w-[100px] group-hover:ml-2 opacity-0 group-hover:opacity-100">
                  Gmail
                </span>
              </a>
              <a
                href="https://github.com/maximilianvincentius"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center bg-white/5 backdrop-blur-md border border-white/10 p-2 rounded-xl text-white font-mono text-[10px] transition-all duration-300 hover:bg-white/15"
              >
                <Github size={18} className="shrink-0" />
                <span className="max-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out group-hover:max-w-[100px] group-hover:ml-2 opacity-0 group-hover:opacity-100">
                  GitHub
                </span>
              </a>

              <a
                href="https://www.linkedin.com/in/maximilian-vincentius-ba123638a/"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center bg-white/5 backdrop-blur-md border border-white/10 p-2 rounded-xl text-white font-mono text-[10px] transition-all duration-300 hover:bg-white/15"
              >
                <Linkedin size={18} className="shrink-0" />
                <span className="max-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out group-hover:max-w-[100px] group-hover:ml-2 opacity-0 group-hover:opacity-100">
                  LinkedIn
                </span>
              </a>

              <a
                href={resumePath}
                download="MAXIMILIAN VINCENTIUS_RESUME.pdf"
                rel="noreferrer"
                className="group flex items-center bg-white/5 backdrop-blur-md border border-white/10 p-2 rounded-xl text-white font-mono text-[10px] transition-all duration-300 hover:bg-white/15"
              >
                <FileText size={18} className="shrink-0" />
                <span className="max-w-0 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out group-hover:max-w-[100px] group-hover:ml-2 opacity-0 group-hover:opacity-100">
                  Resume
                </span>
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="pl-2 relative inline-block">
            <img
              alt="My Photo"
              className="w-48 h-48 max-h-30 rounded-full object-cover"
              src="/assets/max-pp.jpeg"
            />
          </div>
          <div className="flex flex-col gap-y-5 mt-5">
            <div className="pl-2 max-w-100">
              <h2 className="text-2xl text-white font-bold">
                Maximilian Vincentius
              </h2>
              <p className="text-sm text-gray-400">
                I’m a <span className="font-bold underline">developer</span>, <span className="font-bold underline">technical designer</span>, and <span className="font-bold underline">problem-solver</span> driven
                by curiosity at the intersection of mathematics, physics, and
                software. I build interactive 3D worlds, real-time simulations,
                and digital platforms, turning complex ideas into practical,
                engaging experiences.
              </p>
            </div>
            <div className="grid grid-cols-6 gap-x-2 max-w-75 font-mono">
              {technologies.map(([name, src]) => (
                <div
                  key={name}
                  className="group text-center text-white text-[10px] gap-y-2 flex flex-col items-center max-w-10.5"
                >
                  <div
                    className="max-w-30 rounded-md object-cover p-1 bg-white/5 backdrop-blur-md border border-white/10"
                    title={name}
                  >
                    <img
                      alt={name}
                      src={src}
                      className="w-full object-scale-down h-8"
                    />
                  </div>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
