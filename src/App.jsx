import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Controls from "./components/Controls";
import ProductList from "./components/ProductList";
import ProductFormModal from "./components/ProductFormModal";
import { fetchProducts } from "./features/products/productsSlice";

function App() {
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const onAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const onEdit = (product) => {
    setEditing(product);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <header className="text-center mb-16">
          <div className="glass-effect rounded-3xl p-12 mb-8 shadow-2xl border border-white/30">
            {/* Main Title */}
            <div className="mb-8">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black bg-purple-500 bg-clip-text text-transparent mb-6 leading-tight">
                Product Inventory
              </h1>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-purple-500  bg-clip-text text-transparent">
                Management
              </h2>
            </div>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl  max-w-4xl mx-auto mb-10 leading-relaxed">
              Modern CRUD dashboard with Redux Toolkit and DummyJSON API
              integration
            </p>

            {/* Feature Highlights */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 md:gap-8 text-base md:text-lg">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-full border border-white/20">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                <span className="font-medium">Real-time updates</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-full border border-white/20">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-lg"></div>
                <span className="font-medium">Local storage sync</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-full border border-white/20">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse shadow-lg"></div>
                <span className="font-medium">Search & filter</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="glass-effect rounded-2xl p-6 mb-8">
          <Controls onAdd={onAdd} />
        </div>

        <div className="glass-effect rounded-2xl p-6">
          <ProductList onEdit={onEdit} />
        </div>
      </div>

      <ProductFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initial={editing}
      />
    </div>
  );
}

export default App;
