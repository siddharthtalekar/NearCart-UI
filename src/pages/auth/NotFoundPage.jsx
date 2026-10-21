// src/pages/auth/NotFoundPage.jsx
import { Link } from 'react-router-dom';
import Button from '../../components/Button.jsx';

export default function NotFoundPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: '32px' }}>
      <h1 style={{ fontSize: '72px', fontWeight: '900', color: 'var(--color-primary-300)', lineHeight: '1' }}>404</h1>
      <h2 style={{ fontSize: 'var(--text-2xl)', margin: '16px 0 8px' }}>Page Not Found</h2>
      <p style={{ color: 'var(--color-text-secondary)', maxWidth: '400px', marginBottom: '24px' }}>
        The page you are looking for does not exist or has been moved to another location.
      </p>
      <Link to="/">
        <Button variant="primary">Return to Home</Button>
      </Link>
    </div>
  );
}
