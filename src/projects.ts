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
      'Front and back pouch packaging for plantain chips, combining product imagery, brand identity, and clear information layout.',
    images: [frame(2)],
  },
  {
    id: 'flores-afolabi',
    title: 'Flores & Afolabi — Gift Bag',
    category: 'Print & events',
    description:
      'A wedding gift bag with coordinated floral details, a warm color palette, and personalised event typography.',
    images: [frame(3)],
  },
  {
    id: 'jemilat-oluwafemi',
    title: 'Jemilat & Oluwafemi — Wedding Suite',
    category: 'Print & events',
    description:
      'Coordinated wedding keepsakes, shown across a personalised notebook and event wristbands.',
    images: [frame(4), frame(12)],
  },
  {
    id: 'asa-fufu',
    title: 'Àsà — Fufu Powder',
    category: 'Packaging',
    description:
      'A complete front and back food packaging presentation with a bold yellow identity and organised product information.',
    images: [frame(5), frame(9)],
  },
  {
    id: 'wedding-notebook',
    title: 'Wedding Keepsake Notebook',
    category: 'Print & events',
    description:
      'A spiral-bound wedding keepsake combining photographs, soft color, and a thank-you message.',
    images: [frame(6)],
  },
  {
    id: 'good-luck',
    title: 'Emmy Formula — Good Luck',
    category: 'Packaging',
    description:
      'Product label design with a distinctive green identity, prominent product naming, and a clear information hierarchy.',
    images: [frame(7)],
  },
  {
    id: 'energie',
    title: 'Emmy Formula — Énergie',
    category: 'Packaging',
    description:
      'A product label presentation using a magenta and gold palette, bold typography, and botanical imagery.',
    images: [frame(8)],
  },
  {
    id: 'blessing-moyosore',
    title: 'Blessing & Moyosore — Event Collection',
    category: 'Print & events',
    description:
      'A coordinated wedding identity applied to gold and white wristbands and branded cups. Explore all three views.',
    images: [frame(10), frame(11), frame(14)],
  },
  {
    id: 'sarry-wig',
    title: 'Sarry Wig — Branded T-Shirt',
    category: 'Merchandise',
    description:
      'Promotional clothing with a vibrant pink and black composition, portrait imagery, and brand messaging.',
    images: [frame(13)],
  },
  {
    id: 'solar-banner',
    title: 'Solar Energy — Roll-up Banner',
    category: 'Print & events',
    description:
      'A large-format promotional banner balancing product photography, specifications, and contact information.',
    images: [frame(15)],
  },
  {
    id: 'birthday-banner',
    title: 'Angel on Earth — Birthday Banner',
    category: 'Print & events',
    description:
      'A portrait-led celebration banner with warm gold tones and expressive event typography.',
    images: [frame(16)],
  },
  {
    id: 'udalice-pepper',
    title: 'Udalice — Wahala Hot Pepper',
    category: 'Packaging',
    description:
      'Front and back sachet packaging combining vivid ingredient imagery with brand and product information.',
    images: [frame(17)],
  },
  {
    id: 'memorial-notebook',
    title: 'Memorial Keepsake Notebook',
    category: 'Print & events',
    description:
      'A commemorative notebook cover with a considered portrait layout, warm colors, and clear tribute typography.',
    images: [frame(18)],
  },
  {
    id: 'westerham',
    title: 'Westerham — Branded T-Shirts',
    category: 'Merchandise',
    description:
      'Brand applications for education and migration services, arranged for clarity and recognition on clothing.',
    images: [frame(19)],
  },
  {
    id: 'super-farmer',
    title: 'Super Farmer — Garri',
    category: 'Packaging',
    description:
      'A coordinated front and back food pouch design with a green brand palette and prominent product naming.',
    images: [frame(20)],
  },
  {
    id: 'gellas-rosemary',
    title: 'Gellas Food — Dried Rosemary',
    category: 'Packaging',
    description:
      'Herb sachet packaging with a fresh green visual identity, ingredient imagery, and an organised back panel.',
    images: [frame(21)],
  },
  {
    id: 'joyful-gele',
    title: 'Joyful Gele — Gift Bag',
    category: 'Print & events',
    description:
      'A branded shopping bag pairing a black and gold palette with product portraits and contact details.',
    images: [frame(22)],
  },
  {
    id: 'snowbliss',
    title: 'Snowbliss — Icing Sugar',
    category: 'Packaging',
    description:
      'Food packaging with a blue and white identity, product-led imagery, and a clear visual hierarchy.',
    images: [frame(23)],
  },
  {
    id: 'birthday-pillow',
    title: 'Birthday Keepsake Pillow',
    category: 'Merchandise',
    description:
      'A personalised textile print combining portrait photography, a celebratory message, and gold decorative details.',
    images: [frame(24)],
  },
  {
    id: 'celebration-brochure',
    title: 'Celebration of Life — Brochure',
    category: 'Print & events',
    description:
      'An editorial spread that brings family photography and commemorative storytelling into a cohesive printed layout.',
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
      'Logo designs for Lagos Golden Hearts Lions Club, Healthy Choice Farm, Adex Animal Farms, AfriPhoneReaders, and Akoto, presented in the second supplied branding slide.',
    images: ['/resources/branding-slide-2.jpg'],
  },
  {
    id: 'blinders-cut',
    title: 'Blinders Cut — Brand Identity',
    category: 'Branding',
    description:
      'A barbering identity shown through logo variations, a repeating brand pattern, and merchandise applications.',
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
