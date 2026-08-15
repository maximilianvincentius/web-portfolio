import { useEffect, useState, useRef } from "react";
import { technologies } from "../data/portfolio";

const resumePath = "/assets/resume.pdf";

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

function ResumeLauncher({ footer = false }) {
  const [state, setState] = useState("idle");
  const message =
    state === "loading"
      ? "Preparing download..."
      : state === "done"
        ? "Resume downloaded. Check your Downloads folder."
        : "Click to download my resume.";

  const download = () => {
    if (state === "loading") return;
    setState("loading");
    setTimeout(() => {
      const link = document.createElement("a");
      link.href = resumePath;
      link.download = "Befikir-Shimelis-Resume.pdf";
      link.click();
      setState("done");
      setTimeout(() => setState("idle"), 2600);
    }, 680);
  };

  return (
    <div className={"justify-center text-center"}>
      <button
        aria-live="polite"
        className="items-center w-50 gap-1.5 px-3 py-1.5 text-xs font-mono bg-gray-900 text-gray-100 rounded hover:bg-gray-800 transition-colors"
        data-state={state}
        type="button"
        onClick={download}
      >
        <span className="text-green-400">$</span>
        <span className="text-cyan-400">./download_resume.sh</span>
      </button>
      <p className="text-xs text-gray-500 font-mono">{message}</p>
    </div>
  );
}

