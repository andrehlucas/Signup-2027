'use client';

import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";

export default function LocationsPage() {
  const locations = [
    { city: "New York", image: "/new-york.webp" },
    { city: "Los Angeles", image: "/los-angeles.webp" },
    { city: "Chicago", image: "/chicago.webp" },
    { city: "Houston", image: "/houston.webp" },
    { city: "Miami", image: "/miami.webp" },
    { city: "Dallas", image: "/dallas.webp" },
    { city: "Atlanta", image: "/atlanta.webp" },
    { city: "Tampa", image: "/tampa.webp" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <Link href="/" data-testid="link-back-home">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <h1 className="text-4xl font-bold mb-4" data-testid="heading-locations">Our Locations</h1>
        <p className="text-lg text-gray-600 mb-12 max-w-3xl">
          Choose from our prestigious business addresses across major cities in the United States.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {locations.map((location, index) => (
            <Card key={index} className="overflow-hidden" data-testid={`card-location-${index}`}>
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={location.image} 
                  alt={location.city}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  {location.city}
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
