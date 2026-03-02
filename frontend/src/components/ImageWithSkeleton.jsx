import React, { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ImageWithSkeleton = ({ src, alt = "", className = "", skeletonClassName, ...imgProps }) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    setLoaded(false);
  }, [src]);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    if (el.complete && el.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [src]);

  return (
    <div className="relative">
      {!loaded && (
        <Skeleton className={`absolute inset-0 ${skeletonClassName || className}`} />
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`${className} ${loaded ? '' : 'opacity-0'}`}
        onLoad={(e) => {
          setLoaded(true);
          imgProps?.onLoad?.(e);
        }}
        onError={(e) => {
          setLoaded(true);
          imgProps?.onError?.(e);
        }}
        {...imgProps}
      />
    </div>
  );
};

export default ImageWithSkeleton;
