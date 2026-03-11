# Контекст проекта: Taylor Swift TTPD Cassette Experiment

## О проекте

**Название:** Taylor Swift TTPD Cassette Experiment  
**Тип:** лендинг / scroll-experience с аудио-экспериментом  
**Тема:** сравнение звучания альбома «The Tortured Poets Department» на разных типах кассет (Type I–IV, Original).

Сайт сочетает образовательный контент (описание типов ленты) и интерактив: прослушивание треков, режим сравнения формул без перемотки, визуальный анализ аудио (waveform, спектр, спектрограмма).

---

## Стек

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **GSAP** (ScrollTrigger для анимации секций при скролле)

Шрифты: **Playfair Display** (заголовки, `font-heading`), **Cormorant Garamond** (основной текст, `font-serif`). Резерв: Georgia, serif.

---

## Структура приложения

### Маршрут и скролл

- Одна страница: `src/app/page.tsx`.
- Скролл не у `window`, а у **`#scroll-container`** (это `<main>`). У него: `height: 100vh`, `overflow-y: auto`, скроллбар скрыт, `scroll-snap-type: y mandatory`. Секции с `data-section` и `min-height: 100vh`, `scroll-snap-align: start`.

### Порядок блоков (секций)

1. **Intro** — заголовок «Cassette Recording Experiment», два абзаца, центрированный текст.
2. **Type I – Ferric** — CassetteBlock.
3. **Type II – Chrome** — CassetteBlock.
4. **Type III – Ferro-Chrome** — CassetteBlock.
5. **Type IV – Metal** — CassetteBlock.
6. **Official Cassette (Original)** — CassetteBlock.
7. **Compare** — ComparisonBlock (переключение формул без потери позиции воспроизведения).
8. При необходимости — Footer (если подключён в layout/page).

Навигация по секциям: **PageNav** (правая панель на lg, нижняя на мобильных). Пункты: INTRO, TYPE I–IV, ORIGINAL, COMPARE. Клик прокручивает `#scroll-container` к нужной секции через `scrollTo` + `getBoundingClientRect`.

---

## Ключевые компоненты

| Компонент | Назначение |
|-----------|------------|
| **Header** | Фиксированная шапка: Taylor Swift / The Tortured Poets Department / Cassette Experiment. |
| **PageNav** | Навигация по секциям. Рендер через **createPortal(..., document.body)** (z-index 9999). Подсветка активной секции по скроллу. |
| **LayoutWithAudioPlayer** | Оборачивает children, при `isOpen` рендерит модальный **AudioPlayer**. |
| **CassetteBlock** | Секция с заголовком (тип кассеты), описанием, картинкой кассеты (**CassetteImage**) и блоком Experiment/Format/Source. Сетка: lg — три колонки (текст | кассета 360px | детали). |
| **CassetteImage** | Кнопка «Play cassette», картинка кассеты. Контейнер: 308px / 360px (sm+), aspect ratio **1:1**, `object-contain`. Опционально `rotationDeg`. Открывает плеер через **AudioPlayerOpenContext**. |
| **ComparisonBlock** | Блок «Cassette Comparison»: выбор формулы (Type I–IV, Original), выбор трека, один плеер. При смене формулы позиция воспроизведения сохраняется (синхронное переключение). Кнопка «Show audio analysis» открывает **AudioAnalysisPanel**. |
| **AudioAnalysisPanel** | Загрузка и анализ аудио по URL (Web Audio API): waveform, frequency spectrum, spectrogram. Для всех 5 формул строится один набор данных; переключатель типа графика, подписи осей, лёгкая анимация появления. |
| **AudioPlayer** | Модальное окно: список треков (SIDE A/B), прогресс-бар, prev/play/next. Использует **TTPD_TRACKS**, **useSetAudioPlaying** для анимации в шапке. |

---

## Контексты и состояние

- **AudioPlayingContext** — глобальный флаг «играет ли что-то» (для анимации кассеты в шапке).
- **AudioPlayerOpenContext** — модалка плеера: `isOpen`, `cassetteLabel`, `open(label?)`, `close`.

---

## Данные и ассеты

