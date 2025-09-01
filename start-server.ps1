Write-Host "Iniciando servidor web simple en http://localhost:8000"
Write-Host "Presiona Ctrl+C para detener el servidor"
Write-Host ""

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8000/")
$listener.Start()

$webRoot = $PSScriptRoot

Write-Host "Servidor iniciado - abre http://localhost:8000/preview.html en tu navegador"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $localPath = Join-Path $webRoot ($request.Url.LocalPath -replace "/","\" -replace "^\\","")
        
        if ($request.Url.LocalPath -eq "/") {
            $localPath = Join-Path $webRoot "preview.html"
        }
        
        $extension = [System.IO.Path]::GetExtension($localPath)
        
        if (Test-Path -Path $localPath -PathType Leaf) {
            $content = [System.IO.File]::ReadAllBytes($localPath)
            $response.ContentLength64 = $content.Length
            
            switch ($extension) {
                ".html" { $response.ContentType = "text/html" }
                ".css" { $response.ContentType = "text/css" }
                ".js" { $response.ContentType = "application/javascript" }
                ".json" { $response.ContentType = "application/json" }
                ".png" { $response.ContentType = "image/png" }
                ".jpg" { $response.ContentType = "image/jpeg" }
                ".svg" { $response.ContentType = "image/svg+xml" }
                ".woff2" { $response.ContentType = "font/woff2" }
                default { $response.ContentType = "application/octet-stream" }
            }
            
            $output = $response.OutputStream
            $output.Write($content, 0, $content.Length)
            $output.Close()
        }
        else {
            $response.StatusCode = 404
            $response.Close()
        }
    }
}
finally {
    $listener.Stop()
}
