exports.handler = async function (event, context) {
  // Enable CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const { name, email, message } = JSON.parse(event.body || "{}");

    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing required fields (name, email, message)" }),
      };
    }

    const apiKey = process.env.MAILJET_API_KEY;
    const apiSecret = process.env.MAILJET_API_SECRET;
    const toEmail = process.env.TO_EMAIL;
    const fromEmail = process.env.FROM_EMAIL;

    // Check for missing credentials
    if (!apiKey || !apiSecret || !toEmail || !fromEmail) {
      console.error("Missing Mailjet configuration environment variables.");
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: "Mail server configuration error. Please ensure MAILJET_API_KEY, MAILJET_API_SECRET, TO_EMAIL, and FROM_EMAIL environment variables are set in Netlify.",
        }),
      };
    }

    // Call Mailjet Send API v3.1 using native fetch
    const response = await fetch("https://api.mailjet.com/v3.1/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + Buffer.from(apiKey + ":" + apiSecret).toString("base64"),
      },
      body: JSON.stringify({
        Messages: [
          {
            From: {
              Email: fromEmail,
              Name: "Sharad Sangha Website Form",
            },
            To: [
              {
                Email: toEmail,
                Name: "Sharad Sangha Admin",
              },
            ],
            Subject: `New Message from ${name} via Contact Form`,
            TextPart: `You have received a new message from ${name} (${email}):\n\n${message}`,
            HTMLPart: `
              <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eee; border-radius: 8px;">
                <h2 style="color: #8e1b1b; border-bottom: 2px solid #8e1b1b; padding-bottom: 10px; margin-top: 0;">New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Message:</strong></p>
                <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #a6de2d; white-space: pre-wrap; font-style: italic;">
                  ${message}
                </div>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 11px; color: #999; text-align: center; margin-bottom: 0;">
                  This email was sent automatically from the Sharad Sangha Contact Form.
                </p>
              </div>
            `,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Mailjet API error response:", data);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: "Failed to send email via Mailjet API", details: data }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Email sent successfully!", data }),
    };
  } catch (error) {
    console.error("Internal handler error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Internal Server Error", details: error.message }),
    };
  }
};
