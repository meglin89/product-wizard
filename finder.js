/* Hemlock & Oak Product Finder — Wizard Engine */

const FLOWS = {
  notebooks: [
    {
      id: 'pattern',
      question: 'What page pattern do you prefer?',
      type: 'radio',
      options: [
        { value: 'dotted', label: 'Dotted', desc: 'Bullet journal friendly, versatile grid of dots' },
        { value: 'graph', label: 'Graph', desc: 'Grid pattern, great for sketching and structured notes' },
        { value: 'lined', label: 'Lined', desc: 'Ruled lines for traditional writing' },
        { value: 'blank', label: 'Blank', desc: 'Unlined pages for free-form creativity' },
      ],
    },
    {
      id: 'paperWeight',
      question: 'What paper weight matters to you?',
      type: 'radio',
      options: [
        { value: '150gsm', label: '150gsm Heritage', desc: 'Thick, bright white paper. Best for markers, watercolour, and mixed media.' },
        { value: '70gsm', label: '70gsm Archivist', desc: 'Thin, natural white, fountain-pen-friendly paper. Great for high page counts.' },
      ],
    },
    {
      id: 'coverType',
      question: 'What cover style do you prefer?',
      type: 'radio',
      options: [
        { value: 'hardcover', label: 'Hardcover', desc: 'Rigid book-cloth cover, durable and structured' },
        { value: 'cloth-flex', label: 'Cloth Flex', desc: 'Flexible cloth cover, coated for extra durability' },
        { value: 'paper-flex', label: 'Paper Flex', desc: 'Lightweight, flexible paper cover' },
      ],
    },
    {
      id: 'size',
      question: 'What size works best?',
      type: 'radio',
      showIf: (answers) => answers.paperWeight !== '70gsm',
      options: [
        { value: 'TN', label: 'TN (4.3" x 8.3")', desc: "Traveler's notebook size, slim and portable" },
        { value: 'A5', label: 'A5 (5.8" x 8.3")', desc: 'Most popular, fits in most bags' },
        { value: 'B5', label: 'B5 (6.9" x 9.8")', desc: 'Larger writing area, desk-friendly' },
      ],
    },
  ],
  'dated-planners': [
    {
      id: 'plannerStyle',
      question: 'What kind of planning experience are you looking for?',
      type: 'radio',
      options: [
        { value: 'guided', label: 'Guided Journaling', desc: 'Includes monthly reflections, personal values exercises, and journaling prompts alongside your planning pages' },
        { value: 'functional', label: 'Functional Planning', desc: 'Clean, focused layouts for scheduling and productivity — no journaling sections' },
      ],
    },
    {
      id: 'layout',
      question: 'What planning layout works for you?',
      type: 'radio',
      showIf: (answers) => answers.plannerStyle === 'guided',
      options: [
        { value: 'weekly', label: 'Weekly (Vertical)', desc: 'One week per spread, vertical columns' },
        { value: 'horizontal', label: 'Weekly (Horizontal)', desc: 'One week per spread, horizontal rows' },
        { value: 'weekly-and-daily', label: 'Weekly & Daily', desc: 'Weekly overview plus a full page for each day (70gsm Archivist)' },
      ],
    },
    {
      id: 'layout',
      question: 'What planning layout works for you?',
      type: 'radio',
      showIf: (answers) => answers.plannerStyle === 'functional',
      options: [
        { value: 'daily', label: 'Daily', desc: 'One day per page, maximum detail' },
        { value: 'daily-duo', label: 'Daily Duo', desc: 'Two-volume daily set, six months each' },
        { value: 'minimalist-vertical', label: 'Minimalist Vertical (A5)', desc: 'Clean, minimal weekly vertical layout' },
        { value: 'minimalist-horizontal', label: 'Minimalist Horizontal (A5)', desc: 'Clean, minimal weekly horizontal layout' },
        { value: 'minimalist', label: 'Minimalist (B5)', desc: 'Same minimalist layout in a larger format — 40% more writing area' },
      ],
    },
    {
      id: 'coverType',
      question: 'What cover style do you prefer?',
      type: 'radio',
      options: [
        { value: 'hardcover', label: 'Hardcover', desc: 'Rigid book-cloth cover, durable and structured' },
        { value: 'cloth-flex', label: 'Cloth Flex', desc: 'Flexible cloth cover, coated for extra durability' },
        { value: 'paper-flex', label: 'Paper Flex', desc: 'Lightweight, flexible paper cover' },
      ],
    },
  ],
  'undated-planners': [
    {
      id: 'layout',
      question: 'What layout do you prefer?',
      type: 'radio',
      desc: 'All of our undated planners include guided journaling sections.',
      options: [
        { value: 'weekly', label: 'Weekly (Vertical)', desc: 'Classic vertical weekly spread' },
        { value: 'horizontal', label: 'Weekly (Horizontal)', desc: 'Horizontal weekly layout' },
        { value: 'daily', label: 'Daily (6-Month)', desc: 'One day per page, six-month volume' },
        { value: 'weekly-and-daily', label: 'Weekly & Daily', desc: 'Weekly overview plus a full page for each day (70gsm Archivist)' },
      ],
    },
    {
      id: 'coverType',
      question: 'What cover style do you prefer?',
      type: 'radio',
      options: [
        { value: 'hardcover', label: 'Hardcover', desc: 'Rigid book-cloth cover, durable and structured' },
        { value: 'cloth-flex', label: 'Cloth Flex', desc: 'Flexible cloth cover, coated for extra durability' },
        { value: 'paper-flex', label: 'Paper Flex', desc: 'Lightweight, flexible paper cover' },
      ],
    },
  ],
  inserts: [
    {
      id: 'bindingFormat',
      question: 'What binding system do you use?',
      type: 'radio',
      options: [
        { value: 'Ringbound - A5', label: 'Ringbound (A5)', desc: 'Standard A5 ring-bound planner system' },
        { value: 'Discbound - Half Letter', label: 'Discbound (Half Letter)', desc: 'Half Letter size disc-bound system' },
        { value: 'Discbound - Classic', label: 'Discbound (Classic)', desc: 'Classic size disc-bound (Happy Planner Classic)' },
        { value: 'Discbound - A5', label: 'Discbound (A5)', desc: 'A5 size disc-bound system' },
      ],
    },
    {
      id: 'insertType',
      question: 'What type of insert are you looking for?',
      type: 'checkbox',
      options: [
        { value: 'weekly', label: 'Weekly Layout', desc: 'Vertical weekly spreads' },
        { value: 'horizontal', label: 'Horizontal Layout', desc: 'Horizontal weekly spreads' },
        { value: 'daily', label: 'Daily Layout', desc: 'One day per page' },
        { value: 'monthly-calendar', label: 'Monthly Calendar', desc: 'Monthly calendar pages' },
        { value: 'monthly-review', label: 'Monthly Review', desc: 'Monthly reflection pages' },
        { value: 'dotted', label: 'Dotted Paper', desc: 'Dot grid refill pages' },
        { value: 'graph', label: 'Graph Paper', desc: 'Grid refill pages' },
        { value: 'blank', label: 'Blank Paper', desc: 'Blank refill pages' },
        { value: 'goal-setting', label: 'Goal Setting', desc: 'Goal planning pages' },
        { value: 'habit', label: 'Habit Tracker', desc: 'Habit tracking pages' },
        { value: 'personal-values', label: 'Personal Values', desc: 'Values journaling pages' },
      ],
    },
  ],
  stickers: [
    {
      id: 'stickerType',
      question: 'What kind of stickers are you looking for?',
      type: 'radio',
      options: [
        { value: 'functional', label: 'Functional', desc: 'Highlights, bullets, tabs, and planning stickers' },
        { value: 'decorative', label: 'Decorative', desc: 'Illustrated and artistic sticker sheets' },
      ],
    },
  ],
  notepads: [],
  stickies: [],
  accessories: [],
  jewellery: [],
};

