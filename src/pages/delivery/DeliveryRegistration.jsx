// src/pages/delivery/DeliveryRegistration.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Bike, Upload, CheckCircle2, Clock, FileText, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import Button from '../../components/Button.jsx';
import { Input } from '../../components/Input.jsx';
import Card, { CardBody } from '../../components/Card.jsx';

export default function DeliveryRegistration() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    vehicleType: 'Two Wheeler (Motorcycle / Scooter)',
    vehicleNumber: 'MH 12 AB 8492',
    drivingLicense: 'DL-MH12-2022004921',
    aadhaarNumber: '•••• •••• 4912',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  if (submitted) {
    return (
      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '32px 16px', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', background: 'var(--color-primary-100)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <Clock size={32} color="var(--color-primary)" />
        </div>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', marginBottom: '8px' }}>
          Partner Verification Under Review
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: '24px' }}>
          Your driver's license, vehicle registration, and Aadhaar documents have been received. We verify background details within 24 hours to ensure safety.
        </p>

        <div style={{ padding: '16px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', textAlign: 'left', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Verification Status:</span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-warning)', fontWeight: 'bold' }}>Pending Documents Check</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Allocated Hub:</span>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold' }}>Baner / Balewadi Delivery Zone</span>
          </div>
        </div>

        <Link to="/delivery">
          <Button variant="primary">Enter Partner App Demo</Button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)' }}>Delivery Courier Onboarding</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
          Submit your vehicle and identity proofs to start receiving local delivery gigs
        </p>
      </div>

      <Card>
        <CardBody style={{ padding: '24px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input
              label="Vehicle Type"
              value={formData.vehicleType}
              onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
            />
            <Input
              label="Vehicle Registration Plate Number"
              placeholder="e.g. MH 12 AB 1234"
              required
              value={formData.vehicleNumber}
              onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
            />
            <Input
              label="Driving License Number"
              required
              value={formData.drivingLicense}
              onChange={(e) => setFormData({ ...formData, drivingLicense: e.target.value })}
            />
            <Input
              label="Aadhaar Card Number (Last 4 Digits)"
              required
              value={formData.aadhaarNumber}
              onChange={(e) => setFormData({ ...formData, aadhaarNumber: e.target.value })}
            />

            <div style={{ padding: '16px', background: 'var(--color-bg)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <strong style={{ fontSize: 'var(--text-sm)' }}>Driving License Photo Upload</strong>
                <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Front and back side copy</div>
              </div>
              <Button type="button" variant="outline" size="sm">
                <Upload size={14} /> Upload
              </Button>
            </div>

            <Button type="submit" variant="primary" size="lg" loading={submitting} style={{ marginTop: '12px' }}>
              Submit for Verification <ArrowRight size={16} />
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
