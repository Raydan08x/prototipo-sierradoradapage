import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Utensils, QrCode, ArrowRight } from 'lucide-react';

const GastrobarPage = () => {
    const [selectedBranch, setSelectedBranch] = useState<'zipaquira' | null>(null);

    // Placeholder image for the gastrobar (can be replaced with provided or stock)
    // Using a nice interior shot or similar if available, or a generic placeholder
    const gastrobarImage = "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974&auto=format&fit=crop";

    return (
        <div className="pt-24 pb-20 px-4 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
            >
                <h1 className="text-4xl md:text-5xl font-bold text-[#B3A269] mb-4 font-cinzel">
                    Sierra Dorada Gastrobar
                </h1>
                <p className="text-[#E5E1E6]/80 max-w-2xl mx-auto text-lg">
                    Donde la cerveza artesanal encuentra su maridaje perfecto. Experiencias gastronómicas únicas en Zipaquirá.
                </p>
            </motion.div>

            <AnimatePresence mode="wait">
                {!selectedBranch ? (
                    /* Step 1: Select Branch (Sedes) */
                    <motion.div
                        key="branches"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center"
                    >
                        {/* Branch Card: Zipaquirá */}
                        <div
                            onClick={() => setSelectedBranch('zipaquira')}
                            className="bg-[#2A2A2B] rounded-xl overflow-hidden cursor-pointer group hover:ring-2 hover:ring-[#B3A269] transition-all shadow-2xl w-full max-w-md relative"
                        >
                            <div className="h-64 overflow-hidden relative">
                                <img
                                    src={gastrobarImage}
                                    alt="Sede Zipaquirá"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent opacity-80" />
                                <div className="absolute bottom-4 left-4">
                                    <h3 className="text-2xl font-bold text-[#E5E1E6]">Sede Zipaquirá</h3>
                                    <p className="text-[#B3A269] flex items-center gap-1 text-sm">
                                        <MapPin className="w-4 h-4" /> CC Paseo de Gracia, Local 112
                                    </p>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-[#E5E1E6]/70 mb-4 line-clamp-3">
                                    Nuestra sede principal, ubicada en el corazón de la histórica Zipaquirá. Disfruta de nuestra línea completa de cervezas y un menú diseñado para resaltar cada nota de sabor.
                                </p>
                                <button className="w-full py-3 bg-[#B3A269]/20 text-[#B3A269] rounded-lg font-bold group-hover:bg-[#B3A269] group-hover:text-[#222223] transition-colors flex items-center justify-center gap-2">
                                    Ver Detalles <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Placeholder for future branches */}
                        <div className="bg-[#2A2A2B]/50 rounded-xl border border-dashed border-[#B3A269]/30 flex flex-col items-center justify-center p-12 text-center w-full max-w-md opacity-70">
                            <MapPin className="w-12 h-12 text-[#B3A269]/40 mb-4" />
                            <h3 className="text-xl font-bold text-[#E5E1E6]/50">Próximamente</h3>
                            <p className="text-[#E5E1E6]/30 text-sm">¿Dónde te gustaría vernos?</p>
                        </div>
                    </motion.div>
                ) : (
                    /* Step 2: Branch Detail */
                    <motion.div
                        key="detail"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="max-w-4xl mx-auto"
                    >
                        <button
                            onClick={() => setSelectedBranch(null)}
                            className="text-[#B3A269] hover:underline mb-6 flex items-center gap-2"
                        >
                            ← Volver a Sedes
                        </button>

                        <div className="bg-[#2A2A2B] rounded-2xl overflow-hidden shadow-2xl border border-[#B3A269]/20">
                            {/* Hero Image */}
                            <div className="h-64 md:h-80 relative">
                                <img
                                    src={gastrobarImage}
                                    alt="Interior Gastrobar"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#2A2A2B] via-transparent to-transparent" />
                                <div className="absolute bottom-6 left-6 md:left-10">
                                    <h2 className="text-3xl md:text-4xl font-bold text-[#E5E1E6] font-cinzel">Sede Zipaquirá</h2>
                                    <p className="text-[#B3A269] text-lg">Calle 26 #12-63, Local 112</p>
                                </div>
                            </div>

                            <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                                {/* Left: Actions */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-[#E5E1E6] mb-2 flex items-center gap-2">
                                            <Utensils className="text-[#B3A269]" /> Oferta Gastronómica
                                        </h3>
                                        <p className="text-[#E5E1E6]/70">
                                            Explora nuestra carta digital. Hamburguesas artesanales, picadas, y platos fuertes marinados con nuestras propias cervezas.
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <a
                                            href="https://toteat.shop/r/co/Sierra-Dorada-Gastrobar/21360/checkin/menu"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full py-4 bg-[#B3A269] text-[#222223] font-bold text-lg rounded-lg hover:bg-[#B3A269]/90 transition-colors shadow-lg flex items-center justify-center gap-2"
                                        >
                                            <Utensils className="w-5 h-5" /> Ver Menú Digital
                                        </a>

                                        {/* Using generic text for reservation or linking to chatbot/booking section */}
                                        <p className="text-center text-sm text-[#E5E1E6]/50">
                                            ¿Quieres reservar una mesa?
                                        </p>
                                        <a
                                            href="https://wa.me/573138718154?text=Hola%20Sierra%20Dorada%2C%20quisiera%20reservar%20una%20mesa%20en%20el%20Gastrobar%20%F0%9F%8D%94%F0%9F%8D%BA"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full py-4 bg-transparent border border-[#B3A269] text-[#B3A269] font-bold text-lg rounded-lg hover:bg-[#B3A269]/10 transition-colors flex items-center justify-center gap-2"
                                        >
                                            Reservar Mesa
                                        </a>
                                    </div>
                                </div>

                                {/* Right: QR Code */}
                                <div className="flex flex-col items-center justify-center bg-[#222223] p-8 rounded-xl border border-[#B3A269]/10">
                                    <div className="bg-white p-4 rounded-lg shadow-lg mb-4">
                                        <img
                                            src="/images/menu-qr.png"
                                            alt="Código QR Menú"
                                            className="w-48 h-48 object-contain"
                                        />
                                    </div>
                                    <h4 className="text-[#E5E1E6] font-bold flex items-center gap-2 mb-2">
                                        <QrCode className="w-5 h-5 text-[#B3A269]" /> Escanea el Menú
                                    </h4>
                                    <p className="text-[#E5E1E6]/50 text-center text-sm">
                                        Accede rápidamente a nuestra carta desde tu celular sin contacto.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GastrobarPage;
