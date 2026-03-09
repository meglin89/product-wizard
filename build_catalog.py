"""
Build a normalized product catalog (products.js) from shopify_products_full.json.
All categories: Notebooks, Dated Planners, Undated Planners, Planner Inserts,
Stickers, Notepads, Accessories, and Jewellery.

Usage:
    python build_catalog.py

Reads:  ../shopify_products_full.json
Writes: products.js
"""

import json
import re
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
INPUT_FILE = os.path.join(SCRIPT_DIR, '..', 'shopify_products_full.json')
OUTPUT_FILE = os.path.join(SCRIPT_DIR, 'products.js')


def parse_tags(tags_field):
    """Normalize tags to a lowercase set."""
    if isinstance(tags_field, list):
        return {t.strip().lower() for t in tags_field}
    if isinstance(tags_field, str):
        return {t.strip().lower() for t in tags_field.split(',')}
    return set()


def extract_cover_type(title, tags):
    """Extract cover type from product title, then tags."""
    t = title.lower()
    if 'hardcover' in t:
        return 'hardcover'
    if 'cloth flex' in t:
        return 'cloth-flex'
    if 'paper flex' in t:
        return 'paper-flex'
    if 'firm flex' in t:
        return 'firm-flex'
    # Fallback to tags
    if 'hardcover' in tags:
        return 'hardcover'
    if 'cloth flex' in tags:
        return 'cloth-flex'
    if 'paper flex' in tags:
        return 'paper-flex'
    return None


def extract_gsm(title, tags):
    """Extract paper weight from title or tags."""
    # Check title first (more specific)
    m = re.search(r'(\d+)\s*gsm', title, re.IGNORECASE)
    if m:
        return f"{m.group(1)}gsm"
    # Check tags
    for tag in tags:
        m = re.search(r'^(\d+)\s*gsm$', tag, re.IGNORECASE)
        if m:
            return f"{m.group(1)}gsm"
    return None


def extract_pattern(product, tags):
    """Extract page pattern for notebooks from title, tags, or variant options."""
    title = product['title']
    t = title.lower()
    if 'dotted' in t:
        return 'dotted'
    if 'graph' in t:
        return 'graph'
    if 'lined' in t:
        return 'lined'
    if 'blank' in t:
        return 'blank'
    # Check tags
    for tag in tags:
        if tag in ('dotted', 'graph', 'lined', 'blank'):
            return tag
    # Check if the "Paper" option has a pattern value
    for opt in product.get('options', []):
        if opt['name'].lower() == 'paper':
            vals = opt.get('values', [])
            if vals:
                return vals[0].lower()  # Use first value as primary
    return None


def extract_layout(title, tags):
    """Extract planner layout from title."""
    t = title.lower()
    if 'weekly & daily' in t or 'w&d' in t:
        return 'weekly-and-daily'
    if 'daily duo' in t:
        return 'daily-duo'
    if 'daily' in t:
        return 'daily'
    # Check minimalist BEFORE horizontal — "Minimalist Horizontal" should be minimalist
    if 'minimalist' in t:
        # Check if horizontal or vertical is specified
        if 'horizontal' in t:
            return 'minimalist-horizontal'
        if 'vertical' in t:
            return 'minimalist-vertical'
        # Generic minimalist (older products or B5)
        return 'minimalist'
    if 'horizontal' in t:
        return 'horizontal'
    if 'weekly' in t:
        return 'weekly'
    return None


def extract_sizes(product):
    """Extract available sizes from variant options."""
    sizes = set()
    size_map = {
        'a5': 'A5',
        'b5': 'B5',
        'tn': 'TN',
        'a6': 'A6',
    }
    for variant in product.get('variants', []):
        for opt_key in ('option1', 'option2', 'option3'):
            val = variant.get(opt_key)
            if not val:
                continue
            val_lower = val.lower().strip()
            # Direct match
            if val_lower in size_map:
                sizes.add(size_map[val_lower])
            # Partial match like 'A5 (5.8" x 8.3")'
            else:
                for key, label in size_map.items():
                    if val_lower.startswith(key):
                        sizes.add(label)
                        break

    # Also check the title for size hints
    title = product['title']
    if '(B5' in title or 'B5 ' in title:
        sizes.add('B5')
    if '(A5' in title or 'A5 ' in title:
        sizes.add('A5')
    if '(TN' in title or 'TN ' in title:
        sizes.add('TN')

    return sorted(sizes) if sizes else ['A5']  # Default to A5 if unspecified


