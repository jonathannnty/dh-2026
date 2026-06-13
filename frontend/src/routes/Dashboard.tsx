import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, BookmarkX, GitCompareArrows } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { createSession, getTracks } from '@/lib/api';
import type { SponsorTrack } from '@/schemas/career';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

interface SessionSummary {
  id: string;
  status: string;
  trackId: string | null;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  profile?: string;
}

interface SavedCareer {
  id: string;
  sessionId: string;
  careerTitle: string;
  fitScore: number | null;
  savedAt: string;
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const wrap: React.CSSProperties = { maxWidth: 900, margin: '0 auto', padding: '32px 20px', width: '100%' };
const card: React.CSSProperties = {
  background: 'var(--pf-surface-card-bg)',
  border: '1px solid var(--pf-surface-card-border)',
  borderRadius: 'var(--pf-radius-md)',
  padding: '24px',
  marginBottom: 20,
};
const sectionTitle: React.CSSProperties = {
  fontSize: '1rem',
  fontWeight: 700,
  marginBottom: 16,
  fontFamily: 'var(--pf-font-family-display)',
};
const chip: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '3px 10px',
  background: 'var(--pf-chip-bg)',
  border: '1px solid var(--pf-chip-border)',
  borderRadius: 'var(--pf-radius-pill)',
  fontSize: '0.78rem',
  color: 'var(--pf-chip-text)',
  margin: '3px',
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const qc = useQueryClient();
  const reduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<'sessions' | 'saved' | 'profile' | 'stats'>('sessions');

