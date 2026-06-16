import { useState, useEffect } from "react";

const DIMENSIONS = [
  {
    id: "capital",
    label: "Capital Contributed",
    weight: 15,
    description: "Who is putting in money, assets or resources to start BlackAce? How much, and in what form?",
    context: "Consider cash investment, foregone salary, office space, legal costs, or any tangible resource contributed to get BlackAce operational."
  },
  {
    id: "opportunity",
    label: "Opportunity Cost",
    weight: 15,
    description: "What is each founder giving up to build BlackAce?",
    context: "Factor in seniority of role left behind, income foregone, and whether the founder has other active income sources (e.g. eRAI). A founder with no other income source carries a higher opportunity cost."
  },
  {
    id: "operations",
    label: "Operational Role & Time Commitment",
    weight: 20,
    description: "How many hours per week is each founder dedicating exclusively to BlackAce?",
    context: "This is the highest-weighted dimension. Full-time, on-the-ground operational burden — including India entity setup, client delivery, team management and day-to-day decisions — scores highest."
  },
  {
    id: "skills",
    label: "Skills & Domain Expertise",
    weight: 15,
    description: "What unique, hard-to-replace expertise does each founder bring to BlackAce's three verticals?",
    context: "Assess across Finance & Strategy, Infrastructure & Energy, and Emerging Technology. Consider how easily BlackAce could hire someone to replace this expertise externally."
  },
  {
    id: "network",
    label: "Network & Relationships",
    weight: 20,
    description: "Whose relationships are generating the early pipeline and opening institutional doors?",
    context: "Consider government contacts (India, US, Germany, Morocco), financial institution relationships, infrastructure sector contacts, and defence/policy networks. This is the second-highest-weighted dimension as it directly drives BlackAce's early revenue."
  },
  {
    id: "reputation",
    label: "Reputational Collateral",
    weight: 10,
    description: "Whose name and credibility is being publicly put on the line for BlackAce?",
    context: "If BlackAce fails, whose career, institutional standing and long-term reputation takes the larger hit? Consider recognition by the governments of India, US, Germany and Morocco."
  },
  {
    id: "origination",
    label: "Idea & Origination",
    weight: 5,
    description: "Who conceived of BlackAce and developed the initial vision, structure and direction?",
    context: "Whose thinking shaped the institution — the three verticals, the India-US structure, the eRAI relationship, the long-term vision? This is weighted lowest as ideas matter less than execution over time."
  }
];

const VERTICALS = [
  { label: "Finance & Strategy", color: "#C9A84C" },
  { label: "Infrastructure & Energy", color: "#A07C2E" },
  { label: "Emerging Technology", color: "#7A5A1E" }
];

const ESOP_DEFAULT = 10;

const GoldSlider = ({ value, onChange, disabled }) => (
  <div style={{ position: "relative", width: "100%", padding: "4px 0" }}>
    <input
      type="range" min={1} max={10} step={1}
      value={value}
      onChange={e => onChange(Number(e.target.value))}
      disabled={disabled}
      style={{
        width: "100%",
        appearance: "none",
        height: "3px",
        borderRadius: "2px",
        background: `linear-gradient(to right, #C9A84C ${(value - 1) / 9 * 100}%, #2C2C2C ${(value - 1) / 9 * 100}%)`,
        outline: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
      }}
    />
    <style>{`
      input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 16px; height: 16px;
        border-radius: 50%;
        background: #C9A84C;
        cursor: pointer;
        border: 2px solid #0A0A0A;
        box-shadow: 0 0 0 1px #C9A84C;
      }
      input[type=range]::-moz-range-thumb {
        width: 16px; height: 16px;
        border-radius: 50%;
        background: #C9A84C;
        cursor: pointer;
        border: 2px solid #0A0A0A;
      }
    `}</style>
  </div>
);

