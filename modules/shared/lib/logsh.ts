import { isProduction } from "../utils/constraint";

const apiUrl = process.env.LOGSH_API_URL ?? "http://localhost:3000";
const apiKey = process.env.LOGSH_API_KEY;

export const sendToLogsh = async (data: {
  workspace: string,
  event: string,
  description: string,
  icon?: string,
  metadata?: Record<string, any>,
  notify?: boolean,
}): Promise<{ success: boolean; error?: string }> => {

  if ( !apiKey ) {
    console.warn("Logsh API key is not set. Skipping log, Please config the LOGSH_API_KEY environment variable.");
    return { success: false, error: "Logsh API key is not set" };
  }

  try {
    const response = await fetch(
      `${apiUrl}/api/event`, 
        {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workspace: isProduction ? data.workspace : `${data.workspace}_dev`,
          event: data.event,
          description: data.description,
          icon: data.icon,
          metadata: data.metadata,
          notify: data.notify ?? false,
        }),
      });

    if (!response.ok) {
      throw new Error(`Failed to send log to Logsh: ${response.statusText}`);
    }

    return {
      success: true,
    }
    
  } catch (error) {
    const err = error as Error;
    console.error(err.message ?? "An unknown error occurred while sending log to Logsh.");
    return { success: false, error: err.message };
  }

}