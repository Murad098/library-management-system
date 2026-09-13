import { useState } from "react";

import { BRAND_MARK, BRAND_NAME } from "../config/brand";

function BrandMark({ size = 34 }) {
  const [failed, setFailed] = useState(false);

  return (
    <span className="brand-mark" style={{ width: size, height: size }}>
      {failed ? (
        <span className="brand-fallback" aria-hidden="true">
          MS
        </span>
      ) : (
        <img
          src={BRAND_MARK}
          alt={`${BRAND_NAME} logo`}
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}

export default BrandMark;
