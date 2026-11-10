/**
 * Demo photos, all free to use under the Unsplash License (https://unsplash.com/license).
 * They are downloaded onto your own server when you click "Load demo content".
 */
const u = (id: string) => `https://images.unsplash.com/photo-${id}`

export const PHOTOS = {
  exterior1: { url: u('1613490493576-7fde63acd811'), alt: 'Modern white house with timber details', credit: 'Avi Werde' },
  exterior2: { url: u('1600047509807-ba8f99d2cdde'), alt: 'Modern house with timber cladding', credit: 'Unsplash' },
  exterior3: { url: u('1602343168117-bb8ffe3e2e9f'), alt: 'Contemporary villa with pool', credit: 'Unsplash' },
  exterior4: { url: u('1600585154340-be6161a56a0c'), alt: 'Modern family house with garden', credit: 'Unsplash' },
  exterior5: { url: u('1745808909538-78d6ac1da31c'), alt: 'Cottage exterior', credit: 'Brett Wharton' },
  pool1: { url: u('1600596542815-ffad4c1539a9'), alt: 'White villa with infinity pool', credit: 'Unsplash' },
  pool2: { url: u('1613977257363-707ba9348227'), alt: 'Luxury villa with pool terrace', credit: 'Unsplash' },
  pool3: { url: u('1580587771525-78b9dba3b914'), alt: 'Modern home with pool', credit: 'Unsplash' },
  living1: { url: u('1554995207-c18c203602cb'), alt: 'Bright living room', credit: 'Kara Eads' },
  living2: { url: u('1600210491892-03d54c0aaf87'), alt: 'Living room with arched windows', credit: 'Unsplash' },
  living3: { url: u('1613545325278-f24b0cae1224'), alt: 'Bright open-plan living room', credit: 'Unsplash' },
  living4: { url: u('1600607687939-ce8a6c25118c'), alt: 'Living room with timber feature wall', credit: 'Unsplash' },
  living5: { url: u('1618221195710-dd6b41faaea6'), alt: 'Calm sitting room', credit: 'Unsplash' },
  kitchen1: { url: u('1682888813795-192fca4a10d9'), alt: 'Kitchen with marble island', credit: 'Zac Gudakov' },
  kitchen2: { url: u('1682888813734-b1b0a4f79385'), alt: 'Kitchen with white cabinets', credit: 'Zac Gudakov' },
  kitchen3: { url: u('1600585152220-90363fe7e115'), alt: 'Kitchen with island and pendant lights', credit: 'Unsplash' },
  bedroom1: { url: u('1718717621302-a359be21a111'), alt: 'Main bedroom', credit: 'Clay Banks' },
  bedroom2: { url: u('1631049421450-348ccd7f8949'), alt: 'Bedroom with large bed', credit: 'Point3D Commercial Imaging' },
  bedroom3: { url: u('1702255489644-392758161f1f'), alt: 'Bedroom suite', credit: 'Wes Hicks' },
  bedroom4: { url: u('1616594039964-ae9021a400a0'), alt: 'Main bedroom with city views', credit: 'Unsplash' },
  bathroom1: { url: u('1613849925594-415a32298f54'), alt: 'Bathroom with freestanding bath', credit: 'Zac Gudakov' },
  bathroom2: { url: u('1682888818704-6dc91e9d7532'), alt: 'Bathroom with double basin', credit: 'Zac Gudakov' },
  agentEleanor: { url: u('1573496359142-b8d87734a5a2'), alt: 'Eleanor Hart', credit: 'Christina @ wocintechchat.com', portrait: true },
  agentJames: { url: u('1614023342667-6f060e9d1e04'), alt: 'James Okafor', credit: 'Olawale Munna', portrait: true },
  agentSofia: { url: u('1604904612715-47bf9d9bc670'), alt: 'Sofia Marin', credit: 'Phạm Duy Quang', portrait: true },
  agentDaniel: { url: u('1500648767791-00dcc994a43e'), alt: 'Daniel Reyes', credit: 'Jurica Koletić', portrait: true },
} as const

export type PhotoKey = keyof typeof PHOTOS
