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
  const [status, setStatus] = useState("idle");
  const [isUnavailable, setIsUnavailable] = useState(false);

  useEffect(() => {
    onEndedRef.current = onEnded;
    onUnavailableRef.current = onUnavailable;
  }, [onEnded, onUnavailable]);

  useEffect(() => {
    setStatus("idle");
    setIsUnavailable(false);

    if (!audioUrl) {
      setIsUnavailable(true);
      onUnavailableRef.current?.();
      return undefined;
    }

    const audio = new Audio(audioUrl);
    audio.preload = "metadata";
    audioRef.current = audio;

    function handleEnded() {
      setStatus("ended");
      onEndedRef.current?.();
    }

    function handleError() {
      setIsUnavailable(true);
      setStatus("unavailable");
      onUnavailableRef.current?.();
    }

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audioRef.current = null;
    };
  }, [audioUrl, sceneId]);

  useEffect(() => {
    if (!playSignal || !narrationEnabled || isUnavailable) return;
    playAudio();
  }, [playSignal, narrationEnabled, isUnavailable]);

  async function playAudio() {
    const audio = audioRef.current;
    if (!audio || isUnavailable) return;

    try {
      await audio.play();
      setStatus("playing");
    } catch {
      setStatus("idle");
    }
  }

  function pauseAudio() {
    const audio = audioRef.current;
    if (!audio) return;

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
      onClick={isPlaying ? pauseAudio : playAudio}
    >
      <span className="audioIcon" aria-hidden="true">
        {isPlaying ? "Ⅱ" : "▶"}
      </span>
      <span className="audioLabel">{isPlaying ? "Reproduciendo narración" : label}</span>
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
