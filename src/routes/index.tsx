import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Energy Audit — What Your AI Session Cost the Planet" },
      {
        name: "description",
        content:
          "Estimate the energy behind your AI images, video, audio, text and code sessions, translated into everyday equivalents.",
      },
      { property: "og:title", content: "AI Energy Audit" },
      {
        property: "og:description",
        content:
          "Estimate the energy behind your AI images, video, audio, text and code sessions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Kind = "images" | "video" | "audio" | "text" | "code" | "model3d";

const KINDS: { value: Kind; label: string }[] = [
  { value: "images", label: "AI Images" },
  { value: "video", label: "AI Video" },
  { value: "audio", label: "AI Audio" },
  { value: "text", label: "AI Text / Chat" },
  { value: "code", label: "AI Code (Vibe Coding)" },
  { value: "model3d", label: "AI 3D Model" },
];

const PLATFORMS = [
  "Runway",
  "Google Veo / Gemini",
  "Midjourney",
  "DALL·E / ChatGPT (OpenAI)",
  "Claude (Anthropic)",
  "ElevenLabs",
  "Sora",
  "Lovable / Cursor (Vibe Coding)",
  "Other / Unknown",
];

const QUALITY_WH: Record<string, number> = {
  Standard: 1.7,
  HD: 3.58,
};

const RES_WH: Record<string, number> = {
  "480p SD": 65,
  "720p HD": 90,
  "1080p FHD": 110,
  "4K": 150,
};

const CODE_RANGES: { value: string; mid: number }[] = [
  { value: "1–10", mid: 5 },
  { value: "10–50", mid: 30 },
  { value: "50–150", mid: 100 },
  { value: "150–300", mid: 225 },
  { value: "300+", mid: 400 },
];

const CODE_COMPLEXITY: { value: string; emoji: string; sub: string; wh: number }[] = [
  { value: "Simple", emoji: "🪶", sub: "short instructions, small tweaks", wh: 125 },
  { value: "Mixed", emoji: "⚡", sub: "some short, some detailed", wh: 175 },
  { value: "Complex", emoji: "🧱", sub: "long prompts, full feature descriptions, lots of context", wh: 300 },
];

const ASPECT_RATIOS: { value: string; w: number; h: number }[] = [
  { value: "21:9", w: 21, h: 9 },
  { value: "16:9", w: 16, h: 9 },
  { value: "3:2", w: 3, h: 2 },
  { value: "4:3", w: 4, h: 3 },
  { value: "5:4", w: 5, h: 4 },
  { value: "1:1", w: 1, h: 1 },
  { value: "4:5", w: 4, h: 5 },
  { value: "3:4", w: 3, h: 4 },
  { value: "2:3", w: 2, h: 3 },
  { value: "9:16", w: 9, h: 16 },
];

function arShape(w: number, h: number) {
  const scale = 26 / Math.max(w, h);
  return { width: `${Math.max(w * scale, 10)}px`, height: `${Math.max(h * scale, 10)}px` };
}

function num(v: string) {
  const n = parseFloat(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

function Toggle({
  value,
  onChange,
  label,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      <div className="toggle">
        <button
          type="button"
          className={value ? "toggle-btn is-on" : "toggle-btn"}
          onClick={() => onChange(true)}
        >
          Yes
        </button>
        <button
          type="button"
          className={!value ? "toggle-btn is-on" : "toggle-btn"}
          onClick={() => onChange(false)}
        >
          No
        </button>
      </div>
    </div>
  );
}

function Segmented({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  label: string;
}) {
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      <div className="toggle">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            className={value === o ? "toggle-btn is-on" : "toggle-btn"}
            onClick={() => onChange(o)}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function fmt(n: number) {
  if (n < 10) return (Math.round(n * 10) / 10).toString();
  return Math.round(n).toLocaleString();
}

function Index() {
  const [kind, setKind] = useState<Kind>("images");
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [imageCount, setImageCount] = useState("");
  const [imageQuality, setImageQuality] = useState("Standard");
  const [clips, setClips] = useState("");
  const [aspect, setAspect] = useState("16:9");
  const [res, setRes] = useState("720p HD");
  const [secs, setSecs] = useState("");
  const [videoAudio, setVideoAudio] = useState(false);
  const [audioMin, setAudioMin] = useState("");
  const [prompts, setPrompts] = useState("");
  const [complex, setComplex] = useState(false);
  const [codeRange, setCodeRange] = useState("50–150");
  const [codeComplex, setCodeComplex] = useState("Mixed");
  const [models, setModels] = useState("");
  const [result, setResult] = useState<number | null>(null);

  function calculate() {
    let wh = 0;
    if (kind === "images") wh = num(imageCount) * (QUALITY_WH[imageQuality] ?? 1.7);
    if (kind === "video") {
      const per = RES_WH[res] ?? 90;
      const clipScale = num(secs) > 0 ? num(secs) / 8 : 1;
      wh = num(clips) * per * clipScale;
      if (videoAudio) wh *= 1.3;
    }
    if (kind === "audio") wh = num(audioMin) * 20;
    if (kind === "text") wh = num(prompts) * (complex ? 1.7 : 0.17);
    if (kind === "code") {
      const mid = CODE_RANGES.find((r) => r.value === codeRange)?.mid ?? 5;
      const per = CODE_COMPLEXITY.find((c) => c.value === codeComplex)?.wh ?? 125;
      wh = mid * per;
    }
    if (kind === "model3d") wh = num(models) * 1.7;
    setResult(wh);
  }

  const wh = result ?? 0;
  const big = wh >= 1000 ? (wh / 1000).toFixed(2) : wh < 10 ? wh.toFixed(2) : Math.round(wh).toLocaleString();
  const unit = wh >= 1000 ? "kilowatt-hours" : "watt-hours";

  // Two equivalencies, side by side, per threshold logic.
  // Vibe Coding defaults to steaks + refrigerator hours at any scale.
  function equivalencies(): { value: string; label: string }[] {
    const phones = fmt(wh / 12);
    const bulb = fmt(wh / 9);
    const steaks = fmt(wh / 220);
    const fridgeHours = fmt(wh / 62.5);
    const fridgeDays = fmt(wh / 1500);
    const miles = fmt(wh / 330);

    if (kind === "code") {
      return [
        { value: steaks, label: "steaks cooked" },
        { value: fridgeHours, label: "hours of fridge power" },
      ];
    }
    if (wh < 100) {
      return [
        { value: phones, label: "smartphone charges" },
        { value: bulb, label: "LED bulb hours" },
      ];
    }
    if (wh < 1500) {
      return [
        { value: steaks, label: "steaks cooked" },
        { value: phones, label: "smartphone charges" },
      ];
    }
    if (wh < 15000) {
      return [
        { value: fridgeDays, label: "days of fridge power" },
        { value: steaks, label: "steaks cooked" },
      ];
    }
    return [
      { value: fridgeDays, label: "days of fridge power" },
      { value: miles, label: "miles driven" },
    ];
  }

  return (
    <main className="audit">
      {result === null ? (
        <section className="panel">
          <h1 className="headline">Hey, Storyteller.</h1>
          <p className="subline">Let's see what your AI session actually cost the planet.</p>

          <div className="grid">
            <div className="field">
              <label className="field-label">01 — What did you make?</label>
              <select value={kind} onChange={(e) => setKind(e.target.value as Kind)}>
                {KINDS.map((k) => (
                  <option key={k.value} value={k.value}>
                    {k.label}
                  </option>
                ))}
              </select>
            </div>

            {kind === "images" && (
              <>
                <div className="field">
                  <label className="field-label">02 — How many images did you generate?</label>
                  <input type="number" min="0" value={imageCount} onChange={(e) => setImageCount(e.target.value)} placeholder="0" />
                </div>
                <Segmented
                  label="What quality?"
                  value={imageQuality}
                  onChange={setImageQuality}
                  options={Object.keys(QUALITY_WH)}
                />
              </>
            )}

            {kind === "video" && (
              <>
                <div className="field">
                  <label className="field-label">02 — What resolution?</label>
                  <select value={res} onChange={(e) => setRes(e.target.value)}>
                    {Object.keys(RES_WH).map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div className="field ar-field">
                  <label className="field-label">Aspect Ratio</label>
                  <div className="ar-row">
                    {ASPECT_RATIOS.map((a) => (
                      <button
                        key={a.value}
                        type="button"
                        className={aspect === a.value ? "ar-btn is-on" : "ar-btn"}
                        onClick={() => setAspect(a.value)}
                        aria-pressed={aspect === a.value}
                        aria-label={`Aspect ratio ${a.value}`}
                      >
                        <span className="ar-shape" style={arShape(a.w, a.h)}>
                          {aspect === a.value && <span className="ar-check">✓</span>}
                        </span>
                        <span className="ar-ratio">{a.value}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="field">
                  <label className="field-label">How many clips?</label>
                  <input type="number" min="0" value={clips} onChange={(e) => setClips(e.target.value)} placeholder="0" />
                </div>
                <div className="field">
                  <label className="field-label">Approx. seconds per clip?</label>
                  <input type="number" min="0" value={secs} onChange={(e) => setSecs(e.target.value)} placeholder="8" />
                </div>
                <Toggle label="Did it include AI-generated audio?" value={videoAudio} onChange={setVideoAudio} />
              </>
            )}

            {kind === "audio" && (
              <div className="field">
                <label className="field-label">02 — How many minutes of audio generated?</label>
                <input type="number" min="0" value={audioMin} onChange={(e) => setAudioMin(e.target.value)} placeholder="0" />
              </div>
            )}

            {kind === "text" && (
              <>
                <div className="field">
                  <label className="field-label">02 — How many prompts / messages?</label>
                  <input type="number" min="0" value={prompts} onChange={(e) => setPrompts(e.target.value)} placeholder="0" />
                </div>
                <Toggle label="Were any of them complex reasoning tasks?" value={complex} onChange={setComplex} />
              </>
            )}

            {kind === "code" && (
              <>
                <div className="field">
                  <label className="field-label">02 — How many prompts did you send?</label>
                  <div className="toggle code-range">
                    {CODE_RANGES.map((r) => (
                      <button
                        key={r.value}
                        type="button"
                        className={codeRange === r.value ? "toggle-btn is-on" : "toggle-btn"}
                        onClick={() => setCodeRange(r.value)}
                        aria-pressed={codeRange === r.value}
                      >
                        {r.value}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="field">
                  <label className="field-label">How complex were your prompts?</label>
                  <div className="toggle code-complex">
                    {CODE_COMPLEXITY.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        className={codeComplex === c.value ? "toggle-btn is-on" : "toggle-btn"}
                        onClick={() => setCodeComplex(c.value)}
                        aria-pressed={codeComplex === c.value}
                      >
                        <span className="cc-top">
                          {c.emoji} {c.value}
                        </span>
                        <span className="cc-sub">{c.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {kind === "model3d" && (
              <div className="field">
                <label className="field-label">02 — How many models generated?</label>
                <input type="number" min="0" value={models} onChange={(e) => setModels(e.target.value)} placeholder="0" />
                <p className="disclaimer">
                  3D energy data is estimated based on image-generation equivalents as no peer-reviewed data exists yet.
                </p>
              </div>
            )}

            <div className="field">
              <label className="field-label">03 — What platform did you use?</label>
              <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
                {PLATFORMS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <button type="button" className="cta" onClick={calculate}>
            Calculate My Impact
          </button>
        </section>
      ) : (
        <section className="panel result">
          <p className="field-label">Your session used</p>
          <div className="bignum">{big}</div>
          <p className="unit">{unit}</p>
          <div className="equiv-grid">
            {equivalencies().map((e) => (
              <div key={e.label} className="equiv-item">
                <div className="equiv-value">{e.value}</div>
                <div className="equiv-label">{e.label}</div>
              </div>
            ))}
          </div>
          <p className="note">
            Estimates based on peer-reviewed research from Hugging Face, Carnegie Mellon University, MIT, and WSJ
            reporting. Exact figures vary by model and hardware.
          </p>
          <button type="button" className="again" onClick={() => setResult(null)}>
            Calculate Again
          </button>
        </section>
      )}
      <footer className="credit">Built by Professor Anatola Araba for NYU Tisch</footer>
    </main>
  );
}
