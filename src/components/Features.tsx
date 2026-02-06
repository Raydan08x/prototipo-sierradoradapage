import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Thermometer, ShoppingCart, Package, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
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
    image: 'https://images.unsplash.com/photo-1584225064785-c62a8b43d148?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
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
    image: 'https://images.unsplash.com/photo-1523567830207-96731740fa71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
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
    image: 'https://images.unsplash.com/photo-1612528443702-f6741f70a049?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
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
    image: 'https://images.unsplash.com/photo-1523567830207-96731740fa71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
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

const Features = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [autoScroll, setAutoScroll] = useState(true);
  const [scrollSpeed, setScrollSpeed] = useState(0.5);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [clonedProducts] = useState([...products, ...products, ...products, ...products]); // Fixed size, no state growth
  const [customPack, setCustomPack] = useState<typeof products[0][]>([]);


  useEffect(() => {
    if (!containerRef.current || !autoScroll || isDragging) return; // Stop auto-scroll on drag

    const container = containerRef.current;
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      const baseSpeed = 0.05; // Adjusted base speed for smoother animation

      let speedMultiplier;
      if (scrollSpeed === 0.25) speedMultiplier = 0.5;
      else if (scrollSpeed === 1) speedMultiplier = 2; // Increased max speed slightly
      else speedMultiplier = 1;

      // Use a consistent speed increment adjusted by delta time
      container.scrollLeft += baseSpeed * speedMultiplier * deltaTime;

      // Infinite Scroll Logic (Reset Position)
      const scrollWidth = container.scrollWidth;

      // We assume the content is tripled/quadrupled. 
      // Reset when we've scrolled past the first set of items (roughly 1/4 of total width)
      const oneSetWidth = scrollWidth / 4;

      if (container.scrollLeft >= oneSetWidth * 2) {
        // Seamlessly jump back to the first set
        container.scrollLeft -= oneSetWidth;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isDragging, scrollSpeed, autoScroll]); // Removed products dependency to prevent re-runs

  // Pointer Events (Unifies Mouse & Touch)
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setAutoScroll(false);
    setStartX(e.pageX - containerRef.current!.offsetLeft);
    setScrollLeft(containerRef.current!.scrollLeft);
    // Capture pointer to ensure we track movement even if it leaves the element
    containerRef.current!.setPointerCapture(e.pointerId);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    setAutoScroll(true);
    containerRef.current!.releasePointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current!.offsetLeft;
    const walk = (x - startX) * 2;
    containerRef.current!.scrollLeft = scrollLeft - walk;
  };

  const handleSpeedChange = (speed: number) => {
    setScrollSpeed(speed);
    setAutoScroll(true);
  };

  const handleAddToCart = (product: any) => {
    addToCart(product);
  };

  const handleAddToPack = (product: typeof products[0]) => {
    if (customPack.length < 4) {
      setCustomPack([...customPack, product]);
    }
  };

  const handleRemoveFromPack = (index: number) => {
    setCustomPack(customPack.filter((_, i) => i !== index));
  };

  const calculatePackPrice = () => {
    const subtotal = customPack.reduce((sum, product) => sum + product.price, 0);
    const discount = subtotal * 0.25; // 25% discount
    return subtotal - discount;
  };

  const handleAddPackToCart = () => {
    customPack.forEach(product => {
      addToCart({
        ...product,
        price: product.price * 0.75
      });
    });

    setCustomPack([]);
  };

  return (
    <div className="py-24 bg-[#2A2A2B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-16">
          <h2 className="font-dorsa text-base text-[#B3A269] font-semibold tracking-wide uppercase">
            Nuestras Cervezas
          </h2>
          <p className="mt-2 font-dorsa text-4xl leading-8 tracking-tight text-[#E5E1E6] sm:text-5xl">
            Tesoros Líquidos
          </p>
          <p className="mt-4 max-w-2xl font-barlow text-xl text-[#E5E1E6]/80 lg:mx-auto">
            Cada cerveza es una obra maestra artesanal que honra a las deidades Muiscas,
            elaborada con los mejores ingredientes y años de experiencia.
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => handleSpeedChange(0.25)}
              className={`px-6 py-2 rounded-full font-barlow-condensed transition-all duration-300 ${scrollSpeed === 0.25
                ? 'bg-[#B3A269] text-[#222223] shadow-lg'
                : 'border border-[#B3A269] text-[#B3A269] hover:bg-[#B3A269]/10'
                }`}
            >
              Lento
            </button>
            <button
              onClick={() => handleSpeedChange(0.5)}
              className={`px-6 py-2 rounded-full font-barlow-condensed transition-all duration-300 ${scrollSpeed === 0.5
                ? 'bg-[#B3A269] text-[#222223] shadow-lg'
                : 'border border-[#B3A269] text-[#B3A269] hover:bg-[#B3A269]/10'
                }`}
            >
              Normal
            </button>
            <button
              onClick={() => handleSpeedChange(1)}
              className={`px-6 py-2 rounded-full font-barlow-condensed transition-all duration-300 ${scrollSpeed === 1
                ? 'bg-[#B3A269] text-[#222223] shadow-lg'
                : 'border border-[#B3A269] text-[#B3A269] hover:bg-[#B3A269]/10'
                }`}
            >
              Rápido
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                if (containerRef.current) {
                  containerRef.current.scrollLeft -= 300;
                }
              }}
              className="p-2 bg-[#B3A269] text-[#222223] rounded-full hover:bg-[#B3A269]/90 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => {
                if (containerRef.current) {
                  containerRef.current.scrollLeft += 300;
                }
              }}
              className="p-2 bg-[#B3A269] text-[#222223] rounded-full hover:bg-[#B3A269]/90 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div
          ref={containerRef}
          className="flex overflow-x-hidden cursor-grab active:cursor-grabbing no-scrollbar will-change-scroll"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onPointerMove={handlePointerMove}
          style={{ touchAction: 'pan-y' }}
        >
          <div className="flex gap-8 min-w-max px-4">
            {clonedProducts.map((product, index) => (
              <motion.div
                key={`${product.id}-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`w-80 md:w-96 bg-[#222223] rounded-lg overflow-hidden md:shadow-xl transform md:hover:scale-105 transition-all duration-300 flex flex-col snap-center ${product.id === '3' ? 'relative ring-2 ring-[#B3A269]' : ''
                  }`}
              >
                {product.id === '3' && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-gradient-to-r from-[#B3A269] to-[#E5E1E6] text-[#222223] px-4 py-1 rounded-full font-barlow-condensed text-sm">
                      Edición Especial
                    </div>
                  </div>
                )}

                <div className="relative h-48">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#222223] to-transparent" />
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-dorsa text-3xl text-[#E5E1E6]">{product.name}</h3>
                      <p className="font-barlow-condensed text-[#B3A269] text-lg">
                        ${product.price.toLocaleString()}
                      </p>
                    </div>
                    <div
                      className="w-8 h-8 rounded-full border-2 border-[#B3A269]"
                      style={{ backgroundColor: product.colorHex }}
                      title={product.colorName}
                    />
                  </div>

                  <p className="font-barlow text-[#B3A269] text-sm mb-2">{product.inspiration}</p>
                  <p className="font-barlow text-[#E5E1E6]/80 mb-4">{product.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="font-barlow-condensed text-[#B3A269] mb-2">Detalles</h4>
                      <div className="space-y-2">
                        <p className="font-barlow text-[#E5E1E6]/80">ABV: {product.abv}</p>
                        <p className="font-barlow text-[#E5E1E6]/80">IBU: {product.ibu}</p>
                        <div className="flex items-center gap-2">
                          <Thermometer className="w-4 h-4 text-[#B3A269]" />
                          <span className="font-barlow text-[#E5E1E6]/80">{product.temperature}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-barlow-condensed text-[#B3A269] mb-2">Maridaje</h4>
                      <ul className="space-y-2">
                        {product.maridaje.map((item, index) => (
                          <li key={index} className="font-barlow text-[#E5E1E6]/80 flex items-center gap-2">
                            <span>{item.emoji}</span>
                            <span>{item.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => navigate(`/producto/${product.id}`)}
                      className="flex-1 px-4 py-2 border-2 border-[#B3A269] text-[#B3A269] rounded-full font-barlow-condensed text-sm font-medium hover:bg-[#B3A269] hover:text-[#222223] transition-colors"
                    >
                      Ver Detalles
                    </button>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 px-4 py-2 bg-[#B3A269] text-[#222223] rounded-full font-barlow-condensed text-sm font-medium hover:bg-[#B3A269]/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Agregar
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-24">
          <div className="lg:text-center mb-16">
            <h2 className="font-dorsa text-base text-[#B3A269] font-semibold tracking-wide uppercase">
              Oferta Especial
            </h2>
            <p className="mt-2 font-dorsa text-4xl leading-8 tracking-tight text-[#E5E1E6] sm:text-5xl">
              Crea tu 4-Pack
            </p>
            <p className="mt-4 max-w-2xl font-barlow text-xl text-[#E5E1E6]/80 lg:mx-auto">
              Selecciona tus 4 cervezas favoritas y obtén un 25% de descuento en tu pack personalizado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#222223] rounded-lg overflow-hidden shadow-xl flex flex-col h-full"
              >
                <div className="relative h-48">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#222223] to-transparent" />
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-dorsa text-2xl text-[#E5E1E6] mb-2">{product.name}</h3>
                  <p className="font-barlow-condensed text-[#B3A269] mb-4">
                    ${product.price.toLocaleString()}
                  </p>
                  <div className="mt-auto w-full">
                    <button
                      onClick={() => handleAddToPack(product)}
                      disabled={customPack.length >= 4}
                      className={`w-full px-4 py-2 rounded-full font-medium transition-colors ${customPack.length >= 4
                        ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                        : 'bg-[#B3A269] text-[#222223] hover:bg-[#B3A269]/90'
                        }`}
                    >
                      Agregar al Pack
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 bg-[#222223] rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-dorsa text-[#E5E1E6]">Tu Pack Personalizado</h3>
              <span className="text-[#B3A269]">{customPack.length}/4 cervezas</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Array(4).fill(null).map((_, index) => (
                <div
                  key={index}
                  className={`h-24 rounded-lg ${customPack[index]
                    ? 'bg-[#2A2A2B]'
                    : 'border-2 border-dashed border-[#2A2A2B]'
                    } flex items-center justify-center relative`}
                >
                  {customPack[index] ? (
                    <>
                      <img
                        src={customPack[index].image}
                        alt={customPack[index].name}
                        className="w-full h-full object-cover rounded-lg opacity-50"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[#E5E1E6] text-sm font-medium">
                          {customPack[index].name}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveFromPack(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 rounded-full"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </>
                  ) : (
                    <Package className="w-8 h-8 text-[#2A2A2B]" />
                  )}
                </div>
              ))}
            </div>

            {customPack.length > 0 && (
              <div className="mt-6 flex items-center justify-between">
                <div>
                  <p className="text-[#E5E1E6]">
                    Subtotal: ${(customPack.reduce((sum, product) => sum + product.price, 0)).toLocaleString()}
                  </p>
                  <p className="text-[#B3A269]">
                    Descuento: 25% OFF
                  </p>
                  <p className="text-xl font-bold text-[#E5E1E6] mt-2">
                    Total: ${calculatePackPrice().toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={handleAddPackToCart}
                  disabled={customPack.length < 4}
                  className={`px-6 py-3 rounded-full font-medium flex items-center gap-2 ${customPack.length < 4
                    ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                    : 'bg-[#B3A269] text-[#222223] hover:bg-[#B3A269]/90'
                    }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Agregar al Carrito
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;