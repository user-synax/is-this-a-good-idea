import { MetadataRoute } from 'next';
import connectDB from '@/lib/mongodb';
import Idea from '@/models/Idea';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://your-domain.com';

  try {
    await connectDB();
    const ideas = await Idea.find().select('_id createdAt').lean();

    const staticUrls: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ];

    const dynamicUrls: MetadataRoute.Sitemap = ideas.map((idea) => ({
      url: `${baseUrl}/result/${idea._id}`,
      lastModified: new Date(idea.createdAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    return [...staticUrls, ...dynamicUrls];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ];
  }
}
