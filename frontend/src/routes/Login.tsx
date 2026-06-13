import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export default function Login() {
  const { user, isLoading } = useAuth();
  const nav = useNavigate();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isLoading && user) nav('/dashboard', { replace: true });
  }, [user, isLoading, nav]);

  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get('error');

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={reduceMotion ? undefined : { duration: 0.3, ease: 'easeOut' }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          background: 'var(--pf-surface-card-bg)',
          border: '1px solid var(--pf-surface-card-border)',
          borderRadius: 'var(--pf-radius-md)',
          padding: '40px 36px',
        }}
      >
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              fontFamily: 'var(--pf-font-family-display)',
              marginBottom: 8,
            }}
          >
            PathFinder AI
          </h1>
          <p style={{ color: 'var(--pf-color-text-muted)', fontSize: '0.9rem' }}>
            Sign in to save your career insights
          </p>
        </div>

        {error && (
          <div
            style={{
              marginBottom: 20,
              padding: '10px 14px',
              background: 'color-mix(in srgb, var(--pf-color-danger-500) 10%, transparent)',
              border: '1px solid color-mix(in srgb, var(--pf-color-danger-500) 30%, transparent)',
              borderRadius: 'var(--pf-radius-sm)',
              fontSize: '0.85rem',
              color: 'var(--pf-color-danger-500)',
            }}
          >
            Sign in failed. Please try again.
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <a
            href={`${BASE_URL}/auth/google`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: '11px 20px',
              background: 'var(--pf-btn-secondary-bg)',
              border: '1px solid var(--pf-btn-secondary-border)',
              borderRadius: 'var(--pf-radius-sm)',
              color: 'var(--pf-btn-secondary-text)',
              fontWeight: 600,
              fontSize: '0.9rem',
              textDecoration: 'none',
              transition: 'border-color 0.15s',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </a>

          <a
            href={`${BASE_URL}/auth/github`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: '11px 20px',
              background: 'var(--pf-btn-secondary-bg)',
              border: '1px solid var(--pf-btn-secondary-border)',
              borderRadius: 'var(--pf-radius-sm)',
              color: 'var(--pf-btn-secondary-text)',
              fontWeight: 600,
              fontSize: '0.9rem',
              textDecoration: 'none',
              transition: 'border-color 0.15s',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844a9.59 9.59 0 012.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            Continue with GitHub
          </a>
        </div>

        <p
          style={{
            marginTop: 24,
            textAlign: 'center',
            fontSize: '0.78rem',
            color: 'var(--pf-color-text-muted)',
          }}
        >
          You can also use PathFinder without signing in.{' '}
          <a href="/" style={{ color: 'var(--pf-color-brand-500)' }}>
            Start assessment
          </a>
        </p>
      </div>
    </motion.div>
  );
}
