import Header from '@/components/Header';
import { templeHistory } from '@/lib/history';

export default function TempleHistory({ biography = templeHistory, closingMessage = 'अखण्ड ज्योति आज भी निरन्तर प्रज्ज्वलित है' }) {
  const emblem = biography.icon || '🪔';
  const kicker = biography.kicker || 'मंदिर का प्रमाणिक इतिहास';

  return (
    <>
      <Header title={biography.title} showBack />
      <main className="history-page" lang="hi">
        <div className="history-top-image">
          <img src="/mandir-itihas.jpg" alt="झूलेलाल मंदिर — संस्थापक प्रतिमा" />
        </div>
        <section className="history-hero" aria-labelledby="history-title">
          <div className="history-emblem" aria-hidden="true">
            {emblem}
          </div>
          <div className="history-hero-copy">
            <p className="history-kicker">{kicker}</p>
            <h2 id="history-title">{biography.templeName}</h2>
            <p className="history-location">{biography.location}</p>
            <p className="history-source">{biography.source}</p>
          </div>
        </section>

        <dl className="history-highlights" aria-label="मंदिर के इतिहास की प्रमुख तिथियाँ">
          {biography.highlights.map((item) => (
            <div className="history-fact" key={item.value}>
              <dt>{item.value}</dt>
              <dd>{item.label}</dd>
            </div>
          ))}
        </dl>

        <div className="history-sections">
          {biography.sections.map((section, index) => (
            <article className="history-article" key={section.title}>
              <header className="history-article-header">
                <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <h3>{section.title}</h3>
              </header>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </article>
          ))}
        </div>

        <p className="history-closing">
          <span aria-hidden="true">✦</span> {closingMessage} <span aria-hidden="true">✦</span>
        </p>
      </main>
    </>
  );
}
