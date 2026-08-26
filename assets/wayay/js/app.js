/* ==========================================================================
   WAYAY — Core app logic
   Cart, wishlist, search, toasts, header/drawers, shared product-card
   rendering. Every page loads data.js then app.js. Depends on partials
   (header.html / overlays.html / footer.html) being injected first.
   ========================================================================== */

var WAYAY = (function () {

  var FREE_SHIP_THRESHOLD = 25.000;
  var LS_CART = 'wayay_cart_v1';
  var LS_WISH = 'wayay_wish_v1';
  var LS_RECENT = 'wayay_recent_search_v1';
  var POPULAR_SEARCHES = ['Rompers', 'Denim Jacket', 'Swim', 'Beanie', 'Corduroy', 'Newborn Set'];

  /* ---------------- Storage helpers ---------------- */
  function readLS(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function writeLS(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  var cart = readLS(LS_CART, []);       // [{id, size, color, qty}]
  var wishlist = readLS(LS_WISH, []);   // [productId]

  function saveCart(){ writeLS(LS_CART, cart); renderCartDrawer(); syncBadges(); }
  function saveWishlist(){ writeLS(LS_WISH, wishlist); syncBadges(); }

  /* ---------------- Formatting ---------------- */
  function formatPrice(n){ return n.toFixed(3) + ' KD'; }
  function starsHTML(rating){
    var full = Math.round(rating);
    var html = '';
    for (var i=0;i<5;i++){
      html += '<svg viewBox="0 0 20 20"><polygon points="10,1 12.6,7 19.5,7.5 14.2,12 15.8,19 10,15.3 4.2,19 5.8,12 0.5,7.5 7.4,7"' + (i<full ? '' : ' opacity="0.28"') + '/></svg>';
    }
    return html;
  }

  /* ---------------- Product card (shared across pages) ---------------- */
  function badgeLabel(b){
    if (b==='new') return 'New';
    if (b==='sale') return 'Sale';
    if (b==='best') return 'Best Seller';
    return '';
  }
  function productCardHTML(p){
    var imgs = p.images || [];
    var swatches = (p.colors||[]).slice(0,4).map(function(c){
      var col = COLORS[c];
      return '<span class="pc-swatch" style="background:' + (col?col.hex:'#ccc') + '" title="' + (col?col.name:c) + '"></span>';
    }).join('');
    var wished = wishlist.indexOf(p.id) > -1;
    var priceHTML = p.compareAtPrice
      ? '<span class="pc-price on-sale">' + formatPrice(p.price) + '</span><span class="pc-compare">' + formatPrice(p.compareAtPrice) + '</span>'
      : '<span class="pc-price">' + formatPrice(p.price) + '</span>';

    return (
      '<div class="product-card" data-id="' + p.id + '">' +
        '<div class="pc-media">' +
          '<a href="product.html?slug=' + p.slug + '" aria-label="' + p.name + '">' +
            '<img class="pc-img-a" src="' + imgs[0] + '" alt="' + p.name + ' — WAYAY kids clothing" loading="lazy" width="900" height="1125">' +
            (imgs[1] ? '<img class="pc-img-b" src="' + imgs[1] + '" alt="" loading="lazy" width="900" height="1125">' : '') +
          '</a>' +
          (p.badge ? '<div class="pc-badges"><span class="pc-badge ' + p.badge + '">' + badgeLabel(p.badge) + '</span></div>' : '') +
          '<button class="pc-wish' + (wished ? ' is-active' : '') + '" data-wish="' + p.id + '" aria-label="Add to wishlist">' +
            '<svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>' +
          '</button>' +
          '<div class="pc-quickadd">' +
            '<button class="pc-quickadd-btn" data-quickadd="' + p.id + '">Quick Add</button>' +
          '</div>' +
        '</div>' +
        '<div class="pc-body">' +
          '<a href="product.html?slug=' + p.slug + '"><p class="pc-name">' + p.name + '</p></a>' +
          '<div class="pc-swatches">' + swatches + '</div>' +
          '<div class="pc-price-row">' + priceHTML + '</div>' +
          '<div class="pc-rating">' + starsHTML(p.rating) + '<span>' + p.rating.toFixed(1) + ' (' + p.reviewsCount + ')</span></div>' +
        '</div>' +
      '</div>'
    );
  }
  function skeletonCardHTML(){
    return '<div class="skel-card"><div class="skel"></div><div class="skel skel-line" style="width:80%"></div><div class="skel skel-line" style="width:40%"></div></div>';
  }
  function renderGridSkeleton(el, count){
    var html = '';
    for (var i=0;i<count;i++) html += skeletonCardHTML();
    el.innerHTML = html;
  }
  function renderProductGrid(el, products, emptyMsg){
    if (!products.length){
      el.innerHTML = '';
      var empty = document.createElement('div');
      empty.className = 'state-block';
      empty.style.gridColumn = '1/-1';
      empty.innerHTML = '<svg class="icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>' +
        '<h3>No products found</h3><p>' + (emptyMsg || 'Try adjusting your filters or search for something else.') + '</p>';
      el.appendChild(empty);
      return;
    }
    el.innerHTML = products.map(productCardHTML).join('');
    bindProductCardEvents(el);
    observeFadeUps(el);
  }
  function bindProductCardEvents(scopeEl){
    scopeEl.querySelectorAll('[data-wish]').forEach(function(btn){
      btn.addEventListener('click', function(e){
        e.preventDefault(); e.stopPropagation();
        var id = btn.getAttribute('data-wish');
        var active = toggleWishlist(id);
        btn.classList.toggle('is-active', active);
        btn.classList.remove('pulse'); void btn.offsetWidth; btn.classList.add('pulse');
        showToast(active ? 'Added to wishlist' : 'Removed from wishlist', 'heart');
      });
    });
    scopeEl.querySelectorAll('[data-quickadd]').forEach(function(btn){
      btn.addEventListener('click', function(e){
        e.preventDefault(); e.stopPropagation();
        var id = btn.getAttribute('data-quickadd');
        var p = PRODUCTS.filter(function(x){ return x.id===id; })[0];
        if (!p) return;
        addToCart(p, p.sizes.filter(function(s){return p.oosSizes.indexOf(s)===-1;})[0] || p.sizes[0], p.colors[0], 1);
        showToast(p.name + ' added to bag', 'check');
        openCart();
      });
    });
  }

  /* ---------------- Cart ---------------- */
  function cartTotals(){
    var qty = 0, subtotal = 0;
    cart.forEach(function(line){
      var p = PRODUCTS.filter(function(x){return x.id===line.id;})[0];
      if (!p) return;
      qty += line.qty;
      subtotal += p.price * line.qty;
    });
    return { qty: qty, subtotal: subtotal };
  }
  function addToCart(product, size, color, qty){
    var existing = cart.filter(function(l){ return l.id===product.id && l.size===size && l.color===color; })[0];
    if (existing) existing.qty += qty;
    else cart.push({ id: product.id, size: size, color: color, qty: qty });
    saveCart();
  }
  function removeCartLine(idx){ cart.splice(idx,1); saveCart(); }
  function changeCartQty(idx, delta){
    cart[idx].qty += delta;
    if (cart[idx].qty <= 0) cart.splice(idx,1);
    saveCart();
  }
  function renderCartDrawer(){
    var itemsEl = document.getElementById('cartItems');
    var footEl = document.getElementById('cartFoot');
    var headCount = document.getElementById('cartHeadCount');
    var subtotalEl = document.getElementById('cartSubtotal');
    var fillEl = document.getElementById('freeShipFill');
    var msgEl = document.getElementById('freeShipMsg');
    if (!itemsEl) return;

    var totals = cartTotals();
    if (headCount) headCount.textContent = totals.qty;

    if (!cart.length){
      itemsEl.innerHTML = '<div class="cart-empty">' +
        '<svg class="icon" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>' +
        '<h3 style="font-family:var(--font-display);font-size:18px">Your bag is empty</h3>' +
        '<p style="font-size:13px;color:var(--color-ink-soft)">Little styles are waiting for you.</p>' +
        '<a href="collection.html?cat=new-in" class="btn btn-primary btn-sm">Shop New In</a>' +
      '</div>';
      if (footEl) footEl.style.display = 'none';
    } else {
      if (footEl) footEl.style.display = '';
      itemsEl.innerHTML = cart.map(function(line, idx){
        var p = PRODUCTS.filter(function(x){return x.id===line.id;})[0];
        if (!p) return '';
        var col = COLORS[line.color];
        return (
          '<div class="cart-line">' +
            '<a href="product.html?slug=' + p.slug + '"><img src="' + p.images[0] + '" alt="' + p.name + '" width="78" height="96" loading="lazy"></a>' +
            '<div class="cart-line-body">' +
              '<div class="cart-line-top">' +
                '<a href="product.html?slug=' + p.slug + '"><p class="cart-line-name">' + p.name + '</p></a>' +
                '<span class="cart-line-price">' + formatPrice(p.price * line.qty) + '</span>' +
              '</div>' +
              '<p class="cart-line-meta">Size ' + line.size + (col ? ' &middot; ' + col.name : '') + '</p>' +
              '<div class="cart-line-bottom">' +
                '<div class="qty-stepper">' +
                  '<button data-qty-down="' + idx + '" aria-label="Decrease quantity">&minus;</button>' +
                  '<span>' + line.qty + '</span>' +
                  '<button data-qty-up="' + idx + '" aria-label="Increase quantity">&plus;</button>' +
                '</div>' +
              '</div>' +
              '<button class="remove-link" data-remove="' + idx + '">Remove</button>' +
            '</div>' +
          '</div>'
        );
      }).join('');

      itemsEl.querySelectorAll('[data-qty-up]').forEach(function(b){ b.addEventListener('click', function(){ changeCartQty(+b.getAttribute('data-qty-up'), 1); }); });
      itemsEl.querySelectorAll('[data-qty-down]').forEach(function(b){ b.addEventListener('click', function(){ changeCartQty(+b.getAttribute('data-qty-down'), -1); }); });
      itemsEl.querySelectorAll('[data-remove]').forEach(function(b){ b.addEventListener('click', function(){ removeCartLine(+b.getAttribute('data-remove')); }); });
    }

    if (subtotalEl) subtotalEl.textContent = formatPrice(totals.subtotal);
    var pct = Math.min(100, (totals.subtotal / FREE_SHIP_THRESHOLD) * 100);
    if (fillEl) fillEl.style.width = pct + '%';
    if (msgEl){
      if (totals.subtotal >= FREE_SHIP_THRESHOLD){
        msgEl.innerHTML = '&#10003; You\'ve unlocked <strong>FREE shipping</strong>';
      } else {
        var remain = (FREE_SHIP_THRESHOLD - totals.subtotal).toFixed(3);
        msgEl.innerHTML = 'You\'re <strong>' + remain + ' KD</strong> away from FREE shipping';
      }
    }
  }

  /* ---------------- Wishlist ---------------- */
  function toggleWishlist(id){
    var i = wishlist.indexOf(id);
    if (i>-1){ wishlist.splice(i,1); saveWishlist(); return false; }
    wishlist.push(id); saveWishlist(); return true;
  }
  function isWished(id){ return wishlist.indexOf(id) > -1; }

  /* ---------------- Badges ---------------- */
  function syncBadges(){
    var totals = cartTotals();
    var cartBadges = document.querySelectorAll('#cartCount');
    cartBadges.forEach(function(b){ b.textContent = totals.qty; b.hidden = totals.qty===0; });
    var wishBadges = document.querySelectorAll('#wishlistCount');
    wishBadges.forEach(function(b){ b.textContent = wishlist.length; b.hidden = wishlist.length===0; });
  }

  /* ---------------- Toasts ---------------- */
  function showToast(msg, icon){
    var stack = document.getElementById('toastStack');
    if (!stack) return;
    var t = document.createElement('div');
    t.className = 'toast';
    var iconSvg = icon==='heart'
      ? '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
    t.innerHTML = iconSvg + '<span>' + msg + '</span>';
    stack.appendChild(t);
    setTimeout(function(){
      t.classList.add('leaving');
      setTimeout(function(){ t.remove(); }, 280);
    }, 2400);
  }

  /* ---------------- Drawers / overlays ---------------- */
  function openEl(el, scrim){ if(el) el.classList.add('is-open'); if(scrim) scrim.classList.add('is-open'); document.body.classList.add('no-scroll'); }
  function closeEl(el, scrim){ if(el) el.classList.remove('is-open'); if(scrim) scrim.classList.remove('is-open'); if(!anyOverlayOpen()) document.body.classList.remove('no-scroll'); }
  function anyOverlayOpen(){
    return ['mobileDrawer','cartDrawer','searchOverlay'].some(function(id){
      var e = document.getElementById(id); return e && e.classList.contains('is-open');
    });
  }
  function openCart(){ renderCartDrawer(); openEl(document.getElementById('cartDrawer'), document.getElementById('cartScrim')); }
  function closeCart(){ closeEl(document.getElementById('cartDrawer'), document.getElementById('cartScrim')); }
  function openNav(){ openEl(document.getElementById('mobileDrawer'), document.getElementById('navScrim')); }
  function closeNav(){ closeEl(document.getElementById('mobileDrawer'), document.getElementById('navScrim')); }
  function openSearch(){
    var el = document.getElementById('searchOverlay');
    if (!el) return;
    el.classList.add('is-open');
    document.body.classList.add('no-scroll');
    var input = document.getElementById('searchInput');
    if (input) setTimeout(function(){ input.focus(); }, 150);
    renderSearchIdle();
  }
  function closeSearch(){
    var el = document.getElementById('searchOverlay');
    if (el) el.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  }

  /* ---------------- Search ---------------- */
  function getRecentSearches(){ return readLS(LS_RECENT, []); }
  function pushRecentSearch(term){
    var list = getRecentSearches().filter(function(t){ return t.toLowerCase()!==term.toLowerCase(); });
    list.unshift(term);
    writeLS(LS_RECENT, list.slice(0,6));
  }
  function chipHTML(term){ return '<button class="chip" data-search-chip="' + term + '">' + term + '</button>'; }
  function renderSearchIdle(){
    var recentEl = document.getElementById('recentSearches');
    var popEl = document.getElementById('popularSearches');
    var suggestGrid = document.getElementById('searchSuggestGrid');
    if (!recentEl) return;
    var recent = getRecentSearches();
    recentEl.innerHTML = recent.length ? recent.map(chipHTML).join('') : '<span class="text-soft" style="font-size:12.5px">No recent searches yet</span>';
    popEl.innerHTML = POPULAR_SEARCHES.map(chipHTML).join('');
    var suggestions = PRODUCTS.filter(function(p){ return p.bestSeller; }).slice(0,4);
    renderProductGrid(suggestGrid, suggestions);
    bindSearchChips();
    document.getElementById('searchIdleState').style.display = '';
    document.getElementById('searchResultsState').style.display = 'none';
  }
  function bindSearchChips(){
    document.querySelectorAll('[data-search-chip]').forEach(function(chip){
      chip.addEventListener('click', function(){
        var term = chip.getAttribute('data-search-chip');
        document.getElementById('searchInput').value = term;
        runSearch(term);
      });
    });
  }
  function runSearch(term){
    var q = term.trim().toLowerCase();
    if (!q){ renderSearchIdle(); return; }
    var results = PRODUCTS.filter(function(p){
      return p.name.toLowerCase().indexOf(q) > -1 ||
             p.category.toLowerCase().indexOf(q) > -1 ||
             (p.colors||[]).some(function(c){ return (COLORS[c]?COLORS[c].name.toLowerCase():'').indexOf(q) > -1; });
    });
    document.getElementById('searchIdleState').style.display = 'none';
    var resultsState = document.getElementById('searchResultsState');
    resultsState.style.display = '';
    document.getElementById('searchResultsHeading').textContent = results.length + ' result' + (results.length===1?'':'s') + ' for "' + term + '"';
    renderProductGrid(document.getElementById('searchResultsGrid'), results, 'No matches — try "rompers", "denim" or a color like "sage".');
  }
  function bindSearchInput(){
    var input = document.getElementById('searchInput');
    if (!input) return;
    var debounceTimer;
    input.addEventListener('input', function(){
      clearTimeout(debounceTimer);
      var val = input.value;
      debounceTimer = setTimeout(function(){ runSearch(val); }, 180);
    });
    input.addEventListener('keydown', function(e){
      if (e.key==='Enter' && input.value.trim()){ pushRecentSearch(input.value.trim()); }
    });
  }

  /* ---------------- Fade-up on scroll ---------------- */
  var io;
  function observeFadeUps(scope){
    var root = scope || document;
    var els = root.querySelectorAll('.fade-up:not(.is-visible)');
    if (!('IntersectionObserver' in window)){
      els.forEach(function(e){ e.classList.add('is-visible'); });
      return;
    }
    if (!io){
      io = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if (entry.isIntersecting){ entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
        });
      }, { threshold: 0.12 });
    }
    els.forEach(function(e){ io.observe(e); });
  }

  /* ---------------- Header scroll state ---------------- */
  function bindHeaderScroll(){
    var header = document.querySelector('.site-header');
    if (!header) return;
    function onScroll(){ header.classList.toggle('is-scrolled', window.scrollY > 12); }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive:true });
  }

  /* ---------------- Wire up all overlay/drawer controls ---------------- */
  function bindGlobalControls(){
    var hamburgerBtn = document.getElementById('hamburgerBtn');
    var drawerCloseBtn = document.getElementById('drawerCloseBtn');
    var navScrim = document.getElementById('navScrim');
    if (hamburgerBtn) hamburgerBtn.addEventListener('click', openNav);
    if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeNav);
    if (navScrim) navScrim.addEventListener('click', closeNav);

    var cartOpenBtn = document.getElementById('cartOpenBtn');
    var cartCloseBtn = document.getElementById('cartCloseBtn');
    var cartScrim = document.getElementById('cartScrim');
    if (cartOpenBtn) cartOpenBtn.addEventListener('click', openCart);
    if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
    if (cartScrim) cartScrim.addEventListener('click', closeCart);

    var searchOpenBtn = document.getElementById('searchOpenBtn');
    var searchCloseBtn = document.getElementById('searchCloseBtn');
    if (searchOpenBtn) searchOpenBtn.addEventListener('click', openSearch);
    if (searchCloseBtn) searchCloseBtn.addEventListener('click', closeSearch);
    bindSearchInput();

    document.addEventListener('keydown', function(e){
      if (e.key==='Escape'){ closeNav(); closeCart(); closeSearch(); }
    });

    var checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) checkoutBtn.addEventListener('click', function(e){
      e.preventDefault();
      if (!cart.length) return;
      showToast('Checkout is a demo in this preview', 'check');
    });

    var newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) newsletterForm.addEventListener('submit', function(e){
      e.preventDefault();
      showToast('Welcome to the WAYAY family!', 'check');
      newsletterForm.reset();
    });

    var yearEl = document.getElementById('footYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    bindHeaderScroll();
    renderCartDrawer();
    syncBadges();
    observeFadeUps();
  }

  /* ---------------- Partial injection ---------------- */
  function loadPartials(cb){
    var headerMount = document.getElementById('wayay-header');
    var overlaysMount = document.getElementById('wayay-overlays');
    var footerMount = document.getElementById('wayay-footer');
    var base = document.body.getAttribute('data-base') || '';

    Promise.all([
      headerMount ? fetch(base + 'assets/wayay/partials/header.html').then(function(r){return r.text();}) : Promise.resolve(''),
      overlaysMount ? fetch(base + 'assets/wayay/partials/overlays.html').then(function(r){return r.text();}) : Promise.resolve(''),
      footerMount ? fetch(base + 'assets/wayay/partials/footer.html').then(function(r){return r.text();}) : Promise.resolve('')
    ]).then(function(res){
      if (headerMount) headerMount.innerHTML = res[0];
      if (overlaysMount) overlaysMount.innerHTML = res[1];
      if (footerMount) footerMount.innerHTML = res[2];
      bindGlobalControls();
      if (cb) cb();
    }).catch(function(err){
      console.error('WAYAY: failed to load partials', err);
      if (cb) cb();
    });
  }

  return {
    loadPartials: loadPartials,
    productCardHTML: productCardHTML,
    renderProductGrid: renderProductGrid,
    renderGridSkeleton: renderGridSkeleton,
    bindProductCardEvents: bindProductCardEvents,
    addToCart: addToCart,
    toggleWishlist: toggleWishlist,
    isWished: isWished,
    showToast: showToast,
    formatPrice: formatPrice,
    starsHTML: starsHTML,
    openCart: openCart,
    observeFadeUps: observeFadeUps,
    getCart: function(){ return cart; },
    getWishlist: function(){ return wishlist; },
    cartTotals: cartTotals
  };
})();
