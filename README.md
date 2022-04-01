# Chromium AudioWorklet resume bug

In `resume-bug.html`, click "Init AudioContext" button and "Play" button in turn to play tide-like white noise.

*"Tide-like" means: **it starts in silence**, and then sounds gradually more and more louder, then turns to be less and less louder, and so on.*

The expected behavior is just as described above: **it should always start in silence** - however, I can hear a very short "residue" burst in the beginning if it's stopped first and then restarted.

Clicking "Send Stop Message" button (and then wait for some while, even for just some milliseconds) before "Stop" and "Play" buttons seems to be able to workaround this issue.

I encountered this problem in Chrome (100.0.4896.60); Firefox (98.0.2) didn't appear to have this problem.
