import ModeToggle from "./ModeToggle";

function getEstimatedDuration(story) {
  const totalWords = story.scenes.reduce(
    (sum, scene) => sum + scene.text.split(/\s+/).length,
    0
  );
  return Math.max(2, Math.ceil(totalWords / 130));
}

function getProgressPercent(story, sceneIndex) {
  if (!story.scenes.length) return 0;
  return Math.round(((sceneIndex + 1) / story.scenes.length) * 100);
}

function StoryCard({ story, isFavorite, onToggleFavorite, onStartStory }) {
  const [firstScene] = story.scenes;

  return (
    <article className={isFavorite ? "storyCard isFavorite" : "storyCard"}>
      <div className="cardImageWrap">
        <img
          src={story.coverImageUrl}
          alt=""
          className="cardImage"
          onError={(event) => {
            event.currentTarget.hidden = true;
          }}
        />
        <div className="imageFallback">
          <span>{firstScene.title}</span>
        </div>
        <button
          className="favoriteButton"
          type="button"
          aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
          aria-pressed={isFavorite}
          onClick={() => onToggleFavorite(story.id)}
        >
          ♥
        </button>
      </div>

      <div className="storyCardBody">
        <h2>{story.title}</h2>
        <div className="cardDivider" aria-hidden="true">
          <span />
        </div>
        <p>{story.description}</p>

        <div className="storyMetaRow" aria-label="Detalles del cuento">
          <span>📖 {story.scenes.length} escenas</span>
          <span>◷ {getEstimatedDuration(story)} min</span>
        </div>

        <button
          className="startStoryButton"
          type="button"
          onClick={() => onStartStory(story.id, 0)}
        >
          <span className="playBadge">▶</span>
          Comenzar historia
        </button>
      </div>
    </article>
  );
}

export default function StoryList({
  stories,
  favoriteIds,
  progress,
  readingMode,
  sleepMode,
  loaded,
  onToggleFavorite,
  onStartStory,
  onReadingModeChange,
  onSleepModeChange,
}) {
  const continueItems = stories
    .map((story) => ({
      story,
      progress: progress[story.id],
    }))
    .filter(({ progress: storyProgress }) => storyProgress?.sceneIndex > 0);

  return (
    <main className="homePage">
      <section className="storybookHero" aria-labelledby="home-title">
        <div className="heroTopBar">
          <div className="mateoAvatar" aria-label="Mateo">
            <span>M</span>
          </div>
          <button
            className={sleepMode ? "homeSleepButton isActive" : "homeSleepButton"}
            type="button"
            aria-pressed={sleepMode}
            onClick={() => onSleepModeChange(!sleepMode)}
          >
            {sleepMode ? "☾" : "⚙"}
          </button>
        </div>

        <div className="heroSparkles" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>

        <div className="heroCopy">
          <h1 id="home-title">El Libro Mágico de Mateo</h1>
          <p>Aventuras narradas para soñar, imaginar y sonreír juntos.</p>
        </div>

        <div className="openBookArt" aria-hidden="true">
          <div className="bookPage left" />
          <div className="bookPage right" />
          <div className="bookGlow" />
        </div>
      </section>

      <section className="homeModes" aria-label="Modos de lectura">
        <ModeToggle
          readingMode={readingMode}
          sleepMode={sleepMode}
          onReadingModeChange={onReadingModeChange}
          onSleepModeChange={onSleepModeChange}
        />
      </section>

      {loaded && continueItems.length > 0 && (
        <section className="continueSection" aria-labelledby="continue-title">
          <div className="sectionTitleRow">
            <span className="sectionIcon">📖</span>
            <h2 id="continue-title">Continuar cuento</h2>
          </div>
          <div className="continueRail">
            {continueItems.map(({ story, progress: storyProgress }) => {
              const sceneIndex = Math.min(
                storyProgress.sceneIndex,
                story.scenes.length - 1
              );
              const percent = getProgressPercent(story, sceneIndex);

              return (
                <button
                  className="continueCard"
                  key={story.id}
                  type="button"
                  onClick={() => onStartStory(story.id, sceneIndex)}
                >
                  <img
                    src={story.coverImageUrl}
                    alt=""
                    onError={(event) => {
                      event.currentTarget.hidden = true;
                    }}
                  />
                  <span className="continueContent">
                    <strong>{story.title}</strong>
                    <span>
                      Escena {sceneIndex + 1} de {story.scenes.length}
                    </span>
                    <span className="progressTrack">
                      <span style={{ width: `${percent}%` }} />
                    </span>
                  </span>
                  <span className="continuePercent">{percent}%</span>
                  <span className="continueArrow">›</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      <section className="storyGrid" aria-label="Historias disponibles">
        {stories.map((story) => (
          <StoryCard
            key={story.id}
            story={story}
            isFavorite={favoriteIds.includes(story.id)}
            onToggleFavorite={onToggleFavorite}
            onStartStory={onStartStory}
          />
        ))}
      </section>

      <nav className="bottomNav" aria-label="Navegación principal">
        <button className="isActive" type="button">
          <span>⌂</span>
          Biblioteca
        </button>
        <button type="button">
          <span>☾</span>
          Hora de soñar
        </button>
        <button type="button">
          <span>★</span>
          Favoritos
        </button>
        <button type="button">
          <span>●</span>
          Mateo
        </button>
      </nav>
    </main>
  );
}
