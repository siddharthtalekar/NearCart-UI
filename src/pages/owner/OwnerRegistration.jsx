// src/pages/owner/OwnerRegistration.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Store, Upload, CheckCircle2, Clock, MapPin, FileText, ArrowRight, ArrowLeft } from 'lucide-react';
import { categories } from '../../data/stores.js';
import { storeService } from '../../services/storeService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Button from '../../components/Button.jsx';
import { Input } from '../../components/Input.jsx';
import MapView from '../../components/MapView.jsx';
import Card, { CardBody } from '../../components/Card.jsx';

export default function OwnerRegistration() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: 'Green Grocers & Organic Mart',
    category: 'grocery',
    address: 'Shop 14, Commercial Complex, High Street, Baner, Pune',
    phone: '9876501234',
    openingHours: '08:00 AM - 10:00 PM',
    deliveryRadiusKm: 5,
    minOrderAmount: 150,
  });

  const [documents, setDocuments] = useState({
    fssai: 'fssai_cert_2026.pdf',
    gstin: 'gst_certificate.pdf',
    shopAct: 'shop_act_license.pdf',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await storeService.registerStore(user?.id || 'u2', {
        ...formData,
        documents,
      });
      setSubmitted(true);
    } catch (err) {
      alert(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '32px 16px', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', background: 'var(--color-primary-100)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <Clock size={32} color="var(--color-primary)" />
        </div>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', marginBottom: '8px' }}>
          Application Pending Admin Approval
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: '24px' }}>
          Thank you for registering <strong>{formData.name}</strong>! Your store details, FSSAI, and business credentials have been forwarded to our platform verification team. Verifications typically conclude within 24 to 48 hours.
        </p>

        <div style={{ padding: '16px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', textAlign: 'left', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Status:</span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-warning)', fontWeight: 'bold' }}>Under Review</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Target Market:</span>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold' }}>Baner / Aundh Zone, Pune</span>
          </div>
        </div>

        <Link to="/owner">
          <Button variant="primary">Preview Store Dashboard Demo</Button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)' }}>Merchant Registration Wizard</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
          Step {step} of 3: {step === 1 ? 'Store Details' : step === 2 ? 'Location & Operating Hours' : 'Business Documents'}
        </p>
      </div>

      <Card>
        <CardBody style={{ padding: '24px' }}>
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input
                label="Store Business Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-text-secondary)' }}>
                  Store Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-surface)',
                  }}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Store Contact Phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <Button variant="primary" onClick={() => setStep(2)}>
                  Next: Location & Hours <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Input
                label="Store Street Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />

              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--color-text-secondary)', marginBottom: '8px', display: 'block' }}>
                  Pin Store Location on Map
                </label>
                <MapView
                  height="220px"
                  pins={[{ lat: 18.559, lng: 73.7868, label: formData.name }]}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <Input
                  label="Daily Working Hours"
                  value={formData.openingHours}
                  onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                />
                <Input
                  label="Minimum Order Amount (₹)"
                  type="number"
                  value={formData.minOrderAmount}
                  onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                <Button variant="ghost" onClick={() => setStep(1)}>
                  <ArrowLeft size={16} /> Back
                </Button>
                <Button variant="primary" onClick={() => setStep(3)}>
                  Next: Document Verification <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ padding: '16px', background: 'var(--color-bg)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <strong>GSTIN / Tax Certificate</strong>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{documents.gstin}</div>
                </div>
                <Button variant="outline" size="sm">
                  <Upload size={14} /> Upload PDF
                </Button>
              </div>

              <div style={{ padding: '16px', background: 'var(--color-bg)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <strong>FSSAI Food Safety License</strong>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{documents.fssai}</div>
                </div>
                <Button variant="outline" size="sm">
                  <Upload size={14} /> Upload PDF
                </Button>
              </div>

              <div style={{ padding: '16px', background: 'var(--color-bg)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <strong>Shop & Establishment Act Proof</strong>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{documents.shopAct}</div>
                </div>
                <Button variant="outline" size="sm">
                  <Upload size={14} /> Upload PDF
                </Button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                <Button variant="ghost" onClick={() => setStep(2)}>
                  <ArrowLeft size={16} /> Back
                </Button>
                <Button variant="primary" loading={submitting} onClick={handleSubmit}>
                  Submit Application for Approval <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
