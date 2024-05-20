# bitespeed-fluxkart TypeScript Project

This is a small Node.js project using TypeScript, designed to demonstrate the use of type definitions, services, and configuration.

## Features

-   TypeScript for type safety and better development experience.
-   Organized folder structure.
-   `/identify` endpoint to handle JSON payloads.

## Endpoints

### `POST https://bitespeed-fluxkart-b0at.onrender.com/identify`


> **Important Note:**
> This endpoint is hosted on Render's free tier, which goes to sleep after 15 minutes of inactivity. When the API is accessed after it has gone to sleep, it takes approximately 40 seconds to 1 minute to restart the service and respond. Once the service starts running, subsequent responses are quick.


**Description:** The endpoint which was mentioned in assignment for Identity Reconciliation.

**Request:**

-   **URL:** `https://bitespeed-fluxkart-b0at.onrender.com/identify`
-   **Method:** `POST`
-   **Headers:** `Content-Type: application/json`
-   **Body:**

    ```json
    {
        "email": "george@hillvalley1.edu",
        "phoneNumber": "7171711"
    }
    ```
