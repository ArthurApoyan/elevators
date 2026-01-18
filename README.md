# Elevator Exercise

A configurable and fully localized **Elevator Control Simulation** built with **React + TypeScript + Vite**.

This project demonstrates clean architecture, i18n abstraction, scheduling logic, responsive UI design, and unit testing.

---

## 🚀 Quick Start

### Node version - 22.19.0

```bash
npm install
npm run dev
npm test
npm run build
```

---

## ⚙️ Configuration

The app supports a **dynamic number of buildings, floors, and elevators**.
All simulation parameters live in:

```
src/app/config/buildings.ts
```

Updating this config will automatically update both **UI and simulation behavior**.

---

## 🌍 Internationalization (i18n)

The app includes a **translation-engine-agnostic i18n layer**.

* Locale files: `src/locales/*.json`
* Provider + hook: `src/features/i18n`
* API used by components:

```
const { t, setLang } = useT()
```

To add a new language, create a JSON file and register it in the provider.

---

## 🧠 Elevator Scheduling Logic

All elevator logic is isolated in the **core domain layer** (no React dependencies).

Each elevator has:

* current floor
* movement direction
* stop queue (FIFO)
* door dwell timing

### Dispatching rules

* The **closest available elevator** (fastest ETA) is chosen for each call.
* Calls are processed in the order they are received.
* Elevators move floor-by-floor at a constant speed.
* When arriving at a stop, elevators open doors and play arrival sound.

Core logic lives in:

```
src/core/
```

This separation allows clean unit testing and easy UI integration.

---

## 🖥️ UI & Styling

* **styled-components** for component styling
* **styled-system** for responsive design + theme tokens
* **Radix Select** for the language and sound toggle controls
* Fully responsive layout:

    * mobile: stacked buildings
    * desktop: grid layout

Elevator cars animate vertically within their shaft based on their `currentFloor`.

---

## 🔊 Sound Effects

Optional sound support includes:

* Arrival chime

Users can enable/disable sounds from the UI; preferences persist in `localStorage`.

---

## 🧪 Testing

Jest is used for unit tests.

Focus is on **core elevator scheduling logic**.

Example test cases cover:

* fastest elevator selection
* queue ordering
* elevator arrival behavior

Run tests with:

```bash
npm test
```

---

## 📌 Assumptions

* Elevators travel at constant speed (`msPerFloor`)
* Door open/close timing is fixed (`doorOpenMs`)
* No passenger capacity or direction-based grouping
* Calls are handled FIFO per elevator
