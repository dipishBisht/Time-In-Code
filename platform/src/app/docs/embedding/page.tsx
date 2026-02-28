import CodeBlock from "@/components/docs/code-block";

export default function Embedding() {
  return (
    <div>
      <h1>Embedding Stats</h1>
      <p>Add your coding stats to your portfolio, blog, or any website.</p>

      <div className="mt-6 p-4 rounded-lg border bg-primary/5">
        <p className="text-sm font-medium mb-2">🔑 Finding Your GitHub ID</p>
        <p className="text-sm text-muted-foreground">
          Run <code>&quot;Time in Code: Show Account Info&quot;</code> in VS
          Code to get your GitHub ID (numeric, not your username).
        </p>
      </div>

      <h2>React / Next.js</h2>
      <CodeBlock
        language="tsx"
        title="CodingStats.tsx"
        code={`'use client';
import { useEffect, useState } from 'react';

export default function CodingStats() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    // Replace YOUR_GITHUB_ID with your actual GitHub ID
    fetch('https://time-in-code.vercel.app/api/stats/YOUR_GITHUB_ID?limit=30')
      .then(r => r.json())
      .then(setStats);
  }, []);

  if (!stats) return <p>Loading stats...</p>;

  return (
    <div>
      <h2>My Coding Stats</h2>
      <p>{Math.floor(stats.totalSeconds / 3600)} hours tracked</p>
      <p>{stats.totalDays} days active</p>
      <p>Top language: {stats.data[0]?.languages ? Object.keys(stats.data[0].languages)[0] : 'N/A'}</p>
    </div>
  );
}`}
      />

      <h2>HTML / Vanilla JavaScript</h2>
      <CodeBlock
        language="html"
        title="index.html"
        code={`<div id="coding-stats">Loading...</div>
<script>
  fetch('https://time-in-code.vercel.app/api/stats/YOUR_GITHUB_ID?limit=30')
    .then(r => r.json())
    .then(stats => {
      document.getElementById('coding-stats').innerHTML = \`
        <h2>My Coding Stats</h2>
        <p>\${Math.floor(stats.totalSeconds / 3600)} hours tracked</p>
        <p>\${stats.totalDays} days active</p>
      \`;
    });
</script>`}
      />

      <h2>Vue</h2>
      <CodeBlock
        language="html"
        title="CodingStats.vue"
        code={`<template>
  <div v-if="stats">
    <h2>My Coding Stats</h2>
    <p>{{ Math.floor(stats.totalSeconds / 3600) }} hours tracked</p>
    <p>{{ stats.totalDays }} days active</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const stats = ref(null);

onMounted(async () => {
  const res = await fetch(
    'https://time-in-code.vercel.app/api/stats/YOUR_GITHUB_ID?limit=30'
  );
  stats.value = await res.json();
});
</script>`}
      />

      <h2>Svelte</h2>
      <CodeBlock
        language="html"
        title="CodingStats.svelte"
        code={`<script>
  import { onMount } from 'svelte';
  let stats = null;

  onMount(async () => {
    const res = await fetch(
      'https://time-in-code.vercel.app/api/stats/YOUR_GITHUB_ID?limit=30'
    );
    stats = await res.json();
  });
</script>

{#if stats}
  <div>
    <h2>My Coding Stats</h2>
    <p>{Math.floor(stats.totalSeconds / 3600)} hours tracked</p>
    <p>{stats.totalDays} days active</p>
  </div>
{/if}`}
      />

      <h2>Embed Dashboard Directly</h2>
      <p>You can also embed the full dashboard using an iframe:</p>
      <CodeBlock
        language="html"
        title="iframe embed"
        code={`<iframe 
  src="https://time-in-code.vercel.app/dashboard/YOUR_GITHUB_ID" 
  width="100%" 
  height="800px" 
  frameborder="0"
></iframe>`}
      />

      <div className="mt-8 p-6 rounded-xl border bg-muted/30">
        <h3>Response Format</h3>
        <p className="text-sm text-muted-foreground mt-1">
          The API returns <code>githubId</code>, <code>userName</code>, and{" "}
          <code>avatarUrl</code> along with stats. You can use these to display
          the user&apos;s GitHub profile info alongside their coding stats.
        </p>
      </div>
    </div>
  );
}
