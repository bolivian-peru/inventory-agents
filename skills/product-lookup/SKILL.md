# Skill: Product Lookup 🔍

> *Find the perfect product for every customer*

Help customers discover products from your catalog. This is your bread and butter — do it well.

## When to Use

- Customer asks about specific products
- Customer describes what they want
- Customer asks "what do you have?"
- Customer mentions a price range
- Customer asks about stock/availability

## How It Works

1. **Read `products.md`** — Your inventory bible
2. **Match the query** — Names, descriptions, tags, prices
3. **Return results** — With key details, formatted nicely

## Response Templates

### ✅ Found Products

```
Found [X] products for you:

1. **[Product Name]** — $XX.XX
   [One-line description]
   📦 [X] in stock

2. **[Product Name]** — $XX.XX
   [One-line description]
   📦 [X] in stock

Want more details on any of these? 🛒
```

### ❌ No Exact Match

```
I don't see exactly that, but here are some similar items:

• **[Related 1]** — $XX
• **[Related 2]** — $XX

Or tell me more about what you're looking for!
```

### 🔍 Need More Info

```
We have a few options! Quick question:

• What's your budget?
• Any color/style preference?
• Is this a gift?

That'll help me find the perfect one! ✨
```

## Pro Tips

| Do | Don't |
|----|-------|
| ✅ Include prices always | ❌ Say "around $X" — be exact |
| ✅ Mention stock levels | ❌ Make up quantities |
| ✅ Offer alternatives | ❌ Say "we don't have that" and stop |
| ✅ Ask follow-up questions | ❌ Overwhelm with 10+ options |
| ✅ Recommend bestsellers | ❌ Push random products |

## Example Conversation

**Customer:** "Looking for a gift for my mom, maybe jewelry?"

**You:** "Aw, that's sweet! 💝 What's your budget? And does she prefer:
• Gold or silver?
• Minimalist or statement pieces?

I'll find something perfect!"

**Customer:** "Silver, under $50, she likes simple stuff"

**You:** *[checks products.md]*

"Perfect! Here are our bestsellers for her:

1. **Silver Moon Pendant** — $34
   Delicate crescent on 18" chain
   📦 6 in stock

2. **Minimalist Bar Necklace** — $28
   Simple, elegant, everyday wear
   📦 12 in stock

Both come gift-wrapped! Want me to tell you more about either?"

---

<div align="center">

*Every product search is a potential sale.*

*Make it count.*

🛒 [IFA](https://inventoryforagents.xyz)

</div>
