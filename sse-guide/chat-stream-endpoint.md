# Chat Stream SSE Endpoint Documentation

This document provides details for the Server-Sent Events (SSE) endpoint used for sending and streaming chat messages.

<!-- @import "[TOC]" {cmd="toc" depthFrom=2 depthTo=6 orderedList=false} -->

## Table of Content

<!-- code_chunk_output -->

- [Table of Content](#table-of-content)
- [Endpoint Details](#endpoint-details)
- [Request Parameters (Query String)](#request-parameters-query-string)
- [Response Stream](#response-stream)
  - [Event Payload Structure](#event-payload-structure)
- [Example Frontend Implementation](#example-frontend-implementation)
  - [Recommended: Using `@sentool/fetch-event-source` (with Full Error Handling)](#recommended-using-sentoolfetch-event-source-with-full-error-handling)

<!-- /code_chunk_output -->

## Endpoint Details

- **Path:** `/chat/stream`

- **Method:** `GET` (SSE requests are implicitly `GET`)
- **Protocol:** Server-Sent Events (SSE)
- **Authentication:** Required. The endpoint extracts the authenticated user (`@GetUser()`).
  - *Note for Native `EventSource`:* Since the native browser `EventSource` API does not support custom HTTP headers (like `Authorization: Bearer ...`), ensure you are passing the authentication token via a supported method (e.g., query parameters, cookies, or using a polyfill library like `@sentool/fetch-event-source` if headers are strictly required by the backend).

---

## Request Parameters (Query String)

The endpoint accepts data via URL Query Parameters, mapped to the `CreateMessageDto`.

| Field | Type | Required | Description | Validation / Constraints |
| :--- | :--- | :---: | :--- | :--- |
| `chatId` | `string` | **Yes** | The unique identifier of the chat. | Must be a valid UUID. |
| `content` | `string` | **Yes** | The textual content of the message. | Minimum 1 character, Maximum 10,000 characters. |
| `fileIds` | `string[]` | No | A list of file identifiers attached to the message. | Each item must be a valid UUID v4. It can be passed as a comma-separated string (e.g., `&fileIds=id1,id2`), or as array parameters. Defaults to an empty array `[]` if omitted. |

---

## Response Stream

Once the connection is established, the server will stream chunks of data as `MessageEvent` objects.

### Event Payload Structure

Each event received from the stream will have its data formatted as follows:

```json
{
  "data": { ... }, // The actual data chunk payload (structure depends on messageService.sendMessage response)
  "type": "message" // String indicating the chunk type. Defaults to 'message' if no type is provided by the backend stream.
}
```

---

## Example Frontend Implementation

Here is an example of how to connect and listen to this endpoint using the native JavaScript `EventSource` API:

```javascript
// Request parameters
const chatId = '123e4567-e89b-12d3-a456-426614174000';
const content = encodeURIComponent('Hello, this is a message');
const fileIds = 'id1,id2'; // Comma-separated or array handled by backend Transform

// Construct URL with query parameters
const baseUrl = 'https://gateway.moeenlaw.com/chats/api/v1/messages/chat/stream';
const url = `${baseUrl}+?chatId=${chatId}&content=${content}&fileIds=${fileIds}`;

// Initialize SSE connection
const eventSource = new EventSource(url);

// Connection opened
eventSource.onopen = () => {
  console.log('Successfully connected to the chat stream.');
};

// Listen for incoming messages
eventSource.onmessage = (event) => {
  try {
    // Both SSE events and the NestJS MessageEvent map their payload to `event.data`
    // Depending on the serialization, you may need to parse the JSON
    const payload = JSON.parse(event.data);
    
    console.log('Chunk Type:', payload.type);
    console.log('Chunk Data:', payload.data);

    // Update the UI with the streaming chunk data here
    // e.g., append text to a message bubble
  } catch (error) {
    console.error('Failed to parse incoming streaming chunk:', error);
  }
};

// Handle errors or connection drops
eventSource.onerror = (error) => {
  console.error('SSE connection error:', error);
  // Optional: eventSource.close() to prevent infinite automatic reconnections on fatal errors
};
```

### Recommended: Using `@sentool/fetch-event-source` (with Full Error Handling)

If your backend requires adding an `Authorization` header instead of URL queries or cookies, or if you need robust connection management and error handling, it is highly recommended to use [fetch-event-source](https://www.npmjs.com/package/@sentool/fetch-event-sourcee):

```javascript
import { fetchEventSource } from '@sentool/fetch-event-source';

async function connectToChatStream() {
  const chatId = '123e4567-e89b-12d3-a456-426614174000';
  const content = encodeURIComponent('Hello, this is a message');
  const url = `https://gateway.moeenlaw.com/chats/api/v1/messages/chat/stream?chatId=${chatId}&content=${content}`;

  const ctrl = new AbortController();

  try {
    await fetchEventSource(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${yourToken}`,
        'Accept': 'text/event-stream',
      },
      signal: ctrl.signal,

      // 1. Handle initial connection errors (e.g., 400 Bad Request, 401 Unauthorized)
      async onopen(response) {
        if (response.ok && response.headers.get('content-type')?.includes('text/event-stream')) {
          console.log('Successfully connected to the chat stream.');
          return; // Everything is good
        }

        // The endpoint returned an error (often a JSON object like NestJS exceptions)
        let errorPayload;
        try {
          // Attempt to parse validation errors or HTTP exceptions (e.g., JSON error object)
          errorPayload = await response.json();
        } catch (e) {
          // Fallback to text if the error isn't valid JSON
          errorPayload = await response.text();
        }

        console.error('Initial connection failed:', response.status, errorPayload);

        // Throwing an error here prevents the library from automatically retrying
        throw new Error(`Failed to connect: ${response.statusText}`);
      },

      // 2. Handle incoming successful messages
      onmessage(ev) {
        try {
          const payload = ev;

          console.log('Chunk Type:', payload.event);
          console.log('Chunk Data:', payload.data);

          /**
           * Example output:
           * ```
           * Chunk Type: message
           * Chunk Data: لذا، لا يمكنني تقديم إجابة قانونية بناءً على السؤال أو المواد المتاحة. يرجى طرح سؤال قانوني محدد وواضح لتتم
           * ```
           *
           * ```
           * Chunk Type: error
           * Chunk Data: خدمة الذكاء الاصطناعي غير متاحة مؤقتاً. يرجى المحاولة لاحقاً.
           * ```
           */

          // Update the UI with streaming chunk data
        } catch (error) {
           console.error('Failed to parse incoming streaming chunk data:', error);
        }
      },

      // 3. Handle stream-level errors or connection drops
      onerror(err) {
        console.error('Connection encountered an error:', err);

        // The error might be emitted as a text string or a JSON object
        let parsedError = err;

        if (typeof err === 'string') {
          try {
            parsedError = JSON.parse(err);
          } catch (e) {
             // It's just a text error, leave parsedError as string
          }
        } else if (err?.data) {
           // If the error detail is nested inside a `data` property
           try {
              parsedError = JSON.parse(err.data);
           } catch (e) {
              parsedError = err.data;
           }
        }

        console.error('Parsed stream error details:', parsedError);

        // Optionally, rethrow to stop fetchEventSource from automatically retrying,
        // or return nothing to let it attempt to reconnect.
        if (parsedError?.statusCode && parsedError.statusCode >= 400 && parsedError.statusCode < 500) {
            // Do not retry on client-side errors like 401 or 403
            throw new Error('Fatal stream error, do not retry.');
        }
      },

      onclose() {
        console.log('Connection closed by the server.');
        // By default fetchEventSource will retry on close if you don't throw an error in onerror.
        // If the server deliberately ended the stream because it finished, throw to stop retrying:
        throw new Error('Stream ended normally.');
      }
    });
  } catch (error) {
    console.error('Chat stream implementation caught a fatal error:', error);
    // Handle the final failure in your UI
  }
  // To manually abort the stream later from outside the function:
  // ctrl.abort();
}

connectToChatStream();
```

You can also use a CDN to include it.

```html
<script src="https://unpkg.com/@sentool/fetch-event-source/dist/index.min.js"></script>
<script type="module">
  const { fetchEventSource } = FetchEventSource;
  fetchEventSource(url, options);
</script>
```
