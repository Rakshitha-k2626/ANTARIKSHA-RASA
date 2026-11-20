export interface ExperienceItem {
  id: string;
  index: string;
  title: string;
  sanskritSubtitle: string;
  description: string;
  extendedDetail: string;
  image: string;
  imageAlt: string;
  altitude: string;
  gravityProfile: string;
  panoramicArc: string;
  highlights: string[];
}

export interface DishItem {
  id: string;
  name: string;
  sanskritName: string;
  category: 'Main Orbital' | 'Micro-G Bites' | 'Elixirs' | 'Celestial Sweet';
  shortDescription: string;
  culinaryStory: string;
  image: string;
  imageAlt: string;
  containmentMethod: string;
  nutritionProfile: string;
  tastingNotes: string;
  servingTemp: string;
}

export interface OrderLineItem {
  dishId: string;
  dishName: string;
  category: string;
  quantity: number;
}

export interface SubmittedOrder {
  orderId: string;
  guestName: string;
  guestEmail: string;
  diningPod: string;
  notes: string;
  items: OrderLineItem[];
  totalItems: number;
  createdAt: string;
  status: string;
}

export interface WhyPillar {
  number: string;
  title: string;
  description: string;
  metricValue: string;
  metricUnit: string;
}

export interface OrbitalPod {
  id: string;
  name: string;
  sanskritName: string;
  capacity: string;
  gravityMode: string;
  vantage: string;
  orbitalWindow: string;
  description: string;
}

export const HERO_IMAGE =
  '/src/assets/images/hero_orbital_restaurant_1795167844464.jpg';

export const CLOSING_EARTH_IMAGE =
  '/src/assets/images/closing_earth_horizon_1795167844225.jpg';

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: 'orbital-dining',
    index: '01',
    title: 'ORBITAL DINING',
    sanskritSubtitle: 'कक्षीय भोज · Surya Dome',
    description:
      'Enjoy extraordinary meals while watching Earth rotate beneath you.',
    extendedDetail:
      'Suspended in low Earth orbit inside our brass-mandala observation ring, guests dine beside curved optical-grade silica domes as continents, oceans, and auroras sweep across the horizon every 92 minutes.',
    image: '/src/assets/images/exp_orbital_dining_1795167844848.jpg',
    imageAlt:
      'Luxury orbital dining table with golden lotus light overlooking the curved blue Earth',
    altitude: '408 km LEO',
    gravityProfile: '0.38g Centrifugal Ring',
    panoramicArc: '270° Horizon',
    highlights: [
      'Synchronized orbital sunrise and sunset tasting sequences',
      'Hand-forged brass lotus luminaires calibrated for dark adaptation',
      'Acoustically damped hull for serene fine-dining conversation',
    ],
  },
  {
    id: 'zero-gravity',
    index: '02',
    title: 'ZERO-GRAVITY EXPERIENCE',
    sanskritSubtitle: 'शून्य गुरुत्व · Chandra Salon',
    description:
      'Discover specially designed dining experiences in a zero-gravity environment.',
    extendedDetail:
      'Step into our weightless culinary salon where aromatic vapor domes, magnetic obsidian trays, and surface-tension gastronomy spheres hover effortlessly within reach.',
    image: '/src/assets/images/exp_zero_gravity_1795167846106.jpg',
    imageAlt:
      'Guests dining in a futuristic zero-gravity cabin with levitating luminous food spheres',
    altitude: '408 km Micro-G Core',
    gravityProfile: '0.00g True Weightlessness',
    panoramicArc: '180° Dual Hull',
    highlights: [
      'Magnetic induction platters keep utensils and vessels poised in place',
      'Surface-tension encapsulated broths burst cleanly on the palate',
      'Ergonomic flight-tailored seating anchors guests comfortably',
    ],
  },
  {
    id: 'galactic-view',
    index: '03',
    title: 'GALACTIC VIEW',
    sanskritSubtitle: 'नक्षत्र दर्शन · Nakshatra Gallery',
    description:
      'Experience breathtaking panoramic views of planets, stars and distant galaxies.',
    extendedDetail:
      'Oriented outward away from terrestrial glare, the Nakshatra Gallery frames unclouded deep-space nebulae, planetary rings, and the sweeping band of the Milky Way.',
    image: '/src/assets/images/exp_galactic_view_1795167844736.jpg',
    imageAlt:
      'Deep-space observatory dining room with cosmic nebulae and a ringed planet outside arched windows',
    altitude: 'Deep-Space Orientation',
    gravityProfile: '0.38g Stabilized',
    panoramicArc: '360° Celestial Vault',
    highlights: [
      'Zero atmospheric distortion for razor-sharp nebula and planetary viewing',
      'Indian geometric filigree mullions engineered from titanium-brass alloy',
      'Guided astronomical pairing notes synchronized to visible constellations',
    ],
  },
];

