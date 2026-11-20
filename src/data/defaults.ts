import yuktaKalakarPlumImg from '../assets/images/yukta_founder_plum_cutout.png';
import heroBridalHandsWideImg from '../assets/images/hero_bridal_hands_wide_1794581307913.jpg';
import heroBridalPalmsWideImg from '../assets/images/hero_slide_bridal_palms_wide_1794581887130.jpg';
import heroPortraitArtWideImg from '../assets/images/hero_slide_portrait_art_wide_1794581887537.jpg';
import conesStorySoftImg from '../assets/images/cones_transparent_floating.png';
import storyMehndiSilkImg from '../assets/images/story_mehndi_silk_backdrop_1794854096978.jpg';
import footerMehndiHandsImg from '../assets/images/footer_mehndi_hands_backdrop_1794853528331.jpg';
import serviceBridalWideImg from '../assets/images/service_bridal_wide_1794581888756.jpg';
import serviceArabicWideImg from '../assets/images/hero_arabic_lotus_plum_wide_1794860240922.jpg';
import royalStoryBridalWideImg from '../assets/images/royal_story_bridal_nobangles_wide_1794942026899.jpg';
import bridalElephantImg from '../assets/images/portfolio_elephant_plum_cloth_1794585346239.jpg';
import portraitTreeImg from '../assets/images/portfolio_portrait_tree_plum_cloth_1794585378334.jpg';
import festivePalmImg from '../assets/images/portfolio_festive_floral_nobangles_plum_1794857129987.jpg';
import peacockJharokhaImg from '../assets/images/portfolio_peacock_jharokha_plum_cloth_1794585381306.jpg';
import studioLotusDoublePalmsImg from '../assets/images/portfolio_lotus_palms_plum_cloth_1794585349134.jpg';
import studioMandalaBackHandImg from '../assets/images/portfolio_mandala_back_plum_cloth_1794585377079.jpg';
import studioBanglePalmImg from '../assets/images/portfolio_bangle_palm_plum_cloth_1794585379772.jpg';
import bridalSmileWineImg from '../assets/images/portfolio_bridal_smile_wine_velvet_1794584137471.jpg';
import bridalBlueSareePlumImg from '../assets/images/bridal_blue_saree_plum_theme_1794939369295.jpg';
import { PortfolioItem, ServiceItem, SiteProfile } from '../types';

export const YUKTA_RETOUCHED_PORTRAIT = yuktaKalakarPlumImg;
export const HERO_WIDE_IMAGE = heroBridalHandsWideImg;
export const STORY_CONES_WHITE_IMAGE = conesStorySoftImg;
export const STORY_MEHNDI_BACKDROP_IMAGE = storyMehndiSilkImg;
export const FOOTER_MEHNDI_BACKDROP_IMAGE = footerMehndiHandsImg;
export const HERO_SLIDE_IMAGES = [
  {
    src: heroBridalHandsWideImg,
    alt: 'Bridal and bridesmaid hands adorned with intricate maroon mehndi mandalas',
    label: 'Bridal Collectives',
  },
  {
    src: heroBridalPalmsWideImg,
    alt: 'Indian bride holding out intricate twin peacock and jharokha bridal mehndi palms',
    label: 'Heritage Bridal',
  },
  {
    src: heroPortraitArtWideImg,
    alt: 'Finely sketched miniature bride and groom portrait mehndi along graceful forearms',
    label: 'Portrait Artistry',
  },
  {
    src: serviceBridalWideImg,
    alt: 'Full forearm royal elephant and scalloped jharokha bridal mehndi on plum silk saree',
    label: 'Royal Bridal',
  },
  {
    src: serviceArabicWideImg,
    alt: 'Bridesmaid hands adorned with flowing lotus and leafy Arabic mehndi trails over royal plum silk',
    label: 'Floral Trails',
  },
];
export const CLIENT_BRIDAL_SMILE_PHOTO = bridalSmileWineImg;

