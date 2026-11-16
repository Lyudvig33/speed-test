#!/usr/bin/env node
'use strict';

const REQUESTS = 10;

async function download(url) {
  const start = process.hrtime.bigint();
  const res = await fetch(url, { headers: { 'Cache-Control': 'no-cache' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

  let bytes = 0;
  for await (const chunk of res.body) bytes += chunk.length; // wait for the full body
  const ms = Number(process.hrtime.bigint() - start) / 1e6;
  return { bytes, ms };
}

async function main() {
  const url = process.argv[2];
  if (!url) {
    console.error('Usage: node speed-test.js <url>');
    process.exit(1);
  }
  try {
    new URL(url);
  } catch {
    console.error(`Invalid URL: ${url}`);
    process.exit(1);
  }

  let totalBytes = 0;
  let totalMs = 0;

  for (let i = 1; i <= REQUESTS; i++) {
    try {
      const { bytes, ms } = await download(url);
      totalBytes += bytes;
      totalMs += ms;
      console.log(`Request ${i}/${REQUESTS}: ${(bytes / 1e6).toFixed(2)} MB in ${ms.toFixed(0)} ms`);
    } catch (err) {
      console.error(`Request ${i}/${REQUESTS} failed: ${err.cause?.message || err.message}`);
      process.exit(1);
    }
  }

  const avgMs = totalMs / REQUESTS;
  const mbit = (totalBytes * 8) / 1e6 / (totalMs / 1000);

  console.log('---');
  console.log(`Average request time: ${avgMs.toFixed(0)} ms`);
  console.log(`Total downloaded:     ${(totalBytes / 1e6).toFixed(2)} MB (${totalBytes} bytes)`);
  console.log(`Download speed:       ${mbit.toFixed(2)} Mbit/s`);
}

main();
