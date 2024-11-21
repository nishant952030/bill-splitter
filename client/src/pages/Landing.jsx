import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Coins, Users, Calculator, ArrowRight, CreditCard, Shield, Clock, Mail, Twitter, Facebook, Instagram, Globe, ChartBar, Smartphone, Gift, Heart } from 'lucide-react';
import axios from 'axios';
import { userRoute } from '../components/constant';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setFriends, setLoggedIn, setUser } from '../redux';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const LandingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(store => store.user);

  useEffect(() => {
    const checkIsLoggedIn = async () => {
      try {
        const response = await axios.get(`${userRoute}/isLoggedIn`, { withCredentials: true });
        if (!response.data.success) {
          const logout = await axios.get(`${userRoute}/logout`, { withCredentials: true });
          if (logout.data.success) {
            dispatch(setUser(null));
            dispatch(setFriends([]));
            navigate('/');
          }
        }
      } catch (error) {
        if (error.response) {
          const errorStatus = error.response.data.success;
          if (error.response.status === 401 || !errorStatus) {
            console.log('Token expired, logging out...');
            const logout = await axios.get(`${userRoute}/logout`, { withCredentials: true });
            if (logout.data.success) {
              dispatch(setUser(null));
              dispatch(setFriends([]));
              navigate('/');
            }
          }
        } else {
          console.log('An unexpected error occurred:', error);
        }
      }
    };
    checkIsLoggedIn();
  }, [dispatch, navigate]);

  const handleClickForSplit = () => {
    if (user)
      navigate('/home');
    else
      navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <header className="py-20 text-center px-4">
        <motion.div
          className="max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl font-bold text-gray-800 mb-6">
            Split Bills <span className="text-teal-600">Effortlessly</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            The smart way to manage shared expenses and keep track of who owes what
          </p>
          <motion.button
            onClick={handleClickForSplit}
            className="bg-teal-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-teal-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Splitting Bills
            <ArrowRight className="inline ml-2" size={20} />
          </motion.button>
        </motion.div>
      </header>

      {/* Stats Section */}
      <motion.section
        className="py-12 bg-gray-800"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerChildren}
      >
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <StatCard number="1M+" text="Active Users" />
          <StatCard number="$50M+" text="Bills Split" />
          <StatCard number="4.9" text="App Rating" />
          <StatCard number="150+" text="Countries" />
        </div>
      </motion.section>

      {/* Main Features */}
      <main className="max-w-7xl mx-auto px-4">
        {/* Core Features */}
        <motion.section
          className="mb-24 py-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerChildren}
        >
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Why Choose CashFlow?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Coins className="text-teal-500" size={32} />}
              title="Smart Bill Splitting"
              description="Automatically calculate splits, handle uneven amounts, and track group expenses with ease."
            />
            <FeatureCard
              icon={<Users className="text-teal-500" size={32} />}
              title="Group Management"
              description="Create unlimited groups for different occasions, from roommates to travel buddies."
            />
            <FeatureCard
              icon={<Calculator className="text-teal-500" size={32} />}
              title="Expense Analytics"
              description="Get insights into spending patterns and view detailed transaction history."
            />
          </div>
        </motion.section>

        {/* How It Works Section */}
        <motion.section
          className="mb-24 py-16 bg-gray-50 rounded-3xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerChildren}
        >
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-5 gap-8 max-w-6xl mx-auto px-4">
            <ProcessCard
              number="1"
              title="Sign Up or Log In"
              description="Start by creating an account or logging into your existing one."
            />
            <ProcessCard
              number="2"
              title="Add Friends"
              description="Send friend requests and wait for your friends to accept."
            />
            <ProcessCard
              number="3"
              title="Create a Group"
              description="Organize your shared expenses by creating a group."
            />
            <ProcessCard
              number="4"
              title="Add Expenses"
              description="Log your shared expenses to keep track easily."
            />
            <ProcessCard
              number="5"
              title="Split Bills"
              description="CashFlow will calculate who owes what, making it seamless."
            />
          </div>
        </motion.section>


        {/* Additional Features */}
        <motion.section
          className="mb-24 bg-gray-50 py-16 rounded-2xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerChildren}
        >
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
              Everything You Need
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              <SmallFeatureCard
                icon={<CreditCard className="text-teal-500" size={24} />}
                title="Multiple Payment Options"
              />
              <SmallFeatureCard
                icon={<Shield className="text-teal-500" size={24} />}
                title="Secure Transactions"
              />
              <SmallFeatureCard
                icon={<Clock className="text-teal-500" size={24} />}
                title="Real-time Updates"
              />
              <SmallFeatureCard
                icon={<Globe className="text-teal-500" size={24} />}
                title="Multi-currency Support"
              />
            </div>
          </div>
        </motion.section>

        {/* Testimonials Section */}
        <motion.section
          className="mb-24 py-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerChildren}
        >
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            What Our Users Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              text="CashFlow has made splitting bills with my roommates completely hassle-free!"
              author="Sarah K."
              role="Student"
            />
            <TestimonialCard
              text="The best expense splitting app I've ever used. Clean interface and powerful features."
              author="Michael R."
              role="Professional"
            />
            <TestimonialCard
              text="Perfect for managing group trips and events. Saved us so much time and confusion!"
              author="Jessica M."
              role="Travel Enthusiast"
            />
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          className="mb-24 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl py-16 px-4">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to simplify your shared expenses?
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              Join thousands of users who trust CashFlow for hassle-free bill splitting
            </p>
            <motion.button
              className="bg-white text-gray-800 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Now
            </motion.button>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">CashFlow</h3>
              <p className="text-gray-400">
                Making shared expenses simple and stress-free.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Features</h4>
              <ul className="space-y-2">
                <li>Bill Splitting</li>
                <li>Group Management</li>
                <li>Expense Tracking</li>
                <li>Payment Integration</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>About Us</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <motion.div whileHover={{ scale: 1.2 }}>
                  <Twitter className="hover:text-teal-500 cursor-pointer" />
                </motion.div>
                <motion.div whileHover={{ scale: 1.2 }}>
                  <Facebook className="hover:text-teal-500 cursor-pointer" />
                </motion.div>
                <motion.div whileHover={{ scale: 1.2 }}>
                  <Instagram className="hover:text-teal-500 cursor-pointer" />
                </motion.div>
                <motion.div whileHover={{ scale: 1.2 }}>
                  <Mail className="hover:text-teal-500 cursor-pointer" />
                </motion.div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p>&copy; 2024 CashFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <motion.div
      className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
      variants={fadeIn}
      whileHover={{ y: -5 }}
    >
      <div className="flex justify-center mb-6">
        <div className="p-3 bg-gray-50 rounded-lg">{icon}</div>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
};

