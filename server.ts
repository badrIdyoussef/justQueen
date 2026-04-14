import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Route for order submission
  app.post("/api/order", async (req, res) => {
    const { name, phone, address, city, product, size, color, price } = req.body;

    console.log("New Order Received:", { name, phone, address, city });

    if (!resend) {
      console.warn("RESEND_API_KEY is not set. Email not sent.");
      return res.json({ 
        success: true, 
        message: "Order received (Simulation: No API Key set)" 
      });
    }

    try {
      if (!resend) {
        throw new Error("RESEND_API_KEY is missing. Please add it to your environment variables.");
      }

      const { data, error } = await resend.emails.send({
        from: "JustQueen Store <onboarding@resend.dev>",
        to: ["soukaina.youssef34@gmail.com"],
        subject: `New Order from ${name}`,
        html: `
          <h1>New Order Details</h1>
          <p><strong>Customer Name:</strong> ${name}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Address:</strong> ${address}</p>
          <p><strong>City:</strong> ${city}</p>
          <hr />
          <p><strong>Product:</strong> ${product}</p>
          <p><strong>Size:</strong> ${size}</p>
          <p><strong>Color:</strong> ${color}</p>
          <p><strong>Total Price:</strong> ${price} درهم</p>
        `,
      });

      if (error) {
        console.error("Resend Error:", error);
        return res.status(400).json({ 
          success: false, 
          error: `Email Error: ${error.message}. Make sure your API key is valid and you are sending to a verified email.` 
        });
      }

      res.json({ success: true, data });
    } catch (err) {
      console.error("Server Error:", err);
      res.status(500).json({ 
        success: false, 
        error: err instanceof Error ? err.message : "Internal Server Error" 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
