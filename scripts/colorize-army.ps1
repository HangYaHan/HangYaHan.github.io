# colorize-army.ps1
# One-off: recolor Commander Wars unit masks per nation and crop frame 0.
# Pipeline (from system/frac_matrix_shader.glsl):
#   outRGB = LUT[ mask.R , mask.G ] ; outA = mask.A
# LUT = <CW>/resources/images/colortables/<nation>.png (256x256)
# Overworld unit sheets are 128x32 with cols=4 -> frame0 = (0,0,w/4,h).
# Nations: os = orange star (main / red), ge = green earth, yc = yellow comet, bm = blue moon.
# ASCII-only on purpose (PowerShell 5.1 reads .ps1 as ANSI).

Add-Type -AssemblyName System.Drawing

$cwRoot   = "D:\Code\Commander_Wars"
$unitsDir = Join-Path $cwRoot "resources\images\units"
$ctDir    = Join-Path $cwRoot "resources\images\colortables"
$outRoot  = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot "..\static\army\units"))

$nations = [ordered]@{
    "os" = "orange_star.png"
    "ge" = "green_earth.png"
    "yc" = "yellow_comet.png"
    "bm" = "blue_moon.png"
}

# name -> source mask (relative to unitsDir)
$sources = [ordered]@{
    "infantry"    = "infantry\infantry+os+mask.png"
    "mech"        = "mech\mech+os+mask.png"
    "motorbike"   = "motorbike\motorbike+os+mask.png"
    "sniper"      = "sniper\sniper+os+mask.png"
    "commando"    = "co_infantry\commando+mask.png"
    "partisan"    = "co_infantry\partisan+mask.png"
    "ranger"      = "co_infantry\ranger+mask.png"
    "recon"       = "ground\recon+mask.png"
    "apc"         = "ground\apc+mask.png"
    "artillery"   = "ground\artillery+mask.png"
    "antitank"    = "ground\antitankcannon+mask.png"
    "flak"        = "ground\flak+mask.png"
    "missile"     = "ground\missile+mask.png"
    "rocket"      = "ground\rocketthrower+mask.png"
    "light_tank"  = "ground\light_tank+mask.png"
    "heavy_tank"  = "ground\heavy_tank+mask.png"
    "neotank"     = "ground\neotank+mask.png"
    "megatank"    = "ground\megatank+mask.png"
    "piperunner"  = "ground\piperunner+mask.png"
    "bomber"      = "air\bomber+mask.png"
    "fighter"     = "air\fighter+mask.png"
    "stealth"     = "air\stealthbomber+mask.png"
    "duster"      = "air\duster+mask.png"
    "k_heli"      = "air\k_heli+mask.png"
    "t_heli"      = "air\t_heli+mask.png"
    "transport"   = "air\transportplane+mask.png"
    "black_bomb"  = "air\black_bomb+mask.png"
    "battleship"  = "sea\battleship+mask.png"
    "cruiser"     = "sea\cruiser+mask.png"
    "destroyer"   = "sea\destroyer+mask.png"
    "frigate"     = "sea\frigate+mask.png"
    "submarine"   = "sea\submarine+mask.png"
    "carrier"     = "sea\aircraftcarrier+mask.png"
    "lander"      = "sea\lander+mask.png"
    "gunboat"     = "sea\gunboat+mask.png"
    "missileboat" = "sea\missileboat+mask.png"
    "hovercraft"  = "hovercraft\hovercraft+mask.png"
}

foreach ($nation in $nations.Keys) {
    $lutPath = Join-Path $ctDir $nations[$nation]
    $outDir  = Join-Path $outRoot $nation
    if (-not (Test-Path -LiteralPath $outDir)) { New-Item -ItemType Directory -Path $outDir -Force | Out-Null }

    $lut = [System.Drawing.Bitmap]::FromFile($lutPath)
    $ok = 0; $skip = 0

    foreach ($name in $sources.Keys) {
        $srcPath = Join-Path $unitsDir $sources[$name]
        if (-not (Test-Path -LiteralPath $srcPath)) { $skip++; continue }

        $srcBmp = [System.Drawing.Bitmap]::FromFile($srcPath)
        $frameW = [int]($srcBmp.Width / 4)
        $frameH = $srcBmp.Height
        $dstBmp = New-Object System.Drawing.Bitmap($frameW, $frameH)

        for ($y = 0; $y -lt $frameH; $y++) {
            for ($x = 0; $x -lt $frameW; $x++) {
                $p = $srcBmp.GetPixel($x, $y)
                if ($p.A -eq 0) { $dstBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0)); continue }
                $c = $lut.GetPixel($p.R, $p.G)
                $a = $p.A
                if ($c.A -eq 0) { $a = 0 }
                $dstBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($a, $c.R, $c.G, $c.B))
            }
        }

        $dstBmp.Save((Join-Path $outDir ($name + ".png")), [System.Drawing.Imaging.ImageFormat]::Png)
        $dstBmp.Dispose(); $srcBmp.Dispose()
        $ok++
    }
    $lut.Dispose()
    Write-Output ("nation " + $nation + ": generated=" + $ok + " skipped=" + $skip)
}
Write-Output ("output root: " + $outRoot)