// Categories that skip the wizard and go straight to results
const DIRECT_CATEGORIES = ['notepads', 'stickies', 'accessories', 'jewellery'];
const HIDDEN_CATEGORIES = ['accessories', 'jewellery'];

// Label maps for display
const LABELS = {
  categories: {
    'notebooks': 'Notebooks',
    'dated-planners': 'Dated Planners',
    'undated-planners': 'Undated Planners',
    'inserts': 'Planner Inserts',
    'stickers': 'Stickers',
    'notepads': 'Notepads',
    'stickies': 'Sticky Notes',
    'accessories': 'Accessories',
    'jewellery': 'Jewellery',
  },
  pattern: { dotted: 'Dotted', graph: 'Graph', lined: 'Lined', blank: 'Blank' },
  paperWeight: { '150gsm': '150gsm Heritage', '70gsm': '70gsm Archivist', '120gsm': '120gsm Heritage' },
  coverType: { hardcover: 'Hardcover', 'cloth-flex': 'Cloth Flex', 'paper-flex': 'Paper Flex', 'firm-flex': 'Firm Flex' },
  size: { TN: 'TN', A5: 'A5', B5: 'B5' },
  layout: {
    weekly: 'Weekly', horizontal: 'Horizontal', daily: 'Daily',
    'daily-duo': 'Daily Duo', minimalist: 'B5 Minimalist',
    'minimalist-vertical': 'Minimalist Vertical',
    'minimalist-horizontal': 'Minimalist Horizontal',
    'weekly-and-daily': 'Weekly & Daily',
  },
  stickerType: { functional: 'Functional', decorative: 'Decorative' },
  insertType: {
    weekly: 'Weekly', horizontal: 'Horizontal', daily: 'Daily',
    'monthly-calendar': 'Monthly Calendar', 'monthly-review': 'Monthly Review',
    dotted: 'Dotted Paper', graph: 'Graph Paper', blank: 'Blank Paper',
    'goal-setting': 'Goal Setting', habit: 'Habit Tracker', 'personal-values': 'Personal Values',
  },
  bindingFormat: {
    'Ringbound - A5': 'Ringbound A5',
    'Discbound - Half Letter': 'Discbound Half Letter',
    'Discbound - Classic': 'Discbound Classic',
    'Discbound - A5': 'Discbound A5',
  },
};

// ─── State ───
const state = {
  currentStep: -1, // -1 = category selection
  category: null,
  answers: {},
  results: [],
  sortBy: 'name',
  showOOS: false,
};

// ─── Fun Facts ───
// Keyed by step ID (or category). A random fact is shown on each step render.
const FUN_FACTS = {
  paperWeight: [
    'All of our paper is acid-free and archival — your writing will last for years.',
    'Archivist was developed as a proprietary paper exclusive to Hemlock & Oak. We were on the floor when it was made!',
    'Heritage paper has a bright white finish, while Archivist has a warm, natural white tone.',
    'Our 70gsm Archivist paper is fountain-pen-friendly with minimal ghosting and no bleed-through.',
    'At 150gsm, Heritage paper is thick enough for watercolour, brush pens, and mixed media.',
  ],
  pattern: [
    'Dotted pages are the most versatile — perfect for bullet journaling, sketching, and handwriting.',
    'Our dot and graph grid uses a 5mm spacing - lined uses 6mm — ideal for both writing and drawing to scale.',
  ],
  coverType: [
    'Our hardcovers are wrapped in luxury book-cloth — the same material used in fine bookbinding.',
    'Cloth and Paper Flex covers are soft and flexible, making them easy to fold back for one-handed writing.',
    'Every cover is crafted with Lenzing Ecovero cloth — an eco-friendly textile made from sustainable wood pulp.',
  ],
  size: [
    'TN (Traveler\'s Notebook) size is easily portable — perfect for on-the-go notes.',
    'A5 is a highly popular size — large enough to write comfortably, small enough for any bag.',
    'Signature is our classic size - slightly larger than A5 for a roomier writing experience.',
    'B5 gives you 40% more writing area than A5 — ideal for desk use and detailed planning.',
  ],
  layout: [
    'Our Signature planners include monthly calendars, yearly overviews, and personal value journaling exercises.',
    'The Weekly & Daily layout gives you the best of both worlds — a weekly overview plus a full page for each day.',
    'Every planner is designed, printed and bound in Canada.',
  ],
};

