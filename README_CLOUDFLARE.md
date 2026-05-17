# Deploying ShopVerse to Cloudflare Pages

To ensure your application and photo uploads work correctly on Cloudflare Pages, follow these steps:

## 1. Cloudflare Project Setup
- **Build Command:** `npm run build`
- **Build Output Directory:** `dist`
- **Node.js Version:** Use at least version 18.

## 2. Environment Variables
You must add the following variable in the Cloudflare Pages dashboard (**Settings > Variables and Secrets**):

| Variable Name | Value |
|---------------|-------|
| `IMAGEKIT_PRIVATE_KEY` | Your ImageKit private key (e.g., `private_...`) |

## 3. Upload System
The app is configured to use **Cloudflare Pages Functions** located in the `/functions` folder. This acts as a secure proxy for ImageKit, so your private keys are never exposed to the browser.

## 4. Troubleshooting Photo Uploads
- **File Size:** We have a 5MB limit in the frontend to ensure stability.
- **CORS:** Cloudflare Functions handle the communication with ImageKit, so you don't need to worry about CORS issues in the browser.
- **Timeout:** Large uploads might time out on the Cloudflare Free plan (10s limit). If this happens, consider using smaller images or upgrading your Cloudflare plan.
