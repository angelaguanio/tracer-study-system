<h2>Welcome to GATE</h2>

<p>Hello {{ $coordinator->first_name }},</p>

<p>Your Alumni Coordinator account has been created.</p>

<p><strong>Email:</strong> {{ $coordinator->email }}</p>

<p><strong>Temporary Password:</strong></p>

<h3>{{ $password }}</h3>

<p>You will be required to change your password upon your first login.</p>

<p>Thank you.</p>