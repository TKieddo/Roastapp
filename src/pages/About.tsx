import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Flame, 
  Users, 
  Trophy, 
  Target, 
  Zap, 
  Heart, 
  Globe, 
  Mail, 
  MapPin,
  Github,
  Twitter,
  Linkedin,
  ArrowRight,
  Code,
  MessageCircle,
  Star
} from 'lucide-react';

const About = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const stats = [
    { icon: Users, label: 'Active Roasters', value: '150K+' },
    { icon: Flame, label: 'Roasts Served', value: '2.5M+' },
    { icon: Trophy, label: 'Communities', value: '500+' },
    { icon: Target, label: 'Success Rate', value: '98%' }
  ];

  const values = [
    {
      icon: Flame,
      title: 'No Limits',
      description: 'We believe in roasting everything and everybody. No one is safe from our savage humor!'
    },
    {
      icon: Heart,
      title: 'Community First',
      description: 'Building a supportive environment where people can laugh at themselves and others.'
    },
    {
      icon: Zap,
      title: 'Pure Entertainment',
      description: 'Creating the most entertaining roasting experience through wit, humor, and savagery.'
    }
  ];

  const milestones = [
    {
      year: '2023',
      title: 'Platform Launch',
      description: 'RoastApp goes live, unleashing savage humor on the world'
    },
    {
      year: '2023',
      title: '100K Members',
      description: 'Reached our first major milestone of savage roasters'
    },
    {
      year: '2024',
      title: 'Mobile App Launch',
      description: 'Bringing the roasts to your pocket - nowhere is safe!'
    },
    {
      year: '2024',
      title: 'Global Expansion',
      description: 'Spreading the savagery across languages and cultures'
    }
  ];

  const testimonials = [
    {
      content: "RoastApp is like having a front-row seat to the world's most savage comedy show. Nobody is safe, and that's exactly how we like it!",
      author: {
        name: "Sarah Chen",
        role: "Professional Roaster",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      }
    },
    {
      content: "Finally, a platform where I can unleash my inner savage! The community here knows how to roast with style.",
      author: {
        name: "Alex Rodriguez",
        role: "Roast Master",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      }
    },
    {
      content: "Where else can you find a community that turns roasting into an art form? RoastApp is pure entertainment gold!",
      author: {
        name: "Jordan Taylor",
        role: "Comedy Enthusiast",
        avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-background-dark text-text-dark">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-on-scroll">
              Where Everyone Gets
              <span className="text-primary block mt-2">Roasted to Perfection</span>
            </h1>
            <p className="text-xl md:text-2xl opacity-80 mb-12 animate-on-scroll">
              Building the world's most savage roasting community. Nobody is safe!
            </p>
            <div className="flex flex-wrap justify-center gap-4 animate-on-scroll">
              <Link
                to="/auth"
                className="px-8 py-4 bg-primary text-background-dark rounded-lg font-medium hover:bg-primary-dark transition-colors inline-flex items-center group"
              >
                Join the Roast
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#contact"
                className="px-8 py-4 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-background-dark transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-y border-border-dark">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="text-center animate-on-scroll"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm opacity-60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <p className="text-lg opacity-80">
              Born from the idea that code reviews don't have to be boring, RoastApp combines technical expertise with humor to create a unique learning experience. We believe that sometimes the best way to learn is to laugh at our mistakes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {values.map((value, index) => (
              <div 
                key={index}
                className="bg-card-dark border border-border-dark rounded-xl p-6 animate-on-scroll"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <value.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="opacity-80">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-card-dark border-y border-border-dark">
        <div className="container mx-auto px-4 py-24">
          <h2 className="text-3xl font-bold text-center mb-16 animate-on-scroll">Our Journey</h2>
          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <div 
                key={index}
                className="flex items-start mb-12 last:mb-0 animate-on-scroll"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex-shrink-0 w-24 font-mono text-primary">{milestone.year}</div>
                <div className="flex-grow pl-8 border-l border-border-dark">
                  <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                  <p className="opacity-80">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="container mx-auto px-4 py-24">
        <h2 className="text-3xl font-bold text-center mb-16 animate-on-scroll">What Roasters Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-card-dark border border-border-dark rounded-xl p-6 animate-on-scroll"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.author.avatar}
                  alt={testimonial.author.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="ml-4">
                  <div className="font-medium">{testimonial.author.name}</div>
                  <div className="text-sm opacity-60">{testimonial.author.role}</div>
                </div>
              </div>
              <p className="opacity-80">{testimonial.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="bg-card-dark border-y border-border-dark">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 animate-on-scroll">
              <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
              <p className="text-lg opacity-80">
                Want to join the savagery? Have some spicy roasts to share? We'd love to hear from you!
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <a
                href="mailto:hello@roastapp.dev"
                className="flex items-center justify-center bg-background-dark border border-border-dark rounded-xl p-6 hover:border-primary transition-colors animate-on-scroll group"
              >
                <Mail className="w-6 h-6 text-primary mr-3" />
                <span className="group-hover:text-primary transition-colors">hello@roastapp.dev</span>
              </a>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-background-dark border border-border-dark rounded-xl p-6 hover:border-primary transition-colors animate-on-scroll group"
              >
                <MapPin className="w-6 h-6 text-primary mr-3" />
                <span className="group-hover:text-primary transition-colors">Everywhere we want</span>
              </a>
              <a
                href="https://roastapp.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-background-dark border border-border-dark rounded-xl p-6 hover:border-primary transition-colors animate-on-scroll group"
              >
                <Globe className="w-6 h-6 text-primary mr-3" />
                <span className="group-hover:text-primary transition-colors">roastapp.dev</span>
              </a>
            </div>

            <div className="flex justify-center space-x-6 animate-on-scroll">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full hover:bg-background-dark transition-colors"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full hover:bg-background-dark transition-colors"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full hover:bg-background-dark transition-colors"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center animate-on-scroll">
          <h2 className="text-3xl font-bold mb-6">Ready to Join the Savagery?</h2>
          <p className="text-lg opacity-80 mb-8">
            Join our community of savage roasters and unleash your inner comedian!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/auth"
              className="px-8 py-4 bg-primary text-background-dark rounded-lg font-medium hover:bg-primary-dark transition-colors inline-flex items-center group"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/communities"
              className="px-8 py-4 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-background-dark transition-colors"
            >
              Browse Communities
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;