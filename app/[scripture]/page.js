import { notFound } from 'next/navigation';
import Reader from '@/components/Reader';
import { content, featureOrder } from '@/lib/content';

// One dynamic route serves every scripture: /aarti-baba, /aarti-sai, /chalisa, /vidhi, /notes.
// Adding a new text to lib/content.js automatically creates its page.
export function generateStaticParams() {
  return featureOrder.map((id) => ({ scripture: id }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { scripture } = await params;
  const item = content[scripture];
  if (!item) return {};
  return { title: `${item.title.hi} | श्री झूलेलाल अखण्ड ज्योति ट्रस्ट, रामबाग कानपुर` };
}

export default async function ScripturePage({ params }) {
  const { scripture } = await params;
  const item = content[scripture];
  if (!item) notFound();
  return <Reader id={scripture} />;
}
