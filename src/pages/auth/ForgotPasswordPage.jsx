// src/pages/auth/ForgotPasswordPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { authService } from '../../services/authService.js';
import Button from '../../components/Button.jsx';
import { Input } from '../../components/Input.jsx';
import styles from './LoginPage.module.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sentMessage, setSentMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await authService.forgotPassword(email);
      setSentMessage(res.message);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2>Reset Password</h2>
          <p>We'll send you instructions to reset your password</p>
        </div>

        {sentMessage ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <CheckCircle2 size={48} color="var(--color-success)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ marginBottom: '8px' }}>Check your inbox</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: '24px' }}>
              {sentMessage}
            </p>
            <Link to="/login">
              <Button variant="primary" fullWidth>Back to Sign In</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            {error && (
              <div className={styles.errorAlert}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}
            <Input
              label="Account Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail size={16} />}
            />
            <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
              Send Reset Link
            </Button>
            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                <ArrowLeft size={16} /> Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
