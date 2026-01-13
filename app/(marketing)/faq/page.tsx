'use client';

import { Button } from "@/app/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/app/components/ui/accordion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function FAQPage() {
  const faqs = [
    {
      question: "What is a virtual office?",
      answer: "A virtual office provides businesses with a professional address and office-related services without the need for a physical office space. This includes mail handling, call answering, and access to meeting rooms when needed.",
    },
    {
      question: "How does mail forwarding work?",
      answer: "We receive your business mail at your virtual office address and can forward it to your preferred location on a schedule that works for you. You can also access digital scans of your mail through our online portal.",
    },
    {
      question: "Can I use the virtual address on my business cards?",
      answer: "Yes! Your virtual office address can be used on business cards, websites, marketing materials, and official business documentation. It's a fully legitimate business address.",
    },
    {
      question: "What are the benefits of professional call answering?",
      answer: "Our live receptionists answer calls in your business name, providing a professional first impression. They can transfer calls, take messages, and handle basic inquiries according to your instructions.",
    },
    {
      question: "How quickly can I get started?",
      answer: "Most clients can be set up within 24-48 hours after signing up. We'll provide you with your new business address and phone number, and our team will be ready to handle your calls and mail.",
    },
    {
      question: "Are there any long-term contracts?",
      answer: "We offer flexible month-to-month plans as well as discounted annual contracts. You can choose the option that best fits your business needs.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href="/" data-testid="link-back-home">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <h1 className="text-4xl font-bold mb-4" data-testid="heading-faq">Frequently Asked Questions</h1>
        <p className="text-lg text-gray-600 mb-12">
          Find answers to common questions about our virtual office services.
        </p>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} data-testid={`accordion-item-${index}`}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-gray-600">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
