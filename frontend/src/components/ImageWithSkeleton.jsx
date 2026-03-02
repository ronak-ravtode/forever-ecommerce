import React, { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

let initialSkeletonUntil = null;

const ImageWithSkeleton = ({ src, alt = "", className = "", skeletonClassName, ...imgProps }) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);
  const timerRef = useRef(null);

  const scheduleLoaded = () => {
    const now = Date.now();
    const delay = initialSkeletonUntil && now < initialSkeletonUntil ? initialSkeletonUntil - now : 0;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setLoaded(true);
      timerRef.current = null;
    }, delay);
  };

  useEffect(() => {
    if (!initialSkeletonUntil) {
      initialSkeletonUntil = Date.now() + 2000;
    }
    setLoaded(false);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, [src]);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    if (el.complete && el.naturalWidth > 0) {
      scheduleLoaded();
    }
  }, [src]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

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
          scheduleLoaded();
          imgProps?.onLoad?.(e);
        }}
        onError={(e) => {
          scheduleLoaded();
          imgProps?.onError?.(e);
        }}
        {...imgProps}
      />
    </div>
  );
};

export default ImageWithSkeleton;
