# 3DS API Examples

## Complete Examples for Using the 3DS API System

This document provides practical examples for using the API system in your 3DS applications.

---

## Basic API Usage

### Example 1: Simple Echo Test

```c
#include <stdio.h>
#include <string.h>
#include <3ds.h>
#include "api.h"

int main(int argc, char* argv[])
{
    gfxInitDefault();
    consoleInit(GFX_TOP, NULL);
    
    // Initialize API
    if (api_init() != API_SUCCESS) {
        printf("Failed to initialize API!\n");
        goto cleanup;
    }
    
    printf("API Status: %s\n\n", api_get_status());
    
    // Create echo request
    api_request_t req = {0};
    api_response_t res = {0};
    
    req.cmd = 0x00; // Echo command
    strcpy(req.data, "Hello from 3DS!");
    
    // Process request
    if (api_process(&req, &res) == API_SUCCESS) {
        printf("Success: %s\n", res.data);
    } else {
        printf("API Error!\n");
    }
    
    printf("\nPress START to exit.\n");
    
    while (aptMainLoop())
    {
        hidScanInput();
        if (hidKeysDown() & KEY_START)
            break;
        
        gfxFlushBuffers();
        gfxSwapBuffers();
        gspWaitForVBlank();
    }
    
cleanup:
    api_shutdown();
    gfxExit();
    return 0;
}
```

---

## Example 2: Version Information

```c
#include <stdio.h>
#include <3ds.h>
#include "api.h"

int main(int argc, char* argv[])
{
    gfxInitDefault();
    consoleInit(GFX_TOP, NULL);
    
    api_init();
    
    // Get API version
    uint32_t version;
    if (api_get_version(&version) == API_SUCCESS) {
        printf("API Version: 0x%08X\n", version);
        printf("Major: %d\n", (version >> 16) & 0xFF);
        printf("Minor: %d\n", (version >> 8) & 0xFF);
        printf("Patch: %d\n", version & 0xFF);
    }
    
    // Get system info via API command
    api_request_t req = {0};
    api_response_t res = {0};
    
    req.cmd = 0x02; // Get system info
    
    if (api_process(&req, &res) == API_SUCCESS) {
        printf("\n%s\n", res.data);
    }
    
    printf("\nPress START to exit.\n");
    
    while (aptMainLoop())
    {
        hidScanInput();
        if (hidKeysDown() & KEY_START)
            break;
        
        gfxFlushBuffers();
        gfxSwapBuffers();
        gspWaitForVBlank();
    }
    
    api_shutdown();
    gfxExit();
    return 0;
}
```

---

## Example 3: Interactive API Menu

```c
#include <stdio.h>
#include <string.h>
#include <3ds.h>
#include "api.h"

void clearScreen() {
    printf("\x1b[2J"); // Clear screen
    printf("\x1b[0;0H"); // Move cursor to top
}

int main(int argc, char* argv[])
{
    gfxInitDefault();
    consoleInit(GFX_TOP, NULL);
    
    api_init();
    
    int selectedOption = 0;
    
    while (aptMainLoop())
    {
        clearScreen();
        
        printf("3DS API Demo\n");
        printf("============\n\n");
        printf("Status: %s\n\n", api_get_status());
        
        printf("%s 1. Echo Test\n", selectedOption == 0 ? ">" : " ");
        printf("%s 2. Get Version\n", selectedOption == 1 ? ">" : " ");
        printf("%s 3. System Info\n", selectedOption == 2 ? ">" : " ");
        printf("%s 4. Exit\n", selectedOption == 3 ? ">" : " ");
        
        printf("\nUse D-Pad Up/Down, A to select\n");
        
        hidScanInput();
        u32 kDown = hidKeysDown();
        
        if (kDown & KEY_UP) {
            selectedOption = (selectedOption - 1 + 4) % 4;
        }
        if (kDown & KEY_DOWN) {
            selectedOption = (selectedOption + 1) % 4;
        }
        
        if (kDown & KEY_A) {
            api_request_t req = {0};
            api_response_t res = {0};
            
            switch (selectedOption) {
                case 0: // Echo
                    req.cmd = 0x00;
                    strcpy(req.data, "Test Message");
                    api_process(&req, &res);
                    printf("\n\nResult: %s\n", res.data);
                    printf("Press B to continue...\n");
                    while (!(hidKeysDown() & KEY_B)) {
                        hidScanInput();
                        gfxFlushBuffers();
                        gfxSwapBuffers();
                        gspWaitForVBlank();
                    }
                    break;
                    
                case 1: // Version
                    req.cmd = 0x01;
                    api_process(&req, &res);
                    printf("\n\n%s\n", res.data);
                    printf("Press B to continue...\n");
                    while (!(hidKeysDown() & KEY_B)) {
                        hidScanInput();
                        gfxFlushBuffers();
                        gfxSwapBuffers();
                        gspWaitForVBlank();
                    }
                    break;
                    
                case 2: // System Info
                    req.cmd = 0x02;
                    api_process(&req, &res);
                    printf("\n\n%s\n", res.data);
                    printf("Press B to continue...\n");
                    while (!(hidKeysDown() & KEY_B)) {
                        hidScanInput();
                        gfxFlushBuffers();
                        gfxSwapBuffers();
                        gspWaitForVBlank();
                    }
                    break;
                    
                case 3: // Exit
                    goto cleanup;
            }
        }
        
        if (kDown & KEY_START) {
            break;
        }
        
        gfxFlushBuffers();
        gfxSwapBuffers();
        gspWaitForVBlank();
    }
    
cleanup:
    api_shutdown();
    gfxExit();
    return 0;
}
```

