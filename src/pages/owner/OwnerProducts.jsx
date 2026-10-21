// src/pages/owner/OwnerProducts.jsx
import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Check, X, Upload, Save, AlertTriangle } from 'lucide-react';
import { storeService } from '../../services/storeService.js';
import { categories } from '../../data/stores.js';
import Button from '../../components/Button.jsx';
import { Input } from '../../components/Input.jsx';
import { Table, Tr, Td } from '../../components/Table.jsx';
import { Badge } from '../../components/Badge.jsx';
import Modal from '../../components/Modal.jsx';
import { formatCurrency } from '../../utils/helpers.js';

export default function OwnerProducts() {
  const storeId = 's1';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Add / Edit Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'grocery',
    size: '1 kg',
    variant: 'Standard',
    price: 100,
    mrp: 120,
    stock: 25,
    description: '',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300',
  });

  // Bulk stock update state
  const [stockEdits, setStockEdits] = useState({});
  const [savingBulk, setSavingBulk] = useState(false);

  useEffect(() => {
    loadProducts();
  }, [storeId]);

  const loadProducts = async () => {
    setLoading(true);
    const data = await storeService.getOwnerProducts(storeId);
    setProducts(data);
    setLoading(false);
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      brand: '',
      category: 'grocery',
      size: '',
      variant: '',
      price: 0,
      mrp: 0,
      stock: 10,
      description: '',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300',
    });
    setShowModal(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      brand: p.brand || '',
      category: p.category,
      size: p.size,
      variant: p.variant || '',
      price: p.price,
      mrp: p.mrp,
      stock: p.stock,
      description: p.description || '',
      image: p.image,
    });
    setShowModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (editingProduct) {
      await storeService.updateProduct(editingProduct.id, formData);
    } else {
      await storeService.addProduct({
        ...formData,
        storeId,
      });
    }
    setShowModal(false);
    loadProducts();
  };

  const handleToggleEnable = async (productId, currentStatus) => {
    await storeService.updateProduct(productId, { isEnabled: !currentStatus });
    loadProducts();
  };

  const handleStockInputChange = (productId, val) => {
    setStockEdits((prev) => ({ ...prev, [productId]: Number(val) }));
  };

  const handleSaveBulkStock = async () => {
    setSavingBulk(true);
    const updates = Object.entries(stockEdits).map(([id, stock]) => ({ id, stock }));
    await storeService.bulkUpdateStock(updates);
    setStockEdits({});
    setSavingBulk(false);
    loadProducts();
  };

  const filtered = products.filter((p) => {
    const matchCat = !selectedCategory || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)' }}>Product Catalog & Inventory</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
            Manage stock, listings, pricing, and exact size variants for your store
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {Object.keys(stockEdits).length > 0 && (
            <Button variant="outline" loading={savingBulk} onClick={handleSaveBulkStock}>
              <Save size={16} /> Save Bulk Stock ({Object.keys(stockEdits).length})
            </Button>
          )}
          <Button variant="primary" onClick={handleOpenAdd}>
            <Plus size={16} /> Add New Product
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '0 12px', flex: 1, minWidth: '240px' }}>
          <Search size={16} color="var(--color-text-tertiary)" />
          <input
            type="text"
            placeholder="Search by product name, brand, or size..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', border: 'none', background: 'transparent', padding: '10px 0', outline: 'none' }}
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <Table headers={['Product', 'Category', 'Size / Variant', 'Price / MRP', 'Stock Quantity', 'Listing Status', 'Actions']}>
        {filtered.map((p) => {
          const isStockEdited = stockEdits[p.id] !== undefined;
          const currentStockVal = isStockEdited ? stockEdits[p.id] : p.stock;

          return (
            <Tr key={p.id}>
              <Td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={p.image} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{p.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>{p.brand}</div>
                  </div>
                </div>
              </Td>
              <Td>{p.category}</Td>
              <Td>
                <Badge variant="neutral">{p.size}</Badge> {p.variant && `(${p.variant})`}
              </Td>
              <Td>
                <strong>{formatCurrency(p.price)}</strong>
                {p.mrp > p.price && <div style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', textDecoration: 'line-through' }}>{formatCurrency(p.mrp)}</div>}
              </Td>
              <Td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="number"
                    value={currentStockVal}
                    onChange={(e) => handleStockInputChange(p.id, e.target.value)}
                    style={{
                      width: '70px',
                      padding: '4px 8px',
                      borderRadius: 'var(--radius-sm)',
                      border: isStockEdited ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                      background: 'var(--color-surface)',
                    }}
                  />
                  {currentStockVal <= 5 && <AlertTriangle size={14} color="var(--color-warning)" title="Low Stock" />}
                </div>
              </Td>
              <Td>
                <Badge variant={p.isEnabled ? 'success' : 'neutral'}>
                  {p.isEnabled ? 'Active' : 'Disabled'}
                </Badge>
              </Td>
              <Td>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(p)}>
                    <Edit2 size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleEnable(p.id, p.isEnabled)}
                    title={p.isEnabled ? 'Disable Listing' : 'Enable Listing'}
                  >
                    {p.isEnabled ? <X size={14} color="var(--color-error)" /> : <Check size={14} color="var(--color-success)" />}
                  </Button>
                </div>
              </Td>
            </Tr>
          );
        })}
      </Table>

      {/* Add / Edit Product Modal */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editingProduct ? 'Edit Product Listing' : 'Add New Product to Store Catalog'}
          size="md"
        >
          <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Input
              label="Product Title"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input
                label="Brand"
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold' }}>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{ padding: '9px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input
                label="Exact Size / Weight (e.g. 500g, 1L)"
                required
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              />
              <Input
                label="Variant (Flavour / Sub-type)"
                value={formData.variant}
                onChange={(e) => setFormData({ ...formData, variant: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <Input
                label="Selling Price (₹)"
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              />
              <Input
                label="MRP (₹)"
                type="number"
                required
                value={formData.mrp}
                onChange={(e) => setFormData({ ...formData, mrp: Number(e.target.value) })}
              />
              <Input
                label="Stock Units"
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
              />
            </div>

            <Input
              label="Image URL"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
              <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button type="submit" variant="primary">Save Product</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
