# Tiny static file server for the portfolio. No installs needed.
# Run:  powershell -ExecutionPolicy Bypass -File serve.ps1   (or double-click start.cmd)
param([int]$Port = 5173)

$root = (Resolve-Path (Split-Path -Parent $MyInvocation.MyCommand.Path)).Path
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
$Host.UI.RawUI.WindowTitle = "Portfolio server - http://localhost:$Port"
Write-Host "Serving $root"
Write-Host "Open http://localhost:$Port  (close this window or press Ctrl+C to stop)"

$mime = @{
  '.html' = 'text/html; charset=utf-8'; '.css' = 'text/css; charset=utf-8'; '.js' = 'text/javascript; charset=utf-8'
  '.json' = 'application/json'; '.svg' = 'image/svg+xml'; '.png' = 'image/png'; '.jpg' = 'image/jpeg'; '.jpeg' = 'image/jpeg'
  '.webp' = 'image/webp'; '.gif' = 'image/gif'; '.avif' = 'image/avif'; '.ico' = 'image/x-icon'; '.pdf' = 'application/pdf'
  '.woff2' = 'font/woff2'; '.mp4' = 'video/mp4'; '.webm' = 'video/webm'; '.txt' = 'text/plain; charset=utf-8'
}

try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $res = $ctx.Response
    try {
      $rel = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath).TrimStart('/')
      if ($rel -eq '') { $rel = 'index.html' }
      $file = [IO.Path]::GetFullPath((Join-Path $root $rel))
      if (-not $file.StartsWith($root, [StringComparison]::OrdinalIgnoreCase)) {
        $res.StatusCode = 403
      } else {
        if (Test-Path $file -PathType Container) { $file = Join-Path $file 'index.html' }
        if (Test-Path $file -PathType Leaf) {
          $bytes = [IO.File]::ReadAllBytes($file)
          $ext = [IO.Path]::GetExtension($file).ToLower()
          $res.ContentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' }
          $res.Headers['Cache-Control'] = 'no-cache'
          $res.ContentLength64 = $bytes.Length
          $res.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
          $res.StatusCode = 404
          $msg = [Text.Encoding]::UTF8.GetBytes('404 Not found')
          $res.OutputStream.Write($msg, 0, $msg.Length)
        }
      }
      Write-Host ("{0} {1} {2}" -f $res.StatusCode, $ctx.Request.HttpMethod, $ctx.Request.Url.AbsolutePath)
    } catch {
      Write-Host "Error: $_"
    } finally {
      $res.Close()
    }
  }
} finally {
  $listener.Stop()
}
