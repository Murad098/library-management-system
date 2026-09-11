import { useState } from "react";

import { BRAND_LOGO, BRAND_NAME } from "../config/brand";

const LOGO_ASPECT = 3 / 2;

function BrandMark({ size = 34 }) {
  const [failed, setFailed] = useState(false);
  const width = Math.round(size * LOGO_ASPECT);

  return (
    <span className="brand-mark" style={{ width, height: size }}>
      {failed ? (
        <span className="brand-fallback" aria-hidden="true">
          LD
        </span>
      ) : (
        <img
          src={BRAND_LOGO}
          alt={`${BRAND_NAME} logo`}
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}

export default BrandMark;
