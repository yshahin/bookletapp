import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const DRAFTS_DIR = '/home/yshahin/code/projects/booklets/content/drafts';

// Files already fully updated - skip these
const ALREADY_DONE = new Set([
  '20260317-project-accordion-album.md',
  '20260331-coptic-stitch-the-basics.md',
  '20260407-coptic-stitch-board-attachment.md',
  '20260421-french-link-stitch.md',
  '20260519-making-book-cloth-at-home.md',
  '20260428-tape-sewing-techniques.md',
  '20260505-rounding-and-backing-theory.md',
  '20260512-making-a-round-back-book.md',
  '20260526-box-making-101-slipcases.md',
]);

// SEO metadata for each file
const SEO_DATA = {
  '20260602-clamshell-box-trays.md': {
    seoTitle: 'Clamshell Box Trays: Solander Box Part 1',
    metaDescription: 'Build the trays for a clamshell (Solander) box. Learn precise tray construction that forms the foundation of this elegant protective enclosure.',
    slug: 'clamshell-box-trays',
    lede: 'The clamshell box provides the highest level of protection for books, and it starts with well-constructed trays.',
    tldr: [
      'A clamshell box has two trays (base and lid) that nest together',
      'Precise measurement with different ease allowances for base and lid ensures proper fit',
      'Wall overlap construction creates strong corners that hold up to repeated use',
    ],
    glossary: [
      { term: 'Solander box', def: 'Another name for a clamshell box, named after Swedish naturalist Daniel Solander' },
      { term: 'Base tray', def: 'The smaller inner tray that holds the book directly' },
      { term: 'Lid tray', def: 'The larger outer tray that drops over the base' },
      { term: 'Ease', def: 'Additional space added to allow comfortable insertion and removal' },
      { term: 'Turn-in', def: 'The portion of covering material folded over the edge to the interior' },
    ],
    faq: [
      ['How much larger should the lid be than the base?', 'The lid needs approximately 6mm more in height and width than the base, plus the thickness of the covering material. This allows the lid to drop smoothly over the base.'],
      ['Can I use different materials for base and lid?', 'Yes, though matching materials create a more professional appearance. Some binders use contrasting linings for visual interest.'],
      ['My trays don\'t nest smoothly. What went wrong?', 'Usually a squareness issue. Check that all corners are true 90 degrees. Even slight deviation prevents smooth nesting.'],
      ['How long should I let the trays dry before casing?', 'At least 24 hours. Rushing to casing before trays are fully cured risks distortion during assembly.'],
      ['Do I need special board for the walls?', 'Standard 2mm binder\'s board works well. Some prefer slightly thinner board (1.5mm) for the walls of smaller boxes.'],
    ],
    links: ['Clamshell Box: Casing', 'Box Making 101: Slipcases', 'Adhesives 101: PVA vs. Paste', 'Beginner\'s Guide to Case Binding'],
    heroImg: 'clamshell-trays-open',
    stepImgs: ['tray-wall-assembly', 'tray-covering-corners', 'nested-trays-fit-test'],
    callouts: [
      { type: 'Pro tip', text: 'Label every piece before assembly. Once covered, wall pieces look identical and mixing up base and lid components is easy to do.' },
      { type: 'Common mistake', text: 'Gluing walls in the wrong order. Always attach long walls first, then short walls that overlap the long wall edges. Reversing this creates weak joints.' },
      { type: 'Budget option', text: 'Practice with cereal box cardboard and kraft paper before committing binder\'s board. The construction principles are identical.' },
      { type: 'Tool swap', text: 'No board shears? A sharp utility knife with a metal ruler works — just make multiple light passes rather than forcing through in one cut.' },
    ],
  },
  '20260609-clamshell-box-casing.md': {
    seoTitle: 'Clamshell Box Casing: Solander Box Part 2',
    metaDescription: 'Complete your Solander box by joining trays with a hinged case. Learn fit assessment and casing techniques for a professional enclosure.',
    slug: 'clamshell-box-casing',
    lede: 'The case wraps around nested trays and creates the hinge that transforms two separate boxes into one elegant clamshell enclosure.',
    tldr: [
      'Verify tray fit before casing — trays must nest smoothly with consistent gaps',
      'The case creates hinge zones that allow the box to open and close properly',
      'Careful tray-to-case alignment determines the success of the finished box',
    ],
    glossary: [
      { term: 'Casing', def: 'The covering structure that wraps around and joins the two trays at a spine hinge' },
      { term: 'Hinge zone', def: 'The gap between the spine stiffener and tray attachment areas that allows the case to flex' },
      { term: 'Spine stiffener', def: 'A board strip placed at the spine of the case to provide structure' },
      { term: 'Fore edge', def: 'The open side of the clamshell box, opposite the spine hinge' },
      { term: 'Nesting', def: 'How the base tray fits inside the lid tray when the box is closed' },
    ],
    faq: [
      ['What if my trays don\'t nest properly?', 'Sand the interior lid walls lightly or add thin paper lining to the base exterior. Fix fit issues before casing — they can\'t be corrected afterward.'],
      ['How wide should the hinge gaps be?', 'Approximately board thickness (2mm) plus the thickness of your covering material. Too narrow prevents proper opening; too wide creates a floppy hinge.'],
      ['Can I add a closure mechanism?', 'Yes — ribbon ties, magnetic closures, or bone clasps all work. Plan for these during case construction, not after.'],
      ['My box twists when closed. Can I fix it?', 'Twisting usually means the trays aren\'t square. Limited correction is possible by re-pressing, but prevention through careful construction is the real solution.'],
      ['How long until I can use the finished box?', 'Allow 24 hours full cure time after final assembly before placing a book inside.'],
    ],
    links: ['Clamshell Box: Trays', 'Box Making 101: Slipcases', 'Adhesives 101: PVA vs. Paste', 'Beginner\'s Guide to Case Binding'],
    heroImg: 'clamshell-complete-open',
    stepImgs: ['casing-spine-stiffener', 'tray-attachment-positioning', 'clamshell-finished-closed'],
    callouts: [
      { type: 'Pro tip', text: 'Mark the spine position on your covering material with light pencil lines before gluing anything. Repositioning after adhesive is applied is nearly impossible.' },
      { type: 'Common mistake', text: 'Making hinge gaps too narrow. The case needs room to flex — if gaps are too tight, the box won\'t open fully and stress will tear the covering.' },
      { type: 'Budget option', text: 'Use a strong decorative paper instead of book cloth for the case. It\'s less durable but fine for boxes that won\'t see daily handling.' },
    ],
  },
  '20260623-thread-types-guide.md': {
    seoTitle: 'Bookbinding Thread Guide: Linen, Silk & More',
    metaDescription: 'Choose the right bookbinding thread for every project. Compare linen, silk, cotton, and polyester by strength, appearance, and best use cases.',
    slug: 'thread-types-guide',
    lede: 'Choosing the right thread for your binding project determines both the strength and visual character of the finished book.',
    tldr: [
      'Linen is the traditional workhorse — strong, archival, and holds knots well',
      'Silk offers the best strength-to-weight ratio and beautiful appearance for fine binding',
      'Match thread weight to paper weight so sewing doesn\'t overwhelm delicate signatures',
    ],
    glossary: [
      { term: 'Cord count', def: 'Number of plies twisted together in a thread (e.g., 3-cord, 6-cord)' },
      { term: 'Waxing', def: 'Drawing thread across beeswax to reduce tangling, add stiffness, and ease passage through holes' },
      { term: 'Swell', def: 'Increased spine thickness from thread buildup — affected by thread weight and sewing stations' },
      { term: 'Polished linen', def: 'Linen thread with a smooth finish and slight sheen, preferred for fine binding' },
      { term: 'Tex', def: 'Metric measurement of thread weight — weight in grams of 1,000 meters of thread' },
    ],
    faq: [
      ['What\'s the best all-around thread for beginners?', 'Waxed linen in medium weight. It\'s forgiving, holds knots well, and works for most binding styles. Buy a spool and you\'ll use it for dozens of projects.'],
      ['Do I have to wax my thread?', 'Not if you buy pre-waxed thread. If using unwaxed thread, waxing is strongly recommended — it prevents tangling and helps thread grip in stitches.'],
      ['Can I use regular sewing thread?', 'Standard sewing thread (polyester or cotton) is too thin and slippery for most bookbinding. It works only for very light pamphlet stitching.'],
      ['How much thread do I need per project?', 'Roughly 2.5 times the spine height per signature, plus extra for starting and finishing. Better to have too much than to run out mid-sewing.'],
      ['Does thread color matter?', 'For hidden sewing (case binding), no. For exposed-spine bindings (Coptic, long stitch, stab), thread color is a design choice that significantly affects appearance.'],
    ],
    links: ['Coptic Stitch: The Basics', 'Japanese Stab Binding: 4-Hole', 'Tape Sewing Techniques', 'French Link Stitch'],
    heroImg: 'thread-types-comparison',
    stepImgs: ['thread-weight-samples', 'thread-waxing-technique', 'thread-binding-matching'],
    callouts: [
      { type: 'Pro tip', text: 'Buy thread in small quantities from multiple suppliers to find what you prefer before committing to large spools. Thread feel and quality vary significantly between brands.' },
      { type: 'Common mistake', text: 'Using thread that\'s too thick for your paper. Heavy thread on lightweight paper tears through the fold. The thread should nestle into the fold without bulging.' },
      { type: 'Budget option', text: 'Waxed linen from leather craft suppliers is often the same quality as bookbinding-specific thread at a lower price. Check the weight and buy a sample first.' },
      { type: 'Tool swap', text: 'No beeswax block? A plain white candle (unscented) works for waxing thread in a pinch. Microcrystalline wax is the professional alternative.' },
    ],
  },
  '20260630-knife-sharpening-workshop.md': {
    seoTitle: 'Bookbinding Knife Sharpening: Edge Maintenance',
    metaDescription: 'Learn to sharpen and maintain bookbinding knives for precise cutting and leather paring. Covers sharpening stones, angles, and technique.',
    slug: 'knife-sharpening-workshop',
    lede: 'Sharp tools are essential for quality bookbinding, and learning to maintain them properly is a foundational skill.',
    tldr: [
      'A dull knife tears rather than cuts, making precision work impossible',
      'Different bookbinding knives require different sharpening angles and techniques',
      'Regular stropping maintains an edge far longer than occasional full resharpening',
    ],
    glossary: [
      { term: 'Stropping', def: 'Drawing a blade across leather (often with compound) to realign and polish the edge' },
      { term: 'Bevel', def: 'The angled face ground into the blade that forms the cutting edge' },
      { term: 'Grit', def: 'The coarseness of a sharpening stone — lower numbers are coarser, higher are finer' },
      { term: 'Burr', def: 'A thin wire edge that forms on the opposite side of the blade during sharpening' },
      { term: 'Honing', def: 'Refining an edge on fine-grit stones after establishing the bevel on coarser stones' },
    ],
    faq: [
      ['How often should I sharpen my knives?', 'Strop before every session. Full sharpening on stones is only needed when stropping no longer restores the edge — typically every few weeks of regular use.'],
      ['What grit stones do I need?', 'A 1000 grit and a 4000–6000 grit cover most needs. Add a coarser 400–600 grit if you need to reshape a damaged edge.'],
      ['Can I use a honing guide?', 'Yes, especially when learning. Guides maintain consistent angles. As you develop muscle memory, freehand sharpening becomes more efficient.'],
      ['My paring knife won\'t hold an edge. Why?', 'Likely sharpened at too acute an angle (too thin an edge) for the steel type. Try a slightly more obtuse angle for durability.'],
      ['Is a strop really necessary?', 'Absolutely. Stropping is the single most impactful maintenance habit. A stropped edge outperforms a freshly-stoned-but-unstropped edge.'],
    ],
    links: ['Leather Paring: Knife Shapes', 'Leather Paring Techniques', 'DIY Bookbinding Tools', 'Tools Checklist: Soft vs. Hard Cover'],
    heroImg: 'knife-sharpening-setup',
    stepImgs: ['sharpening-angle-guide', 'stropping-technique', 'edge-testing-paper'],
    callouts: [
      { type: 'Pro tip', text: 'Test sharpness by slicing a single sheet of paper. A sharp knife cuts cleanly with minimal pressure; a dull one catches and tears.' },
      { type: 'Common mistake', text: 'Pressing too hard on the stone. Let the abrasive do the work. Heavy pressure creates an uneven bevel and can dish the stone.' },
      { type: 'Budget option', text: 'Wet/dry sandpaper on a flat surface (glass or granite) works as an effective sharpening system. Start at 400 grit and progress to 2000.' },
      { type: 'Tool swap', text: 'No leather strop? The back of a leather belt, smooth side, mounted flat works well. Add stropping compound for best results.' },
    ],
  },
};

