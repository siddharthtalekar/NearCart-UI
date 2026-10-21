// src/pages/owner/OwnerOffers.jsx
import { useState } from 'react';
import { Tag, Plus, Calendar, Percent, Gift, Check, Trash2 } from 'lucide-react';
import { mockOffers } from '../../data/offers.js';
import Button from '../../components/Button.jsx';
import { Input } from '../../components/Input.jsx';
import { Badge } from '../../components/Badge.jsx';
import Modal from '../../components/Modal.jsx';
import Tabs from '../../components/Tabs.jsx';

export default function OwnerOffers() {
  const [offers, setOffers] = useState(mockOffers);
  const [activeTab, setActiveTab] = useState('active');
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    title: '',
    type: 'percentage', // 'percentage' | 'flat' | 'bogo'
    value: 20,
    minOrderValue: 200,
    validUntil: '2026-12-31',
    description: '',
  });

  const handleCreateOffer = (e) => {
    e.preventDefault();
    const newOffer = {
      id: `off_${Date.now()}`,
      code: formData.code.toUpperCase(),
      title: formData.title,
      type: formData.type,
      value: formData.value,
      minOrderValue: formData.minOrderValue,
      validUntil: formData.validUntil,
      description: formData.description,
      status: 'active',
      storeId: 's1',
    };
    setOffers([newOffer, ...offers]);
    setShowModal(false);
  };

  const tabs = [
    { id: 'active', label: 'Active Promotions', badge: offers.filter((o) => o.status === 'active').length },
    { id: 'expired', label: 'Expired / Archived', badge: offers.filter((o) => o.status === 'expired').length },
  ];

  const filtered = offers.filter((o) => (activeTab === 'active' ? o.status === 'active' : o.status === 'expired'));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>Promotional Offers & Discounts</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
            Drive local store sales by publishing percentage discounts, coupons, and BOGO deals
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Create Promo Offer
        </Button>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {filtered.map((offer) => (
          <div
            key={offer.id}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '20px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 'bold',
                  background: 'var(--color-accent-50)',
                  color: 'var(--color-accent-700)',
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px dashed var(--color-accent-300)',
                }}
              >
                {offer.code}
              </span>
              <Badge variant={offer.status === 'active' ? 'success' : 'neutral'}>
                {offer.status.toUpperCase()}
              </Badge>
            </div>

            <div>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold' }}>{offer.title}</h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                {offer.description}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', borderTop: '1px solid var(--color-border)', paddingTop: '10px' }}>
              <span>Min Order: ₹{offer.minOrderValue}</span>
              <span>Valid till: {offer.validUntil}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal to create offer */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Create New Promotional Offer"
        >
          <form onSubmit={handleCreateOffer} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Input
              label="Coupon Code (e.g. FLASH20)"
              required
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            />
            <Input
              label="Offer Title"
              required
              placeholder="e.g. 20% Off on Groceries"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold' }}>Discount Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  style={{ padding: '9px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}
                >
                  <option value="percentage">Percentage Discount (%)</option>
                  <option value="flat">Flat Amount (₹)</option>
                  <option value="bogo">Buy 1 Get 1 Free</option>
                </select>
              </div>

              <Input
                label="Discount Value"
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input
                label="Min Order Amount (₹)"
                type="number"
                value={formData.minOrderValue}
                onChange={(e) => setFormData({ ...formData, minOrderValue: Number(e.target.value) })}
              />
              <Input
                label="Expiry Date"
                type="date"
                value={formData.validUntil}
                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
              />
            </div>

            <Input
              label="Offer Description"
              placeholder="e.g. Applicable on all daily milk and bread orders"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
              <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button type="submit" variant="primary">Publish Offer</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
