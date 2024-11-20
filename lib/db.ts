"use client";

import { z } from 'zod';

export const ContactSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
  phone: z.string().min(10, "Geçerli bir telefon numarası giriniz"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz").optional().nullable(),
  address: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  favorite: z.boolean().default(false),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Contact = z.infer<typeof ContactSchema>;

const STORAGE_KEY = 'contacts_data';

function getStoredContacts(): Contact[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function setStoredContacts(contacts: Contact[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
}

export const db_operations = {
  getContacts: (search?: string) => {
    let contacts = getStoredContacts();
    
    if (search) {
      const searchLower = search.toLowerCase();
      contacts = contacts.filter(contact => 
        contact.name.toLowerCase().includes(searchLower) ||
        contact.phone.toLowerCase().includes(searchLower) ||
        (contact.email?.toLowerCase().includes(searchLower) ?? false)
      );
    }
    
    return contacts.sort((a, b) => {
      if (a.favorite === b.favorite) {
        return a.name.localeCompare(b.name);
      }
      return a.favorite ? -1 : 1;
    });
  },

  getContact: (id: number) => {
    return getStoredContacts().find(contact => contact.id === id);
  },

  createContact: (contact: Omit<Contact, 'id'>) => {
    const contacts = getStoredContacts();
    const newId = contacts.length > 0 ? Math.max(...contacts.map(c => c.id ?? 0)) + 1 : 1;
    const newContact = {
      ...contact,
      id: newId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    contacts.push(newContact);
    setStoredContacts(contacts);
    return newId;
  },

  updateContact: (id: number, contact: Partial<Contact>) => {
    const contacts = getStoredContacts();
    const index = contacts.findIndex(c => c.id === id);
    
    if (index !== -1) {
      contacts[index] = {
        ...contacts[index],
        ...contact,
        updated_at: new Date().toISOString(),
      };
      setStoredContacts(contacts);
      return true;
    }
    return false;
  },

  deleteContact: (id: number) => {
    const contacts = getStoredContacts();
    const filtered = contacts.filter(c => c.id !== id);
    setStoredContacts(filtered);
    return true;
  },

  toggleFavorite: (id: number) => {
    const contacts = getStoredContacts();
    const contact = contacts.find(c => c.id === id);
    
    if (contact) {
      return db_operations.updateContact(id, {
        favorite: !contact.favorite,
      });
    }
    return false;
  }
};