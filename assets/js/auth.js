/* Illustrated authentication views. The API contract lives in app.js / api.js. */
let authMotionPaused = false;

const authStroke = () => `<svg class="auth-brush" viewBox="0 0 320 24" fill="none" aria-hidden="true"><path d="M4 16C61 1 93 3 133 11s76 12 117 1c25-6 43-7 65-5" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><path d="M9 20C66 7 94 8 133 15s79 9 120-1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;

function authNav() {
  return `<header class="auth-header">
    <a class="auth-brand" href="#/" aria-label="${b('Khao Dao — Home','খাও দাও — হোম')}">${logo(54)}<span>খাও দাও${authStroke()}</span></a>
    <nav aria-label="${b('Main navigation','প্রধান মেনু')}"><a href="#/">${t('Home')}</a><a href="#/" onclick="toHow();return false">${t('How it works')}</a><a href="#/about">${t('About us')}</a><a href="#/team">${t('Our team')}</a></nav>
    <button class="auth-language" type="button" onclick="setLang('${lang === 'bn' ? 'en' : 'bn'}')" aria-label="${lang === 'bn' ? 'Switch to English' : 'বাংলায় দেখুন'}">${lang === 'bn' ? 'EN' : 'বাংলা'}</button>
  </header>`;
}

function authScenery() {
  return `<div class="auth-scenery" aria-hidden="true">
    <img class="auth-backdrop" src="assets/images/auth-riverside.png" alt="" fetchpriority="high">
    <div class="auth-canopy"></div>
    <svg class="auth-river" viewBox="0 0 600 130" fill="none"><g stroke="#fff9df" stroke-linecap="round"><path d="M60 36h62m14 0h18M235 14h43m18 0h12M360 43h72M187 70h88m18 0h22M430 99h55M15 100h78"/><path d="M80 52h48M300 57h53M350 120h67M120 118h50"/></g></svg>
    <svg class="auth-falling-leaf leaf-one" viewBox="0 0 36 58"><path d="M3 53C-4 29 11 7 31 2c8 27-3 45-28 51Z" fill="#6b7d31"/><path d="M3 55 29 8M10 39l13-3M17 27l-3-12" fill="none" stroke="#b5b36b" stroke-width="1.2"/></svg>
    <svg class="auth-falling-leaf leaf-two" viewBox="0 0 36 58"><path d="M3 53C-4 29 11 7 31 2c8 27-3 45-28 51Z" fill="#a5893f"/><path d="M3 55 29 8" fill="none" stroke="#dfca87" stroke-width="1.2"/></svg>
  </div>`;
}

function authPromiseIcon(kind) {
  const paths = {
    meal: '<path d="M15 21h29c-1 10-6 15-14 15s-13-5-15-15ZM19 18c2-2 2-5 0-8m9 8c2-3 2-6 0-10m9 10c2-2 2-5 0-8M5 42l8-4 10 6 16-4c6-2 9 3 4 6l-17 8-15-6-6 2ZM5 39l-4 2 4 13 5-2"/>',
    people: '<circle cx="29" cy="13" r="7"/><circle cx="12" cy="20" r="6"/><circle cx="46" cy="20" r="6"/><path d="M18 47V33c0-10 22-10 22 0v14M2 46V35c0-9 12-10 16-4m22 0c4-6 16-5 16 4v11M25 47V35m9 12V35"/>',
    plant: '<path d="M28 52V19m0 14C13 35 5 27 4 15c13-1 23 4 24 18Zm1 8c15 2 23-6 24-18-13-1-23 6-24 18ZM28 23C17 16 21 7 28 2c8 6 11 14 0 21ZM8 54h41M13 22l15 11m15-2L29 41"/>'
  };
  return `<svg viewBox="0 0 60 60" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[kind]}</svg>`;
}

function authPage(reg) {
  PROOF = null;
  let remembered = '';
  try { remembered = localStorage.getItem('khao-dao-username') || ''; } catch (e) {}
  const registerFields = `
    ${charPick()}
    <select id="role" hidden aria-label="${b('Account role','অ্যাকাউন্টের ধরন')}">${CH.map(c => `<option value="${c[0]}" ${preferredRole === c[0] ? 'selected' : ''}>${b(c[3],c[2])}</option>`).join('')}</select>
    ${fld('rname', b('Name or organisation','নাম অথবা প্রতিষ্ঠানের নাম'), 'text', 'user')}
    ${fld('ru', t('Username'), 'text', 'user')}
    ${fld('rp', t('Password'), 'password', 'lock')}
    ${fld('ph', b('Mobile (01XXXXXXXXX)','মোবাইল (01XXXXXXXXX)'), 'tel', 'user')}
    <div class="rf rNGO">${fld('reg', b('NGO registration number','এনজিও নিবন্ধন নম্বর'), 'text', 'id')}<p class="hint">${b('Social Welfare Department or NGO Affairs Bureau number.','সমাজসেবা অধিদপ্তর বা এনজিও বিষয়ক ব্যুরোর নম্বর।')}</p></div>
    <div class="rf rINDIVIDUAL">${fld('addr', b('Your address','আপনার ঠিকানা'), 'text', 'pin')}<label class="auth-textarea-label" for="reason">${b('Tell us about your food needs','আপনার খাবারের প্রয়োজন সম্পর্কে বলুন')}</label><textarea class="plain" id="reason" rows="2" placeholder="${b('Family size, circumstances…','পরিবারের সদস্যসংখ্যা, পরিস্থিতি…')}"></textarea></div>
    <div class="f rf rRIDER"><select id="veh"><option value="Motorbike">${b('Motorbike','মোটরবাইক')}</option><option value="Bicycle">${b('Bicycle','সাইকেল')}</option><option value="On foot">${b('On foot','হেঁটে')}</option></select><label for="veh">${b('Vehicle','যাতায়াতের মাধ্যম')}</label>${ic('truck',18)}</div>
    <div class="fup rf rNGO rINDIVIDUAL rRIDER"><label for="pf">${b('Supporting photo or video','প্রমাণ হিসেবে ছবি বা ভিডিও')}</label><input id="pf" type="file" accept="image/*,video/*" onchange="pickProof(this)"><p class="hint rf rNGO">${b('Registration certificate (optional).','নিবন্ধন সনদ (ঐচ্ছিক)।')}</p><p class="hint rf rINDIVIDUAL">${b('A photo or video of your circumstances.','আপনার পরিস্থিতি বোঝায় এমন ছবি বা ভিডিও।')}</p><p class="hint rf rRIDER">${b('A photo of your ID or driving licence.','জাতীয় পরিচয়পত্র বা ড্রাইভিং লাইসেন্সের ছবি।')}</p><div class="pv" id="pv"></div></div>
    <p class="hint rf rNGO rINDIVIDUAL rRIDER">${b('Your details will be reviewed before you can start.','শুরু করার আগে আপনার তথ্য যাচাই করা হবে।')}</p>
    <button class="full auth-submit" type="submit"><span>${b('Create account','নিবন্ধন করুন')}</span><span class="auth-arrow" aria-hidden="true">→</span></button>`;

  $('#app').innerHTML = `<main class="auth-page ${reg ? 'is-register' : ''}">
    ${authScenery()}
    <div class="auth-layout">
      <section class="auth-narrative" aria-labelledby="auth-story-title">
        <div class="auth-copy"><p class="auth-kicker">${b('A LITTLE SHARING. A LOT OF CARE.','একটু ভাগাভাগি, অনেকখানি ভালোবাসা।')}</p><h1 id="auth-story-title">${b('Extra food. <br>A little kindness.<br><span>A fuller table.</span>','অতিরিক্ত খাবার <br>পৌঁছে যাক<br><span>প্রয়োজনের মানুষের কাছে</span>')}</h1>${authStroke()}<p class="auth-story-note">${b('Share a little of what you have.<br>Build a Bangladesh where no one goes hungry.','আপনার বাড়তি খাবার ভাগ করে নিন,<br>একসাথে গড়ি ক্ষুধামুক্ত বাংলাদেশ।')}</p></div>
        <div class="auth-promises"><div>${authPromiseIcon('meal')}<span>${b('Share a meal','খাবার দান করুন')}</span></div><div>${authPromiseIcon('people')}<span>${b('Reach someone<br>who needs it','প্রয়োজনের<br>মানুষের কাছে পৌঁছান')}</span></div><div>${authPromiseIcon('plant')}<span>${b('Let less food<br>go to waste','খাবারের অপচয়<br>কমান')}</span></div></div>
      </section>
      <section class="auth-card card ${reg ? 'reg' : ''}" id="ac" aria-label="${reg ? t('Register') : t('Login')}">
        <div class="tabs2 auth-tabs" aria-label="${b('Account access','অ্যাকাউন্টে প্রবেশ')}"><span class="ind" aria-hidden="true"></span><button type="button" onclick="go('login')" ${!reg ? 'aria-current="page"' : ''}>${t('Login')}</button><button type="button" onclick="go('register')" ${reg ? 'aria-current="page"' : ''}>${b('Join us','নতুন নিবন্ধন')}</button></div>
        <div class="panes">
          <form class="pane p1" onsubmit="doAuth(event,'login')" ${reg ? 'inert' : ''}>
            <div class="auth-form-heading"><h2>${b('A warm welcome back','আপনার অ্যাকাউন্টে প্রবেশ করুন')}</h2><p>${b('Good to have you at the table again.','খাবার ভাগাভাগির এই উদ্যোগে আবার স্বাগতম')}</p></div>
            ${fld('lu',t('Username'),'text','user')}${fld('lp',t('Password'),'password','lock')}
            <div class="auth-options"><label class="auth-remember"><input id="remember-name" type="checkbox" ${remembered ? 'checked' : ''}><span>${b('Remember my username','ইউজারনেম মনে রাখুন')}</span></label><button type="button" class="auth-text-button" onclick="showAuthHelp()">${b('Forgot password?','পাসওয়ার্ড ভুলে গেছেন?')}</button></div>
            <p id="auth-recovery" class="auth-recovery" role="status" hidden>${b('Password recovery is not available yet. You can return to this form to try signing in again.','পাসওয়ার্ড পুনরুদ্ধারের সুবিধা এখনো চালু হয়নি। মনে পড়লে এই ফর্ম থেকেই আবার লগইন করতে পারবেন।')}</p>
            <button class="full auth-submit" type="submit"><span>${b('Log in','লগইন করুন')}</span><span class="auth-arrow" aria-hidden="true">→</span></button>
            <div class="auth-divider"><span>${b('or','অথবা')}</span></div>
            <a class="auth-join" href="#/register">${ic('users',21)}<span>${b('Join the food-sharing community','খাবার ভাগাভাগির উদ্যোগে যোগ দিন')}</span></a>
          </form>
          <form class="pane p2" data-role="${preferredRole}" onsubmit="doAuth(event,'register')" ${!reg ? 'inert' : ''}>${registerFields}</form>
        </div>
        <p class="auth-error" id="auth-error" role="alert" hidden></p>
        <div class="auth-card-foot"><img src="assets/illustrations/auth-village.svg" alt="" aria-hidden="true"><p>${b('A little shared. A little closer.','ভাগ করে খাই, পাশে থাকি।')}</p></div>
      </section>
    </div>
    <footer class="auth-footer"><span>© ${new Date().getFullYear()} ${b('Khao Dao · Made for sharing','খাও দাও · খাবার ভাগাভাগির উদ্যোগ')}</span><button type="button" class="auth-motion" aria-pressed="${authMotionPaused}" onclick="toggleAuthMotion(this)"><span aria-hidden="true">${authMotionPaused ? '▷' : 'Ⅱ'}</span> ${b(authMotionPaused ? 'Play animation' : 'Pause animation', authMotionPaused ? 'অ্যানিমেশন চালু করুন' : 'অ্যানিমেশন থামান')}</button></footer>
  </main>`;
  $('#lu').value = remembered;
  document.body.classList.toggle('auth-motion-paused',authMotionPaused);
}

function showAuthHelp() {
  const help = $('#auth-recovery');
  help.hidden = !help.hidden;
}

function rememberAuthUsername() {
  try {
    if ($('#remember-name').checked) localStorage.setItem('khao-dao-username',v('lu').trim());
    else localStorage.removeItem('khao-dao-username');
  } catch (e) {}
}

function toggleAuthMotion(button) {
  authMotionPaused = !authMotionPaused;
  document.body.classList.toggle('auth-motion-paused',authMotionPaused);
  button.setAttribute('aria-pressed',String(authMotionPaused));
  button.innerHTML = `<span aria-hidden="true">${authMotionPaused ? '▷' : 'Ⅱ'}</span> ${b(authMotionPaused ? 'Play animation' : 'Pause animation',authMotionPaused ? 'অ্যানিমেশন চালু করুন' : 'অ্যানিমেশন থামান')}`;
}
