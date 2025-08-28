import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleDocumentDesigns } from "./routes/document-designs";
import { handleDocumentTypes } from "./routes/document-types";
import {
  handleDocumentDesignTypeProxy,
  handleFormDesignListByDocTypeProxy,
  handleFormDesignVersionListProxy,
} from "./routes/form-design-proxy";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.get("/api/document-types", handleDocumentTypes);
  app.get("/api/form-design/document-types", handleDocumentDesignTypeProxy);
  app.get(
    "/api/form-design/designs-by-type/:docTypeId",
    handleFormDesignListByDocTypeProxy,
  );
  app.get(
    "/api/form-design/design-versions/:formDesignId",
    handleFormDesignVersionListProxy,
  );
  app.get("/api/document-designs/:type", handleDocumentDesigns);

  return app;
}
