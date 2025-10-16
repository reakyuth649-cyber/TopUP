$bot='8236704467:AAE1KkjkI2nNR7ToO0_eX2zT8K0pGmqicgY'
$chat='-1003171078801'
$text='Test message from Local Dev Server'
Invoke-RestMethod -Method Post -Uri ("https://api.telegram.org/bot$bot/sendMessage") -Body @{ chat_id = $chat; text = $text } | ConvertTo-Json
