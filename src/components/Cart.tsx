import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

const Cart = () => {
  const { 
    items, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity,
    clearCart,
    total 
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50"
        onClick={() => setIsCartOpen(false)}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', duration: 0.3 }}
          className="absolute right-0 top-0 h-full w-full max-w-md bg-[#2A2A2B] shadow-xl"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-[#B3A269]/20">
              <h2 className="text-2xl font-dorsa text-[#E5E1E6]">Carrito de Compras</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-[#B3A269]/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-[#E5E1E6]" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6">
                <ShoppingBag className="w-16 h-16 text-[#B3A269]/20 mb-4" />
                <p className="text-[#E5E1E6]/80 text-center">
                  Tu carrito está vacío
                </p>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-6">
                    {items.map(item => (
                      <div
                        key={item.id}
                        className="flex gap-4 bg-[#222223] p-4 rounded-lg"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="text-[#E5E1E6] font-medium">{item.name}</h3>
                          <p className="text-[#B3A269]">
                            ${item.price.toLocaleString()}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 hover:bg-[#B3A269]/10 rounded-full transition-colors"
                              >
                                <Minus className="w-4 h-4 text-[#B3A269]" />
                              </button>
                              <span className="text-[#E5E1E6] w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 hover:bg-[#B3A269]/10 rounded-full transition-colors"
                              >
                                <Plus className="w-4 h-4 text-[#B3A269]" />
                              </button>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-1 hover:bg-[#B3A269]/10 rounded-full transition-colors ml-auto"
                            >
                              <Trash2 className="w-4 h-4 text-[#B3A269]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 border-t border-[#B3A269]/20">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[#E5E1E6]">Total</span>
                    <span className="text-[#B3A269] text-xl font-medium">
                      ${total.toLocaleString()}
                    </span>
                  </div>
                  <div className="space-y-4">
                    <button
                      onClick={() => {
                        toast.success('Procesando compra...');
                      }}
                      className="w-full px-6 py-3 bg-[#B3A269] text-[#222223] rounded-full font-medium hover:bg-[#B3A269]/90 transition-colors"
                    >
                      Proceder al Pago
                    </button>
                    <button
                      onClick={clearCart}
                      className="w-full px-6 py-3 border border-[#B3A269] text-[#B3A269] rounded-full font-medium hover:bg-[#B3A269]/10 transition-colors"
                    >
                      Vaciar Carrito
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Cart;