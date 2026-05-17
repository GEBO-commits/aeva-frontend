-- ============================================================================
-- AEVA Catalog Seed Data — Venues, Vendors, and Availability
-- Egyptian Market Data with Realistic Pricing
-- ============================================================================

-- ============================================================================
-- VENUES (10 total) - Egyptian Market Prices
-- ============================================================================

INSERT INTO venues (id, name, description, city, address, capacity_min, capacity_max, price_min, price_max, venue_type, rating, image_urls, features, is_active, created_at, updated_at)
VALUES
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Kempinski Hotel Cairo',
   'Five-star luxury ballroom in downtown Cairo with crystal chandeliers and panoramic Nile views.',
   'Cairo', '107 Kasr El Nile Street, Downtown', 150, 400, 35000, 55000, 'hotel-ballroom', 4.9,
   '["https://images.pexels.com/photos/3587620/pexels-photo-3587620.jpeg?w=800"]',
   '["Valet parking", "In-house catering", "Multiple ballrooms", "Modern A/V", "Bride suite"]', true, now(), now()),
  ('a1234567-89ab-cdef-0123-456789abcdef', 'Mena House Hotel Ballroom',
   'Historic 5-star resort in Giza with pyramid views and 15 acres of gardens.',
   'Cairo', 'Sharia Al Ahram, Giza', 100, 500, 40000, 65000, 'hotel-ballroom', 4.8,
   '["https://images.pexels.com/photos/1126729/pexels-photo-1126729.jpeg?w=800"]',
   '["Pyramid views", "Garden terraces", "Banquet halls", "Pool access", "Wedding packages"]', true, now(), now()),
  ('b2345678-90ab-cdef-0123-456789abcde0', 'Alexandria Citadel Events',
   'Modern event space overlooking the Mediterranean with panoramic views.',
   'Alexandria', 'Qaitbay Fort Promenade, Alexandria', 80, 300, 20000, 35000, 'event-hall', 4.7,
   '["https://images.pexels.com/photos/1797428/pexels-photo-1797428.jpeg?w=800"]',
   '["Sea view balcony", "Modern lighting", "Flexible layout", "Professional kitchen", "Rooftop access"]', true, now(), now()),
  ('c3456789-01ab-cdef-0123-456789abcde1', 'Montaza Palace Events',
   'Luxurious venue in historic Montaza Palace with royal gardens and sea access.',
   'Alexandria', 'Montaza Street, Alexandria', 120, 350, 30000, 50000, 'outdoor-garden', 4.9,
   '["https://images.pexels.com/photos/1437037/pexels-photo-1437037.jpeg?w=800"]',
   '["Palace gardens", "Sea views", "Heritage setting", "Multiple halls", "VIP lounge"]', true, now(), now()),
  ('d4567890-12ab-cdef-0123-456789abcde2', 'Cairo Tower Rooftop Garden',
   'Iconic rooftop venue in downtown Cairo with 360-degree city and Nile views.',
   'Cairo', 'Gezira Island, Cairo Tower', 60, 250, 22000, 35000, 'rooftop', 4.8,
   '["https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?w=800"]',
   '["Panoramic views", "Climate controlled", "Elegant setup", "Full bar", "Indoor backup"]', true, now(), now()),
  ('e5678901-23ab-cdef-0123-456789abcde3', 'Wadi Garden Oasis',
   'Serene desert garden venue in New Cairo with traditional Egyptian landscaping.',
   'Cairo', 'Sheikh Zayed City, New Cairo', 50, 200, 15000, 28000, 'outdoor-garden', 4.6,
   '["https://images.pexels.com/photos/3763418/pexels-photo-3763418.jpeg?w=800"]',
   '["Natural gardens", "Sunset views", "Traditional decor", "Tent options", "Bonfire area"]', true, now(), now()),
  ('f6789012-34ab-cdef-0123-456789abcdff', 'Grand Hilton Cairo',
   'Elegant 5-star ballroom with stunning Nile-side location and modern amenities.',
   'Cairo', 'Nile Corniche, Maadi', 100, 350, 32000, 52000, 'hotel-ballroom', 4.8,
   '["https://images.pexels.com/photos/3571215/pexels-photo-3571215.jpeg?w=800"]',
   '["Nile views", "Modern decor", "Flexible spaces", "Premium service", "Parking included"]', true, now(), now()),
  ('g7890123-45ab-cdef-0123-456789abce00', 'Zamalek Manor Events',
   'Boutique luxury venue on Zamalek Island with exclusive atmosphere.',
   'Cairo', 'Zamalek Island, Cairo', 60, 200, 28000, 45000, 'boutique-hall', 4.9,
   '["https://images.pexels.com/photos/3535383/pexels-photo-3535383.jpeg?w=800"]',
   '["Island location", "Intimate setting", "Premium decor", "Private entrance", "VIP lounge"]', true, now(), now()),
  ('h8901234-56ab-cdef-0123-456789abce01', 'Desert Rose Garden Cairo',
   'Stunning garden venue in New Cairo with modern Egyptian design.',
   'Cairo', 'Fifth Settlement, New Cairo', 80, 250, 18000, 32000, 'outdoor-garden', 4.7,
   '["https://images.pexels.com/photos/3721033/pexels-photo-3721033.jpeg?w=800"]',
   '["Beautiful gardens", "Outdoor ceremony", "Modern facilities", "Catering kitchen", "Plenty parking"]', true, now(), now()),
  ('i9012345-67ab-cdef-0123-456789abce02', 'Heliopolis Club Events',
   'Elegant club in Heliopolis with classic architectural charm.',
   'Cairo', 'Heliopolis, Cairo', 100, 300, 20000, 38000, 'club-house', 4.8,
   '["https://images.pexels.com/photos/3763427/pexels-photo-3763427.jpeg?w=800"]',
   '["Classic elegance", "Multiple halls", "Fine dining", "Member exclusive", "Professional staff"]', true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- VENDORS (20 total) - Egyptian Market Pricing
-- ============================================================================

-- Catering (4 vendors)
INSERT INTO vendors (id, category, name, description, city, price_min, price_max, rating, image_urls, details, is_active, created_at, updated_at)
VALUES
  ('f6789012-34ab-cdef-0123-456789abcde4', 'catering', 'Gourmet Bites Catering',
   'Award-winning catering specializing in Egyptian and international fusion cuisine.',
   'Cairo', 800, 2200, 4.9,
   '["https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?w=800"]',
   '{"specialties": ["Buffet", "Plated service", "Live stations"], "serves": "50-500 guests", "per_person": "800-2200 EGP"}', true, now(), now()),
  ('f6789012-34ab-cdef-0123-456789abcde5', 'catering', 'Taste of Egypt Catering',
   'Authentic Egyptian cuisine with modern presentation and international options.',
   'Cairo', 600, 1800, 4.8,
   '["https://images.pexels.com/photos/821365/pexels-photo-821365.jpeg?w=800"]',
   '{"specialties": ["Traditional Egyptian", "Mediterranean", "Dessert stations"], "serves": "30-400 guests", "per_person": "600-1800 EGP"}', true, now(), now()),
  ('f6789012-34ab-cdef-0123-456789abcde6', 'catering', 'Cairo Culinary Kitchen',
   'Modern Egyptian cuisine with international fusion and premium service.',
   'Cairo', 900, 2500, 4.9,
   '["https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?w=800"]',
   '{"specialties": ["Modern Egyptian", "International", "Live cooking"], "serves": "100-600 guests", "per_person": "900-2500 EGP"}', true, now(), now()),
  ('f6789012-34ab-cdef-0123-456789abcde7', 'catering', 'Alexandria Seafood Catering',
   'Specialty seafood catering with Mediterranean and Egyptian flavors.',
   'Alexandria', 700, 2000, 4.7,
   '["https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?w=800"]',
   '{"specialties": ["Seafood", "Mediterranean", "Fresh daily"], "serves": "50-400 guests", "per_person": "700-2000 EGP"}', true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Photography (4 vendors)
INSERT INTO vendors (id, category, name, description, city, price_min, price_max, rating, image_urls, details, is_active, created_at, updated_at)
VALUES
  ('f6789012-34ab-cdef-0123-456789abcde8', 'photography', 'Capture Moments Photography',
   'Professional wedding photography with cinematic style and 15 years of Egyptian events experience.',
   'Cairo', 8000, 20000, 4.9,
   '["https://images.pexels.com/photos/1346435/pexels-photo-1346435.jpeg?w=800"]',
   '{"packages": ["Full day", "Ceremony only", "Reception"], "deliverables": ["500+ edited photos", "USB + cloud", "Video highlights"]}', true, now(), now()),
  ('f6789012-34ab-cdef-0123-456789abcde9', 'photography', 'Cairo Photo Studio Pro',
   'High-end wedding photography with drone coverage and same-day edit videos.',
   'Cairo', 10000, 25000, 4.8,
   '["https://images.pexels.com/photos/1050373/pexels-photo-1050373.jpeg?w=800"]',
   '{"packages": ["Premium", "Standard", "Engagement"], "deliverables": ["600+ photos", "Drone footage", "Highlight reel"]}', true, now(), now()),
  ('f6789012-34ab-cdef-0123-456789abcdea', 'photography', 'Alexandria Photography Studio',
   'Specialized in wedding and event photography along the Mediterranean coast.',
   'Alexandria', 7000, 18000, 4.7,
   '["https://images.pexels.com/photos/3466996/pexels-photo-3466996.jpeg?w=800"]',
   '{"packages": ["Full day", "Half day"], "deliverables": ["400+ photos", "Edited USB", "Online gallery"]}', true, now(), now()),
  ('f6789012-34ab-cdef-0123-456789abcdeb', 'photography', 'Elite Wedding Photography',
   'Premium photography with artistic direction and traditional Egyptian aesthetics.',
   'Cairo', 9000, 22000, 4.8,
   '["https://images.pexels.com/photos/926062/pexels-photo-926062.jpeg?w=800"]',
   '{"packages": ["Luxury", "Premium", "Standard"], "deliverables": ["Unlimited photos", "Video highlights", "Digital album"]}', true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- DJ (4 vendors)
INSERT INTO vendors (id, category, name, description, city, price_min, price_max, rating, image_urls, details, is_active, created_at, updated_at)
VALUES
  ('f6789012-34ab-cdef-0123-456789abcdec', 'dj', 'DJ Pulse Cairo',
   'Top-rated DJ for Egyptian weddings with custom track selection and bilingual MC services.',
   'Cairo', 3000, 8000, 4.8,
   '["https://images.pexels.com/photos/3556088/pexels-photo-3556088.jpeg?w=800"]',
   '{"equipment": ["Professional sound system", "Lighting rig", "Wireless mics"], "services": ["MC services", "Bilingual", "Live requests"]}', true, now(), now()),
  ('f6789012-34ab-cdef-0123-456789abcdedd', 'dj', 'Sound Masters Alexandria',
   'Premium DJ service specializing in wedding entertainment and crowd engagement.',
   'Alexandria', 3500, 9000, 4.7,
   '["https://images.pexels.com/photos/3721033/pexels-photo-3721033.jpeg?w=800"]',
   '{"equipment": ["Custom sound design", "LED setup", "Backup power"], "services": ["Live transitions", "Custom mixes", "Request taking"]}', true, now(), now()),
  ('f6789012-34ab-cdef-0123-456789abcdee', 'dj', 'Cairo Beat Masters',
   'Professional DJ with expertise in Egyptian and Arabic music mixing.',
   'Cairo', 2500, 7000, 4.6,
   '["https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?w=800"]',
   '{"equipment": ["Modern sound system", "Dance floor lighting"], "services": ["MC included", "Song requests", "Wedding experience"]}', true, now(), now()),
  ('f6789012-34ab-cdef-0123-456789abcdef', 'dj', 'Event Groove DJ',
   'Versatile DJ for all event types with extensive music library and crowd reading skills.',
   'Cairo', 2800, 7500, 4.7,
   '["https://images.pexels.com/photos/3951517/pexels-photo-3951517.jpeg?w=800"]',
   '{"equipment": ["Premium sound", "Light show"], "services": ["MC services", "Custom playlist", "Professional mixing"]}', true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Decorations (4 vendors)
INSERT INTO vendors (id, category, name, description, city, price_min, price_max, rating, image_urls, details, is_active, created_at, updated_at)
VALUES
  ('f6789012-34ab-cdef-0123-456789abce00', 'decorations', 'Lumina Event Design',
   'Full-service event design creating custom themes with floral installations and lighting.',
   'Cairo', 10000, 35000, 4.9,
   '["https://images.pexels.com/photos/4105595/pexels-photo-4105595.jpeg?w=800"]',
   '{"services": ["Theme design", "Floral", "Lighting", "Setup"], "styles": ["Modern", "Classic", "Bohemian"]}', true, now(), now()),
  ('f6789012-34ab-cdef-0123-456789abce01', 'decorations', 'Royal Decor Studio',
   'Elegant decorative services with traditional Egyptian and modern fusion design.',
   'Cairo', 8000, 28000, 4.8,
   '["https://images.pexels.com/photos-c/6267886/pexels-photo-c-6267886.jpeg?w=800"]',
   '{"services": ["Full decoration", "Rentals", "Custom builds"], "styles": ["Luxury", "Traditional", "Minimalist"]}', true, now(), now()),
  ('f6789012-34ab-cdef-0123-456789abce02', 'decorations', 'Egyptian Florals & Design',
   'Specialized in Egyptian and Arabic traditional decoration with modern touches.',
   'Cairo', 9000, 32000, 4.7,
   '["https://images.pexels.com/photos/3587620/pexels-photo-3587620.jpeg?w=800"]',
   '{"services": ["Floral arrangements", "Traditional designs", "Setup"], "specialties": ["Egyptian themes", "Gold accents", "Traditional patterns"]}', true, now(), now()),
  ('f6789012-34ab-cdef-0123-456789abce03', 'decorations', 'Alexandria Decor Solutions',
   'Modern and traditional decoration services with Mediterranean and Egyptian aesthetics.',
   'Alexandria', 7000, 25000, 4.6,
   '["https://images.pexels.com/photos/3535383/pexels-photo-3535383.jpeg?w=800"]',
   '{"services": ["Event styling", "Setup", "Rentals"], "styles": ["Beachside", "Garden", "Indoor elegant"]}', true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Videography (3 vendors)
INSERT INTO vendors (id, category, name, description, city, price_min, price_max, rating, image_urls, details, is_active, created_at, updated_at)
VALUES
  ('f6789012-34ab-cdef-0123-456789abce04', 'videography', 'Cinematic Dreams Films',
   'Award-winning videography producing cinematic wedding films with color grading and music.',
   'Cairo', 10000, 28000, 4.9,
   '["https://images.pexels.com/photos-c/1988457/pexels-photo-c-1988457.jpeg?w=800"]',
   '{"packages": ["Full edit", "Short film", "Highlights"], "deliverables": ["4K video", "Drone footage", "Music sync"]}', true, now(), now()),
  ('f6789012-34ab-cdef-0123-456789abce05', 'videography', 'Alexandria Motion Pictures',
   'Professional video production with multi-camera setup and live streaming capabilities.',
   'Alexandria', 8000, 22000, 4.7,
   '["https://images.pexels.com/photos-c/1988464/pexels-photo-c-1988464.jpeg?w=800"]',
   '{"packages": ["Complete edit", "Highlights only", "Live stream"], "deliverables": ["2K+ video", "Highlights", "Online sharing"]}', true, now(), now()),
  ('f6789012-34ab-cdef-0123-456789abce06', 'videography', 'Cairo Video Productions',
   'Professional wedding videography with cinematic approach and same-day edits.',
   'Cairo', 7000, 20000, 4.8,
   '["https://images.pexels.com/photos-c/3263147/pexels-photo-c-3263147.jpeg?w=800"]',
   '{"packages": ["Premium", "Standard", "Highlights"], "deliverables": ["Full HD", "Edited video", "Highlight reel"]}', true, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Makeup (2 vendors)
INSERT INTO vendors (id, category, name, description, city, price_min, price_max, rating, image_urls, details, is_active, created_at, updated_at)
VALUES
  ('f6789012-34ab-cdef-0123-456789abce07', 'makeup', 'Radiance Bridal Makeup',
   'Specialist bridal makeup and hair services with traditional and modern styling expertise.',
   'Cairo', 1500, 4500, 4.9,
   '["https://images.pexels.com/photos-c/1239291/pexels-photo-c-1239291.jpeg?w=800"]',
   '{"services": ["Bridal makeup", "Hair", "Trial sessions", "Bridesmaids"], "products": ["Premium brands", "Hypoallergenic"]}', true, now(), now()),
  ('f6789012-34ab-cdef-0123-456789abce08', 'makeup', 'Cairo Beauty Atelier',
   'Professional makeup artistry and bridal styling with traditional and contemporary looks.',
   'Cairo', 1200, 4000, 4.8,
   '["https://images.pexels.com/photos-c/1681010/pexels-photo-c-1681010.jpeg?w=800"]',
   '{"services": ["Bridal glam", "Groom styling", "Party makeup"], "expertise": ["Egyptian traditions", "HD makeup", "Video-ready finishes"]}', true, now(), now())
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