- **Картинки кассет:** `public/tapes/` — `type-i.png`, `type-ii.png`, `type-iii.png`, `type-iv.png`, `original.png`. Пути заданы в **src/lib/cassetteImages.ts**.
- **Аудио:** `public/audio/ttpd/` — `1.mp3`, `2.mp3` и т.д. Список треков в **src/lib/ttpdTracks.ts** (id, title, src). Сейчас несколько треков указывают на один и тот же файл (2.mp3).
- **Сравнение формул:** **src/lib/comparisonSources.ts** — список формул (FormulationId), функция `getComparisonSrc(trackIndex, formulation)`. Сейчас для всех формул возвращается один и тот же src трека; при появлении отдельных файлов по типам ленты достаточно изменить эту функцию.

---

## Анализ аудио (панель анализа)

- **src/lib/fft.ts** — FFT (radix-2), окно Ханна, `magnitudeSpectrum(samples, fftSize)`.
- **src/lib/audioAnalysis.ts** — `analyzeAudioFromUrl(url)`: fetch → decodeAudioData → waveform (downsample), average spectrum (FFT по окнам), spectrogram (FFT по кадрам). Возвращает `AnalysisResult`: waveform, spectrum, spectrogram, duration, sampleRate.
- **AudioAnalysisPanel** запрашивает анализ для всех 5 формул по текущему треку, рисует на canvas один из типов графика (waveform / spectrum / spectrogram), с подписями осей и легендой формул.

---

## Стили и вёрстка

- **globals.css:** переменные `--background`, `--text`, `--text-secondary`; скрытый скролл у `#scroll-container`; grain-оверлей на `body::before` (z-index 1); `.section`, `.container-snap`, `.title-dash`, `.analysis-graph-enter` (fadeIn).
- **Tailwind:** цвета background/text/text-secondary, fontFamily serif/heading. Контейнер кассеты в CassetteBlock: фиксированная ширина 308px / 360px, средняя колонка грида на lg — 360px.
- Кассеты: контейнер 1:1, `object-contain`, без поворота (`rotationDeg={0}`), чтобы не обрезать и не сжимать изображение.

---

## Важные технические детали

1. **Скролл:** весь контент внутри `<main id="scroll-container">`; навбар и хедер — `position: fixed`, навбар поверх (z 9999), main с `z-0 relative`, чтобы не перекрывать клики.
2. **Навигация:** клик по пункту вызывает `scrollTo` у `#scroll-container` с позицией, посчитанной через `getBoundingClientRect`. Дополнительно на навбар вешаются нативные `click`/`pointerdown` (через setTimeout после монтирования) для надёжности.
3. **Сравнение:** при смене формулы подменяется `src` у одного audio-элемента, сохраняется `currentTime`, после загрузки метаданных выполняется seek и при необходимости `play()`.
4. **Картинки кассет:** Next.js `Image` с `fill` и `object-contain` внутри контейнера с фиксированной шириной и aspect ratio 1:1; размеры 308px / 360px заданы и у обёртки CassetteImage, и у колонки в CassetteBlock.

---

## Файловая структура (основное)

```
src/
  app/
    layout.tsx      # шрифты, провайдеры, Header, PageNav, LayoutWithAudioPlayer
    page.tsx        # main#scroll-container, Intro, CassetteBlock x5, ComparisonBlock
    globals.css
  components/
    Header.tsx
    PageNav.tsx
    LayoutWithAudioPlayer.tsx
    CassetteBlock.tsx
    CassetteImage.tsx
    ComparisonBlock.tsx
    AudioAnalysisPanel.tsx
    AudioPlayer.tsx
    Footer.tsx
    PlayButton.tsx
  context/
    AudioPlayingContext.tsx
    AudioPlayerOpenContext.tsx
  lib/
    cassetteImages.ts
    ttpdTracks.ts
    comparisonSources.ts
    audioAnalysis.ts
    fft.ts
public/
  tapes/       # type-i.png, type-ii.png, type-iii.png, type-iv.png, original.png
  audio/ttpd/  # 1.mp3, 2.mp3, ...
```

---

## Расширения (идеи из обсуждений)

- Подключить реальные аудиофайлы по формулам в `getComparisonSrc` (например `/audio/ttpd/type-i/1.mp3`).
- A/B сравнение двух формул с кнопкой «Switch».
- Звук переключения кассеты (короткий клик).
- Cassette Simulator (Bias / Saturation / Noise) — не реализован.

Этот файл можно использовать как контекст для дальнейшей разработки или онбординга.
