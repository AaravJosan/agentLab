# Aarav Josan — Digital Trading Card

A personal website styled as a collectible trading card, built for the
**CSEN-163L** lab at Santa Clara University.

Hand-directed by me, built with AI.

## Features

- **Trading card:** name, major and minor, a Chaos type, an Olivia Rodrigo
  themed special ability, and three silly stats out of 100.
- **Tilt and shine:** the card leans toward your mouse or finger, with a soft
  highlight that follows it.
- **Flip:** click, tap, or press Enter or Space to flip the card to its back.
- **Battle!:** fight a random opponent, from *Printer Out of Toner* to
  *Unsaved Homework*. Each side adds a 50-sided die roll to its power (yours is
  the average of your card's stats), and the winner pops up in big letters.
- **Phone friendly:** the card scales to fit any screen.
- **Reduced motion:** animations are turned off if your device asks for less
  motion.

## How to view

No install or build step is needed. Open `index.html` in any web browser.

## Files

| File         | What it does                                        |
| ------------ | --------------------------------------------------- |
| `index.html` | The card, the card back, and the battle arena       |
| `style.css`  | Colors, layout, card flip and battle animations     |
| `script.js`  | Tilt, flip, and the battle logic (with comments)    |

## Customizing

- **Card text:** edit the name, major, ability and stats in `index.html`. Each
  stat's bar width (`--v`) and number should match.
- **Opponents:** add or change entries in the `opponents` list in `script.js`.
- **Dice:** change `ROLL_TIME` to make the dice spin longer, or edit `rollDie()`
  to use a different die size.

Built with plain HTML, CSS and JavaScript, with no frameworks.
