# extract-army-commanders.ps1
# One-off: slice CO face sheets (3 frames) + mini + nation flags into the blog.
# Eagle alt (ge), Sonja alt2 (yc), Sasha alt (bm).
# ASCII-only on purpose.

Add-Type -AssemblyName System.Drawing

$cwRoot = "D:\Code\Commander_Wars"
$coImg  = Join-Path $cwRoot "resources\images\co"
$gmImg  = Join-Path $cwRoot "resources\images\game"

$cmdDir  = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot "..\static\army\commanders"))
$flagDir = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot "..\static\army\flags"))
foreach ($d in @($cmdDir, $flagDir)) { if (-not (Test-Path -LiteralPath $d)) { New-Item -ItemType Directory -Path $d -Force | Out-Null } }

# key -> face sheet + mini
$commanders = [ordered]@{
    "eagle" = @{ face = (Join-Path $coImg "ge\co_eagle+alt+face.png");  mini = (Join-Path $coImg "ge\co_eagle+alt+mini.png") }
    "sonja" = @{ face = (Join-Path $coImg "yc\co_sonja+alt2+face.png"); mini = (Join-Path $coImg "yc\co_sonja+alt2+mini.png") }
    "sasha" = @{ face = (Join-Path $coImg "bm\co_sasha+alt+face.png");  mini = (Join-Path $coImg "bm\co_sasha+alt+mini.png") }
}

foreach ($key in $commanders.Keys) {
    $face = [System.Drawing.Bitmap]::FromFile($commanders[$key].face)
    $fw = [int]($face.Width / 3)
    $fh = $face.Height
    for ($i = 0; $i -lt 3; $i++) {
        $bmp = New-Object System.Drawing.Bitmap($fw, $fh)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.DrawImage($face,
            (New-Object System.Drawing.Rectangle(0, 0, $fw, $fh)),
            (New-Object System.Drawing.Rectangle(($i * $fw), 0, $fw, $fh)),
            [System.Drawing.GraphicsUnit]::Pixel)
        $g.Dispose()
        $bmp.Save((Join-Path $cmdDir ($key + "_" + ($i + 1) + ".png")), [System.Drawing.Imaging.ImageFormat]::Png)
        $bmp.Dispose()
    }
    $face.Dispose()
    Copy-Item -LiteralPath $commanders[$key].mini -Destination (Join-Path $cmdDir ($key + "_mini.png")) -Force
    Write-Output ("commander " + $key + " -> " + $fw + "x" + $fh)
}

# nation flags
$flags = @{
    "ge" = "ge.png"; "yc" = "yc.png"; "bm" = "bm.png"
}
foreach ($n in $flags.Keys) {
    Copy-Item -LiteralPath (Join-Path $gmImg $flags[$n]) -Destination (Join-Path $flagDir ($n + ".png")) -Force
    $icon = Join-Path $gmImg ("icon_" + $n + ".png")
    if (Test-Path -LiteralPath $icon) { Copy-Item -LiteralPath $icon -Destination (Join-Path $flagDir ($n + "_small.png")) -Force }
}
Write-Output "flags written."
