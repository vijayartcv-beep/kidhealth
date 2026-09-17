import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API client lazily/safely
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    genAIClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Nutrition Chatbot Endpoint
app.post("/api/nutrition/chat", async (req, res) => {
  try {
    const { message, history, kidsProfile, currentMeals } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.status(503).json({
        error: "AI service is currently unavailable. Please configure GEMINI_API_KEY.",
        fallback: true,
      });
    }

    const systemInstruction = `You are "Dr. Poshan", an expert Indian Pediatric Clinical Nutritionist and Dietitian specializing in toddler and preschooler nutrition (ages 3 and 4) following ICMR-NIN (National Institute of Nutrition, India) guidelines.

FAMILY CONTEXT:
- Children personas:
  1. Girl: 4 years old (Preschooler, ICMR RDA ~1350 kcal, ~16g protein, ~550mg calcium, ~8mg iron, ~430mcg Vit A, ~30mg Vit C)
  2. Boy: 3 years old (Toddler/Preschooler, ICMR RDA ~1100-1200 kcal, ~13-15g protein, ~500mg calcium, ~8mg iron)
- Diet: Non-vegetarian (eats Eggs, Chicken, Mutton, Fish, Prawns, Crab, and other seafood).
- RESTRICTION: Absolutely NO beef or pork.
- Focus foods: High nutrition, covering all vitamins (A, B-Complex including B12, C, D, E, K) and minerals (Iron, Calcium, Zinc, Magnesium, Iodine, DHA/Omega-3).
- Must utilize local Indian ingredients:
  * Pulses & Lentils: Moong dal (yellow & green), Toor dal, Masoor, Chana dal, Kabuli chana, Kala chana, Rajma, Urad dal, sprouted pulses.
  * Green leafy vegetables: Moringa / Drumstick leaves (Murungai keerai), Palak, Methi, Amaranth (Chaulai/Thotakura), Gongura.
  * Nuts & Seeds: Soaked almonds (badam), cashew nuts (kaju), walnuts (akhrot), raisins (kishmish), dates (khajoor), makhana (fox nuts), sesame (til).
  * Non-veg: Farm/country eggs, tender chicken (with bones for soup/broth), soft mutton mince/shank, freshwater or coastal fish (Rohu, Pomfret, Mackerel/Bangda, Anchovies/Nethili, Seer fish/Vanjaram), small prawns, crab (soup or soft meat).
  * Healthy fats & dairy: A2/Cow milk, fresh curd/dahi, homemade paneer, pure desi cow ghee.
  * Grains: Idli/Dosa batter, Ragi (finger millet malt/roti), Foxtail millet, Brown/Red rice, Whole wheat phulkas, Poha, Upma.

GUIDANCE RULES:
1. Provide practical, warm, mother-and-child friendly advice.
2. When answering about foods (e.g. crab, prawns, fish), always include child safety tips (e.g., removing every tiny bone, testing for shellfish allergy with small quantity first, ensuring shrimp is deveined and tenderly cooked, making crab soup/rasam rather than hard shells).
3. If the user asks for substitutions, suggest items easily available in Indian local markets / kirana / coastal markets, along with regional names if helpful (e.g., Murungai Keerai for drumstick leaves, Nethili for Anchovies).
4. Explain how specific foods fulfill specific vitamins/minerals (e.g., "Moringa leaves provide high Iron, Calcium, and Vitamin A; Fish provides DHA for brain development and Vitamin D; Moong dal provides gentle easy-to-digest protein").
5. Keep answers well structured with concise bullet points, portion sizes suitable for 3-4 year olds, and encouraging advice. Avoid medical disclaimers unless discussing allergies or choking hazards.`;

    const userPrompt = `Current Context:
Kids: 4yo girl and 3yo boy.
User Question / Request: "${message}"

${kidsProfile ? `Kid Profile Details: ${JSON.stringify(kidsProfile)}` : ""}
${currentMeals ? `Current Sample Meals in Planner: ${JSON.stringify(currentMeals).slice(0, 500)}` : ""}

Provide a helpful, direct, and actionable pediatric nutrition response.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Error in /api/nutrition/chat:", error);
    res.status(500).json({
      error: error?.message || "Failed to generate AI response",
    });
  }
});

// AI Meal / Pulse Swap Advice
app.post("/api/nutrition/analyze-swap", async (req, res) => {
  try {
    const { addedItem, targetMeal, targetKidAge } = req.body;

    const ai = getGenAI();
    if (!ai) {
      return res.status(503).json({ error: "Gemini API unavailable" });
    }

    const prompt = `A parent of a ${targetKidAge || 4}-year-old child in India wants to add or swap "${addedItem}" into ${targetMeal || "their child's meal"}.
Provide:
1. Nutritional impact (which vitamins, protein, iron, or calcium does this boost?)
2. Child-friendly preparation tip for toddlers/preschoolers (how to cook so they accept it)
3. ICMR-NIN suitability (1-2 sentences)
Keep it brief, practical, and clear (under 120 words).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    res.json({ analysis: response.text });
  } catch (error: any) {
    console.error("Error in /api/nutrition/analyze-swap:", error);
    res.status(500).json({ error: error?.message || "Analysis failed" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NourishKids Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
