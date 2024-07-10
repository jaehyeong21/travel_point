import { NextResponse } from 'next/server';
import prisma from '@/libs/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const province = searchParams.get('province');
  
    if (!city || !province) {
      return NextResponse.json({ error: 'City and Province query parameters are required' }, { status: 400 });
    }

    const restaurants = await prisma.restaurant.findMany({
      where: { 
        city: city,
        province: province 
      },
      orderBy: { ranking: 'asc' },
    });

    return NextResponse.json(restaurants);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
