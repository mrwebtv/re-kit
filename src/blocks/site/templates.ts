import { h, p, rt, ul } from '../../lib/lexical'

/* Ready-made page layouts. Picked from "Start from a template" when creating a page. */

const btn = (label: string, url: string) => ({ label, url })

export const PAGE_TEMPLATES: Record<string, { label: string; chrome?: string; layout: () => Record<string, unknown>[] }> = {
  about: {
    label: 'About us',
    layout: () => [
      { blockType: 'hero', style: 'minimal', eyebrow: 'About us', heading: 'An independent agency that still answers the phone.', text: 'Founded by local agents who wanted to sell homes the way they would want their own sold: properly photographed, honestly priced and personally handled.' },
      { blockType: 'imageText', eyebrow: 'Our story', heading: 'Started on one street, now across the city', body: rt(p('Tell your story here: when you started, why, and what you do differently. Two or three short paragraphs work best.'), p('Mention the areas you cover and the kind of homes you sell most.')), imageSide: 'left', button: btn('Meet the team', '/agents') },
      { blockType: 'stats', heading: 'In numbers', items: [{ value: '20+', label: 'Years in the area' }, { value: '1,200', label: 'Homes sold' }, { value: '98%', label: 'Of asking price achieved' }, { value: '48h', label: 'Written valuation' }] },
      { blockType: 'iconGrid', eyebrow: 'How we work', heading: 'What you can expect', items: [{ icon: 'star', title: 'Honest pricing', text: 'A figure backed by real sales on your street, not a number to win the instruction.' }, { icon: 'view', title: 'Proper marketing', text: 'Professional photography, floor plans and video on every home.' }, { icon: 'calendar', title: 'Accompanied viewings', text: 'An agent at every viewing, evenings and weekends included.' }] },
      { blockType: 'agentsGrid', eyebrow: 'The team', heading: 'The people you will deal with' },
      { blockType: 'testimonials', heading: 'What clients say', items: [{ quote: 'Replace with a real client review (with their permission).', name: 'Client name', detail: 'Sold in your area' }] },
      { blockType: 'ctaBanner', heading: 'Thinking of selling?', text: 'Get a free written valuation from an agent who knows your street.', button: btn('Book a valuation', '/valuation'), secondaryButton: btn('Contact us', '/contact') },
    ],
  },
  sell: {
    label: 'Landing page: sell your home',
    layout: () => [
      { blockType: 'hero', style: 'split', eyebrow: 'Selling', heading: 'Sell for the right price, with less stress.', text: 'A free valuation, a clear marketing plan and one agent from first visit to completion.', button: btn('Book a free valuation', '#form'), secondaryButton: btn('See homes we sold', '/properties?mode=buy') },
      { blockType: 'iconGrid', eyebrow: 'How it works', heading: 'Four steps to sold', items: [{ icon: 'home', title: '1. Valuation', text: 'We visit, walk every room and send a written valuation within 48 hours.' }, { icon: 'view', title: '2. Marketing', text: 'Photography, floor plan, video and listing on every major portal.' }, { icon: 'calendar', title: '3. Viewings', text: 'Accompanied viewings and feedback after every one.' }, { icon: 'check', title: '4. Sale agreed', text: 'We negotiate, qualify buyers and chase the solicitors to completion.' }] },
      { blockType: 'stats', items: [{ value: '24 days', label: 'Average time to sale agreed' }, { value: '98%', label: 'Of asking price' }, { value: '0', label: 'Upfront fees' }] },
      { blockType: 'propertyGrid', eyebrow: 'Recently listed', heading: 'Homes we are selling now', show: 'sale', limit: 3, background: 'soft' },
      { blockType: 'faq', heading: 'Questions sellers ask', items: [{ question: 'How much do you charge?', answer: 'A fixed percentage, agreed in writing before we start. No sale, no fee.' }, { question: 'How long is the contract?', answer: 'Replace with your terms, e.g. 12 weeks, then rolling with two weeks notice.' }, { question: 'Do you do viewings at weekends?', answer: 'Yes, accompanied viewings seven days a week.' }] },
      { blockType: 'leadForm', eyebrow: 'Free valuation', heading: 'What is your home worth?', text: 'Tell us where it is and when suits you. We reply within one working day.', form: 'valuation', buttonLabel: 'Request my valuation' },
    ],
  },
  development: {
    label: 'Landing page: new development',
    layout: () => [
      { blockType: 'hero', style: 'fullscreen', eyebrow: 'New development', heading: 'Development name', text: 'Twelve new homes, ready next spring. Register your interest for first viewings.', button: btn('Register interest', '#form') },
      { blockType: 'text', eyebrow: 'The development', heading: 'Designed for how people live now', body: rt(p('Describe the development: number of homes, architect, specification, energy rating and completion date.')) },
      { blockType: 'propertyGrid', heading: 'Available homes', show: 'development', limit: 12, background: 'soft' },
      { blockType: 'gallery', heading: 'Gallery' },
      { blockType: 'imageText', eyebrow: 'Location', heading: 'Everything within walking distance', body: rt(ul(['Schools within 5 minutes', 'Station 10 minutes on foot', 'Shops, cafés and the park nearby'])), imageSide: 'right' },
      { blockType: 'leadForm', heading: 'Register your interest', text: 'Be first to hear about prices, plans and the launch day.', form: 'contact', buttonLabel: 'Register interest' },
    ],
  },
  area: {
    label: 'Area guide',
    layout: () => [
      { blockType: 'hero', style: 'image', eyebrow: 'Area guide', heading: 'Living in Area name', text: 'Schools, transport, prices and the best streets, from the agents who sell here every week.' },
      { blockType: 'text', heading: 'Why people move here', body: rt(p('Write two or three paragraphs about the area: character, history, who it suits.'), h('h3', 'Schools'), p('List the main schools and how far they are.'), h('h3', 'Getting around'), p('Train, bus and road links.'), h('h3', 'Prices'), p('Typical prices for apartments, houses and rents.')) },
      { blockType: 'iconGrid', heading: 'At a glance', items: [{ icon: 'home', title: 'Homes', text: 'Mix of period houses and new apartments.' }, { icon: 'garden', title: 'Parks', text: 'Name the main parks.' }, { icon: 'calendar', title: 'Community', text: 'Markets, festivals, sports clubs.' }] },
      { blockType: 'propertyGrid', heading: 'Homes for sale in the area', show: 'town', town: 'Area name', limit: 6, background: 'soft' },
      { blockType: 'latestPosts', heading: 'Latest from our blog', limit: 3 },
      { blockType: 'ctaBanner', heading: 'Selling in the area?', button: btn('Book a valuation', '/valuation') },
    ],
  },
  splash: {
    label: 'Splash page (coming soon)',
    chrome: 'none',
    layout: () => [
      { blockType: 'hero', style: 'fullscreen', eyebrow: 'Coming soon', heading: 'Something new is on the way.', text: 'Leave your email and be the first to know.' },
      { blockType: 'leadForm', heading: 'Be the first to know', form: 'alert', buttonLabel: 'Notify me' },
    ],
  },
}

/* Starting content for blog posts. */
export const POST_TEMPLATES: Record<string, { label: string; content: () => unknown }> = {
  market: {
    label: 'Market update',
    content: () => rt(p('One-paragraph summary: what happened to prices and demand this month.'), h('h2', 'Prices'), p('Average asking and sold prices, and the change on last month and last year.'), h('h2', 'Supply and demand'), p('New listings, sales agreed and how long homes take to sell.'), h('h2', 'What it means for you'), ul(['If you are selling: …', 'If you are buying: …', 'If you are letting: …']), p('Want a valuation? Book one at /valuation.')),
  },
  news: {
    label: 'News',
    content: () => rt(p('The news in one paragraph: who, what, when.'), p('Details and a quote.'), p('What happens next.')),
  },
  guide: {
    label: 'Guide (buyers or sellers)',
    content: () => rt(p('Who this guide is for and what they will learn.'), h('h2', 'Step 1'), p('…'), h('h2', 'Step 2'), p('…'), h('h2', 'Step 3'), p('…'), h('h2', 'Questions'), p('Talk to us at /contact.')),
  },
}