export const MENU_DISHES: DishItem[] = [
  {
    id: 'stellar-thali',
    name: 'Stellar Thali',
    sanskritName: 'नक्षत्र थाली',
    category: 'Main Orbital',
    shortDescription: 'A modern Indian-inspired space meal.',
    culinaryStory:
      'Seven precision-calibrated courses inspired by classical Indian regional flavors—Kashmiri saffron velouté, charred cardamom paneer medallions, blue pea kokum reduction, and edible 24k gold leaf—engineered for heightened taste perception in orbit.',
    image: '/src/assets/images/dish_stellar_thali_1795167845570.jpg',
    imageAlt:
      'Stellar Thali served on an iridescent circular magnetic platter with jewel-toned Indian courses',
    containmentMethod: 'Magnetic obsidian platter & surface-tension bowls',
    nutritionProfile: '640 kcal · 32g protein · Complete electrolytes',
    tastingNotes: 'Kashmiri saffron, smoked cardamom, kokum & roasted cumin',
    servingTemp: '62 °C',
  },
  {
    id: 'nebula-bites',
    name: 'Nebula Bites',
    sanskritName: 'नीहारिका ग्रास',
    category: 'Micro-G Bites',
    shortDescription: 'Colourful bite-sized nutritional treats.',
    culinaryStory:
      'Crystalline agar and botanical hydrocolloid spheres tinted naturally with saffron threads, blue spirulina, jamun berry, and turmeric nectar. Crumb-free by design so every bite releases layered spice aromatics directly on the tongue.',
    image: '/src/assets/images/dish_nebula_bites_1795167844544.jpg',
    imageAlt:
      'Colourful jewel-like Nebula Bites spheres and geometric bites on a dark basalt slate',
    containmentMethod: 'Micro-capillary slate adhesion & zero-crumb glaze',
    nutritionProfile: '280 kcal · Antioxidant phytonutrients · Omega-3',
    tastingNotes: 'Saffron citrus, blue spirulina mint, jamun & ginger blossom',
    servingTemp: '14 °C',
  },
  {
    id: 'galaxy-smoothie',
    name: 'Galaxy Smoothie',
    sanskritName: 'आकाशगंगा अमृत',
    category: 'Elixirs',
    shortDescription: 'A vibrant nutrient-rich drink.',
    culinaryStory:
      'Swirling bioluminescent bands of Alfonso mango puree, butterfly-pea flower, spirulina, and adaptogenic ashwagandha suspended inside a sculptural spiral borosilicate vessel engineered for effortless capillary sipping in microgravity.',
    image: '/src/assets/images/dish_galaxy_smoothie_1795167844798.jpg',
    imageAlt:
      'Galaxy Smoothie in a spiral borosilicate glass vessel with swirling violet, cyan, and gold layers',
    containmentMethod: 'Spiral borosilicate capillary flow & magnetic base',
    nutritionProfile: '310 kcal · Vitamin D3, B12 & adaptogenic botanicals',
    tastingNotes: 'Alfonso mango, butterfly pea, green cardamom & sea mineral',
    servingTemp: '6 °C',
  },
  {
    id: 'lunar-dessert',
    name: 'Lunar Dessert',
    sanskritName: 'चन्द्र मिष्टान्न',
    category: 'Celestial Sweet',
    shortDescription: 'A unique futuristic dessert.',
    culinaryStory:
      'A silver-dusted white chocolate and pistachio makhana sphere nestled inside a hand-spun saffron caramel planetary ring, served over roasted cacao soil with aromatic cardamom mist.',
    image: '/src/assets/images/dish_lunar_dessert_1795167845238.jpg',
    imageAlt:
      'Silver moon sphere surrounded by an amber spun-sugar planetary ring with aromatic mist',
    containmentMethod: 'Electrostatic glaze & stabilized spun-sugar ring',
    nutritionProfile: '390 kcal · Roasted lotus seed & raw cacao minerals',
    tastingNotes: 'Pistachio makhana, saffron caramel, rosewater & dark cacao',
    servingTemp: '18 °C',
  },
];