// Generate remaining file metadata programmatically
const REMAINING_FILES = {
  '20260707-leather-paring-knife-shapes.md': {
    seoTitle: 'Leather Paring Knives: Shapes & Uses',
    metaDescription: 'Learn which paring knife shapes suit different leather thinning tasks. Compare English, French, and Swiss knife profiles for bookbinding.',
    slug: 'leather-paring-knife-shapes',
    lede: 'Different paring knife shapes excel at different leather thinning tasks, and understanding these shapes helps you choose the right tool.',
    tldr: ['English paring knives handle broad paring and general thinning', 'French knives excel at edge paring with their curved blade profile', 'Knife shape determines paring technique — match the tool to the task'],
  },
  '20260714-leather-paring-techniques.md': {
    seoTitle: 'Leather Paring Techniques for Bookbinding',
    metaDescription: 'Master edge paring, broad paring, and feathering techniques for bookbinding leather. Step-by-step guide to achieving consistent thickness.',
    slug: 'leather-paring-techniques',
    lede: 'Proper paring transforms thick, stiff leather into supple material that wraps cleanly around boards and folds neatly at turn-ins.',
    tldr: ['Edge paring creates thin, flexible turn-ins that lie flat under endpapers', 'Broad paring reduces overall thickness for lighter, more elegant bindings', 'Consistent technique matters more than expensive tools'],
  },
  '20260721-intro-to-leather-binding.md': {
    seoTitle: 'Introduction to Leather Bookbinding',
    metaDescription: 'Start your journey into leather binding with this overview of leathers, preparation, and basic covering technique for hardcover books.',
    slug: 'intro-to-leather-binding',
    lede: 'Leather binding represents the pinnacle of traditional bookmaking craft, and this introduction covers everything you need to get started.',
    tldr: ['Goatskin (morocco) is the most common and versatile bookbinding leather', 'Proper paring is essential — leather must be thinned before covering', 'Start with a half or quarter leather binding before attempting full leather'],
  },
  '20260728-quarter-leather-binding.md': {
    seoTitle: 'Quarter Leather Binding: A First Leather Project',
    metaDescription: 'Create a quarter leather binding with leather spine and paper-covered boards. An accessible introduction to working with leather on books.',
    slug: 'quarter-leather-binding',
    lede: 'Quarter leather binding combines a leather spine with paper-covered boards for an elegant, accessible first leather project.',
    tldr: ['Leather covers the spine only — paper or cloth covers the boards', 'Requires less paring skill than full leather while teaching core techniques', 'The leather-to-paper joint is the critical detail that makes or breaks the design'],
  },
  '20260811-full-leather-forwarding.md': {
    seoTitle: 'Full Leather Forwarding: Complete Coverage',
    metaDescription: 'Learn the forwarding steps for a full leather binding. Covers paring, covering, turning in, and board attachment for complete leather coverage.',
    slug: 'full-leather-forwarding',
    lede: 'Full leather forwarding covers the entire book in leather, requiring advanced paring and precise covering technique.',
    tldr: ['Leather must be pared to varying thicknesses across different zones', 'Covering requires working quickly while paste remains tacky', 'Corner treatment and turn-ins define the quality of the finished binding'],
  },
  '20260804-hand-sewn-endbands.md': {
    seoTitle: 'Hand-Sewn Endbands: Step-by-Step Tutorial',
    metaDescription: 'Learn to sew decorative endbands by hand for your bookbinding projects. Covers single and two-color techniques with bead-on-core construction.',
    slug: 'hand-sewn-endbands',
    lede: 'Hand-sewn endbands add structural reinforcement and decorative detail to the head and tail of a book\'s spine.',
    tldr: ['Endbands wrap colored thread around a core anchored to the text block', 'Two-color endbands create a striped pattern that adds visual interest', 'Tension consistency is the key to even, professional-looking endbands'],
  },
  '20260825-edge-decoration-spattering.md': {
    seoTitle: 'Edge Decoration: Spattering Technique',
    metaDescription: 'Add spattered edge decoration to your books using simple tools. Learn brush technique, color mixing, and masking for clean, professional results.',
    slug: 'edge-decoration-spattering',
    lede: 'Spattering creates a distinctive speckled pattern on book edges using nothing more than a stiff brush, paint, and a screen.',
    tldr: ['Dip a stiff brush in diluted acrylic and draw across a screen to spatter', 'Multiple light passes create better results than one heavy application', 'Mask the spine and covers carefully before spattering to protect them'],
  },
  '20260825-edge-decoration-graphite.md': {
    seoTitle: 'Edge Decoration: Graphite Burnishing',
    metaDescription: 'Create a smooth, metallic graphite finish on book edges. Learn the burnishing technique that gives books a refined, polished appearance.',
    slug: 'edge-decoration-graphite',
    lede: 'Graphite burnishing creates a smooth, subtly metallic finish on trimmed book edges with minimal tools.',
    tldr: ['Apply powdered graphite to trimmed, pressed edges with a soft cloth', 'Burnish with an agate or bone burnisher for a polished, reflective surface', 'Works best on smooth, tightly pressed text blocks with clean-cut edges'],
  },
  '20260908-gold-tooling-hand-tools.md': {
    seoTitle: 'Gold Tooling with Hand Tools',
    metaDescription: 'Learn traditional gold tooling on leather bindings using hand tools. Covers preparation, adhesive sizing, and pressing technique for gold leaf.',
    slug: 'gold-tooling-hand-tools',
    lede: 'Gold tooling applies gold leaf to leather bindings using heated brass tools, creating the iconic lettering and decoration of fine binding.',
    tldr: ['Heated brass tools press gold leaf into leather prepared with glair or adhesive', 'Temperature, pressure, and timing must all be correct for gold to adhere', 'Practice on scrap leather extensively before tooling a finished binding'],
  },
  '20260915-blind-tooling-techniques.md': {
    seoTitle: 'Blind Tooling on Leather Bindings',
    metaDescription: 'Master blind tooling to create impressed decorations on leather book covers. Learn dampening, tool selection, and pattern layout techniques.',
    slug: 'blind-tooling-techniques',
    lede: 'Blind tooling impresses decorative patterns into dampened leather without gold, creating subtle, elegant decoration.',
    tldr: ['Dampened leather accepts permanent impressions from heated or cold brass tools', 'Blind tooling creates subtle texture visible through light reflection', 'Simpler than gold tooling and an excellent way to learn tool handling'],
  },
  '20260922-limp-vellum-history.md': {
    seoTitle: 'Limp Vellum Binding: History & Method',
    metaDescription: 'Explore the history and construction of limp vellum bindings. Learn this medieval technique that creates flexible, durable book covers without boards.',
    slug: 'limp-vellum-history',
    lede: 'Limp vellum binding wraps books in flexible animal-skin parchment without rigid boards, a technique dating to medieval scriptoria.',
    tldr: ['Vellum covers attach directly to the text block without separate boards', 'The flexible structure accommodates changes in humidity better than rigid bindings', 'Historically used for everyday working books, account ledgers, and manuscripts'],
  },
  '20260901-working-with-vellum-parchment.md': {
    seoTitle: 'Working with Vellum and Parchment',
    metaDescription: 'Learn to handle, prepare, and use vellum and parchment in bookbinding. Covers sourcing, conditioning, and working techniques for animal skin materials.',
    slug: 'working-with-vellum-parchment',
    lede: 'Vellum and parchment are animal-skin materials with unique properties that require specific handling techniques for successful bookbinding.',
    tldr: ['Vellum (calfskin) and parchment (sheep/goat) respond dramatically to humidity', 'Conditioning and restraining during drying prevents warping and cockling', 'Always work in moderate humidity and allow time for the material to acclimate'],
  },
  '20260929-cleaning-cloth-covers.md': {
    seoTitle: 'How to Clean Cloth Book Covers',
    metaDescription: 'Safely clean and restore cloth-covered books. Learn gentle techniques for removing dirt, stains, and mold from buckram and book cloth covers.',
    slug: 'cleaning-cloth-covers',
    lede: 'Cleaning cloth book covers requires gentle techniques that remove dirt and stains without damaging the fabric or adhesive beneath.',
    tldr: ['Start with dry cleaning methods (erasers, brushes) before trying wet techniques', 'Test any cleaning method on an inconspicuous area first', 'Mold requires isolation and careful treatment to prevent spreading to other books'],
  },
  '20261006-mending-torn-pages.md': {
    seoTitle: 'Mending Torn Pages: Repair Techniques',
    metaDescription: 'Learn to mend torn book pages with Japanese tissue, wheat paste, and proper technique. Restore damaged pages while preserving readability.',
    slug: 'mending-torn-pages',
    lede: 'Mending torn pages with Japanese tissue and wheat paste creates nearly invisible repairs that restore both strength and readability.',
    tldr: ['Japanese tissue torn (not cut) to shape creates feathered edges that blend invisibly', 'Wheat paste allows repositioning and dries to a flexible, archival bond', 'Always mend from the back of the page to minimize visual impact on text'],
  },
  '20261013-rebacking-disassembly.md': {
    seoTitle: 'Rebacking Part 1: Safe Disassembly',
    metaDescription: 'Learn to safely remove a damaged spine from a bound book. Covers assessment, documentation, and careful disassembly techniques for rebacking.',
    slug: 'rebacking-disassembly',
    lede: 'Rebacking starts with careful disassembly of the damaged spine while preserving the original boards and text block.',
    tldr: ['Document everything before starting — photographs and notes guide reconstruction', 'Steam or moisture softens old adhesive for safer removal', 'Preserve the original spine piece if possible for reattachment during reconstruction'],
  },
  '20261020-rebacking-reconstruction.md': {
    seoTitle: 'Rebacking Part 2: Spine Reconstruction',
    metaDescription: 'Complete a rebacking by constructing and attaching a new spine. Learn to integrate new materials while preserving the book\'s original character.',
    slug: 'rebacking-reconstruction',
    lede: 'Spine reconstruction attaches a new spine to the book while preserving as much original material and character as possible.',
    tldr: ['New spine material should match the original in color, weight, and texture', 'The original spine strip can often be laid over the new spine for authentic appearance', 'Hinge flexibility is critical — the repaired book must open as well as the original'],
  },
  '20261027-medieval-girdle-books.md': {
    seoTitle: 'Medieval Girdle Books: History & Recreation',
    metaDescription: 'Explore medieval girdle books designed to hang from a belt. Learn the history and construction of these unique portable book structures.',
    slug: 'medieval-girdle-books',
    lede: 'Girdle books were designed to hang upside-down from a belt, keeping the text ready to read in an era before pockets.',
    tldr: ['The binding extends beyond the book in a leather tail that attaches to a belt', 'Books hung upside-down so they could be read without detaching from the girdle', 'Recreating this structure teaches medieval binding techniques and leather work'],
  },
  '20261103-springback-binding.md': {
    seoTitle: 'Springback Binding: Ledger Construction',
    metaDescription: 'Build a springback binding that lies completely flat when open. Learn this specialized technique used for ledgers and record books.',
    slug: 'springback-binding',
    lede: 'Springback binding creates books that lie perfectly flat when open, making them ideal for ledgers and record keeping.',
    tldr: ['A curved spring mechanism in the spine forces pages flat when the book is opened', 'Requires precise spine tube construction and strong hinge attachment', 'Historically used for accounting ledgers that needed to stay open on a desk'],
  },
  '20261110-secret-belgian-binding.md': {
    seoTitle: 'Secret Belgian Binding Tutorial',
    metaDescription: 'Learn the secret Belgian binding technique that creates a concealed spine with decorative exposed sewing. A modern classic for journal making.',
    slug: 'secret-belgian-binding',
    lede: 'The secret Belgian binding conceals the spine structure while displaying decorative thread patterns on the cover.',
    tldr: ['Covers attach with hidden sewing through a folded spine strip', 'Thread patterns on the cover are decorative — the real binding is hidden inside', 'An excellent technique for journals and sketchbooks with a modern aesthetic'],
  },
  '20261117-project-the-flutter-book.md': {
    seoTitle: 'Flutter Book Project: Sculptural Binding',
    metaDescription: 'Create a flutter book — a sculptural accordion structure that fans open to display pages in three dimensions. A creative book arts project.',
    slug: 'project-the-flutter-book',
    lede: 'The flutter book is a sculptural accordion structure that fans open to display pages in three dimensions.',
    tldr: ['Pages attach to an accordion spine at alternating angles', 'The structure fans open into a circular or semi-circular display', 'Ideal for art books, photo displays, and creative book arts projects'],
  },
  '20261124-bookbinding-literature-review.md': {
    seoTitle: 'Essential Bookbinding Books & Resources',
    metaDescription: 'A curated guide to the best bookbinding books, from beginner manuals to advanced technique references. Build your bookbinding library wisely.',
    slug: 'bookbinding-literature-review',
    lede: 'Building a bookbinding reference library helps you learn techniques beyond what any single source can teach.',
    tldr: ['Start with one comprehensive beginner manual before branching out', 'Specialized references for leather, conservation, and design fill gaps over time', 'Online resources complement books but rarely replace hands-on instruction manuals'],
  },
  '20261201-wheat-paste-advanced-tips.md': {
    seoTitle: 'Wheat Paste: Advanced Tips & Recipes',
    metaDescription: 'Master wheat paste preparation and application for bookbinding. Covers cooking technique, consistency control, and troubleshooting common issues.',
    slug: 'wheat-paste-advanced-tips',
    lede: 'Wheat paste is the traditional adhesive for paper work in bookbinding, and mastering its preparation transforms your results.',
    tldr: ['Cook wheat starch slowly with constant stirring to achieve smooth, lump-free paste', 'Consistency ranges from thick (tipping) to thin (full sheet adhesion) depending on task', 'Wheat paste allows repositioning during application — PVA does not'],
  },
  '20261208-project-the-flag-book.md': {
    seoTitle: 'Flag Book Project: Interactive Binding',
    metaDescription: 'Build a flag book with pages that swing open from an accordion spine. A playful, interactive structure for creative bookmaking.',
    slug: 'project-the-flag-book',
    lede: 'The flag book features pages that swing open from an accordion spine, creating a playful, interactive reading experience.',
    tldr: ['Pages ("flags") attach to the peaks and valleys of an accordion spine', 'Opening the accordion causes pages to fan outward in alternating directions', 'Great for visual storytelling, art installations, and creative gifts'],
  },
  '20261215-square-knot-binding.md': {
    seoTitle: 'Square Knot Binding Tutorial',
    metaDescription: 'Learn the square knot binding technique for decorative exposed-spine books. A beginner-friendly method with striking visual results.',
    slug: 'square-knot-binding',
    lede: 'Square knot binding creates decorative knots at sewing stations visible on the spine, combining structure with ornamentation.',
    tldr: ['Square knots form at each sewing station, creating a textured spine pattern', 'The technique uses two needles working simultaneously from opposite ends', 'Beginner-friendly with visually impressive results from the first project'],
  },
  '20261222-project-spiral-bound-sketchbook.md': {
    seoTitle: 'DIY Spiral Bound Sketchbook Project',
    metaDescription: 'Make a custom spiral-bound sketchbook with hand-punched holes and wire binding. Choose your own paper, size, and cover materials.',
    slug: 'project-spiral-bound-sketchbook',
    lede: 'A custom spiral-bound sketchbook lets you choose the perfect paper, size, and cover for your drawing practice.',
    tldr: ['Punch evenly spaced holes through covers and pages with a hole punch or drill', 'Wire coil or plastic spiral threads through the holes for 360-degree page rotation', 'Custom paper selection means you can optimize for your specific medium'],
  },
  '20261229-loose-leaf-systems.md': {
    seoTitle: 'Loose-Leaf Binding Systems Overview',
    metaDescription: 'Explore loose-leaf binding options from simple post bindings to sophisticated disc systems. Learn when removable pages are the right choice.',
    slug: 'loose-leaf-systems',
    lede: 'Loose-leaf systems allow adding, removing, and rearranging pages — ideal for evolving documents and modular projects.',
    tldr: ['Post bindings use screws or bolts through punched holes for simple, adjustable binding', 'Disc systems use mushroom-shaped discs that snap into T-shaped slots', 'Choose loose-leaf when the content needs to change over time'],
  },
  '20270105-stab-variations-tortoise-hemp.md': {
    seoTitle: 'Japanese Stab Binding: Tortoise & Hemp Leaf',
    metaDescription: 'Learn advanced Japanese stab binding patterns including tortoise shell (kikko toji) and hemp leaf (asa-no-ha toji) decorative stitching.',
    slug: 'stab-variations-tortoise-hemp',
    lede: 'Advanced Japanese stab binding patterns like tortoise shell and hemp leaf create intricate decorative spines beyond the basic four-hole pattern.',
    tldr: ['Tortoise shell (kikko toji) creates hexagonal patterns across the spine', 'Hemp leaf (asa-no-ha toji) produces star-like geometric designs', 'Both build on basic stab binding skills with more complex hole patterns and threading'],
  },
  '20260505-perfect-binding-double-fan.md': {
    seoTitle: 'Perfect Binding: Double-Fan Technique',
    metaDescription: 'Learn double-fan adhesive binding for professional-looking paperback books. Covers page preparation, fanning technique, and adhesive application.',
    slug: 'perfect-binding-double-fan',
    lede: 'Double-fan adhesive binding creates strong paperback books by fanning pages and applying adhesive to exposed edges.',
    tldr: ['Pages fan in both directions to expose each sheet\'s edge for adhesive contact', 'PVA adhesive creates a flexible spine that holds individual sheets securely', 'More durable than single-fan binding and suitable for books up to about 1 inch (25mm) thick'],
  },
  '20260512-mechanical-bindings-overview.md': {
    seoTitle: 'Mechanical Bindings: Types & Uses',
    metaDescription: 'Compare mechanical binding methods including wire-o, comb, coil, and velo binding. Learn which system suits your project needs.',
    slug: 'mechanical-bindings-overview',
    lede: 'Mechanical bindings use hardware rather than sewing or adhesive to hold pages together, offering unique functional advantages.',
    tldr: ['Wire-O binding allows books to lie flat and fold back on themselves', 'Comb binding is the most economical and allows page additions/removals', 'Choose mechanical binding when function (flat opening, page removal) outweighs aesthetics'],
  },
  '20260623-buttonhole-stitch-binding.md': {
    seoTitle: 'Buttonhole Stitch Binding Tutorial',
    metaDescription: 'Create a decorative exposed-spine binding using the buttonhole stitch. This technique creates a wrapped, textured spine with excellent durability.',
    slug: 'buttonhole-stitch-binding',
    lede: 'Buttonhole stitch binding creates a wrapped, textured spine that is both decorative and structurally strong.',
    tldr: ['The buttonhole stitch wraps thread around the spine edge creating a braided appearance', 'Works well with soft covers and can accommodate thick text blocks', 'An intermediate technique that builds on basic pamphlet and link stitch skills'],
  },
  '20260728-long-stitch-binding.md': {
    seoTitle: 'Long Stitch Binding: Exposed Spine Journal',
    metaDescription: 'Learn long stitch binding to create journals with decorative exposed spines. Covers single-section and multi-section techniques.',
    slug: 'long-stitch-binding',
    lede: 'Long stitch binding sews signatures directly to a soft cover, creating visible thread patterns on the exposed spine.',
    tldr: ['Thread passes along the entire length of the spine, creating long visible stitches', 'The cover wraps around the text block and becomes part of the sewing structure', 'Excellent for journals and sketchbooks with a handcrafted aesthetic'],
  },
  '20260630-diy-bookbinding-tools.md': {
    seoTitle: 'DIY Bookbinding Tools You Can Make',
    metaDescription: 'Build essential bookbinding tools at home. Make a bone folder, sewing frame, book press, and more from everyday materials.',
    slug: 'diy-bookbinding-tools',
    lede: 'Many essential bookbinding tools can be made at home from common materials, letting you start binding without a large investment.',
    tldr: ['A simple sewing frame can be built from scrap wood and hardware store supplies', 'Book presses improvise from cutting boards, clamps, and heavy weights', 'DIY tools let you start immediately — upgrade to professional tools as skills develop'],
  },
  '20260210-paper-sizes.md': {
    seoTitle: 'Paper Sizes for Bookbinding Explained',
    metaDescription: 'Understand paper sizing systems used in bookbinding. Covers ISO, US, and traditional sheet sizes with conversion charts and practical guidance.',
    slug: 'paper-sizes',
    lede: 'Understanding paper sizes and how they relate to finished book dimensions is essential for planning any binding project.',
    tldr: ['ISO sizes (A4, A3) fold predictably — each size is half the next larger size', 'US sizes (Letter, Legal) don\'t share this mathematical relationship', 'Traditional bookbinding sizes (crown, demy, royal) appear in older references'],
  },
  '20260414-folding-scoring-techniques.md': {
    seoTitle: 'Paper Folding & Scoring for Bookbinding',
    metaDescription: 'Master paper folding and scoring techniques for clean, professional signatures. Covers grain direction, bone folder technique, and scoring methods.',
    slug: 'folding-scoring-techniques',
    lede: 'Clean, precise folds along the paper grain create signatures that press flat and sew evenly.',
    tldr: ['Always fold with the grain — cross-grain folds crack and resist lying flat', 'Score heavier papers before folding to prevent cracking at the fold', 'A bone folder creates crisp folds without damaging the paper surface'],
  },
  '20260428-kettle-stitch-the-foundation.md': {
    seoTitle: 'Kettle Stitch: The Essential Linking Stitch',
    metaDescription: 'Master the kettle stitch that links signatures at head and tail in multi-signature sewing. The foundational stitch for all traditional bookbinding.',
    slug: 'kettle-stitch-the-foundation',
    lede: 'The kettle stitch links signatures at the head and tail of the spine, forming the structural chain that holds multi-signature books together.',
    tldr: ['The stitch loops under the thread between the previous two signatures', 'Creates a visible chain at head and tail that defines the spine edges', 'Used in virtually every multi-signature binding from case binding to Coptic'],
  },
  '20260602-intro-to-multi-signature-sewing.md': {
    seoTitle: 'Multi-Signature Sewing: Getting Started',
    metaDescription: 'Learn the fundamentals of sewing multiple signatures into a text block. Covers station planning, thread management, and basic sewing patterns.',
    slug: 'intro-to-multi-signature-sewing',
    lede: 'Multi-signature sewing joins folded sections into a text block, and mastering this technique opens the door to most traditional binding styles.',
    tldr: ['Plan sewing stations evenly along the spine with kettle stitches at head and tail', 'Maintain consistent tension — too tight bunches signatures, too loose creates gaps', 'Start with 4–6 signatures to learn the rhythm before attempting larger projects'],
  },
};

