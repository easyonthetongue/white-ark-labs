import { importedProducts } from './imported-products.mjs';

const imageIds = [
  'photo-1584917865442-de89df76afd3',
  'photo-1591561954557-26941169b49e',
  'photo-1548036328-c9fa89d128fa',
  'photo-1590874103328-eac38a683ce7',
  'photo-1594223274512-ad4803739b7c'
];

const image = (index, width = 1400) => `https://images.unsplash.com/${imageIds[index % imageIds.length]}?auto=format&fit=crop&w=${width}&q=84`;

export const categories = [
  { id: 'cat-womens', slug: 'womens-handbags', name: "Women's Handbags", description: 'Structured and soft handbag forms developed around proportion, function and brand-specific detailing.', sortOrder: 1 },
  { id: 'cat-travel', slug: 'travel-business-bags', name: 'Travel & Business Bags', description: 'Work and travel silhouettes designed for durable construction, organization and daily use.', sortOrder: 2 },
  { id: 'cat-small', slug: 'small-leather-goods', name: 'Small Leather Goods', description: 'Compact leather accessories suited to refined edge work, custom branding and gift programs.', sortOrder: 3 },
  { id: 'cat-lifestyle', slug: 'belts-lifestyle-accessories', name: 'Belts & Lifestyle Accessories', description: 'Wearable and lifestyle pieces developed with considered hardware and dependable construction.', sortOrder: 4 },
  { id: 'cat-pouches', slug: 'pouches-organizers', name: 'Pouches & Organizers', description: 'Flexible storage pieces for beauty, travel, technology and everyday organization.', sortOrder: 5 }
];

export const materials = [
  { id: 'mat-cowhide', slug: 'cowhide-leather', name: 'Cowhide Leather', family: 'Leather', description: 'A versatile leather family used where structure, durability and a wide finish range are required.', characteristics: ['Durable', 'Structure-friendly', 'Broad finish range'], typicalApplications: ['Handbags', 'Belts', 'Business bags', 'Small leather goods'], finishOptions: ['Full-grain', 'Top-grain', 'Pebbled', 'Smooth', 'Pull-up', 'Waxed'], image: image(0), sourcingStatus: 'Partner confirmation required', seoTitle: 'Cowhide Leather for Custom Leather Goods', seoDescription: 'Explore cowhide leather options for custom bags, belts and accessories.' },
  { id: 'mat-soft', slug: 'sheepskin-soft-leathers', name: 'Sheepskin & Soft Leathers', family: 'Leather', description: 'Supple leathers suited to soft silhouettes, tactile panels and lightly structured accessories.', characteristics: ['Soft hand feel', 'Lightweight', 'Flexible drape'], typicalApplications: ['Soft handbags', 'Pouches', 'Small accessories'], finishOptions: ['Soft finished leather', 'Nappa-style leather'], image: image(1), sourcingStatus: 'Partner confirmation required', seoTitle: 'Sheepskin and Soft Leather Options', seoDescription: 'Soft leather options for custom handbags, pouches and accessories.' },
  { id: 'mat-suede', slug: 'suede-nubuck', name: 'Suede & Nubuck', family: 'Leather', description: 'Velvety surfaces that add depth and softness to panels, trims and selected full-body designs.', characteristics: ['Soft nap', 'Rich colour absorption', 'Tactile finish'], typicalApplications: ['Handbags', 'Pouches', 'Feature panels'], finishOptions: ['Cowhide suede', 'Split suede', 'Nubuck'], image: image(2), sourcingStatus: 'Partner confirmation required', seoTitle: 'Suede and Nubuck for Product Development', seoDescription: 'Review suede and nubuck applications for custom leather goods.' },
  { id: 'mat-textile', slug: 'canvas-textiles', name: 'Canvas & Textiles', family: 'Textile', description: 'Hard-wearing woven materials that can be paired with leather trims for lighter, practical products.', characteristics: ['Lightweight', 'Flexible', 'Suitable for reinforcement'], typicalApplications: ['Totes', 'Travel bags', 'Organizers', 'Linings'], finishOptions: ['Cotton canvas', 'Denim', 'Nylon', 'Oxford cloth'], image: image(3), sourcingStatus: 'Available for development', seoTitle: 'Canvas and Textiles for Custom Bags', seoDescription: 'Canvas, denim, nylon and Oxford cloth options for custom bags.' },
  { id: 'mat-synthetic', slug: 'pu-synthetic-leather', name: 'PU & Synthetic Leather', family: 'Synthetic', description: 'Consistent alternatives considered for colour matching, easy care and price-sensitive product briefs.', characteristics: ['Consistent surface', 'Wide colour range', 'Easy care'], typicalApplications: ['Handbags', 'Pouches', 'Accessories'], finishOptions: ['PU leather', 'Microfiber synthetic leather'], image: image(4), sourcingStatus: 'Partner confirmation required', seoTitle: 'PU and Synthetic Leather Options', seoDescription: 'PU and microfiber synthetic leather options for private-label products.' },
  { id: 'mat-natural', slug: 'natural-fibers', name: 'Natural Fibers', family: 'Textile', description: 'Selected plant-based woven materials for casual products, trims and mixed-material constructions.', characteristics: ['Textural', 'Lightweight', 'Suitable for mixed-material designs'], typicalApplications: ['Shoppers', 'Pouches', 'Seasonal accessories'], finishOptions: ['Cotton', 'Jute', 'Selected woven fibers'], image: image(0), sourcingStatus: 'Special project', seoTitle: 'Natural Fibers for Custom Accessories', seoDescription: 'Cotton, jute and selected woven fibers for custom product development.' }
];

