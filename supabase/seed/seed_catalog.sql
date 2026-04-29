-- ============================================================================
-- AEVA Catalog Seed Data — Venues, Vendors, and Availability
-- Idempotent seed script for Egyptian event services
-- ============================================================================

-- Seed date reference: 30 days from today
-- All availability dates computed relative to CURRENT_DATE for portability

-- ============================================================================
-- VENUES (6 total)
-- ============================================================================

INSERT INTO venues (id, name, description, city, address, capacity_min, capacity_max, price_min, price_max, venue_type, rating, image_urls, features, is_active, created_at, updated_at)
VALUES
  -- Cairo Wedding Halls
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Kempinski Hotel Cairo',
   'Five-star luxury ballroom in downtown Cairo with crystal chandeliers and panoramic city views.',
   'Cairo', '107 Kasr El Nile Street, Downtown', 150, 400, 45000, 65000, 'hotel-ballroom', 4.9,
   '["https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800"]',
   '["Valet parking", "In-house catering", "Multiple ballrooms", "Modern A/V", "Bride suite"]', true, now(), now())
  ON CONFLICT (id) DO NOTHING;

INSERT INTO venues (id, name, description, city, address, capacity_min, capacity_max, price_min, price_max, venue_type, rating, image_urls, features, is_active, created_at, updated_at)
VALUES
  ('a1234567-89ab-cdef-0123-456789abcdef', 'Mena House Hotel Ballroom',
   'Historic 5-star resort ballroom in Giza with views of the pyramids and 15 acres of gardens.',
   'Cairo', 'Sharia Al Ahram, Giza', 100, 500, 50000, 75000, 'hotel-ballroom', 4.8,
   '["https://images.unsplash.com/photo-1585074033192-65471ccd2fa3?w=800"]',
   '["Pyramid views", "Garden terraces", "Banquet halls", "Pool access", "Wedding packages"]', true, now(), now())
  ON CONFLICT (id) DO NOTHING;

INSERT INTO venues (id, name, description, city, address, capacity_min, capacity_max, price_min, price_max, venue_type, rating, image_urls, features, is_active, created_at, updated_at)
VALUES
  -- Alexandria Event Spaces
  ('b2345678-90ab-cdef-0123-456789abcde0', 'Alexandria Citadel Events',
   'Modern event space overlooking the Mediterranean with panoramic glass walls.',
   'Alexandria', 'Qaitbay Fort Promenade, Alexandria', 80, 300, 35000, 50000, 'event-hall', 4.7,
   '["https://images.unsplash.com/photo-1562438386-a9d33cb32c4b?w=800"]',
   '["Sea view balcony", "Modern lighting", "Flexible layout", "Professional kitchen", "Rooftop access"]', true, now(), now())
  ON CONFLICT (id) DO NOTHING;

INSERT INTO venues (id, name, description, city, address, capacity_min, capacity_max, price_min, price_max, venue_type, rating, image_urls, features, is_active, created_at, updated_at)
VALUES
  ('c3456789-01ab-cdef-0123-456789abcde1', 'Montaza Palace Events',
   'Luxurious venue within the historic Montaza Palace compound with royal gardens and sea access.',
   'Alexandria', 'Montaza Street, Alexandria', 120, 350, 40000, 60000, 'outdoor-garden', 4.9,
   '["https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800"]',
   '["Palace gardens", "Sea views", "Heritage setting", "Multiple halls", "VIP lounge"]', true, now(), now())
  ON CONFLICT (id) DO NOTHING;