function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(173);
  const [audioAvailable, setAudioAvailable] = useState(true);

  useEffect(() => {
    const audio = document.getElementById("audio-player");
    if (!audio) return;
    const metadata = () =>
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 173);
    const update = () => {
      setCurrent(audio.currentTime);
      setProgress(
        audio.duration ? (audio.currentTime / audio.duration) * 100 : 0,
      );
    };
    const ended = () => {
      setPlaying(false);
      setProgress(0);
      setCurrent(0);
    };
    const error = () => setAudioAvailable(false);
    audio.addEventListener("loadedmetadata", metadata);
    audio.addEventListener("timeupdate", update);
    audio.addEventListener("ended", ended);
    audio.addEventListener("error", error);
    return () => {
      audio.removeEventListener("loadedmetadata", metadata);
      audio.removeEventListener("timeupdate", update);
      audio.removeEventListener("ended", ended);
      audio.removeEventListener("error", error);
    };
  }, []);

  const togglePlay = async () => {
    const audio = document.getElementById("audio-player");
    if (!audioAvailable || !audio) return;
    if (playing) audio.pause();
    else {
      try {
        await audio.play();
      } catch {
        setAudioAvailable(false);
        return;
      }
    }
    setPlaying(!playing);
  };
  const seek = (delta) => {
    const audio = document.getElementById("audio-player");
    if (!audio) return;
    audio.currentTime = Math.max(
      0,
      Math.min(audio.duration || duration, audio.currentTime + delta),
    );
  };
  const toggleMute = () => {
    const audio = document.getElementById("audio-player");
    if (!audio) return;
    audio.muted = !audio.muted;
    setMuted(audio.muted);
  };
  const seekTo = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const audio = document.getElementById("audio-player");
    if (audio && Number.isFinite(audio.duration))
      audio.currentTime =
        ((e.clientX - rect.left) / rect.width) * audio.duration;
  };
  const format = (s) =>
    `${Math.floor(s / 60)}:${Math.floor(s % 60)
      .toString()
      .padStart(2, "0")}`;

  return (
    <div className="music-player-container">
      <p className="listening-label">🎵 Listening to</p>
      <div className="card">
        <div className="top">
          <div className="pfp">
            <div className={`playing ${playing ? "" : "paused"}`}>
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className={`greenline line-${n}`} />
              ))}
            </div>
          </div>
          <div className="texts">
            <p className="title-1">Beethoven</p>
            <p className="title-2">Für Elise</p>
          </div>
        </div>
        <div className="controls">
          <svg
            className="volume_button"
            onClick={toggleMute}
            fill="currentColor"
            height="20"
            viewBox="0 0 24 24"
            width="24"
            style={{ opacity: muted ? 0.3 : 1 }}
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M11.26 3.691A1.2 1.2 0 0 1 12 4.8v14.4a1.199 1.199 0 0 1-2.048.848L5.503 15.6H2.4a1.2 1.2 0 0 1-1.2-1.2V9.6a1.2 1.2 0 0 1 1.2-1.2h3.103l4.449-4.448a1.2 1.2 0 0 1 1.308-.26Zm6.328-.176a1.2 1.2 0 0 1 1.697 0A11.967 11.967 0 0 1 22.8 12a11.966 11.966 0 0 1-3.515 8.485 1.2 1.2 0 0 1-1.697-1.697A9.563 9.563 0 0 0 20.4 12a9.565 9.565 0 0 0-2.812-6.788 1.2 1.2 0 0 1 0-1.697Zm-3.394 3.393a1.2 1.2 0 0 1 1.698 0A7.178 7.178 0 0 1 18 12a7.18 7.18 0 0 1-2.108 5.092 1.2 1.2 0 1 1-1.698-1.698A4.782 4.782 0 0 0 15.6 12a4.78 4.78 0 0 0-1.406-3.394 1.2 1.2 0 0 1 0-1.698Z"
            />
          </svg>
          <div className="volume">
            <div className="slider">
              <div className="green" style={{ width: "80%" }} />
            </div>
            <div className="circle" />
          </div>
          <svg
            className="prev-btn"
            onClick={() => seek(-10)}
            fill="none"
            height="18"
            viewBox="0 0 24 24"
            width="18"
          >
            <path
              d="M6.109 4.204C4.78 3.318 3 4.271 3 5.869v12.262c0 1.598 1.78 2.55 3.109 1.665l9.197-6.132c1.188-.792 1.188-2.537 0-3.329L6.109 4.204ZM5 5.869 14.197 12 5 18.131V5.869Z"
              fill="currentColor"
            />
            <path
              d="M21 5a1 1 0 1 0-2 0v14a1 1 0 1 0 2 0V5Z"
              fill="currentColor"
            />
          </svg>
          <svg
            className={`play-btn ${playing ? "playing" : ""}`}
            onClick={togglePlay}
            fill="currentColor"
            height="32"
            viewBox="0 0 24 24"
            width="32"
          >
            {playing ? (
              <path d="M6 4a1 1 0 0 1 1 1v14a1 1 0 1 1-2 0V5a1 1 0 0 1 1-1Zm8 0a1 1 0 0 1 1 1v14a1 1 0 1 1-2 0V5a1 1 0 0 1 1-1Z" />
            ) : (
              <path
                fillRule="evenodd"
                d="M21.6 12a9.6 9.6 0 1 1-19.2 0 9.6 9.6 0 0 1 19.2 0ZM8.4 9.6a1.2 1.2 0 1 1 2.4 0v4.8a1.2 1.2 0 1 1-2.4 0V9.6Zm6-1.2a1.2 1.2 0 0 0-1.2 1.2v4.8a1.2 1.2 0 1 0 2.4 0V9.6a1.2 1.2 0 0 0-1.2-1.2Z"
              />
            )}
          </svg>
          <svg
            className="next-btn"
            onClick={() => seek(10)}
            fill="none"
            height="18"
            viewBox="0 0 24 24"
            width="18"
          >
            <path
              d="M17.891 4.204C19.22 3.318 21 4.271 21 5.869v12.262c0 1.598-1.78 2.55-3.109 1.665l-9.197-6.132c-1.188-.792-1.188-2.537 0-3.329l9.197-6.132ZM19 5.869 9.803 12 19 18.131V5.869Z"
              fill="currentColor"
            />
            <path
              d="M5 5a1 1 0 1 0-2 0v14a1 1 0 1 0 2 0V5Z"
              fill="currentColor"
            />
          </svg>
          <div className="air" />
          <svg
            fill="none"
            height="20"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="24"
          >
            <path d="M3.343 7.778a4.5 4.5 0 0 1 7.339-1.46L12 7.636l1.318-1.318a4.5 4.5 0 1 1 6.364 6.364L12 20.364l-7.682-7.682a4.501 4.501 0 0 1-.975-4.904Z" />
          </svg>
        </div>
        <div className="time" onClick={seekTo}>
          <div className="elapsed" style={{ width: `${progress}%` }} />
        </div>
        <p className="timetext time_now">{format(current)}</p>
        <p className="timetext time_full">{format(duration)}</p>
      </div>
      <audio id="audio-player" src="/assets/music.mp3" preload="metadata" />
      {!audioAvailable && (
        <p className="resume-status">
          Music file is unavailable in the provided source archive.
        </p>
      )}
    </div>
  );
}

export { ResumeLauncher };

export default function Hero() {
  return (
    <section className="min-h-screen py-20 !px-20" id="hero">
      <div className="flex flex-col">
        <h1>
          <span id="typing-text">
            Hi, I'm <span className="text-yellow-500">Max</span>
            <br />
            <div className="text-4xl! font-light text-gray-600">
              <TypingEffect />
              <span className="inline-block">_</span>
            </div>
          </span>
        </h1>
        <div className="flex flex-col">
          <div className="relative inline-block">
            <img
              alt="My Photo"
              className="w-48 h-48 max-h-30 rounded-full object-cover"
              src="/assets/your_photo.jpg"
            />
            {/* <div className="gpa-badge">3.9 GPA</div> */}
          </div>
          <h2 className="text-2xl font-bold">Maximilian Vincentius</h2>
          <p className="text-sm text-gray-600">
            A passionate Full Stack Developer with a strong foundation in
          </p>
          <div className="flex flex-row gap-2">
            {technologies.map(([name, src]) => (
              <div
                className="max-w-30 rounded-full object-fill"
                title={name}
                key={name}
              >
                <img alt={name} src={src} className="w-full object-fill h-16" />
              </div>
            ))}
          </div>
          {/* <MusicPlayer /> */}
        </div>
      </div>
    </section>
  );
}
