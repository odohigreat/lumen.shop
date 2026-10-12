import { Link, useParams } from 'react-router-dom';
import { MOCK_JOURNAL } from '../data/mockData';
import { NotFound } from './NotFound';
export function ArticleDetail() {
  const { id } = useParams();
  const article = MOCK_JOURNAL.find((a) => a.id === id);
  if (!article) return <NotFound />;
  return (
    <article className="max-w-3xl mx-auto px-4 py-16">
      <Link to="/journal" className="underline">
        Back to the journal
      </Link>
      <p className="text-muted mt-8 mb-4">
        {article.date} · {article.author}
      </p>
      <h1 className="text-4xl font-serif mb-8">{article.title}</h1>
      <img
        src={article.image}
        alt={article.title}
        className="w-full aspect-[4/3] object-cover mb-10"
      />
      <div className="space-y-6 text-lg leading-relaxed">
        {article.content.split('\n\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
