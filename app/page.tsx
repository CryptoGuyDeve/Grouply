'use client'
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import {
  BluetoothSearching,
  ChartArea,
  MessageCircle,
  Shield,
  Users,
  Video,
  Zap,
} from "lucide-react";
import FeatureIcon from "@/components/FeatureIcon";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="flex-1 flex flex-col items-center px-4 py-20 sm:px-6 text-center gap-24">
        <div className="max-w-6xl space-y-12 relative">
          {/* Modern Background Elements */}
          <div className="absolute inset-0 -z-10">
            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23000000%22%20fill-opacity%3D%220.02%22%3E%3Cpath%20d%3D%22M0%200h40v40H0z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-60"></div>

            {/* Modern Geometric Shapes */}
            <div className="absolute top-20 right-20 w-32 h-32 border border-black/5 rounded-2xl rotate-12"></div>
            <div className="absolute bottom-32 left-16 w-24 h-24 border border-black/5 rounded-full"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-black/3 rounded-lg rotate-45"></div>
          </div>

          <div className="max-w-6xl space-y-12 relative">
            {/* Modern Badge */}
            <div className="inline-flex items-center space-x-3 bg-black text-white rounded-full px-6 py-3 mb-8">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold">Now Available - Desktop App v2.1.0</span>
            </div>

            <h1 className="text-7xl sm:text-8xl font-black tracking-tight text-black leading-[0.9]">
              Connect and Collaborate
              <br />
              <span className="relative">
                with Grouplyy.
                <div className="absolute -bottom-4 left-0 w-full h-2 bg-black rounded-full"></div>
              </span>
            </h1>
            <p className="text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-light">
              The ultimate platform to create, manage, and collaborate in groups.
              <br />
              <span className="text-black font-semibold">Effortlessly organize projects, share ideas, and achieve more together.</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 pt-8">
            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  size="lg"
                  className="group bg-black hover:bg-gray-800 text-white text-xl px-12 py-6 h-auto rounded-3xl shadow-2xl font-bold tracking-tight transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 focus:ring-4 focus:ring-black/30 focus:outline-none"
                >
                  <Zap className="w-6 h-6 mr-3" />
                  Start Chatting Free
                </Button>
              </SignInButton>
            </SignedOut>

            <Button
              variant="outline"
              size="lg"
              className="group bg-white border-2 border-black text-black hover:bg-black hover:text-white text-xl px-12 py-6 h-auto rounded-3xl font-bold tracking-tight transition-all duration-300 transform hover:scale-105 hover:-translate-y-2"
              onClick={() => {
                router.push('/dashboard');
              }}
            >
              <ChartArea className="w-6 h-6 mr-3" />
              Have you already Signed In?
            </Button>
          </div>

          {/* Modern Social Proof */}
          <div className="pt-12">
            <p className="text-sm text-gray-600 mb-8 font-medium">
              Trusted by thousands of users worldwide
            </p>
            <div className="flex justify-center items-center gap-12 text-gray-600">
              <div className="text-center">
                <div className="text-4xl font-black text-black">250+</div>
                <div className="text-sm font-medium">Active Users</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-4xl font-black text-black">14k+</div>
                <div className="text-sm font-medium">Messages Sent</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-4xl font-black text-black">99.9%</div>
                <div className="text-sm font-medium">Uptime</div>
              </div>
            </div>
          </div>

          {/* Modern Features Section */}
          <div className="w-full max-w-7xl">
            {/* Section Divider */}
            <div className="w-full flex items-center justify-center mb-20">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              <div className="px-8">
                <div className="w-3 h-3 rounded-full bg-black"></div>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            </div>

            <div className="text-center mb-20">
              <h2 className="text-5xl sm:text-6xl font-black mb-8 text-black">
                Everything you need to stay connected
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto font-light">
                Grouplyy offers a comprehensive suite of powerful features designed to enhance
                your collaboration experience and boost productivity.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              <FeatureIcon
                icon={MessageCircle}
                title="Real-time Messaging"
                description="Engage in seamless conversations with instant messaging and notifications."
              />
              <FeatureIcon
                icon={Video}
                title="HD Video Calls"
                description="Experience high-definition video calls for clear and engaging conversations."
              />
              <FeatureIcon
                icon={Shield}
                title="Privacy First"
                description="Your privacy is our top priority. Enjoy secure messaging and video calls."
              />
              <FeatureIcon
                icon={Users}
                title="Group Chats"
                description="Create and manage group chats for team collaboration and socializing."
              />
              <FeatureIcon
                icon={Zap}
                title="Lightning Fast"
                description="Experience lightning-fast messaging and video calls with minimal latency."
              />
              <FeatureIcon
                icon={BluetoothSearching}
                title="Cross-Platform"
                description="Access your conversations seamlessly across all your devices."
              />
            </div>
          </div>

          {/* Modern CTA Section */}
          <div className="w-full flex justify-center items-center py-20">
            <div className="w-full max-w-5xl">
              <div className="rounded-3xl border-2 border-black bg-white p-16 text-center shadow-2xl">
                <h2 className="text-4xl sm:text-5xl font-black mb-6 text-black">
                  Ready to elevate your group interactions?
                </h2>
                <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto font-light">
                  Join thousands of users who already enjoy seamless group
                  interactions with Grouplyy. Start your journey today!
                  <br />
                  <span className="text-black font-semibold">
                    Completely free to use.
                  </span>
                </p>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-12">
                  <SignedOut>
                    <SignUpButton mode="modal">
                      <Button
                        size="lg"
                        className="bg-black hover:bg-gray-800 text-white text-xl px-12 py-6 h-auto rounded-3xl font-bold shadow-2xl hover:shadow-black/25 transition-all duration-300 transform hover:scale-105 hover:-translate-y-2"
                      >
                        <Zap className="w-6 h-6 mr-3" />
                        Get Started Free
                      </Button>
                    </SignUpButton>
                  </SignedOut>

                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-white border-2 border-black text-black hover:bg-black hover:text-white text-xl px-12 py-6 h-auto rounded-3xl font-bold transition-all duration-300 transform hover:scale-105 hover:-translate-y-2"

                  >
                    <Users className="w-6 h-6 mr-3" />
                    Learn More
                  </Button>
                </div>

                <div className="flex justify-center flex-col sm:flex-row items-center gap-8 text-sm text-gray-600">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="font-semibold">No credit card required</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="font-semibold">Free forever plan available</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="font-semibold">Setup in 30 seconds</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <footer className="w-full bg-white border-t-2 border-black mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-12 sm:gap-0">
            <div className="text-center sm:text-left">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">G</span>
                </div>
                <span className="text-3xl font-black tracking-tight text-black">Grouplyy</span>
              </div>
              <p className="text-lg text-gray-700 font-medium">
                The future of group collaboration.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <a
                href="#"
                className="px-6 py-3 rounded-2xl bg-gray-50 hover:bg-black hover:text-white text-sm font-bold text-black transition-all duration-300 border border-gray-200 hover:border-black"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="px-6 py-3 rounded-2xl bg-gray-50 hover:bg-black hover:text-white text-sm font-bold text-black transition-all duration-300 border border-gray-200 hover:border-black"
              >
                Terms of Service
              </a>
              <a
                href="/team"
                className="px-6 py-3 rounded-2xl bg-gray-50 hover:bg-black hover:text-white text-sm font-bold text-black transition-all duration-300 border border-gray-200 hover:border-black"
              >
                Team
              </a>
              <a
                href="#"
                className="px-6 py-3 rounded-2xl bg-gray-50 hover:bg-black hover:text-white text-sm font-bold text-black transition-all duration-300 border border-gray-200 hover:border-black"
              >
                Support
              </a>
            </div>
          </div>
          <div className="border-t-2 border-gray-200 mt-12 pt-8 text-center">
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              © 2025 Grouplyy. All rights reserved. We have no affiliation with Meta or Facebook. Any usage of their assets, trademarks, or products is purely for demonstrative purposes. This is a personal project and is not endorsed by or affiliated with any official entities.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
