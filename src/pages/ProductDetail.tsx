import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Beer, ShoppingCart, Thermometer, ArrowLeft } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const products = [
  {
    id: '1',
    name: 'American Pale Ale',
    inspiration: 'Inspirada en Xue, dios del sol',
    description: 'La luz del sol en cada sorbo. Brilla con el carácter de Xue, el astro mayor de los Muiscas.',
    price: 12000,
    abv: '4.8%',
    ibu: '31',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    colorHex: '#F4A460',
    colorName: 'Ámbar dorado',
    temperature: '8-10°C',
    legend: 'Xue, el dios del sol, brilla en cada sorbo de esta APA. Su luz dorada y carácter vibrante evocan la energía vital del astro rey.',
    fullDescription: 'Nuestra American Pale Ale rinde homenaje a Xue, el dios sol de los Muiscas. Con un perfecto balance entre maltas y lúpulos americanos, ofrece notas cítricas y tropicales que evocan los rayos del sol atravesando el páramo andino.',
    characteristics: {
      color: 'Ámbar dorado brillante',
      aroma: 'Cítricos, frutas tropicales y pino',
      sabor: 'Balance entre malta y lúpulo con final seco',
      maridaje: 'Carnes a la parrilla, comida picante, quesos fuertes'
    },
    process: 'Elaborada con maltas pale y crystal, complementada con lúpulos americanos. Fermentación limpia que resalta los aromas cítricos.',
    maridaje: [
      { emoji: '🍖', name: 'Carnes a la parrilla' },
      { emoji: '🌶️', name: 'Comida picante' },
      { emoji: '🧀', name: 'Quesos fuertes' }
    ]
  },
  {
    id: '2',
    name: 'Barley Wine',
    inspiration: 'Inspirada en Bochica, héroe civilizador',
    description: 'Sabiduría líquida. Potente como las enseñanzas de Bochica, guía eterno de los Muiscas.',
    price: 18000,
    abv: '10.0%',
    ibu: '50',
    image: 'https://images.unsplash.com/photo-1584225064785-c62a8b43d148?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    colorHex: '#8B4513',
    colorName: 'Ámbar profundo',
    temperature: '12-14°C',
    legend: 'Bochica, el sabio maestro de los Muiscas, comparte su sabiduría en esta compleja Barley Wine.',
    fullDescription: 'Nuestra Barley Wine de edición especial honra a Bochica, el héroe civilizador de los Muiscas. Su complejidad y potencia evocan la sabiduría ancestral, mientras que su maduración representa el tiempo necesario para alcanzar la iluminación.',
    characteristics: {
      color: 'Ámbar profundo con reflejos cobrizos',
      aroma: 'Caramelo, frutas oscuras y notas vinosas',
      sabor: 'Complejo con final cálido',
      maridaje: 'Quesos añejos, postres de caramelo, chocolate negro'
    },
    process: 'Madurada durante meses para desarrollar su complejidad, embotellada en formato especial de 500ml.',
    maridaje: [
      { emoji: '🧀', name: 'Quesos añejos' },
      { emoji: '🍮', name: 'Postres de caramelo' },
      { emoji: '🍫', name: 'Chocolate negro' }
    ]
  },
  {
    id: '3',
    name: 'Sour Ale con Corozo',
    inspiration: 'Inspirada en Bachué, madre de la humanidad',
    description: 'Ácida y vibrante, como la vida que dio Bachué. El inicio de todo sabor.',
    price: 13000,
    abv: '4.5%',
    ibu: '5',
    image: 'https://images.unsplash.com/photo-1523567830207-96731740fa71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    colorHex: '#990012',
    colorName: 'Rojo carmesí',
    temperature: '6-8°C',
    legend: 'Bachué, la madre de la humanidad, emerge de las lagunas sagradas en esta cerveza ácida con corozo.',
    fullDescription: 'Nuestra Sour Ale con Corozo honra a Bachué, la diosa madre de los Muiscas. El corozo, fruta ancestral, representa la fertilidad y el origen, mientras que su acidez evoca la pureza de las aguas sagradas.',
    characteristics: {
      color: 'Rojo carmesí intenso',
      aroma: 'Frutal intenso con notas ácidas',
      sabor: 'Ácido refrescante con notas de frutos rojos',
      maridaje: 'Ceviches, ensaladas frescas, postres de frutas'
    },
    process: 'Fermentación mixta con lactobacillus, adición de corozo durante la maduración.',
    maridaje: [
      { emoji: '🐟', name: 'Ceviches' },
      { emoji: '🥗', name: 'Ensaladas frescas' },
      { emoji: '🍓', name: 'Postres de frutas' }
    ]
  },
  {
    id: '4',
    name: 'Stout Premium',
    inspiration: 'Inspirada en Chibchacum, dios de la tierra',
    description: 'Oscura y densa como la tierra húmeda. La Stout de Sierra Dorada invoca la fuerza de Chibchacum.',
    price: 14000,
    abv: '6.2%',
    ibu: '49',
    image: 'https://images.unsplash.com/photo-1612528443702-f6741f70a049?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    colorHex: '#000000',
    colorName: 'Negro intenso',
    temperature: '10-12°C',
    legend: 'Chibchacum, dios de las aguas y la tierra, se manifiesta en esta stout profunda y compleja.',
    fullDescription: 'Nuestra Stout Premium honra a Chibchacum, el poderoso dios de la tierra y las aguas. Sus intensos sabores a café y chocolate evocan la profundidad de la tierra, mientras que su suavidad recuerda las aguas subterráneas.',
    characteristics: {
      color: 'Negro intenso con espuma cremosa',
      aroma: 'Café recién tostado y chocolate negro',
      sabor: 'Complejo con notas a café y chocolate',
      maridaje: 'Postres de chocolate, carnes asadas, ostras'
    },
    process: 'Elaborada con una mezcla de maltas tostadas y chocolate, fermentación a temperatura controlada.',
    maridaje: [
      { emoji: '🍫', name: 'Postres de chocolate' },
      { emoji: '🥩', name: 'Carnes asadas' },
      { emoji: '🦪', name: 'Ostras' }
    ]
  },
  {
    id: '5',
    name: 'American Amber Ale',
    inspiration: 'Inspirada en Huitaca, diosa muisca del amor y la libertad',
    description: 'Rebelde y apasionada como Huitaca, esta cerveza celebra la libertad y el placer de vivir.',
    price: 12000,
    abv: '5.0%',
    ibu: '30',
    image: 'https://images.unsplash.com/photo-1523567830207-96731740fa71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    colorHex: '#8B0000',
    colorName: 'Ámbar rojizo',
    temperature: '7-9°C',
    legend: 'Inspirada en Huitaca, la diosa muisca del amor, la sensualidad, la embriaguez y la libertad. Desterrada por desafiar las normas impuestas por Bochica, Huitaca representa la rebeldía con propósito, el placer como acto sagrado, y la pasión por la vida sin restricciones.',
    fullDescription: 'Nuestra American Amber Ale rinde homenaje a Huitaca, símbolo de la noche encantadora, del vino, del deseo y de la mujer empoderada. Su perfil maltoso y equilibrado evoca la dulzura de la libertad, mientras que su color ámbar rojizo refleja la pasión por la vida sin restricciones.',
    characteristics: {
      color: 'Ámbar rojizo brillante',
      aroma: 'Caramelo, pan tostado y notas herbales',
      sabor: 'Maltoso con un equilibrado amargor',
      maridaje: 'Carnes a la parrilla, quesos semicurados, pizza'
    },
    process: 'Elaborada con una base de maltas caramelo y especiales, complementada con lúpulos americanos.',
    maridaje: [
      { emoji: '🍖', name: 'Carnes a la parrilla' },
      { emoji: '🧀', name: 'Quesos semicurados' },
      { emoji: '🍕', name: 'Pizza' }
    ]
  }
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = products.find(p => p.id === id);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      setTimeout(() => {
        navigate('/productos');
      }, 1000);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-[#222223] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-[#E5E1E6] mb-4">Producto no encontrado</h2>
          <button
            onClick={() => navigate('/productos')}
            className="px-6 py-3 bg-[#B3A269] text-[#222223] rounded-full hover:bg-[#B3A269]/90 transition-colors"
          >
            Volver a Productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#222223] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-[#E5E1E6] hover:text-[#B3A269] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12"
        >
          <div className="relative">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="aspect-w-3 aspect-h-4 rounded-lg overflow-hidden"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-4xl font-bold text-[#E5E1E6] mb-2">{product.name}</h1>
              <p className="text-[#B3A269] text-xl mb-4">{product.inspiration}</p>
              <p className="text-xl text-[#E5E1E6]/80">{product.fullDescription}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-3 gap-6"
            >
              <div className="p-6 rounded-lg border border-[#B3A269]/10">
                <p className="text-[#B3A269] font-semibold mb-2">ABV</p>
                <p className="text-[#E5E1E6] text-2xl">{product.abv}</p>
              </div>
              <div className="p-6 rounded-lg border border-[#B3A269]/10">
                <p className="text-[#B3A269] font-semibold mb-2">IBU</p>
                <p className="text-[#E5E1E6] text-2xl">{product.ibu}</p>
              </div>
              <div className="p-6 rounded-lg border border-[#B3A269]/10">
                <p className="text-[#B3A269] font-semibold mb-2">Temperatura</p>
                <div className="flex items-center gap-2">
                  <Thermometer className="w-6 h-6 text-[#B3A269]" />
                  <p className="text-[#E5E1E6] text-2xl">{product.temperature}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="p-6 rounded-lg border border-[#B3A269]/10"
            >
              <h3 className="text-xl font-bold text-[#B3A269] mb-4">Características</h3>
              <div className="space-y-4">
                {Object.entries(product.characteristics).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-[#B3A269] capitalize">{key}</p>
                    <p className="text-[#E5E1E6]">{value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="p-6 rounded-lg border border-[#B3A269]/10"
            >
              <h3 className="text-xl font-bold text-[#B3A269] mb-4">Proceso de Elaboración</h3>
              <p className="text-[#E5E1E6]">{product.process}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="p-6 rounded-lg border border-[#B3A269]/10"
            >
              <h3 className="text-xl font-bold text-[#B3A269] mb-4">La Leyenda</h3>
              <p className="text-[#E5E1E6] italic">{product.legend}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex gap-4"
            >
              <button
                onClick={handleAddToCart}
                className="flex-1 px-6 py-3 bg-[#B3A269] text-[#222223] rounded-full font-medium hover:bg-[#B3A269]/90 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Añadir al carrito - ${product.price.toLocaleString()}
              </button>
              <button
                onClick={() => navigate('/productos')}
                className="px-6 py-3 border-2 border-[#B3A269] text-[#B3A269] rounded-full font-medium hover:bg-[#B3A269] hover:text-[#222223] transition-colors"
              >
                Volver
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;