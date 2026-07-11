@component('mail::message')
# {{ $subject }}

@foreach(explode("\n", $body) as $line)
{{ $line }}

@endforeach

@component('mail::panel')
@if($senderType === 'admin')
This email was sent by the **Alumni Affairs Office** through the **Graduate Access and Tracking Environment (GATE)**.
@else
This email was sent by the **CECT Alumni Coordinator** through the **Graduate Access and Tracking Environment (GATE)**.
@endif

For questions or concerns regarding this message, please contact the appropriate office.
@endcomponent

Sincerely,

@if($senderType === 'admin')
**Alumni Affairs Office**
@else
**CECT Alumni Coordinator**
@endif

**Graduate Access and Tracking Environment (GATE)**  
Wesleyan University-Philippines

---

<sub>
© {{ date('Y') }} GATE • Wesleyan University-Philippines. All rights reserved.
</sub>

@endcomponent