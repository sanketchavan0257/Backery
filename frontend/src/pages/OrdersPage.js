import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import { Phone } from 'lucide-react';
import Navbar from '../components/Navbar';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Shop contact number (WhatsApp + Call)
const SHOP_PHONE = '7743819432';

// "1kg" -> "1 kg", "500g" -> "500 g"
const formatWeight = (w) => (w ? String(w).replace(/^(\d+(?:\.\d+)?)\s*(kg|g)$/i, '$1 $2') : '');

const WhatsAppIcon = ({ className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${API}/orders`, { withCredentials: true });
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7] dark:bg-[#2C1E16]">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-4xl mb-8 text-[#2C1E16] dark:text-[#FAFAF7]" style={{ fontFamily: "'Playfair Display', serif" }} data-testid="orders-heading">My Orders</h1>
        {loading ? (
          <div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D0B8A8] mx-auto"></div></div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12" data-testid="no-orders-message"><p className="text-xl text-[#5C4A3D] dark:text-[#D0B8A8]">No orders yet</p></div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const status = order.order_status || order.status || 'pending';
              const shortId = order.order_id.slice(0, 8);
              const whatsappText = encodeURIComponent(`Hello, I want to ask about my order (Order ID: ${shortId})`);
              return (
                <motion.div key={order.order_id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-[#3C2E26] border border-[rgba(44,30,22,0.15)] rounded-lg p-4 sm:p-6" data-testid={`order-${order.order_id}`}>
                  <div className="flex justify-between items-start gap-3 mb-4">
                    <div>
                      <p className="text-sm text-[#5C4A3D] dark:text-[#D0B8A8]">Order ID: {shortId}</p>
                      <p className="text-sm text-[#5C4A3D] dark:text-[#D0B8A8]">Ordered: {new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-4 py-1 rounded-full text-sm uppercase ${status === 'pending' ? 'bg-yellow-100 text-yellow-800' : status === 'completed' ? 'bg-green-100 text-green-800' : status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`} data-testid={`order-status-${order.order_id}`}>{status}</span>
                  </div>

                  <div className="space-y-3 mb-4">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="bg-[#F9F4F0] dark:bg-[#2C1E16] rounded-lg p-3 flex gap-3" data-testid={`order-item-${order.order_id}-${idx}`}>
                        {item.cake_image && (
                          <img src={item.cake_image} alt={item.cake_name} className="w-20 h-20 min-w-[5rem] flex-shrink-0 object-cover rounded-lg border border-[rgba(44,30,22,0.15)]" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between gap-2">
                            <p className="font-semibold text-[#2C1E16] dark:text-[#FAFAF7]">{item.cake_name}</p>
                            <span className="text-[#D0B8A8] font-semibold shrink-0">₹{item.price}</span>
                          </div>
                          <div className="mt-1 text-sm text-[#5C4A3D] dark:text-[#D0B8A8] space-y-0.5">
                            <p>Weight: <span className="font-semibold">{formatWeight(item.weight)}</span></p>
                            <p>Quantity: <span className="font-semibold">{item.quantity || 1}</span></p>
                            {item.flavor && <p>Flavor: {item.flavor}</p>}
                            <p>Type: {item.cake_type === 'ice' ? 'Ice Cake' : 'Normal Cake'}</p>
                            {item.message && <p>Message on cake: "{item.message}"</p>}
                          </div>
                          {item.delivery_date && (
                            <p className="text-xs text-[#E07A5F] mt-1">
                              🚚 Delivery: {new Date(item.delivery_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[rgba(44,30,22,0.15)] pt-4 flex justify-between"><span className="font-semibold text-[#2C1E16] dark:text-[#FAFAF7]">Total:</span><span className="text-xl font-bold text-[#D0B8A8]" data-testid={`order-total-${order.order_id}`}>₹{order.total_amount}</span></div>

                  {/* Contact shop about this order */}
                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <a
                      href={`https://wa.me/91${SHOP_PHONE}?text=${whatsappText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] hover:bg-[#1EBE5A] text-white font-medium py-3 px-4 transition-colors"
                      data-testid={`whatsapp-${order.order_id}`}
                    >
                      <WhatsAppIcon />
                      WhatsApp
                    </a>
                    <a
                      href={`tel:+91${SHOP_PHONE}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-[#2C1E16] dark:border-[#D0B8A8] text-[#2C1E16] dark:text-[#FAFAF7] hover:bg-[#D0B8A8]/20 font-medium py-3 px-4 transition-colors"
                      data-testid={`call-${order.order_id}`}
                    >
                      <Phone className="h-5 w-5" />
                      Call
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
