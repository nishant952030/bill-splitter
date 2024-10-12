import React from 'react';
import { Coins, Users, Calculator, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 to-blue-100 flex flex-col items-center justify-center p-4">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-teal-700 mb-2">SplitEase</h1>
        <p className="text-xl text-gray-600">Effortlessly split bills with friends</p>
      </header>

      <main className="max-w-4xl w-full bg-white rounded-lg shadow-xl p-8">
        <section className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-teal-600 mb-4">Say goodbye to awkward money talks</h2>
          <p className="text-lg text-gray-700">SplitEase makes dividing expenses a breeze, whether you're out for dinner or planning a group trip.</p>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-12">
          <FeatureCard
            icon={<Coins className="text-teal-500" size={32} />}
            title="Easy Bill Splitting"
            description="Quickly divide bills among friends, with options for equal or custom splits."
          />
          <FeatureCard
            icon={<Users className="text-teal-500" size={32} />}
            title="Group Management"
            description="Create and manage multiple groups for different friend circles or events."
          />
          <FeatureCard
            icon={<Calculator className="text-teal-500" size={32} />}
            title="Expense Tracking"
            description="Keep track of who owes what with our intuitive expense dashboard."
          />
        </section>

        <div className="text-center">
          <button className="bg-teal-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-teal-700 transition duration-300 flex items-center justify-center mx-auto">
            Get Started
            <ArrowRight className="ml-2" size={20} />
          </button>
        </div>
      </main>

      <footer className="mt-12 text-center text-gray-600">
        <p>&copy; 2024 SplitEase. All rights reserved.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-teal-50 p-6 rounded-lg text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-teal-700 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default LandingPage;
