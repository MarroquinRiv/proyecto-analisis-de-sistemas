const express = require('express');
const router = express.Router();
const { authenticate, authorizeRole } = require('../middleware/authMiddleware');
const supabase = require('../db/db');

// Obtener todas las áreas
router.get('/areas', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('areas')
      .select('*');
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error al obtener áreas:', error);
    res.status(500).json({ error: 'Error al obtener áreas' });
  }
});

// Obtener todas las tareas de limpieza
router.get('/tasks', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cleaning_tasks')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ error: 'Error al obtener tareas' });
  }
});

// Crear una nueva tarea de limpieza
router.post('/tasks', authenticate, authorizeRole('staff', 'admin'), async (req, res) => {
  try {
    const { area_id, description, frequency } = req.body;
    
    const { data, error } = await supabase
      .from('cleaning_tasks')
      .insert([{ area_id, description, frequency }])
      .select();
    
    if (error) throw error;
    
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({ error: 'Error al crear tarea' });
  }
});

// Actualizar una tarea de limpieza
router.put('/tasks/:id', authenticate, authorizeRole('staff', 'admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { area_id, description, frequency } = req.body;
    
    const { data, error } = await supabase
      .from('cleaning_tasks')
      .update({ area_id, description, frequency })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    res.json(data[0]);
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    res.status(500).json({ error: 'Error al actualizar tarea' });
  }
});

// Eliminar una tarea de limpieza
router.delete('/tasks/:id', authenticate, authorizeRole('staff', 'admin'), async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('cleaning_tasks')
      .delete()
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    res.json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    res.status(500).json({ error: 'Error al eliminar tarea' });
  }
});

// Registrar ejecución de tarea
router.post('/logs', authenticate, authorizeRole('staff', 'admin'), async (req, res) => {
  try {
    const { task_id, performed_by, notes } = req.body;
    
    const { data, error } = await supabase
      .from('cleaning_logs')
      .insert([{ task_id, performed_by, notes }])
      .select();
    
    if (error) throw error;
    
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error al registrar ejecución:', error);
    res.status(500).json({ error: 'Error al registrar ejecución' });
  }
});

// Obtener registros de limpieza
router.get('/logs', authenticate, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cleaning_logs')
      .select('*')
      .order('performed_at', { ascending: false });
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error al obtener registros:', error);
    res.status(500).json({ error: 'Error al obtener registros' });
  }
});

module.exports = router;