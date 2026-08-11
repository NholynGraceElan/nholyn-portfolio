Add-Type -AssemblyName System.Drawing

$src = "C:\Users\estil\AppData\Local\Temp\opencode\creative-portfolio-extract\CREATIVE PORTFOLIO"
$pub = "C:\Users\estil\Agent Workspace\nholyn-portfolio\client\public"

# Lookbook in source order (file names are the guide: 1 .. 22)
$lookbook = @(
  @{ out = "lookbook-01.jpg"; src = "1.png"  },
  @{ out = "lookbook-02.jpg"; src = "2.png"  },
  @{ out = "lookbook-03.jpg"; src = "3.png"  },
  @{ out = "lookbook-04.jpg"; src = "4.png"  },
  @{ out = "lookbook-05.jpg"; src = "5.png"  },
  @{ out = "lookbook-06.jpg"; src = "6.png"  },
  @{ out = "lookbook-07.jpg"; src = "7.png"  },
  @{ out = "lookbook-08.jpg"; src = "8.png"  },
  @{ out = "lookbook-09.jpg"; src = "9.png"  },
  @{ out = "lookbook-10.jpg"; src = "10.png" },
  @{ out = "lookbook-11.jpg"; src = "11.png" },
  @{ out = "lookbook-12.jpg"; src = "12.png" },
  @{ out = "lookbook-13.jpg"; src = "13.png" },
  @{ out = "lookbook-14.jpg"; src = "14.png" },
  @{ out = "lookbook-15.jpg"; src = "15.png" },
  @{ out = "lookbook-16.jpg"; src = "16.png" },
  @{ out = "lookbook-17.jpg"; src = "17.png" },
  @{ out = "lookbook-18.jpg"; src = "18.png" },
  @{ out = "lookbook-19.jpg"; src = "19.png" },
  @{ out = "lookbook-20.jpg"; src = "20.png" },
  @{ out = "lookbook-21.jpg"; src = "21.png" },
  @{ out = "lookbook-22.jpg"; src = "22.png" }
)

$projects = @(
  @{ out = "find-folds-brand-kit.jpg"; src = "Find & Folds Brand Kit.png" },
  @{ out = "find-folds-logo.jpg";      src = "Find & Folds Logo.png" },
  @{ out = "find-folds-paper-bag.jpg"; src = "Find & Folds Paper Bag.png" },
  @{ out = "find-folds-street.jpg";    src = "Find & Folds Street.png" },
  @{ out = "bread-studio-logo.jpg";    src = "Black and White Typographic Bread Design Studio Logo.png" },
  @{ out = "donut-1.jpg";              src = "Nholyn Donut 1.png" },
  @{ out = "donut-2.jpg";              src = "Nholyn Donut 2.png" },
  @{ out = "donut-3.jpg";              src = "Nholyn Donut 3.png" },
  @{ out = "magazine-cover.jpg";       src = "JEAN MARA ANDOY MAGAZINE COVER..png" },
  @{ out = "book-page.jpg";            src = "Nholyn Book Page.jpe" },
  @{ out = "lookbook-cover.jpg";       src = "Single Lookbook Cover.jpg" },
  @{ out = "andy-mc.jpg";              src = "Andy MC 1.png" },
  @{ out = "king-mark-mc.jpg";         src = "King Mark MC 1.png" },
  @{ out = "rico-mc.jpg";              src = "Rico MC 1.png" },
  @{ out = "mark-anthony-mc.jpg";    src = "Tonton MC 1.png" },
  @{ out = "second-mc.jpg";            src = "Nholyn Second MC.png" },
  @{ out = "third-mc.jpg";             src = "Nholyn Third MC.png" }
)

$portraits = @(
  @{ out = "official.jpg";   src = "Nholyn Official Photo.jpe" },
  @{ out = "photoshoot.jpg"; src = "Nholyn Photoshoot.png" },
  @{ out = "barbie.jpg";     src = "Nholyn Barbie Pesturized Photo.png" }
)

function Convert-ToJpeg {
  param([string]$SrcPath, [string]$OutPath, [int]$MaxDim = 1400, [int]$Quality = 82)
  $img = [System.Drawing.Image]::FromFile($SrcPath)
  $w = $img.Width; $h = $img.Height
  if ($w -gt $MaxDim -or $h -gt $MaxDim) {
    $ratio = [math]::Min($MaxDim / $w, $MaxDim / $h)
    $nw = [int]($w * $ratio); $nh = [int]($h * $ratio)
  } else { $nw = $w; $nh = $h }
  $bmp = New-Object System.Drawing.Bitmap($nw, $nh)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.Clear([System.Drawing.ColorTranslator]::FromHtml("#FDF3E6"))
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.DrawImage($img, 0, 0, $nw, $nh)
  $g.Dispose()
  $enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
  $ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, $Quality)
  $bmp.Save($OutPath, $enc, $ep)
  $bmp.Dispose(); $img.Dispose()
}

$manifest = @()
foreach ($m in $lookbook) {
  $srcPath = Join-Path $src $m.src
  $outPath = Join-Path "$pub\lookbook" $m.out
  Convert-ToJpeg -SrcPath $srcPath -OutPath $outPath
  $manifest += "/lookbook/$($m.out)"
  Write-Output "OK lookbook -> $($m.out)"
}
foreach ($m in $projects) {
  $srcPath = Join-Path $src $m.src
  $outPath = Join-Path "$pub\projects" $m.out
  Convert-ToJpeg -SrcPath $srcPath -OutPath $outPath
  $manifest += "/projects/$($m.out)"
  Write-Output "OK projects -> $($m.out)"
}
foreach ($m in $portraits) {
  $srcPath = Join-Path $src $m.src
  $outPath = Join-Path "$pub\portraits" $m.out
  Convert-ToJpeg -SrcPath $srcPath -OutPath $outPath
  $manifest += "/portraits/$($m.out)"
  Write-Output "OK portraits -> $($m.out)"
}

$json = @{ lookbook = $manifest[0..21]; projects = $manifest[22..39]; portraits = $manifest[40..42] } | ConvertTo-Json
$json | Out-File -FilePath "C:\Users\estil\Agent Workspace\nholyn-portfolio\client\public\manifest.json" -Encoding utf8
Write-Output "Manifest written with $($manifest.Count) images"