  const { data: sessionsData, isLoading: sessionsLoading } = useQuery({
    queryKey: ['sessions', 'me'],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/sessions?userId=me`, { credentials: 'include' });
      if (!res.ok) return { sessions: [] };
      return res.json() as Promise<{ sessions: SessionSummary[] }>;
    },
  });

  const { data: savedData, isLoading: savedLoading } = useQuery({
    queryKey: ['saved-careers'],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/saved-careers`, { credentials: 'include' });
      if (!res.ok) return { savedCareers: [] };
      return res.json() as Promise<{ savedCareers: SavedCareer[] }>;
    },
  });

  const { data: tracksData } = useQuery({
    queryKey: ['tracks'],
    queryFn: getTracks,
  });

  const tracksMap = new Map<string, SponsorTrack>((tracksData ?? []).map((t) => [t.id, t]));
  const sessions: SessionSummary[] = sessionsData?.sessions ?? [];
  const saved: SavedCareer[] = savedData?.savedCareers ?? [];
  const completed = sessions.filter((s) => s.status === 'complete');

  const avgFitScore = (() => {
    const scores = saved.map((s) => s.fitScore).filter((n): n is number => n !== null);
    if (!scores.length) return null;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  })();

  const tracksExplored = [...new Set(sessions.map((s) => s.trackId).filter(Boolean))] as string[];

  const unsave = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`${BASE_URL}/saved-careers/${id}`, { method: 'DELETE', credentials: 'include' });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['saved-careers'] }),
  });

  async function handleNew() {
    const session = await createSession();
    nav(`/onboarding?session=${session.id}&track=general`);
  }

  const tabs = [
    { key: 'sessions' as const, label: `Sessions (${sessions.length})` },
    { key: 'saved' as const, label: `Saved Careers (${saved.length})` },
    { key: 'profile' as const, label: 'Profile Snapshot' },
    { key: 'stats' as const, label: 'Stats' },
  ];

  return (
    <motion.div
      style={wrap}
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={reduceMotion ? undefined : { duration: 0.28, ease: 'easeOut' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Dashboard</h1>
          {user && (
            <p style={{ color: 'var(--pf-color-text-muted)', fontSize: '0.85rem', marginTop: 2 }}>
              {user.name ?? user.email}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={handleNew}
            style={{
              padding: '9px 18px',
              background: 'var(--pf-btn-primary-bg)',
              color: 'var(--pf-btn-primary-text)',
              border: 'none',
              borderRadius: 'var(--pf-radius-sm)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
            }}
          >
            + New Assessment
          </button>
          <button
            onClick={() => logout()}
            style={{
              padding: '9px 18px',
              background: 'none',
              color: 'var(--pf-color-text-muted)',
              border: '1px solid var(--pf-surface-card-border)',
              borderRadius: 'var(--pf-radius-sm)',
              fontWeight: 500,
              fontSize: '0.88rem',
              cursor: 'pointer',
            }}
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid var(--pf-surface-card-border)', paddingBottom: 0 }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              padding: '8px 16px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === t.key ? '2px solid var(--pf-color-brand-500)' : '2px solid transparent',
              color: activeTab === t.key ? 'var(--pf-color-brand-400)' : 'var(--pf-color-text-muted)',
              fontWeight: activeTab === t.key ? 600 : 400,
              fontSize: '0.88rem',
              cursor: 'pointer',
              marginBottom: -1,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Sessions tab */}
      {activeTab === 'sessions' && (
        <div>
          {sessionsLoading && <p style={{ color: 'var(--pf-color-text-muted)' }}>Loading…</p>}
          {!sessionsLoading && sessions.length === 0 && (
            <div style={{ ...card, textAlign: 'center', padding: '48px 24px' }}>
              <p style={{ color: 'var(--pf-color-text-muted)', marginBottom: 16 }}>No sessions yet.</p>
              <button onClick={handleNew} style={{ padding: '9px 22px', background: 'var(--pf-btn-primary-bg)', color: 'var(--pf-btn-primary-text)', border: 'none', borderRadius: 'var(--pf-radius-sm)', fontWeight: 600, cursor: 'pointer' }}>
                Start first assessment
              </button>
            </div>
          )}
          {sessions.map((s) => {
            const track = s.trackId ? tracksMap.get(s.trackId) : null;
            return (
              <motion.div
                key={s.id}
                whileHover={reduceMotion ? undefined : { y: -2 }}
                onClick={() => nav(s.status === 'complete' ? `/results/${s.id}` : `/onboarding?session=${s.id}`)}
                style={{ ...card, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}
              >
                <div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', fontFamily: 'var(--pf-font-family-mono)' }}>
                      {s.id.slice(0, 8)}
                    </span>
                    <span style={{ ...chip, color: s.status === 'complete' ? 'var(--pf-color-success-500)' : 'var(--pf-color-text-muted)', borderColor: s.status === 'complete' ? 'var(--pf-color-success-500)' : 'var(--pf-surface-card-border)' }}>
                      {s.status}
                    </span>
                    {track && (
                      <span style={{ ...chip, color: track.color ?? 'var(--pf-color-brand-500)', borderColor: track.color ?? 'var(--pf-color-brand-500)' }}>
                        {track.name}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--pf-color-text-muted)' }}>
                    {s.messageCount} message{s.messageCount !== 1 ? 's' : ''} · {relativeTime(s.updatedAt)}
                  </p>
                </div>
                <ArrowUpRight size={16} style={{ color: 'var(--pf-color-brand-500)', flexShrink: 0 }} />
              </motion.div>
            );
          })}
          {completed.length >= 2 && (
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <Link
                to="/compare"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 18px', border: '1px solid var(--pf-color-brand-500)', borderRadius: 'var(--pf-radius-sm)', color: 'var(--pf-color-brand-400)', fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none' }}
              >
                <GitCompareArrows size={15} />
                Compare sessions
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Saved Careers tab */}
      {activeTab === 'saved' && (
        <div>
          {savedLoading && <p style={{ color: 'var(--pf-color-text-muted)' }}>Loading…</p>}
          {!savedLoading && saved.length === 0 && (
            <div style={{ ...card, textAlign: 'center', padding: '48px 24px' }}>
              <p style={{ color: 'var(--pf-color-text-muted)' }}>No saved careers yet. Bookmark careers from your results pages.</p>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {saved.map((sc) => (
              <div key={sc.id} style={card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <p style={{ fontWeight: 600, fontSize: '0.92rem', flex: 1 }}>{sc.careerTitle}</p>
                  <button
                    onClick={() => unsave.mutate(sc.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pf-color-text-muted)', padding: 4 }}
                    aria-label="Remove saved career"
                  >
                    <BookmarkX size={15} />
                  </button>
                </div>
                {sc.fitScore !== null && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--pf-color-text-muted)', marginBottom: 4 }}>
                      Fit score: {sc.fitScore}%
                    </div>
                    <div style={{ height: 4, background: 'var(--pf-color-bg-subtle)', borderRadius: 2 }}>
                      <div style={{ width: `${sc.fitScore}%`, height: '100%', background: 'var(--pf-color-brand-500)', borderRadius: 2 }} />
                    </div>
                  </div>
                )}
                <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                  <Link
                    to={`/results/${sc.sessionId}`}
                    style={{ fontSize: '0.75rem', color: 'var(--pf-color-brand-500)', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    View results <ArrowUpRight size={12} />
                  </Link>
                  <span style={{ fontSize: '0.75rem', color: 'var(--pf-color-text-muted)' }}>
                    {relativeTime(sc.savedAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Profile Snapshot tab */}
      {activeTab === 'profile' && (
        <div style={card}>
          <p style={sectionTitle}>Career Profile Snapshot</p>
          {sessions.length === 0 ? (
            <p style={{ color: 'var(--pf-color-text-muted)', fontSize: '0.88rem' }}>
              Complete at least one assessment to see your profile snapshot.
            </p>
          ) : (
            (() => {
              const merged: Record<string, unknown> = {};
              for (const s of [...sessions].reverse()) {
                try {
                  const p = JSON.parse((s as unknown as { profile?: string }).profile ?? '{}');
                  for (const [k, v] of Object.entries(p)) {
                    if (v !== null && v !== undefined && !(Array.isArray(v) && (v as unknown[]).length === 0)) {
                      merged[k] = v;
                    }
                  }
                } catch { /* skip */ }
              }

              const renderField = (label: string, value: unknown) => {
                if (!value || (Array.isArray(value) && value.length === 0)) return null;
                const items = Array.isArray(value) ? value : [String(value)];
                return (
                  <div key={label} style={{ marginBottom: 16 }}>
                    <p style={{ fontSize: '0.78rem', color: 'var(--pf-color-text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {label}
                    </p>
                    <div>
                      {items.map((item) => (
                        <span key={String(item)} style={chip}>{String(item)}</span>
                      ))}
                    </div>
                  </div>
                );
              };

              return (
                <div>
                  {renderField('Interests', merged.interests)}
                  {renderField('Values', merged.values)}
                  {renderField('Hard Skills', merged.hardSkills)}
                  {renderField('Soft Skills', merged.softSkills)}
                  {renderField('Working Style', merged.workingStyle)}
                  {renderField('Risk Tolerance', merged.riskTolerance)}
                  {renderField('Geographic Flexibility', merged.geographicFlexibility)}
                  {renderField('Timeline', merged.timelineUrgency)}
                  {Object.keys(merged).length === 0 && (
                    <p style={{ color: 'var(--pf-color-text-muted)', fontSize: '0.88rem' }}>No profile data collected yet.</p>
                  )}
                </div>
              );
            })()
          )}
        </div>
      )}

      {/* Stats tab */}
      {activeTab === 'stats' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {[
            { label: 'Assessments completed', value: completed.length },
            { label: 'Total sessions', value: sessions.length },
            { label: 'Careers saved', value: saved.length },
            { label: 'Avg fit score', value: avgFitScore !== null ? `${avgFitScore}%` : '—' },
          ].map(({ label, value }) => (
            <div key={label} style={{ ...card, textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--pf-color-brand-400)', fontFamily: 'var(--pf-font-family-display)' }}>
                {value}
              </p>
              <p style={{ fontSize: '0.82rem', color: 'var(--pf-color-text-muted)', marginTop: 4 }}>
                {label}
              </p>
            </div>
          ))}

          {tracksExplored.length > 0 && (
            <div style={{ ...card, gridColumn: '1 / -1' }}>
              <p style={{ ...sectionTitle, marginBottom: 10 }}>Tracks explored</p>
              <div>
                {tracksExplored.map((tid) => {
                  const t = tracksMap.get(tid);
                  return (
                    <span key={tid} style={{ ...chip, color: t?.color ?? 'var(--pf-color-brand-500)', borderColor: t?.color ?? 'var(--pf-surface-card-border)' }}>
                      {t?.name ?? tid}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
