import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faTags, faBookmark } from '@fortawesome/free-solid-svg-icons';

const FeatureItem = ({ icon, title, children }) => (
  <div className="text-center p-6">
    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mx-auto mb-4">
      <FontAwesomeIcon icon={icon} size="2x" />
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{children}</p>
  </div>
);

const Features = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureItem icon={faRobot} title="Automated Aggregation">
          We fetch news from top global sources automatically.
        </FeatureItem>
        <FeatureItem icon={faTags} title="Intelligent Filtering">
          Instantly filter by category, source, or keywords.
        </FeatureItem>
        <FeatureItem icon={faBookmark} title="Personalized Feed">
          Save your favorite topics for a tailored news feed.
        </FeatureItem>
      </div>
    </section>
  );
};

export default Features;
