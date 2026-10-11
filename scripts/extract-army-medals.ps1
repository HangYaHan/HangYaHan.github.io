# extract-army-medals.ps1
# One-off: slice the colored power-star strip into individual 8x8 stars for medals.
# source: resources/images/game/powerstarfull.png (104x8 => 13 stars of 8x8)
# ASCII-only on purpose.

Add-Type -AssemblyName System.Drawing

$cwRoot = "D:\Code\Commander_Wars"
$strip  = Join-Path $cwRoot "resources\images\game\powerstarfull.png"
$outDir = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot "..\static\army\medals"))
if (-not (Test-Path -LiteralPath $outDir)) { New-Item -ItemType Directory -Path $outDir -Force | Out-Null }

$img = [System.Drawing.Bitmap]::FromFile($strip)
$star = $img.Height
$count = [int]($img.Width / $star)
Write-Output ("strip " + $img.Width + "x" + $img.Height + " => " + $count + " stars")

$take = 13
for ($i = 0; $i -lt $take -and $i -lt $count; $i++) {
    $bmp = New-Object System.Drawing.Bitmap($star, $star)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.DrawImage($img,
        (New-Object System.Drawing.Rectangle(0, 0, $star, $star)),
        (New-Object System.Drawing.Rectangle(($i * $star), 0, $star, $star)),
        [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    $bmp.Save((Join-Path $outDir ("star_" + ($i + 1) + ".png")), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
}
$img.Dispose()
Write-Output "medal stars written."
