/**
 * MINECRAFT DEVELOPER PORTFOLIO - JAVASCRIPT ENGINE
 * Handles: Web Audio API synthesis, Hotbar navigation, Crafting Table logic,
 * Dimension Warp, Lore Tooltips, and Advancements.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. RETRO 8-BIT AUDIO SYNTHESIS (Zero External Audio Files)
  // ============================================================
  class RetroAudioEngine {
    constructor() {
      this.ctx = null;
      this.soundEnabled = localStorage.getItem('mc_sfx') !== 'false';
      this.initContext();
    }

    initContext() {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }

    ensureContext() {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playClick() {
      if (!this.soundEnabled || !this.ctx) return;
      this.ensureContext();
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.06);
      } catch (e) {
        console.warn('Audio error:', e);
      }
    }

    playPop() {
      if (!this.soundEnabled || !this.ctx) return;
      this.ensureContext();
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(900, this.ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.09);
      } catch (e) {
        console.warn('Audio error:', e);
      }
    }

    playLevelUp() {
      if (!this.soundEnabled || !this.ctx) return;
      this.ensureContext();
      try {
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const start = this.ctx.currentTime + (idx * 0.08);

          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, start);

          gain.gain.setValueAtTime(0.12, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.15);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(start);
          osc.stop(start + 0.16);
        });
      } catch (e) {
        console.warn('Audio error:', e);
      }
    }

    playWarp() {
      if (!this.soundEnabled || !this.ctx) return;
      this.ensureContext();
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(600, this.ctx.currentTime + 0.25);
        osc.frequency.linearRampToValueAtTime(90, this.ctx.currentTime + 0.5);

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.52);
      } catch (e) {
        console.warn('Audio error:', e);
      }
    }

    playCraft() {
      if (!this.soundEnabled || !this.ctx) return;
      this.ensureContext();
      try {
        // Metallic hammer anvil chime
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 0.15);

        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.16);
      } catch (e) {
        console.warn('Audio error:', e);
      }
    }

    playHiss() {
      if (!this.soundEnabled || !this.ctx) return;
      this.ensureContext();
      try {
        // White noise burst for creeper hiss
        const bufferSize = this.ctx.sampleRate * 0.4;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1800;

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start();
        noise.stop(this.ctx.currentTime + 0.42);
      } catch (e) {
        console.warn('Audio error:', e);
      }
    }

    toggleSound() {
      this.soundEnabled = !this.soundEnabled;
      localStorage.setItem('mc_sfx', this.soundEnabled);
      return this.soundEnabled;
    }
  }

  const sfx = new RetroAudioEngine();

  // ============================================================
  // 2. ADVANCEMENT TOAST NOTIFIER
  // ============================================================
  const toast = document.getElementById('advancement-toast');
  const toastMsg = document.getElementById('toast-message');
  let toastTimer = null;

  function showAdvancement(message) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = message;
    toast.classList.remove('hidden');
    sfx.playLevelUp();

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.add('hidden');
    }, 4500);
  }

  // Initial welcome advancement after 1 second
  setTimeout(() => {
    showAdvancement("Welcome to Vinayak's World (PSIT Kanpur)!");
  }, 1200);

  // ============================================================
  // 3. SOUND CONTROLS & TOGGLES
  // ============================================================
  const soundToggleBtn = document.getElementById('sound-toggle');
  const hotbarSoundBtn = document.getElementById('hotbar-sound-btn');
  const hotbarSoundIcon = document.getElementById('hotbar-sound-icon');

  function updateSoundUI(enabled) {
    if (soundToggleBtn) {
      soundToggleBtn.querySelector('.btn-icon').textContent = enabled ? '🔊' : '🔇';
      soundToggleBtn.querySelector('.btn-label').textContent = enabled ? 'SFX: ON' : 'SFX: OFF';
    }
    if (hotbarSoundIcon) {
      hotbarSoundIcon.textContent = enabled ? '🔊' : '🔇';
    }
  }

  function handleSoundToggle() {
    const enabled = sfx.toggleSound();
    updateSoundUI(enabled);
    if (enabled) {
      sfx.playPop();
      showAdvancement("Audio Synthesizer Activated!");
    }
  }

  if (soundToggleBtn) soundToggleBtn.addEventListener('click', handleSoundToggle);
  if (hotbarSoundBtn) hotbarSoundBtn.addEventListener('click', handleSoundToggle);
  updateSoundUI(sfx.soundEnabled);

  // ============================================================
  // 4. DIMENSION WARP (Overworld <-> Nether Dimension)
  // ============================================================
  const dimensionBtn = document.getElementById('dimension-toggle');
  const hotbarDimBtn = document.getElementById('hotbar-dimension-btn');
  const bannerImg = document.getElementById('hero-banner-img');
  let isNether = false;

  function toggleDimension() {
    isNether = !isNether;
    sfx.playWarp();

    if (isNether) {
      document.body.classList.remove('theme-overworld');
      document.body.classList.add('theme-nether');
      if (bannerImg) bannerImg.src = 'assets/nether.jpg';
      if (dimensionBtn) {
        dimensionBtn.querySelector('.btn-icon').textContent = '🌿';
        dimensionBtn.querySelector('.btn-label').textContent = 'Overworld';
      }
      showAdvancement("We Need to Go Deeper (Nether Dimension)!");
    } else {
      document.body.classList.remove('theme-nether');
      document.body.classList.add('theme-overworld');
      if (bannerImg) bannerImg.src = 'assets/banner.jpg';
      if (dimensionBtn) {
        dimensionBtn.querySelector('.btn-icon').textContent = '🌋';
        dimensionBtn.querySelector('.btn-label').textContent = 'Nether Warp';
      }
      showAdvancement("Returned to the Overworld!");
    }
  }

  if (dimensionBtn) dimensionBtn.addEventListener('click', toggleDimension);
  if (hotbarDimBtn) hotbarDimBtn.addEventListener('click', toggleDimension);

  // ============================================================
  // 5. MINECRAFT LORE TOOLTIP SYSTEM (Responsive & Touch Ready)
  // ============================================================
  const tooltip = document.getElementById('mc-tooltip');
  const ttName = document.getElementById('tt-name');
  const ttType = document.getElementById('tt-type');
  const ttLore = document.getElementById('tt-lore');
  const ttStat = document.getElementById('tt-stat');
  const ttEnchant = document.getElementById('tt-enchant');

  const interactiveSlots = document.querySelectorAll('.inv-slot.has-item');

  function populateTooltip(slot) {
    const name = slot.dataset.name || 'Unknown Artifact';
    const rarity = slot.dataset.rarity || 'Common';
    const type = slot.dataset.type || 'Equipment';
    const lore = slot.dataset.lore || '';
    const stat = slot.dataset.stat || '';
    const enchant = slot.dataset.enchantment || '';

    ttName.textContent = name;
    ttName.className = 'tooltip-header';
    if (rarity === 'Legendary') ttName.classList.add('text-gold');
    else if (rarity === 'Epic') ttName.classList.add('text-purple');
    else if (rarity === 'Rare') ttName.classList.add('text-aqua');

    ttType.textContent = `${rarity} ${type}`;
    ttLore.textContent = lore;
    ttStat.textContent = stat;
    ttEnchant.textContent = enchant;

    tooltip.classList.remove('hidden');
  }

  function positionTooltip(clientX, clientY) {
    const ttWidth = tooltip.offsetWidth || 260;
    const ttHeight = tooltip.offsetHeight || 160;
    let x = clientX + 14;
    let y = clientY + 14;

    // Viewport clamping so tooltip never clips off-screen on phones/tablets
    if (x + ttWidth > window.innerWidth - 10) {
      x = Math.max(10, clientX - ttWidth - 10);
    }
    if (y + ttHeight > window.innerHeight - 80) {
      y = Math.max(60, clientY - ttHeight - 10);
    }

    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
  }

  interactiveSlots.forEach(slot => {
    // Desktop Hover
    slot.addEventListener('mouseenter', () => {
      sfx.playPop();
      populateTooltip(slot);
    });

    slot.addEventListener('mousemove', (e) => {
      positionTooltip(e.clientX, e.clientY);
    });

    slot.addEventListener('mouseleave', () => {
      tooltip.classList.add('hidden');
    });

    // Mobile / Tablet Tap Interaction
    slot.addEventListener('click', (e) => {
      sfx.playPop();
      populateTooltip(slot);
      const rect = slot.getBoundingClientRect();
      positionTooltip(rect.left + rect.width / 2, rect.top);
      e.stopPropagation();
    });
  });

  // Tap anywhere outside to dismiss tooltip on mobile
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.inv-slot.has-item')) {
      tooltip.classList.add('hidden');
    }
  });

  // ============================================================
  // 6. CRAFTING TABLE RECIPES & FORGE
  // ============================================================
  const recipes = {
    algoplay: {
      title: "Java DSA Arena & Visualizer",
      badge: "★ Legendary Project",
      desc: "A high-performance algorithmic visualizer built in Java showcasing core searching, sorting (QuickSort, MergeSort), graph traversals (BFS, DFS), and dynamic tree balance animations with step-by-step metrics.",
      ingredients: ["☕ Java 17", "🧩 OOP Design", "📊 DSA Complexity Engine"],
      grid: ["☕", "🧩", "📊", "⚡", "☕", "⚡", "🧱", "🧱", "🧱"],
      resultIcon: "⚔️",
      repo: "https://github.com",
      demo: "#projects"
    },
    webcraft: {
      title: "Minecraft Themed Web Portfolio",
      badge: "★ Diamond Project",
      desc: "An immersive, responsive gamified developer showcase featuring custom 8-bit audio synthesis, Nether warp dimension toggle, interactive 3x3 crafting workbench, and authentic HUD.",
      ingredients: ["⚡ JavaScript ES6+", "🎨 CSS3 Grid/Flex", "🔊 Web Audio API"],
      grid: ["⚡", "🎨", "🔊", "🧱", "💎", "🧱", "🧱", "🧱", "🧱"],
      resultIcon: "💎",
      repo: "https://github.com",
      demo: "#projects"
    },
    campus: {
      title: "PSIT Campus Companion Portal",
      badge: "★ Rare Community Tool",
      desc: "A dedicated web portal designed for PSIT Kanpur students to track daily attendance, manage semester schedules, download lecture notes, and compute CGPA predictions.",
      ingredients: ["🏛️ PSIT Hub", "🗄️ LocalStorage", "📱 Responsive UI"],
      grid: ["🏛️", "📖", "🗄️", "⚡", "📱", "⚡", "", "", ""],
      resultIcon: "🏛️",
      repo: "https://github.com",
      demo: "#projects"
    },
    restapi: {
      title: "Spring Boot E-Shop Core API",
      badge: "★ Epic Backend Service",
      desc: "Modular Java Spring Boot microservice architecture implementing RESTful CRUD controllers, JWT token security, JPA Hibernate persistence, and MySQL relational schemas.",
      ingredients: ["🍃 Spring Boot", "🗄️ MySQL", "🔐 JWT Auth"],
      grid: ["🍃", "🗄️", "🔐", "☕", "🧪", "☕", "", "", ""],
      resultIcon: "🍃",
      repo: "https://github.com",
      demo: "#projects"
    }
  };

  const recipeBtns = document.querySelectorAll('.recipe-btn');
  const craftSlots = [
    document.getElementById('craft-0'), document.getElementById('craft-1'), document.getElementById('craft-2'),
    document.getElementById('craft-3'), document.getElementById('craft-4'), document.getElementById('craft-5'),
    document.getElementById('craft-6'), document.getElementById('craft-7'), document.getElementById('craft-8')
  ];
  const resultIcon = document.getElementById('result-icon');
  const cardTitle = document.getElementById('card-title');
  const cardBadge = document.getElementById('card-badge');
  const cardDesc = document.getElementById('card-desc');
  const cardRepo = document.getElementById('card-repo');
  const cardDemo = document.getElementById('card-demo');

  function renderRecipe(recipeKey) {
    const data = recipes[recipeKey];
    if (!data) return;

    sfx.playCraft();

    // Populate 3x3 grid
    craftSlots.forEach((slot, idx) => {
      if (slot) {
        slot.textContent = data.grid[idx] || '';
        slot.style.transform = 'scale(1.15)';
        setTimeout(() => { slot.style.transform = 'scale(1)'; }, 150);
      }
    });

    if (resultIcon) resultIcon.textContent = data.resultIcon;
    if (cardTitle) cardTitle.textContent = data.title;
    if (cardBadge) cardBadge.textContent = data.badge;
    if (cardDesc) cardDesc.textContent = data.desc;
    if (cardRepo) cardRepo.href = data.repo;
    if (cardDemo) cardDemo.href = data.demo;
  }

  recipeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      recipeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const recipeKey = btn.dataset.recipe;
      renderRecipe(recipeKey);
    });
  });

  // Render initial recipe
  renderRecipe('algoplay');

  // ============================================================
  // 7. FIXED BOTTOM HOTBAR & KEYBOARD NAVIGATION (1 - 9)
  // ============================================================
  const hotbarSlots = document.querySelectorAll('.hotbar-slot');

  function selectHotbarSlot(slotIndex) {
    hotbarSlots.forEach(s => s.classList.remove('active'));
    const targetSlot = document.querySelector(`.hotbar-slot[data-slot="${slotIndex}"]`);
    if (targetSlot) {
      targetSlot.classList.add('active');
      sfx.playPop();
    }
  }

  hotbarSlots.forEach(slot => {
    slot.addEventListener('click', (e) => {
      const slotNum = slot.dataset.slot;
      selectHotbarSlot(slotNum);
    });
  });

  // Numeric Keybindings [1 - 9]
  window.addEventListener('keydown', (e) => {
    // Ignore keystrokes when typing in inputs/textarea
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    const key = parseInt(e.key, 10);
    if (key >= 1 && key <= 9) {
      selectHotbarSlot(key);
      const targetSlot = document.querySelector(`.hotbar-slot[data-slot="${key}"]`);
      if (targetSlot) {
        if (targetSlot.tagName === 'A' && targetSlot.getAttribute('href')) {
          const targetId = targetSlot.getAttribute('href').replace('#', '');
          const section = document.getElementById(targetId);
          if (section) section.scrollIntoView({ behavior: 'smooth' });
        } else if (key === 7) {
          toggleDimension();
        } else if (key === 8) {
          handleSoundToggle();
        }
      }
    }
  });

  // Generic Button Click Sounds
  document.querySelectorAll('.mc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sfx.playClick();
    });
  });

  // ============================================================
  // 8. CONTACT FORM DISPATCH & REDSTONE SIGNAL
  // ============================================================
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      sfx.playLevelUp();

      if (formFeedback) {
        formFeedback.classList.remove('hidden');
        formFeedback.textContent = "✓ Redstone pulse sent successfully! Vinayak received your message.";
      }

      showAdvancement("Achievement: Dispatch Delivered via Redstone!");
      contactForm.reset();

      setTimeout(() => {
        if (formFeedback) formFeedback.classList.add('hidden');
      }, 5000);
    });
  }

  // ============================================================
  // 9. CREEPER EASTER EGG
  // ============================================================
  const creeperBtn = document.getElementById('creeper-btn');
  if (creeperBtn) {
    creeperBtn.addEventListener('click', () => {
      sfx.playHiss();
      creeperBtn.style.transform = 'scale(1.2)';
      setTimeout(() => {
        creeperBtn.style.transform = 'scale(1)';
        sfx.playLevelUp();
        showAdvancement("Achievement Unlocked: Surviving the Creeper! 💥");
      }, 450);
    });
  }

  // Inspect Project Buttons
  document.querySelectorAll('.inspect-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sfx.playClick();
      const proj = btn.dataset.project;
      showAdvancement(`Inspected Project: ${proj}`);
    });
  });

});
