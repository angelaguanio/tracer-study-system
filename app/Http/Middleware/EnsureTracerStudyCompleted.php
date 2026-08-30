<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Survey;

class EnsureTracerStudyCompleted
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check() && auth()->user()->isAlumna()) {
            
            // Check if there is an active tracer study
            $activeTracer = Survey::where('is_tracer_study', true)
                                  ->where('status', 'active')
                                  ->first();

            if ($activeTracer) {
                // Check if user has submitted a response
                $hasCompleted = auth()->user()->responses()
                                      ->where('survey_id', $activeTracer->id)
                                      ->exists();

                if (!$hasCompleted) {
                    
                    // Allowed routes to prevent infinite loop
                    $allowedRoutes = [
                        'alumna.questionnaire', 
                        'alumna.start-survey', 
                        'alumna.surveys.show', 
                        'alumna.surveys.submit', 
                        'alumna.surveys.draft',
                        'alumna.logout'
                    ];

                    $currentRoute = $request->route() ? $request->route()->getName() : '';

                    if (!in_array($currentRoute, $allowedRoutes)) {
                        // Redirect to the questionnaire page with a warning
                        return redirect()->route('alumna.questionnaire', ['tab' => 'tracer-study'])
                                         ->with('warning', 'You must complete the active Tracer Study Survey before accessing the rest of the portal.');
                    }
                }
            }
        }

        return $next($request);
    }
}
