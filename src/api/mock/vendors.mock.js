/**
 * Mock vendor data for development.
 * Includes photographers, DJs, and videographers — 3 of each.
 * Replace with real API fetches when backend is ready.
 */

export const mockVendors = [
    // --- Photographers ---
    {
        id: "v-ph-001",
        name: "Capture Moments Photography",
        category: "Photographer",
        startingPrice: 12000,
        rating: 4.9,
        reviews: 420,
        image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&auto=format&fit=crop",
        features: ["Drone Footage", "Pre-event Shoot", "Digital Album"],
        description: "Award-winning photography team with a cinematic and candid approach.",
        color: "blue"
    },
    {
        id: "v-ph-002",
        name: "Golden Hour Studios",
        category: "Photographer",
        startingPrice: 9500,
        rating: 4.7,
        reviews: 285,
        image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&auto=format&fit=crop",
        features: ["Same-day Highlights", "Print Album", "360-Photo Booth"],
        description: "Specializing in warm, golden-toned photography that tells your story beautifully.",
        color: "blue"
    },
    {
        id: "v-ph-003",
        name: "Lens & Light Cairo",
        category: "Photographer",
        startingPrice: 7000,
        rating: 4.6,
        reviews: 190,
        image: "https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb?w=800&auto=format&fit=crop",
        features: ["Edited Gallery (48h)", "Couples Session", "USB Delivery"],
        description: "Documentary-style photography capturing authentic emotions and unscripted moments.",
        color: "blue"
    },

    // --- DJs ---
    {
        id: "v-dj-001",
        name: "DJ Pulse Cairo",
        category: "DJ",
        startingPrice: 6000,
        rating: 4.8,
        reviews: 215,
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop",
        features: ["Custom Playlists", "Uplighting", "MC Services"],
        description: "Keeps the dance floor packed all night with international hits and Arabic pop.",
        color: "blue"
    },
    {
        id: "v-dj-002",
        name: "Soundwave Entertainment",
        category: "DJ",
        startingPrice: 8000,
        rating: 4.9,
        reviews: 178,
        image: "https://images.unsplash.com/photo-1571266028243-d220c6a5d3f5?w=800&auto=format&fit=crop",
        features: ["Live Mixing", "LED Dance Floor", "Fogger & Effects"],
        description: "Premium sound systems with immersive live mixing for unforgettable dance nights.",
        color: "blue"
    },
    {
        id: "v-dj-003",
        name: "Vibe Collective",
        category: "DJ",
        startingPrice: 4500,
        rating: 4.6,
        reviews: 132,
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&auto=format&fit=crop",
        features: ["Acoustic Sets", "Curated Playlists", "Ambient Lighting"],
        description: "Perfect for intimate gatherings and cocktail hours with a chill, curated playlist.",
        color: "blue"
    },

    // --- Videographers ---
    {
        id: "v-vid-001",
        name: "Cinematic Dreams Films",
        category: "Videographer",
        startingPrice: 15000,
        rating: 4.9,
        reviews: 340,
        image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop",
        features: ["4K Footage", "Cinematic Edit", "Drone Aerial Shots"],
        description: "Film-quality wedding videos that feel like Hollywood productions.",
        color: "blue"
    },
    {
        id: "v-vid-002",
        name: "MemoryReel Studios",
        category: "Videographer",
        startingPrice: 10000,
        rating: 4.7,
        reviews: 201,
        image: "https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?w=800&auto=format&fit=crop",
        features: ["Same-day Edit", "Social Reels", "Live Streaming"],
        description: "Fast turnaround and social-media-ready edits to share your moment immediately.",
        color: "blue"
    },
    {
        id: "v-vid-003",
        name: "Pixel Perfect Egypt",
        category: "Videographer",
        startingPrice: 7500,
        rating: 4.6,
        reviews: 160,
        image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&auto=format&fit=crop",
        features: ["Ceremony Coverage", "Reception Highlight", "USB + Online Gallery"],
        description: "Reliable, high-quality video coverage for all types of events.",
        color: "blue"
    }
];
