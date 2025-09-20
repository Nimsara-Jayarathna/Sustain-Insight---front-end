import React from 'react';

const Hero = () => {
  return (
    <section className="bg-white text-center py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Actionable Insights on Climate Change, in Real-Time.</h1>
        <p className="text-xl text-gray-600 mb-8">
          Sustain Insight cuts through the noise, delivering a personalized news feed to power your research and decision-making.
        </p>
        <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-lg">
          Get Started for Free
        </button>
      </div>
    </section>
  );
};

export default Hero;