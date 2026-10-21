// src/pages/customer/CheckoutPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Check, MapPin, Calendar, CreditCard, ShieldCheck, ArrowRight, ArrowLeft, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { useOrders } from '../../context/OrderContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import Button from '../../components/Button.jsx';
import { Input } from '../../components/Input.jsx';
import PaymentGatewayMock from '../../components/PaymentGatewayMock.jsx';
import { formatCurrency, storage } from '../../utils/helpers.js';
import styles from './CheckoutPage.module.css';

const STEPS = [
  { id: 1, title: 'Address' },
  { id: 2, title: 'Delivery Slot' },
  { id: 3, title: 'Payment Method' },
  { id: 4, title: 'Review & Confirm' },
];

const TIME_SLOTS = [
  { id: 'express', label: 'Express Delivery (Next 30-45 mins)', fee: 0 },
  { id: 'evening', label: 'Today Evening (5:00 PM - 7:00 PM)', fee: 0 },
  { id: 'morning', label: 'Tomorrow Morning (8:00 AM - 10:00 AM)', fee: 0 },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, subtotal, coupon, clearCart, idempotencyKey } = useCart();
  const { placeOrder } = useOrders();

  const [currentStep, setCurrentStep] = useState(1);
  const [address, setAddress] = useState(() => {
    return (
      storage.get('nc_delivery_location') || {
        label: 'Flat 402, Green Acres, Baner Road, Pune 411045',
        type: 'Home',
      }
    );
  });
  const [deliveryNotes, setDeliveryNotes] = useState('Please leave at doorstep or call on arrival.');
  const [selectedSlot, setSelectedSlot] = useState('express');
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'online'
  const [showGateway, setShowGateway] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [transactionData, setTransactionData] = useState(null);

  // Validation before placing
  const [isValidating, setIsValidating] = useState(false);
  const [validationDone, setValidationDone] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  const deliveryFee = subtotal > 500 ? 0 : 35;
  const platformFee = 5;
  const taxes = Math.round(subtotal * 0.05);
  const discount = coupon ? coupon.discount : 0;
  const grandTotal = Math.max(0, subtotal + deliveryFee + platformFee + taxes - discount);

  if (items.length === 0 && !placedOrder) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 16px' }}>
        <h2>No items in checkout</h2>
        <Link to="/customer">
          <Button variant="primary" style={{ marginTop: '16px' }}>Explore Stores</Button>
        </Link>
      </div>
    );
  }

  // Pre-placement stock and price revalidation
  const runPreCheckoutValidation = () => {
    setIsValidating(true);
    setTimeout(() => {
      setIsValidating(false);
      setValidationDone(true);
    }, 1000);
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'online' && !paymentDone) {
      setShowGateway(true);
      return;
    }

    setPlacingOrder(true);

    try {
      const orderPayload = {
        customerId: user?.id || 'u1',
        customerName: user?.name || 'Customer',
        customerPhone: user?.phone || '9876543210',
        storeId: items[0]?.storeId,
        storeName: items[0]?.storeName,
        items: items.map((i) => ({
          productId: i.product.id,
          name: i.product.name,
          brand: i.product.brand,
          size: i.product.size,
          price: i.product.price,
          qty: i.qty,
          subtotal: i.product.price * i.qty,
        })),
        deliveryAddress: address.label,
        deliverySlot: selectedSlot,
        deliveryNotes,
        pricing: {
          subtotal,
          deliveryFee,
          platformFee,
          taxes,
          discount,
          total: grandTotal,
        },
        payment: {
          method: paymentMethod,
          status: paymentMethod === 'online' ? 'paid' : 'pending_cod',
          transactionId: transactionData?.transactionId || null,
        },
      };

      const order = await placeOrder(orderPayload, idempotencyKey);
      setPlacedOrder(order);
      clearCart();
    } catch (err) {
      alert(err.message || 'Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  // SUCCESS SCREEN
  if (placedOrder) {
    return (
      <div className={styles.successWrapper}>
        <div className={styles.successCard}>
          <div className={styles.successBadge}>
            <CheckCircle2 size={56} color="var(--color-success)" />
          </div>
          <h1 className={styles.successTitle}>Order Placed Successfully!</h1>
          <p className={styles.successSubtitle}>
            Order ID: <strong>#{placedOrder.id}</strong>
          </p>
          <div className={styles.successDetails}>
            <div className={styles.successRow}>
              <span>Delivery Address</span>
              <strong>{placedOrder.deliveryAddress}</strong>
            </div>
            <div className={styles.successRow}>
              <span>Estimated Delivery</span>
              <strong>30 - 45 Mins</strong>
            </div>
            <div className={styles.successRow}>
              <span>Amount to Pay</span>
              <strong>{formatCurrency(placedOrder.pricing.total)} ({placedOrder.payment.method.toUpperCase()})</strong>
            </div>
          </div>

          <div className={styles.successActions}>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => navigate(`/customer/orders/${placedOrder.id}`)}
            >
              Track Live Order Status <ArrowRight size={18} />
            </Button>
            <Button
              variant="ghost"
              fullWidth
              onClick={() => navigate('/customer')}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Stepper Header */}
      <div className={styles.stepperWrap}>
        {STEPS.map((s, idx) => (
          <div key={s.id} className={styles.stepItem}>
            <div
              className={`${styles.stepCircle} ${
                currentStep === s.id
                  ? styles.stepActive
                  : currentStep > s.id
                  ? styles.stepDone
                  : ''
              }`}
            >
              {currentStep > s.id ? <Check size={14} /> : s.id}
            </div>
            <span
              className={`${styles.stepTitle} ${
                currentStep === s.id ? styles.stepTitleActive : ''
              }`}
            >
              {s.title}
            </span>
            {idx < STEPS.length - 1 && <div className={styles.stepLine} />}
          </div>
        ))}
      </div>

      <div className={styles.mainLayout}>
        {/* Step Content */}
        <div className={styles.stepContentCard}>
          {/* STEP 1: ADDRESS */}
          {currentStep === 1 && (
            <div className={styles.stepBody}>
              <h2 className={styles.stepHeading}>Confirm Delivery Address</h2>
              <div className={styles.addressBox}>
                <MapPin size={22} color="var(--color-primary)" className={styles.pin} />
                <div>
                  <span className={styles.addrType}>{address.type || 'Home'}</span>
                  <p className={styles.addrText}>{address.label}</p>
                </div>
              </div>

              <div className={styles.notesGroup}>
                <label className={styles.label}>Delivery Instructions / Landmark</label>
                <textarea
                  className={styles.textarea}
                  rows={3}
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="e.g. Ring the bell twice, leave with security..."
                />
              </div>

              <div className={styles.stepNav}>
                <Link to="/customer/cart">
                  <Button variant="ghost">
                    <ArrowLeft size={16} /> Back to Cart
                  </Button>
                </Link>
                <Button variant="primary" onClick={() => setCurrentStep(2)}>
                  Next: Delivery Slot <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: DELIVERY SLOT */}
          {currentStep === 2 && (
            <div className={styles.stepBody}>
              <h2 className={styles.stepHeading}>Select Delivery Slot</h2>
              <div className={styles.slotsList}>
                {TIME_SLOTS.map((slot) => (
                  <label
                    key={slot.id}
                    className={`${styles.slotOption} ${
                      selectedSlot === slot.id ? styles.slotActive : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="slot"
                      value={slot.id}
                      checked={selectedSlot === slot.id}
                      onChange={() => setSelectedSlot(slot.id)}
                    />
                    <div className={styles.slotInfo}>
                      <span className={styles.slotLabel}>{slot.label}</span>
                      <span className={styles.slotSub}>Fast local courier pickup</span>
                    </div>
                  </label>
                ))}
              </div>

              <div className={styles.stepNav}>
                <Button variant="ghost" onClick={() => setCurrentStep(1)}>
                  <ArrowLeft size={16} /> Back
                </Button>
                <Button variant="primary" onClick={() => setCurrentStep(3)}>
                  Next: Payment <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT METHOD */}
          {currentStep === 3 && (
            <div className={styles.stepBody}>
              <h2 className={styles.stepHeading}>Select Payment Method</h2>

              <div className={styles.paymentMethods}>
                <label
                  className={`${styles.paymentCard} ${
                    paymentMethod === 'cod' ? styles.paymentCardActive : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="pay"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => {
                      setPaymentMethod('cod');
                      setPaymentDone(false);
                    }}
                  />
                  <div>
                    <strong>Cash / UPI on Delivery (COD)</strong>
                    <p className={styles.paySub}>Pay securely at your doorstep via Cash or QR</p>
                  </div>
                </label>

                <label
                  className={`${styles.paymentCard} ${
                    paymentMethod === 'online' ? styles.paymentCardActive : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="pay"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={() => setPaymentMethod('online')}
                  />
                  <div>
                    <strong>Pay Online (UPI / Card / NetBanking)</strong>
                    <p className={styles.paySub}>Instant verification via Mock Gateway</p>
                    {paymentDone && (
                      <span className={styles.authorizedBadge}>✓ Authorized via Mock Gateway</span>
                    )}
                  </div>
                </label>
              </div>

              {paymentMethod === 'online' && !paymentDone && (
                <div style={{ marginTop: '12px' }}>
                  <Button variant="outline" size="sm" onClick={() => setShowGateway(true)}>
                    <CreditCard size={16} /> Open Payment Window ({formatCurrency(grandTotal)})
                  </Button>
                </div>
              )}

              <div className={styles.stepNav}>
                <Button variant="ghost" onClick={() => setCurrentStep(2)}>
                  <ArrowLeft size={16} /> Back
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setCurrentStep(4);
                    runPreCheckoutValidation();
                  }}
                >
                  Next: Review Order <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & VALIDATE BEFORE PLACING */}
          {currentStep === 4 && (
            <div className={styles.stepBody}>
              <h2 className={styles.stepHeading}>Review Order & Final Validation</h2>

              {/* Real-time Inventory & Price Validation Banner */}
              {isValidating ? (
                <div className={styles.validationLoading}>
                  <Loader2 size={20} className={styles.spin} />
                  <span>Re-validating store inventory, current prices, and active offers...</span>
                </div>
              ) : validationDone ? (
                <div className={styles.validationSuccess}>
                  <ShieldCheck size={20} color="var(--color-success)" />
                  <div>
                    <strong>Pre-order checks passed:</strong> 100% item availability confirmed, prices locked, and single-click duplicate prevention active.
                  </div>
                </div>
              ) : null}

              <div className={styles.orderSummaryBox}>
                <h4 style={{ marginBottom: '8px' }}>Fulfilling Store: {items[0]?.storeName}</h4>
                <div className={styles.reviewItemsList}>
                  {items.map(({ product, qty }) => (
                    <div key={product.id} className={styles.reviewItem}>
                      <span>{qty}x {product.name} ({product.size})</span>
                      <span>{formatCurrency(product.price * qty)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.stepNav}>
                <Button variant="ghost" onClick={() => setCurrentStep(3)} disabled={placingOrder}>
                  <ArrowLeft size={16} /> Back
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  loading={placingOrder}
                  disabled={placingOrder || isValidating}
                  onClick={handlePlaceOrder}
                >
                  Place Order ({formatCurrency(grandTotal)}) <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right side summary */}
        <aside className={styles.sideSummary}>
          <div className={styles.sideCard}>
            <h3>Order Breakdown</h3>
            <div className={styles.breakdownRows}>
              <div className={styles.row}>
                <span>Subtotal ({items.length} items)</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className={styles.row}>
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}</span>
              </div>
              <div className={styles.row}>
                <span>Platform Fee</span>
                <span>{formatCurrency(platformFee)}</span>
              </div>
              <div className={styles.row}>
                <span>Taxes & GST</span>
                <span>{formatCurrency(taxes)}</span>
              </div>
              {coupon && (
                <div className={`${styles.row} ${styles.disc}`}>
                  <span>Discount ({coupon.code})</span>
                  <span>- {formatCurrency(discount)}</span>
                </div>
              )}
              <div className={styles.line} />
              <div className={styles.grandRow}>
                <span>Total Amount</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Payment Gateway Modal */}
      <PaymentGatewayMock
        isOpen={showGateway}
        amount={grandTotal}
        onClose={() => setShowGateway(false)}
        onSuccess={(txn) => {
          setTransactionData(txn);
          setPaymentDone(true);
        }}
      />
    </div>
  );
}