export const techniques = [
  ['tech-weaving', 'leather-weaving', 'Leather Weaving', 'Interlaced leather strips used for panels, trims or complete soft-body constructions.', ['Handbags', 'Belts'], ['mat-cowhide', 'mat-soft'], 'Special project'],
  ['tech-quilting', 'quilting-padding', 'Quilting & Padding', 'Layered stitching and padding used to create controlled volume and surface pattern.', ['Handbags', 'Pouches'], ['mat-soft', 'mat-synthetic', 'mat-textile'], 'Available for development'],
  ['tech-embossing', 'embossing', 'Embossing', 'Pressure-applied logos, patterns or textures developed around the selected material.', ['Small leather goods', 'Belts', 'Bags'], ['mat-cowhide', 'mat-synthetic'], 'Available for development'],
  ['tech-foil', 'foil-stamping', 'Foil Stamping', 'Metallic or coloured foil branding applied to suitable prepared surfaces.', ['Small leather goods', 'Pouches'], ['mat-cowhide', 'mat-synthetic'], 'Partner confirmation required'],
  ['tech-embroidery', 'embroidery', 'Embroidery', 'Thread-based branding and decoration for textile or prepared leather panels.', ['Canvas bags', 'Pouches'], ['mat-textile', 'mat-synthetic'], 'Available for development'],
  ['tech-applique', 'applique', 'Appliqué', 'Layered cut components stitched or bonded to create graphic surface details.', ['Handbags', 'Pouches'], ['mat-cowhide', 'mat-textile', 'mat-synthetic'], 'Partner confirmation required'],
  ['tech-studding', 'studding-riveting', 'Studding & Riveting', 'Decorative or structural metal fasteners positioned through reinforced material layers.', ['Belts', 'Bags', 'Pet accessories'], ['mat-cowhide'], 'Available for development'],
  ['tech-hardware', 'hardware-installation', 'Hardware Installation', 'Planned fitting of buckles, rings, locks, feet and branded metal components.', ['Bags', 'Belts', 'Accessories'], ['mat-cowhide', 'mat-synthetic', 'mat-textile'], 'Available for development'],
  ['tech-distressing', 'distressing', 'Distressing', 'Controlled surface finishing developed to create worn-in variation and character.', ['Travel bags', 'Belts'], ['mat-cowhide'], 'Special project'],
  ['tech-wax', 'waxed-finishes', 'Waxed Finishes', 'Wax applications that deepen colour and create subtle tonal movement with use.', ['Bags', 'Belts', 'Small leather goods'], ['mat-cowhide'], 'Partner confirmation required'],
  ['tech-laser', 'laser-engraving', 'Laser Engraving', 'Digitally controlled marking for artwork, numbering or selected branding applications.', ['Small leather goods', 'Accessories'], ['mat-cowhide', 'mat-synthetic'], 'Partner confirmation required'],
  ['tech-perforation', 'leather-cutout-perforation', 'Leather Cutout & Perforation', 'Repeat cut patterns or ventilation details developed with material stability in mind.', ['Handbags', 'Accessories'], ['mat-cowhide', 'mat-synthetic'], 'Special project']
].map(([id, slug, name, description, typicalApplications, compatibleMaterialIds, availabilityStatus], index) => ({
  id, slug, name, description, typicalApplications, compatibleMaterialIds, image: image(index), productionConsiderations: 'Final method, tolerances and material suitability are confirmed during sampling.', availabilityStatus
}));

