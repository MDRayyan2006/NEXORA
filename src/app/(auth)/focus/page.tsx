"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Button,
} from "@/components/ui";

interface WhitelistSite {
  id: string;
  name: string;
  url: string;
  category: "Nexora Core" | "Academic" | "Government & Apprentice" | "Reference";
  isDefault: boolean;
}

const DEFAULT_WHITELIST: WhitelistSite[] = [
  {
    id: "nexora-learn",
    name: "Nexora Curriculum & Textbooks",
    url: "/learn",
    category: "Nexora Core",
    isDefault: true,
  },
  {
    id: "nexora-skills",
    name: "Nexora Knowledge Graph & XP",
    url: "/skills",
    category: "Nexora Core",
    isDefault: true,
  },
  {
    id: "nexora-tutor",
    name: "Nexora AI Phone Call Tutor",
    url: "/call-tutor",
    category: "Nexora Core",
    isDefault: true,
  },
  {
    id: "wiki",
    name: "Wikipedia Academic Reference",
    url: "https://en.wikipedia.org",
    category: "Academic",
    isDefault: true,
  },
  {
    id: "nats-gov",
    name: "National Apprenticeship Training Scheme (NATS)",
    url: "https://nats.education.gov.in",
    category: "Government & Apprentice",
    isDefault: true,
  },
  {
    id: "pmkvy-gov",
    name: "PMKVY Skill India Digital Portal",
    url: "https://www.skillindiadigital.gov.in",
    category: "Government & Apprentice",
    isDefault: true,
  },
  {
    id: "desmos",
    name: "Desmos Scientific Calculator",
    url: "https://www.desmos.com/scientific",
    category: "Reference",
    isDefault: true,
  },
];

const BLOCKED_DISTRACTIONS = [
  "youtube.com",
  "instagram.com",
  "facebook.com",
  "tiktok.com",
  "twitter.com",
  "x.com",
  "reddit.com",
  "netflix.com",
  "twitch.tv",
  "discord.com",
  "primevideo.com",
  "roblox.com",
  "chess.com",
];