INSERT INTO venues (id, name, description, city, address, capacity_min, capacity_max, price_min, price_max, venue_type, rating, image_urls, features, is_active, created_at, updated_at)
VALUES
  -- Cairo Outdoor/Rooftop
  ('d4567890-12ab-cdef-0123-456789abcde2', 'Cairo Tower Rooftop Garden',
   'Iconic rooftop venue in downtown Cairo with 360-degree city views and the Nile as backdrop.',
   'Cairo', 'Gezira Island, Cairo Tower', 60, 250, 30000, 45000, 'rooftop', 4.8,
   '["https://images.unsplash.com/photo-1467597922519-30dbc3eb580e?w=800"]',
   '["Panoramic views", "Climate controlled", "Elegant setup", "Full bar", "Indoor backup"]', true, now(), now())
  ON CONFLICT (id) DO NOTHING;

INSERT INTO venues (id, name, description, city, address, capacity_min, capacity_max, price_min, price_max, venue_type, rating, image_urls, features, is_active, created_at, updated_at)
VALUES
  ('e5678901-23ab-cdef-0123-456789abcde3', 'Wadi Garden Oasis',
   'Serene desert garden venue in New Cairo with traditional Egyptian landscaping and sunset views.',
   'Cairo', 'Sheikh Zayed City, New Cairo', 50, 200, 25000, 40000, 'outdoor-garden', 4.6,
   '["https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800"]',
   '["Natural gardens", "Sunset views", "Traditional decor", "Tent options", "Bonfire area"]', true, now(), now())
  ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- VENDORS (12 total: 2 per category × 6 categories)
-- ============================================================================

-- Catering
INSERT INTO vendors (id, category, name, description, city, price_min, price_max, rating, image_urls, details, is_active, created_at, updated_at)
VALUES
  ('f6789012-34ab-cdef-0123-456789abcde4', 'catering', 'Gourmet Bites Catering',
   'Award-winning catering house specializing in Egyptian and international fusion cuisine.',
   'Cairo', 15000, 40000, 4.9,
   '["https://images.unsplash.com/photo-1555244162-803834f70033?w=800"]',
   '{"specialties": ["Buffet", "Plated service", "Live stations"], "serves": "50-500 guests", "options": ["Halal certified", "Vegan menu available", "Chef consultation"]}', true, now(), now())
  ON CONFLICT (id) DO NOTHING;

INSERT INTO vendors (id, category, name, description, city, price_min, price_max, rating, image_urls, details, is_active, created_at, updated_at)
VALUES
  ('f6789012-34ab-cdef-0123-456789abcde5', 'catering', 'Taste of Egypt Catering',
   'Specializing in authentic Egyptian cuisine with modern presentation and international options.',
   'Cairo', 12000, 35000, 4.8,
   '["https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800"]',
   '{"specialties": ["Traditional Egyptian", "Mediterranean", "Dessert stations"], "serves": "30-400 guests", "options": ["Family-style", "Cocktail", "Dinner service"]}', true, now(), now())
  ON CONFLICT (id) DO NOTHING;

-- Photography
INSERT INTO vendors (id, category, name, description, city, price_min, price_max, rating, image_urls, details, is_active, created_at, updated_at)
VALUES
  ('f6789012-34ab-cdef-0123-456789abcde6', 'photography', 'Capture Moments Photography',
   'Professional wedding photography with cinematic style and 15 years of Egyptian events experience.',
   'Cairo', 10000, 25000, 4.9,
   '["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"]',
   '{"packages": ["Full day", "Ceremony only", "Reception"], "deliverables": ["500+ edited photos", "USB + cloud", "Video highlights"], "style": "Candid + Posed"}', true, now(), now())
  ON CONFLICT (id) DO NOTHING;

INSERT INTO vendors (id, category, name, description, city, price_min, price_max, rating, image_urls, details, is_active, created_at, updated_at)
VALUES
  ('f6789012-34ab-cdef-0123-456789abcde7', 'photography', 'Cairo Photo Studio Pro',
   'High-end wedding photography with drone coverage and same-day edit videos for receptions.',
   'Cairo', 12000, 30000, 4.8,
   '["https://images.unsplash.com/photo-1611695434859-6c3be7b2da3e?w=800"]',
   '{"packages": ["Premium", "Standard", "Engagement"], "deliverables": ["600+ photos", "Drone footage", "Highlight reel"], "style": "Photojournalistic"}', true, now(), now())
  ON CONFLICT (id) DO NOTHING;

