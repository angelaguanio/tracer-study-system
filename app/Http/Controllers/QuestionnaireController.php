<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class QuestionnaireController extends Controller
{
    public function showQuestionnaire() 
    {
        return Inertia::render('Alumna/AlumnaQuestionnaire');
    }

    public function btnStartSurvey() 
    {
        return Inertia::render('Alumna/Survey');
    }

}
