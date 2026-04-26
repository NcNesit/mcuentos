"use client";

import { useEffect, useRef, useState } from "react";

export default function AudioControls({
  audioUrl,
  sceneId,
  playSignal,
  narrationEnabled,
  onEnded,
  onUnavailable,
}) {
  const audioRef = useRef(null);
  const onEndedRef = useRef(onEnded);
  const onUnavailableRef = useRef(onUnavailable);
  const pendingPlayRef = useRef(false);
  const lastPlaySignalRef = useRef(0);
  const [status, setStatus] = useState("idle");
  const [isUnavailable, setIsUnavailable] = useState(false);

  useEffect(() => {
    onEndedRef.current = onEnded;
    onUnavailableRef.current = onUnavailable;
  }, [onEnded, onUnavailable]);

  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.preload = "auto";
      audioRef.current = audio;
    }

    const audio = audioRef.current;

    function handleEnded() {
      pendingPlayRef.current = false;
      setStatus("ended");
      onEndedRef.current?.();
    }

    function handleError() {
      pendingPlayRef.current = false;
      setIsUnavailable(true);
      setStatus("unavailable");
      onUnavailableRef.current?.();
    }

    function handleCanPlay() {
      if (pendingPlayRef.current) {
        pendingPlayRef.current = false;
        playAudio();
      }
    }

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    audio.addEventListener("canplay", handleCanPlay);

    return () => {
      pendingPlayRef.current = false;
      audio.pause();
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    pendingPlayRef.current = false;
    setStatus("idle");
    setIsUnavailable(false);

    if (!audioUrl || !audio) {
      setIsUnavailable(true);
      onUnavailableRef.current?.();
      return;
    }

    audio.pause();
    audio.currentTime = 0;
    audio.src = audioUrl;
    audio.load();

    if (narrationEnabled && playSignal > 0) {
      pendingPlayRef.current = true;
      if (audio.readyState >= 3) {
        pendingPlayRef.current = false;
        playAudio();
      }
    }
  }, [audioUrl, sceneId]);

  useEffect(() => {
    if (!playSignal || !narrationEnabled || isUnavailable) return;
    if (playSignal === lastPlaySignalRef.current) return;

    lastPlaySignalRef.current = playSignal;
    requestPlay();
  }, [playSignal, narrationEnabled, isUnavailable]);

  function requestPlay() {
    const audio = audioRef.current;
    if (!audio || isUnavailable) return;

    if (audio.readyState < 3) {
      pendingPlayRef.current = true;
      audio.load();
      return;
    }

    playAudio();
  }

  async function playAudio() {
    const audio = audioRef.current;
    if (!audio || isUnavailable) return;

    try {
      pendingPlayRef.current = false;
      await audio.play();
      setStatus("playing");
    } catch {
      pendingPlayRef.current = false;
      setStatus("idle");
    }
  }

  function pauseAudio() {
    const audio = audioRef.current;
    if (!audio) return;

    pendingPlayRef.current = false;
    audio.pause();
    setStatus("paused");
  }

  if (isUnavailable) {
    return (
      <p className="audioUnavailable">
        <span>✦</span>
        Narración no disponible
      </p>
    );
  }

  const isPlaying = status === "playing";
  const label = isPlaying
    ? "Pausar narración"
    : status === "paused"
      ? "Reanudar narración"
      : "Reproducir narración";

  return (
    <button
      className={isPlaying ? "audioButton isPlaying" : "audioButton"}
      type="button"
      onClick={isPlaying ? pauseAudio : requestPlay}
    >
      <span className="audioIcon" aria-hidden="true">
        {isPlaying ? "Ⅱ" : "▶"}
      </span>
      <span className="audioLabel">
        {isPlaying ? "Reproduciendo narración" : label}
      </span>
      <span className="waveform" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
        <i />
      </span>
    </button>
  );
}
