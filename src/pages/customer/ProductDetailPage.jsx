// src/pages/customer/ProductDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Store, Clock, ShieldCheck, AlertTriangle, Check, Plus, ShoppingCart, Repeat, FileText } from 'lucide-react';
import { storeService } from '../../services/storeService.js';
import { useCart } from '../../context/CartContext.jsx';
import Button from '../../components/Button.jsx';
import { Badge } from '../../components/Badge.jsx';
import QuantityStepper from '../../components/QuantityStepper.jsx';
import Skeleton from '../../components/Skeleton.jsx';
import { Table, Tr, Td } from '../../components/Table.jsx';
import AutoBookingModal from '../../components/AutoBookingModal.jsx';
import { formatCurrency } from '../../utils/helpers.js';
import styles from './ProductDetailPage.module.css';

export default function ProductDetailPage() {
  const { productId } = useParams();
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);

  const { items, addItem, updateQuantity } = useCart();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    storeService
      .getPriceComparison(productId)
      .then((data) => {
        if (mounted) {
          setComparison(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [productId]);

  if (loading) {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 16px' }}>
        <Skeleton height="360px" style={{ borderRadius: '16px', marginBottom: '24px' }} />
        <Skeleton height="200px" style={{ borderRadius: '16px' }} />
      </div>
    );
  }

  const { base: product, exact = [], similar = [] } = comparison || {};

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <h2>Product not found</h2>
        <Link to="/customer">
          <Button variant="primary" style={{ marginTop: '16px' }}>Return to Stores</Button>
        </Link>
      </div>
    );
  }

  const getItemQuantity = (pId) => {
    const found = items.find((i) => i.productId === pId);
    return found ? found.quantity : 0;
  };

  const currentQty = getItemQuantity(product.id);

  // All exact store listings including the current product
  const allExactSellers = [
    { ...product, isCurrent: true },
    ...exact.map((e) => ({ ...e, isCurrent: false })),
  ].sort((a, b) => a.price - b.price);

  return (
    <div className={styles.container}>
      <Link to={`/customer/store/${product.storeId}`} className={styles.backLink}>
        <ArrowLeft size={16} /> Back to {product.store?.name || 'Store'}
      </Link>

      {/* Main Product Hero */}
      <div className={styles.productCard}>
        <div className={styles.imageCol}>
          <img src={product.image} alt={product.name} className={styles.mainImg} />
        </div>

        <div className={styles.infoCol}>
          <div className={styles.brandRow}>
            <span className={styles.brand}>{product.brand}</span>
            <span className={styles.category}>{product.category}</span>
          </div>

          <h1 className={styles.title}>{product.name}</h1>

          {/* Strict Variant Attributes */}
          <div className={styles.attributesCard}>
            <div className={styles.attrItem}>
              <span className={styles.attrLabel}>Exact Size/Weight:</span>
              <span className={styles.attrValue}>{product.size}</span>
            </div>
            {product.variant && (
              <div className={styles.attrItem}>
                <span className={styles.attrLabel}>Variant:</span>
                <span className={styles.attrValue}>{product.variant}</span>
              </div>
            )}
            <div className={styles.attrItem}>
              <span className={styles.attrLabel}>Current Store:</span>
              <span className={styles.attrValue}>{product.store?.name}</span>
            </div>
          </div>

          <div className={styles.priceRow}>
            <div className={styles.priceWrap}>
              <span className={styles.price}>{formatCurrency(product.price)}</span>
              {product.mrp > product.price && (
                <span className={styles.mrp}>{formatCurrency(product.mrp)}</span>
              )}
            </div>
            {product.discountPercent > 0 && (
              <Badge variant="accent">{product.discountPercent}% OFF</Badge>
            )}
          </div>

          <p className={styles.description}>{product.description}</p>

          <div className={styles.actionRow}>
            {currentQty === 0 ? (
              <Button
                variant="primary"
                size="lg"
                disabled={product.stock === 0}
                onClick={() => addItem(product, product.store)}
              >
                <Plus size={18} /> Add to Cart from {product.store?.name}
              </Button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <QuantityStepper
                  value={currentQty}
                  max={product.stock}
                  onChange={(newQty) => updateQuantity(product.id, newQty)}
                  size="lg"
                />
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary)', fontWeight: 'bold' }}>
                  ✓ In Cart
                </span>
              </div>
            )}

            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsAutoBookingOpen(true)}
              title="Schedule daily, alternate days or weekday delivery on auto-pilot"
            >
              <Repeat size={16} /> Set Daily Auto-Booking
            </Button>
          </div>

          {/* Pharmacy Prescription Callout if pharmacy category */}
          {product.category === 'pharmacy' && (
            <div className={styles.rxHelpStrip}>
              <FileText size={15} color="var(--color-primary)" />
              <span>Have a doctor's handwritten or printed prescription for this medicine?</span>
              <Link to="/customer/pharmacy-prescription" className={styles.rxLink}>
                Upload Doctor's List Image →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Auto Booking Modal */}
      {isAutoBookingOpen && (
        <AutoBookingModal
          isOpen={isAutoBookingOpen}
          onClose={() => setIsAutoBookingOpen(false)}
          product={product}
          store={product.store}
        />
      )}

      {/* SECTION 1: EXACT PRODUCT PRICE COMPARISON */}
      <div className={styles.comparisonSection}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>
              Compare Identical Product Across Local Stores
            </h2>
            <p className={styles.sectionSubtitle}>
              Exact match: <strong>{product.brand} - {product.name} ({product.size} {product.variant || ''})</strong>
            </p>
          </div>
          <Badge variant="success">
            {allExactSellers.length} Store{allExactSellers.length > 1 ? 's' : ''} Offering This Item
          </Badge>
        </div>

        <Table
          headers={['Store Name', 'Price', 'Delivery Fee', 'Delivery ETA', 'Stock Status', 'Action']}
        >
          {allExactSellers.map((seller) => {
            const sellerQty = getItemQuantity(seller.id);
            const isLowestPrice = seller.price === allExactSellers[0].price;

            return (
              <Tr key={seller.id} className={seller.isCurrent ? styles.currentSellerRow : ''}>
                <Td>
                  <div className={styles.sellerNameCol}>
                    <Store size={16} color="var(--color-primary)" />
                    <div>
                      <strong>{seller.store?.name}</strong>
                      <div className={styles.storeSubtext}>
                        {seller.store?.area} • {seller.store?.distanceKm} km away
                        {seller.isCurrent && <span className={styles.viewingPill}>Viewing</span>}
                      </div>
                    </div>
                  </div>
                </Td>
                <Td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className={styles.sellerPrice}>{formatCurrency(seller.price)}</span>
                    {isLowestPrice && (
                      <span className={styles.bestPriceBadge}>Lowest Price</span>
                    )}
                  </div>
                </Td>
                <Td>
                  {seller.store?.deliveryFee === 0 ? (
                    <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>FREE</span>
                  ) : (
                    formatCurrency(seller.store?.deliveryFee || 0)
                  )}
                </Td>
                <Td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} color="var(--color-text-tertiary)" />
                    <span>{seller.store?.deliveryEtaMin || 30} mins</span>
                  </div>
                </Td>
                <Td>
                  {seller.stock > 0 ? (
                    <Badge variant="success">In Stock ({seller.stock})</Badge>
                  ) : (
                    <Badge variant="error">Out of Stock</Badge>
                  )}
                </Td>
                <Td>
                  {sellerQty === 0 ? (
                    <Button
                      variant={seller.isCurrent ? 'primary' : 'outline'}
                      size="sm"
                      disabled={seller.stock === 0}
                      onClick={() => addItem(seller, seller.store)}
                    >
                      <Plus size={14} /> Add to Cart
                    </Button>
                  ) : (
                    <QuantityStepper
                      value={sellerQty}
                      max={seller.stock}
                      onChange={(newQty) => updateQuantity(seller.id, newQty)}
                      size="sm"
                    />
                  )}
                </Td>
              </Tr>
            );
          })}
        </Table>
      </div>

      {/* SECTION 2: SIMILAR BUT DIFFERENT VARIANTS (WITH MANDATORY WARNING RULE) */}
      {similar.length > 0 && (
        <div className={styles.similarSection}>
          <div className={styles.warningBox}>
            <AlertTriangle size={20} className={styles.warningIcon} />
            <div>
              <h4 className={styles.warningTitle}>
                Notice: Different Sizes or Variants Are Never Merged
              </h4>
              <p className={styles.warningDesc}>
                The products below are from the same brand but differ in package weight, volume, or flavour. Please review specifications carefully before buying.
              </p>
            </div>
          </div>

          <h3 className={styles.similarHeading}>Similar Options from this Brand</h3>
          <div className={styles.similarGrid}>
            {similar.map((item) => (
              <div key={item.id} className={styles.similarCard}>
                <img src={item.image} alt={item.name} className={styles.similarImg} />
                <div className={styles.similarDetails}>
                  <div className={styles.similarName}>{item.name}</div>
                  <div className={styles.differentTag}>
                    Differs: <strong>{item.size} {item.variant || ''}</strong>
                  </div>
                  <div className={styles.similarPriceRow}>
                    <span className={styles.similarPrice}>{formatCurrency(item.price)}</span>
                    <span className={styles.similarStore}>{item.store?.name}</span>
                  </div>
                  <Link to={`/customer/product/${item.id}`} className={styles.viewSimilarLink}>
                    View & Compare This Variant →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
