document.addEventListener('DOMContentLoaded', () => {
  // --- Global State & Initialization ---
  const defaultOffers = [
    { id: 'neverness-to-everness', name: 'Neverness to Everness', category: 'rpg', platforms: 'Windows · Steam', rating: '★★★★★ 4.9', link: 'https://afb.nexirivium.com/5J0D/2J2B7/', offerId: '20227', img: 'assets/nte_bg.png', video: '', excerpt: 'Explore anomaly disruptions and lead street-racing crews inside Hesperia City, a giant supernatural neon metropolis in Hotta\'s next epic.', reviewText: 'Neverness to Everness (NTE) is Hotta Studio\'s highly anticipated supernatural open-world urban Action RPG. Combining anime-style urban aesthetics with high-speed racing and intense element-based combat, it delivers a unique gameplay loop that has captivated the PC gaming community.', featured: true },
    { id: 'once-human', name: 'Once Human', category: 'survival', platforms: 'Windows · Steam', rating: '★★★★☆ 4.7', link: 'https://afb.nexirivium.com/5J0D/2J1A2/', offerId: '20112', img: 'assets/once_human_bg.png', video: '', excerpt: 'Build bases, craft high-tier gear, and fight Stardust monsters in this post-apocalyptic open-world survival game by Starry Studio.', reviewText: 'Once Human is a multiplayer open-world survival game set in a strange, post-apocalyptic future. Players must cooperate to fight mutated horrors, harvest resource nodes affected by alien Stardust, and build massive custom shelters to survive.', featured: true },
    { id: 'arknights-endfield', name: 'Arknights: Endfield', category: 'rpg', platforms: 'Windows PC', rating: '★★★★☆ 4.6', link: 'https://afb.nexirivium.com/5J0D/2J1A6/', offerId: '20116', img: 'assets/endfield_bg.png', video: '', excerpt: 'Manage complex production hubs and control real-time squad attacks across Talos-II in this sci-fi RPG expansion by Hypergryph.', reviewText: 'Arknights: Endfield is a futuristic real-time action-strategy RPG. Players explore the rugged frontier of Talos-II, constructing automated mining and logistics relays to power up elite squads and fight off hostiles in tactical real-time combat.', featured: true },
    { id: 'where-winds-meet', name: 'Where Winds Meet', category: 'rpg', platforms: 'Windows PC', rating: '★★★★☆ 4.5', link: 'https://afb.nexirivium.com/5J0D/2J1J9/', offerId: '20109', img: 'assets/where_winds_meet_bg.png', video: '', excerpt: 'Forge your destiny in a dynastic Chinese setting. Customize martial arts styles, practice medicine, or construct custom bridges.', reviewText: 'Where Winds Meet is an epic open-world action-adventure RPG set in 10th-century China during the chaotic Five Dynasties and Ten Kingdoms period. Players master legendary martial arts, scale mountain peaks, walk across water, and complete dynamic side jobs.', featured: true },
    { id: 'raid-shadow-legends', name: 'Raid: Shadow Legends', category: 'rpg', platforms: 'Windows PC', rating: '★★★★☆ 4.6', link: 'https://afb.nexirivium.com/5J0D/2J2D3/', offerId: '20243', img: 'assets/raid_bg.png', excerpt: 'Command hundreds of collectible champions from 14 factions and conquer tactical turn-based dungeons in a rich dark fantasy RPG.', reviewText: 'Raid: Shadow Legends is a dark fantasy turn-based tactical squad RPG. Collect hundreds of unique champions from 14 factions, gear them with complex artifact sets, and wage tactical turn-based battles in a dark fantasy realm.', featured: false },
    { id: 'star-trek-fleet-command', name: 'Star Trek Fleet Command', category: 'strategy', platforms: 'Windows · Mac', rating: '★★★★☆ 4.4', link: 'https://afb.nexirivium.com/5J0D/2J2C7/', offerId: '20237', img: 'assets/star_trek_bg.png', excerpt: 'Build space docks, command legendary ships, and lead massive galactic alliances to secure raw materials and deep space sectors.', reviewText: '', featured: false },
    { id: 'rise-of-kingdoms', name: 'Rise of Kingdoms', category: 'strategy', platforms: 'Windows PC', rating: '★★★★☆ 4.3', link: 'https://afb.nexirivium.com/5J0D/2J2C5/', offerId: '20235', img: 'assets/rise_of_kingdoms_bg.png', excerpt: 'Command historical nations and expand your dominion on a single, seamless, real-time strategy map with other players globally.', reviewText: '', featured: false },
    { id: 'tiles-survive', name: 'Tiles Survive', category: 'survival', platforms: 'Windows PC', rating: '★★★☆☆ 3.8', link: 'https://afb.nexirivium.com/5J0D/2J1A4/', offerId: '20114', img: 'assets/tiles_survive_bg.png', excerpt: 'Navigate rapidly collapsing platform grids, balance core resource systems, and test your split-second reflexes in this Windows simulator.', reviewText: '', featured: false }
  ];

  const defaultBanner = { active: true, text: '🔥 SPECIAL EVENT: Global Partner Integration! Click here to download top RPGs for free.', link: '#games-section', style: 'purple-pink' };
  const defaultPopup = { active: false, title: 'Limited Beta Invitation', text: 'Get direct developers alpha/beta download links for upcoming games like Neverness to Everness on Gaming07.', delay: 4, icon: '🔥', btnText: 'Claim Access', btnLink: 'https://afb.nexirivium.com/5J0D/2J2B7/' };
  
  const defaultPermissions = [
    { username: 'Editor-in-Chief', role: 'Admin', permissions: ['neverness-to-everness', 'arknights-endfield', 'once-human', 'where-winds-meet', 'raid-shadow-legends', 'star-trek-fleet-command', 'rise-of-kingdoms', 'tiles-survive'] },
    { username: 'Freelancer-A', role: 'Reviewer', permissions: ['neverness-to-everness', 'once-human'] },
    { username: 'Guest-B', role: 'Reviewer', permissions: ['raid-shadow-legends'] }
  ];

  // Helper function to safely read from localStorage
  function safeGetJSON(key, defaultValue) {
    try {
      const val = localStorage.getItem(key);
      if (!val || val === 'undefined' || val === 'null') {
        localStorage.setItem(key, JSON.stringify(defaultValue));
        return defaultValue;
      }
      return JSON.parse(val) || defaultValue;
    } catch (e) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
  }

  // Force clean outdated localStorage links and synchronize video properties
  try {
    let storedOffers = safeGetJSON('gaming07_offers', defaultOffers);
    let updated = false;
    storedOffers = storedOffers.map(so => {
      const match = defaultOffers.find(d => d.id === so.id);
      if (match) {
        if (so.video !== match.video) {
          so.video = match.video;
          updated = true;
        }
        if (so.link !== match.link || (so.link && so.link.includes('dordir.com'))) {
          so.link = match.link;
          updated = true;
        }
      }
      return so;
    });
    if (updated) {
      localStorage.setItem('gaming07_offers', JSON.stringify(storedOffers));
    }
  } catch (e) {}

  // Ensure elements are pre-initialized in localStorage using safe helper
  safeGetJSON('gaming07_offers', defaultOffers);
  safeGetJSON('gaming07_banner', defaultBanner);
  safeGetJSON('gaming07_popup', defaultPopup);
  safeGetJSON('gaming07_permissions', defaultPermissions);

  // --- Dynamic Ad-Injections ---
  function injectPromoBanner() {
    const bannerData = safeGetJSON('gaming07_banner', defaultBanner);
    // Remove existing
    const existing = document.querySelector('.promo-banner');
    if (existing) existing.remove();

    if (!bannerData || !bannerData.active) return;

    const bannerEl = document.createElement('div');
    bannerEl.className = 'promo-banner active';
    if (bannerData.style === 'cyan-blue') {
      bannerEl.style.background = 'linear-gradient(90deg, var(--accent-cyan), #2563eb)';
    } else if (bannerData.style === 'emerald-green') {
      bannerEl.style.background = 'var(--accent-emerald)';
    } else if (bannerData.style === 'dark-gold') {
      bannerEl.style.background = 'linear-gradient(90deg, #1e1b4b, #b45309)';
    }

    bannerEl.innerHTML = `
      <span>${bannerData.text}</span>
      ${bannerData.link ? `<a href="${bannerData.link}">Learn More &rarr;</a>` : ''}
      <button class="promo-banner-close" aria-label="Close banner">✕</button>
    `;

    document.body.prepend(bannerEl);

    bannerEl.querySelector('.promo-banner-close').addEventListener('click', () => {
      bannerEl.style.display = 'none';
    });
  }

  function injectPromoPopup() {
    const popupData = safeGetJSON('gaming07_popup', defaultPopup);
    const existing = document.querySelector('.popup-overlay');
    if (existing) existing.remove();

    if (!popupData || !popupData.active) return;

    // Check if popup has already been dismissed this session to avoid annoying the user
    if (sessionStorage.getItem('gaming07_popup_dismissed') === 'true') return;

    const overlayEl = document.createElement('div');
    overlayEl.className = 'popup-overlay';
    
    overlayEl.innerHTML = `
      <div class="popup-content">
        <button class="popup-close" aria-label="Close promotion">✕</button>
        <span class="popup-icon">${popupData.icon || '🎁'}</span>
        <h3 class="popup-title">${popupData.title}</h3>
        <p class="popup-text">${popupData.text}</p>
        ${popupData.btnText && popupData.btnLink ? `<a href="${popupData.btnLink}" class="btn btn-cyan btn-lg btn-download" data-offer-id="popup-btn" data-game-name="Popup-Link" target="_blank">${popupData.btnText}</a>` : ''}
      </div>
    `;

    document.body.appendChild(overlayEl);

    const closePopup = () => {
      overlayEl.classList.remove('active');
      sessionStorage.setItem('gaming07_popup_dismissed', 'true');
    };

    overlayEl.querySelector('.popup-close').addEventListener('click', closePopup);
    overlayEl.addEventListener('click', (e) => {
      if (e.target === overlayEl) closePopup();
    });

    setTimeout(() => {
      overlayEl.classList.add('active');
    }, (popupData.delay || 3) * 1000);
  }

  injectPromoBanner();
  injectPromoPopup();

  // --- Theme Toggler ---
  const body = document.body;
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  
  function initTheme() {
    const savedTheme = localStorage.getItem('gaming07_theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    
    if (savedTheme === 'light' || (!savedTheme && prefersLight)) {
      body.classList.add('light-theme');
      if (themeToggleBtn) themeToggleBtn.textContent = '🌙';
    } else {
      body.classList.remove('light-theme');
      if (themeToggleBtn) themeToggleBtn.textContent = '☀';
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      body.classList.toggle('light-theme');
      const isLight = body.classList.contains('light-theme');
      localStorage.setItem('gaming07_theme', isLight ? 'light' : 'dark');
      themeToggleBtn.textContent = isLight ? '🌙' : '☀';
      showToast(`Switched to ${isLight ? 'light' : 'dark'} mode`);
    });
  }
  initTheme();

  // --- GA4 Conversion & Event Analytics Engine ---
  function initGA4Tracking() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href') || '';
      const gameName = link.getAttribute('data-game-name') || link.innerText.trim() || 'Unknown Game';
      const offerId = link.getAttribute('data-offer-id') || 'general';

      // Track outbound affiliate / download clicks
      if (href.includes('nexirivium.com') || href.includes('dordir.com') || link.classList.contains('btn-download') || link.classList.contains('download-link-btn')) {
        if (typeof gtag === 'function') {
          // Fire GA4 standard Lead Generation event
          gtag('event', 'generate_lead', {
            'event_category': 'affiliate_download',
            'event_label': gameName,
            'game_name': gameName,
            'offer_id': offerId,
            'destination_url': href,
            'value': 1.0,
            'currency': 'USD'
          });

          // Fire Custom Affiliate Click event
          gtag('event', 'affiliate_click', {
            'game_name': gameName,
            'offer_id': offerId,
            'outbound_url': href,
            'page_path': window.location.pathname
          });
        }
      }
    });

    // Track modal search queries
    const searchModalInput = document.getElementById('search-modal-input');
    if (searchModalInput) {
      let searchTimeout;
      searchModalInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        clearTimeout(searchTimeout);
        if (query.length >= 3) {
          searchTimeout = setTimeout(() => {
            if (typeof gtag === 'function') {
              gtag('event', 'search', {
                'search_term': query
              });
            }
          }, 800);
        }
      });
    }

    // Track category filter clicks
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-category') || btn.innerText.trim();
        if (typeof gtag === 'function') {
          gtag('event', 'select_content', {
            'content_type': 'category_filter',
            'item_id': cat
          });
        }
      });
    });
  }

  initGA4Tracking();

  // --- Region Simulator ---
  const regionLabel = document.getElementById('region-label');
  if (regionLabel) {
    setTimeout(() => {
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        let region = 'Global';
        if (tz.includes('Europe')) region = 'EU West';
        else if (tz.includes('America/New_York') || tz.includes('America/Chicago') || tz.includes('US/')) region = 'US East';
        else if (tz.includes('America/Los_Angeles') || tz.includes('America/Denver')) region = 'US West';
        else if (tz.includes('Asia')) region = 'Asia Pac';
        else if (tz.includes('Paris') || tz.includes('London') || tz.includes('Berlin')) region = 'FR Region';
        
        regionLabel.textContent = region;
      } catch (e) {
        regionLabel.textContent = 'EU West';
      }
    }, 1200);
  }

  // --- Custom Toast Helper ---
  let toastTimeout;
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');

  function showToast(message) {
    if (!toast) return;
    toastText.textContent = message;
    toast.classList.add('show');
    
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // --- HOMEPAGE SPECIFIC LOGIC ---
  const trendingTrack = document.getElementById('trending-track');
  const editorTrack = document.getElementById('editor-track');
  const searchInput = document.getElementById('search-games');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const railSections = document.querySelectorAll('.rail-section');

  if (trendingTrack && editorTrack) {
    const offers = safeGetJSON('gaming07_offers', defaultOffers);

    function renderHomepageOffers() {
      // 1. Render Hero Slider Carousel
      const carouselContainer = document.querySelector('.hero-carousel');
      if (carouselContainer) {
        // Filter featured offers
        const featuredOffers = offers.filter(o => o.featured).slice(0, 4);
        
        // Remove existing slides (except dots)
        const oldSlides = carouselContainer.querySelectorAll('.carousel-slide');
        oldSlides.forEach(s => s.remove());

        featuredOffers.forEach((o, index) => {
          const slide = document.createElement('div');
          slide.className = `carousel-slide ${index === 0 ? 'active' : ''}`;
          slide.setAttribute('role', 'group');
          slide.setAttribute('aria-roledescription', 'slide');

          const bgStyle = o.img ? `background-image: url('${o.img}');` : `background: linear-gradient(135deg, #090909 0%, #1e1b4b 100%);`;
          const badgeClass = o.category === 'rpg' ? 'badge-live' : (o.category === 'survival' ? 'badge-live' : 'badge-live');
          const isLocalReview = ['neverness-to-everness', 'arknights-endfield', 'once-human', 'where-winds-meet', 'raid-shadow-legends'].includes(o.id);
          const reviewLink = isLocalReview ? `articles/${o.id}` : `articles/review?game=${o.id}`;

          const videoElement = o.video 
            ? `<video class="carousel-bg-video" autoplay loop muted playsinline poster="${o.img}"><source src="${o.video}" type="video/mp4"></video>`
            : `<div class="carousel-bg" style="${bgStyle}"></div>`;

          slide.innerHTML = `
            ${videoElement}
            <div class="carousel-scrim"></div>
            <div class="container">
              <div class="carousel-content">
                <div class="carousel-badges">
                  <span class="${badgeClass}">${o.category === 'rpg' ? '● RPG Spotlight' : (o.category === 'survival' ? '● Live Season' : '● Upcoming')}</span>
                  <span class="badge-genre">${o.category.toUpperCase()}</span>
                  <span class="carousel-platforms">${o.platforms}</span>
                </div>
                <h1 class="carousel-title">${o.name.split(':')[0]}</h1>
                <p class="carousel-tagline">${o.excerpt}</p>
                <div class="carousel-ctas">
                  <a href="${o.link}" class="btn btn-cyan btn-lg btn-download" data-offer-id="${o.offerId}" data-game-name="${o.name}" target="_blank">▶ Play Free</a>
                  <a href="${reviewLink}" class="btn btn-ghost btn-lg">View Review</a>
                </div>
              </div>
            </div>
          `;
          // Prepend slides before dots
          carouselContainer.insertBefore(slide, carouselContainer.querySelector('.carousel-dots'));
        });

        // Reconfigure slide dots
        const dotsContainer = carouselContainer.querySelector('.carousel-dots');
        if (dotsContainer) {
          dotsContainer.innerHTML = '';
          featuredOffers.forEach((_, idx) => {
            const dot = document.createElement('button');
            dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
            dot.setAttribute('aria-label', `Featured Slide ${idx + 1}`);
            dotsContainer.appendChild(dot);
          });
        }
        
        // Re-initialize hero carousel controls
        initHeroSliderControls();
      }

      // 2. Render Trending Rail (usually RPG and featured)
      trendingTrack.innerHTML = '';
      const trendingList = offers.filter(o => o.category === 'rpg' || o.featured);
      trendingList.forEach(o => {
        trendingTrack.appendChild(createGameCardCell(o));
      });

      // 3. Render Editor/Strategy Rail
      editorTrack.innerHTML = '';
      const editorList = offers.filter(o => o.category === 'strategy' || o.category === 'survival');
      editorList.forEach(o => {
        editorTrack.appendChild(createGameCardCell(o));
      });
    }

    function createGameCardCell(o) {
      const cell = document.createElement('div');
      cell.className = 'rail-cell';
      
      const badgeClass = `badge-${o.category}`;
      const isLocalReview = ['neverness-to-everness', 'arknights-endfield', 'once-human', 'where-winds-meet', 'raid-shadow-legends'].includes(o.id);
      const reviewLink = isLocalReview ? `articles/${o.id}` : `articles/review?game=${o.id}`;
      const imageTag = o.img ? `<img src="${o.img}" alt="${o.name}" class="game-card-img" loading="lazy">` : `<div style="background: linear-gradient(135deg, #1e1b4b 0%, #022c22 100%); width:100%; height:100%;" class="game-card-img"></div>`;
      const reviewBtn = o.reviewText ? `<a href="${reviewLink}" class="btn btn-secondary">Review</a>` : `<button class="btn btn-secondary" disabled>No Review</button>`;

      cell.innerHTML = `
        <div class="game-card" data-category="${o.category}">
          <div class="game-card-banner">
            ${imageTag}
            <div class="game-card-gradient"></div>
            <button class="wishlist-btn" data-game-id="${o.id}" data-game-name="${o.name}" aria-label="Add to wishlist">♡</button>
            <div class="play-hover-overlay" aria-hidden="true"><span class="play-hover-icon">▶</span></div>
            <span class="game-badge ${badgeClass}">${o.category.toUpperCase()}</span>
            ${o.featured ? '<span class="payout-badge">⚡ Top Choice</span>' : ''}
          </div>
          <div class="game-card-content">
            <a href="${reviewLink}" class="game-title">${o.name}</a>
            <p class="game-excerpt">${o.excerpt}</p>
            <div class="game-card-metadata">
              <span>🎮 ${o.platforms}</span>
              <span class="text-cyan">${o.rating || '★★★★☆ 4.5'}</span>
            </div>
            <div class="game-card-footer">
              <a href="${o.link}" class="btn btn-cyan btn-block btn-download" data-offer-id="${o.offerId}" data-game-name="${o.name}" target="_blank">Play Free</a>
              ${reviewBtn}
            </div>
          </div>
        </div>
      `;
      return cell;
    }

    function initHeroSliderControls() {
      const slides = document.querySelectorAll('.carousel-slide');
      const dots = document.querySelectorAll('.carousel-dot');
      let currentSlide = 0;
      let slideInterval;

      function showSlide(index) {
        if (!slides.length) return;
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
      }

      function nextSlide() {
        showSlide(currentSlide + 1);
      }

      function startAutoplay() {
        if (!slides.length) return;
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 6000);
      }

      dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
          showSlide(idx);
          startAutoplay();
        });
      });

      showSlide(0);
      startAutoplay();
    }

    renderHomepageOffers();

    // Re-initialize wishlist bindings
    setTimeout(() => {
      updateWishlistButtons();
    }, 100);
  }

  // --- Scroll Rails Trigger ---
  const scrollArrows = document.querySelectorAll('.rail-arrow');
  scrollArrows.forEach(arrow => {
    arrow.addEventListener('click', () => {
      const direction = arrow.dataset.direction;
      const targetId = arrow.dataset.target;
      const track = document.getElementById(targetId);
      
      if (track) {
        const scrollAmount = track.clientWidth * 0.75;
        track.scrollBy({
          left: direction === 'left' ? -scrollAmount : scrollAmount,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Wishlist Handler ---
  let wishlist = safeGetJSON('gaming07_wishlist', []);

  function updateWishlistButtons() {
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    wishlistBtns.forEach(btn => {
      const gameId = btn.dataset.gameId;
      if (wishlist.includes(gameId)) {
        btn.classList.add('active');
        btn.innerHTML = '♥';
      } else {
        btn.classList.remove('active');
        btn.innerHTML = '♡';
      }
    });
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.wishlist-btn');
    if (!btn) return;
    
    e.preventDefault();
    const gameId = btn.dataset.gameId;
    const gameName = btn.dataset.gameName || gameId;
    const index = wishlist.indexOf(gameId);

    if (index === -1) {
      wishlist.push(gameId);
      showToast(`Added ${gameName} to wishlist`);
    } else {
      wishlist.splice(index, 1);
      showToast(`Removed ${gameName} from wishlist`);
    }

    localStorage.setItem('gaming07_wishlist', JSON.stringify(wishlist));
    updateWishlistButtons();
  });

  updateWishlistButtons();

  // --- Live Filters & Search ---
  function filterGames() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const activeFilterBtn = document.querySelector('.filter-btn.active');
    const activeCategory = activeFilterBtn ? activeFilterBtn.dataset.filter : 'all';

    railSections.forEach(section => {
      let visibleInRail = 0;
      const cells = section.querySelectorAll('.rail-cell');

      cells.forEach(cell => {
        const card = cell.querySelector('.game-card');
        const title = card.querySelector('.game-title').textContent.toLowerCase();
        const excerpt = card.querySelector('.game-excerpt').textContent.toLowerCase();
        const category = card.dataset.category;

        const matchesSearch = title.includes(query) || excerpt.includes(query);
        const matchesCategory = activeCategory === 'all' || category === activeCategory;

        if (matchesSearch && matchesCategory) {
          cell.style.display = 'block';
          visibleInRail++;
        } else {
          cell.style.display = 'none';
        }
      });

      if (visibleInRail === 0) {
        section.style.display = 'none';
      } else {
        section.style.display = 'block';
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterGames);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterGames();
    });
  });

  // --- Ctrl+K Search Modal Logic ---
  const searchBtnHeader = document.getElementById('search-btn-header');
  const searchModal = document.getElementById('search-modal');
  const searchModalClose = document.getElementById('search-modal-close');
  const searchModalInput = document.getElementById('search-modal-input');
  const searchModalResults = document.getElementById('search-modal-results');

  function openSearchModal() {
    if (!searchModal) return;
    searchModal.classList.add('active');
    searchModalInput.value = '';
    searchModalInput.focus();
    renderSearchResults('');
  }

  function closeSearchModal() {
    if (!searchModal) return;
    searchModal.classList.remove('active');
  }

  function renderSearchResults(query) {
    if (!searchModalResults) return;
    searchModalResults.innerHTML = '';
    const cleanQuery = query.toLowerCase().trim();
    const offers = safeGetJSON('gaming07_offers', defaultOffers);

    const filtered = offers.filter(o => 
      o.name.toLowerCase().includes(cleanQuery) || 
      o.excerpt.toLowerCase().includes(cleanQuery) ||
      o.category.toLowerCase().includes(cleanQuery)
    );

    if (filtered.length === 0) {
      searchModalResults.innerHTML = '<div style="padding:20px; text-align:center; color:var(--text-muted);">No results found</div>';
      return;
    }

    filtered.forEach(o => {
      const item = document.createElement('a');
      item.className = 'search-result-item';
      
      const isLocalReview = ['neverness-to-everness', 'arknights-endfield', 'once-human', 'where-winds-meet', 'raid-shadow-legends'].includes(o.id);
      const isArticlesPath = window.location.pathname.includes('/articles/');
      
      let finalPath = '';
      if (isArticlesPath) {
        finalPath = isLocalReview ? `${o.id}` : `review?game=${o.id}`;
      } else {
        finalPath = isLocalReview ? `articles/${o.id}` : `articles/review?game=${o.id}`;
      }
      item.href = finalPath;

      const thumbStyle = o.img ? `background-image: url('${isArticlesPath ? '../' + o.img : o.img}')` : `background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple))`;
      
      item.innerHTML = `
        <div class="search-result-thumb" style="${thumbStyle}"></div>
        <div class="search-result-info">
          <h4>${o.name}</h4>
          <p>${o.excerpt}</p>
        </div>
      `;
      
      searchModalResults.appendChild(item);
    });
  }

  if (searchBtnHeader) {
    searchBtnHeader.addEventListener('click', openSearchModal);
  }

  if (searchModalClose) {
    searchModalClose.addEventListener('click', closeSearchModal);
  }

  if (searchModal) {
    searchModal.addEventListener('click', (e) => {
      if (e.target === searchModal) closeSearchModal();
    });
  }

  if (searchModalInput) {
    searchModalInput.addEventListener('input', (e) => {
      renderSearchResults(e.target.value);
    });
  }

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openSearchModal();
    }
    if (e.key === 'Escape') {
      closeSearchModal();
    }
  });

  // --- ADMIN DASHBOARD PAGE LOGIC ---
  const adminLayout = document.querySelector('.admin-layout');
  if (adminLayout) {
    // Admin password authentication
    const loginOverlay = document.getElementById('admin-login-overlay');
    const loginForm = document.getElementById('admin-login-form');
    const passwordInput = document.getElementById('admin-password-input');
    const errorMsg = document.getElementById('login-error-msg');
    const correctHash = '88a440d3b77c8ca6c0d292d6bf939588879c38998cd0585da7090b76babb15c5'; // SHA-256 for "Gaming07Admin!"
    
    async function sha256(message) {
      const msgBuffer = new TextEncoder().encode(message);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    
    if (sessionStorage.getItem('g7_admin_logged_in') === 'true') {
      if (loginOverlay) loginOverlay.style.display = 'none';
      adminLayout.classList.remove('blurred');
    } else {
      adminLayout.classList.add('blurred');
    }
    
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const inputPassword = passwordInput.value;
        const inputHash = await sha256(inputPassword);
        
        if (inputHash === correctHash) {
          errorMsg.textContent = '';
          sessionStorage.setItem('g7_admin_logged_in', 'true');
          
          if (loginOverlay) {
            loginOverlay.classList.add('fade-out');
            setTimeout(() => {
              loginOverlay.style.display = 'none';
            }, 400);
          }
          adminLayout.classList.remove('blurred');
          showToast('Dashboard Unlocked Successfully');
        } else {
          errorMsg.textContent = 'Incorrect administrator password!';
          passwordInput.value = '';
          passwordInput.focus();
        }
      });
    }

    const adminMenuBtns = document.querySelectorAll('.admin-menu-btn');
    const adminSections = document.querySelectorAll('.admin-section');
    
    // Tab switching
    adminMenuBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        adminMenuBtns.forEach(b => b.classList.remove('active'));
        adminSections.forEach(s => s.classList.remove('active'));
        
        btn.classList.add('active');
        const targetSection = document.getElementById(`section-${btn.dataset.tab}`);
        if (targetSection) targetSection.classList.add('active');
      });
    });

    // Mock Click Conversions Logs
    const logList = document.getElementById('conversion-logs');
    const mockLogs = [
      { user: 'Guest_108', game: 'Neverness to Everness', revenue: '$5.50', time: '2 mins ago' },
      { user: 'Alpha_440', game: 'Once Human', revenue: '$4.20', time: '12 mins ago' },
      { user: 'WuxiaFan', game: 'Where Winds Meet', revenue: '$6.00', time: '40 mins ago' },
      { user: 'GuildMaster', game: 'Raid: Shadow Legends', revenue: '$8.50', time: '1 hour ago' },
      { user: 'ExplorerX', game: 'Arknights: Endfield', revenue: '$4.50', time: '3 hours ago' }
    ];

    function renderLogs() {
      if (!logList) return;
      logList.innerHTML = '';
      mockLogs.forEach(l => {
        const item = document.createElement('div');
        item.className = 'log-item';
        item.innerHTML = `
          <div class="log-info">
            <h5>${l.game}</h5>
            <p>User IP: ${l.user} · Synced</p>
          </div>
          <div class="log-meta">
            <span class="log-price">${l.revenue}</span>
            <span class="log-time">${l.time}</span>
          </div>
        `;
        logList.appendChild(item);
      });
    }
    renderLogs();

    // Network Sync Simulation
    const syncNetworkBtn = document.getElementById('sync-network-btn');
    const afboosterStatusDot = document.getElementById('afbooster-status-dot');
    const afboosterStatusText = document.getElementById('afbooster-status-text');

    if (syncNetworkBtn) {
      syncNetworkBtn.addEventListener('click', () => {
        syncNetworkBtn.textContent = 'Syncing...';
        syncNetworkBtn.disabled = true;
        afboosterStatusDot.style.background = 'var(--accent-purple)';
        afboosterStatusDot.style.boxShadow = '0 0 8px var(--accent-purple)';
        afboosterStatusText.textContent = 'Synchronizing with Partner MCP...';

        setTimeout(() => {
          syncNetworkBtn.textContent = '🔄 Sync Network';
          syncNetworkBtn.disabled = false;
          afboosterStatusDot.style.background = 'var(--accent-emerald)';
          afboosterStatusDot.style.boxShadow = '0 0 8px var(--accent-emerald)';
          afboosterStatusText.textContent = 'Partner API Synced';

          // Simulate adding mock click
          mockLogs.unshift({
            user: `Sync_${Math.floor(Math.random() * 900) + 100}`,
            game: 'Neverness to Everness',
            revenue: '$5.50',
            time: 'Just now'
          });
          renderLogs();

          // Increment mock earnings stat
          const statClicks = document.getElementById('stat-clicks');
          if (statClicks) statClicks.innerHTML = `12,481 <span>+8.3%</span>`;

          showToast('Partner campaigns synchronized successfully. 1 conversion fetched.');
        }, 1500);
      });
    }

    // --- Offers Manager Datagrid ---
    const offersTableBody = document.getElementById('offers-table-body');
    const offerModal = document.getElementById('offer-modal');
    const addOfferBtn = document.getElementById('add-offer-btn');
    const offerModalClose = document.getElementById('offer-modal-close');
    const offerFormCancel = document.getElementById('offer-form-cancel');
    const offerForm = document.getElementById('offer-form');

    function renderOffersTable() {
      if (!offersTableBody) return;
      offersTableBody.innerHTML = '';
      const offers = safeGetJSON('gaming07_offers', defaultOffers);

      // Update campaigns count in dashboard overview
      const statCampaigns = document.getElementById('stat-campaigns');
      if (statCampaigns) statCampaigns.textContent = offers.length;

      offers.forEach(o => {
        const tr = document.createElement('tr');
        const imgStyle = o.img ? `background-image: url('${o.img}');` : `background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));`;
        
        tr.innerHTML = `
          <td><div class="search-result-thumb" style="${imgStyle}"></div></td>
          <td style="font-weight:600; color:var(--text-main);">${o.name}</td>
          <td><span class="game-badge badge-${o.category}" style="position:static;">${o.category.toUpperCase()}</span></td>
          <td>${o.platforms}</td>
          <td style="font-family:monospace; font-weight:600;">#${o.offerId}</td>
          <td>${o.featured ? '<span class="text-cyan">⭐ Featured</span>' : '<span style="color:var(--text-dark);">No</span>'}</td>
          <td>
            <div class="actions-cell">
              <button class="btn btn-secondary action-btn-sm edit-offer-btn" data-id="${o.id}">Edit</button>
              <button class="btn btn-ghost action-btn-sm delete-offer-btn" data-id="${o.id}" style="color:var(--accent-pink);">Delete</button>
            </div>
          </td>
        `;
        offersTableBody.appendChild(tr);
      });

      // Bind actions
      const editBtns = offersTableBody.querySelectorAll('.edit-offer-btn');
      editBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const offerId = btn.dataset.id;
          openOfferModal(offerId);
        });
      });

      const deleteBtns = offersTableBody.querySelectorAll('.delete-offer-btn');
      deleteBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const offerId = btn.dataset.id;
          if (confirm('Are you sure you want to delete this campaign? This cannot be undone.')) {
            let offersList = safeGetJSON('gaming07_offers', defaultOffers);
            offersList = offersList.filter(o => o.id !== offerId);
            localStorage.setItem('gaming07_offers', JSON.stringify(offersList));
            
            // Clean permissions
            let permissionsList = safeGetJSON('gaming07_permissions', defaultPermissions);
            permissionsList.forEach(p => {
              p.permissions = p.permissions.filter(id => id !== offerId);
            });
            localStorage.setItem('gaming07_permissions', JSON.stringify(permissionsList));

            showToast('Campaign offer deleted successfully');
            renderOffersTable();
            renderPermissionsPanel();
          }
        });
      });
    }

    function openOfferModal(offerId = null) {
      if (!offerModal) return;
      offerForm.reset();
      
      const modalTitle = document.getElementById('modal-title');
      const editIdInput = document.getElementById('offer-edit-id');

      if (offerId) {
        // Edit Mode
        modalTitle.textContent = 'Edit Gaming Campaign';
        editIdInput.value = offerId;
        
        const offers = safeGetJSON('gaming07_offers', defaultOffers);
        const offer = offers.find(o => o.id === offerId);

        if (offer) {
          document.getElementById('offer-name').value = offer.name;
          document.getElementById('offer-category').value = offer.category;
          document.getElementById('offer-platforms').value = offer.platforms;
          document.getElementById('offer-rating').value = offer.rating || '';
          document.getElementById('offer-link').value = offer.link;
          document.getElementById('offer-id-num').value = offer.offerId;
          document.getElementById('offer-image').value = offer.img || '';
          document.getElementById('offer-excerpt').value = offer.excerpt;
          document.getElementById('offer-review-text').value = offer.reviewText || '';
          document.getElementById('offer-featured').checked = offer.featured;
        }
      } else {
        // Create Mode
        modalTitle.textContent = 'Add New Gaming Campaign';
        editIdInput.value = '';
      }
      
      offerModal.classList.add('active');
    }

    function closeOfferModal() {
      if (offerModal) offerModal.classList.remove('active');
    }

    if (addOfferBtn) {
      addOfferBtn.addEventListener('click', () => openOfferModal());
    }

    if (offerModalClose) offerModalClose.addEventListener('click', closeOfferModal);
    if (offerFormCancel) offerFormCancel.addEventListener('click', closeOfferModal);

    if (offerForm) {
      offerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const editId = document.getElementById('offer-edit-id').value;
        const name = document.getElementById('offer-name').value;
        const category = document.getElementById('offer-category').value;
        const platforms = document.getElementById('offer-platforms').value;
        const rating = document.getElementById('offer-rating').value;
        const link = document.getElementById('offer-link').value;
        const offerIdNum = document.getElementById('offer-id-num').value;
        const img = document.getElementById('offer-image').value;
        const excerpt = document.getElementById('offer-excerpt').value;
        const reviewText = document.getElementById('offer-review-text').value;
        const featured = document.getElementById('offer-featured').checked;

        let offersList = safeGetJSON('gaming07_offers', defaultOffers);

        if (editId) {
          // Update
          const index = offersList.findIndex(o => o.id === editId);
          if (index !== -1) {
            offersList[index] = { ...offersList[index], name, category, platforms, rating, link, offerId: offerIdNum, img, excerpt, reviewText, featured };
            showToast(`Campaign ${name} updated successfully`);
          }
        } else {
          // Create
          const id = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          
          // Check duplicate ID
          if (offersList.some(o => o.id === id)) {
            alert('A campaign with a similar name already exists!');
            return;
          }

          offersList.push({ id, name, category, platforms, rating, link, offerId: offerIdNum, img, excerpt, reviewText, featured });
          
          // Auto grant permissions to Admin role (Editor-in-Chief)
          let permissionsList = safeGetJSON('gaming07_permissions', defaultPermissions);
          const adminObj = permissionsList.find(p => p.role === 'Admin');
          if (adminObj && !adminObj.permissions.includes(id)) {
            adminObj.permissions.push(id);
            localStorage.setItem('gaming07_permissions', JSON.stringify(permissionsList));
          }

          showToast(`New campaign ${name} created successfully`);
        }

        localStorage.setItem('gaming07_offers', JSON.stringify(offersList));
        closeOfferModal();
        renderOffersTable();
        renderPermissionsPanel();
      });
    }

    renderOffersTable();

    // --- Reviewer Permissions Panel ---
    const permissionsContainer = document.getElementById('reviewer-permissions-container');

    function renderPermissionsPanel() {
      if (!permissionsContainer) return;
      permissionsContainer.innerHTML = '';

      const permissionsList = safeGetJSON('gaming07_permissions', defaultPermissions);
      const offersList = safeGetJSON('gaming07_offers', defaultOffers);

      permissionsList.forEach(userObj => {
        const card = document.createElement('div');
        card.className = 'reviewer-card';
        
        let listCheckboxes = '';
        offersList.forEach(game => {
          const checked = userObj.permissions.includes(game.id) ? 'checked' : '';
          // Admins can write reviews for everything, lock their inputs
          const disabled = userObj.role === 'Admin' ? 'disabled' : '';
          
          listCheckboxes += `
            <label class="permission-checkbox-label">
              <input type="checkbox" data-user="${userObj.username}" data-game-id="${game.id}" ${checked} ${disabled}>
              ${game.name}
            </label>
          `;
        });

        card.innerHTML = `
          <div class="reviewer-header">
            <div>
              <span class="reviewer-name">${userObj.username}</span>
              <p style="font-size:12px; color:var(--text-muted); margin-top:2px;">User Key: author_auth_${userObj.username.toLowerCase().replace('-', '_')}</p>
            </div>
            <span class="reviewer-role">${userObj.role}</span>
          </div>
          <p style="font-size:12px; color:var(--text-muted); margin-bottom:12px; font-weight:600;">Assigned Campaigns Reviews Access:</p>
          <div class="permissions-checkbox-list">
            ${listCheckboxes}
          </div>
        `;
        permissionsContainer.appendChild(card);
      });

      // Bind change listeners
      const checkboxes = permissionsContainer.querySelectorAll('.permissions-checkbox-list input[type="checkbox"]');
      checkboxes.forEach(cb => {
        cb.addEventListener('change', () => {
          const username = cb.dataset.user;
          const gameId = cb.dataset.gameId;
          const isChecked = cb.checked;

          let permissions = safeGetJSON('gaming07_permissions', defaultPermissions);
          const userObj = permissions.find(p => p.username === username);

          if (userObj) {
            if (isChecked) {
              if (!userObj.permissions.includes(gameId)) userObj.permissions.push(gameId);
            } else {
              userObj.permissions = userObj.permissions.filter(id => id !== gameId);
            }
            localStorage.setItem('gaming07_permissions', JSON.stringify(permissions));
            showToast(`Permissions updated for ${username}`);
          }
        });
      });
    }

    renderPermissionsPanel();

    // --- Banners & Popups Settings Forms ---
    const bannerActiveToggle = document.getElementById('banner-active-toggle');
    const bannerActiveLabel = document.getElementById('banner-active-label');
    const bannerSettingsForm = document.getElementById('banner-settings-form');

    const popupActiveToggle = document.getElementById('popup-active-toggle');
    const popupActiveLabel = document.getElementById('popup-active-label');
    const popupSettingsForm = document.getElementById('popup-settings-form');

    function initBannersForms() {
      const bannerData = safeGetJSON('gaming07_banner', defaultBanner);
      const popupData = safeGetJSON('gaming07_popup', defaultPopup);

      if (bannerData) {
        bannerActiveToggle.checked = bannerData.active;
        bannerActiveLabel.textContent = bannerData.active ? 'Active' : 'Inactive';
        document.getElementById('banner-text').value = bannerData.text || '';
        document.getElementById('banner-link').value = bannerData.link || '';
        document.getElementById('banner-style').value = bannerData.style || 'purple-pink';
      }

      if (popupData) {
        popupActiveToggle.checked = popupData.active;
        popupActiveLabel.textContent = popupData.active ? 'Active' : 'Inactive';
        document.getElementById('popup-title').value = popupData.title || '';
        document.getElementById('popup-text').value = popupData.text || '';
        document.getElementById('popup-delay').value = popupData.delay || 3;
        document.getElementById('popup-icon-select').value = popupData.icon || '🎁';
        document.getElementById('popup-btn-text').value = popupData.btnText || '';
        document.getElementById('popup-btn-link').value = popupData.btnLink || '';
      }
    }

    if (bannerActiveToggle) {
      bannerActiveToggle.addEventListener('change', () => {
        bannerActiveLabel.textContent = bannerActiveToggle.checked ? 'Active' : 'Inactive';
        let bannerData = safeGetJSON('gaming07_banner', defaultBanner);
        bannerData.active = bannerActiveToggle.checked;
        localStorage.setItem('gaming07_banner', JSON.stringify(bannerData));
        injectPromoBanner();
        showToast(`Promo Banner set to ${bannerData.active ? 'active' : 'inactive'}`);
      });
    }

    if (bannerSettingsForm) {
      bannerSettingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = document.getElementById('banner-text').value;
        const link = document.getElementById('banner-link').value;
        const style = document.getElementById('banner-style').value;
        const active = bannerActiveToggle.checked;

        const bannerData = { active, text, link, style };
        localStorage.setItem('gaming07_banner', JSON.stringify(bannerData));
        injectPromoBanner();
        showToast('Header Banner settings saved successfully');
      });
    }

    if (popupActiveToggle) {
      popupActiveToggle.addEventListener('change', () => {
        popupActiveLabel.textContent = popupActiveToggle.checked ? 'Active' : 'Inactive';
        let popupData = safeGetJSON('gaming07_popup', defaultPopup);
        popupData.active = popupActiveToggle.checked;
        localStorage.setItem('gaming07_popup', JSON.stringify(popupData));
        // Reset dismissal on toggle active
        if (popupData.active) sessionStorage.removeItem('gaming07_popup_dismissed');
        injectPromoPopup();
        showToast(`Promo Pop-up set to ${popupData.active ? 'active' : 'inactive'}`);
      });
    }

    if (popupSettingsForm) {
      popupSettingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('popup-title').value;
        const text = document.getElementById('popup-text').value;
        const delay = parseInt(document.getElementById('popup-delay').value);
        const icon = document.getElementById('popup-icon-select').value;
        const btnText = document.getElementById('popup-btn-text').value;
        const btnLink = document.getElementById('popup-btn-link').value;
        const active = popupActiveToggle.checked;

        const popupData = { active, title, text, delay, icon, btnText, btnLink };
        localStorage.setItem('gaming07_popup', JSON.stringify(popupData));
        // Reset dismissal
        sessionStorage.removeItem('gaming07_popup_dismissed');
        injectPromoPopup();
        showToast('Pop-up configurations saved successfully');
      });
    }

    initBannersForms();
  }

  initLanguageSelector();
  initFooterModals();
});

