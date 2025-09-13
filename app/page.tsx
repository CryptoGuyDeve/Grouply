import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import {
  BluetoothSearching,
  MessageCircle,
  Shield,
  Users,
  Video,
  Zap,
} from "lucide-react";
import FeatureIcon from "@/components/FeatureIcon";

export default function Home() {
  return (
    <div>
      <Header />

      <main className="flex-1 flex flex-col items-center px-4 py-16 sm:px-6 text-center gap-20">
        <div className="max-w-4xl space-y-8 relative">
          {/* Background gradient */}
          <div className="absolute inset-0 -z-10 bg-background-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-20 dark:to-purple-950/20 rounded-3xl blur-3xl scale-150 opacity-60"></div>

          <div className="max-w-4xl space-y-8 relative">
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400">
              Connect and Collaborate
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                with Grouplyy.
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              The ultimate platform to create, manage, and collaborate in
              groups.
              <br />
              Effortlessly organize projects, share ideas, and achieve more
              together.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  size="lg"
                  className="text-lg px-10 py-6 h-auto rounded-full shadow-xl font-semibold tracking-tight transition-all duration-200 transform hover:scale-105 active:scale-100 focus:ring-4 focus:ring-primary/30 focus:outline-none"
                >
                  Start Chatting Free
                </Button>
              </SignInButton>
            </SignedOut>
          </div>

          {/* Social Proof */}
          <div className="pt-8">
            <p className="text-sm text-muted-foreground mb-4">
              Trusted by thousands of users worldwide
            </p>
            <div className="flex justify-center items-center gap-8 text-muted-foreground">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">50k+</div>
                <div className="text-sm">Active Users</div>
              </div>
              <div className="w-px h-8 bg-border"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">1M+</div>
                <div className="text-sm">Messages Sent</div>
              </div>
              <div className="w-px h-8 bg-border"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">99.9%</div>
                <div className="text-sm">Uptime</div>
              </div>
            </div>
          </div>

          {/* Enhanced features section */}
          <div className="w-full max-w-6xl">
            {/* Section Divider */}
            <div className="w-full flex items-center justify-center mb-16">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
              <div className="px-6">
                <div className="w-2 h-2 rounded-full bg-primary/60"></div>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
            </div>

            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Everything you need to stay connected
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Grouplyy offers a suite of powerful features designed to enhance
                your collaboration experience.
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
                title="Fast Performance"
                description="Experience fast messaging and video calls with minimal latency."
              />
            </div>
          </div>

          {/* Enhanced CTA section */}
          <div className="w-full max-w-4xl">
            <div className="rounded-2xl border bg-gradient-to-br from-primary/5 to-primary/10 p-12 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to elevate your group interactions?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of users who already enjoy seamless group
                interactions with Grouplyy. Start your journey today! -
                Completely free to use.
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <SignedOut>
                  <SignUpButton mode="modal">
                    <Button size="lg" className="text-lg px-8 py-6 h-auto">
                      Get Started Free
                    </Button>
                  </SignUpButton>
                </SignedOut>
              </div>

              <div className="flex justify-center flex-col sm:flex-row items-center gap-6 mt-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Free forever plan available
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Setup in 30 seconds
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full bg-white/80 dark:bg-muted/60 border-t-0 shadow-[0_-2px_24px_0_rgba(80,80,120,0.06)] mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-10 sm:gap-0">
            <div className="text-center sm:text-left">
              <span className="text-2xl font-extrabold tracking-tight">Grouplyy</span>
              <p className="text-base text-muted-foreground mt-2 font-medium">
                The future of group collaboration.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <a
                href="#"
                className="px-4 py-2 rounded-full bg-muted/60 hover:bg-muted/80 text-sm font-semibold text-foreground transition-all shadow-sm border border-transparent hover:border-primary"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="px-4 py-2 rounded-full bg-muted/60 hover:bg-muted/80 text-sm font-semibold text-foreground transition-all shadow-sm border border-transparent hover:border-primary"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="px-4 py-2 rounded-full bg-muted/60 hover:bg-muted/80 text-sm font-semibold text-foreground transition-all shadow-sm border border-transparent hover:border-primary"
              >
                Support
              </a>
            </div>
          </div>
          <div className="border-t mt-10 pt-6 text-center">
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              © 2025 Grouplyy. All rights reserved. We have no affiliation with Meta or Facebook. Any usage of their assets, trademarks, or products is purely for demonstrative purposes. This is a personal project and is not endorsed by or affiliated with any official entities.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