---

## Example 4: Adding Custom API Commands

### Step 1: Update api.h

```c
// Add new command codes
#define API_CMD_ECHO         0x00
#define API_CMD_VERSION      0x01
#define API_CMD_SYSINFO      0x02
#define API_CMD_ADD_NUMBERS  0x10  // New command
#define API_CMD_GET_RANDOM   0x11  // New command
```

### Step 2: Update api.c

```c
api_status_t api_process(api_request_t *req, api_response_t *res)
{
    if (!req || !res)
        return API_INVALID_PARAM;
    
    if (!api_initialized)
        return API_ERROR;
    
    memset(res, 0, sizeof(api_response_t));
    
    switch (req->cmd)
    {
        case 0x00: // Echo command
            snprintf(res->data, sizeof(res->data), "Echo: %s", req->data);
            res->status = API_SUCCESS;
            break;
        
        case 0x01: // Get version
            res->result = API_VERSION;
            snprintf(res->data, sizeof(res->data), "Version: 0x%08X", API_VERSION);
            res->status = API_SUCCESS;
            break;
        
        case 0x02: // Get system info
            snprintf(res->data, sizeof(res->data), "3DS System Ready");
            res->status = API_SUCCESS;
            break;
        
        case 0x10: // Add two numbers (NEW)
            res->result = req->param1 + req->param2;
            snprintf(res->data, sizeof(res->data), 
                    "%u + %u = %u", req->param1, req->param2, res->result);
            res->status = API_SUCCESS;
            break;
        
        case 0x11: // Get random number (NEW)
            res->result = rand() % 100;
            snprintf(res->data, sizeof(res->data), "Random: %u", res->result);
            res->status = API_SUCCESS;
            break;
        
        default:
            snprintf(res->data, sizeof(res->data), 
                    "Unknown command: 0x%02X", req->cmd);
            res->status = API_ERROR;
            break;
    }
    
    return res->status;
}
```

### Step 3: Use in main.c

```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <3ds.h>
#include "api.h"

int main(int argc, char* argv[])
{
    gfxInitDefault();
    consoleInit(GFX_TOP, NULL);
    
    srand(time(NULL)); // Initialize random
    api_init();
    
    printf("Custom API Commands Demo\n");
    printf("========================\n\n");
    
    // Test addition
    api_request_t req = {0};
    api_response_t res = {0};
    
    req.cmd = 0x10;
    req.param1 = 42;
    req.param2 = 58;
    
    if (api_process(&req, &res) == API_SUCCESS) {
        printf("Addition: %s\n", res.data);
        printf("Result: %u\n\n", res.result);
    }
    
    // Test random number
    req.cmd = 0x11;
    
    if (api_process(&req, &res) == API_SUCCESS) {
        printf("Random: %s\n", res.data);
        printf("Number: %u\n\n", res.result);
    }
    
    printf("Press START to exit.\n");
    
    while (aptMainLoop())
    {
        hidScanInput();
        if (hidKeysDown() & KEY_START)
            break;
        
        gfxFlushBuffers();
        gfxSwapBuffers();
        gspWaitForVBlank();
    }
    
    api_shutdown();
    gfxExit();
    return 0;
}
```

