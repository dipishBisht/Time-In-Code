import React from "react";

interface ICard {
  title: string;
  children: React.ReactNode;
}

export default function Card({ title, children }: ICard) {
  return (
    <div className="rounded-xl border bg-card p-6 card-elevated">
      <h3 className="font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}
