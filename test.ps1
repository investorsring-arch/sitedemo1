$body = @{
    message = "Bonjour, que pouvez-vous faire ?"
    channel = "web"
} | ConvertTo-Json

$response = Invoke-WebRequest `
    -Uri "http://localhost:3000/api/chat" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body

Write-Host $response.Content$body = @{
    message = "Bonjour, que pouvez-vous faire ?"
    channel = "web"
} | ConvertTo-Json

$response = Invoke-WebRequest `
    -Uri "http://localhost:3000/api/chat" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body

Write-Host $response.Content
