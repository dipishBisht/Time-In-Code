'use client';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-24 md:py-32 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to track your coding time?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Get started in 5 minutes. No account required. Completely free.
          </p>
          <Button size="lg" className="gap-2 text-base px-8" asChild>
            <Link href="/docs/quick-start">
              Start Tracking
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
