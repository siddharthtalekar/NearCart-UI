// src/pages/delivery/DeliveryRequest.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, Store, Navigation, Check, X, ShieldAlert } from 'lucide-react';
import Button from '../../components/Button.jsx';
import MapView from '../../components/MapView.jsx';
import Card, { CardBody } from '../../components/Card.jsx';
import { formatCurrency } from '../../utils/helpers.js';

export default function DeliveryRequest() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (timeLeft <= 0) {
      navigate('/delivery');
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, navigate]);

  const handleAccept = () => {
    navigate('/delivery/active');
  };

  const handleDecline = () => {
    navigate('/delivery');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Countdown timer pill */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', background: 'var(--color-accent-50)', border: '1.5px solid var(--color-accent-300)', borderRadius: 'var(--radius-xl)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-accent-700)', fontWeight: 'bold' }}>
          <Clock size={18} />
          <span>New Delivery Offer</span>
        </div>
        <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'extrabold', color: 'var(--color-accent-800)', fontFamily: 'var(--font-mono)' }}>
          00:{timeLeft.toString().padStart(2, '0')}
        </div>
      </div>

      <Card>
        <CardBody style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>
                Guaranteed Payout
              </span>
              <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'extrabold', color: 'var(--color-primary)' }}>
                ₹65.00
              </h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 'bold' }}>
                Est. Distance
              </span>
              <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold' }}>
                2.4 km
              </h3>
            </div>
          </div>

          {/* Map Preview */}
          <MapView
            height="180px"
            pins={[
              { lat: 18.562, lng: 73.789, label: 'Pickup: Pune Daily Mart' },
              { lat: 18.559, lng: 73.7868, label: 'Drop: Baner Road' },
            ]}
          />

          {/* Route Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--color-bg)', padding: '16px', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Store size={18} color="var(--color-primary)" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ fontSize: 'var(--text-sm)' }}>Pickup: Pune Daily Mart</strong>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                  Shop 14, Commercial Complex, High Street, Baner
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <MapPin size={18} color="var(--color-accent-600)" style={{ flexShrink: 0 }} />
              <div>
                <strong style={{ fontSize: 'var(--text-sm)' }}>Drop: Green Acres Society</strong>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                  Flat 402, Baner Road, Pune 411045
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '8px' }}>
            <Button variant="outline" size="lg" onClick={handleDecline}>
              <X size={18} /> Decline
            </Button>
            <Button variant="primary" size="lg" onClick={handleAccept}>
              <Check size={18} /> Accept Order
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
