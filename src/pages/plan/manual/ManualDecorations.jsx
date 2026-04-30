import ManualVendorPicker from './ManualVendorPicker';
import { usePlanStore } from '../../../store/plan.store';

export default function ManualDecorations() {
  const { selectedDecorations, setDecorations } = usePlanStore();
  return (
    <ManualVendorPicker
      category="decorations"
      label="Decorations"
      icon="🌸"
      storeKey="selectedDecorations"
      setFn={setDecorations}
      eventSelectionType="decorations"
    />
  );
}
