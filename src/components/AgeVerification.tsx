import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from 'lucide-react';

interface AgeVerificationProps {
  onVerified: () => void;
}

const AgeVerification: React.FC<AgeVerificationProps> = ({ onVerified }) => {
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [error, setError] = useState(false);

  const checkAge = () => {
    if (!birthDate) {
      setError(true);
      return;
    }

    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
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
            src="/assets/logo-vertical.png"
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
            <DatePicker
              selected={birthDate}
              onChange={(date) => {
                setBirthDate(date);
                setError(false);
              }}
              dateFormat="dd/MM/yyyy"
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={100}
              placeholderText="DD/MM/AAAA"
              className="w-full bg-[#222223] text-[#E5E1E6] p-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#B3A269]"
              maxDate={new Date()}
              calendarClassName="bg-[#2A2A2B] border-[#B3A269] text-[#E5E1E6]"
              wrapperClassName="w-full"
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