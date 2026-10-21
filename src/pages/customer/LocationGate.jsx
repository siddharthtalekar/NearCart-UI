// src/pages/customer/LocationGate.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Check, Plus, Home, Briefcase, Compass } from 'lucide-react';
import Button from '../../components/Button.jsx';
import MapView from '../../components/MapView.jsx';
import Card, { CardBody } from '../../components/Card.jsx';
import { storage } from '../../utils/helpers.js';

const SAVED_ADDRESSES = [
  { id: 'addr_1', type: 'Home', label: 'Flat 402, Green Acres, Baner Road, Pune 411045', lat: 18.559, lng: 73.7868, isDefault: true },
  { id: 'addr_2', type: 'Work', label: 'Tower 4, Quadron Business Park, Hinjewadi Phase 2, Pune', lat: 18.591, lng: 73.738, isDefault: false },
  { id: 'addr_3', type: 'Other', label: 'Bunglow 12, Prathamesh Society, Aundh, Pune 411007', lat: 18.562, lng: 73.808, isDefault: false },
];

export default function LocationGate() {
  const navigate = useNavigate();
  const [selectedAddr, setSelectedAddr] = useState(() => {
    return storage.get('nc_delivery_location') || SAVED_ADDRESSES[0];
  });
  const [locating, setLocating] = useState(false);

  const handleSelect = (addr) => {
    setSelectedAddr(addr);
    storage.set('nc_delivery_location', addr);
  };

  const handleUseCurrentLocation = () => {
    setLocating(true);
    setTimeout(() => {
      setLocating(false);
      const current = {
        id: 'addr_current',
        type: 'Current GPS',
        label: 'Near High Street, Balewadi / Baner, Pune 411045',
        lat: 18.565,
        lng: 73.778,
      };
      handleSelect(current);
    }, 1000);
  };

  const handleConfirm = () => {
    storage.set('nc_delivery_location', selectedAddr);
    navigate('/customer');
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', marginBottom: '8px' }}>
          Select Delivery Location
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
          NearCart displays verified stores, exact live stock, and delivery fees within 5 km of your confirmed address.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Saved Addresses list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Button
            variant="outline"
            fullWidth
            onClick={handleUseCurrentLocation}
            loading={locating}
            style={{ justifyContent: 'center' }}
          >
            <Navigation size={18} color="var(--color-primary)" /> Use Current GPS Location
          </Button>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-semibold)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>
              Saved Addresses
            </span>
            {SAVED_ADDRESSES.map((addr) => {
              const isSelected = selectedAddr?.id === addr.id;
              return (
                <div
                  key={addr.id}
                  onClick={() => handleSelect(addr)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '16px',
                    borderRadius: 'var(--radius-lg)',
                    border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    backgroundColor: isSelected ? 'var(--color-primary-50)' : 'var(--color-surface)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <div style={{ marginTop: '2px', color: isSelected ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}>
                    {addr.type === 'Home' ? <Home size={18} /> : addr.type === 'Work' ? <Briefcase size={18} /> : <MapPin size={18} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 'var(--font-semibold)', fontSize: 'var(--text-sm)' }}>{addr.type}</span>
                      {isSelected && <span style={{ color: 'var(--color-primary)', fontSize: 'var(--text-xs)', fontWeight: 'bold' }}>✓ Selected</span>}
                    </div>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', lineHeight: '1.4' }}>
                      {addr.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <Button variant="primary" size="lg" fullWidth onClick={handleConfirm} style={{ marginTop: '8px' }}>
            Confirm & Explore Stores Nearby
          </Button>
        </div>

        {/* Map Preview */}
        <div>
          <Card>
            <CardBody style={{ padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Compass size={18} color="var(--color-primary)" />
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-semibold)' }}>
                  Delivery Radius Preview
                </span>
              </div>
              <MapView
                height="280px"
                interactive={false}
                pins={[
                  { lat: selectedAddr?.lat || 18.559, lng: selectedAddr?.lng || 73.7868, label: 'Delivery Point' },
                  { lat: 18.562, lng: 73.789, label: 'Pune Daily Mart' },
                  { lat: 18.556, lng: 73.782, label: 'Wellness Medico' },
                ]}
              />
              <div style={{ marginTop: '12px', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Delivery Area: <strong>Baner / Aundh Cluster</strong></span>
                <span>Radius: <strong>5.0 km</strong></span>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
