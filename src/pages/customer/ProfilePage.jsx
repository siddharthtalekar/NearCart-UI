// src/pages/customer/ProfilePage.jsx
import { useState } from 'react';
import { User, MapPin, CreditCard, Bell, Shield, Save, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import Button from '../../components/Button.jsx';
import { Input } from '../../components/Input.jsx';
import Card, { CardHeader, CardBody } from '../../components/Card.jsx';
import Tabs from '../../components/Tabs.jsx';

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('details');

  const [formData, setFormData] = useState({
    name: user?.name || 'Siddharth Patil',
    email: user?.email || 'customer@nearcart.in',
    phone: user?.phone || '9876543210',
    address: 'Flat 402, Green Acres, Baner Road, Pune 411045',
  });

  const [saved, setSaved] = useState(false);

  const [notifSettings, setNotifSettings] = useState({
    orderUpdates: true,
    promotions: true,
    emailReceipts: true,
    smsAlerts: false,
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: 'details', label: 'Personal Info', icon: <User size={16} /> },
    { id: 'addresses', label: 'Saved Addresses', icon: <MapPin size={16} /> },
    { id: 'notifications', label: 'Notification Settings', icon: <Bell size={16} /> },
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)' }}>Account Settings</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
          Manage your contact details, saved addresses, and notification preferences
        </p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} style={{ marginBottom: '24px' }} />

      {activeTab === 'details' && (
        <Card>
          <CardBody>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Input
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                <Button type="submit" variant="primary">
                  {saved ? <><Check size={16} /> Saved Successfully</> : <><Save size={16} /> Save Changes</>}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      {activeTab === 'addresses' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ padding: '16px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <strong>Home (Default)</strong>
              <span style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: 'bold' }}>Active Area</span>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
              {formData.address}
            </p>
          </div>

          <div style={{ padding: '16px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <strong>Office / Work</strong>
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
              Tower 4, Quadron Business Park, Hinjewadi Phase 2, Pune 411057
            </p>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <Card>
          <CardBody>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {Object.entries({
                orderUpdates: 'Live Order Stage Notifications (Preparing, Picked Up, Delivered)',
                promotions: 'Hyperlocal Offers & Store Discounts in My Area',
                emailReceipts: 'Send digital tax receipts to email',
                smsAlerts: 'Receive SMS delivery OTPs',
              }).map(([key, label]) => (
                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: 'var(--text-sm)' }}>
                  <input
                    type="checkbox"
                    checked={notifSettings[key]}
                    onChange={(e) => setNotifSettings({ ...notifSettings, [key]: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--color-primary)' }}
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
