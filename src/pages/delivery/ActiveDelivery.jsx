// src/pages/delivery/ActiveDelivery.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Store, MapPin, Phone, CheckCircle2, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import Button from '../../components/Button.jsx';
import { Input } from '../../components/Input.jsx';
import { Badge } from '../../components/Badge.jsx';
import MapView from '../../components/MapView.jsx';
import Card, { CardBody } from '../../components/Card.jsx';
import { formatCurrency } from '../../utils/helpers.js';

const STEPS = [
  { id: 1, label: 'Arrived at Store', status: 'arrived_store' },
  { id: 2, label: 'Order Picked Up', status: 'picked_up' },
  { id: 3, label: 'In Transit', status: 'in_transit' },
  { id: 4, label: 'Complete Delivery', status: 'delivered' },
];

export default function ActiveDelivery() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [codCollected, setCodCollected] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const order = {
    id: 'ORD-2610-184',
    customerName: 'Priya Sen',
    customerPhone: '+91 98*** **321 (Masked)',
    storeName: 'Pune Daily Mart',
    storeAddress: 'Shop 14, Commercial Complex, High Street, Baner',
    deliveryAddress: 'Flat 402, Green Acres, Baner Road, Pune 411045',
    isCod: true,
    totalCodAmount: 345,
    actualOtp: '4821',
  };

  const handleNextStep = () => {
    if (currentStep === 4) {
      if (order.isCod && !codCollected) {
        alert('Please confirm that Cash/UPI of ' + formatCurrency(order.totalCodAmount) + ' has been collected.');
        return;
      }
      if (otpInput !== order.actualOtp) {
        setOtpError(`Invalid OTP. Ask customer for 4-digit code (Hint: ${order.actualOtp})`);
        return;
      }
      setIsCompleted(true);
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  if (isCompleted) {
    return (
      <div style={{ maxWidth: '500px', margin: '40px auto', textAlign: 'center', padding: '32px 16px' }}>
        <CheckCircle2 size={64} color="var(--color-success)" style={{ margin: '0 auto 16px' }} />
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', marginBottom: '8px' }}>
          Delivery Completed!
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
          Order #{order.id} delivered successfully. ₹65.00 has been credited to your daily wallet.
        </p>
        <Link to="/delivery">
          <Button variant="primary" fullWidth size="lg">Return to Partner Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>Active Delivery Trip</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>Order #{order.id}</p>
        </div>
        <Badge variant="primary">
          Step {currentStep} of 4: {STEPS[currentStep - 1].label}
        </Badge>
      </div>

      {/* Map View */}
      <MapView
        height="220px"
        pins={[
          { lat: 18.562, lng: 73.789, label: 'Store: Pune Daily Mart' },
          { lat: 18.559, lng: 73.7868, label: 'Customer: Green Acres' },
        ]}
      />

      {/* Location Details Card */}
      <Card>
        <CardBody style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Store size={20} color="var(--color-primary)" style={{ flexShrink: 0 }} />
            <div>
              <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Pickup Point</span>
              <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold' }}>{order.storeName}</h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{order.storeAddress}</p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '12px', display: 'flex', gap: '12px' }}>
            <MapPin size={20} color="var(--color-accent-600)" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', fontWeight: 'bold' }}>Drop Destination</span>
              <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold' }}>{order.customerName}</h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{order.deliveryAddress}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => alert(`Dialing masked customer bridge for: ${order.customerPhone}`)}
            >
              <Phone size={14} /> Call Customer
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* COD and OTP verification at Step 4 */}
      {currentStep === 4 && (
        <Card>
          <CardBody style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'bold' }}>Final Delivery Handover</h3>

            {/* COD Confirmation */}
            {order.isCod && (
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  background: codCollected ? 'var(--color-success-bg)' : '#fffbeb',
                  border: codCollected ? '1px solid var(--color-success)' : '1px solid #fde68a',
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={codCollected}
                  onChange={(e) => setCodCollected(e.target.checked)}
                  style={{ width: '20px', height: '20px', accentColor: 'var(--color-success)' }}
                />
                <div>
                  <strong style={{ fontSize: 'var(--text-sm)' }}>
                    Collect Cash / UPI: {formatCurrency(order.totalCodAmount)}
                  </strong>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                    Confirm customer has handed over cash or scanned UPI QR.
                  </p>
                </div>
              </label>
            )}

            {/* OTP input */}
            <div>
              <Input
                label="Customer 4-Digit Proof of Delivery OTP"
                placeholder="Ask customer for 4-digit code (e.g. 4821)"
                value={otpInput}
                maxLength={4}
                onChange={(e) => {
                  setOtpInput(e.target.value);
                  setOtpError('');
                }}
                error={otpError}
              />
            </div>
          </CardBody>
        </Card>
      )}

      {/* Primary Action Button */}
      <Button variant="primary" size="lg" fullWidth onClick={handleNextStep}>
        {currentStep === 1 && 'Confirm: Arrived at Store'}
        {currentStep === 2 && 'Confirm: Picked up Order Package'}
        {currentStep === 3 && 'Confirm: In Transit to Customer'}
        {currentStep === 4 && 'Verify OTP & Mark Delivered'}
      </Button>
    </div>
  );
}