let factInterval = null;
const currentFacts = {}; // tracks the current fact index per step ID

function getRandomFact(stepId) {
  const facts = FUN_FACTS[stepId];
  if (!facts || facts.length === 0) return null;
  // Return the stored fact for this step, or pick one and store it
  if (!(stepId in currentFacts)) {
    currentFacts[stepId] = Math.floor(Math.random() * facts.length);
  }
  return facts[currentFacts[stepId]];
}

function startFactRotation(stepId) {
  stopFactRotation();
  const facts = FUN_FACTS[stepId];
  if (!facts || facts.length <= 1) return;

  factInterval = setInterval(() => {
    const el = document.querySelector('.fun-fact-text');
    if (!el) { stopFactRotation(); return; }

    el.style.opacity = '0';
    setTimeout(() => {
      currentFacts[stepId] = ((currentFacts[stepId] || 0) + 1) % facts.length;
      el.textContent = facts[currentFacts[stepId]];
      el.style.opacity = '1';
    }, 300);
  }, 7000);
}

function stopFactRotation() {
  if (factInterval) {
    clearInterval(factInterval);
    factInterval = null;
  }
}

// ─── DOM References ───
const $container = () => document.getElementById('finder-app');

// ─── Rendering ───

function render() {
  stopFactRotation();
  if (state.currentStep === -1) {
    renderCategorySelection();
  } else {
    const flow = getActiveFlow();
    if (state.currentStep >= flow.length) {
      renderResults();
    } else {
      renderStep(flow[state.currentStep]);
    }
  }
  updateHash();
}

function getActiveFlow() {
  const flow = FLOWS[state.category] || [];
  return flow.filter(step => !step.showIf || step.showIf(state.answers));
}

// Representative product images for category icons (from Shopify CDN)
const CATEGORY_IMAGES = {
  notebooks: 'https://cdn.shopify.com/s/files/1/0280/1175/7703/files/Blossomfield_-_A5_Dotted_Notebook_Bullet_Journal_Bujo_Dot_Grid_-_Hemlock_Oak_-_Made_in_Canada_-_Best_Notebooks_Canada_-_Moleskine_Archer_and_Olive_Leuchtturm_Alternative.jpg?v=1744775025',
  'dated-planners': 'https://cdn.shopify.com/s/files/1/0280/1175/7703/files/2026_Vertical_Planner_-_Enchanted_Forest_-_Main_View_-_Hemlock_Oak_-_Best_Dated_Hourly_Planners_-_Made_in_Canada.jpg?v=1770282010',
  'undated-planners': 'https://cdn.shopify.com/s/files/1/0280/1175/7703/files/weekly-vertical-planner-made-in-canada-best-hemlock-oak.jpg?v=1754965364',
  inserts: 'https://cdn.shopify.com/s/files/1/0280/1175/7703/files/2026-weekly-inserts-hemlock-oak_e80712a3-321e-4672-a711-f39de3ec6b90.jpg?v=1758764725',
  stickers: 'https://cdn.shopify.com/s/files/1/0280/1175/7703/files/blossomfield_-_highlights.jpg?v=1769512977',
  notepads: 'https://cdn.shopify.com/s/files/1/0280/1175/7703/products/DailyNotepad-Hemlock_Oak-Notepads-PlannerAgendaAccesories-284226.jpg?v=1696402211',
  stickies: 'https://cdn.shopify.com/s/files/1/0280/1175/7703/products/WeeklyStickies-Hemlock_Oak-StickyNotes_7e36df19-7cbc-4508-96c7-536f52ea4498-273463.jpg?v=1696402239',
  accessories: 'https://cdn.shopify.com/s/files/1/0280/1175/7703/files/clipband-elastic-nimbus-hemlock_and_oak-journal_elastic_closure.jpg?v=1725927969',
  jewellery: 'https://cdn.shopify.com/s/files/1/0280/1175/7703/files/charm-bracelet.jpg?v=1748730965',
};

function isCategoryAllOOS(cat) {
  const products = CATALOG.filter(p => p.category === cat);
  return products.length > 0 && products.every(p => !p.inStock);
}

