// src/pages/customer/StorePage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, MapPin, Search, Plus, Tag, ArrowLeft, Check, ShoppingCart, Repeat, UploadCloud, FileText } from 'lucide-react';
import { storeService } from '../../services/storeService.js';
import { useCart } from '../../context/CartContext.jsx';
import Button from '../../components/Button.jsx';
import { Badge } from '../../components/Badge.jsx';
import QuantityStepper from '../../components/QuantityStepper.jsx';
import Skeleton from '../../components/Skeleton.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import AutoBookingModal from '../../components/AutoBookingModal.jsx';
import PrescriptionUploadModal from '../../components/PrescriptionUploadModal.jsx';
import { formatCurrency } from '../../utils/helpers.js';
import styles from './StorePage.module.css';

export default function StorePage() {
  const { storeId } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAutoBookOpen, setIsAutoBookOpen] = useState(false);
  const [selectedAutoBookProduct, setSelectedAutoBookProduct] = useState(null);
  const [isRxModalOpen, setIsRxModalOpen] = useState(false);

  const { items, addItem, updateQuantity } = useCart();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([
      storeService.getStore(storeId),
      storeService.getStoreProducts(storeId),
    ])
      .then(([storeData, productData]) => {
        if (mounted) {
          setStore(storeData);
          setProducts(productData);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [storeId]);

  if (loading) {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 16px' }}>
        <Skeleton height="240px" style={{ borderRadius: '16px', marginBottom: '24px' }} />
        <Skeleton height="40px" style={{ marginBottom: '16px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} height="200px" style={{ borderRadius: '12px' }} />
          ))}
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Store not found</h2>
        <Link to="/customer">
          <Button variant="primary" style={{ marginTop: '16px' }}>Back to Stores</Button>
        </Link>
      </div>
    );
  }

  // Categories present in this store's catalog
  const storeCategories = ['all', ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((p) => {
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const getItemQuantity = (productId) => {
    const found = items.find((i) => i.productId === productId);
    return found ? found.quantity : 0;
  };

  return (
    <div className={styles.container}>
      <Link to="/customer" className={styles.backLink}>
        <ArrowLeft size={16} /> All Stores
      </Link>

      {/* Store Header Banner */}
      <div className={styles.headerCard}>
        <div className={styles.bannerWrap}>
          <img src={store.banner} alt={store.name} className={styles.bannerImg} />
          <div className={styles.bannerOverlay}>
            <div className={styles.badgeRow}>
              <Badge variant={store.isOpen ? 'success' : 'neutral'}>
                {store.isOpen ? 'Open Now' : 'Closed'}
              </Badge>
              <span className={styles.distBadge}>{store.distanceKm} km away</span>
            </div>
            <h1 className={styles.storeTitle}>{store.name}</h1>
            <p className={styles.storeAddress}>{store.address}, {store.area}</p>
          </div>
        </div>

        {/* Store Key Details Row */}
        <div className={styles.metaRow}>
          <div className={styles.metaItem}>
            <Star size={16} fill="#f59e0b" color="#f59e0b" />
            <span className={styles.metaBold}>{store.rating.toFixed(1)}</span>
            <span className={styles.metaDim}>({store.reviewCount} reviews)</span>
          </div>
          <div className={styles.metaItem}>
            <Clock size={16} />
            <span>ETA: <strong>{store.deliveryEtaMin} mins</strong></span>
          </div>
          <div className={styles.metaItem}>
            <span>Delivery: <strong>{store.deliveryFee === 0 ? 'FREE' : formatCurrency(store.deliveryFee)}</strong></span>
          </div>
          <div className={styles.metaItem}>
            <span>Min Order: <strong>{formatCurrency(store.minOrderAmount)}</strong></span>
          </div>
        </div>
      </div>

      {/* Offers banner if any */}
      <div className={styles.promoBar}>
        <Tag size={16} color="var(--color-accent-600)" />
        <span>Get free delivery on orders above ₹300 directly from {store.name}!</span>
      </div>

      {/* Pharmacy Doctor Prescription Upload Banner */}
      {store.category === 'pharmacy' && (
        <div className={styles.pharmacyRxCard}>
          <div className={styles.rxCardLeft}>
            <div className={styles.rxCardEmoji}>📋</div>
            <div>
              <h3 className={styles.rxCardTitle}>Order with Doctor's Medicine List / Prescription</h3>
              <p className={styles.rxCardDesc}>
                Have a doctor's handwritten slip or printed prescription? Upload the photo directly and {store.name}'s registered chemist will pack &amp; deliver in 15 mins.
              </p>
            </div>
          </div>
          <Button
            variant="emerald"
            onClick={() => setIsRxModalOpen(true)}
          >
            <UploadCloud size={16} /> Upload Doctor's List
          </Button>
        </div>
      )}

      {/* Search & Category Tabs */}
      <div className={styles.controlsRow}>
        <div className={styles.searchWrap}>
          <Search size={16} />
          <input
            type="text"
            placeholder={`Search items in ${store.name}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.catChips}>
          {storeCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`${styles.chip} ${selectedCategory === cat ? styles.chipActive : ''}`}
            >
              {cat === 'all' ? 'All Items' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          icon={<Search size={40} />}
          title="No products match your search"
          description="Try a different search word or select another category."
        />
      ) : (
        <div className={styles.productGrid}>
          {filteredProducts.map((product) => {
            const qty = getItemQuantity(product.id);
            return (
              <div key={product.id} className={styles.productCard}>
                <Link to={`/customer/product/${product.id}`} className={styles.productImgWrap}>
                  <img src={product.image} alt={product.name} className={styles.productImg} />
                  {product.discountPercent > 0 && (
                    <span className={styles.discountBadge}>{product.discountPercent}% OFF</span>
                  )}
                </Link>

                <div className={styles.productInfo}>
                  <div className={styles.brandText}>{product.brand}</div>
                  <Link to={`/customer/product/${product.id}`} className={styles.productName}>
                    {product.name}
                  </Link>
                  <div className={styles.variantText}>
                    {product.size} {product.variant && `• ${product.variant}`}
                  </div>

                  <div className={styles.priceRow}>
                    <div className={styles.prices}>
                      <span className={styles.currentPrice}>{formatCurrency(product.price)}</span>
                      {product.mrp > product.price && (
                        <span className={styles.mrpPrice}>{formatCurrency(product.mrp)}</span>
                      )}
                    </div>

                    <div className={styles.actionBtn}>
                      {qty === 0 ? (
                        <Button
                          variant="primary"
                          size="sm"
                          disabled={product.stock === 0}
                          onClick={() => addItem(product, store)}
                        >
                          <Plus size={14} /> Add
                        </Button>
                      ) : (
                        <QuantityStepper
                          value={qty}
                          max={product.stock}
                          onChange={(newQty) => updateQuantity(product.id, newQty)}
                          size="sm"
                        />
                      )}
                    </div>
                  </div>

                  <div className={styles.bottomActionRow}>
                    {/* Price Comparison Link */}
                    <Link to={`/customer/product/${product.id}`} className={styles.compareLink}>
                      Compare prices →
                    </Link>

                    <button
                      type="button"
                      className={styles.autoBookMiniBtn}
                      onClick={() => {
                        setSelectedAutoBookProduct(product);
                        setIsAutoBookOpen(true);
                      }}
                      title="Set daily or weekly recurring delivery"
                    >
                      <Repeat size={12} /> Auto-Book
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Auto Booking Modal */}
      {isAutoBookOpen && selectedAutoBookProduct && (
        <AutoBookingModal
          isOpen={isAutoBookOpen}
          onClose={() => {
            setIsAutoBookOpen(false);
            setSelectedAutoBookProduct(null);
          }}
          product={selectedAutoBookProduct}
          store={store}
        />
      )}

      {/* Prescription Upload Modal */}
      {isRxModalOpen && (
        <PrescriptionUploadModal
          isOpen={isRxModalOpen}
          onClose={() => setIsRxModalOpen(false)}
          initialStoreId={store.id}
        />
      )}
    </div>
  );
}