export const DEFAULT_SITE_PROFILE: SiteProfile = {
  artistName: 'Yukta Solanki',
  studioLocation: 'Gotri, Vadodara, Gujarat',
  artistBio:
    'Founder and lead mehndi artist at Yuk Creation in Gotri, Vadodara. Specialising in heirloom bridal stories, miniature couple portraits, and delicate botanical henna crafted with freshly sifted organic Sojat cones.',
  artistImageUrl: yuktaKalakarPlumImg,
  whatsappNumber: '916351231599',
  instagramHandle: 'yuk_creation12',
  seeded: true,
};

export const DEFAULT_PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'royal-elephant-bridal',
    title: 'Royal Elephant & Jharokha Bridal',
    category: 'Bridal Mehndi',
    imageUrl: bridalElephantImg,
    caption:
      'Full-palm and wrist bridal composition featuring royal elephants, architectural jharokha domes, and lotus fingertips.',
    featured: true,
    sortOrder: 1,
  },
  {
    id: 'lotus-jaal-double-palms',
    title: 'Lotus Jaal & Scalloped Bridal Palms',
    category: 'Bridal Mehndi',
    imageUrl: studioLotusDoublePalmsImg,
    caption:
      'Intricate bridal palms combining layered lotus buds, fine diagonal jaal lattice, and delicate leafy wrist cuffs.',
    featured: true,
    sortOrder: 2,
  },
  {
    id: 'bridal-story-portrait',
    title: 'Bride Silhouette & Sacred Tree',
    category: 'Portrait Mehndi',
    imageUrl: portraitTreeImg,
    caption:
      'Hand-drawn bridal figure paired with a sacred courtyard tree motif and fine architectural borders.',
    featured: true,
    sortOrder: 3,
  },
  {
    id: 'mandala-back-hand-study',
    title: 'Circular Mandala & Leafy Fingers',
    category: 'Engagement Mehndi',
    imageUrl: studioMandalaBackHandImg,
    caption:
      'Symmetrical circular floral mandalas on the back of both hands with delicate botanical finger detailing.',
    featured: true,
    sortOrder: 4,
  },
  {
    id: 'bangle-palm-contemporary',
    title: 'Floral Chakra & Grid Palm',
    category: 'Arabic Mehndi',
    imageUrl: studioBanglePalmImg,
    caption:
      'Flowing geometric checks paired with bold circular floral motifs and delicate bracelet cuffs.',
    featured: true,
    sortOrder: 5,
  },
  {
    id: 'peacock-jharokha-symmetry',
    title: 'Twin Peacock Jharokha Palms',
    category: 'Bridal Mehndi',
    imageUrl: peacockJharokhaImg,
    caption:
      'Mirrored peacocks framed under scalloped arches with intricate wrist cuffs and fine vine borders.',
    featured: true,
    sortOrder: 6,
  },
  {
    id: 'floral-mandala-engagement',
    title: 'Festive Floral Mandala Palm',
    category: 'Engagement Mehndi',
    imageUrl: festivePalmImg,
    caption:
      'Rich floral centrepiece mandala surrounded by fine leafy vines and layered wrist bands.',
    featured: false,
    sortOrder: 7,
  },
  {
    id: 'pastel-celebration-arabic',
    title: 'Minimalist Bridal Hand Detail',
    category: 'Arabic Mehndi',
    imageUrl: CLIENT_BRIDAL_SMILE_PHOTO,
    caption:
      'Graceful back-of-hand floral mandala and delicate finger detailing photographed in natural celebration light.',
    featured: false,
    sortOrder: 8,
  },
  {
    id: 'bridal-portrait-saree-grace',
    title: 'Bridal Veil & Portrait Hand',
    category: 'Portrait Mehndi',
    imageUrl: bridalBlueSareePlumImg,
    caption:
      'Hand-drawn veiled bridal portrait nestled inside fine geometric checks along the back of the hand, styled in celebration grace.',
    featured: true,
    sortOrder: 9,
  },
];

