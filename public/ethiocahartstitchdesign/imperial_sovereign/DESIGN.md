# Design System Strategy: High-End Institutional Authority

## 1. Overview & Creative North Star
**Creative North Star: "The Sovereign Ledger"**
This design system rejects the "SaaS-kit" aesthetic in favor of a bespoke, editorial experience that feels permanent, authoritative, and distinctly Ethiopian. We are moving away from the "disposable" nature of digital tools toward a "Sovereign Ledger"—a platform that feels like a prestigious government archive translated into high-end technology.

The design breaks the standard grid through **intentional layering and tonal depth**. Instead of boxing data into card after card, we use expansive white space and sophisticated surface transitions to guide the eye. This is "Institutional Modernism": a blend of classic typography, rich cultural signifiers, and a rigorous, monochromatic layout structure that demands respect.

---

## 2. Colors & Surface Architecture
The color palette is rooted in power and stability. We utilize a deep, "Forest-to-Black" green for authority, accented by a "Royal Gold" that denotes precision and value.

### The Color Tokens (Material Design 3 Logic)
*   **Primary:** `#012D1D` (Deep Green) – The foundation of institutional power.
*   **Primary Container:** `#1B4332` – Used for active navigation states or high-level headers.
*   **Accent (Tertiary):** `#D4A843` – Used sparingly for "Golden Path" actions and critical data highlights.
*   **The Flag Stripe:** A constant `3px` linear gradient (`#1B4332`, `#D4A843`, `#C1292E`) pinned to the top of the viewport. This is our signature brand mark.

### The "No-Line" Rule
Standard SaaS layouts rely on 1px borders to separate content. **In this system, 1px solid borders are strictly prohibited for sectioning.** Boundaries must be defined solely by background shifts.
*   **Transition:** A `surface-container-low` section sitting on a `background` provides all the separation needed.
*   **Hierarchy:** Use the `surface-container` tiers (Lowest to Highest) to create "nested" importance. A medical record (Highest) should sit atop a patient dashboard (Low), defined by a subtle shift in luminosity, not a line.

### Glass & Texture
*   **Glassmorphism:** For floating modals or overlays, use `surface` at 80% opacity with a `24px` backdrop-blur. This keeps the institutional layout visible beneath, maintaining context.
*   **Signature Textures:** Use subtle vertical gradients in the sidebar (`#081C15` to `#012D1D`) to give the navigation "soul" rather than flat color.

---

## 3. Typography: The Editorial Voice
Our typography balance ensures that data feels like documentation, not just "content."

*   **Headlines (Poppins SemiBold):** The "Public Sans/Poppins" choice provides an architectural feel. Headlines should use `headline-lg` (2rem) for page titles to establish immediate hierarchy.
*   **Body (Inter Regular):** Chosen for its neutrality and high legibility in dense medical contexts.
*   **IDs & Data (JetBrains Mono):** All patient IDs, medical codes, and timestamps must use `JetBrains Mono`. This differentiates "System Data" from "Human Content," adding an layer of technical precision.

| Role | Font | Size | Weight | Use Case |
| :--- | :--- | :--- | :--- | :--- |
| Display | Public Sans | 3.5rem | 600 | Large KPI metrics |
| Title-LG | Inter | 1.375rem | 500 | Section headers |
| Body-MD | Inter | 0.875rem | 400 | Standard patient notes |
| Label-SM | JetBrains | 0.6875rem| 500 | ID: ETH-9928-X |

---

## 4. Elevation & Depth (Tonal Layering)
Traditional drop shadows are too "soft" for a government institution. We achieve depth through **Ambient Stacking**.

*   **The Layering Principle:** Place `surface-container-lowest` (#FFFFFF) cards on a `surface-container-low` background. This creates a "Paper-on-Desk" effect—natural, tactile, and professional.
*   **Shadows:** When a floating state is required (e.g., a dropdown), use an **Ambient Shadow**: `0px 12px 32px rgba(26, 26, 46, 0.06)`. Note the tint—the shadow is a low-opacity version of our Text color (`#1A1A2E`), never pure black.
*   **The Ghost Border:** If accessibility requires a border, use `outline-variant` at **15% opacity**. It should be felt, not seen.

---

## 5. Components & Primitives

### Buttons: High-Contrast Authority
*   **Primary:** Solid `#012D1D` with white text. `0.25rem` (4px) corner radius. No gradient.
*   **Secondary:** Ghost-style with a `30%` opacity `outline-variant` and `#012D1D` text.
*   **Tertiary (Gold):** Used exclusively for "Save" or "Finalize" actions to draw the eye to the completion of a task.

### Input Fields: The Ledger Style
*   **Style:** No background fill. A bottom-only border (2px) using `outline-variant`. When focused, the border transforms into the `Primary` green.
*   **Labels:** Always visible, never floating. Use `label-md` in `on-surface-variant`.

### Cards & Lists: The "No-Divider" Protocol
*   **Rule:** Forbid the use of horizontal divider lines. 
*   **Alternative:** Use vertical white space (`spacing-8` / 1.75rem) to separate list items. For dense tables, use alternating row colors (Zebra striping) with a extremely subtle shift between `surface` and `surface-container-low`.

### Unique Component: The "Institutional Header"
Every main module must begin with a high-contrast header block: `primary-container` background, `JetBrains Mono` breadcrumbs, and a `headline-lg` title. This anchors the page and establishes immediate authority.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use asymmetrical layouts. For example, a wide column for medical history and a narrow, elevated column for vitals.
*   **Do** use `JetBrains Mono` for any string of numbers.
*   **Do** ensure the 3px Flag Gradient is always visible, even during scroll (sticky).

### Don't:
*   **Don't** use rounded corners above `0.75rem`. We want "Professional," not "Playful."
*   **Don't** use standard blue for links. Use `Primary` green with an underline.
*   **Don't** use "Pop" colors for warnings. Use the specified `Danger` (`#C1292E`) in a muted `error-container` to maintain the institutional tone.
*   **Don't** use generic icons. Use thick-stroke, sharp-cornered iconography that matches the weight of Poppins SemiBold.