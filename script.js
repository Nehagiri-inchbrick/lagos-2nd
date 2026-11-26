/**
 * INCH & BRICK REALTY — INTERNATIONAL PROPERTY ADVISORY
 * Interaction Engine & Apple-Style Showcase Gallery
 * Reconciled with index.html — IDs: advisoryDeskForm, advisoryToast
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ============================================================
  // 1. HEADER — SCROLL STICKY CLASS
  // ============================================================
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  // ============================================================
  // 2. ADVISORY DESK FORM, CTA MODAL & TOAST
  // ============================================================
  const advisoryDeskForm = document.getElementById('advisoryDeskForm');
  const advisoryFormModal = document.getElementById('advisoryFormModal');
  const advisoryModalClose = document.getElementById('advisoryModalClose');
  const advisoryDeskModalForm = document.getElementById('advisoryDeskModalForm');
  const advisoryToast = document.getElementById('advisoryToast');
  let toastTimer = null;

  function showToast(heading, subtext) {
    if (!advisoryToast) return;
    const h = advisoryToast.querySelector('.toast-heading');
    const s = advisoryToast.querySelector('.toast-subtext');
    if (h) h.textContent = heading;
    if (s) s.textContent = subtext;
    advisoryToast.classList.add('active');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => advisoryToast.classList.remove('active'), 5000);
  }

  function openAdvisoryModal() {
    if (!advisoryFormModal) return;
    advisoryFormModal.classList.add('active');
    advisoryFormModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('modalFullName')?.focus(), 180);
  }

  function closeAdvisoryModal() {
    if (!advisoryFormModal) return;
    advisoryFormModal.classList.remove('active');
    advisoryFormModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function attachAdvisoryFormHandler(formEl, onSuccess) {
    if (!formEl) return;
    formEl.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = formEl.querySelector('button[type="submit"]');
      const originalHTML = submitBtn.innerHTML;

      submitBtn.innerHTML = '<span>Reserving Advisory Desk…</span>';
      submitBtn.style.opacity = '0.75';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = originalHTML;
        submitBtn.style.opacity = '1';
        submitBtn.disabled = false;
        formEl.reset();
        if (onSuccess) onSuccess();
        showToast(
          'Advisory Desk Requested',
          'Our Senior Portfolio Director will reach out to confirm your private session.'
        );
      }, 900);
    });
  }

  attachAdvisoryFormHandler(advisoryDeskForm);
  attachAdvisoryFormHandler(advisoryDeskModalForm, closeAdvisoryModal);

  if (advisoryModalClose) {
    advisoryModalClose.addEventListener('click', closeAdvisoryModal);
  }
  if (advisoryFormModal) {
    advisoryFormModal.addEventListener('click', (e) => {
      if (e.target === advisoryFormModal) closeAdvisoryModal();
    });
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && advisoryFormModal?.classList.contains('active')) {
      closeAdvisoryModal();
    }
  });

  document.querySelectorAll('a[href="#advisory-desk"]').forEach((cta) => {
    cta.addEventListener('click', (e) => {
      e.preventDefault();
      openAdvisoryModal();
    });
  });

  // ============================================================
  // 3. EXPO MEMORIES SLIDER WITH BIG ARROWS
  // ============================================================
  const initExpoSlider = () => {
    const track = document.getElementById('expoSliderTrack');
    const prevBtn = document.getElementById('expoSliderPrev');
    const nextBtn = document.getElementById('expoSliderNext');
    const dotsWrap = document.getElementById('expoSliderDots');
    const overlay = document.getElementById('expoSlideOverlay');
    if (!track || !prevBtn || !nextBtn || !dotsWrap) return;

    const slides = Array.from(track.querySelectorAll('.expo-slide-card'));
    let currentIndex = 0;
    let lightboxEl = null;

    const getVisibleCount = () => {
      if (window.innerWidth <= 700) return 1;
      if (window.innerWidth <= 960) return 2;
      return 3;
    };

    const getMaxIndex = () => Math.max(0, slides.length - getVisibleCount());

    const renderDots = () => {
      const maxIdx = getMaxIndex();
      dotsWrap.innerHTML = '';
      for (let i = 0; i <= maxIdx; i += 1) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'expo-slider-dot' + (i === currentIndex ? ' active' : '');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        dotsWrap.appendChild(dot);
      }
    };

    const goToSlide = (idx) => {
      const maxIdx = getMaxIndex();
      if (idx < 0) currentIndex = maxIdx;
      else if (idx > maxIdx) currentIndex = 0;
      else currentIndex = idx;

      const slideWidth = slides[0]?.getBoundingClientRect().width || 0;
      const gap = 20;
      track.style.transform = `translateX(-${currentIndex * (slideWidth + gap)}px)`;

      dotsWrap.querySelectorAll('.expo-slider-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    };

    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    // Touch swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => {
      if (e.touches[0]) touchStartX = e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener('touchend', (e) => {
      if (!e.changedTouches[0]) return;
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goToSlide(currentIndex + (diff > 0 ? 1 : -1));
    }, { passive: true });

    // Lightbox on image click
    const closeLightbox = () => {
      if (!lightboxEl) return;
      overlay?.classList.remove('is-active');
      lightboxEl.classList.remove('is-active');
      const closing = lightboxEl;
      lightboxEl = null;
      setTimeout(() => closing.remove(), 280);
    };

    slides.forEach((card) => {
      card.addEventListener('click', () => {
        const img = card.querySelector('img');
        if (!img || !overlay) return;
        overlay.classList.add('is-active');
        lightboxEl = document.createElement('div');
        lightboxEl.className = 'expo-slide-lightbox';
        const fullImg = document.createElement('img');
        fullImg.src = img.src;
        fullImg.alt = img.alt;
        lightboxEl.appendChild(fullImg);
        lightboxEl.addEventListener('click', closeLightbox);
        document.body.appendChild(lightboxEl);
        requestAnimationFrame(() => lightboxEl?.classList.add('is-active'));
      });
    });

    overlay?.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });

    window.addEventListener('resize', () => {
      renderDots();
      goToSlide(Math.min(currentIndex, getMaxIndex()));
    }, { passive: true });

    renderDots();
    goToSlide(0);
  };

  initExpoSlider();

  // ============================================================
  // 5. APPLE-STYLE DETAIL INSPECTION MODAL
  // ============================================================
  const modalBackdrop = document.getElementById('appleModalBackdrop');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalImg = document.getElementById('modalImg');
  const modalBadge = document.getElementById('modalBadge');
  const modalTitle = document.getElementById('modalTitle');
  const modalLocation = document.getElementById('modalLocationText');
  const modalPrice = document.getElementById('modalPrice');
  const modalDesc = document.getElementById('modalDesc');
  const modalBedrooms = document.getElementById('modalBedrooms');
  const modalArea = document.getElementById('modalArea');
  const modalTerrace = document.getElementById('modalTerrace');
  const modalParking = document.getElementById('modalParking');
  const modalReserveBtn = document.getElementById('modalReserveBtn');
  const modalFloorplanBtn = document.getElementById('modalFloorplanBtn');

  const propertyData = {
    '1': {
      title: 'The Royal Sky Penthouse',
      location: 'Downtown & Canal District',
      badge: 'Private Showcase Release',
      price: '$4,850,000 / AED 17,800,000',
      img: 'assets/dubai-skyline.jpg',
      desc: 'Double-height architectural glazing framing 360-degree vistas of Burj Khalifa and the Arabian Gulf. Features private rooftop infinity pool, temperature-controlled wine room, and dedicated resident lift shaft.',
      bedrooms: '5 En-Suite Bedrooms',
      area: '8,450 Sq.Ft Internal',
      terrace: '1,820 Sq.Ft Sky Deck',
      parking: '4 Subterranean Stalls'
    },
    '2': {
      title: 'The Sovereign Waterfront Villa',
      location: 'Palm Jumeirah & Palm Jebel Ali',
      badge: 'Private Island Haven',
      price: '$8,200,000 / AED 30,100,000',
      img: 'assets/dubai-villa.jpg',
      desc: 'Direct beachfront sanctuary featuring private 40-metre shoreline frontage, cascading infinity pools, private yacht mooring slip, and Japanese water courtyard.',
      bedrooms: '6 Grand Suites',
      area: '11,200 Sq.Ft Internal',
      terrace: '4,500 Sq.Ft Beach Garden',
      parking: '6 Vehicle Showroom'
    },
    '3': {
      title: 'Bespoke Coastal Sky Suite',
      location: 'Prime Waterfront Towers',
      badge: 'High-Yield Trophy Asset',
      price: '$3,600,000 / AED 13,200,000',
      img: 'assets/sealink.jpg',
      desc: 'Uninterrupted panoramic perspectives of the coastline. Crafted with handpicked Italian marble, biometric foyer access, and wrap-around sunset loggias.',
      bedrooms: '4 Ocean Suites',
      area: '4,100 Sq.Ft Internal',
      terrace: '950 Sq.Ft Sea Deck',
      parking: '3 Automated Stalls'
    },
    '4': {
      title: 'Horizon Infinity Pool & Sky Club',
      location: 'Private Marina & Club Level',
      badge: 'Resident Privilege',
      price: 'Exclusive to Owners',
      img: 'assets/pool.jpg',
      desc: 'Floating 48 levels above sea level, this heated cantilevered oasis offers private serviced daybeds, poolside mixology bar, and private sunset cabanas.',
      bedrooms: 'VIP Hospitality',
      area: '75-Metre Length',
      terrace: 'Ozone-Purified Water',
      parking: 'Direct Lift Access'
    },
    '5': {
      title: 'Sunset Marina Residence',
      location: 'Dubai Marina & Harbour',
      badge: 'Yacht Frontline',
      price: '$2,950,000 / AED 10,800,000',
      img: 'assets/yachts.jpg',
      desc: 'Floor-to-ceiling nautical glass with private mooring berths and expansive sunset entertaining loggias overlooking superyachts.',
      bedrooms: '4 Bedrooms + Maid',
      area: '3,250 Sq.Ft Internal',
      terrace: '720 Sq.Ft Marina Balcony',
      parking: '2 Covered Stalls + Yacht Berth'
    },
    '6': {
      title: 'The Grand Lobby Residence',
      location: 'Emaar Beachfront',
      badge: 'Grand Boulevard Address',
      price: '$5,100,000 / AED 18,700,000',
      img: 'assets/lobby.jpg',
      desc: 'Soaring double-volume lobby entrance with curated art installations, 24-hour concierge, and private elevator access to sprawling sky residences.',
      bedrooms: '4 Luxury Suites',
      area: '5,200 Sq.Ft Internal',
      terrace: '1,100 Sq.Ft Terrace',
      parking: '3 Private Stalls'
    },
    '7': {
      title: 'The Island Presidential Villa',
      location: 'Dubai Islands Peninsula',
      badge: 'Trophy Estate',
      price: '$12,500,000 / AED 45,900,000',
      img: 'assets/dubai-aerial.jpg',
      desc: 'An estate of monumental proportions featuring dual master wings, 6-vehicle subterranean vault, private wellness spa, and dedicated rooftop helipad access.',
      bedrooms: '7 Master Suites',
      area: '14,200 Sq.Ft Internal',
      terrace: '6,200 Sq.Ft Private Grounds',
      parking: '6-Car Subterranean Vault'
    }
  };

  function openModal(id) {
    const d = propertyData[id] || propertyData['1'];
    if (modalImg) { modalImg.src = d.img; modalImg.alt = d.title; }
    if (modalBadge) modalBadge.textContent = d.badge;
    if (modalTitle) modalTitle.textContent = d.title;
    if (modalLocation) modalLocation.textContent = d.location;
    if (modalPrice) modalPrice.textContent = d.price;
    if (modalDesc) modalDesc.textContent = d.desc;
    if (modalBedrooms) modalBedrooms.textContent = d.bedrooms;
    if (modalArea) modalArea.textContent = d.area;
    if (modalTerrace) modalTerrace.textContent = d.terrace;
    if (modalParking) modalParking.textContent = d.parking;

    if (modalBackdrop) {
      modalBackdrop.classList.add('active');
      modalBackdrop.setAttribute('aria-hidden', 'false');
    }
    document.body.style.overflow = 'hidden';
    pauseAutoplay();
  }

  function closeModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('active');
      modalBackdrop.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';
  }

  // Open modal on card click / button click
  document.querySelectorAll('.card-expand-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.gallery-card');
      if (card) openModal(card.getAttribute('data-id'));
    });
  });
  allCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.card-expand-btn')) return;
      openModal(card.getAttribute('data-id'));
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card.getAttribute('data-id'));
      }
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', (e) => { if (e.target === modalBackdrop) closeModal(); });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop?.classList.contains('active')) closeModal();
  });

  // Reserve button opens the advisory form modal
  if (modalReserveBtn) {
    modalReserveBtn.addEventListener('click', () => {
      closeModal();
      openAdvisoryModal();
    });
  }

  // Floorplan button shows toast
  if (modalFloorplanBtn) {
    modalFloorplanBtn.addEventListener('click', () => {
      closeModal();
      showToast('Architectural Deck Dispatched', 'Check your email for high-resolution floorplans and investment pro-formas.');
    });
  }

  // ============================================================
  // 6. SMOOTH SCROLL — ANCHOR LINKS
  // ============================================================
  document.querySelectorAll('a[href^="#"]:not([href="#advisory-desk"])').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ============================================================
  // 7. ARCHITECTURAL EXPANDING COLUMN SHOWCASE & LIGHTBOX
  // 7. TILTED MOVING COLUMNS & LIGHTBOX
  // ============================================================
  const columnsTrack = document.getElementById('expoColumnsTrack');
  const pillarCols = Array.from(document.querySelectorAll('.expo-pillar-col'));
  const colDots = Array.from(document.querySelectorAll('.col-dot'));
  const expoLightbox = document.getElementById('expoLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');

  let activeColIdx = 0;
  let colCycleTimer = null;
  let isHoveringCols = false;

  function setActiveColumn(index) {
    if (index < 0 || index >= pillarCols.length) return;
    activeColIdx = index;

    pillarCols.forEach((col, idx) => {
      col.classList.toggle('active', idx === activeColIdx);
    });

    colDots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === activeColIdx);
    });
  }

  function startColumnCycle() {
    clearInterval(colCycleTimer);
    colCycleTimer = setInterval(() => {
      if (!isHoveringCols) {
        const nextIdx = (activeColIdx + 1) % pillarCols.length;
        setActiveColumn(nextIdx);
      }
    }, 4500);
  }

  pillarCols.forEach((col, idx) => {
    col.addEventListener('mouseenter', () => {
      isHoveringCols = true;
      setActiveColumn(idx);
    });

    col.addEventListener('click', (e) => {
      setActiveColumn(idx);
      // If clicking expand button or clicking active column
      if (e.target.closest('.pillar-expand-btn') || col.classList.contains('active')) {
        const img = col.querySelector('.pillar-img');
        if (img) openLightbox(img.src);
      }
    });
  });

  if (columnsTrack) {
    columnsTrack.addEventListener('mouseenter', () => {
      isHoveringCols = true;
    });
    columnsTrack.addEventListener('mouseleave', () => {
      isHoveringCols = false;
    });
  }

  colDots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      setActiveColumn(idx);
    });
  });

  // Lightbox functionality
  function openLightbox(src) {
    if (!expoLightbox || !lightboxImg) return;
    lightboxImg.src = src;
    expoLightbox.classList.add('active');
    expoLightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!expoLightbox) return;
    expoLightbox.classList.remove('active');
    expoLightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.track img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      openLightbox(img.src);
    });
  });

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (expoLightbox) {
    expoLightbox.addEventListener('click', (e) => {
      if (e.target === expoLightbox) closeLightbox();
    });
  }
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && expoLightbox?.classList.contains('active')) {
      closeLightbox();
    }
  });

  // Start initial auto-cycle
  if (pillarCols.length > 0) {
    setActiveColumn(0);
    startColumnCycle();
  }

});
