# 3DS Project Template

A complete Makefile and project structure for use with the 3DS ASM/C IDE.

## File: `Makefile`

Use this in your 3DS project root:

```makefile
#---------------------------------------------------------------------------------
.SUFFIXES:
#---------------------------------------------------------------------------------

ifeq ($(strip $(DEVKITARM)),)
$(error "Please set DEVKITARM in your environment. export DEVKITARM=<path to>devkitARM")
endif

TOPDIR ?= $(CURDIR)
include $(DEVKITARM)/3ds_rules

#---------------------------------------------------------------------------------
TARGET		:=	$(notdir $(CURDIR))
BUILD		:=	build
SOURCES		:=	source
DATA		:=	data
INCLUDES	:=	include
SPECS		:=	$(DEVKITARM)/arm-none-eabi/lib

#---------------------------------------------------------------------------------
ARCH	:=	-march=armv6k -mtune=mpcore -mfloat-abi=hard -mtp=soft

CFLAGS	:=	-g -Wall -O2 -mword-relocations \
			-fomit-frame-pointer -ffast-math \
			$(ARCH)

CFLAGS	+=	$(INCLUDE) -DARM11 -D_3DS

CXXFLAGS	:= $(CFLAGS) -fno-rtti -fno-exceptions -std=gnu++11

ASFLAGS	:=	-g $(ARCH)
LDFLAGS	=	-specs=$(SPECS)/3dsx.specs -g $(ARCH) -Wl,-Map,$(notdir $*.map)

LIBS	:= -lctru -lm

#---------------------------------------------------------------------------------
LIBDIRS	:= $(CTRULIB)

#---------------------------------------------------------------------------------

ifneq ($(BUILD),$(notdir $(CURDIR)))

export OUTPUT	:=	$(CURDIR)/$(TARGET)
export TOPDIR	:=	$(CURDIR)

export VPATH	:=	$(foreach dir,$(SOURCES),$(CURDIR)/$(dir)) \
			$(foreach dir,$(DATA),$(CURDIR)/$(dir))

export DEPSDIR	:=	$(CURDIR)/$(BUILD)

CFILES		:=	$(foreach dir,$(SOURCES),$(notdir $(wildcard $(dir)/*.c)))
CPPFILES	:=	$(foreach dir,$(SOURCES),$(notdir $(wildcard $(dir)/*.cpp)))
SFILES		:=	$(foreach dir,$(SOURCES),$(notdir $(wildcard $(dir)/*.s)))
BINFILES	:=	$(foreach dir,$(DATA),$(notdir $(wildcard $(dir)/*.*)))

ifeq ($(strip $(CPPFILES)),)
	LD	:=	$(CC)
else
	LD	:=	$(CXX)
endif

export OFILES_BIN	:=	$(addsuffix .o,$(BINFILES))
export OFILES_SOURCES := $(CFILES:.c=.o) $(CPPFILES:.cpp=.o) $(SFILES:.s=.o)
export OFILES := $(OFILES_BIN) $(OFILES_SOURCES)

export HFILES := $(addsuffix .h,$(subst .,_,$(BINFILES)))

.PHONY: all clean

all: $(BUILD) $(OUTPUT).3dsx

$(BUILD):
	@mkdir -p $@

clean:
	@echo clean ...
	@rm -fr $(BUILD) $(OUTPUT).elf $(OUTPUT).3dsx

#---------------------------------------------------------------------------------
else

#---------------------------------------------------------------------------------
$(OUTPUT).3dsx	:	$(OUTPUT).elf

$(OUTPUT).elf	:	$(OFILES)

%.bin.o	:	%.bin
	@echo $(notdir $<)
	@$(bin2o)

-include $(DEPSDIR)/*.d

#---------------------------------------------------------------------------------------
endif
#---------------------------------------------------------------------------------------
```

## Project Structure

```
MyProject/
├── Makefile                # Build configuration
├── include/
│   ├── main.h             # Main header
│   └── config.h           # Configuration
├── source/
│   ├── main.c             # Entry point
│   ├── api.c              # API implementation
│   ├── utils.c            # Utilities
│   └── startup.s          # Assembly startup
└── data/
    └── sprites.bin        # Game assets
```

## Building

### Basic Build
```bash
make
```

Generates:
- `MyProject.elf` - ELF executable
- `MyProject.3dsx` - 3DS format

### Clean and Rebuild
```bash
make clean
make
```

### Release Build
```bash
make CFLAGS="-O3 -march=armv6k"
```

## 3DS Entry Point Example

File: `source/main.c`

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <3ds.h>

#define SCREEN_WIDTH  320
#define SCREEN_HEIGHT 240

int main(int argc, char* argv[])
{
    // Initialize graphics
    gfxInitDefault();
    
    // Initialize console on top screen
    consoleInit(GFX_TOP, NULL);
    
    // Clear screens and print welcome
    printf("\x1b[2;0H");
    printf("3DS Homebrew Application\n");
    printf("========================\n\n");
    
    // Main loop
    while (aptMainLoop())
    {
        // Scan for input
        hidScanInput();
        u32 kDown = hidKeysDown();
        
        // Check for START button
        if (kDown & KEY_START)
            break; // Exit to Homebrew Menu
        
        // Your game logic here
        printf("Press START to exit\n");
        
        // Flush frame buffers and swap
        gfxFlushBuffers();
        gfxSwapBuffers();
        
        // Wait for vertical blank
        gspWaitForVBlank();
    }
    
    // Cleanup
    gfxExit();
    return 0;
}
```

## Assembly Startup Example

File: `source/startup.s`

```asm
.arm
.align 2

.global _start
_start:
    ldr sp, =0x08000000    @ Set stack pointer
    bl main                @ Branch to main
    
    @ Loop forever
_loop:
    b _loop

.section .bss
    .align 4
    .space 0x1000          @ 4KB stack
```

## Key Points

1. **devkitARM**: Must be installed and DEVKITARM set
2. **libctru**: Provides 3DS system calls
3. **Makefile**: Use devkit rules - don't modify unnecessarily
4. **Output Format**: 3DSX format for Homebrew Menu
5. **Entry Point**: main() function

## Compilation Flags

| Flag | Purpose |
|------|---------|
| `-march=armv6k` | ARMv6K architecture |
| `-O2` / `-O3` | Optimization level |
| `-Wall` | Show all warnings |
| `-DARM11` | 3DS processor define |
| `-D_3DS` | 3DS platform define |

## Testing

### On Citra Emulator
```bash
# Build
make

# Run on Citra
citra ./MyProject.3dsx
```

### On 3DS Console
1. Copy `MyProject.3dsx` to `SD:/3ds/MyProject/`
2. Launch from Homebrew Menu
3. Use CFW console (Luma3DS, etc.)

## Troubleshooting

### Linker Error
- Check Makefile for typos
- Verify DEVKITARM path
- Ensure libctru installed

### Build Fails
```bash
# Clean everything
make clean

# Rebuild with verbose output
make V=1
```

### Can't Find 3ds.h
- DEVKITARM not set correctly
- libctru not installed
- Wrong devkitARM version

---

Ready to build 3DS apps! 🎮