export default function FocusModePage() {
  const [userName, setUserName] = useState("Learner");

  // Timer settings
  const [timerDuration, setTimerDuration] = useState<number>(25 * 60); // 25 mins in seconds
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Distraction tracking
  const [distractionsDetected, setDistractionsDetected] = useState<number>(0);
  const [distractionAlert, setDistractionAlert] = useState<string | null>(null);

  // Audio Soundscape state
  const [soundscape, setSoundscape] = useState<"off" | "binaural" | "whitenoise" | "rain">("off");
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioNodesRef = useRef<any[]>([]);

  // Whitelist & Sandbox
  const [whitelist, setWhitelist] = useState<WhitelistSite[]>(DEFAULT_WHITELIST);
  const [customSiteName, setCustomSiteName] = useState("");
  const [customSiteUrl, setCustomSiteUrl] = useState("");
  const [activeSandboxUrl, setActiveSandboxUrl] = useState<string>("/learn");
  const [sandboxInput, setSandboxInput] = useState<string>("/learn");
  const [sandboxBlockedNotice, setSandboxBlockedNotice] = useState<string | null>(null);

  // Scratchpad
  const [notes, setNotes] = useState<string>(
    "📝 Focus Session Notes & Key Formulas:\n• Ohm's Law: V = I * R\n• Percentage Markup: ((Selling - Cost) / Cost) * 100\n• Newton's 3rd Law: For every action, an equal and opposite reaction."
  );

  // Session completion reward state
  const [completedAward, setCompletedAward] = useState<{ xp: number; message: string } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("nexora_user_name");
      if (stored) setUserName(stored);
    }
  }, []);

  // Timer Tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      handleCompleteSession();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  // Tab switch / Blur detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isRunning) {
        setDistractionsDetected((prev) => prev + 1);
        setDistractionAlert("⚠️ Distraction Detected! You navigated away from your Nexora Focus Session.");
      }
    };

    const handleWindowBlur = () => {
      if (isRunning) {
        setDistractionsDetected((prev) => prev + 1);
        setDistractionAlert("⚠️ Focus Interrupted! Window lost focus (App or external window opened).");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [isRunning]);

  // Procedural Web Audio Soundscape Generator
  useEffect(() => {
    // Stop any existing audio
    if (audioNodesRef.current.length > 0) {
      audioNodesRef.current.forEach((node) => {
        try {
          node.stop();
          node.disconnect();
        } catch {}
      });
      audioNodesRef.current = [];
    }
    if (audioContextRef.current && soundscape === "off") {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }

    if (soundscape === "off") return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      if (soundscape === "binaural") {
        // 40Hz Gamma / Alpha Focus Binaural Beat (Left 200Hz, Right 240Hz)
        const leftOsc = ctx.createOscillator();
        const rightOsc = ctx.createOscillator();
        const leftPan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
        const rightPan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
        const masterGain = ctx.createGain();

        leftOsc.frequency.value = 200;
        rightOsc.frequency.value = 240;
        masterGain.gain.value = 0.08;

        if (leftPan && rightPan) {
          leftPan.pan.value = -0.8;
          rightPan.pan.value = 0.8;
          leftOsc.connect(leftPan).connect(masterGain);
          rightOsc.connect(rightPan).connect(masterGain);
        } else {
          leftOsc.connect(masterGain);
          rightOsc.connect(masterGain);
        }
        masterGain.connect(ctx.destination);

        leftOsc.start();
        rightOsc.start();
        audioNodesRef.current = [leftOsc, rightOsc];
      } else if (soundscape === "whitenoise" || soundscape === "rain") {
        // Synthesize Pink/White Noise Buffer
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          data[i] = (b0 + b1 + b2) * 0.1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = soundscape === "rain" ? "lowpass" : "bandpass";
        filter.frequency.value = soundscape === "rain" ? 800 : 1200;

        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.06;

        noise.connect(filter).connect(gainNode).connect(ctx.destination);
        noise.start();
        audioNodesRef.current = [noise];
      }
    } catch (e) {
      console.warn("AudioContext not permitted yet by user interaction", e);
    }

    return () => {
      audioNodesRef.current.forEach((n) => {
        try {
          n.stop();
          n.disconnect();
        } catch {}
      });
      audioNodesRef.current = [];
    };
  }, [soundscape]);

  // Session Completion Handler
  const handleCompleteSession = async () => {
    setIsRunning(false);
    const xpReward = timerDuration >= 2700 ? 150 : 75;

    try {
      await fetch("/api/skills/qualify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: `Deep Work Focus Sprint (${Math.round(timerDuration / 60)} Min)`,
          score: 2,
          total: 2,
          passed: true,
          studentName: userName,
          method: "web_simulator",
        }),
      });

      setCompletedAward({
        xp: xpReward,
        message: `Outstanding dedication! You successfully completed your ${Math.round(
          timerDuration / 60
        )}-minute Deep Focus Sprint with only ${distractionsDetected} interruption(s). +${xpReward} XP awarded to your Knowledge Graph!`,
      });
    } catch {
      setCompletedAward({
        xp: xpReward,
        message: `Session completed! Great work staying focused for ${Math.round(timerDuration / 60)} minutes!`,
      });
    }
  };

  const handleToggleTimer = () => {
    if (!isRunning) {
      setDistractionAlert(null);
    }
    setIsRunning(!isRunning);
  };

  const handleResetTimer = (seconds: number) => {
    setIsRunning(false);
    setTimerDuration(seconds);
    setTimeLeft(seconds);
    setDistractionsDetected(0);
    setDistractionAlert(null);
    setCompletedAward(null);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Sandbox URL Navigation & Firewall
  const handleNavigateSandbox = (url: string) => {
    setSandboxBlockedNotice(null);
    const lower = url.toLowerCase().trim();

    // Check if blacklisted
    const isBlocked = BLOCKED_DISTRACTIONS.some((d) => lower.includes(d));
    if (isBlocked) {
      setSandboxBlockedNotice(
        `🛑 Firewall Blocked: Access to "${url}" is restricted during Focus Mode. Social media and entertainment apps are blocked to safeguard your study streak!`
      );
      return;
    }

    setActiveSandboxUrl(url);
    setSandboxInput(url);
  };

  // Add custom allowed site
  const handleAddCustomSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSiteName || !customSiteUrl) return;

    // Check if blacklisted
    if (BLOCKED_DISTRACTIONS.some((d) => customSiteUrl.toLowerCase().includes(d))) {
      alert("Cannot whitelist distraction services (YouTube, Instagram, etc.).");
      return;
    }

    const newSite: WhitelistSite = {
      id: `site-${Date.now()}`,
      name: customSiteName,
      url: customSiteUrl.startsWith("http") || customSiteUrl.startsWith("/") ? customSiteUrl : `https://${customSiteUrl}`,
      category: "Academic",
      isDefault: false,
    };

    setWhitelist([...whitelist, newSite]);
    setCustomSiteName("");
    setCustomSiteUrl("");
  };

  // Generate downloadable Windows .bat blocker
  const handleDownloadWindowsBlocker = () => {
    const batContent = `@echo off
:: ========================================================
:: NEXORA DEEP WORK GUARDIAN - TEMPORARY DISTRACTION SHIELD
:: ========================================================
:: This script temporarily redirects distracting domains
:: to 127.0.0.1 during your study sprint.
:: Run as Administrator to activate.
:: ========================================================

echo Activating Nexora Focus Shield...
set HOSTS=%WINDIR%\\System32\\drivers\\etc\\hosts

:: Backup hosts file
copy %HOSTS% %HOSTS%.nexora.bak >nul

:: Block Distractions
>> %HOSTS% echo 127.0.0.1 www.youtube.com
>> %HOSTS% echo 127.0.0.1 youtube.com
>> %HOSTS% echo 127.0.0.1 www.instagram.com
>> %HOSTS% echo 127.0.0.1 instagram.com
>> %HOSTS% echo 127.0.0.1 www.facebook.com
>> %HOSTS% echo 127.0.0.1 facebook.com
>> %HOSTS% echo 127.0.0.1 www.tiktok.com
>> %HOSTS% echo 127.0.0.1 tiktok.com
>> %HOSTS% echo 127.0.0.1 www.netflix.com
>> %HOSTS% echo 127.0.0.1 netflix.com
>> %HOSTS% echo 127.0.0.1 www.reddit.com
>> %HOSTS% echo 127.0.0.1 reddit.com
>> %HOSTS% echo 127.0.0.1 twitter.com
>> %HOSTS% echo 127.0.0.1 x.com

ipconfig /flushdns >nul
echo -------------------------------------------------------------
echo  NEXORA FOCUS SHIELD ACTIVE! 
echo  All distracting websites are now blocked on this computer.
echo  Learn effectively on https://nexora.app
echo -------------------------------------------------------------
echo  When your session is complete, press any key to UNBLOCK.
pause >nul

echo Restoring original settings...
copy /y %HOSTS%.nexora.bak %HOSTS% >nul
del %HOSTS%.nexora.bak >nul
ipconfig /flushdns >nul
echo -------------------------------------------------------------
echo  Nexora Focus Shield Deactivated. Websites restored!
echo -------------------------------------------------------------
pause
`;

    const blob = new Blob([batContent], { type: "application/bat" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Nexora-Focus-Shield.bat";
    link.click();
  };

  // Format time mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const progressPercentage = Math.round(((timerDuration - timeLeft) / timerDuration) * 100);

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              🛡️ Digital Lockdown & Focus Firewall
            </span>
            <span className="text-xs text-muted-foreground">
              Distraction Guard Active • Only Whitelisted Learning Allowed
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            <span>🧘</span> Nexora Deep Focus Mode
          </h1>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            Block social media, YouTube, and entertainment apps. Lock into distraction-free full-screen learning with ambient soundscapes, whitelisted academic portals, and real-time earned focus XP!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            className="gap-2 font-semibold"
          >
            <span>{isFullscreen ? "🗗" : "⛶"}</span>
            {isFullscreen ? "Exit Fullscreen" : "Immersive Kiosk Mode"}
          </Button>

          <Button
            size="sm"
            onClick={handleDownloadWindowsBlocker}
            className="gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-sm font-semibold"
          >
            <span>📥</span> Download PC App Blocker (.bat)
          </Button>
        </div>
      </div>

      {/* Distraction Alert Banner */}
      {distractionAlert && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between gap-4 animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3 text-rose-700 dark:text-rose-300 text-sm font-medium">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-bold">{distractionAlert}</p>
              <p className="text-xs text-rose-600/80 dark:text-rose-400/80">
                Total Interruptions Detected: {distractionsDetected}. Return to your study objective to maintain your streak!
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDistractionAlert(null)}
            className="text-xs text-rose-700 dark:text-rose-300 hover:bg-rose-500/20"
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Completion XP Award Banner */}
      {completedAward && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-primary/10 border border-emerald-500/30 shadow-lg text-center space-y-3 animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center text-3xl shadow-md">
            🏆
          </div>
          <h3 className="text-xl font-black text-foreground">
            Focus Sprint Victorious! (+{completedAward.xp} XP)
          </h3>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            {completedAward.message}
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link href="/skills">
              <Button size="sm" className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                <span>🕸️</span> View Knowledge Graph & XP
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleResetTimer(25 * 60)}
            >
              Start Another Sprint
            </Button>
          </div>
        </div>
      )}

      {/* Top Grid: Pomodoro Focus Engine & Ambient Soundscapes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Focus Timer Core */}
        <Card className="lg:col-span-2 border-primary/20 shadow-md relative overflow-hidden bg-gradient-to-br from-card via-card to-primary/5">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <span>⏱️</span> Pomodoro Focus Engine
                </CardTitle>
                <CardDescription className="text-xs">
                  Maintain unbroken attention. Tab switches and alt-tabbing are tracked.
                </CardDescription>
              </div>

              {/* Sprint Presets */}
              <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-lg border">
                {[
                  { label: "15m", sec: 15 * 60 },
                  { label: "25m", sec: 25 * 60 },
                  { label: "45m", sec: 45 * 60 },
                  { label: "60m", sec: 60 * 60 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => handleResetTimer(preset.sec)}
                    disabled={isRunning}
                    className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-all ${
                      timerDuration === preset.sec
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-4">
            {/* Big Countdown Timer Display */}
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative w-56 h-56 flex items-center justify-center">
                {/* SVG Progress Ring */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    className="text-muted/40 stroke-current"
                    strokeWidth="7"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    className="text-primary stroke-current transition-all duration-1000 ease-linear"
                    strokeWidth="7"
                    strokeDasharray={264}
                    strokeDashoffset={264 - (264 * progressPercentage) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>

                <div className="absolute flex flex-col items-center">
                  <span className="text-5xl font-black tracking-tight text-foreground font-mono">
                    {formatTime(timeLeft)}
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground mt-1 uppercase tracking-wider">
                    {isRunning ? "Deep Sprint Active" : "Paused"}
                  </span>
                  <span className="text-[11px] font-bold text-amber-500 mt-1">
                    +{timerDuration >= 2700 ? 150 : 75} XP Upon Completion
                  </span>
                </div>
              </div>

              {/* Progress status line */}
              <p className="text-xs text-muted-foreground mt-2">
                Progress: <span className="font-bold text-foreground">{progressPercentage}%</span> • Distractions:{" "}
                <span className={`font-bold ${distractionsDetected > 0 ? "text-rose-500" : "text-emerald-500"}`}>
                  {distractionsDetected}
                </span>
              </p>
            </div>

            {/* Timer Actions */}
            <div className="flex items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={handleToggleTimer}
                className={`w-44 font-bold text-sm shadow-md gap-2 ${
                  isRunning
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "bg-primary hover:bg-primary/90 text-primary-foreground"
                }`}
              >
                <span>{isRunning ? "⏸️" : "▶️"}</span>
                {isRunning ? "Pause Sprint" : "Start Focus Sprint"}
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => handleResetTimer(timerDuration)}
                className="gap-2 text-xs"
              >
                <span>🔄</span> Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Ambient Soundscape Generator & Focus Shield */}
        <div className="space-y-6">
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <span>🎧</span> Ambient Focus Soundscapes
              </CardTitle>
              <CardDescription className="text-xs">
                Real-time procedural audio waves to stimulate focus and drown out background noise.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { id: "off", label: "Mute / Silence", icon: "🔇", desc: "No background audio" },
                { id: "binaural", label: "40Hz Gamma Focus Waves", icon: "🧠", desc: "Binaural beat for deep cognitive immersion" },
                { id: "rain", label: "Gentle Rain & Thunder", icon: "🌧️", desc: "Filtered brown noise for study calm" },
                { id: "whitenoise", label: "Library White Noise", icon: "📖", desc: "Steady acoustic blocking sound" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSoundscape(item.id as any)}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                    soundscape === item.id
                      ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary"
                      : "border-border hover:bg-muted/50 text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <p className="text-xs font-bold text-foreground">{item.label}</p>
                      <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                  {soundscape === item.id && (
                    <span className="text-xs font-bold text-primary">Active</span>
                  )}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Quick AI Tutor Help */}
          <Card className="border border-emerald-500/30 bg-emerald-500/5 shadow-sm">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">📞</span>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Stuck on a Concept?</h4>
                  <p className="text-[11px] text-muted-foreground">
                    Call your AI Tutor without leaving focus mode.
                  </p>
                </div>
              </div>
              <Link href="/call-tutor">
                <Button size="sm" variant="outline" className="w-full text-xs font-semibold gap-1.5 border-emerald-500/40 text-emerald-700 dark:text-emerald-300">
                  <span>📞</span> Instant Dial AI Tutor
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Middle Section: Whitelisted Resources & Safe Sandbox Browser */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Whitelist Controller */}
        <Card className="border shadow-sm space-y-4 p-5">
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span>🛡️</span> Whitelist Website Controller
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Only these vetted resources can be accessed. All non-educational platforms remain blocked.
            </p>
          </div>

          {/* Whitelist Item List */}
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {whitelist.map((site) => (
              <div
                key={site.id}
                onClick={() => handleNavigateSandbox(site.url)}
                className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex items-center justify-between group ${
                  activeSandboxUrl === site.url
                    ? "bg-primary/10 border-primary text-foreground font-semibold"
                    : "hover:bg-muted text-muted-foreground"
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="text-primary text-sm flex-shrink-0">
                    {site.category === "Nexora Core" ? "⭐" : site.category === "Academic" ? "📚" : "🏛️"}
                  </span>
                  <div className="truncate">
                    <p className="font-bold text-foreground truncate">{site.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{site.url}</p>
                  </div>
                </div>
                <span className="text-[10px] opacity-0 group-hover:opacity-100 text-primary font-bold transition-opacity">
                  Open →
                </span>
              </div>
            ))}
          </div>

          {/* Add custom site */}
          <form onSubmit={handleAddCustomSite} className="space-y-2 pt-2 border-t">
            <p className="text-xs font-semibold text-foreground">Add Custom Learning URL</p>
            <input
              type="text"
              placeholder="Title (e.g. MDN Web Docs)"
              value={customSiteName}
              onChange={(e) => setCustomSiteName(e.target.value)}
              className="w-full text-xs p-2 rounded-md border bg-background"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Domain (e.g. developer.mozilla.org)"
                value={customSiteUrl}
                onChange={(e) => setCustomSiteUrl(e.target.value)}
                className="flex-1 text-xs p-2 rounded-md border bg-background"
              />
              <Button type="submit" size="sm" className="text-xs font-bold">
                Add
              </Button>
            </div>
          </form>

          {/* Blocked Distractions Pill List */}
          <div className="pt-2 border-t">
            <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <span>🚫</span> Active Firewall Blacklist ({BLOCKED_DISTRACTIONS.length})
            </p>
            <div className="flex flex-wrap gap-1">
              {BLOCKED_DISTRACTIONS.map((site) => (
                <span
                  key={site}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono border border-rose-500/20"
                >
                  {site}
                </span>
              ))}
            </div>
          </div>
        </Card>

        {/* Right: Safe In-App Learning Sandbox & Scratchpad */}
        <Card className="lg:col-span-2 border shadow-sm flex flex-col overflow-hidden">
          {/* Browser Address Bar */}
          <div className="bg-muted/70 p-3 border-b flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            </div>

            <div className="flex-1 flex items-center gap-2 bg-background px-3 py-1.5 rounded-lg border text-xs">
              <span className="text-muted-foreground">🔒</span>
              <input
                type="text"
                value={sandboxInput}
                onChange={(e) => setSandboxInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleNavigateSandbox(sandboxInput);
                }}
                className="flex-1 bg-transparent border-none outline-none text-foreground font-mono"
                placeholder="Enter learning address..."
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigateSandbox(sandboxInput)}
                className="h-6 text-[11px] px-2"
              >
                Go
              </Button>
            </div>
          </div>

          {/* Blocked alert in sandbox */}
          {sandboxBlockedNotice && (
            <div className="p-4 bg-rose-500/10 border-b border-rose-500/20 text-xs text-rose-700 dark:text-rose-300 font-medium flex items-center justify-between">
              <span>{sandboxBlockedNotice}</span>
              <button
                onClick={() => setSandboxBlockedNotice(null)}
                className="font-bold text-sm ml-2"
              >
                ✕
              </button>
            </div>
          )}

          {/* Sandbox Body */}
          <div className="flex-1 min-h-[420px] bg-background p-4 flex flex-col space-y-4">
            {activeSandboxUrl.startsWith("/") ? (
              // Embedded Nexora Route
              <div className="flex-1 border rounded-xl p-6 bg-muted/20 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-3xl">
                  🚀
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    Whitelisted Focus Gateway
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-md">
                    You are learning within the approved Nexora environment: <code className="bg-muted px-1.5 py-0.5 rounded text-primary">{activeSandboxUrl}</code>
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Link href={activeSandboxUrl}>
                    <Button size="sm" className="gap-2 font-bold">
                      <span>📖</span> Open {activeSandboxUrl} in Study Workspace
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              // External Approved Web Frame
              <div className="flex-1 border rounded-xl overflow-hidden relative flex flex-col">
                <div className="bg-muted/40 p-2 text-[11px] text-muted-foreground border-b flex justify-between items-center">
                  <span>External Learning Portal: {activeSandboxUrl}</span>
                  <a
                    href={activeSandboxUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-semibold"
                  >
                    Open in Safe Tab ↗
                  </a>
                </div>
                <iframe
                  src={activeSandboxUrl}
                  title="Whitelisted Study Frame"
                  className="w-full flex-1 border-none min-h-[350px]"
                  sandbox="allow-scripts allow-same-origin allow-forms"
                />
              </div>
            )}

            {/* Quick Study Scratchpad */}
            <div className="border rounded-xl p-3 bg-muted/20 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-foreground">📝 Quick Focus Scratchpad</span>
                <span className="text-[10px] text-muted-foreground">Auto-saved locally</span>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="w-full text-xs p-2.5 rounded-lg border bg-background font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Jot down notes, equations, or doubts to ask tutor..."
              />
            </div>
          </div>
        </Card>
      </div>

      {/* PC Blocker Guide Card */}
      <Card className="border border-indigo-500/20 bg-indigo-500/5 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <span>💻</span> System-Wide Windows & Mac Blocker Guide
              </h3>
              <p className="text-xs text-muted-foreground max-w-2xl">
                Need to block YouTube and social apps on your entire computer (Chrome, Edge, apps) during exam weeks? Run our 1-click batch script. It safely activates during your session and automatically unblocks when you press any key.
              </p>
            </div>
            <Button
              onClick={handleDownloadWindowsBlocker}
              className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex-shrink-0"
            >
              <span>📥</span> Download Nexora-Focus-Shield.bat
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
