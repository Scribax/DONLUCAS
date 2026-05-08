"use client";

import dynamic from 'next/dynamic';

const ShippingMapLanding = dynamic(() => import('@/components/ShippingMapLanding'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-kraft-100 animate-pulse rounded-2xl flex items-center justify-center text-kraft-400">Cargando mapa...</div>
});

interface ShippingZone {
  id: string;
  name: string;
  price: number;
  coordinates: any;
  color?: string;
}

export default function ShippingMapLandingWrapper({ zones }: { zones: ShippingZone[] }) {
  return <ShippingMapLanding zones={zones} />;
}
