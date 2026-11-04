import { 
  CreditCard, 
  GraduationCap, 
  CalendarDays, 
  Award
} from 'lucide-react';

export const benefitsData = {
  hero: {
    tagline: "Once a Wesleyanian, Always a Wesleyanian!",
    title: "WUP Alumni Benefits & Privileges",
    subtitle: "Your journey with Wesleyan University–Philippines does not end at graduation. As a proud WUP graduate, you remain part of a growing community that values your achievements, supports your growth, and provides opportunities to stay connected with the university.",
    prompt: "Explore the benefits and privileges available to WUP alumni."
  },
  benefits: [
    {
      id: "alumni-id",
      title: "WUP Alumni Identification Card",
      category: "Identity & Campus Access",
      icon: CreditCard,
      description: "Alumni may obtain an official WUP Alumni ID as proof of their connection and membership in the Wesleyan University–Philippines alumni community.",
      howToAvail: {
        label: "How to Avail",
        instruction: "Contact the WUP Alumni Office for application procedures, photo submission guidelines, and card issuance requirements."
      },
      tag: "Official ID"
    },
    {
      id: "scholarship-discount",
      title: "Scholarship Discount for Children of Alumni",
      category: "Educational Grant",
      icon: GraduationCap,
      description: "Children of qualified WUP alumni may enjoy scholarship discounts on tuition fees when enrolling at Wesleyan University–Philippines, subject to the university's scholarship guidelines and eligibility requirements.",
      howToAvail: {
        label: "How to Avail",
        instruction: "Inquire with the Admissions Office regarding the required documents, proof of alumni relationship, and application process."
      },
      tag: "Tuition Privilege"
    },
    {
      id: "events-reunions",
      title: "Alumni Events and Reunions",
      category: "Community & Networking",
      icon: CalendarDays,
      description: "Stay connected with fellow graduates through alumni homecomings, batch reunions, university celebrations, and other special institutional gatherings.",
      howToAvail: {
        label: "How to Participate",
        instruction: "Watch for announcements regarding upcoming alumni events and register directly through the GATE portal or the Alumni Office."
      },
      tag: "Community"
    },
    {
      id: "recognition-engagement",
      title: "Alumni Recognition and Engagement",
      category: "Honors & Achievements",
      icon: Award,
      description: "Celebrate your achievements and remain involved in the university community. Alumni may have opportunities to be recognized for their professional accomplishments and notable contributions.",
      howToAvail: {
        label: "How to Participate",
        instruction: "Share your career milestones, board exam passes, promotions, and achievements with the university through your profile and updates."
      },
      tag: "Recognition"
    }
  ],
  footer: {
    heading: "Stay Connected with Wesleyan!",
    message: "Your relationship with Wesleyan University–Philippines continues beyond graduation. Keep your information updated, stay informed about university announcements, and take advantage of the opportunities available to you as a proud Wesleyanian.",
    contactNote: "For more information, please contact the WUP Alumni Office."
  }
};
