import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Search, Heart, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useAuth } from '../contexts/AuthContext';

export default function HomePage() {
  const [cakes, setCakes] = useState([]);
  const [filteredCakes, setFilteredCakes] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // ✅ FIX: API correctly defined
  const API = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchCakes();
  }, []);

  useEffect(() => {
    filterCakes();
  }, [search, category, cakes]);

  // ---------------- FETCH CAKES ----------------
  const fetchCakes = async () => {
    try {
      const { data } = await axios.get(`${API}/api/cakes`);
      setCakes(data);
      setFilteredCakes(data);
    } catch (error) {
      toast.error('Failed to load cakes');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- FILTER CAKES ----------------
  const filterCakes = () => {
    let filtered = [...cakes];

    if (search) {
      filtered = filtered.filter(cake =>
        cake.name.toLowerCase().includes(search.toLowerCase()) ||
        cake.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== 'all') {
      filtered = filtered.filter(cake => cake.category === category);
    }

    setFilteredCakes(filtered);
  };

  // ---------------- FAVORITES ----------------
  const addToFavorites = async (cakeId, e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to add favorites');
      return;
    }

    try {
      await axios.post(`${API}/favorites/${cakeId}`);
      toast.success('Added to favorites!');
    } catch (error) {
      toast.error('Failed to add to favorites');
    }
  };

  const categories = ['all', 'Chocolate', 'Fruit', 'Classic', 'Cheesecake', 'Special'];

  return (
    <div className="min-h-screen bg-[#FAFAF7] dark:bg-[#2C1E16]">
      <Navbar />

      {/* HERO SECTION */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-[70vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(208, 184, 168, 0.3), rgba(243, 208, 215, 0.3)), url('https://images.unsplash.com/photo-1726981897420-0778c14deedf?crop=entropy&cs=srgb&fm=jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="text-center z-10 px-4">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-5xl sm:text-6xl text-[#2C1E16] dark:text-[#FAFAF7] mb-4"
          >
            Handcrafted Cakes
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-base text-[#5C4A3D] dark:text-[#D0B8A8] mb-8"
          >
            Premium cakes for every celebration
          </motion.p>

          <Button
            onClick={() =>
              document.getElementById('cakes-section').scrollIntoView({ behavior: 'smooth' })
            }
          >
            <ShoppingBag className="mr-2 h-5 w-5" />
            Explore Cakes
          </Button>
        </div>
      </motion.section>

      {/* SEARCH + FILTER */}
      <section id="cakes-section" className="py-12 px-4">
        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
              <Input
                className="pl-10"
                placeholder="Search cakes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={category === cat ? 'default' : 'outline'}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>

          </div>

          {/* CAKES GRID */}
          {loading ? (
            <p>Loading cakes...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

              {filteredCakes.map((cake) => (
                <motion.div key={cake._id}>
                  
                  <Link to={`/cake/${cake._id}`}>

                    <div className="border rounded-lg overflow-hidden">

                      <img
                        src={cake.image_url}
                        alt={cake.name}
                        className="w-full h-64 object-cover"
                      />

                      <div className="p-4">

                        <div className="flex justify-between">
                          <h3>{cake.name}</h3>

                          <button
                            onClick={(e) => addToFavorites(cake._id, e)}
                          >
                            <Heart />
                          </button>

                        </div>

                        <p>{cake.description}</p>
                        <p>₹{cake.base_price}</p>

                        {cake.in_stock ? (
                          <span>In Stock</span>
                        ) : (
                          <span>Out of Stock</span>
                        )}

                      </div>

                    </div>

                  </Link>

                </motion.div>
              ))}

            </div>
          )}

        </div>
      </section>
    </div>
  );
}
