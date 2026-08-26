/* ==========================================================================
   WAYAY — Product & content data
   --------------------------------------------------------------------------
   This is a static catalog used to drive the whole demo store client-side
   (no backend). To go live with real photography:
     1. Replace the `img()` calls in PRODUCTS below with real image URLs
        (e.g. "/assets/wayay/images/products/rr-001-a.jpg").
     2. Keep the same array shape — every page reads from this file only.
   ========================================================================== */

/* Deterministic placeholder image builder — swap this for real photos.
   Renders a locally-generated inline SVG (no network request), so the
   store looks complete even offline. To go live, replace calls to img()
   with real photo URLs/paths — every consumer just expects a <img src>. */
function wrapLabelLines(label, maxChars) {
  var out = [];
  label.split('\n').forEach(function (seg) {
    var words = seg.split(' ');
    var cur = '';
    words.forEach(function (w) {
      var test = cur ? cur + ' ' + w : w;
      if (test.length > maxChars && cur) { out.push(cur); cur = w; }
      else cur = test;
    });
    if (cur) out.push(cur);
  });
  return out;
}
function escapeXML(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function img(w, h, label, bg, fg) {
  bg = bg || 'F3EEE6';
  fg = fg || '221F1C';
  var maxChars = Math.max(9, Math.floor(w / 40));
  var lines = wrapLabelLines(label, maxChars);
  var lineHeight = Math.round(h * 0.05);
  var fontSize = Math.round(h * 0.032);
  var startY = h / 2 - ((lines.length - 1) * lineHeight) / 2;
  var textEls = lines.map(function (line, i) {
    return '<text x="50%" y="' + Math.round(startY + i * lineHeight) + '" text-anchor="middle" dominant-baseline="middle" ' +
      'font-family="Georgia, \'Times New Roman\', serif" font-size="' + fontSize + '" fill="#' + fg + '" opacity="0.8">' +
      escapeXML(line) + '</text>';
  }).join('');
  var svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">' +
      '<defs><radialGradient id="g" cx="50%" cy="28%" r="78%">' +
        '<stop offset="0%" stop-color="#ffffff" stop-opacity="0.4"/>' +
        '<stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>' +
      '</radialGradient></defs>' +
      '<rect width="100%" height="100%" fill="#' + bg + '"/>' +
      '<rect width="100%" height="100%" fill="url(#g)"/>' +
      textEls +
      '<text x="50%" y="' + Math.round(h - h * 0.05) + '" text-anchor="middle" font-family="Arial, sans-serif" ' +
        'font-size="' + Math.round(h * 0.02) + '" letter-spacing="3" fill="#' + fg + '" opacity="0.4">WAYAY</text>' +
    '</svg>';
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

var WAYAY_PALETTE = {
  sand: '#E4D3B8', clay: '#C97B5A', sage: '#93A484', cream: '#F3EEE6',
  blush: '#E9C2B8', denim: '#6E85A0', butter: '#EAD9A0', charcoal: '#3B3835'
};

var CATEGORIES = [
  { id: 'girls',       name: 'Girls',       slug: 'girls',       hero: img(700,900,'Girls',WAYAY_PALETTE.blush.slice(1),'2B211D') },
  { id: 'boys',         name: 'Boys',        slug: 'boys',        hero: img(700,900,'Boys',WAYAY_PALETTE.denim.slice(1),'F5F3EE') },
  { id: 'baby',         name: 'Baby',        slug: 'baby',        hero: img(700,900,'Baby',WAYAY_PALETTE.butter.slice(1),'2B211D') },
  { id: 'newborn',      name: 'Newborn',     slug: 'newborn',     hero: img(700,900,'Newborn',WAYAY_PALETTE.cream.slice(1),'2B211D') },
  { id: 'accessories',  name: 'Accessories', slug: 'accessories', hero: img(700,900,'Accessories',WAYAY_PALETTE.sage.slice(1),'F5F3EE') }
];

var AGE_GROUPS = ['0-3M','3-6M','6-12M','1-2Y','2-4Y','4-6Y','6-8Y','8-12Y'];

var COLORS = {
  sand:   { name: 'Sand',   hex: '#E4D3B8' },
  clay:   { name: 'Clay',   hex: '#C97B5A' },
  sage:   { name: 'Sage',   hex: '#93A484' },
  cream:  { name: 'Cream',  hex: '#F6F1E7' },
  blush:  { name: 'Blush',  hex: '#E9C2B8' },
  denim:  { name: 'Denim',  hex: '#6E85A0' },
  butter: { name: 'Butter', hex: '#EAD9A0' },
  charcoal:{ name: 'Charcoal', hex: '#3B3835' },
  white:  { name: 'White',  hex: '#FBFAF7' },
  terracotta: { name: 'Terracotta', hex: '#B4593A' }
};

function productImages(seedName, hexA, hexB) {
  return [
    img(900, 1125, seedName, hexA, '241E19'),
    img(900, 1125, seedName + '\nDetail', hexB, '241E19')
  ];
}

var PRODUCTS = [
  { id:'wy-001', name:'Cloud Terry Romper', slug:'cloud-terry-romper', category:'baby', gender:'unisex',
    ageGroups:['0-3M','3-6M'], price:16.500, compareAtPrice:22.000,
    colors:['sand','sage'], sizes:['0-3M','3-6M','6-9M'], oosSizes:['6-9M'],
    images: productImages('Cloud Terry Romper', 'E4D3B8', '93A484'),
    badge:'sale', rating:4.9, reviewsCount:142, isNew:false, bestSeller:true,
    description:'A featherweight organic terry romper cut for full-day comfort. Snap closures at the base make changes quick, while the relaxed fit leaves room to move, kick and nap in equal measure.' },

  { id:'wy-002', name:'Meadow Puff-Sleeve Dress', slug:'meadow-puff-sleeve-dress', category:'girls', gender:'girls',
    ageGroups:['1-2Y','2-4Y','4-6Y'], price:24.000, compareAtPrice:null,
    colors:['blush','cream'], sizes:['1-2Y','2-4Y','4-6Y','6-8Y'], oosSizes:[],
    images: productImages('Meadow Puff-Sleeve Dress', 'E9C2B8', 'F6F1E7'),
    badge:'new', rating:4.8, reviewsCount:64, isNew:true, bestSeller:false,
    description:'Soft cotton poplin with gentle puffed sleeves and a twirl-friendly skirt. Finished with a delicate back tie so getting dressed feels like part of the fun.' },

  { id:'wy-003', name:'Harbor Ribbed Knit Set', slug:'harbor-ribbed-knit-set', category:'boys', gender:'boys',
    ageGroups:['2-4Y','4-6Y','6-8Y'], price:21.000, compareAtPrice:28.000,
    colors:['denim','charcoal'], sizes:['2-4Y','4-6Y','6-8Y','8-12Y'], oosSizes:[],
    images: productImages('Harbor Ribbed Knit Set', '6E85A0', '3B3835'),
    badge:'sale', rating:4.7, reviewsCount:98, isNew:false, bestSeller:true,
    description:'A two-piece ribbed knit set built for everyday adventures — breathable, stretchy, and pre-washed for a lived-in softness from day one.' },

  { id:'wy-004', name:'First Light Onesie Bundle', slug:'first-light-onesie-bundle', category:'newborn', gender:'unisex',
    ageGroups:['0-3M'], price:19.500, compareAtPrice:null,
    colors:['cream','butter','sage'], sizes:['Newborn','0-3M'], oosSizes:[],
    images: productImages('First Light Onesie Bundle', 'F6F1E7', 'EAD9A0'),
    badge:'new', rating:5.0, reviewsCount:37, isNew:true, bestSeller:false,
    description:'A set of three GOTS-certified organic cotton onesies in soft, easy-to-mix tones — gentle on newborn skin, easy on laundry day.' },

  { id:'wy-005', name:'Sunfield Corduroy Overalls', slug:'sunfield-corduroy-overalls', category:'baby', gender:'unisex',
    ageGroups:['6-12M','1-2Y'], price:26.000, compareAtPrice:null,
    colors:['clay','sand'], sizes:['6-9M','9-12M','1-2Y'], oosSizes:['9-12M'],
    images: productImages('Sunfield Corduroy Overalls', 'C97B5A', 'E4D3B8'),
    badge:null, rating:4.6, reviewsCount:51, isNew:false, bestSeller:false,
    description:'Finely wide-waled corduroy overalls with adjustable straps and a roomy front pocket — built to layer through every season.' },

  { id:'wy-006', name:'Petal Smocked Two-Piece', slug:'petal-smocked-two-piece', category:'girls', gender:'girls',
    ageGroups:['2-4Y','4-6Y'], price:23.500, compareAtPrice:31.000,
    colors:['blush','clay'], sizes:['2-4Y','4-6Y','6-8Y'], oosSizes:[],
    images: productImages('Petal Smocked Two-Piece', 'E9C2B8', 'C97B5A'),
    badge:'sale', rating:4.8, reviewsCount:76, isNew:false, bestSeller:true,
    description:'A smocked top and matching shorts in breathable cotton voile, made for warm days and easy movement — playground-approved, picture-ready.' },

  { id:'wy-007', name:'Voyager Denim Jacket', slug:'voyager-denim-jacket', category:'boys', gender:'boys',
    ageGroups:['4-6Y','6-8Y','8-12Y'], price:29.000, compareAtPrice:null,
    colors:['denim'], sizes:['4-6Y','6-8Y','8-12Y'], oosSizes:[],
    images: productImages('Voyager Denim Jacket', '6E85A0', 'F6F1E7'),
    badge:'new', rating:4.9, reviewsCount:22, isNew:true, bestSeller:false,
    description:'A washed denim jacket with brushed-cotton lining and reinforced stitching at every seam — the one layer that goes with everything.' },

  { id:'wy-008', name:'Little Sprout Knit Hat', slug:'little-sprout-knit-hat', category:'accessories', gender:'unisex',
    ageGroups:['0-3M','3-6M','6-12M'], price:8.500, compareAtPrice:null,
    colors:['sage','sand','cream'], sizes:['0-6M','6-12M'], oosSizes:[],
    images: productImages('Little Sprout Knit Hat', '93A484', 'F6F1E7'),
    badge:null, rating:4.7, reviewsCount:44, isNew:false, bestSeller:false,
    description:'A gently ribbed knit hat with a soft fold-up brim, finished with a hand-stitched WAYAY tag.' },

  { id:'wy-009', name:'Orchard Ruffle Swim Set', slug:'orchard-ruffle-swim-set', category:'girls', gender:'girls',
    ageGroups:['1-2Y','2-4Y','4-6Y'], price:18.000, compareAtPrice:24.000,
    colors:['blush','butter'], sizes:['1-2Y','2-4Y','4-6Y'], oosSizes:[],
    images: productImages('Orchard Ruffle Swim Set', 'E9C2B8', 'EAD9A0'),
    badge:'sale', rating:4.6, reviewsCount:39, isNew:false, bestSeller:false,
    description:'UPF50+ recycled swim fabric with a playful ruffle trim — quick-drying, chlorine-resistant, and built for splash days.' },

  { id:'wy-010', name:'Basecamp Fleece Pullover', slug:'basecamp-fleece-pullover', category:'boys', gender:'boys',
    ageGroups:['2-4Y','4-6Y','6-8Y'], price:22.500, compareAtPrice:null,
    colors:['charcoal','clay'], sizes:['2-4Y','4-6Y','6-8Y','8-12Y'], oosSizes:[],
    images: productImages('Basecamp Fleece Pullover', '3B3835', 'C97B5A'),
    badge:'best', rating:4.9, reviewsCount:113, isNew:false, bestSeller:true,
    description:'Brushed recycled fleece with a kangaroo pocket and ribbed cuffs — the pullover that outlasts every recess.' },

  { id:'wy-011', name:'Driftwood Linen Shirt', slug:'driftwood-linen-shirt', category:'boys', gender:'boys',
    ageGroups:['4-6Y','6-8Y','8-12Y'], price:20.000, compareAtPrice:null,
    colors:['sand','white'], sizes:['4-6Y','6-8Y','8-12Y'], oosSizes:[],
    images: productImages('Driftwood Linen Shirt', 'E4D3B8', 'FBFAF7'),
    badge:'new', rating:4.5, reviewsCount:18, isNew:true, bestSeller:false,
    description:'A relaxed linen-blend shirt with mother-of-pearl buttons — lightweight structure for warm-weather occasions.' },

  { id:'wy-012', name:'Blossom Tulle Skirt', slug:'blossom-tulle-skirt', category:'girls', gender:'girls',
    ageGroups:['2-4Y','4-6Y','6-8Y'], price:17.500, compareAtPrice:null,
    colors:['blush','cream'], sizes:['2-4Y','4-6Y','6-8Y'], oosSizes:[],
    images: productImages('Blossom Tulle Skirt', 'E9C2B8', 'F6F1E7'),
    badge:'best', rating:4.8, reviewsCount:87, isNew:false, bestSeller:true,
    description:'A layered tulle skirt with a soft cotton lining — twirls beautifully, feels soft against skin, pairs with everything in her closet.' },

  { id:'wy-013', name:'Nestled Muslin Swaddle Set', slug:'nestled-muslin-swaddle-set', category:'newborn', gender:'unisex',
    ageGroups:['0-3M'], price:15.000, compareAtPrice:19.000,
    colors:['sage','sand','butter'], sizes:['One Size'], oosSizes:[],
    images: productImages('Nestled Muslin Swaddle Set', '93A484', 'EAD9A0'),
    badge:'sale', rating:5.0, reviewsCount:29, isNew:false, bestSeller:false,
    description:'Three bamboo-cotton muslin swaddles that get softer with every wash — breathable, oversized, and endlessly useful.' },

  { id:'wy-014', name:'Trailhead Cargo Joggers', slug:'trailhead-cargo-joggers', category:'boys', gender:'boys',
    ageGroups:['2-4Y','4-6Y','6-8Y','8-12Y'], price:19.000, compareAtPrice:null,
    colors:['charcoal','sand'], sizes:['2-4Y','4-6Y','6-8Y','8-12Y'], oosSizes:[],
    images: productImages('Trailhead Cargo Joggers', '3B3835', 'E4D3B8'),
    badge:null, rating:4.6, reviewsCount:55, isNew:false, bestSeller:false,
    description:'Stretch cotton joggers with a utility pocket and reinforced knees — built to survive the monkey bars.' },

  { id:'wy-015', name:'Honeybloom Pinafore Dress', slug:'honeybloom-pinafore-dress', category:'baby', gender:'girls',
    ageGroups:['6-12M','1-2Y'], price:20.500, compareAtPrice:null,
    colors:['butter','blush'], sizes:['6-9M','9-12M','1-2Y'], oosSizes:[],
    images: productImages('Honeybloom Pinafore Dress', 'EAD9A0', 'E9C2B8'),
    badge:'new', rating:4.7, reviewsCount:16, isNew:true, bestSeller:false,
    description:'A corduroy pinafore layered over a soft cotton bodysuit — one-and-done dressing for busy mornings.' },

  { id:'wy-016', name:'Coastal Stripe Onesie', slug:'coastal-stripe-onesie', category:'baby', gender:'unisex',
    ageGroups:['3-6M','6-12M'], price:12.500, compareAtPrice:16.000,
    colors:['denim','white'], sizes:['3-6M','6-9M','9-12M'], oosSizes:[],
    images: productImages('Coastal Stripe Onesie', '6E85A0', 'FBFAF7'),
    badge:'sale', rating:4.7, reviewsCount:61, isNew:false, bestSeller:false,
    description:'A breton-stripe bodysuit in pima cotton jersey with easy shoulder snaps — a nursery staple that layers under anything.' },

  { id:'wy-017', name:'Wildflower Headband Duo', slug:'wildflower-headband-duo', category:'accessories', gender:'girls',
    ageGroups:['0-3M','3-6M','6-12M'], price:9.000, compareAtPrice:null,
    colors:['blush','sage'], sizes:['One Size'], oosSizes:[],
    images: productImages('Wildflower Headband Duo', 'E9C2B8', '93A484'),
    badge:null, rating:4.5, reviewsCount:12, isNew:false, bestSeller:false,
    description:'Two soft jersey headbands finished with hand-stitched floral appliqué — gentle elastic, no scratchy seams.' },

  { id:'wy-018', name:'Basecamp Beanie', slug:'basecamp-beanie', category:'accessories', gender:'unisex',
    ageGroups:['2-4Y','4-6Y','6-8Y'], price:10.000, compareAtPrice:null,
    colors:['charcoal','clay','denim'], sizes:['One Size'], oosSizes:[],
    images: productImages('Basecamp Beanie', '3B3835', 'C97B5A'),
    badge:'best', rating:4.8, reviewsCount:70, isNew:false, bestSeller:true,
    description:'A double-layer knit beanie with a folded cuff — warm enough for playground mornings, soft enough for naps in the stroller.' },

  { id:'wy-019', name:'Golden Hour Romper', slug:'golden-hour-romper', category:'baby', gender:'girls',
    ageGroups:['6-12M','1-2Y'], price:17.000, compareAtPrice:23.000,
    colors:['butter','clay'], sizes:['6-9M','9-12M','1-2Y'], oosSizes:[],
    images: productImages('Golden Hour Romper', 'EAD9A0', 'C97B5A'),
    badge:'sale', rating:4.9, reviewsCount:48, isNew:false, bestSeller:true,
    description:'A sun-washed cotton romper with a ruffled hem and snap closures — the one outfit you will reach for on repeat.' },

  { id:'wy-020', name:'Northbound Puffer Vest', slug:'northbound-puffer-vest', category:'boys', gender:'boys',
    ageGroups:['2-4Y','4-6Y','6-8Y','8-12Y'], price:25.000, compareAtPrice:null,
    colors:['denim','sand'], sizes:['2-4Y','4-6Y','6-8Y','8-12Y'], oosSizes:['8-12Y'],
    images: productImages('Northbound Puffer Vest', '6E85A0', 'E4D3B8'),
    badge:'new', rating:4.6, reviewsCount:9, isNew:true, bestSeller:false,
    description:'A lightly insulated recycled-fill vest that packs down small — an easy extra layer for cool mornings.' },

  { id:'wy-021', name:'Sweetgrass Knit Cardigan', slug:'sweetgrass-knit-cardigan', category:'girls', gender:'girls',
    ageGroups:['1-2Y','2-4Y','4-6Y'], price:22.000, compareAtPrice:null,
    colors:['sage','cream'], sizes:['1-2Y','2-4Y','4-6Y','6-8Y'], oosSizes:[],
    images: productImages('Sweetgrass Knit Cardigan', '93A484', 'F6F1E7'),
    badge:null, rating:4.8, reviewsCount:33, isNew:false, bestSeller:false,
    description:'An open-front knit cardigan with mother-of-pearl buttons — soft, breathable, and easy to layer over dresses or tees.' },

  { id:'wy-022', name:'Little Explorer Backpack', slug:'little-explorer-backpack', category:'accessories', gender:'unisex',
    ageGroups:['2-4Y','4-6Y','6-8Y'], price:16.500, compareAtPrice:null,
    colors:['clay','denim','sage'], sizes:['One Size'], oosSizes:[],
    images: productImages('Little Explorer Backpack', 'C97B5A', '6E85A0'),
    badge:'best', rating:4.9, reviewsCount:81, isNew:false, bestSeller:true,
    description:'A mini canvas backpack sized for little shoulders — padded straps, a wipeable lining, and just enough room for the essentials.' },

  { id:'wy-023', name:'Seashell Terry Romper', slug:'seashell-terry-romper', category:'newborn', gender:'unisex',
    ageGroups:['0-3M','3-6M'], price:14.000, compareAtPrice:18.000,
    colors:['sand','white'], sizes:['Newborn','0-3M','3-6M'], oosSizes:[],
    images: productImages('Seashell Terry Romper', 'E4D3B8', 'FBFAF7'),
    badge:'sale', rating:4.8, reviewsCount:26, isNew:false, bestSeller:false,
    description:'Waffle-terry cotton in a relaxed cut with an easy snap placket — dreamy-soft for the earliest days.' },

  { id:'wy-024', name:'Amberlight Corduroy Dress', slug:'amberlight-corduroy-dress', category:'girls', gender:'girls',
    ageGroups:['2-4Y','4-6Y','6-8Y'], price:26.500, compareAtPrice:null,
    colors:['clay','charcoal'], sizes:['2-4Y','4-6Y','6-8Y','8-12Y'], oosSizes:[],
    images: productImages('Amberlight Corduroy Dress', 'C97B5A', '3B3835'),
    badge:'new', rating:4.7, reviewsCount:14, isNew:true, bestSeller:false,
    description:'Fine-wale corduroy with a pinafore silhouette and covered buttons — a transitional-season favorite.' }
];

function getProductBySlug(slug){
  for (var i=0;i<PRODUCTS.length;i++){ if (PRODUCTS[i].slug===slug) return PRODUCTS[i]; }
  return null;
}
function getRelated(product, count){
  var pool = PRODUCTS.filter(function(p){ return p.id!==product.id && p.category===product.category; });
  if (pool.length < count){
    pool = pool.concat(PRODUCTS.filter(function(p){ return p.id!==product.id && p.category!==product.category; }));
  }
  return pool.slice(0, count);
}
