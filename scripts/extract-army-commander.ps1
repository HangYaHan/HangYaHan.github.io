# extract-army-commander.ps1
# One-off: slice Eagle (co_eagle+alt) face frames and copy flag/avatar to the blog.
# ASCII-only on purpose.

Add-Type -AssemblyName System.Drawing

$cwRoot = "D:\Code\Commander_Wars"
$facePath = Join-Path $cwRoot "resources\images\co\ge\co_eagle+alt+face.png"
$miniPath = Join-Path $cwRoot "resources\images\co\ge\co_eagle+alt+mini.png"
$flagPath = Join-Path $cwRoot "resources\images\game\ge.png"
$iconPath = Join-Path $cwRoot "resources\images\game\icon_ge.png"

$outDir = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot "..\static\pics\army\commander"))
$flagDir = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot "..\static\pics\army"))
if (-not (Test-Path -LiteralPath $outDir)) { New-Item -ItemType Directory -Path $outDir -Force | Out-Null }

# face sheet 144x48 -> 3 frames of 48x48
$face = [System.Drawing.Bitmap]::FromFile($facePath)
$fw = [int]($face.Width / 3)
$fh = $face.Height
Write-Output ("face frame: " + $fw + "x" + $fh)
$names = @("eagle_1", "eagle_2", "eagle_3")
for ($i = 0; $i -lt 3; $i++) {
    $bmp = New-Object System.Drawing.Bitmap($fw, $fh)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $fw, $fh)
    $srcRect = New-Object System.Drawing.Rectangle(($i * $fw), 0, $fw, $fh)
    $g.DrawImage($face, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    $bmp.Save((Join-Path $outDir ($names[$i] + ".png")), [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
}
$face.Dispose()

# mini avatar + flag
Copy-Item -LiteralPath $miniPath -Destination (Join-Path $outDir "eagle_mini.png") -Force
Copy-Item -LiteralPath $flagPath -Destination (Join-Path $flagDir "flag_ge.png") -Force
Copy-Item -LiteralPath $iconPath -Destination (Join-Path $flagDir "flag_ge_small.png") -Force

Write-Output "commander assets written."
Get-ChildItem -LiteralPath $outDir | Select-Object -ExpandProperty Name
