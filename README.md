<div align="center">

# 🪐 Solar Sandbox

**An interactive 3D solar system simulation built with p5.js — orbiting planets, a moons-carrying Earth, and full real-time control over size, distance, and speed.**

p5.js · WebGL 3D · JavaScript

<br>

[![🚀 Live Demo](https://img.shields.io/badge/🚀_Live_Demo-solar--sandbox--three.vercel.app-6E45E2?style=for-the-badge&labelColor=1a1a2e)](https://solar-sandbox-three.vercel.app/)

<br>

![p5.js](https://img.shields.io/badge/p5.js-ED225D?style=flat-square&logo=p5dotjs&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)

</div>

---

## 📌 Table of Contents

- [About](#-about)
- [Controls](#-controls)
- [Project Structure](#%EF%B8%8F-project-structure)
- [Getting Started](#-getting-started)

## 👋 About

An interactive 3D solar system simulation built for SENG-3040. The entire simulation lives in a single `SolarSystem` class that encapsulates the stars, sun, planets, and all drawing logic. Earth (with its own orbiting moon) starts with realistic-ish defaults, and every parameter — orbital distance, orbit speed, rotation speed, planet and moon size — can be adjusted live with on-screen sliders. You can even spawn your own custom planets, each with its own moon, size, color, and orbit, and pause or reset the whole system at any time.

## 🎛️ Controls

| Control | What it does |
| --- | --- |
| Earth distance / orbit speed / rotation speed sliders | Adjust Earth's orbit radius, how fast it circles the sun, and its spin |
| Moon distance / orbit speed sliders | Adjust the moon's orbit around Earth |
| Planet size / distance / speed sliders | Set up a custom planet before creating it |
| Planet-moon size / distance / speed sliders | Give a custom planet its own moon |
| Planet color | Pick a color for custom planets |
| Create / remove planet | Add a custom planet to the system or take one out |
| Star button | Regenerate the random starfield |
| Pause / Reset | Freeze the simulation or restore all defaults |

Defaults out of the box: 100 stars, Earth orbiting at distance 200 with the moon at distance 60.

## 🗂️ Project Structure

```text
Solar-Sandbox/
├── index.html        Page shell
├── SolarSystem.js    🪐 All simulation logic (SolarSystem class)
├── p5.min.js         p5.js library
└── assets/
    ├── earth.jpg     Earth texture
    └── moon.jpg      Moon texture
```

## 🚀 Getting Started

No build step — just open it:

```bash
# any static server works
python3 -m http.server 8000
# then open http://localhost:8000
```

**Or skip all that — it's already live: [solar-sandbox-three.vercel.app](https://solar-sandbox-three.vercel.app/)**

---

<div align="center">

⭐ **Star this repo if you find it useful** ⭐

</div>