const PieChart = ({ f1Pct, f2Pct, esopPct, f1Name, f2Name }) => {
  const size = 180;
  const cx = size / 2, cy = size / 2, r = 75, innerR = 38;

  const toRad = (pct, offset) => ((pct / 100) * 2 * Math.PI) + offset - Math.PI / 2;

  const slice = (startPct, endPct, color, offset = 0) => {
    const start = toRad(startPct, offset);
    const end = toRad(endPct, offset);
    const large = (endPct - startPct) > 50 ? 1 : 0;
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    const ix1 = cx + innerR * Math.cos(start);
    const iy1 = cy + innerR * Math.sin(start);
    const ix2 = cx + innerR * Math.cos(end);
    const iy2 = cy + innerR * Math.sin(end);
    if (endPct - startPct <= 0) return null;
    return (
      <path
        d={`M ${ix1} ${iy1} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerR} ${innerR} 0 ${large} 0 ${ix1} ${iy1} Z`}
        fill={color}
      />
    );
  };

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ filter: "drop-shadow(0 0 16px rgba(201,168,76,0.2))" }}>
      {slice(0, f1Pct, "#C9A84C")}
      {slice(f1Pct, f1Pct + f2Pct, "#1C1C1C")}
      {slice(f1Pct + f2Pct, 100, "#3A2E0A")}
      <circle cx={cx} cy={cy} r={innerR} fill="#0A0A0A" />
      <text x={cx} y={cy - 6} textAnchor="middle" fill="#C9A84C" fontSize="8" fontFamily="'Cormorant Garamond', serif" fontWeight="600">{f1Name || "Founder 1"}</text>
      <text x={cx} y={cy + 4} textAnchor="middle" fill="#C9A84C" fontSize="11" fontFamily="'Cormorant Garamond', serif" fontWeight="700">{f1Pct.toFixed(1)}%</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="#555" fontSize="7" fontFamily="'Cormorant Garamond', serif">{f2Pct.toFixed(1)}% · {esopPct}%</text>
    </svg>
  );
};

