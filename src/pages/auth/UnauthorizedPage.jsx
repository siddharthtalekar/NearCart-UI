// src/pages/auth/UnauthorizedPage.jsx
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import Button from '../../components/Button.jsx';

export default function UnauthorizedPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: '32px' }}>
      <ShieldAlert size={64} color="var(--color-warning)" style={{ marginBottom: '16px' }} />
      <h2 style={{ fontSize: 'var(--text-2xl)', margin: '0 0 8px' }}>Access Restricted</h2>
      <p style={{ color: 'var(--color-text-secondary)', maxWidth: '420px', marginBottom: '24px' }}>
        You do not have the permissions required to view this area. Switch to an authorized account or return to safety.
      </p>
      <div style={{ display: 'flex', gap: '12px' }}>
        <Link to="/login">
          <Button variant="outline">Switch Account</Button>
        </Link>
        <Link to="/">
          <Button variant="primary">Go to Home</Button>
        </Link>
      </div>
    </div>
  );
}