-- DJ
INSERT INTO vendors (id, category, name, description, city, price_min, price_max, rating, image_urls, details, is_active, created_at, updated_at)
VALUES
  ('f6789012-34ab-cdef-0123-456789abcde8', 'dj', 'DJ Pulse Cairo',
   'Top-rated DJ for Egyptian weddings with custom track selection and bilingual MC services.',
   'Cairo', 4000, 10000, 4.8,
   '["https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800"]',
   '{"equipment": ["Professional sound system", "Lighting rig", "Wireless microphones"], "services": ["MC services", "Bilingual", "Live requests"], "experience": "12+ years"}', true, now(), now())
  ON CONFLICT (id) DO NOTHING;

INSERT INTO vendors (id, category, name, description, city, price_min, price_max, rating, image_urls, details, is_active, created_at, updated_at)
VALUES
  ('f6789012-34ab-cdef-0123-456789abcde9', 'dj', 'Sound Masters Alexandria',
   'Premium DJ service based in Alexandria specializing in wedding entertainment and crowd engagement.',
   'Alexandria', 5000, 12000, 4.7,
   '["https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=800"]',
   '{"equipment": ["Custom sound design", "LED setup", "Backup power"], "services": ["Live transitions", "Custom mixes", "Request taking"], "experience": "10+ years"}', true, now(), now())
  ON CONFLICT (id) DO NOTHING;

-- Decorations
INSERT INTO vendors (id, category, name, description, city, price_min, price_max, rating, image_urls, details, is_active, created_at, updated_at)
VALUES
  ('f6789012-34ab-cdef-0123-456789abcdea', 'decorations', 'Lumina Event Design',
   'Full-service event design creating custom themes with floral installations and lighting design.',
   'Cairo', 12000, 35000, 4.9,
   '["https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800"]',
   '{"services": ["Theme design", "Floral", "Lighting", "Setup"], "styles": ["Modern", "Classic", "Bohemian"], "includes": ["Site visit", " 3D mockup", "Custom elements"]}', true, now(), now())
  ON CONFLICT (id) DO NOTHING;

INSERT INTO vendors (id, category, name, description, city, price_min, price_max, rating, image_urls, details, is_active, created_at, updated_at)
VALUES
  ('f6789012-34ab-cdef-0123-456789abcdeb', 'decorations', 'Royal Decor Studio',
   'Elegant decorative services with emphasis on traditional Egyptian and modern fusion design.',
   'Cairo', 10000, 30000, 4.8,
   '["https://images.unsplash.com/photo-1470229722259-85db47c1f2ad?w=800"]',
   '{"services": ["Full decoration", "Rentals", "Custom builds", "Installation"], "styles": ["Luxury", "Traditional", "Minimalist"], "includes": ["Consultation", "Timeline", "Coordination"]}', true, now(), now())
  ON CONFLICT (id) DO NOTHING;

-- Videography
INSERT INTO vendors (id, category, name, description, city, price_min, price_max, rating, image_urls, details, is_active, created_at, updated_at)
VALUES
  ('f6789012-34ab-cdef-0123-456789abcdec', 'videography', 'Cinematic Dreams Films',
   'Award-winning videography producing cinematic wedding films with color grading and music.',
   'Cairo', 12000, 30000, 4.9,
   '["https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800"]',
   '{"packages": ["Full edit", "Short film", "Highlights"], "deliverables": ["4K video", "Edited within 4 weeks", "Drone footage"], "style": "Cinematic narrative"}', true, now(), now())
  ON CONFLICT (id) DO NOTHING;

