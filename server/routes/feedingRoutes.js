const express = require('express');
const router = express.Router();
const { authenticate, authorizeRole } = require('../middleware/authMiddleware');
const supabase = require('../db/db');

// Obtener todos los alimentos
router.get('/foods', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('food_items')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error al obtener alimentos:', error);
    res.status(500).json({ error: 'Error al obtener alimentos' });
  }
});

// Crear un nuevo alimento
router.post('/foods', authenticate, authorizeRole('staff', 'admin'), async (req, res) => {
  try {
    const { name, unit } = req.body;
    
    const { data, error } = await supabase
      .from('food_items')
      .insert([{ name, unit }])
      .select();
    
    if (error) throw error;
    
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error al crear alimento:', error);
    res.status(500).json({ error: 'Error al crear alimento' });
  }
});

// Actualizar un alimento
router.put('/foods/:id', authenticate, authorizeRole('staff', 'admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, unit } = req.body;
    
    const { data, error } = await supabase
      .from('food_items')
      .update({ name, unit })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    res.json(data[0]);
  } catch (error) {
    console.error('Error al actualizar alimento:', error);
    res.status(500).json({ error: 'Error al actualizar alimento' });
  }
});

// Eliminar un alimento
router.delete('/foods/:id', authenticate, authorizeRole('staff', 'admin'), async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('food_items')
      .delete()
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    res.json({ message: 'Alimento eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar alimento:', error);
    res.status(500).json({ error: 'Error al eliminar alimento' });
  }
});

// Obtener stock de alimentos
router.get('/stock', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('food_stock')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error al obtener stock:', error);
    res.status(500).json({ error: 'Error al obtener stock' });
  }
});

// Actualizar stock de alimento
router.put('/stock/:id', authenticate, authorizeRole('staff', 'admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    
    const { data, error } = await supabase
      .from('food_stock')
      .update({ quantity })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    res.json(data[0]);
  } catch (error) {
    console.error('Error al actualizar stock:', error);
    res.status(500).json({ error: 'Error al actualizar stock' });
  }
});

// Obtener horarios de alimentación
router.get('/schedules', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('feeding_schedules')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error al obtener horarios:', error);
    res.status(500).json({ error: 'Error al obtener horarios' });
  }
});

// Crear horario de alimentación
router.post('/schedules', authenticate, authorizeRole('staff', 'admin'), async (req, res) => {
  try {
    const { animal_id, feeding_time } = req.body;
    
    const { data, error } = await supabase
      .from('feeding_schedules')
      .insert([{ animal_id, feeding_time }])
      .select();
    
    if (error) throw error;
    
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error al crear horario:', error);
    res.status(500).json({ error: 'Error al crear horario' });
  }
});

// Obtener registros de alimentación
router.get('/logs', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('feeding_logs')
      .select('*')
      .order('fed_at', { ascending: false });
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error al obtener registros:', error);
    res.status(500).json({ error: 'Error al obtener registros' });
  }
});

// Registrar alimentación
router.post('/logs', authenticate, authorizeRole('staff', 'admin'), async (req, res) => {
  try {
    const { feeding_schedule_id, fed_by } = req.body;
    
    const { data, error } = await supabase
      .from('feeding_logs')
      .insert([{ feeding_schedule_id, fed_by }])
      .select();
    
    if (error) throw error;
    
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error al registrar alimentación:', error);
    res.status(500).json({ error: 'Error al registrar alimentación' });
  }
});

module.exports = router;