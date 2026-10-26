# Game of Life

A minimal, cozy pixel take on Conway's Game of Life. Chunky cells glow like little lit windows on a deep purple night board; newborn cells brighten in and dying cells fade out with a soft trail instead of vanishing. It opens with a few classic patterns already placed, so the board is alive the moment it loads.

The rules are the original 1970 ones: a live cell with 2 or 3 neighbours survives, any other live cell dies, and a dead cell with exactly 3 neighbours comes alive. Edges wrap around, so gliders can travel forever.

No build step, no dependencies. Everything is vanilla CSS and JS.

## Run it

Open `index.html` in a browser (or serve the folder).

## Controls

- **Draw:** click or tap cells to toggle them, drag to plant whole patches, running or paused
- **Play / Pause:** start or stop the generations
- **Step:** advance one generation while paused
- **Random:** scatter a fresh starting pattern · **Clear:** empty the board
- **Speed:** Slow, Normal, or Brisk
- **Env:** four themes (Twilight, Moss, Hearth, Tide) and a trail length for the fade-out effect
- **?** a short in-app guide to how it works

## Files

| File | What it is |
| --- | --- |
| `index.html` | Markup: the board, control bar, environment panel, and guide panel. Loads `css/style.css` and `js/app.js`. |
| `css/style.css` | The cozy night styling: board and cell colours per theme, control bar, panels, and responsive layout. |
| `js/app.js` | The whole simulator: the Game of Life engine with wrap-around edges, canvas rendering with fade trails, drawing input, themes, speeds, and the seeded classic patterns. |
