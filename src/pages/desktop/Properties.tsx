import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Zap, MessageSquare, Users, Clock, Wifi } from 'lucide-react';
import type { Property } from '../../types';
import { airtableService } from '../../services/airtableService';
import PropertyForm from '../../components/PropertyForm';

const Properties: React.FC = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([
    {
      id: '1',
      name: 'Studio Blois',
      address: '13 rue des Papegaults, Blois',
      accessCodes: {
        wifi: {
          name: 'FREEBOX-AE4AC6',
          password: 'barbani@%-solvi38-irrogatura-cannetum?&'
        },
        door: '210'
      },
      houseRules: ['Max 4 personnes', 'Pas de visiteurs supplémentaires', 'Respecter le calme'],
      amenities: ['TV', 'Cuisine', 'Chauffage'],
      checkInTime: '15:00',
      checkOutTime: '11:00',
      maxGuests: 4,
      photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267']
    },
    {
      id: '2',
      name: 'Villa Sunset',
      address: '123 Avenue de la Plage, Biarritz',
      accessCodes: {
        wifi: {
          name: 'SunsetVilla_5G',
          password: 'welcome2024!'
        },
        door: '4080#'
      },
      houseRules: ['Pas de fête', 'Pas de fumée', 'Calme entre 22h et 8h'],
      amenities: ['Piscine', 'Accès plage', 'Parking gratuit'],
      checkInTime: '15:00',
      checkOutTime: '11:00',
      maxGuests: 6,
      photos: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6']
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [autoPilotSettings, setAutoPilotSettings] = useState<Record<string, boolean>>({});

  const handleViewConversations = (propertyId: string) => {
    navigate(`/conversations/${propertyId}`, { 
      state: { autoPilot: autoPilotSettings[propertyId] }
    });
  };

  const handleEdit = (property: Property, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProperty(property);
    setShowForm(true);
  };

  const handleDelete = async (propertyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette propriété ?')) {
      try {
        await airtableService.deleteProperty(propertyId);
        setProperties(properties.filter(p => p.id !== propertyId));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la suppression';
        setError(errorMessage);
      }
    }
  };

  const toggleAutoPilot = (propertyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAutoPilotSettings(prev => ({
      ...prev,
      [propertyId]: !prev[propertyId]
    }));
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mes Propriétés</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-5 h-5 mr-2" />
          Ajouter une propriété
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg flex items-center justify-between">
          <p>{error}</p>
          <button 
            onClick={() => setError(null)}
            className="text-sm underline hover:text-red-700"
          >
            Réessayer
          </button>
        </div>
      )}

      {properties.length === 0 && !error ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune propriété</h3>
          <p className="text-gray-500">Commencez par ajouter votre première propriété.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="relative h-48">
                <img
                  src={property.photos[0]}
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 space-x-2">
                  <button
                    onClick={(e) => handleEdit(property, e)}
                    className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="sr-only">Modifier</span>
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => handleDelete(property.id, e)}
                    className="bg-white p-2 rounded-full shadow-lg hover:bg-red-50 transition-colors"
                  >
                    <span className="sr-only">Supprimer</span>
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{property.name}</h3>
                    <p className="text-gray-600">{property.address}</p>
                  </div>
                  <button
                    onClick={(e) => toggleAutoPilot(property.id, e)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                      autoPilotSettings[property.id]
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Zap className={`w-4 h-4 ${autoPilotSettings[property.id] ? 'text-blue-500' : 'text-gray-400'}`} />
                    <span className="text-sm font-medium">
                      {autoPilotSettings[property.id] ? 'Auto-pilot ON' : 'Auto-pilot OFF'}
                    </span>
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>Max {property.maxGuests} personnes</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Check-in: {property.checkInTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Wifi className="w-4 h-4" />
                    <span>WiFi disponible</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MessageSquare className="w-4 h-4" />
                    <span>Réponses auto</span>
                  </div>
                </div>

                <button
                  onClick={() => handleViewConversations(property.id)}
                  className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Voir les conversations
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <PropertyForm
          property={selectedProperty}
          onClose={() => {
            setShowForm(false);
            setSelectedProperty(null);
          }}
          onSave={() => {
            setShowForm(false);
            setSelectedProperty(null);
          }}
        />
      )}
    </div>
  );
};

export default Properties;