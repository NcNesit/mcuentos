export default function ModeToggle({
  readingMode,
  sleepMode,
  onReadingModeChange,
  onSleepModeChange,
  compact = false,
}) {
  return (
    <div className={compact ? "modeShell modeShellCompact" : "modeShell"}>
      <div className="segmentedControl" aria-label="Modo de lectura">
        <button
          className={readingMode === "narrated" ? "isSelected" : ""}
          type="button"
          onClick={() => onReadingModeChange("narrated")}
        >
          Modo narrado
        </button>
        <button
          className={readingMode === "parent" ? "isSelected" : ""}
          type="button"
          onClick={() => onReadingModeChange("parent")}
        >
          Leer con papá
        </button>
      </div>

      <label className="sleepToggle">
        <input
          type="checkbox"
          checked={sleepMode}
          onChange={(event) => onSleepModeChange(event.target.checked)}
        />
        <span>Modo dormir</span>
      </label>
    </div>
  );
}
