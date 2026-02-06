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
        {/* Logo animado */}
        <div className="w-24 h-24 rounded-full border-4 border-[#B3A269] animate-spin" style={{
          borderRightColor: 'transparent',
          animationDuration: '2s'
        }} />

        {/* Isotipo animado */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <img
            src="/assets/isotipo.png"
            alt="Sierra Dorada"
            className="w-32 h-32 animate-pulse object-contain rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Preloader;