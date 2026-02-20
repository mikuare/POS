# Animated Login Logo (White BG Removal) Guide

This documents how the login logo animation was implemented so the white square background is removed while the video keeps playing.

## Overview

Directly showing an MP4 keeps its baked white background.  
To remove it in-browser, the app:

1. Loads the MP4 in a hidden `<video>` (source frames).
2. Draws each frame to a `<canvas>`.
3. Makes white and near-white pixels transparent.
4. Repaints continuously for animation.

## 1) HTML structure (`public/index.html`)

Use a wrapper with:

- Hidden source video (`#authLogoVideo`)
- Visible canvas (`#authLogoCanvas`)

```html
<div class="auth-brand-logo-wrap" aria-label="Ruel's Letchon Baka animated logo">
  <video
    id="authLogoVideo"
    class="auth-logo-source"
    src="/live logo/logo live.mp4"
    autoplay
    muted
    loop
    playsinline
  ></video>
  <canvas id="authLogoCanvas" class="auth-brand-logo"></canvas>
</div>
```

## 2) CSS setup (`public/styles.css`)

Canvas is what users see.  
Video is visually hidden but must stay renderable (do **not** use `display: none`).

```css
.auth-brand-logo-wrap {
  width: min(380px, 82%);
  margin-bottom: 20px;
}

.auth-brand-logo {
  width: 100%;
  height: auto;
  display: block;
  background: transparent;
  filter: drop-shadow(0 12px 20px rgba(0, 0, 0, 0.25));
}

.auth-logo-source {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}
```

## 3) JavaScript renderer (`public/app.js`)

Key parts:

- `startAuthLogoRender()` draws video frames to canvas
- Pixel keying removes white-ish colors
- `ensurePlayback()` keeps the source video actively playing

Pseudo flow:

1. Get canvas context with `willReadFrequently: true`
2. On each frame:
   - `drawImage(video, ...)`
   - `getImageData(...)`
   - For each pixel:
     - If `r/g/b > 220`: set alpha to `0` (transparent)
     - If near white: reduce alpha
   - `putImageData(...)`
3. Call `requestAnimationFrame(renderFrame)` continuously
4. Attach playback-resume listeners (`loadeddata`, `canplay`, `pause`, `stalled`, `ended`)

## 4) Why the animation paused before

When the source video was `display: none`, some browsers stopped decoding frames, so canvas appeared frozen.

Fix: keep source video in DOM and renderable (1x1, opacity 0), then force `play()` as needed.

## 5) Tuning white removal

You can adjust thresholds in `public/app.js`:

- Strong white removal: `r > 220 && g > 220 && b > 220`
- Soft edge fade: `r > 190 && g > 185 && b > 180`

If logo details are getting erased, raise thresholds or reduce alpha subtraction.

## 6) If the video is green screen

If your source video has a green background, use chroma key instead of white key.

Replace the pixel test with a green-screen test like:

```js
const isGreen = g > 120 && g > r * 1.25 && g > b * 1.25;
if (isGreen) {
  pixels[i + 3] = 0; // fully transparent
}
```

Optional edge softening (for green spill):

```js
const isNearGreen = g > 100 && g > r * 1.1 && g > b * 1.1;
if (isNearGreen) {
  pixels[i + 3] = Math.max(0, pixels[i + 3] - 120);
}
```

Notes:

- Increase `g` threshold to keep more logo detail.
- Increase multipliers (`1.25`, `1.1`) for stricter green removal.
- If edges look too harsh, reduce alpha subtraction amount.
