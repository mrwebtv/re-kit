/**
 * Demo photos, all free to use under the Unsplash License (https://unsplash.com/license).
 * They are downloaded onto your own server when you click "Load demo content".
 */
const u = (id: string) => `https://images.unsplash.com/photo-${id}`

export const PHOTOS = {
  exterior1: { url: u('1613490493576-7fde63acd811'), alt: 'Modern white house with timber details', credit: 'Avi Werde' },
  exterior2: { url: u('1632764164790-465b137efba2'), alt: 'Family house exterior', credit: 'John Angel' },
  exterior3: { url: u('1673176220769-5ca684052cc1'), alt: 'Contemporary villa exterior', credit: 'sun hx' },
  exterior4: { url: u('1589321084815-4e5f1740cbc6'), alt: 'Townhouse facade', credit: 'Mike Von' },
  exterior5: { url: u('1745808909538-78d6ac1da31c'), alt: 'Cottage exterior', credit: 'Brett Wharton' },
  pool1: { url: u('1739923410752-d44675bf5505'), alt: 'Pool terrace', credit: 'Karl Moore' },
  pool2: { url: u('1668854666212-c9d99acf3e80'), alt: 'Pool surrounded by trees', credit: 'Polina Kuzovkova' },
  pool3: { url: u('1668588806454-8838f7b20b15'), alt: 'House with hills behind', credit: 'Luka Fernandes' },
  living1: { url: u('1554995207-c18c203602cb'), alt: 'Bright living room', credit: 'Kara Eads' },
  living2: { url: u('1768488314310-3742b3c75579'), alt: 'Living room with sofa', credit: 'Clay Banks' },
  living3: { url: u('1680965585463-386646047473'), alt: 'Open-plan living space', credit: 'Clay Banks' },
  living4: { url: u('1600121848594-d8644e57abab'), alt: 'Living room with large windows', credit: 'Lotus Design N Print' },
  living5: { url: u('1680634326749-40efc7e1a7f4'), alt: 'Sitting room', credit: 'Clay Banks' },
  kitchen1: { url: u('1682888813795-192fca4a10d9'), alt: 'Kitchen with marble island', credit: 'Zac Gudakov' },
  kitchen2: { url: u('1682888813734-b1b0a4f79385'), alt: 'Kitchen with white cabinets', credit: 'Zac Gudakov' },
  kitchen3: { url: u('1588796460718-f457ad1e1a1f'), alt: 'Kitchen with wooden cabinets', credit: 'Lotus Design N Print' },
  bedroom1: { url: u('1718717621302-a359be21a111'), alt: 'Main bedroom', credit: 'Clay Banks' },
  bedroom2: { url: u('1631049421450-348ccd7f8949'), alt: 'Bedroom with large bed', credit: 'Point3D Commercial Imaging' },
  bedroom3: { url: u('1702255489644-392758161f1f'), alt: 'Bedroom suite', credit: 'Wes Hicks' },
  bedroom4: { url: u('1533024115551-3925e1b0cd51'), alt: 'Guest bedroom', credit: 'Ömürden Cengiz' },
  bathroom1: { url: u('1613849925594-415a32298f54'), alt: 'Bathroom with freestanding bath', credit: 'Zac Gudakov' },
  bathroom2: { url: u('1682888818704-6dc91e9d7532'), alt: 'Bathroom with double basin', credit: 'Zac Gudakov' },
  agentEleanor: { url: u('1573496359142-b8d87734a5a2'), alt: 'Eleanor Hart', credit: 'Christina @ wocintechchat.com', portrait: true },
  agentJames: { url: u('1614023342667-6f060e9d1e04'), alt: 'James Okafor', credit: 'Olawale Munna', portrait: true },
  agentSofia: { url: u('1604904612715-47bf9d9bc670'), alt: 'Sofia Marin', credit: 'Phạm Duy Quang', portrait: true },
  agentDaniel: { url: u('1500648767791-00dcc994a43e'), alt: 'Daniel Reyes', credit: 'Jurica Koletić', portrait: true },
} as const

export type PhotoKey = keyof typeof PHOTOS
