// src/pages/customer/OrderTrackingPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle2, Bike, Store, MapPin, Phone, AlertCircle, ShieldAlert, X } from 'lucide-react';
import { orderService } from '../../services/orderService.js';
import Button from '../../components/Button.jsx';
import { Badge } from '../../components/Badge.jsx';
import Modal from '../../components/Modal.jsx';
import MapView from '../../components/MapView.jsx';
import Skeleton from '../../components/Skeleton.jsx';
import { formatCurrency, formatDate } from '../../utils/helpers.js';
import styles from './OrderTrackingPage.module.css';

const TIMELINE_STEPS = [
  { key: 'placed', label: 'Order Placed' },
  { key: 'accepted', label: 'Accepted by Store' },
  { key: 'preparing', label: 'Preparing / Packed' },
  { key: 'picked_up', label: 'Picked Up by Courier' },
  { key: 'in_transit', label: 'On the Way' },
  { key: 'delivered', label: 'Delivered' },
];

export default function OrderTrackingPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Placed order by mistake');
  const [cancelling, setCancelling] = useState(false);

  // Simulated moving pin on map for in_transit status
  const [pinOffset, setPinOffset] = useState(0);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    orderService
      .getOrder(orderId)
      .then((data) => {
        if (mounted) {
          setOrder(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [orderId]);

  // Simulate courier movement if in_transit
  useEffect(() => {
    if (order?.status === 'in_transit') {
      const interval = setInterval(() => {
        setPinOffset((prev) => (prev >= 0.008 ? 0 : prev + 0.001));
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [order?.status]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const updated = await orderService.cancelOrder(order.id, cancelReason);
      setOrder(updated);
      setShowCancelModal(false);
    } catch (err) {
      alert(err.message || 'Cannot cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 16px' }}>
        <Skeleton height="300px" style={{ borderRadius: '16px', marginBottom: '24px' }} />
        <Skeleton height="120px" style={{ borderRadius: '16px' }} />
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2>Order #{orderId} not found</h2>
        <Link to="/customer/orders">
          <Button variant="primary" style={{ marginTop: '16px' }}>View Order History</Button>
        </Link>
      </div>
    );
  }

  const currentStepIdx = TIMELINE_STEPS.findIndex((s) => s.key === order.status);
  const isTerminated = ['cancelled', 'rejected', 'failed'].includes(order.status);
  const canCancel = ['placed', 'accepted'].includes(order.status);

  return (
    <div className={styles.container}>
      <Link to="/customer/orders" className={styles.backLink}>
        <ArrowLeft size={16} /> All Orders
      </Link>

      {/* Top Banner Status */}
      <div className={styles.topStatusCard}>
        <div className={styles.statusHeader}>
          <div>
            <div className={styles.orderIdRow}>
              <span className={styles.orderId}>Order #{order.id}</span>
              <Badge
                variant={
                  order.status === 'delivered'
                    ? 'success'
                    : isTerminated
                    ? 'error'
                    : 'primary'
                }
              >
                {order.status.toUpperCase().replace('_', ' ')}
              </Badge>
            </div>
            <p className={styles.placedTime}>Placed on {formatDate(order.placedAt)}</p>
          </div>

          {!isTerminated && order.status !== 'delivered' && (
            <div className={styles.etaBox}>
              <Clock size={16} color="var(--color-primary)" />
              <div>
                <span className={styles.etaLabel}>Estimated Arrival</span>
                <span className={styles.etaValue}>30 - 45 Mins</span>
              </div>
            </div>
          )}
        </div>

        {/* Delivery OTP Badge */}
        {order.status !== 'delivered' && !isTerminated && (
          <div className={styles.otpBanner}>
            <span>Delivery Verification Code (Share with courier at doorstep):</span>
            <span className={styles.otpCode}>{order.otp || '4821'}</span>
          </div>
        )}
      </div>

      <div className={styles.mainGrid}>
        {/* Left: Map and Timeline */}
        <div className={styles.leftCol}>
          {/* Live Simulated Map */}
          <div className={styles.mapCard}>
            <div className={styles.mapHeader}>
              <span className={styles.mapTitle}>Live Hyperlocal Tracking</span>
              <span className={styles.statusLivePill}>● Live Updates</span>
            </div>
            <MapView
              height="280px"
              pins={[
                { lat: 18.559, lng: 73.7868, label: 'Delivery Location' },
                {
                  lat: 18.562 - pinOffset,
                  lng: 73.789 - pinOffset,
                  label: order.deliveryPartnerName
                    ? `${order.deliveryPartnerName} (Courier)`
                    : 'Store Pickup',
                },
              ]}
            />
          </div>

          {/* Timeline */}
          <div className={styles.timelineCard}>
            <h3>Delivery Progress</h3>

            {isTerminated ? (
              <div className={styles.terminatedBox}>
                <AlertCircle size={24} color="var(--color-error)" />
                <div>
                  <strong>Order {order.status.toUpperCase()}</strong>
                  <p>
                    {order.cancellationReason ||
                      order.rejectionReason ||
                      'This order was stopped before completion.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className={styles.timeline}>
                {TIMELINE_STEPS.map((step, idx) => {
                  const isDone = currentStepIdx >= idx;
                  const isCurrent = currentStepIdx === idx;
                  return (
                    <div key={step.key} className={styles.timelineStep}>
                      <div
                        className={`${styles.stepDot} ${
                          isDone ? styles.dotDone : ''
                        } ${isCurrent ? styles.dotCurrent : ''}`}
                      >
                        {isDone ? <CheckCircle2 size={16} /> : <div className={styles.innerDot} />}
                      </div>
                      <div className={styles.stepInfo}>
                        <span
                          className={`${styles.stepText} ${
                            isCurrent ? styles.stepTextActive : ''
                          }`}
                        >
                          {step.label}
                        </span>
                        {isCurrent && (
                          <span className={styles.stepSub}>Currently happening...</span>
                        )}
                      </div>
                      {idx < TIMELINE_STEPS.length - 1 && (
                        <div
                          className={`${styles.stepTrack} ${
                            currentStepIdx > idx ? styles.trackDone : ''
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Partner Card, Store, and Summary */}
        <div className={styles.rightCol}>
          {/* Delivery Partner Details */}
          {order.deliveryPartnerName && (
            <div className={styles.sideCard}>
              <div className={styles.partnerHeader}>
                <div className={styles.partnerAvatar}>
                  <Bike size={20} />
                </div>
                <div>
                  <h4 className={styles.partnerName}>{order.deliveryPartnerName}</h4>
                  <p className={styles.partnerRole}>Verified Delivery Partner</p>
                </div>
              </div>
              <div className={styles.partnerInfoRow}>
                <span>Vehicle:</span>
                <strong>{order.deliveryPartnerVehicle || 'Honda Activa (MH 12)'}</strong>
              </div>
              <Button
                variant="outline"
                size="sm"
                fullWidth
                style={{ marginTop: '12px' }}
                onClick={() => alert(`Calling masked courier number: ${order.deliveryPartnerPhone || '+91 91234 56789'}`)}
              >
                <Phone size={14} /> Call Courier (Masked)
              </Button>
            </div>
          )}

          {/* Store Info */}
          <div className={styles.sideCard}>
            <div className={styles.storeHeader}>
              <Store size={18} color="var(--color-primary)" />
              <span className={styles.sideCardStoreName}>{order.storeName}</span>
            </div>
            <div className={styles.orderItemsList}>
              {order.items?.map((item, idx) => (
                <div key={idx} className={styles.orderItemRow}>
                  <span>
                    {item.qty}x {item.name}
                  </span>
                  <span>{formatCurrency(item.subtotal || item.price * item.qty)}</span>
                </div>
              ))}
            </div>
            <div className={styles.orderTotalRow}>
              <span>Total Paid</span>
              <strong>{formatCurrency(order.pricing?.total)}</strong>
            </div>
          </div>

          {/* Action buttons */}
          {canCancel && (
            <Button
              variant="danger"
              size="sm"
              fullWidth
              onClick={() => setShowCancelModal(true)}
            >
              Cancel Order
            </Button>
          )}
        </div>
      </div>

      {/* Cancel Order Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Order"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
            Are you sure you want to cancel Order #{order.id}? Please select a reason below:
          </p>
          <select
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            style={{
              padding: '10px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: 'var(--color-surface)',
            }}
          >
            <option value="Placed order by mistake">Placed order by mistake</option>
            <option value="Delivery time is too long">Delivery time is too long</option>
            <option value="Incorrect delivery address selected">Incorrect delivery address selected</option>
            <option value="Changed my mind">Changed my mind</option>
          </select>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <Button variant="ghost" onClick={() => setShowCancelModal(false)}>
              Keep Order
            </Button>
            <Button variant="danger" loading={cancelling} onClick={handleCancel}>
              Confirm Cancellation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
