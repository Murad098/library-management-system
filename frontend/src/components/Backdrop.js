import { BRAND_BACKGROUND } from "../config/brand";

function Backdrop() {
  return (
    <div className="app-backdrop" aria-hidden="true">
      <div
        className="app-backdrop__photo"
        style={{ backgroundImage: `url("${BRAND_BACKGROUND}")` }}
      />
    </div>
  );
}

export default Backdrop;