export default function BlackAceEquityCalculator() {
  const [step, setStep] = useState(0); // 0=intro, 1=names+esop, 2=scoring, 3=results
  const [f1Name, setF1Name] = useState("Managing Partner India");
  const [f2Name, setF2Name] = useState("Managing Partner USA");
  const [esop, setEsop] = useState(ESOP_DEFAULT);
  const [scores, setScores] = useState({
    f1: Object.fromEntries(DIMENSIONS.map(d => [d.id, 5])),
    f2: Object.fromEntries(DIMENSIONS.map(d => [d.id, 5]))
  });
  const [activeDim, setActiveDim] = useState(0);
  const [scoringMode, setScoringMode] = useState("f1"); // f1 first, then f2
  const [showWeights, setShowWeights] = useState(false);

  const setScore = (founder, id, val) => {
    setScores(s => ({ ...s, [founder]: { ...s[founder], [id]: val } }));
  };

  const calcWeightedScore = (founder) => {
    return DIMENSIONS.reduce((sum, d) => sum + (scores[founder][d.id] * d.weight / 10), 0);
  };

  const rawF1 = calcWeightedScore("f1");
  const rawF2 = calcWeightedScore("f2");
  const total = rawF1 + rawF2;
  const f1RatioPct = total > 0 ? (rawF1 / total) * (100 - esop) : 0;
  const f2RatioPct = total > 0 ? (rawF2 / total) * (100 - esop) : 0;

  const styles = {
    wrap: {
      background: "#0A0A0A",
      minHeight: "100vh",
      fontFamily: "'Inter', sans-serif",
      color: "#F0EDE6",
      padding: "0",
    },
    inner: {
      maxWidth: "780px",
      margin: "0 auto",
      padding: "48px 28px 80px",
    },
    label: {
      fontSize: "10px",
      letterSpacing: "0.28em",
      textTransform: "uppercase",
      color: "#C9A84C",
      fontWeight: 500,
      marginBottom: "12px",
      display: "block",
    },
    heading: {
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: "clamp(28px, 5vw, 42px)",
      fontWeight: 700,
      color: "#F0EDE6",
      lineHeight: 1.2,
      marginBottom: "16px",
    },
    body: {
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: "18px",
      fontWeight: 400,
      color: "#A8A49C",
      lineHeight: 1.75,
      marginBottom: "32px",
    },
    card: {
      background: "#1C1C1C",
      padding: "24px 26px",
      marginBottom: "2px",
    },
    btn: {
      background: "#C9A84C",
      color: "#0A0A0A",
      border: "none",
      padding: "12px 28px",
      fontSize: "12px",
      fontWeight: 600,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      cursor: "pointer",
      fontFamily: "'Inter', sans-serif",
    },
    btnGhost: {
      background: "transparent",
      color: "#C9A84C",
      border: "1px solid #C9A84C",
      padding: "11px 24px",
      fontSize: "12px",
      fontWeight: 500,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      cursor: "pointer",
      fontFamily: "'Inter', sans-serif",
    },
    input: {
      background: "#141414",
      border: "1px solid #2C2C2C",
      color: "#F0EDE6",
      padding: "10px 14px",
      fontSize: "14px",
      fontFamily: "'Inter', sans-serif",
      width: "100%",
      outline: "none",
    },
    rule: {
      border: "none",
      borderTop: "1px solid #2C2C2C",
      margin: "32px 0",
    },
    dimTitle: {
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: "20px",
      fontWeight: 600,
      color: "#F0EDE6",
      marginBottom: "6px",
    },
    dimDesc: {
      fontSize: "13px",
      color: "#A8A49C",
      lineHeight: 1.6,
      marginBottom: "6px",
    },
    dimContext: {
      fontSize: "12px",
      color: "#6A6660",
      lineHeight: 1.6,
      fontStyle: "italic",
      marginBottom: "20px",
      borderLeft: "2px solid #2C2C2C",
      paddingLeft: "12px",
    },
    scoreNum: {
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: "48px",
      fontWeight: 700,
      color: "#C9A84C",
      lineHeight: 1,
    },
    progress: {
      background: "#1C1C1C",
      height: "3px",
      width: "100%",
      marginBottom: "40px",
    },
    progressFill: {
      background: "#C9A84C",
      height: "100%",
      transition: "width 0.4s ease",
    },
    tag: {
      display: "inline-block",
      padding: "3px 10px",
      border: "1px solid #C9A84C",
      color: "#C9A84C",
      fontSize: "10px",
      fontWeight: 500,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      marginRight: "6px",
      marginBottom: "6px",
    }
  };

  const totalSteps = DIMENSIONS.length;
  const progressPct = step === 2 ? (activeDim / totalSteps) * 100 : 0;

  // STEP 0 — INTRO
  if (step === 0) return (
    <div style={styles.wrap}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <div style={styles.inner}>
        <span style={styles.label}>BlackAce ♠ Internal Tool</span>
        <div style={styles.heading}>Equity Distribution<br />Calculator</div>
        <p style={styles.body}>
          This tool calculates a fair, responsibility-weighted equity split between the two BlackAce co-founders.
          It is based on seven dimensions of contribution, each weighted by its importance to BlackAce's
          institutional success. Both founders score independently, then compare.
        </p>

        <div style={{ marginBottom: "32px" }}>
          {DIMENSIONS.map(d => (
            <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #1C1C1C" }}>
              <span style={{ fontSize: "14px", color: "#F0EDE6" }}>{d.label}</span>
              <span style={{ fontSize: "12px", color: "#C9A84C", fontWeight: 600 }}>{d.weight}%</span>
            </div>
          ))}
        </div>

        <div style={{ background: "#1C1C1C", padding: "20px 22px", marginBottom: "32px", borderLeft: "3px solid #C9A84C" }}>
          <p style={{ fontSize: "13px", color: "#A8A49C", lineHeight: 1.7, margin: 0 }}>
            Each dimension is scored 1–10 by each founder independently. The weighted average produces
            a ratio. An ESOP pool is carved out first. The remainder is split by the ratio.
            <strong style={{ color: "#F0EDE6" }}> This is a starting point for an honest conversation — not a legally binding document.</strong>
          </p>
        </div>

        <button style={styles.btn} onClick={() => setStep(1)}>Begin the Assessment →</button>
      </div>
    </div>
  );

  // STEP 1 — NAMES + ESOP
  if (step === 1) return (
    <div style={styles.wrap}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <div style={styles.inner}>
        <span style={styles.label}>Step 1 of 3 &nbsp;·&nbsp; Setup</span>
        <div style={styles.heading}>Name the Founders &<br />Set the ESOP Pool</div>

        <div style={{ marginBottom: "28px" }}>
          <label style={{ ...styles.label, marginBottom: "8px" }}>Founder 1 — India</label>
          <input style={styles.input} value={f1Name} onChange={e => setF1Name(e.target.value)} placeholder="e.g. Managing Partner India" />
        </div>
        <div style={{ marginBottom: "36px" }}>
          <label style={{ ...styles.label, marginBottom: "8px" }}>Founder 2 — USA</label>
          <input style={styles.input} value={f2Name} onChange={e => setF2Name(e.target.value)} placeholder="e.g. Managing Partner USA" />
        </div>

        <hr style={styles.rule} />

        <label style={styles.label}>ESOP Pool — {esop}%</label>
        <p style={{ fontSize: "13px", color: "#A8A49C", marginBottom: "16px", lineHeight: 1.6 }}>
          Equity reserved for future key hires — Vertical Heads, Senior Legal Counsel, strategic talent.
          Recommended: 10–15%. This is carved out before the founder split is calculated.
        </p>
        <GoldSlider value={esop} onChange={setEsop} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#6A6660", marginTop: "6px", marginBottom: "32px" }}>
          <span>5% (minimal)</span><span style={{ color: "#C9A84C" }}>{esop}% ESOP</span><span>20% (generous)</span>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button style={styles.btnGhost} onClick={() => setStep(0)}>← Back</button>
          <button style={styles.btn} onClick={() => { setStep(2); setScoringMode("f1"); setActiveDim(0); }}>Start Scoring →</button>
        </div>
      </div>
    </div>
  );

  // STEP 2 — SCORING
  if (step === 2) {
    const isF1Phase = scoringMode === "f1";
    const founderLabel = isF1Phase ? f1Name : f2Name;
    const founderKey = isF1Phase ? "f1" : "f2";
    const dim = DIMENSIONS[activeDim];
    const currentScore = scores[founderKey][dim.id];
    const isLastDim = activeDim === DIMENSIONS.length - 1;

    const next = () => {
      if (!isLastDim) {
        setActiveDim(activeDim + 1);
      } else if (isF1Phase) {
        setScoringMode("f2");
        setActiveDim(0);
      } else {
        setStep(3);
      }
    };

    const prev = () => {
      if (activeDim > 0) {
        setActiveDim(activeDim - 1);
      } else if (!isF1Phase) {
        setScoringMode("f1");
        setActiveDim(DIMENSIONS.length - 1);
      }
    };

    const overallProgress = isF1Phase
      ? (activeDim / (DIMENSIONS.length * 2)) * 100
      : (50 + activeDim / (DIMENSIONS.length * 2) * 100);

    return (
      <div style={styles.wrap}>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <div style={styles.inner}>
          <div style={styles.progress}><div style={{ ...styles.progressFill, width: `${overallProgress}%` }} /></div>

          <span style={styles.label}>
            Scoring: <span style={{ color: "#F0EDE6" }}>{founderLabel}</span>
            &nbsp;·&nbsp; Dimension {activeDim + 1} of {DIMENSIONS.length}
            &nbsp;·&nbsp; {isF1Phase ? "Round 1 of 2" : "Round 2 of 2"}
          </span>

          <div style={styles.heading}>{dim.label}</div>
          <p style={styles.dimDesc}>{dim.description}</p>
          <p style={styles.dimContext}>{dim.context}</p>

          <div style={{ background: "#141414", padding: "2px", marginBottom: "24px" }}>
            <div style={{ background: "#1C1C1C", padding: "28px 26px" }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "16px", marginBottom: "20px" }}>
                <div style={styles.scoreNum}>{currentScore}</div>
                <div style={{ paddingBottom: "10px" }}>
                  <div style={{ fontSize: "12px", color: "#C9A84C", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    {currentScore <= 2 ? "Minimal" : currentScore <= 4 ? "Below Average" : currentScore <= 6 ? "Moderate" : currentScore <= 8 ? "Strong" : "Exceptional"}
                  </div>
                  <div style={{ fontSize: "12px", color: "#6A6660" }}>out of 10 &nbsp;·&nbsp; Weight: {dim.weight}%</div>
                </div>
              </div>
              <GoldSlider value={currentScore} onChange={v => setScore(founderKey, dim.id, v)} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#6A6660", marginTop: "8px" }}>
                <span>1 — Minimal</span>
                <span>5 — Moderate</span>
                <span>10 — Exceptional</span>
              </div>
            </div>
          </div>

          {/* Context dots for all dimensions */}
          <div style={{ display: "flex", gap: "6px", marginBottom: "32px", flexWrap: "wrap" }}>
            {DIMENSIONS.map((d, i) => (
              <div
                key={d.id}
                onClick={() => setActiveDim(i)}
                style={{
                  width: "28px", height: "28px",
                  background: i === activeDim ? "#C9A84C" : scores[founderKey][d.id] !== 5 ? "#2C2C2C" : "#141414",
                  border: `1px solid ${i === activeDim ? "#C9A84C" : "#2C2C2C"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "10px", color: i === activeDim ? "#0A0A0A" : "#6A6660",
                  cursor: "pointer", fontWeight: 600,
                }}
              >{scores[founderKey][d.id]}</div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button style={styles.btnGhost} onClick={prev}>← Back</button>
            <button style={styles.btn} onClick={next}>
              {isLastDim && !isF1Phase ? "See Results →" : isLastDim ? `Score ${f2Name} →` : "Next →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 3 — RESULTS
  if (step === 3) {
    const gap = Math.abs(f1RatioPct - f2RatioPct);
    const interpretation = gap < 5
      ? "The scores suggest an essentially equal partnership. A 50/50 split with an ESOP carve-out is well justified."
      : gap < 15
      ? "A modest but meaningful difference. Consider whether the higher-scoring founder's greater contribution is structural and long-term, or front-loaded in the early phase."
      : "A significant difference exists. This warrants an honest conversation about whether the split reflects the long-term picture or just the current phase. Consider a vesting schedule to manage this.";

    return (
      <div style={styles.wrap}>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <div style={styles.inner}>
          <span style={styles.label}>BlackAce ♠ &nbsp;·&nbsp; Equity Assessment Results</span>
          <div style={styles.heading}>Your Suggested<br />Equity Distribution</div>

          {/* PIE + SUMMARY */}
          <div style={{ display: "flex", gap: "40px", alignItems: "center", flexWrap: "wrap", marginBottom: "40px" }}>
            <PieChart f1Pct={f1RatioPct} f2Pct={f2RatioPct} esopPct={esop} f1Name={f1Name} f2Name={f2Name} />
            <div style={{ flex: 1, minWidth: "200px" }}>
              {[
                { name: f1Name, pct: f1RatioPct, color: "#C9A84C" },
                { name: f2Name, pct: f2RatioPct, color: "#3A3A3A" },
                { name: "ESOP Pool", pct: esop, color: "#3A2E0A" },
              ].map(item => (
                <div key={item.name} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: item.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "13px", color: "#F0EDE6", fontWeight: 500 }}>{item.name}</div>
                    <div style={{ fontSize: "11px", color: "#A8A49C" }}>
                      {item.pct.toFixed(1)}% equity
                    </div>
                  </div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", fontWeight: 700, color: item.color }}>
                    {item.pct.toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* INTERPRETATION */}
          <div style={{ background: "#1C1C1C", borderLeft: "3px solid #C9A84C", padding: "20px 22px", marginBottom: "32px" }}>
            <span style={styles.label}>Interpretation</span>
            <p style={{ fontSize: "14px", color: "#A8A49C", lineHeight: 1.7, margin: 0 }}>{interpretation}</p>
          </div>

          {/* DIMENSION BREAKDOWN */}
          <span style={styles.label}>Dimension Breakdown</span>
          <div style={{ marginBottom: "32px" }}>
            {DIMENSIONS.map(d => {
              const s1 = scores.f1[d.id];
              const s2 = scores.f2[d.id];
              const diff = s1 - s2;
              return (
                <div key={d.id} style={{ padding: "14px 0", borderBottom: "1px solid #1C1C1C" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "13px", color: "#F0EDE6" }}>{d.label}</span>
                    <span style={{ fontSize: "11px", color: "#6A6660" }}>weight: {d.weight}%</span>
                  </div>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <span style={{ fontSize: "11px", color: "#C9A84C", width: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f1Name.split(" ").slice(-1)}: {s1}/10</span>
                    <div style={{ flex: 1, height: "4px", background: "#141414", position: "relative" }}>
                      <div style={{ position: "absolute", left: 0, height: "100%", width: `${s1 * 10}%`, background: "#C9A84C", opacity: 0.7 }} />
                      <div style={{ position: "absolute", left: 0, top: "6px", height: "4px", width: `${s2 * 10}%`, background: "#444" }} />
                    </div>
                    <span style={{ fontSize: "11px", color: "#A8A49C", width: "120px", textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f2Name.split(" ").slice(-1)}: {s2}/10</span>
                  </div>
                  {diff !== 0 && (
                    <div style={{ fontSize: "11px", color: diff > 0 ? "#C9A84C" : "#7A5A1E", marginTop: "6px", fontStyle: "italic" }}>
                      {diff > 0 ? `${f1Name.split(" ").slice(-1)} scores ${diff} point${Math.abs(diff) > 1 ? "s" : ""} higher` : `${f2Name.split(" ").slice(-1)} scores ${Math.abs(diff)} point${Math.abs(diff) > 1 ? "s" : ""} higher`}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* RECOMMENDATIONS */}
          <span style={styles.label}>Next Steps</span>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginBottom: "40px" }}>
            {[
              "Both founders complete this assessment independently, without discussing scores first.",
              "Compare results. Where scores diverge significantly, have a structured conversation about why.",
              "Apply a 4-year vesting schedule with a 1-year cliff to both founders' equity.",
              "Finalise the ESOP pool percentage and identify the first 2–3 roles it will be used for.",
              "Have a corporate lawyer draft the Shareholders' Agreement and Founders' Operating Agreement.",
              "Set a Year 2 review date to reassess whether roles and contributions have shifted."
            ].map((step, i) => (
              <div key={i} style={{ background: "#1C1C1C", padding: "14px 18px", display: "flex", gap: "14px" }}>
                <span style={{ color: "#C9A84C", fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 700, flexShrink: 0 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ fontSize: "13px", color: "#A8A49C", lineHeight: 1.6 }}>{step}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button style={styles.btnGhost} onClick={() => { setStep(2); setScoringMode("f1"); setActiveDim(0); }}>← Rescore</button>
            <button style={styles.btn} onClick={() => { setStep(0); setScores({ f1: Object.fromEntries(DIMENSIONS.map(d => [d.id, 5])), f2: Object.fromEntries(DIMENSIONS.map(d => [d.id, 5])) }); }}>Start Over</button>
          </div>

          <div style={{ marginTop: "60px", textAlign: "center", fontSize: "11px", color: "#3A3A3A", letterSpacing: "0.22em", textTransform: "uppercase" }}>
            BlackAce ♠ &nbsp;·&nbsp; Internal Use Only &nbsp;·&nbsp; Confidential
          </div>
        </div>
      </div>
    );
  }
}
