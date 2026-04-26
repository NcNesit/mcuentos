"use client";

import { useEffect, useState } from "react";
import AudioControls from "./AudioControls";

function ProgressDots({ story, sceneIndex, compact = false }) {
  return (
    <div className={compact ? "dotProgress dotProgressCompact" : "dotProgress"} aria-hidden="true">
      {story.scenes.map((storyScene, index) => (
        <span
          key={storyScene.id}
          className={index <= sceneIndex ? "isComplete" : ""}
        />
      ))}
    </div>
  );
}

function SceneImage({ scene, imageFailed, setImageFailed, narrated = false }) {
  return (
    <div className={narrated ? "sceneImageStage narratedImageStage" : "sceneImageStage"}>
      {!imageFailed && (
        <img
          className={narrated ? "sceneImage narratedSceneImage" : "sceneImage"}
          src={scene.imageUrl}
          alt=""
          onError={() => setImageFailed(true)}
        />
      )}
      {imageFailed && (
        <div className={narrated ? "scenePlaceholder narratedPlaceholder" : "scenePlaceholder"}>
          <span>{scene.title}</span>
        </div>
      )}
    </div>
  );
}

export default function SceneView({
  story,
  scene,
  sceneIndex,
  playSignal,
  readingMode,
  sleepMode,
  narrationEnabled,
  onSleepModeChange,
  onAudioEnded,
  onAudioUnavailable,
  onPrevious,
  onNext,
  onRestart,
  onBack,
}) {
  const [expanded, setExpanded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const isFirstScene = sceneIndex === 0;
  const isLastScene = sceneIndex === story.scenes.length - 1;
  const isLongText = scene.text.length > 150;
  const isNarratedMode = readingMode === "narrated";

  useEffect(() => {
    setExpanded(readingMode === "parent");
    setImageFailed(false);
  }, [scene.id, readingMode]);

  if (isNarratedMode) {
    return (
      <section className="sceneSlide sceneSlideNarrated" aria-label={scene.title}>
        <div
          className="sceneBackdrop"
          style={{ backgroundImage: imageFailed ? "none" : `url(${scene.imageUrl})` }}
        />

        <header className="narratedHeader">
          <button className="ghostButton narratedBackButton" type="button" onClick={onBack}>
            <span aria-hidden="true">←</span>
            Volver
          </button>

          <div className="narratedHeaderCenter">
            <span className="playerTitle narratedTitle">{scene.title}</span>
            <ProgressDots story={story} sceneIndex={sceneIndex} compact />
          </div>
        </header>

        <SceneImage
          scene={scene}
          imageFailed={imageFailed}
          setImageFailed={setImageFailed}
          narrated
        />

        <div className="narratedControls">
          <AudioControls
            compact
            audioUrl={scene.narrationAudioUrl}
            sceneId={scene.id}
            playSignal={playSignal}
            narrationEnabled={narrationEnabled}
            onEnded={onAudioEnded}
            onUnavailable={onAudioUnavailable}
          />
          <button className="narratedExitButton" type="button" onClick={onBack}>
            Salir del cuento
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="sceneSlide" aria-label={scene.title}>
      <div
        className="sceneBackdrop"
        style={{ backgroundImage: imageFailed ? "none" : `url(${scene.imageUrl})` }}
      />

      <header className="playerHeader">
        <button className="ghostButton" type="button" onClick={onBack}>
          <span aria-hidden="true">←</span>
          Volver
        </button>

        <div className="playerHeaderCenter">
          <span className="playerTitle">El Libro Mágico de Mateo</span>
          <span className="sceneCounter">
            Escena {sceneIndex + 1} de {story.scenes.length}
          </span>
          <ProgressDots story={story} sceneIndex={sceneIndex} />
        </div>

        <div className="playerLogo" aria-hidden="true">
          📖
        </div>
      </header>

      <SceneImage
        scene={scene}
        imageFailed={imageFailed}
        setImageFailed={setImageFailed}
      />

      <div
        className={
          expanded || readingMode === "parent"
            ? "storyPanel isExpanded"
            : "storyPanel"
        }
      >
        <div className="panelTitleRow">
          <div className="sceneMedallion" aria-hidden="true">
            ✦
          </div>
          <div>
            {isLastScene && <p className="endingLabel">¡Fin del cuento!</p>}
            <h1>{scene.title}</h1>
          </div>
          <label className="panelSleepToggle">
            <input
              type="checkbox"
              checked={sleepMode}
              onChange={(event) => onSleepModeChange(event.target.checked)}
            />
            <span>Modo dormir</span>
          </label>
        </div>

        <div className="panelDivider" aria-hidden="true">
          <span />
        </div>

        <div className="storyPanelText">
          <p>{scene.text}</p>
          {isLastScene && (
            <strong className="completionText">
              Mateo completó una nueva aventura.
            </strong>
          )}
          {isLongText && (
            <button
              className="readMoreButton"
              type="button"
              onClick={() => setExpanded((current) => !current)}
            >
              {expanded ? "Ver menos" : "Leer más"}
              <span aria-hidden="true">›</span>
            </button>
          )}
        </div>

        <div className="panelControls">
          <AudioControls
            audioUrl={scene.narrationAudioUrl}
            sceneId={scene.id}
            playSignal={playSignal}
            narrationEnabled={narrationEnabled}
            onEnded={onAudioEnded}
            onUnavailable={onAudioUnavailable}
          />

          <div className="navigationButtons">
            {!isFirstScene && (
              <button className="secondaryButton" type="button" onClick={onPrevious}>
                <span aria-hidden="true">←</span>
                Anterior
              </button>
            )}
            {!isLastScene && (
              <button className="primaryButton" type="button" onClick={onNext}>
                Siguiente
                <span aria-hidden="true">→</span>
              </button>
            )}
            {isLastScene && (
              <>
                <button className="secondaryButton" type="button" onClick={onRestart}>
                  Leer de nuevo
                </button>
                <button className="primaryButton" type="button" onClick={onBack}>
                  Volver a historias
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
