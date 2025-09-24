const express = require('express');
const router = express.Router();
const { authenticate, authorizeRole } = require('../middleware/authMiddleware');
const supabase = require('../db/db');

// Obtener todos los tipos de entrada
router.get('/types', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ticket_types')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error al obtener tipos de entrada:', error);
    res.status(500).json({ error: 'Error al obtener tipos de entrada' });
  }
});

// Crear un nuevo tipo de entrada
router.post('/types', authenticate, authorizeRole('admin'), async (req, res) => {
  try {
    const { name, price } = req.body;
    
    const { data, error } = await supabase
      .from('ticket_types')
      .insert([{ name, price }])
      .select();
    
    if (error) throw error;
    
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error al crear tipo de entrada:', error);
    res.status(500).json({ error: 'Error al crear tipo de entrada' });
  }
});

// Obtener todas las promociones activas
router.get('/promotions', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('active', true)
      .order('id', { ascending: true });
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error al obtener promociones:', error);
    res.status(500).json({ error: 'Error al obtener promociones' });
  }
});

// Crear una nueva promoción
router.post('/promotions', authenticate, authorizeRole('admin'), async (req, res) => {
  try {
    const { code, discount_percent, active } = req.body;
    
    const { data, error } = await supabase
      .from('promotions')
      .insert([{ code, discount_percent, active }])
      .select();
    
    if (error) throw error;
    
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error al crear promoción:', error);
    res.status(500).json({ error: 'Error al crear promoción' });
  }
});

// Comprar entradas (simulación)
router.post('/buy', authenticate, async (req, res) => {
  try {
    const { ticket_type_id, promotion_id, visit_date, purchaser_email } = req.body;
    
    // En una implementación real, necesitaríamos:
    // 1. Verificar disponibilidad
    // 2. Calcular precio final
    // 3. Registrar la compra
    
    // Para esta simulación, solo creamos el registro de entrada
    const { data, error } = await supabase
      .from('tickets')
      .insert([{
        ticket_type_id,
        promotion_id,
        purchaser_profile_id: null, // En una implementación real, se usaría el perfil del usuario
        purchased_at: new Date(),
        visit_date,
        price_paid: 0 // En una implementación real, se calcularía el precio
      }])
      .select();
    
    if (error) throw error;
    
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error al comprar entrada:', error);
    res.status(500).json({ error: 'Error al comprar entrada' });
  }
});

// Obtener todas las entradas compradas
router.get('/tickets', authenticate, authorizeRole('admin'), async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .order('purchased_at', { ascending: false });
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error al obtener entradas:', error);
    res.status(500).json({ error: 'Error al obtener entradas' });
  }
});

module.exports = router;