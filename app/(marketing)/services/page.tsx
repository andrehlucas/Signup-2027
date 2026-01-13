'use client';

import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import Link from "next/link";
import { ArrowLeft, Phone, MapPin, Mail, Building } from "lucide-react";

export default function ServicesPage() {
  const services = [
    {
      title: "Virtual Business Address",
      description: "Get a prestigious business address in a prime location without the overhead of physical office space.",
      icon: Building,
    },
    {
      title: "Professional Call Answering",
      description: "Live receptionists answer your calls professionally, representing your business 24/7.",
      icon: Phone,
    },
    {
      title: "Mail Receipt & Forwarding",
      description: "Receive and manage your business mail with our secure mail handling services.",
      icon: Mail,
    },
    {
      title: "Meeting Rooms",
      description: "Access to professional meeting rooms and office spaces when you need them.",
      icon: MapPin,
    },
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

        <h1 className="text-4xl font-bold mb-4" data-testid="heading-services">Our Services</h1>
        <p className="text-lg text-gray-600 mb-12 max-w-3xl">
          Discover our comprehensive virtual office solutions designed to help your business thrive.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <Card key={index} data-testid={`card-service-${index}`}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <service.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{service.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
