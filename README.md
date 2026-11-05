# posycam.io

Static marketing, privacy and support pages for PosyCam, served by GitHub Pages at <https://posycam.io>.

No build step: plain HTML, one stylesheet and one script.

| Path | Page |
| --- | --- |
| `index.html` | Landing page |
| `privacy/index.html` | Privacy policy (App Store and Google Play privacy URL: `https://posycam.io/privacy/`) |
| `support/index.html` | Support (App Store support URL: `https://posycam.io/support/`) |
| `404.html` | Not-found page |
| `CNAME` | Custom domain for GitHub Pages |
| `.nojekyll` | Serve files as-is, without Jekyll |

## Preview locally

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>. You can also open `index.html` straight from disk: pages use relative paths. The exception is `404.html`, which uses root paths because GitHub Pages serves it at any missing URL.

## Publish

1. Push to `main`.
2. In the repository's **Settings → Pages**, set the source to **Deploy from a branch**, branch `main`, folder `/ (root)`. The custom domain is read from `CNAME`.
3. At the domain registrar, add these DNS records for `posycam.io`:

   | Type | Host | Value |
   | --- | --- | --- |
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | AAAA | `@` | `2606:50c0:8000::153` |
   | AAAA | `@` | `2606:50c0:8001::153` |
   | AAAA | `@` | `2606:50c0:8002::153` |
   | AAAA | `@` | `2606:50c0:8003::153` |
   | CNAME | `www` | `seankcw.github.io` |

4. Verify the domain under your GitHub account's **Settings → Pages → Add a domain**. GitHub asks for a TXT record; this stops other accounts from claiming the domain.
5. Once the certificate is issued, tick **Enforce HTTPS** in the repository's Pages settings.

## Before launch

- Replace the highlighted `[developer or company legal name]` in `privacy/index.html`.
- Make sure `support@posycam.io` receives mail (most registrars offer free forwarding).
- Keep the privacy policy in step with the app, the App Store privacy label and the Play Data safety form. The policy describes the app as of 5 November 2026; Beauty (face retouching) is not covered because it is turned off in every build.
- Swap the "Email me at launch" buttons for App Store links when the app is live.

## Images

The people and scenes are generated sample images from the app repository's prototype (`design/prototype/public/photos/SOURCES.md`), not photos taken with PosyCam. The landscape (Luca Bravo) and architecture (Saba) photographs are from Unsplash under the Unsplash License. Credits are in the landing page footer.
