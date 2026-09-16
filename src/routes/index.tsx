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

const RES_WH: Record<string, number> = {
  "480p SD": 65,
  "720p HD": 90,
  "1080p FHD": 110,
  "4K": 150,
};

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

function Index() {
  const [kind, setKind] = useState<Kind>("images");
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [imageCount, setImageCount] = useState("");
  const [res, setRes] = useState("720p HD");
  const [clips, setClips] = useState("");
  const [secs, setSecs] = useState("");
  const [videoAudio, setVideoAudio] = useState(false);
  const [audioMin, setAudioMin] = useState("");
  const [prompts, setPrompts] = useState("");
  const [complex, setComplex] = useState(false);
  const [hours, setHours] = useState("");
  const [models, setModels] = useState("");
  const [result, setResult] = useState<number | null>(null);

  function calculate() {
    let wh = 0;
    if (kind === "images") wh = num(imageCount) * 1.7;
    if (kind === "video") {
      const per = RES_WH[res] ?? 90;
      const clipScale = num(secs) > 0 ? num(secs) / 8 : 1;
      wh = num(clips) * per * clipScale;
      if (videoAudio) wh *= 1.3;
    }
    if (kind === "audio") wh = num(audioMin) * 20;
    if (kind === "text") wh = num(prompts) * (complex ? 1.7 : 0.17);
    if (kind === "code") wh = num(hours) * 1250;
    if (kind === "model3d") wh = num(models) * 1.7;
    setResult(wh);
  }

  const wh = result ?? 0;
  const big = wh >= 1000 ? (wh / 1000).toFixed(2) : wh < 10 ? wh.toFixed(2) : Math.round(wh).toLocaleString();
  const unit = wh >= 1000 ? "kilowatt-hours" : "watt-hours";

  function equivalencies(): string {
    const fridge = (wh / 40).toFixed(wh / 40 < 10 ? 1 : 0);
    if (wh < 50) {
      const phones = (wh / 10).toFixed(wh / 10 < 10 ? 1 : 0);
      return `That's like ${phones} full smartphone charges.`;
    }
    if (wh <= 500) {
      const bulb = Math.round(wh / 9);
      return `That's like leaving a light bulb on for ${bulb} hours — or powering your fridge for ${fridge} days.`;
    }
    if (wh <= 5000) {
      const steaks = Math.round(wh / 220);
      return `That's like grilling ${steaks} steaks on an electric grill — or powering your fridge for ${fridge} days.`;
    }
    const miles = (wh / 330).toFixed(1);
    return `That's like driving ${miles} miles in a gas car — or powering your fridge for ${fridge} days.`;
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
              <div className="field">
                <label className="field-label">02 — How many images did you generate?</label>
                <input type="number" min="0" value={imageCount} onChange={(e) => setImageCount(e.target.value)} placeholder="0" />
              </div>
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
                <Toggle label="Complex reasoning tasks?" value={complex} onChange={setComplex} />
              </>
            )}

            {kind === "code" && (
              <div className="field">
                <label className="field-label">02 — How many hours was the session?</label>
                <input type="number" min="0" step="0.25" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="0" />
              </div>
            )}

            {kind === "model3d" && (
              <div className="field">
                <label className="field-label">02 — How many models generated?</label>
                <input type="number" min="0" value={models} onChange={(e) => setModels(e.target.value)} placeholder="0" />
                <p className="disclaimer">
                  3D energy data is estimated from image-generation equivalents — no peer-reviewed figures exist yet.
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
          <p className="equiv">{equivalencies()}</p>
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
