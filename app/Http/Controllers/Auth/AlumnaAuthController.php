<?php

namespace App\Http\Controllers\Auth;
use Inertia\Inertia; 
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Employment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Response;

class AlumnaAuthController extends Controller
{

    //assign role
    public function roles(): Response {
        $user_role = 'alumna';

        return Inertia::render('Auth/AlumnaSignup',[
            'initialRole' => $user_role
        ]);
    }


    //validate signup form
    public function signupAlumna(Request $request) {
        $validation = $request->validate([
            'last_name' => 'required|string|max:255',
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'year_graduated' => 'nullable|integer|between:2018,2022',
            'courses' => 'nullable|string|in:BSCpE,BSECE,BSIT',

            'currently_employed' => 'required|in:Yes,No',

            'employment_type' => 'required_if:currently_employed,Yes|nullable|string|in:Permanent/Regular,Probationary',
            'company_name' => 'required_if:currently_employed,Yes|nullable|string|max:255',
            'position' => 'required_if:currently_employed,Yes|nullable|string|max:255',
            'location' => 'required_if:currently_employed,Yes|nullable|string|max:255',
            'monthly_salary' => ['nullable', 'numeric'],

            'unemployment_reason' => 'required_if:currently_employed,No|nullable|string|max:255',
        ]);

        //pass hashing shi
        $validation['password'] = Hash::make($validation['password']);
        //sets role to alumna
        $validation['user_role'] = 'alumna';

        //create user in da table
        $user = User::create([
        'last_name' => $validation['last_name'],
        'first_name' => $validation['first_name'],
        'middle_name' => $validation['middle_name'] ?? null,
        'email' => $validation['email'],
        'password' => $validation['password'],
        'year_graduated' => $validation['year_graduated'] ?? null,
        'courses' => $validation['courses'] ?? null,
        'user_role' => 'alumna',
    ]);

        Employment::create([
        'user_id' => $user->id,
        'currently_employed' => $validation['currently_employed'],
        'employment_type' => $validation['currently_employed'] === 'Yes' ? $validation['employment_type'] : null,
        'company_name' => $validation['currently_employed'] === 'Yes' ? $validation['company_name'] : null,
        'position' => $validation['currently_employed'] === 'Yes' ? $validation['position'] : null,
        'location' => $validation['currently_employed'] === 'Yes' ? $validation['location'] : null,
        'monthly_salary' => $validation['currently_employed'] === 'Yes' ? ($validation['monthly_salary'] ?? null) : null,
        'unemployment_reason' => $validation['currently_employed'] === 'No' ? $validation['unemployment_reason'] : null,
    ]);

        //logs the user after sign up
        Auth::login($user);
        
        return back()->with('success', 'Account created successfully!');
   }

   //render login page
    public function showLogin () {
        return Inertia::render('Auth/AlumnaLogin');
    }

    //login validation
    public function loginAlumna(Request $request) {
        $credentials = $request->validate([
            'email'=>'required|email',
            'password'=>'required|string',
        ]);

        //check if user is trying to login
        if(Auth::attempt($credentials)) {

            $request->session()->regenerate();
            //check role if u alumna
            if(Auth::user()->user_role === 'alumna') { 
                return redirect()->intended(route('alumna.home'));
            }

            //if not alumna, logout agad
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            
            //error message lang
            throw ValidationException::withMessages([
                'email' => 'Access denied. You do not have alumna privileges.',
            ]);
        };

        throw ValidationException::withMessages([
            'credentials'=>'The username or password is incorrect.'
        ]);

    }
   

    public function logoutAlumna(Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('role.select');
    }

}
