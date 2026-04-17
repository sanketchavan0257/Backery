import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Edit, Trash2, Plus, Search, TrendingUp, TrendingDown, Package, DollarSign } from 'lucide-react';
import Navbar from '../components/Navbar';
import EditCakeModal from '../components/EditCakeModal';
import AddCakeModal from '../components/AddCakeModal';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminCakes() {
  const [cakes, setCakes] = useState([]);
  const [filteredCakes, setFilteredCakes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingCake, setEditingCake] = useState(null);
  const [deletingCake, setDeletingCake] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // ---------------- FETCH CAKES ----------------
  useEffect(() => {
    fetchCakes();
  }, []);

  // ---------------- SEARCH FILTER ----------------
  useEffect(() => {
    if (search) {
      setFilteredCakes(
        cakes.filter(
          (cake) =>
            cake.name.toLowerCase().includes(search.toLowerCase()) ||
            cake.category.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFilteredCakes(cakes);
    }
  }, [search, cakes]);

  // ---------------- GET ALL CAKES ----------------
  const fetchCakes = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API}/cakes`);

      setCakes(data);
      setFilteredCakes(data);

    } catch (error) {
      console.log(error);
      toast.error('Failed to load cakes');
    } finally {
      setLoading(false);
    }
  };

  // ---------------- EDIT ----------------
  const handleEdit = (cake) => {
    setEditingCake(cake);
  };

  const handleUpdate = (updatedCake) => {
    setCakes(
      cakes.map((c) =>
        c._id === updatedCake._id ? updatedCake : c
      )
    );
    setEditingCake(null);
  };

  // ---------------- ADD ----------------
  const handleAdd = (newCake) => {
    setCakes([newCake, ...cakes]);
    setIsAddModalOpen(false);
  };

  // ---------------- DELETE ----------------
  const handleDelete = async () => {
    if (!deletingCake) return;

    try {
      await axios.delete(`${API}/cakes/${deletingCake._id}`, {
        withCredentials: true,
      });

      setCakes(cakes.filter((c) => c._id !== deletingCake._id));

      toast.success('Cake deleted successfully');
      setDeletingCake(null);

    } catch (error) {
      console.log(error);
      toast.error('Failed to delete cake');
    }
  };

  // ---------------- TOGGLE STOCK ----------------
  const toggleStock = async (cake) => {
    try {
      const { data } = await axios.put(
        `${API}/cakes/${cake._id}`,
        { in_stock: !cake.in_stock },
        { withCredentials: true }
      );

      setCakes(
        cakes.map((c) =>
          c._id === cake._id ? data : c
        )
      );

      toast.success('Stock updated');

    } catch (error) {
      console.log(error);
      toast.error('Failed to update stock (PUT API missing in backend)');
    }
  };

  // ---------------- STATS ----------------
  const stats = {
    totalCakes: cakes.length,
    inStock: cakes.filter((c) => c.in_stock).length,
    outOfStock: cakes.filter((c) => !c.in_stock).length,
    avgPrice:
      cakes.length > 0
        ? Math.round(
            cakes.reduce((sum, c) => sum + c.base_price, 0) /
              cakes.length
          )
        : 0,
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] dark:bg-[#2C1E16]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Manage Cakes</h1>
          <p className="text-gray-500">
            Manage your cake inventory
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

          <div>
            <Package />
            <p>Total Cakes</p>
            <h2>{stats.totalCakes}</h2>
          </div>

          <div>
            <TrendingUp />
            <p>In Stock</p>
            <h2>{stats.inStock}</h2>
          </div>

          <div>
            <TrendingDown />
            <p>Out of Stock</p>
            <h2>{stats.outOfStock}</h2>
          </div>

          <div>
            <DollarSign />
            <p>Avg Price</p>
            <h2>₹{stats.avgPrice}</h2>
          </div>

        </div>

        {/* SEARCH + ADD */}
        <div className="flex gap-4 mb-6">
          <Input
            placeholder="Search cakes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus /> Add Cake
          </Button>
        </div>

        {/* LOADING */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {filteredCakes.map((cake) => (
              <div key={cake._id} className="border p-4 rounded-lg">

                <img src={cake.image_url} alt={cake.name} />

                <h3>{cake.name}</h3>
                <p>{cake.category}</p>
                <p>₹{cake.base_price}</p>

                <p
                  onClick={() => toggleStock(cake)}
                  style={{ cursor: "pointer" }}
                >
                  {cake.in_stock ? "In Stock" : "Out of Stock"}
                </p>

                <button onClick={() => handleEdit(cake)}>
                  <Edit />
                </button>

                <button onClick={() => setDeletingCake(cake)}>
                  <Trash2 />
                </button>

              </div>
            ))}

          </div>
        )}

      </div>

      {/* MODALS */}
      <EditCakeModal
        isOpen={!!editingCake}
        onClose={() => setEditingCake(null)}
        cake={editingCake}
        onUpdate={handleUpdate}
      />

      <AddCakeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAdd}
      />

      <AlertDialog open={!!deletingCake} onOpenChange={() => setDeletingCake(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Cake?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>

        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
