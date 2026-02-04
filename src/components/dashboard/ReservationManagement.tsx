import { useState, useEffect } from 'react';
import { api as supabase } from '../../lib/api';
import {
    Calendar,
    Users,
    Check,
    X,
    MessageCircle,
    AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Reservation {
    id: string;
    client_name: string;
    client_email: string;
    client_phone: string;
    visit_date: string;
    group_size: number;
    status: string;
    notes: string;
    created_at: string;
}

const ReservationManagement = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        try {
            const { data, error } = await supabase
                .from('reservations')
                .select('*')
                .order('visit_date', { ascending: true });

            if (error) throw error;
            setReservations(data || []);
        } catch (error) {
            console.error('Error fetching reservations:', error);
            toast.error('Error al cargar reservas');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('reservations')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;

            toast.success(`Reserva ${newStatus === 'confirmed' ? 'confirmada' : 'cancelada'}`);
            setReservations(reservations.map(r =>
                r.id === id ? { ...r, status: newStatus } : r
            ));
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Error al actualizar estado');
        }
    };

    const openWhatsApp = (phone: string, name: string, date: string) => {
        const formattedDate = new Date(date).toLocaleDateString();
        const message = `Hola ${name}, te escribimos de Cervecería Sierra Dorada para confirmar tu visita planeada para el ${formattedDate}.`;
        const whatsappUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed': return 'text-green-400 bg-green-400/10 border-green-400/20';
            case 'cancelled': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'confirmed': return 'Confirmada';
            case 'cancelled': return 'Cancelada';
            default: return 'Pendiente';
        }
    };

    if (loading) return <div>Cargando reservas...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#E5E1E6]">Gestión de Reservas</h2>
                <div className="flex gap-2 text-sm text-gray-400">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400"></span> Pendiente</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400"></span> Confirmada</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400"></span> Cancelada</span>
                </div>
            </div>

            <div className="grid gap-4">
                {reservations.length === 0 ? (
                    <div className="bg-[#2A2A2B] p-8 rounded-lg text-center text-gray-400">
                        <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        No hay reservas registradas.
                    </div>
                ) : (
                    reservations.map((reservation) => (
                        <div
                            key={reservation.id}
                            className="bg-[#2A2A2B] p-6 rounded-lg border border-[#B3A269]/10 flex flex-col md:flex-row justify-between gap-6 hover:bg-[#2A2A2B]/80 transition-colors"
                        >
                            <div className="flex-1 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-[#E5E1E6]">{reservation.client_name}</h3>
                                        <p className="text-sm text-gray-400">{reservation.client_email}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(reservation.status)}`}>
                                        {getStatusLabel(reservation.status)}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-2 text-[#E5E1E6]">
                                        <Calendar className="w-4 h-4 text-[#B3A269]" />
                                        {new Date(reservation.visit_date).toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </div>
                                    <div className="flex items-center gap-2 text-[#E5E1E6]">
                                        <Users className="w-4 h-4 text-[#B3A269]" />
                                        {reservation.group_size} Personas
                                    </div>
                                    <div className="flex items-center gap-2 text-[#E5E1E6] col-span-2">
                                        <MessageCircle className="w-4 h-4 text-[#B3A269]" />
                                        {reservation.client_phone}
                                    </div>
                                </div>

                                {reservation.notes && (
                                    <div className="bg-[#222223] p-3 rounded border border-gray-700 text-sm text-gray-300 italic">
                                        "{reservation.notes}"
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col justify-center gap-3 min-w-[200px] border-t md:border-t-0 md:border-l border-[#B3A269]/10 pt-4 md:pt-0 md:pl-6">
                                <button
                                    onClick={() => openWhatsApp(reservation.client_phone, reservation.client_name, reservation.visit_date)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    Contactar WhatsApp
                                </button>

                                {reservation.status === 'pending' && (
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => updateStatus(reservation.id, 'confirmed')}
                                            className="flex items-center justify-center gap-2 px-3 py-2 bg-[#B3A269]/20 text-[#B3A269] border border-[#B3A269] rounded-lg hover:bg-[#B3A269] hover:text-[#222223] transition-colors"
                                        >
                                            <Check className="w-4 h-4" /> Confirmar
                                        </button>
                                        <button
                                            onClick={() => updateStatus(reservation.id, 'cancelled')}
                                            className="flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                                        >
                                            <X className="w-4 h-4" /> Cancelar
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
export default ReservationManagement;
