// src/pages/admin/AdminSettings.jsx
import { useState } from 'react';
import { Settings, Save, Check, ShieldCheck, DollarSign, MapPin } from 'lucide-react';
import Card, { CardHeader, CardBody } from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import { Input } from '../../components/Input.jsx';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    platformFee: 5,
    defaultDeliveryFee: 35,
    freeDeliveryThreshold: 500,
    merchantCommissionRate: 5.0,
    maxDeliveryRadiusKm: 8,
    defaultDeliveryRadiusKm: 5,
    enableCod: true,
    enableUpi: true,
    enableCards: true,
    enableNetBanking: true,
    maintenanceMode: false,
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
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>NearCart Platform Configurations</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
          Manage global marketplace fees, geofence radius defaults, and payment rails
        </p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Card>
          <CardHeader title="Fee Schedules & Thresholds" subtitle="Default fees applied during customer checkout" />
          <CardBody style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Input
                label="Customer Platform Fee (₹)"
                type="number"
                value={settings.platformFee}
                onChange={(e) => setSettings({ ...settings, platformFee: Number(e.target.value) })}
              />
              <Input
                label="Base Hyperlocal Delivery Fee (₹)"
                type="number"
                value={settings.defaultDeliveryFee}
                onChange={(e) => setSettings({ ...settings, defaultDeliveryFee: Number(e.target.value) })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Input
                label="Free Delivery Basket Threshold (₹)"
                type="number"
                value={settings.freeDeliveryThreshold}
                onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })}
              />
              <Input
                label="Merchant Commission Rate (%)"
                type="number"
                step="0.1"
                value={settings.merchantCommissionRate}
                onChange={(e) => setSettings({ ...settings, merchantCommissionRate: Number(e.target.value) })}
              />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Geofence & Dispatch Constraints" subtitle="Hyperlocal delivery scoping bounds" />
          <CardBody style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Input
              label="Default Delivery Radius (km)"
              type="number"
              value={settings.defaultDeliveryRadiusKm}
              onChange={(e) => setSettings({ ...settings, defaultDeliveryRadiusKm: Number(e.target.value) })}
            />
            <Input
              label="Maximum Allowable Radius (km)"
              type="number"
              value={settings.maxDeliveryRadiusKm}
              onChange={(e) => setSettings({ ...settings, maxDeliveryRadiusKm: Number(e.target.value) })}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Active Payment Gateways & Rails" subtitle="Toggle checkout payment choices" />
          <CardBody style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: 'var(--text-sm)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.enableCod}
                onChange={(e) => setSettings({ ...settings, enableCod: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
              />
              <span>Cash on Delivery (COD)</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: 'var(--text-sm)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.enableUpi}
                onChange={(e) => setSettings({ ...settings, enableUpi: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
              />
              <span>UPI / Instant QR Payment</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: 'var(--text-sm)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.enableCards}
                onChange={(e) => setSettings({ ...settings, enableCards: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
              />
              <span>Credit & Debit Cards</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: 'var(--text-sm)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={settings.enableNetBanking}
                onChange={(e) => setSettings({ ...settings, enableNetBanking: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
              />
              <span>Net Banking</span>
            </label>
          </CardBody>
        </Card>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" variant="primary" size="lg">
            {saved ? <><Check size={18} /> Platform Configs Saved</> : <><Save size={18} /> Save Settings</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
