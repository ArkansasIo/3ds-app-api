# 3DS Homebrew API Template (CFW / FBI-ready)

A complete 3DS homebrew template for developing Custom Firmware-compatible applications with API functionality, optimized for 3DS XL with touchscreen support.

## Requirements

- **devkitARM** properly installed and configured
- **libctru** - 3DS C library
- 3DS console with Custom Firmware (CFW) like Luma3DS, etc.

## Project Structure

```
3ds-homebrew-template/
├── Makefile              # Build configuration
├── include/              # Header files
│   └── api.h            # API interface
├── source/              # Source code
│   ├── main.c           # Main entry point
│   └── api.c            # API implementation
└── data/                # Data files (if needed)
```

## Building

### Prerequisites Setup

```bash
# Ensure DEVKITARM environment variable is set
export DEVKITARM=/path/to/devkitARM

# Verify ctrulib is installed
echo $CTRULIB
```

### Build Commands

```bash
# Build the project
make

# Clean build files
make clean

# Rebuild everything
make clean && make
```

### Output

- `3ds-homebrew-template.elf` - ELF binary
- `3ds-homebrew-template.3dsx` - 3DS executable (for Homebrew Menu)

## Installation

1. Copy the `.3dsx` file to your 3DS SD card:
   ```
   SD:/3ds/3ds-homebrew-template/3ds-homebrew-template.3dsx
   ```

2. Launch from Homebrew Menu on your 3DS

### FBI Notes (CFW)

- This template builds a `.3dsx` homebrew app.
- Install/use FBI on your CFW 3DS XL as usual, then place this app in the Homebrew path:
    - `SD:/3ds/3ds-homebrew-template/3ds-homebrew-template.3dsx`
- Launch it from Homebrew Launcher.

## Controls

- **A Button** - Send API request
- **B Button** - Check API status
- **Touchscreen** - Shows touch coordinates on the lower screen
- **START** - Exit to Homebrew Menu

## API Features

- Request/Response based architecture
- Command processing system
- Version management
- Status monitoring
- Network-ready (socket support)

## API Commands

| Command | Code | Description |
|---------|------|-------------|
| Echo    | 0x00 | Echo back data |
| Version | 0x01 | Get API version |
| Info    | 0x02 | Get system info |

## Development

### Adding New API Commands

1. Add command ID to `api.h`
2. Implement handler in `api_process()` function in `api.c`
3. Rebuild with `make`

### Example Custom Command

```c
case 0x03: // Custom command
    snprintf(res->data, sizeof(res->data), "Custom: %d", req->param1);
    res->status = API_SUCCESS;
    break;
```

## Debugging

Use appropriate debugging tools:
- Citra emulator with debugging enabled
- 3dbrew documentation
- ctrulib examples

## License

Public Domain - Modify and distribute freely

## References

- [devkitPro](https://devkitpro.org/)
- [ctrulib](https://github.com/devkitPro/libctru)
- [3DBrew](https://3dbrew.org/)
- [3DS Homebrew](https://gbatemp.net/threads/3ds-homebrew-development.212324/)