export const constructionCapabilities = [
  'Structured Bag Construction', 'Edge Painting', 'Turned Edges', 'Leather Skiving', 'Hand Stitching', 'Machine Stitching',
  'Custom Linings', 'Zipper & Closure Installation', 'Pattern Making', 'Reinforcement & Internal Structure', 'Hardware Fitting', 'Leather Molding'
].map((name, index) => ({ id: `cap-${index + 1}`, slug: name.toLowerCase().replaceAll('&', 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''), name, status: index < 10 ? 'Available for development' : 'Partner confirmation required' }));

const productSeeds = [
  ['WAL-001','architect-tote','Architect Tote','cat-womens','Structured Tote',['mat-cowhide'],['tech-embossing','tech-hardware'],'32 × 25 × 12','Structured'],
  ['WAL-002','soft-market-tote','Soft Market Tote','cat-womens','Soft Tote',['mat-soft'],['tech-hardware'],'36 × 29 × 13','Soft'],
  ['WAL-003','arc-shoulder-bag','Arc Shoulder Bag','cat-womens','Shoulder Bag',['mat-cowhide','mat-soft'],['tech-hardware'],'27 × 17 × 8','Semi-structured'],
  ['WAL-004','linea-crossbody','Linea Crossbody','cat-womens','Crossbody Bag',['mat-cowhide'],['tech-embossing','tech-hardware'],'22 × 16 × 7','Structured'],
  ['WAL-005','column-bucket-bag','Column Bucket Bag','cat-womens','Bucket Bag',['mat-cowhide','mat-suede'],['tech-hardware'],'24 × 26 × 14','Soft'],
  ['WAL-006','crescent-hobo','Crescent Hobo','cat-womens','Hobo Bag',['mat-soft','mat-suede'],['tech-quilting'],'34 × 23 × 11','Soft'],
  ['WAL-007','frame-mini-bag','Frame Mini Bag','cat-womens','Mini Bag',['mat-cowhide','mat-synthetic'],['tech-foil','tech-hardware'],'18 × 13 × 6','Structured'],
  ['WAL-008','fold-clutch','Fold Clutch','cat-womens','Clutch Bag',['mat-cowhide','mat-soft'],['tech-embossing'],'28 × 16 × 4','Semi-structured'],
  ['WAL-009','atelier-top-handle','Atelier Top-Handle','cat-womens','Top-Handle Bag',['mat-cowhide'],['tech-hardware','tech-wax'],'25 × 20 × 10','Structured'],
  ['WAL-010','rider-satchel','Rider Satchel','cat-womens','Satchel',['mat-cowhide'],['tech-studding','tech-hardware'],'30 × 22 × 10','Structured'],
  ['WAL-011','canvas-shopper','Canvas Shopper','cat-womens','Shopper Bag',['mat-textile','mat-cowhide'],['tech-embroidery'],'38 × 32 × 14','Soft'],
  ['WAL-012','transform-handbag','Transform Handbag','cat-womens','Convertible Handbag',['mat-cowhide','mat-synthetic'],['tech-hardware'],'29 × 21 × 11','Semi-structured'],
  ['WAL-013','weekend-01','Weekend 01','cat-travel','Leather Weekender',['mat-cowhide','mat-textile'],['tech-hardware','tech-wax'],'50 × 30 × 24','Soft'],
  ['WAL-014','transit-duffel','Transit Duffel','cat-travel','Duffel Bag',['mat-cowhide','mat-synthetic'],['tech-hardware'],'48 × 28 × 23','Semi-structured'],
  ['WAL-015','frame-briefcase','Frame Briefcase','cat-travel','Briefcase',['mat-cowhide'],['tech-embossing','tech-hardware'],'40 × 30 × 9','Structured'],
  ['WAL-016','folio-laptop-bag','Folio Laptop Bag','cat-travel','Laptop Bag',['mat-cowhide','mat-textile'],['tech-hardware'],'39 × 29 × 7','Padded'],
  ['WAL-017','field-messenger','Field Messenger','cat-travel','Messenger Bag',['mat-cowhide','mat-textile'],['tech-studding'],'38 × 28 × 11','Semi-structured'],
  ['WAL-018','city-leather-backpack','City Leather Backpack','cat-travel','Leather Backpack',['mat-cowhide'],['tech-hardware'],'31 × 42 × 14','Structured'],
  ['WAL-019','route-carryall','Route Carryall','cat-travel','Travel Carryall',['mat-textile','mat-cowhide'],['tech-embroidery','tech-hardware'],'54 × 34 × 25','Soft'],
  ['WAL-020','executive-portfolio','Executive Portfolio','cat-travel','Business Portfolio',['mat-cowhide'],['tech-embossing','tech-foil'],'35 × 26 × 3','Structured'],
  ['WAL-021','classic-bifold','Classic Bifold','cat-small','Bifold Wallet',['mat-cowhide'],['tech-embossing'],'11 × 9 × 2','Folded'],
  ['WAL-022','slim-card-holder','Slim Card Holder','cat-small','Card Holder',['mat-cowhide'],['tech-foil'],'10 × 7 × 1','Layered'],
  ['WAL-023','journey-passport-cover','Journey Passport Cover','cat-small','Passport Cover',['mat-cowhide','mat-synthetic'],['tech-embossing'],'14 × 10 × 1','Folded'],
  ['WAL-024','loop-key-fob','Loop Key Fob','cat-small','Key Fob',['mat-cowhide'],['tech-studding'],'10 × 2 × 1','Strap'],
  ['WAL-025','optic-eyewear-sleeve','Optic Eyewear Sleeve','cat-small','Eyewear Sleeve',['mat-soft','mat-cowhide'],['tech-embossing'],'17 × 8 × 2','Soft'],
  ['WAL-026','pocket-phone-sleeve','Pocket Phone Sleeve','cat-small','Phone Sleeve',['mat-cowhide','mat-synthetic'],['tech-perforation'],'17 × 9 × 2','Padded'],
  ['WAL-027','grid-tech-organizer','Grid Tech Organizer','cat-small','Tech Organizer',['mat-cowhide','mat-textile'],['tech-hardware'],'23 × 16 × 4','Semi-structured'],
  ['WAL-028','round-coin-purse','Round Coin Purse','cat-small','Coin Purse',['mat-soft'],['tech-hardware'],'10 × 10 × 2','Soft'],
  ['WAL-029','continental-zip-wallet','Continental Zip Wallet','cat-small','Zip Wallet',['mat-cowhide'],['tech-hardware','tech-foil'],'20 × 11 × 2','Structured'],
  ['WAL-030','document-case','Document Case','cat-small','Document Holder',['mat-cowhide','mat-synthetic'],['tech-embossing'],'33 × 24 × 2','Structured'],
  ['WAL-031','heritage-belt','Heritage Belt','cat-lifestyle','Classic Leather Belt',['mat-cowhide'],['tech-hardware','tech-wax'],'Custom length × 3.5','Strap'],
  ['WAL-032','contour-fashion-belt','Contour Fashion Belt','cat-lifestyle',"Women's Fashion Belt",['mat-cowhide','mat-synthetic'],['tech-hardware'],'Custom length × 5','Shaped strap'],
  ['WAL-033','woven-belt','Woven Belt','cat-lifestyle','Braided Leather Belt',['mat-cowhide'],['tech-weaving','tech-hardware'],'Custom length × 3.5','Braided'],
  ['WAL-034','classic-watch-strap','Classic Watch Strap','cat-lifestyle','Leather Watch Strap',['mat-cowhide'],['tech-embossing','tech-hardware'],'Custom length × 2','Layered'],
  ['WAL-035','journey-luggage-tag','Journey Luggage Tag','cat-lifestyle','Leather Luggage Tag',['mat-cowhide','mat-synthetic'],['tech-foil'],'11 × 7 × 1','Layered'],
  ['WAL-036','companion-dog-collar','Companion Dog Collar','cat-lifestyle','Leather Dog Collar',['mat-cowhide'],['tech-studding','tech-hardware'],'Custom length × 2.5','Reinforced strap'],
  ['WAL-037','companion-leash','Companion Leash','cat-lifestyle','Leather Leash',['mat-cowhide'],['tech-studding','tech-hardware'],'Custom length × 2','Reinforced strap'],
  ['WAL-038','utility-strap','Utility Strap','cat-lifestyle','Leather Utility Strap',['mat-cowhide','mat-textile'],['tech-hardware'],'Custom length × 3','Reinforced strap'],
  ['WAL-039','studio-cosmetic-pouch','Studio Cosmetic Pouch','cat-pouches','Cosmetic Pouch',['mat-soft','mat-synthetic'],['tech-hardware','tech-foil'],'21 × 14 × 7','Soft'],
  ['WAL-040','wash-toiletry-bag','Wash Toiletry Bag','cat-pouches','Toiletry Bag',['mat-cowhide','mat-textile'],['tech-hardware'],'26 × 15 × 12','Semi-structured'],
  ['WAL-041','journey-travel-organizer','Journey Travel Organizer','cat-pouches','Travel Organizer',['mat-cowhide','mat-textile'],['tech-hardware'],'25 × 18 × 4','Padded'],
  ['WAL-042','everyday-zipper-pouch','Everyday Zipper Pouch','cat-pouches','Zipper Pouch',['mat-soft','mat-synthetic'],['tech-embossing'],'24 × 16 × 3','Soft'],
  ['WAL-043','gather-drawstring-pouch','Gather Drawstring Pouch','cat-pouches','Drawstring Pouch',['mat-soft','mat-natural'],['tech-applique'],'18 × 22 × 8','Soft'],
  ['WAL-044','vanity-makeup-case','Vanity Makeup Case','cat-pouches','Makeup Case',['mat-synthetic','mat-textile'],['tech-quilting','tech-hardware'],'25 × 18 × 14','Structured'],
  ['WAL-045','line-cable-organizer','Line Cable Organizer','cat-pouches','Cable Organizer',['mat-cowhide','mat-textile'],['tech-perforation'],'20 × 12 × 3','Semi-structured'],
  ['WAL-046','keepsake-jewelry-case','Keepsake Jewelry Case','cat-pouches','Jewelry Travel Case',['mat-soft','mat-synthetic'],['tech-quilting','tech-foil'],'18 × 12 × 6','Structured']
];

