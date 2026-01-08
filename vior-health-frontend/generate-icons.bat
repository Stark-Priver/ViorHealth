@echo off
echo ============================================
echo ViorHealth Icon Generator
echo ============================================
echo.
echo This script requires ImageMagick to convert SVG to ICO
echo.
echo Please install ImageMagick from: https://imagemagick.org/script/download.php
echo Or use an online converter: https://www.icoconverter.com/
echo.
echo Converting icon.svg to icon.png...

REM Try to use ImageMagick if available
where magick >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    magick convert -background none -resize 512x512 public\icon.svg public\icon.png
    echo PNG created successfully!
    echo.
    echo Now converting to ICO format...
    magick convert public\icon.png -define icon:auto-resize=256,128,96,64,48,32,16 build\icon.ico
    echo ICO created successfully!
    echo.
    echo Icon files created:
    echo - public\icon.png
    echo - build\icon.ico
) else (
    echo ImageMagick not found!
    echo.
    echo Please either:
    echo 1. Install ImageMagick and run this script again
    echo 2. Use an online converter:
    echo    - Go to https://www.icoconverter.com/
    echo    - Upload public\icon.svg
    echo    - Download as ICO format
    echo    - Save to build\icon.ico
)

echo.
pause
