# 📰 NewsFlip

A cross-platform React Native news app that fetches real-time headlines from **The Guardian API**, displays them in responsive card layouts, and supports infinite scroll, search, categories, and offline mode.

---

## ✨ Features

| Feature | Status |
|---|---|
| Top headlines on launch | ✅ |
| Infinite scroll | ✅ |
| Skeleton loading | ✅ |
| Error retry state | ✅ |
| Article detail screen | ✅ |
| Open in browser | ✅ |
| Category filters | ✅ |
| Search with 400ms debounce | ✅ |
| Dark/light system theme | ✅ |
| Portrait/landscape layouts | ✅ |
| Tablet grid layouts (Bonus) | ✅ |
| Pull-to-refresh (Bonus) | ✅ |
| Offline caching (Bonus) | ✅ |

---

## 🔑 API

**The Guardian API** with public test key:

```
https://content.guardianapis.com/search?q=technology&page=1&page-size=10&show-fields=thumbnail,trailText&api-key=test
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ArticleCard.tsx      # News card with thumbnail, title, source, time
│   ├── SkeletonCard.tsx     # Animated skeleton loader
│   ├── CategoryChips.tsx    # Horizontal category filter chips
│   └── SearchBar.tsx        # Search input with debounce
├── screens/
│   ├── HomeScreen.tsx       # Main feed with infinite scroll
│   └── ArticleScreen.tsx    # Article detail with hero image
├── services/
│   └── guardianApi.ts       # Guardian API service + article mapping
├── hooks/
│   └── useNews.ts           # Data fetching, pagination, caching hook
├── navigation/
│   └── index.tsx            # Stack navigator setup
└── theme/
    └── colors.ts            # Light & dark theme tokens
```

---

## 🚀 Setup

```bash
# Install dependencies
npm install

# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

---

## 📱 Responsive Layout

- **Phone portrait**: 1 column
- **Phone landscape / small tablet**: 2 columns
- **Tablet landscape**: 3 columns

Grid recalculates dynamically on orientation change using `useWindowDimensions`.

---

## 🌓 Theming

Automatically follows system dark/light mode via `useColorScheme()`.

---

## 💾 Offline Support

First successful fetch is cached to `AsyncStorage`. When the network is unavailable, cached articles are displayed automatically.

---

## 📦 Build (Expo/EAS)

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --profile preview
```

---

## 📸 Screenshots

| Screen | Description |
|---|---|
| Home (Light) | Main feed with category chips |
| Home (Dark) | Dark mode feed |
| Landscape | 2-column grid layout |
| Tablet | 3-column grid layout |
| Search | Search results with debounce |
| Article Detail | Hero image + full article info |
