// src/pages/customer/SearchPage.jsx
import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, Plus, Store, Check } from 'lucide-react';
import { storeService } from '../../services/storeService.js';
import { categories } from '../../data/stores.js';
import { useCart } from '../../context/CartContext.jsx';
import Button from '../../components/Button.jsx';
import { Badge } from '../../components/Badge.jsx';
import QuantityStepper from '../../components/QuantityStepper.jsx';
import Skeleton from '../../components/Skeleton.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import { formatCurrency } from '../../utils/helpers.js';
import styles from './SearchPage.module.css';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '';

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [brand, setBrand] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const { items, addItem, updateQuantity } = useCart();

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const timer = setTimeout(() => {
      storeService
        .searchProducts({
          q: query,
          category,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          brand,
          inStock: inStockOnly,
          sortBy,
        })
        .then((data) => {
          if (mounted) {
            setResults(data);
            setLoading(false);
          }
        })
        .catch(() => {
          if (mounted) setLoading(false);
        });
    }, 250);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [query, category, minPrice, maxPrice, brand, inStockOnly, sortBy]);

  const getItemQuantity = (productId) => {
    const found = items.find((i) => i.productId === productId);
    return found ? found.quantity : 0;
  };

  const handleResetFilters = () => {
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setBrand('');
    setInStockOnly(false);
    setSortBy('relevance');
  };

  return (
    <div className={styles.container}>
      {/* Top Search Input */}
      <div className={styles.topSearch}>
        <div className={styles.inputWrap}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search products across all nearby stores..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchParams({ q: e.target.value });
            }}
            className={styles.mainInput}
          />
        </div>
      </div>

      <div className={styles.contentLayout}>
        {/* Sidebar Filters */}
        <aside className={styles.filterSidebar}>
          <div className={styles.filterHeader}>
            <div className={styles.filterTitle}>
              <Filter size={16} /> Filters
            </div>
            <button onClick={handleResetFilters} className={styles.resetBtn}>
              Reset all
            </button>
          </div>

          {/* Categories */}
          <div className={styles.filterGroup}>
            <label className={styles.groupLabel}>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className={styles.filterGroup}>
            <label className={styles.groupLabel}>Price Range (₹)</label>
            <div className={styles.priceInputs}>
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className={styles.priceField}
              />
              <span>to</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className={styles.priceField}
              />
            </div>
          </div>

          {/* Brand */}
          <div className={styles.filterGroup}>
            <label className={styles.groupLabel}>Brand Name</label>
            <input
              type="text"
              placeholder="e.g. Amul, Aashirvaad"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className={styles.filterInput}
            />
          </div>

          {/* Stock availability */}
          <div className={styles.filterGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
              />
              <span>In-stock only</span>
            </label>
          </div>
        </aside>

        {/* Results Main Area */}
        <main className={styles.resultsArea}>
          <div className={styles.resultsHeader}>
            <div>
              <span className={styles.matchCount}>{results.length} products found</span>
              {query && <span className={styles.searchFor}> for "{query}"</span>}
            </div>

            <div className={styles.sortWrapper}>
              <span className={styles.sortLabel}>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={styles.sortSelect}
              >
                <option value="relevance">Relevance</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className={styles.grid}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} height="260px" style={{ borderRadius: '12px' }} />
              ))}
            </div>
          ) : results.length === 0 ? (
            <EmptyState
              icon={<Search size={48} />}
              title="No matching products found"
              description="Try adjusting your keywords, price filters, or category selection."
            />
          ) : (
            <div className={styles.grid}>
              {results.map((product) => {
                const qty = getItemQuantity(product.id);
                return (
                  <div key={product.id} className={styles.card}>
                    <Link to={`/customer/product/${product.id}`} className={styles.imgWrap}>
                      <img src={product.image} alt={product.name} className={styles.img} />
                      {product.stock <= 5 && product.stock > 0 && (
                        <span className={styles.stockTag}>Only {product.stock} left</span>
                      )}
                      {product.stock === 0 && (
                        <span className={styles.outOfStockTag}>Out of stock</span>
                      )}
                    </Link>

                    <div className={styles.body}>
                      <div className={styles.storeTag}>
                        <Store size={12} />
                        <span>{product.store?.name}</span>
                      </div>

                      <div className={styles.brand}>{product.brand}</div>
                      <Link to={`/customer/product/${product.id}`} className={styles.name}>
                        {product.name}
                      </Link>
                      <div className={styles.variant}>
                        {product.size} {product.variant && `• ${product.variant}`}
                      </div>

                      <div className={styles.cardBottom}>
                        <div className={styles.priceCol}>
                          <span className={styles.price}>{formatCurrency(product.price)}</span>
                          {product.mrp > product.price && (
                            <span className={styles.mrp}>{formatCurrency(product.mrp)}</span>
                          )}
                        </div>

                        {qty === 0 ? (
                          <Button
                            variant="primary"
                            size="sm"
                            disabled={product.stock === 0}
                            onClick={() => addItem(product, product.store)}
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

                      <Link to={`/customer/product/${product.id}`} className={styles.compareLink}>
                        Compare nearby store prices →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
