export type ProjectCategory =
  'Packaging' | 'Print & events' | 'Merchandise' | 'Branding';

export interface PortfolioProject {
  id: string;
  title: string;
  category: ProjectCategory;
  description: string;
  images: string[];
}

const uploadedResources =
  'https://phemxy-kreative-designer-nvp0aa.v2.appdeploy.ai/resources';
const frame = (number: number) =>
  `${uploadedResources}/frame-${String(number).padStart(2, '0')}.jpg`;

export const projects: PortfolioProject[] = [
  {
    id: 'gellas-plantain',
    title: 'Gellas Food — Plantain Chips',
    category: 'Packaging',
    description:
      'Plantain chip pouch design showing the front artwork and back product-information panel.',
    images: [frame(14)],
  },
  {
    id: 'flores-afolabi',
    title: 'Flores & Afolabi — Gift Bag',
    category: 'Print & events',
    description:
      'Wedding gift-bag design with personalised names, event dates, floral artwork, and a ring motif.',
    images: [frame(13)],
  },
  {
    id: 'jemilat-oluwafemi',
    title: 'Jemilat & Oluwafemi — Wedding Suite',
    category: 'Print & events',
    description:
      'Wedding keepsake designs for Jemilat and Oluwafemi, shown on a personalised notebook and access wristbands.',
    images: [frame(15), frame(6)],
  },
  {
    id: 'asa-fufu',
    title: 'Àsà — Fufu Powder',
    category: 'Packaging',
    description:
      'Front and back pouch artwork for Àsà Pure Cassava Fufu Powder.',
    images: [frame(16), frame(18)],
  },
  {
    id: 'wedding-notebook',
    title: 'Wedding Keepsake Notebook',
    category: 'Print & events',
    description:
      'A photo-based wedding souvenir notebook with a thank-you cover design.',
    images: [frame(17)],
  },
  {
    id: 'good-luck',
    title: 'Good Luck — Sachet Packaging',
    category: 'Packaging',
    description:
      'Sachet packaging artwork for Good Luck, using green botanical graphics and bold product lettering.',
    images: [frame(20)],
  },
  {
    id: 'energie',
    title: 'Énergie Sexuel — Sachet Packaging',
    category: 'Packaging',
    description:
      'Sachet packaging artwork for Énergie Sexuel, with a magenta, black, and gold layout.',
    images: [frame(19)],
  },
  {
    id: 'blessing-moyosore',
    title: 'Blessing & Moyosoreoluwa — Wedding Keepsakes',
    category: 'Print & events',
    description:
      'Gold and white wedding wristband designs and matching cup artwork for Blessing and Moyosoreoluwa.',
    images: [frame(2), frame(3), frame(5)],
  },
  {
    id: 'sarry-wig',
    title: 'Sarry Wig — Branded T-Shirt',
    category: 'Merchandise',
    description:
      'Promotional T-shirt artwork for a wig brand, combining its logo, a portrait, and brand messaging.',
    images: [frame(4)],
  },
  {
    id: 'solar-banner',
    title: 'Solar Energy — Roll-up Banner',
    category: 'Print & events',
    description:
      'Roll-up banner design for a solar-energy business, displaying products, specifications, and contact information.',
    images: [frame(7)],
  },
  {
    id: 'birthday-banner',
    title: 'Angel on Earth — Birthday Banner',
    category: 'Print & events',
    description:
      'Birthday roll-up banner featuring a portrait, the Angel on Earth heading, and a personalised birthday message.',
    images: [frame(8)],
  },
  {
    id: 'udalice-pepper',
    title: 'Udalice — Wahala Hot Pepper',
    category: 'Packaging',
    description: 'Front and back sachet artwork for Udalice Wahala Hot Pepper.',
    images: [frame(9)],
  },
  {
    id: 'memorial-notebook',
    title: 'Memorial Keepsake Notebook',
    category: 'Print & events',
    description:
      'Memorial notebook cover featuring a portrait, tribute text, and commemorative details.',
    images: [frame(10)],
  },
  {
    id: 'westerham',
    title: 'Westerham — Branded T-Shirts',
    category: 'Merchandise',
    description:
      'Promotional T-shirt artwork for Westerham Education and Migration Limited.',
    images: [frame(11)],
  },
  {
    id: 'super-farmer',
    title: 'Super Farmer — Garri',
    category: 'Packaging',
    description: 'Front and back pouch artwork for Super Farmer white garri.',
    images: [frame(12)],
  },
  {
    id: 'gellas-rosemary',
    title: 'Gellas Food — Dried Rosemary',
    category: 'Packaging',
    description:
      'Front and back sachet artwork for Gellas Food dried rosemary.',
    images: [frame(21)],
  },
  {
    id: 'joyful-gele',
    title: 'Joyful Gele — Gift Bag',
    category: 'Print & events',
    description:
      'Shopping-bag artwork for Joyful Gele, with brand imagery and contact details.',
    images: [frame(22)],
  },
  {
    id: 'snowbliss',
    title: 'Snowbliss — Icing Sugar',
    category: 'Packaging',
    description:
      'Pouch packaging artwork for Snowbliss icing sugar, using a blue and white layout and cupcake imagery.',
    images: [frame(23)],
  },
  {
    id: 'birthday-pillow',
    title: 'Birthday Keepsake Pillow',
    category: 'Merchandise',
    description:
      'Birthday throw-pillow artwork with personalised portraits, a birthday message, and gold decorative elements.',
    images: [frame(24)],
  },
  {
    id: 'celebration-brochure',
    title: 'Celebration of Life — Brochure',
    category: 'Print & events',
    description:
      'A commemorative brochure spread arranging family photographs and captions across facing pages.',
    images: [frame(25)],
  },
  {
    id: 'business-identities',
    title: 'Business Identity Collection',
    category: 'Branding',
    description:
      'Logo work for food, events, automotive, technical, and healthcare businesses, selected from the original portfolio.',
    images: ['/resources/branding-slide-1.jpg'],
  },
  {
    id: 'community-identities',
    title: 'Community & Farm Identity Collection',
    category: 'Branding',
    description:
      'A collection of logos for a Lions Club, farms, and reading platforms, presented in the supplied branding slide.',
    images: ['/resources/branding-slide-2.jpg'],
  },
  {
    id: 'blinders-cut',
    title: 'Blinders Cut — Brand Identity',
    category: 'Branding',
    description:
      'Blinders Cut brand artwork showing logo variations, a repeating pattern, and merchandise applications.',
    images: ['/resources/pdf-blinders-cut.jpg'],
  },
  {
    id: 'event-flyers',
    title: 'RCCG NLA — Event Flyers',
    category: 'Print & events',
    description:
      'A selection of appreciation and event communication designs from the original portfolio.',
    images: ['/resources/pdf-event-flyers.jpg'],
  },
  {
    id: 'wedding-programme',
    title: 'Ruth & Olanipekun — Wedding Programme',
    category: 'Print & events',
    description:
      'A wedding programme using a coordinated navy and peach palette with personalised typography and a decorative monogram.',
    images: ['/resources/pdf-wedding-programme.jpg'],
  },
];