export const WHY_PILLARS: WhyPillar[] = [
  {
    number: '01',
    title: 'Specially engineered space-friendly dining',
    description:
      'Every vessel, utensil, and table surface uses magnetic stabilization and zero-crumb textures so meals remain poised in microgravity.',
    metricValue: '100%',
    metricUnit: 'Crumb-free containment',
  },
  {
    number: '02',
    title: 'Nutritionally balanced meals',
    description:
      'Formulated with aerospace nutritionists and Ayurvedic culinary masters to counter orbital taste-dulling and support bone and cellular vitality.',
    metricValue: '42',
    metricUnit: 'Essential micronutrients',
  },
  {
    number: '03',
    title: 'Innovative food packaging',
    description:
      'Recyclable titanium-quartz capsules and spiral capillary glassware preserve volatile spice aromatics without single-use orbital waste.',
    metricValue: '0',
    metricUnit: 'Single-use plastics',
  },
  {
    number: '04',
    title: 'Extraordinary views of Earth',
    description:
      'Watch sixteen orbital sunrises and sunsets daily across our curved panorama as continents, storms, and city constellations glide below.',
    metricValue: '16',
    metricUnit: 'Sunrises per day',
  },
  {
    number: '05',
    title: 'A unique experience beyond our planet',
    description:
      'Where timeless Indian hospitality—Atithi Devo Bhava—meets the silence and majesty of outer space.',
    metricValue: '408',
    metricUnit: 'km above Earth',
  },
];

export const ORBITAL_PODS: OrbitalPod[] = [
  {
    id: 'surya-dome',
    name: 'Surya Dome Pod',
    sanskritName: 'सूर्य मण्डप',
    capacity: '2–4 Guests',
    gravityMode: '0.38g Centrifugal Ring',
    vantage: 'Earth Limb & Orbital Sunrise',
    orbitalWindow: 'Orbit Cycle 04 · 19:30 UTC',
    description:
      'Curved panoramic window tables directly facing Earth’s luminous horizon with warm brass lotus acoustics.',
  },
  {
    id: 'chandra-salon',
    name: 'Chandra Zero-G Salon',
    sanskritName: 'चन्द्र कक्ष',
    capacity: '2–6 Guests',
    gravityMode: '0.00g Microgravity',
    vantage: 'Dual Horizon & Floating Service',
    orbitalWindow: 'Orbit Cycle 07 · 22:15 UTC',
    description:
      'Full weightless dining experience featuring magnetic obsidian trays and levitating aromatic spheres.',
  },
  {
    id: 'nakshatra-alcove',
    name: 'Nakshatra Observatory Alcove',
    sanskritName: 'नक्षत्र दीर्घा',
    capacity: '2 Guests',
    gravityMode: '0.38g Stabilized',
    vantage: 'Deep-Space Nebulae & Starfield',
    orbitalWindow: 'Orbit Cycle 11 · 02:40 UTC',
    description:
      'Intimate zenith-facing sanctuary designed for uninterrupted deep-space nebula observation.',
  },
];
