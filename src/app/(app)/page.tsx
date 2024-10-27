'use client'

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Ghost, MessageSquare, Zap } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import testimonials from "@/static-data/messages.json"
import ghostreviews from "@/static-data/ghostreviews.png"
import Image from "next/image"
import Link from "next/link"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const autoplayRef = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100">

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <h1 className="text-5xl font-bold mb-4 text-white">Discover Anonymous Feedback Refined</h1>
        <p className="text-xl mb-8 text-gray-400">
          Ghost Reviews: A platform that elevates feedback with anonymity and intelligence.
        </p>
        <Link href="/signin">
            <Button className="w-full md:w-auto bg-slate-100 text-black" variant={'secondary'}>Get Started</Button>
        </Link>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-200">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <MessageSquare className="mr-2 text-gray-600" />
                Anonymous Feedback
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700">
              Create secure, private feedback spaces with ease. Ensure honest and open communication within your team.
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <Zap className="mr-2 text-gray-600" />
                AI-Powered Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700">
              Get recommendations driven by AI to enhance team collaboration and improve decision-making processes.
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <CheckCircle className="mr-2 text-gray-600" />
                Full Control
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700">
              Seamlessly manage feedback visibility and responses. Tailor the platform to your team's specific needs.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-200">How It Works</h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <ol className="space-y-6 text-gray-400">
              <li className="flex items-center">
                <span className="bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center mr-4 text-white">1</span>
                <span>Create your secure review space</span>
              </li>
              <li className="flex items-center">
                <span className="bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center mr-4 text-white">2</span>
                <span>Enable AI-driven suggestions</span>
              </li>
              <li className="flex items-center">
                <span className="bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center mr-4 text-white">3</span>
                <span>Collect anonymous feedback</span>
              </li>
              <li className="flex items-center">
                <span className="bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center mr-4 text-white">4</span>
                <span>Utilize insights for growth</span>
              </li>
            </ol>
          </div>
          <div className="bg-white w-4/5 p-6 rounded-lg shadow-lg">
            <Image src={ghostreviews} alt="Ghost Reviews platform screenshot" className="w-full h-auto rounded" />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-900 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-200">User Stories</h2>
          <Carousel
            plugins={[autoplayRef.current]}
            className="w-full max-w-xl mx-auto"
            onSelect={(index) => setActiveIndex(index)}
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index}>
                  <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow mx-4">
                    <CardHeader>
                      <CardTitle className="text-gray-900">{testimonial.title}</CardTitle>
                      <CardDescription className="text-gray-600">{testimonial.role}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-gray-700">
                      {`"${testimonial.content}"`}
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-4">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 w-2 rounded-full mx-1 ${
                    index === activeIndex ? 'bg-gray-200' : 'bg-gray-500'
                  }`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* Pricing Section */}
      {/* <section id="pricing" className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-200">Pricing Plans</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-gray-900">Basic</CardTitle>
              <CardDescription className="text-gray-600">Ideal for small teams</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-gray-900 mb-4">$9.99<span className="text-xl font-normal text-gray-600">/month</span></p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center"><CheckCircle className="mr-2 text-green-500" /> Up to 3 review spaces</li>
                <li className="flex items-center"><CheckCircle className="mr-2 text-green-500" /> Basic AI suggestions</li>
                <li className="flex items-center"><CheckCircle className="mr-2 text-green-500" /> Email support</li>
              </ul>
              <Button className="w-full mt-6 bg-gray-700 hover:bg-gray-600 text-white">Choose Plan</Button>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow border-2 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900">Pro</CardTitle>
              <CardDescription className="text-gray-600">For growing teams</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-gray-900 mb-4">$19.99<span className="text-xl font-normal text-gray-600">/month</span></p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center"><CheckCircle className="mr-2 text-green-500" /> Unlimited review spaces</li>
                <li className="flex items-center"><CheckCircle className="mr-2 text-green-500" /> Advanced AI suggestions</li>
                <li className="flex items-center"><CheckCircle className="mr-2 text-green-500" /> Priority support</li>
                <li className="flex items-center"><CheckCircle className="mr-2 text-green-500" /> Analytics dashboard</li>
              </ul>
              <Button className="w-full mt-6 bg-gray-900 hover:bg-gray-800 text-white">Choose Plan</Button>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-gray-900">Enterprise</CardTitle>
              <CardDescription className="text-gray-600">For large organizations</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-gray-900 mb-4">Custom</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center"><CheckCircle className="mr-2 text-green-500" /> Custom AI model training</li>
                <li className="flex items-center"><CheckCircle className="mr-2 text-green-500" /> Dedicated account manager</li>
                <li className="flex items-center"><CheckCircle className="mr-2 text-green-500" /> 24/7 premium support</li>
                <li className="flex items-center"><CheckCircle className="mr-2 text-green-500" /> On-premise deployment options</li>
              </ul>
              <Button className="w-full mt-6 bg-gray-700 hover:bg-gray-600 text-white">Contact Sales</Button>
            </CardContent>
          </Card>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="bg-gray-800 py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">Ready to Transform Your Feedback Process?</h2>
          <p className="text-xl mb-8 text-gray-300">Join thousands of teams already using Ghost Reviews to gather high-quality, anonymous feedback.</p>
          <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-200">Start Your Free Trial</Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-between items-center">
            <div className="w-full md:w-1/3 text-center md:text-left">
              <h3 className="text-lg font-bold mb-2 flex items-center justify-center md:justify-start text-gray-200">
                <Ghost  className="mr-2 text-gray-400" />
                Ghost Reviews
              </h3>
              <p className="text-sm text-gray-400">Empowering teams with intelligent feedback solutions.</p>
            </div>
            <div className="w-full md:w-1/3 text-center mt-4 md:mt-0">
              <p className="text-sm text-gray-400">&copy; 2023 Ghost Reviews. All rights reserved.</p>
            </div>
            <div className="w-full md:w-1/3 text-center md:text-right mt-4 md:mt-0">
              <a href="#" className="text-sm text-gray-400 hover:text-gray-300 transition-colors mr-4">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-400 hover:text-gray-300 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}