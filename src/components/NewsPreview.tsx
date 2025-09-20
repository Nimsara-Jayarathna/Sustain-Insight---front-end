import React from 'react';

// Placeholder data for news articles
const articles = [
  { id: 1, title: 'Global Summit on Climate Change Concludes with New Pact', source: 'Global News' },
  { id: 2, title: 'Innovations in Renewable Energy Technology', source: 'Tech Today' },
  { id: 3, title: 'The Impact of Deforestation on Local Communities', source: 'Eco Watch' },
];

const ArticleCard = ({ title, source }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="p-6">
      <h4 className="font-bold text-lg mb-2 text-gray-800">{title}</h4>
      <p className="text-gray-600 text-sm">{source}</p>
    </div>
  </div>
);

const NewsPreview = () => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Latest in Climate News</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map(article => (
            <ArticleCard key={article.id} title={article.title} source={article.source} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsPreview;
