import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Phone, Plus, User, X } from 'lucide-react';
import ActionButton from './ActionButton';

interface ContactFormData {
  name: string;
  phone: string;
  relationship: string;
}

const EmergencyContacts: React.FC = () => {
  const { state, saveContactToDatabase, removeContactFromDatabase } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    phone: '',
    relationship: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddContact = async () => {
    if (formData.name.trim() && formData.phone.trim()) {
      setIsSubmitting(true);
      setError(null);
      
      try {
        await saveContactToDatabase({
          name: formData.name,
          phone: formData.phone,
          relationship: formData.relationship
        });
        
        // Reset form
        setFormData({ name: '', phone: '', relationship: '' });
        setShowForm(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save contact');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleRemoveContact = async (id: string) => {
    try {
      await removeContactFromDatabase(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove contact');
    }
  };

  return (
    <div className="border border-gray-700 rounded-lg bg-gray-800 p-4 shadow-md">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center">
        <Phone className="mr-2 text-green-500" size={20} />
        Emergency Contacts
      </h2>

      {error && (
        <div className="mb-4 bg-red-900/30 border border-red-800 rounded-lg p-3 text-red-300 text-sm">
          {error}
        </div>
      )}

      {state.emergencyContacts.length === 0 ? (
        <p className="text-gray-400 text-sm mb-4">No emergency contacts added yet.</p>
      ) : (
        <div className="space-y-3 mb-4">
          {state.emergencyContacts.map(contact => (
            <div 
              key={contact.id} 
              className="flex items-center justify-between bg-gray-700 rounded-lg p-3"
            >
              <div className="flex items-center">
                <User className="text-gray-400 mr-3" size={18} />
                <div>
                  <p className="font-medium text-white">{contact.name}</p>
                  <p className="text-sm text-gray-300">{contact.phone}</p>
                  {contact.relationship && (
                    <p className="text-xs text-gray-400">{contact.relationship}</p>
                  )}
                </div>
              </div>
              <button 
                onClick={() => handleRemoveContact(contact.id)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {showForm ? (
        <div className="bg-gray-700 rounded-lg p-4 space-y-3">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full bg-gray-600 border border-gray-500 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Full Name"
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full bg-gray-600 border border-gray-500 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="+1 (555) 123-4567"
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label htmlFor="relationship" className="block text-sm font-medium text-gray-300 mb-1">
              Relationship
            </label>
            <input
              type="text"
              id="relationship"
              name="relationship"
              value={formData.relationship}
              onChange={handleInputChange}
              className="w-full bg-gray-600 border border-gray-500 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., Spouse, Family member, Friend"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="flex space-x-3 pt-2">
            <ActionButton
              label="Cancel"
              onClick={() => setShowForm(false)}
              variant="secondary"
              fullWidth
              disabled={isSubmitting}
            />
            <ActionButton
              label={isSubmitting ? "Saving..." : "Save Contact"}
              onClick={handleAddContact}
              variant="primary"
              fullWidth
              disabled={!formData.name || !formData.phone || isSubmitting}
            />
          </div>
        </div>
      ) : (
        <ActionButton
          label="Add Emergency Contact"
          onClick={() => setShowForm(true)}
          icon={<Plus size={18} />}
          variant="secondary"
          fullWidth
        />
      )}
    </div>
  );
};

export default EmergencyContacts;