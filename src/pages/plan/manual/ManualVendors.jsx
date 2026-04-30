/**
 * ManualVendors.jsx
 *
 * Vendors step (Photography, DJ, Videography all in one view).
 * Shows multiple vendor categories but allows one selection per category.
 */

import React, { useState, useEffect, useContext } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getVendors } from '../../../services/catalogService';
import { usePlanStore } from '../../../store/plan.store';
import { PlanBuilderContext } from '../../../contexts/PlanBuilderContext';
import { saveEventSelection } from '../../../services/planningService';
import { Check, DollarSign } from 'lucide-react';
import { Tag } from '../../../components/ui/Tag';

const VENDOR_CATEGORIES = [
  { category: 'photography', label: 'Photography', icon: '📸', storeKey: 'selectedPhotographer', setFn: 'setPhotographer', eventType: 'photographer' },
  { category: 'dj', label: 'DJ', icon: '🎵', storeKey: 'selectedDj', setFn: 'setDj', eventType: 'dj' },
  { category: 'videography', label: 'Videography', icon: '🎥', storeKey: 'selectedVideographer', setFn: 'setVideographer', eventType: 'videographer' },
];

function VendorCategorySection({ category, label, icon, storeKey, setFn, eventType }) {
  const store = usePlanStore();
  const selected = store[storeKey];
  const setSel = store[setFn];

  const { eventId } = useContext(PlanBuilderContext);
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetch = async () => {
      setIsLoading(true);
      const { data, error } = await getVendors(category);
      if (!cancelled) {
        setIsLoading(false);
        if (!error) {
          const mapped = (data || []).map(v => ({
            id: v.id,
            name: v.name,
            price: v.price || 0,
            description: v.description,
            image: Array.isArray(v.image_urls)
              ? v.image_urls[0]
              : (JSON.parse(v.image_urls || '[]')[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800'),
            rating: v.rating || 0,
            features: Array.isArray(v.features) ? v.features : (JSON.parse(v.features || '[]') || []),
          }));
          setVendors(mapped);
        }
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, [category]);

  const handleSelect = async (vendor) => {
    const isSelected = selected?.id === vendor.id;
    setSel(isSelected ? null : vendor);

    if (!isSelected && vendor && eventId) {
      const { error } = await saveEventSelection(eventId, eventType, vendor.id);
      if (error) {
        console.error(`[ManualVendors] Failed to save ${eventType}:`, error);
      }
    }
  };

  return (
    <div style={{ marginBottom: '48px' }}>
      <h3 className="t-display-sm" style={{ marginBottom: '12px' }}>
        {icon} {label}
      </h3>

      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
          {[1, 2, 3].map(i => (
            <div
              key={i}
              style={{
                background: 'var(--aeva-canvas)',
                border: '1px solid var(--aeva-line)',
                borderRadius: 'var(--r-lg)',
                height: '240px',
                animation: 'pulse 2s infinite',
                opacity: 0.6,
              }}
            />
          ))}
        </div>
      ) : vendors.length === 0 ? (
        <p style={{ color: 'var(--aeva-ink-mute)', fontSize: '14px' }}>No {label.toLowerCase()} options available</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
          {vendors.map((vendor, i) => {
            const isSelected = selected?.id === vendor.id;
            return (
              <motion.div
                key={vendor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => handleSelect(vendor)}
                style={{
                  position: 'relative',
                  background: 'var(--aeva-canvas)',
                  borderRadius: 'var(--r-lg)',
                  overflow: 'hidden',
                  border: isSelected ? '2px solid var(--aeva-ink)' : '1px solid var(--aeva-line)',
                  cursor: 'pointer',
                  transition: 'all 200ms',
                  boxShadow: isSelected ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = isSelected ? 'var(--shadow-lg)' : 'var(--shadow-sm)';
                }}
              >
                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      zIndex: 10,
                      width: '32px',
                      height: '32px',
                      background: 'var(--aeva-ink)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 'var(--shadow-md)',
                    }}
                  >
                    <Check size={16} color="var(--aeva-paper)" />
                  </div>
                )}

                <img src={vendor.image} alt={vendor.name} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />

                <div style={{ padding: '12px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--aeva-ink)', marginBottom: '4px' }}>
                    {vendor.name}
                  </h4>

                  {vendor.description && (
                    <p style={{ fontSize: '11px', color: 'var(--aeva-ink-soft)', marginBottom: '8px', lineHeight: 1.3 }}>
                      {vendor.description}
                    </p>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', paddingTop: '8px', borderTop: '1px solid var(--aeva-line)' }}>
                    <DollarSign size={12} color="var(--aeva-ink-mute)" />
                    <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--aeva-ink)' }}>
                      {vendor.price?.toLocaleString()} EGP
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ManualVendors() {
  return (
    <div>
      <h2 className="t-display-md" style={{ marginBottom: '12px' }}>
        🎬 Select Vendors
      </h2>
      <p style={{ fontSize: '16px', color: 'var(--aeva-ink-soft)', marginBottom: '32px' }}>
        Add photography, DJ, and videography services (all optional).
      </p>

      {VENDOR_CATEGORIES.map(cat => (
        <VendorCategorySection
          key={cat.category}
          category={cat.category}
          label={cat.label}
          icon={cat.icon}
          storeKey={cat.storeKey}
          setFn={cat.setFn}
          eventType={cat.eventType}
        />
      ))}
    </div>
  );
}