async function processFile(filename, meta) {
  const filepath = join(DRAFTS_DIR, filename);
  let content = await readFile(filepath, 'utf-8');

  // 1. Add frontmatter fields if missing
  if (!content.includes('seoTitle:')) {
    content = content.replace(
      /published: false\n---/,
      `published: false\nseoTitle: "${meta.seoTitle}"\nmetaDescription: "${meta.metaDescription}"\nslug: "${meta.slug}"\n---`
    );
  }

  // 2. Add TL;DR after opening paragraph if missing
  if (!content.includes('**TL;DR**')) {
    const tldr = meta.tldr || ['Key point 1', 'Key point 2', 'Key point 3'];
    const lede = meta.lede || '';
    const heroSlug = meta.heroImg || meta.slug;

    // Find the opening paragraph (after frontmatter ---)
    const frontmatterEnd = content.indexOf('---', content.indexOf('---') + 3) + 3;
    const afterFrontmatter = content.substring(frontmatterEnd);

    // Find the first ### or ## heading
    const firstHeadingMatch = afterFrontmatter.match(/\n(#{2,3} .+)/);
    if (firstHeadingMatch) {
      const headingPos = afterFrontmatter.indexOf(firstHeadingMatch[0]);
      const beforeHeading = afterFrontmatter.substring(0, headingPos);
      const fromHeading = afterFrontmatter.substring(headingPos);

      const newSection = `\n\n${lede}\n\n**TL;DR**\n${tldr.map(t => `- ${t}`).join('\n')}\n\n![Hero: ${meta.seoTitle}](/images/hero/${heroSlug}.jpg)\n`;

      content = content.substring(0, frontmatterEnd) + newSection + fromHeading;
    }
  }

  // 3. Convert ### headings to ## (but not #### or deeper)
  content = content.replace(/^### /gm, '## ');

  // 4. Remove TODO comments
  content = content.replace(/\n<!-- TODO:.*?-->\n/g, '\n');
  content = content.replace(/<!-- TODO:.*?-->/g, '');

  // 5. Add callouts if not present
  if (!content.includes('> **Pro tip:**') && meta.callouts) {
    // Insert callouts at reasonable positions throughout the article
    const sections = content.split(/\n## /);
    if (sections.length > 3 && meta.callouts.length > 0) {
      // Add callouts distributed through the article
      const interval = Math.floor((sections.length - 1) / meta.callouts.length);
      let calloutIdx = 0;
      for (let i = 2; i < sections.length && calloutIdx < meta.callouts.length; i += Math.max(interval, 2)) {
        const callout = meta.callouts[calloutIdx];
        sections[i] = sections[i] + `\n> **${callout.type}:** ${callout.text}\n`;
        calloutIdx++;
      }
      content = sections.join('\n## ');
    }
  }

  // 6. Add step images if not present
  if (!content.includes('![Step 1:') && meta.stepImgs) {
    const sections = content.split(/\n## /);
    if (sections.length > 4) {
      const imgPositions = [
        Math.min(3, sections.length - 2),
        Math.min(Math.floor(sections.length / 2), sections.length - 2),
        Math.min(sections.length - 3, sections.length - 2),
      ];
      const captions = meta.stepCaptions || [
        `${meta.seoTitle} - setup`,
        `${meta.seoTitle} - process`,
        `${meta.seoTitle} - result`,
      ];
      for (let i = 0; i < Math.min(3, meta.stepImgs.length); i++) {
        const pos = imgPositions[i];
        if (pos < sections.length) {
          sections[pos] = sections[pos] + `\n![Step ${i + 1}: ${captions[i]}](/images/diagrams/${meta.stepImgs[i]}.jpg)\n`;
        }
      }
      content = sections.join('\n## ');
    }
  }

  // 7. Replace Conclusion with ending sections
  const conclusionMatch = content.match(/\n## Conclusion\n[\s\S]*$/);
  if (conclusionMatch) {
    const glossaryTerms = meta.glossary || [
      { term: 'Term 1', def: 'Definition 1' },
      { term: 'Term 2', def: 'Definition 2' },
      { term: 'Term 3', def: 'Definition 3' },
      { term: 'Term 4', def: 'Definition 4' },
      { term: 'Term 5', def: 'Definition 5' },
    ];
    const faqItems = meta.faq || [
      ['Question 1?', 'Answer 1'],
      ['Question 2?', 'Answer 2'],
      ['Question 3?', 'Answer 3'],
      ['Question 4?', 'Answer 4'],
      ['Question 5?', 'Answer 5'],
    ];
    const links = meta.links || [
      'Anatomy of a Book',
      'Tools Checklist: Soft vs. Hard Cover',
      'Grain Direction and Folding',
      'Adhesives 101: PVA vs. Paste',
    ];
    const heroSlug = meta.heroImg || meta.slug;
    const stepImgs = meta.stepImgs || ['step-1', 'step-2', 'step-3'];

    const endingSections = `
---

## Glossary

${glossaryTerms.map(g => `- **${g.term}:** ${g.def}`).join('\n')}

---

## FAQ

${faqItems.map(([q, a]) => `**${q}**\n${a}`).join('\n\n')}

---

## Suggested Internal Links

${links.map(l => `- ${l}`).join('\n')}

---

## Image Plan

- **Hero:** ${meta.seoTitle}
- **Step 1:** ${stepImgs[0] || 'Setup shot'}
- **Step 2:** ${stepImgs[1] || 'Process shot'}
- **Step 3:** ${stepImgs[2] || 'Result shot'}
`;

    content = content.replace(/\n## Conclusion\n[\s\S]*$/, endingSections);
  }

  await writeFile(filepath, content, 'utf-8');
  return filename;
}

async function main() {
  const allMeta = { ...SEO_DATA, ...REMAINING_FILES };
  const files = await readdir(DRAFTS_DIR);
  const mdFiles = files.filter(f => f.endsWith('.md'));

  let updated = 0;
  let skipped = 0;
  let errors = [];

  for (const file of mdFiles) {
    if (ALREADY_DONE.has(file)) {
      skipped++;
      continue;
    }

    const meta = allMeta[file];
    if (!meta) {
      console.log(`SKIP (no metadata): ${file}`);
      skipped++;
      continue;
    }

    try {
      await processFile(file, meta);
      console.log(`UPDATED: ${file}`);
      updated++;
    } catch (err) {
      console.error(`ERROR: ${file}: ${err.message}`);
      errors.push(file);
    }
  }

  console.log(`\nDone: ${updated} updated, ${skipped} skipped, ${errors.length} errors`);
  if (errors.length) console.log('Errors:', errors.join(', '));
}

main();
