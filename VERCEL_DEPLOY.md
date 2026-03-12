# Deploy Portfolio to Vercel (with Gmail Contact Form)

Follow these steps in order. Do not skip any step.

---

## Step 1: Have Your Repo on GitHub

- Your code should already be on GitHub: **https://github.com/Pradeep7-Rai/pradeep_portfolio**
- If you made new changes, push them:
  ```bash
  git add .
  git commit -m "Your message"
  git push origin main
  ```

---

## Step 2: Get a Gmail App Password (if you don’t have one)

You cannot use your normal Gmail password. You need an **App Password**.

1. Open **https://myaccount.google.com** and sign in.
2. Turn on **2-Step Verification** (Security → How you sign in to Google).
3. After 2-Step is on, go to **Security** → **2-Step Verification** → at the bottom, **App passwords**.
4. Choose **Mail** and **Other (Custom name)** → type e.g. `Vercel Portfolio` → **Generate**.
5. Copy the **16-character password** (e.g. `abcd efgh ijkl mnop`). Save it somewhere safe; you’ll use it in Step 6.

---

## Step 3: Sign in to Vercel with GitHub

1. Go to **https://vercel.com**.
2. Click **Sign Up** (or **Log In** if you have an account).
3. Choose **Continue with GitHub**.
4. Authorize Vercel when GitHub asks. You only need to do this once.

---

## Step 4: Import Your GitHub Repository

1. On Vercel, click **Add New…** → **Project** (or **Import Project**).
2. You should see a list of your GitHub repos. Find **Pradeep7-Rai/pradeep_portfolio** (or `pradeep_portfolio`).
3. Click **Import** next to that repo.
4. On the **Configure Project** page:
   - **Project Name**: leave as `pradeep-portfolio` (or change if you like).
   - **Framework Preset**: should be **Next.js** (Vercel detects it). Do not change.
   - **Root Directory**: leave **empty** (use repo root).
   - **Build and Output Settings**: leave defaults (no need to edit).
5. **Do not click Deploy yet.** Go to the next step first to add environment variables.

---

## Step 5: Add Environment Variables (before first deploy)

1. On the same **Configure Project** page, find the section **Environment Variables**.
2. For each variable below, add one row:
   - **Name**: `GMAIL_USER`  
     **Value**: your full Gmail address (e.g. `pradeep7.rai.7@gmail.com`)  
     **Environment**: leave all three checked (Production, Preview, Development), or at least **Production**.
   - Click **Add** or **Save**.
   - **Name**: `GMAIL_APP_PASSWORD`  
     **Value**: the 16-character App Password from Step 2 (you can paste with or without spaces).  
     **Environment**: same as above.
   - Click **Add** or **Save**.
3. Double-check:
   - Names are exactly: `GMAIL_USER` and `GMAIL_APP_PASSWORD` (no typos, no extra spaces).
   - Values are correct (correct Gmail, correct app password).
4. Then click **Deploy**.

---

## Step 6: Wait for Deploy and Get Your URL

1. Vercel will build and deploy. Wait until you see **Congratulations** or **Your project has been deployed**.
2. Click **Visit** (or the project URL). Your portfolio will open, e.g. `https://pradeep-portfolio.vercel.app`.
3. You can share this URL. Every new push to `main` will trigger a new deploy automatically.

---

## Step 7: Test the Contact Form

1. On your live Vercel URL, open the **Contact** section.
2. Fill in **Name**, **Email**, and **Message** and click **Send Message**.
3. Check the Gmail inbox for `GMAIL_USER`. You should receive the message.
4. If you get an error:
   - In Vercel: go to your project → **Settings** → **Environment Variables** and confirm both variables are set.
   - Fix if needed, then go to **Deployments** → click the **⋯** on the latest deployment → **Redeploy** (or push a small commit to trigger a new deploy).

---

## Optional: Add or Change Env Vars Later

1. Vercel dashboard → your project **pradeep_portfolio**.
2. **Settings** → **Environment Variables**.
3. Add new variables or edit existing ones.
4. **Redeploy** for changes to apply: **Deployments** → **⋯** on latest → **Redeploy**.

---

## Quick Checklist

- [ ] Repo is on GitHub and up to date.
- [ ] Gmail 2-Step Verification is on.
- [ ] Gmail App Password created and copied.
- [ ] Signed in to Vercel with GitHub.
- [ ] Imported `pradeep_portfolio` repo.
- [ ] Added `GMAIL_USER` and `GMAIL_APP_PASSWORD` before clicking Deploy.
- [ ] Deploy finished successfully.
- [ ] Contact form tested and email received.

You’re done. Your portfolio is live and the contact form sends emails to your Gmail without ever putting `.env.local` or secrets in GitHub.
