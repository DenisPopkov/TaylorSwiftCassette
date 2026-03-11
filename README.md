# Taylor Swift — The Tortured Poets Department — Cassette Experiment

Интерактивный лендинг: сравнение звучания альбома TTPD на разных типах аудиокассет (Type I–IV) и с оригинальной кассетой.

## Стек

- **Next.js 14** (App Router)
- **React 18**
- **Tailwind CSS**
- **GSAP** (ScrollTrigger для анимаций при скролле)

## Запуск

```bash
cd /Users/denispopkov/Desktop/TaylorSwiftTTPD
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## GitHub Pages

Сайт можно развернуть на GitHub Pages (статический экспорт).

1. **Один раз в настройках репозитория:**  
   **Settings → Pages → Build and deployment → Source:** выберите **GitHub Actions**.

2. Пушите в ветку `main` (или `master`) — workflow соберёт проект и задеплоит.  
   Сайт будет доступен по адресу:  
   `https://<ваш-username>.github.io/<имя-репозитория>/`

Сборка использует `output: 'export'` и `NEXT_PUBLIC_PAGES_BASE_PATH` для корректных путей на GitHub Pages.

## Структура

- **7 экранов:** Intro → Type I → Type II → Type III → Type IV → Original → Footer
- **Full-page scroll** с snap по секциям
- **Шапка** с логотипом (sticky)
- **Кнопка "Play Cassette Recording"** — открывает плеер; при воспроизведении катушки на кассетах крутятся
- **Боковая навигация** и стрелка вниз для перехода между блоками

## Аудио и картинки

- Положите файл записи с кассеты в `public/audio/cassette-recording.mp3`.
- Опционально: изображения кассет в `public/assets/` (см. `public/assets/README.md`). По умолчанию используются SVG-кассеты с анимацией катушек.

## SEO

- Title: **Taylor Swift Cassette Experiment**
- Description: *An experimental comparison of cassette tape types using The Tortured Poets Department album by Taylor Swift.*

## Цвета (TTPD-эстетика)

- Фон: `#0b0b0b`
- Текст: `#e8e6e3`
- Вторичный: `#9f9f9f`

Шрифты: Playfair Display, Cormorant Garamond.
