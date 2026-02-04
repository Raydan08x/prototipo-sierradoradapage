import React, { useState } from 'react';
import { api as supabase } from '../../lib/api';
import toast from 'react-hot-toast';
import { Calendar, Users, Info } from 'lucide-react';

const BookingForm = () => {
    const [formData, setFormData] = useState({
        client_name: '',
        client_email: '',
        client_phone: '',
        visit_date: '',
        group_size: 4,
        notes: ''
    });
    const [loading, setLoading] = useState(false);

    const [isSuccess, setIsSuccess] = useState(false);

    const isWeekend = (dateString: string) => {
        const date = new Date(dateString);
        // 5 = Saturday (because day is 0-6, wait... 0=Sun, 1=Mon... 5=Fri, 6=Sat)
        // Actually getDay() returns 0 for Sunday, 6 for Saturday.
        const day = date.getUTCDay();
        return day === 0 || day === 6;
    };

    const validateDate = (dateString: string) => {
        if (!dateString) return false;
        const date = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (date < today) return "La fecha no puede ser en el pasado";
        if (!isWeekend(dateString)) return "Las visitas solo están disponibles Sábados y Domingos";
        return true;
    };

    const sendEmailNotification = async (data: any) => {
        // En una aplicación real, esto conectaría con un servicio de email (SendGrid, EmailJS, Supabase Edge Functions)
        // Por ahora, simulamos el envío y dejamos la estructura lista.
        console.log(`📧 Enviando correo a: sierradoradacb@gmail.com, reservas@sierradorada.co`);
        console.log(`📝 Datos:`, data);

        // Simulación de delay de red
        await new Promise(resolve => setTimeout(resolve, 500));
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate Date
        const dateValidation = validateDate(formData.visit_date);
        if (dateValidation !== true) {
            toast.error(typeof dateValidation === 'string' ? dateValidation : 'Fecha inválida');
            return;
        }

        // Validate Group Size
        if (formData.group_size < 4 || formData.group_size > 20) {
            toast.error('El grupo debe ser entre 4 y 20 personas');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase
                .from('reservations')
                .insert(formData);

            if (error) throw error;

            // 1. Notificación por Email (Simulada/Backend)
            await sendEmailNotification(formData);

            // 2. Preparar WhatsApp
            const message = encodeURIComponent(
                `¡Hola amigos de Sierra Dorada! 🍻\n\n` +
                `Me encantaría agendar una visita y vivir la Experiencia Cervecera. 🏔️🍺\n\n` +
                `Aquí están mis detalles para la reserva:\n` +
                `👤 *Nombre:* ${formData.client_name}\n` +
                `📅 *Fecha:* ${formData.visit_date}\n` +
                `👥 *Grupo:* ${formData.group_size} aventuras\n` +
                `📝 *Notas especiales:* ${formData.notes || 'Ninguna'}\n\n` +
                `¡Quedo atento a su confirmación! 🤘`
            );
            const whatsappUrl = `https://wa.me/573138718154?text=${message}`;

            toast.success('¡Solicitud enviada! Redirigiendo a WhatsApp...');

            // 3. Abrir WhatsApp automáticamente
            // Usamos location.href para redirección segura (evita bloqueo de pop-ups)
            window.location.href = whatsappUrl;

            // Fallback visual por si acaso (aunque href no falla por popups)
            toast.success('Abriendo WhatsApp...');

            setIsSuccess(true);
        } catch (error) {
            console.error('Error booking:', error);
            toast.error('Error al enviar la solicitud');
        } finally {
            setLoading(false);
        }
    };

    if (isSuccess) {
        const message = encodeURIComponent(
            `¡Hola amigos de Sierra Dorada! 🍻\n\n` +
            `Me encantaría agendar una visita y vivir la Experiencia Cervecera. 🏔️🍺\n\n` +
            `Aquí están mis detalles para la reserva:\n` +
            `👤 *Nombre:* ${formData.client_name}\n` +
            `📅 *Fecha:* ${formData.visit_date}\n` +
            `👥 *Grupo:* ${formData.group_size} aventuras\n` +
            `📝 *Notas especiales:* ${formData.notes || 'Ninguna'}\n\n` +
            `¡Quedo atento a su confirmación! 🤘`
        );
        const whatsappUrl = `https://wa.me/573138718154?text=${message}`;

        return (
            <div className="bg-[#2A2A2B] p-8 rounded-xl border border-[#B3A269]/20 shadow-2xl text-center">
                <div className="w-16 h-16 bg-[#B3A269]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar className="w-8 h-8 text-[#B3A269]" />
                </div>
                <h3 className="text-2xl font-bold text-[#E5E1E6] mb-4">¡Solicitud Recibida!</h3>
                <p className="text-[#E5E1E6]/80 mb-8">
                    Para confirmar tu reserva inmediatamente, por favor envía los detalles a nuestro WhatsApp oficial.
                </p>

                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-4 bg-[#25D366] text-white font-bold text-lg rounded-lg hover:bg-[#128C7E] transition-colors shadow-lg flex items-center justify-center gap-2 mb-4"
                >
                    Confirmar por WhatsApp
                    <Info className="w-5 h-5" />
                </a>

                <button
                    onClick={() => {
                        setIsSuccess(false);
                        setFormData({
                            client_name: '',
                            client_email: '',
                            client_phone: '',
                            visit_date: '',
                            group_size: 4,
                            notes: ''
                        });
                    }}
                    className="text-[#B3A269] hover:text-[#E5E1E6] text-sm underline transition-colors"
                >
                    Hacer otra reserva
                </button>
            </div>
        );
    }

    return (
        <div className="bg-[#2A2A2B] p-8 rounded-xl border border-[#B3A269]/20 shadow-2xl">
            <h3 className="text-2xl font-bold text-[#E5E1E6] mb-6 flex items-center gap-2">
                <Calendar className="text-[#B3A269]" />
                Reserva tu Visita
            </h3>

            <div className="bg-[#B3A269]/10 p-4 rounded-lg mb-6 border border-[#B3A269]/20">
                <h4 className="font-bold text-[#B3A269] mb-2 flex items-center gap-2">
                    <Info className="w-4 h-4" /> Información Importante
                </h4>
                <ul className="text-sm text-[#E5E1E6] space-y-1 list-disc list-inside">
                    <li>Solo Sábados y Domingos</li>
                    <li>Grupos de 4 a 20 personas</li>
                    <li>Confirmación vía WhatsApp</li>
                </ul>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-[#E5E1E6] mb-1">Nombre Completo</label>
                    <input
                        type="text"
                        required
                        value={formData.client_name}
                        onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                        className="w-full bg-[#222223] text-[#E5E1E6] rounded-lg p-3 border border-[#B3A269]/20 focus:border-[#B3A269] focus:outline-none"
                        placeholder="Tu nombre"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[#E5E1E6] mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={formData.client_email}
                            onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                            className="w-full bg-[#222223] text-[#E5E1E6] rounded-lg p-3 border border-[#B3A269]/20 focus:border-[#B3A269] focus:outline-none"
                            placeholder="tu@email.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#E5E1E6] mb-1">Teléfono (WhatsApp)</label>
                        <input
                            type="tel"
                            required
                            value={formData.client_phone}
                            onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                            className="w-full bg-[#222223] text-[#E5E1E6] rounded-lg p-3 border border-[#B3A269]/20 focus:border-[#B3A269] focus:outline-none"
                            placeholder="+57 300 123 4567"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-[#E5E1E6] mb-1">Fecha de Visita</label>
                        <input
                            type="date"
                            required
                            min={new Date().toISOString().split('T')[0]}
                            value={formData.visit_date}
                            onChange={(e) => setFormData({ ...formData, visit_date: e.target.value })}
                            className="w-full bg-[#222223] text-[#E5E1E6] rounded-lg p-3 border border-[#B3A269]/20 focus:border-[#B3A269] focus:outline-none [color-scheme:dark]"
                        />
                        <p className="text-xs text-gray-400 mt-1">Sábados o Domingos únicamente</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#E5E1E6] mb-1">Tamaño del Grupo</label>
                        <div className="relative">
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="number"
                                min="4"
                                max="20"
                                required
                                value={formData.group_size}
                                onChange={(e) => setFormData({ ...formData, group_size: parseInt(e.target.value) })}
                                className="w-full bg-[#222223] text-[#E5E1E6] rounded-lg p-3 pl-10 border border-[#B3A269]/20 focus:border-[#B3A269] focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#E5E1E6] mb-1">Notas Adicionales</label>
                    <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={2}
                        className="w-full bg-[#222223] text-[#E5E1E6] rounded-lg p-3 border border-[#B3A269]/20 focus:border-[#B3A269] focus:outline-none"
                        placeholder="¿Alguna petición especial?"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-[#B3A269] text-[#222223] font-bold text-lg rounded-lg hover:bg-[#B3A269]/90 transition-colors shadow-lg hover:shadow-[#B3A269]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Enviando...' : 'Solicitar Reserva'}
                </button>
            </form>
        </div>
    );
};

export default BookingForm;
