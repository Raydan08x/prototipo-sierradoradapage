import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const VerificationPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        // Get email from location state or local storage if available
        const stateEmail = location.state?.email;
        if (stateEmail) {
            setEmail(stateEmail);
        } else {
            // Fallback: Check if user just registered but wasn't verified
            // Ideally we should pass this via navigation state
            toast.error('No se encontró el correo electrónico para verificar.');
            navigate('/register');
        }
    }, [location, navigate]);

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) return; // Prevent multi-char input

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        if (/^\d+$/.test(pastedData)) {
            const newCode = [...code];
            pastedData.split('').forEach((char, i) => {
                if (i < 6) newCode[i] = char;
            });
            setCode(newCode);
            inputRefs.current[Math.min(pastedData.length - 1, 5)]?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const fullCode = code.join('');
        if (fullCode.length !== 6) {
            toast.error('Por favor ingresa el código completo de 6 dígitos');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/auth/verify-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code: fullCode }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error en la verificación');
            }

            toast.success('¡Correo verificado exitosamente!');

            // Save token and redirect
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Brief delay for success animation
            setTimeout(() => navigate('/perfil'), 1000);

        } catch (error: any) {
            toast.error(error.message);
            // If code expired, offer resend
            if (error.message.includes('expirado')) {
                toast((t) => (
                    <span>
                        El código expiró. <button onClick={() => handleResendCode()} className="underline font-bold">Reenviar</button>
                    </span>
                ), { duration: 5000 });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        setIsResending(true);
        try {
            const response = await fetch('http://localhost:3000/api/auth/resend-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            toast.success('Nuevo código enviado. Revisa tu correo (o la consola si es demo).');
            setCode(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        } catch (error: any) {
            toast.error(error.message || 'Error al reenviar código');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#222223] flex items-center justify-center px-4 py-20">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?q=80&w=2671&auto=format&fit=crop')] bg-cover bg-center opacity-10" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-md bg-[#2A2A2B]/90 backdrop-blur-md p-8 rounded-2xl border border-[#B3A269]/20 shadow-2xl"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#B3A269]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-[#B3A269]" />
                    </div>
                    <h2 className="font-dorsa text-4xl text-[#E5E1E6] mb-2">Verifica tu Correo</h2>
                    <p className="font-barlow text-[#E5E1E6]/70">
                        Hemos enviado un código de 6 dígitos a <br />
                        <span className="text-[#B3A269] font-semibold">{email}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="flex justify-center gap-2">
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                className="w-12 h-14 bg-[#222223] border border-[#B3A269]/30 rounded-lg text-center text-2xl font-bold text-[#B3A269] focus:outline-none focus:border-[#B3A269] focus:ring-1 focus:ring-[#B3A269] transition-all"
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || code.some(d => !d)}
                        className="w-full bg-[#B3A269] text-[#222223] py-3 rounded-full font-barlow-condensed font-bold text-lg hover:bg-[#B3A269]/90 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                Verificar Cuenta <CheckCircle className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-[#E5E1E6]/60 text-sm mb-2">
                        ¿No recibiste el código?
                    </p>
                    <button
                        onClick={handleResendCode}
                        disabled={isResending}
                        className="text-[#B3A269] hover:text-[#B3A269]/80 font-medium text-sm flex items-center justify-center gap-1 mx-auto transition-colors disabled:opacity-50"
                    >
                        {isResending ? (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                            <RefreshCw className="w-3 h-3" />
                        )}
                        Reenviar Código
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default VerificationPage;