const SmallFeatureCard = ({ icon, title }) => {
  return (
    <motion.div
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center"
      variants={fadeIn}
      whileHover={{ y: -5 }}
    >
      <div className="flex justify-center mb-4">
        <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
      </div>
      <h3 className="text-gray-800 font-medium">{title}</h3>
    </motion.div>
  );
};

const StatCard = ({ number, text }) => {
  return (
    <motion.div
      className="text-center text-white"
      variants={fadeIn}
    >
      <motion.div
        className="text-4xl font-bold mb-2"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {number}
      </motion.div>
      <div className="text-gray-300">{text}</div>
    </motion.div>
  );
};

const ProcessCard = ({ number, title, description }) => {
  return (
    <motion.div
      className="text-center"
      variants={fadeIn}
    >
      <div className="w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
        {number}
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

const TestimonialCard = ({ text, author, role }) => {
  return (
    <motion.div
      className="bg-white p-8 rounded-xl shadow-lg"
      variants={fadeIn}
      whileHover={{ y: -5 }}
    >
      <div className="mb-6">
        <svg className="w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>
      <p className="text-gray-700 mb-6 leading-relaxed">{text}</p>
      <div className="border-t border-gray-100 pt-4">
        <p className="font-semibold text-gray-800">{author}</p>
        <p className="text-gray-500 text-sm">{role}</p>
      </div>
    </motion.div>
  );
};

// App Features Section Component
const AppFeatures = () => {
  const features = [
    {
      icon: <ChartBar className="text-teal-500" size={24} />,
      title: "Advanced Analytics",
      description: "Get detailed insights into your spending patterns"
    },
    {
      icon: <Smartphone className="text-teal-500" size={24} />,
      title: "Mobile First",
      description: "Access your expenses anywhere, anytime"
    },
    {
      icon: <Gift className="text-teal-500" size={24} />,
      title: "Rewards Program",
      description: "Earn points for regular usage and referrals"
    },
    {
      icon: <Heart className="text-teal-500" size={24} />,
      title: "Premium Support",
      description: "24/7 support for all your queries"
    }
  ];

  return (
    <motion.section
      className="py-16 bg-gray-50"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={staggerChildren}
    >
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
          Powerful Features
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md"
              variants={fadeIn}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center mb-4">
                <div className="p-2 bg-gray-50 rounded-lg mr-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-800">{feature.title}</h3>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

// Newsletter Subscription Component
const Newsletter = () => {
  return (
    <motion.section
      className="bg-gray-50 py-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeIn}
    >
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Stay Updated
        </h2>
        <p className="text-gray-600 mb-6">
          Subscribe to our newsletter for tips, updates, and exclusive offers
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <motion.button
            className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Subscribe
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
};

// Download App Section Component
const DownloadApp = () => {
  return (
    <motion.section
      className="py-16 bg-gradient-to-r from-gray-800 to-gray-900 text-white"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeIn}
    >
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-6">
            Get the CashFlow App
          </h2>
          <p className="text-gray-300 mb-8">
            Download our mobile app to manage expenses on the go. Available for iOS and Android devices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              className="bg-white text-gray-800 px-6 py-3 rounded-lg flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.5 12.5c0-0.3 0-0.5-0.1-0.8l1.8-1.3c0.2-0.1 0.2-0.4 0.1-0.6l-1.7-3c-0.1-0.2-0.4-0.3-0.6-0.2l-2.1 0.9c-0.4-0.3-0.9-0.6-1.4-0.8l-0.3-2.3c0-0.2-0.2-0.4-0.5-0.4h-3.4c-0.2 0-0.5 0.2-0.5 0.4l-0.3 2.3c-0.5 0.2-1 0.5-1.4 0.8l-2.1-0.9c-0.2-0.1-0.5 0-0.6 0.2l-1.7 3c-0.1 0.2-0.1 0.5 0.1 0.6l1.8 1.3c0 0.3-0.1 0.5-0.1 0.8s0 0.5 0.1 0.8l-1.8 1.3c-0.2 0.1-0.2 0.4-0.1 0.6l1.7 3c0.1 0.2 0.4 0.3 0.6 0.2l2.1-0.9c0.4 0.3 0.9 0.6 1.4 0.8l0.3 2.3c0 0.2 0.2 0.4 0.5 0.4h3.4c0.2 0 0.5-0.2 0.5-0.4l0.3-2.3c0.5-0.2 1-0.5 1.4-0.8l2.1 0.9c0.2 0.1 0.5 0 0.6-0.2l1.7-3c0.1-0.2 0.1-0.5-0.1-0.6l-1.8-1.3c0-0.3 0.1-0.5 0.1-0.8z"></path>
              </svg>
              Download for iOS
            </motion.button>
            <motion.button
              className="bg-white text-gray-800 px-6 py-3 rounded-lg flex items-center justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5.5 2c-0.7 0-1.4 0.3-1.9 0.8-0.5 0.5-0.8 1.2-0.8 1.9v14.6c0 0.7 0.3 1.4 0.8 1.9s1.2 0.8 1.9 0.8h13c0.7 0 1.4-0.3 1.9-0.8s0.8-1.2 0.8-1.9v-14.6c0-0.7-0.3-1.4-0.8-1.9s-1.2-0.8-1.9-0.8h-13z"></path>
              </svg>
              Download for Android
            </motion.button>
          </div>
        </div>
        <div className="hidden md:block">
          <div className="bg-gray-700 w-64 h-96 rounded-3xl mx-auto relative overflow-hidden">
            <div className="absolute inset-2 bg-gray-900 rounded-2xl">
              {/* Placeholder for app screenshot */}
              <div className="w-full h-full bg-gray-800 opacity-50"></div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default LandingPage;