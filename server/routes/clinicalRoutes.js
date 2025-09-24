const express = require('express');
const router = express.Router();
const { authenticate, authorizeRole } = require('../middleware/authMiddleware');
const supabase = require('../db/db');

// Obtener todos los medicamentos
router.get('/medications', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error al obtener medicamentos:', error);
    res.status(500).json({ error: 'Error al obtener medicamentos' });
  }
});

// Crear un nuevo medicamento
router.post('/medications', authenticate, authorizeRole('staff', 'admin'), async (req, res) => {
  try {
    const { name } = req.body;
    
    const { data, error } = await supabase
      .from('medications')
      .insert([{ name }])
      .select();
    
    if (error) throw error;
    
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error al crear medicamento:', error);
    res.status(500).json({ error: 'Error al crear medicamento' });
  }
});

// Obtener todas las vacunas
router.get('/vaccines', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('vaccines')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error al obtener vacunas:', error);
    res.status(500).json({ error: 'Error al obtener vacunas' });
  }
});

// Crear una nueva vacuna
router.post('/vaccines', authenticate, authorizeRole('staff', 'admin'), async (req, res) => {
  try {
    const { name } = req.body;
    
    const { data, error } = await supabase
      .from('vaccines')
      .insert([{ name }])
      .select();
    
    if (error) throw error;
    
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error al crear vacuna:', error);
    res.status(500).json({ error: 'Error al crear vacuna' });
  }
});

// Obtener todas las visitas clínicas
router.get('/visits', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('clinical_visits')
      .select('*')
      .order('visit_date', { ascending: false });
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error al obtener visitas:', error);
    res.status(500).json({ error: 'Error al obtener visitas' });
  }
});

// Crear una nueva visita clínica
router.post('/visits', authenticate, authorizeRole('staff', 'admin'), async (req, res) => {
  try {
    const { animal_id, vet_id, visit_date } = req.body;
    
    const { data, error } = await supabase
      .from('clinical_visits')
      .insert([{ animal_id, vet_id, visit_date }])
      .select();
    
    if (error) throw error;
    
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error al crear visita:', error);
    res.status(500).json({ error: 'Error al crear visita' });
  }
});

// Obtener medicamentos asignados a una visita
router.get('/visits/:id/medications', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('clinical_medications')
      .select('*')
      .eq('clinical_visit_id', id);
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error al obtener medicamentos de visita:', error);
    res.status(500).json({ error: 'Error al obtener medicamentos de visita' });
  }
});

// Asignar medicamento a una visita
router.post('/visits/:id/medications', authenticate, authorizeRole('staff', 'admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { medication_id } = req.body;
    
    const { data, error } = await supabase
      .from('clinical_medications')
      .insert([{ clinical_visit_id: id, medication_id }])
      .select();
    
    if (error) throw error;
    
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error al asignar medicamento:', error);
    res.status(500).json({ error: 'Error al asignar medicamento' });
  }
});

// Obtener vacunas asignadas a una visita
router.get('/visits/:id/vaccines', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('clinical_vaccinations')
      .select('*')
      .eq('clinical_visit_id', id);
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error al obtener vacunas de visita:', error);
    res.status(500).json({ error: 'Error al obtener vacunas de visita' });
  }
});

// Asignar vacuna a una visita
router.post('/visits/:id/vaccines', authenticate, authorizeRole('staff', 'admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { vaccine_id } = req.body;
    
    const { data, error } = await supabase
      .from('clinical_vaccinations')
      .insert([{ clinical_visit_id: id, vaccine_id }])
      .select();
    
    if (error) throw error;
    
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error al asignar vacuna:', error);
    res.status(500).json({ error: 'Error al asignar vacuna' });
  }
});

module.exports = router;