---

## Example 5: Real-Time Button Display

```c
#include <stdio.h>
#include <3ds.h>
#include "api.h"

int main(int argc, char* argv[])
{
    gfxInitDefault();
    consoleInit(GFX_TOP, NULL);
    
    api_init();
    
    printf("Button Press Monitor\n");
    printf("====================\n\n");
    printf("API: %s\n\n", api_get_status());
    
    while (aptMainLoop())
    {
        hidScanInput();
        u32 kDown = hidKeysDown();
        u32 kHeld = hidKeysHeld();
        
        printf("\x1b[5;0H"); // Move to line 5
        printf("Buttons Held:                    \n");
        
        if (kHeld & KEY_A) printf("  [A] ");
        if (kHeld & KEY_B) printf("  [B] ");
        if (kHeld & KEY_X) printf("  [X] ");
        if (kHeld & KEY_Y) printf("  [Y] ");
        if (kHeld & KEY_L) printf("  [L] ");
        if (kHeld & KEY_R) printf("  [R] ");
        if (kHeld & KEY_START) printf("  [START] ");
        if (kHeld & KEY_SELECT) printf("  [SELECT] ");
        
        printf("\n\n");
        
        // Process button press through API
        if (kDown & KEY_A) {
            api_request_t req = {0};
            api_response_t res = {0};
            req.cmd = 0x00;
            sprintf(req.data, "Button A pressed!");
            api_process(&req, &res);
            printf("API: %s              \n", res.data);
        }
        
        if (kDown & KEY_START)
            break;
        
        gfxFlushBuffers();
        gfxSwapBuffers();
        gspWaitForVBlank();
    }
    
    api_shutdown();
    gfxExit();
    return 0;
}
```

---

## API Best Practices

### 1. Always Initialize
```c
if (api_init() != API_SUCCESS) {
    printf("API init failed!\n");
    return -1;
}
```

### 2. Check Return Values
```c
api_status_t status = api_process(&req, &res);
if (status != API_SUCCESS) {
    printf("Error: %d\n", status);
    // Handle error
}
```

### 3. Always Cleanup
```c
// At app exit
api_shutdown();
gfxExit();
```

### 4. Zero Initialize Structures
```c
api_request_t req = {0};  // Good!
api_response_t res = {0}; // Good!

// Not: api_request_t req; // Uninitialized!
```

### 5. Check Buffer Sizes
```c
// Don't overflow buffers
strncpy(req.data, user_input, sizeof(req.data) - 1);
req.data[sizeof(req.data) - 1] = '\0';
```

---

## Common API Patterns

### Request-Response Pattern
```c
api_request_t req = {0};
api_response_t res = {0};

req.cmd = YOUR_COMMAND;
req.param1 = value1;
req.param2 = value2;
strcpy(req.data, "additional data");

if (api_process(&req, &res) == API_SUCCESS) {
    // Use res.result and res.data
}
```

### Status Checking Pattern
```c
if (!api_initialized) {
    printf("API not initialized!\n");
    return API_ERROR;
}

const char* status = api_get_status();
if (strcmp(status, "Running") != 0) {
    printf("API not running: %s\n", status);
}
```

---

## Building and Running Examples

1. **Copy example code to your project's main.c**
2. **Build**: Press `Ctrl+B` in the IDE
3. **Deploy**: Press `Ctrl+F5` or use Deploy button
4. **Test on 3DS XL**

---

## Extending the API

Want to add more features? Here's the workflow:

1. **Add command codes** in `api.h`
2. **Implement handlers** in `api.c` (api_process function)
3. **Use in your app** by creating requests with the new commands
4. **Build and test**

The API system is designed to be extensible and easy to modify for your specific needs!

---

## Need More Help?

- Check [USAGE_GUIDE.md](USAGE_GUIDE.md) for general IDE usage
- See the template files for working examples
- Visit 3DBrew wiki for 3DS-specific APIs

Happy coding! 🎮