function renderCategorySelection() {
  const categories = [
    { key: 'notebooks', label: 'Notebook', desc: 'Dotted, graph, lined, or blank notebooks' },
    { key: 'dated-planners', label: 'Dated Planner', desc: '2026 planners with dated pages' },
    { key: 'undated-planners', label: 'Undated Planner', desc: 'Start-anytime planners' },
    { key: 'inserts', label: 'Planner Inserts', desc: 'Refill pages for ringbound and discbound planners' },
    { key: 'stickers', label: 'Stickers', desc: 'Functional and decorative planner stickers' },
    { key: 'notepads', label: 'Notepads', desc: 'Tear-off notepads for daily tasks and notes' },
    { key: 'stickies', label: 'Sticky Notes', desc: 'Repositionable sticky notes for planning' },
    { key: 'accessories', label: 'Accessories', desc: 'Elastics, washi tape, pen refills, and more' },
    { key: 'jewellery', label: 'Jewellery', desc: 'Bracelets, earrings, and charms' },
  ];

  const cardsHtml = categories.filter(cat => !HIDDEN_CATEGORIES.includes(cat.key)).map(cat => {
    const allOOS = isCategoryAllOOS(cat.key);
    const oosClass = allOOS ? ' all-oos' : '';
    const oosLabel = allOOS ? '<div class="desc" style="font-style:italic; margin-top:4px;">Currently sold out</div>' : '';
    return `
      <div class="category-card${oosClass}" onclick="selectCategory('${cat.key}')">
        <img class="icon" src="${CATEGORY_IMAGES[cat.key]}" alt="${cat.label}">
        <div class="label">${cat.label}</div>
        <div class="desc">${cat.desc}</div>
        ${oosLabel}
      </div>
    `;
  }).join('');

  const html = `
    <div class="finder-header">
      <h1>Find Planner Peace</h1>
      <p>Answer a few quick questions and we'll recommend the right products for you.</p>
    </div>
    <h3 class="step-question">What are you looking for?</h3>
    <div class="category-grid">${cardsHtml}</div>
  `;
  $container().innerHTML = html;
}

function renderStep(step) {
  const flow = getActiveFlow();
  const stepIdx = flow.indexOf(step);
  const totalSteps = flow.length;

  let optionsHtml;

  if (step.type === 'checkbox') {
    const selected = state.answers[step.id] || [];
    optionsHtml = step.options.map(opt => {
      const isChecked = Array.isArray(selected) && selected.includes(opt.value);
      const hasProducts = countProductsForOption(step.id, opt.value) > 0;
      const disabledClass = hasProducts ? '' : ' option-disabled';
      const clickHandler = hasProducts ? `onclick="toggleCheckbox('${step.id}', '${opt.value}')"` : '';
      return `
        <div class="option-card ${isChecked ? 'selected' : ''}${disabledClass}" ${clickHandler}>
          <div class="option-name">
            <span class="checkbox-icon">${isChecked ? '&#9745;' : '&#9744;'}</span>
            ${opt.label}${hasProducts ? '' : ' <span class="option-unavailable">unavailable</span>'}
          </div>
          <div class="option-desc">${opt.desc}</div>
        </div>
      `;
    }).join('');
  } else {
    optionsHtml = step.options.map(opt => {
      const selected = state.answers[step.id] === opt.value ? 'selected' : '';
      const tagHtml = opt.tag ? `<span class="option-tag">${opt.tag}</span>` : '';
      const hasProducts = countProductsForOption(step.id, opt.value) > 0;
      const disabledClass = hasProducts ? '' : ' option-disabled';
      const clickHandler = hasProducts ? `onclick="selectOption('${step.id}', '${opt.value}')"` : '';
      return `
        <div class="option-card ${selected}${disabledClass}" ${clickHandler}>
          <div class="option-name">${opt.label}${tagHtml}${hasProducts ? '' : ' <span class="option-unavailable">unavailable</span>'}</div>
          <div class="option-desc">${opt.desc}</div>
        </div>
      `;
    }).join('');
  }

  // "Skip" link — small, unobtrusive
  const skipHtml = `<div class="skip-wrapper"><button class="skip-btn" onclick="selectOption('${step.id}', 'all'); goNext();">Skip (show all)</button></div>`;

  const progressHtml = renderProgress(stepIdx, totalSteps);
  let canProceed;
  if (step.type === 'checkbox') {
    const sel = state.answers[step.id];
    canProceed = (Array.isArray(sel) && sel.length > 0) || sel === 'all';
  } else {
    canProceed = state.answers[step.id] != null;
  }
  const fact = getRandomFact(step.id);
  const factHtml = fact ? `<div class="fun-fact"><span class="fun-fact-label">Did you know?</span> <span class="fun-fact-text">${fact}</span></div>` : '';

  const html = `
    ${progressHtml}
    <h3 class="step-question">${step.question}</h3>
    ${step.desc ? `<p class="step-desc">${step.desc}</p>` : ''}
    ${factHtml}
    <div class="option-grid">${optionsHtml}</div>
    <div class="step-nav">
      <button class="btn btn-back" onclick="goBack()">Back</button>
      ${skipHtml}
      <button class="btn btn-next" ${canProceed ? '' : 'disabled'} onclick="goNext()">
        ${stepIdx === totalSteps - 1 ? 'Show Results' : 'Next'}
      </button>
    </div>
  `;
  $container().innerHTML = html;
  startFactRotation(step.id);
}

function renderProgress(currentIdx, total) {
  let dots = '';
  for (let i = 0; i < total; i++) {
    const cls = i < currentIdx ? 'completed' : i === currentIdx ? 'active' : '';
    dots += `<div class="progress-step">
      <div class="progress-dot ${cls}">${i + 1}</div>
      ${i < total - 1 ? `<div class="progress-line ${i < currentIdx ? 'completed' : ''}"></div>` : ''}
    </div>`;
  }
  return `<div class="progress-bar">${dots}</div>`;
}

