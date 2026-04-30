import ManualVendorPicker from './ManualVendorPicker';
import { usePlanStore } from '../../../store/plan.store';

export default function ManualCatering() {
  const { selectedCatering, setCatering } = usePlanStore();
  return (
    <ManualVendorPicker
      category="catering"
      label="Catering"
      icon="🍽️"
      storeKey="selectedCatering"
      setFn={setCatering}
      eventSelectionType="catering"
    />
  );
}
