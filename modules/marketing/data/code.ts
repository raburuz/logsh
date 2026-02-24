export type Languajes = 'javascript' | 'typescript' | 'python' | 'ruby' | 'php' | 'go' | 'java';
export const codeExamples: {
  [key in Languajes]: string
} = {
  javascript: `// Send Logsh Event
export const sendLogshEvent = async (data) => {
  const response = await fetch(
    'https://logsh.co/api/event',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer <YOUR_API_KEY>',
      },
      body: JSON.stringify({
        workspace: data.workspace,
        event: data.event,
        description: data.description,
        icon: data.icon,
        notify: data.notify,
        metadata: data.metadata,
      }),
    }
  );

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Failed to send event to Logsh');
  }
  return result;
};

// Usage
await sendLogshEvent({
  workspace: 'my-workspace',
  event: 'user_signup',
  description: 'New user registered',
  icon: '🎉',
  notify: true,
  metadata: { userId: '123', email: 'user@example.com' }
});`,
  typescript: `interface EventPayload {
  workspace: string;
  event: string;
  description: string;
  icon?: string;
  notify?: boolean;
  metadata?: Record<string, unknown>;
}

interface EventResponse {
  id: string;
  workspace: string;
  event: string;
  description: string;
  [key: string]: unknown;
}

export const sendLogshEvent = async (
  data: EventPayload
): Promise<EventResponse> => {
  const response = await fetch(
    'https://logsh.co/api/event',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer <YOUR_API_KEY>',
      },
      body: JSON.stringify({
        workspace: data.workspace,
        event: data.event,
        description: data.description,
        icon: data.icon,
        notify: data.notify,
        metadata: data.metadata,
      }),
    }
  );

  const result: EventResponse = await response.json();
  if (!response.ok) {
    throw new Error(result as unknown as string || 'Failed to send event to Logsh');
  }
  return result;
};

// Usage
const response = await sendLogshEvent({
  workspace: 'my-workspace',
  event: 'user_signup',
  description: 'New user registered',
  icon: '🎉',
  notify: true,
  metadata: { userId: '123', email: 'user@example.com' }
});

console.log(response.id);`,
  python: `# Send Logsh Event
import requests
import json

def send_logsh_event(data):
    url = 'https://logsh.co/api/event'
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer <YOUR_API_KEY>',
    }
    
    payload = {
        'workspace': data.get('workspace'),
        'event': data.get('event'),
        'description': data.get('description'),
        'icon': data.get('icon'),
        'notify': data.get('notify'),
        'metadata': data.get('metadata'),
    }
    
    response = requests.post(url, headers=headers, json=payload)
    result = response.json()
    
    if not response.ok:
        raise Exception(
            result.get('message', 'Failed to send event to Logsh')
        )
    return result

# Usage
send_logsh_event({
    'workspace': 'my-workspace',
    'event': 'user_signup',
    'description': 'New user registered',
    'icon': '🎉',
    'notify': True,
    'metadata': {'userId': '123', 'email': 'user@example.com'}
})`,
  ruby: `# Send Logsh Event
require 'httparty'
require 'json'

def send_logsh_event(data)
  url = 'https://logsh.co/api/event'
  headers = {
    'Content-Type' => 'application/json',
    'Authorization' => 'Bearer <YOUR_API_KEY>',
  }
  
  response = HTTParty.post(
    url,
    headers: headers,
    body: {
      workspace: data[:workspace],
      event: data[:event],
      description: data[:description],
      icon: data[:icon],
      notify: data[:notify],
      metadata: data[:metadata],
    }.to_json
  )
  
  result = JSON.parse(response.body)
  
  raise result['message'] || 'Failed to send event to Logsh' unless response.success?
  result
end

# Usage
send_logsh_event({
  workspace: 'my-workspace',
  event: 'user_signup',
  description: 'New user registered',
  icon: '🎉',
  notify: true,
  metadata: { userId: '123', email: 'user@example.com' }
})`,
  php: `<?php
// Send Logsh Event
function sendLogshEvent($data) {
  $url = 'https://logsh.co/api/event';
  
  $payload = array(
    'workspace' => $data['workspace'],
    'event' => $data['event'],
    'description' => $data['description'],
    'icon' => $data['icon'] ?? null,
    'notify' => $data['notify'] ?? false,
    'metadata' => $data['metadata'] ?? array(),
  );
  
  $options = array(
    'http' => array(
      'method' => 'POST',
      'header' => array(
        'Content-Type: application/json',
        'Authorization: Bearer <YOUR_API_KEY>',
      ),
      'content' => json_encode($payload),
    ),
  );
  
  $context = stream_context_create($options);
  $response = file_get_contents($url, false, $context);
  $result = json_decode($response, true);
  
  if ($result === null || isset($result['error'])) {
    throw new Exception(
      $result['message'] ?? 'Failed to send event to Logsh'
    );
  }
  return $result;
}

// Usage
$response = sendLogshEvent(array(
  'workspace' => 'my-workspace',
  'event' => 'user_signup',
  'description' => 'New user registered',
  'icon' => '🎉',
  'notify' => true,
  'metadata' => array('userId' => '123', 'email' => 'user@example.com')
));
?>`,
  go: `package main

import (
  "bytes"
  "encoding/json"
  "fmt"
  "io/ioutil"
  "net/http"
)

type EventPayload struct {
  Workspace   string                 \`json:"workspace"\`
  Event       string                 \`json:"event"\`
  Description string                 \`json:"description"\`
  Icon        string                 \`json:"icon,omitempty"\`
  Notify      bool                   \`json:"notify,omitempty"\`
  Metadata    map[string]interface{} \`json:"metadata,omitempty"\`
}

func sendLogshEvent(data EventPayload) (map[string]interface{}, error) {
  url := "https://logsh.co/api/event"
  
  payload, err := json.Marshal(data)
  if err != nil {
    return nil, err
  }
  
  req, err := http.NewRequest("POST", url, bytes.NewBuffer(payload))
  if err != nil {
    return nil, err
  }
  
  req.Header.Set("Content-Type", "application/json")
  req.Header.Set("Authorization", "Bearer <YOUR_API_KEY>")
  
  client := &http.Client{}
  resp, err := client.Do(req)
  if err != nil {
    return nil, err
  }
  defer resp.Body.Close()
  
  body, err := ioutil.ReadAll(resp.Body)
  if err != nil {
    return nil, err
  }
  
  var result map[string]interface{}
  if err := json.Unmarshal(body, &result); err != nil {
    return nil, err
  }
  
  if resp.StatusCode != http.StatusOK {
    return nil, fmt.Errorf("failed to send event: %v", result)
  }
  
  return result, nil
}

func main() {
  data := EventPayload{
    Workspace:   "my-workspace",
    Event:       "user_signup",
    Description: "New user registered",
    Icon:        "🎉",
    Notify:      true,
    Metadata: map[string]interface{}{
      "userId": "123",
      "email":  "user@example.com",
    },
  }
  
  result, err := sendLogshEvent(data)
  if err != nil {
    fmt.Printf("Error: %v\n", err)
    return
  }
  
  fmt.Printf("Response: %v\n", result)
}`,
  java: `import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

public class LogshClient {
  
  static class EventPayload {
    public String workspace;
    public String event;
    public String description;
    public String icon;
    public boolean notify;
    public JsonObject metadata;
    
    public EventPayload(String workspace, String event, String description,
                       String icon, boolean notify, JsonObject metadata) {
      this.workspace = workspace;
      this.event = event;
      this.description = description;
      this.icon = icon;
      this.notify = notify;
      this.metadata = metadata;
    }
  }
  
  public static JsonObject sendLogshEvent(EventPayload data) throws Exception {
    String url = "https://logsh.co/api/event";
    Gson gson = new Gson();
    
    String jsonPayload = gson.toJson(data);
    
    HttpURLConnection connection = (HttpURLConnection) new URL(url).openConnection();
    connection.setRequestMethod("POST");
    connection.setRequestProperty("Content-Type", "application/json");
    connection.setRequestProperty("Authorization", "Bearer <YOUR_API_KEY>");
    connection.setDoOutput(true);
    
    try (OutputStream os = connection.getOutputStream()) {
      byte[] input = jsonPayload.getBytes(StandardCharsets.UTF_8);
      os.write(input, 0, input.length);
    }
    
    int responseCode = connection.getResponseCode();
    String responseBody = new String(connection.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
    
    JsonObject result = gson.fromJson(responseBody, JsonObject.class);
    
    if (responseCode != 200) {
      throw new Exception("Failed to send event: " + result.toString());
    }
    
    return result;
  }
  
  public static void main(String[] args) throws Exception {
    JsonObject metadata = new JsonObject();
    metadata.addProperty("userId", "123");
    metadata.addProperty("email", "user@example.com");
    
    EventPayload data = new EventPayload(
      "my-workspace",
      "user_signup",
      "New user registered",
      "🎉",
      true,
      metadata
    );
    
    JsonObject response = sendLogshEvent(data);
    System.out.println("Response: " + response.toString());
  }
}`
};