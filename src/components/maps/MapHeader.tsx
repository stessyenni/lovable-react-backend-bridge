
interface MapHeaderProps {}

const MapHeader = () => {
  return (
    <div className="gradient-hemapp rounded-lg p-6 text-white">
      <h2 className="text-2xl font-bold mb-2">Health Facility Maps</h2>
      <p className="text-white/90">Find nearby hospitals, clinics, and pharmacies with real-time navigation.</p>
    </div>
  );
};

export default MapHeader;
