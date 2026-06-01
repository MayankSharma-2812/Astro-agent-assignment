const toolLabels = {
  compute_birth_chart: "Computing your natal chart...",
  get_daily_transits: "Reading today's planetary transits...",
  knowledge_lookup: "Consulting astrological references...",
  geocode_place: "Locating birthplace coordinates...",
};

export default function ToolActivity({ tools }) {
  if (!tools || tools.length === 0) return null;
  return (
    <div className="tool-activity">
      {tools.map((t, i) => (
        <span key={i} className="tool-pill">⟳ {toolLabels[t] || t}</span>
      ))}
    </div>
  );
}