def extract_colors(product):
    """Extract available colors from variant options."""
    colors = set()
    # Find which option is "Color"
    color_option_idx = None
    for opt in product.get('options', []):
        if opt['name'].lower() in ('color', 'colour', 'oak'):
            color_option_idx = opt['position']  # 1-indexed
            break

    if color_option_idx is None:
        return []

    opt_key = f'option{color_option_idx}'
    for variant in product.get('variants', []):
        val = variant.get(opt_key)
        if val and val.lower() not in ('default title', 'default', 'none'):
            colors.add(val)

    return sorted(colors)


def extract_size_from_title(title):
    """For planners where size is in the title, not variants."""
    if 'B5' in title:
        return ['B5']
    if 'A5' in title:
        return ['A5']
    return ['A5']  # Default


def extract_sticker_type(product, tags):
    """Determine if a sticker is functional or decorative.

    Decorative stickers have 'decorative' or 'illustrative' in tags.
    Everything else defaults to functional.
    """
    if 'decorative' in tags or 'illustrative' in tags:
        return 'decorative'
    return 'functional'


def normalize_binding_format(val):
    """Normalize binding format names to canonical values."""
    v = val.strip()
    vl = v.lower()
    # Normalize "HP Classic" and "Classic HP" variants to "Discbound - Classic"
    if 'discbound' in vl and ('hp classic' in vl or 'classic hp' in vl or vl == 'discbound - classic'):
        return 'Discbound - Classic'
    if 'discbound' in vl and 'half letter' in vl:
        return 'Discbound - Half Letter'
    if 'discbound' in vl and 'a5' in vl:
        return 'Discbound - A5'
    if 'ringbound' in vl and 'a5' in vl:
        return 'Ringbound - A5'
    # Fallback: return as-is if it looks like a binding format
    if 'ringbound' in vl or 'discbound' in vl:
        return v
    return None


def extract_binding_formats(product):
    """Extract binding formats from insert variant Size option values.

    Returns a list like ['Ringbound - A5', 'Discbound - Half Letter', ...].
    """
    formats = set()
    # Find the "Size" option
    size_option_idx = None
    for opt in product.get('options', []):
        if opt['name'].lower() == 'size':
            size_option_idx = opt['position']
            # Also grab values directly from options block
            for val in opt.get('values', []):
                normalized = normalize_binding_format(val)
                if normalized:
                    formats.add(normalized)
            break

    if size_option_idx is not None:
        opt_key = f'option{size_option_idx}'
        for variant in product.get('variants', []):
            val = variant.get(opt_key)
            if val:
                normalized = normalize_binding_format(val)
                if normalized:
                    formats.add(normalized)

    return sorted(formats)


def extract_insert_type(title):
    """Extract the insert type from the product title.

    Returns a normalized string like 'weekly', 'daily', 'horizontal',
    'monthly-calendar', 'monthly-review', 'dotted', 'graph', 'lined',
    'blank', 'goal-setting', 'habit', 'personal-values'.
    """
    t = title.lower()

    # Remove year prefixes like "2026 " and "Undated " for cleaner matching
    t = re.sub(r'^\d{4}\s+', '', t)
    t = re.sub(r'^undated\s+', '', t)

    if 'monthly calendar' in t or 'monthly calendar' in t:
        return 'monthly-calendar'
    if 'monthly review' in t:
        return 'monthly-review'
    if 'yearly and monthly' in t or 'yearly & monthly' in t:
        return 'monthly-calendar'
    if 'weekly & daily' in t or 'weekly and daily' in t:
        return 'weekly-and-daily'
    if 'horizontal' in t:
        return 'horizontal'
    if 'daily' in t:
        return 'daily'
    if 'weekly' in t:
        return 'weekly'
    if 'dotted' in t:
        return 'dotted'
    if 'graph' in t:
        return 'graph'
    if 'lined' in t:
        return 'lined'
    if 'blank' in t:
        return 'blank'
    if 'goal' in t:
        return 'goal-setting'
    if 'habit' in t:
        return 'habit'
    if 'personal values' in t or 'values' in t:
        return 'personal-values'

    return None


