export const unfeedCaseStudy = `## Overview

UnFeed is a Chrome extension built to make YouTube useful for intentional consumption without turning it into a recommendation-driven browsing session.

The idea is simple: keep the video the user deliberately opened, while progressively removing the surrounding UI that encourages continued browsing. Users can choose between three focus levels and define how long the session should remain active.

The engineering challenge was not the CSS itself. The difficult part was building a reliable system around a platform whose UI is dynamic, whose navigation behaves like a single-page application, and whose Manifest V3 background service worker can be suspended by Chrome.

UnFeed was built with React, Vite, and Chrome Manifest V3, with separate runtime responsibilities for the popup, background service worker, and YouTube content script.

---

## The Problem

YouTube is optimized around continuous discovery.

Even when someone opens a video for a specific purpose, the page contains recommendations, related videos, comments, Shorts, end-screen suggestions, search controls, action buttons, and other paths back into the recommendation loop.

A conventional website blocker would solve the problem by blocking YouTube entirely. That also blocks the useful part.

UnFeed takes a different approach:

> **Keep the intentional content. Remove the surrounding distractions.**

That required the extension to answer several engineering questions:

* How should focus state be shared between the popup, background process, and YouTube page?
* How can a session survive the popup being closed?
* How can timer sessions survive service-worker suspension?
* How can focus mode survive YouTube's SPA navigation?
* How can dynamically inserted recommendations be hidden without continuously rescanning the entire page?
* How can the extension modify YouTube's UI without risking the video player itself?
* What happens when YouTube changes its DOM structure?

These questions shaped the architecture.

---

## Core Architecture

UnFeed uses three distinct Chrome extension runtime contexts:

\`\`\`text
                    ┌─────────────────────┐
                    │     React Popup     │
                    │      User UI        │
                    └──────────┬──────────┘
                               │
                        Chrome messaging
                               │
                    ┌──────────▼──────────┐
                    │ Background Service  │
                    │      Worker         │
                    │                     │
                    │ Session source      │
                    │ of truth            │
                    └──────────┬──────────┘
                               │
                        Chrome messaging
                               │
                    ┌──────────▼──────────┐
                    │    Content Script   │
                    │                     │
                    │ YouTube DOM + video │
                    │ navigation + events │
                    └─────────────────────┘
\`\`\`

The important architectural decision is that the **popup is not the source of truth**.

The popup exists only while the extension UI is open. The background service worker owns the session state and persists it through \`chrome.storage.local\`. The content script is responsible for actually manipulating the YouTube page.

This separation prevents UI lifetime from becoming application lifetime.

The repository reflects this explicitly through separate \`popup\`, \`background\`, \`content\`, and \`shared\` modules.

---

## 1. Designing Focus Sessions

The fundamental abstraction in UnFeed is a **focus session**.

A session contains information such as:

\`\`\`javascript
{
  enabled: true,
  mode: "timer",
  focusLevel: "study",
  startedAt: 1724590000000,
  endAt: 1724593600000,
  videoId: null,
  createdFromTabId: 12345
}
\`\`\`

The system supports two fundamentally different session termination strategies:

### Timer sessions

The user chooses:

* 15 minutes
* 30 minutes
* 60 minutes
* Custom duration between 1 minute and 8 hours

The background service worker calculates an absolute \`endAt\` timestamp.

Instead of maintaining an in-memory countdown, the application derives remaining time from:

\`\`\`text
endAt - Date.now()
\`\`\`

That distinction matters because the background service worker is not guaranteed to remain alive.

### Video-end sessions

The user can instead choose:

> Until video ends

The session stores the video's ID and the content script listens for the native video's \`ended\` event.

When the event fires:

\`\`\`text
video
  ↓
Content Script
  ↓
VIDEO_ENDED message
  ↓
Background Worker
  ↓
Validate video ID
  ↓
End Session
  ↓
REMOVE_FOCUS
\`\`\`

This allows the session to terminate based on the actual media lifecycle rather than an arbitrary timer.

The implementation and verification of both session modes are documented in the repository's architecture and testing documentation.

---

## 2. Solving the Manifest V3 Service Worker Problem

One of the more important engineering constraints came from Manifest V3.

The background component is a service worker, meaning Chrome can suspend it when it is idle.

A naive implementation might keep something like:

\`\`\`javascript
let remainingTime = 1800;
\`\`\`

and decrement it every second.

That design is unreliable because the worker may disappear while the session is active.

UnFeed instead stores session state in \`chrome.storage.local\` and uses absolute timestamps.

For timer sessions:

\`\`\`text
startedAt = current time
endAt     = current time + duration
\`\`\`

When the worker wakes up again, the remaining time can simply be recalculated.

The extension also creates a \`chrome.alarms\` entry for the session expiry. This means the timer is handled by Chrome rather than depending on a continuously running JavaScript timer.

The architecture therefore becomes:

\`\`\`text
                   Timer starts
                       │
                       ▼
             Store absolute endAt
                       │
              Create chrome.alarm
                       │
              ┌────────▼────────┐
              │ Service worker  │
              │ may be suspended│
              └────────┬────────┘
                       │
                  alarm fires
                       │
                       ▼
                 End session
                       │
                       ▼
                 Restore UI
\`\`\`

This was one of the most important reliability decisions in the project.

The popup itself simply calculates the displayed countdown from the persisted timestamp, so closing and reopening the popup does not reset the timer.

---

## 3. Treating the Popup as a View

The popup uses React 19 and acts as a control surface rather than a state manager.

On startup it:

1. Determines whether the active tab is YouTube.
2. Requests the current session from the background worker.
3. Loads persisted user preferences.
4. Derives the timer display from the session's timestamps.

The architecture explicitly treats the popup as a **view of session state**.

That avoids a common extension bug:

\`\`\`text
Popup state ≠ actual extension state
\`\`\`

For example, the user can:

\`\`\`text
Start session
     ↓
Close popup
     ↓
YouTube remains focused
     ↓
Open popup later
     ↓
Current session is reconstructed
\`\`\`

The React UI is therefore disposable. The background session is not.

The popup is also split into small components such as \`FocusLevelSelector\`, \`DurationSelector\`, \`SessionTimer\`, \`FocusToggle\`, and \`StatusMessage\`, keeping the control surface separate from the session implementation.

---

## 4. Building Three Levels of Focus

The extension does not have a single "hide everything" switch.

Instead, it defines three increasingly aggressive levels:

### Light

Removes primarily discovery-oriented elements:

* Recommendations
* Related videos
* End-screen recommendations
* Autoplay suggestions
* Home feed content

The intent is to preserve the normal video experience while reducing obvious browsing paths.

### Study

Builds on Light and additionally removes:

* Comments
* Shorts
* Sidebar content
* Information cards

This creates a more deliberate learning environment.

### Deep

Pushes the experience much further by also removing:

* Search
* Action buttons
* Channel information
* Description
* Top navigation elements

The result is effectively a focused video player with minimal surrounding UI.

These levels are implemented as selector groups rather than three separate implementations. \`youtubeAdapter.js\` maps each conceptual distraction category to selectors and composes the correct selector set for each focus level.

---

## 5. The Most Fragile Part: YouTube's DOM

The biggest external dependency in the project is not an API.

It is YouTube's DOM.

YouTube does not provide a stable public contract for many of the elements UnFeed needs to hide. Selectors can change without warning.

That means an implementation such as:

\`\`\`javascript
document.querySelector("#secondary");
\`\`\`

is inherently fragile.

Instead of scattering selectors throughout the codebase, UnFeed introduces a dedicated adapter:

\`\`\`text
src/content/youtubeAdapter.js
\`\`\`

All selectors are centralized there and grouped by product concept:

\`\`\`text
recommendations
sidebar
comments
shorts
masthead
endScreen
autoplay
channelSidebar
actionBar
...
\`\`\`

This creates a maintenance boundary:

\`\`\`text
YouTube changes DOM
       │
       ▼
youtubeAdapter.js
       │
       ▼
Focus implementation remains unchanged
\`\`\`

The selector registry also contains fallback selectors for several concepts.

This does not eliminate fragility, but it localizes it.

That is an important distinction: the architecture accepts that the dependency is unstable instead of pretending it isn't.

---

## 6. Never Mutating the YouTube DOM Destructively

Another deliberate design choice was to **hide elements instead of deleting them**.

The content script applies extension-owned CSS classes such as:

\`\`\`text
.yt-focus-hidden
\`\`\`

and tracks modified elements with:

\`\`\`text
data-yt-focus-managed
\`\`\`

When the session ends, those classes can simply be removed.

That creates a reversible state transition:

\`\`\`text
Normal YouTube DOM
        ↓
Apply focus classes
        ↓
Hidden distractions
        ↓
Remove focus classes
        ↓
Original UI restored
\`\`\`

This is safer than removing nodes from YouTube's DOM because the extension does not have to reconstruct anything when focus mode ends.

It also reduces the chance of breaking YouTube's internal event handlers or component lifecycle.

The project explicitly prioritizes:

> hide less rather than break video playback.

That philosophy is reflected both in the implementation and in the documented error-handling strategy.

---

## 7. Handling YouTube's SPA Navigation

YouTube does not behave like a traditional multi-page website.

Navigating from one video to another often happens without a full page reload.

A content script that only reacts when the page initially loads would therefore eventually become stale.

UnFeed uses a dedicated navigation observer that combines multiple signals:

\`\`\`text
yt-navigate-finish
       +
popstate
       +
<title> mutation fallback
\`\`\`

When navigation occurs, the extension:

1. Determines the new video ID.
2. Tells the background worker that the video changed.
3. Re-applies focus classes.
4. Removes old video event listeners.
5. Waits for the new video element.
6. Attaches the \`ended\` listener again.

That creates a lifecycle that follows YouTube rather than assuming a conventional page reload.

This becomes particularly important for video-end sessions.

If the user starts:

\`\`\`text
Until video ends
\`\`\`

on Video A and navigates to Video B, the background service worker ends the session because the session is bound to the original video.

That policy prevents the focus session from silently becoming something different from what the user originally requested.

---

## 8. Handling Dynamically Inserted Content

YouTube constantly inserts content into the DOM.

Recommendations can appear as the user scrolls, components can load asynchronously, and page sections can be replaced without navigation.

Applying the focus CSS once is therefore insufficient.

UnFeed uses a \`MutationObserver\` on \`document.body\`.

However, simply reacting to every mutation would be unnecessarily expensive.

The implementation uses three optimizations:

### 1. Observe only structural additions

The observer listens to:

\`\`\`javascript
childList: true
subtree: true
\`\`\`

rather than watching every attribute and text mutation.

### 2. Ignore extension-owned nodes

Elements marked with:

\`\`\`text
data-yt-focus-managed
\`\`\`

are filtered out.

This prevents the extension from repeatedly responding to its own changes.

### 3. Debounce the actual work

Relevant mutations schedule focus reapplication after a short delay rather than executing DOM queries for every individual mutation.

\`\`\`text
Many mutations
     ↓
Pre-filter
     ↓
Debounce
     ↓
One focus reapplication
\`\`\`

The repository specifies a 250 ms debounce strategy for this work.

This is a good example of where a seemingly simple browser extension becomes an actual performance problem: the extension needs to watch a highly dynamic page without becoming another source of unnecessary work.

---

## 9. Waiting for the Video Element

Another subtle issue is that the \`<video>\` element is not guaranteed to exist immediately when the content script runs or navigation completes.

UnFeed therefore does not assume:

\`\`\`javascript
document.querySelector("video")
\`\`\`

will always succeed on the first attempt.

Instead, the content script polls for the video element for a bounded period and attaches the \`ended\` listener once it becomes available.

It also explicitly removes listeners before attaching new ones during navigation.

That prevents:

\`\`\`text
Video A listener
Video B listener
Video C listener
...
\`\`\`

from accumulating over time.

The content script treats the video element as replaceable state rather than as a permanent page element.

---

## 10. Message-Based Communication

The runtime contexts communicate through a small message protocol.

The shared message definitions prevent every module from inventing its own string values.

The key flows are:

\`\`\`text
Popup → Background
GET_STATE
START_SESSION
STOP_SESSION
UPDATE_FOCUS_LEVEL
\`\`\`

and:

\`\`\`text
Background → Content
APPLY_FOCUS
REMOVE_FOCUS
\`\`\`

and:

\`\`\`text
Content → Background
CONTENT_READY
VIDEO_ENDED
VIDEO_ID_CHANGED
\`\`\`

The message structure remains consistent:

\`\`\`javascript
{
  type: "MESSAGE_TYPE",
  payload: { ... }
}
\`\`\`

The shared \`messages.js\` and \`constants.js\` modules keep these contracts centralized across the extension.

This becomes especially useful because the three contexts cannot directly share JavaScript state. Messaging becomes the boundary between them.

---

## 11. Restoring State When Content Scripts Appear

A content script can load after the background worker already knows that a session exists.

For example:

\`\`\`text
Active session
     ↓
Navigate to another YouTube page
     ↓
New content script loads
\`\`\`

The content script immediately sends:

\`\`\`text
CONTENT_READY
\`\`\`

The background worker then checks the current session and sends back:

\`\`\`text
APPLY_FOCUS
\`\`\`

This means the content script does not need to know the previous history of the extension.

It only needs to announce:

> "I'm ready. What's the current state?"

That makes content-script initialization idempotent and resilient to page lifecycle changes.

The background worker explicitly implements this synchronization path.

---

## 12. Keeping the Player Safe

The most important safety constraint was simple:

> Never break the video player.

The extension therefore uses an additive hiding strategy and explicitly protects the player and its native controls.

The content script does not attempt to replace or manipulate the media element itself.

Instead, the focus system operates around it.

The testing matrix specifically verifies:

* Playback
* Play/pause
* Volume
* Seeking
* Fullscreen
* Captions
* Keyboard shortcuts

across focus modes.

The recorded test results show these checks passing while focus mode is active.

---

## 13. Privacy by Architecture

The privacy model is intentionally simple because the extension does not need a server.

UnFeed uses:

\`\`\`text
Chrome extension
      ↓
Local storage
      +
Chrome APIs
      ↓
No backend
\`\`\`

The manifest requests:

* \`storage\`
* \`alarms\`
* \`tabs\`
* YouTube host permission

There is no application backend, account system, analytics pipeline, or external network dependency in the MVP.

Session state and preferences remain local to the browser.

This was less a privacy feature added afterward and more a consequence of keeping the architecture local-first.

---

## 14. Error Handling Philosophy

The extension interacts with a system it does not control.

YouTube can change its DOM.

A tab can close.

A content script might not yet be available.

A service worker can disappear.

A selector can stop matching.

The implementation therefore treats many of these situations as recoverable rather than fatal.

Examples include:

\`\`\`text
Invalid selector
    → Log warning
    → Continue with remaining selectors
\`\`\`

\`\`\`text
Content script unavailable
    → Log warning
    → Retry when content reports CONTENT_READY
\`\`\`

\`\`\`text
Video not available immediately
    → Poll within a bounded timeout
\`\`\`

\`\`\`text
Original tab closed
    → End associated session cleanly
\`\`\`

This gives the extension a useful priority order:

\`\`\`text
Preserve video playback
        ↓
Preserve focus behavior
        ↓
Recover where possible
        ↓
Never allow extension failure to break YouTube
\`\`\`

---

## 15. Testing Strategy

Testing focused on behavior rather than simply checking that the extension builds.

The manual test matrix covers:

| Area | Result |
| --- | --- |
| Extension loading | PASS |
| Popup behavior | PASS |
| Light mode | PASS |
| Study mode | PASS |
| Deep mode | PASS |
| Active focus-level switching | PASS |
| Timer persistence | PASS |
| Timer expiry | PASS |
| Video-end sessions | PASS |
| SPA navigation | PASS |
| Dynamic DOM handling | PASS |
| Player controls | PASS |
| Service-worker suspension | PASS |
| Tab closure handling | PASS |
| Popup asset loading | PASS |

The testing log records successful verification of dynamic recommendations, timer restoration, video-end termination, SPA navigation, and service-worker lifecycle behavior.

The final implementation status also records the MVP as complete on August 25, 2026.

---

## 16. Build and Tooling

The project uses:

\`\`\`text
React 19
Vite 8
@crxjs/vite-plugin
Chrome Manifest V3
Oxlint
\`\`\`

The build system is responsible for bundling the popup, background service worker, content script, CSS, manifest, and extension assets into a loadable \`dist\` directory.

Development commands are intentionally minimal:

\`\`\`bash
npm install
npm run dev
npm run build
npm run lint
\`\`\`

The project uses \`@crxjs/vite-plugin\` to bridge the Vite build pipeline with Chrome extension packaging.

---

## Engineering Trade-offs

UnFeed deliberately does **not** try to solve every possible distraction problem.

The MVP does not include:

* AI recommendation classification
* A backend
* User accounts
* Cross-browser support
* Session analytics
* Scheduled focus
* Playlist-wide focus mode
* Channel allowlists

Those were kept outside the MVP because they would introduce substantially more state, infrastructure, or product complexity without being necessary to validate the core concept.

The trade-off is that the extension remains relatively small and local, while still demonstrating meaningful browser-extension engineering.

---

## What I Learned

The most important lesson from UnFeed was that browser extensions are less about building a UI and more about **coordinating multiple lifecycles**.

There are at least four independent things happening:

\`\`\`text
Chrome lifecycle
YouTube lifecycle
Video lifecycle
Extension session lifecycle
\`\`\`

A reliable implementation needs clear boundaries between all four.

The project also reinforced several broader engineering principles:

### State should live where its lifetime makes sense

Popup state is temporary.

Session state is persistent.

Page state belongs to the content script.

Trying to collapse those into one state model would have created unnecessary coupling.

### External UI should be treated as unstable

YouTube's DOM is not an API.

The adapter layer makes that instability explicit and localizes maintenance.

### Event-driven systems need recovery paths

It is not enough to handle:

\`\`\`text
Start session
\`\`\`

The system also needs to handle:

\`\`\`text
Popup closes
Worker suspends
Content script reloads
Video element changes
Navigation occurs
Tab closes
Session expires
\`\`\`

### Safe failure is often better than perfect enforcement

For a productivity extension, hiding one recommendation is acceptable.

Breaking the video player is not.

That makes conservative failure behavior more valuable than aggressive DOM manipulation.

---

## Current Limitations

The largest remaining technical weakness is the dependency on YouTube's internal DOM structure.

Even with centralized selectors and fallbacks, a major YouTube redesign can break functionality.

There are also explicit behavioral limitations around:

* Live streams
* Looped videos
* Playlist progression
* Multi-tab sessions

For example, the current MVP associates a focus session with the tab that created it rather than synchronizing one session across every YouTube tab.

Those are deliberate MVP boundaries rather than unresolved architectural mysteries.

---

## Future Direction

The current architecture leaves several extensions relatively well defined:

\`\`\`text
Current MVP
    │
    ├── Playlist / Course Mode
    ├── Scheduled Focus Sessions
    ├── Session Statistics
    ├── Keyboard Shortcuts
    ├── Channel Allowlist
    └── Cross-device Preference Sync
\`\`\`

The interesting part is that these features would extend the existing session model rather than require a complete rewrite.

For example, scheduled sessions would primarily expand how sessions are created, while analytics would require a new persistence layer and event model.

The current architecture therefore provides a reasonable base for evolving UnFeed beyond the MVP.

---

## Final Takeaway

UnFeed started as a simple idea:

> Make YouTube a place to watch the thing I intentionally opened, not a place to keep browsing.

The implementation ended up being primarily an exercise in dealing with unreliable and asynchronous environments.

The most important engineering work was not hiding YouTube elements. It was designing a system that could:

* maintain persistent session state,
* survive Manifest V3 worker suspension,
* coordinate multiple extension contexts,
* react to YouTube SPA navigation,
* handle dynamically inserted DOM,
* detect video lifecycle events,
* restore the original interface safely,
* and fail conservatively when the external platform changes.

That is what turned UnFeed from a CSS-based browser hack into a small but complete browser-extension system.
`;
