// src/components/PaymentGatewayMock.jsx
import { useState } from 'react';
import { CreditCard, Smartphone, Building, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import Modal from './Modal.jsx';
import Button from './Button.jsx';
import { Input } from './Input.jsx';
import { formatCurrency } from '../utils/helpers.js';
import styles from './PaymentGatewayMock.module.css';

export default function PaymentGatewayMock({ isOpen, onClose, amount, onSuccess }) {
  const [method, setMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking'
  const [upiId, setUpiId] = useState('user@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('123');
  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'failure'

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setStatus('success');
      setTimeout(() => {
        onSuccess({
          transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
          method,
          amount,
          timestamp: new Date().toISOString(),
        });
        onClose();
        setStatus(null);
      }, 1200);
    }, 1800);
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={processing ? () => {} : onClose}
      title="Secure Checkout (Mock Gateway)"
      size="md"
    >
      <div className={styles.container}>
        {status === 'success' ? (
          <div className={styles.successState}>
            <CheckCircle2 size={48} className={styles.successIcon} />
            <h3>Payment Successful!</h3>
            <p>Authorizing transaction of {formatCurrency(amount)}...</p>
          </div>
        ) : processing ? (
          <div className={styles.processingState}>
            <Loader2 size={44} className={styles.spinIcon} />
            <h3>Processing Payment</h3>
            <p>Please do not refresh or close this window.</p>
            <div className={styles.amountBadge}>{formatCurrency(amount)}</div>
          </div>
        ) : (
          <>
            <div className={styles.headerInfo}>
              <div>
                <span className={styles.label}>Payable Amount</span>
                <h2 className={styles.amount}>{formatCurrency(amount)}</h2>
              </div>
              <div className={styles.secureBadge}>
                <ShieldCheck size={16} /> 256-bit Encrypted
              </div>
            </div>

            <div className={styles.methodSelector}>
              <button
                type="button"
                className={`${styles.methodBtn} ${method === 'upi' ? styles.methodActive : ''}`}
                onClick={() => setMethod('upi')}
              >
                <Smartphone size={18} />
                <span>UPI / QR</span>
              </button>
              <button
                type="button"
                className={`${styles.methodBtn} ${method === 'card' ? styles.methodActive : ''}`}
                onClick={() => setMethod('card')}
              >
                <CreditCard size={18} />
                <span>Cards</span>
              </button>
              <button
                type="button"
                className={`${styles.methodBtn} ${method === 'netbanking' ? styles.methodActive : ''}`}
                onClick={() => setMethod('netbanking')}
              >
                <Building size={18} />
                <span>Net Banking</span>
              </button>
            </div>

            <div className={styles.formArea}>
              {method === 'upi' && (
                <div className={styles.fieldGroup}>
                  <Input
                    label="Virtual Payment Address (VPA / UPI ID)"
                    placeholder="name@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                  <div className={styles.quickUpi}>
                    {['Google Pay', 'PhonePe', 'Paytm'].map((app) => (
                      <span key={app} className={styles.appPill}>
                        {app}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {method === 'card' && (
                <div className={styles.cardForm}>
                  <Input
                    label="Card Number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                  <div className={styles.cardRow}>
                    <Input
                      label="Expiry"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                    />
                    <Input
                      label="CVV"
                      type="password"
                      maxLength={4}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {method === 'netbanking' && (
                <div className={styles.fieldGroup}>
                  <label className={styles.selectLabel}>Select Bank</label>
                  <select
                    className={styles.bankSelect}
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                  >
                    <option value="HDFC">HDFC Bank</option>
                    <option value="ICICI">ICICI Bank</option>
                    <option value="SBI">State Bank of India</option>
                    <option value="AXIS">Axis Bank</option>
                    <option value="KOTAK">Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}
            </div>

            <div className={styles.footerActions}>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handlePay} fullWidth>
                Pay {formatCurrency(amount)}
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
