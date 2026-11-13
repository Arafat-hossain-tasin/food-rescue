# খাও দাও · Frontend V4 + Separated Assets

এই প্যাকেজে সব theme, logo, illustration, role icon, story image, intro artwork আলাদা ফাইল হিসেবে আছে। HTML এগুলো relative path দিয়ে ব্যবহার করে।

## Mac-এ কীভাবে খুলবে
1. ZIP ফাইল Extract করো। `KhaoDao-Frontend-v4` folder পাবে।
2. Folder-টি VS Code / Codex-এ Open করো।
3. Terminal-এ folder-এর ভিতর `python3 -m http.server 5500` চালাও।
4. Browser-এ `http://localhost:5500` খোলো।
5. `http://localhost:5500/#/login` = Login, `/#/register` = Registration।
6. `http://localhost:5500/previews/intro.html` = Intro আলাদাভাবে দেখো।
7. `http://localhost:5500/previews/asset-gallery.html` = সব artwork দেখো।

## File map
- `index.html` : main website (SPA, hash routes)
- `assets/css/site.css` : all CSS & responsive design
- `assets/js/app.js` : existing frontend logic plus interactive form / role selector
- `assets/js/auth.js` : illustrated login / registration views, username preference and animation controls
- `assets/js/hero-slideshow.js` : 12-image shuffled homepage slideshow, autoplay, click/swipe controls and lifecycle cleanup
- `assets/css/hero-slideshow.css` : responsive slideshow frame, crossfade and zoom transitions
- `assets/images/stories/` : 11 new food-sharing illustrations; together with `community-detail.webp`, the slideshow has 12 images
- `assets/css/auth.css` : responsive riverside authentication design and reduced-motion support
- `assets/images/auth-riverside.png` : reference-inspired watercolor background, with editable HTML layered above
- `assets/illustrations/auth-village.svg` : village line drawing at the foot of the authentication card
- `assets/brand/` : primary mark & favicon, all scalable SVG
- `assets/illustrations/` : each icon / food art / intro scene, and original Bangladesh landscape, SVG
- `assets/images/` : illustrated background stories and textured paper, WEBP
- `assets/icons/` : interface field icons and password visibility icons
- `previews/intro.html` : self-contained intro visual, uses same asset files
- `previews/login.html` & `register.html` : links to actual SPA auth views
- `previews/asset-gallery.html` : visual inventory
- `api.js` : **stub only. No backend connected.** Replace with actual API code.

## Changing artwork (no HTML editing needed)
- Logo → edit/replace `assets/brand/mark.svg` (same file name).
- Hero background → `assets/images/hero-sharing.webp`; hero slideshow images and captions → `HERO_STORIES` in `assets/js/hero-slideshow.js`.
- Auth background → `assets/images/auth-riverside.png`; auth layout → `assets/css/auth.css`.
- Registration role icons → `assets/illustrations/role-donor.svg`, `role-ngo.svg`, `role-family.svg`, `role-rider.svg`.
- Animated Bangladesh scene → `assets/illustrations/bangladesh-scene.svg`.
- Intro artwork → `assets/illustrations/intro-journey.svg`, `intro-journey-mobile.svg`.
- Colors, size, spacing → `assets/css/site.css` (V4 styles added at bottom).

## Production caution
This is **frontend design**, not a complete production system. `api.js` is a non-functional placeholder because the original backend integration file was not supplied. No passwords or real signup data are persisted. Database, secure authentication, file proof handling, and privacy controls must be implemented before deployment for actual users. No Google/Facebook login is claimed.

Fonts and Leaflet maps are linked via external CDNs, so internet access is needed for those. All custom illustrations/photos are local.
# food-rescue
