#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <3ds.h>

#include "api.h"

int main(int argc, char* argv[])
{
	// Initialize console with dual screen support for 3DS XL
	gfxInitDefault();
	PrintConsole topScreen;
	PrintConsole bottomScreen;
	consoleInit(GFX_TOP, &topScreen);
	consoleInit(GFX_BOTTOM, &bottomScreen);
	consoleSelect(&topScreen);
	
	// Initialize touchscreen
#ifdef ENABLE_TOUCHSCREEN
	hidSetRepeatParameters(1, 8);
#endif
	
	// Initialize API
	api_init();
	
	printf("\x1b[2;0H");
	printf("3DS API App - CFW Compatible\n");
	printf("============================\n\n");
	
	// Main application loop
	while (aptMainLoop())
	{
		hidScanInput();
		u32 kDown = hidKeysDown();
		
#ifdef ENABLE_TOUCHSCREEN
		touchPosition touch;
		hidTouchRead(&touch);
#endif
		
		// Handle button presses
		if (kDown & KEY_START)
			break; // Exit to Homebrew Menu
		
		if (kDown & KEY_A)
		{
			printf("\x1b[3;0H");
			printf("Processing API Request...\n");
			api_request_t req = {0};
			api_response_t res = {0};
			
			if (api_process(&req, &res) == API_SUCCESS)
			{
				printf("Response: %s\n", res.data);
			}
		}
		
		if (kDown & KEY_B)
		{
			printf("\x1b[3;0H");
			printf("API Status: %s\n", api_get_status());
		}
		
#ifdef ENABLE_TOUCHSCREEN
		if (touch.px > 0 || touch.py > 0)
		{
			consoleSelect(&bottomScreen);
			printf("\x1b[2;0H");
			printf("Touch Input - X: %d, Y: %d     ", touch.px, touch.py);
			consoleSelect(&topScreen);
		}
#endif
		
		// Flush and swap buffers
		gfxFlushBuffers();
		gfxSwapBuffers();
		gspWaitForVBlank();
	}
	
	// Cleanup
	api_shutdown();
	gfxExit();
	return 0;
}
