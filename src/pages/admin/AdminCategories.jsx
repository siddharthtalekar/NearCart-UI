// src/pages/admin/AdminCategories.jsx
import { useState } from 'react';
import { Layers, Plus, Edit2, Check, X, ArrowUp, ArrowDown } from 'lucide-react';
import { categories as initialCategories } from '../../data/stores.js';
import Card, { CardHeader, CardBody } from '../../components/Card.jsx';
import Button from '../../components/Button.jsx';
import { Input } from '../../components/Input.jsx';
import { Badge } from '../../components/Badge.jsx';
import Modal from '../../components/Modal.jsx';
import { Table, Tr, Td } from '../../components/Table.jsx';

export default function AdminCategories() {
  const [categoriesList, setCategoriesList] = useState(
    initialCategories.map((c) => ({ ...c, isEnabled: true }))
  );
  const [showModal, setShowModal] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [formData, setFormData] = useState({ id: '', name: '', icon: '🛍️' });

  const handleOpenAdd = () => {
    setEditingCat(null);
    setFormData({ id: '', name: '', icon: '🛒' });
    setShowModal(true);
  };

  const handleOpenEdit = (c) => {
    setEditingCat(c);
    setFormData({ id: c.id, name: c.name, icon: c.icon });
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingCat) {
      setCategoriesList((prev) =>
        prev.map((c) => (c.id === editingCat.id ? { ...c, ...formData } : c))
      );
    } else {
      setCategoriesList((prev) => [
        ...prev,
        {
          id: formData.name.toLowerCase().replace(/\s+/g, '_'),
          name: formData.name,
          icon: formData.icon,
          isEnabled: true,
        },
      ]);
    }
    setShowModal(false);
  };

  const handleToggleEnable = (id) => {
    setCategoriesList((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isEnabled: !c.isEnabled } : c))
    );
  };

  const moveItem = (idx, direction) => {
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= categoriesList.length) return;
    const copy = [...categoriesList];
    const temp = copy[idx];
    copy[idx] = copy[newIdx];
    copy[newIdx] = temp;
    setCategoriesList(copy);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>Store Category Taxonomies</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
            Organize discovery categories, reorder chips, and toggle platform visibility
          </p>
        </div>
        <Button variant="primary" onClick={handleOpenAdd}>
          <Plus size={16} /> Add Category
        </Button>
      </div>

      <Card>
        <Table headers={['Icon', 'Category Title', 'Key Identifier', 'Order', 'Status', 'Actions']}>
          {categoriesList.map((cat, idx) => (
            <Tr key={cat.id}>
              <Td style={{ fontSize: '24px' }}>{cat.icon}</Td>
              <Td><strong>{cat.name}</strong></Td>
              <Td style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}>{cat.id}</Td>
              <Td>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <Button variant="ghost" size="sm" disabled={idx === 0} onClick={() => moveItem(idx, -1)}>
                    <ArrowUp size={14} />
                  </Button>
                  <Button variant="ghost" size="sm" disabled={idx === categoriesList.length - 1} onClick={() => moveItem(idx, 1)}>
                    <ArrowDown size={14} />
                  </Button>
                </div>
              </Td>
              <Td>
                <Badge variant={cat.isEnabled ? 'success' : 'neutral'}>
                  {cat.isEnabled ? 'Visible' : 'Disabled'}
                </Badge>
              </Td>
              <Td>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button variant="outline" size="sm" onClick={() => handleOpenEdit(cat)}>
                    <Edit2 size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleEnable(cat.id)}
                  >
                    {cat.isEnabled ? <X size={14} color="var(--color-error)" /> : <Check size={14} color="var(--color-success)" />}
                  </Button>
                </div>
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>

      {/* Add / Edit Category Modal */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editingCat ? 'Edit Category' : 'Create Category'}
        >
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Input
              label="Category Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Emoji Icon Symbol"
              required
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
              <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button type="submit" variant="primary">Save Category</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
