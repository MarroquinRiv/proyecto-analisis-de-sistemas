import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const ClinicalManagement = () => {
  const [medications, setMedications] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Formularios
  const [newMedication, setNewMedication] = useState({
    name: ''
  });
  
  const [newVaccine, setNewVaccine] = useState({
    name: ''
  });
  
  const [newVisit, setNewVisit] = useState({
    animal_id: '',
    vet_id: '',
    visit_date: ''
  });
  
  const [newMedicationAssignment, setNewMedicationAssignment] = useState({
    visit_id: '',
    medication_id: ''
  });
  
  const [newVaccineAssignment, setNewVaccineAssignment] = useState({
    visit_id: '',
    vaccine_id: ''
  });
  
  // Cargar datos iniciales
  useEffect(() => {
    fetchMedications();
    fetchVaccines();
    fetchVisits();
  }, []);
  
  const fetchMedications = async () => {
    try {
      const { data, error } = await supabase
        .from('medications')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) throw error;
      setMedications(data);
    } catch (err) {
      setError('Error al cargar medicamentos: ' + err.message);
    }
  };
  
  const fetchVaccines = async () => {
    try {
      const { data, error } = await supabase
        .from('vaccines')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) throw error;
      setVaccines(data);
    } catch (err) {
      setError('Error al cargar vacunas: ' + err.message);
    }
  };
  
  const fetchVisits = async () => {
    try {
      const { data, error } = await supabase
        .from('clinical_visits')
        .select('*')
        .order('visit_date', { ascending: false });
      
      if (error) throw error;
      setVisits(data);
    } catch (err) {
      setError('Error al cargar visitas: ' + err.message);
    }
  };
  
  const handleCreateMedication = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase
        .from('medications')
        .insert([newMedication])
        .select();
      
      if (error) throw error;
      
      // Actualizar la lista de medicamentos
      setMedications([...medications, data[0]]);
      setNewMedication({ name: '' });
    } catch (err) {
      setError('Error al crear medicamento: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateVaccine = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase
        .from('vaccines')
        .insert([newVaccine])
        .select();
      
      if (error) throw error;
      
      // Actualizar la lista de vacunas
      setVaccines([...vaccines, data[0]]);
      setNewVaccine({ name: '' });
    } catch (err) {
      setError('Error al crear vacuna: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateVisit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase
        .from('clinical_visits')
        .insert([newVisit])
        .select();
      
      if (error) throw error;
      
      // Actualizar la lista de visitas
      setVisits([data[0], ...visits]);
      setNewVisit({ animal_id: '', vet_id: '', visit_date: '' });
    } catch (err) {
      setError('Error al crear visita: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAssignMedication = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase
        .from('clinical_medications')
        .insert([newMedicationAssignment])
        .select();
      
      if (error) throw error;
      
      // En una aplicación real, se actualizaría la vista de la visita
      setNewMedicationAssignment({ visit_id: '', medication_id: '' });
    } catch (err) {
      setError('Error al asignar medicamento: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAssignVaccine = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase
        .from('clinical_vaccinations')
        .insert([newVaccineAssignment])
        .select();
      
      if (error) throw error;
      
      // En una aplicación real, se actualizaría la vista de la visita
      setNewVaccineAssignment({ visit_id: '', vaccine_id: '' });
    } catch (err) {
      setError('Error al asignar vacuna: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Control Clínico</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sección de Medicamentos */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Medicamentos</h3>
          
          <form onSubmit={handleCreateMedication} className="mb-6">
            <h4 className="font-medium mb-2">Agregar Nuevo Medicamento</h4>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  value={newMedication.name}
                  onChange={(e) => setNewMedication({...newMedication, name: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Crear Medicamento'}
              </button>
            </div>
          </form>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {medications.map(med => (
                  <tr key={med.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{med.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Sección de Vacunas */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Vacunas</h3>
          
          <form onSubmit={handleCreateVaccine} className="mb-6">
            <h4 className="font-medium mb-2">Agregar Nueva Vacuna</h4>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  value={newVaccine.name}
                  onChange={(e) => setNewVaccine({...newVaccine, name: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Crear Vacuna'}
              </button>
            </div>
          </form>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vaccines.map(vac => (
                  <tr key={vac.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{vac.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Sección de Visitas */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Visitas Clínicas</h3>
          
          <form onSubmit={handleCreateVisit} className="mb-6">
            <h4 className="font-medium mb-2">Registrar Nueva Visita</h4>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">ID del Animal</label>
                <input
                  type="number"
                  value={newVisit.animal_id}
                  onChange={(e) => setNewVisit({...newVisit, animal_id: parseInt(e.target.value)})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">ID del Veterinario</label>
                <input
                  type="number"
                  value={newVisit.vet_id}
                  onChange={(e) => setNewVisit({...newVisit, vet_id: parseInt(e.target.value)})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha de Visita</label>
                <input
                  type="date"
                  value={newVisit.visit_date}
                  onChange={(e) => setNewVisit({...newVisit, visit_date: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Registrar Visita'}
              </button>
            </div>
          </form>
          
          <div className="space-y-4">
            {visits.slice(0, 10).map(visit => (
              <div key={visit.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between">
                  <h4 className="font-medium">Visita del animal {visit.animal_id}</h4>
                  <span className="text-sm text-gray-500">{new Date(visit.visit_date).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-600">Veterinario: {visit.vet_id}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Sección de Asignaciones */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Asignaciones</h3>
          
          <div className="space-y-6">
            {/* Asignar Medicamento */}
            <div>
              <h4 className="font-medium mb-2">Asignar Medicamento a Visita</h4>
              <form onSubmit={handleAssignMedication} className="space-y-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Visita</label>
                  <select
                    value={newMedicationAssignment.visit_id}
                    onChange={(e) => setNewMedicationAssignment({...newMedicationAssignment, visit_id: parseInt(e.target.value)})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seleccionar visita</option>
                    {visits.map(visit => (
                      <option key={visit.id} value={visit.id}>Visita {visit.id} - Animal {visit.animal_id}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Medicamento</label>
                  <select
                    value={newMedicationAssignment.medication_id}
                    onChange={(e) => setNewMedicationAssignment({...newMedicationAssignment, medication_id: parseInt(e.target.value)})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seleccionar medicamento</option>
                    {medications.map(med => (
                      <option key={med.id} value={med.id}>{med.name}</option>
                    ))}
                  </select>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Asignar Medicamento'}
                </button>
              </form>
            </div>
            
            {/* Asignar Vacuna */}
            <div>
              <h4 className="font-medium mb-2">Asignar Vacuna a Visita</h4>
              <form onSubmit={handleAssignVaccine} className="space-y-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Visita</label>
                  <select
                    value={newVaccineAssignment.visit_id}
                    onChange={(e) => setNewVaccineAssignment({...newVaccineAssignment, visit_id: parseInt(e.target.value)})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seleccionar visita</option>
                    {visits.map(visit => (
                      <option key={visit.id} value={visit.id}>Visita {visit.id} - Animal {visit.animal_id}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Vacuna</label>
                  <select
                    value={newVaccineAssignment.vaccine_id}
                    onChange={(e) => setNewVaccineAssignment({...newVaccineAssignment, vaccine_id: parseInt(e.target.value)})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seleccionar vacuna</option>
                    {vaccines.map(vac => (
                      <option key={vac.id} value={vac.id}>{vac.name}</option>
                    ))}
                  </select>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Asignar Vacuna'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalManagement;