'use client';
import { Map, MapMarker, ZoomControl } from "react-kakao-maps-sdk";
import useKakaoLoader from "@/context/use-kakao-loader";
import { useState } from "react";
import { cn } from "@/libs/utils";

export interface MapProps {
  latitude: number;
  longitude: number;
  className?: string
}

export default function KakaoMap({ latitude, longitude, className }: MapProps) {
  useKakaoLoader();
  const [state, setState] = useState({ lat: latitude, lng: longitude-0.000085 });

  const resetCenter = () => {
    // 기존 위치로 재설정
    setState({ lat: latitude, lng: longitude-0.000085 });
    // 약간의 지연 후에 위치를 미세 조정하여 매번 반응하도록 함
    setTimeout(() => {
      setState(prevState => ({ lat: prevState.lat, lng: prevState.lng - 0.000000001 }));
    }, 10);
  };
  
  return (
    <div className={cn('relative', className)}>
      <Map
        className="w-full aspect-[16/11]"
        id="map"
        level={6} // 지도의 확대 레벨
        center={state}
        isPanto={true}
      >
        <ZoomControl position={"BOTTOMRIGHT"} />
        <MapMarker title='맵 타이틀' position={state} />
      </Map>
      <div className="absolute inset-x-0 top-0 bg-white z-10 py-1.5 text-center font-semibold">여행지 주변 지도</div>
      <button onClick={resetCenter} className="border bg-white p-1 absolute top-1.5 right-0 z-20 hidden sm:block">
        <p className="text-xs">여행지로 중심 이동하기</p>
      </button>
    </div>
  );
}


