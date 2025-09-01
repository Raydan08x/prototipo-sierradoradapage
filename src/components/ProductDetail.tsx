import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Beer, ShoppingCart } from 'lucide-react';

const products = [
  {
    id: '1',
    name: 'Dorada Imperial',
    description: 'Una cerveza dorada de cuerpo completo con notas a caramelo y un final suave.',
    abv: '6.5%',
    ibu: '25',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    fullDescription: 'Inspirada en las antiguas leyendas de El Dorado, esta cerveza dorada representa la búsqueda de la perfección. Sus notas a caramelo y miel evocan los tesoros dorados de las antiguas civilizaciones.',
    characteristics: {
      color: 'Dorado brillante',
      aroma: 'Caramelo, miel y maltas tostadas',
      sabor: 'Equilibrado con notas dulces y un final limpio',
      maridaje: 'Carnes a la parrilla, quesos maduros'
    },
    legend: 'Se dice que cuando los antiguos exploradores buscaban El Dorado, encontraron inspiración en el color dorado de esta cerveza, que brillaba como el oro líquido bajo el sol del atardecer. Cada sorbo es un viaje a través del tiempo, conectando el presente con las legendarias historias de búsqueda y descubrimiento.'
  },
  {
    id: '2',
    name: 'Leyenda Negra',
    description: 'Stout imperial con intensos sabores a café y chocolate negro.',
    abv: '8.0%',
    ibu: '45',
    image: 'https://images.unsplash.com/photo-1571767454098-246b94fbcf70?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    fullDescription: 'Tan oscura como las profundidades de los lagos sagrados, esta stout imperial encarna los misterios de las antiguas civilizaciones. Cada sorbo revela nuevas capas de complejidad.',
    characteristics: {
      color: 'Negro intenso',
      aroma: 'Café recién tostado y chocolate negro',
      sabor: 'Complejo con notas de café, chocolate y un toque de vainilla',
      maridaje: 'Postres de chocolate, carnes ahumadas'
    },
    legend: 'La Leyenda Negra nace de las historias sobre los lagos sagrados donde los muiscas realizaban sus ofrendas. Su color negro profundo representa las aguas misteriosas que guardaban los tesoros más preciados de la civilización.'
  },
  {
    id: '3',
    name: 'Rubia Mítica',
    description: 'Cerveza rubia tipo Pilsner, refrescante con un toque de lúpulo aromático.',
    abv: '4.8%',
    ibu: '20',
    image: 'https://images.unsplash.com/photo-1523567830207-96731740fa71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    fullDescription: 'Ligera como los rayos del sol sobre el agua cristalina, esta Pilsner representa la pureza y claridad de los manantiales sagrados. Su sabor refrescante evoca momentos de celebración.',
    characteristics: {
      color: 'Dorado pálido',
      aroma: 'Lúpulos florales y cítricos',
      sabor: 'Limpio y refrescante con un final seco',
      maridaje: 'Mariscos, ensaladas frescas'
    },
    legend: 'La Rubia Mítica encuentra su inspiración en los rayos del sol que iluminaban los templos dorados de El Dorado. Su claridad y pureza son un tributo a la luz que guiaba a los exploradores en su búsqueda del mítico reino.'
  },
  {
    id: '4',
    name: 'Tesoro Rojo',
    description: 'Red Ale con carácter maltoso y un equilibrado amargor.',
    abv: '5.5%',
    ibu: '30',
    image: 'https://images.unsplash.com/photo-1612528443702-f6741f70a049?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
    fullDescription: 'El color rojizo de esta ale evoca el atardecer sobre las antiguas ciudades perdidas. Su sabor maltoso y equilibrado rinde homenaje a las tradiciones cerveceras ancestrales.',
    characteristics: {
      color: 'Ámbar rojizo',
      aroma: 'Maltas caramelizadas y frutas rojas',
      sabor: 'Maltoso con un equilibrado amargor',
      maridaje: 'Carnes rojas, quesos fuertes'
    },
    legend: 'El Tesoro Rojo representa el fuego sagrado que ardía en los templos de El Dorado. Su color rojizo evoca los atardeceres sobre las montañas donde los antiguos realizaban sus ceremonias, mientras su sabor complejo cuenta historias de tradición y misterio.'
  }
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#222223] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-[#E5E1E6] mb-4">Producto no encontrado</h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-[#B3A269] text-[#222223] rounded-full hover:bg-[#B3A269]/90 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#222223] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="relative">
            <div className="aspect-w-3 aspect-h-4 rounded-lg overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-[#E5E1E6] mb-4">{product.name}</h1>
              <p className="text-xl text-[#B3A269]">{product.fullDescription}</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#2A2A2B] p-6 rounded-lg">
                <p className="text-[#B3A269] font-semibold mb-2">ABV</p>
                <p className="text-[#E5E1E6] text-2xl">{product.abv}</p>
              </div>
              <div className="bg-[#2A2A2B] p-6 rounded-lg">
                <p className="text-[#B3A269] font-semibold mb-2">IBU</p>
                <p className="text-[#E5E1E6] text-2xl">{product.ibu}</p>
              </div>
            </div>

            <div className="bg-[#2A2A2B] p-6 rounded-lg">
              <h3 className="text-xl font-bold text-[#B3A269] mb-4">Características</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[#B3A269]">Color</p>
                  <p className="text-[#E5E1E6]">{product.characteristics.color}</p>
                </div>
                <div>
                  <p className="text-[#B3A269]">Aroma</p>
                  <p className="text-[#E5E1E6]">{product.characteristics.aroma}</p>
                </div>
                <div>
                  <p className="text-[#B3A269]">Sabor</p>
                  <p className="text-[#E5E1E6]">{product.characteristics.sabor}</p>
                </div>
                <div>
                  <p className="text-[#B3A269]">Maridaje</p>
                  <p className="text-[#E5E1E6]">{product.characteristics.maridaje}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#2A2A2B] p-6 rounded-lg">
              <h3 className="text-xl font-bold text-[#B3A269] mb-4">La Leyenda</h3>
              <p className="text-[#E5E1E6] italic">{product.legend}</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => navigate(`/cart?add=${product.id}`)}
                className="flex-1 px-6 py-3 bg-[#B3A269] text-[#222223] rounded-full font-medium hover:bg-[#B3A269]/90 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Añadir al carrito
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 border-2 border-[#B3A269] text-[#B3A269] rounded-full font-medium hover:bg-[#B3A269] hover:text-[#222223] transition-colors"
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;