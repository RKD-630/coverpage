(() => {
  'use strict';

  // ---------- Platform data ----------
  // Each platform: id, name, output size, accent color, icon (letter/symbol), safe zone, filename
  const PLATFORMS = [
    {
      id: 'youtube', name: 'YouTube Banner',
      w: 2560, h: 1440,
      accent: '#FF0000', accentDark: '#CC0000',
      icon: '▶', iconBg: '#FF0000',
      safe: { w: 1546, h: 423, label: 'Text & logo safe area' },
      filename: 'youtube-cover',
      note: '2560 × 1440 px'
    },
    {
      id: 'facebook', name: 'Facebook Cover',
      w: 820, h: 312,
      accent: '#1877F2', accentDark: '#1461CC',
      icon: 'f', iconBg: '#1877F2',
      safe: { w: 640, h: 312, label: 'Mobile-safe area' },
      filename: 'facebook-cover',
      note: '820 × 312 px'
    },
    {
      id: 'twitter', name: 'X / Twitter Header',
      w: 1500, h: 500,
      accent: '#1DA1F2', accentDark: '#0D8BDB',
      icon: '𝕏', iconBg: '#000000',
      safe: { w: 600, h: 200, label: 'Mobile-safe area' },
      filename: 'x-header',
      note: '1500 × 500 px'
    },
    {
      id: 'linkedin', name: 'LinkedIn Cover',
      w: 1584, h: 396,
      accent: '#0A66C2', accentDark: '#084E96',
      icon: 'in', iconBg: '#0A66C2',
      safe: { w: 1200, h: 300, label: 'Text safe area' },
      filename: 'linkedin-cover',
      note: '1584 × 396 px'
    },
    {
      id: 'twitch', name: 'Twitch Banner',
      w: 1200, h: 480,
      accent: '#9146FF', accentDark: '#772CE8',
      icon: '⏂', iconBg: '#9146FF',
      safe: { w: 900, h: 360, label: 'Safe area' },
      filename: 'twitch-banner',
      note: '1200 × 480 px'
    },
    {
      id: 'pinterest', name: 'Pinterest Board',
      w: 1000, h: 1500,
      accent: '#E60023', accentDark: '#B8001C',
      icon: 'P', iconBg: '#E60023',
      safe: { w: 800, h: 1200, label: 'Safe area' },
      filename: 'pinterest-cover',
      note: '1000 × 1500 px'
    },
    {
      id: 'instagram', name: 'Instagram Post',
      w: 1080, h: 1080,
      accent: '#E4405F', accentDark: '#C13584',
      icon: '◎', iconBg: 'linear-gradient(135deg,#833AB4,#E4405F,#FCAF45)',
      safe: { w: 864, h: 864, label: 'Safe area' },
      filename: 'instagram-post',
      note: '1080 × 1080 px'
    },
    {
      id: 'story', name: 'IG / TikTok Story',
      w: 1080, h: 1920,
      accent: '#E4405F', accentDark: '#C13584',
      icon: '▮', iconBg: 'linear-gradient(135deg,#833AB4,#E4405F,#FCAF45)',
      safe: { w: 864, h: 1536, label: 'Safe area' },
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
  const modeSeg = $('modeSeg');
  const zoomRange = $('zoomRange');
  const zoomVal = $('zoomVal');
  const zoomInfo = $('zoomInfo');
  const blurRange = $('blurRange');
  const blurVal = $('blurVal');
  const blurBgToggle = $('blurBgToggle');
  const resetBtn = $('resetBtn');
  const centerBtn = $('centerBtn');
  const downloadCard = $('downloadCard');
  const downloadBtn = $('downloadBtn');
  const downloadTitle = $('downloadTitle');
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
    blurBg: false,
    blurAmount: 0,
    showSafe: false,
    baseScale: 1,
    platform: PLATFORMS[0]
  };

  // ---------- Theme ----------
  function applyTheme(theme){
    document.documentElement.setAttribute('data-theme', theme);
    try{ localStorage.setItem('cover-resizer-theme', theme); }catch(e){}
    // Update theme-color meta
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
    // Update active card
    [...platformsGrid.querySelectorAll('.platform-card')].forEach(c => {
      const active = c.dataset.id === id;
      c.classList.toggle('active', active);
      c.setAttribute('aria-selected', active);
    });
    // Update accent
    applyPlatformAccent(p);
    // Update canvas size
    previewCanvas.width = p.w;
    previewCanvas.height = p.h;
    previewStage.style.aspectRatio = `${p.w} / ${p.h}`;
    // Update labels
    currentPlatformLabel.textContent = p.name;
    outputSizeLabel.textContent = `${p.w} × ${p.h} px`;
    downloadSubtitle.textContent = `Exported at exactly ${p.w} × ${p.h} pixels.`;
    // Reset pan (old offsets may be out of range)
    state.offsetX = 0;
    state.offsetY = 0;
    if(state.img) render();
    updateSafeOverlay();
  }

  // ---------- Toast ----------
  let toastTimer;
  function toast(msg, type='info'){
    toastEl.textContent = msg;
    toastEl.className = 'toast show ' + (type || '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2800);
  }

  // ---------- File handling ----------
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

  function handleFile(file){
    const allowed = ['image/jpeg','image/png','image/webp'];
    if(!allowed.includes(file.type)){
      toast('Unsupported file type. Please use JPG, PNG, or WebP.', 'error');
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
          state.fileName = file.name;
          resetState();
          showInfo(file, img);
          editor.classList.add('show');
          downloadCard.classList.add('show');
          stickyDownload.classList.add('show');
          document.body.classList.add('has-image');
          render();
          toast('Image loaded. Adjust and download!', 'success');
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
    state.mode = 'fill';
    state.blurBg = false;
    state.blurAmount = 0;
    zoomRange.value = 100;
    blurRange.value = 0;
    blurVal.textContent = '0';
    updateModeUI();
    updateTogglesUI();
  }

  function computeBaseScale(){
    if(!state.img) return 1;
    const iw = state.img.naturalWidth;
    const ih = state.img.naturalHeight;
    const ow = state.platform.w;
    const oh = state.platform.h;
    if(state.mode === 'fill'){
      return Math.max(ow/iw, oh/ih);
    } else {
      return Math.min(ow/iw, oh/ih);
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

    // Background
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--stage-bg').trim() || '#111';
    ctx.fillRect(0,0,ow,oh);

    const baseScale = computeBaseScale();
    state.baseScale = baseScale;
    const scale = baseScale * state.zoom;

    const drawW = iw * scale;
    const drawH = ih * scale;

    // In fit mode with blur bg
    if(state.mode === 'fit' && (state.blurBg || state.blurAmount > 0)){
      const bgScale = Math.max(ow/iw, oh/ih);
      const bgW = iw * bgScale;
      const bgH = ih * bgScale;
      const bgX = (ow - bgW)/2;
      const bgY = (oh - bgH)/2;
      ctx.save();
      const blur = state.blurBg ? Math.max(state.blurAmount, 20) : state.blurAmount;
      if(blur > 0) ctx.filter = `blur(${blur}px)`;
      ctx.drawImage(state.img, bgX - blur*2, bgY - blur*2, bgW + blur*4, bgH + blur*4);
      ctx.restore();
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(0,0,ow,oh);
    }

    // Main image
    const x = (ow - drawW)/2 + state.offsetX;
    const y = (oh - drawH)/2 + state.offsetY;
    ctx.save();
    if(state.blurAmount > 0 && !(state.mode === 'fit' && state.blurBg)){
      ctx.filter = `blur(${state.blurAmount}px)`;
    }
    ctx.drawImage(state.img, x, y, drawW, drawH);
    ctx.restore();

    // Update zoom display
    const pct = Math.round(state.zoom * 100);
    zoomVal.textContent = pct + '%';
    zoomInfo.textContent = 'Zoom: ' + pct + '%';

    updateSafeOverlay();
  }

  function updateSafeOverlay(){
    if(!state.showSafe || !state.platform.safe){
      safeOverlay.classList.remove('show');
      return;
    }
    const rect = previewStage.getBoundingClientRect();
    const ow = state.platform.w;
    const oh = state.platform.h;
    const safe = state.platform.safe;
    const scaleX = rect.width / ow;
    const scaleY = rect.height / oh;
    const sx = (ow - safe.w)/2 * scaleX;
    const sy = (oh - safe.h)/2 * scaleY;
    const sw = safe.w * scaleX;
    const sh = safe.h * scaleY;
    safeOverlay.style.left = sx + 'px';
    safeOverlay.style.top = sy + 'px';
    safeOverlay.style.width = sw + 'px';
    safeOverlay.style.height = sh + 'px';
    safeLabel.textContent = safe.label || 'Safe area';
    safeOverlay.classList.add('show');
  }
  window.addEventListener('resize', updateSafeOverlay);

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
  }

  zoomRange.addEventListener('input', () => {
    state.zoom = parseInt(zoomRange.value, 10) / 100;
    render();
  });

  blurRange.addEventListener('input', () => {
    state.blurAmount = parseInt(blurRange.value, 10);
    blurVal.textContent = state.blurAmount;
    render();
  });

  blurBgToggle.addEventListener('click', () => {
    state.blurBg = !state.blurBg;
    updateTogglesUI();
    render();
  });
  blurBgToggle.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); blurBgToggle.click(); }
  });
  function updateTogglesUI(){
    blurBgToggle.classList.toggle('on', state.blurBg);
    blurBgToggle.setAttribute('aria-checked', state.blurBg);
  }

  resetBtn.addEventListener('click', () => {
    state.zoom = 1;
    state.offsetX = 0;
    state.offsetY = 0;
    state.blurAmount = 0;
    state.blurBg = false;
    zoomRange.value = 100;
    blurRange.value = 0;
    blurVal.textContent = '0';
    updateTogglesUI();
    render();
    toast('Reset to defaults', 'info');
  });
  centerBtn.addEventListener('click', () => {
    state.offsetX = 0;
    state.offsetY = 0;
    render();
  });

  safeToggleBtn.addEventListener('click', () => {
    state.showSafe = !state.showSafe;
    safeToggleBtn.classList.toggle('active', state.showSafe);
    updateSafeOverlay();
  });

  // ---------- Pan ----------
  let dragging = false;
  let lastX = 0, lastY = 0;

  function getPoint(e){
    if(e.touches && e.touches[0]) return {x:e.touches[0].clientX, y:e.touches[0].clientY};
    return {x:e.clientX, y:e.clientY};
  }

  previewCanvas.addEventListener('mousedown', (e) => {
    if(!state.img) return;
    dragging = true;
    lastX = e.clientX; lastY = e.clientY;
  });
  window.addEventListener('mousemove', (e) => {
    if(!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;
    panByScreen(dx, dy);
  });
  window.addEventListener('mouseup', () => dragging = false);

  previewCanvas.addEventListener('touchstart', (e) => {
    if(!state.img) return;
    if(e.touches.length !== 1) return;
    dragging = true;
    const p = getPoint(e);
    lastX = p.x; lastY = p.y;
  }, {passive:true});
  previewCanvas.addEventListener('touchmove', (e) => {
    if(!dragging || e.touches.length !== 1) return;
    e.preventDefault();
    const p = getPoint(e);
    const dx = p.x - lastX;
    const dy = p.y - lastY;
    lastX = p.x; lastY = p.y;
    panByScreen(dx, dy);
  }, {passive:false});
  previewCanvas.addEventListener('touchend', () => dragging = false);

  function panByScreen(dxScreen, dyScreen){
    const rect = previewStage.getBoundingClientRect();
    const dxOut = dxScreen * (state.platform.w / rect.width);
    const dyOut = dyScreen * (state.platform.h / rect.height);
    state.offsetX += dxOut;
    state.offsetY += dyOut;
    render();
  }

  // ---------- Download ----------
  function download(){
    if(!state.img){ toast('Please upload an image first.', 'error'); return; }
    try{
      const fmt = formatSelect.value;
      const mime = fmt === 'png' ? 'image/png' : 'image/jpeg';
      const quality = fmt === 'png' ? undefined : 0.92;
      const dataURL = previewCanvas.toDataURL(mime, quality);
      const ext = fmt === 'png' ? 'png' : 'jpg';
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = `${state.platform.filename}-${state.platform.w}x${state.platform.h}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast('Download started!', 'success');
    }catch(err){
      console.error(err);
      toast('Download failed. Try a different format.', 'error');
    }
  }
  downloadBtn.addEventListener('click', download);
  stickyDownloadBtn.addEventListener('click', () => {
    downloadCard.scrollIntoView({behavior:'smooth', block:'center'});
    setTimeout(download, 400);
  });

  // ---------- Init ----------
  buildPlatformGrid();
  buildPlatformList();
  applyPlatformAccent(state.platform);
  previewStage.style.aspectRatio = `${state.platform.w} / ${state.platform.h}`;
  updateModeUI();
  updateTogglesUI();

  // Re-apply accent when theme changes (so dark/light variants update)
  const themeObserver = new MutationObserver(() => {
    applyPlatformAccent(state.platform);
    if(state.img) render();
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
})();