function initFooterModals() {
  if (!document.getElementById('footer-modal-styles')) {
    const style = document.createElement('style');
    style.id = 'footer-modal-styles';
    style.textContent = `
      .g7-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(4, 5, 10, 0.85);
        backdrop-filter: blur(10px);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
      }
      .g7-modal-overlay.active {
        opacity: 1;
        pointer-events: auto;
      }
      .g7-modal-container {
        background: #0d111c;
        border: 1px solid var(--border-color);
        box-shadow: 0 0 40px rgba(0, 240, 255, 0.15);
        width: 90%;
        max-width: 600px;
        border-radius: 16px;
        overflow: hidden;
        transform: scale(0.9);
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      .g7-modal-overlay.active .g7-modal-container {
        transform: scale(1);
      }
      .g7-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 24px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        background: rgba(255, 255, 255, 0.02);
      }
      .g7-modal-header h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: var(--text-main);
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .g7-modal-close {
        background: none;
        border: none;
        color: var(--text-muted);
        font-size: 20px;
        cursor: pointer;
        transition: var(--transition);
        padding: 4px;
        line-height: 1;
      }
      .g7-modal-close:hover {
        color: var(--accent-red);
        transform: rotate(90deg);
      }
      .g7-modal-body {
        padding: 24px;
        max-height: 70vh;
        overflow-y: auto;
        color: var(--text-muted);
        font-size: 14px;
        line-height: 1.6;
      }
      .g7-modal-body::-webkit-scrollbar {
        width: 6px;
      }
      .g7-modal-body::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 3px;
      }
      .g7-modal-body h4 {
        color: var(--text-main);
        margin-top: 20px;
        margin-bottom: 8px;
        font-size: 15px;
      }
      .g7-modal-body p {
        margin-bottom: 14px;
      }
      .g7-contact-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .g7-form-group {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .g7-form-group label {
        font-size: 12px;
        color: var(--text-main);
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .g7-form-input {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 10px 14px;
        color: var(--text-main);
        font-family: inherit;
        font-size: 14px;
        transition: var(--transition);
      }
      .g7-form-input:focus {
        border-color: var(--accent-cyan);
        background: rgba(255, 255, 255, 0.05);
        outline: none;
        box-shadow: 0 0 10px rgba(0, 240, 255, 0.15);
      }
      .g7-contact-submit {
        background: linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-purple) 100%);
        border: none;
        color: #fff;
        font-weight: 600;
        padding: 12px;
        border-radius: 8px;
        cursor: pointer;
        transition: var(--transition);
        margin-top: 8px;
        box-shadow: var(--shadow-cyan);
      }
      .g7-contact-submit:hover {
        opacity: 0.9;
        transform: translateY(-2px);
        box-shadow: 0 0 20px rgba(0, 240, 255, 0.3);
      }
      .g7-contact-success {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
        text-align: center;
        gap: 16px;
      }
      .g7-success-icon {
        font-size: 48px;
        animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
      @keyframes scaleIn {
        0% { transform: scale(0); }
        100% { transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
  }

  let modalOverlay = document.getElementById('g7-footer-modal');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'g7-footer-modal';
    modalOverlay.className = 'g7-modal-overlay';
    modalOverlay.innerHTML = `
      <div class="g7-modal-container">
        <div class="g7-modal-header">
          <h3 id="g7-modal-title">Modal Title</h3>
          <button class="g7-modal-close" id="g7-modal-close-btn">&times;</button>
        </div>
        <div class="g7-modal-body" id="g7-modal-body-content"></div>
      </div>
    `;
    document.body.appendChild(modalOverlay);

    document.getElementById('g7-modal-close-btn').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) closeModal();
    });
  }

  function openModal(title, contentHTML) {
    document.getElementById('g7-modal-title').innerHTML = title;
    document.getElementById('g7-modal-body-content').innerHTML = contentHTML;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    const contactForm = document.getElementById('g7-actual-contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', handleContactSubmit);
    }
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function handleContactSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('g7-contact-name').value;
    const email = document.getElementById('g7-contact-email').value;
    
    document.getElementById('g7-modal-body-content').innerHTML = `
      <div class="g7-contact-success">
        <div class="g7-success-icon">🎉</div>
        <h3>Thank you, ${name}!</h3>
        <p>Your message has been sent successfully. We will reply to you at <strong>${email}</strong> as soon as possible.</p>
      </div>
    `;

    setTimeout(closeModal, 2500);
  }

  const contents = {
    privacy: `
      <p><strong>Last Updated: July 2026</strong></p>
      <p>At Gaming07 Portal, protecting your privacy is our top priority. This Privacy Policy explains the types of information we collect and how we use it.</p>
      
      <h4>1. Data Collection</h4>
      <p>We may collect information provided voluntarily (such as your name and email when using our forms or managing accounts) in order to respond to your requests.</p>
      
      <h4>2. Cookies and Tracking</h4>
      <p>We use essential cookies to store your browsing preferences (such as dark/light theme or the closing of promotional banners). Third-party tracking may be used by partner affiliate networks to record clicks on game download buttons.</p>
      
      <h4>3. Security</h4>
      <p>All of your session data and preferences remain stored locally on your own device (via LocalStorage). We do not sell or share any of your personal data.</p>
    `,
    terms: `
      <p><strong>Last Updated: July 2026</strong></p>
      <p>Welcome to Gaming07 Portal. By accessing this website, you agree to our terms of service. If you do not agree, please do not use our services.</p>
      
      <h4>1. Intellectual Property</h4>
      <p>All textual content, game reviews, animations, and structure of the Gaming07 website are the exclusive property of the portal, except for media belonging to their respective game publishers.</p>
      
      <h4>2. Affiliate Links</h4>
      <p>This portal is affiliated with a network of advertising partners. Game download links ("Play Free" buttons) integrate tracking parameters. Clicking these links supports our editorial team at no cost to you.</p>
      
      <h4>3. Liability</h4>
      <p>Reviews and analyses published on this site are provided for informational purposes. We do not guarantee the functioning of third-party game clients downloaded via external affiliate links.</p>
    `,
    contact: `
      <form class="g7-contact-form" id="g7-actual-contact-form">
        <div class="g7-form-group">
          <label for="g7-contact-name">Full Name</label>
          <input type="text" id="g7-contact-name" class="g7-form-input" placeholder="e.g., John Doe" required>
        </div>
        <div class="g7-form-group">
          <label for="g7-contact-email">Email Address</label>
          <input type="email" id="g7-contact-email" class="g7-form-input" placeholder="e.g., john.doe@mail.com" required>
        </div>
        <div class="g7-form-group">
          <label for="g7-contact-subject">Subject</label>
          <input type="text" id="g7-contact-subject" class="g7-form-input" placeholder="Subject of your message" required>
        </div>
        <div class="g7-form-group">
          <label for="g7-contact-msg">Message</label>
          <textarea id="g7-contact-msg" class="g7-form-input" rows="4" placeholder="Write your message here..." required></textarea>
        </div>
        <button type="submit" class="g7-contact-submit">Send Message</button>
      </form>
    `
  };

  document.addEventListener('click', (e) => {
    const target = e.target.closest('a');
    if (!target) return;

    const modalType = target.getAttribute('data-modal');
    if (!modalType) return;

    e.preventDefault();
    if (modalType === 'privacy') {
      openModal('🔒 Privacy Policy', contents.privacy);
    } else if (modalType === 'terms') {
      openModal('📜 Terms of Service', contents.terms);
    } else if (modalType === 'contact') {
      openModal('✉️ Contact Us', contents.contact);
    }
  });
}

function initLanguageSelector() {
  if (!document.getElementById('google_translate_element')) {
    const div = document.createElement('div');
    div.id = 'google_translate_element';
    div.style.display = 'none';
    document.body.appendChild(div);
  }

  window.googleTranslateElementInit = function() {
    new google.translate.TranslateElement({
      pageLanguage: 'en',
      autoDisplay: false
    }, 'google_translate_element');
  };

  if (!document.getElementById('google-translate-script')) {
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.head.appendChild(script);
  }

  document.addEventListener('click', (e) => {
    const targetLink = e.target.closest('.lang-dropdown a');
    if (targetLink) {
      e.preventDefault();
      const lang = targetLink.getAttribute('data-lang');
      translatePage(lang);
    }
  });

  const savedLang = localStorage.getItem('g7_selected_lang');
  if (savedLang) {
    translatePage(savedLang);
  } else {
    const userLang = (navigator.language || navigator.userLanguage).substring(0, 2);
    const supportedLangs = ['fr', 'es', 'de', 'it', 'ar', 'pt', 'ja', 'ko'];
    if (supportedLangs.includes(userLang) && userLang !== 'en') {
      translatePage(userLang);
    }
  }
}

function translatePage(langCode) {
  let attempts = 0;
  const checkInterval = setInterval(() => {
    const selectEl = document.querySelector('.goog-te-combo');
    attempts++;
    if (selectEl) {
      clearInterval(checkInterval);
      selectEl.value = langCode;
      selectEl.dispatchEvent(new Event('change'));

      const labelMap = {
        en: 'English', fr: 'Français', es: 'Español', de: 'Deutsch',
        it: 'Italiano', ar: 'العربية', pt: 'Português', ja: '日本語', ko: '한국어'
      };
      const currentLangLabel = document.getElementById('current-lang');
      if (currentLangLabel) {
        currentLangLabel.textContent = labelMap[langCode] || langCode;
      }
      localStorage.setItem('g7_selected_lang', langCode);
    }
    if (attempts > 40) clearInterval(checkInterval);
  }, 100);
}