def classify_product(product, tags):
    """Determine the normalized category for a product."""
    pt = product['product_type'].strip()
    title = product['title']
    t_lower = title.lower()

    # Skip bundles everywhere
    if 'bundle' in t_lower:
        return None

    # Dated planners (including typo)
    if pt in ('Dated Planners', 'Dated Panners'):
        return 'dated-planners'

    # Undated planners
    if pt == 'Undated Planners':
        return 'undated-planners'

    # Notebooks — but check if it's actually an undated planner or a bundle
    if pt in ('Notebooks', 'Notebook'):
        if 'undated' in t_lower and 'planner' in t_lower:
            return 'undated-planners'
        return 'notebooks'

    # Planner Inserts
    if pt == 'Planner Inserts':
        return 'inserts'

    # Stickers — product_type "Stickers" OR empty type with sticker in title/tags
    if pt == 'Stickers':
        return 'stickers'
    if pt == '' and ('sticker' in t_lower or 'stickers' in tags):
        return 'stickers'

    # Notepads and Stickies — split into two categories
    if pt in ('Notepads', 'Notepads and Stickies'):
        if 'stickies' in t_lower or 'sticky' in t_lower:
            return 'stickies'
        return 'notepads'

    # Accessories and Pen Refills
    if pt in ('Accessories', 'Pen Refills'):
        # Skip charms (they are add-ons, not standalone accessories)
        # Actually, keep charms — they are purchasable products
        return 'accessories'

    # Jewellery
    if pt == 'Jewellery':
        return 'jewellery'

    return None


def is_imperfect(title, tags):
    """Check if product is an imperfect/clearance item."""
    return 'imperfect' in title.lower() or 'imperfect' in tags


def is_hidden(tags):
    """Check if product has hidden tags (internal/CS-only items)."""
    return '__hidden' in tags or 'hidden' in tags


