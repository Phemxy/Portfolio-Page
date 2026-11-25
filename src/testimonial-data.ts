export interface ClientTestimonial {
  quote: string;
  client: string;
  role?: string;
  service: string;
  avatarUrl?: string;
}

// Reviews and attributions supplied by the portfolio owner.
export const clientTestimonials: ClientTestimonial[] = [
  {
    quote:
      'Working with Phemxy was a seamless experience from start to finish. He quickly understood our brand vision at Abatox Global and delivered clean, sharp visual work ahead of schedule. His creativity and professionalism elevated our brand presentation across the board.',
    client: 'Abatox Global',
    role: 'Management Team',
    service: 'Branding',
  },
  {
    quote:
      'Phemxy brought an exceptional eye for detail and print-ready precision to our projects at OK Prints. Every layout, color palette, and revision was handled promptly, and the final designs translated flawlessly onto physical print.',
    client: 'Mr. John',
    role: 'CEO of OK Prints',
    service: 'Print design',
  },
  {
    quote:
      'Phemxy is my go-to designer for wedding souvenirs and event branding. He always captures the exact theme, colors, and elegance my clients want—turning simple ideas into cohesive, memorable keepsakes that guests genuinely love.',
    client: 'Mrs. Jemilat',
    role: 'Wedding Souvenirs & Event Branding',
    service: 'Event branding',
  },
];
