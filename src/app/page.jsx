"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import StoryList from "@/components/StoryList";
import StoryPlayer from "@/components/StoryPlayer";
import { stories } from "@/data/stories";
import {
  getFavoriteStories,
  getLastProgress,
  getReadingMode,
  getSleepMode,
  saveFavoriteStories,
  saveLastProgress,
  saveReadingMode,
  saveSleepMode,
} from "@/utils/storage";

export default function HomePage() {
  const [activeStoryId, setActiveStoryId] = useState(null);
  const [initialSceneIndex, setInitialSceneIndex] = useState(0);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [progress, setProgress] = useState({});
  const [readingMode, setReadingMode] = useState("narrated");
  const [sleepMode, setSleepMode] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setFavoriteIds(getFavoriteStories());
    setProgress(getLastProgress());
    setReadingMode(getReadingMode());
    setSleepMode(getSleepMode());
    setLoaded(true);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.sleepMode = sleepMode ? "true" : "false";
  }, [sleepMode]);

  const activeStory = useMemo(
    () => stories.find((story) => story.id === activeStoryId),
    [activeStoryId]
  );

  const handleToggleFavorite = useCallback(function handleToggleFavorite(storyId) {
    setFavoriteIds((currentFavorites) => {
      const nextFavorites = currentFavorites.includes(storyId)
        ? currentFavorites.filter((id) => id !== storyId)
        : [...currentFavorites, storyId];
      saveFavoriteStories(nextFavorites);
      return nextFavorites;
    });
  }, []);

  const handleStartStory = useCallback(function handleStartStory(storyId, sceneIndex = 0) {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    setActiveStoryId(storyId);
    setInitialSceneIndex(sceneIndex);
  }, []);

  const handleProgressChange = useCallback(function handleProgressChange(storyId, sceneIndex) {
    setProgress((currentProgress) => {
      const nextProgress = saveLastProgress(storyId, sceneIndex);
      return { ...currentProgress, ...nextProgress };
    });
  }, []);

  const handleReadingModeChange = useCallback(function handleReadingModeChange(nextMode) {
    setReadingMode(nextMode);
    saveReadingMode(nextMode);
  }, []);

  const handleSleepModeChange = useCallback(function handleSleepModeChange(nextValue) {
    setSleepMode(nextValue);
    saveSleepMode(nextValue);
  }, []);

  if (activeStory) {
    return (
      <StoryPlayer
        story={activeStory}
        initialSceneIndex={initialSceneIndex}
        readingMode={readingMode}
        sleepMode={sleepMode}
        onReadingModeChange={handleReadingModeChange}
        onSleepModeChange={handleSleepModeChange}
        onBack={() => setActiveStoryId(null)}
        onProgressChange={handleProgressChange}
      />
    );
  }

  return (
    <StoryList
      stories={stories}
      favoriteIds={favoriteIds}
      progress={progress}
      readingMode={readingMode}
      sleepMode={sleepMode}
      loaded={loaded}
      onToggleFavorite={handleToggleFavorite}
      onStartStory={handleStartStory}
      onReadingModeChange={handleReadingModeChange}
      onSleepModeChange={handleSleepModeChange}
    />
  );
}
