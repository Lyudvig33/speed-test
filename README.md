# speed-test

Console script (Node.js, no dependencies) that measures download speed.

It makes 10 sequential requests to the given URL, waits for each response body
to be fully downloaded, then prints the average request time, total data
downloaded and the download speed.

## Requirements

Node.js 18+ (uses the built-in `fetch`).

## Usage

```bash
node speed-test.js <url>
# example
node speed-test.js 'https://speed.cloudflare.com/__down?bytes=5000000'   # 5 MB test file
```

Example output:

```
Request 1/10: 5.00 MB in 410 ms
...
---
Average request time: 376 ms
Total downloaded:     50.00 MB (50000000 bytes)
Download speed:       106.51 Mbit/s
```

## Units

- Time: milliseconds (ms).
- Data size: megabytes (MB, 1 MB = 1,000,000 bytes).
- Speed: **megabits per second (Mbit/s)** = total bits downloaded / total time
  spent in requests (the same unit ISPs use).

The script exits with an error if the URL is invalid or any request fails.
Note: some hosts (e.g. Wikimedia) rate-limit repeated downloads with HTTP 429.
Requests send `Cache-Control: no-cache`, but a CDN may still serve from its cache.
