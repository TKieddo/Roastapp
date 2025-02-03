import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Sparkles, Code, Terminal, Cpu, Zap, Flame, Users, Trophy } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 hero-gradient"></div>

      {/* Geometric Shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 geometric-shape rounded-full rotating opacity-20"></div>
        <div className="absolute top-40 right-20 w-48 h-48 geometric-shape rounded-full rotating opacity-20" style={{ animationDirection: 'reverse' }}></div>
        <div className="absolute bottom-20 left-1/3 w-32 h-32 geometric-shape rounded-full rotating opacity-20"></div>
      </div>

      {/* Code Particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
          <Code className="w-8 h-8 text-primary opacity-30 floating" style={{ animationDelay: '0s' }} />
        </div>
        <div className="absolute top-1/3 right-1/4 transform translate-x-1/2 -translate-y-1/2">
          <Terminal className="w-6 h-6 text-primary opacity-30 floating" style={{ animationDelay: '1s' }} />
        </div>
        <div className="absolute bottom-1/4 left-1/3 transform -translate-x-1/2 translate-y-1/2">
          <Cpu className="w-10 h-10 text-primary opacity-30 floating" style={{ animationDelay: '2s' }} />
        </div>
        <div className="absolute bottom-1/3 right-1/3 transform translate-x-1/2 translate-y-1/2">
          <Zap className="w-7 h-7 text-primary opacity-30 floating" style={{ animationDelay: '3s' }} />
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative py-32 container mx-auto px-component text-center">
        <div className="inline-block mb-8 relative">
          <div className="absolute inset-0 bg-primary opacity-20 blur-2xl rounded-full pulsing"></div>
          <Award className="w-24 h-24 text-primary mb-4 floating" />
        </div>

        <div className="relative inline-block">
          <h1 className="text-7xl font-mono font-bold text-primary mb-8 hero-text-glow">
            Roast or Be Roasted.
            <br />
            <span className="relative">
              No Mercy.
              <div className="absolute -right-12 top-0 transform translate-x-full">
                <Sparkles className="w-12 h-12 text-primary pulsing" />
              </div>
            </span>
          </h1>
        </div>

        <p className="text-2xl text-text-dark font-mono mb-16 max-w-3xl mx-auto leading-relaxed opacity-80">
          Join the wildest roasting community.
          <br />
          Upvote the best burns. Climb the leaderboard.
        </p>

        <div className="relative inline-block group">
          <div className="absolute inset-0 bg-primary opacity-20 blur-xl rounded-lg group-hover:opacity-40 transition-opacity"></div>
          <Link
            to="/auth"
            className="relative inline-flex items-center px-12 py-6 bg-primary text-background-dark font-mono font-bold rounded-lg hover:bg-primary-dark transition-all transform hover:scale-105 hero-button-glow"
          >
            <Sparkles className="w-6 h-6 mr-3" />
            <span className="text-xl">Join the Roast</span>
          </Link>
        </div>

        {/* Stats Preview */}
        <div className="mt-24 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 blur-xl rounded-lg transition-opacity"></div>
            <div className="relative bg-card-dark border border-border-dark rounded-lg p-6">
              <Flame className="w-8 h-8 text-primary mb-4 mx-auto" />
              <div className="text-3xl font-bold text-primary mb-2">2.5M+</div>
              <div className="text-sm text-text-dark opacity-60">Roasts Served</div>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 blur-xl rounded-lg transition-opacity"></div>
            <div className="relative bg-card-dark border border-border-dark rounded-lg p-6">
              <Users className="w-8 h-8 text-primary mb-4 mx-auto" />
              <div className="text-3xl font-bold text-primary mb-2">150K+</div>
              <div className="text-sm text-text-dark opacity-60">Active Roasters</div>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 blur-xl rounded-lg transition-opacity"></div>
            <div className="relative bg-card-dark border border-border-dark rounded-lg p-6">
              <Trophy className="w-8 h-8 text-primary mb-4 mx-auto" />
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-text-dark opacity-60">Communities</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;