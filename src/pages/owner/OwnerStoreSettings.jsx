// src/pages/owner/OwnerStoreSettings.jsx
import { useState } from 'react';
import { Store, Clock, MapPin, DollarSign, Power, Save, Check } from 'lucide-react';
import Button from '../../components/Button.jsx';
import { Input } from '../../components/Input.jsx';
import Card, { CardHeader, CardBody } from '../../components/Card.jsx';
import MapView from '../../components/MapView.jsx';

export default function OwnerStoreSettings() {
  const [storeData, setStoreData] = useState({
    name: 'Pune Daily Mart',
    address: 'Shop 14, Commercial Complex, Baner Road, Pune 411045',
    phone: '+91 98765 01234',
    openingHours: '08:00 AM - 10:00 PM',
    deliveryRadiusKm: 5,
    minOrderAmount: 150,
    holidayMode: false,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>Store Profile & Settings</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
          Configure your store operating hours, local delivery radius, minimum basket, and holiday mode
        </p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Holiday Mode Toggle Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px',
            background: storeData.holidayMode ? 'var(--color-warning-bg)' : 'var(--color-surface)',
            border: storeData.holidayMode ? '1.5px solid var(--color-warning)' : '1px solid var(--color-border)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Power size={18} color={storeData.holidayMode ? 'var(--color-warning)' : 'var(--color-success)'} />
              <strong style={{ fontSize: 'var(--text-base)' }}>Holiday / Vacation Mode</strong>
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
              When enabled, your store shows as "Temporarily Closed" on customer search and no new orders can be placed.
            </p>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: 'var(--text-sm)' }}>
            <input
              type="checkbox"
              checked={storeData.holidayMode}
              onChange={(e) => setStoreData({ ...storeData, holidayMode: e.target.checked })}
              style={{ width: '22px', height: '22px', accentColor: 'var(--color-warning)' }}
            />
            <span>{storeData.holidayMode ? 'Store Inactive' : 'Store Active'}</span>
          </label>
        </div>

        <Card>
          <CardHeader title="General Business Information" />
          <CardBody style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              label="Store Public Name"
              value={storeData.name}
              onChange={(e) => setStoreData({ ...storeData, name: e.target.value })}
            />
            <Input
              label="Physical Street Address"
              value={storeData.address}
              onChange={(e) => setStoreData({ ...storeData, address: e.target.value })}
            />
            <Input
              label="Official Contact Number"
              value={storeData.phone}
              onChange={(e) => setStoreData({ ...storeData, phone: e.target.value })}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Operating Parameters" />
          <CardBody style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Input
                label="Store Timings"
                value={storeData.openingHours}
                onChange={(e) => setStoreData({ ...storeData, openingHours: e.target.value })}
              />
              <Input
                label="Delivery Radius (km)"
                type="number"
                value={storeData.deliveryRadiusKm}
                onChange={(e) => setStoreData({ ...storeData, deliveryRadiusKm: Number(e.target.value) })}
              />
            </div>

            <Input
              label="Minimum Order Amount (₹)"
              type="number"
              value={storeData.minOrderAmount}
              onChange={(e) => setStoreData({ ...storeData, minOrderAmount: Number(e.target.value) })}
            />

            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-text-secondary)', marginBottom: '8px', display: 'block' }}>
                Store Geolocation Pin
              </label>
              <MapView height="200px" pins={[{ lat: 18.559, lng: 73.7868, label: storeData.name }]} />
            </div>
          </CardBody>
        </Card>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="primary" size="lg">
            {saved ? <><Check size={18} /> Settings Saved</> : <><Save size={18} /> Update Store Settings</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
