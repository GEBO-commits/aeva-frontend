-- ============================================================================
-- AEVA Event Selections Unique Constraint
-- Ensures only one selection per event per selection_type (venue, catering, etc)
-- ============================================================================

ALTER TABLE event_selections
ADD CONSTRAINT event_selections_event_selection_unique
UNIQUE (event_id, selection_type);
