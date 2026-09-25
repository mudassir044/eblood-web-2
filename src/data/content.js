import { Activity, UserPlus, MapPin, Bell, Users, Heart, Tent } from 'lucide-react'

// Replace with the real Play Store listing URL once confirmed
export const LINKS = {
  playStore: 'https://play.google.com/store/search?q=eblood&c=apps',
  phone: '+923438997337',
  phoneLabel: '+92-3438997337',
  email: 'nafeeshusain155@gmail.com',
  whatsapp: '923438997337',
  site: 'https://eblood.com.pk',
}

export const SOCIAL = [
  { label: 'Facebook', href: 'https://www.facebook.com/eblood.com.pk/' },
  { label: 'Instagram', href: 'https://www.instagram.com/eblood.com.pk/' },
  { label: 'LinkedIn', href: 'https://pk.linkedin.com/company/e-blood' },
]

export const NAV = [
  { id: 'home', label: 'Home', to: '/#home' },
  { id: 'about', label: 'About', to: '/#about' },
  { id: 'features', label: 'Features', to: '/#features' },
  { id: 'how-it-works', label: 'How It Works', to: '/#how-it-works' },
  { id: 'reviews', label: 'Reviews', to: '/#reviews' },
  { id: 'blog', label: 'Blog', to: '/blog' },
]

export const TICKER = [
  'IMPORTANT: Blood donation is always FREE. Never pay anyone for it.',
  'If anyone demands money for blood, report and refuse immediately.',
  'One donation can save up to 3 lives. Be a hero, donate freely.',
]

export const STATS = [
  { value: 2000, suffix: '+', label: 'Registered donors', icon: Users },
  { value: 220, suffix: '+', label: 'Lives saved', icon: Heart },
  { value: 5, suffix: '+', label: 'Blood camps', icon: Tent },
]

export const FEATURES = [
  { icon: Activity, title: 'Real-Time Blood Requests', body: 'View urgent blood requests in your area. Filter by blood group, location, urgency, and hospital.' },
  { icon: UserPlus, title: 'Register as Donor', body: 'Sign up as a donor in seconds. Your profile helps match you with patients who need your blood type.' },
  { icon: MapPin, title: 'Nearby Locator', body: 'GPS-based map to find nearby donors or hospitals. Get direct route and contact info instantly.' },
  { icon: Bell, title: 'Emergency Alerts', body: 'Push notifications for rare and emergency blood types. Never miss a chance to save a life.' },
]

export const STEPS = [
  { title: 'Download the App', body: "Get Eblood from the Google Play Store. It's fast, free, and takes less than a minute to install." },
  { title: 'Register & Set Up', body: "Create your profile with your blood type, location, and contact details. You're ready to help." },
  { title: 'Save Lives', body: 'Respond to blood requests near you or post a request when someone you know urgently needs blood.' },
]

export const GUIDE = {
  left: [
    { title: 'Create Blood Request', body: 'Post a request for any blood group from the home screen.' },
    { title: 'Blood Bank', body: 'Find nearby blood banks, book an appointment, and donate easily.' },
    { title: 'Feed', body: 'See all blood requests in one place.' },
    { title: 'Home', body: 'Your main screen.' },
  ],
  right: [
    { title: 'Notification Details', body: 'Alerts for new requests near you.' },
    { title: 'Emergency Help', body: 'Find the nearest police station.' },
    { title: 'Switch', body: 'Change between Donor and Taker mode.' },
    { title: 'Chat', body: 'Message between Donor and Taker.' },
    { title: 'Account', body: 'Your profile details.' },
  ],
}

export const SLIDES = [
  { src: '/images/the-quranic-verse-about-blood-donation.jpg', caption: "And whoever saves one, it is as if he had saved mankind entirely (Surah Al-Ma'idah, Verse 32)" },
  { src: '/images/app-mock-home.jpg', caption: 'Donate blood, save lives, serve humanity' },
  { src: '/images/blood-donor-is-one-step-away-from-you.jpg', caption: 'Sign up today, quick and easy' },
  { src: '/images/app-mock-post-a-request-mockup.jpg', caption: 'Get required blood from the tips of your hand' },
  { src: '/images/app-mock-showing-request.jpg', caption: 'To contact the blood request person, accept a request' },
  { src: '/images/app-mock-easy-navigation-between-blood-donors-and-receivers.jpg', caption: 'Easy navigation between blood donor and receiver' },
  { src: '/images/app-mock-view-blood-requests-notifications.jpg', caption: 'View blood request notifications' },
]

export const PARTNERS = [
  { name: 'CPE Islamabad', src: '/images/cpe-islamabad.jpg' },
  { name: 'Fatimid Foundation', src: '/images/fatimid-foundation.jpg' },
  { name: 'Jamila Sultana Foundation', src: '/images/jamila-sultana-foundation.jpg' },
  { name: 'PM Youth Programme', src: '/images/prime-miniters-youth-prog.jpg' },
  { name: 'SAM Life Savers', src: '/images/sam-life-savers.jpg' },
  { name: 'Crisp n Spice', src: '/images/crisp-and-spice.jpg' },
]

export const STORIES = [
  { name: 'Ahmed', city: 'Islamabad', quote: 'My uncle needed O-negative blood urgently for his operation at Shifa International Hospital in Islamabad. We were desperate until we used Eblood...' },
  { name: 'Saima', city: 'Lahore', quote: "I needed urgent blood for my mother's surgery and was extremely worried. Someone told me about E Blood. I registered and found a donor immediately..." },
  { name: 'Usman', city: 'Karachi', quote: "Our friend's daughter, a thalassemia patient, urgently needed O-positive blood. Time was critical. I used the Eblood app to connect with a donor..." },
]

export const CITIES = [
  { en: 'Islamabad', ur: 'اسلام آباد' },
  { en: 'Rawalpindi', ur: 'راولپنڈی' },
  { en: 'Lahore', ur: 'لاہور' },
  { en: 'Karachi', ur: 'کراچی' },
  { en: 'Peshawar', ur: 'پشاور' },
  { en: 'Quetta', ur: 'کوئٹہ' },
  { en: 'Multan', ur: 'ملتان' },
  { en: 'Faisalabad', ur: 'فیصل آباد' },
]
