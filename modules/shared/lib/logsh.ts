export const logsh = async (data: {
  workspace: string,
  event: string,
  description: string,
  color?: string,
}) => {

  const apiKey = process.env.LOGSH_API_KEY;

  if ( !apiKey ) {
    console.warn("Logsh API key is not set. Skipping log.");
    return;
  }

  try {
    await fetch("https://logsh.co/api/event", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workspace: data.workspace,
        event: data.event,
        description: data.description,
        color: data.color,
      }),
    })
    
  } catch (error) {
    console.error("Failed to send log to Logsh:", error);
  }

}