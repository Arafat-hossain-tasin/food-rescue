# Authentication artwork

Asset: `assets/images/auth-riverside.png`

Created with the built-in imagegen tool using the user-provided login reference. The illustration contains no baked-in UI or lettering; headings, forms, navigation and motion are implemented in HTML/CSS/JavaScript. Existing assets are preserved.

## Final generation prompt

Use case: precise-object-edit.
Asset type: full-bleed illustrated background for an actual responsive food-sharing login webpage, landscape 16:9.
Input image 1 is the edit target and visual reference.
Create an artwork-only version of this exact warm Bengali watercolor illustration. Keep the hand-painted paper grain, large leafy tree along the far left and top-left corner, volunteer in beige vest handing a plate to an elderly Bangladeshi man, the boy, bicycle, river, boat, greenery, and distant National Martyrs' Memorial. Preserve the people, natural faces, anatomical hands, clothing and warm humane storytelling as closely as possible.
REMOVE every interface element: the entire login card on the right, all logos, every word, headline, label, icons, bottom banner and its border, all typography and orange underlines. Remove lettering/logos from vest and bicycle box too. Reconstruct the background naturally behind all removed areas. The right 40% must be mostly pale ivory watercolor paper with only very faint landscape wash near the bottom, suitable for a real HTML form overlay. Keep upper middle (x 20%-60%, y 5%-43%) mostly empty warm cream paper for a real heading. Keep the volunteer, elderly man, boy and plate in the lower left 60% with the handover fully visible around y 75%. Keep tree foliage framing top-left and bottom-left. Full bleed, no border, no UI, absolutely no text, no watermarks. A thoughtful traditional Bengali storybook illustration, restrained pigment, irregular brush edges, quiet daylight.

## Local verification

- JavaScript syntax checks passed for `auth.js`, `app.js` and `api.js`.
- Isolated DOM-stub checks passed for both languages, unique IDs and asset paths, password visibility, recovery explanation, animation pause, failure feedback and loading reset, username-only persistence, all four registration roles, and home navigation.
- Browser visual QA was unavailable: the browser access host failed and native Safari access timed out. Responsive CSS and reduced-motion rules are implemented but have not been visually verified in a browser.
- Existing backend placeholder remains. Google sign-in is not offered, and password recovery explains its current unavailability.

