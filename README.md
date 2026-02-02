# DHL Shipment Tracking MCP Server 🚚📦
**Powered by Microsoft Copilot Studio ❤️ MCP**

[![smithery badge](https://smithery.ai/badge/@benbonn/utapimcp)](https://smithery.ai/server/@benbonn/utapimcp)

This project provides an **MCP (Model Context Protocol) Server** exposing a **DHL Shipment Tracking tool** that can be used by **Microsoft Copilot Studio**, **GitHub Copilot Agents**, or any other MCP‑compatible client.

It is based on the official **Microsoft MCP Streamable HTTP Template**, but the server logic has been replaced with a production‑ready DHL shipment tracking integration.

---

## ✨ What This Server Does

The server exposes one MCP Tool: **track-shipment**

### 🔧 `track-shipment`
Tracks a DHL shipment using the official DHL REST API.

**Parameters:**

| Name            | Type   | Description                      |
|-----------------|--------|----------------------------------|
| trackingNumber  | string | The DHL tracking number          |
| apiKey          | string | User-provided DHL API key        |

**Response:**  
Formatted JSON output from the DHL API, suitable for LLM processing.

---

## ⚙️ How It Works

The server is built on:

- Express.js for HTTP routing  
- Model Context Protocol SDK for defining tools  
- Streamable HTTP Transport for Copilot Studio compatibility  
- Zod for schema validation  

MCP clients communicate via:

POST /mcp

If you open /mcp in the browser, seeing this means the server is working:

{"jsonrpc":"2.0","error":{"code":-32000,"message":"Method not allowed."},"id":null}

---

## 📁 Project Structure

src/  
  server.ts     ← DHL MCP server implementation  
assets/         ← Optional images  
infra/          ← Azure deployment template (from Microsoft)  
README.md

---

## 🏃‍♂️ Run the MCP Server Locally

Install and start:

npm install  
npm run build && npm run start

Server runs on:

http://localhost:3000

### Using VS Code Dev Tunnels (Recommended for Copilot Studio)

1. Start the server  
2. Open VS Code Terminal → PORTS  
3. Forward port 3000  
4. Set visibility to Public  
5. Use the forwarded URL ending in /mcp, e.g.:

https://abc-3000.devtunnels.ms/mcp

---

## 🌐 Deploy to Azure (Optional)

Login:

azd auth login

Deploy:

azd up

Remove everything later:

azd down

---

## 🤖 Using the DHL MCP Server in Visual Studio Code

1. Open Command Palette  
2. Run: MCP: Add Server  
3. Choose HTTP / SSE  
4. Enter your URL ending in /mcp  
5. Name it e.g. DHLTracking  
6. Open GitHub Copilot → Agent Mode  
7. Enable the tool  

Ask:

Track shipment 00340434161234567890 using API key XYZ.

---

## 🧠 Use in Microsoft Copilot Studio

1. Open Custom Connectors  
2. Import from GitHub  
3. Set the connector host to your tunnel/Azure URL  
4. Create or open an Agent  
5. Add the MCP Server under Tools → Model Context Protocol  
6. Create a connection  
7. Test with:

Track shipment 00340434161234567890.

---

## 🔐 Authentication Notes

The user must provide their own DHL API key.  
The server does not store, log, or cache the API key.

---

## 📦 Example MCP Tool Invocation

{
  "method": "tools.call",
  "params": {
    "name": "track-shipment",
    "arguments": {
      "trackingNumber": "0034043416XXXXXXX",
      "apiKey": "<YOUR_KEY>"
    }
  }
}

---

## 🧰 Template Reference

This project is originally based on:

Microsoft MCP Streamable HTTP Template  
https://github.com/microsoft/mcsmcp

Only the server logic was replaced to support DHL tracking.

---

## 🗣 Feedback & Contributions

Contributions are welcome.  
For Microsoft MCP feedback, use the upstream template repo.

---

## ™ Trademarks

DHL trademarks belong to DHL and are used only for demo/integration purposes.  
Microsoft trademarks follow Microsoft’s standard brand guidelines.
