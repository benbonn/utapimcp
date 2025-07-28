import express, { Request, Response } from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";

const server = new McpServer({
  name: "mcp-streamable-http",
  version: "1.0.0",
});

// DHL Shipment Tracking Tool
const trackShipment = server.tool(
  "track-shipment",
  "Track a shipment using DHL API",
  {
    trackingNumber: z.string().describe("The tracking number for the shipment"),
    apiKey: z.string().describe("User's DHL API key"),
  },
  async (params: { trackingNumber: string; apiKey: string }) => {
    const response = await fetch(`https://api-eu.dhl.com/track/shipments/${params.trackingNumber}`, {
      headers: {
        "DHL-API-Key": params.apiKey,
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching shipment: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2), // Format the response for better readability
        },
      ],
    };
  }
);

const app = express();
app.use(express.json());

const transport: StreamableHTTPServerTransport =
  new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // set to undefined for stateless servers
  });

// Setup routes for the server
const setupServer = async () => {
  await server.connect(transport);
};

app.post("/mcp", async (req: Request, res: Response) => {
  console.log("Received MCP request:", req.body);
  try {
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("Error handling MCP request:", error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: "Internal server error",
        },
        id: null,
      });
    }
  }
});

// Other routes (GET, DELETE) remain unchanged...

// Start the server
const PORT = process.env.PORT || 3000;
setupServer()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`MCP Streamable HTTP Server listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to set up the server:", error);
    process.exit(1);
  });
