import { useEffect, useState } from 'react';

const Preloader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#222223]">
      <div className="relative">
        {/* Spinner con brillo dorado */}
        <div
          className="w-28 h-28 rounded-full border-4 border-[#B3A269] animate-spin"
          style={{
            borderRightColor: 'transparent',
            animationDuration: '2s',
            filter: 'drop-shadow(0 0 8px rgba(179, 162, 105, 0.6))'
          }}
        />

        {/* Isotipo centrado - casi llena el spinner */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <img
            src="/assets/isotipo.png"
            alt="Sierra Dorada"
            className="w-24 h-24 animate-pulse object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Preloader;