function renderResults() {
  const filtered = filterProducts();
  state.results = filtered;

  // Build answer summary tags
  const summaryTags = [];
  summaryTags.push(`<span class="answer-tag">${LABELS.categories[state.category]}</span>`);
  for (const [key, value] of Object.entries(state.answers)) {
    if (value === 'all') continue;
    const labelMap = LABELS[key];
    if (Array.isArray(value)) {
      for (const v of value) {
        const display = labelMap ? (labelMap[v] || v) : v;
        summaryTags.push(`<span class="answer-tag">${display}</span>`);
      }
    } else {
      const display = labelMap ? (labelMap[value] || value) : value;
      summaryTags.push(`<span class="answer-tag">${display}</span>`);
    }
  }

  // Inserts: always hide OOS entirely. Others: hide by default with toggle.
  const isInserts = state.category === 'inserts';
  const oosCount = filtered.filter(p => !p.inStock).length;
  const visible = isInserts ? filtered.filter(p => p.inStock)
    : state.showOOS ? filtered : filtered.filter(p => p.inStock);
  const sorted = [...visible];
  const sortFn = state.sortBy === 'price-asc'
    ? (a, b) => a.priceMin - b.priceMin
    : state.sortBy === 'price-desc'
    ? (a, b) => b.priceMin - a.priceMin
    : (a, b) => a.title.localeCompare(b.title);
  sorted.sort((a, b) => {
    if (a.inStock !== b.inStock) return a.inStock ? -1 : 1;
    return sortFn(a, b);
  });

  let cardsHtml;
  if (sorted.length === 0) {
    cardsHtml = `
      <div class="empty-state">
        <p>No products match your selections. Try broadening your filters.</p>
        <button class="btn btn-back" onclick="goBack()">Go Back</button>
      </div>
    `;
  } else {
    cardsHtml = `<div class="product-grid">${sorted.map(renderProductCard).join('')}</div>`;
  }

  const html = `
    <div class="results-header">
      <h2>Your Matches</h2>
      <div class="result-count">${sorted.length} product${sorted.length !== 1 ? 's' : ''} found</div>
    </div>
    <div class="answers-summary">${summaryTags.join('')}</div>
    <div class="results-filters">
      <button class="filter-btn ${state.sortBy === 'name' ? 'active' : ''}" onclick="setSort('name')">A-Z</button>
      <button class="filter-btn ${state.sortBy === 'price-asc' ? 'active' : ''}" onclick="setSort('price-asc')">Price: Low-High</button>
      <button class="filter-btn ${state.sortBy === 'price-desc' ? 'active' : ''}" onclick="setSort('price-desc')">Price: High-Low</button>
      ${oosCount > 0 && !isInserts ? `<button class="filter-btn ${state.showOOS ? 'active' : ''}" onclick="toggleOOS()">Show Sold Out (${oosCount})</button>` : ''}
    </div>
    ${isInserts ? `<div class="info-note">We do not currently make our own insert covers. Join our <a href="https://www.facebook.com/groups/hemlockandoakcommunity" target="_blank" rel="noopener">Facebook Community Group</a> for recommendations.</div>` : ''}
    ${cardsHtml}
    <div style="text-align:center; margin-top: 32px;">
      <button class="btn btn-back" onclick="goBack()" style="margin-right:8px;">Edit Answers</button>
      <button class="btn btn-start-over" onclick="startOver()">Start Over</button>
    </div>
  `;
  $container().innerHTML = html;
}

function renderProductCard(product) {
  const imgSrc = product.image || '';
  const priceStr = product.priceMin === product.priceMax
    ? `$${product.priceMin.toFixed(0)}`
    : `$${product.priceMin.toFixed(0)} - $${product.priceMax.toFixed(0)}`;
  const colorCount = product.colors ? product.colors.length : 0;
  const colorText = colorCount > 0 ? `${colorCount} colour${colorCount > 1 ? 's' : ''}` : '';

  const pills = [];
  if (product.guidedJournaling) pills.push({text: 'Guided Journaling', cls: 'guided'});
  if (product.paperWeight) pills.push({text: LABELS.paperWeight[product.paperWeight] || product.paperWeight});
  if (product.coverType) pills.push({text: LABELS.coverType[product.coverType] || product.coverType});
  if (product.layout) pills.push({text: LABELS.layout[product.layout] || product.layout});
  if (product.sizes && product.sizes.length > 0) pills.push({text: product.sizes.join(', ')});
  if (product.category !== 'inserts') {
    if (product.insertType) pills.push({text: LABELS.insertType[product.insertType] || product.insertType});
    if (product.bindingFormats && product.bindingFormats.length > 0) {
      for (const f of product.bindingFormats) {
        pills.push({text: LABELS.bindingFormat[f] || f});
      }
    }
  }
  if (product.stickerType) pills.push({text: LABELS.stickerType[product.stickerType] || product.stickerType});

  const stockClass = product.inStock ? '' : 'out-of-stock';
  const cta = product.inStock
    ? `<a href="${product.url}" target="_blank" rel="noopener" class="card-link">View Product</a>`
    : `<div class="sold-out-badge">Sold Out</div>`;

  return `
    <div class="product-card ${stockClass}">
      ${imgSrc ? `<img class="card-image" src="${imgSrc}" alt="${product.title}" loading="lazy">` : '<div class="card-image"></div>'}
      <div class="card-body">
        <div class="card-title">${product.title}</div>
        <div class="card-meta">${pills.map(p => `<span class="card-pill ${p.cls || ''}">${p.text}</span>`).join('')}</div>
        <div class="card-price-line">
          <span class="card-price">${priceStr} CAD</span>
          ${colorText ? `<span class="card-colors">${colorText}</span>` : ''}
        </div>
        ${cta}
      </div>
    </div>
  `;
}

// ─── Filtering ───

