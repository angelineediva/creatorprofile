# Wording Rules — Content Style Guide

Mirrored from the Yapp-Product-KB vault (`05-Design-System/Wording Rules - Content Style Guide.md`) so this repo's docs read consistently with the rest of Yapp's GitBook. If the source of truth changes, update it there first, then copy the change here.

## 1. Voice & tone

- **Talk to one person.** Always "you," never "users" or "the creator." → *"Add your first product"* not *"Users can add a product."*
- **Present tense, active voice.** → *"Click Publish"* not *"The Publish button should be clicked."*
- **Be direct, not cute.** Skip exclamation points and hype ("Awesome!", "Let's go!"). One encouraging line at the start of a tutorial is enough; the rest is instruction.
- **Assume no prior context.** Don't reference internal team names, ticket numbers, or "as discussed" — the reader only has this page.
- **Short sentences.** If a sentence needs a comma to explain a comma, split it into two sentences.

## 2. Terminology (use exactly these — don't vary)

| Use this | Not this |
|---|---|
| Creator | seller, vendor, user (when referring to a Yapp creator) |
| Buyer | customer, user (when referring to a purchaser) |
| Yapp Page | profile page, storefront, link page |
| Digital Product | item, product listing (unless distinguishing from physical) |
| Membership | subscription (unless referring to the billing mechanism specifically) |
| Promo Code | discount code, coupon |

If a new term shows up, add it to this table in the same edit — don't let a second synonym slip in.

## 3. Capitalization

- **Sentence case for headings and buttons in prose**: "Add a promo code," not "Add A Promo Code."
- **Title Case only for the literal name of a UI element** you're telling the reader to click, matched to what's on screen: click **Create Product**, not click **create product**.
- Product nouns (Yapp Page, Digital Product, Membership) are always capitalized, in headings or prose.

## 4. Formatting conventions

- **Bold** UI labels the reader interacts with: click **Publish**, open **Settings**.
- Use numbered steps for anything sequential — never bullet a sequence.
- One action per step. If a step says "and," it's probably two steps.
- Use GitBook **hint/callout blocks** for:
  - 💡 Tips (optional, nice-to-know)
  - ⚠️ Warnings (irreversible actions, things that cost money, things that affect buyers)
- Screenshots go *after* the step they illustrate, not before.

## 5. Standard tutorial page structure

Applies only to task-based tutorial pages (e.g. "How to Create a Promo Code"). **Does not apply to this repo's README** — it's technical/spec documentation, not an end-user tutorial, so skip forcing a "Steps" structure onto it. Keep its existing spec/reference shape; apply sections 1–4 (voice, terminology, capitalization, formatting) instead.

## 6. Do / Don't examples

| Don't | Do |
|---|---|
| "The user is required to input their email address in the designated field." | "Enter your email." |
| "Promo codes can be configured by creators to provide discounts." | "Create a promo code to give buyers a discount." |
| "Click on the 'Settings' Button" | "Click **Settings**." |
| "This will permanently and irrevocably delete all data associated with the item." | "⚠️ This deletes the product for good — you can't undo it." |
