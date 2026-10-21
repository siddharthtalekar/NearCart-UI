// src/components/AutoBookingModal.jsx — Customer Daily Auto Product Booking Modal
import { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle,
  Repeat,
  Zap,
  MapPin,
  ShieldCheck,
  CreditCard,
  Plus,
  Minus,
  Sparkles,
} from 'lucide-react';
import Modal from './Modal.jsx';
import Button from './Button.jsx';
import { subscriptionService } from '../services/subscriptionService.js';
import { formatCurrency } from '../utils/helpers.js';
import styles from './AutoBookingModal.module.css';

export default function AutoBookingModal({ isOpen, onClose, product, store, onSuccess }) {
  if (!product) return null;

  const [frequency, setFrequency] = useState('daily'); // 'daily' | 'alternate' | 'weekdays' | 'custom'
  const [selectedDays, setSelectedDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [timeSlot, setTimeSlot] = useState('early_morning');
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [deliveryInstructions, setDeliveryInstructions] = useState('Ring bell once and leave in doorstep basket');
  const [paymentMethod, setPaymentMethod] = useState('UPI AutoPay');
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter((d) => d !== day));
      }
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleConfirm = () => {
    setSubmitting(true);
    setTimeout(() => {
      const newSub = subscriptionService.createSubscription({
        productId: product.id,
        storeId: product.storeId || store?.id || 's6',
        productName: product.name,
        brand: product.brand,
        variant: product.variant,
        size: product.size,
        price: product.price,
        quantity,
        image: product.image,
        frequency,
        customDays: frequency === 'custom' ? selectedDays : undefined,
        timeSlot,
        startDate,
        deliveryInstructions,
        paymentMethod,
      });
      setSubmitting(false);
      setConfirmed(true);
      if (onSuccess) onSuccess(newSub);
    }, 600);
  };

  const unitPrice = product.price || 30;
  const estimatedDailyTotal = unitPrice * quantity;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setConfirmed(false);
        onClose();
      }}
      title={confirmed ? 'Auto-Booking Confirmed!' : 'Set Daily Auto Product Booking'}
      size="md"
    >
      {confirmed ? (
        <div className={styles.confirmedWrap}>
          <div className={styles.successIconCircle}>
            <CheckCircle size={38} />
          </div>
          <h3 className={styles.successTitle}>Daily Auto-Booking Activated!</h3>
          <p className={styles.successDesc}>
            <strong>{quantity}x {product.name}</strong> will be delivered automatically to your doorstep starting <strong>{startDate}</strong>.
          </p>

          <div className={styles.scheduleSummaryCard}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Frequency:</span>
              <span className={styles.summaryVal}>
                {frequency === 'daily'
                  ? 'Every Single Day (365 days)'
                  : frequency === 'alternate'
                  ? 'Alternate Days (Every 2 days)'
                  : frequency === 'weekdays'
                  ? 'Weekdays (Mon - Fri)'
                  : `Custom Days (${selectedDays.join(', ')})`}
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Delivery Slot:</span>
              <span className={styles.summaryVal}>
                {timeSlot === 'early_morning'
                  ? '🌅 Early Morning (6:00 AM - 7:30 AM)'
                  : timeSlot === 'morning'
                  ? '☀️ Morning (7:30 AM - 9:00 AM)'
                  : '🌇 Evening (6:00 PM - 8:00 PM)'}
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Estimated Per Drop:</span>
              <span className={styles.summaryValHighlight}>
                {formatCurrency(estimatedDailyTotal)}
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Billing Mode:</span>
              <span className={styles.summaryVal}>{paymentMethod}</span>
            </div>
          </div>

          <div className={styles.confirmedActions}>
            <Button
              variant="primary"
              fullWidth
              onClick={() => {
                setConfirmed(false);
                onClose();
              }}
            >
              Done & View Subscriptions
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles.modalContent}>
          {/* Product Header Card */}
          <div className={styles.productBanner}>
            <img
              src={product.image || 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200&q=80'}
              alt={product.name}
              className={styles.productThumbnail}
            />
            <div className={styles.productMeta}>
              <span className={styles.productBrandBadge}>{product.brand || 'Daily Essential'}</span>
              <h4 className={styles.productName}>{product.name}</h4>
              <p className={styles.productSpecs}>
                {product.size} {product.variant && `• ${product.variant}`}
              </p>
              <div className={styles.priceRow}>
                <span className={styles.unitPrice}>{formatCurrency(unitPrice)}</span>
                <span className={styles.perUnitText}>per delivery</span>
              </div>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className={styles.formGroup}>
            <label className={styles.fieldLabel}>Daily Delivery Quantity</label>
            <div className={styles.qtyControlRow}>
              <button
                type="button"
                className={styles.qtyBtn}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus size={15} />
              </button>
              <span className={styles.qtyDisplay}>{quantity}</span>
              <button
                type="button"
                className={styles.qtyBtn}
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus size={15} />
              </button>
              <span className={styles.qtySummaryText}>
                = {formatCurrency(estimatedDailyTotal)} per drop
              </span>
            </div>
          </div>

          {/* Delivery Frequency */}
          <div className={styles.formGroup}>
            <label className={styles.fieldLabel}>Delivery Frequency</label>
            <div className={styles.frequencyGrid}>
              <button
                type="button"
                className={`${styles.freqChip} ${frequency === 'daily' ? styles.freqChipActive : ''}`}
                onClick={() => setFrequency('daily')}
              >
                <Repeat size={14} />
                <span>Every Day</span>
                <small>Most Popular</small>
              </button>
              <button
                type="button"
                className={`${styles.freqChip} ${frequency === 'alternate' ? styles.freqChipActive : ''}`}
                onClick={() => setFrequency('alternate')}
              >
                <Repeat size={14} />
                <span>Alternate Days</span>
                <small>Every 2nd day</small>
              </button>
              <button
                type="button"
                className={`${styles.freqChip} ${frequency === 'weekdays' ? styles.freqChipActive : ''}`}
                onClick={() => setFrequency('weekdays')}
              >
                <Calendar size={14} />
                <span>Weekdays Only</span>
                <small>Mon - Fri</small>
              </button>
              <button
                type="button"
                className={`${styles.freqChip} ${frequency === 'custom' ? styles.freqChipActive : ''}`}
                onClick={() => setFrequency('custom')}
              >
                <Sparkles size={14} />
                <span>Custom Days</span>
                <small>Select days</small>
              </button>
            </div>

            {/* Custom Days Picker if custom */}
            {frequency === 'custom' && (
              <div className={styles.daysPickerRow}>
                {daysOfWeek.map((d) => (
                  <button
                    key={d}
                    type="button"
                    className={`${styles.dayPill} ${selectedDays.includes(d) ? styles.dayPillActive : ''}`}
                    onClick={() => toggleDay(d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Preferred Time Slot */}
          <div className={styles.formGroup}>
            <label className={styles.fieldLabel}>Doorstep Delivery Time Slot</label>
            <div className={styles.timeSlotRow}>
              <button
                type="button"
                className={`${styles.slotCard} ${timeSlot === 'early_morning' ? styles.slotCardActive : ''}`}
                onClick={() => setTimeSlot('early_morning')}
              >
                <div className={styles.slotIconWrap}>🌅</div>
                <div className={styles.slotInfo}>
                  <strong>Early Morning</strong>
                  <span>6:00 AM – 7:30 AM</span>
                </div>
              </button>
              <button
                type="button"
                className={`${styles.slotCard} ${timeSlot === 'morning' ? styles.slotCardActive : ''}`}
                onClick={() => setTimeSlot('morning')}
              >
                <div className={styles.slotIconWrap}>☀️</div>
                <div className={styles.slotInfo}>
                  <strong>Morning</strong>
                  <span>7:30 AM – 9:00 AM</span>
                </div>
              </button>
              <button
                type="button"
                className={`${styles.slotCard} ${timeSlot === 'evening' ? styles.slotCardActive : ''}`}
                onClick={() => setTimeSlot('evening')}
              >
                <div className={styles.slotIconWrap}>🌇</div>
                <div className={styles.slotInfo}>
                  <strong>Evening</strong>
                  <span>6:00 PM – 8:00 PM</span>
                </div>
              </button>
            </div>
          </div>

          {/* Start Date & Instructions */}
          <div className={styles.formRow}>
            <div className={styles.formGroupHalf}>
              <label className={styles.fieldLabel}>Start From Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={styles.dateInput}
              />
            </div>
            <div className={styles.formGroupHalf}>
              <label className={styles.fieldLabel}>Payment Mode</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className={styles.selectInput}
              >
                <option value="UPI AutoPay">⚡ UPI AutoPay (Recommended)</option>
                <option value="NearCart Wallet">NearCart Wallet (Auto-Debit)</option>
                <option value="Pay on Delivery (COD/UPI)">Pay On Delivery</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.fieldLabel}>Delivery Drop Instructions</label>
            <input
              type="text"
              value={deliveryInstructions}
              onChange={(e) => setDeliveryInstructions(e.target.value)}
              placeholder="e.g. Leave in basket outside door, ring bell once"
              className={styles.textInput}
            />
          </div>

          {/* Guarantee Pill */}
          <div className={styles.guaranteeBox}>
            <ShieldCheck size={16} />
            <span>
              Pause, resume, change quantity, or cancel anytime with 1 click. Zero cancellation fee.
            </span>
          </div>

          {/* Footer Submit */}
          <div className={styles.modalFooter}>
            <Button variant="ghost" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={submitting}
              onClick={handleConfirm}
            >
              <Zap size={15} /> Confirm Daily Auto-Booking
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
