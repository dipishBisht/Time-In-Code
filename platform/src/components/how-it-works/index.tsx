'use client';
import { motion } from "motion/react";
import { Download, Key, BarChart3, Code } from "lucide-react";

const steps = [
  { icon: Download, label: "Install Extension", desc: "One command, 30 seconds" },
  { icon: Key, label: "Generate Token", desc: "Authenticate securely" },
  { icon: BarChart3, label: "View Stats", desc: "Beautiful dashboard" },
  { icon: Code, label: "Embed in Portfolio", desc: "Share your progress" },
];

export default function HowItWorks() {
  return (
    <section className="py-24 md:py-32 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Up and running in 5 minutes
          </h2>
          <p className="text-lg text-muted-foreground">
            Four simple steps to start tracking your coding time.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="relative inline-flex mb-5">
                <div className="step-number text-sm">{i + 1}</div>
              </div>
              <div className="flex justify-center mb-3">
                <step.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">{step.label}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
