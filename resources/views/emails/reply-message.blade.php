<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Thanks for Contacting Us</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f9f9f9;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            background: #ffffff;
            padding: 20px;
            margin: auto;
            border-radius: 8px;
        }
        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #777;
            text-align: center;
        }
    </style>
</head>
<body>
<div class="container">
    <h2>Hello {{ $name }},</h2>

    <div>
        {!! $messageContent !!}
    </div>

    <p>Best regards,<br> {{ $organization->name }} Team</p>

    <div class="footer">
        <img src="{{ asset($organization->logo) }}" width="100" alt="Logo"><br>
        &copy; {{ date('Y') }} {{ $organization->name }}. All rights reserved.<br>
        {{ $organization->address1 }}, {{ $organization->city }}, {{ $organization->country }}
    </div>
</div>
</body>
</html>
