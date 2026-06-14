import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, useReducedMotion } from 'framer-motion';
import { LayoutGrid, Columns, X, Plus } from 'lucide-react';
import { getTracks } from '@/lib/api';
import type { SponsorTrack, CareerRecommendation } from '@/schemas/career';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

type ItemType = 'track' | 'career';

interface CompareItem {
  key: string;
  type: ItemType;
  label: string;
  data: SponsorTrack | CareerRecommendation;
  sessionId?: string;
}

type Layout = 'horizontal' | 'grid';

const MAX_ITEMS = 6;

function encodeItems(items: CompareItem[]): string {
  return items
    .map((i) => (i.type === 'track' ? `t:${i.key}` : `c:${i.label}@${i.sessionId}`))
    .join(',');
}

function FitBar({ score }: { score: number }) {
  const color = score >= 80 ? 'var(--pf-color-success-500)' : score >= 60 ? 'var(--pf-color-brand-500)' : 'var(--pf-color-warning-500)';
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--pf-color-text-muted)', marginBottom: 4 }}>
        <span>Fit score</span><span style={{ color, fontWeight: 600 }}>{score}%</span>
      </div>
      <div style={{ height: 5, background: 'var(--pf-color-bg-subtle)', borderRadius: 3 }}>
        <div style={{ width: `${score}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.4s ease' }} />
      </div>
    </div>
  );
}

function TrackCard({ track }: { track: SponsorTrack }) {
  return (
    <div>
      <p style={{ fontSize: '0.75rem', color: 'var(--pf-color-text-muted)', marginBottom: 4 }}>Sponsor</p>
      <p style={{ fontSize: '0.88rem', marginBottom: 12 }}>{track.sponsor}</p>
      <p style={{ fontSize: '0.75rem', color: 'var(--pf-color-text-muted)', marginBottom: 4 }}>Description</p>
      <p style={{ fontSize: '0.88rem', lineHeight: 1.5, marginBottom: 12 }}>{track.description}</p>
      {track.tags && track.tags.length > 0 && (
        <>
          <p style={{ fontSize: '0.75rem', color: 'var(--pf-color-text-muted)', marginBottom: 6 }}>Tags</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {track.tags.map((tag) => (
              <span key={tag} style={{ padding: '2px 8px', background: 'var(--pf-chip-bg)', border: '1px solid var(--pf-chip-border)', borderRadius: 'var(--pf-radius-pill)', fontSize: '0.72rem' }}>
                {tag}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function CareerCard({ rec }: { rec: CareerRecommendation }) {
  return (
    <div>
      <FitBar score={rec.fitScore} />
      <div style={{ marginTop: 12 }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--pf-color-text-muted)', marginBottom: 4 }}>Summary</p>
        <p style={{ fontSize: '0.85rem', lineHeight: 1.5, marginBottom: 12 }}>{rec.summary}</p>
      </div>
      {rec.salaryRange && (
        <div style={{ marginBottom: 12 }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--pf-color-text-muted)', marginBottom: 4 }}>Salary range</p>
          <p style={{ fontSize: '0.88rem', fontWeight: 600 }}>
            ${rec.salaryRange.low.toLocaleString()} – ${rec.salaryRange.high.toLocaleString()}
          </p>
        </div>
      )}
      <div style={{ marginBottom: 12 }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--pf-color-text-muted)', marginBottom: 6 }}>Why it fits</p>
        <ul style={{ paddingLeft: 16, margin: 0 }}>
          {rec.reasons.map((r, i) => (
            <li key={i} style={{ fontSize: '0.82rem', marginBottom: 4, lineHeight: 1.4 }}>{r}</li>
          ))}
        </ul>
      </div>
      <div style={{ marginBottom: 12 }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--pf-color-text-muted)', marginBottom: 6 }}>Concerns</p>
        <ul style={{ paddingLeft: 16, margin: 0 }}>
          {rec.concerns.map((c, i) => (
            <li key={i} style={{ fontSize: '0.82rem', marginBottom: 4, lineHeight: 1.4 }}>{c}</li>
          ))}
        </ul>
      </div>
      <div>
        <p style={{ fontSize: '0.75rem', color: 'var(--pf-color-text-muted)', marginBottom: 6 }}>Next steps</p>
        <ul style={{ paddingLeft: 16, margin: 0 }}>
          {rec.nextSteps.map((ns, i) => (
            <li key={i} style={{ fontSize: '0.82rem', marginBottom: 4, lineHeight: 1.4 }}>{ns}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Compare() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<CompareItem[]>([]);
  const [layout, setLayout] = useState<Layout>('horizontal');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerQuery, setPickerQuery] = useState('');
  const reduceMotion = useReducedMotion();

  const { data: tracks = [] } = useQuery({ queryKey: ['tracks'], queryFn: getTracks });

  const { data: sessionsData } = useQuery({
    queryKey: ['sessions', 'me'],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/sessions?userId=me`, { credentials: 'include' });
      if (!res.ok) return { sessions: [] };
      return res.json();
    },
  });

  const completedSessions: { id: string; trackId: string | null }[] =
    (sessionsData?.sessions ?? []).filter((s: { status: string }) => s.status === 'complete');

  const recsQueries = useQuery({
    queryKey: ['compare-recs', completedSessions.map((s) => s.id)],
    queryFn: async () => {
      const results: Record<string, CareerRecommendation[]> = {};
      await Promise.all(
        completedSessions.map(async (s) => {
          const res = await fetch(`${BASE_URL}/sessions/${s.id}/recommendations`);
          if (res.ok) {
            const data = await res.json();
            results[s.id] = data.recommendations ?? [];
          }
        }),
      );
      return results;
    },
    enabled: completedSessions.length > 0,
  });

  const allRecs = recsQueries.data ?? {};

  useEffect(() => {
    const param = searchParams.get('items');
    if (!param || tracks.length === 0) return;
    const restored: CompareItem[] = [];
    for (const part of param.split(',')) {
      if (part.startsWith('t:')) {
        const id = part.slice(2);
        const track = tracks.find((t) => t.id === id);
        if (track) restored.push({ key: `t:${id}`, type: 'track', label: track.name, data: track });
      } else if (part.startsWith('c:')) {
        const [label, sessionId] = part.slice(2).split('@');
        const recs = allRecs[sessionId] ?? [];
        const rec = recs.find((r) => r.title === label);
        if (rec) restored.push({ key: `c:${label}@${sessionId}`, type: 'career', label, data: rec, sessionId });
      }
    }
    if (restored.length > 0) setItems(restored);
  }, [tracks, allRecs]);

  function addItem(item: CompareItem) {
    if (items.length >= MAX_ITEMS) return;
    if (items.find((i) => i.key === item.key)) return;
    const next = [...items, item];
    setItems(next);
    setSearchParams({ items: encodeItems(next) }, { replace: true });
    setPickerOpen(false);
    setPickerQuery('');
  }

  function removeItem(key: string) {
    const next = items.filter((i) => i.key !== key);
    setItems(next);
    setSearchParams(next.length ? { items: encodeItems(next) } : {}, { replace: true });
  }

  const pickerOptions: CompareItem[] = [
    ...tracks
      .filter((t) => !items.find((i) => i.key === `t:${t.id}`))
      .filter((t) => !pickerQuery || t.name.toLowerCase().includes(pickerQuery.toLowerCase()))
      .map((t): CompareItem => ({ key: `t:${t.id}`, type: 'track', label: t.name, data: t })),
    ...Object.entries(allRecs).flatMap(([sid, recs]) =>
      recs
        .filter((r) => !items.find((i) => i.key === `c:${r.title}@${sid}`))
        .filter((r) => !pickerQuery || r.title.toLowerCase().includes(pickerQuery.toLowerCase()))
        .map((r): CompareItem => ({ key: `c:${r.title}@${sid}`, type: 'career', label: r.title, data: r, sessionId: sid })),
    ),
  ];

  const colWidth = layout === 'horizontal' ? `${Math.max(240, Math.floor(860 / items.length))}px` : undefined;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={reduceMotion ? undefined : { duration: 0.28, ease: 'easeOut' }}
      style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Compare</h1>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={() => setLayout('horizontal')}
            title="Horizontal layout"
            style={{ padding: 8, background: layout === 'horizontal' ? 'var(--pf-chip-selected-bg)' : 'none', border: `1px solid ${layout === 'horizontal' ? 'var(--pf-color-brand-500)' : 'var(--pf-surface-card-border)'}`, borderRadius: 'var(--pf-radius-sm)', cursor: 'pointer', color: layout === 'horizontal' ? 'var(--pf-color-brand-400)' : 'var(--pf-color-text-muted)', display: 'flex', alignItems: 'center' }}
          >
            <Columns size={15} />
          </button>
          <button
            onClick={() => setLayout('grid')}
            title="Grid layout"
            style={{ padding: 8, background: layout === 'grid' ? 'var(--pf-chip-selected-bg)' : 'none', border: `1px solid ${layout === 'grid' ? 'var(--pf-color-brand-500)' : 'var(--pf-surface-card-border)'}`, borderRadius: 'var(--pf-radius-sm)', cursor: 'pointer', color: layout === 'grid' ? 'var(--pf-color-brand-400)' : 'var(--pf-color-text-muted)', display: 'flex', alignItems: 'center' }}
          >
            <LayoutGrid size={15} />
          </button>
          {items.length < MAX_ITEMS && (
            <button
              onClick={() => setPickerOpen((p) => !p)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: 'var(--pf-btn-primary-bg)', color: 'var(--pf-btn-primary-text)', border: 'none', borderRadius: 'var(--pf-radius-sm)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
            >
              <Plus size={14} /> Add item
            </button>
          )}
        </div>
      </div>

      {/* Picker dropdown */}
      {pickerOpen && (
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <div style={{ background: 'var(--pf-surface-card-bg)', border: '1px solid var(--pf-surface-card-border)', borderRadius: 'var(--pf-radius-md)', padding: 16, maxHeight: 320, overflowY: 'auto' }}>
            <input
              autoFocus
              placeholder="Search tracks or careers…"
              value={pickerQuery}
              onChange={(e) => setPickerQuery(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', background: 'var(--pf-color-bg-subtle)', border: '1px solid var(--pf-surface-card-border)', borderRadius: 'var(--pf-radius-sm)', color: 'var(--pf-color-text-primary)', fontSize: '0.88rem', marginBottom: 10, boxSizing: 'border-box' }}
            />
            {pickerOptions.length === 0 && (
              <p style={{ color: 'var(--pf-color-text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '12px 0' }}>No options available</p>
            )}
            {pickerOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => addItem(opt)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '9px 12px', background: 'none', border: 'none', borderRadius: 'var(--pf-radius-sm)', cursor: 'pointer', textAlign: 'left', color: 'var(--pf-color-text-primary)', fontSize: '0.88rem' }}
              >
                <span style={{ fontSize: '0.68rem', padding: '1px 7px', border: '1px solid var(--pf-surface-card-border)', borderRadius: 'var(--pf-radius-pill)', color: 'var(--pf-color-text-muted)', flexShrink: 0 }}>
                  {opt.type === 'track' ? 'Track' : 'Career'}
                </span>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {items.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', border: '1px dashed var(--pf-surface-card-border)', borderRadius: 'var(--pf-radius-md)', color: 'var(--pf-color-text-muted)' }}>
          <p style={{ fontWeight: 600, marginBottom: 8 }}>Nothing to compare yet</p>
          <p style={{ fontSize: '0.88rem', marginBottom: 20 }}>Add 2 or more tracks or career recommendations to compare them.</p>
          <button
            onClick={() => setPickerOpen(true)}
            style={{ padding: '9px 22px', background: 'var(--pf-btn-primary-bg)', color: 'var(--pf-btn-primary-text)', border: 'none', borderRadius: 'var(--pf-radius-sm)', fontWeight: 600, cursor: 'pointer' }}
          >
            Add item
          </button>
        </div>
      )}

      {/* Comparison view */}
      {items.length > 0 && (
        <div
          style={
            layout === 'horizontal'
              ? { display: 'flex', gap: 14, overflowX: 'auto', alignItems: 'flex-start', paddingBottom: 8 }
              : { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }
          }
        >
          {items.map((item) => (
            <motion.div
              key={item.key}
              layout
              initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
              animate={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                flexShrink: 0,
                width: layout === 'horizontal' ? colWidth : undefined,
                background: 'var(--pf-surface-card-bg)',
                border: '1px solid var(--pf-surface-card-border)',
                borderRadius: 'var(--pf-radius-md)',
                padding: '20px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <span style={{ fontSize: '0.68rem', padding: '1px 7px', border: '1px solid var(--pf-surface-card-border)', borderRadius: 'var(--pf-radius-pill)', color: 'var(--pf-color-text-muted)', display: 'inline-block', marginBottom: 4 }}>
                    {item.type === 'track' ? 'Track' : 'Career'}
                  </span>
                  <p style={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.3 }}>{item.label}</p>
                </div>
                <button
                  onClick={() => removeItem(item.key)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pf-color-text-muted)', padding: 4, flexShrink: 0 }}
                  aria-label={`Remove ${item.label}`}
                >
                  <X size={14} />
                </button>
              </div>

              {item.type === 'track'
                ? <TrackCard track={item.data as SponsorTrack} />
                : <CareerCard rec={item.data as CareerRecommendation} />
              }
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
