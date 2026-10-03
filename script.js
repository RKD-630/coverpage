(() => {
  'use strict';

  // ---------- Platform data with safe zones & avatar positioning ----------
  const PLATFORMS = [
    {
      id: 'youtube', name: 'YouTube Banner',
      w: 2560, h: 1440,
      accent: '#FF0000', accentDark: '#CC0000',
      icon: '▶', iconBg: '#FF0000',
      safe: { w: 1546, h: 423, label: 'Text & logo safe area' },
      avatar: { cx: 220, cy: 220, r: 100, label: 'Channel Icon' },
      filename: 'youtube-cover',
      note: '2560 × 1440 px'
    },
    {
      id: 'facebook', name: 'Facebook Cover',
      w: 820, h: 312,
      accent: '#1877F2', accentDark: '#1461CC',
      icon: 'f', iconBg: '#1877F2',
      safe: { w: 640, h: 312, label: 'Mobile-safe area' },
      avatar: { cx: 110, cy: 235, r: 75, label: 'Profile Photo' },
      filename: 'facebook-cover',
      note: '820 × 312 px'
    },
    {
      id: 'twitter', name: 'X / Twitter Header',
      w: 1500, h: 500,
      accent: '#1DA1F2', accentDark: '#0D8BDB',
      icon: '𝕏', iconBg: '#000000',
      safe: { w: 600, h: 200, label: 'Mobile-safe area' },
      avatar: { cx: 190, cy: 400, r: 130, label: 'Avatar' },
      filename: 'x-header',
      note: '1500 × 500 px'
    },
    {
      id: 'linkedin', name: 'LinkedIn Cover',
      w: 1584, h: 396,
      accent: '#0A66C2', accentDark: '#084E96',
      icon: 'in', iconBg: '#0A66C2',
      safe: { w: 1200, h: 300, label: 'Text safe area' },
      avatar: { cx: 180, cy: 310, r: 120, label: 'Profile Photo' },
      filename: 'linkedin-cover',
      note: '1584 × 396 px'
    },
    {
      id: 'twitch', name: 'Twitch Banner',
      w: 1200, h: 480,
      accent: '#9146FF', accentDark: '#772CE8',
      icon: '⏂', iconBg: '#9146FF',
      safe: { w: 900, h: 360, label: 'Safe area' },
      avatar: { cx: 120, cy: 380, r: 80, label: 'Avatar' },
      filename: 'twitch-banner',
      note: '1200 × 480 px'
    },
    {
      id: 'pinterest', name: 'Pinterest Board',
      w: 1000, h: 1500,
      accent: '#E60023', accentDark: '#B8001C',
      icon: 'P', iconBg: '#E60023',
      safe: { w: 800, h: 1200, label: 'Safe area' },
      avatar: null,
      filename: 'pinterest-cover',
      note: '1000 × 1500 px'
    },
    {
      id: 'instagram', name: 'Instagram Post',
      w: 1080, h: 1080,
      accent: '#E4405F', accentDark: '#C13584',
      icon: '◎', iconBg: 'linear-gradient(135deg,#833AB4,#E4405F,#FCAF45)',
      safe: { w: 864, h: 864, label: 'Safe area' },
      avatar: null,
      filename: 'instagram-post',
      note: '1080 × 1080 px'
    },
    {
      id: 'story', name: 'IG / TikTok Story',
      w: 1080, h: 1920,
      accent: '#E4405F', accentDark: '#C13584',
      icon: '▮', iconBg: 'linear-gradient(135deg,#833AB4,#E4405F,#FCAF45)',
      safe: { w: 864, h: 1536, label: 'Safe area' },
      avatar: null,
      filename: 'story-cover',
      note: '1080 × 1920 px'
    }
  ];

  // ---------- Elements ----------
  const $ = (id) => document.getElementById(id);
  const themeToggle = $('themeToggle');
  const platformsGrid = $('platformsGrid');
  const platformList = $('platformList');
  const platformCount = $('platformCount');
  const currentPlatformLabel = $('currentPlatformLabel');
  const outputSizeLabel = $('outputSizeLabel');
  const dropzone = $('dropzone');
  const fileInput = $('fileInput');
  const uploadBtn = $('uploadBtn');
  const sampleBtn = $('sampleBtn');
  const changeBtn = $('changeBtn');
  const infoBar = $('infoBar');
  const thumb = $('thumb');
  const fileName = $('fileName');
  const fileMeta = $('fileMeta');
  const editor = $('editor');
  const previewCanvas = $('previewCanvas');
  const previewCtx = previewCanvas.getContext('2d');
  const previewStage = $('previewStage');
  const safeOverlay = $('safeOverlay');
  const safeLabel = $('safeLabel');
  const safeToggleBtn = $('safeToggleBtn');
  const avatarOverlay = $('avatarOverlay');
  const avatarToggleBtn = $('avatarToggleBtn');
  const modeSeg = $('modeSeg');
  const rotateBtn = $('rotateBtn');
  const flipHBtn = $('flipHBtn');
  const alignTopBtn = $('alignTopBtn');
  const alignBottomBtn = $('alignBottomBtn');
  const alignLeftBtn = $('alignLeftBtn');
  const alignRightBtn = $('alignRightBtn');
  const centerBtn = $('centerBtn');
  const zoomRange = $('zoomRange');
  const zoomVal = $('zoomVal');
  const zoomInfo = $('zoomInfo');
  const zoomOutBtn = $('zoomOutBtn');
  const zoomInBtn = $('zoomInBtn');
  const bgGroup = $('bgGroup');
  const bgOptions = $('bgOptions');
  const customBgColor = $('customBgColor');
  const customSwatch = $('customSwatch');
  const blurGroup = $('blurGroup');
  const blurRange = $('blurRange');
  const blurVal = $('blurVal');
  const brightnessRange = $('brightnessRange');
  const brightnessVal = $('brightnessVal');
  const contrastRange = $('contrastRange');
  const contrastVal = $('contrastVal');
  const gradientOverlayToggle = $('gradientOverlayToggle');
  const resetBtn = $('resetBtn');
  const downloadCard = $('downloadCard');
  const downloadBtn = $('downloadBtn');
  const downloadSubtitle = $('downloadSubtitle');
  const stickyDownload = $('stickyDownload');
  const stickyDownloadBtn = $('stickyDownloadBtn');
  const formatSelect = $('formatSelect');
  const toastEl = $('toast');

  const MAX_FILE_SIZE = 25 * 1024 * 1024;

  // ---------- State ----------
  const state = {
    img: null,
    fileName: '',
    zoom: 1,
    mode: 'fill',
    offsetX: 0,
    offsetY: 0,
    rotation: 0,
    flipH: false,
    bgStyle: 'blur',
    blurAmount: 25,
    brightness: 0,
    contrast: 0,
    gradientOverlay: false,
    showSafe: false,
    showAvatar: false,
    baseScale: 1,
    platform: PLATFORMS[0]
  };

  // ---------- Theme ----------
  function applyTheme(theme){
    document.documentElement.setAttribute('data-theme', theme);
    try{ localStorage.setItem('cover-resizer-theme', theme); }catch(e){}
    const meta = document.querySelector('meta[name="theme-color"]');
    if(meta) meta.setAttribute('content', theme === 'dark' ? '#17171A' : '#FF0000');
  }
  function initTheme(){
    let saved = null;
    try{ saved = localStorage.getItem('cover-resizer-theme'); }catch(e){}
    if(saved === 'dark' || saved === 'light'){
      applyTheme(saved);
    } else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){
      applyTheme('dark');
    } else {
      applyTheme('light');
    }
  }
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
  initTheme();

  // ---------- Platform accent theming ----------
  function applyPlatformAccent(platform){
    const root = document.documentElement;
    const isDark = root.getAttribute('data-theme') === 'dark';
    const accent = isDark ? lightenColor(platform.accent, 15) : platform.accent;
    const accentDark = isDark ? platform.accent : platform.accentDark;
    const accentSoft = isDark ? hexToRgba(platform.accent, 0.12) : hexToRgba(platform.accent, 0.08);
    const accentGlow = hexToRgba(platform.accent, isDark ? 0.35 : 0.3);

    root.style.setProperty('--accent', accent);
    root.style.setProperty('--accent-dark', accentDark);
    root.style.setProperty('--accent-soft', accentSoft);
    root.style.setProperty('--accent-glow', accentGlow);
  }
  function hexToRgba(hex, alpha){
    if(!hex || hex.startsWith('linear')) return `rgba(255,0,0,${alpha})`;
    const h = hex.replace('#','');
    const r = parseInt(h.substring(0,2),16);
    const g = parseInt(h.substring(2,4),16);
    const b = parseInt(h.substring(4,6),16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  function lightenColor(hex, percent){
    if(!hex || hex.startsWith('linear')) return hex;
    const h = hex.replace('#','');
    let r = parseInt(h.substring(0,2),16);
    let g = parseInt(h.substring(2,4),16);
    let b = parseInt(h.substring(4,6),16);
    r = Math.min(255, r + Math.round((255-r) * percent/100));
    g = Math.min(255, g + Math.round((255-g) * percent/100));
    b = Math.min(255, b + Math.round((255-b) * percent/100));
    return '#' + [r,g,b].map(x => x.toString(16).padStart(2,'0')).join('');
  }

  // ---------- Build platform UI ----------
  function buildPlatformGrid(){
    platformsGrid.innerHTML = '';
    PLATFORMS.forEach((p, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'platform-card' + (i === 0 ? ' active' : '');
      btn.setAttribute('role','tab');
      btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      btn.dataset.id = p.id;
      btn.innerHTML = `
        <div class="platform-icon" style="background:${p.iconBg}">${p.icon}</div>
        <div class="platform-info">
          <div class="platform-name">${p.name}</div>
          <div class="platform-size">${p.w} × ${p.h}</div>
        </div>
      `;
      btn.addEventListener('click', () => selectPlatform(p.id));
      platformsGrid.appendChild(btn);
    });
    platformCount.textContent = PLATFORMS.length + ' sizes';
  }
  function buildPlatformList(){
    platformList.innerHTML = '';
    PLATFORMS.forEach(p => {
      const item = document.createElement('div');
      item.className = 'platform-list-item';
      item.innerHTML = `
        <div class="platform-icon" style="background:${p.iconBg}">${p.icon}</div>
        <div>
          <div class="platform-name">${p.name}</div>
          <div class="platform-size">${p.note}</div>
        </div>
      `;
      platformList.appendChild(item);
    });
  }

  function selectPlatform(id){
    const p = PLATFORMS.find(x => x.id === id);
    if(!p || p.id === state.platform.id) return;
    state.platform = p;
    [...platformsGrid.querySelectorAll('.platform-card')].forEach(c => {
      const active = c.dataset.id === id;
      c.classList.toggle('active', active);
      c.setAttribute('aria-selected', active);
    });
    applyPlatformAccent(p);

    previewCanvas.width = p.w;
    previewCanvas.height = p.h;
    previewStage.style.aspectRatio = `${p.w} / ${p.h}`;

    currentPlatformLabel.textContent = p.name;
    outputSizeLabel.textContent = `${p.w} × ${p.h} px`;
    downloadSubtitle.textContent = `Exported at exactly ${p.w} × ${p.h} pixels.`;

    state.offsetX = 0;
    state.offsetY = 0;
    if(state.img) render();
    updateSafeOverlay();
    updateAvatarOverlay();
  }

  // ---------- Toast ----------
  let toastTimer;
  function toast(msg, type='info'){
    toastEl.textContent = msg;
    toastEl.className = 'toast show ' + (type || '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2800);
  }

  // ---------- File & Sample Handling ----------
  function openPicker(){ fileInput.click(); }
  uploadBtn.addEventListener('click', (e) => { e.stopPropagation(); openPicker(); });
  changeBtn.addEventListener('click', openPicker);
  dropzone.addEventListener('click', (e) => {
    if(e.target.closest('button')) return;
    openPicker();
  });
  dropzone.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openPicker(); }
  });

  ['dragenter','dragover'].forEach(ev => {
    dropzone.addEventListener(ev, (e) => {
      e.preventDefault(); e.stopPropagation();
      dropzone.classList.add('dragover');
    });
  });
  ['dragleave','drop'].forEach(ev => {
    dropzone.addEventListener(ev, (e) => {
      e.preventDefault(); e.stopPropagation();
      dropzone.classList.remove('dragover');
    });
  });
  dropzone.addEventListener('drop', (e) => {
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    if(f) handleFile(f);
  });
  fileInput.addEventListener('change', (e) => {
    const f = e.target.files && e.target.files[0];
    if(f) handleFile(f);
    fileInput.value = '';
  });

  // Clipboard paste support
  window.addEventListener('paste', (e) => {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for(let item of items){
      if(item.type.indexOf('image') === 0){
        const blob = item.getAsFile();
        if(blob){
          handleFile(blob);
          toast('Pasted image from clipboard!', 'success');
          break;
        }
      }
    }
  });

  function handleFile(file){
    if(file.type && !file.type.startsWith('image/')){
      toast('Please select an image file (JPG, PNG, WebP, etc.).', 'error');
      return;
    }
    if(file.size > MAX_FILE_SIZE){
      toast('Image is too large (max 25 MB).', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        try{
          state.img = img;
          state.fileName = file.name || 'custom-cover.jpg';
          resetState();
          showInfo(file, img);
          editor.classList.add('show');
          downloadCard.classList.add('show');
          stickyDownload.classList.add('show');
          document.body.classList.add('has-image');
          render();
          toast('Image loaded! Adjust and download.', 'success');
          editor.scrollIntoView({behavior:'smooth', block:'start'});
        }catch(err){
          console.error(err);
          toast('Failed to process image.', 'error');
        }
      };
      img.onerror = () => toast('Could not read image file.', 'error');
      img.src = ev.target.result;
    };
    reader.onerror = () => toast('Failed to read file.', 'error');
    reader.readAsDataURL(file);
  }

  // Generate procedural sample cover
  sampleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const sampleCanvas = document.createElement('canvas');
    sampleCanvas.width = 1920;
    sampleCanvas.height = 1080;
    const sCtx = sampleCanvas.getContext('2d');

    // Vibrant sky gradient
    const grad = sCtx.createLinearGradient(0, 0, 1920, 1080);
    grad.addColorStop(0, '#1e1b4b');
    grad.addColorStop(0.35, '#4338ca');
    grad.addColorStop(0.65, '#e11d48');
    grad.addColorStop(1, '#fbbf24');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 1920, 1080);

    // Glowing sun
    sCtx.save();
    const sunGrad = sCtx.createRadialGradient(960, 480, 20, 960, 480, 260);
    sunGrad.addColorStop(0, 'rgba(255, 245, 200, 0.95)');
    sunGrad.addColorStop(0.3, 'rgba(255, 180, 50, 0.6)');
    sunGrad.addColorStop(1, 'rgba(255, 100, 50, 0)');
    sCtx.fillStyle = sunGrad;
    sCtx.beginPath();
    sCtx.arc(960, 480, 260, 0, Math.PI * 2);
    sCtx.fill();
    sCtx.restore();

    // Mountain silhouettes in foreground
    sCtx.fillStyle = '#0f172a';
    sCtx.beginPath();
    sCtx.moveTo(0, 1080);
    sCtx.lineTo(0, 750);
    sCtx.lineTo(340, 560);
    sCtx.lineTo(600, 720);
    sCtx.lineTo(960, 440);
    sCtx.lineTo(1320, 700);
    sCtx.lineTo(1580, 580);
    sCtx.lineTo(1920, 780);
    sCtx.lineTo(1920, 1080);
    sCtx.closePath();
    sCtx.fill();

    // Secondary mountain layer
    sCtx.fillStyle = '#090d16';
    sCtx.beginPath();
    sCtx.moveTo(0, 1080);
    sCtx.lineTo(0, 860);
    sCtx.lineTo(240, 760);
    sCtx.lineTo(520, 920);
    sCtx.lineTo(820, 680);
    sCtx.lineTo(1180, 900);
    sCtx.lineTo(1500, 740);
    sCtx.lineTo(1920, 890);
    sCtx.lineTo(1920, 1080);
    sCtx.closePath();
    sCtx.fill();

    // Modern title text
    sCtx.fillStyle = 'rgba(255,255,255,0.95)';
    sCtx.font = '800 68px Inter, sans-serif';
    sCtx.textAlign = 'center';
    sCtx.fillText('CREATIVE STUDIO', 960, 260);
    sCtx.fillStyle = 'rgba(255,255,255,0.7)';
    sCtx.font = '500 28px Inter, sans-serif';
    sCtx.fillText('Official Channel Cover · High Resolution', 960, 315);

    sampleCanvas.toBlob((blob) => {
      const file = new File([blob], 'sample-scenic-cover.jpg', { type: 'image/jpeg' });
      handleFile(file);
    }, 'image/jpeg', 0.95);
  });

  function showInfo(file, img){
    thumb.style.backgroundImage = `url(${img.src})`;
    fileName.textContent = file.name;
    fileMeta.textContent = `${img.naturalWidth} × ${img.naturalHeight} px · ${formatBytes(file.size)}`;
    infoBar.classList.add('show');
  }

  function formatBytes(b){
    if(b < 1024) return b + ' B';
    if(b < 1024*1024) return (b/1024).toFixed(1) + ' KB';
    return (b/1024/1024).toFixed(2) + ' MB';
  }

  // ---------- State helpers ----------
  function resetState(){
    state.zoom = 1;
    state.offsetX = 0;
    state.offsetY = 0;
    state.rotation = 0;
    state.flipH = false;
    state.mode = 'fill';
    state.bgStyle = 'blur';
    state.blurAmount = 25;
    state.brightness = 0;
    state.contrast = 0;
    state.gradientOverlay = false;

    zoomRange.value = 100;
    blurRange.value = 25;
    blurVal.textContent = '25px';
    brightnessRange.value = 0;
    brightnessVal.textContent = '0';
    contrastRange.value = 0;
    contrastVal.textContent = '0';
    gradientOverlayToggle.classList.remove('on');
    gradientOverlayToggle.setAttribute('aria-checked', 'false');

    updateModeUI();
    updateBgUI();
  }

  function computeBaseScale(){
    if(!state.img) return 1;
    const iw = state.img.naturalWidth;
    const ih = state.img.naturalHeight;
    const ow = state.platform.w;
    const oh = state.platform.h;
    // Swap dimensions if rotated 90 or 270 degrees
    const effectiveIw = (state.rotation % 180 === 0) ? iw : ih;
    const effectiveIh = (state.rotation % 180 === 0) ? ih : iw;

    if(state.mode === 'fill'){
      return Math.max(ow / effectiveIw, oh / effectiveIh);
    } else {
      return Math.min(ow / effectiveIw, oh / effectiveIh);
    }
  }

  // ---------- Rendering ----------
  function render(){
    if(!state.img) return;
    const ctx = previewCtx;
    const iw = state.img.naturalWidth;
    const ih = state.img.naturalHeight;
    const ow = state.platform.w;
    const oh = state.platform.h;

    ctx.clearRect(0, 0, ow, oh);

    const baseScale = computeBaseScale();
    state.baseScale = baseScale;
    const scale = baseScale * state.zoom;

    const effectiveIw = (state.rotation % 180 === 0) ? iw : ih;
    const effectiveIh = (state.rotation % 180 === 0) ? ih : iw;

    // Background handling for Fit mode or stage canvas
    if(state.mode === 'fit'){
      if(state.bgStyle === 'blur'){
        const bgScale = Math.max(ow / effectiveIw, oh / effectiveIh) * 1.08;
        ctx.save();
        ctx.filter = `blur(${state.blurAmount}px) brightness(0.8)`;
        ctx.translate(ow / 2, oh / 2);
        if(state.rotation !== 0) ctx.rotate((state.rotation * Math.PI) / 180);
        if(state.flipH) ctx.scale(-1, 1);
        ctx.drawImage(state.img, -iw * bgScale / 2, -ih * bgScale / 2, iw * bgScale, ih * bgScale);
        ctx.restore();

        // Subtle dark wash for depth
        ctx.fillStyle = 'rgba(0,0,0,0.18)';
        ctx.fillRect(0, 0, ow, oh);
      } else {
        ctx.fillStyle = state.bgStyle;
        ctx.fillRect(0, 0, ow, oh);
      }
    } else {
      // Fill mode default canvas background
      ctx.fillStyle = '#0f0f12';
      ctx.fillRect(0, 0, ow, oh);
    }

    // Main Image Drawing with Transform, Flip, and Filters
    ctx.save();
    ctx.translate(ow / 2 + state.offsetX, oh / 2 + state.offsetY);
    if(state.rotation !== 0) ctx.rotate((state.rotation * Math.PI) / 180);
    if(state.flipH) ctx.scale(-1, 1);

    // Apply color tone filters
    const filterTokens = [];
    if(state.brightness !== 0){
      filterTokens.push(`brightness(${1 + state.brightness / 100})`);
    }
    if(state.contrast !== 0){
      filterTokens.push(`contrast(${1 + state.contrast / 100})`);
    }
    if(filterTokens.length > 0){
      ctx.filter = filterTokens.join(' ');
    }

    const drawW = iw * scale;
    const drawH = ih * scale;
    ctx.drawImage(state.img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    // Dark Gradient Overlay for text clarity if enabled
    if(state.gradientOverlay){
      const gradH = oh * 0.45;
      const grad = ctx.createLinearGradient(0, oh - gradH, 0, oh);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(0,0,0,0.72)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, oh - gradH, ow, gradH);
    }

    // Update zoom display
    const pct = Math.round(state.zoom * 100);
    zoomVal.textContent = pct + '%';
    zoomInfo.textContent = 'Zoom: ' + pct + '%';

    updateSafeOverlay();
    updateAvatarOverlay();
  }

  // ---------- Safe area & Avatar Overlay Positioning (Percentage-Based) ----------
  function updateSafeOverlay(){
    if(!state.showSafe || !state.platform.safe){
      safeOverlay.classList.remove('show');
      return;
    }
    const ow = state.platform.w;
    const oh = state.platform.h;
    const safe = state.platform.safe;

    // Percentage coordinates ensure 100% responsiveness without jitter
    safeOverlay.style.left = `${((ow - safe.w) / (2 * ow)) * 100}%`;
    safeOverlay.style.top = `${((oh - safe.h) / (2 * oh)) * 100}%`;
    safeOverlay.style.width = `${(safe.w / ow) * 100}%`;
    safeOverlay.style.height = `${(safe.h / oh) * 100}%`;
    safeLabel.textContent = safe.label || 'Safe area';
    safeOverlay.classList.add('show');
  }

  function updateAvatarOverlay(){
    if(!state.showAvatar || !state.platform.avatar){
      avatarOverlay.classList.remove('show');
      return;
    }
    const ow = state.platform.w;
    const oh = state.platform.h;
    const av = state.platform.avatar;

    const leftPct = ((av.cx - av.r) / ow) * 100;
    const topPct = ((av.cy - av.r) / oh) * 100;
    const widthPct = ((av.r * 2) / ow) * 100;
    const heightPct = ((av.r * 2) / oh) * 100;

    avatarOverlay.style.left = `${leftPct}%`;
    avatarOverlay.style.top = `${topPct}%`;
    avatarOverlay.style.width = `${widthPct}%`;
    avatarOverlay.style.height = `${heightPct}%`;
    avatarOverlay.innerHTML = `<span>${av.label}</span>`;
    avatarOverlay.classList.add('show');
  }

  // ---------- Controls ----------
  modeSeg.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-mode]');
    if(!btn) return;
    state.mode = btn.dataset.mode;
    state.offsetX = 0;
    state.offsetY = 0;
    updateModeUI();
    render();
  });
  function updateModeUI(){
    [...modeSeg.querySelectorAll('button')].forEach(b => {
      const active = b.dataset.mode === state.mode;
      b.classList.toggle('active', active);
      b.setAttribute('aria-selected', active);
    });
    // Show/hide background controls based on fit mode
    if(state.mode === 'fit'){
      bgGroup.style.display = 'flex';
      blurGroup.style.display = state.bgStyle === 'blur' ? 'flex' : 'none';
    } else {
      bgGroup.style.display = 'none';
      blurGroup.style.display = 'none';
    }
  }

  function setZoom(val){
    state.zoom = Math.round(val * 100) / 100;
    zoomRange.value = Math.round(state.zoom * 100);
    render();
  }
  zoomRange.addEventListener('input', () => {
    state.zoom = parseInt(zoomRange.value, 10) / 100;
    render();
  });
  zoomOutBtn.addEventListener('click', () => {
    setZoom(Math.max(0.5, state.zoom - 0.1));
  });
  zoomInBtn.addEventListener('click', () => {
    setZoom(Math.min(3.0, state.zoom + 0.1));
  });

  // Mouse wheel zoom on preview stage
  previewStage.addEventListener('wheel', (e) => {
    if(!state.img) return;
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.08 : -0.08;
    setZoom(Math.min(3.0, Math.max(0.5, state.zoom + delta)));
  }, {passive:false});

  // Rotation & Flip
  rotateBtn.addEventListener('click', () => {
    state.rotation = (state.rotation + 90) % 360;
    state.offsetX = 0;
    state.offsetY = 0;
    render();
    toast(`Rotated ${state.rotation}°`, 'info');
  });

  flipHBtn.addEventListener('click', () => {
    state.flipH = !state.flipH;
    flipHBtn.classList.toggle('active', state.flipH);
    render();
    toast(state.flipH ? 'Mirrored horizontally' : 'Normal orientation', 'info');
  });

  // Quick Alignment Presets
  alignTopBtn.addEventListener('click', () => {
    if(!state.img) return;
    const scale = state.baseScale * state.zoom;
    const ih = (state.rotation % 180 === 0) ? state.img.naturalHeight : state.img.naturalWidth;
    const drawH = ih * scale;
    state.offsetY = (drawH - state.platform.h) / 2;
    render();
  });

  alignBottomBtn.addEventListener('click', () => {
    if(!state.img) return;
    const scale = state.baseScale * state.zoom;
    const ih = (state.rotation % 180 === 0) ? state.img.naturalHeight : state.img.naturalWidth;
    const drawH = ih * scale;
    state.offsetY = (state.platform.h - drawH) / 2;
    render();
  });

  alignLeftBtn.addEventListener('click', () => {
    if(!state.img) return;
    const scale = state.baseScale * state.zoom;
    const iw = (state.rotation % 180 === 0) ? state.img.naturalWidth : state.img.naturalHeight;
    const drawW = iw * scale;
    state.offsetX = (drawW - state.platform.w) / 2;
    render();
  });

  alignRightBtn.addEventListener('click', () => {
    if(!state.img) return;
    const scale = state.baseScale * state.zoom;
    const iw = (state.rotation % 180 === 0) ? state.img.naturalWidth : state.img.naturalHeight;
    const drawW = iw * scale;
    state.offsetX = (state.platform.w - drawW) / 2;
    render();
  });

  centerBtn.addEventListener('click', () => {
    state.offsetX = 0;
    state.offsetY = 0;
    render();
    toast('Centered', 'info');
  });

  // Background Options (Fit mode)
  bgOptions.addEventListener('click', (e) => {
    const opt = e.target.closest('.bg-opt');
    if(!opt) return;
    if(opt.classList.contains('bg-custom-label')){
      customBgColor.click();
      return;
    }
    state.bgStyle = opt.dataset.bg;
    updateBgUI();
    render();
  });

  customBgColor.addEventListener('input', (e) => {
    state.bgStyle = e.target.value;
    customSwatch.style.background = state.bgStyle;
    updateBgUI(true);
    render();
  });

  function updateBgUI(isCustom=false){
    [...bgOptions.querySelectorAll('.bg-opt')].forEach(opt => {
      if(isCustom && opt.classList.contains('bg-custom-label')){
        opt.classList.add('active');
      } else {
        opt.classList.toggle('active', opt.dataset.bg === state.bgStyle);
      }
    });
    blurGroup.style.display = (state.mode === 'fit' && state.bgStyle === 'blur') ? 'flex' : 'none';
  }

  blurRange.addEventListener('input', () => {
    state.blurAmount = parseInt(blurRange.value, 10);
    blurVal.textContent = `${state.blurAmount}px`;
    render();
  });

  // Brightness & Contrast
  brightnessRange.addEventListener('input', () => {
    state.brightness = parseInt(brightnessRange.value, 10);
    brightnessVal.textContent = state.brightness > 0 ? `+${state.brightness}` : state.brightness;
    render();
  });

  contrastRange.addEventListener('input', () => {
    state.contrast = parseInt(contrastRange.value, 10);
    contrastVal.textContent = state.contrast > 0 ? `+${state.contrast}` : state.contrast;
    render();
  });

  gradientOverlayToggle.addEventListener('click', () => {
    state.gradientOverlay = !state.gradientOverlay;
    gradientOverlayToggle.classList.toggle('on', state.gradientOverlay);
    gradientOverlayToggle.setAttribute('aria-checked', state.gradientOverlay);
    render();
  });
  gradientOverlayToggle.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); gradientOverlayToggle.click(); }
  });

  safeToggleBtn.addEventListener('click', () => {
    state.showSafe = !state.showSafe;
    safeToggleBtn.classList.toggle('active', state.showSafe);
    updateSafeOverlay();
  });

  avatarToggleBtn.addEventListener('click', () => {
    if(!state.platform.avatar){
      toast('This platform does not overlap a profile photo.', 'info');
      return;
    }
    state.showAvatar = !state.showAvatar;
    avatarToggleBtn.classList.toggle('active', state.showAvatar);
    updateAvatarOverlay();
  });

  resetBtn.addEventListener('click', () => {
    resetState();
    render();
    toast('Reset all adjustments to defaults', 'info');
  });

  // ---------- Panning (Mouse & Touch) ----------
  let dragging = false;
  let lastX = 0, lastY = 0;
  let initialPinchDistance = null;
  let initialPinchZoom = 1;

  function panByScreen(dxScreen, dyScreen){
    const rect = previewStage.getBoundingClientRect();
    if(!rect.width || !rect.height) return;
    const dxOut = dxScreen * (state.platform.w / rect.width);
    const dyOut = dyScreen * (state.platform.h / rect.height);
    state.offsetX += dxOut;
    state.offsetY += dyOut;
    render();
  }

  previewCanvas.addEventListener('mousedown', (e) => {
    if(!state.img) return;
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
  });

  window.addEventListener('mousemove', (e) => {
    if(!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    panByScreen(dx, dy);
  });

  window.addEventListener('mouseup', () => { dragging = false; });

  // Touch Support (Single finger drag & 2-finger pinch-to-zoom)
  previewCanvas.addEventListener('touchstart', (e) => {
    if(!state.img) return;
    if(e.touches.length === 1){
      dragging = true;
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY;
    } else if(e.touches.length === 2){
      dragging = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      initialPinchDistance = Math.hypot(dx, dy);
      initialPinchZoom = state.zoom;
    }
  }, {passive:true});

  previewCanvas.addEventListener('touchmove', (e) => {
    if(!state.img) return;
    if(e.touches.length === 1 && dragging){
      e.preventDefault();
      const dx = e.touches[0].clientX - lastX;
      const dy = e.touches[0].clientY - lastY;
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY;
      panByScreen(dx, dy);
    } else if(e.touches.length === 2 && initialPinchDistance){
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const factor = dist / initialPinchDistance;
      setZoom(Math.min(3.0, Math.max(0.5, initialPinchZoom * factor)));
    }
  }, {passive:false});

  previewCanvas.addEventListener('touchend', () => {
    dragging = false;
    initialPinchDistance = null;
  });

  // ---------- Download (Instant Execution to prevent browser blockers) ----------
  function download(){
    if(!state.img){
      toast('Please upload an image first.', 'error');
      return;
    }
    try{
      const fmt = formatSelect.value;
      let mime = 'image/jpeg';
      let ext = 'jpg';
      let quality = 0.95;

      if(fmt === 'png'){
        mime = 'image/png';
        ext = 'png';
        quality = undefined;
      } else if(fmt === 'webp'){
        mime = 'image/webp';
        ext = 'webp';
        quality = 0.92;
      }

      const dataURL = previewCanvas.toDataURL(mime, quality);
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = `${state.platform.filename}-${state.platform.w}x${state.platform.h}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast('Cover downloaded successfully!', 'success');
    }catch(err){
      console.error(err);
      toast('Download failed. Try a different format.', 'error');
    }
  }

  downloadBtn.addEventListener('click', download);
  stickyDownloadBtn.addEventListener('click', download);

  // ---------- Init ----------
  buildPlatformGrid();
  buildPlatformList();
  applyPlatformAccent(state.platform);
  previewStage.style.aspectRatio = `${state.platform.w} / ${state.platform.h}`;
  updateModeUI();

  // Re-apply accent when theme changes
  const themeObserver = new MutationObserver(() => {
    applyPlatformAccent(state.platform);
    if(state.img) render();
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
})();