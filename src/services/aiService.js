import { supabase } from '../lib/supabaseClient';


console.log('[aiService] Gemini key loaded:', !!import.meta.env.VITE_GEMINI_API_KEY, import.meta.env.VITE_GEMINI_API_KEY?.slice(0, 8));

const replyCache = new Map();

/**
 * getChatReply(message, eventId, chatHistory)
 *
 * 1. Fetch venues and vendors from Supabase (is_active = true)
 * 2. If eventId provided, fetch event record from Supabase
 * 3. Build eventContext string from event fields if available
 * 4. Try Gemini API call (gemini-1.5-flash):
 *    - If Gemini fails for ANY reason (no key, 429, network error),
 *      generate a smart fallback reply
 * 5. After getting reply (real or fallback), fetch recommendation cards
 * 6. Return { reply, cards, error: null } — NEVER return error to caller
 */
export async function getChatReply(message, eventId, chatHistory = []) {
    try {
        // City filter logic
        const EGYPT_CITIES = ['cairo', 'alexandria', 'giza', 'luxor', 'aswan', 'hurghada', 'sharm', 'mansoura', 'tanta', 'ismailia', 'suez', 'october', '6th of october'];
        const mentionedCity = EGYPT_CITIES.find(city => message.toLowerCase().includes(city));

        // 1. Fetch venues and vendors from Supabase
        let venueQuery = supabase
            .from('venues')
            .select('*')
            .eq('is_active', true);

        if (mentionedCity) {
            venueQuery = venueQuery.ilike('city', `%${mentionedCity}%`);
        }

        const { data: venues } = await venueQuery;

        let vendorQuery = supabase
            .from('vendors')
            .select('*')
            .eq('is_active', true);

        if (mentionedCity) {
            vendorQuery = vendorQuery.ilike('city', `%${mentionedCity}%`);
        }

        const { data: vendors } = await vendorQuery;

        let eventContext = '';

        // 2. If eventId provided, fetch event record
        if (eventId) {
            const { data: event } = await supabase
                .from('events')
                .select('*')
                .eq('id', eventId)
                .single();

            if (event) {
                eventContext = `Event: ${event.title || 'Unnamed Event'}, Type: ${event.event_type}, Budget: ${event.budget_max} EGP, Location: ${event.city || 'Egypt'}, Guests: ${event.guest_count || 'Unknown'}`;
            }
        }

        // 3. Build venue and vendor lists for context
        const venueList = (venues || [])
            .map(v => `${v.name} (${v.city}, ${v.capacity_max} guests, from ${v.price_min} EGP, rating ${v.rating})`)
            .join('\n');

        const vendorList = (vendors || [])
            .map(v => `${v.name} (${v.category}, ${v.city}, from ${v.price_min} EGP, rating ${v.rating})`)
            .join('\n');

        // 4. Try Gemini API call
        const systemPrompt = `You are AEVA, an AI event planning assistant in Egypt. Recommend specific venues and vendors BY NAME from this catalog only. Be warm and concise under 100 words.
${eventContext ? `Event context: ${eventContext}\n` : ''}
VENUES:
${venueList}
VENDORS:
${vendorList}`;

        const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
        let reply = null;

        const cacheKey = message.trim().toLowerCase().slice(0, 100);
        if (replyCache.has(cacheKey)) {
            const cached = replyCache.get(cacheKey);
            return { reply: cached.reply, cards, error: null };
        }

        if (geminiKey) {
            try {
                const url = `/api/gemini/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
                const body = {
                    system_instruction: { parts: [{ text: systemPrompt }] },
                    contents: [
                        ...chatHistory.map(msg => ({
                            role: msg.role === 'user' ? 'user' : 'model',
                            parts: [{ text: msg.content }]
                        })),
                        { role: 'user', parts: [{ text: message }] }
                    ]
                };
                console.log('[aiService] Calling Gemini URL:', url);
                console.log('[aiService] Request body:', JSON.stringify(body).slice(0, 200));
                const response = await fetch(
                    url,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body)
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
                        reply = data.candidates[0].content.parts[0].text;
                        replyCache.set(cacheKey, { reply });
                    }
                }
            } catch (err) {
                // Gemini failed, use fallback
            }
        }

        // 5. If Gemini failed or no key, generate smart fallback
        if (!reply) {
            reply = generateFallbackReply(message, venues, vendors);
        }

        // 6. Fetch recommendation cards based on message intent
        let cards = [];
        const lowerMsg = message.toLowerCase();

        if (lowerMsg.includes('venue') || lowerMsg.includes('hall') || lowerMsg.includes('wedding') || lowerMsg.includes('where') || lowerMsg.includes('space')) {
            cards = (venues || [])
                .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                .slice(0, 3)
                .map(v => ({ ...v, url: '/recommendations' }));
        } else if (lowerMsg.includes('cater') || lowerMsg.includes('food')) {
            const cateringVendors = (vendors || []).filter(v => v.category === 'catering');
            cards = cateringVendors
                .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                .slice(0, 3)
                .map(v => ({ ...v, url: '/catering' }));
        } else if (lowerMsg.includes('photo') || lowerMsg.includes('dj') || lowerMsg.includes('video') || lowerMsg.includes('decor')) {
            const relevantVendors = (vendors || [])
                .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                .slice(0, 3);
            cards = relevantVendors.map(v => {
                let url = '/vendors';
                if (v.category === 'catering') url = '/catering';
                else if (v.category === 'decorations') url = '/decorations';
                return { ...v, url };
            });
        }

        // 7. Return { reply, cards, error: null }
        return { reply, cards: cards || [], error: null };
    } catch (err) {
        // Never throw, never crash
        console.warn('[aiService] getChatReply error:', err);
        return {
            reply: "I can help you plan your perfect event! Tell me the type (wedding, birthday, corporate), your guest count, and total budget.",
            cards: [],
            error: null
        };
    }
}

/**
 * getEventRecommendations(eventId)
 *
 * Pure rule-based scoring, NO Gemini call:
 * 1. Fetch event from Supabase
 * 2. Fetch all active venues and vendors
 * 3. Score each venue 0-100
 * 4. Score each vendor 0-100
 * 5. Sort venues by score desc, vendors by score desc
 * 6. Save top results to event_recommendations table
 * 7. Return { venueRecommendation, vendorRecommendations, error: null }
 */
export async function getEventRecommendations(eventId) {
    try {
        // 1. Fetch event from Supabase
        const { data: event } = await supabase
            .from('events')
            .select('*')
            .eq('id', eventId)
            .single();

        if (!event) {
            return { venueRecommendation: null, vendorRecommendations: [], error: null };
        }

        // 2. Fetch all active venues and vendors
        const { data: venues } = await supabase
            .from('venues')
            .select('*')
            .eq('is_active', true);

        const { data: vendors } = await supabase
            .from('vendors')
            .select('*')
            .eq('is_active', true);

        // 3. Score each venue 0-100
        const scoredVenues = (venues || []).map(venue => {
            let score = 0;
            if (venue.city === event.city) score += 40;
            if (venue.price_min <= (event.budget_max || 999999)) score += 30;
            if (venue.capacity_max >= (event.guest_count || 0)) score += 20;
            if (venue.rating) score += (venue.rating / 5) * 10;
            return { ...venue, score };
        });

        // 4. Score each vendor 0-100
        const scoredVendors = (vendors || []).map(vendor => {
            let score = 0;
            if (vendor.city === event.city) score += 30;
            if (vendor.price_min <= (event.budget_max || 999999)) score += 30;
            if (vendor.rating) score += (vendor.rating / 5) * 30;
            if (vendor.category === event.venue_type || vendor.category === event.theme) score += 10;
            return { ...vendor, score };
        });

        // 5. Sort venues and vendors by score desc
        const topVenue = scoredVenues.sort((a, b) => b.score - a.score)[0];
        const topVendors = scoredVendors.sort((a, b) => b.score - a.score).slice(0, 3);

        // 6. Save top results to event_recommendations table
        if (topVenue) {
            await supabase
                .from('event_recommendations')
                .delete()
                .eq('event_id', eventId)
                .eq('source', 'ai');

            await supabase
                .from('event_recommendations')
                .insert([
                    {
                        event_id: eventId,
                        entity_type: 'venue',
                        entity_id: topVenue.id,
                        score: Math.round(topVenue.score),
                        reason_text: `Recommended based on location (${topVenue.city}), budget match, and ${topVenue.rating} rating.`,
                        source: 'ai'
                    }
                ]);
        }

        topVendors.forEach(vendor => {
            supabase
                .from('event_recommendations')
                .insert([
                    {
                        event_id: eventId,
                        entity_type: 'vendor',
                        entity_id: vendor.id,
                        score: Math.round(vendor.score),
                        reason_text: `${vendor.category} recommendation with ${vendor.rating} rating.`,
                        source: 'ai'
                    }
                ]);
        });

        // 7. Return { venueRecommendation, vendorRecommendations, error: null }
        return {
            venueRecommendation: topVenue ? { entity_id: topVenue.id, entity_type: 'venue', score: topVenue.score } : null,
            vendorRecommendations: topVendors.map(v => ({ entity_id: v.id, entity_type: 'vendor', score: v.score })),
            error: null
        };
    } catch (err) {
        // Wrap entire function in try/catch — on ANY error return success with null data
        console.warn('[aiService] getEventRecommendations error:', err);
        return { venueRecommendation: null, vendorRecommendations: [], error: null };
    }
}

/**
 * Helper: Generate smart fallback reply based on message keywords
 */
function generateFallbackReply(message, venues, vendors) {
    const lower = message.toLowerCase();

    if (lower.includes('venue') || lower.includes('hall') || lower.includes('wedding') || lower.includes('where') || lower.includes('space')) {
        const topVenues = (venues || [])
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 2);

        if (topVenues.length >= 2) {
            return `For your event, I recommend ${topVenues[0].name} in ${topVenues[0].city} (up to ${topVenues[0].capacity_max} guests, from ${topVenues[0].price_min} EGP) and ${topVenues[1].name} in ${topVenues[1].city}. Both are highly rated options!`;
        }
    }

    if (lower.includes('cater') || lower.includes('food')) {
        const cateringVendors = (vendors || []).filter(v => v.category === 'catering');
        const topCaterers = cateringVendors
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 2);

        if (topCaterers.length >= 2) {
            return `For catering, I recommend ${topCaterers[0].name} (from ${topCaterers[0].price_min} EGP per person) and ${topCaterers[1].name}. Both offer excellent service!`;
        }
    }

    if (lower.includes('photo') || lower.includes('dj') || lower.includes('video') || lower.includes('decor')) {
        const relevantVendors = (vendors || [])
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 2);

        if (relevantVendors.length >= 1) {
            return `I recommend ${relevantVendors[0].name} for your event (${relevantVendors[0].category}, from ${relevantVendors[0].price_min} EGP). They have excellent ratings!`;
        }
    }

    return "I can help you plan your perfect event! Tell me about your event type, number of guests, budget, and preferred city in Egypt, and I'll recommend the best venues and vendors for you.";
}
