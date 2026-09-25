import { GROUPS, CAN_GIVE_TO, canReceiveFrom } from '../lib/blood'

/*
  Blog posts. Each body is a list of blocks:
  ['p', text] | ['h2', text] | ['ul', [items]] | ['callout', text] |
  ['table', { head, rows }] | ['cta', { to, label }]
  Newest post first. Starter posts: have a medical advisor review before launch.
*/

const words = (body) =>
  body
    .map(([, v]) => (typeof v === 'string' ? v : Array.isArray(v) ? v.join(' ') : v.label || v.rows?.flat().join(' ') || ''))
    .join(' ')
    .split(/\s+/).length

const POSTS = [
  {
    slug: 'blood-emergency-checklist',
    title: 'Need blood urgently? A calm, step-by-step checklist',
    excerpt: "When someone you love needs blood, it's hard to think clearly. Follow these five steps, one at a time.",
    category: 'Emergency',
    date: '2026-09-22',
    body: [
      ['p', "When someone you love needs blood, it's hard to think clearly. You don't have to do everything at once. Follow these steps one at a time."],
      ['h2', '1. Get the exact details from the hospital'],
      ['ul', ["The patient's blood group", 'How many units (bags) are needed', 'Whether it is whole blood or a part of blood, such as platelets or plasma', "The blood bank's location and opening times"]],
      ['h2', '2. Post your request'],
      ['p', 'Use Emergency Mode on our website or post in the Eblood app. Include the blood group, city, hospital and a contact number so donors can reach you quickly.'],
      ['cta', { action: 'emergency', label: 'Open Emergency Mode' }],
      ['h2', '3. Ask the people you know'],
      ['p', 'Family, friends, classmates and colleagues with a matching blood group are often the fastest donors. Share your request in your WhatsApp groups.'],
      ['h2', '4. Keep the paperwork ready'],
      ['p', "Keep the hospital's blood request slip with you, and check with the blood bank what the donor needs to bring."],
      ['h2', '5. Never pay for a donor'],
      ['callout', 'Blood donation is always free. If anyone asks for money to arrange a donor, refuse and report it to the hospital and to Eblood.'],
    ],
  },
  {
    slug: 'who-can-donate-blood',
    title: 'Who can donate blood? A simple guide for first-time donors',
    excerpt: "Most healthy adults can donate. Here are the basic requirements, and how to prepare so it goes smoothly.",
    category: 'Donor Guide',
    date: '2026-09-18',
    body: [
      ['p', "If you've never donated blood, you might wonder if you're allowed. Most healthy adults are. Here are the basics."],
      ['h2', 'The usual requirements'],
      ['ul', ['Age 18 to 60 years', 'Weight 50 kg or more', 'Feeling healthy and well on the day', 'At least 3 months since your last whole blood donation']],
      ['p', 'Rules can differ slightly between blood banks. Before you donate, the staff will check your blood pressure, hemoglobin and health history.'],
      ['h2', 'Things that may mean you need to wait'],
      ['ul', ['A fever, cold, flu or any infection right now', 'A recent tattoo or piercing', 'Some medicines', 'Pregnancy, or having given birth recently', 'A recent surgery']],
      ['p', "Waiting doesn't mean you can never donate. Ask the blood bank when you can come back."],
      ['h2', 'Before you donate'],
      ['ul', ['Eat a proper meal a few hours before', 'Drink plenty of water', "Get a good night's sleep", 'Bring your CNIC']],
      ['h2', 'After you donate'],
      ['ul', ['Rest for 10 to 15 minutes and have a drink and a snack', 'Drink extra fluids for the rest of the day', 'Avoid heavy lifting and hard exercise for the day', 'If you feel dizzy, sit or lie down and tell the staff']],
      ['cta', { to: '/#ready', label: 'Take the 60-second readiness check' }],
    ],
  },
  {
    slug: 'blood-group-compatibility',
    title: 'Blood group compatibility explained: who can give to whom',
    excerpt: 'There are 8 main blood groups. Your group decides which patients you can help. Here is the full chart.',
    category: 'Basics',
    date: '2026-09-12',
    body: [
      ['p', 'There are 8 main blood groups: A, B, AB and O, each either positive or negative. Your group decides which patients can safely receive your red blood cells.'],
      ['h2', 'The full chart'],
      ['table', { head: ['Your group', 'Can give to', 'Can receive from'], rows: GROUPS.map((g) => [g, CAN_GIVE_TO[g].join(', '), canReceiveFrom(g).join(', ')]) }],
      ['h2', 'Two groups worth knowing'],
      ['ul', ["O negative can give red cells to every group. That's why it's called the universal donor, and why it is always in demand.", "AB positive can receive red cells from every group. That's why it's called the universal recipient."]],
      ['h2', 'Why negative groups matter'],
      ['p', 'Negative blood groups are less common, so finding a matching donor can take longer. If your group is negative, registering on Eblood is especially valuable.'],
      ['callout', 'This chart is for red blood cells. Plasma and platelets follow different rules, and the hospital always runs a final crossmatch test before any transfusion.'],
      ['cta', { to: '/#compatibility', label: 'See who your blood can save' }],
    ],
  },
  {
    slug: 'thalassemia-and-regular-donors',
    title: 'Thalassemia: why regular donors matter so much',
    excerpt: 'Children with thalassemia major need blood again and again. One donation helps. Regular donors change lives.',
    category: 'Community',
    date: '2026-09-05',
    body: [
      ['p', "Thalassemia is an inherited blood disorder. In its most serious form, thalassemia major, the body can't make enough healthy hemoglobin, the part of the blood that carries oxygen."],
      ['h2', 'Why patients need blood again and again'],
      ['p', 'Many children with thalassemia major need a blood transfusion every few weeks, for their whole lives. One donation does not solve the problem. Regular donors do.'],
      ['h2', 'How you can help'],
      ['ul', ['Register as a donor on Eblood so patients near you can find you', 'Donate regularly, every 3 months if you are eligible', 'Support organizations working on thalassemia care, like our partners Fatimid Foundation and Jamila Sultana Foundation', 'Get tested to find out if you are a carrier, especially before marriage']],
      ['h2', 'Why carrier testing matters'],
      ['p', 'A carrier is healthy but can pass the gene on. When both parents are carriers, each pregnancy has a 1 in 4 chance of a child with thalassemia major. A simple blood test tells you if you are a carrier.'],
      ['cta', { to: '/#ready', label: 'Check if you can donate' }],
    ],
  },
  {
    slug: 'never-pay-for-blood',
    title: "Blood donation is always free. Here's what to do if someone asks for money",
    excerpt: 'Some people take advantage of scared families by selling "donors". Learn the warning signs and what to do.',
    category: 'Safety',
    date: '2026-08-28',
    body: [
      ['p', 'In an emergency, families are scared and in a hurry. Sadly, some people take advantage of that by asking for money in exchange for a "donor". This is never okay.'],
      ['h2', 'The rule is simple'],
      ['p', 'Donated blood is a gift. A donor should never be paid, and no one should sell you a donor. If someone asks for money to arrange blood or a donor, refuse.'],
      ['h2', 'Warning signs'],
      ['ul', ['Someone asks for an "arrangement fee" or "travel cost" before the donor arrives', 'You are pressured to pay quickly "or the donor will go somewhere else"', 'Payment is requested to a personal mobile wallet or bank account', 'The person refuses to meet at the hospital blood bank']],
      ['h2', 'What to do instead'],
      ['ul', ["Refuse to pay, and don't share your payment details", 'Tell the hospital blood bank staff or administration right away', 'Report it to Eblood on WhatsApp so we can warn others', 'Post your request in the Eblood app, where donors respond for free']],
      ['callout', 'If you have questions about any charges at the hospital, ask the blood bank staff directly, never a middleman.'],
    ],
  },
]

export const posts = POSTS.map((p) => ({ ...p, author: 'Eblood Team', minutes: Math.max(2, Math.round(words(p.body) / 200)) }))
export const categories = ['All', ...new Set(posts.map((p) => p.category))]
export const getPost = (slug) => posts.find((p) => p.slug === slug)
export const formatDate = (d) => new Date(`${d}T00:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