function filterProducts() {
  return CATALOG.filter(p => {
    if (p.category !== state.category) return false;

    for (const [key, value] of Object.entries(state.answers)) {
      if (value === 'all') continue;

      if (key === 'size') {
        if (!p.sizes || !p.sizes.includes(value)) return false;
      } else if (key === 'bindingFormat') {
        if (!p.bindingFormats || !p.bindingFormats.includes(value)) return false;
      } else if (key === 'insertType') {
        if (Array.isArray(value)) {
          if (!value.includes(p.insertType)) return false;
        } else {
          if (p.insertType !== value) return false;
        }
      } else if (key === 'stickerType') {
        if (p.stickerType !== value) return false;
      } else if (key === 'pattern' || key === 'paperWeight' || key === 'coverType' || key === 'layout') {
        if (key === 'layout' && value === 'minimalist') {
          if (p[key] !== 'minimalist' && p[key] !== 'minimalist-vertical' && p[key] !== 'minimalist-horizontal') return false;
        } else {
          if (p[key] !== value) return false;
        }
      }
    }
    return true;
  });
}

// ─── Availability Check ───

function countProductsForOption(stepId, optionValue) {
  // Simulate: if we set answers[stepId] = optionValue, how many in-stock products match?
  const testAnswers = { ...state.answers, [stepId]: optionValue };
  return CATALOG.filter(p => {
    if (p.category !== state.category) return false;
    if (!p.inStock) return false;

    for (const [key, value] of Object.entries(testAnswers)) {
      if (value === 'all') continue;
      if (key === 'size') {
        if (!p.sizes || !p.sizes.includes(value)) return false;
      } else if (key === 'bindingFormat') {
        if (!p.bindingFormats || !p.bindingFormats.includes(value)) return false;
      } else if (key === 'insertType') {
        if (Array.isArray(value)) {
          if (!value.includes(p.insertType)) return false;
        } else {
          if (p.insertType !== value) return false;
        }
      } else if (key === 'stickerType') {
        if (p.stickerType !== value) return false;
      } else if (key === 'pattern' || key === 'paperWeight' || key === 'coverType' || key === 'layout') {
        if (key === 'layout' && value === 'minimalist') {
          if (p[key] !== 'minimalist' && p[key] !== 'minimalist-vertical' && p[key] !== 'minimalist-horizontal') return false;
        } else {
          if (p[key] !== value) return false;
        }
      }
    }
    return true;
  }).length;
}

// ─── Actions ───

function selectCategory(cat) {
  state.category = cat;
  state.answers = {};
  // Direct categories skip wizard, go straight to results
  if (DIRECT_CATEGORIES.includes(cat)) {
    const flow = getActiveFlow();
    state.currentStep = flow.length; // jumps to results
  } else {
    state.currentStep = 0;
  }
  render();
}

function selectOption(stepId, value) {
  state.answers[stepId] = value;
  render();
  // Auto-advance after a brief delay so user sees their selection
  if (value !== 'all') {
    setTimeout(() => goNext(), 300);
  }
}

function toggleCheckbox(stepId, value) {
  let current = state.answers[stepId];
  if (current === 'all') current = [];
  if (!Array.isArray(current)) current = [];

  const idx = current.indexOf(value);
  if (idx >= 0) {
    current.splice(idx, 1);
  } else {
    current.push(value);
  }
  state.answers[stepId] = current.length > 0 ? current : [];
  render();
}

function goNext() {
  const flow = getActiveFlow();
  if (state.currentStep < flow.length) {
    state.currentStep++;
    render();
  }
}

function goBack() {
  if (state.currentStep > 0) {
    state.currentStep--;
    render();
  } else {
    state.category = null;
    state.answers = {};
    state.currentStep = -1;
    render();
  }
}

function startOver() {
  state.category = null;
  state.answers = {};
  state.currentStep = -1;
  state.sortBy = 'name';
  state.showOOS = false;
  render();
}

function setSort(sort) {
  state.sortBy = sort;
  renderResults();
}

function toggleOOS() {
  state.showOOS = !state.showOOS;
  renderResults();
}

// ─── URL Hash State ───

function updateHash() {
  if (state.currentStep === -1) {
    history.replaceState(null, '', location.pathname);
    return;
  }
  const parts = [state.category];
  for (const [key, value] of Object.entries(state.answers)) {
    if (Array.isArray(value)) {
      parts.push(`${key}=${value.join(',')}`);
    } else {
      parts.push(`${key}=${value}`);
    }
  }
  history.replaceState(null, '', '#' + parts.join('/'));
}

function loadFromHash() {
  const hash = location.hash.slice(1);
  if (!hash) return false;
  const parts = hash.split('/');
  const category = parts[0];
  if (!(category in FLOWS)) return false;

  state.category = category;
  state.answers = {};
  for (let i = 1; i < parts.length; i++) {
    const eqIdx = parts[i].indexOf('=');
    if (eqIdx < 0) continue;
    const key = parts[i].slice(0, eqIdx);
    const val = parts[i].slice(eqIdx + 1);
    if (!key || !val) continue;
    const flow = FLOWS[category] || [];
    const stepDef = flow.find(s => s.id === key);
    if (stepDef && stepDef.type === 'checkbox' && val !== 'all') {
      state.answers[key] = val.split(',');
    } else {
      state.answers[key] = val;
    }
  }

  const flow = FLOWS[category].filter(s => !s.showIf || s.showIf(state.answers));
  state.currentStep = flow.length; // go to results
  return true;
}

// ─── Product Normalization (mirrors build_catalog.py) ───

function normalizeCatalog(rawProducts) {
  return rawProducts.map(normalizeProduct).filter(Boolean);
}

