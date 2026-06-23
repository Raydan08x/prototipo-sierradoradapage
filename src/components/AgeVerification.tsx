import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { publicAsset } from '../lib/assets';

interface AgeVerificationProps {
  onVerified: () => void;
}

const AgeVerification: React.FC<AgeVerificationProps> = ({ onVerified }) => {
  const [birthDate, setBirthDate] = useState('');
  const [error, setError] = useState(false);

  const parseBirthDate = (value: string) => {
    const normalizedValue = value.trim();
    const slashMatch = normalizedValue.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    const dashMatch = normalizedValue.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);

    if (!slashMatch && !dashMatch) {
      return null;
    }

    const [, first, second, third] = slashMatch ?? dashMatch ?? [];
    const day = slashMatch ? Number(first) : Number(third);
    const month = Number(second);
    const year = slashMatch ? Number(third) : Number(first);
    const date = new Date(year, month - 1, day);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }

    return date;
  };

  const checkAge = () => {
    const today = new Date();
    const parsedBirthDate = parseBirthDate(birthDate);

    if (!parsedBirthDate || parsedBirthDate > today) {
      setError(true);
      return;
    }

    let calculatedAge = today.getFullYear() - parsedBirthDate.getFullYear();
    const monthDiff = today.getMonth() - parsedBirthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < parsedBirthDate.getDate())) {
      calculatedAge = calculatedAge - 1;
    }

    if (calculatedAge >= 18) {
      onVerified();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#222223] flex items-center justify-center p-4">
      <div className="bg-[#2A2A2B] p-8 rounded-lg max-w-md w-full shadow-xl">
        <div className="text-center mb-8">
          <img
            src={publicAsset('assets/logo-vertical.png')}
            alt="Sierra Dorada"
            className="h-32 mx-auto mb-6"
          />
          <h2 className="font-dorsa text-4xl text-[#E5E1E6] mb-4">Verificación de Edad</h2>
          <p className="font-barlow-condensed text-[#B3A269] text-sm mb-6">
            Para acceder a este sitio, debes ser mayor de edad
          </p>
        </div>

        <div className="relative mb-6">
          <div className="flex items-center">
            <input
              type="text"
              value={birthDate}
              onChange={(event) => {
                setBirthDate(event.target.value);
                setError(false);
              }}
              inputMode="numeric"
              placeholder="DD/MM/AAAA"
              aria-label="Fecha de nacimiento"
              className="w-full bg-[#222223] text-[#E5E1E6] p-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#B3A269]"
            />
            <div className="bg-[#222223] p-3 rounded-r-lg border-l border-[#B3A269]">
              <Calendar className="h-6 w-6 text-[#B3A269]" />
            </div>
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-2 font-barlow">
              Debes ser mayor de edad para acceder
            </p>
          )}
        </div>

        <button
          onClick={checkAge}
          className="w-full bg-[#B3A269] text-[#222223] py-3 rounded-lg font-barlow-condensed font-medium hover:bg-[#B3A269]/90 transition-colors"
        >
          Verificar Edad
        </button>

        <div className="mt-6 text-center space-y-2">
          <p className="font-barlow-condensed text-[#E5E1E6] text-sm font-bold">
            EL EXCESO DE ALCOHOL ES PERJUDICIAL PARA LA SALUD
          </p>
          <p className="font-barlow-condensed text-[#E5E1E6] text-sm font-bold">
            PROHÍBASE EL EXPENDIO DE BEBIDAS EMBRIAGANTES A MENORES DE EDAD
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgeVerification;
