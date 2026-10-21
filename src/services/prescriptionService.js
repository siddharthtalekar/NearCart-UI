// src/services/prescriptionService.js — Pharmacy Doctor's List / Prescription Service
import { storage, genId } from '../utils/helpers.js';
import { mockStores } from '../data/stores.js';

const STORAGE_KEY = 'nc_prescriptions';

// Sample base64-friendly realistic placeholder images for doctor's prescriptions so user doesn't have to upload one to test
export const SAMPLE_PRESCRIPTIONS = [
  {
    id: 'sample-rx-1',
    title: 'Dr. R. Kulkarni — General Physician (Fever, Cold & Antibiotic List)',
    doctorName: 'Dr. Rajesh Kulkarni, MBBS, MD',
    clinic: 'Pune Care Polyclinic, Baner',
    previewUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80',
    medicinesList: [
      'Tab Dolo 650mg — 1 strip (15 tabs) — 1-0-1 after food',
      'Tab Augmentin 625 Duo — 1 strip (10 tabs) — 1-0-1 x 5 days',
      'Tab Pantocid 40mg — 1 strip (10 tabs) — 1-0-0 before breakfast',
      'Syrup Ascoril D Plus — 1 bottle (100ml) — 2 tsp TDS',
    ],
  },
  {
    id: 'sample-rx-2',
    title: 'Dr. Sunita Mehta — Cardiologist & Diabetologist (Monthly Maintenance)',
    doctorName: 'Dr. Sunita Mehta, MD (Medicine), DM (Cardio)',
    clinic: 'Sahyadri Specialty Care, Aundh',
    previewUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=500&q=80',
    medicinesList: [
      'Tab Telma 40mg — 2 strips (30 tabs) — 1 morning daily',
      'Tab Glycomet GP 1 — 2 strips (30 tabs) — 1 after dinner',
      'Tab Shelcal 500 — 1 strip (15 tabs) — 1 daily afternoon',
      'Ecosprin 75mg — 1 strip (14 tabs) — 1 after lunch',
    ],
  },
];

const INITIAL_PRESCRIPTION_ORDERS = [
  {
    id: 'RX-98241',
    patientName: 'Priya Sharma',
    doctorName: 'Dr. Rajesh Kulkarni',
    clinicName: 'Pune Care Polyclinic, Baner',
    storeId: 's2',
    storeName: 'MediCare Pharmacy',
    storePhone: '+91 98234 56789',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80',
    durationDays: '15 Days Supply',
    allowGeneric: true,
    callBeforeBilling: true,
    patientNotes: 'Please check expiry date and send original bill. Urgent delivery needed.',
    deliveryAddress: 'Flat 402, Rohan Nilay, Baner Road, Pune 411045',
    contactNumber: '+91 98765 43210',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    status: 'pharmacist_reviewing', // 'uploaded' | 'pharmacist_reviewing' | 'billed_ready' | 'out_for_delivery' | 'delivered'
    statusLabel: 'Pharmacist Reviewing & Transcribing',
    estimatedTotal: 340,
    pharmacistNotes: 'Doctor handwriting verified. 3 of 3 medicines in stock (Dolo 650, Pantocid 40, Ascoril). Pharmacist calling you for final confirmation.',
    itemsIdentified: [
      { name: 'Dolo 650mg Strip', qty: '1 strip (15 tabs)', price: 32 },
      { name: 'Pantocid 40mg Strip', qty: '1 strip (10 tabs)', price: 148 },
      { name: 'Ascoril D Plus Cough Syrup 100ml', qty: '1 bottle', price: 160 },
    ],
  },
  {
    id: 'RX-89410',
    patientName: 'Priya Sharma',
    doctorName: 'Dr. Sunita Mehta',
    clinicName: 'Sahyadri Specialty Care, Aundh',
    storeId: 's11',
    storeName: 'QuickMed 24x7 Pharmacy',
    storePhone: '+91 98901 23456',
    imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&q=80',
    durationDays: '30 Days Supply',
    allowGeneric: false,
    callBeforeBilling: false,
    patientNotes: 'Regular monthly diabetes and BP medications.',
    deliveryAddress: 'Flat 402, Rohan Nilay, Baner Road, Pune 411045',
    contactNumber: '+91 98765 43210',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    status: 'delivered',
    statusLabel: 'Delivered Successfully',
    estimatedTotal: 580,
    pharmacistNotes: 'Delivered by Delivery Partner Rahul K. with batch details and GST tax invoice.',
    itemsIdentified: [
      { name: 'Telma 40mg Strip', qty: '2 strips (30 tabs)', price: 210 },
      { name: 'Glycomet GP 1mg', qty: '2 strips (30 tabs)', price: 240 },
      { name: 'Shelcal 500 Calcium', qty: '1 strip (15 tabs)', price: 130 },
    ],
  },
];

export const prescriptionService = {
  getPrescriptions: () => {
    let orders = storage.get(STORAGE_KEY);
    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      storage.set(STORAGE_KEY, INITIAL_PRESCRIPTION_ORDERS);
      return INITIAL_PRESCRIPTION_ORDERS;
    }
    return orders;
  },

  createPrescriptionOrder: ({
    imageUrl,
    doctorName,
    clinicName,
    patientName = 'Priya Sharma',
    storeId = 's2',
    durationDays = 'Full Prescription',
    allowGeneric = true,
    callBeforeBilling = true,
    patientNotes = '',
    deliveryAddress = 'Flat 402, Rohan Nilay, Baner Road, Pune 411045',
    contactNumber = '+91 98765 43210',
  }) => {
    const orders = prescriptionService.getPrescriptions();
    const store = mockStores.find((s) => s.id === storeId) || mockStores.find((s) => s.category === 'pharmacy') || {
      name: 'MediCare Pharmacy',
      phone: '+91 98234 56789',
    };

    const newRx = {
      id: `RX-${Math.floor(10000 + Math.random() * 90000)}`,
      patientName,
      doctorName: doctorName || "Doctor's Prescription Note",
      clinicName: clinicName || 'Local Medical Clinic',
      storeId,
      storeName: store.name,
      storePhone: store.phone || '+91 98234 56789',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80',
      durationDays,
      allowGeneric,
      callBeforeBilling,
      patientNotes,
      deliveryAddress,
      contactNumber,
      createdAt: new Date().toISOString(),
      status: 'pharmacist_reviewing',
      statusLabel: 'Pharmacist Reviewing & Transcribing',
      estimatedTotal: 250,
      pharmacistNotes: `Transmitted directly to ${store.name}. Registered Pharmacist is reviewing prescription list and will dispatch within 15 minutes.`,
      itemsIdentified: [
        { name: "Prescribed medicines (as per doctor's uploaded list)", qty: durationDays, price: 250 },
      ],
    };

    const updated = [newRx, ...orders];
    storage.set(STORAGE_KEY, updated);
    return newRx;
  },

  cancelPrescriptionOrder: (id) => {
    const orders = prescriptionService.getPrescriptions();
    const updated = orders.filter((o) => o.id !== id);
    storage.set(STORAGE_KEY, updated);
    return updated;
  },
};
