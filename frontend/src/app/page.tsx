import { TxList } from "@/components/TxList";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, Activity, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-16 mb-16">
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-12 text-white">
          <h1 className="text-5xl font-bold mb-6">
            Track Your OnChain Footprint
          </h1>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Explore blockchain transactions, analyze patterns, and understand
            your digital footprint across multiple networks.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-100"
            >
              <Link href="/activity">Explore Activity</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="transition-transform hover:scale-105">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Transaction Analysis</CardTitle>
              <CardDescription>
                Deep dive into transaction details with comprehensive metadata
                and insights.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="transition-transform hover:scale-105">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Activity Tracking</CardTitle>
              <CardDescription>
                Monitor wallet activity across multiple blockchain networks in
                real-time.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="transition-transform hover:scale-105">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Real-time Updates</CardTitle>
              <CardDescription>
                Get instant notifications and updates on your blockchain
                transactions.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
    </div>
  );
}
