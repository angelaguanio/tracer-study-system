@component('mail::message')
# {{ $subject }}

@foreach(explode("\n", $body) as $line)
{{ $line }}

@endforeach

@component('mail::panel')
This message was sent by the **Alumni Affairs Office** of {{ config('app.name') }}.
@endcomponent

Thanks,
**{{ config('app.name') }}**
@endcomponent
