import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Users, MapPin, Clock, AlertCircle, Utensils, Palette, Camera, Music, Video, Truck } from 'lucide-react';
import Skeleton from '../components/ui/Skeleton';
import { getEventDetail, updateEvent } from '../services/planningService';
import { supabase } from '../lib/supabaseClient';

function statusClasses(status) {
    switch (status) {
        case 'confirmed': return 'bg-green-100 text-green-700';
        case 'pending': return 'bg-yellow-100 text-yellow-700';
        case 'completed': return 'bg-blue-100 text-blue-700';
        case 'draft':
        default: return 'bg-gray-100 text-gray-600';
    }
}

export default function EventDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [event, setEvent] = useState(null);
    const [loadError, setLoadError] = useState(null);
    const [selectedItems, setSelectedItems] = useState({});

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setIsLoading(true);
            const { event: data, error } = await getEventDetail(id);
            if (cancelled) return;
            if (error || !data) {
                setLoadError(error?.message || 'Event not found');
            } else {
                setEvent(data);
                setEditForm({
                    title: data.title || '',
                    event_date: data.event_date || '',
                    guest_count: data.guest_count || 0,
                    budget_max: data.budget_max || 0,
                });

                // Fetch details for selected items
                if (data.selections && data.selections.length > 0) {
                    const items = {};
                    for (const sel of data.selections) {
                        if (sel.selection_type === 'venue') continue; // Already have venue

                        let tableName = '';
                        if (sel.selection_type === 'catering') tableName = 'vendors';
                        else if (sel.selection_type === 'decorations') tableName = 'vendors';
                        else if (['photographer', 'videographer', 'dj'].includes(sel.selection_type)) tableName = 'vendors';

                        if (tableName && sel.entity_id) {
                            const { data: itemData } = await supabase
                                .from(tableName)
                                .select('id, name, image_urls')
                                .eq('id', sel.entity_id)
                                .single();
                            if (itemData) {
                                items[sel.selection_type] = itemData;
                            }
                        }
                    }
                    setSelectedItems(items);
                }
            }
            setIsLoading(false);
        }
        load();
        return () => { cancelled = true; };
    }, [id]);


    const handleSave = async () => {
        setIsSaving(true);
        const payload = {
            title: editForm.title,
            guest_count: Number(editForm.guest_count) || 0,
            budget_max: Number(editForm.budget_max) || 0,
        };
        if (editForm.event_date) payload.event_date = editForm.event_date;

        const { event: updated, error } = await updateEvent(id, payload);
        setIsSaving(false);
        if (error) {
            console.error('[EventDetail] Failed to update event:', error);
            return;
        }
        setEvent(prev => ({ ...prev, ...updated }));
        setIsEditing(false);
    };

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                    <Skeleton className="w-24 h-6 rounded-full mb-3" />
                    <Skeleton className="w-2/3 h-10 rounded-xl mb-4" />
                    <Skeleton className="w-1/3 h-6 rounded-md mb-6" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                        <Skeleton className="w-full h-20 rounded-2xl" />
                        <Skeleton className="w-full h-20 rounded-2xl" />
                        <Skeleton className="w-full h-20 rounded-2xl" />
                        <Skeleton className="w-full h-20 rounded-2xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (loadError || !event) {
        return (
            <div className="max-w-2xl mx-auto py-10">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 text-center">
                    <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-display font-bold text-text-dark mb-2">Event not found</h2>
                    <p className="text-text-muted mb-6">We couldn't load this event. It may have been removed or you may not have access.</p>
                    <button onClick={() => navigate('/my-events')} className="bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-secondary transition-colors">
                        Back to My Events
                    </button>
                </div>
            </div>
        );
    }

    const displayStatus = event.booking?.status || event.status || 'draft';
    const venueName = event.venue?.name || event.city || 'Venue not yet selected';
    const bookingTotal = event.booking?.total_amount;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-6 border-b pb-6">
                    <div className="flex-1">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 ${statusClasses(displayStatus)}`}>
                            {displayStatus}
                        </span>
                        {isEditing ? (
                            <input
                                type="text"
                                value={editForm.title}
                                onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                                className="text-4xl font-display font-bold text-text-dark w-full bg-transparent border-b-2 border-primary/30 focus:outline-none focus:border-primary"
                            />
                        ) : (
                            <h1 className="text-4xl font-display font-bold text-text-dark">{event.title || 'Untitled Event'}</h1>
                        )}
                        <p className="text-text-muted mt-2 capitalize">{event.event_type || 'event'}</p>
                    </div>
                    <button
                        onClick={() => {
                            if (isEditing) handleSave();
                            else setIsEditing(true);
                        }}
                        disabled={isSaving}
                        className={`px-6 py-2 rounded-full font-medium transition-colors ${isEditing ? 'bg-primary text-white hover:bg-secondary shadow-md' : 'bg-gray-100 hover:bg-gray-200 text-text-dark'} disabled:opacity-60`}
                    >
                        {isSaving ? 'Saving…' : (isEditing ? 'Save Changes' : 'Edit Details')}
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gray-50 p-4 rounded-2xl flex flex-col justify-center">
                        <span className="text-sm font-medium text-text-muted block mb-1">Date</span>
                        {isEditing ? (
                            <input type="date" value={editForm.event_date} onChange={e => setEditForm({ ...editForm, event_date: e.target.value })} className="font-bold text-text-dark text-sm bg-white border border-gray-200 rounded-lg px-2 py-1 w-full" />
                        ) : (
                            <span className="font-bold text-text-dark text-sm lg:text-lg flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                                {event.event_date
                                    ? new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                    : 'Not set'}
                            </span>
                        )}
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl flex flex-col justify-center">
                        <span className="text-sm font-medium text-text-muted block mb-1">Venue</span>
                        <span className="font-bold text-text-dark text-sm lg:text-lg flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-secondary flex-shrink-0" /> <span className="truncate">{venueName}</span>
                        </span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl flex flex-col justify-center">
                        <span className="text-sm font-medium text-text-muted block mb-1">Guests</span>
                        {isEditing ? (
                            <input type="number" value={editForm.guest_count} onChange={e => setEditForm({ ...editForm, guest_count: parseInt(e.target.value) || 0 })} className="font-bold text-text-dark text-sm bg-white border border-gray-200 rounded-lg px-2 py-1 w-full" />
                        ) : (
                            <span className="font-bold text-text-dark text-sm lg:text-lg flex items-center gap-2"><Users className="w-4 h-4 text-accent flex-shrink-0" /> {event.guest_count || '—'}</span>
                        )}
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl flex flex-col justify-center">
                        <span className="text-sm font-medium text-text-muted block mb-1">
                            {bookingTotal ? 'Booked Total' : 'Budget'}
                        </span>
                        {isEditing ? (
                            <input type="number" value={editForm.budget_max} onChange={e => setEditForm({ ...editForm, budget_max: Number(e.target.value) || 0 })} className="font-bold text-text-dark text-sm bg-white border border-gray-200 rounded-lg px-2 py-1 w-full" />
                        ) : (
                            <span className="font-bold text-text-dark text-sm lg:text-lg truncate w-full block">
                                {Number(bookingTotal || event.budget_max || 0).toLocaleString()} EGP
                            </span>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-display font-bold text-text-dark mb-6">Selected Items</h2>
                            <div className="space-y-4">
                                {event.venue ? (
                                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                                        <div className="flex items-center gap-3 mb-2">
                                            <MapPin className="w-5 h-5 text-secondary flex-shrink-0" />
                                            <span className="text-sm font-semibold text-text-muted uppercase tracking-wide">Venue</span>
                                        </div>
                                        <h3 className="font-bold text-lg text-text-dark ml-8">{event.venue.name}</h3>
                                        <p className="text-sm text-text-muted ml-8">{event.venue.city || 'Location'}</p>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 rounded-2xl p-4 border border-dashed border-gray-300">
                                        <div className="flex items-center gap-3 mb-2">
                                            <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                            <span className="text-sm font-semibold text-text-muted uppercase tracking-wide">Venue</span>
                                        </div>
                                        <p className="text-sm text-text-muted ml-8">Not selected yet</p>
                                    </div>
                                )}

                                {selectedItems.catering ? (
                                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Utensils className="w-5 h-5 text-orange-500 flex-shrink-0" />
                                            <span className="text-sm font-semibold text-text-muted uppercase tracking-wide">Catering</span>
                                        </div>
                                        <h3 className="font-bold text-lg text-text-dark ml-8">{selectedItems.catering.name}</h3>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 rounded-2xl p-4 border border-dashed border-gray-300">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Utensils className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                            <span className="text-sm font-semibold text-text-muted uppercase tracking-wide">Catering</span>
                                        </div>
                                        <p className="text-sm text-text-muted ml-8">Not selected yet</p>
                                    </div>
                                )}

                                {selectedItems.decorations ? (
                                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Palette className="w-5 h-5 text-pink-500 flex-shrink-0" />
                                            <span className="text-sm font-semibold text-text-muted uppercase tracking-wide">Decorations</span>
                                        </div>
                                        <h3 className="font-bold text-lg text-text-dark ml-8">{selectedItems.decorations.name}</h3>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 rounded-2xl p-4 border border-dashed border-gray-300">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Palette className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                            <span className="text-sm font-semibold text-text-muted uppercase tracking-wide">Decorations</span>
                                        </div>
                                        <p className="text-sm text-text-muted ml-8">Not selected yet</p>
                                    </div>
                                )}

                                <div className="border-t border-gray-200 pt-4 mt-4">
                                    <h3 className="text-sm font-bold text-text-muted uppercase tracking-wide mb-3">Vendors</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {selectedItems.photographer ? (
                                            <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Camera className="w-4 h-4 text-blue-600" />
                                                    <span className="text-xs font-semibold text-blue-600 uppercase">Photographer</span>
                                                </div>
                                                <p className="text-sm font-semibold text-text-dark">{selectedItems.photographer.name}</p>
                                            </div>
                                        ) : (
                                            <div className="bg-gray-50 rounded-xl p-3 border border-dashed border-gray-300">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Camera className="w-4 h-4 text-gray-400" />
                                                    <span className="text-xs font-semibold text-gray-400 uppercase">Photographer</span>
                                                </div>
                                                <p className="text-xs text-text-muted">Not selected</p>
                                            </div>
                                        )}

                                        {selectedItems.videographer ? (
                                            <div className="bg-purple-50 rounded-xl p-3 border border-purple-200">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Video className="w-4 h-4 text-purple-600" />
                                                    <span className="text-xs font-semibold text-purple-600 uppercase">Videographer</span>
                                                </div>
                                                <p className="text-sm font-semibold text-text-dark">{selectedItems.videographer.name}</p>
                                            </div>
                                        ) : (
                                            <div className="bg-gray-50 rounded-xl p-3 border border-dashed border-gray-300">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Video className="w-4 h-4 text-gray-400" />
                                                    <span className="text-xs font-semibold text-gray-400 uppercase">Videographer</span>
                                                </div>
                                                <p className="text-xs text-text-muted">Not selected</p>
                                            </div>
                                        )}

                                        {selectedItems.dj ? (
                                            <div className="bg-red-50 rounded-xl p-3 border border-red-200">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Music className="w-4 h-4 text-red-600" />
                                                    <span className="text-xs font-semibold text-red-600 uppercase">DJ / Music</span>
                                                </div>
                                                <p className="text-sm font-semibold text-text-dark">{selectedItems.dj.name}</p>
                                            </div>
                                        ) : (
                                            <div className="bg-gray-50 rounded-xl p-3 border border-dashed border-gray-300">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Music className="w-4 h-4 text-gray-400" />
                                                    <span className="text-xs font-semibold text-gray-400 uppercase">DJ / Music</span>
                                                </div>
                                                <p className="text-xs text-text-muted">Not selected</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-xl font-bold font-display text-text-dark">Event Modules</h3>

                        {event.booking ? (
                            <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                                <span className="font-bold text-text-dark block mb-1">Booking</span>
                                <span className="text-sm text-text-muted">Reference: {event.booking.id.slice(0, 8).toUpperCase()}</span>
                                <p className="text-sm mt-2">
                                    Status: <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${statusClasses(event.booking.status)}`}>{event.booking.status}</span>
                                </p>
                                {event.booking.total_amount ? (
                                    <p className="text-sm text-text-muted mt-2">
                                        Total: <span className="font-semibold text-text-dark">{event.booking.total_amount.toLocaleString()} EGP</span>
                                    </p>
                                ) : null}
                            </div>
                        ) : null}

                        <Link to="/invitations" className="group bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-primary/30 flex items-center justify-between transition-all">
                            <div className="flex flex-col">
                                <span className="font-bold text-text-dark group-hover:text-primary transition-colors">Manage Invitations</span>
                                <span className="text-sm text-text-muted mt-1">Draft & Send RSVPs, Track stats</span>
                            </div>
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all transform group-hover:scale-110">
                                →
                            </div>
                        </Link>

                        <div className="group bg-gray-50 border border-gray-100 p-6 rounded-2xl flex items-center justify-between opacity-60">
                            <div className="flex flex-col text-left">
                                <span className="font-bold text-text-dark">Vendor Management</span>
                                <span className="text-sm text-text-muted mt-1 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Coming soon</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
