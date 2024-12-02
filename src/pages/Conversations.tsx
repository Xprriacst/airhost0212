import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, MessageSquare, AlertTriangle, Wrench, Package, HelpCircle, AlertOctagon } from 'lucide-react';
import type { Conversation, EmergencyTag } from '../types';
import { conversationService } from '../services/conversationService';

const EmergencyIcon = ({ tag }: { tag: EmergencyTag }) => {
  switch (tag) {
    case 'client_mecontent':
      return <AlertTriangle className="w-4 h-4 text-orange-500" title="Client mécontent" />;
    case 'probleme_technique':
      return <Wrench className="w-4 h-4 text-red-500" title="Problème technique" />;
    case 'probleme_stock':
      return <Package className="w-4 h-4 text-yellow-500" title="Problème de stock" />;
    case 'reponse_inconnue':
      return <HelpCircle className="w-4 h-4 text-blue-500" title="Réponse inconnue" />;
    case 'urgence':
      return <AlertOctagon className="w-4 h-4 text-red-600" title="Urgence" />;
    default:
      return null;
  }
};

const Conversations: React.FC = () => {
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const location = useLocation();
  const propertyAutoPilot = location.state?.autoPilot;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const data = propertyId 
          ? await conversationService.getConversationsByProperty(propertyId)
          : await conversationService.getConversations();
        setConversations(data);
      } catch (err) {
        setError('Erreur lors du chargement des conversations');
        console.error('Erreur de chargement des conversations:', err);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, [propertyId]);

  const handleConversationClick = (conversation: Conversation) => {
    navigate(`/chat/${conversation.id}`, {
      state: {
        conversation,
        propertyAutoPilot
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        {propertyId && (
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
        )}
        <h1 className="text-2xl font-bold text-gray-900">
          {propertyId ? 'Conversations de la propriété' : 'Toutes les conversations'}
        </h1>
      </div>

      <div className="space-y-4">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => handleConversationClick(conversation)}
            className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:border-blue-300 transition-colors text-left"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-50 rounded-full">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">{conversation.guestName}</h3>
                  {conversation.emergencyTags?.map((tag) => (
                    <EmergencyIcon key={tag} tag={tag} />
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(conversation.checkIn).toLocaleDateString()} - {new Date(conversation.checkOut).toLocaleDateString()}
                </p>
              </div>
              <div className="ml-auto text-sm text-gray-500">
                {conversation.messages.length} messages
              </div>
            </div>
            
            {conversation.messages.length > 0 && (
              <div className="mt-4 ml-14">
                <p className="text-sm text-gray-600">
                  Dernier message : {conversation.messages[conversation.messages.length - 1].text}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(conversation.messages[conversation.messages.length - 1].timestamp).toLocaleString()}
                </p>
              </div>
            )}
          </button>
        ))}

        {conversations.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune conversation</h3>
            <p className="text-gray-500">Les conversations apparaîtront ici lorsque les invités commenceront à discuter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Conversations;