function normalizeProduct(p) {
  if (p.status && p.status !== 'active') return null;

  const title = p.title || '';
  const tLower = title.toLowerCase();
  const tags = parseTags(p.tags);
  const variants = p.variants || [];

  // Skip downloads, imperfect, hidden, bundles
  if (tags.has('downloads') || (p.product_type || '').toLowerCase().includes('download') || tLower.includes('printable')) return null;
  if (tLower.includes('imperfect') || tags.has('imperfect')) return null;
  if (tags.has('__hidden') || tags.has('hidden') || tLower.includes('(hidden)')) return null;
  if (tLower.includes('bundle')) return null;

  const category = classifyProduct(p, tags);
  if (!category) return null;

  const prices = variants.map(v => parseFloat(v.price)).filter(n => !isNaN(n));
  // AJAX API provides v.available (already accounts for "continue selling when OOS").
  // Admin API / static data uses inventory_quantity + inventory_policy.
  const inStock = variants.some(v =>
    v.available === true || (v.inventory_quantity > 0) || (v.inventory_policy === 'continue')
  );

  const entry = {
    id: p.id,
    title: title,
    handle: p.handle,
    url: 'https://hemlockandoak.com/products/' + p.handle,
    category: category,
    image: (p.images && p.images.length > 0)
      ? (typeof p.images[0] === 'string' ? p.images[0] : p.images[0].src)
      : (p.featured_image ? (typeof p.featured_image === 'string' ? p.featured_image : p.featured_image.src) : null),
    priceMin: prices.length ? Math.min(...prices) : 0,
    priceMax: prices.length ? Math.max(...prices) : 0,
    inStock: inStock,
    colors: extractColors(p),
  };

  if (category === 'notebooks') {
    entry.pattern = extractPattern(p, tags);
    entry.paperWeight = extractGSM(title, tags);
    entry.coverType = extractCoverType(title, tags);
    entry.sizes = extractSizes(p);
    // Fallback for older notebooks
    if (!entry.coverType && /luminé|lumin|lunar|floriculture|monarque/i.test(title)) entry.coverType = 'hardcover';
    if (!entry.paperWeight && /luminé|lumin|lunar|floriculture|monarque/i.test(title)) entry.paperWeight = '150gsm';
    if (!entry.paperWeight && title === 'Blank Notebook') { entry.paperWeight = '150gsm'; entry.coverType = 'hardcover'; }
    if (/year of the horse/i.test(title) && !entry.coverType) entry.coverType = 'hardcover';

  } else if (category === 'dated-planners' || category === 'undated-planners') {
    entry.layout = extractLayout(title);
    entry.coverType = extractCoverType(title, tags);
    entry.paperWeight = extractGSM(title, tags);
    entry.sizes = extractSizeFromTitle(title);
    if (!entry.paperWeight) entry.paperWeight = (entry.layout === 'weekly-and-daily') ? '70gsm' : '120gsm';
    if (category === 'undated-planners') {
      entry.guidedJournaling = true;
    } else {
      entry.guidedJournaling = ['weekly', 'horizontal', 'weekly-and-daily'].includes(entry.layout);
    }

  } else if (category === 'inserts') {
    entry.insertType = extractInsertType(title);
    entry.bindingFormats = extractBindingFormats(p);

  } else if (category === 'stickers') {
    entry.stickerType = (tags.has('decorative') || tags.has('illustrative')) ? 'decorative' : 'functional';
  }

  return entry;
}

function parseTags(tagsField) {
  if (Array.isArray(tagsField)) return new Set(tagsField.map(t => t.trim().toLowerCase()));
  if (typeof tagsField === 'string') return new Set(tagsField.split(',').map(t => t.trim().toLowerCase()));
  return new Set();
}

function classifyProduct(p, tags) {
  const pt = (p.product_type || '').trim();
  const tLower = (p.title || '').toLowerCase();
  if (tLower.includes('bundle')) return null;
  if (pt === 'Dated Planners' || pt === 'Dated Panners') return 'dated-planners';
  if (pt === 'Undated Planners') return 'undated-planners';
  if (pt === 'Notebooks' || pt === 'Notebook') {
    if (tLower.includes('undated') && tLower.includes('planner')) return 'undated-planners';
    return 'notebooks';
  }
  if (pt === 'Planner Inserts') return 'inserts';
  if (pt === 'Stickers') return 'stickers';
  if (pt === '' && (tLower.includes('sticker') || tags.has('stickers'))) return 'stickers';
  if (pt === 'Notepads' || pt === 'Notepads and Stickies') {
    if (tLower.includes('stickies') || tLower.includes('sticky')) return 'stickies';
    return 'notepads';
  }
  if (pt === 'Accessories' || pt === 'Pen Refills') return 'accessories';
  if (pt === 'Jewellery') return 'jewellery';
  return null;
}

function extractCoverType(title, tags) {
  const t = title.toLowerCase();
  if (t.includes('hardcover')) return 'hardcover';
  if (t.includes('cloth flex')) return 'cloth-flex';
  if (t.includes('paper flex')) return 'paper-flex';
  if (t.includes('firm flex')) return 'firm-flex';
  if (tags.has('hardcover')) return 'hardcover';
  if (tags.has('cloth flex')) return 'cloth-flex';
  if (tags.has('paper flex')) return 'paper-flex';
  return null;
}

function extractGSM(title, tags) {
  const m = title.match(/(\d+)\s*gsm/i);
  if (m) return m[1] + 'gsm';
  for (const tag of tags) {
    const tm = tag.match(/^(\d+)\s*gsm$/i);
    if (tm) return tm[1] + 'gsm';
  }
  return null;
}

function extractPattern(product, tags) {
  const t = (product.title || '').toLowerCase();
  if (t.includes('dotted')) return 'dotted';
  if (t.includes('graph')) return 'graph';
  if (t.includes('lined')) return 'lined';
  if (t.includes('blank')) return 'blank';
  for (const tag of tags) {
    if (['dotted', 'graph', 'lined', 'blank'].includes(tag)) return tag;
  }
  for (const opt of (product.options || [])) {
    if (opt.name && opt.name.toLowerCase() === 'paper' && opt.values && opt.values.length) {
      return opt.values[0].toLowerCase();
    }
  }
  return null;
}

