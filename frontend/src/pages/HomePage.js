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

// ✅ IMPORTANT FIX (no env issue)
//const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
//const API = process.env.REACT_APP_BACKEND_URL;
//console.log("BACKEND URL =", process.env.REACT_APP_BACKEND_URL);

const API = process.env.REACT_APP_BACKEND_URL;

export default function HomePage() {
  const [cakes, setCakes] = useState([]);
  const [filteredCakes, setFilteredCakes] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    fetchCakes();
  }, []);

  useEffect(() => {
    filterCakes();
  }, [search, category, cakes]);

  // ✅ FETCH CAKES
 const fetchCakes = async () => {
    try {
      const { data } = await axios.get(`${API}/api/cakes`);
      setCakes(data);
      setFilteredCakes(data);
    } catch (error) {
      toast.error('Failed to load cakes');
    } finally {
      setLoading(false);
    }
  };


  // ✅ FILTER LOGIC
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

  // ✅ FAVORITES
  const addToFavorites = async (cakeId, e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login first');
      return;
    }

    try {
      await axios.post(`${API}/api/favorites/${cakeId}`);
      toast.success('Added to favorites!');
    } catch (error) {
      toast.error('Failed to add favorite');
    }
  };

  const categories = ['all', 'Chocolate', 'Fruit', 'Classic', 'Cheesecake', 'Special'];

  return (
    <div className="min-h-screen bg-[#FAFAF7] dark:bg-[#2C1E16]">
      <Navbar />

      {/* HERO */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-[70vh] flex items-center justify-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.3),rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1726981897420-0778c14deedf')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-4">
            Handcrafted Cakes
          </h1>

          <p className="mb-6">
            Premium cakes for every celebration
          </p>

          <Button
            onClick={() =>
              document.getElementById('cakes').scrollIntoView({ behavior: 'smooth' })
            }
          >
            <ShoppingBag className="mr-2 h-5 w-5" />
            Explore Cakes
          </Button>
        </div>
      </motion.section>

      {/* SEARCH */}
      <section id="cakes" className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-500" />
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

        {/* LOADING */}
        {loading ? (
          <p className="text-center">Loading cakes...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCakes.map((cake) => (
              <div
                key={cake._id}
                className="border rounded-lg overflow-hidden bg-white"
              >
                <Link to={`/cake/${cake._id}`}>
                  <img
                    src={cake.image_url}
                    className="h-56 w-full object-cover"
                  />

                  <div className="p-4">
                    <h2 className="font-bold">{cake.name}</h2>
                    <p className="text-sm text-gray-500">
                      {cake.description}
                    </p>

                    <div className="flex justify-between mt-2">
                      <span className="font-semibold">
                        ₹{cake.base_price}
                      </span>

                      <button
                        onClick={(e) => addToFavorites(cake._id, e)}
                      >
                        <Heart />
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        {filteredCakes.length === 0 && !loading && (
          <p className="text-center mt-10">No cakes found</p>
        )}
      </section>
    </div>
  );
}
