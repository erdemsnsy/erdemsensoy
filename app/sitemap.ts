import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://erdemsensoy.vercel.app', priority: 1 },
    { url: 'https://erdemsensoy.vercel.app/freelance', priority: 0.8 },
  ]
}
