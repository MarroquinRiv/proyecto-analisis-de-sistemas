import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const TicketManagement = () => {
  const [ticketTypes, setTicketTypes] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Formularios
  const [newTicketType, setNewTicketType] = useState({
    name: '',
    price: ''
  });

  const [newPromotion, setNewPromotion] = useState({
    code: '',
    discount_percent: '',
    active: true
  });

  const [purchaseForm, setPurchaseForm] = useState({
    ticket_type_id: '',
    promotion_id: '',
    visit_date: ''
  });

  // Cargar datos iniciales
  useEffect(() => {
    fetchTicketTypes();
    fetchPromotions();
    fetchTickets();
  }, []);

  const fetchTicketTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('ticket_types')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) throw error;
      setTicketTypes(data);
    } catch (err) {
      setError('Error al cargar tipos de entrada: ' + err.message);
    }
  };

  const fetchPromotions = async () => {
    try {
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('active', true)
        .order('id', { ascending: true });
      
      if (error) throw error;
      setPromotions(data);
    } catch (err) {
      setError('Error al cargar promociones: ' + err.message);
    }
  };

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*')
        .order('purchased_at', { ascending: false });
      
      if (error) throw error;
      setTickets(data);
    } catch (err) {
      setError('Error al cargar entradas: ' + err.message);
    }
  };

  const handleCreateTicketType = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data, error } = await supabase
        .from('ticket_types')
        .insert([newTicketType])
        .select();
      
      if (error) throw error;
      
      // Actualizar la lista de tipos de entrada
      setTicketTypes([...ticketTypes, data[0]]);
      setNewTicketType({ name: '', price: '' });
      setSuccess('Tipo de entrada creado correctamente');
    } catch (err) {
      setError('Error al crear tipo de entrada: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePromotion = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data, error } = await supabase
        .from('promotions')
        .insert([newPromotion])
        .select();
      
      if (error) throw error;
      
      // Actualizar la lista de promociones
      setPromotions([...promotions, data[0]]);
      setNewPromotion({ code: '', discount_percent: '', active: true });
      setSuccess('Promoción creada correctamente');
    } catch (err) {
      setError('Error al crear promoción: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // En una implementación real, aquí se procesaría el pago
      // Por ahora solo simulamos la compra
      
      const { data, error } = await supabase
        .from('tickets')
        .insert([{
          ticket_type_id: purchaseForm.ticket_type_id,
          promotion_id: purchaseForm.promotion_id || null,
          purchaser_profile_id: null, // En una implementación real, se usaría el perfil del usuario
          purchased_at: new Date(),
          visit_date: purchaseForm.visit_date,
          price_paid: 0 // En una implementación real, se calcularía el precio
        }])
        .select();
      
      if (error) throw error;
      
      // Actualizar la lista de entradas
      setTickets([data[0], ...tickets]);
      setPurchaseForm({ ticket_type_id: '', promotion_id: '', visit_date: '' });
      setSuccess('Entrada comprada correctamente');
    } catch (err) {
      setError('Error al comprar entrada: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Entradas y Promociones</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sección de Tipos de Entrada */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Tipos de Entrada</h3>
          
          <form onSubmit={handleCreateTicketType} className="mb-6">
            <h4 className="font-medium mb-2">Agregar Nuevo Tipo de Entrada</h4>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  value={newTicketType.name}
                  onChange={(e) => setNewTicketType({...newTicketType, name: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Precio ($)</label>
                <input
                  type="number"
                  value={newTicketType.price}
                  onChange={(e) => setNewTicketType({...newTicketType, price: parseFloat(e.target.value)})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Crear Tipo'}
              </button>
            </div>
          </form>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ticketTypes.map(type => (
                  <tr key={type.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{type.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${type.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
          
          {/* Sección de Promociones */}
          <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Promociones Activas</h3>
          
          <form onSubmit={handleCreatePromotion} className="mb-6">
            <h4 className="font-medium mb-2">Crear Nueva Promoción</h4>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Código</label>
                <input
                  type="text"
                  value={newPromotion.code}
                  onChange={(e) => setNewPromotion({...newPromotion, code: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Descuento (%)</label>
                <input
                  type="number"
                  value={newPromotion.discount_percent}
                  onChange={(e) => setNewPromotion({...newPromotion, discount_percent: parseFloat(e.target.value)})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="0"
                  max="100"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Crear Promoción'}
              </button>
            </div>
          </form>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descuento</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {promotions.map(promo => (
                  <tr key={promo.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{promo.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{promo.discount_percent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Sección de Compra de Entradas */}
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
          <h3 className="text-xl font-semibold mb-4">Compra de Entradas</h3>
          
          <form onSubmit={handlePurchase} className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo de Entrada</label>
                <select
                  value={purchaseForm.ticket_type_id}
                  onChange={(e) => setPurchaseForm({...purchaseForm, ticket_type_id: parseInt(e.target.value)})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccionar tipo</option>
                  {ticketTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name} - ${type.price}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Promoción (opcional)</label>
                <select
                  value={purchaseForm.promotion_id}
                  onChange={(e) => setPurchaseForm({...purchaseForm, promotion_id: parseInt(e.target.value) || null})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Sin promoción</option>
                  {promotions.map(promo => (
                    <option key={promo.id} value={promo.id}>{promo.code} ({promo.discount_percent}%)</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha de Visita</label>
                <input
                  type="date"
                  value={purchaseForm.visit_date}
                  onChange={(e) => setPurchaseForm({...purchaseForm, visit_date: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="mt-4">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
              >
                {loading ? 'Procesando...' : 'Comprar Entrada'}
              </button>
            </div>
          </form>
          
          <div>
            <h4 className="font-medium mb-2">Entradas Recientes</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Promoción</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tickets.slice(0, 10).map(ticket => {
                    const type = ticketTypes.find(t => t.id === ticket.ticket_type_id);
                    const promo = promotions.find(p => p.id === ticket.promotion_id);
                    return (
                      <tr key={ticket.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{type ? type.name : 'Desconocido'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{new Date(ticket.visit_date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{promo ? promo.code : '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketManagement;