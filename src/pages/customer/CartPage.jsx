// src/pages/customer/CartPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowRight, Store, Tag, AlertCircle, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import Button from '../../components/Button.jsx';
import QuantityStepper from '../../components/QuantityStepper.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { formatCurrency } from '../../utils/helpers.js';
import styles from './CartPage.module.css';

export default function CartPage() {
  const {
    items,
    itemsByStore,
    storeIds,
    subtotal,
    updateQty,
    removeItem,
    clearCart,
    coupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    const code = couponCode.trim().toUpperCase();

    if (code === 'WELCOME50') {
      applyCoupon({ code: 'WELCOME50', discount: Math.min(Math.round(subtotal * 0.5), 100), desc: '50% off up to ₹100' });
      setCouponSuccess('Applied WELCOME50! You saved on this order.');
      setCouponCode('');
    } else if (code === 'FREEDEL') {
      applyCoupon({ code: 'FREEDEL', discount: 35, desc: 'Free Delivery' });
      setCouponSuccess('Applied FREEDEL! ₹35 delivery discount.');
      setCouponCode('');
    } else {
      setCouponError('Invalid coupon code. Try WELCOME50 or FREEDEL');
    }
  };

  // Fees calculation
  const deliveryFee = subtotal > 500 ? 0 : 35;
  const platformFee = items.length > 0 ? 5 : 0;
  const taxes = Math.round(subtotal * 0.05); // 5% GST
  const discountAmount = coupon ? coupon.discount : 0;
  const grandTotal = Math.max(0, subtotal + deliveryFee + platformFee + taxes - discountAmount);

  if (items.length === 0) {
    return (
      <div className={styles.container}>
        <EmptyState
          icon={<ShoppingCart size={54} />}
          title="Your shopping cart is empty"
          description="Explore top local stores in your area and add fresh groceries or daily essentials."
          actionLabel="Browse Nearby Stores"
          action={() => navigate('/customer')}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Your Shopping Cart</h1>
          <p className={styles.subtitle}>
            Items are fulfilled by independent neighborhood merchants
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={clearCart}>
          <Trash2 size={16} /> Clear Cart
        </Button>
      </div>

      {/* Multi-store order notice if items are from multiple stores */}
      {storeIds.length > 1 && (
        <div className={styles.multiStoreAlert}>
          <AlertCircle size={18} color="var(--color-info)" />
          <div>
            <strong>Multi-Store Order:</strong> Items in your cart come from {storeIds.length} different stores. They will be packaged separately by each local merchant.
          </div>
        </div>
      )}

      <div className={styles.cartGrid}>
        {/* Left: Items grouped by store */}
        <div className={styles.itemsColumn}>
          {Object.values(itemsByStore).map((group) => (
            <div key={group.storeId} className={styles.storeCard}>
              <div className={styles.storeCardHeader}>
                <div className={styles.storeTitleRow}>
                  <Store size={18} color="var(--color-primary)" />
                  <span className={styles.storeName}>{group.storeName || 'Neighborhood Store'}</span>
                </div>
                <span className={styles.storeItemsCount}>
                  {group.items.length} item{group.items.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className={styles.itemsList}>
                {group.items.map(({ product, qty }) => (
                  <div key={product.id} className={styles.itemRow}>
                    <img src={product.image} alt={product.name} className={styles.itemImg} />
                    <div className={styles.itemInfo}>
                      <span className={styles.itemBrand}>{product.brand}</span>
                      <h4 className={styles.itemName}>{product.name}</h4>
                      <span className={styles.itemVariant}>
                        {product.size} {product.variant && `• ${product.variant}`}
                      </span>
                      <div className={styles.itemPrice}>
                        {formatCurrency(product.price)} each
                      </div>
                    </div>

                    <div className={styles.itemActions}>
                      <QuantityStepper
                        value={qty}
                        max={product.stock}
                        onChange={(newQty) => updateQty(product.id, newQty)}
                        size="sm"
                      />
                      <div className={styles.itemTotal}>
                        {formatCurrency(product.price * qty)}
                      </div>
                      <button
                        onClick={() => removeItem(product.id)}
                        className={styles.removeBtn}
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right: Coupon + Bill Breakdown */}
        <div className={styles.summaryColumn}>
          {/* Coupon Box */}
          <div className={styles.summaryCard}>
            <div className={styles.couponHeader}>
              <Tag size={16} color="var(--color-accent-600)" />
              <span className={styles.couponTitle}>Apply Promo Code</span>
            </div>

            {coupon ? (
              <div className={styles.appliedCoupon}>
                <div>
                  <div className={styles.appliedCode}>{coupon.code}</div>
                  <div className={styles.appliedDesc}>{coupon.desc}</div>
                </div>
                <button onClick={removeCoupon} className={styles.removeCouponBtn}>
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className={styles.couponForm}>
                <input
                  type="text"
                  placeholder="Enter code (e.g. WELCOME50)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className={styles.couponInput}
                />
                <Button type="submit" variant="outline" size="sm">
                  Apply
                </Button>
              </form>
            )}

            {couponError && <div className={styles.couponError}>{couponError}</div>}
            {couponSuccess && <div className={styles.couponSuccess}>{couponSuccess}</div>}
          </div>

          {/* Itemized Bill Summary */}
          <div className={styles.summaryCard}>
            <h3 className={styles.billTitle}>Bill Details</h3>

            <div className={styles.billRows}>
              <div className={styles.billRow}>
                <span>Item Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              <div className={styles.billRow}>
                <span>Delivery Fee</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>FREE</span>
                  ) : (
                    formatCurrency(deliveryFee)
                  )}
                </span>
              </div>

              <div className={styles.billRow}>
                <span>Platform Fee</span>
                <span>{formatCurrency(platformFee)}</span>
              </div>

              <div className={styles.billRow}>
                <span>Government Taxes & GST (5%)</span>
                <span>{formatCurrency(taxes)}</span>
              </div>

              {coupon && (
                <div className={`${styles.billRow} ${styles.discountRow}`}>
                  <span>Discount ({coupon.code})</span>
                  <span>- {formatCurrency(discountAmount)}</span>
                </div>
              )}

              <div className={styles.divider} />

              <div className={styles.totalRow}>
                <span>To Pay</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            <div className={styles.savingsNotice}>
              <ShieldCheck size={16} color="var(--color-success)" />
              <span>Prices and store inventory verified in real time</span>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => navigate('/customer/checkout')}
              style={{ marginTop: '16px' }}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
