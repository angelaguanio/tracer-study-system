
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; background: #f4f4f4; padding: 40px 0;">
  <div style="max-width: 560px; margin: auto; background: white; border-radius: 10px; padding: 32px;">
    
    <h2 style="color: #1e3a5f;">You have a new reply</h2>
    <p style="color: #555;">Hi {{ $reply->inquiry->alumni->first_name }},</p>
    <p style="color: #555;">
      Someone replied to your inquiry: <strong>{{ $reply->inquiry->subject }}</strong>
    </p>

    <div style="background: #f0f4ff; border-left: 4px solid #2563eb; padding: 16px; border-radius: 6px; margin: 24px 0;">
      <p style="margin: 0; color: #333;">{{ $reply->message }}</p>
    </div>

    <a href="{{ route('alumna.inquiries.index', ['open' => $reply->inquiry_id]) }}"
       style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500;">
      View Full Conversation
    </a>

    <p style="color: #aaa; font-size: 12px; margin-top: 32px;">
      You received this because you submitted an inquiry on Alumni Connect.
    </p>
  </div>
</body>
</html>