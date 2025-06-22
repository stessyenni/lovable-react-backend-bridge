
import FacilityCard, { Facility } from "./FacilityCard";

interface FacilityListProps {
  facilities: Facility[];
  onGetDirections: (address: string) => void;
}

const FacilityList = ({ facilities, onGetDirections }: FacilityListProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-dark-purple">Nearby Facilities</h3>
      <div className="grid gap-4">
        {facilities.map((facility) => (
          <FacilityCard 
            key={facility.id} 
            facility={facility} 
            onGetDirections={onGetDirections}
          />
        ))}
      </div>
    </div>
  );
};

export default FacilityList;