function extractLayout(title) {
  const t = title.toLowerCase();
  if (t.includes('weekly & daily') || t.includes('w&d')) return 'weekly-and-daily';
  if (t.includes('daily duo')) return 'daily-duo';
  if (t.includes('daily')) return 'daily';
  if (t.includes('minimalist')) {
    if (t.includes('horizontal')) return 'minimalist-horizontal';
    if (t.includes('vertical')) return 'minimalist-vertical';
    return 'minimalist';
  }
  if (t.includes('horizontal')) return 'horizontal';
  if (t.includes('weekly')) return 'weekly';
  return null;
}

function extractSizes(product) {
  const sizeMap = { a5: 'A5', b5: 'B5', tn: 'TN', a6: 'A6' };
  const sizes = new Set();
  for (const v of (product.variants || [])) {
    for (const key of ['option1', 'option2', 'option3']) {
      const val = v[key];
      if (!val) continue;
      const vl = val.toLowerCase().trim();
      if (sizeMap[vl]) { sizes.add(sizeMap[vl]); continue; }
      for (const [k, label] of Object.entries(sizeMap)) {
        if (vl.startsWith(k)) { sizes.add(label); break; }
      }
    }
  }
  const title = product.title || '';
  if (title.includes('B5')) sizes.add('B5');
  if (title.includes('A5')) sizes.add('A5');
  if (title.includes('TN')) sizes.add('TN');
  return sizes.size > 0 ? [...sizes].sort() : ['A5'];
}

function extractSizeFromTitle(title) {
  if (title.includes('B5')) return ['B5'];
  if (title.includes('A5')) return ['A5'];
  return ['A5'];
}

function extractColors(product) {
  const colors = new Set();
  let colorIdx = null;
  for (const opt of (product.options || [])) {
    if (opt.name && ['color', 'colour', 'oak'].includes(opt.name.toLowerCase())) {
      colorIdx = opt.position;
      break;
    }
  }
  if (!colorIdx) return [];
  const key = 'option' + colorIdx;
  for (const v of (product.variants || [])) {
    const val = v[key];
    if (val && !['default title', 'default', 'none'].includes(val.toLowerCase())) colors.add(val);
  }
  return [...colors].sort();
}

function normalizeBindingFormat(val) {
  const v = val.trim();
  const vl = v.toLowerCase();
  if (vl.includes('discbound') && (vl.includes('hp classic') || vl.includes('classic hp') || vl === 'discbound - classic')) return 'Discbound - Classic';
  if (vl.includes('discbound') && vl.includes('half letter')) return 'Discbound - Half Letter';
  if (vl.includes('discbound') && vl.includes('a5')) return 'Discbound - A5';
  if (vl.includes('ringbound') && vl.includes('a5')) return 'Ringbound - A5';
  if (vl.includes('ringbound') || vl.includes('discbound')) return v;
  return null;
}

function extractBindingFormats(product) {
  const formats = new Set();
  for (const opt of (product.options || [])) {
    if (opt.name && opt.name.toLowerCase() === 'size') {
      for (const val of (opt.values || [])) {
        const n = normalizeBindingFormat(val);
        if (n) formats.add(n);
      }
      const key = 'option' + opt.position;
      for (const v of (product.variants || [])) {
        if (v[key]) {
          const n = normalizeBindingFormat(v[key]);
          if (n) formats.add(n);
        }
      }
      break;
    }
  }
  return [...formats].sort();
}

function extractInsertType(title) {
  let t = title.toLowerCase().replace(/^\d{4}\s+/, '').replace(/^undated\s+/, '');
  if (t.includes('monthly calendar') || t.includes('yearly and monthly') || t.includes('yearly & monthly')) return 'monthly-calendar';
  if (t.includes('monthly review')) return 'monthly-review';
  if (t.includes('weekly & daily') || t.includes('weekly and daily')) return 'weekly-and-daily';
  if (t.includes('horizontal')) return 'horizontal';
  if (t.includes('daily')) return 'daily';
  if (t.includes('weekly')) return 'weekly';
  if (t.includes('dotted')) return 'dotted';
  if (t.includes('graph')) return 'graph';
  if (t.includes('lined')) return 'lined';
  if (t.includes('blank')) return 'blank';
  if (t.includes('goal')) return 'goal-setting';
  if (t.includes('habit')) return 'habit';
  if (t.includes('personal values') || t.includes('values')) return 'personal-values';
  return null;
}

// ─── Shopify AJAX Product Fetch ───

async function fetchShopifyProducts() {
  const allProducts = [];
  let page = 1;
  while (true) {
    const res = await fetch(`/products.json?limit=250&page=${page}`);
    if (!res.ok) break;
    const data = await res.json();
    if (!data.products || data.products.length === 0) break;
    allProducts.push(...data.products);
    if (data.products.length < 250) break; // last page
    page++;
  }
  return allProducts;
}

function isOnShopify() {
  // Detect if we're running on a Shopify store (not local file://)
  return location.hostname.includes('.myshopify.com') || location.hostname.includes('hemlockandoak.com');
}

// ─── Init ───

document.addEventListener('DOMContentLoaded', async () => {
  if (isOnShopify() && typeof CATALOG === 'undefined') {
    // Live on Shopify — fetch products via AJAX API
    try {
      const raw = await fetchShopifyProducts();
      window.CATALOG = normalizeCatalog(raw);
    } catch (e) {
      console.error('Failed to fetch products:', e);
      // Fall through — CATALOG may be set by products.js
    }
  }

  if (typeof CATALOG === 'undefined') {
    console.error('No product data available. Include products.js for local development.');
    return;
  }

  if (!loadFromHash()) {
    render();
  } else {
    render();
  }
});