const categoryName = (id) => categories.find((item) => item.id === id)?.name;
const materialName = (id) => materials.find((item) => item.id === id)?.name;
const techniqueName = (id) => techniques.find((item) => item.id === id)?.name;

const baseProducts = productSeeds.map(([id, slug, name, categoryId, subcategory, materialIds, techniqueIds, dimensions, constructionType], index) => ({
  id, slug, name, categoryId, subcategory,
  shortDescription: `${subcategory} reference developed for private-label customization and managed production.`,
  fullDescription: `${name} is a reference design for brands developing a custom ${subcategory.toLowerCase()}. Proportions, material, lining, colour, hardware and branding can be refined through sampling before production is coordinated with a suitable partner workshop.`,
  featuredImage: image(index),
  galleryImages: [image(index, 1800), image(index + 2, 1800), image(index + 4, 1800)],
  materialIds,
  availableColors: ['Black', 'Tan', 'Dark brown', 'Custom colour subject to material availability'],
  dimensions,
  dimensionsUnit: 'cm',
  constructionType,
  liningOptions: categoryId === 'cat-lifestyle' ? ['Unlined', 'Backing layer where required'] : ['Cotton twill', 'Polyester', 'Microfiber', 'Custom lining subject to sampling'],
  hardwareOptions: ['Nickel', 'Antique brass', 'Matte black', 'Custom finish subject to confirmation'],
  closureType: subcategory.includes('Tote') ? 'Open top or zipper option' : subcategory.includes('Pouch') || subcategory.includes('Wallet') ? 'Zipper or snap option' : 'Selected during development',
  customizationOptions: ['Dimensions', 'Material and colour', 'Lining', 'Hardware finish', 'Embossed or foil logo', 'Packaging'],
  techniqueIds,
  productionNotes: 'Final construction, tolerances, partner suitability and production schedule are confirmed after sample approval.',
  sampleAvailability: 'Available for development',
  minimumOrderQuantity: null,
  estimatedLeadTime: null,
  featured: [0, 2, 12, 14, 20, 38].includes(index),
  status: 'published',
  sortOrder: index + 1,
  seoTitle: `${name} | Custom ${subcategory} Development`,
  seoDescription: `Develop a custom ${subcategory.toLowerCase()} based on the ${name} reference with White Ark Labs.`,
  createdAt: '2026-10-14T00:00:00.000Z',
  updatedAt: '2026-10-14T00:00:00.000Z'
}));

export const products = [...baseProducts, ...importedProducts];

for (const material of materials) material.compatibleProductIds = products.filter((product) => product.materialIds.includes(material.id)).map((product) => product.id);
for (const technique of techniques) technique.compatibleProductIds = products.filter((product) => product.techniqueIds.includes(technique.id)).map((product) => product.id);

export const catalogueSummary = {
  categories: categories.map((category) => ({ ...category, count: products.filter((product) => product.categoryId === category.id).length })),
  productCount: products.length,
  materialCount: materials.length,
  techniqueCount: techniques.length
};

export const labels = { categoryName, materialName, techniqueName };
