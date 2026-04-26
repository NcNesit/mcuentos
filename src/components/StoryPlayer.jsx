"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import SceneView from "./SceneView";
import {
  initializeSoundEffects,
  playFinalSceneSound,
  playMagicSparkleSound,
  playPageTurnSound,
  stopAllSoundEffects,
} from "@/utils/soundEffects";

export default function StoryPlayer({
  story,
  initialSceneIndex,
  readingMode,
  sleepMode,
  onReadingModeChange,
  onSleepModeChange,
  onBack,
  onProgressChange,
}) {
  const [sceneIndex, setSceneIndex] = useState(initialSceneIndex);
  const [playSignal, setPlaySignal] = useState(0);
  const [autoNarrationEnabled, setAutoNarrationEnabled] = useState(
    readingMode === "narrated"
  );
  const advanceTimerRef = useRef(null);
  const isLastScene = sceneIndex === story.scenes.length - 1;

  const clearAdvanceTimer = useCallback(() => {
    if (advanceTimerRef.current) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    initializeSoundEffects({ sleepMode });
    playMagicSparkleSound({ sleepMode });

    if (readingMode === "narrated") {
      window.setTimeout(() => setPlaySignal((value) => value + 1), 220);
    }

    return () => {
      clearAdvanceTimer();
      stopAllSoundEffects();
    };
  }, []);

  useEffect(() => {
    setAutoNarrationEnabled(readingMode === "narrated");
  }, [readingMode]);

  useEffect(() => {
    onProgressChange(story.id, sceneIndex);
  }, [story.id, sceneIndex, onProgressChange]);

  useEffect(() => {
    if (readingMode === "narrated") {
      setPlaySignal((value) => value + 1);
    }
  }, [sceneIndex, readingMode]);

  function moveToScene(nextIndex, options = {}) {
    clearAdvanceTimer();
    const boundedIndex = Math.min(Math.max(nextIndex, 0), story.scenes.length - 1);
    setSceneIndex(boundedIndex);
    playPageTurnSound({ sleepMode });

    if (options.final) {
      playFinalSceneSound({ sleepMode });
    }
  }

  function handleNext() {
    moveToScene(sceneIndex + 1, { final: sceneIndex + 1 === story.scenes.length - 1 });
  }

  function handlePrevious() {
    moveToScene(sceneIndex - 1);
  }

  function handleRestart() {
    moveToScene(0);
    if (readingMode === "narrated") {
      window.setTimeout(() => setPlaySignal((value) => value + 1), 250);
    }
  }

  function handleAudioEnded() {
    if (!autoNarrationEnabled || readingMode !== "narrated" || isLastScene) {
      if (isLastScene) playFinalSceneSound({ sleepMode });
      return;
    }

    clearAdvanceTimer();
    advanceTimerRef.current = window.setTimeout(() => {
      playMagicSparkleSound({ sleepMode });
      moveToScene(sceneIndex + 1, {
        final: sceneIndex + 1 === story.scenes.length - 1,
      });
    }, 1000);
  }

  function handleAudioUnavailable() {
    setAutoNarrationEnabled(false);
  }

  function handleBack() {
    clearAdvanceTimer();
    stopAllSoundEffects();
    onBack();
  }

  return (
    <main className="playerShell">
      <SceneView
        story={story}
        scene={story.scenes[sceneIndex]}
        sceneIndex={sceneIndex}
        playSignal={playSignal}
        readingMode={readingMode}
        sleepMode={sleepMode}
        narrationEnabled={autoNarrationEnabled}
        onSleepModeChange={onSleepModeChange}
        onAudioEnded={handleAudioEnded}
        onAudioUnavailable={handleAudioUnavailable}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onRestart={handleRestart}
        onBack={handleBack}
      />
    </main>
  );
}
