# AI Energy Footprint

You're right, it's all there. Writing it now.

AI ENERGY AUDIT CALCULATOR — VIBE CODING PROMPT

Build a single-page web app called the AI Energy Audit. No frameworks needed. Clean HTML, CSS, JavaScript.

VISUAL DESIGN

Background: light grey (#F2F2F2)

Primary text: near-black (#1A1A1A), bold, heavy weight

Accent color: deep NYU purple (#57068C)

Font stack: Rajdhani, Rampart One, or Roboto — load from Google Fonts. Headlines massive, UI labels small and light

Apple-level whitespace. Minimal. Nothing decorative. Every element earns its place.

One page, no scrolling if possible. The result appears on the same screen.

Bottom of page, very small grey text: Built by Professor Anatola Araba for NYU Tisch

FLOW

Screen 1 — Input

Greeting headline (large, bold): "Hey, Storyteller."
Subline (small, light): "Let's see what your AI session actually cost the planet."

Then three sequential inputs:

Step 1 — What did you make?
Dropdown:

AI Images

AI Video

AI Audio

AI Text / Chat

AI Code (Vibe Coding)

AI 3D Model

Step 2 — Tell us more (fields change dynamically based on Step 1 selection)

Images: How many images did you generate? (number input)

Video: What resolution? (dropdown: 480p SD / 720p HD / 1080p FHD / 4K) + How many clips? (number) + Approx. seconds per clip? (number) + Did it include AI-generated audio? (yes/no toggle)

Audio: How many minutes of audio generated? (number)

Text / Chat: How many prompts / messages? (number) + Were any of them complex reasoning tasks? (yes/no toggle)

Code (Vibe Coding): How many hours was the session? (number)

3D Model: How many models generated? (number) (Note: display a small disclaimer that 3D energy data is estimated based on image-generation equivalents as no peer-reviewed data exists yet)

Step 3 — What platform did you use?
Dropdown:

Runway

Google Veo / Gemini

Midjourney

DALL-E / ChatGPT (OpenAI)

Claude (Anthropic)

ElevenLabs

Sora

Lovable / Cursor (Vibe Coding)

Other / Unknown

Big purple CTA button: "Calculate My Impact"

CALCULATION LOGIC

Use midpoint estimates from the source data only. Do not invent figures.

Content Type Energy per unit Source basis AI Image (standard) 1.7 Wh per image WSJ / Hugging Face / Carnegie Mellon AI Video SD (6–8 sec clip) 65 Wh per clip Hugging Face midpoint (20–110 Wh range) AI Video HD 720p (8 sec) 90 Wh per clip CNET / Hugging Face (~90 Wh avg) AI Video 1080p (8 sec) 110 Wh per clip Upper range, Hugging Face AI Video 4K 150 Wh per clip Extrapolated upper bound, flagged as estimate + AI Audio added to video multiply clip total × 1.3 Audio adds ~30% overhead per source data AI Audio only 20 Wh per minute Midpoint of 10–30 Wh/min range AI Text / simple prompt 0.17 Wh per prompt WSJ (lightweight Llama single GPU) AI Text / complex reasoning 1.7 Wh per prompt WSJ (large multi-GPU Llama) Vibe Coding session 1,250 Wh per hour Midpoint of 500–2,000 Wh/hr range 3D Model 1.7 Wh per model Estimated at image-generation equivalent, flagged

Total output = sum of all inputs in Wh, then convert to kWh if over 1,000 Wh.

OUTPUT SCREEN

Same page — inputs slide up or fade, result takes center stage.

Display the total energy in a massive, bold number (purple accent color), unit label beneath it in small text.

Below that, show two equivalencies side by side, pulled from this list based on which is most dramatic/relatable for the calculated amount:

Equivalency Conversion Smartphone charges 1 full charge = 10 Wh Refrigerator days 1 day = 40 Wh LED bulb hours 1 hour = 9 Wh Miles driven (gas car) 1 mile = 330 Wh Minutes of TV (65" OLED) 1 min = 2.43 Wh (146W draw) Steaks cooked on electric grill 1 steak = 220 Wh

Logic: if result is under 50 Wh, use smartphone charges. If 50–500 Wh, use bulb hours + fridge days. If over 500 Wh, use steaks + fridge days. If over 5,000 Wh, use miles driven + fridge days.

Example output line: "That's like leaving a light bulb on for 47 hours — or powering your fridge for 3 days."

Small note beneath in grey: "Estimates based on peer-reviewed research from Hugging Face, Carnegie Mellon University, MIT, and WSJ reporting. Exact figures vary by model and hardware."

Small "Calculate Again" link to reset.

TONE THROUGHOUT

Not preachy. Not a guilt trip. Curious, direct, a little cinematic. This is for filmmakers — they can handle the truth.

That's your prompt. Paste it into Lovable, Cursor, or whatever you're using and it should be ready to go with minimal back-and-forth. Want me to tighten any section or add anything before you paste?

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://aienergycalculator.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b30b954b-b1ff-4c26-a0ff-beac6abf238b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
