# bitespeed-fluxkart TypeScript Project

This is a small Node.js project using TypeScript, designed to demonstrate the use of type definitions, services, and configuration.

## Features

-   TypeScript for type safety and better development experience.
-   Organized folder structure.
-   `/identify` endpoint to handle JSON payloads.

## Endpoints

### `POST https://bitespeed-fluxkart-b0at.onrender.com/identify`

**Description:** This endpoint is which was mentioned in assignment.

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
