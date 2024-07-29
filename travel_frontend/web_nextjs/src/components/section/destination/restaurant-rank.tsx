'use client';

import Title from '@/components/common/title';
import { IoIosRestaurant } from "react-icons/io";
import React, { useState, useEffect } from 'react';

export interface Restaurant {
  id: number;
  ranking: number;
  title: string;
  province: string;
  city: string;
  location: string;
  cat2: string;
  cat3: string;
  visitors: number;
  latitude?: number;
  longitude?: number;
  url?: string;
  phone?: string;
}

interface RestaurantRankProps {
  location: string;
}

export default function RestaurantRank({ location }: RestaurantRankProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [error, setError] = useState<string | null>(null);
  const province = location.split(' ')[0];
  const city = location.split(' ')[1];

  useEffect(() => {
    fetch(`/api/restaurants?province=${province}&city=${city}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          // '스타벅스', '맥도날드', 'DT'가 포함된 항목 제외
          const filteredData = data.filter((restaurant: Restaurant) =>
            !/스타벅스|맥도날드|DT/.test(restaurant.title)
          );

          // 랭킹 재설정
          const updatedData = filteredData.map((restaurant: Restaurant, index: number) => ({
            ...restaurant,
            ranking: index + 1
          }));

          setRestaurants(updatedData);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
      });
  }, [province, city, location]);

  const handleClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const currentData = restaurants.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (error) {
    return <div className="py-8">Error: {error}</div>;
  }
  return (
    <section className="py-8">
      <Title className="border-b pb-4 text-lg font-bold">
        {province} {city} 맛집 랭킹
        <IoIosRestaurant className='ml-1.5 size-7' />
      </Title>

      <ul className="mt-2 px-4">
        {currentData.map((restaurant) => (
          <li key={restaurant.id} className="py-4 px-2 transition hover:bg-gray-100 rounded-lg short-border-b">
            <div className="flex justify-between items-center divide-y divide-gray-200">
              <a href={restaurant.url} target='_blank' className="flex items-end font-semibold text-sm sm:text-base">
                {restaurant.ranking}. <span className="ml-1 text-slate-700">{restaurant.title}</span>
              </a>
              <div className="text-xs sm:text-sm text-gray-600 bg-slate-200 px-2 py-1 rounded">{restaurant.cat3}</div>
            </div>
            <div className="text-xs sm:text-sm text-gray-500 mt-1">{restaurant.location}</div>
          </li>
        ))}
      </ul>
      {/* 페이지네이션 */}
      <div className="flex justify-center mt-4">
        {[...Array(Math.ceil(restaurants.length / itemsPerPage)).keys()].map((number) => (
          <button
            key={number + 1}
            onClick={() => handleClick(number + 1)}
            className={`mx-1 px-3 py-1 border rounded ${currentPage === number + 1 ? 'bg-slate-600 text-white' : 'bg-white text-slate-600'
            }`}
          >
            {number + 1}
          </button>
        ))}
      </div>
      {/* <Separator className="mt-8" /> */}
    </section>
  );
}