export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 'bridal-mehndi-ceremony',
    title: 'Classic Bridal Mehndi',
    summary:
      'Elbow-length bridal mehndi with 2 figures of your choice (Dhol, Kalash, Logo, Peacock, small Elephant) and leg coverage from ankle to 3 fingers up.',
    duration: '5 – 6.5 Hours',
    startingPrice: '₹21,000/-',
    imageUrl: serviceBridalWideImg,
    highlights: [
      'Elbow-length full bridal hands',
      '2 figures of choice · Leg ankle to 3 fingers up',
      'Pure organic Sojat henna · Extra figure +₹5,000/-',
    ],
    active: true,
    sortOrder: 1,
  },
  {
    id: 'portrait-mehndi-storytelling',
    title: 'Portrait Bridal Mehndi',
    summary:
      'Detailed portrait bridal mehndi featuring 2 bespoke hand-drawn portraits woven seamlessly into elbow-length floral and architectural symmetry.',
    duration: '6 – 7.5 Hours',
    startingPrice: '₹25,000/-',
    imageUrl: heroPortraitArtWideImg,
    highlights: [
      'Inclusive of 2 bespoke portraits',
      'Elbow-length symmetry & ankle leg coverage',
      'Advance sketch consultation before ceremony',
    ],
    active: true,
    sortOrder: 2,
  },
  {
    id: 'custom-minimal-mehndi',
    title: 'Royal Custom Story Bridal',
    summary:
      'Bespoke luxury bridal mehndi inclusive of 4 different custom figures tailored to your love story—skyline, royal palaces, beaches, and meaningful landmarks.',
    duration: '7 – 9 Hours',
    startingPrice: '₹31,000/-',
    imageUrl: royalStoryBridalWideImg,
    highlights: [
      'Inclusive of 4 different custom figures',
      'Custom skyline, royal palaces & beach story motifs',
      'Full elbow hands + extended leg length option',
    ],
    active: true,
    sortOrder: 3,
  },
  {
    id: 'engagement-roka-mehndi',
    title: 'Family & Friends Heavy Mehndi',
    summary:
      'Heavy festive mehndi for family and friends crafted exclusively by Yukta & team—from palm-to-3-fingers elegance (₹5,000/-) up to full elbow length (₹15,000/-).',
    duration: '1.5 – 4 Hours',
    startingPrice: '₹5,000/- – ₹15,000/-',
    imageUrl: heroBridalHandsWideImg,
    highlights: [
      'Palm to 3 fingers: ₹5,000/-',
      'Elbow length heavy design: ₹15,000/-',
      'Exclusively by Yukta Solanki & team',
    ],
    active: true,
    sortOrder: 4,
  },
  {
    id: 'arabic-guest-mehndi',
    title: 'Bridesmaids & Sangeet Collective',
    summary:
      'Graceful floral trails, chakra mandalas, and modern Indo-Arabic designs coordinated smoothly for bridesmaids and Sangeet guests.',
    duration: 'Yukta & Team',
    startingPrice: '₹5,000/- – ₹15,000/-',
    imageUrl: serviceArabicWideImg,
    highlights: [
      'Palm-to-finger & elbow-length tier choices',
      'Synchronized team for Sangeet evenings',
      '100% chemical-free freshly blended henna',
    ],
    active: true,
    sortOrder: 5,
  },
];

export const PREFERRED_TIME_SLOTS = [
  'Morning (9:00 AM – 12:00 PM)',
  'Afternoon (12:30 PM – 3:30 PM)',
  'Evening (4:00 PM – 7:00 PM)',
  'Flexible / Full-Day Bridal Slot',
] as const;

export const PORTFOLIO_GRID_FALLBACK = {
  artistPortraitImg: yuktaKalakarPlumImg,
  bridalMehndiImg: peacockJharokhaImg,
  portraitMehndiImg: portraitTreeImg,
  arabicMehndiImg: studioBanglePalmImg,
  engagementMehndiImg: studioMandalaBackHandImg,
  customMehndiImg: peacockJharokhaImg,
};
