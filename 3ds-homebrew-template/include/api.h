#ifndef API_H
#define API_H

#include <stdint.h>

// API Status codes
typedef enum {
	API_SUCCESS = 0,
	API_ERROR = -1,
	API_TIMEOUT = -2,
	API_INVALID_PARAM = -3
} api_status_t;

// API Request structure
typedef struct {
	uint32_t cmd;
	uint32_t param1;
	uint32_t param2;
	char data[256];
} api_request_t;

// API Response structure
typedef struct {
	uint32_t status;
	uint32_t result;
	char data[512];
} api_response_t;

// Touchscreen input structure
#ifdef ENABLE_TOUCHSCREEN
typedef struct {
	uint16_t x;
	uint16_t y;
	uint32_t timestamp;
} api_touch_input_t;
#endif

// Function declarations
api_status_t api_init(void);
void api_shutdown(void);
api_status_t api_process(api_request_t *req, api_response_t *res);
const char* api_get_status(void);
api_status_t api_get_version(uint32_t *version);

#ifdef ENABLE_TOUCHSCREEN
api_status_t api_get_touch_input(api_touch_input_t *touch);
api_status_t api_is_touch_valid(void);
#endif

#endif // API_H
