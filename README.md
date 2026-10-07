# PRANAV OS 95

> all the things i do are in here. inside a fake operating system. obviously.

Pranav Chandar's portfolio, reimagined as a retro desktop OS that boots from BIOS,
runs on a CRT, and has a blue screen of death. Built with Angular 19 (standalone
components, signals, SSR prerendering). Every sound is synthesised with WebAudio,
every icon is hand-drawn 16×16 pixel art stored as text, and no assets were added.

## Apps on the desktop

| Icon | What it really is |
| --- | --- |
| `ABOUT_ME.TXT` | The About page as an editable Notepad. Nothing saves. Like real life. |
| `RESUME.EXE` | The résumé as an InstallShield wizard, with a EULA, live career-uptime counter, skill "components" and an install log. Cancelling triggers a confirm dialog whose *Exit* button runs away from your cursor. |
| `ART_GALLERY` | All 72 drawings in "The Pranavian Museum of Digital Art": gilded frames, museum placards, fake appraisals, *set as wallpaper*. Don't touch the art. |
| `CGI_TAPES` | The CGI reel as a VHS deck: pick a tape off the shelf, it loads into the TV, press ▶. |
| `PRANAV.TS` | Programming work as a TypeScript class in a fake IDE, with a "Run" button that compiles a human. |
| `TERMINAL` | A real-ish shell: `help`, `ls`, `cd art`, `neofetch`, `cowsay`, `matrix`, `vim` (good luck), `rm -rf /`, and the important one: `sudo hire pranav`. |
| `CONTACT.EML` | A mail composer with an urgency slider that opens your mail client. |
| `PUNCH_ME.EXE` | The old "-20HP" gag as *Street Pranav II Turbo*: health bars, crits, combos, K.O., loot drop. |
| `INTRO.MOV` | The old `/secret` intro video, Y/N prompt and all, in a media player. |
| `CONTROL_PANEL` | Wallpapers, CRT scanlines, cursor trail, Comic Sans Mode, and the Caffeine and Pretentiousness sliders. |
| `DONT_PRESS.EXE` | Don't. |
| `BORING_MODE` | `/boring`: everything on one plain, fast, accessible page for recruiters, screen readers and search engines. |
| `RECYCLE BIN` | Java 4, SVN, Ext JS, and a sleep schedule. Emotionally load-bearing. |

## Easter eggs

- `↑ ↑ ↓ ↓ ← → ← → B A` anywhere on the desktop
- `` ` `` opens a terminal
- Leave it idle for a minute and Pranav's head bounces around like a DVD logo. Wait for the corner.
- Click the CRT computer. Its eyes already follow your cursor.
- Smiley, the unpaid desktop assistant, has opinions.

## URLs

Old links still work. Each one boots the OS and opens the matching window:
`/about`, `/resume`, `/work/programming`, `/work/digital-art`, `/work/cgi`, `/secret`.
The address bar follows whichever window is in front.

## Code map

```
src/app/
  data/          profile, art and video data (single source of truth for every app)
  os/            the "kernel": window manager, boot, taskbar, screensaver, BSOD, sound synth, pixel icons
  apps/          one folder per desktop app, each lazy-loaded when its window opens
  boring/        the plain-HTML fallback page
```

## Development

```bash
npm ci
npm start          # http://localhost:4200
npm run build      # prerenders every route into dist/pranav-portfolio/browser
npm test
```