def build_catalog():
    with open(INPUT_FILE, 'r', encoding='utf-8') as f:
        products = json.load(f)

    catalog = []
    skipped = {'inactive': 0, 'imperfect': 0, 'other_category': 0, 'download': 0, 'bundle': 0, 'hidden': 0}

    for p in products:
        # Only active products
        if p['status'] != 'active':
            skipped['inactive'] += 1
            continue

        tags = parse_tags(p['tags'])
        title = p['title']

        # Skip downloads
        if 'downloads' in tags or 'download' in p['product_type'].lower() or 'printable' in title.lower():
            skipped['download'] += 1
            continue

        # Skip imperfect
        if is_imperfect(title, tags):
            skipped['imperfect'] += 1
            continue

        # Skip hidden/internal products
        if is_hidden(tags):
            skipped['hidden'] += 1
            continue

        # Skip products with "(hidden)" in title (CS-only buffer stock)
        if '(hidden)' in title.lower():
            skipped['hidden'] += 1
            continue

        # Classify
        category = classify_product(p, tags)
        if category is None:
            pt = p['product_type'].strip()
            if 'bundle' in title.lower():
                skipped['bundle'] += 1
            else:
                skipped['other_category'] += 1
            continue

        # Build the catalog entry
        image_src = None
        if p.get('images') and len(p['images']) > 0:
            image_src = p['images'][0].get('src', '')

        # Price range from variants
        prices = [float(v['price']) for v in p.get('variants', []) if v.get('price')]
        price_min = min(prices) if prices else 0
        price_max = max(prices) if prices else 0

        # In-stock check: available if quantity > 0 OR if "continue selling when OOS" is enabled
        in_stock = any(
            v.get('inventory_quantity', 0) > 0 or v.get('inventory_policy') == 'continue'
            for v in p.get('variants', [])
        )

        # Extract attributes
        entry = {
            'id': p['id'],
            'title': title,
            'handle': p['handle'],
            'url': f"https://hemlockandoak.com/products/{p['handle']}",
            'category': category,
            'image': image_src,
            'priceMin': price_min,
            'priceMax': price_max,
            'inStock': in_stock,
            'colors': extract_colors(p),
        }

        if category == 'notebooks':
            entry['pattern'] = extract_pattern(p, tags)
            entry['paperWeight'] = extract_gsm(title, tags)
            entry['coverType'] = extract_cover_type(title, tags)
            entry['sizes'] = extract_sizes(p)

            # Fallback: older-gen notebooks (Luminé, Lunar, Floriculture, Monarque)
            # that have 150gsm hardcovers but don't say so in the title
            if not entry['coverType']:
                # These are all hardcover collections
                if any(name in title for name in ('Luminé', 'Lumin', 'Lunar', 'Floriculture', 'Monarque')):
                    entry['coverType'] = 'hardcover'
            if not entry['paperWeight']:
                if any(name in title for name in ('Luminé', 'Lumin', 'Lunar', 'Floriculture', 'Monarque')):
                    entry['paperWeight'] = '150gsm'
                # Blank Notebook is a 150gsm hardcover
                elif title == 'Blank Notebook':
                    entry['paperWeight'] = '150gsm'
                    entry['coverType'] = 'hardcover'
            # Year of the Horse notebooks are 150gsm hardcover (from tags)
            if 'year of the horse' in title.lower() and not entry['coverType']:
                entry['coverType'] = 'hardcover'

        elif category in ('dated-planners', 'undated-planners'):
            entry['layout'] = extract_layout(title, tags)
            entry['coverType'] = extract_cover_type(title, tags)
            entry['paperWeight'] = extract_gsm(title, tags)
            entry['sizes'] = extract_size_from_title(title)

            # Dated planner paper weight defaults:
            # W&D = 70gsm, everything else = 120gsm
            if not entry['paperWeight']:
                if entry['layout'] == 'weekly-and-daily':
                    entry['paperWeight'] = '70gsm'
                else:
                    entry['paperWeight'] = '120gsm'

            # Guided journaling: Signature Weekly + Horizontal dated planners
            # have reflection pages and personal value journaling exercises.
            # ALL undated planners also have guided journaling.
            # Minimalist, Daily, Daily Duo, and W&D dated planners do NOT.
            if category == 'undated-planners':
                entry['guidedJournaling'] = True
            else:
                entry['guidedJournaling'] = entry['layout'] in ('weekly', 'horizontal', 'weekly-and-daily')

        elif category == 'inserts':
            entry['insertType'] = extract_insert_type(title)
            entry['bindingFormats'] = extract_binding_formats(p)

        elif category == 'stickers':
            entry['stickerType'] = extract_sticker_type(p, tags)

        # Notepads, accessories, and jewellery don't need extra fields

        catalog.append(entry)

    # Summary
    from collections import Counter
    cats = Counter(e['category'] for e in catalog)
    print(f"Catalog built: {len(catalog)} products")
    for cat, count in cats.most_common():
        print(f"  {cat}: {count}")
    print(f"\nSkipped:")
    for reason, count in skipped.items():
        print(f"  {reason}: {count}")

    # Detailed per-category info
    for cat_name in ('notebooks', 'dated-planners', 'undated-planners'):
        cat_items = [e for e in catalog if e['category'] == cat_name]
        if cat_name == 'notebooks':
            patterns = Counter(e.get('pattern') for e in cat_items)
            weights = Counter(e.get('paperWeight') for e in cat_items)
            covers = Counter(e.get('coverType') for e in cat_items)
            all_sizes = set()
            for e in cat_items:
                all_sizes.update(e.get('sizes', []))
            print(f"\n{cat_name}:")
            print(f"  patterns: {dict(patterns)}")
            print(f"  weights: {dict(weights)}")
            print(f"  covers: {dict(covers)}")
            print(f"  sizes: {sorted(all_sizes)}")
        else:
            layouts = Counter(e.get('layout') for e in cat_items)
            covers = Counter(e.get('coverType') for e in cat_items)
            weights = Counter(e.get('paperWeight') for e in cat_items)
            print(f"\n{cat_name}:")
            print(f"  layouts: {dict(layouts)}")
            print(f"  covers: {dict(covers)}")
            print(f"  weights: {dict(weights)}")

    # New category details
    for cat_name in ('inserts', 'stickers', 'notepads', 'accessories', 'jewellery'):
        cat_items = [e for e in catalog if e['category'] == cat_name]
        if not cat_items:
            continue
        print(f"\n{cat_name}: {len(cat_items)} products")
        if cat_name == 'inserts':
            types = Counter(e.get('insertType') for e in cat_items)
            print(f"  insert types: {dict(types)}")
            all_formats = set()
            for e in cat_items:
                all_formats.update(e.get('bindingFormats', []))
            print(f"  binding formats: {sorted(all_formats)}")
        elif cat_name == 'stickers':
            stypes = Counter(e.get('stickerType') for e in cat_items)
            print(f"  sticker types: {dict(stypes)}")
        for e in cat_items:
            stock = "IN STOCK" if e['inStock'] else "out of stock"
            print(f"    {e['title']} [{stock}]")

    # Write products.js
    js_content = f"// Auto-generated by build_catalog.py — do not edit manually\n"
    js_content += f"// Generated: {__import__('datetime').datetime.now().isoformat()}\n"
    js_content += f"// Total products: {len(catalog)}\n\n"
    js_content += f"const CATALOG = {json.dumps(catalog, indent=2)};\n"

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(js_content)

    print(f"\nWrote {OUTPUT_FILE} ({os.path.getsize(OUTPUT_FILE) / 1024:.1f} KB)")


if __name__ == '__main__':
    build_catalog()
