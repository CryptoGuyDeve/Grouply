"use client";

import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { ArrowRight, Clock, CheckCircle, DollarSign, Phone, Users, TrendingUp, Flame, Star, Calendar, Zap, Sparkles, Layers, Globe, Shield, Rocket, Play, Pause, Volume2, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ElectronApp() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    setIsAnimating(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-20 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header with Social Proof */}
        <div className="pt-8 px-6">
          <div className={`flex items-center justify-center mb-8 transition-all duration-1000 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 border-2 border-white shadow-lg"></div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 border-2 border-white shadow-lg"></div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-red-500 border-2 border-white shadow-lg"></div>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-white font-medium">+5K Businesses Rely On Grouplyy</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center px-6 pb-20">
          <div className="max-w-6xl w-full">
            {/* Main Headline */}
            <div className={`text-center mb-12 transition-all duration-1000 delay-300 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
                <Rocket className="w-5 h-5 text-blue-400" />
                <span className="text-sm font-medium text-blue-300">Desktop App v2.1.0</span>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Welcome to{" "}
                <span className="relative bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Grouplyy
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                </span>
                <br />
                <span className="text-4xl md:text-5xl font-light text-gray-300">Desktop Experience</span>
              </h1>
              
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                You just opened the app! Continue to enjoy seamless group collaboration with our powerful desktop experience.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row items-center justify-center gap-6 mb-16 transition-all duration-1000 delay-500 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <Button 
                className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-10 py-5 text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                onClick={() => {
                  router.push('/dashboard');
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative flex items-center">
                  <Zap className="w-6 h-6 mr-3" />
                  Continue to App
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="group bg-white/10 backdrop-blur-md border-2 border-white/30 text-white hover:bg-white/20 px-10 py-5 text-lg font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                onClick={() => {
                  window.open('https://github.com/CryptoGuyDeve/Grouply', '_blank');
                }}
              >
                <div className="flex items-center">
                  <Download className="w-6 h-6 mr-3" />
                  Download Latest
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </Button>
            </div>

            {/* Floating Cards Grid */}
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto transition-all duration-1000 delay-700 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              {/* Top Left - App Performance */}
              <div 
                className={`group relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 hover:border-white/40 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 ${hoveredCard === 'performance' ? 'shadow-blue-500/25' : ''}`}
                onMouseEnter={() => setHoveredCard('performance')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="absolute top-6 right-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">App Performance</h3>
                <p className="text-sm text-gray-300 mb-6">Current Session</p>
                
                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-32 h-32">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="6"
                        fill="none"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="url(#gradient1)"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray="251.2"
                        strokeDashoffset="50.24"
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <defs>
                      <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                        <Flame className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">80%</div>
                  <p className="text-sm text-gray-300">App is running smoothly with optimal performance.</p>
                </div>
              </div>

              {/* Top Right - Messages Chart */}
              <div 
                className={`group relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 hover:border-white/40 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 ${hoveredCard === 'messages' ? 'shadow-green-500/25' : ''}`}
                onMouseEnter={() => setHoveredCard('messages')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="absolute top-6 right-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Messages & Activity</h3>
                <p className="text-sm text-gray-300 mb-6">Today's Activity</p>
                
                <div className="space-y-6">
                  <div className="flex items-end justify-between h-40">
                    <div className="flex flex-col items-center group/bar">
                      <div className="w-10 bg-gradient-to-t from-gray-600 to-gray-400 rounded-t-lg h-16 mb-3 group-hover/bar:from-blue-500 group-hover/bar:to-blue-400 transition-all duration-300"></div>
                      <span className="text-xs text-gray-400">Mon</span>
                    </div>
                    <div className="flex flex-col items-center group/bar">
                      <div className="w-10 bg-gradient-to-t from-gray-600 to-gray-400 rounded-t-lg h-20 mb-3 group-hover/bar:from-blue-500 group-hover/bar:to-blue-400 transition-all duration-300"></div>
                      <span className="text-xs text-gray-400">Tue</span>
                    </div>
                    <div className="flex flex-col items-center group/bar">
                      <div className="w-10 bg-gradient-to-t from-green-500 to-emerald-400 rounded-t-lg h-28 mb-3 relative group-hover/bar:scale-110 transition-all duration-300">
                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-green-400">34%</span>
                      </div>
                      <span className="text-xs text-gray-400">Wed</span>
                    </div>
                    <div className="flex flex-col items-center group/bar">
                      <div className="w-10 bg-gradient-to-t from-gray-600 to-gray-400 rounded-t-lg h-18 mb-3 group-hover/bar:from-blue-500 group-hover/bar:to-blue-400 transition-all duration-300"></div>
                      <span className="text-xs text-gray-400">Thu</span>
                    </div>
                    <div className="flex flex-col items-center group/bar">
                      <div className="w-10 bg-gradient-to-t from-gray-600 to-gray-400 rounded-t-lg h-14 mb-3 group-hover/bar:from-blue-500 group-hover/bar:to-blue-400 transition-all duration-300"></div>
                      <span className="text-xs text-gray-400">Fri</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>50</span>
                    <span>100</span>
                    <span>150</span>
                  </div>
                </div>
              </div>

              {/* Bottom Left - App Features */}
              <div 
                className={`group relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 hover:border-white/40 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 ${hoveredCard === 'features' ? 'shadow-purple-500/25' : ''}`}
                onMouseEnter={() => setHoveredCard('features')}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="absolute bottom-6 left-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Layers className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-3">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">App Features</h3>
                </div>
                <p className="text-sm text-gray-300 mb-6">Available Features: Real-time Chat, Video Calls</p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center bg-white/5 rounded-xl p-3">
                    <span className="text-sm text-gray-300">50+ Active Groups</span>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 rounded-xl p-3">
                    <span className="text-sm text-gray-300">1M+ Messages Sent</span>
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 rounded-xl p-3">
                    <span className="text-sm text-gray-300">4.8/5 User Rating</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-white/5 rounded-xl p-3">
                    <span className="text-sm text-gray-300">99.9% Uptime</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-400 mb-6">App Version 2.1.0</p>
                
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl py-3 font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
                  Open Dashboard
                </Button>
              </div>

              {/* Bottom Right - User Profiles */}
              <div className="space-y-6">
                {/* Main Profile Card */}
                <div 
                  className={`group relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 hover:border-white/40 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 ${hoveredCard === 'profile1' ? 'shadow-pink-500/25' : ''}`}
                  onMouseEnter={() => setHoveredCard('profile1')}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="absolute top-6 left-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      CG
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-white">Cheyenne Gouse</h4>
                      <p className="text-sm text-gray-300">+91 9800000000</p>
                      <div className="flex items-center mt-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                        <span className="text-xs text-green-400">Online</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secondary Profile Card */}
                <div 
                  className={`group relative bg-white/5 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/10 hover:border-white/30 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 -mt-4 ml-8 ${hoveredCard === 'profile2' ? 'shadow-blue-500/25' : ''}`}
                  onMouseEnter={() => setHoveredCard('profile2')}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-400 to-green-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      RK
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Roger Kanter</h4>
                      <p className="text-xs text-gray-300">+91 9800000001</p>
                      <div className="flex items-center mt-1">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
                        <span className="text-xs text-yellow-400">Away</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`text-center pb-8 transition-all duration-1000 delay-1000 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20">
            <Globe className="w-5 h-5 text-blue-400" />
            <p className="text-gray-300">
              Ready to continue? <span className="font-bold text-white">4,000+</span> users are already collaborating
            </p>
          </div>
        </div>

        {/* Auth Buttons - Hidden but functional */}
        <div className="fixed bottom-6 right-6 space-y-3">
          <SignInButton mode="modal" forceRedirectUrl="/dashboard">
            <Button 
              variant="outline" 
              className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Sign In
            </Button>
          </SignInButton>

          <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Sign Up
            </Button>
          </SignUpButton>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
