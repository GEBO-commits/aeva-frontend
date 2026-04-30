/**
 * ManualSummary.jsx
 *
 * Review all selections with total cost and "Lock In" button.
 */

import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlanStore } from '../../../store/plan.store';
import { PlanBuilderContext } from '../../../contexts/PlanBuilderContext';
import { Button } from '../../../components/ui/Button';
import { Tag } from '../../../components/ui/Tag';
import { ArrowRight, Check } from 'lucide-react';

export default function ManualSummary() {
  const navigate = useNavigate();
  const { eventId } = useContext(PlanBuilderContext);
  const { selectedVenue, selectedCatering, selectedDecorations, selectedPhotographer, selectedDj, selectedVideographer, getTotalCost } = usePlanStore();

  const totalCost = getTotalCost();

  const items = [
    { label: 'Venue', value: selectedVenue, icon: '🏛️' },
    { label: 'Catering', value: selectedCatering, icon: '🍽️' },
    { label: 'Decorations', value: selectedDecorations, icon: '🌸' },
    { label: 'Photography', value: selectedPhotographer, icon: '📸' },
    { label: 'DJ', value: selectedDj, icon: '🎵' },
    { label: 'Videography', value: selectedVideographer, icon: '🎥' },
  ];

  const selectedItems = items.filter(i => i.value);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h2 className="t-display-md" style={{ marginBottom: '12px' }}>
        📋 Your Plan Summary
      </h2>
      <p style={{ fontSize: '16px', color: 'var(--aeva-ink-soft)', marginBottom: '32px' }}>
        Review everything you've selected. Ready to lock it in?
      </p>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {items.map(item => (
          <div
            key={item.label}
            style={{
              background: item.value ? 'var(--aeva-canvas)' : 'var(--aeva-paper-warm)',
              border: item.value ? '2px solid var(--aeva-line)' : '1px dashed var(--aeva-line-strong)',
              borderRadius: 'var(--r-lg)',
              padding: '20px',
              transition: 'all 200ms',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--aeva-ink)' }}>
                {item.label}
              </h3>
              {item.value && <Check size={16} color="var(--aeva-sage)" />}
            </div>

            {item.value ? (
              <>
                <p style={{ fontSize: '15px', fontWeight: 500, color: 'var(--aeva-ink)', marginBottom: '6px' }}>
                  {item.value.name}
                </p>
                <p style={{ fontSize: '12px', color: 'var(--aeva-ink-mute)', marginBottom: '8px' }}>
                  {item.value.description && item.value.description}
                </p>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--aeva-ember)' }}>
                  {item.value.price?.toLocaleString() || item.value.startingPrice?.toLocaleString()} EGP
                </p>
              </>
            ) : (
              <p style={{ fontSize: '13px', color: 'var(--aeva-ink-soft)', fontStyle: 'italic' }}>
                Not selected
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Total cost box */}
      <div style={{ background: 'var(--aeva-ink)', color: 'var(--aeva-paper)', borderRadius: 'var(--r-lg)', padding: '32px', marginBottom: '32px', textAlign: 'center' }}>
        <p className="t-eyebrow" style={{ marginBottom: '12px', color: 'rgba(250,248,245,0.6)' }}>
          Estimated Total
        </p>
        <h2 className="t-display-md" style={{ color: 'var(--aeva-paper)', marginBottom: '8px' }}>
          {totalCost > 0 ? `${totalCost.toLocaleString()} EGP` : 'TBD'}
        </h2>
        {selectedItems.length > 0 && (
          <p style={{ fontSize: '13px', color: 'rgba(250,248,245,0.7)' }}>
            {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
          </p>
        )}
      </div>

      {/* CTA */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <Button
          variant="ghost"
          onClick={() => navigate('/plan/manual/vendors')}
          style={{ color: 'var(--aeva-ink-soft)' }}
        >
          ← Go Back
        </Button>
        <Button
          variant="ember"
          size="lg"
          onClick={() => navigate('/booking/confirm', { state: { eventId } })}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
        >
          Lock In This Plan <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}