INSERT INTO vendors (id, category, name, description, city, price_min, price_max, rating, image_urls, details, is_active, created_at, updated_at)
VALUES
  ('f6789012-34ab-cdef-0123-456789abcded', 'videography', 'Alexandria Motion Pictures',
   'Professional video production with multi-camera setup and live streaming capabilities.',
   'Alexandria', 10000, 25000, 4.7,
   '["https://images.unsplash.com/photo-1533286081218-c0e7b837faab?w=800"]',
   '{"packages": ["Complete edit", "Highlights only", "Live stream"], "deliverables": ["2K+ video", "Same-day highlights", "USB + online"], "style": "Documentary-style"}', true, now(), now())
  ON CONFLICT (id) DO NOTHING;

-- Makeup
INSERT INTO vendors (id, category, name, description, city, price_min, price_max, rating, image_urls, details, is_active, created_at, updated_at)
VALUES
  ('f6789012-34ab-cdef-0123-456789abcdee', 'makeup', 'Radiance Bridal Makeup',
   'Specialist bridal makeup and hair services with traditional and modern styling expertise.',
   'Cairo', 2000, 6000, 4.9,
   '["https://images.unsplash.com/photo-1487412912498-11d2fcc4c5f8?w=800"]',
   '{"services": ["Bridal makeup", "Hair", "Trial sessions", "Bridesmaids"], "coverage": ["Makeup test", "Professional blending", "Long-wear techniques"], "products": ["Premium brands", "Hypoallergenic options"]}', true, now(), now())
  ON CONFLICT (id) DO NOTHING;

INSERT INTO vendors (id, category, name, description, city, price_min, price_max, rating, image_urls, details, is_active, created_at, updated_at)
VALUES
  ('f6789012-34ab-cdef-0123-456789abcdef', 'makeup', 'Cairo Beauty Atelier',
   'Professional makeup artistry and bridal styling with experience in traditional and contemporary looks.',
   'Cairo', 1800, 5500, 4.8,
   '["https://images.unsplash.com/photo-1559599810-46d1c38aa048?w=800"]',
   '{"services": ["Bridal glam", "Groom styling", "Touch-up kit", "Party makeup"], "expertise": ["Egyptian traditions", "HD makeup", "Video-ready finishes"], "team": "Flexible group rates"}', true, now(), now())
  ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- VENUE AVAILABILITY (6 venues × 8 dates = 48 records)
-- ============================================================================

-- Availability dates: CURRENT_DATE + 30, 37, 44, 51, 58, 65, 72, 79 days
INSERT INTO venue_availability (id, venue_id, available_date, status)
SELECT
  gen_random_uuid(),
  venue_id,
  available_date,
  'available'
FROM (
  SELECT
    v.id as venue_id,
    CURRENT_DATE + (interval '1 day' * interval_days) as available_date
  FROM venues v,
  (VALUES (30), (37), (44), (51), (58), (65), (72), (79)) as t(interval_days)
  WHERE v.is_active = true
) tmp
ON CONFLICT (venue_id, available_date) DO NOTHING;

-- ============================================================================
-- VENDOR AVAILABILITY (12 vendors × 8 dates = 96 records)
-- ============================================================================

INSERT INTO vendor_availability (id, vendor_id, available_date, status)
SELECT
  gen_random_uuid(),
  vendor_id,
  available_date,
  'available'
FROM (
  SELECT
    v.id as vendor_id,
    CURRENT_DATE + (interval '1 day' * interval_days) as available_date
  FROM vendors v,
  (VALUES (30), (37), (44), (51), (58), (65), (72), (79)) as t(interval_days)
  WHERE v.is_active = true
) tmp
ON CONFLICT (vendor_id, available_date) DO NOTHING;

-- ============================================================================
-- Summary
-- ============================================================================
-- Inserted: 6 venues, 12 vendors, 48 venue availability records, 96 vendor availability records
-- Total: 162 records seeded
-- All dates computed relative to CURRENT_DATE for portability
-- All records idempotent via ON CONFLICT DO NOTHING
